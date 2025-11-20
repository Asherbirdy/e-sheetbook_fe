import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layout'

const FileIdPage = () => {
  const { fileId } = useParams<{ fileId: string }>()
  return (
    <>
      <DashboardLayout>

        <div>
          File ID:
          {fileId}
        </div>
      </DashboardLayout>
    </>
  )
}

export default FileIdPage