const FileIdPage = () => {
  const { fileId } = useParams<{ fileId: string }>()
  return (
    <>
      <div>
        File ID:
        {fileId}
      </div>
    </>
  )
}

export default FileIdPage