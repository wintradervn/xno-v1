export default function BoLocCaNhan() {
  return (
    <div className="flex flex-col gap-5">
      <div className="border-b-1 border-neutral-800 p-3 text-md font-semibold">
        Bộ lọc cá nhân
      </div>
      <div className="flex w-full flex-col items-center gap-4 border-b-1 border-neutral-800">
        <div className="flex flex-col items-center gap-5 py-5">
          <img src="/no-message.svg" />
          <div className="text-sm text-muted">
            Bạn chưa có danh sách bộ lọc nào!
          </div>
        </div>
      </div>
    </div>
  );
}
