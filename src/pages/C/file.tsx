import {
  Box, Grid, Heading, HStack, Text, Spinner, Center, EmptyState, Button,
} from '@chakra-ui/react'
import { LuPlus, LuFolderOpen } from 'react-icons/lu'
import { useFileApi } from '@/api/useFileApi'
import { toaster } from '@/components/ui/toaster'
import { CRoutes } from '@/enums/RoutesEnum'
import { CreateFileDialog, FileCard } from '@/components'

const FilePage = () => {
  const navigate = useNavigate()

  // 狀態管理
  const createDialog = useSignal(false)

  // 取得所有檔案
  const filesQuery = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const response = await useFileApi.get()
      return response.data
    },
  })

  // 新增檔案
  const createMutation = useMutation({
    mutationFn: (name: string) => useFileApi.create({ name }),
    onSuccess: () => {
      filesQuery.refetch()
      createDialog.value = false
      toaster.success({
        title: '成功',
        description: '檔案已建立',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '建立檔案失敗',
      })
    },
  })

  // 載入中狀態
  if (filesQuery.isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    )
  }

  // 錯誤狀態
  if (filesQuery.isError) {
    return (
      <Center h="400px">
        <Text color="red.500">載入檔案時發生錯誤</Text>
      </Center>
    )
  }

  const files = filesQuery.data?.file || []

  return (
    <Box>
      {/* 標題列 */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">我的檔案</Heading>
        <Button onClick={() => { createDialog.value = true }}>
          <LuPlus />
          新增檔案
        </Button>
      </HStack>

      {/* 檔案列表 */}
      {files.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuFolderOpen size={48} />
            </EmptyState.Indicator>
            <EmptyState.Title>尚無檔案</EmptyState.Title>
            <EmptyState.Description>
              點擊「新增檔案」按鈕來建立您的第一個檔案
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={6}
        >
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onClick={(file) => {
                navigate(
                  `${CRoutes.FileId}/${file._id}`,
                  { unstable_viewTransition: true },
                )
              }}
            />
          ))}
        </Grid>
      )}

      {/* 新增檔案對話框 */}
      <CreateFileDialog
        open={createDialog.value}
        onClose={() => { createDialog.value = false }}
        onSubmit={(name) => createMutation.mutate(name)}
        isLoading={createMutation.isPending}
      />
    </Box>
  )
}

export default FilePage