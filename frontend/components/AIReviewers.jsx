"use client";

import { useState } from "react";
import axios from "axios";

import {
  Users,
  Loader2,
  AlertCircle,
  RotateCcw,
  UserRound,
} from "lucide-react";

export default function AIReviewers({ paperId }) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  async function findReviewers() {
    if (!paperId || loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/papers/${paperId}/reviewers`
      );

      setReviewers(
        Array.isArray(response.data?.reviewers)
          ? response.data.reviewers
          : []
      );

      setLoaded(true);

    } catch (err) {
      console.error(
        "Reviewer suggestion error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to suggest reviewers."
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

            <Users className="h-4 w-4 text-slate-600" />

            <p className="mt-3 text-xs font-semibold text-slate-900">
              Find potential reviewers
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
              Find researchers with relevant expertise
              from the current research corpus.
            </p>

          </div>


          <button
            type="button"
            onClick={findReviewers}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-xs font-medium text-white hover:bg-slate-800"
          >

            <Users className="h-3.5 w-3.5" />

            Suggest Reviewers

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
                Finding researchers
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Checking research overlap...
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
                  Unable to suggest reviewers
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-700">
                  {error}
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={findReviewers}
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
        reviewers.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-5 text-center">

            <Users className="mx-auto h-5 w-5 text-slate-400" />

            <p className="mt-2 text-xs font-semibold text-slate-900">
              No reviewers found
            </p>

            <p className="mt-1 text-[10px] leading-4 text-slate-500">
              No researchers have enough relevant
              research overlap.
            </p>

          </div>
        )}


      {/* RESULTS */}

      {loaded &&
        !loading &&
        !error &&
        reviewers.length > 0 && (

          <div>

            <div className="mb-3">

              <p className="text-xs font-semibold text-slate-900">
                Potential reviewers
              </p>

              <p className="text-[10px] text-slate-400">
                Ranked by research overlap
              </p>

            </div>


            <div className="max-h-[380px] space-y-2.5 overflow-y-auto pr-1">

              {reviewers.map(
                (reviewer, index) => (

                  <div
                    key={reviewer.author_id}
                    className="rounded-xl border border-slate-200 p-3"
                  >

                    <div className="flex gap-2.5">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">

                        <UserRound className="h-3.5 w-3.5 text-slate-600" />

                      </div>


                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <p className="truncate text-xs font-semibold text-slate-900">
                              {reviewer.name}
                            </p>

                            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-400">
                              Candidate #{index + 1}
                            </p>

                          </div>


                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
                            {reviewer.score}
                          </span>

                        </div>


                        <p className="mt-2 text-[10px] leading-5 text-slate-500">
                          {reviewer.reason}
                        </p>


                        {reviewer.matched_topics?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">

                            {reviewer.matched_topics
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


                        <div className="mt-2 flex gap-3 text-[9px] text-slate-400">

                          <span>
                            {reviewer.topic_overlap_count} topics
                          </span>

                          <span>
                            {reviewer.relevant_paper_count} papers
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>


            <button
              type="button"
              onClick={findReviewers}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >

              <RotateCcw className="h-3.5 w-3.5" />

              Refresh suggestions

            </button>

          </div>
        )}

    </div>
  );
}