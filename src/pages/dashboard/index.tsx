import { Box, Heading } from '@chakra-ui/react'
import { DashboardLayout } from '@/layout'
import { useAuthApi, useUserApi } from '@/api'
import { useQuery } from '@tanstack/react-query'

const DashboardMain = () => {

  const { data: userInfo } = useQuery({
    queryKey: ['user'],
    queryFn: () => useUserApi.showCurrent(),
  })
  return (
    <DashboardLayout>
      <Box>
        <Heading>Dashboard Home</Heading>
        <div>Dashboard Main Content</div>
        {userInfo?.data && <div>{userInfo.data.msg}</div>}
        {!userInfo?.data && <div>loading...</div>}
      </Box>
    </DashboardLayout>
  )
}

export default DashboardMain
