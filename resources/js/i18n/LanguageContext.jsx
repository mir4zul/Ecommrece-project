import { createContext, useContext, useEffect, useMemo, useState } from "react";
import extraBn from "./bn-extra";

const LanguageContext = createContext(null);

const bn = {
    Home: "হোম", Shop: "শপ", "Shop Products": "পণ্যসমূহ", "My Orders": "আমার অর্ডার",
    Blog: "ব্লগ", Page: "পেজ", "About us": "আমাদের সম্পর্কে", Explore: "ঘুরে দেখুন",
    Shopping: "কেনাকাটা", Account: "অ্যাকাউন্ট", Language: "ভাষা", English: "ইংরেজি",
    "Browse products": "পণ্য দেখুন", "My Cart": "আমার কার্ট", Wishlist: "পছন্দের তালিকা",
    "Admin Dashboard": "অ্যাডমিন ড্যাশবোর্ড", Dashboard: "ড্যাশবোর্ড", Profile: "প্রোফাইল",
    "Profile Settings": "প্রোফাইল সেটিংস", "Sign out": "সাইন আউট", "Log Out": "লগ আউট",
    "Log in": "লগ ইন", Login: "লগ ইন", Register: "রেজিস্টার",
    "Dark mode": "ডার্ক মোড", "Light mode": "লাইট মোড",
    "Welcome to ShopHunt": "ShopHunt-এ স্বাগতম",
    "Sign in for faster checkout and order tracking.": "দ্রুত চেকআউট ও অর্ডার ট্র্যাকিংয়ের জন্য সাইন ইন করুন।",
    "Shop smarter with ShopHunt": "ShopHunt-এর সাথে স্মার্ট কেনাকাটা করুন",
    "Shop smarter": "স্মার্ট কেনাকাটা",
    "Your favourite products, all in one place.": "আপনার পছন্দের সব পণ্য, একই জায়গায়।",
    "Secure checkout and protected account": "নিরাপদ চেকআউট ও সুরক্ষিত অ্যাকাউন্ট",
    "Track every order from confirmation to delivery": "নিশ্চিতকরণ থেকে ডেলিভারি পর্যন্ত প্রতিটি অর্ডার ট্র্যাক করুন",
    "Save favourites and discover better deals": "পছন্দের পণ্য সংরক্ষণ করুন এবং সেরা অফার খুঁজুন",
    "Your information is encrypted and secure": "আপনার তথ্য এনক্রিপ্ট করা ও নিরাপদ",
    "Search products...": "পণ্য খুঁজুন...", "Search for products...": "পণ্য খুঁজুন...",
    "Search products": "পণ্য খুঁজুন", "Open main menu": "প্রধান মেনু খুলুন", "Close menu": "মেনু বন্ধ করুন",
    "Add to cart": "কার্টে যোগ করুন", "Add To Cart": "কার্টে যোগ করুন", "Buy now": "এখনই কিনুন",
    Compare: "তুলনা করুন", Categories: "ক্যাটাগরি", Category: "ক্যাটাগরি", Price: "মূল্য", Rating: "রেটিং",
    Featured: "ফিচারড", "Highest rated": "সর্বোচ্চ রেটিং", "Name: A–Z": "নাম: ক–হ",
    "All products": "সব পণ্য", "In stock": "স্টকে আছে", "Low stock": "স্টক কম", "Out of stock": "স্টক শেষ",
    "Clear filters": "ফিল্টার মুছুন", "No products found": "কোনো পণ্য পাওয়া যায়নি",
    "Product details": "পণ্যের বিস্তারিত", Description: "বিবরণ", Reviews: "রিভিউ", Quantity: "পরিমাণ",
    Cart: "কার্ট", "Shopping Cart": "শপিং কার্ট", "Cart is empty": "কার্ট খালি",
    "Your cart is empty": "আপনার কার্ট খালি", "Continue shopping": "কেনাকাটা চালিয়ে যান",
    "View cart": "কার্ট দেখুন", Checkout: "চেকআউট", "Proceed to checkout": "চেকআউটে যান",
    "Order Summary": "অর্ডার সারাংশ", Summary: "সারাংশ", Subtotal: "সাবটোটাল", Discount: "ছাড়",
    Shipping: "শিপিং", Total: "মোট", Free: "ফ্রি", "Your Order": "আপনার অর্ডার",
    "Billing details": "বিলিং তথ্য", "Shipping details": "শিপিং তথ্য", "Customer information": "গ্রাহকের তথ্য",
    "Full name": "পুরো নাম", Name: "নাম", Email: "ইমেইল", Phone: "ফোন", Address: "ঠিকানা",
    City: "শহর", District: "জেলা", "Postal code": "পোস্ট কোড", "Select a district": "জেলা নির্বাচন করুন",
    "Payment Method": "পেমেন্ট পদ্ধতি", "Payment method": "পেমেন্ট পদ্ধতি",
    "Cash on Delivery": "ক্যাশ অন ডেলিভারি", "Mobile Banking": "মোবাইল ব্যাংকিং", "Online Payment": "অনলাইন পেমেন্ট",
    "Place order": "অর্ডার করুন", "Place Order": "অর্ডার করুন",
    "Order placed successfully": "অর্ডার সফলভাবে সম্পন্ন হয়েছে", "Thank you for your order": "আপনার অর্ডারের জন্য ধন্যবাদ",
    "Order number": "অর্ডার নম্বর", "Order total": "অর্ডারের মোট", "Order Timeline": "অর্ডারের সময়রেখা",
    Products: "পণ্যসমূহ", "Delivery Address": "ডেলিভারি ঠিকানা", Status: "অবস্থা", Payment: "পেমেন্ট",
    Method: "পদ্ধতি", Pending: "অপেক্ষমাণ", Confirmed: "নিশ্চিত", Processing: "প্রক্রিয়াধীন",
    Shipped: "পাঠানো হয়েছে", Delivered: "ডেলিভারি হয়েছে", Completed: "সম্পন্ন", Cancelled: "বাতিল",
    Paid: "পরিশোধিত", Failed: "ব্যর্থ", "Order Cancelled": "অর্ডার বাতিল হয়েছে",
    Save: "সংরক্ষণ করুন", Cancel: "বাতিল", Update: "আপডেট করুন", Delete: "মুছুন", Edit: "সম্পাদনা",
    Action: "অ্যাকশন", Date: "তারিখ", Customer: "গ্রাহক", Items: "আইটেম", Product: "পণ্য", Stock: "স্টক",
    Courier: "কুরিয়ার", Tracking: "ট্র্যাকিং", "Tracking number": "ট্র্যাকিং নম্বর",
    "Delivery Information": "ডেলিভারি তথ্য", "Order Items": "অর্ডারের পণ্য",
    "Payment Status": "পেমেন্ট অবস্থা", "Order Status": "অর্ডারের অবস্থা",
    "All order status": "সব অর্ডার অবস্থা", "All payments": "সব পেমেন্ট",
    "Add Product": "পণ্য যোগ করুন", "All categories": "সব ক্যাটাগরি", "All stock": "সব স্টক",
    "Product gallery": "পণ্যের গ্যালারি", "Create Product": "পণ্য তৈরি করুন", "Update Product": "পণ্য আপডেট করুন",
    "Forgot your password?": "পাসওয়ার্ড ভুলে গেছেন?", Password: "পাসওয়ার্ড",
    "Confirm Password": "পাসওয়ার্ড নিশ্চিত করুন", "Remember me": "আমাকে মনে রাখুন",
    "Already registered?": "আগেই রেজিস্টার করেছেন?", "Reset Password": "পাসওয়ার্ড রিসেট করুন",
    "Email Password Reset Link": "পাসওয়ার্ড রিসেট লিংক পাঠান", "Update Password": "পাসওয়ার্ড আপডেট করুন",
    "Current Password": "বর্তমান পাসওয়ার্ড", "New Password": "নতুন পাসওয়ার্ড",
    "Delete Account": "অ্যাকাউন্ট মুছুন", "Profile Information": "প্রোফাইল তথ্য",
    "View All Post": "সব পোস্ট দেখুন",
    "Secure shopping · Fast delivery · Easy returns": "নিরাপদ কেনাকাটা · দ্রুত ডেলিভারি · সহজ রিটার্ন",
};

