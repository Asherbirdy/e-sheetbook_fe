import {
  Box, HStack, Text, IconButton,  VStack, Badge, Portal, Drawer, CloseButton,
} from '@chakra-ui/react'
import {
  LuFileSpreadsheet, LuPencil, LuTrash2, LuExternalLink, LuEye,
} from 'react-icons/lu'
import { Sheet } from '@/types'
import dayjs from 'dayjs'
import { EditSheetIcon } from '@/components'

interface SheetCardProps {
  sheet: Sheet
  onEdit: (sheet: Sheet) => void
  onDelete: (sheet: Sheet) => void
}

export const SheetCard = ({
  sheet,
  onEdit,
  onDelete,
}: SheetCardProps) => {
  const { fileId } = useParams<{ fileId: string }>()
  const showActions = useSignal(false)
  const drawerOpen = useSignal(false)

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    drawerOpen.value = true
  }

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(sheet.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
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
        onMouseEnter={() => { showActions.value = true }}
        onMouseLeave={() => { showActions.value = false }}
        h="full"
      >
        {/* 卡片主體 */}
        <Box p={6}>
          {/* 頂部:圖示和操作按鈕 */}
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
                  _hover={{ bg: 'blue.50', color: 'blue.500' }}
                  onClick={handleQuickView}
                  aria-label="快速瀏覽"
                >
                  <LuEye size={16} />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ bg: 'green.50', color: 'green.500' }}
                  onClick={handleOpenInNewTab}
                  aria-label="在新分頁開啟"
                >
                  <LuExternalLink size={16} />
                </IconButton>
                <EditSheetIcon sheet={sheet} fileId={fileId!} />
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

            {/* 副標題:URL 和更新時間 */}
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
                最後更新:
                {dayjs(sheet.updatedAt).format('YYYY/MM/DD HH:mm')}
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Box>

      {/* 快速瀏覽 Drawer */}
      <Drawer.Root
        open={drawerOpen.value}
        onOpenChange={(e: { open: boolean }) => { drawerOpen.value = e.open }}
        placement="end"
        size="full"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>
                  快速瀏覽:
                  {' '}
                  {sheet.name}
                </Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body p={0}>
                <Box w="full" h="full">
                  <iframe
                    src={sheet.url}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    title={`預覽 ${sheet.name}`}
                  />
                </Box>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}
