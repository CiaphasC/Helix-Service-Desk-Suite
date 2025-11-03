export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  servicesCount: number
  createdAt: Date
}

export interface SLA {
  id: string
  name: string
  description: string
  responseTime: number // in minutes
  resolutionTime: number // in minutes
  category: string
  priority: "baja" | "media" | "alta"
  createdAt: Date
}
