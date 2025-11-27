import { create } from 'zustand'
import { useAuthApi } from '@/api/useAuthApi'

interface AuthStore {
  isLogin: boolean
  isInitialized: boolean
  setIsAuthenticated: (value: boolean) => void
  checkLogin: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  isInitialized: false,

  // 設定認證狀態
  setIsAuthenticated: (value: boolean) => set({ isLogin: value }),

  // 檢查登入狀態
  checkLogin: async () => {

    const response = await useAuthApi.checkLogin()

    if (response.data?.status === 'success') {
      set({ isLogin: true, isInitialized: true })
      return
    }
    set({ isLogin: false, isInitialized: true })
  },
}))

// 導出 getter 函數,可以在非 React 環境中使用
export const getIsLogin = () => useAuthStore.getState().isLogin
export const getIsInitialized = () => useAuthStore.getState().isInitialized
