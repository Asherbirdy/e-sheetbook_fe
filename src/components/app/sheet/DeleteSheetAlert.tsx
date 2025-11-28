import { FunctionComponent, ReactElement } from 'react'
import {
  Dialog,
  Portal,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Sheet } from '@/types'

interface DeleteSheetAlertProps {
  open: boolean
  sheet: Sheet | null
  onClose: () => void
  onConfirm: (sheetId: string) => void
  isLoading?: boolean
}

const DeleteSheetAlert: FunctionComponent<DeleteSheetAlertProps> = ({
  open,
  sheet,
  onClose,
  onConfirm,
  isLoading = false,
}): ReactElement => {
  // 處理確認刪除
  const handleConfirm = () => {
    if (sheet) {
      onConfirm(sheet._id)
    }
  }

  if (!sheet) return <></>

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e: { open: boolean }) => { if (!e.open) onClose() }}
      size="sm"
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
                確定要刪除試算表「
                <strong>{sheet.name}</strong>
                」嗎?此操作無法復原。
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Stack direction="row" gap={2} justify="flex-end" w="full">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  取消
                </Button>
                <Button
                  colorPalette="red"
                  onClick={handleConfirm}
                  loading={isLoading}
                >
                  刪除
                </Button>
              </Stack>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default DeleteSheetAlert
