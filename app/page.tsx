import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import HomePageContent from "@/components/HomePageContent";
import { getHomepageProducts } from "@/lib/products";

// Render dynamically on user request & revalidate every 10 seconds
export const dynamic = 'force-dynamic';
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
