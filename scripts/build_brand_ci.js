// ============================================================
// Rawinnipa Brand Identity Guidelines Generator
// ============================================================
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Brand color palette
const BRAND = {
  // Primary gradient (derived from logo)
  tealGreen:    "23B591",  // top of gradient
  pureGreen:    "3EDC81",  // middle - signature primary
  yellowGreen:  "9DC351",  // bottom of gradient
  // Functional
  black:        "0A0A0A",
  deepBlack:    "000000",
  charcoal:     "1A1A1A",
  darkGray:     "2A2A2A",
  midGray:      "4A4A4A",
  lightGray:    "9CA3AF",
  subtleGray:   "D1D5DB",
  offWhite:     "F7F7F7",
  white:        "FFFFFF",
};

const ASSETS = "/home/claude/brand_ci/assets";
const OUT_DIR = "/home/claude/brand_ci";

// ============================================================
// Setup
// ============================================================
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";     // 13.3" x 7.5" — matches company profile
pres.author = "Rawinnipa Software and Consultants";
pres.title  = "Rawinnipa — Brand Identity Guidelines";

const SW = 13.333, SH = 7.5;

// ============================================================
// Helpers
// ============================================================
function addGreenCornerAccent(slide, corner = "tr") {
  // A small green gradient ribbon/arc in corner for brand continuity
  if (corner === "tr") {
    // Top-right corner green arc
    slide.addShape(pres.shapes.OVAL, {
      x: SW - 1.6, y: -1.2, w: 3.0, h: 3.0,
      fill: { color: BRAND.pureGreen, transparency: 0 },
      line: { color: BRAND.pureGreen, width: 0 },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: SW - 1.2, y: -1.0, w: 2.8, h: 2.8,
      fill: { color: BRAND.black, transparency: 0 },
      line: { color: BRAND.black, width: 0 },
    });
  } else if (corner === "bl") {
    slide.addShape(pres.shapes.OVAL, {
      x: -1.4, y: SH - 1.6, w: 3.0, h: 3.0,
      fill: { color: BRAND.pureGreen, transparency: 0 },
      line: { color: BRAND.pureGreen, width: 0 },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: -1.2, y: SH - 1.2, w: 2.8, h: 2.8,
      fill: { color: BRAND.black, transparency: 0 },
      line: { color: BRAND.black, width: 0 },
    });
  }
}

