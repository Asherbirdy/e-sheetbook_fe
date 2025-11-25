export interface SheetSchema {
  _id: string
  name: string
  url: string
  api: {
    _id?: string
    name?: string
    method?: string
    url?: string
  }[]
  fileId: string
  userId: string
  createdAt: string
  updatedAt: string
}
