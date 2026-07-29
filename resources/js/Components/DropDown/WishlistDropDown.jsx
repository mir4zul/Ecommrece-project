import clsx from "clsx";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useForm } from "@inertiajs/react";

export default function WishlistDropDown({ dropdownOpen, wishlists }) {
    const { delete: destroy, get } = useForm();
    console.log("wishlists", wishlists);

    // Remove wishlist item
    const removeFromWishlist = (id) => {
        destroy(route("remove-from-wishlist", id));
        // Optionally, you can also update the UI or show a notification
        console.log("remove from wishlist", id);
    };

    // View Product
    const viewProduct = (id) => {
        get(route("product.show", id));
        // Optionally, you can also update the UI or show a notification
        console.log("view product", id);
    };

    return (
        <>
            <div
                className={clsx(
                    "absolute right-0 max-h-96 top-[85px] w-[min(22rem,calc(100vw-2rem))] bg-white shadow-xl transform transition-all duration-500 ease-in-out",
                    dropdownOpen === "wishlist"
                        ? "max-h-[500px] opacity-100 scale-y-100"
                        : "max-h-0 opacity-0 scale-y-0",
                )}
                style={{ transformOrigin: "top" }}
            >
                {wishlists === null || wishlists.length === 0 ? (
                    <div className="w-full p-4 space-y-2 bg-gray-100 border-b border-gray-200 dark:border-gray-300">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-600">
                            Your wishlist is empty
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-500">
                            Add items to your wishlist to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col w-full overflow-y-scroll bg-gray-100">
                        {wishlists.map((wishlist) => (
                            <div
                                key={wishlist.id}
                                className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-300"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={wishlist.image}
                                        alt={wishlist.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-600">
                                            {wishlist.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-500">
                                            ${wishlist.price}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    {/* View Product Button */}
                                    <button
                                        onClick={() =>
                                            viewProduct(wishlist.product_id)
                                        }
                                        className="text-blue-500 hover:text-blue-700"
                                        title="View Product"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                    </button>

                                    {/* Remove Wishlist Button */}
                                    <button
                                        onClick={() =>
                                            removeFromWishlist(wishlist.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                        title="Remove from Wishlist"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
