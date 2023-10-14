import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"
import { formatThousandths } from '@/utils/number'

// 损耗成本合计
export interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export const getSummaries = (param: SummaryMethodProps, name?: string, key?: string | null) => {
  const { columns, data } = param
  const sums: string[] = []

  columns.forEach((_, index) => {
    if (index === 1) {
      sums[index] = `${name || "损耗成本"}合计`
      return
    }
    let values: any[] = []
    console.log(values, "getSummaries111")
    if (key) {
      values = data.map((item: any) => Number(item[key]?.toFixed(2)) || 0)

    }
    if (!values.every((value) => Number.isNaN(value)) && index === 2) {
      const money = values.reduce((prev, curr) => {
        if (!Number.isNaN(curr)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
      sums[index] = `¥ ${formatThousandths(null,null, money)}`
    } else {
      sums[index] = ""
    }
  })

  return sums
}
