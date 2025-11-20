import {
  Box, HStack, Icon, Text, VStack,
} from '@chakra-ui/react'
import { LuFile } from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'
import { FileMenu } from './FileMenu'

export const FileAccordion = () => {
  const { palette } = useColorMode()

  const { data: sheets, isLoading } = useQuery({
    queryKey: ['sheets'],
    queryFn: () => useSheetApi.get(),
  })

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
    <VStack gap="1" alignItems="stretch">
      {sheets?.data?.files.map((file) => (
        <Box
          key={file._id}
          py="3"
          px="3"
          borderRadius="md"
          _hover={{ bg: palette.hoverBg }}
          transition="all 0.2s"
        >
          <HStack gap="2">
            <Icon as={LuFile} fontSize="lg" color="blue.500" />
            <Text flex="1" fontWeight="medium" fontSize="sm">
              {file.name}
            </Text>
            <FileMenu file={file} />
          </HStack>
        </Box>
      ))}
    </VStack>
  )
}
