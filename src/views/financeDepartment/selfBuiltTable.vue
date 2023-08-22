<template>
  <div>
    <el-card>
      <el-card>
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" width="80" fixed="left" />
          <el-table-column label="客户" width="120">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
          <el-table-column label="客户名称" width="120">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
          <el-table-column label="项目代码" width="120">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
          <el-table-column label="项目描述" width="120">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
          <el-table-column label="子项目代码（WBS）" width="120">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
            </template>
          </el-table-column>
          <el-table-column label="子项目描述" width="120">
            <template #default="{ row }">
              <el-input v-model="row.remark" />
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
import { ref } from "vue"

const tableData = ref([])

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
</script>

<style lang="scss" scoped>
.log-card {
  width: 400px;
}
.time {
  margin: 5px 10px;
}
</style>
