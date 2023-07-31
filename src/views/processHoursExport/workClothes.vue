<template>
  <div class="u-p-20">
    <!-- 搜索表单 -->
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="工装名称">
          <el-input v-model="queryForm.InstallationName" placeholder="输入工装名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
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
    <!-- 数据表格区域 -->
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;" :scrollbar-always-on="false" max-height="400" border>
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="工序编号" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-select :disabled="currentEditProcessIndex != scope.$index" v-model="scope.row.processNumber"
                  filterable remote reserve-keyword :remote-method="remoteMethodForprocessNumber"
                  @change="processNumberChange($event, scope.$index)" :loading="optionLoading">
                  <el-option v-for="item in processNumberOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工序名称" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-select :disabled="currentEditProcessIndex != scope.$index" v-model="scope.row.processName" filterable
                  remote reserve-keyword :remote-method="remoteMethodForProcessName"
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
                <el-select :disabled="currentEditProcessIndex != scope.$index" v-model="scope.row.installationName"
                  filterable remote reserve-keyword :remote-method="remoteMethodForinstallationName"
                  @change="installationNameChange($event, scope.$index)" :loading="optionLoading">
                  <el-option v-for="item in installationNameOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装单价" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <!-- <el-input v-model="scope.row.installationPrice" :disabled="currentEditProcessIndex !=scope.$index"
                      placeholder="请输入工装单价" /> -->
                <el-input-number v-model="scope.row.installationPrice" :disabled="currentEditProcessIndex != scope.$index"
                  placeholder="工装单价" :precision="2" :step="0.01" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装供应商" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.installationSupplier" :disabled="currentEditProcessIndex != scope.$index"
                  placeholder="请输入工装供应商" />
              </div>
            </template>
          </el-table-column>


          <el-table-column label="测试线名称" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.testName" :disabled="currentEditProcessIndex != scope.$index"
                  placeholder="请输入测试线名称" />
              </div>
            </template>
          </el-table-column>


          <el-table-column label="测试线单价" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <!-- <el-input v-model="scope.row.installationPrice" :disabled="currentEditProcessIndex !=scope.$index"
                      placeholder="请输入测试线单价" /> -->
                <el-input-number v-model="scope.row.testPrice" :disabled="currentEditProcessIndex != scope.$index"
                  placeholder="测试线单价" :precision="2" :step="0.01" />
              </div>
            </template>
          </el-table-column>


          <el-table-column label="工装维护人" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <!--  :disabled="currentEditProcessIndex !=scope.$index" -->
                <el-input v-model="scope.row.lastModifierUserName" disabled placeholder="请输入工装维护人" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="工装维护时间" :width="tableColumnWidth" align="center">
            <template #default="scope">
              <div>
                <!-- :disabled="currentEditProcessIndex !=scope.$index"  -->
                <el-date-picker v-model="scope.row.lastModificationTime" type="datetime" disabled
                  value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange" :disabled-date="disabledDate"
                  placeholder="请输入工装维护时间" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" :width="tableColumnWidth" align="center" fixed="right">
            <template #default="scope">
              <template v-if="currentEditProcessIndex == scope.$index">
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
    <!-- 日志记录 -->
    <div v-if="baseLibLogRecords.length>0" class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
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
              <div class="u-p-10  u-font-12">
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
import { getListAll, createFoundationProcedure, updateFoundationProcedure, deleteFoundationProcedure} from '@/api/foundationProcedure';
import {deleteFoundationEmc} from "@/api/foundationEmc";
//查询关键字
const queryForm = reactive({
  InstallationName: ''
})
//表格每列宽度
const tableColumnWidth = ref(200)

//工装类型
interface workClothesItem {
  id: number,
  processName: string,
  processNumber: string
  installationName: string
  lastModifierUserName: string,
  lastModificationTime: string,
  installationPrice: number,
  installationSupplier: string,
  testName: string,
  testPrice: number,
}

//表格数据
let tableData = ref<any>([])

//生命周期钩子
onMounted(() => {
  initData();
})
//初始化查询数据
const initData = async () => {
  let listResult: any = await getListAll({ ProcessName: queryForm.InstallationName })
  if (listResult.success) {
    tableData.value = listResult.result;
    console.log("工装数据数量", tableData.value.length);
  }
  //获取日志
  getLogRecords();
}
//提交搜索
const submitSearch = () => {
  console.log('submitSearch!');
  initData();
}

