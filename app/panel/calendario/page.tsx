"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, User, Zap } from "lucide-react"
import gsap from "gsap"

interface Service {
  id: string
  name: string
  user: string
  level: "critical" | "high" | "medium" | "low"
  date: string
  time: string
}

const demoServices: Service[] = [
  {
    id: "1",
    name: "Soporte Crítico",
    user: "Carlos García",
    level: "critical",
    date: "2024-11-15",
    time: "09:00",
  },
  {
    id: "2",
    name: "Implementación",
    user: "María López",
    level: "high",
    date: "2024-11-15",
    time: "14:00",
  },
  {
    id: "3",
    name: "Consultoría",
    user: "Juan Pérez",
    level: "medium",
    date: "2024-11-20",
    time: "10:00",
  },
  {
    id: "4",
    name: "Mantenimiento",
    user: "Ana Martínez",
    level: "low",
    date: "2024-11-25",
    time: "15:00",
  },
]

type ViewMode = "month" | "week" | "day"

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 15))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getServicesForDate = (date: string) => {
    return demoServices.filter((s) => s.date === date)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const monthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return (
      <div className="space-y-6">
        {/* Calendar Grid */}
        <Card className="border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dateStr = day
                ? `2024-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : null
              const services = dateStr ? getServicesForDate(dateStr) : []

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (dateStr && services.length > 0) {
                      setSelectedDate(dateStr)
                      setShowModal(true)
                    }
                  }}
                  className={`min-h-24 p-2 rounded-lg border transition-all ${
                    day
                      ? services.length > 0
                        ? "border-blue-500/30 bg-blue-500/5 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/10"
                        : "border-slate-700/30 bg-slate-900/30"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-semibold text-foreground mb-1">{day}</div>
                      <div className="space-y-1">
                        {services.slice(0, 2).map((service) => (
                          <div
                            key={service.id}
                            className={`text-xs px-2 py-1 rounded truncate ${getLevelColor(service.level)}`}
                          >
                            {service.name}
                          </div>
                        ))}
                        {services.length > 2 && (
                          <div className="text-xs text-blue-400 font-semibold">+{services.length - 2} más</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  const weekView = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      return date
    })

    const hours = Array.from({ length: 24 }).map((_, i) => i)

    const getServicePosition = (service: Service) => {
      const [hour, minute] = service.time.split(":").map(Number)
      return hour + minute / 60
    }

    return (
      <div className="space-y-6">
        <Card className="border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl p-6 overflow-x-auto">
          {/* Week grid container */}
          <div className="min-w-max">
            {/* Days header */}
            <div className="flex mb-4">
              <div className="w-24 flex-shrink-0"></div>
              {weekDays.map((date, i) => (
                <div key={i} className="flex-1 min-w-32 text-center px-2">
                  <div className="text-sm font-semibold text-foreground">
                    {date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {date.toLocaleDateString("es-ES", { month: "numeric", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours and services grid */}
            <div className="space-y-2 border-t border-slate-700/30 pt-4">
              {hours.map((hour) => {
                return (
                  <div key={hour} className="flex">
                    {/* Hour label */}
                    <div className="w-24 flex-shrink-0 pr-4 text-right">
                      <div className="text-xs text-muted-foreground font-medium">
                        {String(hour).padStart(2, "0")}:00
                      </div>
                    </div>

                    {/* Day columns */}
                    {weekDays.map((date, dayIndex) => {
                      const dateStr = date.toISOString().split("T")[0]
                      const servicesInHour = getServicesForDate(dateStr).filter((s) => {
                        const serviceHour = Number.parseInt(s.time.split(":")[0])
                        return serviceHour === hour
                      })

                      return (
                        <div
                          key={dayIndex}
                          className="flex-1 min-w-32 px-2 h-16 border border-slate-700/20 rounded-lg bg-slate-900/20 hover:bg-slate-900/40 transition-colors relative"
                        >
                          {servicesInHour.map((service, idx) => (
                            <div
                              key={service.id}
                              className={`text-xs px-2 py-1 rounded mt-1 truncate cursor-pointer hover:shadow-lg transition-all ${getLevelColor(
                                service.level,
                              )}`}
                              title={`${service.name} - ${service.user}`}
                            >
                              <div className="font-medium truncate">{service.name}</div>
                              <div className="truncate text-muted-foreground">{service.user}</div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const dayView = () => {
    return (
      <div className="space-y-6">
        <Card className="border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl p-6">
          <div className="space-y-4">
            {Array.from({ length: 24 }).map((_, hour) => {
              const dateStr = currentDate.toISOString().split("T")[0]
              const servicesInHour = getServicesForDate(dateStr).filter((s) => {
                const serviceHour = Number.parseInt(s.time.split(":")[0])
                return serviceHour === hour
              })

              return (
                <div key={hour} className="p-4 rounded-lg border border-slate-700/30 bg-slate-900/30">
                  <div className="font-semibold text-foreground mb-3">{String(hour).padStart(2, "0")}:00</div>
                  <div className="space-y-2">
                    {servicesInHour.length > 0 ? (
                      servicesInHour.map((service) => (
                        <div key={service.id} className={`text-sm px-3 py-2 rounded ${getLevelColor(service.level)}`}>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-xs mt-1">{service.user}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground">Disponible</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    )
  }

  const miniCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    // Get week days for indicators if in week view
    const weekStart = new Date(currentDate)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      return date
    })

    const getWeekDayIndicators = () => {
      if (viewMode !== "week") return new Set()
      return new Set(weekDays.filter((d) => d.getMonth() === currentDate.getMonth()).map((d) => d.getDate()))
    }

    const getDayViewIndicator = () => {
      if (viewMode !== "day") return null
      return currentDate.getDate()
    }

    const weekIndicators = getWeekDayIndicators()
    const dayIndicator = getDayViewIndicator()

    return (
      <Card className="border border-blue-500/20 bg-slate-950/40 backdrop-blur-xl p-5 h-fit sticky top-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumen</p>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground capitalize">
                {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
              </h3>
              <span className="text-xs font-semibold text-blue-400">{demoServices.length}</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <p className="text-sm font-semibold text-foreground">
              {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </p>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-4 space-y-3">
          {/* Week days */}
          <div className="grid grid-cols-7 gap-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isCurrentDay =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
              const isWeekDay = weekIndicators.has(day)
              const isDayViewSelected = dayIndicator === day

              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all relative ${
                    day
                      ? isCurrentDay
                        ? "bg-white/90 text-slate-900"
                        : isDayViewSelected
                          ? "bg-blue-500/30 text-foreground border border-blue-500/50"
                          : isWeekDay
                            ? "bg-slate-800/60 text-foreground border border-slate-600/50"
                            : "text-muted-foreground hover:bg-slate-800/30"
                      : ""
                  }`}
                >
                  {day}

                  {isWeekDay && viewMode === "week" && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  )}
                  {isDayViewSelected && viewMode === "day" && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    )
  }

  useEffect(() => {
    const contentElement = document.querySelector("[data-calendar-content]")
    if (contentElement) {
      gsap.fromTo(contentElement, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })
    }
  }, [viewMode, currentDate])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
      {/* Main Calendar */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header */}
        <div data-calendar-header className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Calendario de Servicios
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Visualiza todos los servicios programados</p>
            </div>
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700/50 backdrop-blur-sm">
              {(["month", "week", "day"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
                    viewMode === mode
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-800/50"
                  }`}
                >
                  {mode === "month" ? "Mes" : mode === "week" ? "Semana" : "Día"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div data-calendar-content key={`${viewMode}-${currentDate.toISOString()}`}>
          {viewMode === "month" && monthView()}
          {viewMode === "week" && weekView()}
          {viewMode === "day" && dayView()}
        </div>
      </div>

      {/* Mini Calendar - now fixed size in sidebar */}
      <div className="hidden lg:block">{miniCalendarView()}</div>

      {/* Modal for services */}
      {showModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <Card className="border border-blue-500/20 bg-slate-950 backdrop-blur-2xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {new Date(selectedDate).toLocaleDateString("es-ES", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {getServicesForDate(selectedDate).map((service) => (
                  <div key={service.id} className="p-4 rounded-lg border border-blue-500/20 bg-slate-900/50 space-y-2">
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {service.user}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {service.time}
                      </div>
                    </div>
                    <Badge className={getLevelColor(service.level)}>
                      <Zap className="w-3 h-3 mr-1" />
                      {service.level.charAt(0).toUpperCase() + service.level.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
