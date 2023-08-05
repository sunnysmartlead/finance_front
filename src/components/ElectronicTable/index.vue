<template>
  <div style="height: 400px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="fixedColumns"
          :header-height="[50, 40, 50]"
          :data="data"
          :width="width"
          :height="height"
          fixed
        >
          <template #header="props">
            <customized-header v-bind="props" />
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="tsx" setup>
import { computed, ref, unref, reactive, watch } from "vue"
import { ElCheckbox, TableV2Placeholder } from "element-plus"
import type { FunctionalComponent, PropType } from "vue"
import type { CheckboxValueType, Column, HeaderClassNameGetter, TableV2CustomizedHeaderSlotParam } from "element-plus"
import { DEFAULT_COLUMN } from "./const"

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const keyList: any = [
  "materialsUseCount",
  "systemiginalCurrency",
  "inTheRate",
  "iginalCurrency",
  "standardMoney",
  "rebateMoney"
]

const props = defineProps({
  data: {
    type: Array as PropType<any[]>
  },
  allColums: {
    type: Object as PropType<any>
  }
})

const data = computed(() => props.data)

console.log(data, "data")

const selectData = ref<any[]>([])

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({ value, intermediate = false, onChange }) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const CustomizedHeader: FunctionalComponent<TableV2CustomizedHeaderSlotParam> = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 2) return cells

  const groupCells = [] as typeof cells
  let width = 0
  let idx = 0

  columns.forEach((column, columnIndex) => {
    if (!keyList.includes(column.dataKey)) groupCells.push(cells[columnIndex])
    else {
      width += cells[columnIndex].props!.column.width

      const nextColumn = columns[columnIndex + 1]
      groupCells.push(
        <div
          class="flex items-center justify-center custom-header-cell"
          role="columnheader"
          style={{
            ...cells[columnIndex].props!.style,
            width: `${width}px`
          }}
        >
          Group width {width}
        </div>
      )
      width = 0
    }
  })
  return groupCells
}

const fixedColumns: Column<any>[] = [
  {
    key: "selection",
    width: 50,
    cellRenderer: ({ rowData }) => {
      const onChange = (value: CheckboxValueType) => (rowData.checked = value)
      return <SelectionCell value={rowData.checked} onChange={onChange} />
    },
    headerCellRenderer: () => {
      const _data = unref(props.data)
      const onChange = (value: CheckboxValueType) =>
        (selectData.value =
          _data?.map((row) => {
            row.checked = value
            return row
          }) || [])
      const allSelected = _data?.every((row) => row.checked) || false
      const containsChecked = _data?.some((row) => row.checked)

      return <SelectionCell value={allSelected} intermediate={containsChecked && !allSelected} onChange={onChange} />
    }
  },
  {
    key: "categoryName",
    title: "物料大类",
    dataKey: "categoryName",
    width: 80,
  },
  {
    key: "categoryName",
    title: "物料种类",
    dataKey: "categoryName",
    width: 80
  },
  {
    key: "sapItemNum",
    title: "物料编号",
    dataKey: "sapItemNum",
    width: 150
  },
  {
    key: "sapItemName",
    title: "材料名称",
    dataKey: "sapItemName",
    width: 250
  },
  {
    key: "assemblyQuantity",
    title: "装配数量",
    dataKey: "assemblyQuantity",
    width: 80
  },
  {
    key: "materialsUseCount",
    title: "项目物料的使用量",
    dataKey: "materialsUseCount",
    width: 120,
    headerHeight: []
  }
]
</script>
