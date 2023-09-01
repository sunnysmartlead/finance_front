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
      <div class="u-flex u-row-left u-col-center">
        <div  class="u-m-r-20">
          <el-upload class="upload-demo" ref="upload"   accept=".xls,.xlsx"
              :show-file-list="false"
               :on-error="uploadErrror" :on-success="uploadSuccess" :on-exceed="handleExceed"
                :action="uploadAction" :limit="1">
            <template #trigger>
              <el-button type="primary">工序库导入</el-button>
            </template>
          </el-upload>
        </div>
        <div>
          <el-button type="primary" @click="addNewProcess" :disabled="addFlag==1">新增工序</el-button>
        </div>
      </div>

      <div>
        <el-button type="primary"  @click="submitExportProcess">工序库导出</el-button>
        <el-button type="primary" @click="submitSearch">工序库模板下载</el-button>
      </div>
    </div>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <el-scrollbar wrap-style="padding:10px 0px" :max-height="600" native>
        <div>
          <el-table :data="tableData" style="width: 100%" border max-height="600px">
            <el-table-column label="序号" type="index" width="180" align="center" />
            <el-table-column label="工序编号" align="center">
              <template #default="scope">
                <div>
                  <el-input :disabled="isDisable(scope.$index)" v-model="scope.row.processNumber"></el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="工序名称" align="center">
              <template #default="scope">
                <div>
                  <el-input :disabled="isDisable(scope.$index)" v-model="scope.row.processName"></el-input>

                </div>
              </template>
            </el-table-column>

            <el-table-column label="工序维护人" align="center">
              <template #default="scope">
                <div>
                  <el-input v-model="scope.row.lastModifierUserName" :disabled="true" placeholder="系统自动生成" />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="工序维护时间" align="center">
              <template #default="scope">
                <div>
                  <el-date-picker v-model="scope.row.lastModificationTime" :disabled="true" type="datetime"
                    value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange" :disabled-date="disabledDate"
                    placeholder="系统自动生成" />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <template v-if="currentEditIndex == scope.$index">
                      <el-button size="small" @click="cancalEdit(scope.$index, scope.row)">取消</el-button>
                      <el-button type="primary" @click="handleSave(scope.$index, scope.row)"
                          size="small">保存</el-button>
                </template>
                <template v-else>
                        <el-button type="primary" size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>

    <div v-if="baseLibLogRecords.length>0"
        class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <div class="u-flex u-row-between u-col-center">
        <div>日志更新记录：</div>
        <div>
          <el-button v-if="editLogFlag == false" type="primary" @click="editLogFlag = true">编辑</el-button>
          <el-button v-else @click="editLogFlag = false">取消</el-button>
          <el-button type="primary" @click="saveLog">保存</el-button>
        </div>
      </div>
      <el-scrollbar :min-size="10" max-height="600px">
        <div class="u-m-t-20">
          <el-timeline>
            <el-timeline-item placement="top"
              v-for="(activity, index) in baseLibLogRecords"
              :key="index"
               :timestamp="formatDateTime(activity.lastModificationTime)">
              <div class="u-p-10 u-border-bottom u-font-12">
                <div style="font-weight: bold; color: #909399">
                  <span>版本号：</span>
                  <span>{{ activity.version?activity.version:'--' }}</span>
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

<script lang="ts" setup>
import { formatDateTime } from "@/utils"
import { reactive, ref, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox,genFileId } from "element-plus"
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { GetListAll, getProcessDetail, createProcess, exportProcess,
      updateProcess, deleteProcess, uploadAction,getProcessLog,saveProcessLog } from "@/api/process"
import {deleteFoundationEmc} from "@/api/foundationEmc";
const queryForm = reactive({
  processName:''
})

interface processItem {
  id: number,
  isDeleted: boolean,
  deleterUserId: number,
  deletionTime: string,
  lastModifierUserId: number,
  lastModificationTime: string
  creationTime: string,
  creatorUserId: number,
  processName: string
  processNumber: string,
  lastModifierUserName: string,
}


const tableData = ref([])


onMounted(() => {
  initData()
})

const initData = () => {
  addFlag.value=0;
  currentEditIndex.value=-1;
  getProcessList()
  getProcessOptionLog()
}

const getProcessList = async () => {
  let param = {
    ProcessName: queryForm.processName?queryForm.processName:null
  }
  console.log("请求工序列表",param);
  await GetListAll(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      console.log("工序列表", data);
      tableData.value = data;
    } else {
      ElMessage({
        type: 'error',
        message: '列表加载失败'
      })
    }
  })
}

const submitSearch = () => {
  console.log('submitSearch!')
  getProcessList()
}

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
    if(response.result){
      initData()
      ElMessage({
        type: 'success',
        message: '导入成功',
       })
    }else{
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

const submitExportProcess=()=>{
  let param={
    processName:queryForm.processName
  }
  exportProcess(param).then((response: any) => {
      if (response) {
          const data = new Blob([response],{ type: 'application/octet-stream'});
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download',"工序.xlsx");
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


const currentEditIndex = ref<number>()
let currentEditProcess:any = null;
const addFlag = ref<number>(0);
const addNewProcess = () => {
  if (addFlag.value==1) {
    ElMessage({
      type: 'warning',
      message: '您有新的记录尚未保存'
    })
    return;
  }else{
    let newItem: any = {
      processNumber: "",
      processName: "",
      lastModifierUserName: "",
      lastModificationTime: ""
    }
    tableData.value.push(newItem)
    addFlag.value = 1;
    currentEditIndex.value=tableData.value.length - 1;
  }
}
//保存
const handleSave = (index: number, row: processItem) => {
  let param = JSON.parse(JSON.stringify(row))
  let id = row.id;
  //保存
  if (row.id) {
    updateProcess(param).then((response: any) => {
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
    createProcess(param).then((response: any) => {
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

//开启编辑
const handleEdit = (index: number, row: processItem) => {
  console.log(index, row);
  currentEditIndex.value = index;
  currentEditProcess=JSON.parse(JSON.stringify(row))
}

const cancalEdit=(index: number, row: processItem)=>{
  currentEditIndex.value = -1;
  if(addFlag.value==1){
    tableData.value.splice(index);
    addFlag.value=0;
  }else{
    tableData.value[index]=currentEditProcess;
  }
}

function handleDelete(row) {
  const postIds = row.id
  ElMessageBox.confirm("是否确认删除!")
    .then(function () {
      return deleteProcess(postIds)
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

const isDisable = (index: number) => {
  if (currentEditIndex.value == index) {
    return false;
  }
  return true;
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
const editLogFlag = ref(false);
const baseLibLogRecords = ref([])


//获取日志记录
const getProcessOptionLog = () => {
  let data={
    Type: 4
  };
  getProcessLog(data).then((response:any) => {
    console.log("======工序日志结果 ===response=======",response);
    if(response.success){
      baseLibLogRecords.value = response.result
      console.log("======baseLibLogRecords=======", baseLibLogRecords.value);
    }
    else{
      ElMessage({
        type:'error',
        message:'加载日志记录失败'
      })
    }
  })
}




const saveLog =async () => {
  let data=JSON.parse(JSON.stringify(baseLibLogRecords.value))
  await saveProcessLog({
    listFoundationLogs:data
    }).then((response:any) => {
     if(response.success){
      ElMessage({
        type:'success',
        message:'修改成功'
      });
      initData()
     }else{
      ElMessage({
        type:'error',
        message:'修改失败'
      });
     }
  })
  editLogFlag.value = false
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
