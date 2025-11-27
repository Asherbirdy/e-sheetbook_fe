# useAuthStore 使用範例

## ✅ 修正後的版本

### 主要改進
1. **新增 `isInitialized`**:追蹤是否已經檢查過登入狀態
2. **導出獨立的 getter 函數**:可以在任何地方直接使用
3. **在 App.tsx 初始化**:確保進入頁面時就檢查登入狀態

## 📖 使用方式

### 1. 在 React 元件中使用

```typescript
import { useAuthStore } from '@/stores'

const MyComponent = () => {
  const isLogin = useAuthStore((state) => state.isLogin)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  // 顯示載入中狀態
  if (!isInitialized) {
    return <div>檢查登入狀態中...</div>
  }

  return (
    <div>
      {isLogin ? '已登入' : '未登入'}
    </div>
  )
}
```

### 2. 使用獨立的 getter 函數 (推薦)

```typescript
import { getIsLogin, getIsInitialized } from '@/stores'

// 在任何地方都可以直接使用
const MyUtilFunction = () => {
  const isLogin = getIsLogin()
  console.log('當前登入狀態:', isLogin)

  if (isLogin) {
    // 做某些需要登入的操作
  }
}

// 在路由守衛中使用
export const authGuard = () => {
  const isLogin = getIsLogin()

  if (!isLogin) {
    return false // 未登入,阻止進入
  }
  return true
}
```

### 3. 手動設定登入狀態

```typescript
import { useAuthStore } from '@/stores'

const LoginComponent = () => {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

  const handleLogin = async () => {
    // 登入成功後
    setIsAuthenticated(true)
  }

  return <button onClick={handleLogin}>登入</button>
}
```

### 4. 完整範例:在 HomeHeader 中使用

```typescript
import { useAuthStore, getIsLogin } from '@/stores'

const HomeHeader = () => {
  const isLogin = useAuthStore((state) => state.isLogin)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const handleCheckStatus = () => {
    // 使用獨立的 getter
    console.log('當前狀態:', getIsLogin())
  }

  return (
    <div>
      {isLogin ? (
        <>
          <Avatar />
          <button onClick={handleLogout}>登出</button>
        </>
      ) : (
        <button onClick={handleLoginSuccess}>登入</button>
      )}
      <button onClick={handleCheckStatus}>檢查狀態</button>
    </div>
  )
}
```

## 🔄 初始化流程

```
App.tsx 載入
  ↓
useEffect 執行 checkLogin()
  ↓
呼叫 useAuthApi.checkLogin()
  ↓
等待 API 回應
  ↓
設定 isLogin 和 isInitialized
  ↓
所有元件可以正確取得狀態 ✅
```

## 📝 重要提示

### ✅ 正確的使用方式

```typescript
// 方式 1: 在 React 元件中
const isLogin = useAuthStore((state) => state.isLogin)

// 方式 2: 在非 React 環境中
import { getIsLogin } from '@/stores'
const isLogin = getIsLogin()
```

### ❌ 錯誤的使用方式

```typescript
// ❌ 不要這樣用,已經移除
const getIsLogin = useAuthStore((state) => state.getIsLogin)
const isLogin = getIsLogin()

// ❌ 不要在元件外部直接使用 hook
const isLogin = useAuthStore((state) => state.isLogin) // 只能在 React 元件內
```

## 🎯 API 說明

### Store 狀態
- `isLogin: boolean` - 是否已登入
- `isInitialized: boolean` - 是否已經初始化(檢查過登入狀態)

### Store 方法
- `setIsAuthenticated(value: boolean)` - 手動設定登入狀態
- `checkLogin()` - 非同步檢查登入狀態

### 獨立 Getter 函數
- `getIsLogin()` - 取得當前登入狀態
- `getIsInitialized()` - 取得是否已初始化

## 🚀 實際應用場景

### 場景 1: 路由守衛

```typescript
import { getIsLogin } from '@/stores'

export const dashboardBeforeEnter = () => {
  const isLogin = getIsLogin()

  if (!isLogin) {
    console.log('未登入,重導向到首頁')
    return false
  }
  return true
}
```

### 場景 2: API 請求攔截器

```typescript
import { getIsLogin } from '@/stores'

axios.interceptors.request.use((config) => {
  const isLogin = getIsLogin()

  if (isLogin) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }

  return config
})
```

### 場景 3: 條件渲染

```typescript
import { useAuthStore } from '@/stores'

const Dashboard = () => {
  const isLogin = useAuthStore((state) => state.isLogin)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  if (!isInitialized) return <Loading />
  if (!isLogin) return <Navigate to="/login" />

  return <DashboardContent />
}
```
