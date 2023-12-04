import Link from 'next/link';
import {ICartItem,TThumbRatio} from 'boundless-api-client';
import {useFormatCurrency,IBasicSettings,NoImage,ImgThumb} from 'boundless-commerce-components';

import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import {apiClient} from '@/lib/api';
import currency from 'currency.js';
import styles from './cartItems.module.css';
import clsx from 'clsx';

export default function CartRow({item, rmItem, onQtyChange, settings}: ICartRowProps) {
	const {product, image, variant} = item.vwItem;
	const {formatCurrency} = useFormatCurrency({settings});
	const productUrl = `/products/${product.url_key || product.product_id}`;

	return (
		<div className={clsx('row', styles.itemRow)}>
			<div className='col-md-4 d-flex align-items-start py-2'>
				<Link href={productUrl} className={styles.imgLink}>
					{image
						? <ImgThumb image={image} maxSize={200} apiClient={apiClient}/>
						: <NoImage ratio={TThumbRatio['1-1']} xs/>
					}
				</Link>
				<div className='cart-item__title'>
					<div>
						<Link href={productUrl}>
							{product?.title || ''}
						</Link>
					</div>
					{item.vwItem.type === 'variant' && <div className='text-muted'>{variant?.title || ''}</div>}
				</div>
			</div>
			<div className={clsx('col-md-2 py-2', styles.colCenteredMd)}>
				<span className='d-md-none'><strong>Price: </strong></span>
				{item.itemPrice.final_price && <>{formatCurrency(item.itemPrice.final_price)}</>}
			</div>
			<div className={clsx('col-md-3 py-2', styles.colCenteredMd)}>
				<span className='d-md-none'><strong>Qty: </strong></span>
				<div className={styles.qtyInputCol}>
					<IconButton size={'small'}
											disabled={item.qty <= 1}
											onClick={() => onQtyChange(item.qty - 1)}
					>
						<RemoveCircleOutlineIcon/>
					</IconButton>
					<TextField
						size={'small'}
						name={`qty[${item.item_id}]`}
						inputProps={{
							min: 1,
							className: 'text-center'
						}}
						type={'number'}
						value={item.qty}
						onChange={(e) => onQtyChange(parseInt(e.target.value))}
						className={styles.qtyInput}
					/>
					<IconButton size={'small'}
											onClick={() => onQtyChange(item.qty + 1)}
					>
						<AddCircleOutlineIcon/>
					</IconButton>
				</div>
			</div>
			<div className={clsx('col-md-2 py-2', styles.colCenteredMd)}>
				<span className='d-md-none'><strong>Total: </strong></span>
				{item.itemPrice.final_price &&
				<>{formatCurrency(currency(item.itemPrice.final_price).multiply(item.qty * 1).toString())}</>
				}
			</div>
			<div className='col-md-1 py-2'>
				<IconButton size={'small'}
										onClick={rmItem}
				>
					<DeleteIcon/>
				</IconButton>
			</div>
		</div >
	);
}

interface ICartRowProps {
	item: ICartItem;
	rmItem: () => void;
	onQtyChange: (qty: number) => void;
	settings: IBasicSettings;
}
