import {
  Button, Dialog, Field, Icon, Input, Menu, Portal, Span,
} from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { useFileApi } from '@/api'
import { toaster } from '@/components/ui/toaster'
import { GetSheetFile } from '@/types'

interface FileEditMenuItemProps {
  file: GetSheetFile
}

export const FileEditMenuItem = ({ file }: FileEditMenuItemProps) => {
  const queryClient = useQueryClient()

  const data = { fileName: useSignal(file.name) }
  const features = { isEditDialogOpen: useSignal(false) }

  // 編輯檔案 mutation
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
      features.isEditDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  // 打開編輯對話框
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    data.fileName.value = file.name
    features.isEditDialogOpen.value = true
  }

  return (
    <>
      <Menu.Item
        value="edit"
        onClick={handleOpenEdit}
      >
        <Icon as={LuPencil} color="blue.500" />
        <Span>編輯</Span>
      </Menu.Item>

      {/* 編輯檔案 Dialog */}
      <Dialog.Root
        open={features.isEditDialogOpen.value}
        onOpenChange={(e) => { features.isEditDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯檔案</Dialog.Title>
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
                    onClick={() => { features.isEditDialogOpen.value = false }}
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
    </>
  )
}
