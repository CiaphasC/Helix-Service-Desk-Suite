"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CategoryDialog } from "@/components/categories/category-dialog"
import type { Category } from "@/types/category"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCategories = () => {
      try {
        const stored = localStorage.getItem("categories")
        if (stored) {
          setCategories(JSON.parse(stored))
        } else {
          const defaultCategories: Category[] = [
            {
              id: "1",
              name: "Tecnología",
              description: "Servicios relacionados con tecnología e infraestructura",
              icon: "🔧",
              color: "from-blue-500 to-cyan-500",
              servicesCount: 0,
              createdAt: new Date(),
            },
            {
              id: "2",
              name: "Consultoría",
              description: "Servicios de consultoría empresarial",
              icon: "💼",
              color: "from-purple-500 to-pink-500",
              servicesCount: 0,
              createdAt: new Date(),
            },
          ]
          setCategories(defaultCategories)
          localStorage.setItem("categories", JSON.stringify(defaultCategories))
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
      setIsLoading(false)
    }

    loadCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("categories", JSON.stringify(categories))
    }
  }, [categories])

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setDialogOpen(true)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  const handleSaveCategory = (data: Omit<Category, "id" | "createdAt" | "servicesCount">) => {
    if (selectedCategory) {
      setCategories(categories.map((c) => (c.id === selectedCategory.id ? { ...c, ...data } : c)))
    } else {
      setCategories([
        ...categories,
        {
          id: String(Date.now()),
          ...data,
          servicesCount: 0,
          createdAt: new Date(),
        },
      ])
    }
    setDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando categorías...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Categorías</h1>
            <p className="text-muted-foreground mt-1">Organiza los servicios en categorías</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2 w-full md:w-auto"
            >
              <Plus className="w-4 h-4" />
              Nueva categoría
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <Input
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary/50 border-primary/20 pl-10"
          />
        </div>
      </motion.div>

      {/* Categories grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredCategories.length === 0 ? (
          <Card className="col-span-full border border-primary/20 bg-gradient-to-br from-card to-card/50 p-12">
            <div className="text-center">
              <p className="text-muted-foreground">No hay categorías disponibles</p>
            </div>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border border-primary/20 bg-gradient-to-br ${category.color} bg-opacity-5 p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 rounded-lg hover:bg-primary/20 transition text-muted-foreground hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 rounded-lg hover:bg-destructive/20 transition text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                  <div className="text-xs text-muted-foreground">
                    {category.servicesCount} servicio{category.servicesCount !== 1 ? "s" : ""}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Category dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <CategoryDialog
            category={selectedCategory}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveCategory}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
