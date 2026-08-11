"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Copy,
  FileText,
  Quote,
  Share2,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

import usePaper from "@/hooks/usePaper";

import AISummary from "@/components/AISummary";
import AISimilarPapers from "@/components/AISimilarPapers";
import AIReviewers from "@/components/AIReviewers";

import Loading from "@/components/Loading";

export default function PaperPage() {
  const params = useParams();
  const paperId = params?.id;

  const {
    paper,
    loading,
    error,
  } = usePaper(paperId);

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !paper) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>

            <h1 className="mt-4 text-lg font-semibold text-slate-950">
              Paper not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || "Unable to load this paper."}
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to research
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     SAFE DATA
  ========================================================= */

  const title =
    paper.title?.trim() ||
    "Untitled research paper";

  const abstract =
    paper.abstract?.trim() ||
    "";

  const authors = Array.isArray(paper.authors)
    ? paper.authors
    : [];

  const topics = Array.isArray(paper.topics)
    ? paper.topics
    : [];

  const year =
    paper.publication_year || null;

  const citations =
    Number(paper.cited_by_count) || 0;

  const publicationDate =
    paper.publication_date || null;

  const doi =
    paper.doi?.trim() || null;

  /* =========================================================
     DATE
  ========================================================= */

  function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  /* =========================================================
     DOI
  ========================================================= */

  function getDoiUrl(value) {
    if (!value) return null;

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return `https://doi.org/${value.replace(
      /^doi:/i,
      ""
    )}`;
  }

  const doiUrl = getDoiUrl(doi);

  /* =========================================================
     COPY DOI
  ========================================================= */

  async function handleCopyDOI() {
    if (!doiUrl) return;

    try {
      await navigator.clipboard.writeText(doiUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy DOI:", err);
    }
  }

  /* =========================================================
     SHARE PAPER
  ========================================================= */

  async function handleShare() {
    const shareUrl =
      typeof window !== "undefined"
        ? window.location.href
        : "";

    const shareData = {
      title,
      text: `Research paper: ${title}`,
      url: shareUrl,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share(shareData);

        setShared(true);

        setTimeout(() => {
          setShared(false);
        }, 2000);

        return;
      }

      /* ---------------------------------------------
         Fallback: copy URL
      --------------------------------------------- */

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(shareUrl);

        setShared(true);

        setTimeout(() => {
          setShared(false);
        }, 2000);
      }
    } catch (err) {
      /*
       * User cancelling the native share dialog
       * is not an actual error.
       */
      if (err?.name !== "AbortError") {
        console.error(
          "Failed to share paper:",
          err
        );
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          PAGE CONTAINER
      ===================================================== */}

      <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-5 sm:px-6 lg:px-8">

        {/* ===================================================
            BACK
        =================================================== */}

        <div className="mb-5">

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />

            Back to Research
          </Link>

        </div>


        {/* ===================================================
            3 COLUMN LAYOUT
        =================================================== */}

        <div className="grid items-start gap-5 lg:grid-cols-12">


          {/* =================================================
              LEFT COLUMN
              Paper information
          ================================================= */}

          <aside className="min-w-0 lg:col-span-3">

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Header */}

              <div className="border-b border-slate-200 px-5 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950">
                    <FileText className="h-4 w-4 text-white" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold text-slate-950">
                      Research Paper
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Research Radar
                    </p>

                  </div>

                </div>

              </div>


              {/* Metadata */}

              <div className="divide-y divide-slate-100">

                <InfoRow
                  icon={CalendarDays}
                  label="Published"
                  value={
                    year
                      ? String(year)
                      : "Not available"
                  }
                />

                <InfoRow
                  icon={Quote}
                  label="Citations"
                  value={`${citations} ${
                    citations === 1
                      ? "citation"
                      : "citations"
                  }`}
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Publication date"
                  value={formatDate(publicationDate)}
                />

              </div>


              {/* Authors */}

              <div className="border-t border-slate-200 px-5 py-5">

                <div className="flex items-center gap-2">

                  <Users className="h-4 w-4 text-slate-500" />

                  <div>

                    <p className="text-xs font-semibold text-slate-900">
                      Authors
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {authors.length}{" "}
                      {authors.length === 1
                        ? "author"
                        : "authors"}
                    </p>

                  </div>

                </div>


                <div className="mt-4 space-y-2">

                  {authors.length > 0 ? (

                    authors.map((author) => (
                      <div
                        key={author.id}
                        className="rounded-lg bg-slate-50 px-3 py-2.5"
                      >
                        <p className="text-xs font-medium leading-5 text-slate-700">
                          {author.name}
                        </p>
                      </div>
                    ))

                  ) : (

                    <p className="text-xs text-slate-400">
                      No authors listed.
                    </p>

                  )}

                </div>

              </div>


              {/* Topics */}

              <div className="border-t border-slate-200 px-5 py-5">

                <div className="flex items-center gap-2">

                  <Tag className="h-4 w-4 text-slate-500" />

                  <div>

                    <p className="text-xs font-semibold text-slate-900">
                      Topics
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Research areas
                    </p>

                  </div>

                </div>


                <div className="mt-4 flex flex-wrap gap-1.5">

                  {topics.length > 0 ? (

                    topics.map((topic) => (
                      <span
                        key={topic.id}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600"
                      >
                        {topic.name}
                      </span>
                    ))

                  ) : (

                    <p className="text-xs text-slate-400">
                      No topics listed.
                    </p>

                  )}

                </div>

              </div>


              {/* DOI */}

              <div className="border-t border-slate-200 px-5 py-5">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    DOI
                  </p>

                  {doiUrl && (
                    <button
                      type="button"
                      onClick={handleCopyDOI}
                      title={
                        copied
                          ? "DOI copied"
                          : "Copy DOI"
                      }
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy DOI
                        </>
                      )}
                    </button>
                  )}

                </div>


                {doiUrl ? (

                  <a
                    href={doiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >

                    <span className="min-w-0 truncate">
                      {doi}
                    </span>

                    <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

                  </a>

                ) : (

                  <p className="mt-2 text-xs text-slate-400">
                    DOI not available.
                  </p>

                )}

              </div>


              {/* =================================================
                  SHARE
              ================================================= */}

              <div className="border-t border-slate-200 px-5 py-5">

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                >

                  {shared ? (
                    <>
                      <Check className="h-4 w-4" />
                      {navigator?.share
                        ? "Shared"
                        : "Link Copied"}
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share Paper
                    </>
                  )}

                </button>

              </div>

            </div>

          </aside>


          {/* =================================================
              CENTER COLUMN
              Paper
          ================================================= */}

          <section className="min-w-0 lg:col-span-6">

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Paper title */}

              <div className="p-5 sm:p-7">

                <div className="flex items-center gap-2">

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Research Paper
                  </span>

                </div>


                <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                  {title}
                </h1>


                {/* Compact metadata */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {year && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {year}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-500">
                    <Quote className="h-3.5 w-3.5" />
                    {citations} citations
                  </span>

                </div>

              </div>


              {/* Abstract */}

              <div className="border-t border-slate-200">

                <div className="flex items-center gap-3 px-5 py-4 sm:px-7">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <BookOpen className="h-4 w-4 text-slate-600" />
                  </div>

                  <div>

                    <h2 className="text-sm font-semibold text-slate-950">
                      Abstract
                    </h2>

                    <p className="text-[10px] text-slate-400">
                      Original paper abstract
                    </p>

                  </div>

                </div>


                <div className="border-t border-slate-100 p-5 sm:p-7">

                  {abstract ? (

                    <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700">
                      {abstract}
                    </p>

                  ) : (

                    <div className="rounded-xl bg-slate-50 p-6 text-center">

                      <FileText className="mx-auto h-6 w-6 text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Abstract not available
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        This paper does not contain an abstract
                        in the current research corpus.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>


            {/* Mobile AI */}

            <div className="mt-5 lg:hidden">

              <AIMobile
                paperId={paper.id}
              />

            </div>


            {/* Bottom note */}

            <div className="mt-5 px-1">

              <p className="text-[11px] leading-5 text-slate-400">
                Research metadata is provided from the
                Research Radar corpus. AI-generated content
                is intended to assist understanding and may
                simplify details from the original paper.
              </p>

            </div>

          </section>


          {/* =================================================
              RIGHT COLUMN
              AI
          ================================================= */}

          <aside className="min-w-0 lg:col-span-3">

            <div className="lg:sticky lg:top-5">

              <div className="flex max-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* AI Header */}

                <div className="shrink-0 border-b border-slate-200 px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h2 className="truncate text-sm font-semibold text-slate-950">
                          AI Research Assistant
                        </h2>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                          AI
                        </span>

                      </div>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Explore this paper
                      </p>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    ONLY AI AREA SCROLLS
                ================================================= */}

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

                  <div className="p-4">

                    <AIBlock
                      icon={Sparkles}
                      title="Summarize & Simplify"
                      description="Understand the research"
                    >
                      <AISummary
                        paperId={paper.id}
                      />
                    </AIBlock>


                    <AIBlock
                      icon={BookOpen}
                      title="Similar Papers"
                      description="Discover related research"
                    >
                      <AISimilarPapers
                        paperId={paper.id}
                      />
                    </AIBlock>


                    <AIBlock
                      icon={Users}
                      title="Reviewer Suggestions"
                      description="Find researchers with relevant expertise"
                      last
                    >
                      <AIReviewers
                        paperId={paper.id}
                      />
                    </AIBlock>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}


/* ============================================================
   INFO ROW
============================================================ */

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
          {value}
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   AI BLOCK
============================================================ */

function AIBlock({
  icon: Icon,
  title,
  description,
  children,
  last = false,
}) {
  return (
    <section
      className={
        last
          ? ""
          : "mb-5 border-b border-slate-200 pb-5"
      }
    >

      <div className="mb-3 flex items-center gap-2.5">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>

        <div className="min-w-0">

          <h3 className="text-xs font-semibold text-slate-900">
            {title}
          </h3>

          <p className="truncate text-[10px] text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <div className="min-w-0">
        {children}
      </div>

    </section>
  );
}


/* ============================================================
   MOBILE AI
============================================================ */

function AIMobile({
  paperId,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <div>

            <h2 className="text-sm font-semibold text-slate-950">
              AI Research Assistant
            </h2>

            <p className="text-[10px] text-slate-400">
              Explore this paper
            </p>

          </div>

        </div>

      </div>


      <div className="p-4">

        <AIBlock
          icon={Sparkles}
          title="Summarize & Simplify"
          description="Understand the research"
        >
          <AISummary paperId={paperId} />
        </AIBlock>


        <AIBlock
          icon={BookOpen}
          title="Similar Papers"
          description="Discover related research"
        >
          <AISimilarPapers paperId={paperId} />
        </AIBlock>


        <AIBlock
          icon={Users}
          title="Reviewer Suggestions"
          description="Find relevant researchers"
          last
        >
          <AIReviewers paperId={paperId} />
        </AIBlock>

      </div>

    </div>
  );
}