export interface EditSheetPayload {
  name: string
  url: string
  api: string
  fileId: string
  sheetId: string
}

export interface EditSheetResponse {
  msg: string
  sheetUpdated: EditSheet
}

export interface EditSheet {
  _id: string
  name: string
  url: string
  fileId: string
  userId: string
  __v: number
  api: string
  updatedAt: string
}
