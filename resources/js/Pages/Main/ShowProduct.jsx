import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import BoughtTogether from "@/Components/Home/BoughtTogether";
import ProductDetails from "@/Components/Home/ProductDetails";
import RelatedProducts from "@/Components/RelatedProducts";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";

export default function ShowProduct({ product, products, carts, wishlists }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-slate-900">
            <Head title="Blog" />

            <Header
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                carts={carts}
                wishlists={wishlists}
            />

            <div className="py-40 max-w-3xl mx-auto">
                <h1 className="text-4xl font-open uppercase text-gray-50 tracking-wider">
                    Sit voluptatem rhoncus
                </h1>
            </div>

            <ProductDetails product={product} />
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
