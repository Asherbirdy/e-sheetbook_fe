import { IconButton } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { Sheet } from '@/types'
import { EditSheetDialog } from '@/components'
import { useSheetApi } from '@/api/useSheetApi'
import { toaster } from '@/components/ui/toaster'

interface EditSheetIconProps {
  sheet: Sheet
  fileId: string
  onSuccess?: () => void
}

export const EditSheetIcon = ({
  sheet, fileId, onSuccess,
}: EditSheetIconProps) => {
  const queryClient = useQueryClient()
  const editDialog = useSignal(false)

  // 編輯 Sheet Mutation
  const editSheetMutation = useMutation({
    mutationFn: async ({
      name, url, sheetId,
    }: { name: string, url: string, sheetId: string }) => {
      return useSheetApi.edit({
        name,
        url,
        api: [],
        fileId,
        sheetId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
      editDialog.value = false
      toaster.create({
        title: '更新成功',
        description: '試算表已成功更新',
        type: 'success',
      })
      onSuccess?.()
    },
    onError: () => {
      toaster.create({
        title: '更新失敗',
        description: '試算表更新失敗,請稍後再試',
        type: 'error',
      })
    },
  })

  // 處理編輯提交
  const handleEditSubmit = (name: string, url: string, sheetId: string) => {
    editSheetMutation.mutate({
      name, url, sheetId,
    })
  }

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.600"
        _hover={{ bg: 'gray.100' }}
        onClick={(e) => {
          e.stopPropagation()
          editDialog.value = true
        }}
        aria-label="編輯試算表"
      >
        <LuPencil size={16} />
      </IconButton>

      {/* 編輯對話框 */}
      <EditSheetDialog
        open={editDialog.value}
        sheet={sheet}
        onClose={() => { editDialog.value = false }}
        onSubmit={handleEditSubmit}
        isLoading={editSheetMutation.isPending}
      />
    </>
  )
}
