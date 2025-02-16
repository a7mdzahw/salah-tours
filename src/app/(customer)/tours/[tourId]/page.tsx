"use client";

import React, { useState } from "react";
import ImageSlider from "./components/ImageSlider";
import Button from "@salah-tours/components/ui/button/Button";
import { useParams, useRouter } from "next/navigation";
import { client } from "@salah-tours/helpers/client";
import { useQuery } from "@tanstack/react-query";
import { Tour } from "@entities/Tour";
import QueryLoader from "@salah-tours/components/ui/loader/QueryLoader";
import clsx from "clsx";

const TourDetails = () => {
  const { tourId } = useParams();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  const {
    data: tour,
    isLoading,
    isError,
  } = useQuery<Tour>({
    queryKey: ["tours", tourId],
    queryFn: () => client(`/tours/${tourId}`),
  });

  return (
    <QueryLoader isLoading={isLoading} error={isError}>
      <section className="py-12 text-center relative">
        <img
          src={tour?.catalogImages?.[0]?.url}
          className="absolute inset-0 object-center w-full h-full object-cover"
        />
        <div className="bg-primary-800 absolute z-10 inset-0 opacity-80" />

        <article className="z-40 relative">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            {tour?.name}
          </h1>
          <section className="mx-auto mt-4 px-2 text-base text-primary-100">
            <p
              className={clsx("line-clamp-2", {
                "line-clamp-[100]": !showMore,
              })}
            >
              {tour?.description}
            </p>

            <button
              className="text-primary-300 cursor-pointer"
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              read more
            </button>
          </section>
        </article>
      </section>

      <section className="w-full pb-8">
        <ImageSlider
          images={tour?.catalogImages?.map((image) => image.url) || []}
        />
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
    </QueryLoader>
  );
};

export default TourDetails;
