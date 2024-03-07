"use client";
import { MessagesProvider } from "@/context/messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

const Provider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MessagesProvider>{children}</MessagesProvider>
    </QueryClientProvider>
  );
};

export default Provider;
