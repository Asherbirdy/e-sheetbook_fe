import {
  Button, Dialog, Portal, Stack, Input, Field,
} from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import { useFileApi } from '@/api/useFileApi'
import { toaster } from '@/components/ui/toaster'

export const CreateFileButton = () => {
  const open = useSignal(false)
  const queryClient = useQueryClient()
  const fileName = useSignal('')

  const createMutation = useMutation({
    mutationFn: (name: string) => useFileApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      fileName.value = ''
      open.value = false
      toaster.success({
        title: '成功',
        description: '檔案已建立',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '建立檔案失敗',
      })
    },
  })

  const handleOpen = () => {
    open.value = true
  }

  const handleClose = () => {
    fileName.value = ''
    open.value = false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (fileName.value.trim()) {
      createMutation.mutate(fileName.value.trim())
    }
  }

  return (
    <>
      <Button onClick={handleOpen}>
        <LuPlus />
        新增檔案
      </Button>

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
                        disabled={createMutation.isPending}
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        disabled={!fileName.value.trim()}
                        loading={createMutation.isPending}
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
    </>
  )
}
