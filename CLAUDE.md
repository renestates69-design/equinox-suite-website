# Equinox Suite Website — Project Memory

## Owner
- **Name**: René Heinz
- **Email**: rene@equinox-suite.com (forwards to renestates69@gmail.com via Cloudflare Email Routing)
- **Phone**: +34 616 689 500
- **Location**: Ibiza, Spain

## Domain & Hosting
- **Domain**: equinox-suite.com
- **Registrar**: Cloudflare (nameservers: ADEL.NS.CLOUDFLARE.COM, RUBEN.NS.CLOUDFLARE.COM)
- **Current hosting**: HubSpot (being migrated away)
- **Target hosting**: Cloudflare Pages (free, already on Cloudflare)
- **DNS**: Managed in Cloudflare — A records still point to HubSpot (199.60.103.169, 199.60.103.69), need to be changed when deploying
- **SSL**: Cloudflare automatic SSL/TLS
- **Email**: Cloudflare Email Routing — ALREADY SET UP AND VERIFIED. Destination: renestates69@gmail.com. DO NOT ask about this again.

## Stripe Payment Links
- **Ibiza Luxury Property Market Report 2025** (€149): https://buy.stripe.com/bJe9AUbbEc7KgPK93l6EU00
- **The AllSensed (novel)**: https://buy.stripe.com/bJe00kfrUdbOfLGcfx6EU01

## Project Structure
```
/Users/ghlfrontdesk/Documents/equinox-suite-website/
├── index.html              # Landing page — hero with mandala, title, infinity symbol, 4 section buttons
├── intelligence.html       # Intelligence reports page — example reports + email CTA
├── publications.html       # Publications — AllSensed novel + Ibiza Report with Stripe links
├── real-estate.html        # Equinox Home — property listings with email enquiry buttons
├── las-lluvias.html        # Las Lluvias de Ibiza — rainwater project (light/cream theme)
├── style.css               # Global stylesheet — all design tokens, components, responsive
├── serve.py                # Local development server (python3 HTTP server on port 8080)
├── CLAUDE.md               # This file — project memory
└── images/
    ├── mandala-transparent.png    # Geodesic sphere mandala logo (background removed)
    ├── mandala-small.png          # Small mandala for use as "O" in EQUINOX SUITE title
    ├── infinity-transparent.png   # Möbius/infinity symbol (background removed, cropped)
    ├── the-allsensed-cover.png    # The AllSensed novel cover image
    ├── allsensed-art.webp         # Sci-fi art for AllSensed (bioluminescent cityscape)
    ├── Beach-Front-1170x768.jpeg  # Beach property image for Ibiza Report
    ├── property-1.png             # Property listing image 1
    ├── property-2.jpg             # Property listing image 2 (Casa Lichtenstein)
    └── property-3.jpeg            # Property listing image 3
```

## Design System

### Fonts
- **Headings**: Cormorant Garamond (serif) — light weight, wide letter-spacing
- **Body/Buttons/Nav**: Montserrat (sans-serif) — light to regular weight
- René confirmed: "font is Montserrat"

