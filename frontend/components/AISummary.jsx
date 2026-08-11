"use client";

import { useState } from "react";
import axios from "axios";

import {
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Check,
} from "lucide-react";

export default function AISummary({ paperId }) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateSummary() {
    if (!paperId || loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/ai/summarize/${paperId}`
      );

      setSummary(response.data?.summary || "");

    } catch (err) {
      console.error("AI summary error:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to generate the summary."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>

      {/* INITIAL */}

      {!summary && !loading && !error && (
        <div>

          <div className="rounded-xl bg-slate-50 p-4">

            <Sparkles className="h-4 w-4 text-slate-600" />

            <p className="mt-3 text-xs font-semibold text-slate-900">
              Understand this paper
            </p>

            <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
              Get a concise explanation of the research
              in plain language.
            </p>

          </div>


          <button
            type="button"
            onClick={generateSummary}
            className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-xs font-medium text-white transition hover:bg-slate-800 active:scale-[0.99]"
          >

            <Sparkles className="h-3.5 w-3.5" />

            Summarize & Simplify

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />

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
                Reading the paper
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Creating a plain-language explanation...
              </p>

            </div>

          </div>


          <div className="mt-4 space-y-2">

            {[100, 90, 80, 65].map((width) => (
              <div
                key={width}
                style={{ width: `${width}%` }}
                className="h-2.5 animate-pulse rounded-full bg-slate-200"
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

              <div className="min-w-0">

                <p className="text-xs font-semibold text-red-900">
                  Unable to generate summary
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-700">
                  {error}
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={generateSummary}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>

        </div>
      )}


      {/* RESULT */}

      {summary && !loading && (
        <div>

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-900">
                Plain-language summary
              </p>

              <p className="text-[10px] text-slate-400">
                AI generated
              </p>

            </div>

          </div>


          <div className="mt-3 max-h-[300px] overflow-y-auto rounded-xl bg-slate-50 p-4">

            <p className="text-xs leading-6 text-slate-700">
              {summary}
            </p>

          </div>


          <p className="mt-2 text-[10px] leading-4 text-slate-400">
            Generated from the paper abstract. It may
            simplify or omit details from the full paper.
          </p>


          <button
            type="button"
            onClick={generateSummary}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >

            <RotateCcw className="h-3.5 w-3.5" />

            Generate again

          </button>

        </div>
      )}

    </div>
  );
}