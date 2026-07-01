# UDS token layer

The single source of truth for design tokens consumed by UDS components and
downstream apps. Tokens mirror the Canopy Design System in Figma.

## Two layers

- **`primitives/*.css`** — raw values (color ramps, numeric scales). Reference
  nothing. Consumers don't touch these directly.
- **`semantics/*.css`** — aliases with intent (`--color-surface-primary`,
  `--color-on-surface-primary-default`, etc.). Reference only primitives.

`theme.css` exposes the semantics to Tailwind via `@theme inline` so every
utility class (`bg-surface-primary`, `text-on-surface-primary-default`,
`border-stroke-default`, `rounded-button`, `shadow-elevation`) resolves
through a CSS variable that can flip with the `.dark` class.

## Canopy mapping

The Figma library uses slash-paths (`bg/surface/surface-primary`); UDS uses
flat CSS-variable names (`--color-surface-primary`). The translation is
purely cosmetic — every Canopy token has a 1:1 UDS counterpart with the same
primitive alias.

| Figma path                                 | UDS CSS variable                         | Utility class                      |
| ------------------------------------------ | ---------------------------------------- | ---------------------------------- |
| `bg/surface/surface-primary`               | `--color-surface-primary`                | `bg-surface-primary`               |
| `bg/surface/surface-secondary`             | `--color-surface-secondary`              | `bg-surface-secondary`             |
| `bg/surface/surface-tertiary`              | `--color-surface-tertiary`               | `bg-surface-tertiary`              |
| `bg/surface/surface-inverse`               | `--color-surface-inverse`                | `bg-surface-inverse`               |
| `bg/surface/surface-danger`                | `--color-surface-danger`                 | `bg-surface-danger`                |
| `bg/surface/surface-success`               | `--color-surface-success`                | `bg-surface-success`               |
| `bg/button/button-primary`                 | `--color-button-primary`                 | `bg-button-primary`                |
| `bg/button/button-primary-danger`          | `--color-button-primary-danger`          | `bg-button-primary-danger`         |
| `bg/button/button-secondary`               | `--color-button-secondary`               | `bg-button-secondary`              |
| `bg/button/button-secondary-danger-hover`  | `--color-button-secondary-danger-hover`  | `bg-button-secondary-danger-hover` |
| `bg/button/button-disabled`                | `--color-button-disabled`                | `bg-button-disabled`               |
| `fg/on-surface/on-surface-primary-default` | `--color-on-surface-primary-default`     | `text-on-surface-primary-default`  |
| `fg/on-surface/on-surface-primary-subtle`  | `--color-on-surface-primary-subtle`      | `text-on-surface-primary-subtle`   |
| `fg/on-button/on-button-primary`           | `--color-on-button-primary`              | `text-on-button-primary`           |
| `border/border-default`                    | `--color-stroke-default`                 | `border-stroke-default`            |
| `border/border-emphasis`                   | `--color-stroke-emphasis`                | `border-stroke-emphasis`           |
| `border/border-danger`                     | `--color-stroke-danger`                  | `border-stroke-danger`             |
| `corner-xs / corner-md / corner-lg`        | `--scale-radius-4 / -16 / -24` primitive | `rounded-sm / -2xl / -3xl`         |
| `button` (radius)                          | `--radius-button` (= 9999px)             | `rounded-button`                   |
| `elevation`                                | `--shadow-elevation`                     | `shadow-elevation`                 |
| `display/lg`, `header/sm`, `body-sm`, …    | `.text-style-display-lg`, etc.           | `text-style-display-lg`            |

## Color mode

Dark mode is fully implemented and shares the Canopy spec. The `.dark` class
swaps which primitive each semantic aliases — surfaces switch from the
warm-neutral (stone) family in light to cool-neutral (zinc) in dark. Primitive
ramp values themselves never change.

## Why CSS-variable names use `stroke-*` for borders

Tailwind's `border-N` namespace controls border _width_ (`border-2`,
`border-[2px]`). Using `--color-border-default` would put color and width
utilities in the same `border-*` prefix and confuse `tailwind-merge`. The
`--color-stroke-*` naming keeps width and color cleanly separable while the
generated utilities still read `border-stroke-default`, `ring-stroke-default`,
etc.

## Typography composites live in UDS, not Figma

Figma's typography variables collection contains only primitives
(`family/header`, `weight/medium`, `size/header-lg`, `line-height/header-lg`,
`letter-spacing/default`). Composite text styles (`header/lg`, `body-sm/semibold`,
etc.) live in Figma text styles, which are not exported as design tokens. UDS
ships the composites as `.text-style-*` classes in
`semantics/text-styles.css`, composed from the same primitives Figma defines.

The desktop typography scale applies at `@media (min-width: 768px)`; mobile is
the default. Display sizes and `header-lg` shrink aggressively on mobile per
Figma's mobile-kit values.

## Non-color treatments

Some component states that Figma does not define as colors:

- **Info** is a component variant (inline-message), not a color. It uses the
  neutral surface tokens plus the info icon to convey meaning.
- **Link** styling uses `text-on-surface-primary-default` with a hover swap to
  `text-on-surface-primary-subtle`. No underline, no dedicated link color.
- **Focus ring** uses `border-stroke-emphasis` and `ring-stroke-emphasis` with
  alpha modifiers (`/50` for the ring) until Figma defines a focus token.

## Out of scope

USDA is a downstream consumer theme exported alongside the Canopy `light kit`
and `dark kit`. It is not replicated in UDS — apps that need it ship their
own override layer.
