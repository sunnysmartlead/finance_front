<template>
  <div>
    <el-card header="作业价格" m="2">
      <el-row wrap="false" justify="space-between">
        <span>作业价格</span>
        <el-row>
          <el-button m="2" type="primary" @click="handleAddYear">新增年</el-button>
          <el-button m="2" type="primary" @click="submit">提交</el-button>
        </el-row>
      </el-row>
      <el-table :data="tableData" height="50vh" style="width: 100%; margin-top: 25px" border>
        <el-table-column label="年份" prop="year" />
        <el-table-column label="直接其他费用作业价格" prop="directManufacturingRate" />
        <el-table-column label="间接人工作业价格" prop="indirectLaborRate" />
        <el-table-column label="间接折旧作业价格" prop="indirectDepreciationRate" />
        <el-table-column label="间接其他费用作业价格" prop="indirectManufacturingRate" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ $index, row }">
            <el-button @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="visibleData" title="作业价格" @close="handleCancel(formRef)">
      <el-form ref="formRef" label-width="180px" inline :model="formData" status-icon>
        <el-form-item label="年份" prop="year">
          <el-input v-model="formData.year" readonly />
        </el-form-item>
        <el-form-item label="直接其他费用作业价格" prop="directManufacturingRate">
          <el-input controls-position="right" v-model="formData.directManufacturingRate" />
        </el-form-item>
        <el-form-item label="间接人工作业价格" prop="indirectLaborRate">
          <el-input-number controls-position="right" :min="0" v-model="formData.indirectLaborRate" />
        </el-form-item>
        <el-form-item label="间接折旧作业价格" prop="indirectDepreciationRate">
          <el-input-number controls-position="right" :min="0" v-model="formData.indirectDepreciationRate" />
        </el-form-item>
        <el-form-item label="间接其他费用作业价格" prop="indirectManufacturingRate">
          <el-input-number controls-position="right" :min="0" v-model="formData.indirectManufacturingRate" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-row justify="end">
          <el-button @click="handleCancel(formRef)"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </el-row>
      </template>
    </el-dialog>
    <LogList m="2" :type="16" ref="logListRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watchEffect, reactive } from "vue"
import { GetRateEntry, SaveRateEntryInput, ModifyRateEntryInput, DelRateEntryInput } from "./service"
import { RateEntryInfo } from "./data.type"
import { ElMessage, ElMessageBox } from "element-plus"
import LogList, { LogListAPI } from "@/components/LogList/index.vue"
import { cloneDeep, map } from "lodash"
import type { FormInstance } from 'element-plus'

/**
 * 数据部分
 */
const tableData = ref<RateEntryInfo[]>([])
const logListRef = ref<LogListAPI | null>(null)
const visibleData = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<any>({
  directManufacturingRate: 0,
  indirectLaborRate: 0,
  indirectDepreciationRate: 0,
  indirectManufacturingRate: 0,
  year: 0
})

const handleCancel = (formEl: FormInstance | undefined) => {
  formEl?.resetFields()
  visibleData.value = false
}

// 新增年
const handleAddYear = () => {
  visibleData.value = true
  isEdit.value = false
  const len = tableData.value.length
  let newYear = new Date().getFullYear()
  if (len) {
    newYear = (tableData.value[len - 1].year || 0) + 1
  }
  setTimeout(() => {
    formData.year = newYear
  }, 50)
}

const handleEdit = (row: any) => {
  isEdit.value = true
  visibleData.value = true
  setTimeout(() => {
    map(cloneDeep(row), (val, key) => {
      formData[key] = val
    })
  }, 50)
}

const handleModify = async () => {
  const { success } = await ModifyRateEntryInput({
    ...formData
  })
  if (success) {
    logListRef.value?.onRefresh()
    initFetch()
    visibleData.value = false
    ElMessage.success('修改成功！')
  }
}

const handleSubmit = () => {
  isEdit ? handleModify() : submit()
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})

onMounted(() => {
  initFetch()
})

const handleDelete = async (id: number) => {
  ElMessageBox.confirm(
    '请确认要删除该项数据嘛?',
    '请谨慎操作！',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const { success } = await DelRateEntryInput({ id })
      if (success) {
        initFetch()
        logListRef.value?.onRefresh()
        ElMessage.success('删除成功！')
      }
    })

}

watchEffect(() => { })

const initFetch = async () => {
  try {
    const { success, result } = await GetRateEntry()
    if (!success) throw Error()
    if (result.length > 0) {
      tableData.value = result || []
    } else {
      tableData.value.push({
        directManufacturingRate: 0,
        indirectLaborRate: 0,
        indirectDepreciationRate: 0,
        indirectManufacturingRate: 0,
        year: new Date().getFullYear()
      })
    }
  } catch (err: any) {
    console.log("[GetRateEntry Error]", err)
  }
}

const submit = async () => {
  const { success } = await SaveRateEntryInput({
    ...formData
  })
  if (success) {
    initFetch()
    logListRef.value?.onRefresh()
    ElMessage.success("新增成功")
    visibleData.value = false
  }
}
</script>
<style scoped lang="scss"></style>
