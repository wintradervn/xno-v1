"use client";

import { useEffect } from "react";

const TVchart = () => {
  useEffect(() => {
    function getParameterByName(name: string) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function initOnReady() {
      let datafeedUrl = "https://protrade.finsc.vn/api/datafeedv2";
      const customDataUrl = getParameterByName('dataUrl');
      if (customDataUrl !== "") {
        datafeedUrl = customDataUrl.startsWith('https://') ? customDataUrl : `https://${customDataUrl}`;
      }

      const widget = new (window as any).TradingView.widget({
        fullscreen: true,
        symbol: 'HPG',
        interval: '1D',
        container: "tv_chart_container",
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(datafeedUrl, undefined, {
          maxResponseLength: 1000,
          expectedOrder: 'latestFirst',
        }),
        library_path: "charting_library/",
        locale: getParameterByName('lang') || "en",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: 'https://protrade.finsc.vn/api/datafeedv2',
        charts_storage_api_version: "1.1",
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        theme: getParameterByName('theme'),
      });
      window.frames[0].focus();
    }

    window.addEventListener('DOMContentLoaded', initOnReady, false);

    return () => {
      window.removeEventListener('DOMContentLoaded', initOnReady);
    };
  }, []);

  return <div id="tv_chart_container" className="h-full w-full" />;
};

export default TVchart;
