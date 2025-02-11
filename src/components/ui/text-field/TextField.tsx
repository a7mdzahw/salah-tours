import clsx from "clsx";
import { CircleAlert } from "lucide-react";

interface TextFieldProps {
  label: string;
  error: string;

  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export default function TextField(props: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm/6 font-medium text-gray-900"
      >
        {props.label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          defaultValue="adamwathan"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          aria-invalid="true"
          aria-describedby="email-error"
          className={clsx(
            "block w-full rounded-md border-0 py-2 px-2 sm:text-sm/6 ring-2 ring-primary-500 focus-visible:ring-primary-700 focus-visible:border-0",
            {
              "!ring-red-500 !focus:ring-red-700 placeholder:text-red-500":
                !!props.error,
            },
          )}
          {...props.inputProps}
        />
        {!!props.error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <CircleAlert aria-hidden="true" className="size-5 text-red-500" />
          </div>
        )}
      </div>
      {!!props.error && (
        <p id="email-error" className="mt-2 text-sm text-red-600">
          {props.error}
        </p>
      )}
    </div>
  );
}
