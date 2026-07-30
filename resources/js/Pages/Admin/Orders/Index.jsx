import AdminLayout from "@/Layouts/AdminLayout";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
const statusClass = {
    completed: "bg-emerald-100 text-emerald-700",
    delivered: "bg-emerald-100 text-emerald-700",
    shipped: "bg-violet-100 text-violet-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    paid: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
};

export default function Index({ orders, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [status, setStatus] = useState(filters.status ?? "");
    const [paymentStatus, setPaymentStatus] = useState(
        filters.payment_status ?? "",
    );
    const submit = (event) => {
        event.preventDefault();
        router.get(
            route("admin.orders.index"),
            { search, status, payment_status: paymentStatus },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Orders"
            subtitle={`${orders.total} customer orders`}
        >
            <Head title="Orders" />
            <form
                onSubmit={submit}
                className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_12rem_12rem_auto] dark:border-slate-700 dark:bg-slate-800"
            >
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Order number, customer, email..."
                        className="w-full rounded-lg border-slate-300 py-2.5 pl-10 focus:border-red-500 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-900"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                >
                    <option value="">All order status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                >
                    <option value="">All payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                </select>
                <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-red-600">
                    Filter
                </button>
            </form>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-900/40">
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-5 py-4">Order</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Items</th>
                                <th className="px-5 py-4">Total</th>
                                <th className="px-5 py-4">Order Status</th>
                                <th className="px-5 py-4">Payment</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/40"
                                >
                                    <td className="whitespace-nowrap px-5 py-3 text-sm font-bold">
                                        {order.order_number}
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3">
                                        <p className="text-sm font-semibold">
                                            {order.customer_name ??
                                                order.user?.name ??
                                                "Guest"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {order.customer_email ??
                                                order.user?.email ??
                                                "—"}
                                        </p>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 text-sm">
                                        {order.items_count} products
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 font-bold">
                                        {money.format(Number(order.total))}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass[order.status] ?? "bg-slate-100 text-slate-700"}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass[order.payment_status] ?? "bg-amber-100 text-amber-700"}`}
                                        >
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                                        {new Date(
                                            order.ordered_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Link
                                            href={route(
                                                "admin.orders.show",
                                                order.id,
                                            )}
                                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-red-600 hover:text-white dark:bg-slate-700"
                                        >
                                            <EyeIcon className="size-4" />{" "}
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.data.length === 0 && (
                        <div className="py-20 text-center text-sm text-slate-500">
                            No orders found.
                        </div>
                    )}
                </div>
                {orders.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-2 border-t p-4 dark:border-slate-700">
                        {orders.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                    className={`rounded-lg px-3 py-2 text-sm ${link.active ? "bg-red-600 text-white" : "bg-slate-100 dark:bg-slate-700"}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="px-3 py-2 text-sm text-slate-400"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </section>
        </AdminLayout>
    );
}
