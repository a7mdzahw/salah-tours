import React from "react";
import { categories } from "@salah-tours/mocks/categories";
import CategoryCard from "@salah-tours/components/category-card/CategoryCard";
import { Box } from "@mui/material";

type Props = {
  params: Promise<{
    categoryName: string;
  }>;
};

export default async function Example(props: Props) {
  const { categoryName } = await props.params;

  console.log(categoryName);
  const category = categories.find((cat) => cat.name === categoryName);

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

        <article className="z-50 relative">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {category?.name}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-primary-100">
            {category?.description}
          </p>
        </article>
      </section>

      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-8">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            imageUri={category.imageUri}
            description={category.description}
          />
        ))}
      </Box>
    </div>
  );
}
