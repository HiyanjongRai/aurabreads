import Navbar from '@/components/Navbar';
import ProductsListClient from '@/components/ProductsListClient';
import { getActiveProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const revalidate = 10;

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <>
      <Navbar />
      <ProductsListClient initialProducts={products} />
    </>
  );
}
