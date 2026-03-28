import { useState } from "react";

// Two sample functions: one short (compliant), one long (exceeds 30)
const sampleFunctions = [
  {
    name: "validateUserInput",
    startLine: 1,
    lines: [
      "function validateUserInput(formData) {",
      "  if (!formData) {",
      '    return { valid: false, error: "No data" };',
      "  }",
      "  const { username, email, password } = formData;",
      "  if (!username || username.length < 3) {",
      '    return { valid: false, error: "Username too short" };',
      "  }",
      "  if (!email.includes('@')) {",
      '    return { valid: false, error: "Invalid email" };',
      "  }",
      "  if (password.length < 8) {",
      '    return { valid: false, error: "Password too short" };',
      "  }",
      "  return { valid: true };",
      "}",
    ],
  },
  {
    name: "processOrderWithShipping",
    startLine: 18,
    lines: [
      "function processOrderWithShipping(order, user, inventory, opts) {",
      "  const items = order.items || [];",
      "  let subtotal = 0;",
      "",
      "  for (const item of items) {",
      "    const stock = inventory[item.id];",
      "    if (!stock || stock.quantity < item.qty) {",
      '      return { success: false, reason: "Out of stock: " + item.name };',
      "    }",
      "    subtotal += stock.price * item.qty;",
      "  }",
      "",
      "  const tax = subtotal * 0.08;",
      "  const taxedTotal = subtotal + tax;",
      "",
      "  const shipping = opts.find(s => s.region === user.region);",
      "  if (!shipping) {",
      '    return { success: false, reason: "No shipping to region" };',
      "  }",
      "",
      "  const total = taxedTotal + shipping.cost;",
      "",
      "  const confirmation = {",
      "    orderId: Math.random().toString(36).slice(2),",
      "    userId: user.id,",
      "    items,",
      "    subtotal,",
      "    tax,",
      "    shippingCost: shipping.cost,",
      "    total,",
      '    eta: shipping.days + " business days",',
      "  };",
      "",
      "  return { success: true, confirmation };",
      "}",
    ],
  },
];

export default function FunctionLengthSimulator() {
  const [limit, setLimit] = useState(30);

  const violations = sampleFunctions.filter((fn) => fn.lines.length > limit);

  return (
    <div className="not-prose my-6 rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
      {/* Header / controls */}
      <div className="px-4 pt-3 pb-3 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Try It: Function Length Simulator</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag the slider to change the limit and watch the extension react.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Limit:{" "}
            <span className="font-mono font-bold text-blue-400">{limit}</span> lines
          </span>
          <input
            type="range"
            min={5}
            max={50}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-28 cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      {/* Code panels */}
      <div className="p-4 flex flex-col gap-3">
        {sampleFunctions.map((fn) => {
          const exceeds = fn.lines.length > limit;
          return (
            <div
              key={fn.name}
              className={`rounded-lg border overflow-hidden transition-all duration-200 ${
                exceeds ? "border-red-500/50" : "border-green-500/40"
              }`}
            >
              {/* Function badge */}
              <div
                className={`flex items-center justify-between px-3 py-1.5 text-xs font-medium ${
                  exceeds
                    ? "bg-red-500/10 text-red-400"
                    : "bg-green-500/10 text-green-400"
                }`}
              >
                <span className="font-mono">{fn.name}()</span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${
                    exceeds ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {fn.lines.length} lines &mdash;{" "}
                  {exceeds
                    ? `⚠ ${fn.lines.length - limit} over limit`
                    : "✓ within limit"}
                </span>
              </div>

              {/* Code */}
              <div className="overflow-x-auto bg-[#0d1117]">
                <table className="text-xs font-mono w-full border-collapse">
                  <tbody>
                    {fn.lines.map((line, i) => (
                      <tr
                        key={i}
                        className={`transition-colors ${
                          exceeds ? "hover:bg-red-500/5" : "hover:bg-green-500/5"
                        }`}
                      >
                        <td className="pl-3 pr-3 text-right text-slate-600 select-none w-8 align-top leading-5 py-px">
                          {fn.startLine + i}
                        </td>
                        <td className="pr-4 text-slate-300 whitespace-pre leading-5 py-px">
                          {line || " "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Simulated VS Code status bar */}
        <div className="flex items-center justify-between mt-1 px-3 py-1.5 rounded bg-[#007acc] text-white text-xs font-mono">
          <span className="text-blue-200 text-[11px]">under-30</span>
          <span>
            {violations.length === 0
              ? "✓ All functions within limit"
              : `⚠ ${violations.length} function${violations.length > 1 ? "s" : ""} exceed${violations.length === 1 ? "s" : ""} limit`}
          </span>
        </div>

        {/* Notification mockup when violations exist */}
        {violations.length > 0 && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3 py-2.5 text-xs text-yellow-300 font-mono">
            <p className="font-semibold text-yellow-200 mb-1">
              ⚠ Under 30: Function length exceeded
            </p>
            {violations.map((fn) => (
              <p key={fn.name} className="text-yellow-400/80">
                {fn.name}(): lines {fn.startLine}–{fn.startLine + fn.lines.length - 1} ({fn.lines.length} lines, limit {limit})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
