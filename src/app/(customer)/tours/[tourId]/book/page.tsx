"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { useRouter, useParams  } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  numberOfPeople: z.number().min(1, "At least 1 person is required").max(20, "Maximum 20 people allowed"),
  date: z.string().min(1, "Date is required"),
  specialRequirements: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface Tour {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export default function Booking() {
  const router = useRouter();
          const params = useParams();

  const { data: tour } = useQuery<Tour>({
    queryKey: ["tours", params.tourId],
    queryFn: () => client(`/tours/${params.tourId}`),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      numberOfPeople: 1,
      date: "",
      specialRequirements: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: BookingFormData) =>
      client(`/tours/${params.tourId}/bookings`, {
        method: "POST",
        data,
      }),
    onSuccess: () => {
      router.push(`/tours/${params.tourId}/book/success`);
    },
  });

  const numberOfPeople = watch("numberOfPeople");
  const totalPrice = (tour?.price || 0) * (numberOfPeople || 0);

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Get maximum date (6 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/tours/${params.tourId}`}>
          <Button color="ghost" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Book Tour</h1>
      </div>

      {tour && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{tour.name}</h2>
          <div className="mt-2 text-sm text-gray-500">
            <p>Duration: {tour.duration} hours</p>
            <p>Price per person: ${tour.price}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit((data) => createBookingMutation.mutate(data))} 
            className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              {...register("phone")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of People</label>
            <input
              type="number"
              min="1"
              max="20"
              {...register("numberOfPeople", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.numberOfPeople && (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfPeople.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tour Date</label>
            <input
              type="date"
              min={minDate}
              max={maxDateStr}
              {...register("date")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Special Requirements (Optional)
            </label>
            <textarea
              rows={4}
              {...register("specialRequirements")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            />
            {errors.specialRequirements && (
              <p className="mt-1 text-sm text-red-600">{errors.specialRequirements.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">Total Price:</span>
            <span className="text-2xl font-bold">${totalPrice}</span>
          </div>

          <div className="flex justify-end gap-4">
            <Link href={`/tours/${params.tourId}`}>
              <Button color="ghost">Cancel</Button>
            </Link>
            <Button
              type="submit"
              color="primary"
              disabled={isSubmitting || createBookingMutation.isPending}
            >
              {createBookingMutation.isPending ? "Processing..." : "Book Now"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
