import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CubeIcon,
    HeartIcon,
    HomeIcon,
    PlusCircleIcon,
    ShoppingBagIcon,
    Squares2X2Icon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import logo from "@/assets/shophunt-logo.png";

const links = [
    { label: "Dashboard", routeName: "dashboard", icon: Squares2X2Icon },
    {
        label: "Manage Products",
        routeName: "admin.products.index",
        icon: CubeIcon,
    },
    {
        label: "Add Product",
        routeName: "admin.products.create",
        icon: PlusCircleIcon,
    },
    {
        label: "Orders",
        routeName: "admin.orders.index",
        icon: ShoppingBagIcon,
    },
    {
        label: "Wishlist",
        routeName: "admin.wishlists.index",
        icon: HeartIcon,
    },
    { label: "View Store", routeName: "products.index", icon: HomeIcon },
    { label: "Profile", routeName: "profile.edit", icon: UserCircleIcon },
];

export default function AdminLayout({ title, subtitle, actions, children }) {
    const user = usePage().props.auth.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const showDetails = expanded || mobileOpen;

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
                />
            )}
            <aside
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-200 shadow-2xl transition-all duration-300 lg:translate-x-0 ${expanded ? "lg:w-72" : "lg:w-20"} ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="absolute -right-3 top-24 hidden size-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-lg hover:bg-red-600 hover:text-white lg:flex"
                    aria-label={
                        expanded ? "Collapse sidebar" : "Expand sidebar"
                    }
                >
                    {expanded ? (
                        <ChevronLeftIcon className="size-4" />
                    ) : (
                        <ChevronRightIcon className="size-4" />
                    )}
                </button>
                <div
                    className={`flex h-20 items-center border-b border-white/10 ${showDetails ? "justify-between px-6" : "justify-center px-3"}`}
                >
                    <Link
                        href={route("dashboard")}
                        className="flex items-center gap-3"
                        aria-label="ShopHunt admin dashboard"
                    >
                        {showDetails ? (
                            <img
                                src={logo}
                                alt="ShopHunt admin"
                                className="h-16 w-auto max-w-[11rem] object-contain"
                            />
                        ) : (
                            <span className="relative block size-12 shrink-0 overflow-hidden rounded-xl">
                                <img
                                    src={logo}
                                    alt="ShopHunt"
                                    className="absolute left-0 top-0 h-24 w-auto max-w-none -translate-x-[21px] -translate-y-[22px]"
                                />
                            </span>
                        )}
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg p-2 text-slate-400 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <XMarkIcon className="size-6" />
                    </button>
                </div>
                <nav
                    className={`flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto py-6 ${showDetails ? "px-4" : "px-3"}`}
                >
                    {links.map((item) => {
                        const Icon = item.icon;
                        const active = route().current(item.routeName);
                        return (
                            <Link
                                key={item.label}
                                href={route(item.routeName)}
                                onClick={() => setMobileOpen(false)}
                                title={!showDetails ? item.label : undefined}
                                className={`flex items-center rounded-xl py-3 text-sm font-medium transition ${showDetails ? "gap-3 px-3" : "justify-center px-2"} ${active ? "bg-red-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                            >
                                <Icon className="size-5 shrink-0" />
                                {showDetails && (
                                    <span className="whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div
                    className={`border-t border-white/10 ${showDetails ? "p-4" : "p-3"}`}
                >
                    <div
                        className={`flex items-center rounded-xl bg-white/5 ${showDetails ? "gap-3 p-3" : "justify-center p-2"}`}
                    >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-600 font-bold text-white">
                            {user.name?.charAt(0).toUpperCase()}
                        </span>
                        {showDetails && (
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Super Administrator
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        title={!showDetails ? "Sign out" : undefined}
                        className={`mt-2 flex w-full items-center rounded-lg py-2 text-sm text-slate-400 hover:bg-white/10 hover:text-white ${showDetails ? "gap-3 px-3" : "justify-center px-2"}`}
                    >
                        <ArrowLeftOnRectangleIcon className="size-5" />
                        {showDetails && <span>Sign out</span>}
                    </Link>
                </div>
            </aside>

            <div
                className={`transition-[padding] duration-300 ${expanded ? "lg:pl-72" : "lg:pl-20"}`}
            >
                <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8 dark:border-slate-700 dark:bg-slate-900/95">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
                            aria-label="Open sidebar"
                        >
                            <Bars3Icon className="size-6" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold sm:text-xl">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="truncate text-xs text-slate-500 sm:text-sm">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && <div className="shrink-0">{actions}</div>}
                </header>
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
