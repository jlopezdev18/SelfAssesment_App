/**
 * Utility functions for formatting data
 */

/**
 * Formats bytes into human-readable file size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Formats Firebase timestamp to readable date string
 */
export function formatFirebaseDate(
  dateObj: { _seconds: number; _nanoseconds: number } | undefined
): string {
  if (!dateObj || !dateObj._seconds) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return new Date(dateObj._seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats current date to YYYY-MM-DD HH:MM format
 */
export function formatCurrentDateTime(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")} ${String(
    today.getHours()
  ).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
}

/**
 * Converts bare URLs in text/HTML into anchor tags
 */
export function linkify(input: string): string {
  if (!input) return input;
  // if already has anchors, keep as is
  if (/<a\b[^>]*>/i.test(input)) return input;
  const urlRE = /(https?:\/\/[^\s<>"')]+)|(www\.[^\s<>"')]+)/gi;
  return input.replace(urlRE, (m) => {
    const href = m.startsWith("http") ? m : `https://${m}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${m}</a>`;
  });
}

/**
 * Normalizes URL by adding protocol if missing
 */
export function normalizeUrl(url: string): string {
  const s = url.trim();
  if (!s) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s;
  return `https://${s}`;
}
