"use client";

import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export default function Updater() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);
  return <></>;
}
