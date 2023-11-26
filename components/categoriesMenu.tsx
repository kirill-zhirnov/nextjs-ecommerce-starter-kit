'use client';

import {ICategory} from "boundless-api-client";
import {nativeFetch, revalidate} from "@/lib/api";
import Link from 'next/link'

export default async function CategoriesMenu() {
	const categories = await fetchCategoriesMenu();

	return (
		<div className={'container'}>
			<ul className={'list-unstyled d-flex flex-wrap border-top border-bottom py-3 mb-5'}
					style={{gap: '15px'}}
			>
				{categories.map(({category_id, title, url_key}) =>
					<li key={category_id}>
						<Link href={`/category/${url_key || category_id}`} className={'fs-4'}>{title}</Link>
					</li>
				)}
			</ul>
		</div>
	);
}

const fetchCategoriesMenu = async (): Promise<ICategory[]> => {
	const data = await nativeFetch('/catalog/categories/tree?menu=category', {
		next: {
			revalidate,
			tags: ['categories']
		}
	});
	if (!data.ok) {
		throw new Error('Failed to fetch categories menu')
	}

	return data.json();
};
