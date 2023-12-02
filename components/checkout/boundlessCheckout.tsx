'use client';

import {useCart} from 'boundless-commerce-components/dist/client';
import CircularProgress from '@mui/material/CircularProgress';
import {useCallback, useRef} from 'react';
import {startCheckout, StarterWrapper, resetCheckoutState} from 'boundless-checkout-react';
import {apiClient} from '@/lib/api';
import {createGetStr} from 'boundless-api-client';
// import {useRouter} from 'next/navigation'

export default function BoundlessCheckout() {
	const {cartId} = useCart();
	const checkoutStarter = useRef<StarterWrapper>();
	// const router = useRouter();

	const checkoutRef = useCallback((node: HTMLDivElement) => {
		if (node && cartId) {
			checkoutStarter.current = startCheckout(node, {
				api: apiClient,
				cartId,
				onHide: (element: string, error?: string) => {
					resetCheckoutState();
					if (element === 'backToCart') {
						const query: {error?: string} = {};
						if (error) {
							query.error = error;
						}

						window.location.assign(`/cart?${createGetStr(query)}`);
					} else if (element === 'logo') {
						window.location.assign('/');
					} else {
						console.log('unknown element: ', element);
					}
				},
				onThankYouPage: (data) => {
					resetCheckoutState();
					window.location.assign(`/thank-you/${data.orderId}`);
				},
				basename: '/boundless-checkout',
			});
		}
	}, [cartId]);

	if (!cartId) {
		return <CircularProgress />;
	}

	return (
		<div>
			<div ref={checkoutRef}></div>
		</div>
	);
}
