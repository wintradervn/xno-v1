"use client";
import { CloseSquareBroken } from "@/icons/CloseSquareBroken";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { RoundedMagnifer } from "solar-icon-set";
import Input from "../ui/Input";
import DoubleArrow from "@/icons/DoubleArrow";
import { Plus } from "lucide-react";
import Button from "../ui/Button";
import useChiTietDanhMucModal from "@/hooks/useChiTietDanhMucModal";

const EdgeSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="100 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M 200,0 A 100,100 0 0,1 100,100 L 200,100 Z" fill="#0A0E14" />
  </svg>
);
export default function QuanTriDanhMucModal() {
  const { isOpen, toggle } = useChiTietDanhMucModal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={toggle}
      closeButton={<CloseSquareBroken />}
      classNames={{
        header: "p-4",
        wrapper: "rounded-[4px]",
        base: "rounded-[6px] bg-background !max-w-[1400px]",
        closeButton:
          "!p-0 top-3 right-3 hover:bg-transparent hover:text-white text-muted transition-colors",
        body: "",
      }}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <div className="border-lineargreen text-lineargreen w-fit border-b-2 px-2 py-2 text-sm font-semibold">
            Quản trị danh mục cổ phiếu
          </div>
        </ModalHeader>
        <ModalBody className="px-4 pb-4 pt-0">
          <Input
            classNames={{ inputWrapper: "bg-card" }}
            startContent={<RoundedMagnifer size={20} />}
            size="sm"
            placeholder="Mã CK"
          />
          <div className="flex flex-col gap-1 rounded-[8px] bg-card p-2">
            <div
              className="grid text-nowrap text-sm text-muted"
              style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
            >
              <div>STT</div>
              <div>Mã CK</div>
              <div>Giá hiện tại</div>
              <div>Trạng thái</div>
              <div>RS</div>
              <div>Giá vốn</div>
              <div>Cắt lỗ</div>
              <div>Khối lượng</div>
              <div>Lãi/Lỗ</div>
              <div>Trailing stop</div>
              <div>KL khuyến nghị</div>
              <div>Action score</div>
              <div>Định giá</div>
              <div>Đồ thị</div>
              <div>Xóa</div>
            </div>
            <div className="h-40"></div>
          </div>
          <div className="flex">
            <div className="flex-1 flex-shrink-0">
              <div className="flex w-fit flex-col gap-3">
                <div className="flex gap-3 px-2 pt-1">
                  <div className="flex flex-col gap-3">
                    <div className="bg-lineargreen relative rounded-[8px] p-3 pr-[32px] text-black">
                      <div className="mb-2 text-sm text-neutral-600">
                        Tài sản ròng
                      </div>
                      <div className="text-lg font-semibold">
                        1,000,000,000 vnđ
                      </div>
                      <div className="bg-lineargreen absolute -bottom-1 -right-1 h-[32px] w-[32px] rounded-full border-4 border-background"></div>
                      <div className="absolute bottom-0 right-[28px] z-10 text-background">
                        <EdgeSvg />
                      </div>
                      <div
                        className="absolute bottom-0 right-[12px] z-10 text-background"
                        style={{ transform: "rotateY(180deg)" }}
                      >
                        <EdgeSvg />
                      </div>
                      <div className="rotate- absolute bottom-[28px] right-0 text-background">
                        <EdgeSvg />
                      </div>
                      <div
                        className="absolute bottom-[12px] right-0 z-10 text-background"
                        style={{ transform: "rotateX(180deg) " }}
                      >
                        <EdgeSvg />
                      </div>
                    </div>
                    <div className="bg-linearpurple relative rounded-[8px] p-3 text-black">
                      <div className="mb-2 text-sm text-neutral-600">
                        Rủi ro/Lệnh
                      </div>
                      <div className="text-lg font-semibold">2.0% nav</div>{" "}
                      <div className="bg-linearpurple absolute -bottom-1 -right-1 h-[32px] w-[32px] rounded-full border-4 border-background"></div>
                      <div className="absolute bottom-0 right-[28px] z-10 text-background">
                        <EdgeSvg />
                      </div>
                      <div
                        className="absolute bottom-0 right-[12px] z-10 text-background"
                        style={{ transform: "rotateY(180deg)" }}
                      >
                        <EdgeSvg />
                      </div>
                      <div className="rotate- absolute bottom-[28px] right-0 text-background">
                        <EdgeSvg />
                      </div>
                      <div
                        className="absolute bottom-[12px] right-0 z-10 text-background"
                        style={{ transform: "rotateX(180deg) " }}
                      >
                        <EdgeSvg />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="max-w-[360px] flex-1 rounded-[8px] border-1 border-teal-200 bg-card p-3 py-2.5">
                      <div className="mb-2 text-sm text-neutral-500">
                        Rủi ro toàn danh mục
                      </div>
                      <div className="text-lg font-semibold">12.0% nav</div>
                    </div>
                    <div className="border-purple-200 max-w-[360px] flex-1 rounded-[8px] border-1 border-[#B7B1FF] bg-card p-3 py-2.5">
                      <div className="mb-2 text-sm text-neutral-500">
                        Xếp hạng danh mục của bạn trong % mạnh nhất thị trường
                      </div>
                      <div className="text-lg font-semibold">36.1%</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 px-2 pt-1">
                  <Button className="bg-linearpurple flex-1 font-semibold text-black">
                    Cập nhật
                  </Button>
                  <Button className="bg-lineargreen flex-1 font-semibold text-black">
                    Thêm mã
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-shrink-1 max-w-[800px] flex-1 rounded-[8px] bg-card p-2">
              <div className="text-linearpurple px-2 py-1 font-semibold">
                Bảng tín hiệu robot
              </div>
              <div className="pl-2 pt-1">
                <div className="grid grid-cols-8 py-1 text-sm text-muted">
                  <div>STT</div>
                  <div>Mã CK</div>
                  <div className="text-center">Giá vào</div>
                  <div className="text-center">Trailing stop</div>
                  <div className="text-center">Ngày mua</div>
                  <div className="text-center">Giá hiện tại</div>
                  <div className="text-center">Lãi/Lỗ</div>
                  <div className="text-center">Thêm</div>
                </div>
                <div className="grid grid-cols-8 py-2 text-sm text-white">
                  <div>1</div>
                  <div>SZC</div>
                  <div className="text-linearpurple text-center">37.35</div>
                  <div className="text-center text-red">37</div>
                  <div className="text-center">24/10/2024</div>
                  <div className="text-center">38.5</div>
                  <div className="flex items-center justify-center text-green">
                    <DoubleArrow />
                    +1.7%
                  </div>
                  <div className="flex justify-center">
                    <Plus size={16} />
                  </div>
                </div>
                <div className="grid grid-cols-8 py-2 text-sm text-white">
                  <div>2</div>
                  <div>SZC</div>
                  <div className="text-linearpurple text-center">37.35</div>
                  <div className="text-center text-red">37</div>
                  <div className="text-center">24/10/2024</div>
                  <div className="text-center">38.5</div>
                  <div className="flex items-center justify-center text-green">
                    <DoubleArrow />
                    +1.7%
                  </div>
                  <div className="flex justify-center">
                    <Plus size={16} />
                  </div>
                </div>
                <div className="grid grid-cols-8 py-2 text-sm text-white">
                  <div>3</div>
                  <div>SZC</div>
                  <div className="text-linearpurple text-center">37.35</div>
                  <div className="text-center text-red">37</div>
                  <div className="text-center">24/10/2024</div>
                  <div className="text-center">38.5</div>
                  <div className="flex items-center justify-center text-green">
                    <DoubleArrow />
                    +1.7%
                  </div>
                  <div className="flex justify-center">
                    <Plus size={16} />
                  </div>
                </div>
                <div className="grid grid-cols-8 py-2 text-sm text-white">
                  <div>4</div>
                  <div>SZC</div>
                  <div className="text-linearpurple text-center">37.35</div>
                  <div className="text-center text-red">37</div>
                  <div className="text-center">24/10/2024</div>
                  <div className="text-center">38.5</div>
                  <div className="flex items-center justify-center text-green">
                    <DoubleArrow />
                    +1.7%
                  </div>
                  <div className="flex justify-center">
                    <Plus size={16} />
                  </div>
                </div>
                <div className="grid grid-cols-8 py-2 text-sm text-white">
                  <div>5</div>
                  <div>SZC</div>
                  <div className="text-linearpurple text-center">37.35</div>
                  <div className="text-center text-red">37</div>
                  <div className="text-center">24/10/2024</div>
                  <div className="text-center">38.5</div>
                  <div className="flex items-center justify-center text-green">
                    <DoubleArrow />
                    +1.7%
                  </div>
                  <div className="flex justify-center">
                    <Plus size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}