function addFooter(slide, pageNum, total) {
  // Small footer strip
  slide.addText("RAWINNIPA  /  BRAND IDENTITY GUIDELINES", {
    x: 0.5, y: SH - 0.45, w: 8, h: 0.3,
    fontFace: "Calibri", fontSize: 9,
    color: BRAND.midGray, charSpacing: 3,
  });
  slide.addText(`${String(pageNum).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: SW - 1.5, y: SH - 0.45, w: 1.0, h: 0.3,
    fontFace: "Calibri", fontSize: 9,
    color: BRAND.pureGreen, align: "right", bold: true,
  });
}

function addSectionLabel(slide, section) {
  // Small "SECTION — NN" tag at top
  slide.addText(section, {
    x: 0.6, y: 0.5, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 10,
    color: BRAND.pureGreen, charSpacing: 6, bold: true,
  });
}

// ============================================================
// SLIDE 01 — COVER
// ============================================================
function slide01_Cover() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };

  // Signature gradient bar along left side
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.3, h: SH,
    fill: { color: BRAND.tealGreen }, line: { width: 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: SH / 3, w: 0.3, h: SH / 3,
    fill: { color: BRAND.pureGreen }, line: { width: 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 2 * SH / 3, w: 0.3, h: SH / 3,
    fill: { color: BRAND.yellowGreen }, line: { width: 0 },
  });

  // Top-right small label
  slide.addText("CONFIDENTIAL  /  VERSION 1.0", {
    x: SW - 4.5, y: 0.5, w: 4.0, h: 0.3,
    fontFace: "Calibri", fontSize: 10,
    color: BRAND.lightGray, align: "right", charSpacing: 4,
  });

  // Logo mark (big, centered-ish)
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: 1.2, y: 2.3, w: 1.6, h: 1.6,
  });

  // Main title
  slide.addText("Brand Identity", {
    x: 3.2, y: 2.2, w: 9.0, h: 1.0,
    fontFace: "Calibri", fontSize: 60, bold: true,
    color: BRAND.white, valign: "bottom",
  });
  slide.addText("Guidelines", {
    x: 3.2, y: 3.1, w: 9.0, h: 1.0,
    fontFace: "Calibri", fontSize: 60, bold: true,
    color: BRAND.pureGreen, valign: "top",
  });

  // Subtitle
  slide.addText("Rawinnipa  —  Software and Consultants Company", {
    x: 3.2, y: 4.3, w: 9, h: 0.4,
    fontFace: "Calibri", fontSize: 16,
    color: BRAND.subtleGray, charSpacing: 2,
  });

  // Bottom meta
  slide.addText("Issued  April 2026", {
    x: 0.6, y: SH - 0.8, w: 6, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: BRAND.lightGray, charSpacing: 2,
  });
  slide.addText("rawinsoft.com", {
    x: SW - 3, y: SH - 0.8, w: 2.5, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: BRAND.lightGray,
    align: "right", charSpacing: 2,
  });
}

// ============================================================
// SLIDE 02 — INTRODUCTION
// ============================================================
function slide02_Intro() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "01  /  INTRODUCTION");

  slide.addText("A living document\nfor our visual identity.", {
    x: 0.6, y: 1.4, w: 9.0, h: 2.0,
    fontFace: "Calibri", fontSize: 44, bold: true,
    color: BRAND.white,
  });

  slide.addText(
    "These guidelines define how the Rawinnipa brand shows up in the world — from the logo on a pitch deck to the color of a button in our products. Follow them to keep our identity consistent, recognizable, and aligned with who we are: a software and consulting team building the systems that move businesses forward.",
    {
      x: 0.6, y: 3.7, w: 7.5, h: 2.6,
      fontFace: "Calibri", fontSize: 14,
      color: BRAND.subtleGray, paraSpaceAfter: 8,
    }
  );

  // Right-side summary card
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 9.0, y: 1.4, w: 3.7, h: 4.9,
    fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 1 },
  });

  slide.addText("IN THIS GUIDE", {
    x: 9.3, y: 1.7, w: 3.2, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });

  const tocItems = [
    "01  Introduction",
    "02  Brand Foundation",
    "03  Logo System",
    "04  Color Palette",
    "05  Typography",
    "06  Visual Style",
    "07  Brand Voice",
    "08  Applications",
  ];
  slide.addText(
    tocItems.map((t, i) => ({
      text: t,
      options: { breakLine: i !== tocItems.length - 1, color: BRAND.white },
    })),
    {
      x: 9.3, y: 2.3, w: 3.2, h: 3.8,
      fontFace: "Calibri", fontSize: 13,
      paraSpaceAfter: 6,
    }
  );

  addFooter(slide, 2, 16);
}

// ============================================================
// SLIDE 03 — BRAND FOUNDATION (Vision & Mission)
// ============================================================
function slide03_Foundation() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "02  /  BRAND FOUNDATION");

  slide.addText("Why we exist.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });

  // Two-column: Vision | Mission
  // VISION
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.4, w: 0.08, h: 3.8,
    fill: { color: BRAND.pureGreen }, line: { width: 0 },
  });
  slide.addText("VISION", {
    x: 0.9, y: 2.4, w: 5, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true,
    color: BRAND.pureGreen, charSpacing: 6,
  });
  slide.addText(
    "To lead the way in building a business world connected by digital fluency and advanced technology — where productivity and competitiveness are shared outcomes, and every partnership creates lasting value.",
    {
      x: 0.9, y: 2.95, w: 5.5, h: 3.1,
      fontFace: "Calibri", fontSize: 15,
      color: BRAND.white, paraSpaceAfter: 6, valign: "top",
    }
  );

  // MISSION
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.0, y: 2.4, w: 0.08, h: 3.8,
    fill: { color: BRAND.yellowGreen }, line: { width: 0 },
  });
  slide.addText("MISSION", {
    x: 7.3, y: 2.4, w: 5, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true,
    color: BRAND.yellowGreen, charSpacing: 6,
  });
  slide.addText(
    "To help our partners grow and adapt to the digital age — freely and efficiently — using software and modern technology as the engines of transformation. We build trust through quality delivery and stay close to our partners as they succeed.",
    {
      x: 7.3, y: 2.95, w: 5.5, h: 3.1,
      fontFace: "Calibri", fontSize: 15,
      color: BRAND.white, paraSpaceAfter: 6, valign: "top",
    }
  );

  addFooter(slide, 3, 16);
}

// ============================================================
// SLIDE 04 — BRAND PERSONALITY
// ============================================================
function slide04_Personality() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "02  /  BRAND FOUNDATION");

  slide.addText("How we show up.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Four personality traits shape every interaction — from a client email to a product landing page.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.5,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // 4 trait cards in a row
  const traits = [
    { num: "01", label: "PROGRESSIVE",  desc: "We build at the edge — AI, blockchain, automation — and bring those capabilities to real businesses." },
    { num: "02", label: "DEPENDABLE",   desc: "Twelve years of delivery. We ship systems that stay running long after launch day." },
    { num: "03", label: "COLLABORATIVE",desc: "Partners, not vendors. We treat our clients' wins as our own and invest in long-term success." },
    { num: "04", label: "CLEAR",        desc: "Complex technology, simple delivery. We strip out jargon so decisions can actually get made." },
  ];

  const cardW = 2.85, cardH = 3.6, gap = 0.25;
  const totalW = 4 * cardW + 3 * gap;
  const startX = (SW - totalW) / 2;

  traits.forEach((t, i) => {
    const x = startX + i * (cardW + gap);
    const y = 2.7;
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 1 },
    });
    // Top accent rectangle
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: 0.08,
      fill: { color: BRAND.pureGreen }, line: { width: 0 },
    });
    // Number
    slide.addText(t.num, {
      x: x + 0.25, y: y + 0.3, w: cardW - 0.5, h: 0.8,
      fontFace: "Calibri", fontSize: 42, bold: true,
      color: BRAND.pureGreen,
    });
    // Label
    slide.addText(t.label, {
      x: x + 0.25, y: y + 1.2, w: cardW - 0.5, h: 0.4,
      fontFace: "Calibri", fontSize: 14, bold: true,
      color: BRAND.white, charSpacing: 3,
    });
    // Description
    slide.addText(t.desc, {
      x: x + 0.25, y: y + 1.75, w: cardW - 0.5, h: cardH - 1.9,
      fontFace: "Calibri", fontSize: 12,
      color: BRAND.subtleGray, paraSpaceAfter: 4,
    });
  });

  addFooter(slide, 4, 16);
}

// ============================================================
// SLIDE 05 — THE LOGO (primary showcase)
// ============================================================
function slide05_Logo() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "03  /  LOGO SYSTEM");

  slide.addText("The mark.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "An enclosed monogram — R and W fused inside a continuous circle — the mark reads as unity, momentum, and connection.",
    {
      x: 0.6, y: 1.9, w: 8.0, h: 0.6,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // Big logo display area
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.9, w: 7.5, h: 3.8,
    fill: { color: BRAND.deepBlack }, line: { color: BRAND.darkGray, width: 1 },
  });
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: 2.75, y: 3.1, w: 3.2, h: 3.2,
  });
  // Small corner label
  slide.addText("PRIMARY  /  FULL COLOR", {
    x: 0.9, y: 6.25, w: 3, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: BRAND.midGray, charSpacing: 4,
  });

  // Right column — meaning
  const rx = 8.5;
  slide.addText("THE CIRCLE", {
    x: rx, y: 2.9, w: 4, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Continuity and completeness — an unbroken loop that holds everything together.", {
    x: rx, y: 3.2, w: 4.2, h: 0.9,
    fontFace: "Calibri", fontSize: 12, color: BRAND.subtleGray,
  });

  slide.addText("THE MONOGRAM", {
    x: rx, y: 4.2, w: 4, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Two letters, one path — R and W share strokes, suggesting interconnection and forward motion.", {
    x: rx, y: 4.5, w: 4.2, h: 0.9,
    fontFace: "Calibri", fontSize: 12, color: BRAND.subtleGray,
  });

  slide.addText("THE GRADIENT", {
    x: rx, y: 5.5, w: 4, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Teal to lime — the spectrum of growth, freshness, and technological vitality.", {
    x: rx, y: 5.8, w: 4.2, h: 0.9,
    fontFace: "Calibri", fontSize: 12, color: BRAND.subtleGray,
  });

  addFooter(slide, 5, 16);
}

// ============================================================
// SLIDE 06 — LOGO VARIATIONS
// ============================================================
function slide06_LogoVariations() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "03  /  LOGO SYSTEM");

  slide.addText("Variations.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Four approved treatments. Pick the one with the highest contrast against your background.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  const variants = [
    { title: "PRIMARY",        sub: "Full-color gradient", bg: BRAND.black,    logo: "logo_color.png", labelColor: BRAND.white },
    { title: "REVERSED",       sub: "White on dark",       bg: BRAND.darkGray, logo: "logo_white.png", labelColor: BRAND.white },
    { title: "SOLID GREEN",    sub: "Single-color accent", bg: BRAND.offWhite, logo: "logo_green.png", labelColor: BRAND.black },
    { title: "MONOCHROME",     sub: "Black on light",      bg: BRAND.white,    logo: "logo_black.png", labelColor: BRAND.black },
  ];

  const cardW = 2.85, cardH = 3.5, gap = 0.25;
  const totalW = 4 * cardW + 3 * gap;
  const startX = (SW - totalW) / 2;

  variants.forEach((v, i) => {
    const x = startX + i * (cardW + gap);
    const y = 2.65;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: v.bg }, line: { color: BRAND.darkGray, width: 1 },
    });
    // logo centered in card
    const lSize = 1.8;
    slide.addImage({
      path: path.join(ASSETS, v.logo),
      x: x + (cardW - lSize) / 2, y: y + 0.5, w: lSize, h: lSize,
    });

    // Label under card (on slide bg)
    slide.addText(v.title, {
      x, y: y + cardH + 0.1, w: cardW, h: 0.3,
      fontFace: "Calibri", fontSize: 11, bold: true,
      color: BRAND.white, align: "center", charSpacing: 4,
    });
    slide.addText(v.sub, {
      x, y: y + cardH + 0.4, w: cardW, h: 0.3,
      fontFace: "Calibri", fontSize: 10,
      color: BRAND.lightGray, align: "center",
    });
  });

  addFooter(slide, 6, 16);
}

// ============================================================
// SLIDE 07 — LOGO CONSTRUCTION (clear space + min size)
// ============================================================
function slide07_LogoConstruction() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "03  /  LOGO SYSTEM");

  slide.addText("Clear space & scale.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Give the mark room to breathe. Keep a minimum buffer equal to 'X' — one-quarter of the logo's height — on every side.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.6,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // LEFT: clear-space demo
  // A framed box showing the logo with a dashed clear-space guide
  const clearX = 0.6, clearY = 2.8, clearW = 6.5, clearH = 4.0;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: clearX, y: clearY, w: clearW, h: clearH,
    fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 1 },
  });

  // Logo
  const logoSize = 2.0;
  const logoX = clearX + (clearW - logoSize) / 2;
  const logoY = clearY + (clearH - logoSize) / 2;
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: logoX, y: logoY, w: logoSize, h: logoSize,
  });

  // Clear-space dashed box (X = 0.5" = 0.25 * logoSize)
  const X = 0.5;
  const csX = logoX - X, csY = logoY - X, csW = logoSize + 2*X, csH = logoSize + 2*X;
  // Draw 4 dashed lines around the clear-space box
  slide.addShape(pres.shapes.LINE, {
    x: csX, y: csY, w: csW, h: 0,
    line: { color: BRAND.pureGreen, width: 1, dashType: "dash" },
  });
  slide.addShape(pres.shapes.LINE, {
    x: csX, y: csY + csH, w: csW, h: 0,
    line: { color: BRAND.pureGreen, width: 1, dashType: "dash" },
  });
  slide.addShape(pres.shapes.LINE, {
    x: csX, y: csY, w: 0, h: csH,
    line: { color: BRAND.pureGreen, width: 1, dashType: "dash" },
  });
  slide.addShape(pres.shapes.LINE, {
    x: csX + csW, y: csY, w: 0, h: csH,
    line: { color: BRAND.pureGreen, width: 1, dashType: "dash" },
  });

  // "X" labels on each side
  slide.addText("X", {
    x: logoX + logoSize/2 - 0.15, y: csY - 0.4, w: 0.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, bold: true, color: BRAND.pureGreen, align: "center",
  });
  slide.addText("X", {
    x: logoX + logoSize/2 - 0.15, y: csY + csH + 0.1, w: 0.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, bold: true, color: BRAND.pureGreen, align: "center",
  });
  slide.addText("X", {
    x: csX - 0.4, y: logoY + logoSize/2 - 0.15, w: 0.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, bold: true, color: BRAND.pureGreen, align: "center",
  });
  slide.addText("X", {
    x: csX + csW + 0.1, y: logoY + logoSize/2 - 0.15, w: 0.3, h: 0.3,
    fontFace: "Calibri", fontSize: 12, bold: true, color: BRAND.pureGreen, align: "center",
  });

  slide.addText("CLEAR SPACE", {
    x: clearX + 0.25, y: clearY + clearH - 0.5, w: 3, h: 0.25,
    fontFace: "Calibri", fontSize: 9, bold: true, color: BRAND.pureGreen, charSpacing: 4,
  });

  // RIGHT: minimum size spec
  const rx = 7.5;
  slide.addText("MINIMUM SIZE", {
    x: rx, y: 2.8, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Never display the logo smaller than these thresholds — below this, legibility breaks down.", {
    x: rx, y: 3.15, w: 5.2, h: 0.6,
    fontFace: "Calibri", fontSize: 12, color: BRAND.subtleGray,
  });

  // Demo of tiny logo + labels
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: 4.0, w: 5.2, h: 2.2,
    fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 1 },
  });

  // Small logo demos - wider label cells to prevent wrapping
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: rx + 0.3, y: 4.3, w: 0.5, h: 0.5,
  });
  slide.addText("24 px", {
    x: rx + 0.0, y: 4.9, w: 1.1, h: 0.22,
    fontFace: "Calibri", fontSize: 10, color: BRAND.white, align: "center", bold: true,
  });
  slide.addText("DIGITAL", {
    x: rx + 0.0, y: 5.15, w: 1.1, h: 0.22,
    fontFace: "Calibri", fontSize: 8, color: BRAND.lightGray, align: "center", charSpacing: 2,
  });

  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: rx + 1.6, y: 4.2, w: 0.7, h: 0.7,
  });
  slide.addText("40 px", {
    x: rx + 1.25, y: 4.98, w: 1.4, h: 0.22,
    fontFace: "Calibri", fontSize: 10, color: BRAND.white, align: "center", bold: true,
  });
  slide.addText("RECOMMENDED", {
    x: rx + 1.25, y: 5.23, w: 1.4, h: 0.22,
    fontFace: "Calibri", fontSize: 8, color: BRAND.lightGray, align: "center", charSpacing: 2,
  });

  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: rx + 3.1, y: 4.1, w: 1.0, h: 1.0,
  });
  slide.addText("15 mm", {
    x: rx + 2.8, y: 5.23, w: 1.6, h: 0.22,
    fontFace: "Calibri", fontSize: 10, color: BRAND.white, align: "center", bold: true,
  });
  slide.addText("PRINT MIN.", {
    x: rx + 2.8, y: 5.48, w: 1.6, h: 0.22,
    fontFace: "Calibri", fontSize: 8, color: BRAND.lightGray, align: "center", charSpacing: 2,
  });

  addFooter(slide, 7, 16);
}

// ============================================================
// SLIDE 08 — LOGO DON'Ts
// ============================================================
function slide08_LogoMisuse() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "03  /  LOGO SYSTEM");

  slide.addText("Don't.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Protect the mark. These six misuses distort what the logo is trying to say.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // 2 rows x 3 columns of don'ts
  const donts = [
    { label: "Don't stretch",       transform: "stretch" },
    { label: "Don't recolor",       transform: "recolor" },
    { label: "Don't rotate",        transform: "rotate" },
    { label: "Don't add effects",   transform: "effects" },
    { label: "Don't outline",       transform: "outline" },
    { label: "Don't low-contrast",  transform: "lowcontrast" },
  ];

  const cellW = 3.9, cellH = 1.95, gapX = 0.15, gapY = 0.3;
  const totalW = 3 * cellW + 2 * gapX;
  const startX = (SW - totalW) / 2;
  const startY = 2.55;

  donts.forEach((d, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = startX + col * (cellW + gapX);
    const y = startY + row * (cellH + gapY);

    // Cell bg
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cellW, h: cellH,
      fill: { color: d.transform === "lowcontrast" ? "2a3a2a" : BRAND.charcoal },
      line: { color: BRAND.darkGray, width: 1 },
    });

    // Render the misused logo
    const lgw = 1.0, lgh = 1.0;
    const lx = x + (cellW - lgw) / 2, ly = y + 0.22;
    let imgOpts = {
      path: path.join(ASSETS, "logo_color.png"),
      x: lx, y: ly, w: lgw, h: lgh,
    };
    if (d.transform === "stretch") {
      imgOpts.w = 1.7; imgOpts.h = 0.7; imgOpts.x = x + (cellW - 1.7)/2; imgOpts.y = y + 0.35;
    } else if (d.transform === "recolor") {
      imgOpts.path = path.join(ASSETS, "logo_black.png");
    } else if (d.transform === "rotate") {
      imgOpts.rotate = 25;
    } else if (d.transform === "effects") {
      imgOpts.transparency = 30;
    } else if (d.transform === "outline") {
      imgOpts.path = path.join(ASSETS, "logo_white.png");
    } else if (d.transform === "lowcontrast") {
      imgOpts.path = path.join(ASSETS, "logo_green.png");
    }
    slide.addImage(imgOpts);

    // Red X indicator (top-right of cell)
    slide.addShape(pres.shapes.OVAL, {
      x: x + cellW - 0.4, y: y + 0.08, w: 0.26, h: 0.26,
      fill: { color: "DC2626" }, line: { width: 0 },
    });
    slide.addText("✕", {
      x: x + cellW - 0.4, y: y + 0.08, w: 0.26, h: 0.26,
      fontFace: "Calibri", fontSize: 12, bold: true, color: BRAND.white,
      align: "center", valign: "middle", margin: 0,
    });

    // Label
    slide.addText(d.label, {
      x, y: y + cellH - 0.4, w: cellW, h: 0.3,
      fontFace: "Calibri", fontSize: 11, bold: true,
      color: BRAND.white, align: "center", charSpacing: 2,
    });
  });

  addFooter(slide, 8, 16);
}

// ============================================================
// SLIDE 09 — COLOR PALETTE PRIMARY
// ============================================================
function slide09_ColorPrimary() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "04  /  COLOR PALETTE");

  slide.addText("Primary colors.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "A green spectrum for growth and technology, anchored by deep black for authority.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  const swatches = [
    { name: "RAWIN GREEN",    hex: "3EDC81", rgb: "62, 220, 129",  cmyk: "72, 0, 41, 14",   pantone: "PMS 7481 C",  primary: true  },
    { name: "DEEP TEAL",      hex: "23B591", rgb: "35, 181, 145",  cmyk: "81, 0, 20, 29",   pantone: "PMS 3395 C",  primary: false },
    { name: "LIME ACCENT",    hex: "9DC351", rgb: "157, 195, 81",  cmyk: "19, 0, 58, 24",   pantone: "PMS 2296 C",  primary: false },
    { name: "DEEP BLACK",     hex: "0A0A0A", rgb: "10, 10, 10",    cmyk: "0, 0, 0, 96",     pantone: "PMS Black C", primary: false },
  ];

  // 4 swatches in a row, larger for primary
  const totalW = 12.2;
  const w1 = 3.5, wRest = (totalW - w1 - 3*0.15) / 3;  // primary wider
  const y = 2.7, h = 3.4;
  let x = (SW - totalW) / 2;

  swatches.forEach((s, i) => {
    const sw = i === 0 ? w1 : wRest;

    // Swatch fill
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: sw, h: h,
      fill: { color: s.hex },
      line: { color: s.hex === "0A0A0A" ? BRAND.darkGray : s.hex, width: 1 },
    });

    // Primary marker
    if (s.primary) {
      slide.addText("PRIMARY", {
        x: x + 0.25, y: y + 0.25, w: 1.5, h: 0.3,
        fontFace: "Calibri", fontSize: 9, bold: true,
        color: BRAND.black, charSpacing: 5,
      });
    }

    // Color name
    const textColor = s.hex === "0A0A0A" ? BRAND.white : BRAND.black;
    slide.addText(s.name, {
      x: x + 0.25, y: y + h - 1.7, w: sw - 0.5, h: 0.4,
      fontFace: "Calibri", fontSize: 14, bold: true,
      color: textColor, charSpacing: 2,
    });

    // Big hex code
    slide.addText(`#${s.hex.toUpperCase()}`, {
      x: x + 0.25, y: y + h - 1.25, w: sw - 0.5, h: 0.5,
      fontFace: "Consolas", fontSize: 20, bold: true,
      color: textColor,
    });

    // Tech specs
    slide.addText([
      { text: `RGB ${s.rgb}`,    options: { breakLine: true } },
      { text: `CMYK ${s.cmyk}`,  options: { breakLine: true } },
      { text: s.pantone, options: {} },
    ], {
      x: x + 0.25, y: y + h - 0.75, w: sw - 0.5, h: 0.7,
      fontFace: "Calibri", fontSize: 9,
      color: textColor, paraSpaceAfter: 1,
    });

    x += sw + 0.15;
  });

  addFooter(slide, 9, 16);
}

