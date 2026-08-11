"use client";

import { useEffect, useState } from "react";

import Container from "@/components/Container";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";
import PaperCard from "@/components/PaperCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

import usePapers from "@/hooks/usePapers";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  BookOpen,
  X,
} from "lucide-react";

export default function Home() {
  // ============================================================
  // STATE
  // ============================================================

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const pageSize = 9;

  // ============================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ============================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    year,
    topic,
    sort,
  ]);

  // ============================================================
  // FETCH PAPERS
  // ============================================================

  const {
    papers,
    total,
    loading,
    error,
  } = usePapers(
    search,
    year,
    topic,
    sort,
    page,
    pageSize
  );

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  function clearFilters() {
    setSearch("");
    setYear("all");
    setTopic("all");
    setSort("newest");
    setPage(1);
  }

  // ============================================================
  // ACTIVE FILTERS
  // ============================================================

  const activeFilters = [];

  if (search.trim()) {
    activeFilters.push({
      type: "search",
      label: `"${search}"`,
    });
  }

  if (year !== "all") {
    activeFilters.push({
      type: "year",
      label: year,
    });
  }

  if (topic !== "all") {
    activeFilters.push({
      type: "topic",
      label: topic,
    });
  }

  const hasFilters =
    activeFilters.length > 0;

  // ============================================================
  // REMOVE INDIVIDUAL FILTER
  // ============================================================

  function removeFilter(type) {
    if (type === "search") {
      setSearch("");
    }

    if (type === "year") {
      setYear("all");
    }

    if (type === "topic") {
      setTopic("all");
    }

    setPage(1);
  }

  // ============================================================
  // RESULT RANGE
  // ============================================================

  const startResult =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endResult = Math.min(
    page * pageSize,
    total
  );

  // ============================================================
  // UI
  // ============================================================

  return (
    <Container>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="pb-7 pt-10 md:pb-8 md:pt-12">

        <div className="max-w-3xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">

            <BookOpen className="h-3.5 w-3.5 text-slate-600" />

            <span className="text-xs font-medium text-slate-600">
              Research Discovery
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Explore research papers
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Search, filter and discover research across
            computer vision, NLP, machine learning,
            robotics and data science.
          </p>

        </div>

      </section>

      {/* ======================================================
          SEARCH PANEL
      ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* SEARCH */}

        <div className="p-4 sm:p-5">

          <div className="relative">

            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <div className="[&_input]:h-12 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:pl-11 [&_input]:text-sm">

              <SearchBar
                value={search}
                onChange={setSearch}
              />

            </div>

          </div>

        </div>

        {/* FILTER ROW */}

        <div className="border-t border-slate-100 px-4 py-3 sm:px-5">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />

              </div>

              <div>

                <p className="text-xs font-semibold text-slate-800">
                  Filters
                </p>

                <p className="text-[11px] text-slate-400">
                  Narrow your results
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex flex-wrap items-center gap-2">

              {/* YEAR */}

              <div className="relative">

                <select
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  className="h-10 min-w-[125px] appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >

                  <option value="all">
                    All years
                  </option>

                  <option value="2026">
                    2026
                  </option>

                  <option value="2025">
                    2025
                  </option>

                  <option value="2024">
                    2024
                  </option>

                  <option value="2023">
                    2023
                  </option>

                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              </div>

              {/* TOPIC */}

              <div className="relative">

                <select
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  className="h-10 min-w-[205px] appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >

                  <option value="all">
                    All research areas
                  </option>

                  <option value="Computer Vision">
                    Computer Vision
                  </option>

                  <option value="Natural Language Processing">
                    Natural Language Processing
                  </option>

                  <option value="Machine Learning">
                    Machine Learning
                  </option>

                  <option value="Robotics">
                    Robotics
                  </option>

                  <option value="Data Science">
                    Data Science
                  </option>

                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              </div>

              {/* SORT */}

              <div className="relative">

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="h-10 min-w-[145px] appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >

                  <option value="newest">
                    Newest first
                  </option>

                  <option value="oldest">
                    Oldest first
                  </option>

                  <option value="citations">
                    Most cited
                  </option>

                  <option value="title">
                    Title A–Z
                  </option>

                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              </div>

              {/* CLEAR */}

              {hasFilters && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                >

                  <RotateCcw className="h-3.5 w-3.5" />

                  Clear

                </button>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          ACTIVE FILTERS
      ====================================================== */}

      {hasFilters && (

        <div className="mt-4 flex flex-wrap items-center gap-2">

          <span className="text-xs font-medium text-slate-400">
            Active:
          </span>

          {activeFilters.map((filter) => (

            <button
              key={filter.type}
              type="button"
              onClick={() =>
                removeFilter(filter.type)
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >

              {filter.label}

              <X className="h-3 w-3 text-slate-400" />

            </button>

          ))}

        </div>

      )}

      {/* ======================================================
          RESULTS
      ====================================================== */}

      <section className="py-8">

        {/* RESULT HEADER */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-base font-semibold text-slate-950">
                Research papers
              </h2>

              {!loading && (

                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  {total}
                </span>

              )}

            </div>

            {!loading && total > 0 && (

              <p className="mt-1 text-xs text-slate-400">
                Showing {startResult}–{endResult} of {total}
              </p>

            )}

          </div>

          {!loading && papers.length > 0 && (

            <p className="text-xs text-slate-400">
              Page {page}
            </p>

          )}

        </div>

        {/* LOADING */}

        {loading && <Loading />}

        {/* ERROR */}

        {!loading && error && (

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-sm font-semibold text-red-900">
                  Unable to load papers
                </h3>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {error}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-xl bg-red-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-800"
              >
                Try again
              </button>

            </div>

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          papers.length === 0 && (

            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <EmptyState />

              {hasFilters && (

                <div className="mt-4 flex justify-center">

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >

                    <RotateCcw className="h-3.5 w-3.5" />

                    Clear filters

                  </button>

                </div>

              )}

            </div>

          )}

        {/* PAPER GRID */}

        {!loading &&
          !error &&
          papers.length > 0 && (

            <>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {papers.map((paper) => (

                  <PaperCard
                    key={paper.id}
                    paper={paper}
                  />

                ))}

              </div>

              {/* PAGINATION */}

              {total > pageSize && (

                <div className="mt-10">

                  <Pagination
                    page={page}
                    setPage={setPage}
                    total={total}
                  />

                </div>

              )}

            </>

          )}

      </section>

    </Container>
  );
}