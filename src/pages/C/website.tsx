import {
  Box, Grid, Heading, HStack, Text, Spinner, Center, EmptyState, Badge,
} from '@chakra-ui/react'
import { LuGlobe } from 'react-icons/lu'
import { useWebsiteApi } from '@/api/useWebsiteApi'
import { useQuery } from '@tanstack/react-query'

const WebsitePage = () => {
  // 取得所有網站
  const websitesQuery = useQuery({
    queryKey: ['websites'],
    queryFn: async () => {
      const response = await useWebsiteApi.getAll()
      return response.data
    },
  })

  // 載入中狀態
  if (websitesQuery.isLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    )
  }

  // 錯誤狀態
  if (websitesQuery.isError) {
    return (
      <Center h="400px">
        <Text color="red.500">載入網站時發生錯誤</Text>
      </Center>
    )
  }

  const websites = websitesQuery.data?.websites || []

  return (
    <Box>
      {/* 標題列 */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">我的網站</Heading>
        {/* <CreateWebsiteButton /> TODO: Add create button if needed */}
      </HStack>

      {/* 網站列表 */}
      {websites.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuGlobe size={48} />
            </EmptyState.Indicator>
            <EmptyState.Title>尚無網站</EmptyState.Title>
            <EmptyState.Description>
              目前沒有任何網站資料
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={6}
        >
          {websites.map((website) => (
            <Box
              key={website._id}
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              bg="white"
              border="1px"
              borderColor="gray.200"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'lg',
                borderColor: 'gray.300',
              }}
              transition="all 0.2s"
              cursor="pointer"
              p={6}
            >
              <HStack justify="space-between" mb={4} align="start">
                <Box
                  p={3}
                  bg="blue.50"
                  borderRadius="lg"
                  color="blue.500"
                >
                  <LuGlobe size={24} />
                </Box>
                <Badge
                  colorPalette={website.websiteStatus === 'active' ? 'green' : 'gray'}
                >
                  {website.websiteStatus}
                </Badge>
              </HStack>

              <Text
                fontSize="lg"
                fontWeight="semibold"
                color="gray.700"
                mb={1}
                truncate
              >
                {website.googleSheetName || '未命名網站'}
              </Text>

              <Text fontSize="sm" color="gray.500" truncate>
                {website.sheetName || '無 Sheet 名稱'}
              </Text>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default WebsitePage
