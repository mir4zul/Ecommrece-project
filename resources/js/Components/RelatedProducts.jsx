import ProductCard from "./Home/ProductCard";
import { useForm } from "@inertiajs/react";

export default function RelatedProducts({
    products = [],
    currentProductId,
    wishlists = [],
}) {
    const { get } = useForm();
    const relatedProducts = products
        .filter((product) => product.id !== currentProductId)
        .slice(0, 4);

    const showProduct = (id) => {
        get(route("product.show", id), {
            preserveScroll: false,
            onSuccess: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        });
    };

    return (
        <div className="bg-white">
            <h2 className="text-2xl sm:text-3xl font-open uppercase text-gray-900 tracking-tight font-bold text-center">
                Related Products
            </h2>

            <div className="max-w-8xl mx-auto mt-8 sm:mt-10 pb-16 sm:pb-20 grid auto-rows-fr grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 px-4 sm:px-6 lg:px-8">
                {relatedProducts.map((item) => (
                    <div
                        key={item.id}
                        className="h-full min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg sm:p-4"
                    >
                        <ProductCard
                            {...item}
                            wishlists={wishlists}
                            showProduct={showProduct}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
