import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const symbol = searchParams.get("symbol");
  const type = searchParams.get("type");
  const countback = searchParams.get("countback");
  const apiUrl = `https://protrade.finsc.vn/api/datafeedv2/history?symbol=${symbol || "VNINDEX"}%23${type || "TdmbVal"}&resolution=1D&from=${from}&to=${to}&countback=${countback || 20}`; // Use the id in the API URL

  const response = await fetch(apiUrl);
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: response.status },
    );
  }
  const data = await response.json();

  const res = NextResponse.json(data);
  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  return res;
}
