import { FunctionComponent, ReactElement } from 'react'
import {
  Box, HStack, Text, Image, VStack, IconButton,
} from '@chakra-ui/react'
import {
  LuChevronLeft, LuChevronRight, LuCalendar, LuHourglass,
} from 'react-icons/lu'

interface CalendarEventProps {
  date: string
  day: string
  image: string
  icon?: 'calendar' | 'hourglass'
}

const CalendarEvent: FunctionComponent<CalendarEventProps> = ({
  date,
  day,
  image,
  icon = 'calendar',
}): ReactElement => {
  return (
    <Box
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      w="200px"
      h="200px"
      flexShrink={0}
    >
      <Image
        src={image}
        alt={`Event on ${date}`}
        w="full"
        h="full"
        objectFit="cover"
      />
      {/* 疊加遮罩 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bg="blackAlpha.400"
      />
      {/* 日期資訊 */}
      <VStack
        position="absolute"
        top={4}
        left={4}
        align="start"
        color="white"
        gap={0}
      >
        <HStack
          gap={2} bg="blackAlpha.600" px={2}
          py={1} borderRadius="md"
        >
          {icon === 'calendar' ? <LuCalendar size={16} /> : <LuHourglass size={16} />}
          <Text fontSize="sm" fontWeight="medium">
            {date}
          </Text>
        </HStack>
        <Text fontSize="xs" mt={1} ml={2}>
          {day}
        </Text>
      </VStack>
    </Box>
  )
}

const TeamCalendar: FunctionComponent = (): ReactElement => {
  return (
    <Box py={8} px={8}>
      <HStack justify="space-between" mb={6}>
        <Text fontSize="3xl" fontWeight="bold">
          Team calendar
        </Text>
        <HStack gap={2}>
          <IconButton
            aria-label="Previous"
            variant="ghost"
            size="sm"
            borderRadius="full"
          >
            <LuChevronLeft />
          </IconButton>
          <IconButton
            aria-label="Next"
            variant="ghost"
            size="sm"
            borderRadius="full"
          >
            <LuChevronRight />
          </IconButton>
        </HStack>
      </HStack>

      {/* 日期範圍 */}
      <Text fontSize="md" color="gray.700" mb={4}>
        August 22 – August 28
      </Text>

      {/* 行事曆卡片 */}
      <HStack gap={4} overflowX="auto" pb={4}>
        <CalendarEvent
          date="22"
          day="Mon"
          image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400"
          icon="calendar"
        />
        <CalendarEvent
          date="24"
          day="Thu"
          image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
          icon="calendar"
        />
        <CalendarEvent
          date="25"
          day="Thu"
          image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
          icon="hourglass"
        />
      </HStack>
    </Box>
  )
}

export default TeamCalendar
