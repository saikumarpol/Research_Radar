"use client";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Users,
  Quote,
} from "lucide-react";

export default function PaperCard({ paper }) {
  if (!paper) return null;

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
    paper.publication_year ||
    null;

  const citations =
    Number(paper.cited_by_count) || 0;

  const abstractPreview =
    abstract.length > 240
      ? `${abstract.slice(0, 240).trim()}…`
      : abstract;

  const visibleAuthors =
    authors.slice(0, 2);

  const remainingAuthors =
    Math.max(authors.length - 2, 0);

  const visibleTopics =
    topics.slice(0, 3);

  const remainingTopics =
    Math.max(topics.length - 3, 0);

  const paperLink =
    `/papers/${paper.id}`;

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-slate-700
        dark:hover:shadow-black/20
      "
    >

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-5">

        {/* TITLE */}

        <Link
          href={paperLink}
          className="block"
        >
          <h2
            className="
              line-clamp-3
              text-[17px]
              font-semibold
              leading-7
              tracking-tight
              text-slate-950
              transition

              group-hover:text-blue-600

              dark:text-slate-100
              dark:group-hover:text-blue-400
            "
          >
            {title}
          </h2>
        </Link>


        {/* ABSTRACT */}

        <div className="mt-4">

          {abstractPreview ? (
            <p
              className="
                line-clamp-4
                text-sm
                leading-6
                text-slate-500

                dark:text-slate-400
              "
            >
              {abstractPreview}
            </p>
          ) : (
            <p
              className="
                text-sm
                italic
                leading-6
                text-slate-400

                dark:text-slate-500
              "
            >
              Abstract not available.
            </p>
          )}

        </div>


        {/* AUTHORS */}

        <div className="mt-5">

          <div className="mb-2 flex items-center gap-2">

            <Users
              className="
                h-4
                w-4
                text-slate-500

                dark:text-slate-400
              "
            />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500

                dark:text-slate-400
              "
            >
              Authors
            </span>

          </div>


          {authors.length > 0 ? (

            <div className="flex flex-wrap gap-1.5">

              {visibleAuthors.map(
                (author, index) => (

                  <span
                    key={
                      author.id ??
                      `${author.name}-${index}`
                    }
                    className="
                      max-w-full
                      truncate
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium

                      border-slate-200
                      bg-slate-50
                      text-slate-600

                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-slate-300
                    "
                  >
                    {author.name}
                  </span>

                )
              )}

              {remainingAuthors > 0 && (
                <span
                  className="
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium

                    border-slate-200
                    bg-white
                    text-slate-400

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-slate-500
                  "
                >
                  +{remainingAuthors} more
                </span>
              )}

            </div>

          ) : (

            <p
              className="
                text-xs
                text-slate-400

                dark:text-slate-500
              "
            >
              No authors listed
            </p>

          )}

        </div>


        {/* TOPICS */}

        <div className="mt-4">

          <div className="mb-2 flex items-center gap-2">

            <BookOpen
              className="
                h-4
                w-4
                text-slate-500

                dark:text-slate-400
              "
            />

            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500

                dark:text-slate-400
              "
            >
              Topics
            </span>

          </div>


          {topics.length > 0 ? (

            <div className="flex flex-wrap gap-1.5">

              {visibleTopics.map(
                (topic, index) => (

                  <span
                    key={
                      topic.id ??
                      `${topic.name}-${index}`
                    }
                    className="
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium

                      border-slate-200
                      bg-white
                      text-slate-600

                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-slate-300
                    "
                  >
                    {topic.name}
                  </span>

                )
              )}

              {remainingTopics > 0 && (
                <span
                  className="
                    rounded-full
                    border
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium

                    border-slate-200
                    bg-white
                    text-slate-400

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-slate-500
                  "
                >
                  +{remainingTopics} more
                </span>
              )}

            </div>

          ) : (

            <p
              className="
                text-xs
                text-slate-400

                dark:text-slate-500
              "
            >
              No topics listed
            </p>

          )}

        </div>

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div
        className="
          border-t
          border-slate-100
          bg-slate-50/70

          dark:border-slate-800
          dark:bg-slate-950
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            px-5
            py-3.5
          "
        >

          {/* META */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >

            {year && (
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs

                  text-slate-500

                  dark:text-slate-400
                "
              >
                <CalendarDays className="h-3.5 w-3.5" />

                <span>
                  {year}
                </span>
              </div>
            )}


            <span
              className="
                h-1
                w-1
                shrink-0
                rounded-full

                bg-slate-300

                dark:bg-slate-700
              "
            />


            <div
              className="
                flex
                items-center
                gap-1.5
                text-xs

                text-slate-500

                dark:text-slate-400
              "
            >
              <Quote className="h-3.5 w-3.5" />

              <span>
                {citations}{" "}
                {citations === 1
                  ? "citation"
                  : "citations"}
              </span>
            </div>

          </div>


          {/* VIEW PAPER */}

          <Link
            href={paperLink}
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              text-xs
              font-semibold

              text-blue-600
              transition-colors
              hover:text-blue-700

              dark:text-blue-400
              dark:hover:text-blue-300
            "
          >
            View paper

            <ArrowRight
              className="
                h-3.5
                w-3.5
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          </Link>

        </div>

      </div>

    </article>
  );
}