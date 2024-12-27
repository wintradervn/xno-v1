import UnfinishedFeature from "@/components/ui/UnfinishedFeature";
import { Tooltip } from "@nextui-org/react";

const data = { gia: 39.56, kl: "3.3M", change: 12.4 };

export default function SubTabNhanDinh() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex flex-col gap-2 rounded-[8px] border border-neutral-800 p-2">
        <div className="text-lineargreen flex items-center justify-center gap-2 text-sm font-semibold">
          Góc nhìn chuyên gia (06-10-2024) <img src="/slidingStar.svg" />
        </div>
        <div className="bg-linearpurple relative my-1 h-[1px] w-full">
          <div className="absolute left-1/2 top-1/2 flex w-6 -translate-x-1/2 -translate-y-1/2 justify-center bg-card">
            <img src="/polygon.svg" />
          </div>
        </div>
        <UnfinishedFeature>
          <div className="text-sm">
            Trong quý 3/2024, CSV đạt doanh thu và lợi nhuận ròng lần lượt là
            508 tỷ đồng (+25% YoY) và 73 tỷ đồng (+51% YoY). Kết quả kinh doanh
            tăng nhờ sản lượng các sản phẩm chính so với cùng kỳ (NaOH +29%,
            axit sunfuric 105%, phốt pho vàng 80%...) và giá bán trung bình tăng
            3-12% tùy theo sản phẩm, trong khi biên lợi nhuận gộp tăng khoảng 5
            điểm phần trăm chủ yếu do giá đầu vào giảm. Chúng tôi ước tính kết
            quả kinh doanh quý 4 sẽ tiếp tục tăng trưởng nhờ xu hướng tăng của
            giá NaOH và phốt pho vàng của Trung Quốc và nhu cầu nguyên liệu thô
            của ngành sản xuất trong nước tăng vào cuối năm; tuy nhiên, sản
            lượng của năm tới có thể bị ảnh hưởng do di dời nhà máy.Trong quý
            3/2024, CSV đạt doanh thu và lợi nhuận ròng lần lượt là 508 tỷ đồng
            (+25% YoY) và 73 tỷ đồng (+51% YoY). Kết quả kinh doanh tăng nhờ sản
            lượng các sản phẩm chính so với cùng kỳ (NaOH +29%, axit sunfuric
            105%, phốt pho vàng 80%...) và giá bán trung bình tăng 3-12% tùy
            theo sản phẩm, trong khi biên lợi nhuận gộp tăng khoảng 5 điểm phần
            trăm chủ yếu do giá đầu vào giảm. Chúng tôi ước tính kết quả kinh
            doanh quý 4 sẽ tiếp tục tăng trưởng nhờ xu hướng tăng của giá NaOH
            và phốt pho vàng của Trung Quốc và nhu cầu nguyên liệu thô của ngành
            sản xuất trong nước tăng vào cuối năm; tuy nhiên, sản lượng của năm
            tới có thể bị ảnh hưởng do di dời nhà máy.
          </div>
        </UnfinishedFeature>
      </div>
    </div>
  );
}
