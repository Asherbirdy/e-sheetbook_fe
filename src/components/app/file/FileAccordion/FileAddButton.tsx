import {
  IconButton, Button, Input, VStack, Field,
} from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import {
  DialogRoot, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogCloseTrigger,
} from '@/components/ui/dialog'
import { useFileApi } from '@/api'
import { toaster } from '@/components/ui/toaster'
import { CreateFilePayload } from '@/types'

/**
 * 新增文件按鈕組件
 * 包含點擊後彈出的 Dialog 表單，用於創建新文件
 */
export const FileAddButton = () => {
  const queryClient = useQueryClient()

  // 組件狀態
  const state = {
    data: { fileName: useSignal('') },
    features: {
      isOpen: useSignal(false),
      isSubmitting: useSignal(false),
    },
  }

  // 創建文件 mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateFilePayload) => useFileApi.create(payload),
    onSuccess: (response) => {
      const { data, features } = state

      toaster.success({
        title: '創建成功',
        description: `文件「${response.data.name}」已成功創建`,
      })

      // 關閉 Dialog 並重置表單
      features.isOpen.value = false
      data.fileName.value = ''

      // 刷新文件列表
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({
        title: '創建失敗',
        description: '請稍後再試',
      })
    },
  })

  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = state

    if (!data.fileName.value.trim()) {
      toaster.error({
        title: '驗證失敗',
        description: '請輸入文件名稱',
      })
      return
    }

    mutate({ name: data.fileName.value.trim() })
  }

  // 開啟 Dialog
  const handleOpen = () => {
    const { features } = state
    features.isOpen.value = true
  }

  // 關閉 Dialog
  const handleClose = () => {
    const { data, features } = state
    features.isOpen.value = false
    data.fileName.value = ''
  }

  return (
    <>
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="新增文件"
        onClick={handleOpen}
      >
        <LuPlus />
      </IconButton>

      <DialogRoot
        open={state.features.isOpen.value}
        onOpenChange={(e) => {
          state.features.isOpen.value = e.open
          if (!e.open) {
            state.data.fileName.value = ''
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增文件</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody>
              <VStack gap="4" alignItems="stretch">
                <Field.Root required>
                  <Field.Label>文件名稱</Field.Label>
                  <Input
                    placeholder="請輸入文件名稱"
                    value={state.data.fileName.value}
                    onChange={(e) => {
                      state.data.fileName.value = e.target.value
                    }}
                    autoFocus
                  />
                </Field.Root>
              </VStack>
            </DialogBody>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                type="button"
              >
                取消
              </Button>
              <Button
                type="submit"
                loading={isPending}
                disabled={!state.data.fileName.value.trim()}
              >
                創建
              </Button>
            </DialogFooter>
          </form>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  )
}
