"use client";

import React from "react";
import Slider from "react-slick";
import { Card, CardMedia } from "@mui/material";

// Import the CSS for the carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Tour {
  id: string;
  name: string;
  description: string;
  image: string;
  days?: {
    day: number;
    title: string;
    description: string;
  }[];
}
interface Props {
  tours: Tour[];
}

const ImageSlider = ({ tours }: Props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {tours.map((tour) => (
        <Card key={tour.name} className="w-full">
          <CardMedia
            className="h-96 w-96"
            component="img"
            height="50"
            image={tour.image}
            alt={tour.name}
          />
        </Card>
      ))}
    </Slider>
  );
};

export default ImageSlider;
