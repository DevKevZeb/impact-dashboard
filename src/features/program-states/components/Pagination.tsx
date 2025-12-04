import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page and 2 on each side
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="sm"
        className="bg-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-emerald-500 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          className={
            currentPage === page
              ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white"
              : "bg-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-emerald-500 hover:text-white"
          }
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="sm"
        className="bg-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-emerald-500 hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
