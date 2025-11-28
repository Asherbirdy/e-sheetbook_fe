import {
  Box,
  HStack,
  Text,
  IconButton,
  VStack,
  Badge,
} from '@chakra-ui/react'
import {
  LuFileSpreadsheet,
  LuPencil,
  LuTrash2,
  LuExternalLink,
} from 'react-icons/lu'
import { Sheet } from '@/types'
import dayjs from 'dayjs'

interface SheetCardProps {
  sheet: Sheet
  onEdit: (sheet: Sheet) => void
  onDelete: (sheet: Sheet) => void
  onClick?: (sheet: Sheet) => void
}

export const SheetCard = ({
  sheet,
  onEdit,
  onDelete,
  onClick,
}: SheetCardProps) => {
  const showActions = useSignal(false)

  return (
    <Box
      position="relative"
      borderRadius="lg"
      overflow="hidden"
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{
        bg: 'white',
        shadow: 'md',
        borderColor: 'gray.300',
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onClick?.(sheet)}
      onMouseEnter={() => { showActions.value = true }}
      onMouseLeave={() => { showActions.value = false }}
      h="full"
    >
      {/* 卡片主體 */}
      <Box p={6}>
        {/* 頂部：圖示和操作按鈕 */}
        <HStack justify="space-between" mb={4} align="start">
          <Box
            p={3}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <LuFileSpreadsheet size={24} color="gray" />
          </Box>

          {/* 操作按鈕 - 滑鼠移入時顯示 */}
          {showActions.value && (
            <HStack gap={1}>
              <IconButton
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ bg: 'gray.100' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(sheet)
                }}
                aria-label="編輯試算表"
              >
                <LuPencil size={16} />
              </IconButton>
              <IconButton
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ bg: 'red.50', color: 'red.500' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(sheet)
                }}
                aria-label="刪除試算表"
              >
                <LuTrash2 size={16} />
              </IconButton>
            </HStack>
          )}
        </HStack>

        {/* 內容區 */}
        <VStack align="start" gap={3}>
          {/* 標題和 API 數量 */}
          <VStack align="start" gap={1} w="full">
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="gray.900"
              lineClamp={2}
            >
              {sheet.name}
            </Text>
            {sheet.api && sheet.api.length > 0 && (
              <Badge colorPalette="blue" size="sm">
                {sheet.api.length}
                {' '}
                API
              </Badge>
            )}
          </VStack>

          {/* 副標題：URL 和更新時間 */}
          <VStack align="start" gap={1} w="full">
            {sheet.url && (
              <HStack gap={2} w="full">
                <LuExternalLink size={14} color="gray" />
                <Text
                  fontSize="sm" color="gray.600" lineClamp={1}
                  flex={1}
                >
                  {sheet.url}
                </Text>
              </HStack>
            )}
            <Text fontSize="xs" color="gray.500">
              最後更新：
              {dayjs(sheet.updatedAt).format('YYYY/MM/DD HH:mm')}
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
}
