import {
  Box, HStack, Icon, Text, VStack, Menu, Portal, Button, Dialog, Field, Input, Span,
} from '@chakra-ui/react'
import {
  LuFile, LuEllipsis, LuPencil, LuTrash2,
} from 'react-icons/lu'
import { useSheetApi, useFileApi } from '@/api'
import { useColorMode } from '@/hook'
import { toaster } from '@/components/ui/toaster'
import type { GetSheetFile } from '@/types'

export const FileAccordion = () => {
  const { palette } = useColorMode()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 資料獲取
  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

  // 狀態管理 - 統一使用 dialog 命名
  const dialog = {
    edit: {
      status: useSignal(false),
      file: useSignal<GetSheetFile | null>(null),
      name: useSignal(''),
    },
    delete: {
      status: useSignal(false),
      file: useSignal<GetSheetFile | null>(null),
    },
  }

  // 編輯檔案 mutation
  const editFile = useMutation({
    mutationFn: (params: { fileId: string; fileName: string }) => useFileApi.edit({
      fileId: params.fileId,
      name: params.fileName,
    }),
    onSuccess: () => {
      toaster.success({
        title: '編輯成功',
        description: '檔案名稱已更新',
      })
      dialog.edit.status.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  // 刪除檔案 mutation
  const deleteFile = useMutation({
    mutationFn: (fileId: string) => useFileApi.delete({ fileId }),
    onSuccess: () => {
      toaster.success({
        title: '刪除成功',
        description: '檔案已刪除',
      })
      dialog.delete.status.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '刪除失敗' })
    },
  })

  // 處理編輯按鈕點擊 - 設定初始值
  const handleEditClick = (file: GetSheetFile) => {
    dialog.edit.file.value = file
    dialog.edit.name.value = file.name
    dialog.edit.status.value = true
  }

  // 處理刪除按鈕點擊
  const handleDeleteClick = (file: GetSheetFile) => {
    dialog.delete.file.value = file
    dialog.delete.status.value = true
  }

  // 處理編輯提交
  const handleEditSubmit = () => {
    if (!dialog.edit.file.value) return

    editFile.mutate({
      fileId: dialog.edit.file.value._id,
      fileName: dialog.edit.name.value,
    })
  }

  // 處理刪除確認
  const handleDeleteConfirm = () => {
    if (!dialog.delete.file.value) return
    deleteFile.mutate(dialog.delete.file.value._id)
  }

  // 關閉對話框
  const closeEditDialog = () => {
    dialog.edit.status.value = false
    dialog.edit.file.value = null
    dialog.edit.name.value = ''
  }

  const closeDeleteDialog = () => {
    dialog.delete.status.value = false
    dialog.delete.file.value = null
  }

  // Early returns for loading and empty states
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
      {/* 檔案列表 */}
      {sheets?.data?.files.map((file) => (
        <Box
          key={file._id}
          py="3"
          px="3"
          borderRadius="md"
          _hover={{ bg: palette.hoverBg }}
          transition="all 0.2s"
          cursor="pointer"
          onClick={() => navigate(`/dashboard/file/${file._id}`, { viewTransition: true })}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon as={LuEllipsis} fontSize="sm" />
                </Box>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="120px">
                    <Menu.Item
                      value="edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(file)
                      }}
                    >
                      <Icon as={LuPencil} color="blue.500" />
                      <Span>編輯</Span>
                    </Menu.Item>

                    <Menu.Item
                      value="delete"
                      color="fg.error"
                      _hover={{ bg: 'bg.error', color: 'fg.error' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(file)
                      }}
                    >
                      <Icon as={LuTrash2} color="red.500" />
                      <Span>刪除</Span>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </Box>
      ))}

      {/* 編輯對話框 */}
      <Dialog.Root
        open={dialog.edit.status.value}
        onOpenChange={(e) => { if (!e.open) closeEditDialog() }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯檔案</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root>
                  <Field.Label>檔案名稱</Field.Label>
                  <Input
                    value={dialog.edit.name.value}
                    onChange={(e) => {
                      dialog.edit.name.value = e.target.value
                    }}
                    placeholder="請輸入檔案名稱"
                    autoFocus
                  />
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={closeEditDialog}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={handleEditSubmit}
                  loading={editFile.isPending}
                >
                  儲存
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* 刪除確認對話框 */}
      <Dialog.Root
        open={dialog.delete.status.value}
        onOpenChange={(e) => { if (!e.open) closeDeleteDialog() }}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>確認刪除</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  確定要刪除檔案「
                  <Text as="span" fontWeight="bold">{dialog.delete.file.value?.name}</Text>
                  」嗎?此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={closeDeleteDialog}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleDeleteConfirm}
                  loading={deleteFile.isPending}
                >
                  刪除
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  )
}
