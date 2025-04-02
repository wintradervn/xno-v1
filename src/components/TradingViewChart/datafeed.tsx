import { useEffect, useMemo, useRef } from "react";

import {
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SubscribeBarsCallback,
  Timezone,
} from "./charting_library";
import useCurrentSymbol from "@/hooks/useCurrentSymbol";
import useMarketOverviewData from "@/hooks/useMarketOverview";

const configurationData = {
  supports_search: true,
  supports_group_request: false,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [
    {
      value: "",
      name: "All Exchanges",
      desc: "",
    },
    {
      value: "HNX",
      name: "HNX",
      desc: "Sàn HNX",
    },
    {
      value: "HOSE",
      name: "HOSE",
      desc: "Sàn HOSE",
    },
    {
      value: "UPCOM",
      name: "UPCOM",
      desc: "Sàn UPCOM",
    },
    {
      value: "OTHER",
      name: "OTHER",
      desc: "Ngành",
    },
  ],
  symbols_types: [
    {
      name: "All types",
      value: "",
    },
    {
      name: "Stock",
      value: "stock",
    },
    {
      name: "Index",
      value: "index",
    },
  ],
  supported_resolutions: [
    "1",
    "3",
    "5",
    "15",
    "30",
    "45",
    "60",
    "120",
    "240",
    "D",
    "W",
    "M",
  ],
};

const getohlcv = async (
  symbol: string,
  resolution: string,
  from: number,
  to: number,
  countback: number,
) => {
  const baseUrl = `/api/tradingview`;
  const s = symbol.startsWith("VN30F") ? "VN30F1M" : symbol;
  const params = new URLSearchParams({
    symbol: s,
    resolution: resolution,
    start: from.toString(),
    end: to.toString(),
    countback: countback.toString(),
  });
  const urlWithParams = `${baseUrl}?${params.toString()}`;
  const res = await fetch(urlWithParams);
  const data = res.json();
  return data;
};

type OHLCV = [number, number, number, number, number, number];

interface CandleResponse {
  data: {
    attributes: {
      ohlcv_list: [
        number, // timestamp
        number, // open
        number, // high
        number, // low
        number, // close
        number, // volume
      ];
    };
  };
}
export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
const transformData = (res: any): Bar[] => {
  const tmp = JSON.parse(JSON.stringify(res || []));

  return tmp.t
    ? tmp.t.map((time: number, index: number) => {
        return {
          time: time * 1000,
          open: tmp.o[index],
          high: tmp.h[index],
          low: tmp.l[index],
          close: tmp.c[index],
          volume: tmp.v[index],
        };
      })
    : [];
};

export const useDatafeed = (symbol?: string) => {
  const intervalRef = useRef<any>(undefined);

  const { currentSymbol } = useCurrentSymbol();
  const { data: overviewData } = useMarketOverviewData();
  const symbolData = useMemo(
    () => overviewData?.find((item) => item.code === currentSymbol),
    [overviewData, currentSymbol],
  );

  const finalSymbol = symbol || currentSymbol;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    return {
      onReady: (callback: any) => {
        setTimeout(() => callback(configurationData));
      },
      resolveSymbol: async (
        _symbolName: string,
        onSymbolResolvedCallback: ResolveCallback,
        _onResolveErrorCallback: ErrorCallback,
      ) => {
        try {
          const symbolInfo: LibrarySymbolInfo = {
            description: symbolData?.symbolName || finalSymbol,
            name: symbolData?.code || finalSymbol,
            full_name: symbolData?.symbolName || finalSymbol,
            ticker: finalSymbol,
            exchange: symbolData?.exchange || "HOSE",
            listed_exchange: symbolData?.exchange || "HOSE",
            format: "price",
            type: "stock",
            timezone: "Asia/Ho_Chi_Minh",
            supported_resolutions: [
              "1",
              "3",
              "5",
              "15",
              "30",
              "45",
              "60",
              "120",
              "240",
              "D",
              "W",
              "M",
            ] as ResolutionString[],
            has_intraday: true,
            has_no_volume: false,
            minmov: 1,
            pricescale: 100,
            has_daily: true,
            has_weekly_and_monthly: false,
            has_empty_bars: false,
            intraday_multipliers: ["1", "60"],
            session: "0900-1500",
          };
          onSymbolResolvedCallback(symbolInfo);
        } catch (error) {
          console.log(error);
        }
      },
      getBars: async (
        // symbolInfo is not used
        _symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        periodParams: PeriodParams,
        onHistoryCallback: HistoryCallback,
        _onErrorCallback: ErrorCallback,
      ) => {
        const { from, to, countBack } = periodParams;

        const res = await getohlcv(
          finalSymbol,
          resolution,
          from,
          to,
          countBack,
        );

        const bars = transformData(res);
        onHistoryCallback(bars, { noData: res.s === "no_data" });
      },
      searchSymbols: () => {
        //
      },
      subscribeBars: async (
        _symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        onTick: SubscribeBarsCallback,
        _listenerGuid: string,
        _onResetCacheNeededCallback: () => void,
      ) => {
        // const getData = async () => {
        //   const data = await getohlcv(
        //     resolution === "1D" ? "day" : Number(resolution) > 15 ? "hour" : "minute",
        //     (resolution === "1D" ? "1" : Number(resolution) > 15 ? Number(resolution) / 60 : resolution).toString(),
        //     Math.floor(Date.now() / 1000),
        //     1
        //   );
        //   if (data.data?.data?.attributes?.ohlcv_list?.length)
        //     onTick(transformData(data.data.data.attributes.ohlcv_list)[0]);
        // };
        // if (intervalRef.current) clearInterval(intervalRef.current);
        // intervalRef.current = setInterval(getData, 30000);
        // getData();
      },
      unsubscribeBars: () => {
        //
      },
    };
  }, [finalSymbol]);
};
