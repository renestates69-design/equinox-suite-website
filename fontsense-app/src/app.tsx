/**
 * FontSense — Canva App Entry Point
 *
 * This is the main component rendered inside Canva's side panel.
 * It uses the shared FontSense engine and Equinox Suite styling.
 *
 * Prerequisites:
 *   1. Register at https://www.canva.dev and create an app
 *   2. Run: npx @canva/cli init (to get your App ID wired up)
 *   3. npm install && npm start
 *
 * The Canva Apps SDK will inject the panel rendering context.
 */

import { useState } from "react";
import { queryFontSense, FontRecommendation } from "./fontsense-engine";
import "./styles/theme.css";

// NOTE: In production, the API call should go through a backend proxy.
// Canva Apps run in a sandboxed iframe — direct API calls may be blocked
// depending on Canva's CSP. For the marketplace version, set up a small
// serverless function (Cloudflare Worker or similar) that holds the API key
// and proxies requests.

export function App() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("fontsense_key") || "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FontRecommendation[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [keySaved, setKeySaved] = useState(!!sessionStorage.getItem("fontsense_key"));

  const saveKey = () => {
    if (!apiKey.trim()) return;
    sessionStorage.setItem("fontsense_key", apiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleQuery = async () => {
    const key = sessionStorage.getItem("fontsense_key");
    if (!key) {
      setStatus("Save your API key first");
      return;
    }
    if (!query.trim()) return;

    setLoading(true);
    setStatus("Scoring across 37 attributes\u2026");
    setResults([]);

    try {
      const fonts = await queryFontSense(key, query.trim());
      setResults(fonts);
      setStatus(`${fonts.length} recommendations for \u201c${query}\u201d`);
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
    //
    // Or to change the selected element's font:
    // import { editContent } from "@canva/design";
    // await editContent({ fontFamily: fontName });
    //
    // This requires the app to declare the "design:content:write" permission
    // in the Canva Developer Portal.
    console.log("Apply font:", fontName);
  };

  return (
    <div className="fontsense-panel">
      <div className="fontsense-header">
        <h2>FontSense</h2>
        <p>Semantic Typography Engine</p>
      </div>

      {/* API Key */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Anthropic API key"
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
          className="fontsense-apply-btn"
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
          placeholder="Enter a word or phrase..."
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
          className="fontsense-apply-btn"
          style={{ width: "auto", padding: "10px 18px", marginTop: 0 }}
          onClick={handleQuery}
          disabled={loading}
        >
          Sense
        </button>
      </div>

      {/* Status */}
      {status && (
        <p
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {status}
        </p>
      )}

      {/* Results */}
      {results.map((font, i) => (
        <div key={i} className="fontsense-card">
          <div className="fontsense-card-specimen">
            <div className="word" style={{ fontFamily: `'${font.name}', sans-serif` }}>
              {query}
            </div>
          </div>
          <div className="fontsense-card-body">
            <div className="fontsense-card-name">{font.name}</div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              {font.rationale}
            </p>
            <div>
              {font.dominant_attributes.map((attr) => (
                <span key={attr} className="fontsense-pill">
                  {attr}
                </span>
              ))}
            </div>
            <button className="fontsense-apply-btn" onClick={() => applyFont(font.name)}>
              Apply to Design
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
