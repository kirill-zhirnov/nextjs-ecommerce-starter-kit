import {Metadata} from 'next';
import StripeReturn from '@/components/checkout/stripe/return';

export default function StripeReturnPage() {
	return (
		<StripeReturn />
	);
}

export const metadata: Metadata = {
	robots: 'noindex'
};
