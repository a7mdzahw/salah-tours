/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import { motion } from "framer-motion";
import { Info } from "@salah-tours/entities/Info";


const InfoSection = () => {
  const { data: info } = useQuery<Info>({
    queryKey: ["info"],
    queryFn: () => client("/info"),
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 sm:py-24">
      {/* Decorative dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative lg:order-2"
            >
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {info?.title}
                </h2>
                <div className="mt-6 text-lg leading-8">
                  <p className="text-pretty">{info?.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:order-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
                {info?.bannerImage?.url && (
                  <img
                    src={info.bannerImage.url}
                    alt="Featured destination"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/60 via-primary-900/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
          <div className="flex space-x-6 opacity-30">
            <div className="h-[1px] w-24 bg-primary-100" />
            <div className="h-[1px] w-12 bg-primary-100" />
            <div className="h-[1px] w-16 bg-primary-100" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
