export interface GetSheetFromFileApi {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
}
export interface GetSheetFromFilePayload {
  fileId: string
}

export interface GetSheetFromFileResponse {
  msg: string
  sheets: Sheet[]
}

export interface Sheet {
  _id: string
  name: string
  url: string
  fileId: string
  userId: string
  __v: number
  api: GetSheetFromFileApi[]
  updatedAt: string
}
