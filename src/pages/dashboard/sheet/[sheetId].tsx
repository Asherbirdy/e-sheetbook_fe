import {
  Box, Container, Heading, Text,
} from '@chakra-ui/react'

const SheetPage = () => {
  // 從 URL 中獲取 sheetId 參數
  const { sheetId } = useParams<{ sheetId: string }>()

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>
        表格頁面:
        {' '}
        {sheetId}
      </Heading>
      <Box>
        <Text>表格內容將顯示在這裡</Text>
      </Box>
    </Container>
  )
}

export default SheetPage
