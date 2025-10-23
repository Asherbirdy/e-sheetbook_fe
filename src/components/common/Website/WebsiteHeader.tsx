import {
  FunctionComponent, ReactElement,
} from 'react'

import {
  Box, Flex, Text,
} from '@chakra-ui/react'
// We need to use Chakra UI's <Link> component for consistency with the rest of the UI.
// But we need to use React Router's <Link> component for the routing to work properly.
// So we import Chakra UI's <Link> component, and then import React Router's <Link> component as ReactRouterLink.
// We can then pass the "as" prop to Chakra UI's <Link> component. See: https://chakra-ui.com/docs/components/link/usage#usage-with-routing-library

import { ColorModeSwitcher } from '../ColorModeSwitcher'
import { useCounterStore } from '@/stores/counterStore'
import { useColorMode } from '@/components/ui/color-mode'

export const WebsiteHeader: FunctionComponent = (): ReactElement => {
  const { colorMode } = useColorMode()
  const count = useCounterStore((state) => state.count)
  return (

    <Flex
      alignItems={'center'}
      justifyContent={'space-between'}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      shadow={'sm'}
      px={10}
      py={1}
      fontSize={'sm'}
    >
      <Box>
        <Text>Logo</Text>
      </Box>

      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Text mr={10}>{import.meta.env.VITE_EXAMPLE}</Text>
        <Text>
          Count:
          {count}
        </Text>
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>
    </Flex>
  )
}
