import { Tooltip } from "@heroui/react";

const data = { gia: 39.56, kl: "3.3M", change: 12.4 };

export default function SubTabMucGia() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-[2px] bg-green"></div>
          <div>Mua</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-[2px] bg-red"></div>
          <div>Bán</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-[2px] bg-white"></div>
          <div>Không xác định</div>
        </div>
      </div>
      <div className="w-full">
        <div
          className="grid text-muted"
          style={{ gridTemplateColumns: "1.7fr 1fr 40px" }}
        >
          <div>Giá</div>
          <div>Tổng KL</div>
          <div>%</div>
        </div>
        <div>
          {new Array(10).fill(data).map((item, index) => (
            <div
              key={index}
              className="text-s1 grid py-1.5"
              style={{ gridTemplateColumns: "1.7fr 1fr 40px" }}
            >
              <div className="flex items-center gap-1 text-green">
                {item.gia}
                <Tooltip
                  classNames={{
                    content: "rounded-[4px]",
                  }}
                  content={
                    <div className="flex w-[145px] flex-col gap-1 p-1 text-sm">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <div className="h-2 w-2 rounded-[2px] bg-green"></div>
                          Mua
                        </div>
                        <div className="font-semibold text-green">46,500</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <div className="h-2 w-2 rounded-[2px] bg-red"></div>
                          Bán
                        </div>
                        <div className="font-semibold text-red">46,500</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <div className="h-2 w-2 rounded-[2px] bg-white"></div>
                          Không xác định
                        </div>
                        <div className="font-semibold">0</div>
                      </div>
                    </div>
                  }
                  showArrow
                >
                  <div className="flex overflow-hidden rounded-[4px]">
                    <div className="h-[14px] w-[60px] bg-green"> </div>
                    <div className="h-[14px] w-[30px] bg-red"> </div>
                  </div>
                </Tooltip>
              </div>
              <div>{item.kl}</div>
              <div>{item.change}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
