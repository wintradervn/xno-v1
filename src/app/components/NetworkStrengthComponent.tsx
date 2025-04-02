"use client";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Tooltip } from "@heroui/react";
import { use, useEffect, useState } from "react";
import { HomeWifi } from "solar-icon-set";

export default function NetWorkStrengthComponent() {
  const [isClient, setIsClient] = useState(false);
  const [networkStrength, setNetworkStrength] = useState<
    "strong" | "slow" | "offline"
  >("strong");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const changeHandler = () => {
        const connection = (navigator as any).connection;
        if (connection.downlink > 2) {
          setNetworkStrength("strong");
        } else if (navigator.onLine) {
          setNetworkStrength("slow");
        } else {
          setNetworkStrength("offline");
        }
      };
      if ("connection" in navigator) {
        (navigator as any).connection.onchange = changeHandler;
        changeHandler();
      } else {
        window.addEventListener("online", () => setNetworkStrength("strong"));
        window.addEventListener("offline", () => setNetworkStrength("offline"));
      }
    }
  }, [isClient]);

  return (
    <Tooltip
      content={(() => {
        let text = "";
        let color = "green";

        if (networkStrength === "strong") {
          text = "Kết nối ổn định";
        } else if (networkStrength === "slow") {
          text = "Kết nối chậm";
          color = "yellow";
        } else {
          text = "Không có kết nối";
          color = "red";
        }
        return (
          <div className={cn("flex items-center gap-2 p-2", "text-" + color)}>
            <HomeWifi size={20} />
            {text}
          </div>
        );
      })()}
    >
      <div
        className={cn(
          "text-muted hover:text-foreground flex h-fit w-[42px] min-w-0 flex-col items-center bg-transparent! px-2 py-2 transition-colors",
        )}
      >
        <HomeWifi size={24} />
        <span className={cn("text-2xs font-semibold text-nowrap")}>
          Kết nối
        </span>
      </div>
    </Tooltip>
  );
}
