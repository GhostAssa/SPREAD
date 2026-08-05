---
name: Lagos Lo-Fi
colors:
  surface: '#f2fbff'
  surface-dim: '#c2dfea'
  surface-bright: '#f2fbff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e4f7ff'
  surface-container: '#d5f3fe'
  surface-container-high: '#d0edf9'
  surface-container-highest: '#cae7f3'
  on-surface: '#011f27'
  on-surface-variant: '#524535'
  inverse-surface: '#18343d'
  inverse-on-surface: '#dcf5ff'
  outline: '#847562'
  outline-variant: '#d6c3ae'
  surface-tint: '#835500'
  primary: '#835500'
  on-primary: '#ffffff'
  primary-container: '#e39a20'
  on-primary-container: '#573700'
  inverse-primary: '#ffb954'
  secondary: '#b6005b'
  on-secondary: '#ffffff'
  secondary-container: '#d92974'
  on-secondary-container: '#fffbff'
  tertiary: '#106969'
  on-tertiary: '#ffffff'
  tertiary-container: '#6ab5b5'
  on-tertiary-container: '#004545'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb4'
  primary-fixed-dim: '#ffb954'
  on-primary-fixed: '#291800'
  on-primary-fixed-variant: '#633f00'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c6'
  on-secondary-fixed: '#3f001b'
  on-secondary-fixed-variant: '#8e0046'
  tertiary-fixed: '#a4f0ef'
  tertiary-fixed-dim: '#88d3d3'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f50'
  background: '#f2fbff'
  on-background: '#011f27'
  surface-variant: '#cae7f3'
  sand: '#E4E0D4'
  cream: '#F4F1E7'
  sand-deep: '#D5D0BE'
  ink-band: '#10262D'
  body-ink: '#23302F'
  clay: '#C0522E'
  indigo: '#2A3D8F'
  plum: '#7C3055'
  moss: '#5E7A3A'
typography:
  shout-lg:
    fontFamily: bricolageGrotesque
    fontSize: 142px
    fontWeight: '800'
    lineHeight: '0.94'
    letterSpacing: -0.04em
  shout-lg-mobile:
    fontFamily: bricolageGrotesque
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '0.94'
    letterSpacing: -0.02em
  headline-h2:
    fontFamily: bricolageGrotesque
    fontSize: 70px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-h2-mobile:
    fontFamily: bricolageGrotesque
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.0'
  body-lg:
    fontFamily: firaSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: firaSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  note:
    fontFamily: bricolageGrotesque
    fontSize: 23px
    fontWeight: '600'
    lineHeight: '1.25'
  eyebrow:
    fontFamily: spaceMono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.2em
  label-sm:
    fontFamily: spaceMono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 26px
  section-v: 94px
  section-v-mobile: 66px
  max-width: 1180px
  gap-grid: 40px
  gap-list: 24px
---

## Brand & Style
The design system is built on the philosophy of **"Lagos Lo-Fi"**—a fusion of Nigeria-core vibrancy and modern tech brutalism. It captures the high-energy, DIY spirit of street posters and campus zines, translated into a professional digital interface. The brand personality is urgent, human-verified, and rhythmically kinetic.

The aesthetic utilizes **Lo-fi Brutalism**: thick ink strokes, hard offset shadows, and hand-drawn SVG motifs that serve as structural anchors rather than mere decoration. The interface should feel like a "living broadcast," utilizing motion choreography to mimic the scanlines of a CRT monitor and the tactile nature of physical print. 

Targeting a digitally-native audience that values authenticity over corporate polish, the emotional response should be one of high-frequency energy, clarity, and cultural resonance.

## Colors
The palette is grounded in "Parchment and Ink." The base environment uses `--sand` and `--cream` to provide a warm, analog texture, contrasting sharply with `--ink` (the primary stroke and heading color). 

