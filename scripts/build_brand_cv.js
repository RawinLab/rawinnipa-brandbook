// ============================================================
// Rawinnipa Brand CV — 2-page A4 portrait company resume
// ============================================================
const pptxgen = require("pptxgenjs");
const path = require("path");

const BRAND = {
  tealGreen:   "23B591",
  pureGreen:   "3EDC81",
  yellowGreen: "9DC351",
  black:       "0A0A0A",
  deepBlack:   "000000",
  charcoal:    "1A1A1A",
  darkGray:    "2A2A2A",
  midGray:     "4A4A4A",
  lightGray:   "9CA3AF",
  subtleGray:  "D1D5DB",
  offWhite:    "F7F7F7",
  white:       "FFFFFF",
};

const ASSETS = "/home/claude/brand_ci/assets";
const OUT_DIR = "/home/claude/brand_ci";

const pres = new pptxgen();
// A4 portrait: 8.27" × 11.69"
pres.defineLayout({ name: "A4_PORTRAIT", width: 8.27, height: 11.69 });
pres.layout = "A4_PORTRAIT";
pres.author = "Rawinnipa Software and Consultants";
pres.title = "Rawinnipa — Company CV";

const PW = 8.27, PH = 11.69;

// ============================================================
// Helpers
// ============================================================
function addPageFooter(slide, pageNum, total) {
  // thin green bar at bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: PH - 0.7, w: PW, h: 0.04,
    fill: { color: BRAND.pureGreen }, line: { width: 0 },
  });
  slide.addText("RAWINNIPA  /  COMPANY CV  /  V 1.0", {
    x: 0.5, y: PH - 0.55, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 8,
    color: BRAND.midGray, charSpacing: 4,
  });
  slide.addText(`${pageNum} / ${total}`, {
    x: PW - 1.5, y: PH - 0.55, w: 1.0, h: 0.3,
    fontFace: "Calibri", fontSize: 8,
    color: BRAND.pureGreen, align: "right", bold: true,
  });
}

