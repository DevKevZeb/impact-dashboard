import { useCallback, useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { Menu } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  BarChart,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LabelList,
} from "recharts";

interface Data {
  id: number;
  name: string;
  implementation: number;
}
interface Props {
  data: Data[];
  label?: string;
  emptyMessage?: string;
}

const CustomXTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value?: number | string } }) => (
  <text x={x} y={(y ?? 0) + 14} fill="#9CA3AF" fontSize={11} textAnchor="middle">
    {payload?.value}%
  </text>
);

const Y_MAX_CHARS = 22;
const Y_MAX_LINES = 2;

const wrapToLines = (text: string): string[] => {
  const words = text.split(/(\s+)/);
  const lines: string[] = [];
  let currentLine = "";

  for (const segment of words) {
    const candidate = currentLine + segment;
    if (candidate.length <= Y_MAX_CHARS || !currentLine.trim()) {
      currentLine = candidate;
    } else {
      lines.push(currentLine.trimEnd());
      currentLine = segment.trimStart();
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trimEnd());

  if (lines.length > Y_MAX_LINES) {
    const truncated = lines.slice(0, Y_MAX_LINES);
    const last = truncated[Y_MAX_LINES - 1];
    truncated[Y_MAX_LINES - 1] = last.length >= Y_MAX_CHARS
      ? last.slice(0, Y_MAX_CHARS - 1) + "…"
      : last + "…";
    return truncated;
  }

  return lines;
};

const CustomYTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value?: string } }) => {
  const lines = wrapToLines(String(payload?.value ?? ""));
  const lineHeight = 14;
  const startY = -((lines.length - 1) * lineHeight) / 2;

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={-6}
          y={startY + i * lineHeight}
          fill="#374151"
          fontSize={12}
          textAnchor="end"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

interface BarLabelProps { x?: number; y?: number; width?: number; height?: number; value?: number | string }

const CustomBarLabel = (props: BarLabelProps) => {
  const { x = 0, y = 0, width = 0, height = 0, value } = props;
  const label = `${Number(value ?? 0).toFixed(2)}%`;
  const MIN_INSIDE_WIDTH = 55;

  if (width >= MIN_INSIDE_WIDTH) {
    return (
      <text
        x={x + 10}
        y={y + height / 2 + 1}
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize={13}
        fontWeight="700"
      >
        {label}
      </text>
    );
  }
  return (
    <text
      x={x + width + 6}
      y={y + height / 2 + 1}
      dominantBaseline="middle"
      fill="#374151"
      fontSize={13}
      fontWeight="700"
    >
      {label}
    </text>
  );
};

export default function HorizontalMultiBarChart({ data, label = "Degree of Implementation", emptyMessage = "No data reported yet." }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.implementation,
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const exportPNG = useCallback(async () => {
    if (!containerRef.current) return;
    setOpen(false);
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        filter: (node) =>
          !menuRef.current?.contains(node as Node) ||
          node === containerRef.current,
      });
      Object.assign(document.createElement("a"), {
        download: "chart.png",
        href: dataUrl,
      }).click();
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  }, []);

  const exportSVG = useCallback(async () => {
    if (!containerRef.current) return;
    setOpen(false);
    try {
      const dataUrl = await htmlToImage.toSvg(containerRef.current, {
        backgroundColor: "#ffffff",
        filter: (node) =>
          !menuRef.current?.contains(node as Node) ||
          node === containerRef.current,
      });
      const svgString = decodeURIComponent(dataUrl.split(",")[1]);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), {
        download: "chart.svg",
        href: url,
      }).click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("SVG export failed:", err);
    }
  }, []);

  const handlePNGClick = useCallback(() => { void exportPNG(); }, [exportPNG]);
  const handleSVGClick = useCallback(() => { void exportSVG(); }, [exportSVG]);

  return (
    <div ref={containerRef} className="relative w-full bg-white border border-gray-200 shadow-sm rounded-xl py-4 px-2" style={{ height: `${Math.max(280, chartData.length * 52 + 80)}px` }} >
      <div ref={menuRef} className="absolute top-3 right-3 z-10">
        <button className="bg-white hover:bg-gray-50 cursor-pointer p-2 rounded-md transition border border-gray-200" onClick={() => setOpen(!open)} aria-label="Export options" >
          <Menu size={18} className="text-gray-500" />
        </button>
        {open && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 min-w-44">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer" onClick={handlePNGClick}>
              Download PNG
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer" onClick={handleSVGClick}>
              Download SVG
            </button>
          </div>
        )}
      </div>

      {/* ── Chart ── */}
      {chartData.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 60, left: 10, bottom: 30 }} barCategoryGap="30%" >
            <XAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={<CustomXTick />} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={<CustomYTick />} width={160} />
            <Tooltip
              formatter={(value: number | undefined) => [
                `${(value ?? 0).toFixed(2)}%`,
                label,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: 12,
              }}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={() => label}
              wrapperStyle={{ fontSize: 12, color: "#374151" }}
            />
            <Bar
              dataKey="value"
              fill="rgba(59, 130, 246, 0.95)"
              radius={[0, 4, 4, 0]}
              maxBarSize={28}
            >
              <LabelList dataKey="value" content={<CustomBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}