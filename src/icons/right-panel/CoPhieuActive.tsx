import { generateRandomId } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CoPhieuActive() {
  const [id, setId] = useState<string>("4124");

  useEffect(() => {
    setId(generateRandomId());
  }, []);

  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.46447 3.96447C2 5.42893 2 7.78595 2 12.5C2 17.214 2 19.5711 3.46447 21.0355C4.92893 22.5 7.28595 22.5 12 22.5C16.714 22.5 19.0711 22.5 20.5355 21.0355C22 19.5711 22 17.214 22 12.5C22 7.78595 22 5.42893 20.5355 3.96447C19.0711 2.5 16.714 2.5 12 2.5C7.28595 2.5 4.92893 2.5 3.46447 3.96447ZM17 8.75C17.4142 8.75 17.75 9.08579 17.75 9.5V18.5C17.75 18.9142 17.4142 19.25 17 19.25C16.5858 19.25 16.25 18.9142 16.25 18.5V9.5C16.25 9.08579 16.5858 8.75 17 8.75ZM12.75 12.5C12.75 12.0858 12.4142 11.75 12 11.75C11.5858 11.75 11.25 12.0858 11.25 12.5V18.5C11.25 18.9142 11.5858 19.25 12 19.25C12.4142 19.25 12.75 18.9142 12.75 18.5V12.5ZM7 14.75C7.41421 14.75 7.75 15.0858 7.75 15.5V18.5C7.75 18.9142 7.41421 19.25 7 19.25C6.58579 19.25 6.25 18.9142 6.25 18.5V15.5C6.25 15.0858 6.58579 14.75 7 14.75Z"
        fill={`url(#${id})`}
      />
      <defs>
        <linearGradient
          id={id}
          x1="2"
          y1="2.5"
          x2="22"
          y2="22.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
