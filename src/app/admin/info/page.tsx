"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

const infoFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  bannerUrl: z.string(),
});

type InfoFormData = z.infer<typeof infoFormSchema>;

interface Info {
  title: string;
  description: string;
  bannerUrl: string;
}

export default function InfoManagement() {
  const router = useRouter();
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { data: info } = useQuery<Info>({
    queryKey: ["info"],
    queryFn: () => client("/info"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      bannerUrl: "",
    },
  });

  useEffect(() => {
    if (info) {
      reset(info);
      if (info.bannerUrl) {
        setPreviewUrl(info.bannerUrl);
      }
    }
  }, [info, reset]);

  const uploadBannerMutation = useMutation({
    mutationFn: async () => {
      if (!selectedBanner) return;

      const formData = new FormData();
      formData.append('banner', selectedBanner);

      return client("/info/banner", {
        method: "POST",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  const updateInfoMutation = useMutation({
    mutationFn: (data: InfoFormData) => client("/info", {
      method: "PUT",
      data,
    }),
    onSuccess: async () => {
      if (selectedBanner) {
        await uploadBannerMutation.mutateAsync();
      }
      router.refresh();
    },
  });

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBanner(file);
      setValue("bannerUrl", file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeBanner = () => {
    setSelectedBanner(null);
    setPreviewUrl("");
    setValue("bannerUrl", "");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Homepage Information</h1>

      <form onSubmit={handleSubmit((data) => updateInfoMutation.mutate(data))}
        className="max-w-2xl bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Homepage Title
            </label>
            <input
              {...register("title")}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Homepage Description
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
            <label className="block text-sm font-medium text-gray-700">
              Banner Image
            </label>
            <input
              {...register("bannerUrl")}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.bannerUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.bannerUrl.message}</p>
            )}
            <div className="mt-2 space-y-4">
              {previewUrl && (
                <div className="relative group w-full h-48 border rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
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


            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              disabled={isSubmitting || updateInfoMutation.isPending || uploadBannerMutation.isPending}
            >
              {updateInfoMutation.isPending || uploadBannerMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 