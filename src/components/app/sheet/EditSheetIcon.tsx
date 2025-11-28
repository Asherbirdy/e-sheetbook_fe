import {
  IconButton,
  Dialog,
  Portal,
  Button,
  Stack,
  Input,
  Field,
} from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { Sheet } from '@/types'
import { useSheetApi } from '@/api/useSheetApi'
import { toaster } from '@/components/ui/toaster'

interface EditSheetIconProps {
  sheet: Sheet
  fileId: string
  onSuccess?: () => void
}

export const EditSheetIcon = ({
  sheet, fileId, onSuccess,
}: EditSheetIconProps) => {
  const queryClient = useQueryClient()
  const editDialog = useSignal(false)

  // 表單狀態
  const formData = {
    name: useSignal(''),
    url: useSignal(''),
  }

  // 當對話框開啟時初始化表單(只在開啟時執行一次)
  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation()
    formData.name.value = sheet.name
    formData.url.value = sheet.url
    editDialog.value = true
  }

  // 編輯 Sheet Mutation
  const editSheetMutation = useMutation({
    mutationFn: async ({
      name, url, sheetId,
    }: { name: string, url: string, sheetId: string }) => {
      return useSheetApi.edit({
        name,
        url,
        api: [],
        fileId,
        sheetId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
      editDialog.value = false
      formData.name.value = ''
      formData.url.value = ''
      toaster.create({
        title: '更新成功',
        description: '試算表已成功更新',
        type: 'success',
      })
      onSuccess?.()
    },
    onError: () => {
      toaster.create({
        title: '更新失敗',
        description: '試算表更新失敗,請稍後再試',
        type: 'error',
      })
    },
  })

  // 處理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.value.trim() && formData.url.value.trim()) {
      editSheetMutation.mutate({
        name: formData.name.value.trim(),
        url: formData.url.value.trim(),
        sheetId: sheet._id,
      })
    }
  }

  // 處理關閉
  const handleClose = () => {
    formData.name.value = ''
    formData.url.value = ''
    editDialog.value = false
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.600"
        _hover={{ bg: 'gray.100' }}
        onClick={handleOpenDialog}
        aria-label="編輯試算表"
      >
        <LuPencil size={16} />
      </IconButton>

      {/* 編輯對話框 */}
      <Dialog.Root
        open={editDialog.value}
        onOpenChange={(e: { open: boolean }) => { if (!e.open) handleClose() }}
        size="md"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯試算表</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleSubmit}>
                  <Stack gap={4}>
                    <Field.Root required>
                      <Field.Label>試算表名稱</Field.Label>
                      <Input
                        placeholder="輸入試算表名稱"
                        value={formData.name.value}
                        onChange={(e) => { formData.name.value = e.target.value }}
                        autoFocus
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>試算表 URL</Field.Label>
                      <Input
                        placeholder="輸入試算表 URL"
                        value={formData.url.value}
                        onChange={(e) => { formData.url.value = e.target.value }}
                      />
                    </Field.Root>
                    <Stack direction="row" gap={2} justify="flex-end">
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={editSheetMutation.isPending}
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        colorPalette="blue"
                        disabled={!formData.name.value.trim() || !formData.url.value.trim()}
                        loading={editSheetMutation.isPending}
                      >
                        更新
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Dialog.Body>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
