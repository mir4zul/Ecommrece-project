import { Dialog, DialogPanel } from "@headlessui/react";
import {
    Bars3Icon,
    HeartIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    ShoppingCartIcon,
    SunIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/shoplio-logo.svg";
import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import DropDown from "./DropDown/ShopDropDown";
import PageDropDown from "./DropDown/PageDropDown";
import CartDropDown from "./DropDown/CartDropDown";
import MenuDropDown from "./DropDown/MenuDropDown";
import WishlistDropDown from "./DropDown/WishlistDropDown";

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
    const { url: currentUrl } = usePage();
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
                className={`mx-auto flex max-w-screen-2xl items-center justify-between transition-all duration-300 max-lg:flex-row-reverse ${isScrolled ? "min-h-[40px]" : "min-h-[85px]"}`}
            >
                <div className="lg:hidden flex gap-4 items-center">
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
                        onMouseOver={() => {
                            setDropdownOpen("wishlist");
                        }}
                        onMouseOut={() => {
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
                        onMouseOver={() => {
                            setDropdownOpen("cart");
                        }}
                        onMouseOut={() => {
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
                                0
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

                <div className="flex lg:flex-1 justify-between items-center">
                    <Link
                        href={route("products.index")}
                        className="lg:-m-1.5 lg:p-1.5"
                    >
                        <span className="sr-only">Your Company</span>
                        <img
                            alt="Shoplio home"
                            src={logo}
                            className={`w-auto transition-all duration-300 ${isScrolled ? "h-7 lg:h-8" : "h-9 lg:h-10"}`}
                        />
                    </Link>

                    <div className="hidden lg:flex lg:gap-x-8">
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

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <div className="hidden min-w-0 lg:flex lg:flex-1 lg:justify-end lg:gap-6 xl:gap-12 2xl:gap-20">
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
                            onMouseMove={() => {
                                setDropdownOpen("wishlist");
                            }}
                            onMouseLeave={() => {
                                setDropdownOpen("");
                            }}
                            className="relative h-[85px] flex items-center justify-center"
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
                            onMouseMove={() => {
                                setDropdownOpen("cart");
                            }}
                            onMouseLeave={() => {
                                setDropdownOpen("");
                            }}
                            className="relative h-[85px] flex items-center justify-center"
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
                            className="relative"
                            onMouseMove={() => {
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
                className="lg:hidden"
            >
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:text-gray-100 dark:sm:ring-white/10">
                    <div className="flex items-center justify-between">
                        <Link
                            href={route("products.index")}
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-1.5 p-1.5"
                        >
                            <span className="sr-only">Your Company</span>
                            <img
                                alt="Shoplio home"
                                src={logo}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                                >
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
