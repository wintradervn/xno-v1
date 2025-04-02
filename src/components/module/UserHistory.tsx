"use client";
import Tabs from "@/components/ui/Tabs";
import { Tab } from "@heroui/react";

import { useState } from "react";

import useTaiKhoanChungKhoan from "@/hooks/useTaiKhoanChungKhoan";
import useLienKetTKCKModal from "@/hooks/useLienKetTKCK";
import useDNSEUserInfo from "@/hooks/dnse/useDNSEUserInfo";

import DanhMucSoHuu from "./DanhMucSoHuu";
import SoLenhThuong from "./SoLenhThuong";
import SoLenhDieuKien from "./SoLenhDieuKien";
import UnfinishedFeature from "../ui/UnfinishedFeature";
import useDNSEDeals from "@/hooks/dnse/useDNSEDeals";

function UserHistory() {
  const [selectedTab, setSelectedTab] = useState("solenhthuong");
  const { name } = useTaiKhoanChungKhoan();
  const { data: deals } = useDNSEDeals();
  const { toggle } = useLienKetTKCKModal();
  const { data: userInfo } = useDNSEUserInfo();
  const isConnected = !!name && !!userInfo;

  return (
    <div className="flex h-full min-h-[250px] w-full flex-col gap-4">
      <Tabs
        variant="underlined"
        color="secondary"
        classNames={{
          tab: "px-0.5 sm:px-2 py-0 text-sm font-semibold text-cyan-400 min-w-fit",
          cursor: "w-full",
          tabList: "w-fit !overflow-x-none w-[500px]!",
          base: "overflow-x-auto shrink-0",
        }}
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="solenhthuong" title="Sổ lệnh thường"></Tab>
        <Tab key="solenhdieukien" title="Sổ lệnh điều kiện"></Tab>
        <Tab
          key="danhmucsohuu"
          title={
            "Danh mục sở hữu " + (deals?.length ? `(${deals?.length})` : "")
          }
        ></Tab>
        <Tab key="giaodichbot" title="Giao dịch bot"></Tab>
      </Tabs>
      {isConnected ? (
        <>
          <div>
            {selectedTab === "solenhthuong" && <SoLenhThuong />}
            {selectedTab === "solenhdieukien" && <SoLenhDieuKien />}
            {selectedTab === "danhmucsohuu" && <DanhMucSoHuu />}
            {selectedTab === "giaodichbot" && (
              <UnfinishedFeature>Giao dịch bot</UnfinishedFeature>
            )}
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
