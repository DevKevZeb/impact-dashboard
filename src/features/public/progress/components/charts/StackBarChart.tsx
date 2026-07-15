import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Menu } from "lucide-react";
import * as htmlToImage from "html-to-image";

interface Beneficiary { id: number; name: string; }
interface KpaBeneficiaries { name: string; beneficiaries: Beneficiary[]; }
interface Props { data:  KpaBeneficiaries[]; }

const CustomXAxisTick = ({
  x, y, payload, maxChars = 12,
}: { x?: number; y?: number; payload?: { value: string }; maxChars?: number }) => {
  const label = payload?.value ?? "";
  const truncated = label.length > maxChars ? label.slice(0, maxChars) + "…" : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{label}</title>
      <text x={0} y={0} dy={14} textAnchor="middle"
        fill="#6B7280" fontSize={12} fontFamily="inherit">
        {truncated}
      </text>
    </g>
  );
};

export function StackBarChart({ data }: Props) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const chartData = useMemo(() => {
    const kpas = data??[];
    const unique = [...new Map(
      kpas.flatMap((k) => k.beneficiaries).map((b) => [b.id, b])
    ).values()];
    return kpas.map((kpa) => {
      const row: Record<string, unknown> = { name: kpa.name };
      unique.forEach((b) => {
        row[b.name] = kpa.beneficiaries.some((x) => x.id === b.id) ? 1 : 0;
      });
      return row;
    });
  }, [data]);

  const beneficiaries = useMemo(() => {
    return [...new Map(
      data.flatMap((k) => k.beneficiaries).map((b) => [b.id, b])
    ).values()];
  }, [data]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
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
        Object.assign(document.createElement("a"), {
          download: "beneficiaries-chart.png",
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
          const dataUrl = await htmlToImage.toSvg(containerRef.current, { backgroundColor: "#ffffff", filter: (node) => !menuRef.current?.contains(node as Node) || node === containerRef.current, });
          const svgString = decodeURIComponent(dataUrl.split(",")[1]);
          const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          Object.assign(document.createElement("a"), {download: "beneficiaries-chart.svg",href: url,}).click();
          URL.revokeObjectURL(url);
      } catch (err) {
          console.error("SVG export failed:", err);
      }
  }, []);

  const exportCSV = useCallback(() => {
    if (!chartData.length) return;
    const headers = ["KPA", ...beneficiaries.map((b) => b.name)];
    const rows = chartData.map((r) =>
      `${r.name},${beneficiaries.map((b) => r[b.name] ?? 0).join(",")}`
    );
    const blob = new Blob(
      [[headers.join(","), ...rows].join("\n")],
      { type: "text/csv;charset=utf-8;" }
    );
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url, download: "beneficiaries-data.csv",
    }).click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }, [chartData, beneficiaries]);

  const handlePNGClick = useCallback(() => { void exportPNG(); }, [exportPNG]);
  const handleSVGClick = useCallback(() => { void exportSVG(); }, [exportSVG]);
  const handleCSVClick = useCallback(() => { exportCSV(); }, [exportCSV]);

  return (
    <div ref={containerRef} className="relative w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm" >
      <div ref={menuRef} className="absolute top-4 right-4 z-10">
        <button className="bg-white hover:cursor-pointer hover:bg-gray-50 p-2 rounded-md border border-gray-200 transition" onClick={() => setOpen(!open)} aria-label="Export options" >
          <Menu size={18} className="text-gray-500" />
        </button>
        {open && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 min-w-44">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={handlePNGClick}>Download PNG</button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={handleSVGClick}>Download SVG</button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md" onClick={handleCSVClick}>Download CSV</button>
          </div>
        )}
      </div>    
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={<CustomXAxisTick />} interval={0} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} width={28} />
            <Tooltip contentStyle={{borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12}}  cursor={{ fill: "rgba(0,0,0,0.04)" }}/>
            <Legend verticalAlign="bottom" height={50} wrapperStyle={{ fontSize: 12, color: "#374151" }} />
            {beneficiaries.map((b, i) => (
              <Bar key={b.id} dataKey={b.name} stackId="a" fill={`hsl(${i * 40}, 70%, 55%)`}/>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}     
