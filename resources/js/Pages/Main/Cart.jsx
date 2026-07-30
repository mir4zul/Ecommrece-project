import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Cart({ carts = [], wishlists = [], summary = {} }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const flash = usePage().props.flash;

    const updateQuantity = (cart, quantity) => {
        if (quantity < 1 || quantity > cart.stock) return;
        router.patch(
            route("cart.update", cart.id),
            { quantity },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="min-h-screen bg-gray-50">
                <div className="h-[85px] bg-slate-900">
                    <Header
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        carts={carts}
                        wishlists={wishlists}
                    />
                </div>
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                            Your selection
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>
                    </div>
                    {flash?.success && (
                        <div className="mb-5 rounded-lg bg-emerald-100 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}
                    {carts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Your cart is empty
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Add products before checking out.
                            </p>
                            <Link
                                href={route("products.shopLeftSidebar")}
                                className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
                            <section className="space-y-4">
                                {carts.map((cart) => (
                                    <article
                                        key={cart.id}
                                        className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[7rem_1fr_auto] sm:items-center"
                                    >
                                        <img
                                            src={cart.image}
                                            alt={cart.name}
                                            className="aspect-square w-28 rounded-xl bg-gray-100 object-cover"
                                        />
                                        <div className="min-w-0">
                                            <h2 className="font-semibold text-gray-900">
                                                {cart.name}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                $
                                                {Number(
                                                    cart.unit_price,
                                                ).toFixed(2)}{" "}
                                                each
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {cart.stock} available
                                            </p>
                                            <div className="mt-4 inline-flex items-center overflow-hidden rounded-lg border border-gray-300">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            cart,
                                                            cart.quantity - 1,
                                                        )
                                                    }
                                                    className="p-2 hover:bg-gray-100"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <MinusIcon className="size-4" />
                                                </button>
                                                <span className="min-w-10 px-2 text-center text-sm font-semibold">
                                                    {cart.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            cart,
                                                            cart.quantity + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        cart.quantity >=
                                                        cart.stock
                                                    }
                                                    className="p-2 hover:bg-gray-100 disabled:opacity-30"
                                                    aria-label="Increase quantity"
                                                >
                                                    <PlusIcon className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                                            <p className="font-bold text-gray-900">
                                                $
                                                {Number(
                                                    cart.line_total,
                                                ).toFixed(2)}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            "remove-from-cart",
                                                            cart.id,
                                                        ),
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                                className="mt-3 inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                            >
                                                <TrashIcon className="size-4" />{" "}
                                                Remove
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </section>
                            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                                <h2 className="text-lg font-bold">
                                    Order Summary
                                </h2>
                                <dl className="mt-5 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">
                                            Subtotal
                                        </dt>
                                        <dd className="font-semibold">
                                            $
                                            {Number(summary.subtotal).toFixed(
                                                2,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">
                                            Shipping
                                        </dt>
                                        <dd className="font-semibold">
                                            {Number(summary.shipping) === 0
                                                ? "Free"
                                                : `$${Number(summary.shipping).toFixed(2)}`}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-4 text-base">
                                        <dt className="font-bold">Total</dt>
                                        <dd className="font-bold">
                                            ${Number(summary.total).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>
                                <Link
                                    href={route("checkout.index")}
                                    className="mt-6 block w-full rounded-lg bg-red-600 px-5 py-3 text-center font-semibold text-white hover:bg-red-700"
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href={route("products.shopLeftSidebar")}
                                    className="mt-3 block text-center text-sm font-medium text-gray-500 hover:text-red-600"
                                >
                                    Continue Shopping
                                </Link>
                            </aside>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
