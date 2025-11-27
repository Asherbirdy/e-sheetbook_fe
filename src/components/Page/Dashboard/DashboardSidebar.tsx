import {
  Box, CloseButton, Flex, Text,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { useColorMode } from '@/hook'
import { FileAddButton, FileAccordion } from '@/components'

export const DashboardSidebar = () => {
  const { palette } = useColorMode()
  
  // Gradient backgrounds
  const bgGradient = useColorModeValue(
    'linear(to-b, white, gray.50)',
    'linear(to-b, gray.900, gray.800)'
  )
  const headerBgGradient = useColorModeValue(
    'linear(to-r, blue.50, white)',
    'linear(to-r, gray.800, gray.900)'
  )

  return (
    <Box
      transition="all 0.3s ease"
      bgGradient={bgGradient}
      borderRight="1px"
      borderRightColor={palette.borderColor}
      boxShadow="sm"
      pos="fixed"
      h="full"
      w={{ base: 'full', md: '60' }}
      overflowY="auto"
      zIndex="sticky"
    >
      <Flex
        h="20"
        alignItems="center"
        mx="6"
        justifyContent="space-between"
        borderBottom="1px"
        borderBottomColor={palette.borderColor}
        bgGradient={headerBgGradient}
        position="sticky"
        top="0"
        zIndex="docked"
        backdropFilter="blur(8px)"
      >
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          letterSpacing="tight"
        >
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} />
      </Flex>

      <Box px="4" py="6">
        {/* 標題區域 */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb="4"
          px="2"
        >
          <Text 
            fontSize="xs" 
            fontWeight="bold" 
            textTransform="uppercase" 
            letterSpacing="wider" 
            color="gray.500"
          >
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