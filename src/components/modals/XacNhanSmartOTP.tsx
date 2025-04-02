"use client";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { InputOtp } from "@heroui/react";
import Button from "../ui/Button";
import { useState } from "react";
import { validateOTP } from "@/lib/dnse-api";
import useTaiKhoanChungKhoan from "@/hooks/useTaiKhoanChungKhoan";
import { toast } from "react-toastify";

export default function XacNhanSmartOTP({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const isInvalid = value.length < 6;

  const { jwtToken, setTradingToken } = useTaiKhoanChungKhoan();
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (jwtToken && !isInvalid) {
      setIsLoading(true);
      validateOTP(jwtToken, value)
        .then((res) => {
          if (res.tradingToken) {
            setTradingToken(res.tradingToken);
            toast.success("Xác nhận Smart OTP thành công.");
            onClose();
          } else {
            if (res.code === "INVALID_OTP") {
              toast.error("Mã OTP không chính xác, vui lòng nhập lại.");
            } else {
              toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau.");
            }
            setValue("");
          }
        })
        .catch((err) => {
          console.log("🚀 ~ validate ~ err:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        header: "p-4",
        wrapper: "rounded-[8px]",
        base: "rounded-[8px] bg-card min-w-0 w-[500px] max-w-full",
        closeButton:
          "p-0! top-3 right-3 hover:bg-transparent hover:text-foreground text-muted transition-colors",
      }}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex w-full items-center justify-center gap-2">
            Xác nhận OTP
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-col items-center pb-5">
          <div className="text-md text-muted">
            Nhập smart OTP lấy từ app EntradeX.
          </div>
          <div className="flex justify-center">
            <InputOtp
              length={6}
              size="lg"
              radius="md"
              className="dark"
              classNames={{
                input: "rounded-[8px] text-black caret-black",
                segment: "rounded-[6px] text-black caret-black",
                caret: "bg-black",
                wrapper: "gap-4 flex",
                segmentWrapper: "gap-3",
              }}
              placeholder="_"
              value={value}
              onValueChange={setValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validate();
                }
              }}
            />
          </div>
          <div className="flex w-full items-center gap-3">
            <Button color="default" className="flex-1">
              Hủy bỏ
            </Button>
            <Button
              color="secondary"
              className="flex-1"
              onClick={validate}
              isLoading={isLoading}
              isDisabled={isLoading || isInvalid}
            >
              Xác nhận
            </Button>
          </div>
          <a
            href="https://hdsd.dnse.com.vn/giao-dien/man-hinh-menu/lay-ma-smart-otp-khi-giao-dich-web"
            target="_blank"
            className="text-muted text-sm font-medium underline underline-offset-2"
          >
            Hướng dẫn lấy mã Smart OTP
          </a>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
