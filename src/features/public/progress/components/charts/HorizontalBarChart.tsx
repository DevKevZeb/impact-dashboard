import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useRef, useState, useEffect } from "react";
import { Menu } from "lucide-react";
import * as htmlToImage from "html-to-image";

interface HorizontalBarChartProps {
  name: string;
  implementation: number;
}

export function HorizontalBarChart({ name, implementation }: HorizontalBarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const exportPNG = async () => {
    if (!containerRef.current) return;
    setOpen(false);
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        filter: (node) =>
          !menuRef.current?.contains(node as Node) || node === containerRef.current,
      });
      Object.assign(document.createElement("a"), {
        download: "chart.png",
        href: dataUrl,
      }).click();
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  };

  const exportSVG = async () => {
    if (!containerRef.current) return;
    setOpen(false);
    try {
      const dataUrl = await htmlToImage.toSvg(containerRef.current, {
        backgroundColor: "#ffffff",
        filter: (node) =>
          !menuRef.current?.contains(node as Node) || node === containerRef.current,
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
  };

  const exportCSV = () => {
    const csvContent = `Name,Implementation\n${name},${implementation.toFixed(2)}%`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: "chart-data.csv",
    }).click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const chartData = [{ name, value: implementation }];

  const CustomXTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <text x={x} y={y + 10} textAnchor="middle" fill="#000000" fontSize={12}>
        {`${payload.value}%`}
      </text>
    );
  };

  return (
    <div ref={containerRef} className="relative h-[350px] w-full bg-white border border-gray-200 shadow-sm rounded-xl py-4 px-2" >
      <div ref={menuRef} className="absolute top-3 right-3 z-10">
        <button className="bg-white hover:bg-gray-50 cursor-pointer p-2 rounded-md transition border border-gray-200" onClick={() => setOpen(!open)} aria-label="Export options" >
          <Menu size={18} className="text-gray-500" />
        </button>
        {open && (
          <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 min-w-44">
            {[
              { label: "Download PNG", fn: exportPNG },
              { label: "Download SVG", fn: exportSVG },
              { label: "Download CSV", fn: exportCSV },
            ].map(({ label, fn }) => (
              <button
                key={label}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={fn}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} >
          <XAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tick={<CustomXTick />} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#374151", fontSize: 12 }} width={80} />
          <Tooltip formatter={(value: number | undefined) => [ `${(value ?? 0).toFixed(2)}%`, "Degree of Implementation", ]} contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12, }} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend verticalAlign="bottom" height={36} formatter={() => "Degree of Implementation"} wrapperStyle={{ fontSize: 12, color: "#374151" }} />
          <Bar dataKey="value" fill="rgba(59, 130, 246, 0.95)" barSize={150} radius={[0, 4, 4, 0]}>
            <LabelList dataKey="value" position={"top"} formatter={(value: unknown) => `${Number(value ?? 0).toFixed(2)}%`} style={{ fontSize: 14, fontWeight: "bold", fill: "#000000" }}  />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}