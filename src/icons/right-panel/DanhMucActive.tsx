import { generateRandomId } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function DanhMucActive() {
  const [id, setId] = useState<string>("4125124");

  useEffect(() => {
    setId(generateRandomId());
  }, []);

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4297 2C11.3158 2 10.3015 2.6007 8.27277 3.80211L7.58661 4.20846C5.55789 5.40987 4.54353 6.01057 3.98661 7C3.42969 7.98943 3.42969 9.19084 3.42969 11.5937V12.4063C3.42969 14.8092 3.42969 16.0106 3.98661 17C4.54353 17.9894 5.55789 18.5901 7.58661 19.7915L8.27277 20.1979C10.3015 21.3993 11.3158 22 12.4297 22C13.5435 22 14.5579 21.3993 16.5866 20.1979L17.2728 19.7915C19.3015 18.5901 20.3158 17.9894 20.8728 17C21.4297 16.0106 21.4297 14.8092 21.4297 12.4063V11.5937C21.4297 9.19084 21.4297 7.98943 20.8728 7C20.3158 6.01057 19.3015 5.40987 17.2728 4.20846L16.5866 3.80211C14.5579 2.6007 13.5435 2 12.4297 2ZM8.67969 12C8.67969 9.92893 10.3586 8.25 12.4297 8.25C14.5008 8.25 16.1797 9.92893 16.1797 12C16.1797 14.0711 14.5008 15.75 12.4297 15.75C10.3586 15.75 8.67969 14.0711 8.67969 12Z"
        fill={`url(#${id})`}
      />
      <defs>
        <linearGradient
          id={id}
          x1="3.42969"
          y1="2"
          x2="23.3192"
          y2="19.9006"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
