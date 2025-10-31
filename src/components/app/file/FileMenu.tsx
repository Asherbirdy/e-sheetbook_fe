import { GetSheetFile } from '@/types'
import {
  Box, Icon, Menu, Portal, Span,
} from '@chakra-ui/react'
import {
  LuEllipsis, LuPencil, LuTrash2,
} from 'react-icons/lu'

interface FileMenuProps {
  file: GetSheetFile
}

export const FileMenu = ({ file }: FileMenuProps) => {
  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w="6"
          h="6"
          borderRadius="md"
          cursor="pointer"
          color="gray.600"
          _hover={{ bg: 'gray.100', color: 'gray.800' }}
          transition="all 0.2s"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon as={LuEllipsis} fontSize="sm" />
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="120px">
            <Menu.Item
              value="edit"
              onClick={(e) => {
                e.stopPropagation()
                console.log('�/�H:', file.name)
              }}
            >
              <Icon as={LuPencil} color="blue.500" />
              <Span>Edit</Span>
            </Menu.Item>
            <Menu.Item
              value="delete"
              color="fg.error"
              _hover={{ bg: 'bg.error', color: 'fg.error' }}
              onClick={(e) => {
                e.stopPropagation()
                console.log('*d�H:', file.name)
              }}
            >
              <Icon as={LuTrash2} color="red.500" />
              <Span>Delete</Span>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
