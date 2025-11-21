import {
  Box, HStack, Icon, Text, VStack, Menu, Portal, Span, Dialog, Button, Input, Field,
} from '@chakra-ui/react'
import {
  LuFile, LuEllipsis, LuPencil, LuTrash2,
} from 'react-icons/lu'
import { useSheetApi, useFileApi } from '@/api'
import { useColorMode } from '@/hook'
import { toaster } from '@/components/ui/toaster'
import { GetSheetFile } from '@/types'

export const FileAccordion = () => {
  const { palette } = useColorMode()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

  // FileMenu 功能整合：檔案操作對話框狀態
  const data = { fileName: useSignal('') }
  const features = {
    edit: {
      isEditDialogOpen: useSignal(false),
      currentFileId: useSignal<string>(''),
    },
    delete: {
      isDeleteDialogOpen: useSignal(false),
      currentFileId: useSignal<string>(''),
      currentFileName: useSignal<string>(''),
    },
  }

  // 編輯檔案 mutation
  const {
    mutate: editMutation,
    isPending: isEditPending,
  } = useMutation({
    mutationFn: (fileName: string) => useFileApi.edit({
      fileId: features.edit.currentFileId.value,
      name: fileName,
    }),
    onSuccess: () => {
      toaster.success({
        title: '編輯成功',
        description: '檔案名稱已更新',
      })
      features.edit.isEditDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  // 刪除檔案 mutation
  const {
    mutate: deleteMutation,
    isPending: isDeletePending,
  } = useMutation({
    mutationFn: () => useFileApi.delete({ fileId: features.delete.currentFileId.value }),
    onSuccess: () => {
      toaster.success({
        title: '刪除成功',
        description: '檔案已刪除',
      })
      features.delete.isDeleteDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets'] })
    },
    onError: () => {
      toaster.error({ title: '刪除失敗' })
    },
  })

  // 打開編輯對話框
  const handleOpenEdit = (e: React.MouseEvent, file: GetSheetFile) => {
    e.stopPropagation()
    data.fileName.value = file.name
    features.edit.currentFileId.value = file._id
    features.edit.isEditDialogOpen.value = true
  }

  // 打開刪除確認對話框
  const handleOpenDelete = (e: React.MouseEvent, file: GetSheetFile) => {
    e.stopPropagation()
    features.delete.currentFileId.value = file._id
    features.delete.currentFileName.value = file.name
    features.delete.isDeleteDialogOpen.value = true
  }

  /*
     * This component now only shows files, not sheets
  */
  if (isLoading) {
    return <Text color="gray.500" fontSize="sm" px="3">載入中...</Text>
  }

  /*
    * No files to display
  */
  if (sheets?.data?.files.length === 0) {
    return (
      <VStack gap="2" py="8">
        <Icon as={LuFile} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">尚無文件</Text>
      </VStack>
    )
  }

  /*
    * Render files
  */
  return (
    <>
      <VStack gap="1" alignItems="stretch">
        {sheets?.data?.files.map((file) => (
          <Box
            key={file._id}
            py="3"
            px="3"
            borderRadius="md"
            _hover={{ bg: palette.hoverBg }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => navigate(`/dashboard/file/${file._id}`)}
          >
            <HStack gap="2">
              <Icon as={LuFile} fontSize="lg" color="blue.500" />
              <Text flex="1" fontWeight="medium" fontSize="sm">
                {file.name}
              </Text>
              {/* 檔案選單 (原 FileMenu 組件) */}
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
                        onClick={(e) => handleOpenEdit(e, file)}
                      >
                        <Icon as={LuPencil} color="blue.500" />
                        <Span>編輯</Span>
                      </Menu.Item>
                      <Menu.Item
                        value="delete"
                        color="fg.error"
                        _hover={{ bg: 'bg.error', color: 'fg.error' }}
                        onClick={(e) => handleOpenDelete(e, file)}
                      >
                        <Icon as={LuTrash2} color="red.500" />
                        <Span>刪除</Span>
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* 編輯檔案 Dialog */}
      <Dialog.Root
        open={features.edit.isEditDialogOpen.value}
        onOpenChange={(e) => { features.edit.isEditDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯檔案</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form>
                  <Field.Root>
                    <Field.Label>檔案名稱</Field.Label>
                    <Input
                      value={data.fileName.value}
                      onChange={(e) => {
                        data.fileName.value = e.target.value
                      }}
                      placeholder="請輸入檔案名稱"
                      autoFocus
                    />
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.edit.isEditDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={() => editMutation(data.fileName.value)}
                  loading={isEditPending}
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
        open={features.delete.isDeleteDialogOpen.value}
        onOpenChange={(e) => { features.delete.isDeleteDialogOpen.value = e.open }}
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
                  <Text as="span" fontWeight="bold">{features.delete.currentFileName.value}</Text>
                  」嗎?此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.delete.isDeleteDialogOpen.value = false }}
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
