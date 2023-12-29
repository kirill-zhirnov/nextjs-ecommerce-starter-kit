'use client';

import {useState, useCallback} from 'react';
import {ProductVariantPicker} from 'boundless-commerce-components/dist/client';
import {IProductItem, IVariant} from 'boundless-api-client';
import AddToCart from '@/components/product/addToCart';
import {IBasicSettings} from 'boundless-commerce-components';
import PriceAndSku from '@/components/product/priceAndSku';

export default function VariantPicker({product, settings}: {product: IProductItem, settings?: IBasicSettings}) {
	const [selectedVariant, setSelectedVariant] = useState<IVariant|undefined>();
	const onCaseChange = useCallback((value: {}, variant?: IVariant) => {
		setSelectedVariant(variant ? variant : undefined);
	}, []);

	if (!product.has_variants) {
		return null;
	}

	return (
		<div>
			<ProductVariantPicker
				extendedVariants={product.extendedVariants!}
				onChange={onCaseChange}
				className={'mb-4'}
			/>
			<PriceAndSku
				product={product}
				settings={settings}
				variant={selectedVariant}
			/>
			<AddToCart
				itemId={selectedVariant?.inventoryItem.item_id}
				disabled={!selectedVariant?.in_stock}
			/>
		</div>
	);
}
