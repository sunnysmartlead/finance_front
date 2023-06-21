import dayjs from "dayjs"

/** 格式化时间 */
export const formatDateTime = (time: any) => {
  if (time == null || time === "") {
    return "N/A"
  }
  const date = new Date(time)
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}

/** 格式化时间 */
export const formatDateTimeDLY = (time: any,DLY:string) => {
  if (time == null || time === "") {
    return "N/A"
  }
  const date = new Date(time)
  return dayjs(date).format(DLY)
}
/** 下载excel */
export const downloadFileExcel = (res: any, fileName: string) => {
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    const url = URL.createObjectURL(new Blob([blob]))
    const a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = `${fileName}.xlsx`
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}
export const downloadFileZip = (res: any, fileName: string) => {
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    const url = URL.createObjectURL(new Blob([blob]))
    const a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = `${fileName}.zip`
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}

// 获取参数
export function getQueryParam(key: string) {
  if (!key) {
    return false
  }

  let value = ""
  const paramStr = window.location.search ? window.location.search.substr(1) : ""

  if (paramStr) {
    paramStr.split("&").forEach(function (param) {
      const arr = param.split("=")
      if (arr[0] == key) {
        value = arr[1]
      }
    })
  }

  return value
}
