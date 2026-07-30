import {
    ArrowLeftOnRectangleIcon,
    ArrowRightIcon,
    BanknotesIcon,
    Bars3Icon,
    ChartBarSquareIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CubeIcon,
    CurrencyDollarIcon,
    HeartIcon,
    HomeIcon,
    PlusCircleIcon,
    ReceiptPercentIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    Squares2X2Icon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

const sidebarLinks = [
    { label: "Dashboard", href: "dashboard", icon: Squares2X2Icon },
    {
        label: "Manage Products",
        href: "admin.products.index",
        icon: CubeIcon,
    },
    {
        label: "Add Product",
        href: "admin.products.create",
        icon: PlusCircleIcon,
    },
    {
        label: "Orders",
        href: "admin.orders.index",
        icon: ShoppingBagIcon,
    },
    {
        label: "Wishlist",
        href: "admin.wishlists.index",
        icon: HeartIcon,
    },
    { label: "View Store", href: "products.index", icon: HomeIcon },
    {
        label: "All Products",
        href: "products.shopLeftSidebar",
        icon: CubeIcon,
    },
    { label: "My Profile", href: "profile.edit", icon: UsersIcon },
];

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

function Sidebar({ open, onClose, user, expanded, onExpandedChange }) {
    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
                />
            )}

            <aside
                onMouseEnter={() => onExpandedChange(true)}
                onMouseLeave={() => onExpandedChange(false)}
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-200 shadow-2xl transition-all duration-300 lg:translate-x-0 ${
                    expanded ? "lg:w-72" : "lg:w-20"
                } ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <button
                    type="button"
                    onClick={() => onExpandedChange(!expanded)}
                    className="absolute -right-3 top-24 z-10 hidden size-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-lg transition hover:bg-red-600 hover:text-white lg:flex"
                    aria-label={
                        expanded ? "Collapse sidebar" : "Expand sidebar"
                    }
                    title={expanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {expanded ? (
                        <ChevronLeftIcon className="size-4" />
                    ) : (
                        <ChevronRightIcon className="size-4" />
                    )}
                </button>

                <div
                    className={`flex h-20 items-center border-b border-white/10 transition-all ${expanded ? "justify-between px-6" : "justify-center px-3"}`}
                >
                    <Link
                        href={route("dashboard")}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-600 font-black text-white shadow-lg shadow-red-950/40">
                            B
                        </span>
                        <div
                            className={`whitespace-nowrap transition-opacity duration-200 ${expanded ? "opacity-100" : "pointer-events-none hidden opacity-0"}`}
                        >
                            <p className="font-bold tracking-wide text-white">
                                Boria Admin
                            </p>
                            <p className="text-xs text-slate-400">
                                Control center
                            </p>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <XMarkIcon className="size-6" />
                    </button>
                </div>

                <div
                    className={`flex-1 overflow-x-hidden overflow-y-auto py-6 ${expanded ? "px-4" : "px-3"}`}
                >
                    <p
                        className={`px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 ${expanded ? "block" : "hidden"}`}
                    >
                        Administration
                    </p>
                    <nav className="mt-3 space-y-1.5">
                        {sidebarLinks.map((item) => {
                            const Icon = item.icon;
                            const isActive = route().current(item.href);

                            return (
                                <Link
                                    key={item.label}
                                    href={route(item.href)}
                                    onClick={onClose}
                                    title={!expanded ? item.label : undefined}
                                    className={`flex items-center rounded-xl py-3 text-sm font-medium transition ${
                                        expanded
                                            ? "gap-3 px-3"
                                            : "justify-center px-2"
                                    } ${
                                        isActive
                                            ? "bg-red-600 text-white shadow-lg shadow-red-950/30"
                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Icon className="size-5 shrink-0" />
                                    <span
                                        className={
                                            expanded
                                                ? "whitespace-nowrap"
                                                : "hidden"
                                        }
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {expanded && (
                        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <ChartBarSquareIcon className="size-7 text-red-400" />
                            <p className="mt-3 font-semibold text-white">
                                Catalog overview
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-400">
                                Monitor products, stock and customer activity
                                from one place.
                            </p>
                        </div>
                    )}
                </div>

                <div
                    className={`border-t border-white/10 ${expanded ? "p-4" : "px-3 py-4"}`}
                >
                    <div
                        className={`flex items-center rounded-xl bg-white/5 ${expanded ? "gap-3 p-3" : "justify-center p-2"}`}
                    >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-600 font-bold text-white">
                            {user.name?.charAt(0).toUpperCase()}
                        </span>
                        {expanded && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-white">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                    Super Administrator
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        title={!expanded ? "Sign out" : undefined}
                        className={`mt-3 flex w-full items-center rounded-lg py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white ${
                            expanded
                                ? "gap-3 px-3 text-left"
                                : "justify-center px-2"
                        }`}
                    >
                        <ArrowLeftOnRectangleIcon className="size-5 shrink-0" />
                        {expanded && <span>Sign out</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}

export default function Dashboard({
    stats = {},
    chartData = {},
    recentProducts = [],
}) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const monthlySales = chartData.monthlySales ?? [];
    const orderStatuses = chartData.orderStatuses ?? [];
    const topProducts = chartData.topProducts ?? [];
    const maxRevenue = Math.max(...monthlySales.map((item) => item.revenue), 1);
    const maxOrderStatus = Math.max(
        ...orderStatuses.map((item) => item.count),
        1,
    );
    const maxTopProductQuantity = Math.max(
        ...topProducts.map((item) => item.quantity),
        1,
    );
    const categories = chartData.categories ?? [];
    const monthlyProducts = chartData.monthlyProducts ?? [];
    const stock = chartData.stock ?? { healthy: 0, low: 0, out: 0 };
    const maxCategoryCount = Math.max(
        ...categories.map((item) => item.count),
        1,
    );
    const maxMonthlyCount = Math.max(
        ...monthlyProducts.map((item) => item.count),
        1,
    );
    const stockTotal = Math.max(stock.healthy + stock.low + stock.out, 1);
    const healthyPercentage = (stock.healthy / stockTotal) * 100;
    const lowPercentage = (stock.low / stockTotal) * 100;
    const ratings = chartData.ratings ?? [];
    const priceRanges = chartData.priceRanges ?? [];
    const productLabels = chartData.labels ?? [];
    const maxRatingCount = Math.max(...ratings.map((item) => item.count), 1);
    const maxPriceRangeCount = Math.max(
        ...priceRanges.map((item) => item.count),
        1,
    );
    const maxLabelCount = Math.max(
        ...productLabels.map((item) => item.count),
        1,
    );

    const summaryCards = [
        {
            label: "Total Sales",
            value: stats.totalSales ?? 0,
            detail: `${stats.pendingOrders ?? 0} pending orders`,
            icon: ShoppingCartIcon,
            color: "bg-emerald-600",
        },
        {
            label: "Total Income",
            value: currencyFormatter.format(stats.totalIncome ?? 0),
            detail: "Gross paid revenue",
            icon: CurrencyDollarIcon,
            color: "bg-green-600",
            formatted: true,
        },
        {
            label: "Average Order",
            value: currencyFormatter.format(stats.averageOrder ?? 0),
            detail: "Paid orders only",
            icon: ReceiptPercentIcon,
            color: "bg-cyan-600",
            formatted: true,
        },
        {
            label: "Items Sold",
            value: stats.itemsSold ?? 0,
            detail: "Units in paid orders",
            icon: BanknotesIcon,
            color: "bg-teal-600",
        },
        {
            label: "Total Products",
            value: stats.products ?? 0,
            detail: `${stats.categories ?? 0} categories`,
            icon: CubeIcon,
            color: "bg-blue-600",
        },
        {
            label: "Registered Users",
            value: stats.users ?? 0,
            detail: "Customer accounts",
            icon: UsersIcon,
            color: "bg-violet-600",
        },
        {
            label: "Items in Carts",
            value: stats.cartItems ?? 0,
            detail: "Across all customers",
            icon: ShoppingBagIcon,
            color: "bg-amber-500",
        },
        {
            label: "Wishlist Saves",
            value: stats.wishlists ?? 0,
            detail: "Customer interest",
            icon: HeartIcon,
            color: "bg-rose-600",
        },
    ];

    return (
        <>
            <Head title="Super Admin Dashboard" />
            <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    user={user}
                    expanded={sidebarExpanded}
                    onExpandedChange={setSidebarExpanded}
                />

                <div
                    className={`transition-[padding] duration-300 ${
                        sidebarExpanded ? "lg:pl-72" : "lg:pl-20"
                    }`}
                >
                    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8 dark:border-slate-700 dark:bg-slate-900/95">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                aria-label="Open sidebar"
                            >
                                <Bars3Icon className="size-6" />
                            </button>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                                    Super Admin
                                </p>
                                <h1 className="text-lg font-bold sm:text-xl">
                                    Dashboard Overview
                                </h1>
                            </div>
                        </div>
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-xs text-slate-500">
                                {user.email}
                            </p>
                        </div>
                    </header>

                    <main className="p-4 sm:p-6 lg:p-8">
                        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 p-6 text-white shadow-xl sm:p-8">
                            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-sm font-semibold text-red-300">
                                        Welcome back, {user.name}
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                        Your store at a glance
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                        Review catalog health, stock levels and
                                        customer activity from your
                                        administration dashboard.
                                    </p>
                                </div>
                                <Link
                                    href={route("products.shopLeftSidebar")}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                                >
                                    View storefront
                                    <ArrowRightIcon className="size-4" />
                                </Link>
                            </div>
                        </section>
                        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {summaryCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <article
                                        key={card.label}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {card.label}
                                                </p>
                                                <p className="mt-2 text-3xl font-bold">
                                                    {card.formatted
                                                        ? card.value
                                                        : numberFormatter.format(
                                                              card.value,
                                                          )}
                                                </p>
                                                <p className="mt-2 text-xs text-slate-400">
                                                    {card.detail}
                                                </p>
                                            </div>
                                            <span
                                                className={`grid size-11 place-items-center rounded-xl text-white ${card.color}`}
                                            >
                                                <Icon className="size-6" />
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                        <section className="mt-6 grid gap-6 xl:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-bold">
                                            Revenue & Sales Trend
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Paid revenue and paid orders over
                                            six months
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">
                                            Gross income
                                        </p>
                                        <p className="text-lg font-bold text-emerald-600">
                                            {currencyFormatter.format(
                                                stats.totalIncome ?? 0,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 flex h-72 items-end gap-3 border-b border-slate-200 px-2 pt-8 dark:border-slate-700 sm:gap-6">
                                    {monthlySales.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                        >
                                            <span className="mb-1 text-[10px] font-bold text-emerald-600 sm:text-xs">
                                                {currencyFormatter.format(
                                                    item.revenue,
                                                )}
                                            </span>
                                            <span className="mb-2 text-[10px] text-slate-500">
                                                {item.orders} orders
                                            </span>
                                            <div
                                                className="w-full max-w-16 rounded-t-lg bg-gradient-to-t from-emerald-700 to-emerald-400 transition hover:from-emerald-600 hover:to-emerald-300"
                                                style={{
                                                    height: `${Math.max((item.revenue / maxRevenue) * 75, 4)}%`,
                                                }}
                                                title={`${currencyFormatter.format(item.revenue)} from ${item.orders} orders`}
                                            />
                                            <span className="mt-3 pb-2 text-xs font-semibold text-slate-500">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="font-bold">Order Status</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Current sales pipeline
                                </p>
                                <div className="mt-6 space-y-5">
                                    {orderStatuses.map((item, index) => (
                                        <div key={item.label}>
                                            <div className="mb-2 flex items-center justify-between text-sm">
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>
                                                <span className="font-bold">
                                                    {item.count}
                                                </span>
                                            </div>
                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        [
                                                            "bg-emerald-500",
                                                            "bg-green-500",
                                                            "bg-violet-500",
                                                            "bg-cyan-500",
                                                            "bg-blue-500",
                                                            "bg-amber-500",
                                                            "bg-red-500",
                                                        ][index]
                                                    }`}
                                                    style={{
                                                        width: `${(item.count / maxOrderStatus) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </section>
                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <h2 className="font-bold">
                                        Top Selling Products
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Ranked by units in paid orders
                                    </p>
                                </div>
                                <span className="text-xs text-slate-500">
                                    Units / revenue
                                </span>
                            </div>
                            <div className="mt-6 grid gap-x-8 gap-y-5 lg:grid-cols-2">
                                {topProducts.map((item, index) => (
                                    <div
                                        key={item.label}
                                        className="grid grid-cols-[2rem_1fr] gap-3"
                                    >
                                        <span className="grid size-8 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white dark:bg-red-600">
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="mb-2 flex justify-between gap-3 text-sm">
                                                <span className="truncate font-medium">
                                                    {item.label}
                                                </span>
                                                <span className="shrink-0 font-bold">
                                                    {item.quantity} /{" "}
                                                    {currencyFormatter.format(
                                                        item.revenue,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-400"
                                                    style={{
                                                        width: `${(item.quantity / maxTopProductQuantity) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="mt-6 grid gap-6 xl:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                                <div>
                                    <h2 className="font-bold">
                                        Catalog Growth
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Products added during the last six
                                        months
                                    </p>
                                </div>
                                <div className="mt-6 flex h-64 items-end gap-3 border-b border-slate-200 px-2 pt-6 dark:border-slate-700 sm:gap-6">
                                    {monthlyProducts.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                        >
                                            <span className="mb-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {item.count}
                                            </span>
                                            <div
                                                className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-red-700 to-red-400 transition-all duration-500 hover:from-red-600 hover:to-red-300"
                                                style={{
                                                    height: `${Math.max((item.count / maxMonthlyCount) * 85, 4)}%`,
                                                }}
                                                title={`${item.count} products added in ${item.label}`}
                                            />
                                            <span className="mt-3 pb-2 text-xs font-medium text-slate-500">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="font-bold">Inventory Status</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Current stock health across the catalog
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <div
                                        className="relative grid size-44 place-items-center rounded-full"
                                        style={{
                                            background: `conic-gradient(#10b981 0 ${healthyPercentage}%, #f59e0b ${healthyPercentage}% ${healthyPercentage + lowPercentage}%, #ef4444 ${healthyPercentage + lowPercentage}% 100%)`,
                                        }}
                                        aria-label="Inventory stock distribution chart"
                                    >
                                        <div className="grid size-28 place-items-center rounded-full bg-white text-center dark:bg-slate-800">
                                            <div>
                                                <p className="text-3xl font-bold">
                                                    {stock.healthy +
                                                        stock.low +
                                                        stock.out}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Products
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                                    <div>
                                        <span className="mx-auto mb-2 block size-2.5 rounded-full bg-emerald-500" />
                                        <p className="font-bold">
                                            {stock.healthy}
                                        </p>
                                        <p className="text-slate-500">
                                            Healthy
                                        </p>
                                    </div>
                                    <div>
                                        <span className="mx-auto mb-2 block size-2.5 rounded-full bg-amber-500" />
                                        <p className="font-bold">{stock.low}</p>
                                        <p className="text-slate-500">Low</p>
                                    </div>
                                    <div>
                                        <span className="mx-auto mb-2 block size-2.5 rounded-full bg-red-500" />
                                        <p className="font-bold">{stock.out}</p>
                                        <p className="text-slate-500">Out</p>
                                    </div>
                                </div>
                            </article>
                        </section>
                        <section className="mt-6 grid gap-6 xl:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="font-bold">
                                    Category Distribution
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Products in the largest categories
                                </p>
                                <div className="mt-6 space-y-4">
                                    {categories.map((item) => (
                                        <div key={item.label}>
                                            <div className="mb-1.5 flex justify-between gap-4 text-xs">
                                                <span className="truncate font-medium">
                                                    {item.label}
                                                </span>
                                                <span className="font-bold text-slate-500">
                                                    {item.count}
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-400"
                                                    style={{
                                                        width: `${(item.count / maxCategoryCount) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                                    <div>
                                        <h2 className="font-bold">
                                            Recent Products
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Latest catalog entries
                                        </p>
                                    </div>
                                    <Link
                                        href={route("products.shopLeftSidebar")}
                                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                        <thead className="bg-slate-50 dark:bg-slate-900/40">
                                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                                <th className="px-5 py-3 font-semibold">
                                                    Product
                                                </th>
                                                <th className="px-5 py-3 font-semibold">
                                                    Price
                                                </th>
                                                <th className="px-5 py-3 font-semibold">
                                                    Stock
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {recentProducts.map((product) => (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                                >
                                                    <td className="px-5 py-3">
                                                        <div className="flex min-w-56 items-center gap-3">
                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt=""
                                                                className="size-11 rounded-lg bg-slate-100 object-cover"
                                                            />
                                                            <div>
                                                                <p className="line-clamp-1 text-sm font-semibold">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {product.category ??
                                                                        "Uncategorized"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3 text-sm font-semibold">
                                                        $
                                                        {Number(
                                                            product.price,
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                product.stock >
                                                                10
                                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                    : product.stock >
                                                                        0
                                                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                                                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                                            }`}
                                                        >
                                                            {product.stock}{" "}
                                                            units
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <h2 className="font-bold">
                                        Inventory Health
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Products requiring attention
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-950/50">
                                            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                                Low stock
                                            </p>
                                            <p className="mt-1 text-3xl font-bold text-amber-900 dark:text-amber-100">
                                                {stats.lowStock ?? 0}
                                            </p>
                                            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                                1–10 units remaining
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/50">
                                            <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                                Out of stock
                                            </p>
                                            <p className="mt-1 text-3xl font-bold text-red-900 dark:text-red-100">
                                                {stats.outOfStock ?? 0}
                                            </p>
                                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                                Restock these products
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </section>
                        <section className="mt-6 grid gap-6 lg:grid-cols-3">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="font-bold">
                                    Rating Distribution
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Catalog quality by customer rating
                                </p>
                                <div className="mt-6 space-y-4">
                                    {[...ratings].reverse().map((item) => (
                                        <div
                                            key={item.label}
                                            className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3"
                                        >
                                            <span className="text-xs font-medium text-slate-500">
                                                {item.label}
                                            </span>
                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
                                                    style={{
                                                        width: `${(item.count / maxRatingCount) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-right text-xs font-bold">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="font-bold">Price Segments</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Products grouped by regular price
                                </p>
                                <div className="mt-6 flex h-48 items-end justify-around gap-3 border-b border-slate-200 px-2 dark:border-slate-700">
                                    {priceRanges.map((item, index) => (
                                        <div
                                            key={item.label}
                                            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                        >
                                            <span className="mb-2 text-xs font-bold">
                                                {item.count}
                                            </span>
                                            <div
                                                className={`w-full max-w-12 rounded-t-md ${
                                                    [
                                                        "bg-cyan-500",
                                                        "bg-blue-500",
                                                        "bg-indigo-500",
                                                        "bg-violet-500",
                                                    ][index]
                                                }`}
                                                style={{
                                                    height: `${Math.max((item.count / maxPriceRangeCount) * 75, 4)}%`,
                                                }}
                                            />
                                            <span className="mt-3 min-h-9 text-center text-[10px] leading-4 text-slate-500">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <h2 className="font-bold">Product Labels</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Merchandising flags across the catalog
                                </p>
                                <div className="mt-6 space-y-5">
                                    {productLabels.map((item, index) => (
                                        <div key={item.label}>
                                            <div className="mb-2 flex items-end justify-between">
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {item.count}
                                                </span>
                                            </div>
                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        [
                                                            "bg-red-500",
                                                            "bg-emerald-500",
                                                            "bg-slate-500",
                                                        ][index]
                                                    }`}
                                                    style={{
                                                        width: `${(item.count / maxLabelCount) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        </section>{" "}
                    </main>
                </div>
            </div>
        </>
    );
}
