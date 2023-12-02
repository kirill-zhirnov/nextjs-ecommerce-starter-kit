import {Metadata} from 'next';
import StripeCheckout from '@/components/checkout/stripe/checkout';

export default function StripeCheckoutPage() {
	return (
		<div className={'container'}>
			<StripeCheckout />
		</div>
	);
}

export const metadata: Metadata = {
	robots: 'noindex',
	title: 'Stripe Checkout'
};
