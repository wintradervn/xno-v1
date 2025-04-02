import useTheme from "@/hooks/useTheme";
import * as config from "./config";

export default function useChartColors() {
  const { isLightMode } = useTheme();
  return isLightMode ? config.colors.light : config.colors.dark;
}
