"use client";

import { Button, useField } from "@payloadcms/ui";
import { useState } from "react";

import {
  EMPTY_ERROR,
  FAILURE_ERROR,
  IMPORT_BUTTON_LABEL,
  IMPORTING_LABEL,
  PANEL_LABEL,
  REPLACE_WARNING,
  SUCCESS_MESSAGE,
  TEXTAREA_LABEL,
} from "./constants";

// A "ui" field rendered above mainArticleContent in the admin — pastes HTML
// through POST /api/articles/import-html (sanitize -> convert -> upload
// images) and replaces mainArticleContent's value with the result. See
// src/collections/endpoints/importArticleHtml.ts for the actual pipeline;
// this component is just the paste box + wiring the response into the form.
export const HtmlImportPanel = () => {
  const { setValue } = useField({ path: "mainArticleContent" });
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleImport = async () => {
    if (!html.trim()) {
      setStatus("error");
      setErrorMessage(EMPTY_ERROR);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/articles/import-html", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(FAILURE_ERROR);
        return;
      }

      const { content } = (await response.json()) as { content: unknown };
      setValue(content);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(FAILURE_ERROR);
    }
  };

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>{PANEL_LABEL}</h3>
      <p style={{ fontSize: "0.8rem", opacity: 0.75, marginBottom: "0.5rem" }}>
        {REPLACE_WARNING}
      </p>
      <textarea
        aria-label={TEXTAREA_LABEL}
        value={html}
        onChange={(event) => setHtml(event.target.value)}
        rows={8}
        style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }}
      />
      <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Button
          onClick={handleImport}
          disabled={status === "loading"}
          buttonStyle="secondary"
          size="small"
        >
          {status === "loading" ? IMPORTING_LABEL : IMPORT_BUTTON_LABEL}
        </Button>
        {status === "success" ? <span>{SUCCESS_MESSAGE}</span> : null}
        {status === "error" ? <span style={{ color: "#c0392b" }}>{errorMessage}</span> : null}
      </div>
    </div>
  );
};
