"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@salah-tours/helpers/client";

interface Stats {
  totalTours: number;
  mainCategories: number;
  subCategories: number;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ["admin", "stats"],
    queryFn: () => client("/stats"),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Tours" value={stats?.totalTours || 0} />
        <StatCard title="Main Categories" value={stats?.mainCategories || 0} />
        <StatCard title="Sub Categories" value={stats?.subCategories || 0} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
