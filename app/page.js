"use client";

import { useState } from "react";
import Acord25Form from "./components/Acord25Form";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate(formData) {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">ACORD 25 Generator</h1>

      <Acord25Form onSubmit={generate} loading={loading} />

      {loading && (
        <div className="text-center text-gray-600 font-medium">
          Generating PDF, please wait…
        </div>
      )}

      {result && !loading && (
        <div className="text-center">
          <a
            href={result}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-semibold"
          >
            Open generated PDF
          </a>
        </div>
      )}
    </main>
  );
}
