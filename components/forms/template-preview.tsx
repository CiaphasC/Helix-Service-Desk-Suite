"use client"

import { useEffect, useMemo, useState } from "react"
import type { FormField, FormTemplate } from "@/types/form-template"

const fieldLabelMap: Record<FormField["type"], string> = {
  text: "Campo de texto",
  email: "Correo",
  number: "Número",
  textarea: "Área de texto",
  select: "Lista desplegable",
  checkbox: "Casillas",
  radio: "Opciones",
  date: "Fecha",
}

export function TemplatePreview({ template }: { template: FormTemplate }) {
  const orderedFields = useMemo(() => {
    return [...template.fields].sort((a, b) => a.order - b.order)
  }, [template.fields])

  const hasFields = orderedFields.length > 0
  const [generatedAt, setGeneratedAt] = useState("")

  useEffect(() => {
    setGeneratedAt(
      new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    )
  }, [])

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-slate-900 via-slate-950 to-[#05060a] text-slate-100 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.75)] overflow-hidden">
      <div className="bg-gradient-to-r from-primary/40 via-accent/30 to-primary/30 px-6 py-5 flex items-center justify-between border-b border-primary/20">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-200/70">Vista previa empresarial</p>
          <h3 className="text-2xl font-semibold leading-tight">{template.name || "Plantilla sin título"}</h3>
        </div>
        <div className="text-right text-xs text-slate-200/70">
                <p>Código ref: {template.id?.slice(0, 8).toUpperCase() || "—"}</p>
                <p>{generatedAt || "—"}</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Descripción", value: template.description || "Sin descripción" },
            { label: "Categoría", value: template.category || "General" },
            { label: "Total de campos", value: orderedFields.length || "0" },
          ].map((meta) => (
            <div
              key={meta.label}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm shadow-inner shadow-black/30"
            >
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-300/60">{meta.label}</p>
              <p className="text-base font-semibold text-white mt-2">{meta.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/5 overflow-hidden bg-white/3 backdrop-blur-sm">
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Detalle de campos configurados</p>
              <p className="text-xs text-slate-300/70">Revisa la estructura exacta del formulario</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary-foreground">
              {orderedFields.length} campos
            </span>
          </div>

          {hasFields ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-slate-300 uppercase tracking-wide text-[11px]">
                  <th className="px-4 py-3 font-semibold">Descripción</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Obligatorio</th>
                  <th className="px-4 py-3 font-semibold">Placeholder / Opciones</th>
                </tr>
              </thead>
              <tbody>
                {orderedFields.map((field) => (
                  <tr key={field.id} className="border-t border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{field.label || "—"}</p>
                      {field.description ? (
                        <p className="text-xs text-slate-300">{field.description}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-200">{fieldLabelMap[field.type]}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-[11px] font-semibold ${
                          field.required
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-slate-600/20 text-slate-200 border border-slate-500/30"
                        }`}
                      >
                        {field.required ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {["select", "checkbox", "radio"].includes(field.type)
                        ? field.options?.join(", ") || "Sin opciones configuradas"
                        : field.placeholder || "Sin placeholder"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-5 py-10 text-center text-slate-300">
              No hay campos configurados. Agrega campos para visualizar la estructura del formulario.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
