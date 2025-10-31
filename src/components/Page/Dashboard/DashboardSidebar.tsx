import {
  Box, CloseButton, Flex, Text, Accordion, Span, Badge, VStack, HStack, Icon, Menu, Portal,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useSheetApi } from '@/api'
import { LuFile, LuSheet, LuEllipsis, LuPencil, LuTrash2 } from 'react-icons/lu'
import dayjs from 'dayjs'
import { useColorMode } from '@/hook'
import { FileAddButton } from '@/components'

export const DashboardSidebar = () => {

  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

  const {
    bgColor, borderColor, hoverBg, sheetBg, sheetHoverBg, sheetTextColor,
  } = useColorMode()

  return (
    <Box
      transition="3s ease"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      pos="fixed"
      h="full"
      overflowY="auto"
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        borderBottom="1px"
        borderBottomColor={borderColor}
      >
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} />
      </Flex>

      <Box px="4" py="4">
        {/* 標題區域 */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb="3"
          px="3"
        >
          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
            Files
          </Text>
          <FileAddButton />
        </Flex>

        {/* 內容區域 */}
        {isLoading ? (
          <Text color="gray.500" fontSize="sm" px="3">載入中...</Text>
        ) : sheets?.data?.files.length === 0 ? (
          <VStack gap="2" py="8">
            <Icon as={LuFile} fontSize="3xl" color="gray.400" />
            <Text color="gray.500" fontSize="sm">尚無文件</Text>
          </VStack>
        ) : (
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
                  _hover={{ bg: hoverBg }}
                >
                  <HStack flex="1" gap="2">
                    <Icon as={LuFile} fontSize="lg" color="blue.500" />
                    <Span flex="1" fontWeight="medium" fontSize="sm">
                      {file.name}
                    </Span>
                    <Badge
                      size="xs"
                      colorPalette="blue"
                      variant="subtle"
                    >
                      {file.sheets?.length || 0}
                    </Badge>
                    {/* 檔案操作選單 */}
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
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: 實作編輯功能
                                console.log('編輯檔案:', file.name)
                              }}
                            >
                              <Icon as={LuPencil} color="blue.500" />
                              <Span>編輯</Span>
                            </Menu.Item>
                            <Menu.Item
                              value="delete"
                              color="fg.error"
                              _hover={{ bg: 'bg.error', color: 'fg.error' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                // TODO: 實作刪除功能
                                console.log('刪除檔案:', file.name)
                              }}
                            >
                              <Icon as={LuTrash2} color="red.500" />
                              <Span>刪除</Span>
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </HStack>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody py="2" px="3">
                    {file.sheets && file.sheets.length > 0 ? (
                      <VStack gap="2" alignItems="stretch">
                        {file.sheets.map((sheet) => (
                          <Box
                            key={sheet._id}
                            p="3"
                            borderRadius="md"
                            bg={sheetBg}
                            _hover={{ bg: sheetHoverBg, cursor: 'pointer' }}
                            transition="all 0.2s"
                          >
                            <HStack gap="2" mb="2">
                              <Icon as={LuSheet} fontSize="md" color="green.500" />
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                flex="1"
                                color={sheetTextColor}
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
                    ) : (
                      <Text fontSize="xs" color="gray.500" py="2">
                        此文件尚無表格
                      </Text>
                    )}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        )}
      </Box>
    </Box>
  )
}