"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <SessionProvider>
        <CookiesProvider>{children}</CookiesProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}
