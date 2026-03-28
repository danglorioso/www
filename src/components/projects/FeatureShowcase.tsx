import { useState } from "react";

const features = [
  {
    id: "line-count",
    label: "Line Count",
    description:
      "Select any range of lines and the count appears instantly in the VS Code status bar — regardless of language or file type. Useful for eyeballing a function before running a full scan.",
    media: "https://raw.githubusercontent.com/danglorioso/under-30/main/images/line-selection.gif",
    mediaType: "gif",
    alt: "Line selection count displayed in VS Code status bar",
  },
  {
    id: "function-check",
    label: "Function Scan",
    description:
      "Click the status bar item or run the command from the Command Palette to scan every function in the file. Any function exceeding the limit triggers a warning with its exact start and end line numbers.",
    media: "https://raw.githubusercontent.com/danglorioso/under-30/main/images/status-bar-click.gif",
    mediaType: "gif",
    alt: "Function length scan triggered from status bar",
  },
  {
    id: "set-limit",
    label: "Set Limit",
    description:
      "Run 'Set Function Length Limit' from the Command Palette to change the threshold on the fly. Any positive integer is valid — handy when different projects or teams have different standards.",
    media: "https://raw.githubusercontent.com/danglorioso/under-30/main/images/set-limit.gif",
    mediaType: "gif",
    alt: "Setting a custom function length limit via Command Palette",
  },
  {
    id: "brace-check",
    label: "Brace Check",
    description:
      "Before scanning functions, the extension validates that all braces are balanced. Unclosed or unmatched braces trigger an immediate alert — preventing misleading results and surfacing structural errors early.",
    media: "https://raw.githubusercontent.com/danglorioso/under-30/main/images/missing-closing-brace.png",
    mediaType: "png",
    alt: "Error shown for missing closing brace",
  },
];

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const feature = features[active];

  return (
    <div className="not-prose my-6 rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-700">
        {features.map((f, i) => (
          <button
            key={f.id}
            onClick={() => setActive(i)}
            className={`flex-1 px-2 py-2.5 text-xs sm:text-sm font-medium transition-colors focus:outline-none ${
              active === i
                ? "bg-slate-800 text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
        <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
          <img
            src={feature.media}
            alt={feature.alt}
            className="w-full block"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
