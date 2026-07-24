import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import HomePageContent from "@/components/HomePageContent";
import { getHomepageProducts } from "@/lib/products";

// Revalidate homepage every 10 seconds for real-time seller products
export const revalidate = 10;

export default async function Home() {
  const dbProducts = await getHomepageProducts(10);

  return (
    <>
      <Navbar />
      <HeroBanner />
      <HomePageContent initialProducts={dbProducts} />
    </>
  );
}
