"use client";

import { use, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import GoogleLogo from "@/icons/GoogleLogo";
import { useAuthStore } from "@/store/auth";
import { set } from "date-fns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { cn } from "@/lib/utils";

enum LoginStep {
  LOGIN,
  UPDATE_INFO,
  DONE,
}
export default function LoginPage() {
  const [loginStep, setLoginStep] = useState<LoginStep>(LoginStep.LOGIN);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (user) {
    router.replace("/");
  }

  // const handleEmailLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     toast.success("Đăng nhập thành công");
  //     // router.push("/");
  //   } catch (err) {
  //     toast.error("Đăng nhập thất bại");
  //     console.error(err);
  //   }
  // };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Đăng nhập thành công");
      router.push("/");
      setLoginStep(LoginStep.UPDATE_INFO);
    } catch (err) {
      toast.error("Đăng nhập thất bại");
      console.error(err);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (err) {
      toast.error("Đăng nhập thất bại");
      console.error(err);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-3">
      <div className="bg-card w-fit space-y-8 rounded-[8px] p-8 shadow-lg">
        {loginStep === LoginStep.LOGIN && (
          <div className="flex w-full max-w-md flex-col items-center gap-5 px-3 py-6 pt-2 sm:px-12">
            <img
              src="/logo.png"
              alt="XNO logo"
              className="mb-4 w-42 shrink-0"
              style={{ objectFit: "contain" }}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-semibold sm:text-3xl">
                Đăng nhập
              </div>
              <div className="pt-1 text-sm sm:text-base">
                Bạn đã có tài khoản? Đăng nhập
              </div>
            </div>
            <Button
              className="text-md w-full bg-white font-semibold text-[#344054] sm:text-lg"
              onClick={handleGoogleLogin}
            >
              <div className="shrink-0">
                <GoogleLogo />
              </div>
              Đăng nhập bằng Google
            </Button>
            {/* <Button
            className="w-full bg-[#1877F2] text-lg font-semibold text-white"
            onClick={handleFacebookLogin}
          >
            <FacebookLogo />
            Đăng nhập bằng Facebook
          </Button> */}
          </div>
        )}
        {loginStep === LoginStep.UPDATE_INFO && (
          <div className="flex w-full max-w-[700px] flex-col items-center gap-5 px-3 py-6 pt-2 sm:px-12">
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-semibold sm:text-3xl">
                Đăng nhập
              </div>
              <div className="pt-1 text-sm sm:text-base">
                Vui lòng nhập thông tin của bạn để hoàn thành đăng nhập
              </div>
            </div>
            <Formik
              initialValues={{ name: "", phone: "" }}
              validate={(values) => {
                const errors: any = {};
                if (!values.name) {
                  errors.name = "Yêu cầu nhập tên";
                }
                if (!values.phone) {
                  errors.phone = "Yêu cầu nhập số điện thoại";
                } else if (!/^(0[1-9]{1}[0-9]{8})$/.test(values.phone)) {
                  errors.phone = "Số điện thoại không hợp lệ";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                // console.log("Form data", values);
                // setSubmitting(false);
              }}
            >
              {({ isValid }) => (
                <Form className="flex w-full flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className="text-md font-semibold text-[#98A2B3]"
                    >
                      Họ tên
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="rounded-[8px] border-1 border-neutral-500 px-3 py-2 text-sm"
                      placeholder="Vui lòng nhập họ tên..."
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red text-sm font-normal"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-md font-semibold text-[#98A2B3]"
                    >
                      Số điện thoại
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      className="rounded-[8px] border-1 border-neutral-500 px-3 py-2 text-sm"
                      placeholder="Vui lòng nhập số điện thoại..."
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red text-sm font-normal"
                    />
                  </div>
                  <Button
                    color="primary"
                    className={cn(
                      "text-md mt-5 w-full bg-white font-semibold text-[#344054] sm:text-lg",
                      isValid ? "" : "brightness-75",
                    )}
                    type="submit"
                    style={{
                      background: isValid
                        ? "linear-gradient(135deg, #CFF8EA 0%, #67E1C0 100%)"
                        : "linear-gradient(135deg, #a2b9b1 0%, #58af98 100%)",
                    }}
                    isDisabled={!isValid}
                  >
                    Đăng nhập
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
}
