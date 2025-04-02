import { generateRandomId } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ThiTruongActive() {
  const [id, setId] = useState<string>("612351");

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
        d="M2 7C2 4.87868 2 3.81802 2.65901 3.15901C3.31802 2.5 4.37868 2.5 6.5 2.5C8.62132 2.5 9.68198 2.5 10.341 3.15901C11 3.81802 11 4.87868 11 7C11 9.12132 11 10.182 10.341 10.841C9.68198 11.5 8.62132 11.5 6.5 11.5C4.37868 11.5 3.31802 11.5 2.65901 10.841C2 10.182 2 9.12132 2 7Z"
        fill={`url(#paint0${id}`}
      />
      <path
        d="M13 18C13 15.8787 13 14.818 13.659 14.159C14.318 13.5 15.3787 13.5 17.5 13.5C19.6213 13.5 20.682 13.5 21.341 14.159C22 14.818 22 15.8787 22 18C22 20.1213 22 21.182 21.341 21.841C20.682 22.5 19.6213 22.5 17.5 22.5C15.3787 22.5 14.318 22.5 13.659 21.841C13 21.182 13 20.1213 13 18Z"
        fill={`url(#paint1${id}`}
      />
      <path
        d="M2 18C2 15.8787 2 14.818 2.65901 14.159C3.31802 13.5 4.37868 13.5 6.5 13.5C8.62132 13.5 9.68198 13.5 10.341 14.159C11 14.818 11 15.8787 11 18C11 20.1213 11 21.182 10.341 21.841C9.68198 22.5 8.62132 22.5 6.5 22.5C4.37868 22.5 3.31802 22.5 2.65901 21.841C2 21.182 2 20.1213 2 18Z"
        fill={`url(#paint2${id}`}
      />
      <path
        d="M13 7C13 4.87868 13 3.81802 13.659 3.15901C14.318 2.5 15.3787 2.5 17.5 2.5C19.6213 2.5 20.682 2.5 21.341 3.15901C22 3.81802 22 4.87868 22 7C22 9.12132 22 10.182 21.341 10.841C20.682 11.5 19.6213 11.5 17.5 11.5C15.3787 11.5 14.318 11.5 13.659 10.841C13 10.182 13 9.12132 13 7Z"
        fill={`url(#paint3${id}`}
      />
      <defs>
        <linearGradient
          id={`paint0${id}`}
          x1="2"
          y1="2.5"
          x2="11"
          y2="11.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
        <linearGradient
          id={`paint1${id}`}
          x1="13"
          y1="13.5"
          x2="22"
          y2="22.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
        <linearGradient
          id={`paint2${id}`}
          x1="2"
          y1="13.5"
          x2="11"
          y2="22.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
        <linearGradient
          id={`paint3${id}`}
          x1="13"
          y1="2.5"
          x2="22"
          y2="11.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CFF8EA" />
          <stop offset="1" stopColor="#67E1C0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
