"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Settings,
  BarChart3,
  BookMarked,
  Menu,
  X,
  Calendar,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import gsap from "gsap"

const menuItems = [
  {
    label: "Inicio",
    href: "/panel",
    icon: LayoutDashboard,
  },
  {
    label: "Servicios",
    href: "/panel/servicios",
    icon: Package,
  },
  {
    label: "Categorías",
    href: "/panel/categorias",
    icon: FolderOpen,
  },
  {
    label: "Plantillas",
    href: "/panel/plantillas",
    icon: Settings,
  },
  {
    label: "SLA",
    href: "/panel/sla",
    icon: BarChart3,
  },
  {
    label: "Calendario",
    href: "/panel/calendario",
    icon: Calendar,
  },
  {
    label: "Usuarios",
    href: "/panel/usuarios",
    icon: Users,
  },
  {
    label: "Auditoría",
    href: "/panel/auditoria",
    icon: BookMarked,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const bgRef = useRef<HTMLDivElement>(null)
  const isBrowser = typeof window !== "undefined"

  useEffect(() => {
    if (!isBrowser) return

    const sidebar = sidebarRef.current
    if (!sidebar) return

    // Initial animations for desktop
    if (window.innerWidth >= 768) {
      gsap.set(sidebar, { opacity: 0, x: -30 })
      gsap.to(sidebar, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      })
    }

    // Animate logo
    if (logoRef.current) {
      const logoIcon = logoRef.current.querySelector(".logo-icon")
      const logoText = logoRef.current.querySelector(".logo-text")

      gsap.set([logoIcon, logoText], { opacity: 0, y: 10 })
      gsap.to(logoIcon, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "back.out",
      })
      gsap.to(logoText, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.3,
        ease: "back.out",
      })

      // Hover animation for logo icon
      logoIcon?.addEventListener("mouseenter", () => {
        gsap.to(logoIcon, {
          rotation: 360,
          duration: 0.6,
          ease: "back.out",
        })
      })
    }

    // Stagger animation for nav items
    navItemsRef.current.forEach((item, index) => {
      if (!item) return

      gsap.set(item, { opacity: 0, x: -20 })
      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        delay: 0.4 + index * 0.08,
        ease: "power2.out",
      })

      // Hover animation
      item.addEventListener("mouseenter", () => {
        gsap.to(item, {
          x: 4,
          duration: 0.3,
          ease: "power2.out",
        })

        const icon = item.querySelector("svg")
        if (icon) {
          gsap.to(icon, {
            scale: 1.15,
            rotation: 5,
            duration: 0.3,
            ease: "back.out",
          })
        }
      })

      item.addEventListener("mouseleave", () => {
        gsap.to(item, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        })

        const icon = item.querySelector("svg")
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "back.out",
          })
        }
      })
    })
  }, [])

  useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return

    const isMobile = isBrowser && window.innerWidth < 768

    const tl = gsap.timeline()

    if (isOpen) {
      tl.to(sidebar, {
        translateX: 0,
        duration: 0.4,
        ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      })
      tl.to(
        bgRef.current,
        {
          opacity: 1,
          duration: 0.3,
        },
        0,
      )
    } else {
      if (isMobile) {
        tl.to(sidebar, {
          translateX: -100,
          duration: 0.4,
          ease: "power2.inOut",
        })
      }
      tl.to(
        bgRef.current,
        {
          opacity: 0,
          duration: 0.3,
        },
        0,
      )
    }
  }, [isOpen])

  useEffect(() => {
    if (!isBrowser) return

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div
        ref={bgRef}
        onClick={() => setIsOpen(false)}
        className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 opacity-0 pointer-events-none"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      />

      <aside
        ref={sidebarRef}
        className={cn(
          "fixed md:relative left-0 top-0 h-screen w-64 z-40 md:z-auto flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out",
          "bg-gradient-to-br from-card via-card to-card/80 border-r border-border/50 backdrop-blur-xl",
          "md:bg-card md:border-r md:border-border",
        )}
        style={{
          transform: isBrowser && window.innerWidth >= 768 ? "translateX(0)" : undefined,
        }}
      >
        <div ref={logoRef} className="p-6 space-y-8 flex-1 pt-16 md:pt-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="logo-icon w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <span className="text-primary-foreground font-bold text-lg">⚙️</span>
            </div>
            <div className="logo-text overflow-hidden">
              <h1 className="text-base font-semibold text-foreground leading-tight">CatáloGo</h1>
              <p className="text-xs text-muted-foreground/70">Servicios</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  ref={(el) => {
                    if (el) navItemsRef.current[index] = el
                  }}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/40 shadow-lg shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent -z-10" />
                  )}
                  <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg shadow-primary/50 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border/30 bg-gradient-to-t from-background/50 to-transparent">
          <div className="text-xs text-muted-foreground/60 text-center py-2">v1.0.0</div>
        </div>
      </aside>
    </>
  )
}
