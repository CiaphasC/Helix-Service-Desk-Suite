"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Category } from "@/types/category"

interface CategoryDialogProps {
  category: Category | null
  onClose: () => void
  onSave: (data: Omit<Category, "id" | "createdAt" | "servicesCount">) => void
}

const icons = ["📁", "🔧", "💼", "📊", "🚀", "🎯", "⚡", "🔐"]
const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
]

export function CategoryDialog({ category, onClose, onSave }: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: icons[0],
    color: colors[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
      })
    }
    setErrors({})
  }, [category])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
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
          <h2 className="text-xl font-bold text-foreground">{category ? "Editar Categoría" : "Nueva Categoría"}</h2>
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
              Nombre <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Tecnología"
              className={`bg-secondary/50 border-primary/20 ${errors.name ? "border-destructive" : ""}`}
              required
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe la categoría..."
              className={`w-full px-3 py-2 bg-secondary/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                errors.description ? "border-destructive" : ""
              }`}
              rows={3}
              required
            />
            {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Icono</label>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-3 rounded-lg text-2xl transition border-2 ${
                    formData.icon === icon
                      ? "border-primary bg-primary/10"
                      : "border-primary/20 hover:border-primary/40"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`p-4 rounded-lg transition border-2 bg-gradient-to-br ${color} ${
                    formData.color === color ? "border-foreground" : "border-transparent opacity-60"
                  }`}
                />
              ))}
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
            {isSubmitting ? "Guardando..." : category ? "Actualizar" : "Crear"} Categoría
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
