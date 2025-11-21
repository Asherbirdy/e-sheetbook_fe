import {
  Box, Drawer, Grid, Icon, Portal, Text, VStack,
} from '@chakra-ui/react'
import { LuSheet, LuFile } from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'

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

  const features = {
    drawer: {
      isOpen: useSignal(false),
      selectedSheet: useSignal<SheetData | null>(null),
    },
  }

  const { data, isLoading } = useQuery({
    queryKey: ['sheets', fileId],
    queryFn: () => useSheetApi.getSheetFromFile({ fileId }),
  })

  // 打開 Drawer
  const handleOpenDrawer = (sheet: SheetData) => {
    features.drawer.selectedSheet.value = sheet
    features.drawer.isOpen.value = true
  }

  if (isLoading) {
    return (
      <VStack gap="4" py="8">
        <Icon as={LuFile} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">載入中...</Text>
      </VStack>
    )
  }

  if (!data?.data?.sheets || data.data.sheets.length === 0) {
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
        {data.data.sheets.map((sheet) => (
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
          >
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
    </>
  )
}
