import {
  Box, HStack, Text, IconButton,
} from '@chakra-ui/react'
import {
  LuFolder, LuPencil, LuTrash2,
} from 'react-icons/lu'
import { GetFile } from '@/types'

interface FileCardProps {
  file: GetFile
  onEdit: (file: GetFile) => void
  onDelete: (file: GetFile) => void
  onClick?: (file: GetFile) => void
}

export const FileCard = ({
  file, onEdit, onDelete, onClick,
}: FileCardProps) => {
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
              <IconButton
                variant="ghost"
                size="sm"
                color="gray.500"
                _hover={{ bg: 'gray.100' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(file)
                }}
                aria-label="編輯檔案"
              >
                <LuPencil size={16} />
              </IconButton>
              <IconButton
                variant="ghost"
                size="sm"
                color="gray.500"
                _hover={{ bg: 'red.50', color: 'red.500' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file)
                }}
                aria-label="刪除檔案"
              >
                <LuTrash2 size={16} />
              </IconButton>
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
