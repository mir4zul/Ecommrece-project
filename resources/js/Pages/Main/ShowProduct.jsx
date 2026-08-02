import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import BoughtTogether from "@/Components/Home/BoughtTogether";
import ProductDetails from "@/Components/Home/ProductDetails";
import RelatedProducts from "@/Components/RelatedProducts";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function ShowProduct({ product, products, carts, wishlists }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [product.id]);

    return (
        <div className="bg-slate-900">
            <Head title={product.name} />

            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                carts={carts}
                wishlists={wishlists}
            />

            <div className="h-[85px] bg-slate-900" />

            <ProductDetails product={product} wishlists={wishlists} />
            <BoughtTogether />
            <RelatedProducts
                products={products}
                currentProductId={product.id}
                wishlists={wishlists}
            />
            <Footer />
        </div>
    );
}
