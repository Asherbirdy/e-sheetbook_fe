# Router Guards 使用說明

## 簡介

這個資料夾包含了頁面路由的守衛函數（guards）和保護組件，用於在進入特定頁面前執行檢查或驗證。

## 檔案結構

```
router/
├── guards.ts           # 守衛函數定義
├── ProtectedRoute.tsx  # 通用保護路由組件
├── index.ts           # 統一導出
└── README.md          # 使用說明
```

## 使用方式

### 方式一：使用 ProtectedRoute 組件（推薦）

這是最簡潔且推薦的方式，適用於需要保護的單個頁面或組件。

```tsx
import { ProtectedRoute, dashboardBeforeEnter } from '@/router'

const App = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute guard={dashboardBeforeEnter}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
```

### 方式二：在 Layout 中使用

適用於需要保護整個 Layout 下的所有頁面。

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardBeforeEnter } from '@/router'

export const DashboardLayout = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    dashboardBeforeEnter(navigate)
  }, [navigate])

  return <>{children}</>
}
```

**實際範例：** 請參考 `src/layout/DashboardLayout.tsx`

### 方式三：在頁面組件中直接使用

適用於需要細粒度控制的情況。

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authBeforeEnter } from '@/router'

const ProtectedPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const hasAccess = authBeforeEnter(navigate)
    if (!hasAccess) {
      // 處理無權限的情況
    }
  }, [navigate])

  return <div>Protected Content</div>
}
```

## 可用的 Guards

### `dashboardBeforeEnter`
- **用途**: 檢查是否有權限進入 Dashboard
- **檢查項目**: localStorage 中的 token
- **失敗行為**: 重定向到首頁 `/`

### `authBeforeEnter`
- **用途**: 檢查使用者是否已登入
- **檢查項目**: localStorage 中的 token
- **失敗行為**: 重定向到首頁 `/`（當提供 navigate 參數時）
- **返回值**: boolean

### `guestBeforeEnter`
- **用途**: 檢查使用者是否為訪客（未登入時才允許進入）
- **檢查項目**: localStorage 中的 token
- **失敗行為**: 如果已登入，重定向到 `/dashboard`
- **使用場景**: 登入頁、註冊頁等只允許未登入用戶訪問的頁面

### `adminBeforeEnter`
- **用途**: 檢查使用者是否為管理員
- **檢查項目**:
  - localStorage 中的 token（是否登入）
  - localStorage 中的 userRole（是否為 admin）
- **失敗行為**:
  - 未登入：重定向到首頁 `/`
  - 已登入但非 admin：重定向到 `/dashboard`

## 自定義 Guard

你可以在 `guards.ts` 中新增自己的守衛函數：

```typescript
import type { NavigateFunction } from 'react-router-dom'
import type { NavigationGuard } from './guards'

export const customGuard: NavigationGuard = (navigate) => {
  console.log('🎯 Custom guard triggered')

  // 你的驗證邏輯
  const isValid = checkSomething()

  if (!isValid) {
    navigate('/error')
    return false
  }

  return true
}
```

### 支援異步 Guard

Guards 支援返回 Promise，可以處理異步驗證：

```typescript
export const asyncGuard: NavigationGuard = async (navigate) => {
  try {
    const response = await fetch('/api/check-permission')
    const { hasPermission } = await response.json()

    if (!hasPermission) {
      navigate('/')
      return false
    }

    return true
  } catch (error) {
    console.error('Permission check failed:', error)
    navigate('/error')
    return false
  }
}
```

## 型別定義

```typescript
// Guard 函數的返回類型
type GuardResult = boolean | Promise<boolean>

// 需要 navigate 參數的 guard
type NavigationGuard = (navigate: NavigateFunction) => GuardResult

// 可選 navigate 參數的 guard
type AuthGuard = (navigate?: NavigateFunction) => GuardResult
```

## 完整範例

### 保護管理員頁面

```tsx
import { ProtectedRoute, adminBeforeEnter } from '@/router'

<Route
  path="/admin"
  element={
    <ProtectedRoute guard={adminBeforeEnter}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### 組合多個 Guards

```tsx
import { ProtectedRoute, authBeforeEnter, adminBeforeEnter } from '@/router'

const combinedGuard = (navigate: NavigateFunction) => {
  // 先檢查是否登入
  if (!authBeforeEnter(navigate)) {
    return false
  }

  // 再檢查是否為管理員
  return adminBeforeEnter(navigate)
}

<Route
  path="/super-admin"
  element={
    <ProtectedRoute guard={combinedGuard}>
      <SuperAdminPanel />
    </ProtectedRoute>
  }
/>
```
