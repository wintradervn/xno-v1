export default function ChonChiTieuIcon({
  fillColor,
  size = 24,
}: {
  fillColor?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.7 20.24C1.71 20.23 1.71 20.22 1.71 20.22L7.21 14.72C7.22 14.71 7.23 14.71 7.24 14.7C6.61 14.26 5.84 14 5 14C2.79 14 1 15.79 1 18C1 18.75 1.21 19.46 1.58 20.06C1.62 20.12 1.66 20.18 1.7 20.24Z"
        fill={fillColor || "url(#paint0_linear_31320_180825)"}
      />
      <path
        d="M8.3 15.75C8.29 15.76 8.29 15.77 8.28 15.78L2.78 21.28C2.77 21.29 2.76 21.29 2.75 21.3C3.39 21.74 4.16 22 5 22C6.46 22 7.73 21.22 8.42 20.06C8.79 19.46 9 18.75 9 18C9 17.16 8.74 16.39 8.3 15.75Z"
        fill={fillColor || "url(#paint1_linear_31320_180825)"}
      />
      <path
        d="M17 4H7C4 4 2 5.5 2 9V12.56C2 12.93 2.38 13.16 2.71 13.01C3.69 12.56 4.82 12.39 6.01 12.6C8.64 13.07 10.57 15.51 10.5 18.18C10.49 18.6 10.43 19.01 10.32 19.41C10.24 19.72 10.49 20.01 10.81 20.01H17C20 20.01 22 18.51 22 15.01V9C22 5.5 20 4 17 4ZM12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5ZM19.25 14C19.25 14.41 18.91 14.75 18.5 14.75C18.09 14.75 17.75 14.41 17.75 14V10C17.75 9.59 18.09 9.25 18.5 9.25C18.91 9.25 19.25 9.59 19.25 10V14Z"
        fill={fillColor || "url(#paint2_linear_31320_180825)"}
      />
      <defs>
        <linearGradient
          id="paint0_linear_31320_180825"
          x1="1"
          y1="14"
          x2="10.0669"
          y2="23.4624"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E9E8FF" />
          <stop offset="1" stopColor="#B7B1FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_31320_180825"
          x1="2.75"
          y1="15.75"
          x2="11.8314"
          y2="25.2276"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E9E8FF" />
          <stop offset="1" stopColor="#B7B1FF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_31320_180825"
          x1="2"
          y1="4"
          x2="24.4886"
          y2="33.3187"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E9E8FF" />
          <stop offset="1" stopColor="#B7B1FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
