import { Spinner } from "@nextui-org/react";

export default function DefaultLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <Spinner />
    </div>
  );
}