const dictionaries = { en: {}, bn: { ...bn, ...extraBn } };
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
const attributes = ["placeholder", "title", "aria-label"];

function translated(value, language) {
    return language === "en" ? value : (dictionaries[language]?.[value] ?? value);
}

function translateTree(root, language) {
    if (!root || typeof document === "undefined") return;
    const text = (node) => {
        if (node.parentElement?.closest("[data-no-translate]")) return;
        const current = node.nodeValue ?? "";
        if (!originalText.has(node)) originalText.set(node, current);
        const source = originalText.get(node);
        const key = source.trim();
        if (key) {
            const nextValue = source.replace(key, translated(key, language));
            if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
        }
    };
    const element = (node) => {
        if (node.closest("[data-no-translate]")) return;
        if (!originalAttributes.has(node)) originalAttributes.set(node, {});
        const originals = originalAttributes.get(node);
        attributes.forEach((attribute) => {
            if (!node.hasAttribute(attribute)) return;
            if (!(attribute in originals)) originals[attribute] = node.getAttribute(attribute);
            node.setAttribute(attribute, translated(originals[attribute], language));
        });
    };
    if (root.nodeType === Node.TEXT_NODE) text(root);
    if (root.nodeType === Node.ELEMENT_NODE) element(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        node.nodeType === Node.TEXT_NODE ? text(node) : element(node);
        node = walker.nextNode();
    }
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() =>
        typeof window === "undefined" ? "en" : (localStorage.getItem("language") ?? "en"),
    );
    const changeLanguage = (next) => {
        if (!dictionaries[next]) return;
        localStorage.setItem("language", next);
        setLanguage(next);
    };
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = "ltr";
        translateTree(document.documentElement, language);
        const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => {
            if (mutation.type === "characterData") translateTree(mutation.target, language);
            mutation.addedNodes.forEach((node) => translateTree(node, language));
        }));
        observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
        return () => observer.disconnect();
    }, [language]);
    const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: (key) => translated(key, language) }), [language]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
    return context;
}

export function LanguageSwitcher({ className = "" }) {
    const { language, setLanguage } = useLanguage();
    return (
        <div className={"flex rounded-lg bg-white p-1 shadow-sm dark:bg-slate-900 " + className} data-no-translate>
            {[["en", "English"], ["bn", "বাংলা"]].map(([code, label]) => (
                <button key={code} type="button" onClick={() => setLanguage(code)} aria-pressed={language === code}
                    className={"rounded-md px-3 py-1.5 text-xs font-bold transition " + (language === code ? "bg-red-600 text-white" : "text-slate-500 hover:text-red-600 dark:text-slate-300")}>
                    {label}
                </button>
            ))}
        </div>
    );
}
