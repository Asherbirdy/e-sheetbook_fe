import {
  Box, Icon, Dialog, Portal, Button, Input, Field,
} from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { toaster } from '@/components/ui/toaster'

interface FileAddSheetButtonProps {
  fileId: string
}

export const FileAddSheetButton = ({ fileId }: FileAddSheetButtonProps) => {
  const queryClient = useQueryClient()

  const data = {
    sheetName: useSignal(''),
    sheetUrl: useSignal(''),
  }

  const features = { isDialogOpen: useSignal(false) }

  // 創建 sheet mutation
  const {
    mutate: createMutation,
    isPending: isCreatePending,
  } = useMutation({
    mutationFn: () => useSheetApi.create({
      name: data.sheetName.value,
      url: data.sheetUrl.value,
      fileId,
    }),
    onSuccess: () => {
      toaster.success({
        title: '新增成功',
        description: 'Sheet 已成功新增',
      })
      features.isDialogOpen.value = false
      // 重置表單
      data.sheetName.value = ''
      data.sheetUrl.value = ''
      // 重新獲取資料
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '新增失敗' })
    },
  })

  const checkSubmit = computed(() => {
    const isCheck = (
      data.sheetName.value.trim() !== '' &&
      data.sheetUrl.value.trim() !== ''
    )
    return isCheck
  })

  return (
    <>
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        w="6"
        h="6"
        borderRadius="md"
        cursor="pointer"
        color="gray.600"
        _hover={{ bg: 'gray.100', color: 'gray.800' }}
        transition="all 0.2s"
        onClick={(e) => {
          e.stopPropagation()
          features.isDialogOpen.value = true
        }}
      >
        <Icon as={LuPlus} fontSize="sm" />
      </Box>

      {/* 新增 Sheet Dialog */}
      <Dialog.Root
        open={features.isDialogOpen.value}
        onOpenChange={(e) => { features.isDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>新增 Sheet</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    createMutation()
                  }}
                >
                  <Field.Root mb={4}>
                    <Field.Label>Sheet 名稱</Field.Label>
                    <Input
                      value={data.sheetName.value}
                      onChange={(e) => {
                        data.sheetName.value = e.target.value
                      }}
                      placeholder="請輸入 Sheet 名稱"
                      autoFocus
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Sheet URL</Field.Label>
                    <Input
                      value={data.sheetUrl.value}
                      onChange={(e) => {
                        data.sheetUrl.value = e.target.value
                      }}
                      placeholder="請輸入 Sheet URL"
                    />
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      features.isDialogOpen.value = false
                      data.sheetName.value = ''
                      data.sheetUrl.value = ''
                    }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={() => createMutation()}
                  loading={isCreatePending}
                  disabled={!checkSubmit.value}
                >
                  新增
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}
