export interface FormField {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date"
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  description?: string
  order: number
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: FormField[]
  createdAt: Date
  updatedAt: Date
  published: boolean
}
