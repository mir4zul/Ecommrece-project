import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { animations } from "@/utils/animationUtils";
import { useForm } from "@inertiajs/react";

const SimpleProductCard = ({
    id,
    title,
    name,
    image,
    imageUrl,
    price,
    discount,
    discount_price,
    rating = 0,
}) => {
    const productName = name ?? title;
    const productImage = image ?? imageUrl;
    const productDiscount = discount_price ?? discount;
    const { get } = useForm();

    const viewProduct = () => {
        if (id) {
            get(route("product.show", id));
        }
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
                className="group aspect-h-1 aspect-w-1 w-full rounded"
            >
                <div className="flex gap-6">
                    <div className="h-36 w-32">
                        <img
                            src={productImage}
                            alt={productName}
                            onClick={viewProduct}
                            className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
                        />
                    </div>
                    <div>
                        <h3
                            onClick={viewProduct}
                            className="text-gray-600 pb-1.5 group-hover:text-red-600 duration-200 ease-in-out cursor-pointer"
                        >
                            {productName}
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
                        <div className="flex gap-2 mt-2 transition-all transform duration-100 ease-in-out">
                            {productDiscount > 0 && (
                                <p className="text-gray-400 line-through">
                                    ${price}
                                </p>
                            )}
                            <p className="font-semibold text-gray-800">
                                $
                                {productDiscount > 0
                                    ? (
                                          price -
                                          (price * productDiscount) / 100
                                      ).toFixed(2)
                                    : price}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default SimpleProductCard;
