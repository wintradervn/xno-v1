import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // const apiUrl = `https://protrade.finsc.vn/datafeed?fetch=history?symbol=VCB&resolution=1D&from=1692144000&to=1731974400&countback=330${timeframe}`;
  const apiUrl = `https://api.xno.vn/v2/datafeed/history?${searchParams.toString()}`;

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
