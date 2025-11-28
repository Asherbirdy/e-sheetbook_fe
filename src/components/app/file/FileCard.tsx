import {
  Box, HStack, Text,
} from '@chakra-ui/react'
import { LuFolder } from 'react-icons/lu'
import { GetFile } from '@/types'
import { EditFileIcon, DeleteFileIcon } from '@/components'

interface FileCardProps {
  file: GetFile
  onClick?: (file: GetFile) => void
}

export const FileCard = ({ file, onClick }: FileCardProps) => {
  const showActions = useSignal(false)

  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      border="1px"
      borderColor="gray.200"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
        borderColor: 'gray.300',
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onClick?.(file)}
      onMouseEnter={() => { showActions.value = true }}
      onMouseLeave={() => { showActions.value = false }}
    >
      {/* 卡片主體 */}
      <Box p={6} pb={4}>
        {/* 檔案圖示和操作按鈕 */}
        <HStack justify="space-between" mb={12} align="start">
          <Box
            p={3}
            bg="gray.100"
            borderRadius="lg"
          >
            <LuFolder size={24} color="#718096" />
          </Box>

          {/* 操作按鈕 - 滑鼠移入時顯示 */}
          {showActions.value && (
            <HStack gap={1}>
              <EditFileIcon file={file} />
              <DeleteFileIcon file={file} />
            </HStack>
          )}
        </HStack>

        {/* 檔案名稱 */}
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="gray.700"
          mb={1}
        >
          {file.name}
        </Text>

        {/* 副標題 */}
        <Text fontSize="sm" color="gray.500">
          資料夾
        </Text>
      </Box>
    </Box>
  )
}
