# useAuthStore 使用說明

## 功能

`useAuthStore` 是一個使用 Zustand 建立的全域認證狀態管理 store。

## API

### 狀態
- `isAuthenticated: boolean` - 使用者是否已登入

### 方法
- `setIsAuthenticated(value: boolean)` - 手動設定認證狀態
- `checkLogin()` - 呼叫 API 檢查登入狀態並自動更新 `isAuthenticated`

## 使用範例

### 1. 基本使用

```typescript
import { useAuthStore } from '@/stores'

const MyComponent = () => {
  const { isAuthenticated, checkLogin } = useAuthStore()

  useEffect(() => {
    // 元件載入時檢查登入狀態
    checkLogin()
  }, [])

  return (
    <div>
      {isAuthenticated ? '已登入' : '未登入'}
    </div>
  )
}
```

### 2. 手動設定狀態

```typescript
import { useAuthStore } from '@/stores'

const LoginComponent = () => {
  const { setIsAuthenticated } = useAuthStore()

  const handleLogin = async () => {
    // 登入成功後
    setIsAuthenticated(true)
  }

  return <button onClick={handleLogin}>登入</button>
}
```

### 3. 在 HomeHeader 中使用

```typescript
import { useAuthStore } from '@/stores'

const HomeHeader = () => {
  const { isAuthenticated, checkLogin, setIsAuthenticated } = useAuthStore()

  // 進入頁面時檢查登入狀態
  useEffect(() => {
    checkLogin()
  }, [])

  // 登入成功後
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    // 或者重新檢查
    checkLogin()
  }

  return (
    <div>
      {isAuthenticated ? (
        <Avatar />
      ) : (
        <Button>Login</Button>
      )}
    </div>
  )
}
```

## 運作原理

```typescript
// checkLogin() 執行流程
checkLogin()
  ↓
呼叫 useAuthApi.checkLogin()
  ↓
檢查 response.data?.status === 'success'
  ↓
是 → set({ isAuthenticated: true })
否/錯誤 → set({ isAuthenticated: false })
```

## 注意事項

1. `checkLogin()` 是 async 函數,會自動處理錯誤
2. 錯誤時會自動設定 `isAuthenticated = false`
3. 可以配合 React Query 的 `invalidateQueries` 使用
4. 建議在 App 最上層或 Layout 中呼叫 `checkLogin()`
