import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
    backTo: string;
}

export default function BackArrow({ backTo }: Props) {
  const navigate = useNavigate();

  return (
    <div title="Back to Programs">
        <ArrowLeft className="w-6 h-6 text-gray-600 hover:cursor-pointer hover:text-gray-800 transition-colors" onClick={() => navigate(backTo)} />
    </div> 
  );
}


