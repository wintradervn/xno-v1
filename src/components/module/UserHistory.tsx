"use client";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@nextui-org/react";

import { useState } from "react";

import useTaiKhoanChungKhoan from "@/hooks/useTaiKhoanChungKhoan";
import useLienKetTKCKModal from "@/hooks/useLienKetTKCK";
import useDNSEUserInfo from "@/hooks/dnse/useDNSEUserInfo";

import DanhMucSoHuu from "./DanhMucSoHuu";
import SoLenhThuong from "./SoLenhThuong";
import SoLenhDieuKien from "./SoLenhDieuKien";
import UnfinishedFeature from "../ui/UnfinishedFeature";

function UserHistory() {
  const [selectedTab, setSelectedTab] = useState("solenhthuong");
  const { name } = useTaiKhoanChungKhoan();
  const { toggle } = useLienKetTKCKModal();
  const { data: userInfo } = useDNSEUserInfo();
  const isConnected = !!name && !!userInfo;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tab: "px-2 py-0 text-sm font-semibold text-cyan-400",
          cursor: "w-full",
          tabContent: "group-data-[selected=true]:!text-lineargreen",
        }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="solenhthuong" title="Sổ lệnh thường"></Tab>
        <Tab key="solenhdieukien" title="Sổ lệnh điều kiện"></Tab>
        <Tab key="danhmucsohuu" title="Danh mục sở hữu"></Tab>
        <Tab key="giaodichbot" title="Giao dịch bot"></Tab>
      </Tabs>
      {isConnected ? (
        <>
          <div>
            {selectedTab === "solenhthuong" && <SoLenhThuong />}
            {selectedTab === "solenhdieukien" && <SoLenhDieuKien />}
            {selectedTab === "danhmucsohuu" && <DanhMucSoHuu />}
            {selectedTab === "giaodichbot" && <UnfinishedFeature />}
          </div>
        </>
      ) : (
        <div className="flex h-28 w-full flex-col items-center justify-center gap-2 text-sm">
          <div>Bạn chưa liên kết tài khoản chứng khoán</div>
          <div
            className="text-linearpurple underline-green cursor-pointer border-b border-[#B7B1FF] font-semibold hover:brightness-125"
            onClick={toggle}
          >
            Vui lòng liên kết tài khoản
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHistory;
