/**
 * The Fontologist — Canva App
 * by Equinox Design
 */

import { useState } from "react";
import { Button, Rows, Text, TextInput, Title, Columns, Box } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { useFeatureSupport } from "@canva/app-hooks";
import { queryFontologist, FontRecommendation } from "./fontologist-engine";
import "./styles/theme.css";

export function App() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("fontologist_key") || "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FontRecommendation[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [keySaved, setKeySaved] = useState(!!sessionStorage.getItem("fontologist_key"));
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const isSupported = useFeatureSupport();

  const saveKey = () => {
    if (!apiKey.trim()) return;
    sessionStorage.setItem("fontologist_key", apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleQuery = async () => {
    const key = sessionStorage.getItem("fontologist_key");
    if (!key) {
      setStatus("Enter your API key first");
      return;
    }
    if (!query.trim()) return;

    setLoading(true);
    setStatus("Reading the meaning\u2026");
    setResults([]);

    try {
      const fonts = await queryFontologist(key, query.trim());
      // Load Google Fonts for preview
      const families = fonts.map((f) => f.name.replace(/ /g, "+")).join("&family=");
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
      document.head.appendChild(link);

      setResults(fonts);
      setStatus(`${fonts.length} typefaces for \u201c${query}\u201d`);
    } catch (err: any) {
      const msg = err?.name === "AbortError"
        ? "Request timed out. Try again."
        : err?.message || "Something went wrong.";
      setStatus(msg);
    } finally {
      setLoading(false);
    }
  };

  const applyFont = async (font: FontRecommendation) => {
    try {
      if (isSupported(addElementAtCursor)) {
        await addElementAtCursor({
          type: "text",
          children: [query || font.name],
          fontWeight: "normal",
          fontStyle: "normal",
          decoration: "none",
          textAlign: "start",
        });
      } else {
        await addElementAtPoint({
          type: "text",
          children: [query || font.name],
          top: 100,
          left: 100,
          width: 400,
          fontWeight: "normal",
          fontStyle: "normal",
          decoration: "none",
          textAlign: "start",
        });
      }
    } catch (err: any) {
      setStatus("Could not add to design: " + (err?.message || "unknown error"));
    }
  };

  return (
    <div className="fontologist-panel">
      <div className="fontologist-header">
        <h2>The <em>Fontologist</em></h2>
        <p>Describe your vision. Get the perfect typeface.</p>
      </div>

      {/* API Key */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API key"
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "8px 10px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 11,
            color: "#e0e5ed",
            outline: "none",
          }}
        />
        <button
          className="fontologist-apply-btn"
          style={{ width: "auto", padding: "8px 14px", marginTop: 0 }}
          onClick={saveKey}
        >
          {keySaved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuery()}
          placeholder="A word, a mood, a concept\u2026"
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.25)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "10px 12px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: "#f0f2f6",
            outline: "none",
          }}
        />
        <button
          className="fontologist-apply-btn"
          style={{ width: "auto", padding: "10px 18px", marginTop: 0 }}
          onClick={handleQuery}
          disabled={loading}
        >
          {loading ? "..." : "Find Fonts"}
        </button>
      </div>

      {status && (
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 12 }}>
          {status}
        </p>
      )}

      {results.map((font, i) => (
        <div key={i} className="fontologist-card">
          <div className="fontologist-card-specimen">
            <div className="word" style={{ fontFamily: `'${font.name}', sans-serif` }}>
              {query}
            </div>
          </div>
          <div className="fontologist-card-body">
            <div className="fontologist-card-name">{font.name}</div>
            <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 8 }}>
              {font.rationale}
            </p>
            <div>
              {font.qualities.map((q) => (
                <span key={q} className="fontologist-pill">{q}</span>
              ))}
            </div>

            {/* Expandable match detail */}
            <div
              style={{ cursor: "pointer", marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}
              onClick={() => setExpandedCard(expandedCard === i ? null : i)}
            >
              {expandedCard === i ? "\u25B2" : "\u25BC"} Match detail
            </div>
            {expandedCard === i && (
              <div style={{ marginTop: 6 }}>
                {Object.entries(font.match_strength).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", width: 70, textTransform: "uppercase", letterSpacing: "0.05em" }}>{key}</span>
                    <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                      <div style={{ width: `${val}%`, height: "100%", background: "rgba(255,255,255,0.25)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", width: 20, textAlign: "right" }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="fontologist-apply-btn" onClick={() => applyFont(font)}>
              Apply to Design
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
