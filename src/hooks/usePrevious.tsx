import { useEffect, useRef } from "react";

export default function usePrevious(value: any) {
  const ref = useRef(undefined);

  useEffect(() => {
    ref.current = value; // Store the current value in the ref
  }, [value]); // Update the ref when the value changes

  return ref.current; // Return the previous value
}
