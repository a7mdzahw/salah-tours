"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import QueryLoader from "@salah-tours/components/ui/loader/QueryLoader";
import { Info } from "@entities/Info";

const infoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type InfoFormData = z.infer<typeof infoFormSchema>;

export default function InfoManagement() {
  const router = useRouter();
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [selectedHero, setSelectedHero] = useState<File | null>(null);
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string>("");
  const [previewHeroUrl, setPreviewHeroUrl] = useState<string>("");

  const {
    data: info,
    isLoading,
    error,
  } = useQuery<Info>({
    queryKey: ["info"],
    queryFn: () => client("/info"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (info) {
      reset(info);
      if (info.bannerImage) {
        setPreviewBannerUrl(info.bannerImage.url);
      }
      if (info.heroImage) {
        setPreviewHeroUrl(info.heroImage.url);
      }
    }
  }, [info, reset]);

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedBanner(file);
      setPreviewBannerUrl(URL.createObjectURL(file));
    }
  };

  const handleHeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedHero(file);
      setPreviewHeroUrl(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setSelectedBanner(null);
    setPreviewBannerUrl("");
  };

  const removeHero = () => {
    setSelectedHero(null);
    setPreviewHeroUrl("");
  };

  const updateInfoMutation = useMutation({
    mutationFn: (data: InfoFormData) =>
      client("/info", {
        method: "PUT",
        data: {
          ...data,
          bannerImage: selectedBanner,
          heroImage: selectedHero,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: async () => {
      router.refresh();
    },
  });

  return (
    <QueryLoader isLoading={isLoading} error={error}>
      <h1 className="text-2xl font-bold mb-8">Homepage Information</h1>

      <form
        onSubmit={handleSubmit((data) => updateInfoMutation.mutate(data))}
        className="max-w-4xl"
      >
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Homepage Title
            </label>
            <input
              {...register("title")}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Homepage Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Banner Image
            </label>
            <div className="mt-2 space-y-4">
              {previewBannerUrl && (
                <div className="relative group w-full h-48 border rounded-lg overflow-hidden">
                  <img
                    src={previewBannerUrl}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hero Image
            </label>
            <div className="mt-2 space-y-4">
              {previewHeroUrl && (
                <div className="relative group w-full h-48 border rounded-lg overflow-hidden">
                  <img
                    src={previewHeroUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeHero}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              disabled={isSubmitting || updateInfoMutation.isPending}
            >
              {updateInfoMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </QueryLoader>
  );
}
