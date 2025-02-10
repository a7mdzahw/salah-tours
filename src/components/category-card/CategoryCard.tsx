/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

type Props = {
  id: string
  name: string;
  imageUri?: string;
  description?: string;
};

const CategoryCard = (props: Props) => {
  return (
    <Link href={`/categories/${props.id}`}>
      <div className="group relative aspect-[2/1] overflow-hidden rounded-lg sm:row-span-2 sm:aspect-square">
        <img
          alt={props.name}
          src={props.imageUri}
          className="absolute size-full object-cover group-hover:opacity-75"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"
        />
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            <h3 className="font-semibold text-white">{props.name}</h3>
            <p aria-hidden="true" className="mt-1 text-sm text-white">
              {props.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
