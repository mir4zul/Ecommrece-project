import React from "react";
import banner1 from "@/assets/banner-1-1.jpg";
import banner2 from "@/assets/img2-middle-store1.jpg";
import banner3 from "@/assets/banner1.jpg";
import banner4 from "@/assets/banner2.jpg";
import PrimaryButton from "../PrimaryButton";
import { animations } from "@/utils/animationUtils";
import { motion } from "framer-motion";

const ProductGrid = () => {
    return (
        <div className="flex flex-col md:flex-row overflow-hidden">
            {/* Left Section */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={animations.fadeInLeft}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true, amount: 0.2 }} // Trigger when 20% visible
                exit="hidden"
                whileInView="visible"
                className="flex-1 basis-1/2 min-h-[26rem] sm:min-h-[32rem] lg:min-h-[50rem] bg-cover bg-center"
                style={{
                    backgroundImage: `url(${banner1})`,
                }}
            >
                <div className="flex flex-col justify-center p-6 text-center pt-14 pb-20 lg:pt-24">
                    <h3 className="lg:text-lg font-medium uppercase tracking-tight text-gray-100">
                        20% Off ! Limited week deal
                    </h3>
                    <h2 className="text-3xl lg:text-4xl font-bold mt-2 text-white uppercase tracking-wide">
                        Camera YooSee YS200
                    </h2>
                    <div>
                        <PrimaryButton className="mt-6">
                            Discover Now
                        </PrimaryButton>
                    </div>
                </div>
            </motion.div>

            {/* Right Section */}
            <div className="flex flex-col flex-1 basis-1/2">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={animations.fadeInRight}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    viewport={{ once: true, amount: 0.2 }} // Trigger when 20% visible
                    exit="hidden"
                    whileInView="visible"
                    className="flex-1 basis-1/2 min-h-[22rem] sm:min-h-[25rem] object-cover bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${banner2})`,
                    }}
                >
                    <div className="px-6 sm:pl-10 lg:pl-20 pt-10 pb-10 lg:mt-40">
                        <p className="lg:text-lg font-semibold uppercase tracking-tight text-gray-50">
                            Sam sung
                        </p>
                        <h3 className="max-w-72 text-2xl lg:text-4xl font-bold mt-2 text-white tracking-wide">
                            Wireless Black Headphone
                        </h3>
                        <button className="text-white uppercase text-sm font-bold mt-6 border-b hover:border-red-600 hover:text-red-600 duration-200 ease-in-out">
                            Discover Now
                        </button>
                    </div>
                </motion.div>

                <div className="flex flex-col min-[420px]:flex-row justify-between lg:min-h-[25rem]">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={animations.fadeInRight}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        viewport={{ once: true, amount: 0.2 }} // Trigger when 20% visible
                        exit="hidden"
                        whileInView="visible"
                        className="w-full min-[420px]:w-1/2"
                    >
                        <img
                            src={banner4}
                            className="w-full"
                            alt="Banner image"
                        />
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={animations.fadeInRight}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        viewport={{ once: true, amount: 0.2 }} // Trigger when 20% visible
                        exit="hidden"
                        whileInView="visible"
                        className="w-full min-[420px]:w-1/2"
                    >
                        <img
                            src={banner3}
                            className="w-full"
                            alt="Banner image"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;
