<template>
  <div class="u-p-20">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="工序名称">
          <el-input v-model="queryForm.processName" placeholder="输入工序名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-flex u-row-between u-col-center">
      <div>
        <el-button type="primary" @click="submitSearch">工序库导入</el-button>
        <el-button type="primary" @click="addNewProcess">新增工序</el-button>
      </div>
      <div>
        <el-button type="primary" @click="submitSearch">工序库导出</el-button>
        <el-button type="primary" @click="submitSearch">工序库模板下载</el-button>
      </div>
    </div>
    <div class="u-m-t-20">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="序号" type="index" width="180" align="center" />
        <el-table-column label="工序编号" align="center">
          <template #default="scope">
            <div>
              <el-select :disabled="currentEditProcessIndex != scope.row.processIndex" v-model="scope.row.processIndex"
                filterable remote reserve-keyword :remote-method="remoteMethodForProcessIndex"
                @change="processIndexChange($event, scope.$index)" :loading="optionLoading">
                <el-option v-for="item in processIndexOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="工序名称" align="center">
          <template #default="scope">
            <div>
              <el-select :disabled="currentEditProcessIndex != scope.row.processIndex" v-model="scope.row.processName"
                filterable remote reserve-keyword :remote-method="remoteMethodForProcessName"
                @change="processNameChange($event, scope.$index)" :loading="optionLoading">
                <el-option v-for="item in processNameOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="工序维护人" align="center">
          <template #default="scope">
            <div>
              <el-input v-model="scope.row.processManager" :disabled="currentEditProcessIndex != scope.row.processIndex"
                placeholder="请输入工序维护人" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="工序维护时间" align="center">
          <template #default="scope">
            <div>
              <el-date-picker v-model="scope.row.processManageTime"
                :disabled="currentEditProcessIndex != scope.row.processIndex" type="datetime"
                value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange" :disabled-date="disabledDate"
                placeholder="请输入工序维护时间" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="tableData.length>=10" 
         class="u-flex u-row-center u-col-center u-m-t-20">
      <div>
        <el-pagination 
              :page-size="10" :pager-count="5" 
              layout="prev, pager, next" 
              :total="tableData.length"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
const queryForm = reactive({
  processName: ''
})

const tableData = reactive([
  {
    processIndex: '00001',
    processManageTime: '2016-05-03 10:00:00',
    processManager: 'Tom',
    processName: '工序名称1',
  },
  {
    processIndex: '00002',
    processManageTime: '2017-05-03 10:00:00',
    processManager: 'Jerry',
    processName: '工序名称2',
  },
  {
    processIndex: '00003',
    processManageTime: '2018-05-03 10:00:00',
    processManager: '熊大',
    processName: '工序名称3',
  },
  {
    processIndex: '00004',
    processManageTime: '2019-05-03 10:00:00',
    processManager: '熊二',
    processName: '工序名称4',
  }
])

const submitSearch = () => {
  console.log('submitSearch!')
}

const addNewProcess = () => {
  tableData.push({
    processIndex: "",
    processName: "",
    processManager: "",
    processManageTime: ""
  })
  currentEditProcessIndex.value = "";
}

interface processItem {
  processIndex: string
  processName: string
  processManager: string,
  processManageTime: string
}

const currentEditProcessIndex = ref<string>("")

const handleEdit = (index: number, row: processItem) => {
  console.log(index, row);
  currentEditProcessIndex.value = row.processIndex;
}
const handleDelete = (index: number, row: processItem) => {
  console.log(index, row);
  ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    tableData.splice(index);
    ElMessage({
      type: "success",
      message: "删除成功"
    })
  })
}

interface selectOptionListItem {
  value: string
  label: string
}
const optionLoading = ref(false)

const processNameOptions = ref<selectOptionListItem[]>([])
//模糊查询工序名称
const remoteMethodForProcessName = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      processNameOptions.value = getProcessName(query);
    }, 200)
  } else {
    processNameOptions.value = []
  }
}
//模糊查询工序名称
const getProcessName = (keyWord: String) => {
  return [
    { label: "工序名称1" + keyWord, value: 'aaaaa' },
    { label: "工序名称2" + keyWord, value: 'bbbbb' },
    { label: "工序名称3" + keyWord, value: 'ccccc' },
    { label: "工序名称4" + keyWord, value: 'ddddd' }
  ]
}
//监听工序名称变化
const processNameChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工序名称变化了${value}`);
}

//模糊查询工序编号
const processIndexOptions = ref<selectOptionListItem[]>([])
//选择查询回调
const remoteMethodForProcessIndex = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      processIndexOptions.value = getProcessIndex(query);
    }, 200)
  } else {
    processNameOptions.value = []
  }
}
//模糊查询工序名称
const getProcessIndex = (keyWord: String) => {
  return [
    { label: "工序编号1" + keyWord, value: '11111' },
    { label: "工序编号2" + keyWord, value: '22222' },
    { label: "工序编号3" + keyWord, value: '33333' },
    { label: "工序编号4" + keyWord, value: '44444' }
  ]
}
//监听工序名称变化
const processIndexChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工序编号变化了${value}`);
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const timeChange = (val: string) => {
  console.log("维护时间发生了变化", val);
}

defineExpose({
  ...toRefs(tableData),
})

</script>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>