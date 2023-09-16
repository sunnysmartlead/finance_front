<template>
  <div class="u-p-20">

    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="治具名称">
          <el-input v-model="queryForm.fixtureName" placeholder="输入治具名称" clearable />
        </el-form-item>
        <el-form-item label="检具名称">
          <el-input v-model="queryForm.fixtureGaugeName" placeholder="输入检具名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-flex u-row-between u-col-center u-m-t-10">
      <div>
        <div class="u-flex u-row-left u-col-center">
          <div class="u-m-r-20">
            <el-upload class="upload-demo" ref="upload" accept=".xls,.xlsx" :show-file-list="false"
              :on-error="uploadErrror" :on-success="uploadSuccess" :on-exceed="handleExceed" :action="uploadAction"
              :limit="1">
              <template #trigger>
                <el-button type="primary">治具库导入</el-button>
              </template>
            </el-upload>
          </div>
          <div>
            <el-button :disabled="addFlag == true" type="primary" @click="addDevice">新增治具</el-button>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="exportList">治具库导出</el-button>
        <el-button @click="downLoad" type="primary">治具库模板下载</el-button>
      </div>
    </div>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <el-scrollbar wrap-style="padding:0px 0px 10px 0px" always :max-height="500">
        <!-- 表头 -->
        <div class="u-flex u-row-left u-col-center u-text-center u-head-stop">
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-150  u-border u-height-60"><span>序号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
          </div>
          <div class="u-text-center">
            <div class="u-text-center u-border  u-p-t-5 u-p-b-5" style="background-color:#79bbff;">治具部分</div>
            <div class="u-flex u-row-left u-col-center  u-text-center">
              <template v-if="data.tableData.length > 0 && data.tableData[0]?.fixtureList.length > 0">
                <div v-for="index in data.tableData[0]?.fixtureList.length" :key="index"
                  class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-200 u-border   u-p-t-5 u-p-b-5" style="background-color: #f29100;">
                    <span>治具{{ index }}名称</span>
                  </div>
                  <div class="u-width-200  u-border   u-p-t-5 u-p-b-5" style="background-color: #eebe77;">
                    <span>治具{{ index }}状态</span>
                  </div>
                  <div class="u-width-200  u-border   u-p-t-5 u-p-b-5">
                    <span>治具{{ index }}单价</span>
                  </div>
                  <div class="u-width-200  u-border   u-p-t-5 u-p-b-5">
                    <span>治具{{ index }}供应商</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-200 u-border   u-p-t-5 u-p-b-5" style="background-color: #f29100;">
                    <span>治具名称</span>
                  </div>
                  <div class="u-width-200  u-border   u-p-t-5 u-p-b-5" style="background-color: #eebe77;">
                    <span>治具状态</span>
                  </div>
                  <div class="u-width-200  u-border   u-p-t-5 u-p-b-5">
                    <span>治具单价</span>
                  </div>
                  <div class="u-width-200  u-border   u-p-t-5 u-p-b-5">
                    <span>治具供应商</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="u-text-center">
            <div class="u-text-center u-border u-p-t-5 u-p-b-5" style="background-color:#70ec87;">检具部分</div>
            <div class="u-flex u-row-left u-col-center  u-text-center">
              <div class="u-width-150 u-border   u-p-t-5 u-p-b-5"><span>检具名称</span></div>
              <div class="u-width-150 u-border   u-p-t-5 u-p-b-5"><span>检具状态</span></div>
              <div class="u-width-150 u-border   u-p-t-5 u-p-b-5"><span>检具单价</span></div>
              <div class="u-width-150 u-border   u-p-t-5 u-p-b-5"><span>检具供应商</span></div>
            </div>
          </div>
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-150 u-border u-height-60"><span>治具维护人</span></div>
            <div class="u-width-200 u-border u-height-60"><span>设备维护时间</span></div>
            <div class="u-width-300 u-border u-height-60"><span>操作</span></div>
          </div>
        </div>
        <template v-if="data.tableData.length > 0">
          <div>
            <div v-for="(dataItem, dataIndex) in data.tableData" :key="dataIndex"
              class="u-flex u-row-left u-col-center u-text-center">
              <div class="u-flex u-row-left u-col-center  u-text-center">
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5"><span>{{ dataIndex + 1 }}</span></div>
                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.processNumber" filterable remote reserve-keyword
                    :disabled="data.currentEditProcessIndex != dataIndex" :remote-method="remoteMethodForProcessNumber"
                    @change="processNumberChange($event, dataIndex)" :loading="optionLoading">
                    <el-option v-for="item in processNumberOptions" :key="item.id" :label="item.processNumber"
                      :value="item.processNumber" />
                  </el-select>
                </div>
                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.processName" filterable remote reserve-keyword
                    :disabled="data.currentEditProcessIndex != dataIndex" :remote-method="remoteMethodForProcessName"
                    @change="processNameChange($event, dataIndex)" :loading="optionLoading">
                    <el-option v-for="item in processNameOptions" :key="item.id" :label="item.processName"
                      :value="item.processName" />
                  </el-select>
                </div>
              </div>

              <div class="u-text-center">
                <div class="u-flex u-row-left u-col-center  u-text-center">
                  <div v-for="(deviceItem, deviceIndex) in dataItem.fixtureList" :key="deviceIndex"
                    class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-200   u-border">
                      <el-input v-model="deviceItem.fixtureName" :disabled="data.currentEditProcessIndex != dataIndex" />
                    </div>
                    <div class="u-width-200   u-border">
                      <el-select  v-model="deviceItem.fixtureState"
                                  :disabled="data.currentEditProcessIndex != dataIndex">
                        <el-option v-for="item in deviceStatusEnmus"
                                   :key="item.code"
                                   :label="item.value"
                                   :value="item.value"/>
                      </el-select>
                    </div>
                    <div class="u-width-200   u-border">
                      <el-input-number v-model="deviceItem.fixturePrice" :min="1"
                        :disabled="data.currentEditProcessIndex != dataIndex"  />
                    </div>
                    <div class="u-width-200   u-border">
                      <el-input v-model="deviceItem.fixtureProvider"
                        :disabled="data.currentEditProcessIndex != dataIndex" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="u-text-center">
                <div class="u-flex u-row-left u-col-center  u-text-center">
                  <div class="u-width-150  u-border">
                  <el-input v-model="dataItem.fixtureGaugeName" style="border: none;"
                    :disabled="data.currentEditProcessIndex != dataIndex" />
                </div>
                <div class="u-width-150  u-border">
                  <el-select  v-model="dataItem.fixtureGaugeState"
                              :disabled="data.currentEditProcessIndex != dataIndex">
                    <el-option v-for="item in deviceStatusEnmus"
                               :key="item.code"
                               :label="item.value"
                               :value="item.value"/>
                  </el-select>
                </div>
                <div class="u-width-150  u-border">
                  <el-input-number v-model="dataItem.fixtureGaugePrice" style="border: none;"
                    :disabled="data.currentEditProcessIndex != dataIndex" />
                </div>
                <div class="u-width-150  u-border">
                  <el-input v-model="dataItem.fixtureGaugeBusiness" style="border: none;"
                    :disabled="data.currentEditProcessIndex != dataIndex" />
                </div>
                </div>
              </div>

              <div class="u-flex u-row-left u-col-center  u-text-center">
                <div class="u-width-150  u-border">
                  <el-input v-model="dataItem.lastModifierUserName" style="border: none;" disabled />
                </div>
                <div class="u-width-200 u-border">
                  <el-date-picker v-model="dataItem.lastModificationTime" style="width: 200px;" disabled type="datetime"
                    value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange" :disabled-date="disabledDate"
                    placeholder="请输入工序维护时间" />
                </div>
                <div class="u-width-300 u-border  u-flex u-row-around u-col-center  u-text-center">
                  <template v-if="data.currentEditProcessIndex == dataIndex">
                    <div>
                      <el-button size="small" @click="cancelEdit(dataIndex, dataItem)">取消</el-button>
                    </div>
                    <div>
                      <el-button type="primary" @click="saveEdit(dataIndex, dataItem)" size="small">保存</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="u-p-t-4 u-p-b-4">
                      <el-button type="primary" size="small" @click="handleEdit(dataIndex, dataItem)">编辑</el-button>
                    </div>
                  </template>
                  <div class="u-p-t-4 u-p-b-4">
                    <el-button type="danger" size="small" @click="handleDelete(dataItem)">删除</el-button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </template>
      </el-scrollbar>
    </div>


    <div v-if="baseLibLogRecords.length > 0" class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <div class="u-flex u-row-between u-col-center" style="width: 100%">
        <div>日志更新记录：</div>
        <div>
          <el-button v-if="editLogFlag == false" type="primary" @click="editLogFlag = true">编辑</el-button>
          <el-button v-else @click="editLogFlag = false">取消</el-button>
          <el-button type="primary" @click="saveLog">保存</el-button>
        </div>
      </div>
      <el-scrollbar :min-size="10" max-height="500px">

        <div class="u-m-t-20">
          <el-timeline>
            <el-timeline-item placement="top" v-for="(activity, index) in baseLibLogRecords" :key="index"
              :timestamp="formatDateTime(activity.lastModificationTime)">
              <div class="u-p-10 u-border-bottom u-font-12">
                <div style="font-weight: bold; color: #909399">
                  <span>版本号：</span>
                  <span>{{ activity.version ? activity.version : '--' }}</span>
                </div>
                <div>
                  <div style="font-weight: bold; color: #909399" class="u-flex u-row-left u-col-center u-m-t-10">
                    <div>
                      <span>操作人：</span>
                    </div>
                    <div>
                      <span>{{ activity.lastModifierUserName }}</span>
                    </div>
                  </div>
                  <div class="u-m-t-10">
                    <div class="u-m-t-5 u-font-12">
                      <el-input :disabled="!editLogFlag" v-model="activity.remark" :rows="2" type="textarea"
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
<script setup lang="ts">
import { reactive, toRefs, onMounted, ref } from 'vue';
import { formatDateTime } from "@/utils"
import { ElMessage, ElMessageBox, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import { getListAll, updateFoundationFixture, createFoundationFixture, deleteFoundationPFoundationFixture, exportFoundationFixture, uploadAction } from "@/api/foundationFixtureDto";
import {exportDevice, getDeviceLog, getDeviceStatus, saveDeviceLog} from "@/api/foundationDeviceDto";
import { GetListAll as queryProcessList } from "@/api/process";
const data = reactive<any>({
  tableColumnWidth: 200,
  tableData: [],
  currentEditProcessIndex: -1,
})
const baseLibLogRecords = ref([])
const deviceStatusEnmus=ref<any>([]);
const addFlag = ref(false);
const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
const uploadSuccess = (response: any, uploadFile: any, uploadFiles: any) => {
  console.log("responese", response);
  console.log("uploadFile", uploadFile);
  console.log("uploadFiles", uploadFiles);
  if (response.result) {
    initData()
    ElMessage({
      type: 'success',
      message: '导入成功',
    })
  } else {
    ElMessage({
      type: 'error',
      message: '导入失败',
    })
  }
}
const uploadErrror = (error: Error, uploadFile: any, uploadFiles: any) => {
  console.log("error", error);
  console.log("uploadFile", uploadFile);
  console.log("uploadFiles", uploadFiles);
  ElMessage({
    type: 'error',
    message: '导入失败',
  })
}

const getDeviceStatuEnmu = () => {
  getDeviceStatus().then((response:any) => {
    console.log("======设备状态列表=======", response);
    if (response.success) {
      deviceStatusEnmus.value=response.result;
    }
  })
}

//获取日志记录
const getDeviceOptionLog = () => {
  let data = {
    Type: 6
  };
  getDeviceLog(data).then((response) => {
    console.log("======getDeviceLog ===response=======", response);
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
//查询关键字
const queryForm = reactive({
  fixtureName: "",
  fixtureGaugeName: ""
})
let currentEditProcessItem: any = null;
onMounted(() => {
  initData();
})

const initData = async () => {
  addFlag.value = false;
  data.currentEditProcessIndex = -1;
  let listResult: any = await getListAll(queryForm)
  if (listResult.success) {
    data.tableData = listResult.result
  }
  getDeviceOptionLog()
  getDeviceStatuEnmu();
}

const addDevice = () => {
  if (addFlag.value == true) {
    ElMessage({
      type: 'warning',
      message: '您有新的记录尚未保存'
    })
    return;
  }
  let item = {
    id: -1,
    processNumber: '',
    processName: '',
    fixtureGaugeState: '',
    fixtureGaugePrice: '',
    fixtureGaugeName: '',
    fixtureGaugeBusiness: '',
    fixtureList: [
      {
        fixtureName: '',
        fixturePrice: 0,
        fixtureState: '',
        FixtureProvider: ''
      },
      {
        fixtureName: '',
        fixturePrice: 0,
        fixtureState: '',
        FixtureProvider: ''
      },
    ]
  }
  data.tableData.push(item);
  currentEditProcessItem = item;
  addFlag.value = true;
  data.currentEditProcessIndex = data.tableData.length - 1;
}

const submitSearch = () => {
  console.log('搜索设备')
  initData()
}

//下拉选项的数据类型定义
interface selectOptionListItem {
  id: Number,
  processName: String,
  processNumber: String
}
//异步请求loading
const optionLoading = ref(false)
const processNumberOptions = ref<selectOptionListItem[]>([])
//填写工序名称的时候需要从后台模糊查询工序名称,然后下拉选择
const remoteMethodForProcessNumber = async (query: string) => {
  if (query) {
    optionLoading.value = true;
    await getProcessIndex(query);
    optionLoading.value = false;
  } else {
    processNumberOptions.value = []
  }
}
//查询工序名称的方法,用于渲染工序名称下拉框选项
const getProcessIndex = async (keyWord: String) => {
  let param = {
    processNumber: keyWord
  }
  await queryProcessList(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      processNumberOptions.value = data;
    } else {
      ElMessage({
        type: 'error',
        message: '列表加载失败'
      })
      processNumberOptions.value = [];
    }
  })
}

//监听工序序号变化
const processNumberChange = (value: any, dataIndex: any) => {
  if (processNumberOptions.value.length > 0) {
    let options = processNumberOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.processNumber == value) {
        data.tableData[dataIndex].processName = item.processName;
        return;
      }
    }
  }
}

