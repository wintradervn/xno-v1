"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useIsMobile from "@/hooks/useIsMobile";
import useToggleRightSidePanel from "@/hooks/useToggleRightSidePanel";
import { useEffect, useState } from "react";
import RightNavigation from "../components/RightNavigation";
import DefaultLoader from "@/components/ui/DefaultLoader";

export default function MainLayout({
  leftContent,
  rightContent,
}: Readonly<{
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const { isHidden } = useToggleRightSidePanel();
  const isMobile = useIsMobile();
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="relative flex h-full flex-1 gap-1">
      {isLoading && (
        <div className="bg-card absolute inset-0 z-100">
          <DefaultLoader />
        </div>
      )}
      <div className="no-scrollbar flex h-full min-h-0 flex-1 flex-col sm:overflow-auto">
        {isMobile ? (
          <div className="sm:hidden">
            <MobileLayout
              leftContent={leftContent}
              rightContent={rightContent}
            />
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="hidden! h-full min-h-[600px] flex-1 sm:flex!"
            autoSaveId="main-layout"
          >
            <ResizablePanel defaultSize={75}>{leftContent}</ResizablePanel>
            {isHidden === false && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={25}>{rightContent}</ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>
      <RightNavigation />
    </div>
  );
}

function MobileLayout({
  leftContent,
  rightContent,
}: {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col gap-1">
      {leftContent}
      {rightContent}
    </div>
  );
}
