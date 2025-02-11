"use client";

import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Category } from "@entities/Category";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  parentCategoryId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: category } = useQuery<Category>({
    queryKey: ["categories", params.categoryId],
    queryFn: () => client<Category>(`/categories/${params.categoryId}`),
  });

  const { data: mainCategories } = useQuery<Category[]>({
    queryKey: ["categories", "main"],
    queryFn: () => client<Category[]>("/categories/main"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description,
        parentCategoryId: category.parentCategoryId || "",
      });
      setPreviewUrl(category.imageUri || "");
    }
  }, [category, reset]);

  const uploadImageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedImage) return;

      const formData = new FormData();
      formData.append('image', selectedImage);

      return client(`/categories/${params.categoryId}/image`, {
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => client(`/categories/${params.categoryId}`, {
      method: "PUT",
      data,
    }),
    onSuccess: async () => {
      if (selectedImage) {
        await uploadImageMutation.mutateAsync();
      }
      router.push("/admin/categories");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategoryMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/categories">
          <Button color="ghost" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
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
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700">
              Parent Category
            </label>
            <select
              {...register("parentCategoryId")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="">None (Create as main category)</option>
              {mainCategories?.map((category) => (
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
            <label className="block text-sm font-medium text-gray-700">
              Category Image
            </label>
            <div className="mt-2 space-y-4">
              {previewUrl && (
                <div className="relative w-32 h-32">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-500">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/categories">
              <Button color="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              color="primary"
              disabled={updateCategoryMutation.isPending || uploadImageMutation.isPending}
            >
              {updateCategoryMutation.isPending || uploadImageMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 