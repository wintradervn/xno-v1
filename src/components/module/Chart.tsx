import useSWR from "swr";
import TradingViewChart from "../TradingViewChart";
import Checkbox from "../ui/Checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";

const checkboxes = ["PE", "PB", "EPS", "EY", "ROE", "ROA", "VOL", "MA", "EMA", "MACD", "RSI", "BOLL"];

function Chart() {
  // const { data: news, isLoading } = useSWR(`https://protrade.finsc.vn/api/news`, async (url) => {
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   return data.filter((item: any) => !!item.title);
  // });
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <div className="h-full w-full min-w-[200px] flex flex-col gap-2">
      <div className="px-2 text-sm font-semibold w-fit border-b-2 py-2 border-lineargreen text-lineargreen">
        Biểu đồ
      </div>
      <TradingViewChart />
      <div className="flex gap-7 flex-nowrap overflow-hidden py-1 select-none justify-center">
        {checkboxes.map((i) => (
          <div
            key={i}
            className={cn(
              "text-xs font-medium cursor-pointer",
              checked.includes(i) ? "text-linearpurple font-extrabold" : "text-muted hover:text-white"
            )}
            onClick={() => {
              if (checked.includes(i)) {
                setChecked(checked.filter((item) => item !== i));
              } else {
                setChecked([...checked, i]);
              }
            }}
          >
            {i}
          </div>
        ))}
      </div>
      {/* <div className="flex gap-4 bg-linear1 px-1 py-1 w-full">
        <div className="text-xs ">TIN TỨC</div>
        {isLoading ? (
          <div className="text-xs text-muted">Loading...</div>
        ) : (
          <div className="flex-1 overflow-hidden min-w-0 relative">
            <div className="flex gap-4 w-fit absolute animate-infinite-scroll hover:animate-pause">
              {[...news.slice(0, 10), ...news.slice(0, 10)].map((item: any, index: number) => (
                <a
                  href={item.link}
                  target="_blank"
                  key={index}
                  className="cursor-pointer text-muted hover:text-white text-xs max-w-[220px] text-nowrap line-clamp-1"
                  suppressHydrationWarning
                  title={item.title}
                >
                  <div className="truncate" dangerouslySetInnerHTML={{ __html: "• " + item.title }}></div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default Chart;
