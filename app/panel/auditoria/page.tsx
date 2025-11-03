"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface AuditLog {
  id: string
  action: string
  entity: string
  entityName: string
  user: string
  timestamp: Date
  status: "success" | "warning" | "error"
  description: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "CREATE",
    entity: "Service",
    entityName: "Soporte Técnico 24/7",
    user: "admin@example.com",
    timestamp: new Date("2025-11-02T14:30:00"),
    status: "success",
    description: "Nuevo servicio creado en el catálogo",
  },
  {
    id: "2",
    action: "UPDATE",
    entity: "Service",
    entityName: "Consultoría Empresarial",
    user: "admin@example.com",
    timestamp: new Date("2025-11-02T13:15:00"),
    status: "success",
    description: "Descripción y SLA actualizados",
  },
  {
    id: "3",
    action: "DELETE",
    entity: "Service",
    entityName: "Desarrollo de Software",
    user: "manager@example.com",
    timestamp: new Date("2025-11-01T16:45:00"),
    status: "success",
    description: "Servicio eliminado del catálogo",
  },
  {
    id: "4",
    action: "UPDATE",
    entity: "Category",
    entityName: "Tecnología",
    user: "admin@example.com",
    timestamp: new Date("2025-11-01T10:20:00"),
    status: "success",
    description: "Categoría renombrada",
  },
  {
    id: "5",
    action: "CREATE",
    entity: "Template",
    entityName: "Template Incidente",
    user: "admin@example.com",
    timestamp: new Date("2025-10-31T09:00:00"),
    status: "warning",
    description: "Nueva plantilla creada (pendiente de revisión)",
  },
]

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterEntity, setFilterEntity] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLogs = () => {
      try {
        const stored = localStorage.getItem("auditLogs")
        if (stored) {
          const parsedLogs = JSON.parse(stored)
          setLogs(
            parsedLogs.map((log: any) => ({
              ...log,
              timestamp: new Date(log.timestamp),
            })),
          )
        } else {
          setLogs(mockAuditLogs)
          localStorage.setItem("auditLogs", JSON.stringify(mockAuditLogs))
        }
      } catch (error) {
        console.error("Error loading audit logs:", error)
        setLogs(mockAuditLogs)
      }
      setIsLoading(false)
    }

    loadLogs()
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesAction = filterAction === "all" || log.action === filterAction
    const matchesEntity = filterEntity === "all" || log.entity === filterEntity
    return matchesAction && matchesEntity
  })

  const actions = ["all", ...new Set(logs.map((l) => l.action))]
  const entities = ["all", ...new Set(logs.map((l) => l.entity))]

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "border-green-500/50 bg-green-500/10 text-green-500"
      case "UPDATE":
        return "border-blue-500/50 bg-blue-500/10 text-blue-500"
      case "DELETE":
        return "border-destructive/50 bg-destructive/10 text-destructive"
      default:
        return "border-muted-foreground/50 bg-muted/10 text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 mb-4">
            <Clock className="w-6 h-6 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Cargando auditoría...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Registro de Auditoría</h1>
          <p className="text-muted-foreground mt-1">Historial completo de cambios en el sistema</p>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Total de Eventos</div>
          <div className="text-2xl font-bold text-foreground">{logs.length}</div>
        </Card>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Creaciones</div>
          <div className="text-2xl font-bold text-green-500">{logs.filter((l) => l.action === "CREATE").length}</div>
        </Card>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Actualizaciones</div>
          <div className="text-2xl font-bold text-blue-500">{logs.filter((l) => l.action === "UPDATE").length}</div>
        </Card>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Eliminaciones</div>
          <div className="text-2xl font-bold text-destructive">{logs.filter((l) => l.action === "DELETE").length}</div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2 rounded-lg bg-secondary/50 border border-primary/20 text-foreground cursor-pointer"
          whileHover={{ borderColor: "hsl(var(--primary))" }}
        >
          <option value="all">Todas las acciones</option>
          {actions
            .filter((a) => a !== "all")
            .map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
        </motion.select>

        <motion.select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="px-4 py-2 rounded-lg bg-secondary/50 border border-primary/20 text-foreground cursor-pointer"
          whileHover={{ borderColor: "hsl(var(--primary))" }}
        >
          <option value="all">Todas las entidades</option>
          {entities
            .filter((e) => e !== "all")
            .map((entity) => (
              <option key={entity} value={entity}>
                {entity}
              </option>
            ))}
        </motion.select>

        <div className="text-right text-sm text-muted-foreground">{filteredLogs.length} evento(s) encontrado(s)</div>
      </motion.div>

      {/* Audit logs timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl overflow-hidden">
          <div className="divide-y divide-border/50">
            {filteredLogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No hay registros de auditoría</p>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-secondary/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getStatusIcon(log.status)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                          {log.action}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{log.entityName}</span>
                        <span className="text-xs text-muted-foreground">({log.entity})</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{log.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.user}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.timestamp.toLocaleString("es-ES")}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
