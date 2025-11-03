"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SLADialog } from "@/components/categories/sla-dialog"
import type { SLA } from "@/types/category"
import type { Category } from "@/types/category"

export default function SLAPage() {
  const [slas, setSLAs] = useState<SLA[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSLA, setSelectedSLA] = useState<SLA | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        // Load categories
        const storedCategories = localStorage.getItem("categories")
        if (storedCategories) {
          const cats = JSON.parse(storedCategories) as Category[]
          setCategories(cats.map((c) => c.name))
        }

        // Load SLAs
        const stored = localStorage.getItem("slas")
        if (stored) {
          setSLAs(JSON.parse(stored))
        } else {
          const defaultSLAs: SLA[] = [
            {
              id: "1",
              name: "Soporte Premium",
              description: "SLA para servicios de soporte prioritario",
              responseTime: 30,
              resolutionTime: 120,
              category: "Tecnología",
              priority: "alta",
              createdAt: new Date(),
            },
          ]
          setSLAs(defaultSLAs)
          localStorage.setItem("slas", JSON.stringify(defaultSLAs))
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (slas.length > 0) {
      localStorage.setItem("slas", JSON.stringify(slas))
    }
  }, [slas])

  const filteredSLAs = slas.filter((sla) => {
    const matchesSearch =
      sla.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sla.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || sla.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const handleAddSLA = () => {
    setSelectedSLA(null)
    setDialogOpen(true)
  }

  const handleEditSLA = (sla: SLA) => {
    setSelectedSLA(sla)
    setDialogOpen(true)
  }

  const handleDeleteSLA = (id: string) => {
    setSLAs(slas.filter((s) => s.id !== id))
  }

  const handleSaveSLA = (data: Omit<SLA, "id" | "createdAt">) => {
    if (selectedSLA) {
      setSLAs(slas.map((s) => (s.id === selectedSLA.id ? { ...s, ...data } : s)))
    } else {
      setSLAs([...slas, { id: String(Date.now()), ...data, createdAt: new Date() }])
    }
    setDialogOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "border-destructive/50 bg-destructive/10 text-destructive"
      case "media":
        return "border-orange-500/50 bg-orange-500/10 text-orange-500"
      case "baja":
        return "border-green-500/50 bg-green-500/10 text-green-500"
      default:
        return ""
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando SLAs...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de SLA</h1>
            <p className="text-muted-foreground mt-1">Define los acuerdos de nivel de servicio</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddSLA}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2 w-full md:w-auto"
            >
              <Plus className="w-4 h-4" />
              Nuevo SLA
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              placeholder="Buscar SLAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary/50 border-primary/20 pl-10"
            />
          </div>
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 rounded-lg bg-secondary/50 border border-primary/20 text-foreground cursor-pointer"
        >
          <option value="all">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </motion.div>

      {/* SLA table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl overflow-hidden">
          {filteredSLAs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No hay SLAs registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/20">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Categoría</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Resp.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Resolución</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Prioridad</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredSLAs.map((sla, index) => (
                      <motion.tr
                        key={sla.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{sla.name}</p>
                          <p className="text-sm text-muted-foreground">{sla.description}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{sla.category}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{sla.responseTime} min</td>
                        <td className="px-6 py-4 text-sm text-foreground">{sla.resolutionTime} min</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={getPriorityColor(sla.priority)}>
                            {sla.priority === "alta" && "Alta"}
                            {sla.priority === "media" && "Media"}
                            {sla.priority === "baja" && "Baja"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditSLA(sla)}
                              className="p-2 text-muted-foreground hover:text-primary transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSLA(sla.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* SLA dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <SLADialog
            sla={selectedSLA}
            categories={categories}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveSLA}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
