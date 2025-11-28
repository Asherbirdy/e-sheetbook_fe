import {
  Box, Heading, VStack, Spinner, Center, Text, EmptyState, Button, HStack,
} from '@chakra-ui/react'
import {
  LuPlus, LuFolderOpen, LuArrowLeft,
} from 'react-icons/lu'
import { useSheetApi } from '@/api/useSheetApi'
import { SheetCard } from '@/components'
import { CRoutes } from '@/enums/RoutesEnum'

const FileIdPage = () => {
  const { fileId } = useParams<{ fileId: string }>()
  const navigate = useNavigate()

  // 新增 Sheet 對話框狀態
  const createDialog = useSignal(false)

  // 取得該檔案的所有 Sheet
  const sheetsQuery = useQuery({
    queryKey: ['sheets', fileId],
    queryFn: async () => {
      if (!fileId) throw new Error('File ID is required')
      const response = await useSheetApi.getSheetFromFile({ fileId })
      return response.data
    },
    enabled: !!fileId,
  })

  const sheets = sheetsQuery.data?.sheets || []

  // 載入中狀態
  if (sheetsQuery.isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    )
  }

  // 錯誤狀態
  if (sheetsQuery.isError) {
    return (
      <Center h="400px">
        <Text color="red.500">載入 Sheet 時發生錯誤</Text>
      </Center>
    )
  }

  return (
    <Box>
      {/* 返回按鈕 */}
      <Button
        variant="ghost"
        colorPalette="gray"
        size="sm"
        mb={4}
        onClick={() => navigate(CRoutes.File, { unstable_viewTransition: true })}
      >
        <LuArrowLeft />
        返回檔案列表
      </Button>

      {/* 標題列 */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="gray.900">試算表列表</Heading>
        <Button
          variant="outline"
          colorPalette="gray"
          onClick={() => { createDialog.value = true }}
        >
          <LuPlus />
          新增試算表
        </Button>
      </HStack>

      {/* Sheet 列表 */}
      {sheets.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuFolderOpen size={48} />
            </EmptyState.Indicator>
            <EmptyState.Title>尚無試算表</EmptyState.Title>
            <EmptyState.Description>
              點擊「新增試算表」按鈕來建立您的第一個試算表
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <VStack gap={4} align="stretch">
          {sheets.map((sheet) => (
            <SheetCard
              key={sheet._id}
              sheet={sheet}
              onEdit={() => {
                // TODO: 編輯 Sheet
                console.log('Edit sheet:', sheet.name)
              }}
              onDelete={() => {
                // TODO: 刪除 Sheet
                console.log('Delete sheet:', sheet.name)
              }}
              onClick={() => {
                // TODO: 導航到 Sheet 詳細頁面
                console.log('Open sheet:', sheet.name)
              }}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}

export default FileIdPage