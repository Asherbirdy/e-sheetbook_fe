import {
  Box, CloseButton, Flex, Text, Accordion, Button, Span, AbsoluteCenter,
} from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'

export const SidebarFileContent = () => {

  const items = [
    {
      value: 'a', title: 'First Item', text: 'asdasdsa',
    },
    {
      value: 'b', title: 'Second Item', text: 'asdasdsa',
    },
    {
      value: 'c', title: 'Third Item', text: 'asdasdsa',
    },
  ]
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
      <Accordion.Root
        spaceY="4" variant="plain" collapsible
        defaultValue={['b']}
      >
        {items.map((item, index) => (
          <Accordion.Item key={index} value={item.value}>
            <Box position="relative">
              <Accordion.ItemTrigger>
                <Span flex="1">{item.title}</Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <AbsoluteCenter axis="vertical" insetEnd="0">
                <Button variant="subtle" colorPalette="blue">
                  loading
                </Button>
              </AbsoluteCenter>
            </Box>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Box>
  )
}