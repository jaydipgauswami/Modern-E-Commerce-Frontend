import Hero from "../component/Hero";
import FeaturedProducts from "../component/FeaturedProducts";
import Categories from "../component/Catagories";
import Navbar from "../component/Navbar";
import WhychooseUs from "../component/Chooseus";
import Footer from "../component/Footer";

export default function Home() {
  return (
    <div>
         <Navbar />
      <div className="mt-20">
        <Hero />
      <Categories />
      <FeaturedProducts />
      <WhychooseUs />
      
      </div>

    </div>
  );
}