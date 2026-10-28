# Parkwise design system

## Visual direction

Parkwise uses **calm civic wayfinding**: an editorial, utilitarian interface for drivers who need quick, legible decisions in busy public places. The interface should feel dependable and clear under time pressure. Keep density moderate (5/10), layout variation controlled (4/10), and motion restrained (2/10). Use alignment, spacing, and typographic hierarchy to organize information instead of decorative effects.

## Color tokens

| Role | Token | Hex | Use |
|---|---|---:|---|
| Primary background | `--canvas` | `#F4F6F3` | App canvas and page background |
| Primary surface | `--surface` | `#FFFFFF` | Forms, dialogs, and content regions |
| Secondary surface | `--surface-secondary` | `#EDF1ED` | Inputs, quiet controls, alternate rows |
| Primary text | `--text-primary` | `#1E2521` | Headings and important values |
| Secondary text | `--text-secondary` | `#52605A` | Body text and descriptions |
| Muted text | `--text-muted` | `#75817B` | Metadata and helper copy |
| Primary action | `--action-primary` | `#355E4D` | Main actions, active navigation, selection |
| Primary action hover | `--action-primary-hover` | `#294A3A` | Hover and pressed action state |
| Secondary action | `--action-secondary` | `#E8EEE9` | Lower emphasis actions |
| Border | `--border` | `#DCE3DD` | Inputs, panels, and control boundaries |
| Divider | `--divider` | `#E8EDE9` | Table and section separation |
| Focus ring | `--focus-ring` | `#6F9C82` | Keyboard focus outline |
| Success | `--success` / `--success-surface` | `#28664A` / `#EAF3EE` | Successful payment, available space |
| Warning | `--warning` / `--warning-surface` | `#875C1C` / `#FAF1DE` | Pending payment, low availability |
| Error | `--error` / `--error-surface` | `#9C3F3F` / `#F8E9E8` | Failed actions and validation |
| Information | `--info` / `--info-surface` | `#3F6072` / `#EBF1F4` | Informational notices |
| Disabled control | `--disabled-control` | `#E7EBE8` | Disabled input or button background |
| Disabled text | `--disabled-text` | `#98A19C` | Disabled labels |

The CSS maps existing Tailwind slate and blue utilities to the neutral and primary-action roles. Emerald, amber, red, and information colors retain semantic meaning. Do not add extra brand accents.

## Typography

- Interface: **Plus Jakarta Sans**, with `Segoe UI` and system sans-serif fallbacks.
- IDs, plates, timestamps, and telemetry: **JetBrains Mono**, with tabular numerals.
- Body: 14px minimum for interface copy, 1.55 line height, and roughly 65 characters per paragraph line.
- Headings: 600–800 weight, tight tracking, balanced wrapping; use scale and weight for hierarchy rather than all-caps labels.
- Metadata: 11–12px; reserve monospace for data that benefits from column alignment.

## Spacing, shape, and depth

- Spacing base: 4px. Use 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px steps.
- Radii: 4px compact tags, 6px buttons, 8px inputs/compact surfaces, 12px content panels. Full pills are reserved for small state labels.
- Borders: 1px solid `#DCE3DD`; dividers use `#E8EDE9`.
- Elevation: default to no shadow. The shared subtle shadow is `0 2px 8px rgba(32,52,42,.05)` and is used only where separation needs help.
- Content width: 1280px maximum for app screens. Keep the established sidebar and collapse it into its mobile drawer below 1024px.

## Interaction and accessibility

- Breakpoints: 640px, 768px, 1024px, and 1280px.
- Focus: 3px solid `#6F9C82`, offset by 2px; never suppress keyboard focus.
- Controls: minimum 44px touch target where practical, 6px button radius, clear hover, pressed, and disabled states.
- Motion: 160ms color/border transitions only for ordinary controls. Respect `prefers-reduced-motion`; do not animate telemetry or decorative elements continuously.
- Status: pair color with a label or icon. Keep validation errors inline and make empty states actionable.
- Responsive layouts: collapse multi-column panels to one column below 768px and prevent horizontal page overflow.

## Component guidance

- Navigation remains a persistent, high-contrast dark rail on desktop and a dismissible drawer on mobile. Active state uses the pine accent and remains labeled.
- Primary buttons use pine fill and white text. Secondary actions use the secondary surface with primary text. Tertiary actions are text links.
- Panels use white or secondary surfaces with a border. Use a panel only to express a meaningful group or hierarchy; prefer dividers in dense tables.
- Forms use persistent labels above inputs, inline helper/error text, and the shared focus ring.
- Loading states should preserve page geometry; empty/error states should tell the user what happened and what they can do next.
- Icons are functional aids, consistently sized and weighted. Do not add decorative icon-only ornament.

## Anti-patterns

- No neon blue/purple treatments, gradients, glass effects, or rainbow credential bands.
- No heavy shadows, bevels, multiple nested cards, or large pill buttons.
- No unstructured accent colors; status colors are reserved for status.
- No tiny body copy, low-contrast placeholders, color-only status, or removed keyboard focus.
- No equal-card grids used as a default, decorative motion, or fake live-data claims.
- No route, auth, API, or workflow changes as part of visual styling.
