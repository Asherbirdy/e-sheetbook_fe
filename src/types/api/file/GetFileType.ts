export interface GetFileResponse {
  msg: string
  file: GetFile[]
}

export interface GetFile {
  _id: string
  name: string
  userId: string
  __v: number
}
