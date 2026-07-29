import Header from "@/Components/Header";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import banner from "@/assets/img-sidebar.jpg";
import SimpleProductCard from "@/Components/Home/SimpleProductCard";
import ProductCard from "@/Components/Home/ProductCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Categories = [
    { name: "Digital Cameras" },
    { name: "Football" },
    { name: "Headphones" },
    { name: "Portable Audio" },
    { name: "Men's" },
    { name: "Smart Watches" },
    { name: "Tennis" },
    { name: "Uncategorized" },
    { name: "Video Games" },
    { name: "Women's" },
];

const productVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function ShopLeftSidebar({ products, carts, wishlists }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { get } = useForm();

    const showProduct = (id) => {
        get(route("product.show", id));
    };

    return (
        <>
            <Head title="shop-left-sidebar" />

            <div className="bg-white">
                <div className="bg-slate-900 h-[85px]">
                    <Header
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        carts={carts}
                        wishlists={wishlists}
                    />
                </div>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 my-8 sm:my-14">
                    {/* Sidebar */}
                    <aside className="hidden lg:block col-span-1">
                        <h2 className="text-gray-600 uppercase font-semibold text-lg tracking-wide">
                            Categories
                        </h2>
                        <div className="mt-2 relative before:absolute after:absolute before:bg-red-600 after:bg-neutral-950/10 before:top-0 before:left-0 before:h-px before:w-28 after:top-0 after:right-0 after:left-28 after:h-px"></div>

                        <div className="space-y-4 mt-10">
                            {Categories.map((data, index) => (
                                <div key={index}>
                                    <a
                                        href="#"
                                        className="text-base tracking-wider text-gray-700 hover:text-red-600"
                                    >
                                        {data.name}
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Tags */}
                        <div className="mt-10">
                            <h2 className="text-gray-600 uppercase font-semibold text-lg tracking-wide">
                                Tags
                            </h2>
                            <div className="mt-2 relative before:absolute after:absolute before:bg-red-600 after:bg-neutral-950/10 before:top-0 before:left-0 before:h-px before:w-12 after:top-0 after:right-0 after:left-12 after:h-px"></div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 auto-rows-auto mt-8 gap-1.5">
                                {[1, 2, 3, 4, 5, 6].map((index) => (
                                    <button
                                        key={index}
                                        className="bg-gray-100 py-1 text-[10px] sm:text-sm uppercase border rounded text-gray-600 hover:bg-red-500 hover:text-white duration-200 ease-in-out"
                                    >
                                        Tag-0{index}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Compare */}
                        <div className="mt-10">
                            <h2 className="text-gray-600 uppercase font-semibold text-lg tracking-wide">
                                Compare
                            </h2>
                            <div className="mt-2 relative before:absolute after:absolute before:bg-red-600 after:bg-neutral-950/10 before:top-0 before:left-0 before:h-px before:w-28 after:top-0 after:right-0 after:left-28 after:h-px"></div>
                            <p className="text-gray-400 text-sm py-6">
                                No products to compare
                            </p>

                            <div className="flex justify-between">
                                <button className="text-gray-400 text-sm tracking-wide hover:text-red-500">
                                    Clear all
                                </button>
                                <button className="text-sm bg-red-500 py-1.5 px-4 rounded text-white hover:bg-gray-800">
                                    Compare
                                </button>
                            </div>

                            <img
                                src={banner}
                                className="w-full my-10 sm:my-14 rounded-lg"
                                alt="Banner"
                            />

                            <div className="space-y-4">
                                {products
                                    .sort(() => 0.5 - Math.random())
                                    .slice(0, 2)
                                    .map((item) => (
                                        <SimpleProductCard
                                            key={item.id}
                                            {...item}
                                        />
                                    ))}
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Search */}
                    <div className="col-span-1 lg:hidden border border-gray-200 flex items-center gap-2 p-2 rounded-lg shadow-sm bg-white">
                        <label htmlFor="search" className="flex items-center">
                            <MagnifyingGlassIcon className="w-6 h-6 text-gray-800" />
                        </label>
                        <input
                            id="search"
                            placeholder="Search..."
                            type="text"
                            name="search"
                            className="w-full outline-none border-none bg-transparent placeholder-gray-400 text-gray-700 focus:ring-0"
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-5 sm:gap-6">
                        {products.map((item) => (
                            <motion.div
                                key={item.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={productVariants}
                            >
                                <ProductCard
                                    {...item}
                                    wishlists={wishlists}
                                    showProduct={showProduct}
                                    className="h-96"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
