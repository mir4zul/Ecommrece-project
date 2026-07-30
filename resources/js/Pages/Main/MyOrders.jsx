import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
const statusClass = {
    delivered: "bg-emerald-100 text-emerald-700",
    shipped: "bg-violet-100 text-violet-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-cyan-100 text-cyan-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-emerald-100 text-emerald-700",
};

export default function MyOrders({ orders, carts = [], wishlists = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <>
            <Head title="My Orders" />
            <div className="min-h-screen bg-gray-50">
                <div className="h-[85px] bg-slate-900">
                    <Header
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        carts={carts}
                        wishlists={wishlists}
                    />
                </div>
                <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                        Order history
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>
                    <div className="mt-8 space-y-4">
                        {orders.data.map((order) => (
                            <article
                                key={order.id}
                                className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center"
                            >
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="font-bold">
                                            {order.order_number}
                                        </h2>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass[order.status] ?? "bg-gray-100 text-gray-700"}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {new Date(
                                            order.ordered_at,
                                        ).toLocaleDateString()}{" "}
                                        · {order.items_count} products
                                    </p>
                                    <p className="mt-2 text-lg font-bold">
                                        {money.format(Number(order.total))}
                                    </p>
                                </div>
                                <Link
                                    href={route("orders.show", order.id)}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                                >
                                    <EyeIcon className="size-4" /> Track Order
                                </Link>
                            </article>
                        ))}
                        {orders.data.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                                <h2 className="text-xl font-semibold">
                                    No orders yet
                                </h2>
                                <Link
                                    href={route("products.shopLeftSidebar")}
                                    className="mt-5 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                    {orders.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {orders.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`rounded-lg px-3 py-2 text-sm ${link.active ? "bg-red-600 text-white" : "bg-white"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-gray-400"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
