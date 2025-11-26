import {
  Box, Button, Dialog, Field, Heading, HStack, Icon, Input, Portal,
} from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'

import { FileSheetGrid } from '@/components'
import { useSheetApi } from '@/api'
import { toaster } from '@/components/ui/toaster'

const FileIdPage = () => {
  const { fileId } = useParams<{ fileId: string }>()
  const queryClient = useQueryClient()

  const data = {
    name: useSignal(''),
    url: useSignal(''),
  }

  const features = {
    isDialogOpen: useSignal(false),
  }

  // 新增表格 mutation
  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: () => useSheetApi.create({
      name: data.name.value,
      url: data.url.value,
      fileId: fileId!,
    }),
    onSuccess: () => {
      toaster.success({ title: '新增成功', description: '表格已建立' })
      features.isDialogOpen.value = false
      data.name.value = ''
      data.url.value = ''
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
    },
    onError: () => {
      toaster.error({ title: '新增失敗' })
    },
  })

  if (!fileId) {
    return null
  }

  return (
    <>
      <Box p="6">
        <HStack justify="space-between" mb="6">
          <Heading size="lg">表格列表</Heading>
          <Button
            size="sm"
            colorPalette="green"
            onClick={() => { features.isDialogOpen.value = true }}
          >
            <Icon as={LuPlus} />
            新增表格
          </Button>
        </HStack>
        <FileSheetGrid fileId={fileId} />

        {/* 新增表格 Dialog */}
        <Dialog.Root
          open={features.isDialogOpen.value}
          onOpenChange={(e) => { features.isDialogOpen.value = e.open }}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>新增表格</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body display="flex" flexDirection="column" gap="4">
                  <Field.Root>
                    <Field.Label>表格名稱</Field.Label>
                    <Input
                      value={data.name.value}
                      onChange={(e) => { data.name.value = e.target.value }}
                      placeholder="請輸入表格名稱"
                      autoFocus
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>表格網址</Field.Label>
                    <Input
                      value={data.url.value}
                      onChange={(e) => { data.url.value = e.target.value }}
                      placeholder="請輸入表格網址"
                    />
                  </Field.Root>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => { features.isDialogOpen.value = false }}
                    >
                      取消
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    colorPalette="green"
                    onClick={() => createMutation()}
                    loading={isPending}
                  >
                    新增
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger />
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Box>
    </>
  )
}

export default FileIdPage