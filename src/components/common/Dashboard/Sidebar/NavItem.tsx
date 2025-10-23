import {
  Flex, Icon, FlexProps, Text,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { Link } from 'react-router-dom'
import { RoutesPath } from '@/enums'

interface NavItemProps extends FlexProps {
  icon: IconType
  route: RoutesPath
  name: string
}

export const NavItem = ({
  icon, route, name, ...rest
}: NavItemProps) => {
  return (
    <Link
      to={route}
      style={{ textDecoration: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{ color: 'white' }}
            as={icon}
          />
        )}
        <Text>{name}</Text>
      </Flex>
    </Link>
  )
}