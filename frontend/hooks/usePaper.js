"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function usePaper(id) {
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchPaper();
    }
  }, [id]);

  async function fetchPaper() {
    try {
      setLoading(true);

      const res = await api.get(`/papers/${id}`);

      setPaper(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch paper");
    } finally {
      setLoading(false);
    }
  }

  return {
    paper,
    loading,
    error,
  };
}