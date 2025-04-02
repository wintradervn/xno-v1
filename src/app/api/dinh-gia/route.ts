import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;

// Need this api to bypass the CORS issue
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const apiUrl = `https://apipubaws.tcbs.com.vn/tcanalysis/v1/evaluation/${symbol}/historical-chart?period=5&tWindow=D`;

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
