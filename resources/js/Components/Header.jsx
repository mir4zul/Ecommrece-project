import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    HomeIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    SunIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/shophunt-logo.png";
import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import DropDown from "./DropDown/ShopDropDown";
import PageDropDown from "./DropDown/PageDropDown";
import CartDropDown from "./DropDown/CartDropDown";
import MenuDropDown from "./DropDown/MenuDropDown";
import WishlistDropDown from "./DropDown/WishlistDropDown";
import { LanguageSwitcher } from "@/i18n/LanguageContext";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop-left-sidebar", down: true },
    { name: "My Orders", href: "/my-orders" },
    { name: "Blog", href: "#" },
    { name: "Page", href: "#", down: true },
    { name: "About us", href: "#" },
];

export default function Header({
    mobileMenuOpen,
    setMobileMenuOpen,
    carts,
    wishlists,
}) {
    const { url: currentUrl, props: pageProps } = usePage();
    const user = pageProps.auth?.user;
    const [dropdownOpen, setDropdownOpen] = useState("");
    const [searchQuery, setSearchQuery] = useState(
        () => new URLSearchParams(window.location.search).get("search") ?? "",
    );
    const [headerVisible, setHeaderVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains("dark"),
    );
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = Math.max(window.scrollY, 0);
            setIsScrolled(currentScrollY > 12);

            if (mobileMenuOpen || currentScrollY < 80) {
                setHeaderVisible(true);
            } else if (currentScrollY > lastScrollY.current + 6) {
                setHeaderVisible(false);
                setDropdownOpen("");
            } else if (currentScrollY < lastScrollY.current - 6) {
                setHeaderVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        lastScrollY.current = Math.max(window.scrollY, 0);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [mobileMenuOpen]);

    useEffect(() => {
        const queryString = currentUrl.split("?")[1] ?? "";
        setSearchQuery(new URLSearchParams(queryString).get("search") ?? "");
    }, [currentUrl]);

    const updateSearchQuery = (value) => {
        setSearchQuery(value);
        const queryString = currentUrl.split("?")[1] ?? "";
        const hasActiveSearch = new URLSearchParams(queryString).has("search");

        if (value === "" && hasActiveSearch) {
            router.get(
                route("products.shopLeftSidebar"),
                {},
                { replace: true, preserveScroll: true },
            );
        }
    };

    const cartItems = Array.isArray(carts) ? carts : [];
    const wishlistItems = Array.isArray(wishlists) ? wishlists : [];

    const submitSearch = (event) => {
        event.preventDefault();
        const search = searchQuery.trim();
        router.get(route("products.shopLeftSidebar"), search ? { search } : {});
    };

    const toggleTheme = () => {
        const nextThemeIsDark = !isDark;

        document.documentElement.classList.toggle("dark", nextThemeIsDark);
        document.documentElement.style.colorScheme = nextThemeIsDark
            ? "dark"
            : "light";
        localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light");
        setIsDark(nextThemeIsDark);
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 w-full px-4 transition-all duration-300 ease-out sm:px-6 lg:px-8 ${
                headerVisible ? "translate-y-0" : "-translate-y-full"
            } ${
                isScrolled
                    ? "bg-slate-900/95 shadow-lg shadow-slate-950/20 backdrop-blur-md"
                    : "bg-transparent"
            }`}
        >
            <nav
                aria-label="Global"
                className={`mx-auto grid max-w-screen-2xl grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 xl:flex xl:justify-between ${isScrolled ? "min-h-14" : "min-h-[85px]"}`}
            >
                <div className="order-3 flex items-center justify-self-end gap-2 sm:gap-4 xl:hidden">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-full p-1.5 text-gray-100 transition hover:bg-white/15 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-white/70"
                        aria-label={
                            isDark
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        title={isDark ? "Light mode" : "Dark mode"}
                    >
                        {isDark ? (
                            <SunIcon className="size-6" aria-hidden="true" />
                        ) : (
                            <MoonIcon className="size-6" aria-hidden="true" />
                        )}
                    </button>

                    <div
                        onMouseEnter={() => {
                            setDropdownOpen("wishlist");
                        }}
                        onMouseLeave={() => {
                            setDropdownOpen("");
                        }}
                        className="relative"
                    >
                        <HeartIcon
                            aria-hidden="true"
                            className="size-7 text-gray-100 hover:text-red-600 cursor-pointer duration-200 ease-in-out"
                        />
                        <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full">
                            {wishlistItems.length}
                        </span>
                    </div>

                    <div
                        onMouseEnter={() => {
                            setDropdownOpen("cart");
                        }}
                        onMouseLeave={() => {
                            setDropdownOpen("");
                        }}
                        className={`relative transition-all ${isScrolled ? "py-1" : "py-5"}`}
                    >
                        <div className="relative">
                            <ShoppingCartIcon
                                aria-hidden="true"
                                className="size-7 text-gray-100 hover:text-red-600 cursor-pointer duration-200 ease-in-out"
                            />

                            <p className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full">
                                {cartItems.length}
                            </p>
                        </div>

                        {dropdownOpen === "cart" && (
                            <CartDropDown
                                item="cart"
                                dropdownOpen={dropdownOpen}
                                carts={cartItems}
                            />
                        )}
                    </div>
                </div>

                <div className="order-2 flex items-center justify-self-center xl:order-none xl:flex-1 xl:justify-between">
                    <Link
                        href={route("products.index")}
                        className="lg:-m-1.5 lg:p-1.5"
                    >
                        <span className="sr-only">Your Company</span>
                        <img
                            alt="ShopHunt home"
                            src={logo}
                            className={`w-auto transition-all duration-300 ${isScrolled ? "h-10 lg:h-12" : "h-12 lg:h-14"}`}
                        />
                    </Link>

                    <div className="hidden xl:flex xl:gap-x-8">
                        {navigation.map((item) => (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => {
                                    item.name === "Shop" &&
                                        setDropdownOpen(item.name);

                                    item.name === "Page" &&
                                        setDropdownOpen(item.name);
                                }}
                                onMouseLeave={() => {
                                    item.name === "Shop" && setDropdownOpen("");

                                    item.name === "Page" && setDropdownOpen("");
                                }}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex text-sm font-bold text-white transition-all ${isScrolled ? "py-2" : "py-4 lg:py-8"}`}
                                >
                                    {item.name}
                                    {item.down && (
                                        <svg
                                            aria-hidden="true"
                                            className="ms-1 h-5 w-5 flex-none"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </Link>

                                {item.name === "Shop" && (
                                    <DropDown
                                        item={item}
                                        dropdownOpen={dropdownOpen}
                                    />
                                )}

                                {item.name === "Page" && (
                                    <div>
                                        <PageDropDown
                                            item={item}
                                            dropdownOpen={dropdownOpen}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-1 flex justify-self-start xl:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <div className="hidden min-w-0 xl:flex xl:flex-1 xl:justify-end xl:gap-8 2xl:gap-14">
                    <form
                        onSubmit={submitSearch}
                        role="search"
                        className="flex min-w-0 max-w-xs flex-1 items-center gap-1"
                    >
                        <button
                            type="submit"
                            className="rounded-full p-1 text-gray-200 transition hover:bg-white/10 hover:text-red-500"
                            aria-label="Search products"
                        >
                            <MagnifyingGlassIcon className="size-6" />
                        </button>
                        <input
                            type="search"
                            id="header-product-search"
                            value={searchQuery}
                            onChange={(event) =>
                                updateSearchQuery(event.target.value)
                            }

                            placeholder="Search for products..."
                            className="w-full rounded-md border-none bg-transparent px-3 py-1.5 text-gray-200 placeholder:text-sm placeholder:text-gray-200 focus:border-red-600 focus:outline-none focus:ring-red-600"
                        />
                    </form>

                    <div className="flex gap-4 items-center">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-full p-2 text-gray-100 transition hover:bg-white/15 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-white/70"
                            aria-label={
                                isDark
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            title={isDark ? "Light mode" : "Dark mode"}
                        >
                            {isDark ? (
                                <SunIcon
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            ) : (
                                <MoonIcon
                                    className="size-6"
                                    aria-hidden="true"
                                />
                            )}
                        </button>

                        <div
                            onMouseEnter={() => {
                                setDropdownOpen("wishlist");
                            }}
                            onMouseLeave={() => {
                                setDropdownOpen("");
                            }}
                            className={`relative flex items-center justify-center ${isScrolled ? "h-14" : "h-[85px]"}`}
                        >
                            <div className="relative">
                                <HeartIcon
                                    aria-hidden="true"
                                    className="size-7 text-gray-100 hover:text-red-600 cursor-pointer duration-200 ease-in-out"
                                />

                                <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full">
                                    {wishlistItems.length}
                                </span>
                            </div>

                            {dropdownOpen === "wishlist" && (
                                <WishlistDropDown
                                    item="wishlist"
                                    dropdownOpen={dropdownOpen}
                                    wishlists={wishlistItems}
                                />
                            )}
                        </div>

                        <div
                            onMouseEnter={() => {
                                setDropdownOpen("cart");
                            }}
                            onMouseLeave={() => {
                                setDropdownOpen("");
                            }}
                            className={`relative flex items-center justify-center ${isScrolled ? "h-14" : "h-[85px]"}`}
                        >
                            <div className="relative">
                                <ShoppingCartIcon
                                    aria-hidden="true"
                                    className="size-7 text-gray-100 hover:text-red-600 cursor-pointer duration-200 ease-in-out"
                                />

                                <p className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-600 rounded-full">
                                    {cartItems.length}
                                </p>
                            </div>
                            {dropdownOpen === "cart" && (
                                <CartDropDown
                                    item="cart"
                                    dropdownOpen={dropdownOpen}
                                    carts={cartItems}
                                />
                            )}
                        </div>

                        <div
                            className={`relative flex items-center justify-center ${isScrolled ? "h-14" : "h-[85px]"}`}
                            onMouseEnter={() => {
                                setDropdownOpen("menu");
                            }}
                            onMouseLeave={() => {
                                setDropdownOpen("");
                            }}
                        >
                            <Bars3Icon
                                aria-hidden="true"
                                className="size-7 text-gray-100 hover:text-red-600 cursor-pointer duration-200 ease-in-out"
                            />

                            <MenuDropDown
                                item="menu"
                                dropdownOpen={dropdownOpen}
                            />
                        </div>
                    </div>
                </div>
            </nav>
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="relative z-[100] xl:hidden"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300 ease-out data-[closed]:opacity-0"
                />
                <DialogPanel
                    transition
                    className="fixed inset-y-0 left-0 flex w-full flex-col overflow-hidden bg-slate-50 shadow-2xl ring-1 ring-black/10 transition duration-300 ease-out data-[closed]:-translate-x-full data-[closed]:opacity-90 sm:max-w-sm dark:bg-slate-950 dark:ring-white/10"
                >
                    <div className="relative overflow-hidden bg-slate-950 px-5 pb-6 pt-5 text-white">
                        <div className="absolute -right-16 -top-16 size-40 rounded-full bg-red-600/30 blur-3xl" />
                        <div className="relative flex items-center justify-between">
                            <Link
                                href={route("products.index")}
                                onClick={() => setMobileMenuOpen(false)}
                                aria-label="ShopHunt home"
                            >
                                <img
                                    alt="ShopHunt"
                                    src={logo}
                                    className="h-14 w-auto"
                                />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-red-600"
                                aria-label="Close menu"
                            >
                                <XMarkIcon aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                        <p className="relative mt-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                            Shop smarter with ShopHunt
                        </p>
                        <form
                            onSubmit={(event) => {
                                submitSearch(event);
                                setMobileMenuOpen(false);
                            }}
                            className="relative mt-5"
                        >
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => updateSearchQuery(event.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
                            />
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-5">
                        <p className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Explore
                        </p>
                        <nav className="mt-2 space-y-1" aria-label="Mobile navigation">
                            {[
                                { name: "Home", href: "/", icon: HomeIcon },
                                { name: "Shop Products", href: "/shop-left-sidebar", icon: ShoppingBagIcon },
                                { name: "Blog", href: "/blog", icon: Bars3Icon },
                            ].map(({ name, href, icon: Icon }) => (
                                <Link
                                    key={name}
                                    href={href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white hover:text-red-600 hover:shadow-sm dark:text-slate-200 dark:hover:bg-slate-900"
                                >
                                    <span className="grid size-9 place-items-center rounded-lg bg-slate-200/70 text-slate-600 transition group-hover:bg-red-50 group-hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-red-950/50">
                                        <Icon className="size-5" />
                                    </span>
                                    {name}
                                </Link>
                            ))}
                        </nav>

                        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />
                        <p className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Shopping
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                            <Link
                                href={route("cart.index")}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-red-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="flex items-center justify-between">
                                    <ShoppingCartIcon className="size-6 text-red-600" />
                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950/50">
                                        {cartItems.length}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm font-bold text-slate-800 dark:text-white">My Cart</p>
                            </Link>
                            <Link
                                href={route("products.index")}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-red-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="flex items-center justify-between">
                                    <HeartIcon className="size-6 text-red-600" />
                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950/50">
                                        {wishlistItems.length}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm font-bold text-slate-800 dark:text-white">Wishlist</p>
                            </Link>
                        </div>

                        <div className="my-5 h-px bg-slate-200 dark:bg-slate-800" />
                        <p className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Account
                        </p>
                        {user ? (
                            <div className="mt-2 space-y-1">
                                <div className="mb-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
                                    <span className="grid size-10 place-items-center rounded-full bg-red-600 font-bold text-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                    </div>
                                </div>
                                {user.role === "admin" && (
                                    <Link href={route("dashboard")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-white hover:text-red-600 dark:text-slate-200 dark:hover:bg-slate-900">
                                        <UserCircleIcon className="size-5" /> Admin Dashboard
                                    </Link>
                                )}
                                <Link href={route("orders.index")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-white hover:text-red-600 dark:text-slate-200 dark:hover:bg-slate-900">
                                    <ShoppingBagIcon className="size-5" /> My Orders
                                </Link>
                                <Link href={route("profile.edit")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-white hover:text-red-600 dark:text-slate-200 dark:hover:bg-slate-900">
                                    <UserCircleIcon className="size-5" /> Profile
                                </Link>
                                <Link href={route("logout")} method="post" as="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                                    <ArrowLeftOnRectangleIcon className="size-5" /> Sign out
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <Link href={route("login")} onClick={() => setMobileMenuOpen(false)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-white">Log in</Link>
                                <Link href={route("register")} onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-red-600/20">Register</Link>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Language
                            </span>
                            <LanguageSwitcher />
                        </div>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <span>{isDark ? "Dark mode" : "Light mode"}</span>
                            {isDark ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                        </button>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
