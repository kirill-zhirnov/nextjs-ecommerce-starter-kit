import {fetchBasicSettings} from '@/lib/settings';
import {notFound} from 'next/navigation';
import {IProduct, ICategoryItem, ICategory, extractPaginationFromHeaders, IPagination} from 'boundless-api-client';
import {apiClient, nativeFetch, revalidate} from '@/lib/api';
import {Product, Products} from 'boundless-commerce-components';
import Link from 'next/link';
import {Metadata} from 'next';
import Pagination from '@/components/pagination';

export default async function CategoryPage({params: {slug}}: IProps) {
	const category = await fetchCategory(slug);

	if (!category) {
		return notFound();
	}

	const {products, pagination} = await fetchProductsInCategory(category);
	const settings = await fetchBasicSettings();

	return (
		<>
			<div className={'container'}>
				<h1 className={'mb-4'}>{category.title}</h1>
				{category.text?.description_top &&
				<div dangerouslySetInnerHTML={{__html: category.text?.description_top}} className={'my-3'} />}
				<Products
					all={{gap: 10, perRow: 2}}
					sm={{gap: 20, perRow: 3}}
					lg={{gap: 30, perRow: 4}}
					className={'my-5'}
				>
					{products.map((product) =>
						<Product
							product={product}
							key={product.product_id}
							link={{component: Link, href: `/products/${product.url_key || product.product_id}`}}
							apiClient={apiClient}
							settings={settings}
						/>
					)}
				</Products>
				{/*<Pagination pagination={pagination} />*/}
				{category.text?.description_bottom &&
				<div dangerouslySetInnerHTML={{__html: category.text?.description_bottom}} className={'my-3'}/>}
			</div>
		</>
	);
}

export async function generateMetadata({params: {slug}}: IProps): Promise<Metadata> {
	const category = await fetchCategory(slug);

	return {
		title: category?.seo.title,
		description: category?.seo.metaDesc
	};
}

interface IProps {params: {slug: string}};

const fetchCategory = async (slug: string): Promise<ICategoryItem|undefined> => {
	const data = await nativeFetch(`/catalog/categories/item/${slug}`, {
		next: {
			revalidate,
			tags: ['categories']
		}
	});
	if (!data.ok) {
		if (data.status === 404) {
			return;
		} else {
			throw new Error(`Failed to fetch category: ${slug}`);
		}
	}

	return data.json();
};

const fetchProductsInCategory = async (category: ICategoryItem): Promise<{products: IProduct[], pagination: IPagination}> => {
	// &page=1&per-page=50 - if you need a pagination - https://docs.boundless-commerce.com/#tag/Products/paths/~1catalog~1products/get
	const data = await nativeFetch(`/catalog/products?category[]=${category.category_id}&sort=in_category,-in_stock,price`, {
		next: {
			revalidate,
			tags: ['products']
		}
	});
	if (!data.ok) {
		throw new Error('Failed to fetch product for category');
	}

	const headers = {};
	data.headers.forEach((val, headerKey) => {
		Object.assign(headers, {[headerKey]: val});
	});

	const pagination = extractPaginationFromHeaders(headers);

	return {products: await data.json(), pagination};
};

export async function generateStaticParams() {
	const data = await nativeFetch('/catalog/categories/flat', {
		next: {
			revalidate,
			tags: ['categories']
		}
	});
	if (!data.ok) {
		throw new Error('Failed to fetch categories menu');
	}

	const categories = await data.json() as ICategory[];
	return categories.map(({category_id, url_key}) => ({
		slug: `${url_key || category_id}`
	}));
}
