import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// UDS-styled button. Pill radius (--radius-button: full), near-black primary,
// white + stroke secondary. Weights cap at semibold (UDS exposes no bolder rung).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-button border border-transparent text-style-body-sm-semibold whitespace-nowrap transition-all duration-fast ease-move outline-none select-none focus-visible:ring-2 focus-visible:ring-stroke-emphasis focus-visible:ring-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-button-primary text-on-button-primary hover:bg-button-primary-hover",
        secondary:
          "border-stroke-default bg-button-secondary text-on-button-secondary hover:bg-button-secondary-hover",
        outline:
          "border-stroke-default bg-button-secondary text-on-button-secondary hover:bg-button-secondary-hover",
        ghost:
          "text-on-surface-primary-default hover:bg-surface-secondary",
        destructive:
          "bg-button-primary-danger text-on-button-primary hover:bg-button-primary-danger-hover",
        link: "text-on-surface-primary-default underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-style-body-sm",
        lg: "h-11 px-6 text-style-body-lg-semibold",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
