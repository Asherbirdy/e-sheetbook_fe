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
      w="full"
    >
      <HStack p={6} justify="space-between" align="start" w="full">
        {/* 左側：圖示和內容 */}
        <HStack gap={4} flex={1} align="start">
          {/* 圖示 */}
          <Box
            p={3}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            flexShrink={0}
          >
            <LuFileSpreadsheet size={24} color="gray" />
          </Box>

          {/* 內容 */}
          <VStack align="start" gap={2} flex={1}>
            {/* 標題和 API 數量 */}
            <HStack gap={3} align="center">
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color="gray.900"
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
            </HStack>

            {/* 副標題：URL 和更新時間 */}
            <VStack align="start" gap={1}>
              {sheet.url && (
                <HStack gap={2}>
                  <LuExternalLink size={14} color="gray" />
                  <Text fontSize="sm" color="gray.600" lineClamp={1}>
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
        </HStack>

        {/* 右側：操作按鈕 */}
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
    </Box>
  )
}
