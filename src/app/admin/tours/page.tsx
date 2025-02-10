"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";
import Button from "@salah-tours/components/ui/button/Button";
import { Plus, Edit, Trash } from "lucide-react";
import Link from "next/link";

interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: string;
  image: string;
}

export default function ToursManagement() {
  const { data: tours } = useQuery<Tour[]>({
    queryKey: ["admin", "tours"],
    queryFn: () => client("/tours"),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tours Management</h1>
        <Link href="/admin/tours/new">
          <Button color="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Tour
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tours?.map((tour) => (
              <tr key={tour.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{tour.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{tour.description}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/tours/${tour.id}/edit`}>
                      <Button color="primary" className="p-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button color="primary" className="p-2">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 