// ============================================================
// SLIDE 10 — NEUTRALS & GRADIENT
// ============================================================
function slide10_Neutrals() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "04  /  COLOR PALETTE");

  slide.addText("Neutrals & signature gradient.", {
    x: 0.6, y: 1.0, w: 12, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Grays ground the palette for text and UI surfaces. The gradient is reserved for hero moments.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // Top row — neutral swatches
  const neutrals = [
    { name: "CHARCOAL",   hex: "1A1A1A" },
    { name: "GRAPHITE",   hex: "2A2A2A" },
    { name: "MID GRAY",   hex: "4A4A4A" },
    { name: "ASH",        hex: "9CA3AF" },
    { name: "CLOUD",      hex: "D1D5DB" },
    { name: "OFF WHITE",  hex: "F7F7F7" },
  ];

  const nw = 1.95, nh = 1.8, ngap = 0.07;
  const nTotalW = 6 * nw + 5 * ngap;
  let nx = (SW - nTotalW) / 2;
  const ny = 2.8;

  neutrals.forEach((n) => {
    // brighter border for near-black swatches so they separate from slide bg
    const r = parseInt(n.hex.substring(0,2), 16);
    const borderColor = r < 60 ? "4A4A4A" : (r > 180 ? "BBBBBB" : n.hex);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: nx, y: ny, w: nw, h: nh,
      fill: { color: n.hex },
      line: { color: borderColor, width: 1 },
    });

    const tc = parseInt(n.hex.substring(0,2), 16) > 100 ? BRAND.black : BRAND.white;
    slide.addText(n.name, {
      x: nx + 0.15, y: ny + 0.15, w: nw - 0.3, h: 0.3,
      fontFace: "Calibri", fontSize: 9, bold: true,
      color: tc, charSpacing: 3,
    });
    slide.addText(`#${n.hex.toUpperCase()}`, {
      x: nx + 0.15, y: ny + nh - 0.4, w: nw - 0.3, h: 0.25,
      fontFace: "Consolas", fontSize: 10,
      color: tc,
    });

    nx += nw + ngap;
  });

  // Gradient showcase
  slide.addText("SIGNATURE GRADIENT", {
    x: 0.6, y: 5.0, w: 10, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });

  // Simulate gradient with 12 thin vertical bars (teal → pure → lime)
  const gradX = 0.6, gradY = 5.4, gradW = 12.1, gradH = 1.0;
  const steps = 40;
  const stepW = gradW / steps;
  // linear interp from teal -> pure -> lime
  const c1 = [0x23, 0xB5, 0x91];  // teal
  const c2 = [0x3E, 0xDC, 0x81];  // pure green
  const c3 = [0x9D, 0xC3, 0x51];  // lime
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    let col;
    if (t < 0.5) {
      const u = t / 0.5;
      col = [
        Math.round(c1[0] + (c2[0]-c1[0])*u),
        Math.round(c1[1] + (c2[1]-c1[1])*u),
        Math.round(c1[2] + (c2[2]-c1[2])*u),
      ];
    } else {
      const u = (t - 0.5) / 0.5;
      col = [
        Math.round(c2[0] + (c3[0]-c2[0])*u),
        Math.round(c2[1] + (c3[1]-c2[1])*u),
        Math.round(c2[2] + (c3[2]-c2[2])*u),
      ];
    }
    const hex = col.map(v => v.toString(16).padStart(2,"0")).join("").toUpperCase();
    slide.addShape(pres.shapes.RECTANGLE, {
      x: gradX + i*stepW, y: gradY, w: stepW + 0.01, h: gradH,
      fill: { color: hex }, line: { width: 0 },
    });
  }

  // Gradient stop labels
  slide.addText("#23B591  →  #3EDC81  →  #9DC351", {
    x: gradX, y: gradY + gradH + 0.08, w: gradW, h: 0.3,
    fontFace: "Consolas", fontSize: 10, color: BRAND.lightGray, align: "center",
  });

  addFooter(slide, 10, 16);
}

