import sanitizeHtml from "sanitize-html";

function withInlineStyle(html: string, tag: string, style: string) {
  return html.replace(new RegExp(`<${tag}([^>]*)>`, "gi"), (m, attrs) => {
    const styleAttr = attrs.match(/\sstyle\s*=\s*"(.*?)"/i)?.[1];
    if (styleAttr) {
      return `<${tag}${attrs.replace(/style\s*=\s*"(.*?)"/i, (_s: any, s: any) => ` style="${s}; ${style}"`)}>`;
    }
    return `<${tag}${attrs} style="${style}">`;
  });
}

export function formatRteHtmlForEmail(rawHtml: string): string {
  if (!rawHtml) return "";

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(rawHtml);
  const toParagraphs = (txt: string) =>
    txt.split(/\n{2,}/g).map(p => `<p style="margin:16px 0; color:#111827; line-height:1.6;">${p.trim().replace(/\n/g, "<br/>")}</p>`).join("");

  const sanitized = isHtml
    ? sanitizeHtml(rawHtml, {
        allowedTags: ["a","p","br","strong","em","u","h1","h2","h3","h4","h5","h6","ul","ol","li","blockquote","code","pre","span","div"],
        allowedAttributes: { a: ["href","target","rel"], span: ["style"], div: ["style"], p: ["style"] },
        transformTags: {
          a: (tagName: string, attribs: sanitizeHtml.Attributes) => ({
            tagName: "a",
            attribs: {
              ...attribs,
              href: attribs.href || "#",
              target: "_blank",
              rel: "noopener noreferrer nofollow",
              style: "color:#2563eb; text-decoration:underline;"
            }
          })
        }
      })
    : toParagraphs(rawHtml);

  let html = sanitized;
  ["p","li"].forEach(t => { html = withInlineStyle(html, t, "color:#111827; line-height:1.6;"); });
  ["h1","h2","h3","h4","h5","h6"].forEach(h => { html = withInlineStyle(html, h, "color:#111827; margin:0 0 12px;"); });
  html = withInlineStyle(html, "blockquote", "color:#6b7280; border-left:3px solid #e5e7eb; padding-left:12px; margin:8px 0;");
  html = withInlineStyle(html, "ul", "list-style:disc; padding-left:24px; margin:0 0 12px;");
  html = withInlineStyle(html, "ol", "list-style:decimal; padding-left:24px; margin:0 0 12px;");
  html = withInlineStyle(html, "a", "color:#2563eb; text-decoration:underline;");

  return `<div style="color:#111827; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">${html}</div>`;
}