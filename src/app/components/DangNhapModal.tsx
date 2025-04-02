import Button from "@/components/ui/Button";
import FacebookLogo from "@/icons/FacebookLogo";
import GoogleLogo from "@/icons/GoogleLogo";
import { Modal, ModalContent } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function DangNhapModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <div className="flex w-full flex-col items-center gap-5 px-12 py-8">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-semibold">Đăng nhập</div>
            <div className="pt-1">Bạn đã có tài khoản? Đăng nhập</div>
          </div>
          <Button
            className="w-full bg-white text-lg font-semibold text-[#344054]"
            onClick={() => {
              signIn("google", { redirect: false });
              setIsLoading(true);
            }}
            isLoading={isLoading}
          >
            <GoogleLogo />
            Đăng nhập bằng Google
          </Button>
          <Button className="w-full bg-[#1877F2] text-lg font-semibold text-white">
            <FacebookLogo />
            Đăng nhập bằng Facebook
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
