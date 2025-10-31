import {
  Box, CloseButton, Flex, Text, Accordion, Span, Badge, VStack, HStack, Icon,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useSheetApi } from '@/api'
import { LuFile, LuSheet } from 'react-icons/lu'
import dayjs from 'dayjs'
import { useColorMode } from '@/hook'

export const Sidebar = () => {

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
        {isLoading ? (
          <Text color="gray.500" fontSize="sm">載入中...</Text>) :
          sheets?.data?.files.length === 0 ? (
            <VStack gap="2" py="8">
              <Icon fontSize="3xl" color="gray.400">
                <LuFile />
              </Icon>
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
                      <Icon fontSize="lg" color="blue.500">
                        <LuFile />
                      </Icon>
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
                                <Icon fontSize="md" color="green.500">
                                  <LuSheet />
                                </Icon>
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