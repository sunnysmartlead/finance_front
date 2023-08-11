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
        <el-button type="primary">工时库导入</el-button>
        <el-button type="primary" :disabled="addFlag == true" @click="addworkingHours">新增工序工时</el-button>
      </div>
      <div>
        <el-button type="primary">工时库导出</el-button>
        <el-button type="primary">工时库模板下载</el-button>
      </div>
    </div>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <el-scrollbar wrap-style="padding:10px 0px" always :max-height="500">
        <!-- 头部区 -->
        <div class="u-flex u-row-left u-col-center u-text-center">
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-100  u-border u-height-60"><span>序号</span></div>
            <div style="background-color: #f29100;" class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
            <div style="color: red;" class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
          </div>
          <!-- 工时部分 -->
          <div class="u-text-center" style="background-color: rgb(223, 179, 122);">
            <div class="u-flex u-row-left u-col-center" v-if="dataArr.length > 0">
              <div v-for="(scopItem, sopIndex) in dataArr[0].listFoundationWorkingHour" :key="sopIndex"
                class="u-text-center">
                <div class="u-p-t-5 u-p-b-5 u-border"> SOP-{{ scopItem.year }}</div>
                <div class="u-flex u-row-left u-col-center">
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>标准人工工时</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>标准机器工时</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>人员数量</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-flex u-row-left u-col-center" v-else>
              <div class="u-text-center">
                <div class="u-p-t-5 u-p-b-5 u-border"> 工时信息 </div>
                <div class="u-flex u-row-left u-col-center">
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>标准人工工时</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>标准机器工时</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>人员数量</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 维护人和维护时间 -->
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div style="background-color: #f29100;" class="u-width-150 u-border u-height-60"><span>工时维护人</span></div>
            <div class="u-width-200 u-border u-height-60"><span>工序维护时间</span></div>
          </div>
          <!-- 操作 -->
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-250 u-border u-height-60"><span>操作</span></div>
          </div>
        </div>
        <!-- 数据区域 -->
        <template v-if="dataArr.length > 0">
          <div v-for="(dataItem, dataIndex) in dataArr" :key="dataIndex"
              class="u-flex u-row-left u-col-center u-text-center">
            <div class="u-flex u-row-left u-col-center  u-text-center">
              <div class="u-width-100 u-border  u-p-t-5 u-p-b-5">
                <span>{{ dataIndex }}</span>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processNumber" filterable remote reserve-keyword
                  :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForProcessNumber" :loading="optionLoading">
                  <el-option v-for="item in processNumberOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processName" filterable remote reserve-keyword
                  :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForProcessName" :loading="optionLoading">
                  <el-option v-for="item in processNameOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </div>
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center">
                <div v-for="(scopItem, sopIndex) in dataItem.listFoundationWorkingHour" :key="sopIndex"
                  class="u-text-center">
                  <div class="u-flex u-row-left u-col-center">
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.laborHour" :min="1" :disabled="isDisable(dataIndex)" />
                    </div>
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.machineHour" :min="1" :disabled="isDisable(dataIndex)" />
                    </div>
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.numberPersonnel" :min="1" :disabled="isDisable(dataIndex)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-flex u-row-left u-col-center  u-text-center">
              <div class="u-width-150 u-border">
                <el-input v-model="dataItem.lastModifierUserName" :disabled="isDisable(dataIndex)" />
              </div>
              <div class="u-width-200 u-border u-p-t-5 u-p-b-5">
                <span>{{ formatDateTime(dataItem.lastModificationTime) }}</span>
              </div>
            </div>
            <div class="u-text-center">
              <div class="u-width-250 u-flex u-row-around u-col-center u-border u-p-t-4 u-p-b-4">
                <template v-if="currentEditIndex == dataIndex">
                  <div class="u-width-80">
                  <el-button size="small" @click="cancalEdit(dataIndex, dataItem)">取消</el-button>
                  </div>
                  <div class="u-width-80">
                  <el-button type="primary" size="small" @click="handleSave(dataIndex, dataItem)">保存</el-button>
                  </div>
                </template>
                <template v-else class="u-width-80">
                  <el-button type="primary" size="small" @click="handleEdit(dataIndex, dataItem)">编辑</el-button>
                </template>
                <div class="u-width-80">
                  <el-button size="small" type="danger" @click="handleDelete(dataIndex, dataItem)">删除</el-button>
                </div>
              </div>      
            </div>
          </div>
        </template>
        <template v-else>
          <div class="u-text-center u-p-t-20 u-p-b-20" style="background-color: #f8f8f8;color: #909399;width:1400px;">
            <span>暂无数据</span>
          </div>
        </template>
      </el-scrollbar>
    </div>

    <template v-if="baseLibLogRecords.length > 0">
      <option-log-record :base-lib-log-records="baseLibLogRecords" @reload-data="initData"></option-log-record>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
import optionLogRecord from '@/components/processHoursExport/option-log-records.vue';
import { getLogRecord } from "@/api/logRecord";
import { GetListAll, update, create, deleteItem, uploadAction } from "@/api/workHour";
import { formatDateTime } from '@/utils';
const queryForm = reactive({
  processName: ''
})

