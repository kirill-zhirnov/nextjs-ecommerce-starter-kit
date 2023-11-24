import {ICartItem} from 'boundless-api-client';
import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from 'react';
import {useFormatCurrency} from 'boundless-commerce-components';
import {useCart} from 'boundless-commerce-components/dist/cart';
import {IBasicSettings} from 'boundless-commerce-components';
import styles from './cartItems/CartItems.module.css';
import clsx from 'clsx';

export default function CartItems({items, setItems, settings}: ICartItemsProps) {
	const {cartId, total} = useCart();
	const {formatCurrency} = useFormatCurrency({settings});

	return (
		<div className={''}>
			<div className='d-none d-md-flex row'>
				<div className='text-center col-md-4'></div>
				<div className='text-center col-md-2'>Price</div>
				<div className='text-center col-md-3'>Qty</div>
				<div className='text-center col-md-2'>Total</div>
				<div className='text-center col-md-1'></div>
			</div>
			{/*{items.map(item => (*/}
			{/*	<CartRow*/}
			{/*		item={item}*/}
			{/*		rmItem={() => rmItem(item.item_id)} key={item.item_id}*/}
			{/*		onQtyChange={(qty: number) => onQtyChange(item.item_id, qty)}*/}
			{/*	/>*/}
			{/*))}*/}
			<div className='cart-items__total-row row'>
				<div className='cart-items__total-cell cart-items__total-cell_title col-md-6'>Order Total:</div>
				<div className='cart-items__total-cell col-md-3'>
					<span className='cart-items__label'>Qty: </span>
					{total?.qty}
				</div>
				<div className='cart-items__total-cell col-md-2'>
					<span className='cart-items__label'>Price: </span>
					{total?.total && formatCurrency(total.total)}
				</div>
			</div>
		</div>
	);
}

interface ICartItemsProps {
	items: ICartItem[];
	setItems: Dispatch<SetStateAction<ICartItem[]|undefined>>;
	settings: IBasicSettings;
}
