import ProductCard from "./ProductCard";
import { Link, useForm } from "@inertiajs/react";

export default function NewProduct({ products = [], wishlists = [] }) {
    const { get } = useForm();
    const newProducts = products
        .filter((product) => product.is_new)
        .slice(0, 10);

    const showProduct = (id) => {
        get(route("product.show", id));
    };

    return (
        <div className="mx-auto max-w-2xl lg:max-w-8xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="max-w-xl mx-auto text-center">
                <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-800">
                    the New arrivals
                </h3>
                <Link
                    href={route("products.shopLeftSidebar")}
                    className="mt-2 inline-block text-sm text-gray-600 transition hover:text-red-600 hover:underline"
                >
                    Shop All Products
                </Link>
            </div>
            <div className="grid auto-rows-fr grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6 mt-8 sm:mt-10">
                {newProducts.map((product) => (
                    <div
                        key={product.id}
                        className="h-full min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg sm:p-4"
                    >
                        <ProductCard
                            {...product}
                            wishlists={wishlists}
                            showProduct={showProduct}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