//新增工装
const addNewworkClothes = () => {
  tableData.value.push({
    id: -1,
    processName: '',
    processNumber: '',
    installationName: '',
    installationPrice: 0.00,
    installationSupplier: '',
    testName: '',
    testPrice: 0.00,
    lastModifierUserName: '',
    lastModificationTime: '',
  })
  currentEditProcessIndex.value = tableData.value.length - 1;
}

const currentEditProcessIndex = ref(-1)
let currentEditProcessItem = {
  id: -1,
  processName: '',
  processNumber: '',
  installationName: '',
  installationPrice: 0.00,
  installationSupplier: '',
  testName: '',
  testPrice: 0.00,
  lastModifierUserName: '',
  lastModificationTime: '',
}
//开启编辑
const handleEdit = (index: number, row: workClothesItem) => {
  console.log(index, row.id);
  currentEditProcessIndex.value = index;
  currentEditProcessItem = JSON.parse(JSON.stringify(row));
}
//取消编辑
const cancelEdit = (index: number, row: workClothesItem) => {
  console.log("currentEditProcessItem", currentEditProcessItem);
  tableData.value[index] = currentEditProcessItem;
  currentEditProcessIndex.value = -1;
}
//新增或者修改
const saveEdit = async (index: number, row: any) => {
  console.log("保存编辑内容", row);
  currentEditProcessIndex.value = -1;
  let tip: string = "";
  let result: any;
  //编辑保存
  console.log(row.id)
  if (row.id > 0) {
    console.log("编辑工装保存");
    tip = "修改工装";
    result = await updateFoundationProcedure(row);
  }
  //新增
  else if (row.id == -1) {
    console.log("新增工装");
    tip = "新增工装";
    row.id = null
    result = await createFoundationProcedure(row)
  }
  console.log("结果", result);
  if (result.success == true) {
    initData();
  } else {
    ElMessage({
      type: 'error',
      message: tip + '失败',
    })
  }
}

/** 删除按钮操作 */
function handleDelete(index: number, row: workClothesItem) {
  const postIds = row.id
  ElMessageBox.confirm("是否确认删除!")
    .then(function () {
      return deleteFoundationProcedure(postIds)
    })
    .then(() => {
      initData()
      ElMessage({
        type: "success",
        message: "删除成功"
      })
    })
    .catch(() => {})
}
//下拉选项的数据类型定义
interface selectOptionListItem {
  value: string
  label: string
}
//异步请求loading
const optionLoading = ref(false)
const installationNameOptions = ref<selectOptionListItem[]>([])
//填写工装名称的时候需要从后台模糊查询工装名称,然后下拉选择
const remoteMethodForinstallationName = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      installationNameOptions.value = getinstallationName(query);
    }, 200)
  } else {
    installationNameOptions.value = []
  }
}
//查询工装名称的方法,用于渲染工装名称下拉框选项
const getinstallationName = (keyWord: String) => {
  return [
    { label: "工装名称1" + keyWord, value: 'aaaaa' },
    { label: "工装名称2" + keyWord, value: 'bbbbb' },
    { label: "工装名称3" + keyWord, value: 'ccccc' },
    { label: "工装名称4" + keyWord, value: 'ddddd' }
  ]
}
//监听工装名称变化
const installationNameChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工装名称变化了${value}`);
}
//工序名称下拉数据列表
const processNameOptions = ref<selectOptionListItem[]>([])
//填写工序名称时候的回调,需要从后台模糊查询工序名称,然后下拉选择
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
//模糊查询工序名称,用于渲染工序名称下拉框选项
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
const processNumberOptions = ref<selectOptionListItem[]>([])
//填写工装编号时候的回调,需要从后台模糊查询编号,然后下拉选择
const remoteMethodForprocessNumber = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      processNumberOptions.value = getprocessNumber(query);
    }, 200)
  } else {
    processNumberOptions.value = []
  }
}
//模糊查询工装编号的接口请求
const getprocessNumber = (keyWord: String) => {
  return [
    { label: "工序编号1" + keyWord, value: '11111' },
    { label: "工序编号2" + keyWord, value: '22222' },
    { label: "工序编号3" + keyWord, value: '33333' },
    { label: "工序编号4" + keyWord, value: '44444' }
  ]
}
//监听工装序号变化
const processNumberChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工装编号变化了${value}`);
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const timeChange = (val: string) => {
  console.log("维护时间发生了变化", val);
}

//-------------------------------------日志更新记录相关代码块 start-------------------
//#region
const editLogFlag = ref(false);
//日志数据
const baseLibLogRecords = ref<any>([])

//获取日志
const getLogRecords = () => {
  baseLibLogRecords.value = [
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
  ]
}

//保存日志方法
const saveLog = () => {
  editLogFlag.value = false;
}
//#endregion
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
