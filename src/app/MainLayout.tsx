"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useToggleRightSidePanel from "@/hooks/useToggleRightSidePanel";

export default function MainLayout({
  leftContent,
  rightContent,
}: Readonly<{
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}>) {
  const { isHidden } = useToggleRightSidePanel();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-[1100px] flex-1"
      autoSaveId="main-layout"
    >
      <ResizablePanel defaultSize={75}>{leftContent}</ResizablePanel>
      {!isHidden && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={25}>{rightContent}</ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