// ============================================================
// PAGE 1 — Company at a glance
// ============================================================
function page1() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };

  // Top signature gradient strip (3-segment, thin)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: PW / 3, h: 0.2,
    fill: { color: BRAND.tealGreen }, line: { width: 0 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: PW / 3, y: 0, w: PW / 3, h: 0.2,
    fill: { color: BRAND.pureGreen }, line: { width: 0 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 2 * PW / 3, y: 0, w: PW / 3, h: 0.2,
    fill: { color: BRAND.yellowGreen }, line: { width: 0 } });

  // ─── HEADER ROW (logo + wordmark + eyebrow) ───
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: 0.5, y: 0.55, w: 0.9, h: 0.9,
  });
  slide.addText("RAWINNIPA", {
    x: 1.55, y: 0.65, w: 4.5, h: 0.4,
    fontFace: "Calibri", fontSize: 20, bold: true,
    color: BRAND.white, charSpacing: 4,
  });
  slide.addText("Software and Consultants Company", {
    x: 1.55, y: 1.05, w: 4.5, h: 0.3,
    fontFace: "Calibri", fontSize: 10,
    color: BRAND.pureGreen, charSpacing: 2,
  });

  // Top-right: "COMPANY CV" eyebrow
  slide.addText("COMPANY CV", {
    x: PW - 2.5, y: 0.65, w: 2.0, h: 0.25,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: BRAND.lightGray, align: "right", charSpacing: 5,
  });
  slide.addText("VERSION 1.0  /  APRIL 2026", {
    x: PW - 2.5, y: 0.92, w: 2.0, h: 0.25,
    fontFace: "Calibri", fontSize: 8,
    color: BRAND.midGray, align: "right", charSpacing: 3,
  });

  // ─── TAGLINE ───
  slide.addText("Build what moves.", {
    x: 0.5, y: 1.9, w: 7.27, h: 0.7,
    fontFace: "Calibri", fontSize: 36, bold: true,
    color: BRAND.white,
  });
  slide.addText(
    "Design, analysis, and development of technology solutions — tailored to your business, built to last.",
    {
      x: 0.5, y: 2.65, w: 7.27, h: 0.6,
      fontFace: "Calibri", fontSize: 12,
      color: BRAND.subtleGray,
    }
  );

  // ─── KEY STATS ───
  const stats = [
    { num: "12+",   label: "YEARS OF\nSYSTEM DELIVERY" },
    { num: "50+",   label: "PROJECTS\nSHIPPED" },
    { num: "8",     label: "INTERNATIONAL\nAWARDS" },
    { num: "5",     label: "CORE SERVICE\nPRACTICES" },
  ];
  const statY = 3.6, statW = (PW - 1.0) / 4, statH = 1.3;
  stats.forEach((s, i) => {
    const x = 0.5 + i * statW;
    // vertical green line on left
    if (i === 0) {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x, y: statY, w: 0.05, h: statH,
        fill: { color: BRAND.pureGreen }, line: { width: 0 },
      });
    } else {
      slide.addShape(pres.shapes.RECTANGLE, {
        x: x, y: statY + 0.2, w: 0.01, h: statH - 0.4,
        fill: { color: BRAND.darkGray }, line: { width: 0 },
      });
    }
    // Big number
    slide.addText(s.num, {
      x: x + 0.15, y: statY, w: statW - 0.2, h: 0.7,
      fontFace: "Calibri", fontSize: 40, bold: true,
      color: BRAND.pureGreen,
    });
    // Label
    slide.addText(s.label, {
      x: x + 0.15, y: statY + 0.75, w: statW - 0.2, h: 0.5,
      fontFace: "Calibri", fontSize: 8,
      color: BRAND.subtleGray, charSpacing: 3,
    });
  });

  // ─── ABOUT ───
  const aboutY = 5.2;
  slide.addText("ABOUT", {
    x: 0.5, y: aboutY, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText(
    "Rawinnipa is a Bangkok-based software and consulting team with over twelve years of experience delivering production systems across fintech, Web3, enterprise AI, education, and manufacturing. We partner with clients to design, build, and operate software that holds up long after launch day — and we've collected a few international awards along the way for the work we do on blockchain and decentralized infrastructure.",
    {
      x: 0.5, y: aboutY + 0.4, w: 7.27, h: 1.3,
      fontFace: "Calibri", fontSize: 11,
      color: BRAND.white, paraSpaceAfter: 4,
    }
  );

  // ─── WHAT WE DO (service grid) ───
  const servY = 6.95;
  slide.addText("WHAT WE DO", {
    x: 0.5, y: servY, w: 3, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });

  const services = [
    { n: "01", title: "Blockchain & Web3",     desc: "Layer 1/2 chains, smart contracts, DEX, oracles, bridges, NFT marketplaces." },
    { n: "02", title: "AI & Automation",        desc: "AI agents, LLM workflows, Computer Vision, n8n automation, enterprise AI integration." },
    { n: "03", title: "Application Development", desc: "Web, mobile, LINE LIFF/Beacon, Telegram Mini Apps." },
    { n: "04", title: "UX/UI & Systems Analysis", desc: "User-centered design, system architecture, requirements engineering." },
    { n: "05", title: "Consulting & Training",  desc: "Architecture planning, AI transformation workshops, technical enablement." },
  ];

  const cols = 2;
  const cardW = (PW - 1.0 - 0.25) / cols;
  const cardH = 0.83;
  const gapY = 0.12;

  services.forEach((s, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 0.5 + col * (cardW + 0.25);
    const y = servY + 0.35 + row * (cardH + gapY);

    // card bg
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 0.5 },
    });
    // left green accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.04, h: cardH,
      fill: { color: BRAND.pureGreen }, line: { width: 0 },
    });
    // number + title on same row
    slide.addText(s.n, {
      x: x + 0.2, y: y + 0.1, w: 0.4, h: 0.3,
      fontFace: "Calibri", fontSize: 13, bold: true,
      color: BRAND.pureGreen,
    });
    slide.addText(s.title, {
      x: x + 0.6, y: y + 0.1, w: cardW - 0.8, h: 0.3,
      fontFace: "Calibri", fontSize: 12, bold: true,
      color: BRAND.white, valign: "middle",
    });
    // description
    slide.addText(s.desc, {
      x: x + 0.2, y: y + 0.42, w: cardW - 0.3, h: 0.38,
      fontFace: "Calibri", fontSize: 9,
      color: BRAND.subtleGray,
    });
  });

  // ─── CONTACT STRIP at bottom ───
  const contactY = PH - 1.35;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: contactY, w: PW - 1.0, h: 0.5,
    fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 0.5 },
  });
  slide.addText([
    { text: "sayhi@rawinsoft.com",  options: { color: BRAND.white, bold: true } },
    { text: "   ·   ",              options: { color: BRAND.pureGreen } },
    { text: "rawinsoft.com",        options: { color: BRAND.white, bold: true } },
    { text: "   ·   ",              options: { color: BRAND.pureGreen } },
    { text: "+66 98 265 9690",      options: { color: BRAND.white, bold: true } },
  ], {
    x: 0.5, y: contactY, w: PW - 1.0, h: 0.5,
    fontFace: "Calibri", fontSize: 11,
    align: "center", valign: "middle",
  });

  addPageFooter(slide, 1, 2);
}

