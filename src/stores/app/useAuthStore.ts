import { create } from 'zustand'
import { useAuthApi } from '@/api/useAuthApi'

interface AuthStore {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  checkLogin: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,

  // 設定認證狀態
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  // 檢查登入狀態
  checkLogin: async () => {
    const response = await useAuthApi.checkLogin()

    if (response.data?.status === 'success') {
      set({ isAuthenticated: true })
      return
    }
    set({ isAuthenticated: false })
  },
}))
