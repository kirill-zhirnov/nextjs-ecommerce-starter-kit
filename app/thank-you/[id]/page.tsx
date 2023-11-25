import {Metadata} from "next";
import ThankYouPageBody from "@/components/thankYouPageBody";

export default function BoundlessCheckoutPage() {
	return (
		<div className={'container'}>
			<ThankYouPageBody />
		</div>
	);
}

export const metadata: Metadata = {
	robots: 'noindex',
	title: 'Thank you for your order!'
}
