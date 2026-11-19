import type { SVGAttributes } from "react";

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="20" cy="20" r="20" fill="#030712" className="dark:fill-white" />

        <path
          d="M20 14.5C17.5 12.8 13.5 12.5 10 14V26C13.5 24.5 17.5 24.8 20 27C22.5 24.8 26.5 24.5 30 26V14C26.5 12.5 22.5 12.8 20 14.5Z"
          stroke="white"
          className="dark:stroke-[#030712]"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M20 15V27"
          stroke="white"
          className="dark:stroke-[#030712]"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <span className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
        BelajarProject
      </span>
    </div>
  );
};

export default Logo;
