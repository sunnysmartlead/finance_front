import { LaboratoryFeeModel } from "../data.type"
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"
import { formatThousandths } from '@/utils/number'

// 手板件费用合计
export interface LaboratoryFeeSummaryMethodProps<T = LaboratoryFeeModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export const getLaboratoryFeeSummaries = (param: LaboratoryFeeSummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((_, index) => {
    if (index === 8) {
      sums[index] = "实验费合计"
      return
    }

    const values = data.map((item) => Number(item.allCost))
    if (!values.every((value) => Number.isNaN(value)) && index === 9) {
      const total = values.reduce((prev, curr) => {
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
