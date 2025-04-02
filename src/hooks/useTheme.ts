import { useCookies } from "react-cookie";
export default function useTheme() {
  const [cookies] = useCookies(["theme"]);

  return {
    isDarkMode: cookies.theme === "dark",
    isLightMode: cookies.theme === "light",
  };
}
