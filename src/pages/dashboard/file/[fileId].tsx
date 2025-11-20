import { Box, Heading } from '@chakra-ui/react'
import { DashboardLayout } from '@/layout'
import { FileSheetGrid } from '@/components'

const FileIdPage = () => {
  const { fileId } = useParams<{ fileId: string }>()

  if (!fileId) {
    return null
  }

  return (
    <DashboardLayout>
      <Box p="6">
        <Heading size="lg" mb="6">
          表格列表
        </Heading>
        <FileSheetGrid fileId={fileId} />
      </Box>
    </DashboardLayout>
  )
}

export default FileIdPage