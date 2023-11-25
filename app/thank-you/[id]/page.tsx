import {Metadata} from "next";
import ThankYouPageWrapper from "@/components/thankYouPageWrapper";

export default function BoundlessCheckoutPage() {
	return (
		<div className={'container'}>
			<ThankYouPageWrapper />
		</div>
	);
}

export const metadata: Metadata = {
	robots: 'noindex',
	title: 'Thank you for your order!'
}
