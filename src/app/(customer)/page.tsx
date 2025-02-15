"use client";
/* eslint-disable @next/next/no-img-element */
import InfoSection from "@salah-tours/components/info-section/InfoSection";
import TourCard from "@salah-tours/components/tour-card/TourCard";
import { client } from "@salah-tours/helpers/client";
import { useQuery } from "@tanstack/react-query";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import Categories from "./categories/page";
import { Tour } from "@entities/Tour";
import QueryLoader from "@salah-tours/components/ui/loader/QueryLoader";

export default function Home() {
  const {
    data: tours,
    isLoading,
    isError,
  } = useQuery<Tour[]>({
    queryKey: ["tours"],
    queryFn: () => client("/tours"),
  });

  return (
    <QueryLoader isLoading={isLoading} error={isError}>
      <FloatingWhatsApp phoneNumber="123456789" accountName="Salah Tours" />
      <InfoSection />
      <Categories />

      <section className="py-4">
        <h3 className="text-3xl text-primary-700 font-bold text-center">
          Recent Tours
        </h3>
        <hr className="border-primary-700 my-4 mx-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-8 md:px-16">
          {tours?.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}
              name={tour.name}
              imageUri={tour.catalogImages?.[0]?.url}
              description={tour.description}
            />
          ))}
        </div>
      </section>
    </QueryLoader>
  );
}
