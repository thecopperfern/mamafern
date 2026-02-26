"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-cream group-[.toaster]:text-charcoal group-[.toaster]:border-oat group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-warm-brown/70",
          actionButton:
            "group-[.toast]:bg-fern group-[.toast]:text-white hover:group-[.toast]:bg-fern-dark",
          cancelButton:
            "group-[.toast]:bg-oat group-[.toast]:text-warm-brown/70 hover:group-[.toast]:bg-oat/80",
          success: "group-[.toaster]:border-fern/30 group-[.toaster]:bg-fern/5",
          error: "group-[.toaster]:border-terracotta/30 group-[.toaster]:bg-terracotta/5",
          info: "group-[.toaster]:border-sage/30 group-[.toaster]:bg-sage/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
