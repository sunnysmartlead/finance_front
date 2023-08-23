<template>
  <div>
    <el-card>
      <el-row justify="end" m="2">
        <el-button type="primary" @click="handleAddTableData">新增</el-button>
        <el-button type="primary">自建表导入</el-button>
        <el-button type="primary">自建表导出</el-button>
      </el-row>
      <el-card>
        <el-row align="middle">
          关键字：
          <el-input :data="data.filter" style="width: 250px" />
        </el-row>
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" width="80" fixed="left" />
          <el-table-column label="客户" prop="custom" width="120">
            <template #default="{ row }">
              <el-input v-model="row.custom" v-if="row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="客户名称" prop="customName" width="120">
            <template #default="{ row }">
              <el-input v-model="row.customName" v-if="row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="项目代码" prop="code">
            <template #default="{ row }">
              <el-input v-model="row.code" v-if="row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="项目描述" prop="description">
            <template #default="{ row }">
              <el-input v-model="row.description" v-if="row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="子项目代码（WBS）" prop="subCode" width="170">
            <template #default="{ row }">
              <el-input v-model="row.subCode" v-if="row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="子项目描述" prop="subDescription">
            <template #default="{ row }">
              <el-input v-model="row.subDescription" v-if="row.isEdit" />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" v-if="!row.isEdit" @click="handleStartEdit" link>编辑</el-button>
              <el-button type="primary" link>取消</el-button>
              <el-button type="primary" link @click="handleConfirm">确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <h6>
        更新日志记录：
        <div m="2" v-for="item in logList" :key="item.content">
          <time class="time">{{ item.time }}</time>
          <el-card class="log-card" :header="item.name">
            <el-row justify="space-between">
              {{ item.content }}
              <el-button type="primary">编辑</el-button>
            </el-row>
          </el-card>
        </div>
      </h6>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import {
  CreateProjectSelf,
  UpdateProjectSelf,
  DeleteProjectSelf,
  GetBaseStoreLog,
  GetImportTemplate,
  GetExcelImport,
  GetAllProjectSelf
} from "./common/request"
import { table } from "console"

const data = reactive({
  filter: "",
  skipCount: 0,
  maxResultCount: 100
})

const tableData = ref<any>([])

const logList = ref([
  {
    name: "琪琪",
    time: "2023-08-22",
    content: "新表单导入、共100条记录"
  },
  {
    name: "雅卓",
    time: "2023-08-23",
    content: "新表单导入、共100条记录"
  },
  {
    name: "老汪",
    time: "2023-08-23",
    content: "新表单导入、共10000条记录"
  }
])

const init = async () => {
  const res = await GetAllProjectSelf({
    ...data
  })
}

const handleConfirm = async (row: any) => {
  if (row.id) {
    handleUpdateProjectSelf(row)
  } else {
    handleCreateProjectSelf(row)
  }
}

const handleStartEdit = () => {

}


const handleCreateProjectSelf = async (row: any) => {
  const res = await CreateProjectSelf({ ...row })
}
const handleUpdateProjectSelf = async (row: any) => {
  const res = await UpdateProjectSelf({ ...row })
}

const handleAddTableData = () => {
  tableData.value.push({
    custom: "",
    customName: "",
    code: "",
    description: "",
    subCode: "",
    subDescription: "",
    isEdit: true
  })
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.log-card {
  width: 400px;
}

.time {
  margin: 5px 10px;
}
</style>
