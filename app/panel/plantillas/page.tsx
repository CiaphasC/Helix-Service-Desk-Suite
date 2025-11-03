"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { FormTemplate } from "@/types/form-template"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTemplates = () => {
      try {
        const stored = localStorage.getItem("formTemplates")
        if (stored) {
          setTemplates(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Error loading templates:", error)
      }
      setIsLoading(false)
    }

    loadTemplates()
  }, [])

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    localStorage.setItem("formTemplates", JSON.stringify(templates.filter((t) => t.id !== id)))
  }

  const handleTogglePublish = (id: string) => {
    const updated = templates.map((t) => (t.id === id ? { ...t, published: !t.published, updatedAt: new Date() } : t))
    setTemplates(updated)
    localStorage.setItem("formTemplates", JSON.stringify(updated))
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando plantillas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Plantillas de Formularios</h1>
            <p className="text-muted-foreground mt-1">Crea y administra plantillas de formularios dinámicos</p>
          </div>
          <Link href="/panel/plantillas/nueva">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                Nueva plantilla
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary/50 border-primary/20 pl-10"
          />
        </div>
      </motion.div>

      {/* Templates grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredTemplates.length === 0 ? (
          <Card className="col-span-full border border-primary/20 bg-gradient-to-br from-card to-card/50 p-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No hay plantillas creadas</p>
              <Link href="/panel/plantillas/nueva">
                <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
                  <Plus className="w-4 h-4" />
                  Crear primera plantilla
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 p-4 flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground flex-1">{template.name}</h3>
                      {template.published && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Publicada</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>

                  <div className="mb-4 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {template.fields.length} campo{template.fields.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/panel/plantillas/${template.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary/20 text-foreground hover:bg-secondary/50 bg-transparent"
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTogglePublish(template.id)}
                      className={`${
                        template.published ? "bg-green-500/20 text-green-500" : "bg-secondary/50 text-muted-foreground"
                      }`}
                    >
                      {template.published ? "Publicar" : "Ocultar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                      className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
