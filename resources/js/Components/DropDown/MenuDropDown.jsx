import {
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    ShoppingBagIcon,
    Squares2X2Icon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";
import clsx from "clsx";
import { LanguageSwitcher } from "@/i18n/LanguageContext";

export default function MenuDropDown({ dropdownOpen }) {
    const user = usePage().props.auth?.user;
    const isOpen = dropdownOpen === "menu";
    return (
        <div
            className={clsx(
                "absolute right-0 top-full z-50 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-black/5 transition-all duration-300 ease-out dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10",
                isOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0",
            )}
            aria-hidden={!isOpen}
        >
            <div className="relative overflow-hidden bg-slate-950 px-5 py-5 text-white">
                <div className="absolute -right-8 -top-10 size-28 rounded-full bg-red-600/30 blur-2xl" />
                <p className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-red-300">
                    ShopHunt account
                </p>
                {user ? (
                    <div className="relative mt-3 flex items-center gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-red-600 text-base font-black text-white shadow-lg shadow-red-950/40">
                            {user.name?.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                                {user.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {user.email}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative mt-3">
                        <p className="text-lg font-bold">Welcome to ShopHunt</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Sign in for faster checkout and order tracking.
                        </p>
                    </div>
                )}
            </div>

            <div className="p-3">
                {user ? (
                    <div className="space-y-1">
                        {user.role === "admin" && (
                            <Link
                                href={route("dashboard")}
                                className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-200 dark:hover:bg-red-950/40"
                            >
                                <Squares2X2Icon className="size-5" />
                                <span className="flex-1">Admin Dashboard</span>
                                <ChevronRightIcon className="size-4 opacity-40 transition group-hover:translate-x-0.5" />
                            </Link>
                        )}
                        <Link
                            href={route("orders.index")}
                            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-200 dark:hover:bg-red-950/40"
                        >
                            <ShoppingBagIcon className="size-5" />
                            <span className="flex-1">My Orders</span>
                            <ChevronRightIcon className="size-4 opacity-40 transition group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href={route("profile.edit")}
                            className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-200 dark:hover:bg-red-950/40"
                        >
                            <UserCircleIcon className="size-5" />
                            <span className="flex-1">Profile Settings</span>
                            <ChevronRightIcon className="size-4 opacity-40 transition group-hover:translate-x-0.5" />
                        </Link>
                        <div className="my-2 h-px bg-slate-200 dark:bg-slate-700" />
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                            <ArrowLeftOnRectangleIcon className="size-5" />
                            Sign out
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 p-1">
                        <Link
                            href={route("login")}
                            className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-white"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route("register")}
                            className="rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Language
                    </span>
                    <LanguageSwitcher />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs dark:border-slate-700">
                    <Link
                        href={route("products.shopLeftSidebar")}
                        className="font-bold text-slate-600 transition hover:text-red-600 dark:text-slate-300"
                    >
                        Browse products
                    </Link>
                    <span className="rounded-full bg-white px-2.5 py-1 font-bold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                        BDT ৳
                    </span>
                </div>
            </div>
        </div>
    );
}