import {ICartItem, IItemsQty} from 'boundless-api-client';
import {Dispatch, SetStateAction, useCallback} from 'react';

import {useCart} from 'boundless-commerce-components/dist/client';
import {useFormatCurrency,IBasicSettings} from 'boundless-commerce-components';
import clsx from 'clsx';
import CartRow from '@/components/cart/cartBody/cartItems/cartRow';
import _debounce from 'lodash/debounce';
import {apiClient} from '@/lib/api';
import CartTotalRow from '@/components/cart/cartBody/cartTotalRow';

export default function CartItems({items, setItems, settings, className}: ICartItemsProps) {
	const {changeQty, rmItem} = useCartManager({setItems});

	return (
		<div className={clsx(className)}>
			<div className='d-none d-md-flex row fw-bold mb-2'>
				<div className='text-center col-md-4'></div>
				<div className='text-center col-md-2'>Price</div>
				<div className='text-center col-md-3'>Qty</div>
				<div className='text-center col-md-2'>Total</div>
				<div className='text-center col-md-1'></div>
			</div>
			{items.map(item =>
				<CartRow
					key={item.item_id}
					item={item}
					rmItem={rmItem.bind(null, item.item_id)}
					onQtyChange={changeQty.bind(null, item.item_id)}
					settings={settings}
				/>
			)}
			<CartTotalRow items={items} settings={settings} />
		</div>
	);
}

const useCartManager = ({setItems}: Pick<ICartItemsProps, 'setItems'>) => {
	const {cartId} = useCart();

	//eslint-disable-next-line
	const saveQty = useCallback(_debounce((items: IItemsQty[]) => {
		if (!cartId) {
			throw new Error('Cant process - cartId is empty');
		}

		apiClient.cart.setCartItemsQty(cartId, items)
			.catch(e => console.error('Err on cart update:', e))
		;
	}, 700), [cartId]);

	const changeQty = useCallback((itemId: number, qty: number) => {
		setItems(prev => {
			if (isNaN(qty)) {
				qty = 0;
			} else if (qty < 0) {
				qty = Math.abs(qty);
			} else if (qty == 0) {
				qty = 1;
			}

			const out = [...prev!];
			const index = out.findIndex(el => el.item_id === itemId);
			if (index >= 0) {
				out[index].qty = qty;
			}

			const items:IItemsQty[] = out.map(({qty, item_id}) => ({item_id, qty}));
			saveQty(items);

			return out;
		});


	}, [setItems, saveQty]);

	const rmItem = useCallback((itemId: number) => {
		if (!cartId) {
			throw new Error('Cant process rmItem - cartId is empty');
		}

		if (!confirm('Are you sure?')) return;

		setItems(prevItems => prevItems!.filter(el => el.item_id !== itemId));
		apiClient.cart.removeFromCart(cartId, [itemId]);
	}, [cartId, setItems]);

	return {
		changeQty,
		rmItem
	};
};

interface ICartItemsProps {
	items: ICartItem[];
	setItems: Dispatch<SetStateAction<ICartItem[]|undefined>>;
	settings: IBasicSettings;
	className?: string;
}
