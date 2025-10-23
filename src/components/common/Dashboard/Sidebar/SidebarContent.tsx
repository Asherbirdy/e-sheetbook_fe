import {
  Box, CloseButton, Flex, Text, BoxProps,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { LinkItems } from './LinkItems'
import { NavItem } from './NavItem'

interface SidebarProps extends BoxProps {
  onClose: () => void
}

export const SidebarContent = ({
  onClose, ...rest
}: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{
        base: 'full',
        md: 60,
      }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Logo
        </Text>
        <CloseButton
          display={{
            base: 'flex',
            md: 'none',
          }}
          onClick={onClose}
        />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          onClick={onClose}
          key={link.name}
          icon={link.icon}
          route={link.route}
          name={link.name}
        />
      ))}
    </Box>
  )
}