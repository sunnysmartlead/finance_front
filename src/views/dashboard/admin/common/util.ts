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
