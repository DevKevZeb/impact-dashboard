import { type ReactNode } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmationVariant = "default" | "destructive" | "success" | "warning";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  icon?: LucideIcon;
  iconClassName?: string;
  details?: ReactNode;
}

const variantConfig: Record<
  ConfirmationVariant,
  {
    buttonVariant: "default" | "destructive";
    buttonClassName?: string;
    iconColor: string;
  }
> = {
  default: {
    buttonVariant: "default",
    iconColor: "text-blue-600",
  },
  destructive: {
    buttonVariant: "destructive",
    iconColor: "text-red-600",
  },
  success: {
    buttonVariant: "default",
    buttonClassName: "bg-green-600 hover:bg-green-700 text-white",
    iconColor: "text-green-600",
  },
  warning: {
    buttonVariant: "default",
    buttonClassName: "bg-yellow-600 hover:bg-yellow-700 text-white",
    iconColor: "text-yellow-600",
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  icon: Icon,
  iconClassName,
  details,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && (
              <Icon
                className={cn(
                  "w-5 h-5",
                  iconClassName || config.iconColor
                )}
              />
            )}
            {title}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">{description}</div>
          </DialogDescription>
        </DialogHeader>

        {details && <div className="py-2">{details}</div>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className={config.buttonClassName}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
