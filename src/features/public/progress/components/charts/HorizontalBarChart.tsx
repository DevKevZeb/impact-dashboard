import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { Plugin } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useRef, useState, useEffect } from "react";
import { Menu } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface HorizontalBarChartProps {
  name: string;
  implementation: number;
}

const centerTextPlugin: Plugin<"bar"> = {
  id: "centerText",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta.data.length) return;

    const value = chart.data.datasets[0].data[0] as number;
    const bar = meta.data[0] as any;

    const x = bar.x;
    const y = bar.y;

    ctx.save();
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${value.toFixed(2)}%`, x, y);
    ctx.restore();
  },
};

export function HorizontalBarChart({
  name,
  implementation,
}: HorizontalBarChartProps) {
  const chartRef = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const downloadCSV = () => {
    const csvContent = `Name,Implementation\n${name},${implementation.toFixed(2)}%`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart-data.csv";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadPNG = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const canvas = chart.canvas;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
    setOpen(false);
  };

  const data = {
    labels: [name],
    datasets: [
      {
        label: "Degree of Implementation",
        data: [implementation],
        backgroundColor: "rgba(59, 130, 246, 0.95)",
        borderWidth: 0,
        barThickness: 200,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#000000",
          callback: (value: any) => `${value}%`,
        },
        grid: { display: false },
      },
      y: {
        grid: { display: false },

      },
    },
    plugins: {
      legend: { position: "bottom" as const },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${Number(context.raw).toFixed(2)}%`,
        },
      },
      ticks: {
        color: "#000000",
      }
    },
  };

  return (
    <div className="relative h-[350px] w-full border py-4 px-2">
      <div ref={menuRef} className="absolute top-3 right-3 z-10" >
        <div className="bg-white hover:bg-slate-100 cursor-pointer p-2 rounded-md transition" onClick={() => setOpen(!open)} >
          <Menu size={22}/>
        </div>

        {open && (
          <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 min-w-40">
            <div className="p-2 cursor-pointer hover:bg-slate-100 rounded-md" onClick={downloadPNG} >
              Download PNG
            </div>
            <div className="p-2 cursor-pointer hover:bg-slate-100 rounded-md" onClick={downloadCSV} >
              Download CSV
            </div>
          </div>
        )}
      </div>
      <Bar ref={chartRef} data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}