// ============================================================
// SLIDE 11 — TYPOGRAPHY (families)
// ============================================================
function slide11_Typography() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "05  /  TYPOGRAPHY");

  slide.addText("Typefaces.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Inter for everything digital. Calibri as the office-safe fallback. No decorative fonts in brand materials.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // Two large type specimens side by side
  // LEFT — INTER (primary)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.7, w: 6.1, h: 4.2,
    fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 1 },
  });
  slide.addText("PRIMARY", {
    x: 0.9, y: 2.9, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Inter", {
    x: 0.9, y: 3.25, w: 5, h: 1.4,
    fontFace: "Calibri", fontSize: 84, bold: true, color: BRAND.white,
  });
  slide.addText("Aa Bb Cc  1234567890", {
    x: 0.9, y: 4.7, w: 5.5, h: 0.6,
    fontFace: "Calibri", fontSize: 24, color: BRAND.subtleGray,
  });
  slide.addText([
    { text: "Weights  ", options: { color: BRAND.midGray, bold: true } },
    { text: "Regular · Medium · Semibold · Bold", options: { color: BRAND.white } },
  ], {
    x: 0.9, y: 5.5, w: 5.5, h: 0.3,
    fontFace: "Calibri", fontSize: 12,
  });
  slide.addText([
    { text: "Usage  ", options: { color: BRAND.midGray, bold: true } },
    { text: "Digital UI, website, presentations, pitch decks", options: { color: BRAND.white } },
  ], {
    x: 0.9, y: 5.9, w: 5.5, h: 0.3,
    fontFace: "Calibri", fontSize: 12,
  });
  slide.addText([
    { text: "Source  ", options: { color: BRAND.midGray, bold: true } },
    { text: "Google Fonts · open license", options: { color: BRAND.white } },
  ], {
    x: 0.9, y: 6.3, w: 5.5, h: 0.3,
    fontFace: "Calibri", fontSize: 12,
  });

  // RIGHT — CALIBRI (fallback)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.9, y: 2.7, w: 6.0, h: 4.2,
    fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 1 },
  });
  slide.addText("FALLBACK", {
    x: 7.2, y: 2.9, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Calibri", {
    x: 7.2, y: 3.25, w: 5, h: 1.4,
    fontFace: "Calibri", fontSize: 84, bold: true, color: BRAND.white,
  });
  slide.addText("Aa Bb Cc  1234567890", {
    x: 7.2, y: 4.7, w: 5.5, h: 0.6,
    fontFace: "Calibri", fontSize: 24, color: BRAND.subtleGray,
  });
  slide.addText([
    { text: "Weights  ", options: { color: BRAND.midGray, bold: true } },
    { text: "Regular · Bold", options: { color: BRAND.white } },
  ], {
    x: 7.2, y: 5.5, w: 5.5, h: 0.3,
    fontFace: "Calibri", fontSize: 12,
  });
  slide.addText([
    { text: "Usage  ", options: { color: BRAND.midGray, bold: true } },
    { text: "Office documents, emails, internal files", options: { color: BRAND.white } },
  ], {
    x: 7.2, y: 5.9, w: 5.5, h: 0.3,
    fontFace: "Calibri", fontSize: 12,
  });
  slide.addText([
    { text: "Source  ", options: { color: BRAND.midGray, bold: true } },
    { text: "Preinstalled on all Office systems", options: { color: BRAND.white } },
  ], {
    x: 7.2, y: 6.3, w: 5.5, h: 0.3,
    fontFace: "Calibri", fontSize: 12,
  });

  addFooter(slide, 11, 16);
}

