import {
  Box, HStack, Icon, Text, VStack, Menu, Portal,
} from '@chakra-ui/react'
import { LuFile, LuEllipsis } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'
import { FileEditMenuItem } from '@/components/app/file/FileAccordion/FileEditMenuItem'
import { FileDeleteMenuItem } from '@/components/app/file/FileAccordion/FileDeleteMenuItem'

export const FileAccordion = () => {
  const { palette } = useColorMode()
  const navigate = useNavigate()

  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

  /*
     * This component now only shows files, not sheets
  */
  if (isLoading) {
    return <Text color="gray.500" fontSize="sm" px="3">載入中...</Text>
  }

  /*
    * No files to display
  */
  if (sheets?.data?.files.length === 0) {
    return (
      <VStack gap="2" py="8">
        <Icon as={LuFile} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">尚無文件</Text>
      </VStack>
    )
  }

  /*
    * Render files
  */
  return (
    <VStack gap="1" alignItems="stretch">
      {sheets?.data?.files.map((file) => (
        <Box
          key={file._id}
          py="3"
          px="3"
          borderRadius="md"
          _hover={{ bg: palette.hoverBg }}
          transition="all 0.2s"
          cursor="pointer"
          onClick={() => navigate(`/dashboard/file/${file._id}`)}
        >
          <HStack gap="2">
            <Icon as={LuFile} fontSize="lg" color="blue.500" />
            <Text flex="1" fontWeight="medium" fontSize="sm">
              {file.name}
            </Text>
            {/* 檔案選單 */}
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger asChild>
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="6"
                  h="6"
                  borderRadius="md"
                  cursor="pointer"
                  color="gray.600"
                  _hover={{ bg: 'gray.100', color: 'gray.800' }}
                  transition="all 0.2s"
                >
                  <Icon as={LuEllipsis} fontSize="sm" />
                </Box>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="120px">
                    <FileEditMenuItem file={file} />
                    <FileDeleteMenuItem file={file} />
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}
