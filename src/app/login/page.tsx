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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (user) {
    router.replace("/");
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (err) {
      toast.error("Đăng nhập thất bại");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Đăng nhập thành công");
      router.push("/");
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
      <div className="bg-card w-full max-w-md space-y-8 rounded-[8px] p-8 shadow-lg">
        <div className="flex w-full flex-col items-center gap-5 px-3 py-6 pt-2 sm:px-12">
          <img
            src="/logo.png"
            alt="XNO logo"
            className="mb-4 w-42 shrink-0"
            style={{ objectFit: "contain" }}
          />
          <div className="flex flex-col items-center">
            <div className="text-2xl font-semibold sm:text-3xl">Đăng nhập</div>
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
      </div>
    </div>
  );
}
