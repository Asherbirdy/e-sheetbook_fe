import { Box, Heading } from '@chakra-ui/react'

import { useUserApi } from '@/api'
import { useQuery } from '@tanstack/react-query'

const DashboardMain = () => {

  const { data: userInfo } = useQuery({
    queryKey: ['user'],
    queryFn: () => useUserApi.showCurrent(),
  })

  return (
    <>
      <Box>
        <Heading>Dashboard Home</Heading>
        <div>Dashboard Main Content</div>
        {userInfo?.data && <pre>{JSON.stringify(userInfo.data, null, 2)}</pre>}
        {!userInfo?.data && <div>loading...</div>}
      </Box>
    </>
  )
}

export default DashboardMain
