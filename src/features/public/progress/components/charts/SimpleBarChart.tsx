import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import * as htmlToImage from "html-to-image";
import { Menu } from "lucide-react";

interface Data {id: number; name: string; contribution:number}
interface SimpleBarChartProps{ data:Data[]}

export default function SimpleBarChart({data}:SimpleBarChartProps){
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const h = (e: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(e.target as Node))
            setOpen(false);
        };
        if (open) document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
      }, [open]);

    const exportPNG = async () => {
        if (!containerRef.current) return;
        setOpen(false);
        try {
            const dataUrl = await htmlToImage.toPng(containerRef.current, {
                backgroundColor: "#ffffff",
                pixelRatio: 2,
                filter: (node) => !menuRef.current?.contains(node as Node) || node === containerRef.current
            });
            Object.assign(document.createElement("a"), {
                download: "beneficiaries-chart.png",
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
            const dataUrl = await htmlToImage.toSvg(containerRef.current, { backgroundColor: "#ffffff", filter: (node) => !menuRef.current?.contains(node as Node) || node === containerRef.current});
            const svgString = decodeURIComponent(dataUrl.split(",")[1]);
            const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            Object.assign(document.createElement("a"), {download: "beneficiaries-chart.svg",href: url,}).click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("SVG export failed:", err);
        }
    };
      
    const exportCSV = () => {
        if (!data.length) return;
        const headers = ["Name", ...data.map((b) => b.name)];
        const rows = [ "Implementation contribution percent", ...data.map((b) => b.contribution)];
        const csvContent = headers.join(",") + "\n" + rows.join(",");

        const blob = new Blob( [csvContent], { type: "text/csv;charset=utf-8;" } );
        const url = URL.createObjectURL(blob);
        Object.assign(document.createElement("a"), {href: url, download: "data.csv"}).click();
        URL.revokeObjectURL(url);
        setOpen(false);
    };
    

    return(
        <div ref={containerRef} className="relative w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div ref={menuRef} className="absolute top-4 right-4 z-10">
                <button className="bg-white hover:cursor-pointer hover:bg-gray-50 p-2 rounded-md border border-gray-200 transition" onClick={() => setOpen(!open)} aria-label="Export options" >
                    <Menu size={18} className="text-gray-500" />
                </button>
                {open && (
                    <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 min-w-44">
                        {[{label: "Download PNG", fn: exportPNG }, { label: "Download SVG", fn: exportSVG }, { label: "Download CSV", fn: exportCSV }].map(({ label, fn }) => (
                        <button key={label}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            onClick={fn}
                        >{label}</button>
                        ))}
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={400}  >
                <BarChart responsive data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} />
                    <YAxis width="auto" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} allowDecimals={false} domain={[0,100]} tickFormatter={(value) => `${value}%`}/>
                    <Tooltip formatter={(value) => `${value}%`} contentStyle={{borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12}}  cursor={{ fill: "rgba(0,0,0,0.04)" }}/>
                    <Legend formatter={() => "Contribution percent"}/>
                    <Bar dataKey="contribution" label={{ position: "top", formatter: (value: any) => typeof value === "number" ? `${value}%` : value }}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 40}, 70%, 55%)`}/>
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}