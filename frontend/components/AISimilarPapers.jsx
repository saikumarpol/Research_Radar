"use client";

import { useState } from "react";
import axios from "axios";

import {
  Search,
  Loader2,
  AlertCircle,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";

export default function AISimilarPapers({
  paperId,
}) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  async function findSimilarPapers() {
    if (!paperId || loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/papers/${paperId}/similar`
      );

      setPapers(
        Array.isArray(
          response.data?.similar_papers
        )
          ? response.data.similar_papers
          : []
      );

      setLoaded(true);

    } catch (err) {
      console.error(
        "Similar papers error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to find similar papers."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      {/* INITIAL */}

      {!loaded && !loading && !error && (
        <div>

          <div className="rounded-xl bg-slate-50 p-4">

            <Search className="h-4 w-4 text-slate-600" />

            <p className="mt-3 text-xs font-semibold text-slate-900">
              Explore related research
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
              Find papers that are closely related
              to this research.
            </p>

          </div>


          <button
            type="button"
            onClick={findSimilarPapers}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-xs font-medium text-white hover:bg-slate-800"
          >

            <Search className="h-3.5 w-3.5" />

            Find Similar Papers

          </button>

        </div>
      )}


      {/* LOADING */}

      {loading && (
        <div className="rounded-xl bg-slate-50 p-4">

          <div className="flex items-center gap-2.5">

            <Loader2 className="h-4 w-4 animate-spin text-slate-700" />

            <div>

              <p className="text-xs font-semibold text-slate-900">
                Finding related papers
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Comparing papers in the corpus...
              </p>

            </div>

          </div>


          <div className="mt-4 space-y-2">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-slate-200"
              />
            ))}

          </div>

        </div>
      )}


      {/* ERROR */}

      {error && !loading && (
        <div>

          <div className="rounded-xl border border-red-100 bg-red-50 p-3.5">

            <div className="flex gap-2.5">

              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

              <div>

                <p className="text-xs font-semibold text-red-900">
                  Unable to find similar papers
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-700">
                  {error}
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={findSimilarPapers}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >

            <RotateCcw className="h-3.5 w-3.5" />

            Try again

          </button>

        </div>
      )}


      {/* EMPTY */}

      {loaded &&
        !loading &&
        !error &&
        papers.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-5 text-center">

            <Search className="mx-auto h-5 w-5 text-slate-400" />

            <p className="mt-2 text-xs font-semibold text-slate-900">
              No similar papers found
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              There aren't enough related papers
              in the current corpus.
            </p>

          </div>
        )}


      {/* RESULTS */}

      {loaded &&
        !loading &&
        !error &&
        papers.length > 0 && (

          <div>

            <div className="mb-3">

              <p className="text-xs font-semibold text-slate-900">
                Related research
              </p>

              <p className="text-[10px] text-slate-400">
                Top {papers.length} matches
              </p>

            </div>


            <div className="max-h-[380px] space-y-2.5 overflow-y-auto pr-1">

              {papers.map(
                (paper, index) => (

                  <Link
                    key={paper.id}
                    href={`/papers/${paper.id}`}
                    className="group block rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                  >

                    <div className="flex gap-2.5">

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-500">
                        {index + 1}
                      </div>


                      <div className="min-w-0 flex-1">

                        <div className="flex items-start gap-2">

                          <h3 className="line-clamp-2 flex-1 text-xs font-medium leading-5 text-slate-900">
                            {paper.title}
                          </h3>

                          <ArrowUpRight className="h-3 w-3 shrink-0 text-slate-300 transition group-hover:text-slate-600" />

                        </div>


                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-slate-400">

                          {paper.publication_year && (
                            <span>
                              {paper.publication_year}
                            </span>
                          )}

                          <span>
                            {paper.cited_by_count || 0} citations
                          </span>

                          {typeof paper.similarity_score ===
                            "number" && (
                            <span className="font-medium text-slate-600">
                              {(
                                paper.similarity_score * 100
                              ).toFixed(1)}
                              % match
                            </span>
                          )}

                        </div>


                        {paper.matched_topics?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">

                            {paper.matched_topics
                              .slice(0, 3)
                              .map((topic) => (

                                <span
                                  key={topic}
                                  className="rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-500"
                                >
                                  {topic}
                                </span>

                              ))}

                          </div>
                        )}

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>


            <button
              type="button"
              onClick={findSimilarPapers}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >

              <RotateCcw className="h-3.5 w-3.5" />

              Refresh results

            </button>

          </div>
        )}

    </div>
  );
}