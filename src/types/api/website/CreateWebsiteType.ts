export interface CreateWebsitePayload {
  googleSheetName: string
  googleSheetApiUrl: string
  googleSheetId: string
}

export interface CreateWebsiteResponse {
  message: string
  website: CreateWebsiteData
}

export interface CreateWebsiteData {
  googleSheetName: string
  googleSheetApiUrl: string
  googleSheetId: string
  websiteStatus: string
  websiteNeedPassword: boolean
  user: string
  _id: string
  googleSheetFields: any[]
  createdAt: string
  updatedAt: string
  __v: number
}
