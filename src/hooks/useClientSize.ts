import { RefObject, useEffect, useRef, useState } from "react";

export default function useClientSize<T extends Element>(): [
  RefObject<T | null>,
  number,
] {
  const divRef = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = (entries: any) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);

    if (divRef.current !== null) {
      resizeObserver.observe(divRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current);
      }
    };
  }, []);

  return [divRef, width];
}
