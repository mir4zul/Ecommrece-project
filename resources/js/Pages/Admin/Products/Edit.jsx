import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import ProductForm from "./ProductForm";

export default function Edit({ product, categories }) {
    return (
        <AdminLayout title="Edit Product" subtitle={`Update ${product.name}`}>
            <Head title={`Edit ${product.name}`} />
            <ProductForm product={product} categories={categories} />
        </AdminLayout>
    );
}
