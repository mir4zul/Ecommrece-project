import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function OrderSuccess({ order, carts = [], wishlists = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <>
            <Head title="Order Confirmed" />
            <div className="min-h-screen bg-gray-50">
                <div className="h-[85px] bg-slate-900">
                    <Header
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        carts={carts}
                        wishlists={wishlists}
                    />
                </div>
                <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-10">
                        <CheckCircleIcon className="mx-auto size-20 text-emerald-500" />
                        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                            Order received
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Thank you for your order
                        </h1>
                        <p className="mt-3 text-gray-500">
                            Your order number is{" "}
                            <strong className="text-gray-800">
                                {order.order_number}
                            </strong>
                            .
                        </p>
                        <div className="mt-8 rounded-xl bg-gray-50 p-5 text-left">
                            <div className="flex justify-between border-b pb-4">
                                <span className="text-gray-500">Status</span>
                                <span className="font-semibold capitalize">
                                    {order.status}
                                </span>
                            </div>
                            <div className="mt-4 flex justify-between border-b pb-4">
                                <span className="text-gray-500">Payment</span>
                                <span className="font-semibold capitalize">
                                    {order.payment_status}
                                </span>
                            </div>
                            <div className="mt-4 space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between gap-4 text-sm"
                                    >
                                        <span>
                                            {item.product_name} ×{" "}
                                            {item.quantity}
                                        </span>
                                        <span className="font-semibold">
                                            ৳
                                            {Number(item.line_total).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 flex justify-between border-t pt-4 text-lg font-bold">
                                <span>Total</span>
                                <span>৳{Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                        <Link
                            href={route("products.shopLeftSidebar")}
                            className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
