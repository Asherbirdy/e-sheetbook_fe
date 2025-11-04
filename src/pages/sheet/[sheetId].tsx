import {
  Box, Container, Heading, HStack, Icon, Spinner, Text, VStack,
} from '@chakra-ui/react'
import { LuSheet } from 'react-icons/lu'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'
import { DashboardLayout } from '@/layout'

const SheetPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>()
  const { palette } = useColorMode()

  const { data: sheetData, isLoading } = useQuery({
    queryKey: ['sheet', sheetId],
    queryFn: () => useSheetApi.get(),
    enabled: !!sheetId,
  })

  // 從所有文件中找到對應的 sheet
  const sheet = sheetData?.data?.files
    .flatMap((file) => file.sheets)
    .find((s) => s._id === sheetId)

  if (isLoading) {
    return (
      <DashboardLayout>
        <Container maxW="container.xl" py="8">
          <VStack gap="4">
            <Spinner size="xl" />
            <Text color="gray.500">載入中...</Text>
          </VStack>
        </Container>
      </DashboardLayout>
    )
  }

  if (!sheet) {
    return (
      <DashboardLayout>
        <Container maxW="container.xl" py="8">
          <VStack gap="4">
            <Icon as={LuSheet} fontSize="4xl" color="gray.400" />
            <Text color="gray.500" fontSize="lg">找不到此表格</Text>
          </VStack>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py="8">
        <VStack gap="6" alignItems="stretch">
          {/* 表格標題區域 */}
          <Box
            p="6"
            borderRadius="lg"
            bg={palette.bgColor}
            borderWidth="1px"
            borderColor={palette.borderColor}
          >
            <HStack gap="3" mb="4">
              <Icon as={LuSheet} fontSize="2xl" color="green.500" />
              <Heading size="xl">{sheet.name}</Heading>
            </HStack>

            <VStack gap="2" alignItems="flex-start">
              <Text fontSize="sm" color="gray.600">
                建立時間：
                {dayjs(sheet.createdAt).format('YYYY/MM/DD HH:mm')}
              </Text>
              {sheet.updatedAt !== sheet.createdAt && (
                <Text fontSize="sm" color="gray.600">
                  更新時間：
                  {dayjs(sheet.updatedAt).format('YYYY/MM/DD HH:mm')}
                </Text>
              )}
            </VStack>
          </Box>

          {/* 表格內容區域 - 預留空間供未來實作 */}
          <Box
            p="6"
            borderRadius="lg"
            bg={palette.bgColor}
            borderWidth="1px"
            borderColor={palette.borderColor}
            minH="400px"
          >
            <Text color="gray.500" textAlign="center" py="20">
              表格內容編輯器（尚未實作）
            </Text>
          </Box>
        </VStack>
      </Container>
    </DashboardLayout>
  )
}

export default SheetPage
