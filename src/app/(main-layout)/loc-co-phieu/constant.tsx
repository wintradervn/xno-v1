import { formatNumber } from "@/lib/utils";

export const MAU_HINH_PATTERN = [
  {
    label: "Tăng giá",
    includes: [
      "Dragon Walks",
      "Ascending Triangle",
      "Falling Wedge",
      "Up Channel",
      "Rectangle (Bullish breakout)",
      "Symmetrical Triangle",
      "Mark Minervini",
    ],
  },
  {
    label: "Giảm giá",
    includes: [
      "Descending Triangle",
      "Rising Wedge",
      "Down Channel",
      "Rectangle (Bearish breakout)",
      "Expanding Triangle",
      "Delphic",
      "Sniper",
    ],
  },
];

export const LOC_CO_PHIEU: Record<string, { name: string }> = {
  giaTriGiaoDichRong: {
    name: "Giá trị giao dịch ròng",
  },
  bienDoGiaDongCua: {
    name: "Biên độ giá đóng cửa",
  },
  pe: {
    name: "P/E",
  },
  vonhoa: {
    name: "Vốn hóa",
  },
  esp: {
    name: "EPS",
  },
};

export type TTieuChiLoc = {
  name: string;
  key: string;
  customRender?: (value: number | string) => React.ReactNode; // Dùng trong trường hợp cần render field theo chuẩn, trả về React Node
  processValue?: (value: number | string) => number | string; // Dùng trong trường hợp cần xử lý giá trị trả về từ API, vd: 1000000000 -> 1 (đơn vị tỷ)
} & (
  | { type: "select"; options: Array<{ label: string; includes?: string[] }> }
  | {
      type: "minmax";
      suggestions?: Array<{ label: string }>;
    }
);

export function isMinMaxFilter(
  filter: TTieuChiLoc,
): filter is TTieuChiLoc & { type: "minmax" } {
  return filter.type === "minmax";
}

export const TIEU_CHI_LOC_NHOM_THONG_DUNG: Array<TTieuChiLoc> = [
  {
    name: "Ngành",
    key: "NGANH",
    type: "select",
    options: [
      { label: "Ngân hàng" },
      { label: "Tài nguyên cơ bản" },
      { label: "Bán lẻ" },
      { label: "Bảo hiểm" },
      { label: "Bất động sản" },
      { label: "Công nghệ thông tin" },
      { label: "Viễn thông" },
      { label: "Du lịch và giải trí" },
      { label: "Dược phẩm và Y tế" },
      { label: "Dầu khí" },
      { label: "Dịch vụ tài chính" },
      { label: "Hàng & Dịch vụ công nghiệp" },
      { label: "Hàng cá nhân & Gia dụng" },
      { label: "Hoá chất" },
      { label: "Tiện ích cộng đồng" },
      { label: "Truyền thông" },
      { label: "Xây dựng và Vật liệu" },
      { label: "Ô tô và phụ tùng" },
    ],
  },
  {
    name: "Giá trị giao dịch (tỷ)",
    key: "THANHKHOAN",
    type: "minmax",
    processValue: (value) => +value / 1000_000_000,
  },
  {
    name: "Giá trị giao dịch trung bình 50 phiên (tỷ)",
    key: "ThanhKhoanTB50",
    type: "minmax",
    processValue: (value) => +value / 1000_000_000,
  },
  {
    name: "Khối lượng (cp)",
    key: "volume",
    type: "minmax",
  },
  {
    name: "Khối lượng trung bình 50 phiên (cp)",
    key: "volTB50",
    type: "minmax",
    customRender: (value) => formatNumber(+value, 0),
  },
  {
    name: "KLGD so sánh với % KLTB(50 phiên) (%)",
    key: "KL1KLTB",
    type: "minmax",
    suggestions: [
      { label: "Dưới 30%" },
      { label: "Trên 30%" },
      { label: "Trên 50%" },
      { label: "Trên 100%" },
      { label: "Trên 150%" },
    ],
  },
  {
    name: "Xu hướng ngắn hạn",
    key: "NGANHAN",
    type: "select",
    options: [{ label: "Tăng" }, { label: "Giảm" }],
  },
  {
    name: "Xu hướng trung hạn",
    key: "TRUNGHAN",
    type: "select",
    options: [{ label: "Tăng" }, { label: "Giảm" }],
  },
  {
    name: "Xu hướng dài hạn",
    key: "DAIHAN",
    type: "select",
    options: [{ label: "Tăng" }, { label: "Giảm" }],
  },
  {
    name: "Sức mạnh giá",
    key: "SUCMANH",
    type: "select",
    options: [
      { label: "Tăng mạnh" },
      { label: "Giảm mạnh" },
      { label: "Tăng yếu" },
      { label: "Giảm yếu" },
    ],
  },
  {
    name: "Chỉ số sức mạnh RS",
    key: "RS",
    type: "minmax",
    suggestions: [
      { label: "Dưới 30" },
      { label: "Trên 30" },
      { label: "Trên 50" },
      { label: "Trên 70" },
    ],
  },
];

