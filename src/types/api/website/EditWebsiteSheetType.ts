export interface EditWebsiteSheetPayload {
  websiteId: string
  googleSheetName: string
  googleSheetApiUrl: string
  googleSheetId: string
  googleSheetStartRow: number
  googleSheetFields: any[]
}

export interface EditWebsiteSheetResponse {
  message: string
  website: EditWebsiteSheet
}

export interface EditWebsiteSheet {
  _id: string
  googleSheetName: string
  googleSheetApiUrl: string
  googleSheetId: string
  websiteStatus: string
  user: string
  googleSheetFields: any[]
  createdAt: string
  updatedAt: string
  __v: number
  googleSheetStartRow: number
  websiteNeedPassword: boolean
}
