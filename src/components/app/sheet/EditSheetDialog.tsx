import { FunctionComponent, ReactElement } from 'react'
import {
  Dialog,
  Portal,
  Button,
  Stack,
  Input,
  Field,
} from '@chakra-ui/react'
import { Sheet } from '@/types'

interface EditSheetDialogProps {
  open: boolean
  sheet: Sheet | null
  onClose: () => void
  onSubmit: (name: string, url: string, sheetId: string) => void
  isLoading?: boolean
}

const EditSheetDialog: FunctionComponent<EditSheetDialogProps> = ({
  open,
  sheet,
  onClose,
  onSubmit,
  isLoading = false,
}): ReactElement => {
  // 表單狀態
  const data = {
    name: useSignal(''),
    url: useSignal(''),
  }

  // 當 sheet 改變時更新表單
  effect(() => {
    if (sheet) {
      data.name.value = sheet.name
      data.url.value = sheet.url
    }
  })

  // 處理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.name.value.trim() && data.url.value.trim() && sheet) {
      onSubmit(data.name.value.trim(), data.url.value.trim(), sheet._id)
    }
  }

  // 處理關閉
  const handleClose = () => {
    data.name.value = ''
    data.url.value = ''
    onClose()
  }

  if (!sheet) return <></>

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => { if (!details.open) handleClose() }}
      closeOnInteractOutside
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content onClick={(e) => e.stopPropagation()}>
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
                      value={data.name.value}
                      onChange={(e) => { data.name.value = e.target.value }}
                      autoFocus
                    />
                  </Field.Root>
                  <Field.Root required>
                    <Field.Label>試算表 URL</Field.Label>
                    <Input
                      placeholder="輸入試算表 URL"
                      value={data.url.value}
                      onChange={(e) => { data.url.value = e.target.value }}
                    />
                  </Field.Root>
                  <Stack direction="row" gap={2} justify="flex-end">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      disabled={!data.name.value.trim() || !data.url.value.trim()}
                      loading={isLoading}
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
  )
}

export default EditSheetDialog
