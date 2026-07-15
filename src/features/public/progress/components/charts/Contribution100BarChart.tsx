import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as htmlToImage from "html-to-image";
import { Menu } from "lucide-react";

interface ContributionDatum {
  id: number | string;
  name: string;
  contribution: number;
}

interface Contribution100BarChartProps {
  data: ContributionDatum[];
  title: string;
  exportFileName?: string;
  emptyMessage?: string;
}

const CATEGORICAL_PALETTE = [
  "#2a78d6",
  "#1baf7a",
  "#eda100",
  "#008300", 
  "#4a3aa7", 
  "#e34948", 
  "#e87ba4",
  "#eb6834", 
];
const OTHER_COLOR = "#898781";
const UNATTRIBUTED_COLOR = "#e1e0d9";
const UNATTRIBUTED_EPSILON = 0.05;
const GAP_COLOR = "#ffffff";
const GAP_VALUE = 0.4;
const MAX_SEGMENTS = 8;
const MIN_INLINE_LABEL_PCT = 10;

function colorForContributorId(id: number | string): string {
  const numericId =
    typeof id === "number"
      ? id
      : Array.from(String(id)).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const index = ((numericId % CATEGORICAL_PALETTE.length) + CATEGORICAL_PALETTE.length) % CATEGORICAL_PALETTE.length;
  return CATEGORICAL_PALETTE[index];
}

function readableTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0b0b0b" : "#ffffff";
}

interface Segment { id: number | string; name: string; contribution: number; color: string; }

function prepareSegments(data: ContributionDatum[]): Segment[] {
  const sorted = [...data]
    .filter((d) => d.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution);

  let segments: Segment[];
  if (sorted.length <= MAX_SEGMENTS) {
    segments = sorted.map((d) => ({ ...d, color: colorForContributorId(d.id) }));
  } else {
    const head = sorted.slice(0, MAX_SEGMENTS - 1).map((d) => ({ ...d, color: colorForContributorId(d.id) }));
    const tail = sorted.slice(MAX_SEGMENTS - 1);
    const otherTotal = tail.reduce((sum, d) => sum + d.contribution, 0);
    segments = [...head, { id: "other", name: `Other (${tail.length})`, contribution: otherTotal, color: OTHER_COLOR }];
  }

  const attributedTotal = segments.reduce((sum, seg) => sum + seg.contribution, 0);
  const unattributed = 100 - attributedTotal;
  if (unattributed > UNATTRIBUTED_EPSILON) {
    segments = [...segments, { id: "unattributed", name: "Unattributed", contribution: Math.min(unattributed, 100), color: UNATTRIBUTED_COLOR }];
  }

  return segments;
}

export default function Contribution100BarChart({ data, title, exportFileName = "contribution-chart", emptyMessage = "No contributors reported yet." }: Contribution100BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

 const hasAnyContributor = (data ?? []).some((d) => d.contribution > 0);

  const segments = useMemo(() => prepareSegments(data ?? []), [data]);
  const segmentById = useMemo(() => new Map(segments.map((s) => [String(s.id), s])), [segments]);

  const chartData = useMemo(() => {
    const row: Record<string, number | string> = { name: title };
    segments.forEach((seg, i) => {
      row[String(seg.id)] = seg.contribution;
      if (i < segments.length - 1) row[`gap-${i}`] = GAP_VALUE;
    });
    return [row];
  }, [segments, title]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const exportPNG = useCallback(async () => {
    if (!containerRef.current) return;
    setOpen(false);
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        filter: (node) => !menuRef.current?.contains(node as Node) || node === containerRef.current,
      });
      Object.assign(document.createElement("a"), { download: `${exportFileName}.png`, href: dataUrl }).click();
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  }, [exportFileName]);

  const exportSVG = useCallback(async () => {
    if (!containerRef.current) return;
    setOpen(false);
    try {
      const dataUrl = await htmlToImage.toSvg(containerRef.current, {
        backgroundColor: "#ffffff",
        filter: (node) => !menuRef.current?.contains(node as Node) || node === containerRef.current,
      });
      const svgString = decodeURIComponent(dataUrl.split(",")[1]);
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { download: `${exportFileName}.svg`, href: url }).click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("SVG export failed:", err);
    }
  }, [exportFileName]);

  const exportCSV = useCallback(() => {
    if (!segments.length) return;
    const rows = segments.map((s) => `${s.name},${s.contribution.toFixed(2)}`);
    const csvContent = ["Name,Contribution percent", ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: `${exportFileName}.csv` }).click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }, [segments, exportFileName]);

  const handlePNGClick = useCallback(() => { void exportPNG(); }, [exportPNG]);
  const handleSVGClick = useCallback(() => { void exportSVG(); }, [exportSVG]);
  const handleCSVClick = useCallback(() => { exportCSV(); }, [exportCSV]);

  return (
    <div ref={containerRef} className="relative w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div ref={menuRef} className="absolute top-4 right-4 z-10">
        <button className="bg-white hover:cursor-pointer hover:bg-gray-50 p-2 rounded-md border border-gray-200 transition" onClick={() => setOpen(!open)} aria-label="Export options">
          <Menu size={18} className="text-gray-500" />
        </button>
        {open && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 min-w-44">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={handlePNGClick}>
              Download PNG
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={handleSVGClick}>
              Download SVG
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={handleCSVClick}>
              Download CSV
            </button>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-700 mb-4 pr-10">{title}</h3>

      {!hasAnyContributor ? (
        <p className="text-sm text-gray-400 py-6 text-center">{emptyMessage}</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={64}>
            <BarChart layout="vertical" data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap={0}>
              <XAxis type="number" domain={[0, "dataMax"]} hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const rows = payload
                    .filter((p) => segmentById.has(String(p.dataKey)))
                    .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0));
                  if (!rows.length) return null;
                  return (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] px-2.5 py-2 text-xs">
                      {rows.map((r) => {
                        const seg = segmentById.get(String(r.dataKey))!;
                        return (
                          <div key={String(r.dataKey)} className="flex items-center gap-1.5 py-0.5">
                            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: seg.color }} />
                            <span className="text-gray-600">{seg.name}</span>
                            <span className="ml-auto font-semibold text-gray-900">{seg.contribution.toFixed(1)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              {segments.map((seg, i) => (
                <Bar
                  key={String(seg.id)}
                  dataKey={String(seg.id)}
                  stackId="contribution"
                  fill={seg.color}
                  radius={
                    segments.length === 1
                      ? [4, 4, 4, 4]
                      : i === 0
                        ? [4, 0, 0, 4]
                        : i === segments.length - 1
                          ? [0, 4, 4, 0]
                          : [0, 0, 0, 0]
                  }
                  label={
                    seg.contribution >= MIN_INLINE_LABEL_PCT
                      ? { position: "center", formatter: () => `${seg.contribution.toFixed(0)}%`, fill: readableTextColor(seg.color), fontSize: 12, fontWeight: 600 }
                      : undefined
                  }
                  isAnimationActive={false}
                />
              ))}
              {segments.slice(0, -1).map((_, i) => (
                <Bar key={`gap-${i}`} dataKey={`gap-${i}`} stackId="contribution" fill={GAP_COLOR} isAnimationActive={false} />
              ))}
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            {segments.map((seg) => (
              <div key={String(seg.id)} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
                <span>{seg.name}</span>
                <span className="font-semibold text-gray-900">{seg.contribution.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
