"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Plus, Search } from "lucide-react"
import gsap from "gsap"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  status: "active" | "inactive"
  joinDate: string
}

const demoUsers: User[] = [
  {
    id: "1",
    name: "Carlos García",
    email: "carlos@example.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "María López",
    email: "maria@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-05",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(demoUsers)

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  useEffect(() => {
    const tl = gsap.timeline()

    // Header animation
    const header = document.querySelector("[data-header]")
    if (header) {
      tl.from(header, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    // Cards stagger animation
    const cards = document.querySelectorAll("[data-user-card]")
    if (cards.length > 0) {
      tl.from(
        cards,
        {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
        },
        0.3,
      )
    }
  }, [filteredUsers])

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div data-header className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Usuarios
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Gestiona los usuarios del sistema</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900/50 border-blue-500/30 text-white placeholder:text-slate-500 rounded-lg"
          />
        </div>
      </div>

      {/* Users Table / Cards */}
      <div className="grid gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card
              key={user.id}
              data-user-card
              className="border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className="p-5 flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">{user.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className={
                      user.role === "admin"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    }
                  >
                    {user.role === "admin" ? "Administrador" : "Usuario"}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={
                      user.status === "active"
                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }
                  >
                    {user.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>

                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(user.joinDate).toLocaleDateString("es-ES")}
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500/30 hover:bg-blue-500/10 bg-transparent"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 bg-transparent"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border border-slate-700/50 bg-slate-950/20 p-12 text-center">
            <p className="text-muted-foreground">No se encontraron usuarios</p>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl p-6">
          <p className="text-muted-foreground text-sm mb-1">Total de Usuarios</p>
          <p className="text-3xl font-bold text-blue-400">{users.length}</p>
        </Card>
        <Card className="border border-purple-500/20 bg-slate-950/40 backdrop-blur-xl p-6">
          <p className="text-muted-foreground text-sm mb-1">Administradores</p>
          <p className="text-3xl font-bold text-purple-400">{users.filter((u) => u.role === "admin").length}</p>
        </Card>
        <Card className="border border-green-500/20 bg-slate-950/40 backdrop-blur-xl p-6">
          <p className="text-muted-foreground text-sm mb-1">Usuarios Activos</p>
          <p className="text-3xl font-bold text-green-400">{users.filter((u) => u.status === "active").length}</p>
        </Card>
      </div>
    </div>
  )
}
