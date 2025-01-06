"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useRightPanelState from "@/hooks/useRightPanelState";
import dynamic from "next/dynamic";
const Market = dynamic(() => import("@/components/module/Market"), {
  ssr: false,
});
const Assets = dynamic(() => import("@/components/module/TaiSan"), {
  ssr: false,
});
const News = dynamic(() => import("@/components/module/News"), { ssr: false });
const Overview = dynamic(() => import("@/components/module/Overview"), {
  ssr: false,
});
const Trade = dynamic(() => import("@/components/module/Trade"), {
  ssr: false,
});
const TinHieu = dynamic(() => import("@/components/module/TinHieu"), {
  ssr: false,
});
export default function RightSidePanel() {
  const { state: rightPanelState, setState } = useRightPanelState();

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="flex-1"
      autoSaveId="right-layout"
    >
      <ResizablePanel defaultSize={65} minSize={20}>
        <div className="card h-full">
          {(rightPanelState === "cophieu" && <Market />) ||
            (rightPanelState === "tongquan" && <Overview />) ||
            (rightPanelState === "datlenh" && <Trade />) ||
            (rightPanelState === "tintuc" && <News />) ||
            (rightPanelState === "tinhieu" && <TinHieu />)}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={35} minSize={5}>
        <div className="card h-full">
          <Assets />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
