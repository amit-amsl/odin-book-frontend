export function LogoPatternCoverBackground() {
  return (
    <svg
      className="pointer-events-none inset-0 h-full w-full rounded-sm text-zinc-900/5 md:border dark:text-zinc-100/10"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="botPattern"
          patternUnits="userSpaceOnUse"
          width="60"
          height="60"
        >
          <g>
            {/* First icon */}
            <g
              transform="translate(0, 0) rotate(-15) scale(0.9)"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </g>
            {/* Offset icon */}
            <g
              transform="translate(30, 30) rotate(15) scale(0.9)"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#botPattern)" />
    </svg>
  );
}
