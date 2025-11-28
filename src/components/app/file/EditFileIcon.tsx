import {
  IconButton, Dialog, Portal, Button, Stack, Input, Field,
} from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { GetFile } from '@/types'
import { useFileApi } from '@/api/useFileApi'
import { toaster } from '@/components/ui/toaster'

interface EditFileIconProps {
  file: GetFile
}

export const EditFileIcon = ({ file }: EditFileIconProps) => {
  const open = useSignal(false)
  const queryClient = useQueryClient()
  const fileName = useSignal('')

  const editMutation = useMutation({
    mutationFn: ({ name, fileId }: { name: string; fileId: string }) =>
      useFileApi.edit({ name, fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      open.value = false
      toaster.success({
        title: '成功',
        description: '檔案已更新',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '更新檔案失敗',
      })
    },
  })

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    fileName.value = file.name
    open.value = true
  }

  const handleClose = () => {
    fileName.value = ''
    open.value = false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fileName.value.trim()) {
      editMutation.mutate({ name: fileName.value.trim(), fileId: file._id })
    }
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.500"
        _hover={{ bg: 'gray.100' }}
        aria-label="編輯檔案"
        onClick={handleOpen}
      >
        <LuPencil size={16} />
      </IconButton>

      <Dialog.Root
        open={open.value}
        onOpenChange={(details) => { if (!details.open) handleClose() }}
        closeOnInteractOutside
        size="md"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content onClick={(e) => e.stopPropagation()}>
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
                        disabled={editMutation.isPending}
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        disabled={!fileName.value.trim()}
                        loading={editMutation.isPending}
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
