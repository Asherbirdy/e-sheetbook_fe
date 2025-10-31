import {
  ReactElement, useEffect, useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Center, Spinner } from '@chakra-ui/react'
import type { NavigationGuard } from './guards'

interface ProtectedRouteProps {
  children: ReactElement
  guard: NavigationGuard
  fallback?: ReactElement
}

/**
 * ProtectedRoute 組件
 * 使用 guard 函數來保護路由
 *
 * @example
 * ```tsx
 * <ProtectedRoute guard={dashboardBeforeEnter}>
 *   <Dashboard />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute = ({
  children,
  guard,
  fallback = (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  ),
}: ProtectedRouteProps) => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true)
      try {
        const result = await Promise.resolve(guard(navigate))
        setHasAccess(result)
      } catch (error) {
        console.error('Guard check failed:', error)
        setHasAccess(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAccess()
  }, [guard, navigate])

  if (isChecking) {
    return fallback
  }

  return hasAccess ? children : null
}
