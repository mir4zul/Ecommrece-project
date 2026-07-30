import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import OrderTimeline from "@/Components/Orders/OrderTimeline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function MyOrderDetails({ order, carts = [], wishlists = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <>
            <Head title={order.order_number} />
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
                    <Link
                        href={route("orders.index")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600"
                    >
                        <ArrowLeftIcon className="size-4" /> My Orders
                    </Link>
                    <div
                        id="order-info"
                        className="scroll-mt-24 mt-5 flex flex-col justify-between gap-4 sm:flex-row"
                    >
                        <div>
                            <p className="text-sm text-gray-500">
                                Order number
                            </p>
                            <h1 className="text-2xl font-bold">
                                {order.order_number}
                            </h1>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-sm text-gray-500">Order total</p>
                            <p className="text-2xl font-bold">
                                {money.format(Number(order.total))}
                            </p>
                        </div>
                    </div>
                    <nav className="sticky top-0 z-20 mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white/95 px-3 shadow-sm backdrop-blur">
                        <div className="flex min-w-max items-center gap-1 py-2 text-sm font-semibold">
                            <a
                                href="#order-info"
                                className="rounded-lg px-4 py-2 hover:bg-red-50 hover:text-red-600"
                            >
                                Order Info
                            </a>
                            <a
                                href="#order-timeline"
                                className="rounded-lg px-4 py-2 hover:bg-red-50 hover:text-red-600"
                            >
                                Order Timeline
                            </a>
                            <a
                                href="#order-products"
                                className="rounded-lg px-4 py-2 hover:bg-red-50 hover:text-red-600"
                            >
                                Products
                            </a>
                            <a
                                href="#delivery-payment"
                                className="rounded-lg px-4 py-2 hover:bg-red-50 hover:text-red-600"
                            >
                                Delivery & Payment
                            </a>
                        </div>
                    </nav>
                    <section
                        id="order-timeline"
                        className="scroll-mt-24 mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
                    >
                        <h2 className="font-bold">Order Timeline</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Confirmation থেকে delivery পর্যন্ত live progress
                        </p>
                        <div className="mt-7">
                            <OrderTimeline order={order} />
                        </div>
                        {order.courier_name && (
                            <div className="mt-6 grid gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-900 sm:grid-cols-3">
                                <p>
                                    <span className="block text-xs text-blue-600">
                                        Courier
                                    </span>
                                    <strong className="capitalize">
                                        {order.courier_name}
                                    </strong>
                                </p>
                                <p>
                                    <span className="block text-xs text-blue-600">
                                        Booking status
                                    </span>
                                    <strong className="capitalize">
                                        {order.courier_booking_status?.replaceAll(
                                            "_",
                                            " ",
                                        ) ?? "Pending"}
                                    </strong>
                                </p>
                                <p>
                                    <span className="block text-xs text-blue-600">
                                        Tracking
                                    </span>
                                    <strong>
                                        {order.tracking_number ?? "Waiting"}
                                    </strong>
                                </p>
                            </div>
                        )}
                    </section>
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
                        <section
                            id="order-products"
                            className="scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <h2 className="border-b p-5 font-bold">Products</h2>
                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 p-5"
                                    >
                                        <img
                                            src={item.product?.image}
                                            alt=""
                                            className="size-20 rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold">
                                                {item.product_name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} ×{" "}
                                                {money.format(
                                                    Number(item.price),
                                                )}
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            {money.format(
                                                Number(item.line_total),
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <aside
                            id="delivery-payment"
                            className="scroll-mt-24 h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <h2 className="font-bold">Summary</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt>Payment</dt>
                                    <dd className="font-semibold capitalize">
                                        {order.payment_status}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Subtotal</dt>
                                    <dd>
                                        {money.format(Number(order.subtotal))}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Shipping</dt>
                                    <dd>
                                        {money.format(Number(order.shipping))}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t pt-3 text-base font-bold">
                                    <dt>Total</dt>
                                    <dd>{money.format(Number(order.total))}</dd>
                                </div>
                            </dl>
                            <h3 className="mt-6 font-bold">Delivery Address</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                {order.customer_name}
                                <br />
                                {order.shipping_address}
                                <br />
                                {order.shipping_city}{" "}
                                {order.shipping_postal_code}
                                <br />
                                {order.customer_phone}
                            </p>
                        </aside>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