### Colors (CSS Custom Properties)
- `--navy`: #243b53
- `--teal`: #2a4a3e
- `--dark-gradient`: linear-gradient(160deg, #2a4560 → #325770 → #2f5548 → #274a38)
- `--silver`: #e0e5ed (main text on dark)
- `--silver-light`: #f0f2f6
- `--cream`: #f7f4ef (Las Lluvias light theme background)
- `--glass`: rgba(255,255,255,0.09) (frosted glass effect)
- `--glass-border`: rgba(255,255,255,0.18)

### Design Rules (from feedback_design_system.md)
- **Strict**: Linen background, Montserrat font, navy/grey only
- **NO gold, orange, or red** in the design
- No internal language or unauthorized client references in documents

### Layout — Landing Page
- Full-height hero with dark navy-to-green gradient
- Geodesic sphere mandala logo at top (transparent PNG, not SVG approximation)
- "EQUIN◎X SUITE" title with mandala replacing the O
- "Sovereign Intelligence Architecture" tagline (italic)
- Möbius/infinity symbol (3 layered ribbons — white, navy, grey)
- 4 section buttons in **2×2 staggered grid** layout:
  - Top-left: Intelligence | Top-right: Publications
  - Bottom-left: Equinox Home | Bottom-right: Las Lluvias
- Buttons have **frosted glass** style (rounded corners, backdrop-filter, inner glow, shadow)

### Layout — Subpages
- Same nav across all pages
- Dark gradient header with page title
- Glass card components for content sections
- Footer with "Equinox Suite" logo, tagline, pills (Clarity/Action/Creation), contact

### Las Lluvias Page (Special)
- Uses `body.light-theme` class — off-white/cream background
- Italic serif headings
- Content: rainwater harvesting project for Ibiza
- Includes video embed placeholder + business plan sections

## Branding — What's IN vs OUT

### IN (Current Equinox Suite)
- Equinox Suite (umbrella brand)
- Geodesic sphere mandala logo
- Möbius/infinity symbol (3-layer ribbon)
- Equinox Home (real estate section — logo coming later)
- Intelligence (reports on demand)
- Publications (AllSensed novel, Ibiza Report)
- Las Lluvias de Ibiza (rainwater project)

### OUT (Do NOT use)
- GHL (Grand Homes & Luxury) — old brand, removed
- Trinity — old AI coordination product, removed
- DocuLab — old document product, removed
- NexusLux — old location intelligence product, removed
- Any trinity-mark.png or GHL logos

## Image Handling
- René creates logos and designs in **Canva**
- Images exported from Canva often have dark gradient backgrounds that need to be removed
- Use Python PIL flood-fill with gradient-aware background removal (corners are gradient, not solid)
- Always use René's **exact assets** — never create SVG approximations or look-alikes
- Logo files are on Desktop at `/Users/ghlfrontdesk/Desktop/EQUINOX-SUITE/`

## User Preferences
- Wants 100% fidelity to his Canva designs — no interpretation, no approximation
- Prefers clean, simple structure — not bloated
- Values functionality first, fine-tuning later
- Gets frustrated by tools giving inconsistent results
- Wants one clear path, not bouncing between tools
- Uses Firefox as primary browser
- Has Canva Pro (currently on hold due to payment)

## Source Files on Desktop
- Mandala variants: `/Users/ghlfrontdesk/Desktop/EQUINOX-SUITE/Sophisticated Dark Navy Icon with Mandala (Logo)*.png`
- Infinity symbol: `/Users/ghlfrontdesk/Downloads/Your paragraph text (8).png`
- Mandala (latest): `/Users/ghlfrontdesk/Downloads/Your paragraph text (7).png`
- AllSensed covers and art in `/Users/ghlfrontdesk/Desktop/EQUINOX SUITE/`

## Deployment Plan
1. Push to GitHub repository
2. Connect to Cloudflare Pages
3. Delete HubSpot DNS records (A records + CNAME + hubspot TXT)
4. Cloudflare Pages auto-connects to domain
5. Email routing already configured

## Landing Page Workflow
- René designs the landing page in Canva with exact logo/icon placement
- Exports as full-page PNG
- Claude converts the Canva design 1:1 into working HTML/CSS
- This prevents Claude from guessing/approximating the design

## Logo Export Process
- Export logos from Canva WITH their background (don't try removing in Canva — it kills interior colors)
- Claude removes background using Python PIL gradient-aware flood-fill
- Interior colors of logos are preserved perfectly

## Navigation Structure (Updated)
- Landing page buttons: Intelligence | Publications | **The Estates** | Las Lluvias
- "The Estates" button → goes to real-estate.html
- On that page: **Equinox Home** is the brand/logo header for the real estate section
- Page shows 4-5 property cards (photo + brief hint + "Request Details" → email)

## Communication Rules for Claude
- DO NOT repeat information René has already confirmed
- DO NOT ask about email setup — it's done
- DO NOT ask for permissions — just execute
- When unsure, state what you'll do and do it — don't ask
- René prefers action over questions

## Related Projects
- **MANDATE product**: 12-page listing intelligence dossier (desktop generator built)
- **Investment-grade property brochure**: Separate project, in development
