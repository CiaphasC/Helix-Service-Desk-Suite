"use client"

import { useState, useEffect, useDeferredValue } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FormFieldBuilder } from "@/components/forms/form-field-builder"
import { TemplatePreview } from "@/components/forms/template-preview"
import type { FormTemplate, FormField } from "@/types/form-template"

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string

  const [template, setTemplate] = useState<FormTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const deferredTemplate = useDeferredValue(template)

  useEffect(() => {
    const loadTemplate = () => {
      try {
        const templates = JSON.parse(localStorage.getItem("formTemplates") || "[]")
        const found = templates.find((t: FormTemplate) => t.id === templateId)
        if (found) {
          setTemplate(found)
        } else {
          router.push("/panel/plantillas")
        }
      } catch (error) {
        console.error("Error loading template:", error)
        router.push("/panel/plantillas")
      }
      setIsLoading(false)
    }

    loadTemplate()
  }, [templateId, router])

  if (isLoading || !template) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando plantilla...</p>
      </div>
    )
  }
  const previewTemplate = deferredTemplate ?? template

  const handleAddField = () => {
    const newField: FormField = {
      id: createId(),
      type: "text",
      label: `Campo ${template.fields.length + 1}`,
      placeholder: "",
      required: false,
      description: "",
      order: template.fields.length,
    }
    setTemplate({ ...template, fields: [...template.fields, newField] })
  }

  const handleUpdateField = (index: number, updatedField: FormField) => {
    const newFields = [...template.fields]
    newFields[index] = updatedField
    setTemplate({ ...template, fields: newFields })
  }

  const handleDeleteField = (index: number) => {
    setTemplate({
      ...template,
      fields: template.fields.filter((_, i) => i !== index),
    })
  }

  const handleDuplicateField = (index: number) => {
    const fieldToDuplicate = template.fields[index]
    const newField: FormField = {
      ...fieldToDuplicate,
      id: createId(),
      order: template.fields.length,
    }
    setTemplate({ ...template, fields: [...template.fields, newField] })
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newFields = [...template.fields]
      ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
      setTemplate({ ...template, fields: newFields })
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < template.fields.length - 1) {
      const newFields = [...template.fields]
      ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
      setTemplate({ ...template, fields: newFields })
    }
  }

  const handleSave = async () => {
    if (!template.name.trim()) {
      alert("Por favor ingresa un nombre para la plantilla")
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    try {
      const templates = JSON.parse(localStorage.getItem("formTemplates") || "[]")
      const index = templates.findIndex((t: FormTemplate) => t.id === templateId)
      if (index !== -1) {
        templates[index] = { ...template, updatedAt: new Date() }
        localStorage.setItem("formTemplates", JSON.stringify(templates))
      }
      router.push("/panel/plantillas")
    } catch (error) {
      console.error("Error saving template:", error)
      alert("Error al guardar la plantilla")
    }
    setIsSaving(false)
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/panel/plantillas">
            <Button variant="outline" size="sm" className="border-primary/20 text-foreground bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editar Plantilla</h1>
            <p className="text-muted-foreground mt-1">Modifica la plantilla de formulario</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="space-y-4">
            {/* Template info */}
            <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre *</label>
                <Input
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  placeholder="Ej: Solicitud de Soporte"
                  className="bg-secondary/50 border-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  placeholder="Describe esta plantilla..."
                  className="w-full px-3 py-2 bg-secondary/50 border border-primary/20 rounded-lg text-foreground resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Categoría</label>
                <Input
                  value={template.category}
                  onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                  placeholder="General"
                  className="bg-secondary/50 border-primary/20"
                />
              </div>
            </Card>

            {/* Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Campos del Formulario</h3>
                <Button
                  onClick={handleAddField}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar campo
                </Button>
              </div>

              <AnimatePresence>
                {template.fields.map((field, index) => (
                  <FormFieldBuilder
                    key={field.id}
                    field={field}
                    onUpdate={(updated) => handleUpdateField(index, updated)}
                    onDelete={() => handleDeleteField(index)}
                    onDuplicate={() => handleDuplicateField(index)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                    canMoveUp={index > 0}
                    canMoveDown={index < template.fields.length - 1}
                  />
                ))}
              </AnimatePresence>

              {template.fields.length === 0 && (
                <Card className="border border-primary/20 bg-secondary/20 p-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No hay campos en esta plantilla</p>
                    <Button
                      onClick={handleAddField}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar primer campo
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 sticky top-6 h-fit"
        >
          <div>
            <h3 className="font-semibold text-foreground mb-3">Vista Previa Empresarial</h3>
            <TemplatePreview template={previewTemplate} />
          </div>

          <div className="flex gap-2">
            <Link href="/panel/plantillas" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-primary/20 text-foreground hover:bg-secondary/50 bg-transparent"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={isSaving || !template.name.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
