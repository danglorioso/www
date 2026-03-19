import { useState, useRef } from "react";
import type { ContributionDay, ContributionWeek } from "../../data/github-contributions-2025";

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

interface Props {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getColor(count: number): string {
  if (count === 0) return "#161b22";
  if (count < 3) return "#0e4429";
  if (count < 6) return "#006d32";
  if (count < 9) return "#26a641";
  return "#39d353";
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Build month label positions from weeks data
function getMonthLabels(weeks: ContributionWeek[]): { label: string; col: number }[] {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date + "T00:00:00").getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });
  return labels;
}

export default function ContributionGraph({ totalContributions, weeks }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: "", x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const cellSize = 12;
  const gap = 3;
  const step = cellSize + gap;

  const monthLabels = getMonthLabels(weeks);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, day: ContributionDay) => {
    if (!gridRef.current) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const parentRect = gridRef.current.getBoundingClientRect();
    const count = day.contributionCount;
    setTooltip({
      visible: true,
      content: `${count} ${count === 1 ? "contribution" : "contributions"} on ${formatDate(day.date)}`,
      x: rect.left - parentRect.left + cellSize / 2,
      y: rect.top - parentRect.top,
    });
  };

  const handleMouseLeave = () => setTooltip((t) => ({ ...t, visible: false }));

  return (
    <div className="not-prose my-6">
      <div className="bg-slate-950 rounded-lg p-4">
        {/* Scrollable grid — footer stays outside and anchored */}
        <div className="overflow-x-auto text-center">
          <div ref={gridRef} className="relative inline-block">
            {/* Month labels row */}
            <div className="relative mb-1" style={{ height: "14px" }}>
              {monthLabels.map(({ label, col }) => (
                <span
                  key={label + col}
                  className="absolute text-xs text-slate-400"
                  style={{ left: `${col * step}px`, whiteSpace: "nowrap" }}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: `${gap}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${gap}px` }}>
                  {week.contributionDays.map((day) => (
                    <div
                      key={day.date}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 2,
                        backgroundColor: getColor(day.contributionCount),
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, day)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {/* {tooltip.visible && (
              <div
                className="absolute pointer-events-none z-50 rounded px-2 py-1 text-xs text-white whitespace-nowrap"
                style={{
                  backgroundColor: "rgba(0,0,0,0.85)",
                  left: tooltip.x,
                  top: tooltip.y - 8,
                  transform: "translate(-50%, -100%)",
                  border: "1px solid #334155",
                }}
              >
                {tooltip.content}
              </div>
            )} */}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 mt-4 text-sm text-slate-400">
          <span className="text-slate-300 font-medium">
            {totalContributions.toLocaleString()} contributions in 2025
          </span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 3, 6, 9].map((v) => (
                <div
                  key={v}
                  style={{ width: cellSize, height: cellSize, borderRadius: 2, backgroundColor: getColor(v) }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
