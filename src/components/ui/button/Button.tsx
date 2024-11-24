import { Button as MuiButton, ButtonProps } from "@mui/material";
import clsx from "clsx";

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <MuiButton
      className={clsx(
        { "!bg-primary-600 !text-white": props.color === "primary" },
        className
      )}
      {...props}
    />
  );
}
