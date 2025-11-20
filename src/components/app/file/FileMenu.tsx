import { GetSheetFile } from '@/types'
import {
  Box, Icon, Menu, Portal, Span, Dialog, Button, Input, Field, Text,
} from '@chakra-ui/react'
import {
  LuEllipsis, LuPencil, LuTrash2,
} from 'react-icons/lu'
import { useFileApi } from '@/api'
import { toaster } from '@/components/ui/toaster'

interface FileMenuProps {
  file: GetSheetFile
}

export const FileMenu = ({ file }: FileMenuProps) => {
  const queryClient = useQueryClient()

  const data = { fileName: useSignal(file.name) }
  const features = {
    edit: { isEditDialogOpen: useSignal(false) },
    delete: { isDeleteDialogOpen: useSignal(false) },
  }

  // API mutation
  const {
    mutate: editMutation,
    isPending: isEditPending,
  } = useMutation({
    mutationFn: (fileName: string) => useFileApi.edit({
      fileId: file._id,
      name: fileName,
    }),
    onSuccess: () => {
      toaster.success({
        title: '編輯成功',
        description: '檔案名稱已更新',
      })
      features.edit.isEditDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  // 刪除 mutation
  const {
    mutate: deleteMutation,
    isPending: isDeletePending,
  } = useMutation({
    mutationFn: () => useFileApi.delete({ fileId: file._id }),
    onSuccess: () => {
      toaster.success({
        title: '刪除成功',
        description: '檔案已刪除',
      })
      features.delete.isDeleteDialogOpen.value = false
      // 重新獲取資料
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '刪除失敗' })
    },
  })

  // 打開編輯對話框
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation()

    data.fileName.value = file.name
    features.edit.isEditDialogOpen.value = true
  }

  // 打開刪除確認對話框
  const handleOpenDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    features.delete.isDeleteDialogOpen.value = true
  }

  return (
    <>
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
                onClick={handleOpenEdit}
              >
                <Icon as={LuPencil} color="blue.500" />
                <Span>編輯</Span>
              </Menu.Item>
              <Menu.Item
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                onClick={handleOpenDelete}
              >
                <Icon as={LuTrash2} color="red.500" />
                <Span>刪除</Span>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* 編輯檔案 Dialog */}
      <Dialog.Root
        open={features.edit.isEditDialogOpen.value}
        onOpenChange={(e) => { features.edit.isEditDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯檔案s</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form>
                  <Field.Root>
                    <Field.Label>檔案名稱</Field.Label>
                    <Input
                      value={data.fileName.value}
                      onChange={(e) => {
                        data.fileName.value = e.target.value
                      }}
                      placeholder="請輸入檔案名稱"
                      autoFocus
                    />
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.edit.isEditDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={() => editMutation(data.fileName.value)}
                  loading={isEditPending}
                >
                  儲存
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* 刪除確認 Dialog */}
      <Dialog.Root
        open={features.delete.isDeleteDialogOpen.value}
        onOpenChange={(e) => { features.delete.isDeleteDialogOpen.value = e.open }}
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
                  <Text as="span" fontWeight="bold">{file.name}</Text>
                  」嗎？此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.delete.isDeleteDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={() => deleteMutation()}
                  loading={isDeletePending}
                >
                  刪除
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
