import { IconButton } from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { Sheet } from '@/types'
import { DeleteSheetAlert } from '@/components'
import { useSheetApi } from '@/api/useSheetApi'
import { toaster } from '@/components/ui/toaster'

interface DeleteSheetIconProps {
  sheet: Sheet
  fileId: string
  onSuccess?: () => void
}

export const DeleteSheetIcon = ({
  sheet, fileId, onSuccess,
}: DeleteSheetIconProps) => {
  const queryClient = useQueryClient()
  const deleteAlert = useSignal(false)

  // 刪除 Sheet Mutation
  const deleteSheetMutation = useMutation({
    mutationFn: async (sheetId: string) => {
      return useSheetApi.delete({ sheetId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
      deleteAlert.value = false
      toaster.create({
        title: '刪除成功',
        description: '試算表已成功刪除',
        type: 'success',
      })
      onSuccess?.()
    },
    onError: () => {
      toaster.create({
        title: '刪除失敗',
        description: '試算表刪除失敗,請稍後再試',
        type: 'error',
      })
    },
  })

  // 處理刪除確認
  const handleDeleteConfirm = (sheetId: string) => {
    deleteSheetMutation.mutate(sheetId)
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.600"
        _hover={{ bg: 'red.50', color: 'red.500' }}
        onClick={(e) => {
          e.stopPropagation()
          deleteAlert.value = true
        }}
        aria-label="刪除試算表"
      >
        <LuTrash2 size={16} />
      </IconButton>

      {/* 刪除警告對話框 */}
      <DeleteSheetAlert
        open={deleteAlert.value}
        sheet={sheet}
        onClose={() => { deleteAlert.value = false }}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSheetMutation.isPending}
      />
    </>
  )
}
