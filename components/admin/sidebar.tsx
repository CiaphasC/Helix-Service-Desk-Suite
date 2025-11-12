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

import { useIsMobile } from "@/hooks/use-mobile"



interface MenuItem {

  label: string

  href: string

  icon: typeof LayoutDashboard

  matchChildren?: boolean

}



const menuItems: MenuItem[] = [
  {
    label: "Inicio",
    href: "/panel",
    icon: LayoutDashboard,
    matchChildren: false,
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

  const isMobile = useIsMobile()

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [hasMounted, setHasMounted] = useState(false)

  const sidebarRef = useRef<HTMLElement>(null)

  const logoRef = useRef<HTMLDivElement>(null)

  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {

    if (typeof window === "undefined") return



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

    setHasMounted(true)

  }, [])



  useEffect(() => {

    if (!hasMounted) return

    setDrawerOpen(false)

  }, [isMobile, hasMounted])



  useEffect(() => {

    if (!hasMounted || !isMobile) return

    setDrawerOpen(false)

  }, [pathname, isMobile, hasMounted])



  const sidebarVisible = hasMounted ? !isMobile || drawerOpen : true

  const mobileOverlayActive = hasMounted && isMobile && drawerOpen



  return (

    <>

      <button

        onClick={() => setDrawerOpen((prev) => !prev)}

        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"

      >

        {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}

      </button>



      <div

        onClick={() => setDrawerOpen(false)}

        className={cn(

          "md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300",

          mobileOverlayActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",

        )}

      />



      <aside

        ref={sidebarRef}

        className={cn(

          "fixed md:relative left-0 top-0 h-screen w-64 z-40 md:z-auto flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out",

          "-translate-x-full md:translate-x-0",

          sidebarVisible && "translate-x-0",

          "bg-gradient-to-br from-card via-card to-card/80 border-r border-border/50 backdrop-blur-xl",

          "md:bg-card md:border-r md:border-border",

        )}

      >

        <div ref={logoRef} className="p-6 space-y-8 flex-1 pt-16 md:pt-6">

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="logo-icon w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <span className="text-primary-foreground font-bold text-lg tracking-tight">SD</span>
            </div>
            <div className="logo-text overflow-hidden">
              <h1 className="text-base font-semibold text-foreground leading-tight">Catálogo</h1>
              <p className="text-xs text-muted-foreground/70">Servicios</p>
            </div>
          </div>

          <nav className="space-y-1">

            {menuItems.map((item, index) => {

              const Icon = item.icon

              const matchChildren = item.matchChildren ?? true

              const isExactMatch = pathname === item.href

              const isNestedMatch = matchChildren && pathname.startsWith(`${item.href}/`)

              const isActive = isExactMatch || isNestedMatch

              return (

                <Link

                  key={item.href}

                  ref={(el) => {

                    if (el) navItemsRef.current[index] = el

                  }}

                  href={item.href}

                  onClick={() => setDrawerOpen(false)}

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

