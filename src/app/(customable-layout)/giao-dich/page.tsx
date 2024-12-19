"use client";
import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("@/components/module/Chart"), {
  ssr: false,
});
const Orderbook = dynamic(() => import("@/components/module/Orderbook"), {
  ssr: false,
});
const MarketHistory = dynamic(
  () => import("@/components/module/MarketHistory"),
  { ssr: false },
);

export default function GiaoDich() {
  const { isIndex } = useCurrentSymbol();
  return (
    <ResizablePanelGroup direction="horizontal" className="flex flex-col">
      <ResizablePanel defaultSize={68} key={"chart"} minSize={15}>
        <div className="card flex h-full items-center justify-center p-2">
          <Chart />
        </div>
      </ResizablePanel>
      {!isIndex ? (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={32} key={"group2"} minSize={15}>
            <ResizablePanelGroup direction="vertical" className="flex flex-col">
              <ResizablePanel defaultSize={50} key={"orderbook"} minSize={15}>
                <div className="card flex h-full items-center justify-center p-2">
                  <Orderbook />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={50}
                key={"market-history"}
                minSize={15}
              >
                <div className="card flex h-full items-center justify-center p-2">
                  <MarketHistory />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </>
      ) : null}
    </ResizablePanelGroup>
  );
}
