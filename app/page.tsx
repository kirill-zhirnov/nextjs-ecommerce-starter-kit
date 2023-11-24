import Link from 'next/link'
import {Products, Product} from 'boundless-commerce-components';
import {nativeFetch, apiClient, revalidate} from "@/lib/api";
import {IProduct} from "boundless-api-client";
import {fetchBasicSettings} from "@/lib/settings";

export default async function HomePage() {
  const products = await fetchProductsOnMain();
  const settings = await fetchBasicSettings();

  return (
    <main>
      <div className={'container-fluid'}>
        <h1>Products:</h1>
        <Products
          className={'bdl-products_gap-10_per-row-2 bdl-products_md-gap-20_per-row-3 bdl-products_lg-gap-30_per-row-4'}
          // all={{gap: 10, perRow: 2}}
          // sm={{}}
        >
          {products.map((product) =>
            <Product
              product={product}
              key={product.product_id}
              link={{component: Link, href: `/product/${product.url_key || product.product_id}`}}
              apiClient={apiClient}
              settings={settings}
            />
          )}
        </Products>
      </div>
    </main>
  )
}

const fetchProductsOnMain = async (): Promise<IProduct[]> => {
  /**
   * Fetch Products from the "Products on the Main page" collection.
   * You can adjust filters, pls see: https://docs.boundless-commerce.com/#tag/Products/paths/~1catalog~1products/get
   */
  const data = await nativeFetch('/catalog/products?collection[]=main-page&sort=in_collection', {
    next: {
      revalidate,
      tags: ['products']
    }
  });
  if (!data.ok) {
    throw new Error('Failed to fetch products')
  }

  return data.json();
};
