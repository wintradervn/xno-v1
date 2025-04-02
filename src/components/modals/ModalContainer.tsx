import ChiTietMaCKModal from "@/app/(main-layout)/chi-tiet-ma-ck/ChiTietMaCKModal";
import QuanTriDanhMucModal from "@/components/modals/QuanTriDanhMucModal";
import LienKetTaiKhoanChungKhoanModal from "./LienKetTaiKhoanChungKhoanModal";
import TimMaChungKhoanModal from "./TimMaChungKhoanModal";
import BotModal from "../module/BotAI/BotModal";

export default function ModalContainer() {
  return (
    <>
      <ChiTietMaCKModal />
      <QuanTriDanhMucModal />
      <LienKetTaiKhoanChungKhoanModal />
      <TimMaChungKhoanModal />
      <BotModal />
    </>
  );
}
