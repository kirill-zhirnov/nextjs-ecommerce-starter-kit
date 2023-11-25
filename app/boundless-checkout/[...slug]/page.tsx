import {Metadata} from "next";
import BoundlessCheckoutWrapper from "@/components/boundlessCheckoutWrapper";

export default function BoundlessCheckoutPage() {
	return (
		<BoundlessCheckoutWrapper />
	);
}

export const metadata: Metadata = {
	robots: 'noindex'
}
