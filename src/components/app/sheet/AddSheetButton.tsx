import { Button } from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import CreateSheetDialog from './CreateSheetDialog'
import { useSheetApi } from '@/api/useSheetApi'
import { toaster } from '@/components/ui/toaster'

interface AddSheetButtonProps {
  fileId: string
  onSuccess?: () => void
}

export const AddSheetButton = ({
  fileId, onSuccess,
}: AddSheetButtonProps) => {
  const queryClient = useQueryClient()
  const createDialog = useSignal(false)

  // 新增 Sheet Mutation
  const createSheetMutation = useMutation({
    mutationFn: async ({
      name, url,
    }: { name: string, url: string }) => {
      return useSheetApi.create({
        name,
        url,
        fileId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets', fileId] })
      createDialog.value = false
      toaster.create({
        title: '新增成功',
        description: '試算表已成功新增',
        type: 'success',
      })
      onSuccess?.()
    },
    onError: () => {
      toaster.create({
        title: '新增失敗',
        description: '試算表新增失敗,請稍後再試',
        type: 'error',
      })
    },
  })

  // 處理新增提交
  const handleCreateSubmit = (name: string, url: string) => {
    createSheetMutation.mutate({
      name, url,
    })
  }

  return (
    <>
      <Button
        variant="outline"
        colorPalette="gray"
        onClick={() => { createDialog.value = true }}
      >
        <LuPlus />
        新增試算表
      </Button>

      {/* 新增對話框 */}
      <CreateSheetDialog
        open={createDialog.value}
        onClose={() => { createDialog.value = false }}
        onSubmit={handleCreateSubmit}
        isLoading={createSheetMutation.isPending}
      />
    </>
  )
}
