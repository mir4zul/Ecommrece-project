import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import ProductCard from "@/Components/Home/ProductCard";
import {
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";

const getSalePrice = (product) => {
    const price = Number(product.price) || 0;
    const discount = Number(product.discount_price) || 0;

    return price - (price * discount) / 100;
};

export default function ShopLeftSidebar({
    products = [],
    carts,
    wishlists,
    initialSearch = "",
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [maxPrice, setMaxPrice] = useState(() =>
        Math.ceil(Math.max(...products.map(getSalePrice), 0)),
    );
    const [minimumRating, setMinimumRating] = useState(0);
    const [availability, setAvailability] = useState("all");
    const [onlyNew, setOnlyNew] = useState(false);
    const [onlyTopRated, setOnlyTopRated] = useState(false);
    const [sortBy, setSortBy] = useState("featured");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { get } = useForm();

    const categories = useMemo(
        () =>
            [
                ...new Set(
                    products.map((product) => product.category).filter(Boolean),
                ),
            ].sort(),
        [products],
    );

    const priceLimit = useMemo(
        () => Math.ceil(Math.max(...products.map(getSalePrice), 0)),
        [products],
    );

    const filteredProducts = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const result = products.filter((product) => {
            const matchesSearch =
                !normalizedSearch ||
                product.name?.toLowerCase().includes(normalizedSearch) ||
                product.category?.toLowerCase().includes(normalizedSearch) ||
                product.description?.toLowerCase().includes(normalizedSearch);
            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;
            const matchesPrice = getSalePrice(product) <= maxPrice;
            const matchesRating = Number(product.rating) >= minimumRating;
            const stock = Number(product.stock) || 0;
            const matchesAvailability =
                availability === "all" ||
                (availability === "in-stock" && stock > 10) ||
                (availability === "low-stock" && stock > 0 && stock <= 10) ||
                (availability === "out-of-stock" && stock <= 0);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesRating &&
                matchesAvailability &&
                (!onlyNew || product.is_new) &&
                (!onlyTopRated || product.is_top_rated)
            );
        });

        return result.sort((first, second) => {
            if (sortBy === "price-low") {
                return getSalePrice(first) - getSalePrice(second);
            }
            if (sortBy === "price-high") {
                return getSalePrice(second) - getSalePrice(first);
            }
            if (sortBy === "rating") {
                return Number(second.rating) - Number(first.rating);
            }
            if (sortBy === "name") {
                return first.name.localeCompare(second.name);
            }

            return Number(second.is_top_rated) - Number(first.is_top_rated);
        });
    }, [
        availability,
        maxPrice,
        minimumRating,
        onlyNew,
        onlyTopRated,
        products,
        search,
        selectedCategory,
        sortBy,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / perPage),
    );
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pageStart = (safeCurrentPage - 1) * perPage;
    const paginatedProducts = filteredProducts.slice(
        pageStart,
        pageStart + perPage,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        availability,
        maxPrice,
        minimumRating,
        onlyNew,
        onlyTopRated,
        perPage,
        search,
        selectedCategory,
        sortBy,
    ]);

    const changePage = (page) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
        document
            .getElementById("product-results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const resetFilters = () => {
        setSearch("");
        setSelectedCategory("all");
        setMaxPrice(priceLimit);
        setMinimumRating(0);
        setAvailability("all");
        setOnlyNew(false);
        setOnlyTopRated(false);
        setSortBy("featured");
        router.get(
            route("products.shopLeftSidebar"),
            {},
            { replace: true, preserveScroll: true },
        );
    };

    const showProduct = (id) => get(route("product.show", id));

    const filterPanel = (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">
                    Filters
                </h2>
                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                    Reset all
                </button>
            </div>

            <fieldset>
                <legend className="font-semibold text-gray-800">
                    Categories
                </legend>
                <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-2">
                    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === "all"}
                                onChange={() => setSelectedCategory("all")}
                                className="text-red-600 focus:ring-red-500"
                            />
                            All categories
                        </span>
                        <span className="text-xs text-gray-400">
                            {products.length}
                        </span>
                    </label>
                    {categories.map((category) => (
                        <label
                            key={category}
                            className="flex cursor-pointer items-center justify-between gap-3 text-sm text-gray-600"
                        >
                            <span className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === category}
                                    onChange={() =>
                                        setSelectedCategory(category)
                                    }
                                    className="text-red-600 focus:ring-red-500"
                                />
                                {category}
                            </span>
                            <span className="text-xs text-gray-400">
                                {
                                    products.filter(
                                        (product) =>
                                            product.category === category,
                                    ).length
                                }
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="font-semibold text-gray-800">Price</legend>
                <input
                    type="range"
                    min="0"
                    max={priceLimit || 1}
                    value={Math.min(maxPrice, priceLimit || 1)}
                    onChange={(event) =>
                        setMaxPrice(Number(event.target.value))
                    }
                    className="mt-4 w-full accent-red-600"
                />
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>Up to ${maxPrice}</span>
                </div>
            </fieldset>

            <fieldset>
                <legend className="font-semibold text-gray-800">Rating</legend>
                <div className="mt-3 space-y-2">
                    {[0, 4, 3, 2].map((rating) => (
                        <label
                            key={rating}
                            className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                        >
                            <input
                                type="radio"
                                name="rating"
                                checked={minimumRating === rating}
                                onChange={() => setMinimumRating(rating)}
                                className="text-red-600 focus:ring-red-500"
                            />
                            {rating === 0
                                ? "All ratings"
                                : `${rating} stars & up`}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset>
                <legend className="font-semibold text-gray-800">
                    Availability
                </legend>
                <select
                    value={availability}
                    onChange={(event) => setAvailability(event.target.value)}
                    className="mt-3 w-full rounded-md border-gray-300 bg-white text-sm text-gray-700 focus:border-red-500 focus:ring-red-500"
                >
                    <option value="all">All products</option>
                    <option value="in-stock">In stock</option>
                    <option value="low-stock">Low stock</option>
                    <option value="out-of-stock">Out of stock</option>
                </select>
            </fieldset>

            <fieldset className="space-y-3">
                <legend className="mb-3 font-semibold text-gray-800">
                    Product type
                </legend>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={onlyNew}
                        onChange={(event) => setOnlyNew(event.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                    />
                    New arrivals
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={onlyTopRated}
                        onChange={(event) =>
                            setOnlyTopRated(event.target.checked)
                        }
                        className="rounded text-red-600 focus:ring-red-500"
                    />
                    Top rated
                </label>
            </fieldset>
        </div>
    );

    return (
        <>
            <Head title="All Products" />

            <div className="min-h-screen bg-gray-50">
                <div className="h-[85px] bg-slate-900">
                    <Header
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        carts={carts}
                        wishlists={wishlists}
                    />
                </div>

                <main className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
                            Our collection
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                            All Products
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">
                            Search the complete catalog and narrow the results
                            with the filters.
                        </p>
                    </div>

                    <div className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setSearch(value);
                                    if (value === "" && initialSearch !== "") {
                                        router.get(
                                            route("products.shopLeftSidebar"),
                                            {},
                                            {
                                                replace: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }
                                }}
                                placeholder="Search products by name or description..."
                                className="w-full rounded-lg border-gray-300 py-3 pl-10 pr-4 text-gray-800 focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="rounded-lg border-gray-300 bg-white text-sm text-gray-700 focus:border-red-500 focus:ring-red-500 sm:w-52"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">
                                Price: low to high
                            </option>
                            <option value="price-high">
                                Price: high to low
                            </option>
                            <option value="rating">Highest rated</option>
                            <option value="name">Name: A–Z</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => setFiltersOpen(true)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 lg:hidden"
                        >
                            <AdjustmentsHorizontalIcon className="size-5" />
                            Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4 lg:gap-10">
                        <aside className="hidden h-fit self-start rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:block">
                            {filterPanel}
                        </aside>

                        <section
                            id="product-results"
                            className="scroll-mt-16 lg:col-span-3"
                        >
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                                <p className="text-sm text-gray-500">
                                    Showing{" "}
                                    <strong className="text-gray-800">
                                        {filteredProducts.length === 0
                                            ? 0
                                            : pageStart + 1}
                                        –
                                        {Math.min(
                                            pageStart + perPage,
                                            filteredProducts.length,
                                        )}
                                    </strong>{" "}
                                    of {filteredProducts.length} matching
                                    products
                                </p>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    Show
                                    <select
                                        value={perPage}
                                        onChange={(event) =>
                                            setPerPage(
                                                Number(event.target.value),
                                            )
                                        }
                                        className="rounded-lg border-gray-300 bg-white py-2 text-sm focus:border-red-500 focus:ring-red-500"
                                    >
                                        {[10, 30, 50, 100].map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    per page
                                </label>
                            </div>
                            {filteredProducts.length > 0 ? (
                                <div className="grid auto-rows-fr grid-cols-1 gap-5 min-[430px]:grid-cols-2 xl:grid-cols-3">
                                    {paginatedProducts.map((product) => (
                                        <article
                                            key={product.id}
                                            className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <ProductCard
                                                {...product}
                                                wishlists={wishlists}
                                                showProduct={showProduct}
                                            />
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
                                    <MagnifyingGlassIcon className="mx-auto size-10 text-gray-300" />
                                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                        No products found
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Try another search or reset the filters.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="mt-5 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            )}
                            {totalPages > 1 && (
                                <nav
                                    aria-label="Product pagination"
                                    className="mt-8 flex flex-wrap items-center justify-center gap-2"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changePage(safeCurrentPage - 1)
                                        }
                                        disabled={safeCurrentPage === 1}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => changePage(page)}
                                            aria-current={
                                                page === safeCurrentPage
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`size-10 rounded-lg text-sm font-bold transition ${page === safeCurrentPage ? "bg-red-600 text-white shadow" : "border border-gray-300 bg-white text-gray-700 hover:border-red-500 hover:text-red-600"}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            changePage(safeCurrentPage + 1)
                                        }
                                        disabled={
                                            safeCurrentPage === totalPages
                                        }
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </nav>
                            )}{" "}
                        </section>
                    </div>
                </main>

                <Footer />
            </div>

            {filtersOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setFiltersOpen(false)}
                        className="absolute inset-0 bg-black/60"
                    />
                    <aside className="absolute inset-y-0 right-0 w-[min(22rem,90vw)] overflow-y-auto bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
                                aria-label="Close filters"
                            >
                                <XMarkIcon className="size-6" />
                            </button>
                        </div>
                        {filterPanel}
                        <button
                            type="button"
                            onClick={() => setFiltersOpen(false)}
                            className="mt-8 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
                        >
                            Show {filteredProducts.length} products
                        </button>
                    </aside>
                </div>
            )}
        </>
    );
}
