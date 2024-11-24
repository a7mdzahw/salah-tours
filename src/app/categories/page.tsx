import React from "react";
import { Container, Typography, Box } from "@mui/material";

import CategoryCard from "@salah-tours/components/category-card/CategoryCard";
import { categories } from "@salah-tours/mocks/categories";

const Categories = () => {
  return (
    <Container className="flex flex-col gap-3 py-4">
      <Typography
        variant="h4"
        className="text-center text-primary-700 uppercase"
      >
        Categories
      </Typography>

      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            name={category.name}
            imageUri={category.imageUri}
            description={category.description}
          />
        ))}
      </Box>
    </Container>
  );
};

export default Categories;
