export interface DeleteFilePayload {
  fileId: string
}

export interface DeleteFileResponse {
  msg: string
  deletedFile: DeletedFile
}

export interface DeletedFile {
  _id: string
  name: string
  userId: string
  __v: number
}