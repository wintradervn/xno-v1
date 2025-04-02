import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols"); // Get the 'id' parameter from the query string
  const apiUrl = `https://app.finsc.vn/api/v1/scta/hitprice?symbols=${symbols}`; // Use the id in the API URL

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
