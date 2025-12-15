export interface GetAllWebsiteResponse {
  message: string
  websites: GetAllWebsite[]
}

export interface SheetField {
  index: number
  name: string
  description: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'blank'
  options?: string[]
}

export interface GetAllWebsite {
  _id: string

  // Google Sheet Info
  googleSheetName: string
  googleSheetApiUrl: string
  googleSheetId: string
  googleSheetStartRow?: number
  googleSheetFields: SheetField[]

  // Website configuration
  websiteTitle?: string
  websiteDescription?: string
  websiteHtml?: string
  websiteStatus: 'active' | 'inactive'
  websiteNeedPassword: boolean
  // websitePassword is usually not returned in list APIs for security,
  // but included here as optional just in case the API returns it
  websitePassword?: string

  user: string // ObjectId string
  createdAt: string
  updatedAt: string
  __v: number

  // Deprecated or removed fields (kept as optional if API still returns them for compatibility)
  sheetName?: string
  sheetApiUrl?: string
  sheetId?: string
  sheetFields?: SheetField[]
}