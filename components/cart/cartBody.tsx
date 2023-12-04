'use client';

import {useState, useEffect, useCallback} from 'react';
import CartLoader from '@/components/cart/cartLoader';
import {useCart} from 'boundless-commerce-components/dist/client';
import {ICartItem} from 'boundless-api-client';
import {apiClient} from '@/lib/api';
import EmptyCart from '@/components/cart/cartBody/emptyCart';
import {IBasicSettings} from 'boundless-commerce-components';
import CartItems from '@/components/cart/cartBody/cartItems';
import CheckoutButtons from '@/components/cart/cartBody/checkoutButtons';

export default function CartBody({settings}: {settings: IBasicSettings}) {
	const {cartId} = useCart();
	const {items, isLoading, setItems} = useFetchCartItems();

	if (!cartId || isLoading || !items) {
		return <CartLoader />;
	}

	if (items.length == 0) {
		return <EmptyCart />;
	}

	return (
		<div className={'mx-auto'} style={{maxWidth: '900px'}}>
			<CartItems
				settings={settings}
				items={items}
				setItems={setItems}
				className={'mb-5'}
			/>
			<CheckoutButtons />
		</div>
	);
}

const useFetchCartItems = () => {
	const {cartId} = useCart();
	const [items, setItems] = useState<ICartItem[]|undefined>();
	const [isLoading, setIsLoading] = useState(false);

	const fetchCartItems = useCallback(() => {
		if (!cartId) {
			throw new Error('Attempt to fetch with empty cartId. If it is loaded?');
		}

		setIsLoading(true);
		apiClient.cart.getCartItems(cartId)
			.then(({cart, items}) => {
				setItems(items);
			})
			.catch((err) => console.error(err))
			.finally(() => setIsLoading(false));
	}, [cartId]);

	useEffect(() => {
		if (cartId && !items) {
			fetchCartItems();
		}
	}, [cartId]);//eslint-disable-line

	return {
		items,
		setItems,
		isLoading,
		fetchCartItems
	};
};
