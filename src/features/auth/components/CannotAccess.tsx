import { AlertCircle } from "lucide-react";

interface CannotAccessProps {
  message?: string;
  description?: string;
}

export function CannotAccess({ 
  message = "Access Denied",
  description = "You don't have permission to access this resource"
}: CannotAccessProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {description}
      </p>
    </div>
  );
}
