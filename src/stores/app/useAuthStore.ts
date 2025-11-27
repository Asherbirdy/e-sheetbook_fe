import { create } from 'zustand'
import { useAuthApi } from '@/api/useAuthApi'

interface AuthStore {
  isLogin: boolean
  setIsAuthenticated: (value: boolean) => void
  checkLogin: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,

  // 設定認證狀態
  setIsAuthenticated: (value: boolean) => set({ isLogin: value }),

  // 檢查登入狀態
  checkLogin: async () => {
    const response = await useAuthApi.checkLogin()

    if (response.data?.status === 'success') {
      set({ isLogin: true })
      return
    }
    set({ isLogin: false })
  },
}))
