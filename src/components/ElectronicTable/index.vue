<template>
  <div style="height: 400px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" fixed />
      </template>
    </el-auto-resizer>
  </div>
</template>

<script lang="tsx" setup>
import { computed, ref, unref, reactive, watch } from "vue"
import { ElCheckbox } from "element-plus"
import type { FunctionalComponent, PropType } from "vue"
import type { CheckboxValueType, Column } from "element-plus"
import { DEFAULT_COLUMN } from "./const"

const props = defineProps({
  data: {
    type: Array as PropType<any[]>
  }
})

const data = computed(() => props.data)

const selectData = ref<any[]>([])

type SelectionCellProps = {
  value: boolean
  intermediate?: boolean
  onChange: (value: CheckboxValueType) => void
}

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({ value, intermediate = false, onChange }) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const columns: Column<any>[] = [
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
    width: 80
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
    width: 150,
    cellRenderer: ({ cellData: sapItemNum }) => <div style="padding: 10px 0;">{sapItemNum}</div>
  },
  {
    key: "sapItemName",
    title: "材料名称",
    dataKey: "sapItemName",
    width: 250,
    cellRenderer: ({ cellData: sapItemName }) => <div style="padding: 10px 0;">{sapItemName}</div>
  },
  {
    key: "assemblyQuantity",
    title: "装配数量",
    dataKey: "assemblyQuantity",
    width: 80
  }
]
</script>
