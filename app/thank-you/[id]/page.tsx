import {Metadata} from 'next';
import ThankYou from '@/components/thankYou';

export default function ThankYouPage() {
	return (
		<div className={'container'}>
			<ThankYou />
		</div>
	);
}

export const metadata: Metadata = {
	robots: 'noindex',
	title: 'Thank you for your order!'
};
