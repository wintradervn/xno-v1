import SymbolIcon from "@/components/SymbolIcon";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { FileDownload, Calendar, InboxLine } from "solar-icon-set";

const gridTemplateColumns = "1fr 3fr 1fr 1fr 1fr 1fr 1fr 0.5fr";
export default function TabBaoCaoPhanTich() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="h-full w-full overflow-auto">
      <div className="min-w-[880px]">
        <div
          className="text-muted grid w-full gap-2 px-0 py-3 text-sm"
          style={{ gridTemplateColumns: gridTemplateColumns }}
        >
          <div className="bg-card sticky left-0">Ngày</div>
          <div>Tiêu đề</div>
          <div>Nguồn</div>
          <div className="text-right">Khuyến nghị</div>
          <div className="text-right">Giá mục tiêu</div>
          <div className="text-right">Upside</div>
          <div className="text-center">Tóm tắt</div>
        </div>
        {new Array(10).fill(0).map((_, index) => (
          <div
            className="grid w-full gap-2 px-0 py-2 text-sm text-white"
            style={{ gridTemplateColumns: gridTemplateColumns }}
            key={index}
          >
            <div className="bg-card sticky -left-0.5 pl-1">15/10/2024</div>
            <div className="truncate text-nowrap">
              Hưởng lợi trực tiếp từ hệ thống, điều chỉnh hầu hết hệ thống.
            </div>
            <div>Vietcap</div>
            <div className="flex justify-end">
              <div className="badge-green w-18">Mua</div>
            </div>
            <div className="text-right">37.2</div>
            <div className="text-green text-right">+35.04%</div>
            <div
              className="cursor-pointer text-center underline hover:brightness-75"
              onClick={() => setIsOpen(true)}
            >
              Xem
            </div>
          </div>
        ))}
      </div>
      <BaoCaoPhanTichModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

function BaoCaoPhanTichModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: "max-w-[1080px] bg-white dark:bg-[#0A0E14] dark:border-[#1D2939] border-1 rounded-[8px] shadow-lg",
        closeButton: "hover:bg-background active:bg-background",
        backdrop: "bg-neutral-800/30",
        body: "p-5",
      }}
    >
      <ModalContent>
        <ModalHeader className="p-0"></ModalHeader>
        <ModalBody>
          <div className="flex gap-2">
            <SymbolIcon symbol="TPB" className="h-15 w-15" />
            <div className="flex flex-col gap-2">
              <div className="text-linearpurple text-lg font-semibold">
                TPB – Chi phí dự phòng cao hơn kỳ vọng [Thấp hơn dự phóng] – Báo
                cáo KQKD
              </div>
              <div className="text-muted flex gap-5 text-base">
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <div className="text-white">06/03/2025</div>
                </div>
                <div className="flex items-center gap-2">
                  <InboxLine size={20} />
                  <div className="text-white">Vietcap</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-5">
              <div className="bg-[#E3EDF7] px-3 py-2.5 text-sm leading-4.5 dark:bg-[#1D2939]">
                Mã CK
              </div>
              <div className="bg-[#E3EDF7] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#1D2939]">
                Khuyến nghị
              </div>
              <div className="bg-[#E3EDF7] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#1D2939]">
                Giá thị trường
              </div>
              <div className="bg-[#E3EDF7] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#1D2939]">
                Giá mục tiêu
              </div>
              <div className="bg-[#E3EDF7] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#1D2939]">
                Upside
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="border-b-[#1D2939] bg-[#F2F7FC] px-3 py-2.5 text-sm leading-4.5 dark:bg-[#151A24]">
                <div className="flex items-center gap-2">
                  <SymbolIcon symbol="VCB" /> VCB
                </div>
              </div>
              <div className="border-b-[#1D2939] bg-[#F2F7FC] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#151A24]">
                <div className="flex justify-center">
                  <div className="badge-green w-fit">Tăng mạnh</div>
                </div>
              </div>
              <div className="border-b-[#1D2939] bg-[#F2F7FC] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#151A24]">
                17.5
              </div>
              <div className="border-b-[#1D2939] bg-[#F2F7FC] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#151A24]">
                26.8
              </div>
              <div className="border-b-[#1D2939] bg-[#F2F7FC] px-3 py-2.5 text-center text-sm leading-4.5 dark:bg-[#151A24]">
                20%
              </div>
            </div>
          </div>
          <div className="text-sm">
            Tổng quan: Ngân hàng TMCP Tiên Phong (TPB) là một trong những ngân
            hàng thương mại có tốc độ tăng trưởng nhanh tại Việt Nam. TPB tập
            trung vào các hoạt động bán lẻ, tài chính số và dịch vụ cho doanh
            nghiệp nhỏ và vừa. Giá cổ phiếu hiện tại: 22.500 VND/cổ phiếu Mức
            thay đổi trong 6 tháng qua: +12%
          </div>
          <div className="text-sm">
            Tổng quan: Ngân hàng TMCP Tiên Phong (TPB) là một trong những ngân
            hàng thương mại có tốc độ tăng trưởng nhanh tại Việt Nam. TPB tập
            trung vào các hoạt động bán lẻ, tài chính số và dịch vụ cho doanh
            nghiệp nhỏ và vừa. Giá cổ phiếu hiện tại: 22.500 VND/cổ phiếu Mức
            thay đổi trong 6 tháng qua: +12%
          </div>
          <div className="text-sm">
            Tổng quan: Ngân hàng TMCP Tiên Phong (TPB) là một trong những ngân
            hàng thương mại có tốc độ tăng trưởng nhanh tại Việt Nam. TPB tập
            trung vào các hoạt động bán lẻ, tài chính số và dịch vụ cho doanh
            nghiệp nhỏ và vừa. Giá cổ phiếu hiện tại: 22.500 VND/cổ phiếu Mức
            thay đổi trong 6 tháng qua: +12%
          </div>
          <div className="text-sm">
            Tổng quan: Ngân hàng TMCP Tiên Phong (TPB) là một trong những ngân
            hàng thương mại có tốc độ tăng trưởng nhanh tại Việt Nam. TPB tập
            trung vào các hoạt động bán lẻ, tài chính số và dịch vụ cho doanh
            nghiệp nhỏ và vừa. Giá cổ phiếu hiện tại: 22.500 VND/cổ phiếu Mức
            thay đổi trong 6 tháng qua: +12%
          </div>
          <div className="text-sm">
            Tổng quan: Ngân hàng TMCP Tiên Phong (TPB) là một trong những ngân
            hàng thương mại có tốc độ tăng trưởng nhanh tại Việt Nam. TPB tập
            trung vào các hoạt động bán lẻ, tài chính số và dịch vụ cho doanh
            nghiệp nhỏ và vừa. Giá cổ phiếu hiện tại: 22.500 VND/cổ phiếu Mức
            thay đổi trong 6 tháng qua: +12%
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
