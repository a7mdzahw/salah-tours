import React from "react";
import { Container, Typography, Box } from "@mui/material";

import CategoryCard from "@salah-tours/components/category-card/CategoryCard";

// images of tours categories
import Category1 from "@salah-tours/assets/images/packages/pack1.jpg";
import Category2 from "@salah-tours/assets/images/packages/pack2.jpg";
import Category3 from "@salah-tours/assets/images/packages/pack3.jpg";
import Category4 from "@salah-tours/assets/images/packages/pack4.jpg";
import Category5 from "@salah-tours/assets/images/packages/pack5.jpg";
import Category6 from "@salah-tours/assets/images/packages/pack6.jpg";

const Categories = () => {
  return (
    <Container className="flex flex-col gap-3 py-4">
      <Typography variant="h4" className="text-center text-primary-700 uppercase">Categories</Typography>

      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {[
          {
            name: "Cultural Tours",
            imageUri: Category1.src,
            description: "Explore the world and learn about different cultures",
          },
          {
            name: "Adventure Tours",
            imageUri: Category2.src,
            description: "Experience the thrill of adventure",
          },
          {
            name: "Religious Tours",
            imageUri: Category3.src,
            description: "Visit the most sacred places in the world",
          },
          {
            name: "Family Tours",
            imageUri: Category4.src,
            description: "Enjoy a family vacation",
          },
          {
            name: "Luxury Tours",
            imageUri: Category5.src,
            description: "Experience the best of the best",
          },
          {
            name: "Wildlife Tours",
            imageUri: Category6.src,
            description: "Explore the beauty of nature",
          },
        ].map((category) => (
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
