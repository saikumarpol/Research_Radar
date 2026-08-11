"use client";

import { Card, CardContent } from "@/components/ui/card";

import SearchBar from "./SearchBar";
import Filters from "./Filters";

export default function FilterSection({
  search,
  setSearch,
  year,
  setYear,
}) {
  return (
    <Card className="mb-8 rounded-2xl border shadow-sm">
      <CardContent className="p-6">

        <div className="grid grid-cols-12 gap-4">

          <div className="col-span-12 lg:col-span-8">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          <div className="col-span-8 lg:col-span-3">
            <Filters
              year={year}
              setYear={setYear}
              setSearch={setSearch}
            />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}