**Key Color Roles:**
- **Primary (Amber):** High-energy actions and primary status indicators.
- **Secondary (Pink):** Brand accents, focus states, and "Live" indicators.
- **Tertiary (Teal):** Used for structural eyebrows and categorization.
- **Neutral (Ink):** All structural borders, shadows, and high-impact typography.

Section transitions should utilize `--sand-deep` and `--ink-band` to create rhythmic "color bands" that break the vertical scroll.

## Typography
Typography is expressive and multi-layered. We use **Bricolage Grotesque** for high-impact display moments to mimic the character of hand-painted signs. **Fira Sans** provides a modern, readable contrast for body copy, while **Space Mono** handles technical metadata and eyebrows to reinforce the "tech" half of the Nigeria-core aesthetic.

**Handwriting Annotations:**
Use the `note` style for marginalia. These elements should be rotated between -2deg and 2deg to maintain an organic, human feel.

**Dynamic Scaling:**
Headlines should utilize `clamp()` values to ensure a fluid transition between massive desktop displays and legible mobile screens.

## Layout & Spacing
The layout follows a **Fluid Band** model. Content is organized into horizontal bands of varying background colors (Sand, Cream, Deep Sand, Ink). 

- **Grid Strategy:** Use a flexible 12-column grid within a max-width container of 1180px.
- **Vertical Rhythm:** Strict adherence to 94px padding between major sections to allow the "Lo-fi" motifs (swooshes and waves) enough breathing room.
- **Choreography:** As the user scrolls, background motifs should move at different parallax speeds (0.1x to 0.3x) to create depth without sacrificing performance.

## Elevation & Depth
Depth is communicated through **Hard Elevation**. Avoid soft, feathered shadows. 

- **The "Ink Drop":** Every interactive or elevated container (cards, buttons, inputs) features a solid, 100% opacity shadow of the `--ink` color.
- **Shadow Scale:**
    - Small (Buttons/Chips): `3px 3px 0px`
    - Medium (Cards/Modals): `7px 7px 0px`
    - Large (Hero Objects): `12px 12px 0px`
- **Tonal Stacking:** Use color contrast to define hierarchy. A `--cream` card sitting on a `--sand` background is the primary method of defining "surface" versus "base."

## Shapes
The shape language is a mix of hyper-functional and organic.

- **Structural Containers:** Use `22px` (Rounded) for main cards and shells.
- **Interactive Elements:** Use `999px` (Pill-shaped) for all buttons, navigation bars, and category tags to create a tactile, friendly feel.
- **Borders:** Containers must have a heavy `2.5px` border in `--ink`.
- **SVG Motifs:** 
    - **Swooshes:** Use as underlines for emphasized text.
    - **Wave Bands:** Use as separators between color-block sections.
    - **Arrowheads:** Integrated into button ends or list markers to denote direction/progress.

## Components

### Buttons & Chips
- **Primary Button:** Pill-shaped, `--amber` background, `2px` `--ink` border, and a `3px` hard shadow. On hover, the shadow grows to `5px` and the button translates `-2px, -2px`.
- **Chips:** Small pill-shaped elements for tags. Use `--teal`, `--clay`, or `--plum` for categorization.

### The "Studio" Card
A specific component mimicking a CRT television. 
- **Frame:** `22px` radius with antennas (SVG) protruding from the top-right.
- **Screen:** `13px` inner radius with a subtle CSS scanline animation (`repeating-linear-gradient`).
- **Texture:** Use a mesh SVG background with a slow `drift` animation (18s duration).

### Input Fields
- **Style:** Background `--sand`, `2px` border, `11px` radius. 
- **Focus State:** Border changes to `--pink` with a `3px` hard shadow.

### List Items
- **Structure:** Separated by `2px dashed` lines in `--line-2`. 
- **Markers:** Use circular step numbers (50% radius) with a heavy ink stroke.

### Scroll Choreography
Components should use a "Reveal" class (`.rv`) that triggers a `0.6s` cubic-bezier entrance (fade + slight slide up) when they enter the viewport.