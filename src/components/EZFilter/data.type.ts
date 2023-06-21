import { HtmlHTMLAttributes } from "vue"
import type { DatePickType } from "element-plus"

/**
 * 筛选项枚举
 */
export interface EnumDataProps {
  label: string
  role?: string
  key: string
  options?: Record<string, unknown>[]
  dom?: HtmlHTMLAttributes
  placeholder?: string
  dateType?: DatePickType
  [x: string]: any
}
