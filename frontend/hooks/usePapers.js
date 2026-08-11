"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export default function usePapers(
  search = "",
  year = "all",
  topic = "all",
  sort = "newest",
  page = 1,
  pageSize = 9
) {
  const [papers, setPapers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Prevent older requests from overwriting
   * newer requests.
   */
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId =
      ++requestIdRef.current;

    const controller =
      new AbortController();

    /*
     * Search gets a small debounce.
     * Filters execute immediately.
     */
    const delay =
      search.trim().length > 0
        ? 350
        : 0;

    const timer = setTimeout(
      async () => {
        try {
          setLoading(true);
          setError("");

          /*
           * ==================================================
           * API PARAMETERS
           * ==================================================
           */

          const params = {
            page,
            page_size: pageSize,
          };

          /*
           * Search
           */
          if (search.trim()) {
            params.search =
              search.trim();
          }

          /*
           * Year
           */
          if (
            year &&
            year !== "all"
          ) {
            params.year =
              Number(year);
          }

          /*
           * Topic
           */
          if (
            topic &&
            topic !== "all"
          ) {
            params.topic =
              topic;
          }

          /*
           * Sort
           */
          if (sort) {
            params.sort = sort;
          }

          /*
           * ==================================================
           * API REQUEST
           * ==================================================
           */

          const response =
            await axios.get(
              `${API_URL}/papers/`,
              {
                params,
                signal:
                  controller.signal,
              }
            );

          /*
           * Ignore stale requests
           */
          if (
            requestId !==
            requestIdRef.current
          ) {
            return;
          }

          const data =
            response.data || {};

          console.log(
            "Papers API response:",
            data
          );

          /*
           * ==================================================
           * IMPORTANT
           * ==================================================
           *
           * Backend response:
           *
           * {
           *   items: [...],
           *   total: 400
           * }
           *
           * NOT:
           *
           * data.data
           *
           * ==================================================
           */

          const items =
            Array.isArray(data.items)
              ? data.items
              : [];

          setPapers(items);

          /*
           * Total papers
           */
          setTotal(
            Number(data.total) || 0
          );

        } catch (err) {
          /*
           * Request cancelled because
           * another request started.
           */
          if (
            err?.code ===
              "ERR_CANCELED" ||
            err?.name ===
              "CanceledError"
          ) {
            return;
          }

          /*
           * Ignore stale request errors.
           */
          if (
            requestId !==
            requestIdRef.current
          ) {
            return;
          }

          console.error(
            "Failed to fetch papers:",
            err
          );

          setPapers([]);
          setTotal(0);

          setError(
            err?.response?.data
              ?.detail ||
              err?.response?.data
                ?.message ||
              "Unable to load research papers. Please try again."
          );

        } finally {
          /*
           * Only the newest request
           * controls loading state.
           */
          if (
            requestId ===
            requestIdRef.current
          ) {
            setLoading(false);
          }
        }
      },
      delay
    );

    /*
     * Cleanup
     */
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    search,
    year,
    topic,
    sort,
    page,
    pageSize,
  ]);

  return {
    papers,
    total,
    loading,
    error,
  };
}