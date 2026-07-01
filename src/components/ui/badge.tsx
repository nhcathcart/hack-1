import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// UDS-styled badge. Full-radius pill, 12px semibold label type, semantic
// surface + on-surface pairings for status tone.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-style-body-label whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-stroke-default bg-surface-secondary text-on-surface-secondary-default",
        success:
          "border-transparent bg-surface-success text-on-surface-success",
        danger:
          "border-transparent bg-surface-danger text-on-surface-danger",
        inverse:
          "border-transparent bg-surface-inverse text-on-surface-inverse-default",
        outline:
          "border-stroke-default text-on-surface-primary-default",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
