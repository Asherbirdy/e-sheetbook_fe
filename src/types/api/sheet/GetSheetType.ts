export interface GetSheetResponse {
  msg: string
  files: File[]
}

export interface GetSheetFile {
  _id: string
  name: string
  userId: string
  sheets: GetSheetSheet[]
}

export interface GetSheetSheet {
  _id: string
  name: string
  url: string
  userId: string
  createdAt: string
  updatedAt: string
  __v: number
}
