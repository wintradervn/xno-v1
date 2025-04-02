export const INDEXES_INFO: Record<
  string,
  { symbolName: string; code: string; apiCode: string }
> = {
  VNINDEX: {
    symbolName: "Chỉ số VNIndex",
    code: "VNINDEX",
    apiCode: "VNIndex",
  },
  HNX: {
    symbolName: "Chỉ số HNX",
    code: "HNX",
    apiCode: "HNXIndex",
  },
  UPCOM: {
    symbolName: "Chỉ số UPCOM",
    code: "UPCOM",
    apiCode: "HNXUpcomIndex",
  },
  VN30: {
    symbolName: "Chỉ số VN30",
    code: "VN30",
    apiCode: "VN30",
  },
  HNX30: {
    symbolName: "Chỉ số HNX30",
    code: "HNX30",
    apiCode: "HNX30",
  },
};

export const ROOT_API_URL =
  process.env.NODE_ENV === "development" ? "/api/v2" : "https://api.xno.vn/v2";

export const mapExchangeToIndex: Record<string, string> = {
  HOSE: "VNINDEX",
  HNX: "HNX",
  UPCOM: "UPCOM",
};

export const DANH_SACH_MA_PHAI_SINH = [
  "ACB",
  "BCM",
  "BID",
  "BVH",
  "CTG",
  "FPT",
  "GAS",
  "GVR",
  "HDB",
  "HPG",
  "MBB",
  "MSN",
  "MWG",
  "PLX",
  "POW",
  "SAB",
  "SHB",
  "SSB",
  "SSI",
  "STB",
  "TCB",
  "TPB",
  "VCB",
  "VHM",
  "VIB",
  "VIC",
  "VJC",
  "VNM",
  "VPB",
  "VRE",
];

export const DANH_SACH_MA_NGAN_HANG = [
  "ABB",
  "ACB",
  "BAB",
  "BID",
  "BVB",
  "CTG",
  "EIB",
  "EVF",
  "HBB",
  "HDB",
  "KLB",
  "LPB",
  "MBB",
  "MSB",
  "NAB",
  "NVB",
  "OCB",
  "PGB",
  "PVF",
  "SDF",
  "SGB",
  "SHB",
  "SSB",
  "STB",
  "TCB",
  "TPB",
  "VAB",
  "VBB",
  "VCB",
  "VIB",
  "VPB",
];
