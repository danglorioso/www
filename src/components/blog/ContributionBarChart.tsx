import { useState } from "react";

interface BarChartProps {
  title: string;
  data: { label: string; value: number }[];
  xAxisLabel: string;
  yAxisLabel: string;
}

export default function ContributionBarChart({
  title,
  data,
  xAxisLabel,
  yAxisLabel,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value));
  // Round up to nearest 100 for y-axis
  const yMax = Math.ceil(maxValue / 100) * 100;
  const yTicks = Array.from({ length: yMax / 100 + 1 }, (_, i) => i * 100);

  const paddingLeft = 52;
  const paddingRight = 16;
  const paddingTop = 32;
  const paddingBottom = 86;
  const chartWidth = 760;
  const chartHeight = 440;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const barWidth = (innerWidth / data.length) * 0.6;
  const barGap = innerWidth / data.length;

  return (
    <div className="rounded-lg p-4 not-prose my-6">
      <p className="text-center text-sm text-slate-300 mb-2 font-medium">{title}</p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-2xl mx-auto block"
          style={{ minWidth: "320px", overflow: "visible" }}
        >
          {/* Y-axis gridlines and labels */}
          {yTicks.map((tick) => {
            const y = paddingTop + innerHeight - (tick / yMax) * innerHeight;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + innerWidth}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="11"
                  fill="#94a3b8"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X axis baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + innerHeight}
            x2={paddingLeft + innerWidth}
            y2={paddingTop + innerHeight}
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = (d.value / yMax) * innerHeight;
            const x = paddingLeft + i * barGap + (barGap - barWidth) / 2;
            const y = paddingTop + innerHeight - barHeight;
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={d.label}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isHovered ? "#4ade80" : "#22c55e"}
                  rx="2"
                  style={{ transition: "fill 0.15s ease" }}
                />

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 26}
                      y={y - 28}
                      width={52}
                      height={22}
                      rx="4"
                      fill="#1e293b"
                      stroke="#4ade80"
                      strokeWidth="1"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 14}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#4ade80"
                    >
                      {d.value}
                    </text>
                  </g>
                )}

                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + innerHeight + 32}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#94a3b8"
                  transform={
                    d.label.length > 5
                      ? `rotate(-35, ${x + barWidth / 2}, ${paddingTop + innerHeight + 14})`
                      : undefined
                  }
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={14}
            y={paddingTop + innerHeight / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
            transform={`rotate(-90, 14, ${paddingTop + innerHeight / 2})`}
          >
            {yAxisLabel}
          </text>

          {/* X-axis label */}
          <text
            x={paddingLeft + innerWidth / 2}
            y={chartHeight - 14}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
          >
            {xAxisLabel}
          </text>
        </svg>
      </div>
    </div>
  );
}
