<template>
  <div class="tangentHours" py-20px>
    <div flex mb-20px>
      <el-button type="primary" @click="handleCreate">新增</el-button>
    </div>
    <el-table :data="data.tableData" style="width: 100%">
      <el-table-column label="序号" type="index" />
      <el-table-column label="年份" prop="year" />
      <el-table-column label="人工工时" prop="laborHour" />
      <el-table-column label="机器工时" prop="machineHour" />
      <el-table-column label="人均跟线数量" prop="perFollowUpQuantity" />
      <!-- <el-table-column label="比例" prop="rate">
        <template #default="scope"> {{ scope.row.rate + "%" }}</template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div mt-20px>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="data.total"
        :page-size="data.pageSize"
        v-model:currentPage="data.pageNo"
        @update:current-page="handlePageChange"
      />
    </div>
    <template v-if="baseLibLogRecords.length > 0">
      <option-log-record :base-lib-log-records="baseLibLogRecords" @reload-data="getOptionLog" />
    </template>

    <el-dialog v-model="data.dialogVisible" title="跟线/切线工时" @close="clearForm">
      <el-form :model="data.tangentForm">
        <el-form-item label="年份" :label-width="data.formLabelWidth">
          <el-input v-model="data.tangentForm.year" :disabled="data.isEdit" />
        </el-form-item>
        <el-form-item label="人工工时" :label-width="data.formLabelWidth">
          <el-input v-model="data.tangentForm.laborHour" type="number" />
        </el-form-item>
        <el-form-item label="机器工时" :label-width="data.formLabelWidth">
          <el-input v-model="data.tangentForm.machineHour" type="number" />
        </el-form-item>
        <el-form-item label="人均跟线数量" :label-width="data.formLabelWidth">
          <el-input v-model="data.tangentForm.perFollowUpQuantity" type="number" />
        </el-form-item>
        <!-- <el-form-item label="比例" :label-width="data.formLabelWidth">
          <el-input v-model="data.tangentForm.rate" type="number">
            <template #append> % </template>
          </el-input>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import {
  addFollowLineTangent,
  editFollowLineTangent,
  deleteFollowLineTangent,
  getTangentHoursList
} from "@/api/tangentHours"
import optionLogRecord from "@/components/processHoursExport/option-log-records.vue"
import { getLogRecord } from "@/api/logRecord"
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const data = reactive({
  tableData: [],
  dialogVisible: false,
  formLabelWidth: "100px",
  pageSize: 20,
  pageNo: 1,
  total: 0,
  tangentForm: {
    year: "",
    laborHour: "",
    machineHour: "",
    perFollowUpQuantity: ""
  } as any,
  isEdit: false
})
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  getList()
})
watchEffect(() => {})

const handleCreate = () => {
  data.dialogVisible = true
  data.isEdit = false
}
const handleEdit = (row: any) => {
  data.isEdit = true
  data.tangentForm = row
  data.dialogVisible = true
}
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm("确定删除该条记录?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    if (typeof row.id === "number") {
      let res: any = await deleteFollowLineTangent(row.id)
      if (res.success) {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        getList()
      }
    }
  })
}
const handlePageChange = () => {
  getList()
}
const clearForm = () => {
  data.tangentForm = {
    year: "",
    laborHour: "",
    machineHour: "",
    perFollowUpQuantity: ""
  }
}
const save = async () => {
  let res: any = null
  const { year } = data.tangentForm
  data.tangentForm.year = Number(year)
  if (data.isEdit) {
    res = await editFollowLineTangent(data.tangentForm)
  } else {
    res = await addFollowLineTangent(data.tangentForm)
  }
  if (res.success) {
    ElMessage({
      type: "success",
      message: "保存成功"
    })
    data.dialogVisible = false
    getList()
  }
}
const getList = async () => {
  let params: any = {
    maxResultCount: 20,
    skipCount: 0
  }
  params.skipCount = (data.pageNo - 1) * data.pageSize
  params.maxResultCount = data.pageSize

  let res: any = await getTangentHoursList(params)
  // console.log(res)
  data.tableData = res.result.items
  data.total = res.result.totalCount
  getOptionLog()
}
const baseLibLogRecords = ref([])
const getOptionLog = () => {
  let data = {
    type: 17
  }
  getLogRecord(data).then((response: any) => {
    if (response.success) {
      baseLibLogRecords.value = response.result
    } else {
      ElMessage({
        type: "error",
        message: "加载日志记录失败"
      })
    }
  })
}

// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
