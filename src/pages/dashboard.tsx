import { Outlet } from 'react-router-dom'
import { DashboardLayout } from '@/layout'

const DashboardRoute = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default DashboardRoute