const processNameOptions = ref<selectOptionListItem[]>([])

//模糊查询工序名称
//填写工序名称的时候需要从后台模糊查询工序名称,然后下拉选择
const remoteMethodForProcessName = async (query: string) => {
  if (query) {
    optionLoading.value = true;
    await getProcessName(query);
    optionLoading.value = false;
  } else {
    processNameOptions.value = []
  }
}
//模糊查询工序名称
const getProcessName = async (keyWord: String) => {
  let param = {
    ProcessName: keyWord
  }
  await queryProcessList(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      processNameOptions.value = data;
    } else {
      ElMessage({
        type: 'error',
        message: '列表加载失败'
      })
      processNameOptions.value = [];
    }
  })
}
//监听工序名称变化
const processNameChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工序名称变化了${value}`);
  if (processNameOptions.value.length > 0) {
    let options = processNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.processName == value) {
        data.tableData[dataIndex].processNumber = item.processNumber;
        return;
      }
    }
  }
}



const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const timeChange = (val: string) => {
  console.log("维护时间发生了变化", val);
}


const handleEdit = (index: number, row: any) => {
  console.log(index, row);
  data.currentEditProcessIndex = index;
  currentEditProcessItem = JSON.parse(JSON.stringify(row));
}

const cancelEdit = (index: number, row: any) => {
  data.currentEditProcessIndex = -1;
  if (addFlag.value == true) {
    console.log("取消新增");
    data.tableData.splice(index);
    addFlag.value = false;
  } else {
    data.tableData[index] = currentEditProcessItem;
  }
}


//新增或者修改
const saveEdit = async (index: number, row: any) => {
  console.log("保存编辑内容", row);
  let pname = row.processName;
  let pNumber = row.processNumber;
  if (pname == null || pname == undefined || pname.length < 1) {
    ElMessage({
      type: 'error',
      message: '工序名称不能为空!'
    })
    return;
  }
  if (pNumber == null || pNumber == undefined || pNumber.length < 1) {
    ElMessage({
      type: 'error',
      message: '工序序号不能为空!'
    })
    return;
  };
  data.currentEditProcessIndex = -1;
  let tip: string = "";
  let result: any;
  //编辑保存
  console.log(row.id)
  if (row.id > 0) {
    console.log("编辑治置保存");
    tip = "修改治置";
    result = await updateFoundationFixture(row);
  }
  //新增
  else if (row.id == -1) {
    console.log("新增治置");
    tip = "新增治置";
    let a = {
      "processName": row.processName,
      "processNumber": row.processNumber,
      "fixtureList": row.fixtureList,
      "fixtureGaugeName": row.fixtureGaugeName,
      "fixtureGaugePrice": row.fixtureGaugePrice,
      "fixtureGaugeState": row.fixtureGaugeState,
      "fixtureGaugeBusiness": row.fixtureGaugeBusiness
    }

    result = await createFoundationFixture(a)
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
const downLoad = async () => {
  const link = document.createElement('a')
  link.href = import.meta.env.VITE_BASE_API + "/Excel/检具.xlsx"
  link.download = '检具.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
function handleDelete(row) {
  console.log(row.id)
  const postIds = row.id
  ElMessageBox.confirm("是否确认删除!")
    .then(function () {
      return deleteFoundationPFoundationFixture(postIds)
    })
    .then(() => {
      initData()
      ElMessage({
        type: "success",
        message: "删除成功"
      })
    })
    .catch(() => { })
}

//日志更新记录相关
const editLogFlag = ref(false);
const saveLog = async () => {
  let data = JSON.parse(JSON.stringify(baseLibLogRecords.value))
  await saveDeviceLog({
    listFoundationLogs: data
  }).then((response) => {
    if (response.success) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      });
      initData()
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败'
      });
    }
  })
  editLogFlag.value = false
}
const exportList = () => {
  let param = {
    processName: queryForm.deviceName
  }
  exportFoundationFixture(param).then((response: any) => {
    if (response) {
      const data = new Blob([response], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', "检具.xlsx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      ElMessage({
        type: 'error',
        message: '导出失败'
      })
    }
  })
}

defineExpose({
  data,
  ...toRefs(data),
  editLogFlag,
  baseLibLogRecords
})
</script>
