import Link from 'next/link';
import {Products, Product} from 'boundless-commerce-components';
import {apiClient, revalidate} from '@/lib/api';
import {IProduct} from 'boundless-api-client';
import {fetchBasicSettings} from '@/lib/settings';

export default async function HomePage() {
  const products = await fetchProductsOnMain();
  const settings = await fetchBasicSettings();

  return (
    <main>
      <div className={'container'}>
        <Products
          all={{gap: 10, perRow: 2}}
          sm={{gap: 20, perRow: 3}}
          lg={{gap: 30, perRow: 4}}
          xxl={{gap: 20, perRow: 5}}
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
      </div>
    </main>
  );
}

const fetchProductsOnMain = async (): Promise<IProduct[]> => {
  /**
   * Fetch Products from the "Products on the Main page" collection.
   * You can adjust filters, pls see: https://docs.boundless-commerce.com/#tag/Products/paths/~1catalog~1products/get
   */
  const {products} = await apiClient.catalog.getProducts({
    collection: ['main-page'],
    sort: 'in_collection'
  }, {
    next: {
      revalidate,
      tags: ['products']
    }
  });

  return products;
};
