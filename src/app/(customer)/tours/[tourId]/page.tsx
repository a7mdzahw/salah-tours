"use client";

import React from "react";
import ImageSlider from "./components/ImageSlider";
import Button from "@salah-tours/components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import { client } from "@salah-tours/helpers/client";
import { useQuery } from "@tanstack/react-query";

interface Tour {
  id: string;
  name: string;
  image: string;
  description: string;
  catalogImages: string[];
  days: {
    day: number;
    title: string;
    description: string;
  }[];
}

const TourDetails = () => {
  const { tourId } = useParams();
  const router = useRouter();

  const {
    data: tour,
    isLoading,
    isError,
  } = useQuery<Tour>({
    queryKey: ["tours", tourId],
    queryFn: () => client(`/tours/${tourId}`),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching tour</p>;
  }

  return (
    <div>
      <section
        className="py-24 text-center relative"
        style={{
          backgroundImage: `url(${tour?.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-primary-800 absolute z-10 inset-0 opacity-80" />

        <article className="z-40 relative">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            {tour?.name}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-primary-100">
            {tour?.description}
          </p>
        </article>
      </section>

      <section className="p-8 w-full md:w-2/3 md:mx-auto">
        <ImageSlider images={tour?.catalogImages || []} />
      </section>

      <section className="px-8">
        <h1 className="text-3xl text-primary-700 uppercase">{tour?.name}</h1>
        <hr className="border-primary-700 my-4" />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-8">
        {tour?.days?.map((day) => (
          <div key={day.day} className="p-4 bg-primary-100">
            <h3 className="text-2xl font-bold">{day.title}</h3>
            <p>{day.description}</p>
          </div>
        ))}
      </section>

      <section className="w-full p-8 flex justify-center md:justify-start">
        <Button
          color="primary"
          className="!px-6 !py-3 w-96"
          onClick={() => router.push(`/tours/${tourId}/book`)}
        >
          Book Now
        </Button>
      </section>
    </div>
  );
};

export default TourDetails;
