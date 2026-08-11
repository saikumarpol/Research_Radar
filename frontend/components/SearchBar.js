"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  value,
  onChange,
}) {
  return (

    <div className="relative">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search research papers..."
        className="
          h-11
          rounded-xl
          border-slate-200
          pl-11
          shadow-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
        "
      />

    </div>

  );
}