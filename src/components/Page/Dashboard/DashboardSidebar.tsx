import {
  Box, CloseButton, Flex, Text,
} from '@chakra-ui/react'
import { useColorMode } from '@/hook'
import { FileAddButton, FileAccordion } from '@/components'

export const DashboardSidebar = () => {
  const { palette } = useColorMode()

  return (
    <Box
      transition="3s ease"
      bg={palette.bgColor}
      borderRight="1px"
      borderRightColor={palette.borderColor}
      pos="fixed"
      h="full"
      overflowY="auto"
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        borderBottom="1px"
        borderBottomColor={palette.borderColor}
      >
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} />
      </Flex>

      <Box px="4" py="4">
        {/* 標題區域 */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb="3"
          px="3"
        >
          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
            Files
          </Text>
          <FileAddButton />
        </Flex>

        {/* 內容區域 */}
        <FileAccordion />
      </Box>
    </Box>
  )
}