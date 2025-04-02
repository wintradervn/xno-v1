import { Manrope } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cookies } from "next/headers";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Updater from "./Updater";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="/charting_library/charting_library.standalone.js"></Script>
      <GoogleAnalytics gaId="G-BD3W4VZ4CP" />
      <body
        className={`${manrope.className} no-scrollbar antialiased ${theme}`}
      >
        {children}
      </body>
      <Updater />
    </html>
  );
}
