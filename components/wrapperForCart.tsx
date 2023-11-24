'use client';

import {ReactNode, useCallback, useState} from 'react';
import {BoundlessCart} from 'boundless-commerce-components/dist/cart';
import {apiClient} from "@/lib/api";
import {IAddToCartResponse} from "boundless-api-client";
import ProductAddedDialog from "@/components/wrapperForCart/productAddedDialog";
import SelectVariantDialog from "@/components/wrapperForCart/selectVariantDialog";

export default function WrapperForCart({children}: {children: ReactNode}) {
	const [addedToCart, setAddedToCart] = useState<IAddToCartResponse>();
	const [neededSelectVariant, setNeededSelectVariant] = useState<IAddToCartResponse>();

	const onProductAddedToCart = useCallback((result: IAddToCartResponse) => setAddedToCart(result), []);
	const onNeededSelectVariant = useCallback((result: IAddToCartResponse) => setNeededSelectVariant(result), []);

	return (
		<BoundlessCart
			apiClient={apiClient}
			onProductAddedToCart={onProductAddedToCart}
			onNeededSelectVariant={onNeededSelectVariant}
		>
			{children}
			<ProductAddedDialog
				open={Boolean(addedToCart)}
				onClose={() => setAddedToCart(undefined)}
				addedToCart={addedToCart}
			/>
			<SelectVariantDialog
				open={Boolean(neededSelectVariant)}
				onClose={() => setNeededSelectVariant(undefined)}
				neededSelectVariant={neededSelectVariant}
			/>
		</BoundlessCart>
	);
}

