"""
Rawinnipa Uniform Mockup Generator
Produces flat illustration mockups for company uniforms.

Garments: polo (knit collar + 3-button placket) and crew-neck tee
Colors: Deep Black, Charcoal, Off White, Rawin Green
Views: front + back
Concepts:
  01-classic      — small chest-left logo, URL on sleeve, tagline tag
  02-bold-back    — small chest logo + big back logo + tagline beneath
  03-gradient     — 3-color gradient sleeve stripe (brand signature)
  04-typography   — large RAWINNIPA wordmark, big back slogan

Total outputs: 4 concepts × 2 garments × 4 colors × 2 views = 64 PNGs
Plus 8 concept grids (1 per concept × garment)

Canvas: 1200 × 1500 per mockup
Proportions follow real garment ratios (shirt width ~ 60 cm scaled)
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import os

# =============================================================================
# BRAND TOKENS
# =============================================================================
TEAL_GREEN   = (0x23, 0xB5, 0x91)
PURE_GREEN   = (0x3E, 0xDC, 0x81)
YELLOW_GREEN = (0x9D, 0xC3, 0x51)
DEEP_BLACK   = (0x0A, 0x0A, 0x0A)
CHARCOAL     = (0x1A, 0x1A, 0x1A)
OFF_WHITE    = (0xF7, 0xF7, 0xF7)
WHITE        = (0xFF, 0xFF, 0xFF)

COLORS = {
    "black":    {"name": "Deep Black",  "hex": "#0A0A0A", "rgb": DEEP_BLACK, "ink": "white"},
    "charcoal": {"name": "Charcoal",    "hex": "#1A1A1A", "rgb": CHARCOAL,   "ink": "white"},
    "offwhite": {"name": "Off White",   "hex": "#F7F7F7", "rgb": OFF_WHITE,  "ink": "black"},
    "green":    {"name": "Rawin Green", "hex": "#3EDC81", "rgb": PURE_GREEN, "ink": "white"},
}

# Fonts (Inter not in sandbox — use Liberation Sans as proxy for rendering)
# Production embroidery/print uses real Inter — see spec sheet
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG  = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

# Logos
LOGO_DIR = "/sessions/zealous-bold-davinci/mnt/brand-book/02-logo"
LOGO_GREEN = f"{LOGO_DIR}/logo_green.png"
LOGO_WHITE = f"{LOGO_DIR}/logo_white.png"
LOGO_BLACK = f"{LOGO_DIR}/logo_black.png"
LOGO_COLOR = f"{LOGO_DIR}/logo_color.png"

OUT_DIR = "/sessions/zealous-bold-davinci/uniform_work/out"
os.makedirs(OUT_DIR, exist_ok=True)

# Canvas
CW, CH = 1200, 1500

# Background behind shirt (studio-like warm-neutral)
BG = (0xEC, 0xED, 0xEF)


# =============================================================================
# HELPERS
# =============================================================================
def font(size, bold=True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)

def load_logo(path, width):
    logo = Image.open(path).convert("RGBA")
    ratio = width / logo.width
    return logo.resize((width, int(logo.height * ratio)), Image.LANCZOS)

def text_width(draw, txt, f):
    bbox = draw.textbbox((0, 0), txt, font=f)
    return bbox[2] - bbox[0]

def choose_ink(shirt_color_key):
    """Return (ink_rgb, logo_variant, accent_rgb) for a given shirt color."""
    c = shirt_color_key
    if c == "black" or c == "charcoal":
        return WHITE, LOGO_WHITE, PURE_GREEN
    elif c == "offwhite":
        return DEEP_BLACK, LOGO_BLACK, PURE_GREEN
    elif c == "green":
        # on green background, never use green accent — all white
        return WHITE, LOGO_WHITE, WHITE
    raise ValueError(c)


# =============================================================================
# SHIRT GEOMETRY
# =============================================================================
# Shirt silhouette anchored at canvas center horizontally, with top at y=260.
# All proportions proportional to a men's M (chest 48 cm -> mapped to ~720 px
# at canvas scale). Adjustments per garment type handled in draw_shirt.

def shirt_outline(garment):
    """
    Return a list of (x, y) points defining the shirt silhouette (closed polygon),
    plus auxiliary geometry dict.
    """
    cx = CW // 2

    # Common anchor points
    top_shoulder_y     = 300
    shoulder_drop      = 60         # vertical difference between neck and shoulder top
    sleeve_end_top_y   = 370
    sleeve_end_bot_y   = 620
    armpit_y           = 660
    hem_y              = 1360

    shoulder_half_w    = 235        # distance from center to shoulder seam
    sleeve_extend_w    = 375        # distance from center to sleeve hem (wider than shoulder)
    body_half_w        = 320        # torso half-width at armpit
    hem_half_w         = 340        # hem slightly wider

    # Neck
    neck_half_w = 95
    neck_depth  = 62  # how far neck dips below top_shoulder_y

    pts = [
        # Left neck
        (cx - neck_half_w, top_shoulder_y),
        # Left shoulder seam top
        (cx - shoulder_half_w, top_shoulder_y + shoulder_drop),
        # Left sleeve end top
        (cx - sleeve_extend_w, sleeve_end_top_y),
        # Left sleeve end bottom
        (cx - sleeve_extend_w + 10, sleeve_end_bot_y),
        # Left armpit
        (cx - body_half_w, armpit_y),
        # Left side seam to hem
        (cx - hem_half_w, hem_y),
        # Right hem
        (cx + hem_half_w, hem_y),
        # Right side up to armpit
        (cx + body_half_w, armpit_y),
        # Right sleeve end bottom
        (cx + sleeve_extend_w - 10, sleeve_end_bot_y),
        # Right sleeve end top
        (cx + sleeve_extend_w, sleeve_end_top_y),
        # Right shoulder
        (cx + shoulder_half_w, top_shoulder_y + shoulder_drop),
        # Right neck
        (cx + neck_half_w, top_shoulder_y),
    ]

    geom = {
        "cx": cx,
        "top_shoulder_y": top_shoulder_y,
        "shoulder_drop": shoulder_drop,
        "neck_half_w": neck_half_w,
        "neck_depth": neck_depth,
        "shoulder_half_w": shoulder_half_w,
        "armpit_y": armpit_y,
        "body_half_w": body_half_w,
        "hem_y": hem_y,
        "hem_half_w": hem_half_w,
        "sleeve_end_top_y": sleeve_end_top_y,
        "sleeve_end_bot_y": sleeve_end_bot_y,
        "sleeve_extend_w": sleeve_extend_w,
    }
    return pts, geom


def draw_shirt_base(img, garment, color_rgb, view):
    """Draw the shirt silhouette filled with color_rgb, with subtle shading.
    Returns (geom, mask) for overlay placement."""
    d = ImageDraw.Draw(img, "RGBA")
    pts, geom = shirt_outline(garment)

    # Build a mask image (shirt shape)
    mask_img = Image.new("L", (CW, CH), 0)
    md = ImageDraw.Draw(mask_img)
    md.polygon(pts, fill=255)

    # Neck cutout — only for tee (polo: collar covers neck, no cutout needed)
    if garment == "tee":
        # Shallow elliptical cutout — not too deep, mostly contained within shirt
        cx = geom["cx"]
        nck_w = 90
        nck_d = 45
        nck_top = geom["top_shoulder_y"] + 10
        md.ellipse([cx - nck_w, nck_top, cx + nck_w, nck_top + nck_d], fill=0)

    # Fill shirt color into the masked region
    color_layer = Image.new("RGBA", (CW, CH), (*color_rgb, 255))
    img.paste(color_layer, (0, 0), mask_img)

    # Subtle vertical shading for depth (darker at sides, lighter center)
    shade = np.zeros((CH, CW, 4), dtype=np.uint8)
    xs = np.arange(CW)
    # cosine-ish shading: 1 at center, 0 at edges
    falloff = 1.0 - np.abs(xs - CW / 2) / (CW / 2)
    # Slight center highlight + edge darken
    light_amt = (falloff ** 1.5) * 18  # highlight intensity
    dark_amt  = ((1 - falloff) ** 2.5) * 28  # edge shadow
    shade_row = (light_amt - dark_amt).astype(np.int16)
    for y in range(CH):
        shade[y, :, 3] = 0  # alpha handled below

    # Apply as an overlay darken/lighten via blend
    shade_img = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    sh_pix = np.array(shade_img)
    for x in range(CW):
        val = int(shade_row[x])
        if val > 0:
            sh_pix[:, x] = [255, 255, 255, min(255, val)]
        elif val < 0:
            sh_pix[:, x] = [0, 0, 0, min(255, -val)]
    shade_overlay = Image.fromarray(sh_pix, "RGBA")
    # clip to shirt mask
    shade_only_on_shirt = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    shade_only_on_shirt.paste(shade_overlay, (0, 0), mask_img)
    img.alpha_composite(shade_only_on_shirt)

    # Seam lines — side seams, sleeve end hems, bottom hem stitch
    stitch_color = tuple(max(0, c - 30) for c in color_rgb) if sum(color_rgb) > 300 else tuple(min(255, c + 35) for c in color_rgb)
    stitch_color = stitch_color + (160,)
    d = ImageDraw.Draw(img, "RGBA")

    # Bottom hem stitch line (double stitch)
    d.line([(geom["cx"] - geom["hem_half_w"], geom["hem_y"] - 18),
            (geom["cx"] + geom["hem_half_w"], geom["hem_y"] - 18)],
           fill=stitch_color, width=2)

    # Sleeve hems
    # left
    d.line([(geom["cx"] - geom["sleeve_extend_w"], geom["sleeve_end_top_y"] + 10),
            (geom["cx"] - geom["sleeve_extend_w"] + 10, geom["sleeve_end_bot_y"] - 10)],
           fill=stitch_color, width=2)
    # right
    d.line([(geom["cx"] + geom["sleeve_extend_w"], geom["sleeve_end_top_y"] + 10),
            (geom["cx"] + geom["sleeve_extend_w"] - 10, geom["sleeve_end_bot_y"] - 10)],
           fill=stitch_color, width=2)

    # Collar / neckband
    if garment == "tee":
        # Rib neckband — slightly darker ring
        band_color = tuple(max(0, c - 22) for c in color_rgb) if sum(color_rgb) > 300 else tuple(min(255, c + 22) for c in color_rgb)
        cx = geom["cx"]
        nx1 = cx - geom["neck_half_w"] - 6
        ny1 = geom["top_shoulder_y"] - 18
        nx2 = cx + geom["neck_half_w"] + 6
        ny2 = geom["top_shoulder_y"] + geom["neck_depth"]
        d.ellipse([nx1, ny1, nx2, ny2], outline=band_color, width=6)
    elif garment == "polo":
        draw_polo_collar(img, geom, color_rgb, view)

    return geom, mask_img


def draw_polo_collar(img, geom, shirt_rgb, view):
    """Classic knit polo collar.

    Front view: two fold-down flaps meeting at a V + 3-button placket.
    Back view: simple flat neckband strip across the shoulders (no flaps/placket).
    """
    d = ImageDraw.Draw(img, "RGBA")
    cx = geom["cx"]

    # Collar color — slightly darker than shirt (knit contrast)
    if sum(shirt_rgb) > 300:
        collar_rgb = tuple(max(0, c - 25) for c in shirt_rgb)
        fold_color = tuple(max(0, c - 45) for c in shirt_rgb)
    else:
        collar_rgb = tuple(min(255, c + 22) for c in shirt_rgb)
        fold_color = tuple(min(255, c + 40) for c in shirt_rgb)

    if view == "back":
        # Back of collar — simple horizontal band sitting below the top edge
        band_top = geom["top_shoulder_y"] + 25
        band_bot = geom["top_shoulder_y"] + 80
        band_half_w = 130
        d.rounded_rectangle([cx - band_half_w, band_top,
                             cx + band_half_w, band_bot],
                            radius=14, fill=collar_rgb)
        # Fold line along the band (indicates collar fold)
        d.line([(cx - band_half_w + 10, band_top + 14),
                (cx + band_half_w - 10, band_top + 14)],
               fill=fold_color + (200,), width=2)
        # Yoke seam below collar
        yoke_y = geom["top_shoulder_y"] + 120
        d.line([(cx - geom["shoulder_half_w"] + 20, yoke_y),
                (cx + geom["shoulder_half_w"] - 20, yoke_y)],
               fill=fold_color + (110,), width=2)
        return

    # -------- FRONT view: two flaps with V + placket --------
    collar_top_y     = geom["top_shoulder_y"] + 20
    collar_bot_y     = geom["top_shoulder_y"] + 120
    v_point_y        = geom["top_shoulder_y"] + 130
    neck_half_w      = 60
    flap_outer_half_w = 140
    flap_point_offset = 18

    # Left flap
    left_flap = [
        (cx - neck_half_w,             collar_top_y),
        (cx - flap_outer_half_w,       collar_top_y + 15),
        (cx - flap_outer_half_w + 10,  collar_bot_y),
        (cx - flap_point_offset,       v_point_y),
    ]
    d.polygon(left_flap, fill=collar_rgb)

    # Right flap
    right_flap = [
        (cx + neck_half_w,             collar_top_y),
        (cx + flap_outer_half_w,       collar_top_y + 15),
        (cx + flap_outer_half_w - 10,  collar_bot_y),
        (cx + flap_point_offset,       v_point_y),
    ]
    d.polygon(right_flap, fill=collar_rgb)

    # Neckband at top
    band_rgb = tuple(max(0, c - 40) for c in shirt_rgb) if sum(shirt_rgb) > 300 else tuple(min(255, c + 35) for c in shirt_rgb)
    d.rectangle([cx - neck_half_w, collar_top_y - 6,
                 cx + neck_half_w, collar_top_y + 8],
                fill=band_rgb)

    # Fold lines along flaps
    d.line([(cx - neck_half_w + 5,            collar_top_y + 8),
            (cx - flap_point_offset - 2,      v_point_y - 3)],
           fill=fold_color + (180,), width=2)
    d.line([(cx + neck_half_w - 5,            collar_top_y + 8),
            (cx + flap_point_offset + 2,      v_point_y - 3)],
           fill=fold_color + (180,), width=2)

    # Placket + buttons
    placket_w = 36
    placket_top = v_point_y - 2
    placket_bot = v_point_y + 160
    d.rectangle([cx - placket_w // 2, placket_top,
                 cx + placket_w // 2, placket_bot],
                fill=shirt_rgb)
    edge_color = tuple(max(0, c - 30) for c in shirt_rgb) if sum(shirt_rgb) > 300 else tuple(min(255, c + 30) for c in shirt_rgb)
    d.line([(cx - placket_w // 2, placket_top),
            (cx - placket_w // 2, placket_bot)], fill=edge_color + (200,), width=2)
    d.line([(cx + placket_w // 2, placket_top),
            (cx + placket_w // 2, placket_bot)], fill=edge_color + (200,), width=2)
    button_color = (235, 235, 235) if sum(shirt_rgb) < 300 else (30, 30, 30)
    for y_off in [22, 72, 122]:
        by = placket_top + y_off
        d.ellipse([cx - 7, by - 7, cx + 7, by + 7], fill=button_color)
        d.ellipse([cx - 2, by - 2, cx + 2, by + 2], fill=shirt_rgb)


# =============================================================================
# OVERLAY COMPONENTS
# =============================================================================
def place_logo_chest_left(img, geom, logo_path, size_mm=90):
    """Place logo on left chest (wearer's left = viewer's right is irrelevant for front view — this is on the VIEWER's left since we're drawing the FRONT as seen by camera looking at wearer).
    Convention: we draw FRONT as if wearer faces camera, so 'wearer's left chest' = viewer's RIGHT.
    For simplicity we put it on the viewer's RIGHT side (wearer's left chest).
    size_mm = embroidery width (mm). Scale: 1 mm ≈ 1.3 px in this canvas.
    """
    px_w = int(size_mm * 1.3)
    logo = load_logo(logo_path, px_w)
    # Position on wearer's left chest = viewer's right
    x = geom["cx"] + 80
    y = geom["top_shoulder_y"] + 130
    img.alpha_composite(logo, (x, y))
    return (x, y, px_w, logo.height)


def place_logo_back_center(img, geom, logo_path, size_mm=220):
    """Large logo centered on upper back."""
    px_w = int(size_mm * 1.3)
    logo = load_logo(logo_path, px_w)
    x = geom["cx"] - px_w // 2
    y = geom["top_shoulder_y"] + 220
    img.alpha_composite(logo, (x, y))
    return (x, y, px_w, logo.height)


def place_sleeve_url(img, geom, side, ink, text="RAWINSOFT.COM"):
    """URL on sleeve. side: 'left' or 'right' (wearer's).
    For FRONT view: wearer's right sleeve = viewer's LEFT.
    Text rotated -15° vertical along sleeve."""
    cx = geom["cx"]
    sleeve_center_x_viewer_left  = cx - (geom["shoulder_half_w"] + geom["sleeve_extend_w"]) // 2
    sleeve_center_x_viewer_right = cx + (geom["shoulder_half_w"] + geom["sleeve_extend_w"]) // 2
    sy = (geom["sleeve_end_top_y"] + geom["sleeve_end_bot_y"]) // 2

    # For front view, let's put URL on viewer's LEFT sleeve (wearer's right)
    # Create text image on transparent, rotate
    f = font(22, bold=True)
    txt_img = Image.new("RGBA", (240, 40), (0, 0, 0, 0))
    td = ImageDraw.Draw(txt_img)
    td.text((0, 6), text, font=f, fill=(*ink, 255), spacing=3)
    rotated = txt_img.rotate(-78, expand=True)  # nearly vertical along sleeve
    # Place centered on sleeve
    if side == "viewer_left":
        px = sleeve_center_x_viewer_left - rotated.width // 2
    else:
        px = sleeve_center_x_viewer_right - rotated.width // 2
    py = sy - rotated.height // 2
    img.alpha_composite(rotated, (px, py))


def place_back_tagline(img, geom, ink):
    """Centered tagline on upper back, below big logo."""
    f = font(38, bold=True)
    d = ImageDraw.Draw(img, "RGBA")
    txt1 = "BUILD WHAT MOVES."
    tw = text_width(d, txt1, f)
    x = geom["cx"] - tw // 2
    y = geom["top_shoulder_y"] + 680
    d.text((x, y), txt1, font=f, fill=(*ink, 255), spacing=6)


def place_inner_neck_tag_overlay(img, geom, ink, garment):
    """Small tagline printed at the back neck — heat-transfer label style.

    For polo: printed on the inner neckband (visible just below the collar band).
    For tee: printed just below the ribbed neckband on the back yoke.
    """
    f = font(16, bold=True)
    d = ImageDraw.Draw(img, "RGBA")
    txt = "BUILD WHAT MOVES."
    tw = text_width(d, txt, f)
    x = geom["cx"] - tw // 2
    if garment == "polo":
        y = geom["top_shoulder_y"] + 95   # below the back collar band
    else:  # tee
        y = geom["top_shoulder_y"] + 70   # below the ribbed neck
    d.text((x, y), txt, font=f, fill=(*ink, 220), spacing=4)


def place_hem_tagline(img, geom, ink):
    """Small tagline near bottom hem, centered."""
    f = font(20, bold=True)
    d = ImageDraw.Draw(img, "RGBA")
    txt = "Build what moves."
    tw = text_width(d, txt, f)
    x = geom["cx"] - tw // 2
    y = geom["hem_y"] - 60
    d.text((x, y), txt, font=f, fill=(*ink, 220))


def draw_gradient_stripe(img, geom, view, shirt_color_key, shirt_mask):
    """Diagonal gradient stripe across shoulder — clipped to shirt silhouette.
    Brand signature 3-color gradient: teal → green → lime.
    On green shirts, switched to white gradient to avoid green-on-green."""
    stripe_len = 440
    stripe_thk = 26
    arr = np.zeros((stripe_thk, stripe_len, 4), dtype=np.uint8)
    for i in range(stripe_len):
        t = i / (stripe_len - 1)
        if t < 0.5:
            u = t / 0.5
            c1, c2 = TEAL_GREEN, PURE_GREEN
        else:
            u = (t - 0.5) / 0.5
            c1, c2 = PURE_GREEN, YELLOW_GREEN
        if shirt_color_key == "green":
            arr[:, i] = [255, 255, 255, 255]
        else:
            arr[:, i] = [
                int(c1[0] + (c2[0] - c1[0]) * u),
                int(c1[1] + (c2[1] - c1[1]) * u),
                int(c1[2] + (c2[2] - c1[2]) * u),
                255,
            ]
    # Soft end fades (alpha ramps at both ends)
    fade_px = 40
    for i in range(fade_px):
        f = i / fade_px
        arr[:, i, 3] = (arr[:, i, 3].astype(np.float32) * f).astype(np.uint8)
        arr[:, -(i + 1), 3] = (arr[:, -(i + 1), 3].astype(np.float32) * f).astype(np.uint8)

    grad = Image.fromarray(arr, "RGBA")
    rot = grad.rotate(-22, expand=True, resample=Image.BICUBIC)

    # Composite onto a temporary full-size layer, then clip to shirt mask
    temp = Image.new("RGBA", img.size, (0, 0, 0, 0))
    cx = geom["cx"]
    # Anchor so the stripe runs only across viewer-left shoulder (wearer's RIGHT),
    # ending before the chest-left logo area — avoids crossing through the logo.
    px = cx - geom["shoulder_half_w"] - geom["sleeve_extend_w"] + 40
    py = geom["top_shoulder_y"] + 20
    temp.alpha_composite(rot, (px, py))

    # Clip with shirt mask — only keep pixels where mask > 0
    # Build a 3-channel-alpha version of the mask to use as alpha modifier
    mask_arr = np.array(shirt_mask)  # L mode, 0..255
    temp_arr = np.array(temp)
    temp_arr[:, :, 3] = (temp_arr[:, :, 3].astype(np.int32) *
                         mask_arr.astype(np.int32) // 255).astype(np.uint8)
    clipped = Image.fromarray(temp_arr, "RGBA")
    img.alpha_composite(clipped)


def draw_wordmark_chest(img, geom, ink, accent):
    """Big 'RAWINNIPA' wordmark across chest — concept 4."""
    d = ImageDraw.Draw(img, "RGBA")
    f_main = font(58, bold=True)
    f_dot = font(58, bold=True)
    word = "RAWINNIPA"
    tw = text_width(d, word, f_main)
    x = geom["cx"] - tw // 2
    y = geom["top_shoulder_y"] + 260
    d.text((x, y), word, font=f_main, fill=(*ink, 255), spacing=6)
    # Small green dot at end
    dot_x = x + tw + 12
    dot_y = y + 38
    d.ellipse([dot_x, dot_y, dot_x + 18, dot_y + 18], fill=(*accent, 255))


def draw_back_slogan_huge(img, geom, ink):
    """Big 'BUILD WHAT MOVES.' on back — concept 4."""
    d = ImageDraw.Draw(img, "RGBA")
    f = font(72, bold=True)
    lines = ["BUILD", "WHAT", "MOVES."]
    y = geom["top_shoulder_y"] + 280
    for line in lines:
        tw = text_width(d, line, f)
        d.text((geom["cx"] - tw // 2, y), line, font=f, fill=(*ink, 255), spacing=6)
        y += 90


# =============================================================================
# CONCEPT COMPOSITIONS
# =============================================================================
def concept_classic(img, geom, view, color_key, garment, mask):
    ink, logo_path, accent = choose_ink(color_key)
    if view == "front":
        place_logo_chest_left(img, geom, logo_path, size_mm=90)
        place_sleeve_url(img, geom, "viewer_left", ink)
    else:  # back
        place_inner_neck_tag_overlay(img, geom, ink, garment)
        place_sleeve_url(img, geom, "viewer_right", ink)


def concept_bold_back(img, geom, view, color_key, garment, mask):
    ink, logo_path, accent = choose_ink(color_key)
    if view == "front":
        place_logo_chest_left(img, geom, logo_path, size_mm=90)
        place_sleeve_url(img, geom, "viewer_left", ink)
    else:
        place_logo_back_center(img, geom, logo_path, size_mm=220)
        place_back_tagline(img, geom, ink)


def concept_gradient(img, geom, view, color_key, garment, mask):
    ink, logo_path, accent = choose_ink(color_key)
    if view == "front":
        place_logo_chest_left(img, geom, logo_path, size_mm=90)
        draw_gradient_stripe(img, geom, view, color_key, mask)
        place_hem_tagline(img, geom, ink)
    else:
        draw_gradient_stripe(img, geom, view, color_key, mask)
        place_inner_neck_tag_overlay(img, geom, ink, garment)


def concept_typography(img, geom, view, color_key, garment, mask):
    ink, logo_path, accent = choose_ink(color_key)
    if view == "front":
        draw_wordmark_chest(img, geom, ink, accent)
    else:
        draw_back_slogan_huge(img, geom, ink)


CONCEPTS = {
    "01-classic":    {"name": "Classic",      "fn": concept_classic,    "note": "Chest-left logo + sleeve URL + inner-neck tagline"},
    "02-bold-back":  {"name": "Bold Back",    "fn": concept_bold_back,  "note": "Small chest logo + big back logo + tagline"},
    "03-gradient":   {"name": "Gradient",     "fn": concept_gradient,   "note": "Signature 3-color stripe on shoulder + hem tagline"},
    "04-typography": {"name": "Typography",   "fn": concept_typography, "note": "RAWINNIPA wordmark across chest + huge back slogan"},
}


# =============================================================================
# RENDER ONE MOCKUP
# =============================================================================
def render_mockup(concept_key, garment, color_key, view):
    # Background studio backdrop
    img = Image.new("RGBA", (CW, CH), (*BG, 255))

    # Subtle floor shadow
    sh = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.ellipse([CW // 2 - 380, CH - 110, CW // 2 + 380, CH - 30],
               fill=(0, 0, 0, 50))
    sh = sh.filter(ImageFilter.GaussianBlur(radius=18))
    img.alpha_composite(sh)

    color_rgb = COLORS[color_key]["rgb"]
    geom, mask = draw_shirt_base(img, garment, color_rgb, view)

    # Expand mask to include collar area for polo (so overlays near collar are clipped naturally)
    full_mask = mask.copy()
    if garment == "polo":
        # Add a generous rectangle around the collar area to the mask
        fmd = ImageDraw.Draw(full_mask)
        cx = geom["cx"]
        fmd.rectangle([cx - 150, geom["top_shoulder_y"] + 20,
                       cx + 150, geom["top_shoulder_y"] + 140], fill=255)

    # Apply concept overlay
    CONCEPTS[concept_key]["fn"](img, geom, view, color_key, garment, full_mask)

    # Label strip at bottom (small, for reference — NOT printed on shirt)
    d = ImageDraw.Draw(img, "RGBA")
    lf = font(18, bold=True)
    label = f"{CONCEPTS[concept_key]['name'].upper()}  ·  {garment.upper()}  ·  {COLORS[color_key]['name'].upper()}  ·  {view.upper()}"
    tw = text_width(d, label, lf)
    d.text((CW // 2 - tw // 2, CH - 40), label, font=lf, fill=(80, 80, 80, 255), spacing=3)

    return img


# =============================================================================
# CONCEPT GRID (4 colors × 2 views for one concept+garment)
# =============================================================================
def render_concept_grid(concept_key, garment):
    """4 colors × 2 views grid — useful for the design deck."""
    cols = 4
    rows = 2  # front row, back row
    cell_w = CW // 2
    cell_h = CH // 2
    grid = Image.new("RGBA", (cols * cell_w, rows * cell_h + 90), (*WHITE, 255))
    # Header
    d = ImageDraw.Draw(grid, "RGBA")
    hf = font(36, bold=True)
    sf = font(18, bold=False)
    d.text((40, 20), f"{CONCEPTS[concept_key]['name']} — {garment.capitalize()}",
           font=hf, fill=(*DEEP_BLACK, 255))
    d.text((40, 62), CONCEPTS[concept_key]["note"], font=sf, fill=(80, 80, 80, 255))

    color_keys = ["black", "charcoal", "offwhite", "green"]
    for col, ck in enumerate(color_keys):
        for row, view in enumerate(["front", "back"]):
            mockup = render_mockup(concept_key, garment, ck, view)
            thumb = mockup.resize((cell_w, cell_h), Image.LANCZOS)
            grid.paste(thumb, (col * cell_w, 90 + row * cell_h))

    return grid


# =============================================================================
# MAIN
# =============================================================================
def main():
    import sys
    total = 0
    for ck in CONCEPTS:
        for garment in ["polo", "tee"]:
            for color_key in COLORS:
                for view in ["front", "back"]:
                    img = render_mockup(ck, garment, color_key, view)
                    fname = f"{ck}_{garment}_{color_key}_{view}.png"
                    path = os.path.join(OUT_DIR, fname)
                    img.convert("RGB").save(path, "PNG", optimize=True)
                    total += 1
                    print(f"  ✓ {fname}")
            # concept grid
            grid = render_concept_grid(ck, garment)
            gpath = os.path.join(OUT_DIR, f"{ck}_{garment}_GRID.png")
            grid.convert("RGB").save(gpath, "PNG", optimize=True)
            print(f"  ▣ {ck}_{garment}_GRID.png")
    print(f"\nDone — {total} mockups + 8 grids.")


if __name__ == "__main__":
    main()
