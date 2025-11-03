export interface Service {
  id: string
  name: string
  description: string
  category: string
  priority: "alta" | "media" | "baja"
  status: "activo" | "inactivo"
  sla: string
  createdAt: Date
}
