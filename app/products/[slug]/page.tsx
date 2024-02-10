import {IAdapterNegativeResponse, IProductItem} from 'boundless-api-client';
import {apiClient, revalidate} from '@/lib/api';
import {notFound} from 'next/navigation';
import {fetchBasicSettings} from '@/lib/settings';
import {ProductLabels, ProductAttrs} from 'boundless-commerce-components';
import AddToCart from '@/components/product/addToCart';
import VariantPicker from '@/components/product/variantPicker';
import PriceAndSku from '@/components/product/priceAndSku';
import ProductGalleryBody from '@/components/product/productGalleryBody';
import type {Metadata} from 'next';

export default async function ProductPage({params: {slug}}: IProps) {
	const product = await fetchProductBySlug(slug);
	const settings = await fetchBasicSettings();

	if (!product) {
		return notFound();
	}

	return (
		<>
			<div className={'container'}>
				<h1 className={'mb-2'}>{product.title}</h1>
				{product.labels && <ProductLabels labels={product.labels} className={'mb-4'}/>}

				<div className={'row'}>
					<div className={'col-md-7'}>
						<ProductGalleryBody product={product} />
					</div>
					<div className={'col-md-5'}>
						<div className={'bg-light p-3 mb-4'}>
							{product.has_variants && <VariantPicker product={product} settings={settings}/>}
							{!product.has_variants && <>
								<PriceAndSku product={product} settings={settings} />
								<AddToCart
									itemId={product.item_id}
									disabled={!product.in_stock}
								/>
							</>}
						</div>
						<ProductAttrs
							characteristics={product.attributes}
							manufacturer={product.manufacturer}
							size={product.props.size}
							className={'p-3 bg-light'}
							apiClient={apiClient}
						/>
					</div>
				</div>
				{product.text.description &&
					<article
						dangerouslySetInnerHTML={{__html: product.text.description}}
						className={'mb-4'}
						style={{maxWidth: '800px'}}
					/>
				}
			</div>
		</>
	);
}

export async function generateMetadata({params: {slug}}: IProps): Promise<Metadata> {
	const product = await fetchProductBySlug(slug);

	return {
		title: product?.seo.title,
		description: product?.seo.metaDesc
	};
}

const fetchProductBySlug = async (slug: string): Promise<IProductItem|undefined> => {
	try {
		return await apiClient.catalog.getProduct(slug, {
			next: {
				revalidate,
				tags: ['products', 'product']
			}
		});
	} catch (e) {
		const err = e as IAdapterNegativeResponse;
		if (err.isAxiosError && err.response?.status === 404) {
			return;
		}

		throw err;
	}
};

interface IProps {params: {slug: string}};

export async function generateStaticParams() {
	const {products} = await apiClient.catalog.getProducts({
		'per-page': 50
	}, {
		next: {
			revalidate,
			tags: ['products']
		}
	});

	return products.map(({product_id, url_key}) => ({
		slug: `${url_key || product_id}`
	}));
}
