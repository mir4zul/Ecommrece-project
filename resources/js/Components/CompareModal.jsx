import { router } from "@inertiajs/react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {
    clearCompareProducts,
    getCompareProducts,
    MAX_COMPARE_PRODUCTS,
    removeCompareProduct,
} from "@/utils/compareProducts";

const salePrice = (product) =>
    product.discount_price > 0
        ? (
              Number(product.price) -
              (Number(product.price) * product.discount_price) / 100
          ).toFixed(2)
        : Number(product.price).toFixed(2);

export default function CompareModal({ open, onClose, message = "" }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!open) return;

        const refreshProducts = () => setProducts(getCompareProducts());
        refreshProducts();
        window.addEventListener("compare-products-updated", refreshProducts);

        return () =>
            window.removeEventListener(
                "compare-products-updated",
                refreshProducts,
            );
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") onClose();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
                    <div>
                        <h2
                            id="compare-title"
                            className="text-xl font-bold text-gray-900 sm:text-2xl"
                        >
                            Compare Products
                        </h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Select up to {MAX_COMPARE_PRODUCTS} products.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-red-600"
                        aria-label="Close comparison"
                    >
                        <XMarkIcon className="size-6" />
                    </button>
                </div>

                {message && (
                    <p className="mx-4 mt-4 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200 sm:mx-6">
                        {message}
                    </p>
                )}

                <div className="overflow-auto p-4 sm:p-6">
                    {products.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-lg font-semibold text-gray-700">
                                No products selected
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Use a product’s Compare button to add it here.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`grid gap-4 ${
                                products.length > 1 ? "min-w-[42rem]" : ""
                            }`}
                            style={{
                                gridTemplateColumns: `repeat(${products.length}, minmax(13rem, 1fr))`,
                            }}
                        >
                            {products.map((product) => (
                                <article
                                    key={product.id}
                                    className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800"
                                >
                                    <div className="relative aspect-square bg-gray-100">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProducts(
                                                    removeCompareProduct(
                                                        product.id,
                                                    ),
                                                )
                                            }
                                            className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-gray-700 shadow hover:text-red-600"
                                            aria-label={`Remove ${product.name}`}
                                        >
                                            <XMarkIcon className="size-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-3 p-4 text-sm">
                                        <h3 className="min-h-12 font-semibold text-gray-900">
                                            {product.name}
                                        </h3>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon
                                                    key={star}
                                                    className={`size-4 ${
                                                        product.rating >= star
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <dl className="divide-y divide-gray-200">
                                            <div className="flex justify-between gap-2 py-2">
                                                <dt className="text-gray-500">
                                                    Price
                                                </dt>
                                                <dd className="font-semibold text-gray-900">
                                                    ${salePrice(product)}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between gap-2 py-2">
                                                <dt className="text-gray-500">
                                                    Discount
                                                </dt>
                                                <dd className="text-gray-800">
                                                    {product.discount_price > 0
                                                        ? `${product.discount_price}%`
                                                        : "—"}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between gap-2 py-2">
                                                <dt className="text-gray-500">
                                                    Stock
                                                </dt>
                                                <dd className="text-gray-800">
                                                    {product.stock}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between gap-2 py-2">
                                                <dt className="text-gray-500">
                                                    Status
                                                </dt>
                                                <dd
                                                    className={
                                                        product.stock > 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {product.stock > 0
                                                        ? "In stock"
                                                        : "Out of stock"}
                                                </dd>
                                            </div>
                                        </dl>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                router.visit(
                                                    route(
                                                        "product.show",
                                                        product.id,
                                                    ),
                                                );
                                            }}
                                            className="w-full rounded-md bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {products.length > 0 && (
                    <div className="flex justify-end border-t border-gray-200 px-4 py-3 sm:px-6">
                        <button
                            type="button"
                            onClick={() => setProducts(clearCompareProducts())}
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                            Clear comparison
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
