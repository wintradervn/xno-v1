import { generateRandomId } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TinTucActive() {
  const [id, setId] = useState<string>("6125125351");

  useEffect(() => {
    setId(generateRandomId());
  }, []);

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 5.5C22 7.15685 20.6569 8.5 19 8.5C17.3431 8.5 16 7.15685 16 5.5C16 3.84315 17.3431 2.5 19 2.5C20.6569 2.5 22 3.84315 22 5.5Z"
        fill={`url(#paint0${id}`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5C13.3988 2.5 14.59 2.5 15.612 2.53826C14.9196 3.32967 14.5 4.36584 14.5 5.5C14.5 7.98528 16.5147 10 19 10C20.1342 10 21.1703 9.58042 21.9617 8.88802C22 9.91 22 11.1012 22 12.5C22 17.214 22 19.5711 20.5355 21.0355C19.0711 22.5 16.714 22.5 12 22.5C7.28595 22.5 4.92893 22.5 3.46447 21.0355C2 19.5711 2 17.214 2 12.5C2 7.78595 2 5.42893 3.46447 3.96447C4.92893 2.5 7.28595 2.5 12 2.5ZM14.5 11.25C14.0858 11.25 13.75 10.9142 13.75 10.5C13.75 10.0858 14.0858 9.75 14.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5V13C17.75 13.4142 17.4142 13.75 17 13.75C16.5858 13.75 16.25 13.4142 16.25 13V12.3107L14.2374 14.3232C13.554 15.0066 12.446 15.0066 11.7626 14.3232L10.1768 12.7374C10.0791 12.6398 9.92085 12.6398 9.82322 12.7374L7.53033 15.0303C7.23744 15.3232 6.76256 15.3232 6.46967 15.0303C6.17678 14.7374 6.17678 14.2626 6.46967 13.9697L8.76256 11.6768C9.44598 10.9934 10.554 10.9934 11.2374 11.6768L12.8232 13.2626C12.9209 13.3602 13.0791 13.3602 13.1768 13.2626L15.1893 11.25H14.5Z"
        fill={`url(#paint1${id}`}
      />
      <defs>
        <linearGradient
          id={`paint0${id}`}
          x1="16"
          y1="2.5"
          x2="22"
          y2="8.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
        <linearGradient
          id={`paint1${id}`}
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
