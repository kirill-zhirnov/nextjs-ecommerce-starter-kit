import {Metadata} from 'next';
import MyOrders from '@/components/myOrders';
import {fetchBasicSettings} from '@/lib/settings';

export default async function MyOrdersPage() {
	const settings = await fetchBasicSettings();

	return (
		<MyOrders settings={settings} />
	);
}

export const metadata: Metadata = {
	title: 'My Orders',
	robots: 'noindex',
};

