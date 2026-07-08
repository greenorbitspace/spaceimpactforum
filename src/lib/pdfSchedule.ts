// src/lib/pdfSchedule.ts
//
// Generates a branded, multi-page A4 PDF of the full schedule using pdf-lib
// (pure JS, no headless browser needed — works in any Node/Astro build).
// Colours and fonts are pulled from the site's actual public/styles/global.css
// (--background-color, --accent-color, --contrast-color, and the per-track
// badge colours) so the PDF matches the live site rather than an assumed palette.

import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";

const FONTS_DIR = path.join(process.cwd(), "src/assets/fonts/pdf");

// ---- Brand palette, taken directly from public/styles/global.css ----------
const COLOR = {
  background: hex("#2f2f3f"), // --background-color (dark navy-grey header/footer band)
  accent: hex("#4dd9e0"), // --accent-color (teal)
  contrast: hex("#fbfdfd"), // --contrast-color (near-white)
  bodyText: hex("#2f2f3f"), // dark text on white page body
  mutedText: hex("#6b6b78"),
  hairline: hex("#e3e3e8"),
};

// Track badge colours, matching .track.<id> rules in global.css
const TRACK_COLORS: Record<string, string> = {
  keynote: "#ff6b6b",
  panel: "#977dd8",
  climate: "#16df4f",
  economic: "#16df4f",
  societal: "#faa71a",
  policy: "#f7931e",
  environment: "#58be2f",
  energy: "#fcc30d",
  food: "#e52b3d",
  urban: "#fe6a25",
  networking: "#4dd9e0", // maps to .track.break -> var(--accent-color)
};

