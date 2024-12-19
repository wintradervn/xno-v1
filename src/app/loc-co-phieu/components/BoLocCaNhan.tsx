export default function BoLocCaNhan() {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-lineargreen text-sm font-bold uppercase">
        Bộ lọc cá nhân
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <div>
          <img src="/no-message.svg" />
        </div>
        <div className="text-sm text-muted">
          Bạn chưa có danh sách bộ lọc nào!
        </div>
      </div>
    </div>
  );
}
