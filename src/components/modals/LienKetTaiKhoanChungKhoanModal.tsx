"use client";
import useLienKetTKCKModal from "@/hooks/useLienKetTKCK";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import Input from "../ui/Input";
import { use, useEffect, useState } from "react";
import Button from "../ui/Button";
import { Eye, EyeClosed } from "solar-icon-set";
import { login } from "@/lib/dnse-api";
import { useFormik } from "formik";
import * as Yup from "yup";
import useTaiKhoanChungKhoan from "@/hooks/useTaiKhoanChungKhoan";
import { toast } from "react-toastify";

const list = [
  { name: "Chứng khoán XNO" },
  { name: "Chứng khoán SSI" },
  { name: "Chứng khoán DNSE" },
  { name: "Chứng khoán TCBS" },
];

export default function LienKetTaiKhoanChungKhoanModal() {
  const { isOpen, toggle } = useLienKetTKCKModal();
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const handleLoginSuccess = () => {
    toggle();
    toast.success("Đã liên kết tài khoản chứng khoán thành công!", {
      position: "bottom-right",
    });
  };
  useEffect(() => {
    setSelectedBroker("");
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={toggle}
      // closeButton={<CloseSquareBroken />}
      classNames={{
        header: "p-4",
        wrapper: "rounded-[8px]",
        base: "rounded-[8px] bg-card min-w-0 w-fit max-w-full",
        closeButton:
          "p-0! top-3 right-3 hover:bg-transparent hover:text-foreground text-muted transition-colors",
        backdrop: "bg-neutral-900/50 dark:bg-transparent",
      }}
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-2">
            {selectedBroker ? (
              <>
                <img src="/image/dnse.png" />
                CHỨNG KHOÁN DNSE
              </>
            ) : (
              "Vui lòng liên kết tài khoản chứng khoán"
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          {!!selectedBroker ? (
            <LoginForm onSuccess={handleLoginSuccess} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                {list.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-content1 flex cursor-pointer items-center gap-3 rounded-[4px] p-3 text-sm font-semibold text-white sm:w-[260px]"
                    onClick={() => setSelectedBroker(item.name)}
                  >
                    <img src="/image/dnse.png" />
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="mb-2 flex items-center gap-2 py-2 text-sm">
                Bạn chưa có tài khoản chứng khoán?{" "}
                <div className="text-linearpurple">Mở tài khoản</div>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string | null>(null);
  const { setTaiKhoanChungKhoan } = useTaiKhoanChungKhoan();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Tài khoản không được bỏ trống"),
      password: Yup.string().required("Mật khẩu không được bỏ trống"),
    }),
    onSubmit: (values, formikHelpers) => {
      login(values.username, values.password)
        .then(async (res) => {
          formikHelpers.setSubmitting(false);
          const data = await res.json();
          if (res.ok) {
            setTaiKhoanChungKhoan("DNSE", data.token);
            onSuccess?.();
          } else {
            if (data.code === "AUTH_FAIL") {
              setSubmitErrors("Tài khoản hoặc mật khẩu không chính xác!");
            } else {
              setSubmitErrors(data.message || "Đã có lỗi xảy ra!");
            }
          }
        })
        .catch((err) => {
          formikHelpers.setSubmitting(false);
          setSubmitErrors("Đã có lỗi xảy ra!");
        });
    },
  });

  return (
    <form
      className="flex w-[480px] max-w-full flex-col gap-5 pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <div className="text-muted flex flex-col gap-2 text-sm font-semibold">
        <div>
          Tài khoản<span className="text-red pl-1">*</span>
        </div>

        <Input
          variant="bordered"
          classNames={{
            inputWrapper:
              "border-neutral-800 data-[focus=true]:border-neutral-500! data-[hover=true]:border-neutral-600!",
          }}
          placeholder="Nhập tài khoản"
          value={formik.values.username}
          onChange={formik.handleChange}
          name="username"
          errorMessage={formik.submitCount > 0 && formik.errors.username}
          isInvalid={formik.submitCount > 0 && !!formik.errors.username}
        />
        <div>
          Mật khẩu <span className="text-red pl-1"> *</span>
        </div>
        <Input
          variant="bordered"
          classNames={{
            inputWrapper:
              "border-neutral-800 data-[focus=true]:border-neutral-500! data-[hover=true]:border-neutral-600!",
          }}
          placeholder="Nhập mật khẩu"
          type={isVisiblePassword ? "text" : "password"}
          endContent={
            <button
              className="flex items-center text-neutral-400"
              type="button"
              onClick={() => setIsVisiblePassword((prev) => !prev)}
              aria-label="toggle password visibility"
            >
              {isVisiblePassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          }
          value={formik.values.password}
          name="password"
          onChange={formik.handleChange}
          errorMessage={formik.submitCount > 0 && formik.errors.password}
          isInvalid={formik.submitCount > 0 && !!formik.errors.password}
        />
      </div>
      <Button
        color="secondary"
        className="font-semibold"
        type="submit"
        isDisabled={!formik.isValid}
        isLoading={formik.isSubmitting}
      >
        Kết nối
      </Button>
      {submitErrors && (
        <div className="text-red -mt-2 text-sm">{submitErrors}</div>
      )}
      <div className="text-sm">
        Bằng cách nhấn “Kết nối”, bạn xác nhận rằng mình đã đọc, hiểu cảnh báo
        và đồng ý tuân thủ toàn bộ các điều khoản đăng nhập.
      </div>
      <div className="relative my-3 h-[1px] w-full bg-neutral-500">
        <div className="bg-card text-md text-muted absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4">
          Hoặc
        </div>
      </div>
      <Button className="bg-white font-semibold text-[#1FAD8E]">
        Mở tài khoản
      </Button>
    </form>
  );
}
