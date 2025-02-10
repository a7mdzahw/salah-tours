"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  parentCategoryId: z.string().nullable(),
  imageUri: z.string().min(1, "Image URL is required"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface Category {
  id: string;
  name: string;
  description: string;
  imageUri: string;
  parentCategoryId: string | null;
}

export default function NewCategory() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: null,
      imageUri: "",
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => client("/categories"),
  });

  const mainCategories = categories?.filter(cat => !cat.parentCategoryId) || [];

  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => client("/categories", {
      method: "POST",
      data,
    }),
    onSuccess: () => {
      router.push("/admin/categories");
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    createCategoryMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories">
          <Button color="ghost" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create New Category</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              {...register("name")}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700">
              Parent Category (Optional)
            </label>
            <select
              {...register("parentCategoryId")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="">None (Create as main category)</option>
              {mainCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.parentCategoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.parentCategoryId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="imageUri" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              {...register("imageUri")}
              type="url"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.imageUri && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUri.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/categories">
              <Button color="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              color="primary"
              disabled={isSubmitting || createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 