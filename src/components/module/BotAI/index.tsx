"use client";
import { Tab } from "@heroui/react";
import Tabs from "../../ui/Tabs";
import BotPhaiSinhSignal from "./BotPhaiSinhSignal";
import BotCoSoSignal from "./BotCoSoSignal";
import { useState } from "react";
import BotPhaiSinhSanBot from "./BotPhaiSinhSanBot";
import useTheme from "@/hooks/useTheme";
import BotCoSoSanBot from "./BotCoSoSanBot";
import { BotCuaToi } from "./BotCuaToi";
import { useAuthStore } from "@/store/auth";
import ProFeatureLocker from "@/components/ui/ProFeatureLocker";

export default function BotAI() {
  const [selectedTab, setSelectedTab] = useState("tinhieu");

  return (
    <div className="flex h-full min-w-[300px] flex-col gap-3">
      <Tabs
        variant="underlined"
        color="secondary"
        className="shrink-0"
        classNames={{
          tabList: "w-full",
          tab: "px-2 py-0 text-sm font-semibold min-w-fit shrink-0 flex-1",
          panel: "h-full w-full flex-1 min-h-0 pb-0 p-0 flex-1",
          cursor: "w-full",
        }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="tinhieu" title="Tín hiệu" />
        <Tab key="botphaisinh" title="Bot phái sinh" />
        <Tab key="botcoso" title="Bot cơ sở" />
        <Tab key="botcuatoi" title="Bot của tôi" />
      </Tabs>
      <div className="relative flex-1 overflow-y-auto">
        {selectedTab === "tinhieu" && <TabTinHieu />}
        {selectedTab === "botphaisinh" && <TabSanBot selectedTab="phaisinh" />}
        {selectedTab === "botcoso" && <TabSanBot selectedTab="coso" />}
        {selectedTab === "botcuatoi" && <BotCuaToi />}
      </div>
    </div>
  );
}

function TabTinHieu() {
  const { isLightMode } = useTheme();
  const user = useAuthStore((state) => state.user);

  return !user ? (
    <ProFeatureLocker
      bgUrl="/image/blur-bot-cua-toi.png"
      lightBgUrl="/image/blur-bot-cua-toi-light.png"
      backgroundSize={"cover"}
    />
  ) : (
    <Tabs
      classNames={{
        tabList: "w-full rounded-[8px] rounded-[8px] overflow-hidden h-8",
        base: "w-full overflow-hidden rounded-[8px] h-8",
        tab: "flex-1 h-8 group-data-[selected=true]:text-purple!",
        cursor:
          "rounded-none rounded-[8px] h-8 bg-linearpurple dark:bg-lineargreen",
        panel: "p-0 pt-4",
        tabContent: isLightMode
          ? "group-data-[selected=true]:text-purple"
          : "group-data-[selected=true]:text-black",
      }}
    >
      <Tab title="Bot Phái sinh">
        <BotPhaiSinhSignal />
      </Tab>
      <Tab title="Bot cơ sở">
        <BotCoSoSignal />
      </Tab>
    </Tabs>
  );
}

function TabSanBot({ selectedTab }: { selectedTab: string }) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-auto">
        {selectedTab === "phaisinh" ? <BotPhaiSinhSanBot /> : <BotCoSoSanBot />}
      </div>
    </div>
  );
}
