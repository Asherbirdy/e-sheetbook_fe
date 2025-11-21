import {
  Button, Dialog, Icon, Menu, Portal, Span, Text,
} from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { useFileApi } from '@/api'
import { toaster } from '@/components/ui/toaster'
import { GetSheetFile } from '@/types'

interface FileDeleteMenuItemProps {
  file: GetSheetFile
}

export const FileDeleteMenuItem = ({ file }: FileDeleteMenuItemProps) => {
  const queryClient = useQueryClient()

  const features = { isDeleteDialogOpen: useSignal(false) }

  // 刪除檔案 mutation
  const {
    mutate: deleteMutation,
    isPending: isDeletePending,
  } = useMutation({
    mutationFn: () => useFileApi.delete({ fileId: file._id }),
    onSuccess: () => {
      toaster.success({
        title: '刪除成功',
        description: '檔案已刪除',
      })
      features.isDeleteDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '刪除失敗' })
    },
  })

  // 打開刪除確認對話框
  const handleOpenDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    features.isDeleteDialogOpen.value = true
  }

  return (
    <>
      <Menu.Item
        value="delete"
        color="fg.error"
        _hover={{ bg: 'bg.error', color: 'fg.error' }}
        onClick={handleOpenDelete}
      >
        <Icon as={LuTrash2} color="red.500" />
        <Span>刪除</Span>
      </Menu.Item>

      {/* 刪除確認 Dialog */}
      <Dialog.Root
        open={features.isDeleteDialogOpen.value}
        onOpenChange={(e) => { features.isDeleteDialogOpen.value = e.open }}
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
                  」嗎?此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.isDeleteDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  onClick={() => deleteMutation()}
                  loading={isDeletePending}
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
