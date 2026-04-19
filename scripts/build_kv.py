"""
Rawinnipa Brand Key Visuals Generator
Produces a set of hero images for website, social media, and marketing use.

Design concept:
- Dark canvas (#0A0A0A) with subtle green radial glow around logo position
- Big "Build what moves." tagline as primary hero element
- Logo as focal point with gradient bloom
- Signature 3-color gradient strip as brand continuity accent
- Minimal: tagline + logo + URL + accent

Formats produced:
  1. Hero 16:9           1920 × 1080   (website, pitch cover, thumbnail)
  2. LinkedIn Banner     1584 ×  396   (company page header)
  3. Facebook Cover      1640 ×  624   (page cover)
  4. Instagram Square    1080 × 1080   (feed post)
  5. Instagram Story     1080 × 1920   (stories / reels cover)
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# =============================================================================
# BRAND TOKENS
# =============================================================================
TEAL_GREEN   = (0x23, 0xB5, 0x91)
PURE_GREEN   = (0x3E, 0xDC, 0x81)
YELLOW_GREEN = (0x9D, 0xC3, 0x51)
DEEP_BLACK   = (0x0A, 0x0A, 0x0A)
CHARCOAL     = (0x1A, 0x1A, 0x1A)
WHITE        = (0xFF, 0xFF, 0xFF)
SUBTLE_GRAY  = (0xD1, 0xD5, 0xDB)
LIGHT_GRAY   = (0x9C, 0xA3, 0xAF)

FONT_BOLD    = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FONT_REG     = "/usr/share/fonts/opentype/inter/Inter-Regular.otf"

LOGO_COLOR   = "/home/claude/brand_ci/assets/logo_color.png"
LOGO_WHITE   = "/home/claude/brand_ci/assets/logo_white.png"

OUT_DIR      = "/home/claude/brand_ci/kv"
os.makedirs(OUT_DIR, exist_ok=True)


# =============================================================================
# HELPERS
# =============================================================================
def font(size, bold=True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)

def load_logo(path, width):
    """Load logo and resize to target width preserving aspect ratio."""
    logo = Image.open(path).convert("RGBA")
    ratio = width / logo.width
    return logo.resize((width, int(logo.height * ratio)), Image.LANCZOS)

def draw_gradient_glow(img, center_x, center_y, radius, color=(62, 220, 129), max_alpha=120):
    """
    Smooth radial glow centered at (center_x, center_y).
    Uses a numpy distance field for banding-free falloff, then blurs lightly.
    """
    import numpy as np
    W, H = img.size
    # Distance field
    ys, xs = np.meshgrid(np.arange(H), np.arange(W), indexing="ij")
    dist = np.sqrt((xs - center_x) ** 2 + (ys - center_y) ** 2)
    # Normalised distance, clipped so anything beyond `radius` is zero alpha
    t = np.clip(1.0 - dist / radius, 0.0, 1.0)
    # Quadratic falloff for a bloom-like curve
    alpha = (t ** 2.2) * max_alpha
    alpha = alpha.astype(np.uint8)

    # Build RGBA layer
    layer = np.zeros((H, W, 4), dtype=np.uint8)
    layer[..., 0] = color[0]
    layer[..., 1] = color[1]
    layer[..., 2] = color[2]
    layer[..., 3] = alpha

    glow = Image.fromarray(layer, mode="RGBA")
    # Light blur to completely eliminate any residual banding
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(8, radius // 40)))
    img.alpha_composite(glow)

def draw_gradient_strip(img, x, y, w, h, vertical=False):
    """Draw the signature 3-color gradient strip (teal → pure → lime)."""
    # Build horizontally, optionally rotate later
    strip = Image.new("RGB", (w if not vertical else h, h if not vertical else w), DEEP_BLACK)
    sd = ImageDraw.Draw(strip)
    length = strip.width
    for i in range(length):
        t = i / (length - 1)
        if t < 0.5:
            u = t / 0.5
            c1, c2 = TEAL_GREEN, PURE_GREEN
        else:
            u = (t - 0.5) / 0.5
            c1, c2 = PURE_GREEN, YELLOW_GREEN
        r = int(c1[0] + (c2[0] - c1[0]) * u)
        g = int(c1[1] + (c2[1] - c1[1]) * u)
        b = int(c1[2] + (c2[2] - c1[2]) * u)
        sd.rectangle([i, 0, i + 1, strip.height], fill=(r, g, b))
    if vertical:
        strip = strip.rotate(90, expand=True)
    img.paste(strip, (x, y))

def text_width(draw, text, f):
    """Measure width of text in pixels."""
    bbox = draw.textbbox((0, 0), text, font=f)
    return bbox[2] - bbox[0]

def draw_mixed(draw, xy, text, thai_font, latin_font, fill):
    """
    Render a string that contains both Thai and Latin/digits/punctuation,
    switching fonts per-run. Thai glyphs go to thai_font, everything else
    (A-Z, a-z, 0-9, punctuation, spaces) goes to latin_font.
    """
    def is_thai(ch):
        # Thai Unicode block U+0E00..U+0E7F
        return "\u0e00" <= ch <= "\u0e7f"

    # Split into runs by script
    runs = []
    if not text:
        return
    cur = [text[0]]
    cur_thai = is_thai(text[0])
    for ch in text[1:]:
        t = is_thai(ch)
        if t == cur_thai:
            cur.append(ch)
        else:
            runs.append(("".join(cur), cur_thai))
            cur = [ch]
            cur_thai = t
    runs.append(("".join(cur), cur_thai))

    # Render each run, advancing x
    x, y = xy
    for seg, seg_thai in runs:
        f = thai_font if seg_thai else latin_font
        draw.text((x, y), seg, font=f, fill=fill)
        x += text_width(draw, seg, f)

def add_corner_accent(img, corner="br", size=80):
    """Small green square accent in the specified corner."""
    W, H = img.size
    d = ImageDraw.Draw(img, "RGBA")
    if corner == "br":
        x, y = W - size - 60, H - size - 60
    elif corner == "tl":
        x, y = 60, 60
    elif corner == "tr":
        x, y = W - size - 60, 60
    else:  # bl
        x, y = 60, H - size - 60
    d.rectangle([x, y, x + size, y + size], fill=(*PURE_GREEN, 255))


# =============================================================================
# 1. HERO 16:9 — 1920 × 1080
# =============================================================================
def kv_hero_16x9():
    W, H = 1920, 1080
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Radial glow on the right side where logo sits
    draw_gradient_glow(img, center_x=int(W * 0.72), center_y=int(H * 0.5),
                       radius=600, color=PURE_GREEN, max_alpha=90)
    draw_gradient_glow(img, center_x=int(W * 0.78), center_y=int(H * 0.4),
                       radius=380, color=TEAL_GREEN, max_alpha=60)

    # 3-color gradient strip on the far left (thin vertical)
    draw_gradient_strip(img, x=0, y=0, w=12, h=H, vertical=True)

    d = ImageDraw.Draw(img)

    # Eyebrow
    eyebrow_f = font(20, bold=True)
    d.text((80, 90), "SOFTWARE  ·  CONSULTING  ·  AI  ·  WEB3",
           font=eyebrow_f, fill=PURE_GREEN, spacing=4)

    # Big tagline — "Build what moves."
    tagline_f = font(180, bold=True)
    d.text((80, 380), "Build what", font=tagline_f, fill=WHITE)
    d.text((80, 580), "moves.", font=tagline_f, fill=PURE_GREEN)

    # Subline
    sub_f = font(28, bold=False)
    d.text((80, 820),
           "Rawinnipa builds production systems that hold up long after launch day.",
           font=sub_f, fill=SUBTLE_GRAY)

    # Bottom-left URL
    url_f = font(22, bold=True)
    d.text((80, 960), "RAWINSOFT.COM", font=url_f, fill=WHITE, spacing=4)

    # Bottom-right info
    info_f = font(16, bold=False)
    d.text((W - 480, 960), "Bangkok  ·  est. 2014  ·  50+ projects shipped",
           font=info_f, fill=LIGHT_GRAY)

    # Logo on the right
    logo_w = 520
    logo = load_logo(LOGO_COLOR, logo_w)
    logo_x = W - logo_w - 180
    logo_y = (H - logo.height) // 2
    img.alpha_composite(logo, (logo_x, logo_y))

    # Save
    out = os.path.join(OUT_DIR, "kv_hero_1920x1080.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 2. LINKEDIN BANNER — 1584 × 396
# =============================================================================
def kv_linkedin_banner():
    W, H = 1584, 396
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Radial glow around logo (right)
    draw_gradient_glow(img, center_x=int(W * 0.82), center_y=H // 2,
                       radius=280, color=PURE_GREEN, max_alpha=80)

    # Thin gradient strip top
    draw_gradient_strip(img, x=0, y=0, w=W, h=5, vertical=False)

    d = ImageDraw.Draw(img)

    # Tagline (compact)
    tag_f = font(78, bold=True)
    d.text((70, 100), "Build what moves.", font=tag_f, fill=WHITE)

    # Subline
    sub_f = font(22, bold=False)
    d.text((70, 210),
           "Software and consulting partners, Bangkok.",
           font=sub_f, fill=SUBTLE_GRAY)

    # Eyebrow
    eye_f = font(16, bold=True)
    d.text((70, 260), "WEB3  ·  AI  ·  ENTERPRISE  ·  12+ YEARS",
           font=eye_f, fill=PURE_GREEN, spacing=3)

    # URL pill
    url_f = font(17, bold=True)
    d.text((70, 320), "RAWINSOFT.COM  →", font=url_f, fill=WHITE, spacing=4)

    # Logo (right)
    logo_h = 220
    logo = load_logo(LOGO_COLOR, logo_h)
    logo_x = W - logo_h - 120
    logo_y = (H - logo.height) // 2
    img.alpha_composite(logo, (logo_x, logo_y))

    out = os.path.join(OUT_DIR, "kv_linkedin_1584x396.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 3. FACEBOOK COVER — 1640 × 624
# =============================================================================
def kv_facebook_cover():
    W, H = 1640, 624
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Glow behind logo
    draw_gradient_glow(img, center_x=int(W * 0.76), center_y=H // 2,
                       radius=380, color=PURE_GREEN, max_alpha=85)

    # Vertical gradient on the far right edge (signature accent)
    draw_gradient_strip(img, x=W - 8, y=0, w=8, h=H, vertical=True)

    d = ImageDraw.Draw(img)

    # Eyebrow
    eye_f = font(18, bold=True)
    d.text((80, 110), "SOFTWARE AND CONSULTANTS",
           font=eye_f, fill=PURE_GREEN, spacing=5)

    # Tagline
    tag_f = font(108, bold=True)
    d.text((80, 160), "Build what moves.", font=tag_f, fill=WHITE)

    # Subline
    sub_f = font(24, bold=False)
    d.text((80, 320),
           "We design, build, and operate production systems",
           font=sub_f, fill=SUBTLE_GRAY)
    d.text((80, 358),
           "that hold up long after launch day.",
           font=sub_f, fill=SUBTLE_GRAY)

    # Services chips
    chips = ["WEB3", "AI/AUTOMATION", "ENTERPRISE", "UX/UI"]
    chip_f = font(14, bold=True)
    cx = 80
    for c in chips:
        w = text_width(d, c, chip_f) + 28
        d.rounded_rectangle([cx, 430, cx + w, 462], radius=6,
                            outline=PURE_GREEN, width=1)
        d.text((cx + 14, 438), c, font=chip_f, fill=PURE_GREEN, spacing=3)
        cx += w + 10

    # URL
    url_f = font(18, bold=True)
    d.text((80, 530), "RAWINSOFT.COM", font=url_f, fill=WHITE, spacing=4)

    # Logo right
    logo_h = 340
    logo = load_logo(LOGO_COLOR, logo_h)
    logo_x = W - logo_h - 140
    logo_y = (H - logo.height) // 2
    img.alpha_composite(logo, (logo_x, logo_y))

    out = os.path.join(OUT_DIR, "kv_facebook_1640x624.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 4. INSTAGRAM SQUARE — 1080 × 1080
# =============================================================================
def kv_instagram_square():
    W, H = 1080, 1080
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Big centered glow
    draw_gradient_glow(img, center_x=W // 2, center_y=int(H * 0.35),
                       radius=500, color=PURE_GREEN, max_alpha=100)

    # Gradient strip top and bottom
    draw_gradient_strip(img, x=0, y=0, w=W, h=8, vertical=False)
    draw_gradient_strip(img, x=0, y=H - 8, w=W, h=8, vertical=False)

    d = ImageDraw.Draw(img)

    # Logo centered in upper third
    logo_w = 300
    logo = load_logo(LOGO_COLOR, logo_w)
    img.alpha_composite(logo, ((W - logo.width) // 2, 140))

    # Eyebrow below logo
    eye_f = font(18, bold=True)
    eye_txt = "SOFTWARE  ·  CONSULTING"
    d.text(((W - text_width(d, eye_txt, eye_f)) // 2, 480),
           eye_txt, font=eye_f, fill=PURE_GREEN, spacing=6)

    # Big tagline centered
    tag_f = font(92, bold=True)
    t1 = "Build what"
    d.text(((W - text_width(d, t1, tag_f)) // 2, 550),
           t1, font=tag_f, fill=WHITE)
    t2 = "moves."
    d.text(((W - text_width(d, t2, tag_f)) // 2, 660),
           t2, font=tag_f, fill=PURE_GREEN)

    # Subline
    sub_f = font(22, bold=False)
    sub = "Rawinnipa Software and Consultants"
    d.text(((W - text_width(d, sub, sub_f)) // 2, 820),
           sub, font=sub_f, fill=SUBTLE_GRAY)

    # URL + years
    url_f = font(20, bold=True)
    url = "RAWINSOFT.COM"
    d.text(((W - text_width(d, url, url_f)) // 2, 880),
           url, font=url_f, fill=WHITE, spacing=5)

    out = os.path.join(OUT_DIR, "kv_instagram_square_1080x1080.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 5. INSTAGRAM STORY — 1080 × 1920
# =============================================================================
def kv_instagram_story():
    W, H = 1080, 1920
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Big upper glow
    draw_gradient_glow(img, center_x=W // 2, center_y=int(H * 0.28),
                       radius=600, color=PURE_GREEN, max_alpha=100)
    # Subtle second glow
    draw_gradient_glow(img, center_x=int(W * 0.7), center_y=int(H * 0.2),
                       radius=350, color=TEAL_GREEN, max_alpha=50)

    # Gradient strips at top/bottom for brand frame
    draw_gradient_strip(img, x=0, y=0, w=W, h=10, vertical=False)
    draw_gradient_strip(img, x=0, y=H - 10, w=W, h=10, vertical=False)

    d = ImageDraw.Draw(img)

    # Logo — prominent at top
    logo_w = 360
    logo = load_logo(LOGO_COLOR, logo_w)
    img.alpha_composite(logo, ((W - logo.width) // 2, 300))

    # Eyebrow
    eye_f = font(22, bold=True)
    eye_txt = "RAWINNIPA"
    d.text(((W - text_width(d, eye_txt, eye_f)) // 2, 720),
           eye_txt, font=eye_f, fill=PURE_GREEN, spacing=8)

    # Big tagline centered mid
    tag_f = font(120, bold=True)
    t1 = "Build"
    d.text(((W - text_width(d, t1, tag_f)) // 2, 820),
           t1, font=tag_f, fill=WHITE)
    t2 = "what"
    d.text(((W - text_width(d, t2, tag_f)) // 2, 960),
           t2, font=tag_f, fill=WHITE)
    t3 = "moves."
    d.text(((W - text_width(d, t3, tag_f)) // 2, 1100),
           t3, font=tag_f, fill=PURE_GREEN)

    # Subline
    sub_f = font(28, bold=False)
    subs = [
        "Software and consulting partners.",
        "Bangkok. Est. 2014. 12+ years.",
    ]
    y = 1320
    for s in subs:
        d.text(((W - text_width(d, s, sub_f)) // 2, y),
               s, font=sub_f, fill=SUBTLE_GRAY)
        y += 44

    # Services chips
    chips = ["WEB3", "AI", "ENTERPRISE", "UX/UI"]
    chip_f = font(16, bold=True)
    chip_widths = [text_width(d, c, chip_f) + 32 for c in chips]
    total_w = sum(chip_widths) + (len(chips) - 1) * 14
    cx = (W - total_w) // 2
    for c, cw in zip(chips, chip_widths):
        d.rounded_rectangle([cx, 1480, cx + cw, 1520], radius=8,
                            outline=PURE_GREEN, width=2)
        d.text((cx + 16, 1488), c, font=chip_f, fill=PURE_GREEN, spacing=3)
        cx += cw + 14

    # URL bottom
    url_f = font(30, bold=True)
    url = "RAWINSOFT.COM"
    d.text(((W - text_width(d, url, url_f)) // 2, 1680),
           url, font=url_f, fill=WHITE, spacing=6)

    out = os.path.join(OUT_DIR, "kv_instagram_story_1080x1920.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# MAIN
# =============================================================================
# =============================================================================
# 6. YOUTUBE CHANNEL ART — 2560 × 1440
#    Safe area for all devices: center 1546 × 423 px
# =============================================================================
def kv_youtube_channel_art():
    W, H = 2560, 1440
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Wide centered glow
    draw_gradient_glow(img, center_x=W // 2, center_y=H // 2,
                       radius=900, color=PURE_GREEN, max_alpha=90)
    draw_gradient_glow(img, center_x=int(W * 0.3), center_y=int(H * 0.35),
                       radius=500, color=TEAL_GREEN, max_alpha=60)

    # Gradient strips top and bottom
    draw_gradient_strip(img, x=0, y=0, w=W, h=12, vertical=False)
    draw_gradient_strip(img, x=0, y=H - 12, w=W, h=12, vertical=False)

    d = ImageDraw.Draw(img)

    # Safe area is W/2 ± 773px horizontally, H/2 ± 211px vertically
    cx, cy = W // 2, H // 2

    # Logo centered, slightly left
    logo_w = 260
    logo = load_logo(LOGO_COLOR, logo_w)
    img.alpha_composite(logo, (cx - 550, cy - logo.height // 2))

    # Text content on the right of logo
    tag_f = font(88, bold=True)
    d.text((cx - 250, cy - 110), "Build what moves.", font=tag_f, fill=WHITE)

    eye_f = font(22, bold=True)
    d.text((cx - 250, cy - 155),
           "RAWINNIPA  /  SOFTWARE & CONSULTING",
           font=eye_f, fill=PURE_GREEN, spacing=5)

    sub_f = font(26, bold=False)
    d.text((cx - 250, cy + 20),
           "Deep-dives on Web3, AI automation, and building",
           font=sub_f, fill=SUBTLE_GRAY)
    d.text((cx - 250, cy + 56),
           "production systems that hold up long after launch.",
           font=sub_f, fill=SUBTLE_GRAY)

    url_f = font(22, bold=True)
    d.text((cx - 250, cy + 130),
           "SUBSCRIBE  ·  RAWINSOFT.COM",
           font=url_f, fill=WHITE, spacing=5)

    out = os.path.join(OUT_DIR, "kv_youtube_2560x1440.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 7. TWITTER / X BANNER — 1500 × 500
# =============================================================================
def kv_twitter_banner():
    W, H = 1500, 500
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Glow around logo area
    draw_gradient_glow(img, center_x=int(W * 0.8), center_y=H // 2,
                       radius=350, color=PURE_GREEN, max_alpha=90)

    # Thin gradient strip bottom
    draw_gradient_strip(img, x=0, y=H - 6, w=W, h=6, vertical=False)

    d = ImageDraw.Draw(img)

    # NOTE: Twitter/X avatar overlays bottom-left of banner — keep that corner clear
    # Safe content starts ~180px from left

    # Eyebrow
    eye_f = font(20, bold=True)
    d.text((80, 90), "SOFTWARE  ·  CONSULTING  ·  WEB3  ·  AI",
           font=eye_f, fill=PURE_GREEN, spacing=4)

    # Tagline
    tag_f = font(88, bold=True)
    d.text((80, 150), "Build what moves.", font=tag_f, fill=WHITE)

    # Subline
    sub_f = font(24, bold=False)
    d.text((80, 270),
           "Production systems that hold up long after launch day.",
           font=sub_f, fill=SUBTLE_GRAY)

    url_f = font(20, bold=True)
    d.text((80, 340), "RAWINSOFT.COM  →", font=url_f, fill=WHITE, spacing=4)

    # Logo on right
    logo_h = 280
    logo = load_logo(LOGO_COLOR, logo_h)
    logo_x = W - logo_h - 120
    logo_y = (H - logo.height) // 2
    img.alpha_composite(logo, (logo_x, logo_y))

    out = os.path.join(OUT_DIR, "kv_twitter_1500x500.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 8. EMAIL HEADER — 1200 × 400 (for newsletter / marketing emails)
# =============================================================================
def kv_email_header():
    W, H = 1200, 400
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    # Glow behind logo
    draw_gradient_glow(img, center_x=int(W * 0.82), center_y=H // 2,
                       radius=260, color=PURE_GREEN, max_alpha=85)

    # Gradient strip top (brand marker)
    draw_gradient_strip(img, x=0, y=0, w=W, h=6, vertical=False)

    d = ImageDraw.Draw(img)

    # Small wordmark top-left
    wm_f = font(18, bold=True)
    d.text((50, 50), "RAWINNIPA", font=wm_f, fill=WHITE, spacing=4)
    tag_f = font(14, bold=True)
    d.text((50, 78), "SOFTWARE AND CONSULTANTS",
           font=tag_f, fill=PURE_GREEN, spacing=3)

    # Main tagline
    main_f = font(64, bold=True)
    d.text((50, 160), "Build what moves.", font=main_f, fill=WHITE)

    # Subline
    sub_f = font(20, bold=False)
    d.text((50, 250),
           "Software and consulting partners for the digital age.",
           font=sub_f, fill=SUBTLE_GRAY)

    # URL
    url_f = font(16, bold=True)
    d.text((50, 320), "RAWINSOFT.COM  →", font=url_f, fill=WHITE, spacing=4)

    # Logo right
    logo_h = 220
    logo = load_logo(LOGO_COLOR, logo_h)
    logo_x = W - logo_h - 90
    logo_y = (H - logo.height) // 2
    img.alpha_composite(logo, (logo_x, logo_y))

    out = os.path.join(OUT_DIR, "kv_email_header_1200x400.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


# =============================================================================
# 9. HERO 16:9 — THAI VARIANT (bilingual: Thai tagline + Latin logo/URL)
# =============================================================================
def kv_hero_thai():
    W, H = 1920, 1080
    img = Image.new("RGBA", (W, H), (*DEEP_BLACK, 255))

    NOTO_BOLD = "/usr/share/fonts/truetype/noto/NotoSansThai-Bold.ttf"
    NOTO_REG  = "/usr/share/fonts/truetype/noto/NotoSansThai-Regular.ttf"
    def thfont(size, bold=True):
        return ImageFont.truetype(NOTO_BOLD if bold else NOTO_REG, size)

    # Glow
    draw_gradient_glow(img, center_x=int(W * 0.72), center_y=int(H * 0.5),
                       radius=600, color=PURE_GREEN, max_alpha=90)
    draw_gradient_glow(img, center_x=int(W * 0.78), center_y=int(H * 0.4),
                       radius=380, color=TEAL_GREEN, max_alpha=60)

    # Gradient strip left
    draw_gradient_strip(img, x=0, y=0, w=12, h=H, vertical=True)

    d = ImageDraw.Draw(img)

    # Eyebrow — mixed Thai + Latin ("AI", "WEB3")
    draw_mixed(d, (80, 90),
               "ซอฟต์แวร์  ·  ที่ปรึกษา  ·  AI  ·  WEB3",
               thfont(22, bold=True), font(22, bold=True), PURE_GREEN)

    # Thai tagline — pure Thai
    tag_f = thfont(120, bold=True)
    d.text((80, 340), "สร้างระบบ", font=tag_f, fill=WHITE)
    d.text((80, 510), "ที่ขับเคลื่อน", font=tag_f, fill=WHITE)
    # "ธุรกิจ" in green, the period in Inter (Noto Thai lacks a ".")
    d.text((80, 680), "ธุรกิจ", font=tag_f, fill=PURE_GREEN)
    thai_w = text_width(d, "ธุรกิจ", tag_f)
    d.text((80 + thai_w, 680), ".", font=font(120, bold=True), fill=PURE_GREEN)

    # Subline — mixed ("Rawinnipa" is Latin)
    draw_mixed(d, (80, 890),
               "Rawinnipa ออกแบบ พัฒนา และดูแลระบบที่ทำงานได้จริงในระยะยาว",
               thfont(28, bold=False), font(28, bold=False), SUBTLE_GRAY)

    # URL — pure Latin
    d.text((80, 970), "RAWINSOFT.COM",
           font=font(22, bold=True), fill=WHITE, spacing=4)

    # Info right — mixed Thai + Latin digits
    draw_mixed(d, (W - 560, 970),
               "กรุงเทพฯ  ·  ก่อตั้งปี 2014  ·  50+ โปรเจกต์",
               thfont(18, bold=False), font(18, bold=False), LIGHT_GRAY)

    # Logo right
    logo_w = 520
    logo = load_logo(LOGO_COLOR, logo_w)
    logo_x = W - logo_w - 180
    logo_y = (H - logo.height) // 2
    img.alpha_composite(logo, (logo_x, logo_y))

    out = os.path.join(OUT_DIR, "kv_hero_thai_1920x1080.png")
    img.convert("RGB").save(out, "PNG", optimize=True)
    print(f"✓ {out}  ({W}×{H})")


if __name__ == "__main__":
    kv_hero_16x9()
    kv_linkedin_banner()
    kv_facebook_cover()
    kv_instagram_square()
    kv_instagram_story()
    kv_youtube_channel_art()
    kv_twitter_banner()
    kv_email_header()
    kv_hero_thai()
    print("\nAll key visuals generated in:", OUT_DIR)
