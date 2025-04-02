export default function DefaultNodata({
  text = "Không có dữ liệu",
}: {
  text?: string;
}) {
  return (
    <div className="flex h-[300px] min-h-full w-full flex-col items-center justify-center gap-4 py-4 sm:h-[250px]">
      <img src="/nodata.svg" className="h-[80px] w-[80px]" />
      <div className="text-muted text-sm">{text}</div>
    </div>
  );
}
