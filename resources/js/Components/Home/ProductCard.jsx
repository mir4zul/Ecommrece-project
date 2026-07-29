import {
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    HeartIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { animations } from "@/utils/animationUtils";
import clsx from "clsx";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import CompareModal from "@/Components/CompareModal";
import { addCompareProduct } from "@/utils/compareProducts";

const ProductCard = ({
    id,
    name,
    image,
    price,
    discount_price,
    stock,
    rating,
    description,
    is_new,
    is_top_rated,
    className,
    showProduct,
    wishlists,
}) => {
    const [compareOpen, setCompareOpen] = useState(false);
    const [compareMessage, setCompareMessage] = useState("");
    const { post } = useForm({
        product_id: id,
        quantity: 1,
    });

    // add to cart function
    const addToCart = () => {
        post(route("add-to-cart"));
    };

    // add to wishlist function
    const addToWishlist = () => {
        post(route("add-to-wishlist"));
    };

    const compareProduct = () => {
        const result = addCompareProduct({
            id,
            name,
            image,
            price,
            discount_price,
            stock,
            rating,
            description,
            is_new,
            is_top_rated,
        });

        setCompareMessage(
            result.reason === "limit"
                ? "You can compare up to 3 products. Remove one to add another."
                : result.reason === "exists"
                  ? "This product is already in your comparison."
                  : "Product added to comparison.",
        );
        setCompareOpen(true);
    };

    return (
        <>
            <motion.div
                initial="hidden"
                animate="show"
                variants={animations.fadeInUp}
                viewport={{ once: true, amount: 0.2 }} // Trigger when 20% visible
                exit="hidden"
                whileInView="visible"
                className="group flex h-full min-w-0 flex-col pb-2"
            >
                <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                    <div className="h-full w-full">
                        <motion.img
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.8 }}
                            src={image}
                            onClick={() => showProduct?.(id)}
                            alt={name}
                            className={clsx(
                                "h-full w-full cursor-pointer object-cover",
                                className ? className : "h-full",
                            )}
                        />
                    </div>

                    {/* Wishlist or Compare */}
                    <div className="absolute right-2 top-2 translate-x-0 space-y-1 bg-white p-2 opacity-100 shadow transition-all duration-300 ease-in-out sm:translate-x-3 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
                        <div
                            onClick={addToWishlist}
                            className="relative group/wishlist cursor-pointer"
                        >
                            {wishlists?.some((item) => item.id === id) ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-6 text-red-500 group-hover/wishlist:text-gray-500"
                                >
                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                </svg>
                            ) : (
                                <HeartIcon className="w-5 h-5 group-hover/wishlist:text-red-500" />
                            )}
                            <div className="absolute right-full mr-3.5 top-1/2 transform -translate-y-1/2 group-hover/wishlist:block hidden bg-black text-white text-sm px-3 py-1.5 shadow-lg transition-opacity">
                                <p>Wishlist</p>
                                <div className="absolute top-1/2 transform -translate-y-1/2 h-2 w-2 bg-black rotate-45 -right-1"></div>
                            </div>
                        </div>
                        <hr />
                        <button
                            type="button"
                            onClick={compareProduct}
                            className="relative block group/compare"
                            aria-label={`Compare ${name}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                className="stroke-current text-gray-500 group-hover/compare:text-red-500 cursor-pointer"
                                fill="none"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="16 3 21 3 21 8"></polyline>
                                <line x1="4" y1="20" x2="21" y2="3"></line>
                                <polyline points="21 16 21 21 16 21"></polyline>
                                <line x1="15" y1="15" x2="21" y2="21"></line>
                                <line x1="4" y1="4" x2="9" y2="9"></line>
                            </svg>
                            <div className="absolute right-full mr-3.5 top-1/2 transform -translate-y-1/2 group-hover/compare:block hidden bg-black text-white text-sm px-3 py-1.5 shadow-lg transition-opacity">
                                <p>Compare</p>
                                <div className="absolute top-1/2 transform -translate-y-1/2 h-2 w-2 bg-black rotate-45 -right-1"></div>
                            </div>
                        </button>
                    </div>

                    {/* Price discount */}
                    {discount_price > 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 shadow-md shadow-black group-hover:opacity-0 opacity-100 transition-all transform duration-300 ease-in-out">
                            <div className="flex items-center">
                                <span className="mr-1">-{discount_price}%</span>
                            </div>
                        </div>
                    )}

                    {/* Out of Stock */}
                    {stock <= 10 && (
                        <div className="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 group-hover:opacity-0 opacity-100 transition-all duration-300 ease-in-out">
                            <p className="text-base uppercase text-center text-red-600 font-bold bg-gray-200 px-10 py-1">
                                Out of Stock
                            </p>
                        </div>
                    )}
                </div>

                <div className="relative flex min-h-28 flex-1 flex-col pt-4 lg:pt-5">
                    <h3
                        className="truncate pb-1.5 font-medium text-gray-800"
                        title={name}
                    >
                        {name}
                    </h3>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((item) => {
                            return rating >= item ? (
                                <StarIcon
                                    key={item}
                                    className="w-4 h-4 text-yellow-300"
                                />
                            ) : (
                                <StarIcon
                                    key={item}
                                    className="w-4 h-4 text-gray-300"
                                />
                            );
                        })}
                    </div>
                    <div className="mt-2 flex min-h-6 gap-2 opacity-100 transition-all duration-100 ease-in-out sm:group-hover:opacity-0">
                        {discount_price > 0 && (
                            <p className="text-gray-400 line-through">
                                ${price}
                            </p>
                        )}
                        <p className="font-semibold text-gray-800">
                            $
                            {discount_price
                                ? (
                                      price -
                                      (price * discount_price) / 100
                                  ).toFixed(2)
                                : price}
                        </p>
                    </div>

                    <div className="mt-auto w-full pt-3 opacity-100 transition-all duration-300 ease-in-out sm:absolute sm:bottom-0 sm:left-0 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        <div className="flex items-center justify-between gap-2">
                            <button
                                onClick={() => addToCart(id)}
                                className="flex min-w-0 items-center gap-1 group/cart cursor-pointer duration-200 ease-in-out"
                            >
                                <ShoppingBagIcon className="w-4 lg:w-5 h-4 lg:h-5 text-gray-800 group-hover/cart:text-red-500" />
                                <p className="truncate text-xs text-gray-800 group-hover/cart:text-red-500 lg:text-sm">
                                    Add to Cart
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => showProduct?.(id)}
                                className="flex min-w-0 items-center gap-1 group/quick cursor-pointer"
                            >
                                <MagnifyingGlassIcon className="w-4 lg:w-5 h-4 lg:h-5 text-gray-800 group-hover/quick:text-red-500" />
                                <p className="truncate text-xs text-gray-800 group-hover/quick:text-red-500 lg:text-sm">
                                    Quick View
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <CompareModal
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                message={compareMessage}
            />
        </>
    );
};

export default ProductCard;
