import type { LucideIcon } from "lucide-react";

interface InfoBlockProps {
  label: string;
  children: React.ReactNode;
  icon: LucideIcon;
  small?: boolean;
}

function InfoBlock({ label, children, icon:Icon, small = true }: InfoBlockProps) {
  return (
    <div className="flex space-x-4">
      <div>
        <Icon className="w-9 h-9 text-blue-900"/>
      </div>
      <div>
        <p className={`${small ? " text-lg" : "text-2xl"} text-slate-500`}>{label}</p>
        <div className="mt-1 label-bold">
          {children}
        </div>
      </div>
    </div>
  );
}

export default InfoBlock;
