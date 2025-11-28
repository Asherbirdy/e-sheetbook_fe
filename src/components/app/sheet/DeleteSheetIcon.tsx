import {
  IconButton, Dialog, Portal, Button, Stack, Text,
} from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { Sheet } from '@/types'
import { useSheetApi } from '@/api/useSheetApi'
import { toaster } from '@/components/ui/toaster'

interface DeleteSheetIconProps {
  sheet: Sheet
  fileId: string
}

export const DeleteSheetIcon = ({ sheet, fileId }: DeleteSheetIconProps) => {
  const queryClient = useQueryClient()
  const deleteAlert = useSignal(false)

  // 刪除 Sheet Mutation
  const deleteSheetMutation = useMutation({
    mutationFn: async (sheetId: string) => {
      return useSheetApi.delete({ sheetId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
      deleteAlert.value = false
      toaster.create({
        title: '刪除成功',
        description: '試算表已成功刪除',
        type: 'success',
      })
    },
    onError: () => {
      toaster.create({
        title: '刪除失敗',
        description: '試算表刪除失敗,請稍後再試',
        type: 'error',
      })
    },
  })

  // 處理確認刪除
  const handleConfirm = () => {
    deleteSheetMutation.mutate(sheet._id)
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.600"
        _hover={{ bg: 'red.50', color: 'red.500' }}
        onClick={(e) => {
          e.stopPropagation()
          deleteAlert.value = true
        }}
        aria-label="刪除試算表"
      >
        <LuTrash2 size={16} />
      </IconButton>

      {/* 刪除警告對話框 */}
      <Dialog.Root
        open={deleteAlert.value}
        onOpenChange={(e: { open: boolean }) => { if (!e.open) deleteAlert.value = false }}
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
                <Stack
                  direction="row"
                  gap={2}
                  justify="flex-end"
                  w="full"
                >
                  <Button
                    variant="outline"
                    onClick={() => { deleteAlert.value = false }}
                    disabled={deleteSheetMutation.isPending}
                  >
                    取消
                  </Button>
                  <Button
                    colorPalette="red"
                    onClick={handleConfirm}
                    loading={deleteSheetMutation.isPending}
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
    </>
  )
}
