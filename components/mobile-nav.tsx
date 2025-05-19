"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">LearnHub</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink
              href="/courses"
              onOpenChange={setOpen}
              className={cn(pathname === "/courses" && "text-foreground font-medium")}
            >
              Courses
            </MobileLink>
            <MobileLink
              href="/blog"
              onOpenChange={setOpen}
              className={cn(pathname === "/blog" && "text-foreground font-medium")}
            >
              Blog
            </MobileLink>
            <MobileLink
              href="/about"
              onOpenChange={setOpen}
              className={cn(pathname === "/about" && "text-foreground font-medium")}
            >
              About
            </MobileLink>
            <MobileLink
              href="/faq"
              onOpenChange={setOpen}
              className={cn(pathname === "/faq" && "text-foreground font-medium")}
            >
              FAQ
            </MobileLink>
            <MobileLink
              href="/support"
              onOpenChange={setOpen}
              className={cn(pathname === "/support" && "text-foreground font-medium")}
            >
              Support
            </MobileLink>
          </div>
          <div className="flex flex-col space-y-2 mt-6 border-t pt-4">
            <MobileLink href="/login" onOpenChange={setOpen} className="font-medium">
              Login
            </MobileLink>
            <MobileLink href="/signup" onOpenChange={setOpen} className="font-medium">
              Sign Up
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(
        "text-muted-foreground transition-colors hover:text-foreground",
        isActive && "text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
