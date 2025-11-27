import {
  Button, Dialog, Field, Icon, Input, Menu, Portal, Span,
} from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { useFileApi } from '@/api'
import { toaster } from '@/components/ui/toaster'
import { GetSheetFile } from '@/types'

interface FileEditMenuItemProps {
  file: GetSheetFile
  onOpenEdit: () => void
}

export const FileEditMenuItem = ({ onOpenEdit }: FileEditMenuItemProps) => {
  // 打開編輯對話框
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOpenEdit()
  }

  return (
    <Menu.Item
      value="edit"
      onClick={handleOpenEdit}
    >
      <Icon as={LuPencil} color="blue.500" />
      <Span>編輯</Span>
    </Menu.Item>
  )
}

// 編輯對話框組件 (分離出來,獨立於 Menu 之外)
interface FileEditDialogProps {
  file: GetSheetFile
  open: boolean
  onClose: () => void
}

export const FileEditDialog = ({
  file, open, onClose,
}: FileEditDialogProps) => {
  const queryClient = useQueryClient()
  const data = { fileName: useSignal(file.name) }

  // 當 Dialog 打開時,重置檔案名稱
  useEffect(() => {
    if (open) {
      data.fileName.value = file.name
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, file.name])

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
      onClose()
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => { if (!e.open) onClose() }}
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
                  onClick={onClose}
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
  )
}
