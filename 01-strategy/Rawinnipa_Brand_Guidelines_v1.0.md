# Rawinnipa — Brand Identity Guidelines

> A living document for our visual identity.
>
> **Version** 1.0 · **Issued** April 2026 · **Owner** Rawinnipa Software and Consultants

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Brand Foundation](#2-brand-foundation)
3. [Logo System](#3-logo-system)
4. [Color Palette](#4-color-palette)
5. [Typography](#5-typography)
6. [Visual Language](#6-visual-language)
7. [Brand Voice](#7-brand-voice)
8. [Applications](#8-applications)
9. [Design Tokens](#9-design-tokens) · *for developers*
10. [Contact](#10-contact)

---

## 1. Introduction

These guidelines define how the Rawinnipa brand shows up in the world — from the logo on a pitch deck to the color of a button in our products. Follow them to keep our identity consistent, recognizable, and aligned with who we are: a software and consulting team building the systems that move businesses forward.

This document is the source of truth. If something isn't covered here, default to the spirit of the brand as described in [Brand Foundation](#2-brand-foundation) — or ask before improvising.

---

## 2. Brand Foundation

### 2.1 Vision

To lead the way in building a business world connected by digital fluency and advanced technology — where productivity and competitiveness are shared outcomes, and every partnership creates lasting value.

### 2.2 Mission

To help our partners grow and adapt to the digital age — freely and efficiently — using software and modern technology as the engines of transformation. We build trust through quality delivery and stay close to our partners as they succeed.

### 2.3 Brand Personality

Four traits shape every interaction, from a client email to a product landing page.

| # | Trait | What it means |
|---|---|---|
| 01 | **Progressive**   | We build at the edge — AI, blockchain, automation — and bring those capabilities to real businesses. |
| 02 | **Dependable**    | Twelve years of delivery. We ship systems that stay running long after launch day. |
| 03 | **Collaborative** | Partners, not vendors. We treat our clients' wins as our own and invest in long-term success. |
| 04 | **Clear**         | Complex technology, simple delivery. We strip out jargon so decisions can actually get made. |

---

## 3. Logo System

### 3.1 The Mark

An enclosed monogram — R and W fused inside a continuous circle — the mark reads as unity, momentum, and connection.

![Rawinnipa Primary Logo](./assets/logo_color.png)

**Three design elements:**

- **The Circle** — continuity and completeness, an unbroken loop that holds everything together.
- **The Monogram** — R and W share strokes, suggesting interconnection and forward motion.
- **The Gradient** — teal to lime, the spectrum of growth, freshness, and technological vitality.

### 3.2 Variations

Four approved treatments. Pick the one with the highest contrast against your background.

| Variation | File | Use case |
|---|---|---|
| **Primary** — full-color gradient | `logo_color.png` | Default. Use on black or near-black backgrounds. |
| **Reversed** — white on dark      | `logo_white.png` | Dark photos, videos, embroidery, single-ink print. |
| **Solid Green** — single-color accent | `logo_green.png` | Light backgrounds where the gradient would disappear. |
| **Monochrome** — black on light   | `logo_black.png` | Faxes, single-color stamps, legal/formal documents. |

### 3.3 Clear Space & Minimum Size

**Clear space.** Give the mark room to breathe. Keep a minimum buffer equal to `X` — one-quarter of the logo's height — on every side. Nothing (text, photography, edges of page) should enter that buffer.

**Minimum size.**

| Context | Minimum size | Notes |
|---|---|---|
| Digital      | 24 × 24 px  | Absolute floor. Below this, the monogram breaks up. |
| Recommended  | 40 × 40 px  | Use this for favicons, app icons, small avatars. |
| Print        | 15 × 15 mm  | Below this, the stroke weight risks bleeding. |

### 3.4 Don'ts

Protect the mark. These six misuses distort what the logo is trying to say.

| ❌ Don't | Why it breaks |
|---|---|
| **Stretch the logo**     | Monogram proportions are carefully balanced; stretching weakens the R-W connection. |
| **Recolor arbitrarily**  | Only the four approved variations are allowed. |
| **Rotate the mark**      | The logo has a defined orientation. Tilting implies motion we haven't designed for. |
| **Add shadows/effects**  | Glows, drop-shadows, and outer strokes add visual noise the mark doesn't need. |
| **Add an outline stroke**| The silhouette is the identity. Outlines create a second visual shape competing with it. |
| **Place on low-contrast backgrounds** | If the mark doesn't clearly separate from its background, switch variations. |

---

## 4. Color Palette

A green spectrum for growth and technology, anchored by deep black for authority.

### 4.1 Primary Colors

| Swatch | Name | HEX | RGB | CMYK | Pantone |
|---|---|---|---|---|---|
| 🟩 | **Rawin Green**  *(primary)*  | `#3EDC81` | `62, 220, 129`  | `72, 0, 41, 14`  | PMS 7481 C |
| 🟦 | Deep Teal       | `#23B591` | `35, 181, 145`  | `81, 0, 20, 29`  | PMS 3395 C |
| 🟨 | Lime Accent     | `#9DC351` | `157, 195, 81`  | `19, 0, 58, 24`  | PMS 2296 C |
| ⬛ | Deep Black      | `#0A0A0A` | `10, 10, 10`    | `0, 0, 0, 96`    | PMS Black C |

**Usage rule — dominance over equality.** One color should dominate any composition (60–70% visual weight). Default dominance hierarchy: Deep Black ground → Rawin Green accent → Deep Teal or Lime as secondary accents. Never give all four equal weight.

### 4.2 Neutrals

For text, UI surfaces, dividers, and backgrounds.

| Name       | HEX       | Typical use |
|---|---|---|
| Charcoal   | `#1A1A1A` | Card/surface on dark backgrounds |
| Graphite   | `#2A2A2A` | Borders, dividers on dark |
| Mid Gray   | `#4A4A4A` | Disabled text on dark, secondary borders |
| Ash        | `#9CA3AF` | Secondary text on dark |
| Cloud      | `#D1D5DB` | Subtle borders on light, disabled text on light |
| Off White  | `#F7F7F7` | Light-mode page background |

### 4.3 Signature Gradient

Reserved for hero moments — splash screens, pitch deck covers, major marketing pieces. Don't over-use it; the gradient loses meaning when it's everywhere.

```
#23B591  →  #3EDC81  →  #9DC351
(Deep Teal)   (Rawin Green)  (Lime Accent)
```

**Direction.** Default is a diagonal from top-left to bottom-right, matching the logo gradient. Linear horizontal or vertical variations are acceptable when the composition demands it.

---

## 5. Typography

Inter for everything digital. Calibri as the office-safe fallback. No decorative fonts in brand materials.

### 5.1 Typefaces

**Primary — Inter**

- **Weights used:** Regular · Medium · Semibold · Bold
- **Use for:** Website, digital UI, presentations, pitch decks, marketing
- **Source:** [Google Fonts](https://fonts.google.com/specimen/Inter) · open license

**Fallback — Calibri**

- **Weights used:** Regular · Bold
- **Use for:** Word documents, emails, internal files, anything generated in Microsoft Office
- **Source:** Preinstalled on all Office systems

### 5.2 Hierarchy

Six roles, used consistently. Pick the role first — size follows.

| Role              | Font · Weight       | Size / Line-height | Tracking  | Example |
|---|---|---|---|---|
| **H1 — Display**  | Inter Bold          | 52 / 60 px  | 0       | "Build what moves." |
| **H2 — Section**  | Inter Bold          | 34 / 42 px  | 0       | "Software. Consulting." |
| **H3 — Sub-head** | Inter Semibold      | 22 / 30 px  | 0       | "Twelve years of delivery." |
| **Body**          | Inter Regular       | 14 / 22 px  | 0       | "Clear words for complex systems." |
| **Caption**       | Inter Regular       | 11 / 16 px  | 0       | "Labels, footnotes, timestamps." |
| **Eyebrow**       | Inter Bold · UPPER  | 10 / 14 px  | +60 (0.06em) | `SECTION TAG` |

### 5.3 Thai Pairing

For Thai text, pair Inter with **Noto Sans Thai** (Google Fonts, matching weights). When both languages appear in the same line, use `font-family: 'Inter', 'Noto Sans Thai', sans-serif;` so Latin renders in Inter and Thai renders in Noto Sans Thai at matching visual weight.

---

## 6. Visual Language

Three motifs you'll see everywhere the brand shows up.

### 6.1 Dark Canvas

Black and near-black grounds give content gravity and let green pop. Use for hero sections, pitch deck covers, and formal decks. Dark canvas is the default — light canvas is the exception, reserved for contexts that demand it (print invoices, white-labeled deliverables).

### 6.2 Green Accent

A single green element per composition — a corner ribbon, a divider, a key word, a numeric callout. **Never flood the frame with green.** Green earns attention precisely because it's rare.

### 6.3 Geometric + Fluid

Clean geometric layouts (grids, cards, straight dividers) paired with fluid metallic shapes (the silver 3D ribbons from the company profile, or a subtle gradient blob). Structure meets movement. Use the fluid element sparingly — one per page at most.

---

## 7. Brand Voice

We talk like experienced engineers, not marketers. Plain, concrete, and confident.

| We are                           | We aren't            |
|---|---|
| Direct                           | *Vague*              |
| Plain-spoken                     | *Jargon-heavy*       |
| Confident                        | *Boastful*           |
| Technical when needed            | *Technical for show* |
| Honest about trade-offs          | *Overpromising*      |

### 7.1 Writing Rules

- **Lead with the answer.** Don't bury the recommendation under three paragraphs of setup.
- **Use concrete numbers.** "Twelve years" beats "many years." "30% faster" beats "significantly faster."
- **Prefer verbs over nouns.** "We ship" > "Our team performs shipment activities."
- **Name the trade-off.** If a solution has a cost, say so. Trust compounds from honesty.
- **Cut hedge words.** Strike "just," "really," "very," "simply" unless they genuinely add meaning.

### 7.2 Thai Voice

Thai tone mirrors the English rules but leans slightly warmer — use พี่/ครับ/ค่ะ appropriately in client-facing writing. Avoid overly formal legalese (ดำเนินการ, จัดทำการ) in favor of direct verbs (ทำ, ส่ง, สร้าง).

---

## 8. Applications

### 8.1 Business Card

- **Size:** 85 × 55 mm (standard international)
- **Stock:** 350 gsm matte or soft-touch laminate
- **Front:** Logo (reversed white) + wordmark "RAWINNIPA" top-left. Name + role + contact bottom-left. Green diagonal ribbon on right edge.
- **Back:** Solid Deep Black with centered primary logo, 30 mm wide.

### 8.2 Email Signature

Light background (Off White `#F7F7F7`), full-color primary logo left, vertical green divider (2 px, Rawin Green), name + role + company on right. Contact stacked below in Mid Gray.

```
[Logo]  |  Rawin Srisantikul
        |  Software Consultant · Rawinnipa Co., Ltd.
        |  sayhi@rawinsoft.com
        |  +66 98 265 9690 · rawinsoft.com
```

### 8.3 Social Avatar

Circular crop of the primary logo on Deep Black, with a 2 px Rawin Green stroke around the circle. Same asset works for LinkedIn, Facebook, Instagram, GitHub. Export at **400 × 400 px** minimum.

### 8.4 Presentation Template

- 16:9 widescreen, Deep Black background
- Green eyebrow tag top-left (e.g. `03  /  LOGO SYSTEM`)
- Footer: `RAWINNIPA / BRAND IDENTITY GUIDELINES` left, page number in Rawin Green right
- Title: Inter Bold 40 pt, White
- Body: Inter Regular 14 pt, Ash `#9CA3AF` or Cloud `#D1D5DB`

### 8.5 Mascot System

Mascots are a supporting expression layer for moments that need warmth, guidance, or personality: LINE stickers, chatbot states, onboarding, training slides, social posts, light merch, and workshop materials. Mascots do **not** replace the Rawinnipa logo.

Approved directions live in [`09-mascots/`](../09-mascots/):

| Mascot | Role |
|---|---|
| Female consultant | Primary human mascot direction; best fit for Rawinnipa's lotus meaning and B2B trust |
| Male consultant | Supporting consultant direction for alternate scenes and team-based stories |
| Green lotus | Brand-color lotus companion, closer to the corporate palette |
| Pink lotus / Nong Dok Bua | Warmer, sticker-friendly lotus companion |

**Rules:**

- Keep the brand environment dark: Deep Black `#0A0A0A`, Charcoal `#1A1A1A`, and sparse Rawin Green `#3EDC81` tech accents.
- Pink is allowed only as the Nong Dok Bua mascot palette. It is not a new corporate primary color.
- Use subtle Thai cues: wai gesture, gentle smile, simplified lotus-petal geometry, and minimal geometric Thai motifs.
- Avoid sacred, royal, religious, ceremonial, or costume-heavy Thai references.
- Keep expressions readable at small sticker size.
- For final stickers, generate or crop pose-level transparent assets from the character sheets and prompts in `09-mascots/mascot-prompts.md`.

---

## 9. Design Tokens

For engineers. Drop these into your project and you'll match the brand out of the box.

### 9.1 CSS Custom Properties

```css
:root {
  /* Primary */
  --rawin-green:      #3EDC81;
  --deep-teal:        #23B591;
  --lime-accent:      #9DC351;
  --deep-black:       #0A0A0A;

  /* Neutrals */
  --charcoal:         #1A1A1A;
  --graphite:         #2A2A2A;
  --mid-gray:         #4A4A4A;
  --ash:              #9CA3AF;
  --cloud:            #D1D5DB;
  --off-white:        #F7F7F7;
  --white:            #FFFFFF;

  /* Signature gradient */
  --brand-gradient: linear-gradient(
    135deg,
    var(--deep-teal) 0%,
    var(--rawin-green) 50%,
    var(--lime-accent) 100%
  );

  /* Type scale (line-height baked in) */
  --text-h1:      700 52px/60px 'Inter', 'Noto Sans Thai', sans-serif;
  --text-h2:      700 34px/42px 'Inter', 'Noto Sans Thai', sans-serif;
  --text-h3:      600 22px/30px 'Inter', 'Noto Sans Thai', sans-serif;
  --text-body:    400 14px/22px 'Inter', 'Noto Sans Thai', sans-serif;
  --text-caption: 400 11px/16px 'Inter', 'Noto Sans Thai', sans-serif;
  --text-eyebrow: 700 10px/14px 'Inter', sans-serif;

  /* Spacing (4-pt grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}

/* Eyebrow text helper */
.eyebrow {
  font: var(--text-eyebrow);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rawin-green);
}
```

### 9.2 Tailwind CSS Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        rawin: {
          green:     '#3EDC81',
          teal:      '#23B591',
          lime:      '#9DC351',
          black:     '#0A0A0A',
          charcoal:  '#1A1A1A',
          graphite:  '#2A2A2A',
        },
        gray: {
          mid:   '#4A4A4A',
          ash:   '#9CA3AF',
          cloud: '#D1D5DB',
          off:   '#F7F7F7',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #23B591 0%, #3EDC81 50%, #9DC351 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':  ['52px', { lineHeight: '60px', fontWeight: '700' }],
        'h2':       ['34px', { lineHeight: '42px', fontWeight: '700' }],
        'h3':       ['22px', { lineHeight: '30px', fontWeight: '600' }],
        'body':     ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'caption':  ['11px', { lineHeight: '16px', fontWeight: '400' }],
        'eyebrow':  ['10px', { lineHeight: '14px', fontWeight: '700', letterSpacing: '0.06em' }],
      },
    },
  },
};
```

### 9.3 Figma / Design Tool Styles

If you're in Figma, create these as **color styles** and **text styles** with the exact names above so design handoff stays clean. Paste the HEX values in — they're already in the tables in Section 4.

### 9.4 Logo Assets

Available in `/assets/`:

```
logo_color.png    — Primary, full-color gradient (transparent background)
logo_white.png    — Reversed, all-white (transparent background)
logo_black.png    — Monochrome, all-black (transparent background)
logo_green.png    — Single-color Rawin Green (transparent background)
```

For print or vector use, request the source `.svg` / `.ai` files from the brand owner.

---

## 10. Contact

**Rawinnipa Software and Consultants Company**

- **Email** — sayhi@rawinsoft.com
- **Website** — [rawinsoft.com](https://rawinsoft.com)
- **Phone** — +66 98 265 9690

---

### Document Info

| | |
|---|---|
| **Version** | 1.0 |
| **Issued**  | April 2026 |
| **Owner**   | Rawinnipa Software and Consultants |
| **Status**  | Active |
| **Next review** | October 2026 |

> If you spot an inconsistency between this document and a brand asset in the wild, this document wins. Report the mismatch to the brand owner so the asset can be corrected.
