import {
  Accordion, Box, HStack, Icon, Span, Text, VStack,
} from '@chakra-ui/react'
import { LuFile, LuSheet } from 'react-icons/lu'
import dayjs from 'dayjs'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'
import { FileMenu } from './FileMenu'
import { FileAddSheetButton } from './FileAddSheetButton'

export const FileAccordion = () => {
  const { palette } = useColorMode()
  const navigate = useNavigate()

  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

  if (isLoading) {
    return <Text color="gray.500" fontSize="sm" px="3">載入中...</Text>
  }

  if (sheets?.data?.files.length === 0) {
    return (
      <VStack gap="2" py="8">
        <Icon as={LuFile} fontSize="3xl" color="gray.400" />
        <Text color="gray.500" fontSize="sm">尚無文件</Text>
      </VStack>
    )
  }

  return (
    <Accordion.Root
      collapsible
      variant="plain"
      size="sm"
    >
      {sheets?.data?.files.map((file) => (
        <Accordion.Item key={file._id} value={file._id}>
          <Accordion.ItemTrigger
            py="3"
            px="3"
            borderRadius="md"
            _hover={{ bg: palette.hoverBg }}
          >
            <HStack flex="1" gap="2">
              <Icon as={LuFile} fontSize="lg" color="blue.500" />
              <Span flex="1" fontWeight="medium" fontSize="sm">
                {file.name}
              </Span>
              {/* 新增 Sheet 按鈕 */}
              <FileAddSheetButton fileId={file._id} />
              {/* 檔案操作選單 */}
              <FileMenu file={file} />
            </HStack>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody py="2" px="3">

              {!file.sheets || file.sheets.length === 0 && (
                <Text fontSize="xs" color="gray.500" py="2">
                  此文件尚無表格
                </Text>
              )}

              {file.sheets && file.sheets.length > 0 && (
                <VStack gap="2" alignItems="stretch">
                  {file.sheets.map((sheet) => (
                    <Box
                      key={sheet._id}
                      p="3"
                      borderRadius="md"
                      bg={palette.sheetBg}
                      _hover={{ bg: palette.sheetHoverBg, cursor: 'pointer' }}
                      transition="all 0.2s"
                      onClick={() => navigate(`/sheet/${sheet._id}`)}
                    >
                      <HStack gap="2" mb="2">
                        <Icon as={LuSheet} fontSize="md" color="green.500" />
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          flex="1"
                          color={palette.sheetTextColor}
                        >
                          {sheet.name}
                        </Text>
                      </HStack>
                      <VStack gap="1" alignItems="flex-start">
                        <Text fontSize="xs" color="gray.500">
                          建立時間:
                          {' '}
                          {dayjs(sheet.createdAt).format('YYYY/MM/DD')}
                        </Text>
                        {sheet.updatedAt !== sheet.createdAt && (
                          <Text fontSize="xs" color="gray.500">
                            更新時間:
                            {' '}
                            {dayjs(sheet.updatedAt).format('YYYY/MM/DD')}
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Accordion.ItemBody>

          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
