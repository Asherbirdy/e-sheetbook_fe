import {
  Box, CloseButton, Flex, Text, Accordion, Span,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'
import { useQuery } from '@tanstack/react-query'
import { useFileApi } from '@/api'

export const SidebarFileContent = () => {

  const { data: files, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => useFileApi.get(),
  })

  const fileList = files?.data?.file || []

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
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

      <Box px="4" py="2">
        {isLoading ? (
          <Text color="gray.500">載入中...</Text>
        ) : fileList.length === 0 ? (
          <Text color="gray.500">尚無文件</Text>
        ) : (
          <Accordion.Root
            collapsible
            variant="enclosed"
          >
            {fileList.map((file) => (
              <Accordion.Item key={file._id} value={file._id}>
                <Accordion.ItemTrigger>
                  <Span flex="1" fontWeight="medium">
                    {file.name}
                  </Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    <Flex direction="column" gap="2">
                      <Text fontSize="sm" color="gray.600">
                        檔案 ID:
                        {' '}
                        {file._id}
                      </Text>
                    </Flex>
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