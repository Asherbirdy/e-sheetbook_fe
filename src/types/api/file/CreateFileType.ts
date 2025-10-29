export interface CreateFilePayload {
  name: string
}

export interface CreateFileResponse {
  msg: string
  name: string
  file: CreateFile
}

export interface CreateFile {
  name: string
  userId: string
  _id: string
  __v: number
}