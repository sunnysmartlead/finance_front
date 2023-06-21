<template>
  <div>
    <div class="grossProfitMargin">
      <div class="grossProfitMargin__btn-container">
        <el-form :model="data.searchForm" inline>
          <el-form-item label="毛利率方案">
            <el-input v-model="data.searchForm.grossMarginName" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="grossProfitMargin__btn-container">
        <el-button type="primary" @click="data.dialogVisible = true">新增毛利率方案</el-button>
      </div>
      <el-table :data="data.tableData">
        <el-table-column label="毛利率方案" prop="grossMarginName" />
        <el-table-column label="毛利率">
          <template #default="scope">
            <div v-for="(item, index) in scope.row.grossMarginPrice" :key="index">
              <span>序号{{ index + 1 }}:</span> <span>{{ item }} %</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否默认">
          <template #default="scope">
            <div>
              <div v-if="scope.row.isDefaultn">是</div>
              <div v-else>否</div>
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
      <div class="grossProfitMargin__btn-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="data.total"
          :page-size="20"
          v-model:currentPage="data.pageNo"
          @update:current-page="handlePageChange"
        />
      </div>
      <el-dialog v-model="data.dialogVisible" title="毛利率方案" @close="clearForm">
        <el-form :model="data.editForm">
          <el-form-item label="毛利率方案名称">
            <el-input v-model="data.editForm.grossMarginName" />
          </el-form-item>
          <el-form-item label="是否默认">
            <el-switch v-model="data.editForm.isDefaultn" />
          </el-form-item>
          <el-form-item label="毛利率值">
            <el-input
              v-model="item.value"
              placeholder="请输入毛利率"
              style="margin-bottom: 20px"
              v-for="(item, index) in data.editForm.grossMarginPrice"
              :key="index"
            >
              <template #append>
                <el-button-group>
                  <el-button disabled>%</el-button>
                  <el-button :icon="Plus" @click="addGrossMarginItem" />
                  <el-button
                    :icon="Minus"
                    @click="reduceGrossMarginItem(index)"
                    :disabled="data.editForm.grossMarginPrice.length === 1"
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
import { getGrossMargin, saveGrossMargin, deleteGrossMargin } from "./service"
import { ElMessage, ElMessageBox } from "element-plus"
import { GrossMarginItem, GrossMarginParams } from "./data.type"
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
const data = reactive({
  searchForm: {
    grossMarginName: "",
    maxResultCount: 20,
    skipCount: 0
  },
  isEdit: false,
  editForm: {
    grossMarginName: "",
    isDefaultn: false,
    grossMarginPrice: [
      {
        value: ""
      }
    ]
  } as any,
  dialogVisible: false,
  tableData: [],
  pageNo: 1,
  pageSize: 20,
  total: 0
})
const addGrossMarginItem = () => {
  data.editForm.grossMarginPrice.push({
    value: ""
  })
}
const reduceGrossMarginItem = (index: number) => {
  data.editForm.grossMarginPrice.splice(index, 1)
}
const getList = async () => {
  let params = {
    grossMarginName: "",
    maxResultCount: 20,
    skipCount: 0
  }
  // params.name = data.searchForm.name
  params.grossMarginName = data.searchForm.grossMarginName
  params.skipCount = (data.pageNo - 1) * data.pageSize
  params.maxResultCount = data.pageSize
  let res: any = await getGrossMargin(params)
  data.tableData = res.result.items
  data.total = res.result.totalCount
}
const handlePageChange = () => {}
const search = () => {
  getList()
}
const handleEdit = (index: number, row: GrossMarginItem) => {
  console.log(index, row)

  data.isEdit = true
  data.editForm.isDefaultn = row.isDefaultn
  data.editForm.id = row.id
  data.editForm.grossMarginName = row.grossMarginName
  data.editForm.grossMarginPrice = row.grossMarginPrice.map((value) => {
    return { value }
  })
  data.dialogVisible = true
}
const handleDelete = (index: number, row: GrossMarginItem) => {
  ElMessageBox.confirm("确定删除该毛利率?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let res: any = await deleteGrossMargin(row.id)
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
    grossMarginName: "",
    grossMarginPrice: [
      {
        value: ""
      }
    ],
    isDefaultn: false
  }
}
const save = async () => {
  let res: any = null
  let { editForm } = data
  let params = {} as GrossMarginParams
  if (editForm.id) {
    params.id = editForm.id
  }
  params.isDefaultn = editForm.isDefaultn
  params.grossMarginName = editForm.grossMarginName
  params.grossMarginPrice = editForm.grossMarginPrice.map((item: any) => item.value)
  res = await saveGrossMargin(params)
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
.grossProfitMargin {
  &__btn-container {
    margin: 20px 0;
  }
}
</style>
