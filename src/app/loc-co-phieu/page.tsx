import BoLocCaNhan from "./components/BoLocCaNhan";
import BoLocGoiY from "./components/BoLocGoiY";
import ChonChiTieu from "./components/ChonChiTieu";
import ChonGiaTri from "./components/ChonGiaTri";
import KetQuaLoc from "./components/KetQuaLoc";

export default function LocCoPhieu() {
  return (
    <div className="flex w-full flex-1 gap-1">
      <div className="card flex w-[240px] flex-col gap-4">
        <BoLocCaNhan />
        <div className="h-[2px] w-full bg-background"></div>
        <BoLocGoiY />
      </div>
      <div className="flex h-full flex-1 flex-col gap-1">
        <div className="flex gap-1">
          <ChonChiTieu />
          <ChonGiaTri />
        </div>
        <KetQuaLoc />
      </div>
    </div>
  );
}
