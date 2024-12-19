export default function DefaultNodata({
  text = "Không có dữ liệu",
}: {
  text?: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <img src="/nodata.svg" className="h-[80px] w-[80px]" />
      <div className="text-sm text-muted">{text}</div>
    </div>
  );
}
