"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Pagination({
  page,
  setPage,
  total,
}) {
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const changePage = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderPages = () => {
    const pages = [];

    let first = Math.max(1, page - 2);
    let last = Math.min(totalPages, page + 2);

    if (page <= 3) {
      last = Math.min(5, totalPages);
    }

    if (page >= totalPages - 2) {
      first = Math.max(1, totalPages - 4);
    }

    for (let i = first; i <= last; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          size="icon"
          className="h-10 w-10"
          onClick={() => changePage(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-6">

      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold">
          {start}
        </span>{" "}
        -
        <span className="font-semibold">
          {" "}{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {total}
        </span>{" "}
        papers
      </div>

      <div className="flex items-center gap-2">

        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        {renderPages()}

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => changePage(page + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>

      </div>

    </div>
  );
}