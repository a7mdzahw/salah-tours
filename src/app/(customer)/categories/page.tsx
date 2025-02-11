"use client";

import React from "react";

import CategoryCard from "@salah-tours/components/category-card/CategoryCard";
import { client } from "@salah-tours/helpers/client";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@entities/Category";
import QueryLoader from "@salah-tours/components/ui/loader/QueryLoader";

const Categories = () => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories", "main"],
    queryFn: () => client<Category[]>("/categories/main"),
  });

  return (
    <QueryLoader isLoading={isLoading} error={isError}>
      <div className="flex flex-col gap-3 p-8 md:p-16">
        <h2 className="text-center text-3xl text-primary-700 uppercase !font-bold">
          Categories
        </h2>

        <hr className="border-primary-700 my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories?.map((category) => (
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
    </QueryLoader>
  );
};

export default Categories;
