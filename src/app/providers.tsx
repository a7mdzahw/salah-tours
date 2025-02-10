"use client";

import StyledComponentsRegistry from "@salah-tours/components/ui/styled.registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledComponentsRegistry>
        {children}
      </StyledComponentsRegistry>
    </QueryClientProvider>
  );
}
