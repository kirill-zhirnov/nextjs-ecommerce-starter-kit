import {Metadata} from "next";
import StripeCheckout from "@/components/checkout/stripe/checkout";

export default function StripeCheckoutPage() {
	return (
		<StripeCheckout />
	);
}

export const metadata: Metadata = {
	robots: 'noindex'
}
