import {IProductItem, IVariant} from 'boundless-api-client';
import clsx from 'clsx';
import {useFormatCurrency, IBasicSettings, IPriceForTpl, getPriceForTpl, findSellingPrice} from 'boundless-commerce-components';
import currency from 'currency.js';
import {useMemo} from 'react';

export default function PriceAndSku({product, variant, className, settings}: IProps) {
	const {formatCurrency} = useFormatCurrency({settings});
	const {price, benefit, isInStock} = useMemo(() => {
		let price: IPriceForTpl|undefined, benefit: number | null = null;
		if (variant) {
			const sellingPrice = findSellingPrice(variant.prices);
			if (sellingPrice) {
				price = {price: sellingPrice.value, oldPrice: sellingPrice.old};
			}
		} else {
			const sellingPrice = findSellingPrice(product.prices);
			if (sellingPrice) {
				price = getPriceForTpl(sellingPrice);
			}
		}

		if (price && price.price && price.oldPrice) {
			benefit = new currency(price.oldPrice).subtract(price.price).toJSON();
		}

		const isInStock = variant ? variant.in_stock : product.in_stock;

		return {price, benefit, isInStock};
	}, [product, variant]);

	return (
		<div className={clsx(className)}>
			{price?.price && <p>
				{price.isFrom && <span className={'small text-muted d-inline-block me-2'}>From:</span>}
				<span className={clsx('fs-3 fw-bold', {'text-danger': price.oldPrice})}>{formatCurrency(price.price)}</span>
				{price.oldPrice && <span className={'text-decoration-line-through text-muted d-inline-block ms-2'}>{formatCurrency(price.oldPrice)}</span>}
			</p>}
			{benefit && <p>
				<label>You save:</label>
				<span className={'text-danger d-inline-block ms-2'}>{formatCurrency(benefit)}</span>
			</p>}
			{(!product.has_variants || variant) && <>
				<p className={clsx({'text-success': isInStock, 'text-muted': !isInStock})}>
					{isInStock && 'In stock'}
					{!isInStock && 'Out of stock'}
				</p>
				{(product.sku || variant?.sku) && <p>
					SKU: <span className='text-muted'>{variant?.sku || product.sku}</span>
				</p>}
			</>}
		</div>
	);
}

interface IProps {
	product: Pick<IProductItem, 'prices' | 'has_variants' | 'in_stock' | 'item_id' | 'sku'>;
	variant?: IVariant;
	className?: string,
	settings?: IBasicSettings
}
