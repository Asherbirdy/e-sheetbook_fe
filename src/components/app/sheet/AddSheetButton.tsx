import {
  Button, Dialog, Portal, Stack, Input, Field,
} from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import { useSheetApi } from '@/api/useSheetApi'
import { toaster } from '@/components/ui/toaster'

interface AddSheetButtonProps {
  fileId: string
}

export const AddSheetButton = ({ fileId }: AddSheetButtonProps) => {
  const queryClient = useQueryClient()
  const open = useSignal(false)

  // 表單狀態
  const data = {
    name: useSignal(''),
    url: useSignal(''),
  }

  // 新增 Sheet Mutation
  const createSheetMutation = useMutation({
    mutationFn: async ({ name, url }: { name: string, url: string }) => {
      return useSheetApi.create({
        name,
        url,
        fileId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
      data.name.value = ''
      data.url.value = ''
      open.value = false
      toaster.create({
        title: '新增成功',
        description: '試算表已成功新增',
        type: 'success',
      })
    },
    onError: () => {
      toaster.create({
        title: '新增失敗',
        description: '試算表新增失敗,請稍後再試',
        type: 'error',
      })
    },
  })

  const handleOpen = () => {
    open.value = true
  }

  const handleClose = () => {
    data.name.value = ''
    data.url.value = ''
    open.value = false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.name.value.trim() && data.url.value.trim()) {
      createSheetMutation.mutate({
        name: data.name.value.trim(),
        url: data.url.value.trim(),
      })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
      >
        <LuPlus />
        新增試算表
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
                <Dialog.Title>新增試算表</Dialog.Title>
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
                        disabled={createSheetMutation.isPending}
                      >
                        取消
                      </Button>
                      <Button
                        type="submit"
                        disabled={!data.name.value.trim() || !data.url.value.trim()}
                        loading={createSheetMutation.isPending}
                      >
                        新增
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
