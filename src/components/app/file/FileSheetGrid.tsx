import {
  Box, Button, Dialog, Drawer, Field, Grid, Icon, Input, Menu, Portal, Span, Text, VStack,
} from '@chakra-ui/react'
import {
  LuSheet, LuFile, LuEllipsis, LuPencil,
} from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'
import { toaster } from '@/components/ui/toaster'

interface SheetData {
  _id: string
  name: string
  url: string
  fileId: string
  userId: string
  updatedAt: string
}

interface FileSheetGridProps {
  fileId: string
}

export const FileSheetGrid = ({ fileId }: FileSheetGridProps) => {
  const { palette } = useColorMode()
  const queryClient = useQueryClient()

  const data = {
    editName: useSignal(''),
    editUrl: useSignal(''),
  }

  const features = {
    drawer: {
      isOpen: useSignal(false),
      selectedSheet: useSignal<SheetData | null>(null),
    },
    edit: {
      isDialogOpen: useSignal(false),
      targetSheet: useSignal<SheetData | null>(null),
    },
    delete: {
      isDialogOpen: useSignal(false),
      targetSheet: useSignal<SheetData | null>(null),
    },
  }

  // 編輯表格 mutation
  const { mutate: editMutation, isPending: isEditPending } = useMutation({
    mutationFn: () => useSheetApi.edit({
      sheetId: features.edit.targetSheet.value!._id,
      fileId: features.edit.targetSheet.value!.fileId,
      name: data.editName.value,
      url: data.editUrl.value,
      api: '',
    }),
    onSuccess: () => {
      toaster.success({ title: '編輯成功', description: '表格已更新' })
      features.edit.isDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
    },
    onError: () => {
      toaster.error({ title: '編輯失敗' })
    },
  })

  // 刪除表格 mutation
  const { mutate: deleteMutation, isPending: isDeletePending } = useMutation({
    mutationFn: () => useSheetApi.delete({ sheetId: features.delete.targetSheet.value!._id }),
    onSuccess: () => {
      toaster.success({ title: '刪除成功', description: '表格已刪除' })
      features.delete.isDialogOpen.value = false
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
    },
    onError: () => {
      toaster.error({ title: '刪除失敗' })
    },
  })

  const { data: sheetsData, isLoading } = useQuery({
    queryKey: ['sheets', fileId],
    queryFn: () => useSheetApi.getSheetFromFile({ fileId }),
  })

  // 打開 Drawer
  const handleOpenDrawer = (sheet: SheetData) => {
    features.drawer.selectedSheet.value = sheet
    features.drawer.isOpen.value = true
  }

  // 打開編輯 Dialog
  const handleOpenEdit = (e: React.MouseEvent, sheet: SheetData) => {
    e.stopPropagation()
    data.editName.value = sheet.name
    data.editUrl.value = sheet.url
    features.edit.targetSheet.value = sheet
    features.edit.isDialogOpen.value = true
  }

  // 打開刪除確認 Dialog
  const handleOpenDelete = (e: React.MouseEvent, sheet: SheetData) => {
    e.stopPropagation()
    features.delete.targetSheet.value = sheet
    features.delete.isDialogOpen.value = true
  }

  if (isLoading) {
    return (
      <VStack gap="4" py="8">
        <Icon as={LuFile} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">載入中...</Text>
      </VStack>
    )
  }

  if (!sheetsData?.data?.sheets || sheetsData.data.sheets.length === 0) {
    return (
      <VStack gap="4" py="8">
        <Icon as={LuSheet} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">此檔案尚無表格</Text>
      </VStack>
    )
  }

  return (
    <>
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(5, 1fr)',
        }}
        gap="4"
      >
        {sheetsData.data.sheets.map((sheet) => (
          <Box
            key={sheet._id}
            p="6"
            borderRadius="lg"
            bg={palette.sheetBg}
            _hover={{
              bg: palette.sheetHoverBg,
              transform: 'translateY(-2px)',
              shadow: 'md',
            }}
            transition="all 0.2s"
            cursor="pointer"
            onClick={() => handleOpenDrawer(sheet)}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="3"
            minH="120px"
            position="relative"
          >
            {/* 右上角選單 */}
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger asChild>
                <Box
                  as="span"
                  position="absolute"
                  top="2"
                  right="2"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="6"
                  h="6"
                  borderRadius="md"
                  cursor="pointer"
                  color="gray.500"
                  _hover={{ bg: 'gray.200', color: 'gray.700' }}
                  transition="all 0.2s"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon as={LuEllipsis} fontSize="sm" />
                </Box>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="120px">
                    <Menu.Item value="edit" onClick={(e) => handleOpenEdit(e, sheet)}>
                      <Icon as={LuPencil} color="blue.500" />
                      <Span>編輯</Span>
                    </Menu.Item>
                    <Menu.Item value="delete" color="fg.error" onClick={(e) => handleOpenDelete(e, sheet)}>
                      刪除
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            <Icon as={LuSheet} fontSize="4xl" color="green.500" />
            <Text
              fontSize="sm"
              fontWeight="medium"
              textAlign="center"
              color={palette.sheetTextColor}
            >
              {sheet.name}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Drawer - 佔據畫面 70% */}
      <Drawer.Root
        open={features.drawer.isOpen.value}
        onOpenChange={(e) => { features.drawer.isOpen.value = e.open }}
        placement="end"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content width="70vw" maxW="70vw">
              <Drawer.Header>
                <Drawer.Title>
                  {features.drawer.selectedSheet.value?.name || '表格'}
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body p="0" h="100%">
                {features.drawer.selectedSheet.value && (
                  <iframe
                    src={features.drawer.selectedSheet.value.url}
                    title={features.drawer.selectedSheet.value.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                )}
              </Drawer.Body>
              <Drawer.CloseTrigger />
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* 編輯表格 Dialog */}
      <Dialog.Root
        open={features.edit.isDialogOpen.value}
        onOpenChange={(e) => { features.edit.isDialogOpen.value = e.open }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>編輯表格</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" flexDirection="column" gap="4">
                <Field.Root>
                  <Field.Label>表格名稱</Field.Label>
                  <Input
                    value={data.editName.value}
                    onChange={(e) => { data.editName.value = e.target.value }}
                    placeholder="請輸入表格名稱"
                    autoFocus
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>表格網址</Field.Label>
                  <Input
                    value={data.editUrl.value}
                    onChange={(e) => { data.editUrl.value = e.target.value }}
                    placeholder="請輸入表格網址"
                  />
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.edit.isDialogOpen.value = false }}
                  >
                    取消
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="blue"
                  onClick={() => editMutation()}
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
        open={features.delete.isDialogOpen.value}
        onOpenChange={(e) => { features.delete.isDialogOpen.value = e.open }}
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
                  確定要刪除「
                  {features.delete.targetSheet.value?.name}
                  」嗎？此操作無法復原。
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => { features.delete.isDialogOpen.value = false }}
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
