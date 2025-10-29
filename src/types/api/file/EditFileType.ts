export interface EditFilePayload {
  name: string,
  fileId: string,
}

export interface EditFileResponse {
  msg: string
  file: File
}

export interface EditFile {
  _id: string
  name: string
  userId: string
  __v: number
}