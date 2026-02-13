import {type LucideIcon } from "lucide-react";

interface Props{
    title: string;
    description: string;
    icon: LucideIcon;
}

export default function InfoRow({title, description, icon: Icon}: Props){
    return(
        <div>
            <section>
                <div className="border-b-2 py-5 flex space-x-3 items-center border-slate-300">
                    <Icon className="w-9 h-9 text-slate-600"/>
                    <h2 className="text-2xl subtitle-label">{title}</h2>
                </div>
                <p className="mt-4 ml-10 text-slate-700">{description}</p>
            </section>
        </div>
    )
}