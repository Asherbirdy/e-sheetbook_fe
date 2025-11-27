import { create } from 'zustand'
import { useAuthApi } from '@/api/useAuthApi'

interface AuthStore {
  isLogin: boolean
  getIsLogin: () => boolean
  checkLogin: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLogin: false,

  // 取得登入狀態
  getIsLogin: () => get().isLogin,

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
