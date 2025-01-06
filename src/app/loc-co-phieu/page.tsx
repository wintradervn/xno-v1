import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import BoLocCaNhan from "./components/BoLocCaNhan";
import BoLocGoiY from "./components/BoLocGoiY";
import ChonChiTieu from "./components/ChonChiTieu";
import ChonGiaTri from "./components/ChonGiaTri";
import KetQuaLoc from "./components/KetQuaLoc";

export default function LocCoPhieu() {
  return (
    <div className="flex h-full w-full flex-1 gap-1">
      <div className="card flex w-[280px] flex-col gap-1 rounded-[8px] p-0">
        <BoLocCaNhan />
        <BoLocGoiY />
      </div>
      <ResizablePanelGroup
        direction="vertical"
        className="flex h-full flex-1 flex-col"
        autoSaveId="tieu-chi-loc-layout"
      >
        <ResizablePanel className="flex gap-1" defaultSize={75}>
          <ChonChiTieu />
          <ChonGiaTri />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25}>
          <KetQuaLoc />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
