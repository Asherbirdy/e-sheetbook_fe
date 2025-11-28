import { IconButton } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'

export const EditFileIcon = () => {
  return (
    <IconButton
      variant="ghost"
      size="sm"
      color="gray.500"
      _hover={{ bg: 'gray.100' }}
      aria-label="編輯檔案"
    >
      <LuPencil size={16} />
    </IconButton>
  )
}
