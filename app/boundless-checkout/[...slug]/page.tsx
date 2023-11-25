import {Metadata} from "next";
import BoundlessCheckoutBody from "@/components/checkout/boundlessCheckoutBody";

export default function BoundlessCheckoutPage() {
	return (
		<BoundlessCheckoutBody />
	);
}

export const metadata: Metadata = {
	robots: 'noindex'
}
