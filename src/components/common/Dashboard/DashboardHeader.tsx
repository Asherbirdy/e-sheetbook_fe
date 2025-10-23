import {
  Flex, IconButton, Text, HStack, VStack, Box, FlexProps,
} from '@chakra-ui/react'
import {
  FiMenu, FiBell, FiChevronDown,
} from 'react-icons/fi'
import { useColorModeValue } from '@/components/ui/color-mode'
import { Avatar } from '@/components/ui/avatar'

interface MobileProps extends FlexProps {
  onOpen: () => void
}

export const DashboardHeader = ({
  onOpen, ...rest
}: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0 }}
      px={{
        base: 4,
        md: 4,
      }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{
        base: 'space-between',
        md: 'flex-end',
      }}
      {...rest}
    >
      <IconButton
        display={{
          base: 'flex',
          md: 'none',
        }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
      >
        <FiMenu />
      </IconButton>

      <Text
        display={{
          base: 'flex',
          md: 'none',
        }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack
        gap={{
          base: '0',
          md: '6',
        }}
      >
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
        >
          <FiBell />
        </IconButton>
        <Flex alignItems={'center'}>
          <HStack
            py={2}
            transition="all 0.3s"
            cursor="pointer"
          >
            <Avatar
              size={'sm'}
              src={
                'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
              }
            />
            <VStack
              display={{
                base: 'none',
                md: 'flex',
              }}
              alignItems="flex-start"
              gap="1px"
              ml="2"
            >
              <Text fontSize="sm">Justina Clark</Text>
              <Text
                fontSize="xs"
                color="gray.600"
              >
                Admin
              </Text>
            </VStack>
            <Box
              display={{
                base: 'none',
                md: 'flex',
              }}
            >
              <FiChevronDown />
            </Box>
          </HStack>
        </Flex>
      </HStack>
    </Flex>
  )
}