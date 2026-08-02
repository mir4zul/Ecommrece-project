import { XCircleIcon } from "@heroicons/react/24/outline";
import { Link, useForm } from "@inertiajs/react";
import clsx from "clsx";

const getCartUnitPrice = (cart) => {
    const price = Number(cart.price) || 0;
    const discount = Number(cart.discount) || 0;

    return price - (price * discount) / 100;
};

export default function CartDropDown({ dropdownOpen, carts = [] }) {
    const { delete: destroy } = useForm();

    const deleteCart = (id) => {
        destroy(route("remove-from-cart", id));
    };

    return (
        <>
            <div
                className={clsx(
                    "absolute right-0 top-full z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-b-xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-300 ease-in-out dark:bg-slate-900 dark:ring-white/10",
                    dropdownOpen === "cart"
                        ? "max-h-[500px] opacity-100 scale-y-100"
                        : "max-h-0 opacity-0 scale-y-0",
                )}
                style={{ transformOrigin: "top" }}
            >
                {carts === null ||
                carts.length === 0 ||
                carts.length === undefined ? (
                    <div className="w-full p-4 space-y-2 bg-gray-100 border-b border-gray-200 dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                            Your cart is empty
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                            Add items to your cart to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="flex w-full flex-col bg-gray-100 dark:bg-slate-900">
                        <div className="max-h-72 overflow-y-auto overscroll-contain">
                            {carts.map((cart) => (
                            <div
                                key={cart.id}
                                className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={cart.image}
                                        alt="product"
                                        className="w-20 h-20 object-cover"
                                    />

                                    <div className="flex flex-col">
                                        <h3 className="text-sm text-gray-800 dark:text-slate-100">
                                            {cart.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">
                                            {cart.quantity} × ৳
                                            {getCartUnitPrice(cart).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteCart(cart.id)}
                                    className="text-gray-600 dark:text-gray-400 pr-2"
                                >
                                    <XCircleIcon className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                                </button>
                            </div>
                            ))}
                        </div>

                        <div className="flex shrink-0 justify-between border-t border-gray-200 p-4 dark:border-slate-700">
                            <p className="uppercase text-gray-600 text-sm font-medium">
                                Subtotal:
                            </p>
                            <p className="text-gray-600 text-sm font-semibold">
                                ৳{" "}
                                {carts
                                    .reduce(
                                        (total, cart) =>
                                            total +
                                            getCartUnitPrice(cart) *
                                                (Number(cart.quantity) || 0),
                                        0,
                                    )
                                    .toFixed(2)}
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-col justify-between gap-2 border-t border-gray-200 p-4 min-[380px]:flex-row dark:border-slate-700">
                            <Link
                                href={route("cart.index")}
                                className="bg-gray-500 px-4 py-2 text-center text-white hover:bg-gray-600 sm:px-8"
                            >
                                View Cart
                            </Link>
                            <Link
                                href={route("checkout.index")}
                                className="bg-red-500 px-4 py-2 text-center text-white hover:bg-red-600 sm:px-8"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
