import { useParams } from 'react-router-dom'

const FileIdPage = () => {
  const { fileId } = useParams()

  return (
    <div>
      <h1>File ID Page</h1>
      <p>
        File ID:
        {fileId}
      </p>
    </div>
  )
}

export default FileIdPage