// ============================================================
// SLIDE 12 — TYPOGRAPHY HIERARCHY
// ============================================================
function slide12_TypeHierarchy() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "05  /  TYPOGRAPHY");

  slide.addText("Hierarchy.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Six roles, used consistently. Pick the role first — then the size follows.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // Type scale samples stacked
  const types = [
    { role: "H1  /  Display",       sample: "Build what moves.",      size: 52, weight: true,  color: BRAND.white,   meta: "Inter Bold  ·  52 / 60" },
    { role: "H2  /  Section title", sample: "Software. Consulting.",  size: 34, weight: true,  color: BRAND.white,   meta: "Inter Bold  ·  34 / 42" },
    { role: "H3  /  Sub-heading",   sample: "Twelve years of delivery.", size: 22, weight: true, color: BRAND.white,meta: "Inter Semibold  ·  22 / 30" },
    { role: "Body  /  Paragraph",   sample: "Clear words for complex systems.", size: 14, weight: false, color: BRAND.subtleGray, meta: "Inter Regular  ·  14 / 22" },
    { role: "Caption",              sample: "Labels, footnotes, timestamps.", size: 11, weight: false, color: BRAND.lightGray,  meta: "Inter Regular  ·  11 / 16" },
    { role: "Eyebrow",              sample: "SECTION TAG", size: 10, weight: true, color: BRAND.pureGreen, meta: "Inter Bold  ·  10 / 14  ·  Tracking +60", charSp: 6 },
  ];

  let y = 2.7;
  const rowH = 0.72;
  types.forEach((t, i) => {
    // Role label
    slide.addText(t.role, {
      x: 0.6, y: y + 0.1, w: 2.5, h: 0.4,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: BRAND.midGray, charSpacing: 3,
    });

    // Sample
    slide.addText(t.sample, {
      x: 3.2, y: y - 0.1, w: 6.5, h: 0.65,
      fontFace: "Calibri", fontSize: t.size, bold: t.weight,
      color: t.color, charSpacing: t.charSp || 0,
    });

    // Meta spec
    slide.addText(t.meta, {
      x: 9.8, y: y + 0.15, w: 3.2, h: 0.3,
      fontFace: "Consolas", fontSize: 9,
      color: BRAND.midGray, align: "right",
    });

    // Thin divider
    if (i < types.length - 1) {
      slide.addShape(pres.shapes.LINE, {
        x: 0.6, y: y + rowH - 0.05, w: 12.1, h: 0,
        line: { color: BRAND.darkGray, width: 0.5 },
      });
    }

    y += rowH;
  });

  addFooter(slide, 12, 16);
}

