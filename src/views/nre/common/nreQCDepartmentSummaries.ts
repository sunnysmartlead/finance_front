import { QADepartmentTestModel, QADepartmentQCModel } from "../data.type"
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"

// 手板件费用合计
export interface QaTestDepartmentsSummaryMethodProps<T = QADepartmentTestModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

// 其他费用合计
export interface QaqcDepartmentsSummaryMethodProps<T = QADepartmentQCModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

// 实验项目费用合计
export const getQaTestDepartmentsSummaries = (param: QaTestDepartmentsSummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
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

// 项目制程QC量检具费用合计
export const getQaqcDepartmentsSummaries = (param: QaqcDepartmentsSummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 3) {
      sums[index] = "项目制程QC量检具费用合计"
      return
    }

    const values = data.map((item) => Number((item.unitPrice || 0) * (item.count || 0)))
    if (!values.every((value) => Number.isNaN(value)) && index === 4) {
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
