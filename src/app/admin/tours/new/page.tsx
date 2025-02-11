"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { ArrowLeft, Plus as PlusIcon, Trash as TrashIcon, Upload, X } from "lucide-react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tour } from "@entities/Tour";

const daySchema = z.object({
  day: z.number().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const tourFormSchema = z.object({
  name: z.string().min(1, "Tour name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string(),
  days: z.array(daySchema).min(1, "At least one day is required"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

interface Category {
  id: string;
  name: string;
}

export default function NewTour() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 1,
      categoryId: "",
      image: "",
      days: [{ day: 1, title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["admin", "categories", "sub"],
    queryFn: () => client("/categories/sub"),
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async (tourId: number) => {
      const formData = new FormData();
      selectedImages.forEach((file) => {
        formData.append('catalogImages', file);
      });

      return client(`/tours/${tourId}/images`, {
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  const createTourMutation = useMutation({
    mutationFn: (data: TourFormData) => client<Tour>("/tours", {
      method: "POST",
      data,
    }),
    onSuccess: async (response: Tour) => {
      console.log(response);
      if (selectedImages.length > 0) {
        await uploadImagesMutation.mutateAsync(response.id);
      }
      router.push("/admin/tours");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
    setValue("image", files[0].name);

    // Create preview URLs for the new images
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]); // Clean up the old preview URL
      return newPreviews;
    });
  };

  const onSubmit = (data: TourFormData) => {
    createTourMutation.mutate(data);
  };

  const addDay = () => {
    append({ day: fields.length + 1, title: "", description: "" });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/tours">
          <Button color="ghost" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create New Tour</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tour Name
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (hours)
              </label>
              <input
                {...register("duration", { valueAsNumber: true })}
                type="number"
                min="1"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catalog Images
            </label>
            <div className="mt-2 space-y-4">
              <div className="flex flex-wrap gap-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group w-32 h-32 border rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-500">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    Click to upload images
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {uploadImagesMutation.isPending && (
                <p className="text-sm text-gray-500">
                  Uploading images...
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Itinerary</h3>
              <Button
                type="button"
                color="primary"
                className="flex items-center gap-2"
                onClick={addDay}
              >
                <PlusIcon className="h-4 w-4" />
                Add Day
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-50 p-4 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Day {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      color="ghost"
                      className="p-2 hover:text-red-600"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`days.${index}.title`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    {...register(`days.${index}.title`)}
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  {errors.days?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.days[index]?.title?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`days.${index}.description`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    {...register(`days.${index}.description`)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  {errors.days?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.days[index]?.description?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {errors.days && (
              <p className="mt-1 text-sm text-red-600">{errors.days.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/tours">
              <Button color="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              color="primary"
              disabled={isSubmitting || createTourMutation.isPending || uploadImagesMutation.isPending}
            >
              {createTourMutation.isPending || uploadImagesMutation.isPending
                ? "Creating..."
                : "Create Tour"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 