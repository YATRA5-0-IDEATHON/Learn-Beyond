import React from "react";

export default function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 3L2 8l10 5 10-5-10-5z"
          fill={light ? "#F5A623" : "#2A1F7D"}
        />
        <path
          d="M4 10.5v4.2c0 1.2 3.6 3.3 8 3.3s8-2.1 8-3.3v-4.2l-8 4-8-4z"
          fill={light ? "#F7A93C" : "#332B96"}
        />
      </svg>
      <span
        className={`text-lg font-bold tracking-tight ${
          light ? "text-white" : "text-primary"
        }`}
      >
        Learn<span className="text-accent">Beyond</span>
      </span>
    </div>
  );
}
