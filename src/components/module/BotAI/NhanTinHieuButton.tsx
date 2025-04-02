export default function NhanTinHieuButton({
  toggleModal,
}: {
  toggleModal: () => void;
}) {
  return (
    <div className="text-refine-bg hover:text-refine-bg group relative z-1 block h-[24px] cursor-pointer appearance-none transition-all duration-100 hover:no-underline focus:outline-hidden active:scale-[0.96]">
      <div className="blur-0 absolute -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] z-[-1] overflow-hidden rounded-full">
        <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-14px] left-[-12.5%] aspect-square h-auto w-[125%]"></div>
      </div>
      <div className="absolute -top-1 -right-1 -bottom-1 -left-1 z-[-1] overflow-hidden rounded-full opacity-0 blur-[1px] transition-all duration-300 group-hover:opacity-70 group-hover:blur-[4px]">
        <div className="bg-landing-rainbow animate-spin-slow animate-pause group-hover:animate-running absolute top-[-14px] left-[-12.5%] aspect-square h-auto w-[125%]"></div>
      </div>
      <div className="bg-card rounded-full group-hover:bg-white group-hover:dark:bg-black">
        <div className="flex items-center justify-center gap-2 transition-transform duration-100 ease-in-out">
          <div
            className="animate-pause group-hover:animate-running text-foreground h-[24px]! rounded-full px-2 py-1 text-xs font-medium text-nowrap transition-colors select-none"
            onClick={toggleModal}
          >
            Nhận tín hiệu
          </div>
        </div>
      </div>
    </div>
  );
}
