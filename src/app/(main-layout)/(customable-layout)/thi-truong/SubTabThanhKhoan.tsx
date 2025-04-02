import ThanhKhoanLineChart from "@/components/charts/ThanhKhoanLineChart";
import DefaultNodata from "@/components/ui/DefaultNodata";
import Tabs from "@/components/ui/Tabs";
import useVNIndexThanhKhoanData from "@/hooks/useVNIndexThanhKhoanData";
import { Tab } from "@heroui/react";
import { format } from "date-fns";
import { useMemo, useState } from "react";

export default function SubTabThanhKhoan() {
  const [selectedTab, setSelectedTab] = useState("intra");
  const { data } = useVNIndexThanhKhoanData(selectedTab);

  const dataByDate = useMemo(() => {
    if (!data) return [];
    const result: any = {};
    data.forEach((item) => {
      const dateTimestamp = new Date(item.time).setHours(0, 0, 0, 0);
      const found = result[dateTimestamp];
      if (found) {
        found.push(item);
      } else {
        result[dateTimestamp] = [item];
      }
    });
    return result;
  }, [data]);

  const todayData = useMemo(() => {
    if (!dataByDate) return [];
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);
    return dataByDate?.[todayTimestamp]?.map((item: any) => ({
      ...item,
      time: format(new Date(item.time), "HH:mm"),
    }));
  }, [dataByDate]);

  const yesterdayData = useMemo(() => {
    if (!dataByDate) return [];
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);
    const yesterdayTimestamp = Math.max(
      ...Object.keys(dataByDate)
        .filter((str) => +str !== todayTimestamp)
        .map((str) => +str),
    );

    return dataByDate?.[yesterdayTimestamp]?.map((item: any) => ({
      ...item,
      time: format(new Date(item.time), "HH:mm"),
    }));
  }, [dataByDate]);

  const timeData = useMemo(
    () =>
      [...(data || [])]
        .map((item) => format(new Date(item.time), "HH:mm"))
        .filter(
          (item, index, self) =>
            self.indexOf(item) === index &&
            item !== "14:50" &&
            item !== "14:55",
        )
        .sort((a: string, b: string) => {
          const hA = +a.split(":")[0];
          const mA = +a.split(":")[1];
          const hB = +b.split(":")[0];
          const mB = +b.split(":")[1];
          if (hA > hB) return 1;
          if (hA < hB) return -1;
          if (mA > mB) return 1;
          if (mA < mB) return -1;
          return 0;
        }),
    [data],
  );

  const average5Day = useMemo(() => {
    if (!data || !todayData || !timeData) return [];
    const todayTimestamp = new Date().setHours(0, 0, 0, 0);

    const averageData = timeData?.map((time) => {
      const found = data?.filter(
        (item) =>
          todayTimestamp > new Date(item.time).getTime() &&
          format(new Date(item.time), "HH:mm") === time,
      );
      return {
        time: time,
        allValue:
          found.reduce((acc, cur) => acc + cur.allValue, 0) / found.length,
      };
    });
    return averageData;
  }, [data, todayData, timeData]);

  return (
    <div className="flex h-full flex-col gap-1">
      <Tabs
        className="pb-2"
        selectedKey={selectedTab}
        onSelectionChange={(k) => setSelectedTab(k as string)}
      >
        <Tab key="intra" title="0D"></Tab>
        <Tab key="5day" title="5D"></Tab>
        {/* <Tab key="20day" title="20D"></Tab> */}
      </Tabs>
      <ThanhKhoanLineChart
        timeList={timeData}
        data1={todayData}
        data2={selectedTab === "5day" ? average5Day : yesterdayData}
        data2Name={
          selectedTab === "5day" ? "GTGD trung bình 5 phiên" : "GTGD Hôm qua"
        }
      />
      {/* <div className="flex justify-center gap-6 pb-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-[2px] bg-green"></div>
          <div>Giao dịch hôm nay</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-[2px] bg-[#7B61FF]"></div>
          <div>Giao dịch hôm qua</div>
        </div>
      </div> */}
    </div>
  );
}
