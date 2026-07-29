const COMPARE_STORAGE_KEY = "boria_compare_products";
export const MAX_COMPARE_PRODUCTS = 3;

export const getCompareProducts = () => {
    try {
        return JSON.parse(localStorage.getItem(COMPARE_STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
};

const saveCompareProducts = (products) => {
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent("compare-products-updated"));
    return products;
};

export const addCompareProduct = (product) => {
    const products = getCompareProducts();

    if (products.some((item) => item.id === product.id)) {
        return { products, added: false, reason: "exists" };
    }

    if (products.length >= MAX_COMPARE_PRODUCTS) {
        return { products, added: false, reason: "limit" };
    }

    return {
        products: saveCompareProducts([...products, product]),
        added: true,
        reason: null,
    };
};

export const removeCompareProduct = (productId) =>
    saveCompareProducts(
        getCompareProducts().filter((product) => product.id !== productId),
    );

export const clearCompareProducts = () => saveCompareProducts([]);
