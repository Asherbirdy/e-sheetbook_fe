import { IconButton } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'

export const EditSheetIcon = () => {
  return (
    <IconButton
      variant="ghost"
      size="sm"
      color="gray.600"
      _hover={{ bg: 'gray.100' }}
      aria-label="編輯試算表"
    >
      <LuPencil size={16} />
    </IconButton>
  )
}
