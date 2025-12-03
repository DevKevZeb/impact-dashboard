import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, FileImage, Pencil, Trash2 } from "lucide-react";
import type { Sdg } from "../types/sdg.types";
import { toast } from "sonner";

interface SdgCardProps {
  sdg: Sdg;
  onEdit: (sdg: Sdg) => void;
}

export function SdgCard({ sdg, onEdit }: SdgCardProps) {
  // Construct full image URL
  const imageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '')}/storage/${sdg.image}`;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(sdg);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Delete functionality", {
      description: "Delete feature is not yet implemented in the backend",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <CardContent className="p-0">
        {/* Image Container with gradient overlay */}
        <div className="relative aspect-square bg-gradient-to-br from-sky-50 to-emerald-50 overflow-hidden">
          <img
            src={imageUrl}
            alt={sdg.filename}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
          
          {/* Action Buttons - Top Right - Always visible */}
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg bg-blue-500/95 text-white hover:bg-blue-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110"
              title="Edit SDG"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-500/95 text-white hover:bg-red-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110"
              title="Delete SDG (not implemented)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white">
              <FileImage className="w-5 h-5 mb-1" />
              <p className="text-xs font-medium truncate">{sdg.filename}</p>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium truncate max-w-[180px]">
                {sdg.filename}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-mono">#{sdg.id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
