import AdminLayout from "@/Layouts/AdminLayout";
import {
    EyeIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ products, categories = [], filters = {} }) {
    const flash = usePage().props.flash;
    const [search, setSearch] = useState(filters.search ?? "");
    const [category, setCategory] = useState(filters.category ?? "");
    const [stock, setStock] = useState(filters.stock ?? "");

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(
            route("admin.products.index"),
            { search, category, stock },
            { preserveState: true, replace: true },
        );
    };

    const removeProduct = (product) => {
        if (
            window.confirm(`Delete “${product.name}”? This cannot be undone.`)
        ) {
            router.delete(route("admin.products.destroy", product.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title="Manage Products"
            subtitle={`${products.total} catalog products`}
            actions={
                <Link
                    href={route("admin.products.create")}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                    <PlusIcon className="size-5" />
                    <span className="hidden sm:inline">Add Product</span>
                </Link>
            }
        >
            <Head title="Manage Products" />
            {flash?.success && (
                <div className="mb-5 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800">
                    {flash.success}
                </div>
            )}

            <form
                onSubmit={applyFilters}
                className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_12rem_12rem_auto] dark:border-slate-700 dark:bg-slate-800"
            >
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name, category..."
                        className="w-full rounded-lg border-slate-300 py-2.5 pl-10 focus:border-red-500 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-900"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-900"
                >
                    <option value="">All categories</option>
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
                <select
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="rounded-lg border-slate-300 focus:border-red-500 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-900"
                >
                    <option value="">All stock</option>
                    <option value="in-stock">In stock</option>
                    <option value="low-stock">Low stock</option>
                    <option value="out-of-stock">Out of stock</option>
                </select>
                <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-red-600"
                >
                    Filter
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-5 py-4">Product</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Stock</th>
                                <th className="px-5 py-4">Rating</th>
                                <th className="px-5 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {products.data.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/40"
                                >
                                    <td className="px-5 py-3">
                                        <div className="flex min-w-64 items-center gap-3">
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="size-12 rounded-lg bg-slate-100 object-cover"
                                            />
                                            <div>
                                                <p className="line-clamp-1 font-semibold">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {product.category}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-5 py-3 font-semibold">
                                        ${Number(product.price).toFixed(2)}
                                        {product.discount_price > 0 && (
                                            <span className="ml-2 text-xs text-red-600">
                                                -{product.discount_price}%
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock > 10 ? "bg-emerald-100 text-emerald-700" : product.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-sm">
                                        {product.rating}/5
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route(
                                                    "product.show",
                                                    product.id,
                                                )}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                title="View"
                                            >
                                                <EyeIcon className="size-5" />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "admin.products.edit",
                                                    product.id,
                                                )}
                                                className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                                title="Edit"
                                            >
                                                <PencilSquareIcon className="size-5" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeProduct(product)
                                                }
                                                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <TrashIcon className="size-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.data.length === 0 && (
                        <div className="p-16 text-center text-slate-500">
                            No products match these filters.
                        </div>
                    )}
                </div>
                {products.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
                        {products.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                    className={`rounded-lg px-3 py-2 text-sm ${link.active ? "bg-red-600 text-white" : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700"}`}
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
            </div>
        </AdminLayout>
    );
}
