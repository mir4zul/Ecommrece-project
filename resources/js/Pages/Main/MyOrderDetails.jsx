import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function MyOrderDetails({ order, carts = [], wishlists = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const currentStep = steps.indexOf(order.status);
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
                    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row">
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
                    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                        <h2 className="font-bold">Order Tracking</h2>
                        {order.status === "cancelled" ? (
                            <div className="mt-5 rounded-xl bg-red-100 p-4 font-semibold text-red-700">
                                This order was cancelled.
                            </div>
                        ) : (
                            <div className="mt-8 grid grid-cols-5 gap-1">
                                {steps.map((step, index) => (
                                    <div key={step} className="text-center">
                                        <div
                                            className={`mx-auto size-5 rounded-full border-4 ${index <= currentStep || order.status === "completed" ? "border-red-600 bg-red-600" : "border-gray-300 bg-white"}`}
                                        />
                                        <div
                                            className={`mt-2 h-1 ${index < currentStep ? "bg-red-600" : "bg-gray-200"}`}
                                        />
                                        <p className="mt-2 text-[10px] font-semibold capitalize sm:text-xs">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {order.tracking_number && (
                            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                                <strong>Courier:</strong> {order.courier_name}
                                <br />
                                <strong>Tracking:</strong>{" "}
                                {order.tracking_number}
                            </div>
                        )}
                    </section>
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
                    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="font-bold">Status History</h2>
                        <div className="mt-5 space-y-4 border-l-2 border-gray-200 pl-5">
                            <div>
                                <p className="text-sm font-semibold">
                                    Order placed
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(
                                        order.ordered_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            {[...(order.histories ?? [])]
                                .reverse()
                                .map((history) => (
                                    <div key={history.id}>
                                        <p className="text-sm font-semibold capitalize">
                                            {history.to_status}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                history.created_at,
                                            ).toLocaleString()}
                                        </p>
                                        {history.note && (
                                            <p className="mt-1 text-sm text-gray-600">
                                                {history.note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
