import type { NavigateFunction } from 'react-router-dom'

// Guard 函數的返回類型
export type GuardResult = boolean | Promise<boolean>

// Guard 函數的類型定義
export type NavigationGuard = (navigate: NavigateFunction) => GuardResult
export type AuthGuard = (navigate?: NavigateFunction) => GuardResult

/**
 * Dashboard beforeEnter guard
 * 檢查使用者是否有權限進入 Dashboard
 */
export const dashboardBeforeEnter: NavigationGuard = (navigate) => {
  console.log('🔒 Dashboard beforeEnter guard triggered')

  // 這裡可以加入你的驗證邏輯
  // 例如：檢查 token、檢查使用者角色等

  // 範例：檢查是否有 token
  const hasToken = localStorage.getItem('token')

  if (!hasToken) {
    console.log('❌ No token found, redirecting to home')
    navigate('/')
    return false
  }

  console.log('✅ Access granted to Dashboard')
  return true
}

/**
 * Auth beforeEnter guard
 * 檢查使用者是否已登入
 */
export const authBeforeEnter: AuthGuard = (navigate) => {
  console.log('🔐 Auth beforeEnter guard triggered')

  const isAuthenticated = localStorage.getItem('token')

  if (!isAuthenticated && navigate) {
    console.log('❌ User is not authenticated, redirecting to home')
    navigate('/')
    return false
  }

  if (isAuthenticated) {
    console.log('✅ User is authenticated')
    return true
  }

  console.log('⚠️ User is not authenticated')
  return false
}

/**
 * Guest beforeEnter guard
 * 檢查使用者是否為訪客（未登入）
 * 已登入的使用者將被重定向到 dashboard
 */
export const guestBeforeEnter: NavigationGuard = (navigate) => {
  console.log('👤 Guest beforeEnter guard triggered')

  const isAuthenticated = localStorage.getItem('token')

  if (isAuthenticated) {
    console.log('⚠️ User is authenticated, redirecting to dashboard')
    navigate('/dashboard')
    return false
  }

  console.log('✅ Guest access allowed')
  return true
}

/**
 * Admin beforeEnter guard
 * 檢查使用者是否為管理員
 */
export const adminBeforeEnter: NavigationGuard = (navigate) => {
  console.log('👑 Admin beforeEnter guard triggered')

  const isAuthenticated = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to home')
    navigate('/')
    return false
  }

  if (userRole !== 'admin') {
    console.log('❌ Not admin, redirecting to dashboard')
    navigate('/dashboard')
    return false
  }

  console.log('✅ Admin access granted')
  return true
}
