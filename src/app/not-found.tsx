"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "solar-icon-set";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p>Không tìm thấy trang</p>
      <span
        className="flex cursor-pointer items-center gap-2 text-blue-500 hover:text-blue-400"
        onClick={() => router.back()}
      >
        <ArrowLeft /> Quay trở lại
      </span>
    </div>
  );
}
