'use client';

import {ReactNode, useCallback, useMemo, useState} from 'react';
import {BoundlessCart} from 'boundless-commerce-components/dist/client';
import {apiClient} from '@/lib/api';
import {IAddToCartResponse} from 'boundless-api-client';
import ProductAddedDialog from '@/components/wrapperForCartContext/productAddedDialog';
import SelectVariantDialog from '@/components/wrapperForCartContext/selectVariantDialog';
import CartFAB from '@/components/cart/fab';
import {usePathname} from 'next/navigation';

export default function WrapperForCartContext({children}: {children: ReactNode}) {
	const pathname = usePathname();

	const [addedToCart, setAddedToCart] = useState<IAddToCartResponse>();
	const [neededSelectVariant, setNeededSelectVariant] = useState<IAddToCartResponse>();

	const onProductAddedToCart = useCallback((result: IAddToCartResponse) => setAddedToCart(result), []);
	const onNeededSelectVariant = useCallback((result: IAddToCartResponse) => setNeededSelectVariant(result), []);

	const showCart = useMemo(() => {
		if (pathname.startsWith('/stripe') || pathname.startsWith('/boundless-checkout') || pathname.startsWith('/cart')) {
			return false;
		}

		return true;
	}, [pathname]);

	return (
		<BoundlessCart
			apiClient={apiClient}
			onProductAddedToCart={onProductAddedToCart}
			onNeededSelectVariant={onNeededSelectVariant}
		>
			{children}
			{showCart && <CartFAB />}
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

