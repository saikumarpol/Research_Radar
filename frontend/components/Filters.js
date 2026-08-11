"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Filters({
  year,
  setYear,
  setSearch,
}) {

  function clearFilters() {
    setYear("all");
    setSearch("");
  }

  return (

    <div className="flex items-center gap-3">

      <Select
        value={year}
        onValueChange={setYear}
      >

        <SelectTrigger className="h-11 w-44 rounded-xl">

          <SelectValue placeholder="All Years" />

        </SelectTrigger>

        <SelectContent>

          <SelectItem value="all">
            All Years
          </SelectItem>

          <SelectItem value="2026">2026</SelectItem>
          <SelectItem value="2025">2025</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>

        </SelectContent>

      </Select>

      <Button
        variant="outline"
        className="h-11 rounded-xl px-4"
        onClick={clearFilters}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Clear
      </Button>

    </div>

  );

}