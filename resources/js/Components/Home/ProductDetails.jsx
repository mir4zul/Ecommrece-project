import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Product from "../Product";
import { useForm } from "@inertiajs/react";
import CompareModal from "@/Components/CompareModal";
import { addCompareProduct } from "@/utils/compareProducts";

const categories = [
    "Driveshafts",
    "Spools",
    "Headphones",
    "Portable Audio",
    "Tennis",
    "Video Games",
    "Uncategorized",
];

export default function ProductDetails({ product, wishlists = [] }) {
    const [quantity, setQuantity] = useState(1);
    const [compareOpen, setCompareOpen] = useState(false);
    const [compareMessage, setCompareMessage] = useState("");
    const isWishlisted = wishlists.some(
        (item) => Number(item.product_id) === Number(product.id),
    );
    const { data, setData, post } = useForm({
        product_id: product.id,
        quantity: quantity,
    });

    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    const addToCart = () => {
        post(route("add-to-cart"), {
            ...data,
        });

        // Reset quantity to 1 after adding to cart
        setQuantity(1);
    };

    const addToWishlist = () => {
        post(route("add-to-wishlist"), { preserveScroll: true });
    };

    const compareProduct = () => {
        const result = addCompareProduct(product);

        setCompareMessage(
            result.reason === "limit"
                ? "You can compare up to 3 products. Remove one to add another."
                : result.reason === "exists"
                  ? "This product is already in your comparison."
                  : "Product added to comparison.",
        );
        setCompareOpen(true);
    };

    useEffect(() => {
        setData("quantity", quantity);
    }, [quantity]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl py-10 px-4 sm:py-16 sm:px-6 lg:max-w-8xl lg:px-8 lg:py-24">
                <div className="lg:grid lg:grid-cols-7 lg:items-start lg:gap-x-8">
                    <div className="lg:col-span-3">
                        <Product product={product} />
                    </div>

                    <div className="mt-8 lg:mt-0 lg:col-span-4">
                        <h1 className="font-medium text-2xl sm:text-3xl text-gray-700 break-words">
                            {product.name}
                        </h1>
                        <p className="font-semibold text-xl py-4 text-gray-600">
                            ${product.price}
                        </p>
                        <p className="text-gray-600 text-sm max-w-sm leading-7">
                            {product.description}
                        </p>

                        <div className="mt-8">
                            <div className="flex flex-col items-stretch gap-4 min-[420px]:flex-row min-[420px]:items-center">
                                {/* Quantity Selector */}
                                <div className="inline-flex items-center border border-gray-300 overflow-hidden">
                                    <button
                                        className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200"
                                        onClick={decreaseQuantity}
                                    >
                                        -
                                    </button>

                                    <span className="px-4 py-2 w-12 text-center bg-white border-x border-gray-300">
                                        {quantity}
                                    </span>

                                    <button
                                        className="bg-gray-100 text-black px-4 py-2 hover:bg-gray-200"
                                        onClick={increaseQuantity}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={addToCart}
                                    className="w-full min-[420px]:w-auto bg-red-600 text-white px-6 sm:px-8 py-2.5 hover:bg-gray-800 transition"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={addToWishlist}
                                className={`flex items-center gap-1 transition ${
                                    isWishlisted
                                        ? "text-red-600"
                                        : "text-gray-600 hover:text-red-600"
                                }`}
                                aria-pressed={isWishlisted}
                            >
                                <HeartIcon
                                    size={20}
                                    fill={
                                        isWishlisted ? "currentColor" : "none"
                                    }
                                />
                                <p className="text-sm">
                                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={compareProduct}
                                className="flex items-center gap-1 text-gray-600 transition hover:text-red-600"
                            >
                                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                <p className="text-sm">Compare</p>
                            </button>
                        </div>

                        <hr className="my-8" />

                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 uppercase">
                                <strong>sku</strong>: wvn-14-123
                            </p>
                            <p className="text-sm text-gray-600 first-letter:uppercase">
                                <strong>categories</strong>:{" "}
                                <span className="space-x-1">
                                    {categories.map((category) => (
                                        <a
                                            key={category}
                                            href="#"
                                            className="text-gray-600 hover:underline"
                                        >
                                            {category},
                                        </a>
                                    ))}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 uppercase">
                                <strong>tags</strong>: <a href="#">Basic</a>,{" "}
                                <a href="#" className="hover:underline">
                                    Tee
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <CompareModal
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                message={compareMessage}
            />
        </div>
    );
}
