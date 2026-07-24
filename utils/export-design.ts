"use client";

/** Creates a printable, lightweight record until a production-grade renderer is connected. */
export function exportStudioSummary(format: "png" | "pdf", summary: string) {
  const blob = new Blob([summary], { type: format === "pdf" ? "application/pdf" : "text/plain" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `deep-digital-maquette.${format === "pdf" ? "pdf" : "txt"}`;
  link.click();
  URL.revokeObjectURL(href);
}
