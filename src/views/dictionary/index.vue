<template>
  <div class="dictionary">
    <div class="dictionary__btn-container">
      <el-form :model="data.searchForm" inline>
        <!-- <el-form-item label="字典名">
          <el-input v-model="data.searchForm.id" />
        </el-form-item>
        <el-form-item label="字典显示名">
          <el-input v-model="data.searchForm.displayName" />
        </el-form-item> -->
        <el-form-item label="字典名">
          <el-input v-model="data.searchForm.displayName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="data.searchForm.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="dictionary__btn-container">
      <el-button type="primary" @click="data.dialogVisible = true">创建字典</el-button>
    </div>
    <el-table :data="data.tableData" style="width: 100%">
      <!-- <el-table-column label="字典名（id）" prop="id" /> -->
      <!-- <el-table-column label="字典名" prop="name" /> -->
      <el-table-column label="字典名" prop="displayName" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" @click="jumpToDetail(scope.row)">字典明细</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="dictionary__btn-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="data.total"
        :page-size="20"
        v-model:currentPage="data.pageNo"
        @update:current-page="handlePageChange"
      />
    </div>
    <el-dialog v-model="data.dialogVisible" title="字典编辑" @close="clearForm">
      <el-form :model="data.editForm">
        <!-- <el-form-item label="字典名" :label-width="data.formLabelWidth">
          <el-input v-model="data.editForm.id" />
        </el-form-item> -->
        <el-form-item label="字典名" :label-width="data.formLabelWidth">
          <el-input v-model="data.editForm.displayName" />
        </el-form-item>
        <el-form-item label="备注" :label-width="data.formLabelWidth">
          <el-input v-model="data.editForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDictionary">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
import { useRouter } from "vue-router"
import { addDictionary, editDictionary, deleteDictionary, getDictionary } from "@/api/dictionary"

import { ElMessage, ElMessageBox } from "element-plus"
interface dictionary {
  id?: string
  displayName: string
  remark: string
}
interface tableRow extends dictionary {
  id: string
}
interface DictionarySearch {
  /**
   * 字典显示名
   */
  displayName: null | string
  /**
   * 字典名  获取字段列表的依据
   */
  // id: null | string
  /**
   * 备注
   */
  remark?: null | string
  maxResultCount: number
  skipCount: number
}
/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */

const data = reactive({
  tableData: [],
  dialogVisible: false,
  formLabelWidth: "140px",
  searchForm: {
    id: "",
    displayName: "",
    remark: ""
  },
  editForm: {
    id: "",
    displayName: "",
    remark: ""
  } as dictionary,
  isEdit: false,
  pageNo: 1,
  pageSize: 20,
  total: 0
})
const search = () => {
  getList()
}
const getList = async () => {
  let params: DictionarySearch = {
    // id: "",
    displayName: "",
    remark: "",
    maxResultCount: 20,
    skipCount: 0
  }
  // params.id = data.searchForm.id
  params.displayName = data.searchForm.displayName
  params.remark = data.searchForm.remark
  params.skipCount = (data.pageNo - 1) * data.pageSize
  params.maxResultCount = data.pageSize

  let res: any = await getDictionary(params)
  // console.log(res)
  data.tableData = res.result.items
  data.total = res.result.totalCount
}
const clearForm = () => {
  data.editForm = {
    id: "",
    displayName: "",
    remark: ""
  }
  data.isEdit = false
}
const handleEdit = (index: number, row: tableRow) => {
  console.log(index, row)
  data.isEdit = true
  data.editForm = row
  data.dialogVisible = true
}
const jumpToDetail = (row: tableRow) => {
  router.push({
    path: "/dictionary/detailList",
    query: {
      id: row.id
    }
  })
}
const handlePageChange = () => {
  getList()
}
const saveDictionary = async () => {
  let res: any = null
  if (data.isEdit) {
    // 编辑
    res = await editDictionary(data.editForm)
  } else {
    // 新增
    res = await addDictionary(data.editForm)
  }
  if (res.success) {
    data.editForm = {
      id: "",
      displayName: "",
      remark: ""
    }
    ElMessage({
      type: "success",
      message: "保存成功"
    })
    data.dialogVisible = false
    getList()
  }
}
const handleDelete = (index: number, row: tableRow) => {
  ElMessageBox.confirm("确定删除该字典?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    let res: any = await deleteDictionary(row.id)
    if (res.success) {
      ElMessage({
        type: "success",
        message: "删除成功"
      })
      getList()
    }
  })
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
.dictionary {
  &__btn-container {
    margin: 20px 0;
  }
}
</style>
