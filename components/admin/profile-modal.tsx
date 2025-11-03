"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { X, Mail, Shield, Calendar, Building } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const backdrop = modalRef.current?.querySelector("[data-backdrop]")
      const content = contentRef.current

      gsap.set([backdrop, content], { opacity: 0 })

      gsap.to(backdrop, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })

      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out",
        delay: 0.1,
      })

      // Animate profile info items
      const infoItems = content?.querySelectorAll("[data-info-item]")
      gsap.fromTo(
        infoItems,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, delay: 0.2, ease: "power2.out" },
      )
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current?.querySelector("[data-backdrop]")) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center">
      <div data-backdrop className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleBackdropClick} />

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-md mx-4 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
        style={{ transform: "translateY(20px)" }}
      >
        {/* Header */}
        <div className="relative h-24 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors z-10"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Avatar and Basic Info */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary-foreground">DM</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Dev Master</h3>
              <p className="text-sm text-muted-foreground">Administrador</p>
            </div>
          </div>

          {/* Info Items */}
          <div className="space-y-4">
            {/* Email */}
            <div
              data-info-item
              className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/20 transition-colors"
            >
              <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Correo</p>
                <p className="text-sm font-medium text-foreground truncate">devmaster.learning@gmail.com</p>
              </div>
            </div>

            {/* Role */}
            <div
              data-info-item
              className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/20 transition-colors"
            >
              <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Rol</p>
                <p className="text-sm font-medium text-foreground">Administrador del Sistema</p>
              </div>
            </div>

            {/* Joined Date */}
            <div
              data-info-item
              className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/20 transition-colors"
            >
              <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Se unió</p>
                <p className="text-sm font-medium text-foreground">15 de Noviembre, 2024</p>
              </div>
            </div>

            {/* Department */}
            <div
              data-info-item
              className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/20 transition-colors"
            >
              <Building className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Departamento</p>
                <p className="text-sm font-medium text-foreground">Administración</p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1 bg-transparent">
              Cerrar
            </Button>
            <Button size="sm" className="flex-1">
              Editar Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
