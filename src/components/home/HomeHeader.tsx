import { FunctionComponent, ReactElement } from 'react'
import {
  Box, HStack, Text, Avatar,
} from '@chakra-ui/react'
import { LuFlower2 } from 'react-icons/lu'

const HomeHeader: FunctionComponent = (): ReactElement => {
  return (
    <Box
      as="header"
      py={4}
      borderColor="gray.200"
    >
      <HStack justify="space-between" px={8}>
        {/* Logo 區塊 */}
        <HStack gap={2}>
          <LuFlower2 size={24} />
          <Text fontSize="xl" fontWeight="bold">
            E-sheetbook
          </Text>
        </HStack>

        {/* 導航選單 */}
        <HStack gap={8}>
          <Text fontWeight="semibold" cursor="pointer" _hover={{ color: 'gray.600' }}>
            Homa
          </Text>
          <Text color="gray.500" cursor="pointer" _hover={{ color: 'gray.700' }}>
            Team Directory
          </Text>
          <Text color="gray.500" cursor="pointer" _hover={{ color: 'gray.700' }}>
            Activities
          </Text>
        </HStack>

        {/* 使用者頭像 */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar.Root size="md">
            <Avatar.Image src="https://bit.ly/broken-link" />
            <Avatar.Fallback>U</Avatar.Fallback>
          </Avatar.Root>
          <Text color="gray.500" cursor="pointer">
            Login
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}

export default HomeHeader
