import { GetSheetFile } from '@/types'
import {
  Box, Icon, Menu, Portal, Span, Dialog, Button, Input, Field, Text,
} from '@chakra-ui/react'
import {
  LuEllipsis, LuPencil, LuTrash2,
} from 'react-icons/lu'
import { useFileApi } from '@/api'
import { toaster } from '@/components/ui/toaster'

interface FileMenuProps {
  file: GetSheetFile
}

export const FileMenu = ({ file }: FileMenuProps) => {
  // 狀態管理
  const state = {
    data: { fileName: useSignal(file.name) },
    features: {
      isEditDialogOpen: useSignal(false),
      isDeleteDialogOpen: useSignal(false),
      isSubmitting: useSignal(false),
      isDeleting: useSignal(false),
      error: useSignal(''),
    },
  }

  // API mutation
  const mutation = useMutation({
    mutationFn: (fileName: string) => useFileApi.edit({
      fileId: file._id,
      name: fileName,
    }),
    onSuccess: () => {
      const { features } = state
      toaster.success({
        title: '編輯成功',
        description: '檔案名稱已更新',
      })
      features.isEditDialogOpen.value = false
      // 重新獲取資料
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: (error: unknown) => {
      const { features } = state
      const errorMsg = (error as { response?: { data?: { msg?: string } } })?.response?.data?.msg || '編輯失敗'
      features.error.value = errorMsg
      toaster.error({
        title: '編輯失敗',
        description: features.error.value,
      })
    },
  })

  const queryClient = useQueryClient()

  // 刪除 mutation
  const deleteMutation = useMutation({
    mutationFn: () => useFileApi.delete({ fileId: file._id }),
    onSuccess: () => {
      const { features } = state
      toaster.success({
        title: '刪除成功',
        description: '檔案已刪除',
      })
      features.isDeleteDialogOpen.value = false
      // 重新獲取資料
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: (error: unknown) => {
      const errorMsg = (error as { response?: { data?: { msg?: string } } })?.response?.data?.msg || '刪除失敗'
      toaster.error({
        title: '刪除失敗',
        description: errorMsg,
      })
    },
  })

  // 打開編輯對話框
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    const { data, features } = state
    data.fileName.value = file.name
    features.error.value = ''
    features.isEditDialogOpen.value = true
  }

  // 打開刪除確認對話框
  const handleOpenDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    state.features.isDeleteDialogOpen.value = true
  }

  // 確認刪除
  const handleDelete = async () => {
    const { features } = state
    features.isDeleting.value = true
    try {
      await deleteMutation.mutateAsync()
    } finally {
      features.isDeleting.value = false
    }
  }

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, features } = state

    if (!data.fileName.value.trim()) {
      features.error.value = '檔案名稱不能為空'
      return
    }

    features.isSubmitting.value = true
    try {
      await mutation.mutateAsync(data.fileName.value)
    } finally {
      features.isSubmitting.value = false
    }
  }

  return (
    <>
      <Menu.Root positioning={{ placement: 'bottom-end' }}>
        <Menu.Trigger asChild>
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
            onClick={(e) => e.stopPropagation()}
          >
            <Icon as={LuEllipsis} fontSize="sm" />
          </Box>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="120px">
              <Menu.Item
                value="edit"
                onClick={handleOpenEdit}
              >
                <Icon as={LuPencil} color="blue.500" />
                <Span>編輯</Span>
              </Menu.Item>
              <Menu.Item
                value="delete"
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                onClick={handleOpenDelete}
              >
                <Icon as={LuTrash2} color="red.500" />
                <Span>刪除</Span>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {/* 編輯檔案 Dialog */}
      <Dialog.Root
        open={state.features.isEditDialogOpen.value}
        onOpenChange={(e) => { state.features.isEditDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯檔案</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form onSubmit={handleSubmit}>
                  <Field.Root invalid={!!state.features.error.value}>
                    <Field.Label>檔案名稱</Field.Label>
                    <Input
                      value={state.data.fileName.value}
                      onChange={(e) => {
                        state.data.fileName.value = e.target.value
                        state.features.error.value = ''
                      }}
                      placeholder="請輸入檔案名稱"
                      autoFocus
                    />
                    {state.features.error.value && (
                      <Field.ErrorText>{state.features.error.value}</Field.ErrorText>
                    )}
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { state.features.isEditDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={handleSubmit}
                  loading={state.features.isSubmitting.value}
                >
                  儲存
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* 刪除確認 Dialog */}
      <Dialog.Root
        open={state.features.isDeleteDialogOpen.value}
        onOpenChange={(e) => { state.features.isDeleteDialogOpen.value = e.open }}
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
                  確定要刪除檔案「
                  <Text as="span" fontWeight="bold">{file.name}</Text>
                  」嗎？此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { state.features.isDeleteDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={handleDelete}
                  loading={state.features.isDeleting.value}
                >
                  刪除
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
