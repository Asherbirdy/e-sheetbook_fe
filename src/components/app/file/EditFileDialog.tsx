import { FunctionComponent, ReactElement } from 'react'
import {
  Dialog,
  Portal,
  Button,
  Stack,
  Input,
  Field,
} from '@chakra-ui/react'
import { GetFile } from '@/types'

interface EditFileDialogProps {
  open: boolean
  file: GetFile | null
  onClose: () => void
  onSubmit: (name: string, fileId: string) => void
  isLoading?: boolean
}

const EditFileDialog: FunctionComponent<EditFileDialogProps> = ({
  open,
  file,
  onClose,
  onSubmit,
  isLoading = false,
}): ReactElement => {
  // 表單狀態
  const fileName = useSignal('')

  // 當 file 改變時更新 fileName
  effect(() => {
    if (file) {
      fileName.value = file.name
    }
  })

  // 處理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fileName.value.trim() && file) {
      onSubmit(fileName.value.trim(), file._id)
    }
  }

  // 處理關閉
  const handleClose = () => {
    fileName.value = ''
    onClose()
  }

  if (!file) return <></>

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => { if (!e.open) handleClose() }}
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>編輯檔案</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit}>
                <Stack gap={4}>
                  <Field.Root required>
                    <Field.Label>檔案名稱</Field.Label>
                    <Input
                      placeholder="輸入檔案名稱"
                      value={fileName.value}
                      onChange={(e) => { fileName.value = e.target.value }}
                      autoFocus
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
                      disabled={!fileName.value.trim()}
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

export default EditFileDialog