// ============================================================
// SLIDE 13 — VISUAL STYLE (imagery + motifs)
// ============================================================
function slide13_VisualStyle() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "06  /  VISUAL STYLE");

  slide.addText("Visual language.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Three motifs you'll see everywhere the brand shows up.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // 3 motif cards
  const motifs = [
    {
      title: "DARK CANVAS",
      body: "Black and near-black grounds give content gravity and let green pop. Use for hero sections, covers, and formal decks.",
      render: (x, y, w, h) => {
        slide.addShape(pres.shapes.RECTANGLE, {
          x, y, w, h, fill: { color: BRAND.deepBlack },
          line: { color: BRAND.darkGray, width: 1 },
        });
      },
    },
    {
      title: "GREEN ACCENT",
      body: "A single green element per composition — a corner ribbon, a divider, a key word. Never flood the frame with green.",
      render: (x, y, w, h) => {
        slide.addShape(pres.shapes.RECTANGLE, {
          x, y, w, h, fill: { color: BRAND.deepBlack },
          line: { color: BRAND.darkGray, width: 1 },
        });
        // diagonal green ribbon
        slide.addShape(pres.shapes.RECTANGLE, {
          x: x + w - 0.7, y: y, w: 0.7, h: h, rotate: 0,
          fill: { color: BRAND.pureGreen }, line: { width: 0 },
        });
      },
    },
    {
      title: "GEOMETRIC + FLUID",
      body: "Clean geometric layouts paired with fluid metallic shapes (as in the company profile) — structure meets movement.",
      render: (x, y, w, h) => {
        slide.addShape(pres.shapes.RECTANGLE, {
          x, y, w, h, fill: { color: BRAND.deepBlack },
          line: { color: BRAND.darkGray, width: 1 },
        });
        // decorative circles constrained inside the card
        slide.addShape(pres.shapes.OVAL, {
          x: x + w - 1.0, y: y + h - 1.0, w: 0.85, h: 0.85,
          fill: { color: BRAND.tealGreen, transparency: 60 }, line: { width: 0 },
        });
        slide.addShape(pres.shapes.OVAL, {
          x: x + w - 1.4, y: y + h - 1.35, w: 0.85, h: 0.85,
          fill: { color: BRAND.pureGreen, transparency: 70 }, line: { width: 0 },
        });
        // small square accent top-left
        slide.addShape(pres.shapes.RECTANGLE, {
          x: x + 0.3, y: y + 0.3, w: 0.35, h: 0.35,
          fill: { color: BRAND.pureGreen }, line: { width: 0 },
        });
      },
    },
  ];

  const cardW = 3.9, cardH = 3.8, gap = 0.25;
  const totalW = 3 * cardW + 2 * gap;
  const startX = (SW - totalW) / 2;
  const startY = 2.7;

  motifs.forEach((m, i) => {
    const x = startX + i * (cardW + gap);
    // visual area (top part of card)
    m.render(x, startY, cardW, 2.0);

    // Label area
    slide.addText(m.title, {
      x, y: startY + 2.15, w: cardW, h: 0.35,
      fontFace: "Calibri", fontSize: 12, bold: true,
      color: BRAND.pureGreen, charSpacing: 4,
    });
    slide.addText(m.body, {
      x, y: startY + 2.5, w: cardW, h: 1.3,
      fontFace: "Calibri", fontSize: 12, color: BRAND.subtleGray,
    });
  });

  addFooter(slide, 13, 16);
}

