import {
  FiHome, FiTrendingUp,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { RoutesPath } from '@/enums'

interface LinkItemProps {
  name: string
  icon: IconType
  route: RoutesPath
}

export const LinkItems: Array<LinkItemProps> = [
  {
    name: 'Home',
    icon: FiHome,
    route: RoutesPath.DashboardHome,
  },
  {
    name: 'Second Page',
    icon: FiTrendingUp,
    route: RoutesPath.DashboardSecondPage,
  },
]