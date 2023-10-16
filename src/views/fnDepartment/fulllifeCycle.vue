<template>
  <div>
    <el-card class="card">
      <template #header>
        <el-row wrap="false" justify="space-between">
          <span>制造成本计算-参数</span>
          <el-row>
            <el-button m="2" type="primary" @click="handleAddYear">新增年</el-button>
            <el-button m="2" type="primary" @click="submit">提交</el-button>
          </el-row>
        </el-row>
      </template>
      <el-table :data="data.tableData" height="50vh" style="width: 100%; margin-top: 25px" border>
        <el-table-column label="年份Sop" prop="year" width="180" />
        <el-table-column label="月工作天数" width="180" prop="monthlyWorkingDays">
        </el-table-column>
        <el-table-column label="人员平均工资" width="180" prop="averageWage">
        </el-table-column>
        <el-table-column label="每班正常工作时间" width="180" prop="workingHours">
        </el-table-column>
        <el-table-column label="嫁动率" width="180" prop="rateOfMobilization">
        </el-table-column>
        <el-table-column label="折旧年限" width="180" prop="usefulLifeOfFixedAssets">
        </el-table-column>
        <el-table-column label="每日班次" width="180" prop="dailyShift">
        </el-table-column>
        <el-table-column label="增值税率" width="180" prop="vatRate">
        </el-table-column>
        <el-table-column label="人均跟线数量" width="180" prop="traceLineOfPerson">
        </el-table-column>
        <el-table-column label="GP12工序成本(元/pcs)" width="180">
        </el-table-column>
        <el-table-column label="产能利用率" width="180">
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <LogList :type="15" ref="logListRef" />
    <el-dialog v-model="visible" title="制造成本计算-参数" @close="handleCancel(formRef)">
      <el-form ref="formRef" inline :model="formData" status-icon>
        <el-form-item label="年份Sop" prop="year" width="180" >
          <el-input-number readonly v-model="formData.year" />
        </el-form-item>
        <el-form-item label="月工作天数" width="180" prop="monthlyWorkingDays">
          <el-input-number controls-position="right" v-model="formData.monthlyWorkingDays" />
        </el-form-item>
        <el-form-item label="人员平均工资" width="180" prop="averageWage">
          <el-input-number controls-position="right" v-model="formData.averageWage" />
        </el-form-item>
        <el-form-item label="每班正常工作时间" width="180" prop="workingHours">
          <el-input-number controls-position="right" v-model="formData.workingHours" />
        </el-form-item>
        <el-form-item label="嫁动率" width="180" prop="rateOfMobilization">
          <el-input type="number" v-model="formData.rateOfMobilization">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="折旧年限" width="180" prop="usefulLifeOfFixedAssets">
          <el-input-number controls-position="right" :min="0" v-model="formData.usefulLifeOfFixedAssets" />

        </el-form-item>
        <el-form-item label="每日班次" width="180" prop="dailyShift">
          <el-input-number controls-position="right" :min="0" v-model="formData.dailyShift" />

        </el-form-item>
        <el-form-item label="增值税率" width="180" prop="vatRate">
          <el-input type="number" v-model="formData.vatRate">
            <template #append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="人均跟线数量" width="180" prop="traceLineOfPerson">
          <el-input-number controls-position="right" :min="0" v-model="formData.traceLineOfPerson" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-row justify="end">
          <el-button @click="handleCancel(formRef)"> 取消 </el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted, watchEffect, ref } from "vue"
import { getManufacturingCost, saveManufacturingCost, DelManufacturingCost, ModifyManufacturingCost } from "./service"
import { ManufacturingCostsItem } from "./data.type"
import LogList, { LogListAPI } from "@/components/LogList/index.vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { map, cloneDeep } from 'lodash'

/**
 * 数据部分
 */
const data = reactive({
  tableData: [] as ManufacturingCostsItem[],
})

const logListRef = ref<LogListAPI | null>(null)
const visible = ref(false)
const isEdit = ref(false)
const formRef = ref<any>()
const formData = reactive<any>({
  monthlyWorkingDays: 0,
  averageWage: 0,
  workingHours: 0,
  rateOfMobilization: 0,
  usefulLifeOfFixedAssets: 0,
  dailyShift: 0,
  vatRate: 0,
  traceLineOfPerson: 0,
  year: 0
})

// 新增年
const handleAddYear = () => {
  visible.value = true
  isEdit.value = false
  setTimeout(() => {
    const len = data.tableData.length
    let newYear = new Date().getFullYear()
    if (len) {
      newYear = (data.tableData[len - 1].year || 0) + 1
    }
    formData.year = newYear
  }, 50)
}


const handleCancel = (formEl: any) => {
  if (!formEl) return
  formEl?.resetFields()
  visible.value = false
}

const submit = async () => {
  let res: any = await saveManufacturingCost({
    ...formData
  })
  if (res.success) {
    logListRef.value?.onRefresh()
    initFetch()
    ElMessage({
      type: "success",
      message: "提交成功"
    })
  }
}

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
      const { success } = await DelManufacturingCost({ id })
      if (success) {
        initFetch()
        logListRef.value?.onRefresh()
        ElMessage.success('删除成功！')
      }
    })

}

const handleModify = async () => {
  const { success } = await ModifyManufacturingCost({
    ...formData
  })
  if (success) {
    logListRef.value?.onRefresh()
    initFetch()
    visible.value = false
    ElMessage.success('修改成功！')
  }
}

const handleSubmit = () => {
  isEdit ? handleModify() : submit()
}

const handleEdit = (row: any) => {
  isEdit.value = true
  visible.value = true
  setTimeout(() => {
    map(cloneDeep(row), (val, key) => {
      formData[key] = val
    })
  }, 300)
}



const initFetch = async () => {
  let res: any = await getManufacturingCost()
  if (res.result.length > 0) {
    data.tableData = res.result || []
  }
}

onMounted(() => {
  initFetch()
})

watchEffect(() => { })
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.card {
  margin: 20px 0;
}
</style>
