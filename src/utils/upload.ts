import { ElLoading, ElMessage } from "element-plus"

export const handleGetUploadProgress = (event: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在上传中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  if (event.percent === 100) {
    loading.close()
  }
}

export const handleUploadError = () => {
  ElMessage.error("上传失败")
}

// NRE实验费模板上传失败
export const handleUploadTemplateError = async (error: Error) => {
  try {
    const errorMessage: any = JSON.parse(error.message)
    ElMessage.error(errorMessage.error.message)
  } catch (error) {
    ElMessage.error("上传失败")
  }
}
