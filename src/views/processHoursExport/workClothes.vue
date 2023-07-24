<template>
  <div class="u-p-20">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="工装名称">
          <el-input v-model="queryForm.workClothesName" placeholder="输入工装名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-flex u-row-between u-col-center">
      <div>
        <el-button type="primary" @click="submitSearch">工装库导入</el-button>
        <el-button type="primary" @click="addNewworkClothes">新增工装</el-button>
      </div>
      <div>
        <el-button type="primary" @click="submitSearch">工装库导出</el-button>
        <el-button type="primary" @click="submitSearch">工装库模板下载</el-button>
      </div>
    </div>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;" :scrollbar-always-on="false" max-height="400" border>
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="工序编号" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-select :disabled="currentEditProcessIndex != scope.row.processIndex" v-model="scope.row.processIndex"
                  filterable remote reserve-keyword :remote-method="remoteMethodForprocessIndex"
                  @change="processIndexChange($event, scope.$index)" :loading="optionLoading">
                  <el-option v-for="item in processIndexOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工序名称" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-select :disabled="currentEditProcessIndex != scope.row.processIndex" v-model="scope.row.processName"
                  filterable remote reserve-keyword :remote-method="remoteMethodForProcessName"
                  @change="processNameChange($event, scope.$index)" :loading="optionLoading">
                  <el-option v-for="item in processNameOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装名称" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-select :disabled="currentEditProcessIndex != scope.row.processIndex"
                  v-model="scope.row.workClothesName" filterable remote reserve-keyword
                  :remote-method="remoteMethodForworkClothesName" @change="workClothesNameChange($event, scope.$index)"
                  :loading="optionLoading">
                  <el-option v-for="item in workClothesNameOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装单价" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <!-- <el-input v-model="scope.row.workClothesPrice" :disabled="currentEditProcessIndex != scope.row.processIndex"
                      placeholder="请输入工装单价" /> -->
                <el-input-number v-model="scope.row.workClothesPrice"
                  :disabled="currentEditProcessIndex != scope.row.processIndex" placeholder="工装单价" :precision="2"
                  :step="0.01" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装供应商" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.workClothesProvider"
                  :disabled="currentEditProcessIndex != scope.row.processIndex" placeholder="请输入工装供应商" />
              </div>
            </template>
          </el-table-column>


          <el-table-column label="测试线名称" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.testLineName" :disabled="currentEditProcessIndex != scope.row.processIndex"
                  placeholder="请输入测试线名称" />
              </div>
            </template>
          </el-table-column>


          <el-table-column label="测试线单价" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <!-- <el-input v-model="scope.row.workClothesPrice" :disabled="currentEditProcessIndex != scope.row.processIndex"
                      placeholder="请输入测试线单价" /> -->
                <el-input-number v-model="scope.row.testLinePrice"
                  :disabled="currentEditProcessIndex != scope.row.processIndex" placeholder="测试线单价" :precision="2"
                  :step="0.01" />
              </div>
            </template>
          </el-table-column>


          <el-table-column label="工装维护人" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.workClothesManager"
                  :disabled="currentEditProcessIndex != scope.row.processIndex" placeholder="请输入工装维护人" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装维护时间" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-date-picker v-model="scope.row.workClothesManageTime"
                  :disabled="currentEditProcessIndex != scope.row.processIndex" type="datetime"
                  value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange" :disabled-date="disabledDate"
                  placeholder="请输入工装维护时间" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" :width="tableColumnWidth" align="center" fixed="right">
            <template #default="scope">
              <template v-if="currentEditProcessIndex == scope.row.processIndex">
                <el-button size="small" @click="cancelEdit(scope.$index, scope.row)">取消</el-button>
                <el-button type="primary" @click="saveEdit(scope.$index, scope.row)" size="small">保存</el-button>
              </template>
              <template v-else>
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="tableData.length >= 10" class="u-flex u-row-center u-col-center u-m-t-20">
        <div>
          <el-pagination :page-size="10" :pager-count="5" layout="prev, pager, next" :total="tableData.length" />
        </div>
      </div>

    </div>

    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <el-scrollbar :min-size="10">
        <div class="u-flex u-row-between u-col-center  u-p-r-20">
          <div>日志更新记录：</div>
          <div>
            <el-button v-if="editLogFlag == false" type="primary" @click="editLogFlag = true">编辑</el-button>
            <el-button v-else @click="editLogFlag = false">取消</el-button>
            <el-button type="primary" @click="saveLog">保存</el-button>
          </div>
        </div>
        <div class="u-m-t-20">
          <el-timeline>
            <el-timeline-item placement="top" v-for="(activity, index) in baseLibLogRecords" :key="index"
              :timestamp="activity.timestamp">
              <div class="u-p-10 u-border-bottom u-font-12">
                <div style="font-weight: bold;color: #909399;">
                  <span>版本号：</span>
                  <span>{{ activity.version }}</span>
                </div>
                <div>
                  <div style="font-weight: bold;color: #909399;" class="u-flex u-row-left u-col-center u-m-t-10">
                    <div>
                      <span>操作人：</span>
                    </div>
                    <div>
                      <span>{{ activity.optionUser }}</span>
                    </div>
                  </div>
                  <div class="u-m-t-10">
                    <div class="u-m-t-5 u-font-12">
                      <el-input :disabled="!editLogFlag" v-model="activity.content" :rows="2" type="textarea"
                        placeholder="更新日志记录内容" />
                    </div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
