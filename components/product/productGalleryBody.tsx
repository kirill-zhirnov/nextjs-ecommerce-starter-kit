'use client';

import {IProductItem, TThumbRatio} from 'boundless-api-client';
import {NoImage} from 'boundless-commerce-components';
import {ProductGallery} from 'boundless-commerce-components/dist/client';
import {apiClient} from '@/lib/api';

export default function ProductGalleryBody({product}: {product: IProductItem}) {
	if (!product.images || !product.images.length) {
		return <NoImage ratio={TThumbRatio['1-1']}/>;
	}

	return (
		<ProductGallery product={product} apiClient={apiClient} className={'mb-4'} />
	);
}