// ============================================================
// SLIDE 14 — BRAND VOICE
// ============================================================
function slide14_Voice() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "07  /  BRAND VOICE");

  slide.addText("How we sound.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "We talk like experienced engineers, not marketers. Plain, concrete, and confident.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // "We are / We aren't" two-column comparison
  const attributes = [
    { we: "Direct",         not: "Vague" },
    { we: "Plain-spoken",   not: "Jargon-heavy" },
    { we: "Confident",      not: "Boastful" },
    { we: "Technical when needed", not: "Technical for show" },
    { we: "Honest about trade-offs", not: "Overpromising" },
  ];

  // Column headers
  slide.addText("WE ARE", {
    x: 0.6, y: 2.9, w: 6.0, h: 0.4,
    fontFace: "Calibri", fontSize: 12, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("WE AREN'T", {
    x: 6.9, y: 2.9, w: 6.0, h: 0.4,
    fontFace: "Calibri", fontSize: 12, bold: true,
    color: "DC2626", charSpacing: 5,
  });

  let ry = 3.4;
  attributes.forEach((a) => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: ry, w: 6.0, h: 0.55,
      fill: { color: BRAND.charcoal }, line: { width: 0 },
    });
    slide.addText(a.we, {
      x: 0.9, y: ry, w: 5.5, h: 0.55,
      fontFace: "Calibri", fontSize: 15, color: BRAND.white, valign: "middle",
    });

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 6.9, y: ry, w: 6.0, h: 0.55,
      fill: { color: BRAND.charcoal }, line: { width: 0 },
    });
    slide.addText(a.not, {
      x: 7.2, y: ry, w: 5.5, h: 0.55,
      fontFace: "Calibri", fontSize: 15, color: BRAND.lightGray, valign: "middle", italic: true,
    });

    ry += 0.65;
  });

  addFooter(slide, 14, 16);
}

