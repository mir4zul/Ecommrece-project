import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function Show({ order }) {
    const flash = usePage().props.flash;
    const transitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        completed: [],
        cancelled: [],
    };
    const nextStatuses = transitions[order.status] ?? [];
    const { data, setData, patch, processing, errors } = useForm({
        status: nextStatuses[0] ?? "",
        note: "",
        courier_name: order.courier_name ?? "",
        tracking_number: order.tracking_number ?? "",
    });
    const paymentForm = useForm({ payment_status: order.payment_status });
    const updateStatus = (event) => {
        event.preventDefault();
        patch(route("admin.orders.status", order.id), { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={`Order ${order.order_number}`}
            subtitle="Complete order and customer information"
            actions={
                <Link
                    href={route("admin.orders.index")}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-600"
                >
                    <ArrowLeftIcon className="size-4" /> Back
                </Link>
            }
        >
            <Head title={order.order_number} />
            {flash?.success && (
                <div className="mb-5 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800">
                    {flash.success}
                </div>
            )}
            <div className="grid gap-6 xl:grid-cols-3">
                <section className="space-y-6 xl:col-span-2">
                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b px-5 py-4 dark:border-slate-700">
                            <h2 className="font-bold">Order Items</h2>
                        </div>
                        <div className="divide-y dark:divide-slate-700">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                                >
                                    <img
                                        src={item.product?.image}
                                        alt=""
                                        className="size-20 rounded-xl bg-slate-100 object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold">
                                            {item.product_name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {item.product?.category ??
                                                "Product"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {item.quantity} ×{" "}
                                            {money.format(Number(item.price))}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold">
                                            {money.format(
                                                Number(item.line_total),
                                            )}
                                        </p>
                                        {item.product && (
                                            <Link
                                                href={route(
                                                    "product.show",
                                                    item.product.id,
                                                )}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                title="View product"
                                            >
                                                <EyeIcon className="size-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h2 className="font-bold">Delivery Information</h2>
                        <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">Customer</dt>
                                <dd className="mt-1 font-semibold">
                                    {order.customer_name ?? order.user?.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Email</dt>
                                <dd className="mt-1 font-semibold">
                                    {order.customer_email ?? order.user?.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Phone</dt>
                                <dd className="mt-1 font-semibold">
                                    {order.customer_phone ?? "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">
                                    City / Postal code
                                </dt>
                                <dd className="mt-1 font-semibold">
                                    {order.shipping_city ?? "—"}{" "}
                                    {order.shipping_postal_code}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-slate-500">
                                    Shipping address
                                </dt>
                                <dd className="mt-1 font-semibold">
                                    {order.shipping_address ?? "—"}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h2 className="font-bold">Order Timeline</h2>
                        <div className="mt-5 space-y-5 border-l-2 border-slate-200 pl-5 dark:border-slate-700">
                            <div className="relative">
                                <span className="absolute -left-[1.7rem] top-1 size-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800" />
                                <p className="text-sm font-semibold">
                                    Order placed
                                </p>
                                <p className="text-xs text-slate-500">
                                    {new Date(
                                        order.ordered_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            {[...(order.histories ?? [])]
                                .reverse()
                                .map((history) => (
                                    <div key={history.id} className="relative">
                                        <span className="absolute -left-[1.7rem] top-1 size-3 rounded-full bg-red-500 ring-4 ring-white dark:ring-slate-800" />
                                        <p className="text-sm font-semibold capitalize">
                                            {history.from_status} →{" "}
                                            {history.to_status}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(
                                                history.created_at,
                                            ).toLocaleString()}{" "}
                                            by {history.user?.name ?? "System"}
                                        </p>
                                        {history.note && (
                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                                {history.note}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </article>
                </section>
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24 dark:border-slate-700 dark:bg-slate-800">
                    {nextStatuses.length > 0 && (
                        <form
                            onSubmit={updateStatus}
                            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30"
                        >
                            <h2 className="font-bold text-red-900 dark:text-red-100">
                                Update Fulfillment
                            </h2>
                            <label className="mt-4 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Next status
                                <select
                                    value={data.status}
                                    onChange={(event) =>
                                        setData("status", event.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border-slate-300 bg-white capitalize dark:border-slate-600 dark:bg-slate-900"
                                >
                                    {nextStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {data.status === "shipped" && (
                                <div className="mt-3 space-y-3">
                                    <label className="block text-xs font-semibold">
                                        Courier
                                        <input
                                            value={data.courier_name}
                                            onChange={(event) =>
                                                setData(
                                                    "courier_name",
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                        />
                                    </label>
                                    {errors.courier_name && (
                                        <p className="text-xs text-red-600">
                                            {errors.courier_name}
                                        </p>
                                    )}
                                    <label className="block text-xs font-semibold">
                                        Tracking number
                                        <input
                                            value={data.tracking_number}
                                            onChange={(event) =>
                                                setData(
                                                    "tracking_number",
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                        />
                                    </label>
                                    {errors.tracking_number && (
                                        <p className="text-xs text-red-600">
                                            {errors.tracking_number}
                                        </p>
                                    )}
                                </div>
                            )}
                            <label className="mt-3 block text-xs font-semibold">
                                Admin note
                                <textarea
                                    rows="2"
                                    value={data.note}
                                    onChange={(event) =>
                                        setData("note", event.target.value)
                                    }
                                    className="mt-1 w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                                />
                            </label>
                            {errors.status && (
                                <p className="mt-2 text-xs text-red-600">
                                    {errors.status}
                                </p>
                            )}
                            <button
                                disabled={processing}
                                className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing ? "Updating..." : "Update Order"}
                            </button>
                        </form>
                    )}
                    <div className="mb-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                        <h2 className="font-bold">Payment Status</h2>
                        <select
                            value={paymentForm.data.payment_status}
                            onChange={(event) =>
                                paymentForm.setData(
                                    "payment_status",
                                    event.target.value,
                                )
                            }
                            className="mt-3 w-full rounded-lg border-slate-300 bg-white capitalize dark:border-slate-600 dark:bg-slate-900"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                        <button
                            type="button"
                            onClick={() =>
                                paymentForm.patch(
                                    route("admin.orders.payment", order.id),
                                    { preserveScroll: true },
                                )
                            }
                            disabled={paymentForm.processing}
                            className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-700"
                        >
                            Save Payment
                        </button>
                    </div>{" "}
                    <h2 className="font-bold">Order Summary</h2>
                    <dl className="mt-5 space-y-4 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Status</dt>
                            <dd className="font-semibold capitalize">
                                {order.status}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Payment</dt>
                            <dd className="font-semibold capitalize">
                                {order.payment_status}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Method</dt>
                            <dd className="font-semibold capitalize">
                                {order.payment_method?.replaceAll("_", " ")}
                            </dd>
                        </div>
                        <div className="flex justify-between border-t pt-4 dark:border-slate-700">
                            <dt>Subtotal</dt>
                            <dd>{money.format(Number(order.subtotal))}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>Discount</dt>
                            <dd>-{money.format(Number(order.discount))}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt>Shipping</dt>
                            <dd>{money.format(Number(order.shipping))}</dd>
                        </div>
                        <div className="flex justify-between border-t pt-4 text-lg font-bold dark:border-slate-700">
                            <dt>Total</dt>
                            <dd>{money.format(Number(order.total))}</dd>
                        </div>
                    </dl>
                    <p className="mt-5 text-xs text-slate-500">
                        Ordered {new Date(order.ordered_at).toLocaleString()}
                    </p>
                </aside>
            </div>
        </AdminLayout>
    );
}
