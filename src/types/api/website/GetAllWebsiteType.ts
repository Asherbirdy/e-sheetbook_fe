export interface GetAllWebsiteResponse {
  message: string
  websites: GetAllWebsite[]
}

export interface GetAllWebsite {
  googleSheetName: string
  websiteNeedPassword: boolean
  _id: string
  sheetName?: string
  sheetApiUrl?: string
  sheetId?: string
  websiteStatus: string
  user: string
  sheetFields?: any[]
  createdAt: string
  updatedAt: string
  __v: number
  googleSheetFields: any[]
  googleSheetApiUrl?: string
  googleSheetId?: string
}