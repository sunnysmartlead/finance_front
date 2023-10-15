import { formatThousandths, formatThousandthsNoFixed } from '@/utils/number'
import { sortBy } from 'lodash'

/**
 * @param value 数字值
 */
export function bigNumberTransform(val: any) {
  const newValue: any[] = ["", "", ""]
  const fr = 1000
  // let num = 3
  const value = Math.abs(val)
  if (value >= 1000) {
    // 千
    newValue[0] = `${Math.floor(value / fr)} `
    newValue[1] = "K"
  } else {
    newValue[0] = value + ""
    newValue[1] = ""
  }
  if (val < 0) return "-" + newValue.join("")
  return newValue.join("")
}

export const getEditTotal = (originArr: any[], editArr: any[], key: string) => {
  const originLen = originArr.length
  if (!originLen) {
    return 0
  }
  let total = 0
  originArr.forEach((item: any) => {
    const findData = editArr?.find(c => c.editId === item.editId)
    if (findData) {
      total += findData[key]
    } else total += Number(item[key])
  })
  return formatThousandths(null,null,total)
}
