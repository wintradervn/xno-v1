import DatePicker from "@/components/ui/DatePicker";
import { Calendar } from "solar-icon-set";

export default function SubTabLichSuChiaCoTuc() {
  return (
    <div className="relative h-full w-full">
      <div className="flex w-1/2 min-w-[600px] flex-col">
        <div className="absolute -top-11 right-0">
          <div className="flex items-center gap-2 text-sm text-muted">
            <div>Từ ngày</div>
            <DatePicker
              className="w-fit *:data-[slot='inner-wrapper']:gap-x-0 [&>div>div]:gap-x-0! [&>div]:h-[36px]! [&>div]:min-h-0 [&>div]:rounded-[4px] [&>div]:border-[1px] [&>div]:border-neutral-800"
              selectorIcon={<Calendar />}
            />
            <div>đến ngày</div>
            <DatePicker
              className="w-fit *:data-[slot='inner-wrapper']:gap-x-0 [&>div>div]:gap-x-0! [&>div]:h-[36px]! [&>div]:min-h-0 [&>div]:rounded-[4px] [&>div]:border-[1px] [&>div]:border-neutral-800"
              selectorIcon={<Calendar />}
            />
          </div>
        </div>
        <div
          className="grid grid-cols-2 py-2 text-sm text-muted"
          style={{ gridTemplateColumns: "180px 1fr" }}
        >
          <div>Ngày</div>
          <div>Tiêu đề</div>
        </div>
        {new Array(10).fill(0).map((_, index) => (
          <div
            key={index}
            className="grid py-3 text-sm"
            style={{ gridTemplateColumns: "180px 1fr" }}
          >
            <div>18/08/2024</div>
            <div>
              Hưởng lợi trực tiếp từ hệ thống, điều chỉnh hầu hết hệ thống
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
