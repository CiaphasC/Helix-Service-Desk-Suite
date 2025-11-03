"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, Search, Clock, Grid3x3, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ServiceDialog } from "@/components/services/service-dialog"
import { ServiceTable } from "@/components/services/service-table"
import { ServiceCards } from "@/components/services/service-cards"
import { Card } from "@/components/ui/card"
import type { Service } from "@/types/service"

// Mock data
const mockServices: Service[] = [
  {
    id: "1",
    name: "Soporte Técnico 24/7",
    description:
      "Servicio de soporte técnico disponible las 24 horas del día para resolver cualquier inconveniente técnico",
    category: "Tecnología",
    priority: "alta",
    status: "activo",
    sla: "Respuesta en 2 horas",
    createdAt: new Date("2025-10-20"),
  },
  {
    id: "2",
    name: "Consultoría Empresarial",
    description:
      "Servicios de consultoría integral para optimizar procesos empresariales y mejorar la eficiencia operativa",
    category: "Consultoría",
    priority: "media",
    status: "activo",
    sla: "Respuesta en 24 horas",
    createdAt: new Date("2025-10-18"),
  },
  {
    id: "3",
    name: "Desarrollo de Software",
    description:
      "Desarrollo personalizado de soluciones de software a medida según las necesidades específicas del cliente",
    category: "Tecnología",
    priority: "alta",
    status: "inactivo",
    sla: "Respuesta en 4 horas",
    createdAt: new Date("2025-10-15"),
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const loadServices = () => {
      try {
        const stored = localStorage.getItem("services")
        if (stored) {
          const parsedServices = JSON.parse(stored)
          setServices(parsedServices.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) })))
        } else {
          setServices(mockServices)
          localStorage.setItem("services", JSON.stringify(mockServices))
        }
      } catch (error) {
        console.error("Error loading services:", error)
        setServices(mockServices)
      }
      setIsLoading(false)
    }

    loadServices()
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 1024
      setIsMobile(isMobileScreen)
      if (isMobileScreen) {
        setViewMode("cards")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem("services", JSON.stringify(services))
    }
  }, [services])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    const matchesStatus = filterStatus === "all" || service.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ["all", ...new Set(services.map((s) => s.category))]

  const handleAddService = () => {
    setSelectedService(null)
    setDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setDialogOpen(true)
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleSaveService = (data: Omit<Service, "id" | "createdAt">) => {
    if (selectedService) {
      setServices(services.map((s) => (s.id === selectedService.id ? { ...s, ...data } : s)))
    } else {
      setServices([
        ...services,
        {
          id: String(Date.now()),
          ...data,
          createdAt: new Date(),
        },
      ])
    }
    setDialogOpen(false)
  }

  const activeServices = services.filter((s) => s.status === "activo").length
  const totalServices = services.length
  const highPriorityServices = services.filter((s) => s.priority === "alta" && s.status === "activo").length

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 mb-4">
            <Clock className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Servicios</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Administra el catálogo de servicios disponibles
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddService}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo servicio</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Total de Servicios</div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">{totalServices}</div>
        </Card>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Servicios Activos</div>
          <div className="text-xl sm:text-2xl font-bold text-green-500">{activeServices}</div>
        </Card>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Alta Prioridad Activos</div>
          <div className="text-xl sm:text-2xl font-bold text-destructive">{highPriorityServices}</div>
        </Card>
      </motion.div>

      {/* Search and filters */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary/50 border-primary/20 pl-10 text-sm"
            />
          </div>
        </div>

        <motion.select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary/50 border border-primary/20 text-foreground cursor-pointer text-sm"
          whileHover={{ borderColor: "hsl(var(--primary))" }}
        >
          <option value="all">Categoría</option>
          {categories
            .filter((c) => c !== "all")
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </motion.select>

        <div className="flex gap-2">
          <motion.select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-secondary/50 border border-primary/20 text-foreground cursor-pointer flex-1 text-sm"
            whileHover={{ borderColor: "hsl(var(--primary))" }}
          >
            <option value="all">Estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </motion.select>

          <div className="hidden sm:flex gap-1 bg-secondary/50 border border-primary/20 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === "table" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              title="Vista tabla"
            >
              <List className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("cards")}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === "cards" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              title="Vista tarjetas"
            >
              <Grid3x3 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Services view - table or cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {viewMode === "table" ? (
          <ServiceTable services={filteredServices} onEdit={handleEditService} onDelete={handleDeleteService} />
        ) : (
          <ServiceCards services={filteredServices} onEdit={handleEditService} onDelete={handleDeleteService} />
        )}
      </motion.div>

      {/* Service dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <ServiceDialog service={selectedService} onClose={() => setDialogOpen(false)} onSave={handleSaveService} />
        )}
      </AnimatePresence>
    </div>
  )
}