export const TIEU_CHI_LOC_NHOM_BIEN_DONG_GIA: Array<TTieuChiLoc> = [
  {
    name: "Giá (%) so với MA(20)",
    key: "pMA20",
    type: "minmax",
  },
  {
    name: "Giá (%) so với MA(50)",
    key: "pMA50",
    type: "minmax",
  },
  {
    name: "Giá (%) so với MA(100)",
    key: "pMA100",
    type: "minmax",
  },
  {
    name: "Giá (%) so với MA(200)",
    key: "pMA200",
    type: "minmax",
  },
  {
    name: "Giá (%) so với Đỉnh 52 tuần",
    key: "ptop52W",
    type: "minmax",
  },
  {
    name: "Giá (%) so với Đáy 52 tuần",
    key: "plow52W",
    type: "minmax",
  },
];

export const TIEU_CHI_LOC_NHOM_KY_THUAT_CHUYEN_SAU: Array<TTieuChiLoc> = [
  {
    name: "AI Trend",
    key: "AiTrend",
    type: "select",
    options: [
      { label: "Uptrend" },
      { label: "Downtrend" },
      { label: "Sideway" },
    ],
  },
  {
    name: "Tín hiệu SMC",
    key: "signalSMC",
    type: "select",
    options: [
      { label: "WarZone" },
      { label: "Sell SMC" },
      { label: "Sell FVG" },
      { label: "Buy SMC" },
      { label: "Buy FVG" },
    ],
  },
  {
    name: "Chỉ số sức mạnh RRG",
    key: "rrg",
    type: "select",
    options: [
      { label: "Cải thiện" },
      { label: "Dẫn dắt" },
      { label: "Suy yếu" },
      { label: "Tụt hậu" },
    ],
  },
  {
    name: "Mẫu hình tăng giá",
    key: "pattern",
    type: "select",
    options: MAU_HINH_PATTERN,
    customRender: (value) => {
      if (
        [
          "Dragon Walks",
          "Ascending Triangle",
          "Falling Wedge",
          "Up Channel",
          "Rectangle (Bullish breakout)",
          "Symmetrical Triangle",
          "Mark Minervini",
        ].includes(value as string)
      ) {
        return <div className="text-[#1fad8e]">{value}</div>;
      }
      return <div className="text-[#ff135b]">{value}</div>;
    },
  },
  {
    name: "Mẫu hình nến tăng giá",
    key: "candles",
    type: "select",
    options: [
      {
        label: "Tăng giá",
        includes: [
          "3 Inside Up",
          "Hammer",
          "Harami Bullish",
          "Bullish Doji Star",
          "Dragonfly Doji",
          "Morning Doji Star",
          "Near Doji",
          "Meeting Lines Bullish",
          "Piercing Line",
          "Separating Lines Bullish",
          "Tweezer Bottom",
          "Inverted Hammer",
          "Homing Pigeon",
          "Tri-Star Bullish",
        ],
      },
      {
        label: "Giảm giá",
        includes: [
          "3 Black Crows",
          "3 Outside Down",
          "Bearish Engulfing",
          "Bearish Hammer",
          "Counter Attack Bearish",
          "Deliberation Bearish",
          "Doji Star Bearish",
          "Evening Doji Star",
          "Evening Star",
          "Hanging Man",
          "Harami Bearish",
          "Harami Cross Bearish",
          "In Neck Bearish",
          "On Neck Bearish",
          "Shooting Star",
          "Side by Side White Lines Bearish",
          "Tri-Star Bearish",
          "Tweezer Top",
        ],
      },
    ],
    customRender: (value) => {
      if (
        [
          "3 Inside Up",
          "Hammer",
          "Harami Bullish",
          "Bullish Doji Star",
          "Dragonfly Doji",
          "Morning Doji Star",
          "Near Doji",
          "Meeting Lines Bullish",
          "Piercing Line",
          "Separating Lines Bullish",
          "Tweezer Bottom",
          "Inverted Hammer",
          "Homing Pigeon",
          "Tri-Star Bullish",
        ].includes(value as string)
      ) {
        return <div className="text-[#1fad8e]">{value}</div>;
      }
      return <div className="text-[#ff135b]">{value}</div>;
    },
  },
  {
    name: "Vùng cung",
    key: "vungcung",
    type: "select",
    options: [
      { label: "Break" },
      { label: "Cận trên" },
      { label: "Đảo chiều" },
      { label: "Cận dưới" },
    ],
  },
  {
    name: "Vùng cầu",
    key: "vungcau",
    type: "select",
    options: [
      { label: "Break" },
      { label: "Cận trên" },
      { label: "Đảo chiều" },
    ],
  },
  {
    name: "Hỗ trợ",
    key: "hotro",
    type: "select",
    options: [
      { label: "Break" },
      { label: "Cận trên" },
      { label: "Đảo chiều" },
    ],
  },
  {
    name: "Kháng cự",
    key: "khangcu",
    type: "select",
    options: [
      { label: "Break" },
      { label: "Cận trên" },
      { label: "Đảo chiều" },
    ],
  },
  {
    name: "Kênh dưới",
    key: "kenhduoi",
    type: "select",
    options: [
      { label: "Break" },
      { label: "Cận trên" },
      { label: "Đảo chiều" },
    ],
  },
  {
    name: "Kênh trên",
    key: "kenhtren",
    type: "select",
    options: [
      { label: "Break" },
      { label: "Cận trên" },
      { label: "Đảo chiều" },
    ],
  },
];

