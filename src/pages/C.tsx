import { Outlet } from 'react-router-dom'
import { HomeLayout } from '@/layout'

const CRoute = () => {
  return (
    <HomeLayout>
      <Outlet />
    </HomeLayout>
  )
}

export default CRoute