const queryForm = reactive({
  workClothesName: ''
})
const tableColumnWidth = ref(200)
let tableData = reactive<any>([])

onMounted(() => {
  initData();
})

const initData = () => {
  tableData.push(...[
    {
      processIndex: '00001',
      processName: '工序名称',
      workClothesName: '工装名称1',
      workClothesPrice: 100.00,
      workClothesProvider: 'NIKE',
      testLineName: '测试线名称1',
      testLinePrice: 99.99,
      workClothesManager: 'Tom',
      workClothesManageTime: '2016-05-03 10:00:00',
    },
    {
      processIndex: '00002',
      processName: '工序名称',
      workClothesName: '工装名称2',
      workClothesPrice: 200.00,
      workClothesProvider: 'Adidas',
      testLineName: '测试线名称2',
      testLinePrice: 88.22,
      workClothesManager: 'Jerry',
      workClothesManageTime: '2016-05-04 10:00:00',
    },
    {
      processIndex: '00003',
      processName: '工序名称',
      workClothesName: '工装名称3',
      workClothesPrice: 300.00,
      workClothesProvider: '乔丹',
      testLineName: '测试线名称3',
      testLinePrice: 77.66,
      workClothesManager: 'Jordan',
      workClothesManageTime: '2016-05-02 10:00:00',
    }
  ])
}


const submitSearch = () => {
  console.log('submitSearch!')
}

const addNewworkClothes = () => {
  tableData.push({
    processName: '',
    processIndex: '',
    workClothesName: '',
    workClothesPrice: 0.00,
    workClothesProvider: '',
    testLineName: '',
    testLinePrice: 0.00,
    workClothesManager: '',
    workClothesManageTime: '',
  })
  currentEditProcessIndex.value = "";
}

interface workClothesItem {
  processName: string,
  processIndex: string
  workClothesName: string
  workClothesManager: string,
  workClothesManageTime: string,
  workClothesPrice: number,
  workClothesProvider: string,
  testLineName: string,
  testLinePrice: number,
}

const currentEditProcessIndex = ref<string>("")
let currentEditProcessItem = {
  processName: '',
  processIndex: '',
  workClothesName: '',
  workClothesPrice: 0.00,
  workClothesProvider: '',
  testLineName: '',
  testLinePrice: 0.00,
  workClothesManager: '',
  workClothesManageTime: '',
}
const handleEdit = (index: number, row: workClothesItem) => {
  console.log(index, row);
  currentEditProcessIndex.value = row.processIndex;
  currentEditProcessItem = JSON.parse(JSON.stringify(row));
}

const cancelEdit = (index: number, row: workClothesItem) => {
  console.log("currentEditProcessItem", currentEditProcessItem);
  tableData[index] = currentEditProcessItem;
  currentEditProcessIndex.value = "";
}

const saveEdit = (index: number, row: workClothesItem) => {
  console.log("保存编辑内容", row);
  currentEditProcessIndex.value = "";
}

const handleDelete = (index: number, row: workClothesItem) => {
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

const workClothesNameOptions = ref<selectOptionListItem[]>([])
//模糊查询工装名称
const remoteMethodForworkClothesName = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      workClothesNameOptions.value = getworkClothesName(query);
    }, 200)
  } else {
    workClothesNameOptions.value = []
  }
}
//模糊查询工装名称
const getworkClothesName = (keyWord: String) => {
  return [
    { label: "工装名称1" + keyWord, value: 'aaaaa' },
    { label: "工装名称2" + keyWord, value: 'bbbbb' },
    { label: "工装名称3" + keyWord, value: 'ccccc' },
    { label: "工装名称4" + keyWord, value: 'ddddd' }
  ]
}
//监听工装名称变化
const workClothesNameChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工装名称变化了${value}`);
}


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



//模糊查询工装编号
const processIndexOptions = ref<selectOptionListItem[]>([])
//选择查询回调
const remoteMethodForprocessIndex = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      processIndexOptions.value = getprocessIndex(query);
    }, 200)
  } else {
    processIndexOptions.value = []
  }
}
//模糊查询工装名称
const getprocessIndex = (keyWord: String) => {
  return [
    { label: "工序编号1" + keyWord, value: '11111' },
    { label: "工序编号2" + keyWord, value: '22222' },
    { label: "工序编号3" + keyWord, value: '33333' },
    { label: "工序编号4" + keyWord, value: '44444' }
  ]
}
//监听工装名称变化
const processIndexChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工装编号变化了${value}`);
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const timeChange = (val: string) => {
  console.log("维护时间发生了变化", val);
}

//日志更新记录相关
const editLogFlag = ref(false);
const baseLibLogRecords = reactive([
  {
    content: '修改记录1',
    version: '2.0.0',
    timestamp: '2023-07-15',
    optionUser: '张三'
  },
  {
    content: '修改记录2',
    version: '2.0.0',
    timestamp: '2023-07-14',
    optionUser: '张三'
  },
  {
    content: '修改记录3',
    version: '2.0.0',
    timestamp: '2013-07-13',
    optionUser: '张三'
  },
])
const saveLog = () => {
  console.log(baseLibLogRecords);
  editLogFlag.value = false;
}

defineExpose({
  ...toRefs(tableData),
})

</script>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.table-box .el-table__body-wrapper .el-scrollbar__bar.is-horizontal {
  height: 6px !important;
}

.table-box .el-scrollbar__bar {
  margin-top: 5px !important;
  bottom: 1px !important;
}
</style>