function hex(h: string): RGB {
  const n = parseInt(h.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

// ---- Layout constants -------------------------------------------------------
const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const HEADER_BAND_HEIGHT = 150;
const DAY_BAND_HEIGHT = 34;
const FOOTER_HEIGHT = 34;
const BOTTOM_SAFE_Y = FOOTER_HEIGHT + 24;

export interface PdfSession {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  room?: string;
  track: string;
  speakerNames: string[];
}

export interface PdfDay {
  id: string;
  label: string;
  date: string;
  sessions: PdfSession[];
}

export interface PdfEventMeta {
  name: string;
  tagline?: string;
  startDate: string;
  endDate: string;
  location?: string;
  generatedAt?: Date;
}

/** Wrap `text` to fit within `maxWidth` at `size` using `font`'s real glyph widths. */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function generateSchedulePdf(
  days: PdfDay[],
  event: PdfEventMeta
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  pdfDoc.setTitle(`${event.name} — Full Schedule`);
  pdfDoc.setSubject("Conference schedule");
  pdfDoc.setProducer("spaceimpactforum.com");
  pdfDoc.setCreator("spaceimpactforum.com");

  const [robotoRegular, robotoMedium, robotoBold, rubikSemiBold, rubikBold, rubikExtraBold] =
    await Promise.all(
      [
        "roboto-400.ttf",
        "roboto-500.ttf",
        "roboto-700.ttf",
        "rubik-600.ttf",
        "rubik-700.ttf",
        "rubik-800.ttf",
      ].map(async (file) =>
        pdfDoc.embedFont(await readFile(path.join(FONTS_DIR, file)), {
          features: { liga: false, rlig: false },
        })
      )
    );

  const fonts = { robotoRegular, robotoMedium, robotoBold, rubikSemiBold, rubikBold, rubikExtraBold };

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT;
  let pageNum = 1;
  const totalSessions = days.reduce((n, d) => n + d.sessions.length, 0);

  function drawFooter(p: PDFPage, num: number) {
    p.drawLine({
      start: { x: MARGIN_X, y: FOOTER_HEIGHT },
      end: { x: PAGE_WIDTH - MARGIN_X, y: FOOTER_HEIGHT },
      thickness: 0.75,
      color: COLOR.hairline,
    });
    p.drawText("spaceimpactforum.com", {
      x: MARGIN_X,
      y: FOOTER_HEIGHT - 16,
      size: 8,
      font: fonts.robotoRegular,
      color: COLOR.mutedText,
    });
    const pageLabel = `Page ${num}`;
    const w = fonts.robotoRegular.widthOfTextAtSize(pageLabel, 8);
    p.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN_X - w,
      y: FOOTER_HEIGHT - 16,
      size: 8,
      font: fonts.robotoRegular,
      color: COLOR.mutedText,
    });
  }

  function newPage() {
    drawFooter(page, pageNum);
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageNum += 1;
    y = PAGE_HEIGHT - 40;
  }

  function ensureSpace(neededHeight: number) {
    if (y - neededHeight < BOTTOM_SAFE_Y) {
      newPage();
    }
  }

  // ---- Cover / header band ----
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - HEADER_BAND_HEIGHT, width: PAGE_WIDTH, height: HEADER_BAND_HEIGHT, color: COLOR.background });
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - HEADER_BAND_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLOR.accent });

  page.drawText(event.name.toUpperCase(), {
    x: MARGIN_X,
    y: PAGE_HEIGHT - 58,
    size: 25,
    font: fonts.rubikExtraBold,
    color: COLOR.contrast,
  });

  if (event.tagline) {
    page.drawText(event.tagline, {
      x: MARGIN_X,
      y: PAGE_HEIGHT - 80,
      size: 12,
      font: fonts.robotoMedium,
      color: COLOR.accent,
    });
  }

  const dateRange = formatDateRange(event.startDate, event.endDate);
  page.drawText(dateRange, {
    x: MARGIN_X,
    y: PAGE_HEIGHT - 108,
    size: 10.5,
    font: fonts.robotoRegular,
    color: COLOR.contrast,
  });
  if (event.location) {
    page.drawText(event.location, {
      x: MARGIN_X,
      y: PAGE_HEIGHT - 124,
      size: 10.5,
      font: fonts.robotoRegular,
      color: COLOR.contrast,
    });
  }

  page.drawText("FULL PROGRAMME", {
    x: MARGIN_X,
    y: PAGE_HEIGHT - HEADER_BAND_HEIGHT - 24,
    size: 10,
    font: fonts.rubikBold,
    color: COLOR.background,
  });
  const generated = event.generatedAt ?? new Date();
  const generatedLabel = `${totalSessions} sessions · generated ${generated.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  const genWidth = fonts.robotoRegular.widthOfTextAtSize(generatedLabel, 9);
  page.drawText(generatedLabel, {
    x: PAGE_WIDTH - MARGIN_X - genWidth,
    y: PAGE_HEIGHT - HEADER_BAND_HEIGHT - 23,
    size: 9,
    font: fonts.robotoRegular,
    color: COLOR.mutedText,
  });

  y = PAGE_HEIGHT - HEADER_BAND_HEIGHT - 48;

  // ---- Day-by-day session listing ----
  for (const day of days) {
    ensureSpace(DAY_BAND_HEIGHT + 30);

    page.drawRectangle({ x: MARGIN_X, y: y - DAY_BAND_HEIGHT + 6, width: CONTENT_WIDTH, height: DAY_BAND_HEIGHT, color: COLOR.background });
    page.drawText(`${day.label}`, {
      x: MARGIN_X + 14,
      y: y - DAY_BAND_HEIGHT + 6 + 11,
      size: 13,
      font: fonts.rubikBold,
      color: COLOR.contrast,
    });
    const dayDateLabel = formatFullDate(day.date);
    const dateW = fonts.robotoRegular.widthOfTextAtSize(dayDateLabel, 10);
    page.drawText(dayDateLabel, {
      x: PAGE_WIDTH - MARGIN_X - 14 - dateW,
      y: y - DAY_BAND_HEIGHT + 6 + 12,
      size: 10,
      font: fonts.robotoRegular,
      color: COLOR.accent,
    });

    y -= DAY_BAND_HEIGHT + 16;

    for (const session of day.sessions) {
      const trackColor = hex(TRACK_COLORS[session.track] ?? "#4dd9e0");
      const descLines = session.description ? wrapText(session.description, fonts.robotoRegular, 9.5, CONTENT_WIDTH - 78) : [];
      const speakerLine = session.speakerNames.length > 0 ? `Speakers: ${session.speakerNames.join(", ")}` : "";
      const speakerLines = speakerLine ? wrapText(speakerLine, fonts.robotoMedium, 9, CONTENT_WIDTH - 78) : [];

      const blockHeight = 18 /* title */ + descLines.length * 12.5 + speakerLines.length * 12 + 16 /* padding */;
      ensureSpace(blockHeight);

      const blockTop = y;

      // Time column
      page.drawText(session.start, { x: MARGIN_X, y: blockTop - 2, size: 10, font: fonts.rubikBold, color: COLOR.background });
      page.drawText(session.end, { x: MARGIN_X, y: blockTop - 14, size: 8, font: fonts.robotoRegular, color: COLOR.mutedText });

      const contentX = MARGIN_X + 58;
      const contentWidth = CONTENT_WIDTH - 58;

      // Track badge
      const badgeLabel = session.track.charAt(0).toUpperCase() + session.track.slice(1);
      const badgeTextWidth = fonts.robotoBold.widthOfTextAtSize(badgeLabel, 7.5);
      const badgeWidth = badgeTextWidth + 14;
      page.drawRectangle({
        x: contentX,
        y: blockTop - 12,
        width: badgeWidth,
        height: 13,
        color: trackColor,
        opacity: 0.15,
      });
      page.drawText(badgeLabel, {
        x: contentX + 7,
        y: blockTop - 9,
        size: 7.5,
        font: fonts.robotoBold,
        color: trackColor,
      });

      let roomX = contentX + badgeWidth + 10;
      if (session.room) {
        page.drawText(session.room, {
          x: roomX,
          y: blockTop - 9,
          size: 8.5,
          font: fonts.robotoRegular,
          color: COLOR.mutedText,
        });
      }

      // Title
      page.drawText(session.title, {
        x: contentX,
        y: blockTop - 28,
        size: 11,
        font: fonts.rubikBold,
        color: COLOR.bodyText,
        maxWidth: contentWidth,
      });

      let lineY = blockTop - 28 - 15;
      for (const line of descLines) {
        page.drawText(line, { x: contentX, y: lineY, size: 9.5, font: fonts.robotoRegular, color: COLOR.mutedText });
        lineY -= 12.5;
      }
      for (const line of speakerLines) {
        page.drawText(line, { x: contentX, y: lineY, size: 9, font: fonts.robotoMedium, color: COLOR.bodyText });
        lineY -= 12;
      }

      y = lineY - 10;
      page.drawLine({
        start: { x: MARGIN_X, y: y + 4 },
        end: { x: PAGE_WIDTH - MARGIN_X, y: y + 4 },
        thickness: 0.5,
        color: COLOR.hairline,
      });
    }

    y -= 6;
  }

  drawFooter(page, pageNum);

  return pdfDoc.save();
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  const startLabel = start.toLocaleDateString("en-GB", opts);
  const endLabel = end.toLocaleDateString("en-GB", { ...opts, year: "numeric" });
  return `${startLabel} – ${endLabel}`;
}

function formatFullDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}
