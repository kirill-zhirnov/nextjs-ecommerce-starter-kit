'use client';

import Fab from '@mui/material/Fab';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styles from './fab/Fab.module.css';
import clsx from 'clsx';
import {useCart} from 'boundless-commerce-components/dist/client';
import Link from 'next/link';

export default function CartFAB() {
	const {cartId, total} = useCart();

	if (!cartId) {
		return null;
	}

	return (
		<div className={clsx(styles.root)}>
			<div className={clsx(styles.qty, {
				[styles.qty_active]: (total && total.qty > 0)
			})}>
				{total && total.qty}
			</div>
			<Fab
				component={Link}
				href={'/cart'}
				color="primary"
			>
				<ShoppingCartIcon />
			</Fab>
		</div>
	);
}
