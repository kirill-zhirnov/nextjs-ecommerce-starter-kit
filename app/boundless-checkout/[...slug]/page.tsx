import {Metadata} from 'next';
import BoundlessCheckout from '@/components/checkout/boundlessCheckout';

export default function BoundlessCheckoutPage() {
	return (
		<BoundlessCheckout />
	);
}

export const metadata: Metadata = {
	robots: 'noindex'
};
