import {
  Box, Grid, Heading, HStack, Text, Spinner, Center, EmptyState, Button,
} from '@chakra-ui/react'
import { LuPlus, LuFolderOpen } from 'react-icons/lu'
import { useFileApi } from '@/api/useFileApi'
import { GetFile } from '@/types'
import { toaster } from '@/components/ui/toaster'
import { CRoutes } from '@/enums/RoutesEnum'
import {
  CreateFileDialog, EditFileDialog, DeleteFileAlert, FileCard,
} from '@/components'

const FilePage = () => {
  const navigate = useNavigate()

  // 狀態管理
  const createDialog = useSignal(false)
  const editDialog = useSignal<{ open: boolean; file: GetFile | null }>({
    open: false,
    file: null,
  })
  const deleteAlert = useSignal<{ open: boolean; file: GetFile | null }>({
    open: false,
    file: null,
  })

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

  // 編輯檔案
  const editMutation = useMutation({
    mutationFn: ({ name, fileId }: { name: string; fileId: string }) =>
      useFileApi.edit({ name, fileId }),
    onSuccess: () => {
      filesQuery.refetch()
      editDialog.value = { open: false, file: null }
      toaster.success({
        title: '成功',
        description: '檔案已更新',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '更新檔案失敗',
      })
    },
  })

  // 刪除檔案
  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => useFileApi.delete({ fileId }),
    onSuccess: () => {
      filesQuery.refetch()
      deleteAlert.value = { open: false, file: null }
      toaster.success({
        title: '成功',
        description: '檔案已刪除',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '刪除檔案失敗',
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
              onEdit={(file) => {
                editDialog.value = { open: true, file }
              }}
              onDelete={(file) => {
                deleteAlert.value = { open: true, file }
              }}
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

      {/* 編輯檔案對話框 */}
      <EditFileDialog
        open={editDialog.value.open}
        file={editDialog.value.file}
        onClose={() => { editDialog.value = { open: false, file: null } }}
        onSubmit={(name, fileId) => editMutation.mutate({ name, fileId })}
        isLoading={editMutation.isPending}
      />

      {/* 刪除檔案確認對話框 */}
      <DeleteFileAlert
        open={deleteAlert.value.open}
        file={deleteAlert.value.file}
        onClose={() => { deleteAlert.value = { open: false, file: null } }}
        onConfirm={(fileId) => deleteMutation.mutate(fileId)}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  )
}

export default FilePage