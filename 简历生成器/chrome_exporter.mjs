import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const playwrightPath =
  "/Users/lwc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const [format, inputPath, outputPath] = process.argv.slice(2);

if (!["pdf", "png"].includes(format) || !inputPath || !outputPath) {
  throw new Error("Usage: chrome_exporter.mjs <pdf|png> <input.json> <output>");
}

const data = JSON.parse(await fs.readFile(inputPath, "utf8"));

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSections(sections) {
  return sections
    .map((section) => {
      if (section.type === "text") {
        return `
          <section class="section">
            <h2>${escapeHtml(section.title)}</h2>
            <div class="body-text">${escapeHtml(section.items?.[0]?.text || "")}</div>
          </section>
        `;
      }

      const items = (section.items || [])
        .map((item) => {
          const bullets = (item.bullets || [])
            .filter(Boolean)
            .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
            .join("");
          return `
            <article class="item">
              <div class="item-heading">
                <div>
                  <strong>${escapeHtml(item.title)}</strong>
                  ${item.subtitle ? `<span>${escapeHtml(item.subtitle)}</span>` : ""}
                </div>
                ${item.meta ? `<time>${escapeHtml(item.meta)}</time>` : ""}
              </div>
              ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
              ${bullets ? `<ul>${bullets}</ul>` : ""}
            </article>
          `;
        })
        .join("");

      return `
        <section class="section">
          <h2>${escapeHtml(section.title)}</h2>
          ${items}
        </section>
      `;
    })
    .join("");
}

function renderDocument(resume) {
  const personal = resume.personal || {};
  const theme = resume.theme || {};
  const accent = /^#[0-9a-f]{6}$/i.test(theme.accent || "") ? theme.accent : "#1f4e79";
  const scale = Math.max(0.9, Math.min(1.2, Number(theme.fontScale) || 1));
  const contacts = [
    personal.school,
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<span class=\"separator\">|</span>");

  return `<!doctype html>
  <html lang="zh-CN">
    <head>
      <meta charset="utf-8">
      <style>
        @page { size: A4; margin: 0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #eef2f7; }
        body {
          font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
          color: #18202b;
          font-size: ${14 * scale}px;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .sheet {
          position: relative;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 18mm 17mm 18mm 23mm;
          background: white;
          overflow: hidden;
        }
        .sheet::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 8mm;
          background: ${accent};
        }
        header { margin-bottom: 8mm; }
        h1 {
          margin: 0 0 2mm;
          font-size: ${34 * scale}px;
          line-height: 1.08;
          letter-spacing: .02em;
        }
        .tagline { color: ${accent}; font-size: ${16 * scale}px; margin-bottom: 3mm; }
        .contacts { color: #667085; line-height: 1.7; overflow-wrap: anywhere; }
        .separator { margin: 0 2mm; color: #a0a8b4; }
        .section { margin-top: 6mm; break-inside: avoid; }
        .section h2 {
          margin: 0 0 3mm;
          padding-bottom: 1.6mm;
          border-bottom: .6mm solid ${accent};
          color: ${accent};
          font-size: ${16 * scale}px;
          letter-spacing: .08em;
        }
        .item { margin: 0 0 4mm; break-inside: avoid; }
        .item-heading {
          display: flex;
          justify-content: space-between;
          gap: 6mm;
          align-items: baseline;
        }
        .item-heading strong { font-size: ${15 * scale}px; }
        .item-heading span { margin-left: 3mm; color: #475467; }
        time { color: ${accent}; white-space: nowrap; }
        p, ul { margin: 1.5mm 0 0; line-height: 1.65; color: #344054; }
        ul { padding-left: 5mm; }
        .body-text { white-space: pre-wrap; line-height: 1.75; color: #344054; }
        ${resume.templateId === "editorial" ? `
          .sheet { background: linear-gradient(180deg, #fffdfa, #fff8f1); }
          .sheet::before { width: 4mm; }
        ` : ""}
        ${resume.templateId === "jade" ? `
          .sheet { padding-left: 17mm; border-top: 3mm solid ${accent}; }
          .sheet::before { display: none; }
          .section h2 { border-bottom-style: dashed; }
        ` : ""}
      </style>
    </head>
    <body>
      <main class="sheet">
        <header>
          <h1>${escapeHtml(personal.name || "你的姓名")}</h1>
          ${personal.tagline ? `<div class="tagline">${escapeHtml(personal.tagline)}</div>` : ""}
          ${contacts ? `<div class="contacts">${contacts}</div>` : ""}
        </header>
        ${renderSections(resume.sections || [])}
      </main>
    </body>
  </html>`;
}

let browser;
try {
  browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--disable-gpu", "--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.setContent(renderDocument(data), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  if (format === "pdf") {
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } else {
    await page.locator(".sheet").screenshot({
      path: outputPath,
      type: "png",
      animations: "disabled",
    });
  }
} finally {
  await browser?.close();
}
