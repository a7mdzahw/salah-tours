/* eslint-disable @next/next/no-img-element */
import InfoSection from "@salah-tours/components/info-section/InfoSection";
import Categories from "./categories/page";
import { tours } from "@salah-tours/mocks/tours";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <InfoSection />
      <Categories />

      <section className="py-4">
        <h3 className="text-3xl text-primary-700 font-bold text-center">
          Recent Tours
        </h3>
        <hr className="border-primary-700 my-4 mx-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-8">
          {tours.map((tour) => (
            <Link
              href={`/tours/${tour.id}`}
              key={tour.id}
              className="mb-4 bg-primary-100 hover:bg-primary-200"
            >
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-48 object-cover"
              />
              <h3 className="text-2xl font-bold uppercase px-4 py-2">
                {tour.name}
              </h3>
              <p className="px-4 pb-2">{tour.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
