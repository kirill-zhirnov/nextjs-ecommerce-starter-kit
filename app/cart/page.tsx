import {Metadata} from 'next';
import CartPageBody from '@/components/cart/cartPageBody';
import {fetchBasicSettings} from '@/lib/settings';

export default async function CartPage() {
	const settings = await fetchBasicSettings();

	return (
		<div className={'container'}>
			<h1 className={'mb-4'}>Cart page</h1>
			<CartPageBody settings={settings} />
		</div>
	);
}

export const metadata: Metadata = {
	title: 'Cart'
};
