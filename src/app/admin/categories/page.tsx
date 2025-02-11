"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { Plus, Edit, Trash, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, Fragment } from "react";
import { Category } from "@entities/Category";
import { toast, Toaster } from "react-hot-toast";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { AxiosError } from "axios";
export default function CategoriesManagement() {
    const queryClient = useQueryClient();

    const { data: mainCategories } = useQuery<Category[]>({
        queryKey: ["categories", "main"],
        queryFn: () => client<Category[]>("/categories/main"),
    });

    const { data: subCategories } = useQuery<Category[]>({
        queryKey: ["categories", "sub"],
        queryFn: () => client<Category[]>("/categories/sub"),
    });

    // Add state for tracking expanded categories
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const getSubcategoriesForParent = (parentId: string) => {
        return subCategories?.filter(cat => cat.parentCategoryId === parentId) || [];
    };

    // Add toggle function
    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const deleteCategoryMutation = useMutation({
        mutationFn: (categoryId: string) =>
            client(`/categories/${categoryId}`, {
                method: "DELETE",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted successfully", { position: "bottom-center" });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast.error(error.response?.data?.error || "Failed to delete category");
        }
    });

    const handleDelete = async (category: Category) => {
        toast((t) => (
            <ConfirmDialog
                t={t}
                title="Delete Category"
                message={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
                onConfirm={() => deleteCategoryMutation.mutateAsync(category.id)}
            />
        ), {
            duration: Infinity,
            position: "top-center",
            className: '!max-w-fit'
        });
    };

    return (
        <div>
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Categories Management</h1>
                <Link href="/admin/categories/new">
                    <Button color="primary" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Category
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                {/* Main Categories */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Main Categories</h2>
                    </div>
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {mainCategories?.map((category) => (
                                <Fragment key={category.id}>
                                    <tr className="bg-white">
                                        <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                                            <ChevronRight
                                                className={`h-4 w-4 cursor-pointer transition-transform ${expandedCategories.has(category.id) ? 'rotate-90' : ''
                                                    }`}
                                                onClick={() => toggleCategory(category.id)}
                                            />
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <Button color="primary" className="p-2">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    color="primary"
                                                    className="p-2"
                                                    onClick={() => handleDelete(category)}
                                                    disabled={deleteCategoryMutation.isPending}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Only show sub-categories if category is expanded */}
                                    {expandedCategories.has(category.id) &&
                                        getSubcategoriesForParent(category.id).map((subCategory) => (
                                            <tr key={subCategory.id} className="bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900 pl-12">
                                                    {subCategory.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{subCategory.description}</td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/categories/${subCategory.id}/edit`}>
                                                            <Button color="primary" className="p-2">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            color="primary"
                                                            className="p-2"
                                                            onClick={() => handleDelete(subCategory)}
                                                            disabled={deleteCategoryMutation.isPending}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Uncategorized Sub-categories */}
                {subCategories?.some(cat => !mainCategories?.find(main => main.id === cat.parentCategoryId)) && (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Uncategorized Sub-categories</h2>
                        </div>
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {subCategories
                                    ?.filter(cat => !mainCategories?.find(main => main.id === cat.parentCategoryId))
                                    .map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                                        <Button color="primary" className="p-2">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        color="primary"
                                                        className="p-2"
                                                        onClick={() => handleDelete(category)}
                                                        disabled={deleteCategoryMutation.isPending}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 