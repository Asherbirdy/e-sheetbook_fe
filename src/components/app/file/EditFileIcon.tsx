import { IconButton } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import { GetFile } from '@/types'
import { useFileApi } from '@/api/useFileApi'
import { toaster } from '@/components/ui/toaster'
import EditFileDialog from './EditFileDialog'

interface EditFileIconProps {
  file: GetFile
}

export const EditFileIcon = ({ file }: EditFileIconProps) => {
  const open = useSignal(false)
  const queryClient = useQueryClient()

  const editMutation = useMutation({
    mutationFn: ({ name, fileId }: { name: string; fileId: string }) =>
      useFileApi.edit({ name, fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      open.value = false
      toaster.success({
        title: '成功',
        description: '檔案已更新',
      })
    },
    onError: () => {
      toaster.error({
        title: '錯誤',
        description: '更新檔案失敗',
      })
    },
  })

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        color="gray.500"
        _hover={{ bg: 'gray.100' }}
        aria-label="編輯檔案"
        onClick={(e) => {
          e.stopPropagation()
          open.value = true
        }}
      >
        <LuPencil size={16} />
      </IconButton>

      <EditFileDialog
        open={open.value}
        file={file}
        onClose={() => { open.value = false }}
        onSubmit={(name, fileId) => editMutation.mutate({ name, fileId })}
        isLoading={editMutation.isPending}
      />
    </>
  )
}
