import React, { useEffect, useState } from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from "./charting_library";
import { useDatafeed } from "./datafeed";
import { getTradingViewTimeZone } from "./utils";
import DefaultLoader from "../ui/DefaultLoader";
import useTheme from "@/hooks/useTheme";

const LOCALSTORAGE_STATE_NAME = "proChartSavedState";

interface FullScreenDocument extends Document {
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitCancelFullScreen?: () => void;
}

function closeFullscreen() {
  const doc = document as FullScreenDocument;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitCancelFullScreen) {
    /* Old webkit */
    doc.webkitCancelFullScreen();
  } else if (doc.webkitExitFullscreen) {
    /* New webkit */
    doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    /* IE11 */
    doc.msExitFullscreen();
  }
}

function TradingViewChart({ symbol }: { symbol?: string }) {
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const { isLightMode } = useTheme();
  const datafeed = useDatafeed(symbol);

  useEffect(() => {
    if (!ref || !window.TradingView) {
      return;
    }
    setLoading(true);

    const localStorageState = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_STATE_NAME) || "null",
    );
    // set auto scale mode to true to fix wrong behavious of right axis price range
    if (
      localStorageState?.charts[0]?.panes[0]?.rightAxisesState[0]?.state
        ?.m_isAutoScale === false
    ) {
      localStorageState.charts[0].panes[0].rightAxisesState[0].state.m_isAutoScale =
        true;
    }

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: symbol || "VCB",
      datafeed,
      interval: "1D" as ResolutionString,
      container: ref,
      library_path: "/charting_library/",
      locale: "vi" as LanguageCode,
      disabled_features: [
        "header_symbol_search",
        "header_fullscreen_button",
        "header_compare",
        "header_saveload",
        "drawing_templates",
      ],
      enabled_features: [
        "create_volume_indicator_by_default",
        "use_localstorage_for_settings",
        "save_chart_properties_to_local_storage",
      ],
      fullscreen: false,
      autosize: true,
      studies_overrides: {},
      theme: isLightMode ? "Light" : "Dark",
      custom_css_url: "/charting_library/style.css",
      timeframe: "2w",
      time_frames: [
        {
          text: "6m",
          resolution: "12H" as ResolutionString,
          description: "6 Tháng",
        },
        {
          text: "1m",
          resolution: "1H" as ResolutionString,
          description: "1 Tháng",
        },
        {
          text: "2w",
          resolution: "1H" as ResolutionString,
          description: "2 Tuần",
        },
        {
          text: "1w",
          resolution: "1H" as ResolutionString,
          description: "1 Tuần",
        },
        {
          text: "1d",
          resolution: "15" as ResolutionString,
          description: "1 Ngày",
        },
      ],
      timezone: getTradingViewTimeZone(),
      auto_save_delay: 2,
      saved_data: localStorageState,
    };

    const tvWidget = new window.TradingView.widget(widgetOptions);

    tvWidget.onChartReady(() => {
      setLoading(false);
      tvWidget.applyOverrides({
        "paneProperties.backgroundType": "solid",
        "paneProperties.background": isLightMode ? "#ffffff" : "#151A24",
        "mainSeriesProperties.candleStyle.upColor": isLightMode
          ? "#10B969"
          : "#1BF81F",
        "mainSeriesProperties.candleStyle.borderUpColor": isLightMode
          ? "#10B969"
          : "#1BF81F",
        "mainSeriesProperties.candleStyle.wickUpColor": isLightMode
          ? "#10B969"
          : "#1BF81F",
        "mainSeriesProperties.candleStyle.downColor": "#FF135B",
        "mainSeriesProperties.candleStyle.borderDownColor": "#FF135B",
        "mainSeriesProperties.candleStyle.wickDownColor": "#FF135B",
        "mainSeriesProperties.priceAxisProperties.autoScale": true,
        "scalesProperties.textColor": "#98A2B3",
      });
      tvWidget.headerReady().then(() => {
        // const fullscreenOn = tvWidget.createButton();
        // fullscreenOn.setAttribute("title", "Fullscreen on");
        // fullscreenOn.addEventListener("click", () => {
        //   setFullscreen((fs) => {
        //     if (isMobile) {
        //       if (fs) {
        //         closeFullscreen();
        //       } else {
        //         openFullscreen(ref);
        //       }
        //     }
        //     fullscreenOn.innerHTML = ReactDOMServer.renderToStaticMarkup(fs ? <FullscreenOn /> : <FullscreenOff />);
        //     return !fs;
        //   });
        // });
        // fullscreenOn.innerHTML = ReactDOMServer.renderToStaticMarkup(<FullscreenOn />);
      });
      tvWidget.subscribe("onAutoSaveNeeded", () => {
        tvWidget.save((object: any) => {
          localStorage.setItem(LOCALSTORAGE_STATE_NAME, JSON.stringify(object));
        });
      });
    });

    return () => {
      if (tvWidget !== null) {
        tvWidget.remove();
      }
    };
  }, [ref, datafeed, isLightMode]);

  return (
    <div className="relative flex h-full min-h-[400px] w-full flex-1 flex-col">
      {loading && (
        <div className="bg-card absolute inset-0 z-10">
          <DefaultLoader />
        </div>
      )}
      <div
        ref={(newRef) => setRef(newRef)}
        style={{
          height: "400px",
          width: "100%",
          visibility: loading ? "hidden" : "visible",
        }}
        className="tradingview-wrapper-div flex-1"
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
}

export default React.memo(TradingViewChart);
