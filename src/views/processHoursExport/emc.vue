<template>
  <div class="u-p-20">
    <div>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="实验分类">
          <el-input v-model="queryParams.classification" placeholder="输入实验分类" clearable />
        </el-form-item>
        <el-form-item label="实验名称">
          <el-input v-model="queryParams.name" placeholder="输入实验名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-flex u-row-between u-col-center">
      <div>
        <el-button type="primary" @click="submitSearch">表单导入</el-button>
        <el-button type="primary" @click="submitSearch">模版下载</el-button>
        <el-button type="primary" @click="handleAdd">创建实验项目</el-button>
      </div>
    </div>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <el-scrollbar wrap-style="padding:10px 0px" :max-height="400" native>
        <div>
          <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
            <el-table-column label="实验分类" align="center" prop="classification" />
            <el-table-column label="实验名称" align="center" prop="name" />
            <el-table-column label="单价" align="center" prop="price" />
            <el-table-column label="计价单位" align="center" prop="unit" />
            <el-table-column label="工序维护人" align="center" prop="lastModifierUserName" />
            <el-table-column label="工序维护时间" align="center" prop="creationTime" />
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>

    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <el-scrollbar :min-size="10">
        <div class="u-flex u-row-between u-col-center u-p-r-20">
          <div>日志更新记录：</div>
          <div>
            <el-button v-if="editLogFlag == false" type="primary" @click="editLogFlag = true">编辑</el-button>
            <el-button v-else @click="editLogFlag = false">取消</el-button>
            <el-button type="primary" @click="saveLog">保存</el-button>
          </div>
        </div>
        <div class="u-m-t-20">
          <el-timeline>
            <el-timeline-item
              placement="top"
              v-for="(activity, index) in baseLibLogRecords"
              :key="index"
              :timestamp="activity.timestamp"
            >
              <div class="u-p-10 u-border-bottom u-font-12">
                <div style="font-weight: bold; color: #909399">
                  <span>版本号：</span>
                  <span>{{ activity.version }}</span>
                </div>
                <div>
                  <div style="font-weight: bold; color: #909399" class="u-flex u-row-left u-col-center u-m-t-10">
                    <div>
                      <span>操作人：</span>
                    </div>
                    <div>
                      <span>{{ activity.optionUser }}</span>
                    </div>
                  </div>
                  <div class="u-m-t-10">
                    <div class="u-m-t-5 u-font-12">
                      <el-input
                        :disabled="!editLogFlag"
                        v-model="activity.content"
                        :rows="2"
                        type="textarea"
                        placeholder="更新日志记录内容"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-scrollbar>
    </div>
    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="400px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试验分类" prop="classification">
          <el-input v-model="form.classification" placeholder="" />
        </el-form-item>
        <el-form-item label="试验名称" prop="name">
          <el-input v-model="form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="实验室" prop="laboratory">
          <el-input v-model="form.laboratory" controls-position="right" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="form.price" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue"
import {
  GetListAll,
  getFoundationEmcById,
  updateFoundationEmc,
  createFoundationEmc,
  deleteFoundationEmc
} from "@/api/foundationEmc"
import { ElMessage, ElMessageBox, FormInstance } from "element-plus"
const data = reactive({
  form: {
    id: undefined,
    classification: undefined,
    name: undefined,
    price: undefined,
    unit: undefined,
    IsDeleted: 1,
    laboratory: undefined
  },
  queryParams: {
    name: undefined,
    classification: undefined
  },
  rules: {
    laboratory: [{ required: true, message: "实验室不能为空", trigger: "blur" }],
    name: [{ required: true, message: "试验名称不能为空", trigger: "blur" }],
    classification: [{ required: true, message: "试验分类不能为空", trigger: "blur" }],
    price: [{ required: true, message: "单价不能为空", trigger: "blur" }],
    unit: [{ required: true, message: "单位不能为空", trigger: "blur" }]
  }
})
const { queryParams, form } = toRefs(data)
const title = ref("")
const open = ref(false)
const loading = ref(true)
const tableData = ref([])
function getList() {
  loading.value = true
  GetListAll(queryParams.value).then((response) => {
    tableData.value = response.result
    loading.value = false
  })
}
const submitSearch = () => {
  getList()
}
function handleAdd() {
  reset()
  open.value = true
  title.value = "试验信息"
}

const editLogFlag = ref(false)
function reset() {
  form.value = {
    classification: undefined,
    id: undefined,
    price: undefined,
    unit: undefined,
    name: undefined,
    laboratory: undefined,
    IsDeleted: 1
  }
}
function cancel() {
  open.value = false
  reset()
}
interface environmentItem {
  classification: string
  laboratory: string
  name: string
  unit: string
  price: number
  id: number
}

/** 修改按钮操作 */
function handleEdit(index: number, row: environmentItem) {
  console.log(index, row.id)
  const postId = row.id
  getFoundationEmcById(postId).then((response) => {
    form.value = response.result
    open.value = true
    title.value = "编辑试验信息"
  })
}
/** 删除按钮操作 */
function handleDelete(row) {
  const postIds = row.id
  ElMessageBox.confirm("是否确认删除!")
    .then(function () {
      return deleteFoundationEmc(postIds)
    })
    .then(() => {
      getList()
      ElMessage({
        type: "success",
        message: "删除成功"
      })
    })
    .catch(() => {})
}

function submitForm() {
  console.log(form.value)
  if (form.value.id == null) {
    createFoundationEmc(form.value).then((response) => {
      open.value = false
      getList()
    })
  } else {
    updateFoundationEmc(form.value).then((response) => {
      open.value = false
      getList()
    })
  }
}
const baseLibLogRecords = reactive([
  {
    content: "修改记录1",
    version: "2.0.0",
    timestamp: "2023-07-15",
    optionUser: "张三"
  },
  {
    content: "修改记录2",
    version: "2.0.0",
    timestamp: "2023-07-14",
    optionUser: "张三"
  }
])

const saveLog = () => {
  console.log(baseLibLogRecords)
  editLogFlag.value = false
}

getList()
defineExpose({
  ...toRefs(tableData)
})
</script>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
