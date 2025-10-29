export interface DeleteSheetPayload {
  sheetId: string
}

export interface DeleteSheetResponse {
  msg: string
  sheetDeleted: SheetDeleted
}

export interface SheetDeleted {
  _id: string
  name: string
  url: string
  fileId: string
  userId: string
  __v: number
  api: string
  updatedAt: string
}
