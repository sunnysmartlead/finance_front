<template>
  <div class="country-library" py-20px>
    <div flex mb-20px>
      <el-button type="primary" @click="handleCreateCountry">创建国家</el-button>
    </div>
    <el-table :data="data.tableData" style="width: 100%">
      <el-table-column label="序号" type="index" />
      <el-table-column label="国家" prop="country" />
      <el-table-column label="国家类型" prop="nationalType">
        <template #default="{ row }">
          <div v-for="item in countryType" :key="item.val" :label="item.label">
            <span v-if="item.val === row.nationalType">{{ item.label }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="比例" prop="rate">
        <template #default="scope"> {{ scope.row.rate + "%" }}</template>
      </el-table-column>
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

    <el-dialog v-model="data.dialogVisible" title="国家信息" @close="clearcountryForm">
      <el-form :model="data.countryForm">
        <el-form-item label="国家" :label-width="data.formLabelWidth">
          <el-input v-model="data.countryForm.country" autocomplete="off" />
        </el-form-item>
        <el-form-item label="国家类型" :label-width="data.formLabelWidth">
          <el-select v-model="data.countryForm.nationalType">
            <el-option v-for="item in countryType" :key="item.val" :label="item.label" :value="item.val" />
          </el-select>
          <!-- <el-input v-model="data.countryForm.nationalType" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item label="比例" :label-width="data.formLabelWidth">
          <el-input v-model="data.countryForm.rate" type="number">
            <template #append> % </template>
          </el-input>
        </el-form-item>
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
import { createCountry, updateCountry, deleteCountry, getCountryLibraryList } from "@/api/countrylibrary"
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
  countryForm: {
    country: "",
    nationalType: "",
    rate: ""
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

const countryType = ref([
  {
    label: "一级管制国家",
    val: "1"
  },
  {
    label: "二级管制国家",
    val: "2"
  },
  {
    label: "三级管制国家",
    val: "3"
  },
  {
    label: "四级管制国家",
    val: "4"
  },
  {
    label: "五级管制国家",
    val: "5"
  }
])
const handleCreateCountry = () => {
  data.dialogVisible = true
  data.isEdit = false
}
const handleEdit = (row: any) => {
  data.isEdit = true
  data.countryForm = row
  data.countryForm.id = row.dbId
  data.dialogVisible = true
}
const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm("确定删除该国家?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    if (row.dbId) {
      let res: any = await deleteCountry(row.dbId)
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
const clearcountryForm = () => {
  data.countryForm = {
    country: "",
    nationalType: "",
    rate: ""
  }
}
const save = async () => {
  let res: any = null
  if (data.isEdit) {
    res = await updateCountry(data.countryForm)
  } else {
    res = await createCountry(data.countryForm)
  }
  if (res.success) {
    ElMessage({
      type: "success",
      message: "保存成功"
    })
    getList()
    data.dialogVisible = false
  }
}
const getList = async () => {
  let params: any = {
    maxResultCount: 20,
    skipCount: 0
  }
  params.skipCount = (data.pageNo - 1) * data.pageSize
  params.maxResultCount = data.pageSize

  let res: any = await getCountryLibraryList(params)
  // console.log(res)
  data.tableData = res.result.items
  data.total = res.result.totalCount
  getOptionLog()
}

const baseLibLogRecords = ref([])
const getOptionLog = () => {
  let data = {
    type: 14
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
