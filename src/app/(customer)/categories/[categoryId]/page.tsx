"use client";

import React from "react";
import CategoryCard from "@salah-tours/components/category-card/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import { useParams } from "next/navigation";
import { Category } from "@entities/Category";
import TourCard from "@salah-tours/components/tour-card/TourCard";


export default function CategoryDetails() {
  const { categoryId } = useParams();

  const {
    data: category,
    isLoading,
    isError,
  } = useQuery<Category>({
    queryKey: ["categories", categoryId],
    queryFn: () => client(`/categories/${categoryId}`),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching category</p>;
  }

  return (
    <div className=" w-full  ">
      <section
        className="py-24 text-center relative "
        style={{
          backgroundImage: `url(${category?.imageUri})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-primary-800 absolute z-10 inset-0 opacity-80" />

        <article className="z-40 relative">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {category?.name}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-primary-100">
            {category?.description}
          </p>
        </article>
      </section>

      {!!category?.subCategories?.length && (
        <div className="p-8">
          <section>
            <h1 className="text-3xl text-primary-700 uppercase">Places</h1>
            <hr className="border-primary-700 my-4" />
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {category?.subCategories?.map((category) => (
              <CategoryCard
                key={category.name}
                id={category.id}
                name={category.name}
                imageUri={category.imageUri}
                description={category.description}
              />
            ))}
          </div>
        </div>
      )}

      {!!category?.tours?.length && (
        <div className="p-8">
          <section>
            <h1 className="text-3xl text-primary-700 uppercase">Tours</h1>
            <hr className="border-primary-700 my-4" />
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {category?.tours?.map((tour) => (
              <TourCard
                key={tour.id}
                id={tour.id}
                name={tour.name}
                imageUri={tour.image}
                description={tour.description}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