export const TIEU_CHI_LOC_NHOM_CHI_SO_TAI_CHINH: Array<TTieuChiLoc> = [
  {
    name: "Mô hình kinh doanh",
    key: "mohinhKinhdoanh",
    type: "minmax",
  },
  {
    name: "Sức khỏe tài chính",
    key: "skTaichinh",
    type: "minmax",
  },
  {
    name: "Hiệu quả kinh doanh",
    key: "hieuquaHoatdong",
    type: "minmax",
  },
  {
    name: "Action Score",
    key: "diemBinhquan",
    type: "minmax",
  },
  {
    name: "Biên an toàn",
    key: "BAT",
    type: "minmax",
  },
  {
    name: "Định giá P/E",
    key: "PE",
    type: "minmax",
  },

  {
    name: "ROE (%)",
    key: "ROE",
    type: "minmax",
  },
  {
    name: "Biên lợi nhuận ròng (%)",
    key: "BLNR",
    type: "minmax",
  },
  {
    name: "Tăng trưởng doanh thu Quý gần nhất (%)",
    key: "TTDT",
    type: "minmax",
  },
  {
    name: "Tăng trưởng lợi nhuận Quý gần nhất (%)",
    key: "TTLN",
    type: "minmax",
  },
];

export const NHOM_TIEU_CHI_LOC = [
  { id: "1", name: "Nhóm thông dụng", list: TIEU_CHI_LOC_NHOM_THONG_DUNG },
  {
    id: "2",
    name: "Nhóm biến động giá",
    list: TIEU_CHI_LOC_NHOM_BIEN_DONG_GIA,
  },
  {
    id: "3",
    name: "Nhóm kỹ thuật chuyên sâu",
    list: TIEU_CHI_LOC_NHOM_KY_THUAT_CHUYEN_SAU,
  },
  {
    id: "4",
    name: "Nhóm chỉ số tài chính",
    list: TIEU_CHI_LOC_NHOM_CHI_SO_TAI_CHINH,
  },
];

export const TIEU_CHI_LOC_LIST: TTieuChiLoc[] = [
  ...TIEU_CHI_LOC_NHOM_THONG_DUNG,
  ...TIEU_CHI_LOC_NHOM_BIEN_DONG_GIA,
  ...TIEU_CHI_LOC_NHOM_KY_THUAT_CHUYEN_SAU,
  ...TIEU_CHI_LOC_NHOM_CHI_SO_TAI_CHINH,
];

export const KEY_TO_NAME: Record<string, string> = Object.fromEntries(
  TIEU_CHI_LOC_LIST.map((item) => [item.key, item.name]),
);