// ============================================================
// PAGE 2 — Selected work + Recognition + Tech
// ============================================================
function page2() {
  const slide = pres.addSlide();
  slide.background = { color: BRAND.black };

  // Top gradient strip (same as page 1)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: PW / 3, h: 0.2,
    fill: { color: BRAND.tealGreen }, line: { width: 0 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: PW / 3, y: 0, w: PW / 3, h: 0.2,
    fill: { color: BRAND.pureGreen }, line: { width: 0 } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 2 * PW / 3, y: 0, w: PW / 3, h: 0.2,
    fill: { color: BRAND.yellowGreen }, line: { width: 0 } });

  // Small header continuity
  slide.addImage({
    path: path.join(ASSETS, "logo_color.png"),
    x: 0.5, y: 0.5, w: 0.5, h: 0.5,
  });
  slide.addText("RAWINNIPA  /  COMPANY CV", {
    x: 1.1, y: 0.55, w: 4, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.white, charSpacing: 3, valign: "middle",
  });
  slide.addText("PAGE 2", {
    x: PW - 2.5, y: 0.55, w: 2.0, h: 0.3,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: BRAND.midGray, align: "right", charSpacing: 4, valign: "middle",
  });

  // ─── SELECTED WORK ───
  const workY = 1.4;
  slide.addText("SELECTED WORK", {
    x: 0.5, y: workY, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });
  slide.addText("Eight projects spanning blockchain, AI, enterprise systems, and hardware integration.", {
    x: 0.5, y: workY + 0.3, w: PW - 1.0, h: 0.3,
    fontFace: "Calibri", fontSize: 10,
    color: BRAND.lightGray,
  });

  const projects = [
    { name: "MaxiChain",          tag: "BLOCKCHAIN",    desc: "EVM Layer-1 network for Maxion's game platform — block explorer, bridge, DEX, faucet." },
    { name: "BKCOracle",          tag: "BLOCKCHAIN",    desc: "Oracle system on Bitkub Chain delivering price feeds and verifiable randomness on-chain." },
    { name: "GoodGeek",           tag: "WEB PLATFORM",  desc: "Thai crowdfunding platform connecting thinkers and builders with their supporters." },
    { name: "Zchoolmate",         tag: "ENTERPRISE",    desc: "Complete school management system — attendance, cafeteria POS, grading, enrollment, finance." },
    { name: "Carbon Audit",       tag: "AI / ENTERPRISE", desc: "AI-powered carbon accounting — automated data entry and emissions calculation." },
    { name: "Mattress Defect AI", tag: "COMPUTER VISION", desc: "Custom-trained model detecting manufacturing defects, deployed to quality-control line." },
    { name: "Digital Twin Andaman", tag: "GOV / TOURISM", desc: "In-depth tourism analytics platform for the Andaman provinces with geospatial data." },
    { name: "Khaya",              tag: "AI / LINE",     desc: "LINE chatbot identifying waste types from photos using AI-powered image recognition." },
  ];

  const pCols = 2, pCardW = (PW - 1.0 - 0.25) / pCols;
  const pCardH = 0.95, pGapY = 0.10;
  const projStartY = workY + 0.75;

  projects.forEach((p, i) => {
    const col = i % pCols, row = Math.floor(i / pCols);
    const x = 0.5 + col * (pCardW + 0.25);
    const y = projStartY + row * (pCardH + pGapY);

    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: pCardW, h: pCardH,
      fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 0.5 },
    });
    // Tag pill (top right)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + pCardW - 1.3, y: y + 0.12, w: 1.2, h: 0.22,
      fill: { color: BRAND.deepBlack }, line: { color: BRAND.pureGreen, width: 0.5 },
    });
    slide.addText(p.tag, {
      x: x + pCardW - 1.3, y: y + 0.12, w: 1.2, h: 0.22,
      fontFace: "Calibri", fontSize: 7, bold: true,
      color: BRAND.pureGreen, align: "center", valign: "middle", charSpacing: 2, margin: 0,
    });
    // Name
    slide.addText(p.name, {
      x: x + 0.2, y: y + 0.1, w: pCardW - 1.5, h: 0.32,
      fontFace: "Calibri", fontSize: 13, bold: true,
      color: BRAND.white, valign: "middle",
    });
    // Description
    slide.addText(p.desc, {
      x: x + 0.2, y: y + 0.45, w: pCardW - 0.3, h: 0.55,
      fontFace: "Calibri", fontSize: 9,
      color: BRAND.subtleGray,
    });
  });

  // ─── RECOGNITION ───
  const recogY = projStartY + 4 * (pCardH + pGapY) + 0.2;
  slide.addText("RECOGNITION", {
    x: 0.5, y: recogY, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });

  const awards = [
    { venue: "ETHGlobal Bangkok 2024",  prizes: "Blockscout Big Pool · Chronicle Protocol" },
    { venue: "ETHGlobal Singapore 2024", prizes: "Chainlink · Metamask/Linea · Worldcoin" },
    { venue: "ETHGlobal Istanbul 2023", prizes: "Chiliz · Scroll · Waku · Gnosis" },
  ];

  let ay = recogY + 0.4;
  awards.forEach((a) => {
    // small green dot
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5, y: ay + 0.07, w: 0.1, h: 0.1,
      fill: { color: BRAND.pureGreen }, line: { width: 0 },
    });
    slide.addText(a.venue, {
      x: 0.7, y: ay, w: 3.2, h: 0.28,
      fontFace: "Calibri", fontSize: 10, bold: true, color: BRAND.white,
    });
    slide.addText(a.prizes, {
      x: 4.0, y: ay, w: 3.77, h: 0.28,
      fontFace: "Calibri", fontSize: 9, color: BRAND.subtleGray, italic: true,
    });
    ay += 0.28;
  });

  // Certifications line
  slide.addText("CERTIFICATIONS", {
    x: 0.5, y: ay + 0.15, w: 3, h: 0.25,
    fontFace: "Calibri", fontSize: 8, bold: true,
    color: BRAND.midGray, charSpacing: 3,
  });
  slide.addText(
    "CompTIA Security+  ·  (ISC)² Certified in Cybersecurity  ·  NCSA Thailand Cybersecurity Professional  ·  ICT Mahidol Web App Pen-Testing",
    {
      x: 0.5, y: ay + 0.4, w: PW - 1.0, h: 0.3,
      fontFace: "Calibri", fontSize: 9,
      color: BRAND.white,
    }
  );

  // ─── TECHNOLOGIES (pill grid) ───
  const techY = ay + 0.85;
  slide.addText("TECHNOLOGIES", {
    x: 0.5, y: techY, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color: BRAND.pureGreen, charSpacing: 5,
  });

  // 4 dense rows — grouped by category
  const techRows = [
    ["Solidity", "Ethereum", "EVM Chains", "Bitkub Chain", "Smart Contracts", "IPFS"],
    ["Node.js", "Python", "React", "Next.js", "TypeScript", "Flutter"],
    ["LangChain", "OpenAI API", "Computer Vision", "n8n", "Make", "Zapier"],
    ["PostgreSQL", "MongoDB", "Redis", "Kubernetes", "Docker", "AWS", "LINE LIFF", "Firebase"],
  ];

  let ty = techY + 0.4;
  techRows.forEach((row) => {
    let tx = 0.5;
    row.forEach((tech) => {
      const pillW = 0.12 + tech.length * 0.075;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: tx, y: ty, w: pillW, h: 0.28, rectRadius: 0.04,
        fill: { color: BRAND.charcoal }, line: { color: BRAND.darkGray, width: 0.5 },
      });
      slide.addText(tech, {
        x: tx, y: ty, w: pillW, h: 0.28,
        fontFace: "Calibri", fontSize: 8,
        color: BRAND.subtleGray, align: "center", valign: "middle", margin: 0,
      });
      tx += pillW + 0.08;
    });
    ty += 0.34;
  });

  addPageFooter(slide, 2, 2);
}

// ============================================================
// BUILD
// ============================================================
async function main() {
  page1();
  page2();
  const out = path.join(OUT_DIR, "Rawinnipa_Company_CV_v1.0.pptx");
  await pres.writeFile({ fileName: out });
  console.log("Wrote:", out);
}
main().catch(err => { console.error(err); process.exit(1); });
