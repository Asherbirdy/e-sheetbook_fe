import { Outlet } from 'react-router-dom'
import { HomeLayout } from '@/layout'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const CRoute = () => {
  const location = useLocation()

  return (
    <HomeLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </HomeLayout>
  )
}

export default CRoute

