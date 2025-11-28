import {
  IconButton, Dialog, Portal, Button, Stack, Text,
} from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { GetFile } from '@/types'
import { useFileApi } from '@/api/useFileApi'
import { toaster } from '@/components/ui/toaster'

interface DeleteFileIconProps {
  file: GetFile
}

export const DeleteFileIcon = ({ file }: DeleteFileIconProps) => {
  const open = useSignal(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => useFileApi.delete({ fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      open.value = false
      toaster.success({
        title: '成功',
        description: '檔案已刪除',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '刪除檔案失敗',
      })
    },
  })

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    open.value = true
  }

  const handleClose = () => {
    open.value = false
  }

  const handleConfirm = () => {
    deleteMutation.mutate(file._id)
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.500"
        _hover={{ bg: 'red.50', color: 'red.500' }}
        onClick={handleOpen}
        aria-label="刪除檔案"
      >
        <LuTrash2 size={16} />
      </IconButton>

      <Dialog.Root
        open={open.value}
        onOpenChange={(details) => { if (!details.open) handleClose() }}
        closeOnInteractOutside
        size="sm"
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content onClick={(e) => e.stopPropagation()}>
              <Dialog.Header>
                <Dialog.Title>確認刪除</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  確定要刪除檔案「
                  <strong>{file.name}</strong>
                  」嗎？此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Stack
                  direction="row" gap={2} justify="flex-end"
                  w="full"
                >
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={deleteMutation.isPending}
                  >
                    取消
                  </Button>
                  <Button
                    colorPalette="red"
                    onClick={handleConfirm}
                    loading={deleteMutation.isPending}
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
