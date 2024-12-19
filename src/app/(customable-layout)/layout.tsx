import UserHistory from "@/components/module/UserHistory";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-1 flex-col gap-1">
      <ResizablePanelGroup direction="vertical" autoSaveId="left-layout">
        <ResizablePanel defaultSize={65}>{children}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35}>
          <div className="card h-full min-h-[300px]">
            <UserHistory />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
