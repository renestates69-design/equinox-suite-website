/**
 * The Fontologist — Canva App Entry Point
 * by Equinox Design
 *
 * Prerequisites:
 *   1. Register at https://www.canva.dev and create an app
 *   2. Run: npx @canva/cli init
 *   3. npm install && npm start
 */

import { useState } from "react";
import { queryFontologist, FontRecommendation } from "./fontologist-engine";
import "./styles/theme.css";

// NOTE: For Canva Marketplace, API calls go through a backend proxy
// (Cloudflare Worker) that holds the API key. Users never see a key input.

export function App() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("fontologist_key") || "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FontRecommendation[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [keySaved, setKeySaved] = useState(!!sessionStorage.getItem("fontologist_key"));

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
      setResults(fonts);
      setStatus(`${fonts.length} typefaces for \u201c${query}\u201d`);
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const applyFont = async (fontName: string) => {
    // Canva design API integration:
    // import { addNativeElement } from "@canva/design";
    // await addNativeElement({ type: "TEXT", children: [query], fontFamily: fontName });
    console.log("Apply font:", fontName);
  };

  return (
    <div className="fontologist-panel">
      <div className="fontologist-header">
        <img src="images/fontologist-logo.png" alt="The Fontologist" className="fontologist-icon" />
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
          placeholder="A word, a mood, a concept..."
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
          Find Fonts
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
            <button className="fontologist-apply-btn" onClick={() => applyFont(font.name)}>
              Apply to Design
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
