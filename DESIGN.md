---
name: Precision Trader
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#410004'
  on-tertiary-container: '#ef4444'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 12px
---

## Brand & Style

The design system is engineered for high-performance financial analysis and trading retrospection. It prioritizes clarity, analytical depth, and professional reliability. The aesthetic blends **Corporate Modern** efficiency with a **Minimalist** focus on data hierarchy. 

The visual language communicates authority and success through a sophisticated dark navy foundation, contrasted against high-visibility success greens and soft systemic reds. The atmosphere is intentional and calm, designed to reduce cognitive load during complex data review. On mobile, the experience shifts to a high-density vertical scroll that maintains the same "desk-class" analytical power through refined typography and purposeful whitespace.

## Colors

This design system utilizes a high-contrast palette optimized for readability and quick status recognition:

- **Primary (Deep Navy):** Used for primary text, navigation backgrounds, and deep structural elements. It provides a stable, professional anchor.
- **Secondary (Vibrant Green):** Representing "Profit/Growth." Used for positive percentages, equity curves, and primary action buttons.
- **Tertiary (Soft Red):** Representing "Loss/Risk." Used for negative metrics and cautionary indicators. The value is slightly desaturated to prevent visual fatigue while remaining distinct.
- **Neutral (Slate/Ghost):** A range of cool grays used for backgrounds, borders, and secondary metadata to ensure the core data remains the focal point.

## Typography

We use **Plus Jakarta Sans** for its modern, geometric clarity and excellent legibility at small sizes—critical for data-heavy dashboards. 

- **Numerical Data:** Use `display-lg` for primary P&L figures. Medium and Semi-bold weights are preferred for all data points to ensure they stand out against label text.
- **Hierarchy:** Labels use a strict uppercase `label-sm` style to differentiate metadata from active values.
- **Mobile Scaling:** Headlines scale down by approximately 20% on mobile to maintain information density without inducing horizontal scrolling.

## Layout & Spacing

The design system employs a **Fluid Grid** with a high-density 8px base unit. 

- **Desktop:** 12-column grid with 24px margins. Cards typically span 4, 6, or 8 columns.
- **Mobile:** 4-column grid with 16px side margins. Layouts reflow into a single-column stack.
- **Density:** To accommodate large amounts of financial data, use "Compact" vertical spacing (12px) within card components, while maintaining "Loose" spacing (24px) between major sections to provide visual breathing room.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and subtle **Ambient Shadows**.

- **Level 0 (Surface):** The main application background uses the softest neutral tint (#F8FAFC).
- **Level 1 (Cards):** Primary content containers are pure white with a 1px border (#E2E8F0) and a very soft, diffused shadow (0px 4px 6px rgba(15, 23, 42, 0.05)).
- **Level 2 (Overlays):** Modals and dropdowns use a more pronounced shadow to indicate significant depth and focus.
- **Interactive States:** On hover or tap, cards should not "lift," but rather show a subtle border-color shift to the primary navy to maintain the system's professional, flat aesthetic.

## Shapes

The shape language is consistently **Rounded**, striking a balance between modern software aesthetics and the precision of financial tools.

- **Standard Containers:** Use `rounded-md` (0.5rem) for main dashboard cards.
- **Interactive Elements:** Buttons and input fields use `rounded-md` for a cohesive look.
- **Status Tags/Chips:** Use `rounded-full` (Pill-shaped) for badges like "MTD %" or "Win Rate" to distinguish them from structural elements.

## Components

### Buttons
- **Primary:** Solid Secondary Green with white text. High-contrast and bold.
- **Secondary:** Transparent with a 1px Navy border.
- **Mobile Navigation:** Large touch targets (min 44px height) with centered icons and labels.

### Cards
- Dashboard cards should include a consistent header region for titles and secondary metrics (e.g., "Equity Curve" + "+6.4%").
- Use inner padding of `lg` (24px) for desktop and `md` (16px) for mobile.

### Data Visualization
- **Line Charts:** Use 2px stroke width with a soft gradient fill (10% opacity) of the line color.
- **Calendar:** High-density grid. Use background tints (Green/Red at 15% opacity) to indicate daily performance without obscuring the date numeral.

### Inputs & Tables
- **Input Fields:** Minimalist style with a 1px border. Focus state changes border color to Primary Navy.
- **Data Tables:** Row-based layout with no vertical borders; use subtle horizontal dividers (#F1F5F9). Bold the primary asset ticker (e.g., **NVDA**) for quick scanning.