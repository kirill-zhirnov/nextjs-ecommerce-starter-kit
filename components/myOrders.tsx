'use client';

import {useCustomer} from 'boundless-commerce-components/dist/client';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import LoadingScreen from '@/components/loadingScreen';
import {apiClient} from '@/lib/api';
import {IAdminOrderInList} from 'boundless-api-client';
import Button from '@mui/material/Button';
import Link from 'next/link';
import {IBasicSettings, useFormatCurrency} from 'boundless-commerce-components';

export default function MyOrders({settings}: {settings: IBasicSettings}) {
	const [orders, setOrders] = useState<IAdminOrderInList[]|undefined>();
	const {customer, customerIsInited} = useCustomer();
	const router = useRouter();
	const {formatCurrency} = useFormatCurrency({settings});

	useEffect(() => {
		if (customerIsInited && !customer) {
			router.push('/');
		}
	}, [customerIsInited, customer, router]);

	useEffect(() => {
		if (customer) {
			apiClient.customerOrder.getOrders().then(({orders}) => {
				setOrders(orders);
			});
		}
	}, [customer]);

	if (!customerIsInited || !orders) {
		return <LoadingScreen />;
	}

	return (
		<div className={'container'}>
			<h1 className={'mb-3'}>My orders</h1>
			<div className={'row'}>
				<div className={'col-lg-6 offset-lg-3'}>
					<table className={'table table-striped'}>
						<thead>
						<tr>
							<th scope="col">Order Id</th>
							<th scope="col">Status</th>
							<th scope="col">Total</th>
							<th scope="col"></th>
						</tr>
						</thead>
						<tbody>
						{orders.map((order) => (
							<tr key={order.order_id}>
								<td>{order.order_id}</td>
								<td>{order.status?.title}</td>
								<td>{order.total_price && formatCurrency(order.total_price)}</td>
								<td>
									<Button
										component={Link}
										href={`/thank-you/${order.id}`}
									>
										Details
									</Button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
