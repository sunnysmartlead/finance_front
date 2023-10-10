<template>
    <div class="u-p-20">
        <div>
            <el-form :inline="true" :model="data.queryForm" class="demo-form-inline">
                <el-form-item label="标准工艺名称">
                    <el-input v-model="data.queryForm.standardProcessName" placeholder="输入标准工艺名称" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="u-flex u-row-between u-col-center">
            <div>
                <el-button type="primary" @click="addStandardProcess">新增标准工艺</el-button>
              <el-button type="primary" @click="downLoadStandardProcess">模版下载</el-button>
            </div>

        </div>
        <div class="u-m-t-10">
            <el-table :data="standardProcessList" :border="true">
                <el-table-column label="序号" type="index" min-width="80px" align="center" />
                <el-table-column prop="name" label="标准工艺名称" align="center" />
                <el-table-column prop="lastModificationTime" label="维护时间" align="center">
                  <template #default="scope">
                    <div>
                        <span v-if="scope.row.lastModificationTime">{{formatDateTime(scope.row.lastModificationTime)}}</span>
                        <span v-else>--</span>
                    </div>
                    </template>
                </el-table-column>
                <el-table-column prop="lastModifierUserName" label="维护人" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="info" size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
                        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="info" size="small" @click="exportData(scope.$index, scope.row)">导出</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 日志相关 -->
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
                                    <div style="font-weight: bold; color: #909399"
                                        class="u-flex u-row-left u-col-center u-m-t-10">
                                        <div>
                                            <span>操作人：</span>
                                        </div>
                                        <div>
                                            <span>{{ activity.lastModifierUserName }}</span>
                                        </div>
                                    </div>
                                    <div class="u-m-t-10">
                                        <div class="u-m-t-5 u-font-12">
                                            <el-input :disabled="!editLogFlag" v-model="activity.remark" :rows="2"
                                                type="textarea" placeholder="更新日志记录内容" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-scrollbar>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog title="新增标准工艺" v-model="addDialogFlag" :close-on-click-modal="false" width="40%">
            <div style="width: 70%;">
                <div>
                    <el-form :model="data.dialogAddProcessForm">
                        <el-form-item label="标准工艺名称" label-width="150px">
                            <el-input v-model="data.dialogAddProcessForm.standardProcessName"></el-input>
                        </el-form-item>
                        <el-form-item label="选择文件" label-width="150px">
                            <el-upload   style="width: 100%;" ref="upload" :action="uploadAction" :limit="1"
                                :show-file-list="showUploadFile"
                                :on-remove="onFileRemove"
                                :on-error="uploadErrror"
                                :on-success="uploadSuccess"
                                :on-exceed="handleExceed">
                                <template #trigger>
                                    <el-button type="primary">标准工艺库导入</el-button>
                                </template>
                            </el-upload>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <template #footer>
                <div class="u-flex u-row-right u-col-center">
                    <div class="u-m-l-20">
                        <el-button @click="cancelAddProcess">取消</el-button>
                        <el-button type="primary" @click="confirmAddProcess">确认</el-button>
                    </div>
                </div>
            </template>
        </el-dialog>
        <!-- 提交 -->
        <el-dialog width="95%" title="标准工艺数据导入确认" v-model="processDialogTableFlag" :close-on-click-modal="false"
            :fullscreen="false">
            <div v-if="data.exportTableData&&data.exportTableData.length>0">
                <custom-table-form-list :data-arr="data.exportTableData"></custom-table-form-list>
            </div>
            <template #footer>
                <div class="u-flex u-row-right u-col-center">
                    <div class="u-m-l-20">
                        <template v-if="viewFlag == true">
                            <el-button @click="closeViewDialog()">关闭</el-button>
                        </template>
                        <template v-else>
                            <el-button @click="cancelSaveProcess">取消</el-button>
                            <el-button type="primary" @click="confirmSaveProcess">保存</el-button>
                        </template>
                    </div>
                </div>
            </template>
        </el-dialog>

    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { formatDateTime } from "@/utils";
import { getListAll, getDetail, create, uploadAction, update, deleteProcess, getProcessLog, saveProcessLog,exportDownload } from "@/api/standardProcess";
import customTableFormList from "@/components/processHoursExport/custom-table-form-list.vue"
import {deleteFoundationEmc} from "@/api/foundationEmc";
const data = reactive({
    queryForm: {
        standardProcessName: '',
    },
    dialogAddProcessForm: {
        standardProcessName: '',
    },
    exportTableData: []
})
const addDialogFlag = ref(false);
const processDialogTableFlag = ref(false);
const standardProcessList = ref([]);

onMounted(async () => {
    initData();
})
//初始化加载数据
const initData = () => {
    getStandardProcessList()
    getProcessOptionLog()
}
//获取列表
const getStandardProcessList =async () => {
    let param = {
        name: data.queryForm.standardProcessName
    }
    await getListAll(param).then((response: any) => {
        if (response.success) {
            let data = response.result;
            console.log("标准工艺列表", data);
            standardProcessList.value = data;
        } else {
            ElMessage({
                type: 'error',
                message: '列表加载失败'
            })
        }
    })
}
//搜索
const submitSearch = () => {
    initData();
}

