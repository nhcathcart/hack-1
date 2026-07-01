import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * Mirrors the UDS `cn`: register `text-style-*` typography composites as their
 * own tailwind-merge group so they survive a merge alongside text-color /
 * font-size utilities. Vanilla `twMerge(clsx(...))` buckets every `text-*`
 * class together and silently drops the composite (documented UDS footgun).
 * No conflictingClassGroups entry — single-property utilities (font-medium,
 * leading-6) should still override the composite per the CSS cascade.
 */
const twMerge = extendTailwindMerge<"uds-text-style">({
  extend: {
    classGroups: {
      "uds-text-style": [
        {
          "text-style": [
            "display-lg",
            "display-md",
            "display-sm",
            "header-lg",
            "header-md",
            "header-sm",
            "body-lg",
            "body-lg-semibold",
            "body-sm",
            "body-sm-semibold",
            "body-caption",
            "body-label",
            "body-overline",
            "body-code",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
