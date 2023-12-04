import {ICartItem} from 'boundless-api-client';
import {useFormatCurrency,IBasicSettings} from 'boundless-commerce-components';
import {useMemo} from 'react';
import clsx from 'clsx';
import styles from '@/components/cart/cartBody/cartItems/cartItems.module.css';
import currency from 'currency.js';

export default function CartTotalRow({items, settings}: {items: ICartItem[], settings: IBasicSettings}) {
	const {formatCurrency} = useFormatCurrency({settings});

	const {qty, price} = useMemo(() => {
		let qty = 0, price = '0';
		for (const item of items) {
			qty += item.qty;

			price = currency(price).add(
				currency(item.itemPrice.final_price || 0).multiply(item.qty)
			).toString();
		}

		return {qty, price};
	}, [items]);

	return (
		<div className='fw-bold row mb-2'>
			<div className={clsx('col-md-6 py-2', styles.colCenteredRightMd)}>Order Total:</div>
			<div className={clsx('col-md-3 py-2', styles.colCenteredMd)}>
				<span className='d-md-none'>Qty: </span>
				{qty}
			</div>
			<div className={clsx('col-md-2 py-2', styles.colCenteredMd)}>
				<span className='d-md-none'>Price: </span>
				{price && formatCurrency(price)}
			</div>
			<div className={'col-md-1'} />
		</div>
	);
}
