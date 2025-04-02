"use client";
import DefaultLoader from "@/components/ui/DefaultLoader";
import BarChart from "@/icons/BarChart";
import PhaiSinhIcon from "@/icons/PhaiSinhIcon";
import { cn } from "@/lib/utils";
import { lazy, Suspense, useCallback, useState } from "react";
import { Layers, WalletMoney } from "solar-icon-set";

const TabThiTruong = lazy(() => import("./TabThiTruong"));
const TabTopCoPhieu = lazy(() => import("./TabTopCoPhieu"));
const TabPhaiSinh = lazy(() => import("./TabPhaiSinh"));
const TabNganhNoiBat = lazy(() => import("./TabNganhNoiBat"));

const mainTabs = [
  { id: "thitruong", title: "Thị trường", icon: <BarChart /> },
  { id: "nganhnoibat", title: "Ngành nổi bật", icon: <Layers /> },
  {
    id: "topcophieu",
    title: "Cổ phiếu nổi bật",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.60737 5.60977C9.3952 5.60977 9.19165 5.52544 9.04165 5.37544C8.89165 5.22536 8.80737 5.02192 8.80737 4.80976C8.80737 4.59753 8.89165 4.39409 9.04165 4.24409C9.19165 4.09401 9.3952 4.00977 9.60737 4.00977H13.6074C13.8195 4.00977 14.023 4.09401 14.173 4.24409C14.3231 4.39409 14.4074 4.59753 14.4074 4.80976V8.80973C14.4074 9.0219 14.3231 9.22538 14.173 9.37544C14.023 9.52544 13.8195 9.60973 13.6074 9.60973C13.3952 9.60973 13.1917 9.52544 13.0417 9.37544C12.8917 9.22538 12.8074 9.0219 12.8074 8.80973V6.74098L9.37297 10.1753C9.22297 10.3253 9.01948 10.4096 8.80737 10.4096C8.59525 10.4096 8.39177 10.3253 8.24177 10.1753L6.40737 8.34093L2.97296 11.7753C2.82208 11.921 2.61999 12.0017 2.41024 11.9998C2.20048 11.9981 1.99983 11.9139 1.8515 11.7656C1.70318 11.6173 1.61904 11.4166 1.61722 11.2069C1.6154 10.9971 1.69603 10.795 1.84176 10.6441L5.84177 6.64418C5.99177 6.49418 6.19525 6.4099 6.40737 6.4099C6.61948 6.4099 6.82291 6.49418 6.97297 6.64418L8.80737 8.47853L11.6762 5.60977H9.60737Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  { id: "phaisinh", title: "Phái sinh", icon: <PhaiSinhIcon /> },
];

export default function ThiTruong() {
  const [selectedTab, setSelectedTab] = useState("thitruong");
  const handleLabelClick = useCallback(() => {
    setSelectedTab("nganhnoibat");
  }, []);
  return (
    <div className="-mx-2 mb-2 flex h-full flex-col items-stretch p-2 pt-0 sm:justify-center">
      <div className="no-scrollbar flex gap-1 overflow-auto">
        {mainTabs.map((tab) => (
          <div
            className={cn(
              "flex w-fit shrink-0 cursor-pointer items-center gap-1 text-nowrap rounded-t-[4px] px-4 py-1 text-sm",
              tab.id === selectedTab
                ? "bg-card text-white"
                : "text-muted hover:bg-default-800/30 active:bg-default-800/40",
            )}
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.icon}
            {tab.title}
          </div>
        ))}
      </div>
      <Suspense
        fallback={
          <div className="card -mb-4 h-full min-h-[500px] w-full">
            <DefaultLoader />
          </div>
        }
      >
        {selectedTab === "thitruong" && (
          <div
            className={cn(
              "card -mb-4 min-h-0 flex-1",
              selectedTab === "thitruong" && "rounded-tl-none",
            )}
          >
            <TabThiTruong onLabelClick={handleLabelClick} />
          </div>
        )}
        {selectedTab === "nganhnoibat" && (
          <div className={cn("card -mb-4 h-full min-h-0 flex-1")}>
            <TabNganhNoiBat />
          </div>
        )}
        {selectedTab === "topcophieu" && (
          <div className={cn("-mb-4 h-full min-h-0 flex-1")}>
            <TabTopCoPhieu />
          </div>
        )}
        {selectedTab === "phaisinh" && (
          <div className={cn("card -mb-4 h-full min-h-0 flex-1")}>
            <TabPhaiSinh />
          </div>
        )}
      </Suspense>
    </div>
  );
}
