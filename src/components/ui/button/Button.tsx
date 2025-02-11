import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export default function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        {
          "!bg-primary-600 !text-white px-4 py-2 rounded-md":
            props.color === "primary",
        },
        {
          "!bg-gray-200 !text-gray-600 px-4 py-2 rounded-md":
            props.color === "ghost",
        },
        className,
      )}
      {...props}
    />
  );
}
