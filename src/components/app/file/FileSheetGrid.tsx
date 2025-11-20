import {
  Box, Grid, Icon, Text, VStack,
} from '@chakra-ui/react'
import { LuSheet, LuFile } from 'react-icons/lu'
import { useSheetApi } from '@/api'
import { useColorMode } from '@/hook'

interface FileSheetGridProps {
  fileId: string
}

export const FileSheetGrid = ({ fileId }: FileSheetGridProps) => {
  const { palette } = useColorMode()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['sheets', fileId],
    queryFn: () => useSheetApi.getSheetFromFile({ fileId }),
  })

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
          onClick={() => navigate(`/dashboard/sheet/${sheet._id}`)}
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
  )
}
