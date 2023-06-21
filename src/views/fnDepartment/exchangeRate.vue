<template>
  <div>
    <div class="exchangeRate">
      <div class="exchangeRate__btn-container">
        <el-form :model="data.searchForm" inline>
          <el-form-item label="货币币种">
            <el-input v-model="data.searchForm.exchangeRateKind" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="exchangeRate__btn-container">
        <el-button type="primary" @click="data.dialogVisible = true">新增汇率</el-button>
      </div>
      <el-table :data="data.tableData">
        <el-table-column label="货币币种" prop="exchangeRateKind" />
        <el-table-column label="汇率">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.exchangeRateValue" :key="index">
              <span>{{ item.year }}:</span> <span>{{ item.value }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="exchangeRate__btn-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="data.total"
          :page-size="20"
          v-model:currentPage="data.pageNo"
          @update:current-page="handlePageChange"
        />
      </div>
      <el-dialog v-model="data.dialogVisible" title="编辑汇率" @close="clearForm">
        <el-form :model="data.editForm">
          <el-form-item label="货币种类(比如 CNY)">
            <el-input v-model="data.editForm.exchangeRateKind" />
          </el-form-item>
          <el-form-item label="汇率值">
            <el-input
              v-model="item.value"
              placeholder="请输入汇率"
              v-for="(item, index) in data.editForm.exchangeRateValue"
              :key="index"
              style="margin-bottom: 20px"
            >
              <template #prepend>
                <!-- <el-date-picker v-model="item.year" type="year" placeholder="Pick a year" value-format="YYYY" /> -->
                <el-input v-model="item.year" placeholder="请输入年份" />
              </template>
              <template #append>
                <el-button-group>
                  <el-button :icon="Plus" @click="addYearItem" />
                  <el-button
                    :icon="Minus"
                    @click="reduceYearItem(index)"
                    :disabled="data.editForm.exchangeRateValue.length === 1"
                  />
                </el-button-group>
              </template>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
// import { useRoute, useRouter } from "vue-router"
import { getExchangeRate, saveExchangeRate, deleteExchangeRate } from "./service"
import { ElMessage, ElMessageBox } from "element-plus"
import { RateItem } from "./data.type"
import { Plus, Minus } from "@element-plus/icons-vue"
/**
 * 仓库
 */
/**
//  * 路由对象
//  */
// const route = useRoute()
// /**
//  * 路由实例
//  */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
let nowDateYear = new Date().getFullYear()
const data = reactive({
  searchForm: {
    exchangeRateKind: "",
    maxResultCount: 20,
    skipCount: 0
  },
  isEdit: false,

  editForm: {
    exchangeRateKind: "",
    exchangeRateValue: [
      {
        year: nowDateYear,
        value: ""
      }
    ]
  } as RateItem,
  dialogVisible: false,
  tableData: [],
  pageNo: 1,
  pageSize: 20,
  total: 0
})
const addYearItem = () => {
  nowDateYear =
    Number(data.editForm.exchangeRateValue[data.editForm.exchangeRateValue.length - 1]?.year) ||
    new Date().getFullYear()
  nowDateYear++
  data.editForm.exchangeRateValue.push({
    year: nowDateYear,
    value: ""
  })
}
const reduceYearItem = (index: number) => {
  data.editForm.exchangeRateValue.splice(index, 1)
}
const getList = async () => {
  let params = {
    exchangeRateKind: "",
    maxResultCount: 20,
    skipCount: 0
  }
  // params.name = data.searchForm.name
  params.exchangeRateKind = data.searchForm.exchangeRateKind
  params.skipCount = (data.pageNo - 1) * data.pageSize
  params.maxResultCount = data.pageSize
  let res: any = await getExchangeRate(params)
  data.tableData = res.result.items
  data.total = res.result.totalCount
}
const handlePageChange = () => {}
const search = () => {
  getList()
}
const handleEdit = (index: number, row: RateItem) => {
  console.log(index, row)
  data.isEdit = true
  data.editForm = row
  data.dialogVisible = true
}
const handleDelete = (index: number, row: RateItem) => {
  ElMessageBox.confirm("确定删除该汇率?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let res: any = await deleteExchangeRate(row.id)
    if (res.success) {
      ElMessage({
        type: "success",
        message: "删除成功"
      })
      getList()
    }
  })
}
const clearForm = () => {
  data.isEdit = false
  data.editForm = {
    exchangeRateKind: "",
    exchangeRateValue: [
      {
        year: "",
        value: ""
      }
    ]
  }
}
const save = async () => {
  let res: any = null

  res = await saveExchangeRate(data.editForm)
  if (res.success) {
    ElMessage({
      type: "success",
      message: "保存成功"
    })
    data.dialogVisible = false
    getList()
  }
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  search()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.exchangeRate {
  &__btn-container {
    margin: 20px 0;
  }
}
</style>
