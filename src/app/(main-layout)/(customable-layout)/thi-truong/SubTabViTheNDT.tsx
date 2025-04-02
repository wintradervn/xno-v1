import ViThePhaiSinhRongBarChart from "@/components/charts/ViThePhaiSinhRongBarChart";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Divider from "@/components/ui/Divider";
import Dropdown from "@/components/ui/Dropdown";
import ChevronDown from "@/icons/ChevronDown";
import { DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useState } from "react";

export default function SubTabViTheNDT() {
  const [selectedMaHD, setSelectedMaHD] = useState<string>("");
  return (
    <div className="relative flex h-full flex-1 flex-col gap-2">
      <div className="absolute -top-10 right-0">
        <Dropdown
          placement="bottom"
          classNames={{ content: "min-w-0 w-[120px] p-0", base: "w-[120px]!" }}
        >
          <DropdownTrigger>
            <Button
              className="flex w-[108px] justify-between bg-content1 px-3"
              endContent={<ChevronDown size={16} />}
            >
              Mã HĐ
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            className="flex flex-col items-start gap-2 bg-content1 text-sm"
            classNames={{
              base: "min-w-0 w-[120px]! bg-transparent!",
              list: " w-[120px]! bg-transparent!",
            }}
          >
            <DropdownItem
              key="VN30F1M"
              className="bg-transparent! text-left"
              onClick={() => setSelectedMaHD("VN30F1M")}
            >
              <Checkbox size="sm" isSelected={selectedMaHD === "VN30F1M"} />
              VN30F1M
            </DropdownItem>
            <DropdownItem
              key="VN30F2M"
              className="bg-transparent! text-left"
              onClick={() => setSelectedMaHD("VN30F2M")}
            >
              <Checkbox size="sm" isSelected={selectedMaHD === "VN30F2M"} />
              VN30F2M
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="text-lineargreen text-caption flex items-center justify-center gap-1 uppercase sm:text-xl sm:font-semibold">
        <div className="text-lineargreen flex items-center gap-1">
          VN30F2411
        </div>
        <div className="text-lineargreen">
          - Vị thế phái sinh ròng các nhà đầu tư
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 text-sm sm:text-md">
        <div>
          Điểm: <span className="font-semibold text-red">1.562.30</span>
        </div>
        <Divider className="h-4!" />
        <div>
          Thay đổi: <span className="font-semibold text-red">-10 (-0.29%)</span>
        </div>
        <Divider className="h-4!" />
        <div>
          OI: <span className="font-semibold text-green">1.562.30</span>
        </div>
        <Divider className="h-4!" />
        <div>
          Basis: <span className="font-semibold text-red">-6</span>
        </div>
      </div>
      <ViThePhaiSinhRongBarChart />
    </div>
  );
}
