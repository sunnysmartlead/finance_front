import { MouldInventoryModel } from "../data.type"
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"
import { formatThousandths } from '@/utils/number'

// 手板件费用合计
export interface MouldSummaryMethodProps<T = MouldInventoryModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export const getMouldSummaries = (
  param: MouldSummaryMethodProps,
  name?: string,
  key?: string | null,
  key2?: string,
  currentIndex?: number,
) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((_, index) => {
    if (index === (currentIndex || 1)) {
      sums[index] = `${name || "模具费"}合计`
      return
    }
    let values: any[] = []
    if (key) {
      values = data?.map((item: any) => item[key])
    } else if (key2) {
      values = data?.map((item: any) => Number((item[key2] || 0) * (item.unitPrice || 0)))
    } else {
      values = data?.map((item) => Number((item.count || 0) * (item.unitPrice || 0)))
    }
    if (!values?.every((value) => Number.isNaN(value)) && index === (currentIndex && currentIndex > 1 ? currentIndex + 1 : 2)) {
      const total = values?.reduce((prev, curr) => {
        if (!Number.isNaN(curr)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
      sums[index] = `¥ ${formatThousandths(null, null, total)}`
    } else {
      sums[index] = ""
    }
  })

  return sums
}
