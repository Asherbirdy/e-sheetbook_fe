import {
  Box, HStack, Icon, Text, VStack,
} from '@chakra-ui/react'
import { LuFile } from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'
import { FileMenu } from './FileMenu'
import { FileAddSheetButton } from './FileAddSheetButton'

export const FileAccordion = () => {
  const { palette } = useColorMode()

  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

  if (isLoading) {
    return <Text color="gray.500" fontSize="sm" px="3">載入中...</Text>
  }

  if (sheets?.data?.files.length === 0) {
    return (
      <VStack gap="2" py="8">
        <Icon as={LuFile} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">尚無文件</Text>
      </VStack>
    )
  }

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
        >
          <HStack gap="2">
            <Icon as={LuFile} fontSize="lg" color="blue.500" />
            <Text flex="1" fontWeight="medium" fontSize="sm">
              {file.name}
            </Text>
            {/* 新增 Sheet 按鈕 */}
            <FileAddSheetButton fileId={file._id} />
            {/* 檔案操作選單 */}
            <FileMenu file={file} />
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}
