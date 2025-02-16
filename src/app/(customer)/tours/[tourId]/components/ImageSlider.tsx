"use client";

import React from "react";
import Slider, { Settings } from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Import the CSS for the carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface Props {
  images: string[];
}

const ImageSlider = ({ images }: Props) => {
  const settings: Settings = {
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: images.length > 1,
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
      {images.map((image) => (
        <div key={image + Math.random()} className="w-full">
          <img
            className="h-[550px] object-cover w-full object-center"
            height="50"
            alt={image}
            src={image}
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
