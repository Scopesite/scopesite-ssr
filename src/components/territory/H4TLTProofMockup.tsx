/**
 * Fallback SVG mockup for the H4TLT case study ProofSection card.
 *
 * Renders when public/territory/proof/h4tlt-case-study.{webp,png} is not
 * present on disk. Visualises "top AI citations across ChatGPT, Perplexity,
 * Claude and Gemini in under 6 months" with a simple bar chart.
 */

interface Props {
  className?: string;
}

interface Platform {
  name: string;
  /** Percentage of total possible citations captured (0-100) */
  score: number;
  colour: string;
}

const PLATFORMS: Platform[] = [
  { name: 'ChatGPT',    score: 92, colour: '#10A37F' },
  { name: 'Perplexity', score: 86, colour: '#20B6CB' },
  { name: 'Claude',     score: 88, colour: '#CC785C' },
  { name: 'Gemini',     score: 81, colour: '#4285F4' },
];

export function H4TLTProofMockup({ className }: Props) {
  const chartX = 110;
  const chartW = 260;
  const barH = 18;
  const barGap = 14;
  const firstBarY = 130;

  return (
    <svg
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="H4TLT case study: top AI citations across ChatGPT, Perplexity, Claude and Gemini"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id="h4tlt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A1B36" />
          <stop offset="100%" stopColor="#1E2D50" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill="url(#h4tlt-bg)" />

      {/* Header */}
      <text
        x="24"
        y="40"
        fontFamily="system-ui, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="1.5"
        fill="#F5B700"
      >
        CASE STUDY
      </text>
      <text
        x="24"
        y="66"
        fontFamily="system-ui, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#FFFFFF"
      >
        H4TLT
      </text>
      <text
        x="24"
        y="88"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fill="#CBD5E1"
      >
        Occupational hearing health &middot; 6 months
      </text>

      {/* Chart sub-heading */}
      <text
        x="24"
        y="116"
        fontFamily="system-ui, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill="#94A3B8"
        letterSpacing="0.5"
      >
        AI CITATIONS BY PLATFORM
      </text>

      {/* Scale backdrop */}
      <line
        x1={chartX}
        y1={firstBarY - 8}
        x2={chartX}
        y2={firstBarY + PLATFORMS.length * (barH + barGap) - barGap + 4}
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Bars */}
      {PLATFORMS.map((p, i) => {
        const y = firstBarY + i * (barH + barGap);
        const w = (chartW * p.score) / 100;
        return (
          <g key={p.name}>
            <text
              x={chartX - 8}
              y={y + barH / 2 + 4}
              fontFamily="system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              fill="#E2E8F0"
              textAnchor="end"
            >
              {p.name}
            </text>
            <rect
              x={chartX}
              y={y}
              width={chartW}
              height={barH}
              rx={4}
              fill="#1F2D4A"
            />
            <rect
              x={chartX}
              y={y}
              width={w}
              height={barH}
              rx={4}
              fill={p.colour}
            />
            <text
              x={chartX + w - 8}
              y={y + barH / 2 + 4}
              fontFamily="system-ui, sans-serif"
              fontSize="10"
              fontWeight="700"
              fill="#FFFFFF"
              textAnchor="end"
            >
              {p.score}
            </text>
          </g>
        );
      })}

      {/* Footnote */}
      <text
        x="24"
        y="282"
        fontFamily="system-ui, sans-serif"
        fontSize="8"
        fill="#64748B"
      >
        Citation coverage %, top queries for occupational hearing health
      </text>
    </svg>
  );
}

export default H4TLTProofMockup;
