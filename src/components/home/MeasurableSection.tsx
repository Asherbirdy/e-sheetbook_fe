import { FunctionComponent, ReactElement } from 'react'
import {
  Box, Grid, GridItem, Text, HStack, VStack,
} from '@chakra-ui/react'
import { LuTrendingUp, LuTrendingDown } from 'react-icons/lu'

interface StatCardProps {
  title: string
  value: string
  trend: string
  isPositive?: boolean
}

const StatCard: FunctionComponent<StatCardProps> = ({
  title,
  value,
  trend,
  isPositive = true,
}): ReactElement => {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <VStack align="start" gap={2}>
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" color="gray.600">
            {title}
          </Text>
          <HStack gap={1} color={isPositive ? 'green.500' : 'red.500'}>
            {isPositive ? <LuTrendingUp size={14} /> : <LuTrendingDown size={14} />}
            <Text fontSize="xs" fontWeight="medium">
              {trend}
            </Text>
          </HStack>
        </HStack>
        <Text fontSize="4xl" fontWeight="bold">
          {value}
        </Text>
      </VStack>
    </Box>
  )
}

const MeasurableSection: FunctionComponent = (): ReactElement => {
  return (
    <Box py={8} px={8}>
      <Text fontSize="3xl" fontWeight="bold" mb={6}>
        Measurable
      </Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {/* Team Total 主要卡片 */}
        <GridItem colSpan={1}>
          <Box
            bg="white" p={6} borderRadius="lg"
            borderWidth="1px" borderColor="gray.200"
          >
            <VStack align="start" gap={4}>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Team total
                </Text>
                <Box
                  h="2px" w="full" bg="blue.500"
                  borderRadius="full"
                />
              </Box>

              <HStack align="baseline">
                <Text fontSize="6xl" fontWeight="bold" lineHeight="1">
                  24%
                </Text>
              </HStack>

              <HStack gap={1} color="blue.500">
                <LuTrendingUp size={16} />
                <Text fontSize="sm" fontWeight="medium">
                  +5%
                </Text>
              </HStack>

              <Text fontSize="xs" color="gray.500" lineHeight="1.6">
                Regular surveys and events best way to grow team
                {' '}
                <Text as="span" color="blue.500" cursor="pointer">
                  Connection
                </Text>
                . It also helps us understand your team's needs and improve the accuracy of recommendations.
              </Text>
            </VStack>
          </Box>
        </GridItem>

        {/* 右側統計卡片 */}
        <GridItem colSpan={2}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <StatCard
              title="Chemistry" value="12%" trend="+24%"
              isPositive
            />
            <StatCard
              title="Recognition" value="20%" trend="+12%"
              isPositive
            />
            <StatCard
              title="Wellbeing" value="5%" trend="-4%"
              isPositive={false}
            />
            <StatCard
              title="Engagement" value="24%" trend="+10%"
              isPositive
            />
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default MeasurableSection
