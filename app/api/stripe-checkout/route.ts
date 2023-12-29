import {NextResponse, NextRequest} from 'next/server';
import {makeApiClient} from '@/lib/serverApi';
import {fetchBasicSettings} from '@/lib/settings';
import Stripe from 'stripe';
import {BoundlessClient, TThumbRatio, ICustomer} from 'boundless-api-client';

const CUSTOMER_COOKIE_NAME = 'boundless_customer_auth';

export async function POST (request: NextRequest) {
	const data = await request.json();

	//create the new instance on each request to have clear state (auth token, etc)
	const apiClient = makeApiClient();

	if (!data.cartId) {
		return new NextResponse(null, { status: 400, statusText: 'CartId is empty'});
	}

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

	//bind draft order to the cart:
	const {data: {order: {id: order_id}}} = await apiClient.createRequest().post('/orders/checkout/init', {cart_id: data.cartId});

	const {line_items} = await makeLineItems(apiClient, data.cartId);
	const {isLoggedIn, customer} = await tryToFetchCustomerByCookie(request, apiClient);

	const stripeSessParams: Stripe.Checkout.SessionCreateParams = {
		ui_mode: 'embedded',
		line_items,
		mode: 'payment' as Stripe.Checkout.SessionCreateParams.Mode,
		client_reference_id: order_id,
		return_url: `${request.nextUrl.origin}/stripe/return?session_id={CHECKOUT_SESSION_ID}`
	};

	if (isLoggedIn) {
		//you can also specify the customer's phone, address, etc: https://stripe.com/docs/api/checkout/sessions/create
		Object.assign(stripeSessParams, {
			customer_email: customer!.email
		});
	}

	const session = await stripe.checkout.sessions.create(stripeSessParams);

	return NextResponse.json({clientSecret: session.client_secret}, {status: 200});
}

export async function GET (request: NextRequest) {
	const sessionId = request.nextUrl.searchParams.get('session_id');
	if (!sessionId) {
		return new NextResponse(null, { status: 400, statusText: 'sessionId is empty'});
	}

	//create the new instance on each request to have clear state (auth token, etc)
	const apiClient = makeApiClient();

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
	const {client_reference_id, status, customer_details} = await stripe.checkout.sessions.retrieve(sessionId);

	const order = await apiClient.customerOrder.getOrder(client_reference_id as string);
	let isSuccess = order.publishing_status == 'published';

	if (order.publishing_status == 'draft' && status == 'complete') {
		const {isLoggedIn} = await tryToFetchCustomerByCookie(request, apiClient);

		const contact = {};
		const data = {
			place_the_order: true
		};

		if (isLoggedIn) {
			Object.assign(data, {customer_id: 'me'});
		}

		if (customer_details?.email) {
			Object.assign(contact, {email: customer_details?.email});
		}

		if (customer_details?.name) {
			Object.assign(contact, {first_name: customer_details?.name});
		}

		if (Object.keys(contact).length > 0) {
			Object.assign(data, {contact});
		}

		//place the order
		await apiClient.createRequest().patch(`/orders/checkout/${order.id}/order`, data);

		//method available only for token with management rights:
		apiClient.setAuthToken(process.env.BOUNDLESS_MANAGEMENT_TOKEN as string);
		await apiClient.adminOrder.updateOrder(order.id, {is_paid: true});

		isSuccess = true;
	}

	return NextResponse.json({isSuccess, orderId: order?.id}, {
		status: 200
	});
}

const tryToFetchCustomerByCookie = async (request: NextRequest, apiClient: BoundlessClient) => {
	const authToken  = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;

	if (authToken) {
		try {
			const {data} = await apiClient
				.setCustomerAuthToken(authToken)
				.createRequest().get<ICustomer>('/user/customer/private/who-am-i')
			;

			if (data) {
				return {isLoggedIn: true, authToken, customer: data};
			}
		} catch (e) {
			//do nothing
		}
	}

	return {isLoggedIn: false};
};

const makeLineItems = async (apiClient: BoundlessClient, cartId: string) => {
	const {items} = await apiClient.cart.getCartItems(cartId);

	const settings = await fetchBasicSettings();
	const currency = settings['system.currency'].alias.toUpperCase();

	const line_items = [];
	for (const item of items) {
		const unit_amount = item.itemPrice.final_price ? parseInt(String(Number(item.itemPrice.final_price) * 100)) : 0;
		const {product, variant, image} = item.vwItem;

		let name = product.title;
		let SKU = product.sku;
		let description = '';
		const images: string[] = [];

		if (product.has_variants && variant) {
			name += ' ' + variant.title;

			if (variant.sku) {
				SKU = variant.sku;
			}
		}

		if (SKU) {
			description = `SKU: ${SKU}`;
		}

		if (image?.path) {
			images.push(
				apiClient
					.makeThumb({imgLocalPath: image.path, maxSize: 200})
					.setRatio(TThumbRatio['1-1'])
					.setPad(true)
					.getSrc()
			);
		}

		const product_data = {name};
		if (description) {
			Object.assign(product_data, {description});
		}

		if (images.length > 0) {
			Object.assign(product_data, {images});
		}

		line_items.push({
			price_data: {
				currency,
				product_data,
				unit_amount
			},
			quantity: item.qty,
		});
	}

	return {line_items};
};
