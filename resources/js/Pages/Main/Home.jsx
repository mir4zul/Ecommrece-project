import Footer from "@/Components/Footer";
import Hero from "@/Components/Hero";
import LatestBlog from "@/Components/Home/LatestBlog";
import NewProduct from "@/Components/Home/NewProduct";
import PopularCategories from "@/Components/Home/PopularCategories";
import ProductCategories from "@/Components/Home/ProductCategories";
import ProductGrid from "@/Components/Home/ProductGrid";
import ImageCarousel from "@/Components/Home/Sponsors";
import SummerDiscountBlog from "@/Components/Home/SummerDiscountBlog";
import Opportunity from "@/Components/Opportunity";
import { Head } from "@inertiajs/react";

export default function Home({ products, carts, wishlists }) {
    return (
        <>
            <Head title="Home" />
            <div className="bg-white">
                <Hero carts={carts} />
                <Opportunity />
                <PopularCategories />
                <ProductGrid />
                <NewProduct products={products} wishlists={wishlists} />
                <SummerDiscountBlog />
                <LatestBlog />
                <ProductCategories products={products} />
                <ImageCarousel />
                <Footer />
            </div>
        </>
    );
}
