import { DANH_MUC_BANG_GIA } from "@/app/(main-layout)/(customable-layout)/bang-gia/constant";
import { use, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { create } from "zustand";

const useSubscribedWSSymbols = create<any>((set) => ({
  subscribedSymbols: [] as string[],
  addSymbol: (symbol: string) =>
    set((state: any) => ({
      subscribedSymbols: [...state.subscribedSymbols, symbol],
    })),
  removeSymbol: (symbol: string) =>
    set((state: any) => ({
      subscribedSymbols: state.subscribedSymbols.filter(
        (s: string) => s !== symbol,
      ),
    })),
}));

export const useWSDataBySymbol = create<{
  subscribedSymbols: string[];
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
  siData: {
    [key: string]: {
      accumulatedVal: number;
      accumulatedVol: number;
      avgPrice: number;
      basicPrice: number;
      buyForeignQtty: number;
      ceilingPrice: number;
      changed: number;
      changedRatio: number;
      currentRoom: number;
      estimatedPrice: number;
      floorCode: string;
      floorPrice: number;
      highestPrice: number;
      lowestPrice: number;
      matchPrice: number;
      matchQtty: number;
      oddLotSecurityStatus: string;
      securityStatus: string;
      securityType: string;
      sellForeignQtty: number;
      symbol: string;
      tradingSession: string;
      tradingTime: string;
      bidQtty?: number;
      offerQtty?: number;
      price: number;
    };
  };
  tpData: {
    [key: string]: {
      ask: { price: number; qtty: number }[];
      bid: { price: number; qtty: number }[];
      symbol: string;
      time: string;
    };
  };
  setSiData: (symbol: string, data: any) => void;
  setTpData: (symbol: string, data: any) => void;
}>((set) => ({
  siData: {},
  tpData: {},
  setSiData: (symbol: string, data: any) =>
    set((state: any) => ({
      siData: { ...state.siData, [symbol]: data },
    })),
  setTpData: (symbol: string, data: any) =>
    set((state: any) => ({
      tpData: { ...state.tpData, [symbol]: data },
    })),
  subscribedSymbols: [] as string[],
  addSymbol: (symbol: string) =>
    set((state: any) => ({
      subscribedSymbols: [...state.subscribedSymbols, symbol],
    })),
  removeSymbol: (symbol: string) =>
    set((state: any) => ({
      subscribedSymbols: state.subscribedSymbols.filter(
        (s: string) => s !== symbol,
      ),
    })),
}));

export function useXNOWebsocket(symbol?: string) {
  const { subscribedSymbols, addSymbol, removeSymbol } =
    useSubscribedWSSymbols();
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    "wss://sk.xno.vn/ws",
    { share: true },
  );
  const [lastMessageData, setLastMessageData] = useState<any>();

  useEffect(() => {
    if (!symbol) return;
    if (subscribedSymbols.includes(symbol)) return;
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        action: "subscribe",
        symbol: symbol,
      });
      addSymbol(symbol);
    }
  }, [readyState, symbol]);

  useEffect(() => {
    return () => {
      if (readyState === ReadyState.OPEN) {
        if (subscribedSymbols.includes(symbol)) {
          sendJsonMessage({
            action: "unsubscribe",
            symbol: symbol,
          });
          removeSymbol(symbol);
        }
      }
    };
  }, [symbol, readyState]);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      if (data) {
        setLastMessageData(data);
      }
    }
  }, [lastMessage]);
  return {
    lastMessage: lastMessageData,
    isSubscribed: subscribedSymbols.includes(symbol),
  };
}

export const useUpdaterPriceWS = () => {
  const siData = useWSDataBySymbol((state) => state.siData);
  const setSiData = useWSDataBySymbol((state) => state.setSiData);
  const setTpData = useWSDataBySymbol((state) => state.setTpData);
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket<any>(
    "wss://sk.xno.vn/ws",
    {
      share: true,
    },
  );

  useEffect(() => {
    const a = Object.values(DANH_MUC_BANG_GIA).flatMap((item) => item.symbols);
    if (readyState === ReadyState.OPEN) {
      a.forEach((symbol) => {
        sendJsonMessage({
          action: "subscribe",
          symbol: symbol,
        });
      });
    }
    return () => {
      if (readyState === ReadyState.OPEN) {
        a.forEach((symbol) => {
          sendJsonMessage({
            action: "unsubscribe",
            symbol: symbol,
          });
        });
      }
    };
  }, [readyState]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (lastJsonMessage) {
        if (lastJsonMessage.topic === "SI") {
          let price =
            lastJsonMessage.data.matchPrice ||
            lastJsonMessage.data.estimatedPrice ||
            0;
          setSiData(lastJsonMessage.data.symbol, {
            ...lastJsonMessage.data,
            price,
          });
        }
        if (lastJsonMessage.topic === "TP") {
          setTpData(lastJsonMessage.data.symbol, lastJsonMessage.data);
        }
      }
    }
  }, [lastJsonMessage, readyState, setSiData, setTpData]);
};

export const useSymbolWSData = (symbol?: string) => {
  const siData = useWSDataBySymbol((state) =>
    symbol ? state.siData[symbol] : undefined,
  );
  const tpData = useWSDataBySymbol((state) =>
    symbol ? state.tpData[symbol] : undefined,
  );

  return { siData, tpData };
};

export function useSymbolInfoWebsocketData(symbol?: string) {
  const { lastMessage } = useXNOWebsocket(symbol);

  const [symbolInfo, setSymbolInfo] = useState<{
    accumulatedVal: number;
    accumulatedVol: number;
    avgPrice: number;
    basicPrice: number;
    buyForeignQtty: number;
    ceilingPrice: number;
    changed: number;
    changedRatio: number;
    currentRoom: number;
    estimatedPrice: number;
    floorCode: string;
    floorPrice: number;
    highestPrice: number;
    lowestPrice: number;
    matchPrice: number;
    matchQtty: number;
    oddLotSecurityStatus: string;
    securityStatus: string;
    securityType: string;
    sellForeignQtty: number;
    symbol: string;
    tradingSession: string;
    tradingTime: string;
    bidQtty?: number;
    offerQtty?: number;
    price: number;
  }>();

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.topic === "SI" && lastMessage.data.symbol === symbol) {
        let price =
          lastMessage.data.matchPrice || lastMessage.data.estimatedPrice || 0;
        setSymbolInfo({ ...lastMessage.data, price });
      }
    }
  }, [lastMessage, symbol]);

  return { symbolInfo };
}

export function useTPWebsocketData(symbol?: string) {
  const { lastMessage } = useXNOWebsocket(symbol);
  const [tp, setTP] = useState<{
    ask: { price: number; qtty: number }[];
    bid: { price: number; qtty: number }[];
    symbol: string;
    time: string;
  }>();

  useEffect(() => {
    if (lastMessage && lastMessage.topic === "TP") {
      if (
        lastMessage &&
        lastMessage.topic === "TP" &&
        lastMessage.data.symbol === symbol
      ) {
        setTP(lastMessage.data);
      }
    }
  }, [lastMessage, symbol]);

  return { tp };
}
