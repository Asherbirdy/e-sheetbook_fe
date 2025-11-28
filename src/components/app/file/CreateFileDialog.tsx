import { FunctionComponent, ReactElement } from 'react'
import {
  Dialog,
  Portal,
  Button,
  Stack,
  Input,
  Field,
} from '@chakra-ui/react'

interface CreateFileDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => void
  isLoading?: boolean
}

const CreateFileDialog: FunctionComponent<CreateFileDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}): ReactElement => {
  // 表單狀態
  const fileName = useSignal('')

  // 處理提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fileName.value.trim()) {
      onSubmit(fileName.value.trim())
      fileName.value = ''
    }
  }

  // 處理關閉
  const handleClose = () => {
    fileName.value = ''
    onClose()
  }

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
              <Dialog.Title>新增檔案</Dialog.Title>
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
                      建立
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

export default CreateFileDialog
