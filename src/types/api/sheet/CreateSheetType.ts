export interface CreateSheetPayload {
  name: string
  url: string
  fileId: string
}

export interface CreateSheetResponse {
  msg: string
  sheet: CreateSheet
}

export interface CreateSheet {
  name: string
  url: string
  fileId: string
  userId: string
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}