//上传相关
const upload = ref<UploadInstance>()
const showUploadFile=ref(false)
const handleExceed: UploadProps['onExceed'] = (files) => {
    showUploadFile.value=false;
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const onFileRemove=(uploadFile: any, uploadFiles: any)=>{
    showUploadFile.value=false;
    data.exportTableData =[];
}

//上传成功,响应数据渲染到工序弹窗里面
const uploadSuccess = (response: any, uploadFile: any, uploadFiles: any) => {
    console.log("responese", response);
    console.log("uploadFile", uploadFile);
    console.log("uploadFiles", uploadFiles);
    if (response && response.success) {
        ElMessage({
            type: "success",
            message: '导入成功'
        })
        showUploadFile.value=true;
        data.exportTableData = response.result;
        return;
    } else {
        ElMessage({
            type: "error",
            message: '导入失败'
        })
        return;
    }
}
//上传失败
const uploadErrror = (error: Error, uploadFile: any, uploadFiles: any) => {
    console.log("error", error);
    console.log("uploadFile", uploadFile);
    console.log("uploadFiles", uploadFiles);
    showUploadFile.value=false;
    ElMessage({
        type: "error",
        message: '导入失败'
    })
    return;
}


//打开新增标准工艺弹窗
const addStandardProcess = () => {
    data.exportTableData = [];
    data.dialogAddProcessForm.standardProcessName = "";
    addDialogFlag.value = true;
}
//取消新增,关闭弹窗
const cancelAddProcess = () => {
    addDialogFlag.value = false;
    currentUpdateID.value = 0;
    data.dialogAddProcessForm.standardProcessName = "";
}
//提交新增
const confirmAddProcess = () => {
    if (data.dialogAddProcessForm.standardProcessName.length < 1) {
        ElMessage({
            type: 'warning',
            message: '标准工艺名称不能为空'
        })
        return;
    }
    if (data.exportTableData==null||data.exportTableData.length < 1) {
        ElMessage({
            type: 'warning',
            message: '导入数据不能为空'
        })
        return;
    }
    //关闭新增弹窗
    addDialogFlag.value = false;
    //打开工弹窗
    processDialogTableFlag.value = true;
}

//取消工序保存
const cancelSaveProcess = () => {
    processDialogTableFlag.value = false;
    currentUpdateID.value = 0;
    addDialogFlag.value = false;
}
//提交工序保存
const confirmSaveProcess = () => {
    //编辑
    if (currentUpdateID.value&&currentUpdateID.value!=0) {
        standardProcessList.value.map(function (item: any) {
            if (item.id == currentUpdateID.value) {
                item.name = data.dialogAddProcessForm.standardProcessName;
                item.list = data.exportTableData;
                update(item).then((response: any) => {
                    console.log("修改响应", response);
                    if (response.success) {
                        ElMessage({
                            type: 'success',
                            message: '修改成功'
                        })
                        initData()
                        return;
                    } else {
                        ElMessage({
                            type: 'error',
                            message: '编辑保存失败'
                        })
                        return;
                    }
                })
            }
        })
    }
    //新增
    else {
        let param: any = {
            id: 0,
            name: data.dialogAddProcessForm.standardProcessName,
            list: data.exportTableData
        };
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
    currentUpdateID.value = 0;
    addDialogFlag.value = false;
    processDialogTableFlag.value = false;
}
//查看弹窗
const viewFlag = ref(false)

//查看
const handleView = (index: number, row: any) => {
    if(row.list==null||row.list.length<1){
        ElMessage({
            type: 'warning',
            message: '数据为空'
        })
        return;
    }
    data.exportTableData = row.list;
    viewFlag.value = true;
    processDialogTableFlag.value = true;

}
//关闭弹窗
const closeViewDialog = () => {
    viewFlag.value = false;
    processDialogTableFlag.value = false;
}
//开启编辑
const currentUpdateID = ref(0)
//编辑
const handleEdit = (index: number, row: any) => {
    currentUpdateID.value = row.id;
    data.dialogAddProcessForm.standardProcessName = row.name;
    data.exportTableData = row.list;
    viewFlag.value = false;
    addDialogFlag.value = true;
}
//删除
const handleDelete = (index: number, row: any) => {
    ElMessageBox.confirm("是否确认删除!").then(function () {
        standardProcessList.value.splice(index, 1);
      return deleteProcess(row.id)
    }).then(() => {

        initData()
        ElMessage({
            type: "success",
            message: "删除成功"
        })
    })
        .catch(() => { })
}


const exportData = (index: number, row: any) => {

  exportDownload(row.id).then((response: any) => {
    if (response) {
      const data = new Blob([response],{ type: 'application/octet-stream'});
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download',"标准工艺库.xlsx");
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
const downLoadStandardProcess= async () => {
  const link = document.createElement('a')
  link.href = import.meta.env.VITE_BASE_API + "/Excel/标准工艺库导入.xlsx"
  link.download = '标准工艺库导入.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

//#region
const editLogFlag = ref(false);
const baseLibLogRecords = ref([])
//获取日志记录
const getProcessOptionLog = () => {
    let data = {
        Type: 9
    };
    getProcessLog(data).then((response: any) => {
        console.log("======工序日志结果 ===response=======", response);
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
//保存日志
const saveLog = async () => {
    let data = JSON.parse(JSON.stringify(baseLibLogRecords.value))
    await saveProcessLog({
        listFoundationLogs: data
    }).then((response: any) => {
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
//#endregion

</script>
<style></style>
