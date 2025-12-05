import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";

interface SdgUploadZoneProps {
  onFileSelect: (file: File) => void;
  currentImage?: string;
  disabled?: boolean;
}

export function SdgUploadZone({
  onFileSelect,
  currentImage,
  disabled,
}: SdgUploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [wasCleared, setWasCleared] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
        setWasCleared(false); // Reset cleared state when new file is selected
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
    disabled,
  });

  const clearPreview = () => {
    setPreview(null);
    setWasCleared(true);
  };

  const displayImage = wasCleared ? null : (preview || currentImage);

  return (
    <div className="w-full">
      {displayImage ? (
        <div className="relative">
          <img
            src={displayImage}
            alt="SDG Preview"
            className="w-full h-48 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
          />
          {!disabled && (
            <button
              type="button"
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${
              isDragActive
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {isDragActive ? (
              <Upload className="w-12 h-12 text-emerald-500 animate-bounce" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="text-base font-medium text-gray-700">
                {isDragActive
                  ? "Drop the image here..."
                  : "Drag an image or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF, WEBP, SVG (max. 2MB)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
