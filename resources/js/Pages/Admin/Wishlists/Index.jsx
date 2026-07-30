import AdminLayout from "@/Layouts/AdminLayout";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function Index({ wishlists, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? "");

    const submit = (event) => {
        event.preventDefault();
        router.get(
            route("admin.wishlists.index"),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Wishlist"
            subtitle={`${wishlists.total} products saved by customers`}
        >
            <Head title="Customer Wishlists" />

            <form
                onSubmit={submit}
                className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-700 dark:bg-slate-800"
            >
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search customer, email, product or category..."
                        className="w-full rounded-lg border-slate-300 py-2.5 pl-10 focus:border-red-500 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-900"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-red-600"
                >
                    Search
                </button>
                {filters.search && (
                    <Link
                        href={route("admin.wishlists.index")}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 text-center text-sm font-semibold dark:border-slate-600"
                    >
                        Clear
                    </Link>
                )}
            </form>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-900/40">
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-5 py-4 font-semibold">
                                    Customer
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Product Information
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Price
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Stock
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Rating
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Saved Date
                                </th>
                                <th className="px-5 py-4 text-right font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {wishlists.data.map((wishlist) => {
                                const product = wishlist.product;
                                const regularPrice = Number(
                                    product?.price ?? wishlist.price ?? 0,
                                );
                                const discount = Number(
                                    product?.discount_price ?? 0,
                                );
                                const salePrice =
                                    regularPrice -
                                    (regularPrice * discount) / 100;

                                return (
                                    <tr
                                        key={wishlist.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/40"
                                    >
                                        <td className="whitespace-nowrap px-5 py-3">
                                            <p className="text-sm font-semibold">
                                                {wishlist.user?.name ??
                                                    "Unknown user"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {wishlist.user?.email ?? "—"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex min-w-64 items-center gap-3">
                                                <img
                                                    src={
                                                        product?.image ??
                                                        wishlist.image
                                                    }
                                                    alt=""
                                                    className="size-12 rounded-lg bg-slate-100 object-cover"
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">
                                                        {product?.name ??
                                                            wishlist.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {product?.category ??
                                                            "Uncategorized"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3">
                                            <p className="text-sm font-bold">
                                                {currencyFormatter.format(
                                                    salePrice,
                                                )}
                                            </p>
                                            {discount > 0 && (
                                                <p className="text-xs text-red-600">
                                                    {discount}% off
                                                </p>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    product?.stock > 10
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : product?.stock > 0
                                                          ? "bg-amber-100 text-amber-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {product?.stock ?? 0} units
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3 text-sm font-semibold text-amber-500">
                                            ★ {product?.rating ?? 0}/5
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                                            {new Date(
                                                wishlist.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {product && (
                                                <Link
                                                    href={route(
                                                        "product.show",
                                                        product.id,
                                                    )}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-red-600 hover:text-white dark:bg-slate-700 dark:text-slate-200"
                                                >
                                                    <EyeIcon className="size-4" />
                                                    View Product
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {wishlists.data.length === 0 && (
                        <div className="px-5 py-20 text-center text-sm text-slate-500">
                            No wishlist products found.
                        </div>
                    )}
                </div>

                {wishlists.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
                        {wishlists.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                    className={`rounded-lg px-3 py-2 text-sm ${
                                        link.active
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={index}
                                    className="rounded-lg px-3 py-2 text-sm text-slate-400"
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
