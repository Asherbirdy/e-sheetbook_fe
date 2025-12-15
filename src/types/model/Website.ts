export interface SheetField {
  index: number
  name: string
  description: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'blank'
  options?: string[]
}
