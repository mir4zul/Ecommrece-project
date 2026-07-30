import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import ProductForm from "./ProductForm";

export default function Create({ categories }) {
    return (
        <AdminLayout
            title="Add Product"
            subtitle="Create a new catalog product"
        >
            <Head title="Add Product" />
            <ProductForm categories={categories} />
        </AdminLayout>
    );
}
