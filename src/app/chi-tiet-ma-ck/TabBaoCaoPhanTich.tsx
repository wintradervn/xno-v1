import { FileDownload } from "solar-icon-set";

const gridTemplateColumns = "1fr 4fr 1fr 1fr 1fr 1fr 1fr";
export default function TabBaoCaoPhanTich() {
  return (
    <div className="h-full w-full">
      <div
        className="grid w-full py-3 text-sm text-muted"
        style={{ gridTemplateColumns: gridTemplateColumns }}
      >
        <div>Ngày</div>
        <div>Tiêu đề</div>
        <div>Nguồn</div>
        <div className="text-right">Khuyến nghị</div>
        <div className="text-right">Giá mục tiêu</div>
        <div className="text-right">Upside</div>
        <div></div>
      </div>
      {new Array(10).fill(0).map((_, index) => (
        <div
          className="grid w-full py-2 text-md text-white"
          style={{ gridTemplateColumns: gridTemplateColumns }}
          key={index}
        >
          <div>15/10/2024</div>
          <div>
            Hưởng lợi trực tiếp từ hệ thống, điều chỉnh hầu hết hệ thống.
          </div>
          <div>Vietcap</div>
          <div className="text-right text-green">Mua</div>
          <div className="text-right">37.2</div>
          <div className="text-right text-green">+35.04%</div>
          <div className="cursor-pointer text-right text-muted hover:text-white">
            <FileDownload size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
