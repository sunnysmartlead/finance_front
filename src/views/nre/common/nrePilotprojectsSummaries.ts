import { LaboratoryFeeModel } from "../data.type"
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"

// 手板件费用合计
export interface LaboratoryFeeSummaryMethodProps<T = LaboratoryFeeModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

export const getLaboratoryFeeSummaries = (param: LaboratoryFeeSummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((_, index) => {
    if (index === 4) {
      sums[index] = "实验费合计"
      return
    }

    const values = data.map((item) =>
      Number((item.unitPrice || 0) * ((item.dataThoroughly || 0) + (item.dataDV || 0) + (item.dataPV || 0)))
    )
    if (!values.every((value) => Number.isNaN(value)) && index === 5) {
      sums[index] = `¥ ${values.reduce((prev, curr) => {
        if (!Number.isNaN(curr)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ""
    }
  })

  return sums
}