const dataArr = ref([])


onMounted(() => {
  initData();
})

const initData = () => {
  addFlag.value = false;
  currentEditIndex.value = -1;
  getListData();
  getOptionLog();
}
const getListData = async () => {
  let param = {
    ProcessName: queryForm.processName
  }
  await GetListAll(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      console.log("工时列表", data);
      dataArr.value = data;
    } else {
      ElMessage({
        type: 'error',
        message: '列表加载失败'
      })
    }
  })
}
//新增工时
const addworkingHours = () => {
  let size = dataArr.value.length;
  dataArr.value.push(dataArr.value[size - 1]);
  console.log("新增工时", dataArr.value.length);


  if (addFlag.value == true) {
    ElMessage({
      type: 'warning',
      message: '您有新的记录尚未保存'
    })
    return;
  } else {
    let newItem: any = {
      processNumber: "",
      processName: "",
      lastModifierUserName: "",
      lastModificationTime: ""
    }
    dataArr.value.push(newItem)
    addFlag.value = true;
    currentEditIndex.value = dataArr.value.length - 1;
  }

}


const baseLibLogRecords = ref([])
const getOptionLog = () => {
  let data = {
    Type: 8
  };
  getLogRecord(data).then((response: any) => {
    console.log("======工时日志结果 ===response=======", response);
    if (response.success) {
      baseLibLogRecords.value = response.result
      console.log("======baseLibLogRecords=======", baseLibLogRecords.value);
    }
    else {
      ElMessage({
        type: 'error',
        message: '加载日志记录失败'
      })
    }
  })
}

const submitSearch = () => {
  initData();
}

//下拉选项的数据类型定义
interface selectOptionListItem {
  value: string
  label: string
}
//异步请求loading
const optionLoading = ref(false)
const processNumberOptions = ref<selectOptionListItem[]>([])

//填写工装名称的时候需要从后台模糊查询工装名称,然后下拉选择
const remoteMethodForProcessNumber = (query: string) => {
  if (query) {
    optionLoading.value = true;
    setTimeout(() => {
      optionLoading.value = false;
      processNumberOptions.value = getProcessNumber(query);
    }, 200)
  } else {
    processNumberOptions.value = []
  }
}
//查询工装名称的方法,用于渲染工装名称下拉框选项
const getProcessNumber = (keyWord: String) => {
  return [
    { label: "工序序号1" + keyWord, value: '工序序号1' },
    { label: "工序序号2" + keyWord, value: '工序序号2' },
    { label: "工序序号3" + keyWord, value: '工序序号3' },
    { label: "工序序号4" + keyWord, value: '工序序号4' }
  ]
}


const processNameOptions = ref<selectOptionListItem[]>([])

//填写工装名称的时候需要从后台模糊查询工装名称,然后下拉选择
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
//查询工装名称的方法,用于渲染工装名称下拉框选项
const getProcessName = (keyWord: String) => {
  return [
    { label: "工序名称1" + keyWord, value: '工序名称1' },
    { label: "工序名称2" + keyWord, value: '工序名称2' },
    { label: "工序名称3" + keyWord, value: '工序名称3' },
    { label: "工序名称4" + keyWord, value: '工序名称4' }
  ]
}

//保存
const handleSave = (index: number, row: any) => {
  let param = JSON.parse(JSON.stringify(row))
  let id = row.id;
  //保存
  if (row.id) {
    update(param).then((response: any) => {
      console.log("修改响应", response);
      if (response.success) {
        ElMessage({
          type: 'success',
          message: '修改成功'
        })
        initData()
      } else {
        ElMessage({
          type: 'error',
          message: '编辑保存失败'
        })
      }
    })
  }
  //新增
  else {
    create(param).then((response: any) => {
      console.log("新增响应", response);
      if (response.success) {
        ElMessage({
          type: 'success',
          message: '保存成功'
        })
        initData()
      } else {
        ElMessage({
          type: 'error',
          message: '新增失败'
        })
      }
    })
  }
}
const currentEditIndex = ref<number>()
let currentEditItem: any = null;
const addFlag = ref(false);
//开启编辑
const handleEdit = (index: number, row: any) => {
  console.log(index, row);
  currentEditIndex.value = index;
  currentEditItem = JSON.parse(JSON.stringify(row))
}

const cancalEdit = (index: number, row: any) => {
  currentEditIndex.value = -1;
  if (addFlag.value == true) {
    dataArr.value.splice(index);
    addFlag.value = false;
  } else {
    dataArr.value[index] = currentEditItem;
  }
}

const handleDelete = (index: number, row: any) => {
  console.log(index, row);
  ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    dataArr.value.splice(index);
    ElMessage({
      type: "success",
      message: "删除成功"
    })
  })
}

const isDisable = (index: number) => {
  if (currentEditIndex.value == index) {
    return false;
  }
  return true;
}

</script>

<style scoped></style>
<style></style>
