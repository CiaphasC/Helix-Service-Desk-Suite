"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Service } from "@/types/service"

interface ServiceDialogProps {
  service: Service | null
  onClose: () => void
  onSave: (data: Omit<Service, "id" | "createdAt">) => void
}

export function ServiceDialog({ service, onClose, onSave }: ServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Tecnología",
    priority: "media" as const,
    status: "activo" as const,
    sla: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        priority: service.priority,
        status: service.status,
        sla: service.sla,
      })
    }
    setErrors({})
  }, [service])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del servicio es requerido"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres"
    }

    if (!formData.sla.trim()) {
      newErrors.sla = "El SLA es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    onSave(formData)
    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card border border-primary/20 rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
          <h2 className="text-xl font-bold text-foreground">{service ? "Editar Servicio" : "Nuevo Servicio"}</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Por favor corrige los errores en el formulario</AlertDescription>
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre del Servicio
              <span className="text-destructive ml-1">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Soporte Técnico 24/7"
              className={`bg-secondary/50 border-primary/20 ${errors.name ? "border-destructive" : ""}`}
              required
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
              <span className="text-destructive ml-1">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el servicio con detalle..."
              className={`w-full px-3 py-2 bg-secondary/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                errors.description ? "border-destructive" : ""
              }`}
              rows={4}
              required
            />
            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-secondary/50 border border-primary/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>Tecnología</option>
                <option>Consultoría</option>
                <option>Mantenimiento</option>
                <option>Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prioridad</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 bg-secondary/50 border border-primary/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-secondary/50 border border-primary/20 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                SLA
                <span className="text-destructive ml-1">*</span>
              </label>
              <Input
                value={formData.sla}
                onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                placeholder="Ej: Respuesta en 2 horas"
                className={`bg-secondary/50 border-primary/20 ${errors.sla ? "border-destructive" : ""}`}
                required
              />
              {errors.sla && <p className="text-destructive text-sm mt-1">{errors.sla}</p>}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50 bg-secondary/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-primary/20 text-foreground hover:bg-secondary/50 bg-transparent"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
          >
            {isSubmitting ? "Guardando..." : service ? "Actualizar" : "Crear"} Servicio
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
