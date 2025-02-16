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
import { ChevronDown } from "lucide-react";

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
          alt={tour?.catalogImages?.[0]?.filename}
          src={tour?.catalogImages?.[0]?.url}
          className="absolute inset-0 object-center w-full h-full object-cover"
        />
        <div className="bg-primary-800 absolute z-10 inset-0 opacity-80" />

        <article className="z-40 relative">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            {tour?.name}
          </h1>
        </article>
      </section>

      <section className="w-full pb-8">
        <ImageSlider
          images={tour?.catalogImages?.map((image) => image.url) || []}
        />
      </section>

      <section className="px-8">
        <h1 className="text-3xl text-primary-700 uppercase">{tour?.name}</h1>
        <div className="text-2xl text-primary-600 mt-2 hidden md:block">
          From ${tour?.price}
        </div>
        <section className="mt-4">
          <p
            className={clsx("text-gray-600", {
              "line-clamp-3": !showMore,
              "line-clamp-[100]": showMore,
            })}
          >
            {tour?.description}
          </p>
          <button
            className="text-primary-700 cursor-pointer"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "read less" : "read more"}
          </button>
        </section>
        <hr className="border-primary-700 my-4" />
      </section>

      <section className="flex flex-col gap-2 p-8">
        <h2 className="text-2xl font-bold text-primary-700">Itinerary</h2>
        {tour?.days?.map((day) => (
          <div
            key={day.day}
            className="border-b border-primary-200 last:border-b-0"
          >
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-primary-700">
                    {day.title}
                  </h3>
                </div>
                <ChevronDown className="w-6 h-6 transform group-open:rotate-180 transition-transform text-primary-700" />
              </summary>
              <div className="pb-4 px-4">
                <p className="text-gray-600">{day.description}</p>
              </div>
            </details>
          </div>
        ))}
      </section>

      {/* Desktop view */}
      <section className="w-full p-8 hidden md:flex justify-start">
        <Button
          color="primary"
          className="!px-6 !py-3 w-96"
          onClick={() => router.push(`/tours/${tourId}/book`)}
        >
          Book Now
        </Button>
      </section>

      {/* Mobile view - fixed bottom */}
      <section className="fixed bottom-0 left-0 right-0 bg-white shadow-xl p-4 flex flex-row-reverse items-center justify-between md:hidden">
        <div className="text-xl font-bold text-primary-600">
          <span className="text-sm text-primary-600">From</span>
          <br />
          <span className="text-xl font-bold text-primary-700">
            $ {tour?.price}
          </span>
        </div>
        <Button
          color="primary"
          className="!px-6 !py-3"
          onClick={() => router.push(`/tours/${tourId}/book`)}
        >
          Book Now
        </Button>
      </section>
    </QueryLoader>
  );
};

export default TourDetails;
