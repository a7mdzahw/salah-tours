import { tours } from "@salah-tours/mocks/tours";
import React from "react";
import ImageSlider from "./components/ImageSlider";
import Button from "@salah-tours/components/ui/button/Button";

type Props = {
  params: Promise<{ tourId: string }>;
};

const page = async (props: Props) => {
  const { tourId } = await props.params;

  const tour = tours.find((tour) => tour.id === tourId);
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

        <article className="z-50 relative">
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
            {tour?.name}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-primary-100">
            {tour?.description}
          </p>
        </article>
      </section>

      <section className="p-8 w-full md:w-2/3 md:mx-auto">
        <ImageSlider tours={tours} />
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
        <Button color="primary" className="!px-6 !py-3 w-96">
          Book Now
        </Button>
      </section>
    </div>
  );
};

export default page;
