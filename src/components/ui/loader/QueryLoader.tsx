import { ReactNode } from "react";
import Loader from "./Loader";

interface QueryLoaderProps {
  isLoading: boolean;
  error?: unknown;
  children: ReactNode;
  loadingText?: string;
}

export default function QueryLoader({
  isLoading,
  error,
  children,
  loadingText,
}: QueryLoaderProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">Something went wrong</p>
          <p className="text-gray-500 text-sm mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 