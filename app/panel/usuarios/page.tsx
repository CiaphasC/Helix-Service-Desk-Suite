"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Trash2, Edit2, Plus, Search, Users, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts"

interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
  status: "active" | "inactive"
  joinDate: string
}

const demoUsers: User[] = [
  {
    id: "1",
    name: "Carlos García",
    email: "carlos@example.com",
    password: "Secret#123",
    role: "admin",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "María López",
    email: "maria@example.com",
    password: "Secret#123",
    role: "user",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "Secret#123",
    role: "user",
    status: "active",
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    password: "Secret#123",
    role: "admin",
    status: "active",
    joinDate: "2024-01-05",
  },
]

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(demoUsers)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [activeRoleTab, setActiveRoleTab] = useState<"user" | "admin">("user")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
  })
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
  })

  useEffect(() => {
    const filtered = users
      .filter((user) => user.role === activeRoleTab)
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    setFilteredUsers(filtered)
  }, [searchTerm, users, activeRoleTab])

  const totalUsers = users.length
  const adminCount = users.filter((u) => u.role === "admin").length
  const activeCount = users.filter((u) => u.status === "active").length

  const monthlyRegistrations = useMemo(() => {
    const now = new Date()
    const data = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = monthDate.toLocaleString("es-ES", { month: "short" })
      const total = users.filter((user) => {
        const join = new Date(user.joinDate)
        return join.getFullYear() === monthDate.getFullYear() && join.getMonth() === monthDate.getMonth()
      }).length
      data.push({
        month: label.charAt(0).toUpperCase() + label.slice(1),
        usuarios: total,
      })
    }
    return data
  }, [users])

  const resetForm = () => {
    setNewUserForm({ name: "", email: "", password: "", role: "user", status: "active" })
    setFormError("")
  }

  const handleCreateUser = () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) {
      setFormError("Nombre, correo y contraseña son obligatorios.")
      return
    }

    setUsers((prev) => [
      ...prev,
      {
        id: createId(),
        name: newUserForm.name.trim(),
        email: newUserForm.email.trim(),
        password: newUserForm.password.trim(),
        role: newUserForm.role,
        status: newUserForm.status,
        joinDate: new Date().toISOString(),
      },
    ])
    setIsCreateOpen(false)
    resetForm()
    resetForm()
  }

  const handleOpenEdit = (user: User) => {
    setEditingUserId(user.id)
    setEditUserForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
    })
    setFormError("")
    setIsEditOpen(true)
  }

  const handleUpdateUser = () => {
    if (!editUserForm.name.trim() || !editUserForm.email.trim() || !editUserForm.password.trim()) {
      setFormError("Nombre, correo y contraseña son obligatorios.")
      return
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUserId
          ? {
              ...user,
              name: editUserForm.name.trim(),
              email: editUserForm.email.trim(),
              password: editUserForm.password.trim(),
              role: editUserForm.role,
              status: editUserForm.status,
            }
          : user,
      ),
    )
    setIsEditOpen(false)
    setEditingUserId(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteUserId) return
    setUsers((prev) => prev.filter((user) => user.id !== deleteUserId))
    setDeleteUserId(null)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Hero */}
      <div className="space-y-4 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent border border-blue-500/10 rounded-2xl p-6 shadow-lg shadow-blue-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-400">Panel de usuarios</p>
            <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground">Gestiona accesos, roles y actividad de tu organización</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 px-6"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-xl p-5 shadow-lg shadow-blue-500/10">
          <p className="text-sm text-blue-200">Total de usuarios</p>
          <p className="text-4xl font-bold text-white mt-2">{totalUsers}</p>
          <p className="text-xs text-white/70 mt-1">Incluye roles administrativos y operativos</p>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-xl p-5 shadow-lg shadow-purple-500/10">
          <p className="text-sm text-purple-200">Administradores</p>
          <p className="text-4xl font-bold text-white mt-2">{adminCount}</p>
          <p className="text-xs text-white/70 mt-1">
            {totalUsers > 0 ? ((adminCount / totalUsers) * 100).toFixed(0) : 0}% de la base total
          </p>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-xl p-5 shadow-lg shadow-emerald-500/10">
          <p className="text-sm text-emerald-200">Usuarios activos</p>
          <p className="text-4xl font-bold text-white mt-2">{activeCount}</p>
          <p className="text-xs text-white/70 mt-1">Usuarios con sesiones habilitadas</p>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-blue-500/10 bg-card/60 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Registro mensual</h3>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRegistrations} barCategoryGap="20%">
                <XAxis dataKey="month" stroke="currentColor" className="text-xs text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="usuarios" fill="url(#chartGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.9)" />
                    <stop offset="100%" stopColor="rgba(168,85,247,0.4)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-purple-500/10 bg-card/60 backdrop-blur-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Distribución de roles</h3>
          {[
            {
              label: "Administradores",
              value: adminCount,
              percentage: totalUsers > 0 ? (adminCount / totalUsers) * 100 : 0,
              color: "from-blue-500 to-blue-400",
            },
            {
              label: "Usuarios",
              value: totalUsers - adminCount,
              percentage: totalUsers > 0 ? ((totalUsers - adminCount) / totalUsers) * 100 : 0,
              color: "from-purple-500 to-purple-400",
            },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Users list */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Listado de usuarios</h2>
            <p className="text-sm text-muted-foreground">
              Visualiza perfiles por tipo de rol y busca por nombre o correo
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-primary/20 bg-secondary/40 p-1 shadow-inner">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 rounded-lg px-4 ${
                activeRoleTab === "user" ? "bg-primary/15 text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setActiveRoleTab("user")}
            >
              <Users className="w-4 h-4" />
              Usuarios
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 rounded-lg px-4 ${
                activeRoleTab === "admin" ? "bg-primary/15 text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setActiveRoleTab("admin")}
            >
              <Shield className="w-4 h-4" />
              Administradores
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 bg-slate-900/50 border-blue-500/30 text-sm h-11 rounded-xl"
          />
        </div>
        <div className="grid gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                data-user-card
                className="border border-blue-500/20 bg-slate-950/60 backdrop-blur-2xl overflow-hidden hover:border-blue-400/40 transition-all duration-300 group"
              >
                <div className="p-5 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                        <span className="text-lg font-bold text-white">{user.name.charAt(0)}</span>
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
                          ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
                          : "bg-purple-500/20 text-purple-200 border-purple-500/30"
                      }
                    >
                      {user.role === "admin" ? "Administrador" : "Usuario"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/10 text-red-300 border-red-500/30"
                      }
                    >
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>

                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Alta {new Date(user.joinDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 hover:bg-blue-500/10 bg-transparent"
                      onClick={() => handleOpenEdit(user)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 bg-transparent"
                      onClick={() => setDeleteUserId(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border border-slate-700/50 bg-slate-950/40 p-12 text-center">
              <p className="text-muted-foreground">
                {activeRoleTab === "admin"
                  ? "No hay administradores que coincidan con la búsqueda."
                  : "No hay usuarios que coincidan con la búsqueda."}
              </p>
            </Card>
          )}
        </div>
      </div>

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            resetForm()
          } else {
            setIsCreateOpen(true)
          }
        }}
      >
        <DialogContent className="bg-card/90 backdrop-blur-xl border border-blue-500/20">
          <DialogHeader>
            <DialogTitle>Registrar nuevo usuario</DialogTitle>
            <DialogDescription>Completa la información básica para otorgar acceso a la plataforma.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Ej: Laura Mendoza"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Rol</Label>
                <select
                  id="role"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm((prev) => ({ ...prev, role: e.target.value as User["role"] }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm"
                >
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={newUserForm.status}
                  onChange={(e) => setNewUserForm((prev) => ({ ...prev, status: e.target.value as User["status"] }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="password">Contraseña temporal</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            {formError && <p className="text-sm text-red-400">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Guardar usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditOpen(false)
            setEditingUserId(null)
            setFormError("")
          } else {
            setIsEditOpen(true)
          }
        }}
      >
        <DialogContent className="bg-card/90 backdrop-blur-xl border border-blue-500/20">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Actualiza los datos del usuario seleccionado.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre completo</Label>
              <Input
                id="edit-name"
                value={editUserForm.name}
                onChange={(e) => setEditUserForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Correo</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUserForm.email}
                onChange={(e) => setEditUserForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-role">Rol</Label>
                <select
                  id="edit-role"
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm((prev) => ({ ...prev, role: e.target.value as User["role"] }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm"
                >
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <select
                  id="edit-status"
                  value={editUserForm.status}
                  onChange={(e) => setEditUserForm((prev) => ({ ...prev, status: e.target.value as User["status"] }))}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/40 border border-border text-sm"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-password">Contraseña</Label>
              <Input
                id="edit-password"
                type="password"
                value={editUserForm.password}
                onChange={(e) => setEditUserForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            {formError && <p className="text-sm text-red-400">{formError}</p>}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false)
                setEditingUserId(null)
                setFormError("")
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteUserId)} onOpenChange={(open) => (!open ? setDeleteUserId(null) : null)}>
        <DialogContent className="bg-card/90 backdrop-blur-xl border border-red-500/20">
          <DialogHeader>
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer. ¿Deseas continuar?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-500">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
