import { HandPieceCostModel, RestsCostModel } from "../data.type"
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"

// 手板件费用合计
export interface HandPieceSummaryMethodProps<T = HandPieceCostModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

// 其他费用合计
export interface RestsCostSummaryMethodProps<T = RestsCostModel> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

// 手板件费用合计
export const getHandPieceCostSummaries = (param: HandPieceSummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 4) {
      sums[index] = "手板件总费用"
      return
    }

    const values = data.map((item) => Number((item.quantity || 0) * (item.unitPrice || 0)))
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

// 其他费用
export const getOtherCostSummaries = (param: RestsCostSummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 1) {
      sums[index] = "其他费用合计"
      return
    }

    const values = data.map((item) => Number(item.cost))
    if (!values.every((value) => Number.isNaN(value)) && index === 2) {
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

// 差旅费
export const getTravelCostSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: any, index: any) => {
    if (index === 2) {
      sums[index] = "费用合计/天"
      return
    }
    if (index === 4) {
      sums[index] = "费用合计"
      return
    }
    const values = data.map((item: any) => Number(item.costSky))
    if (!values.every((value: any) => Number.isNaN(value)) && index === 3) {
      sums[index] = `¥ ${values.reduce((prev: any, curr: any) => {
        if (!Number.isNaN(curr)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    }
    const valuesC = data.map((item: any) => Number(item.cost))
    if (!valuesC.every((value: any) => Number.isNaN(value)) && index === 5) {
      sums[index] = `¥ ${valuesC.reduce((prev: any, curr: any) => {
        if (!Number.isNaN(curr)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    }
  })

  return sums
}
