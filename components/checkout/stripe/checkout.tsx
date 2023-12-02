'use client';

import {useCart} from 'boundless-commerce-components/dist/client';
import {useState, useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout
} from '@stripe/react-stripe-js';
import LoadingScreen from '@/components/loadingScreen';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeCheckout() {
	const {cartId} = useCart();
	const [clientSecret, setClientSecret] = useState<string|undefined>();

	useEffect(() => {
		if (cartId) {
			fetch('/api/stripe-checkout', {
				method: 'POST',
				cache: 'no-cache',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({cartId})
			})
				.then((res) => res.json())
				.then((data) => setClientSecret(data.clientSecret));
		}
	}, [cartId]);

	if (!clientSecret) {
		return <LoadingScreen />;
	}

	return (
		<div id="checkout">
			<EmbeddedCheckoutProvider
				stripe={stripePromise}
				options={{clientSecret}}
			>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</div>
	);
}