// ============================================================
// SLIDE 15 — APPLICATIONS (business card, etc.)
// ============================================================
function slide15_Applications() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };
  addSectionLabel(slide, "08  /  APPLICATIONS");

  slide.addText("In the wild.", {
    x: 0.6, y: 1.0, w: 10, h: 0.8,
    fontFace: "Calibri", fontSize: 40, bold: true, color: BRAND.white,
  });
  slide.addText(
    "Three standard touchpoints — business card, email signature, social avatar.",
    {
      x: 0.6, y: 1.9, w: 10, h: 0.4,
      fontFace: "Calibri", fontSize: 14, color: BRAND.lightGray,
    }
  );

  // === BUSINESS CARD (left, large) ===
  // Front
  const bcX = 0.6, bcY = 2.9, bcW = 5.3, bcH = 3.0;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: bcX, y: bcY, w: bcW, h: bcH,
    fill: { color: BRAND.deepBlack },
    line: { color: BRAND.darkGray, width: 1 },
    shadow: { type: "outer", blur: 10, offset: 3, color: "000000", opacity: 0.4, angle: 135 },
  });
  // Diagonal green accent (a simple green rectangle on the right edge to evoke ribbon)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: bcX + bcW - 0.4, y: bcY, w: 0.4, h: bcH,
    fill: { color: BRAND.pureGreen }, line: { width: 0 },
  });
  // Logo
  slide.addImage({
    path: path.join(ASSETS, "logo_white.png"),
    x: bcX + 0.3, y: bcY + 0.3, w: 0.7, h: 0.7,
  });
  // Wordmark
  slide.addText("RAWINNIPA", {
    x: bcX + 1.1, y: bcY + 0.45, w: 3.5, h: 0.4,
    fontFace: "Calibri", fontSize: 16, bold: true,
    color: BRAND.white, charSpacing: 3, valign: "middle",
  });
  // Name
  slide.addText("Rawin Srisantikul", {
    x: bcX + 0.3, y: bcY + 1.5, w: 4, h: 0.4,
    fontFace: "Calibri", fontSize: 18, bold: true, color: BRAND.white,
  });
  slide.addText("Software Consultant", {
    x: bcX + 0.3, y: bcY + 1.92, w: 4, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: BRAND.pureGreen, charSpacing: 3,
  });
  // Contact lines
  slide.addText([
    { text: "sayhi@rawinsoft.com",  options: { breakLine: true, color: BRAND.subtleGray } },
    { text: "+66 98 265 9690",      options: { breakLine: true, color: BRAND.subtleGray } },
    { text: "rawinsoft.com",        options: { color: BRAND.subtleGray } },
  ], {
    x: bcX + 0.3, y: bcY + 2.3, w: 4, h: 0.8,
    fontFace: "Calibri", fontSize: 10,
  });

  slide.addText("BUSINESS CARD  /  85 × 55 mm", {
    x: bcX, y: bcY + bcH + 0.15, w: bcW, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: BRAND.midGray, charSpacing: 4,
  });

  // === EMAIL SIGNATURE (right top) ===
  const esX = 6.4, esY = 2.9, esW = 6.4, esH = 1.65;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: esX, y: esY, w: esW, h: esH,
    fill: { color: BRAND.offWhite }, line: { color: "CCCCCC", width: 1 },
  });
  // Logo left
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: esX + 0.2, y: esY + 0.25, w: 1.1, h: 1.1,
  });
  // Green vertical divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: esX + 1.5, y: esY + 0.25, w: 0.04, h: esH - 0.5,
    fill: { color: BRAND.pureGreen }, line: { width: 0 },
  });
  // Name
  slide.addText("Rawin Srisantikul", {
    x: esX + 1.7, y: esY + 0.22, w: 4.4, h: 0.35,
    fontFace: "Calibri", fontSize: 14, bold: true, color: BRAND.black,
  });
  slide.addText("Software Consultant  ·  Rawinnipa Co., Ltd.", {
    x: esX + 1.7, y: esY + 0.55, w: 4.4, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: BRAND.midGray,
  });
  // Contact
  slide.addText([
    { text: "sayhi@rawinsoft.com",  options: { color: BRAND.black, breakLine: true } },
    { text: "+66 98 265 9690  ·  rawinsoft.com", options: { color: BRAND.midGray } },
  ], {
    x: esX + 1.7, y: esY + 0.88, w: 4.4, h: 0.65,
    fontFace: "Calibri", fontSize: 10, paraSpaceAfter: 2,
  });

  slide.addText("EMAIL SIGNATURE", {
    x: esX, y: esY + esH + 0.1, w: esW, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: BRAND.midGray, charSpacing: 4,
  });

  // === SOCIAL AVATAR (right bottom) ===
  const avX = 6.4, avY = 5.25, avSize = 0.75;
  const avatars = [
    { label: "LINKEDIN" },
    { label: "FACEBOOK" },
    { label: "INSTAGRAM" },
  ];
  avatars.forEach((a, i) => {
    const ax = avX + i * 2.15;
    // Circle background
    slide.addShape(pres.shapes.OVAL, {
      x: ax, y: avY, w: avSize, h: avSize,
      fill: { color: BRAND.deepBlack }, line: { color: BRAND.pureGreen, width: 1.5 },
    });
    // Logo
    slide.addImage({
      path: path.join(ASSETS, "logo_color.png"),
      x: ax + 0.12, y: avY + 0.12, w: avSize - 0.24, h: avSize - 0.24,
    });
    // Platform label
    slide.addText(a.label, {
      x: ax + 0.85, y: avY + 0.18, w: 1.25, h: 0.4,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: BRAND.white, charSpacing: 3, valign: "middle",
    });
  });

  slide.addText("SOCIAL AVATAR  /  CIRCULAR CROP OF LOGO", {
    x: avX, y: avY + avSize + 0.1, w: esW, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: BRAND.midGray, charSpacing: 4,
  });

  addFooter(slide, 15, 16);
}

// ============================================================
// SLIDE 16 — CLOSING / CONTACT
// ============================================================
function slide16_Closing() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };

  // One clean rotated green rectangle covering the right side with a clean diagonal edge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: SW * 0.52, y: -2, w: SW, h: SH + 4, rotate: 12,
    fill: { color: BRAND.pureGreen }, line: { width: 0 },
  });

  // Big logo on right
  slide.addImage({
    path: path.join(ASSETS, "logo_white.png"),
    x: SW * 0.72, y: SH / 2 - 1.4, w: 2.8, h: 2.8,
  });

  // Left side heading
  slide.addText("Keep in", {
    x: 0.8, y: 1.2, w: 6.5, h: 1.3,
    fontFace: "Calibri", fontSize: 70, bold: true, color: BRAND.white,
  });
  slide.addText("touch.", {
    x: 0.8, y: 2.3, w: 6.5, h: 1.3,
    fontFace: "Calibri", fontSize: 70, bold: true, color: BRAND.pureGreen,
  });

  // Contact block
  slide.addText("EMAIL", {
    x: 0.8, y: 4.2, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("sayhi@rawinsoft.com", {
    x: 0.8, y: 4.5, w: 6, h: 0.4,
    fontFace: "Calibri", fontSize: 18, color: BRAND.white,
  });

  slide.addText("WEBSITE", {
    x: 0.8, y: 5.2, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("rawinsoft.com", {
    x: 0.8, y: 5.5, w: 6, h: 0.4,
    fontFace: "Calibri", fontSize: 18, color: BRAND.white,
  });

  slide.addText("PHONE", {
    x: 0.8, y: 6.2, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("+66 98 265 9690", {
    x: 0.8, y: 6.5, w: 6, h: 0.4,
    fontFace: "Calibri", fontSize: 18, color: BRAND.white,
  });

  // Version tag bottom-left
  slide.addText("BRAND IDENTITY GUIDELINES  /  V 1.0  /  APRIL 2026", {
    x: 0.8, y: SH - 0.5, w: 7, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: BRAND.midGray, charSpacing: 4,
  });
}

// ============================================================
// BUILD
// ============================================================
async function main() {
  slide01_Cover();
  slide02_Intro();
  slide03_Foundation();
  slide04_Personality();
  slide05_Logo();
  slide06_LogoVariations();
  slide07_LogoConstruction();
  slide08_LogoMisuse();
  slide09_ColorPrimary();
  slide10_Neutrals();
  slide11_Typography();
  slide12_TypeHierarchy();
  slide13_VisualStyle();
  slide14_Voice();
  slide15_Applications();
  slide16_Closing();

  const outPath = path.join(OUT_DIR, "Rawinnipa_Brand_Guidelines_v1.0.pptx");
  await pres.writeFile({ fileName: outPath });
  console.log("Wrote:", outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
