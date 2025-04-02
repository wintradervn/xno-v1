"use client";
import UserHistory from "@/components/module/UserHistory";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useIsMobile from "@/hooks/useIsMobile";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-1">
          <div className="h-fit">{children}</div>
          {/* <div className="card h-full min-h-[320px]">
            <UserHistory />
          </div> */}
        </div>
      ) : (
        <ResizablePanelGroup direction="vertical" autoSaveId="left-layout">
          <ResizablePanel defaultSize={65}>{children}</ResizablePanel>
          {/* <ResizableHandle />
          <ResizablePanel defaultSize={35}>
            <div className="card h-full min-h-[300px]">
              <UserHistory />
            </div>
          </ResizablePanel> */}
        </ResizablePanelGroup>
      )}
    </>
  );
};
export default ConditionalLayout;
