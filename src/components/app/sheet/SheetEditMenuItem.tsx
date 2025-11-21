import {
  Button, Dialog, Field, Icon, Input, Menu, Portal, Span,
} from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { toaster } from '@/components/ui/toaster'

interface SheetData {
  _id: string
  name: string
  url: string
  fileId: string
}

interface SheetEditMenuItemProps {
  sheet: SheetData
}

export const SheetEditMenuItem = ({ sheet }: SheetEditMenuItemProps) => {
  const queryClient = useQueryClient()

  const data = {
    name: useSignal(sheet.name),
    url: useSignal(sheet.url),
  }
  const features = { isEditDialogOpen: useSignal(false) }

  // 編輯表格 mutation
  const {
    mutate: editMutation,
    isPending: isEditPending,
  } = useMutation({
    mutationFn: () => useSheetApi.edit({
      sheetId: sheet._id,
      fileId: sheet.fileId,
      name: data.name.value,
      url: data.url.value,
      api: '', // TODO: 確認 api 欄位用途
    }),
    onSuccess: () => {
      toaster.success({
        title: '編輯成功',
        description: '表格已更新',
      })
      features.isEditDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets', sheet.fileId] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  // 打開編輯對話框
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    data.name.value = sheet.name
    data.url.value = sheet.url
    features.isEditDialogOpen.value = true
  }

  return (
    <>
      <Menu.Item value="edit" onClick={handleOpenEdit}>
        <Icon as={LuPencil} color="blue.500" />
        <Span>編輯</Span>
      </Menu.Item>

      {/* 編輯表格 Dialog */}
      <Dialog.Root
        open={features.isEditDialogOpen.value}
        onOpenChange={(e) => { features.isEditDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯表格</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap="4">
                <Field.Root>
                  <Field.Label>表格名稱</Field.Label>
                  <Input
                    value={data.name.value}
                    onChange={(e) => { data.name.value = e.target.value }}
                    placeholder="請輸入表格名稱"
                    autoFocus
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>表格網址</Field.Label>
                  <Input
                    value={data.url.value}
                    onChange={(e) => { data.url.value = e.target.value }}
                    placeholder="請輸入表格網址"
                  />
                </Field.Root>
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
                  onClick={() => editMutation()}
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
