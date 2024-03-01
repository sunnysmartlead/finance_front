<template>
    <div class="u-p-20">
        <div>
            <el-form :inline="true" :model="data.queryForm" class="demo-form-inline">
                <el-form-item label="设备名称">
                    <el-input v-model="data.queryForm.deviceName" placeholder="输入设备名称" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="u-flex u-row-between u-col-center u-m-t-10">

            <div class="u-flex u-row-left u-col-center">
                <div class="u-m-r-20">
                    <el-upload class="upload-demo" ref="upload" accept=".xls,.xlsx" :show-file-list="false"
                        :on-error="uploadErrror" :on-success="uploadSuccess" :on-exceed="handleExceed"
                        :headers="AuthorizationdDta"
                        :action="uploadAction">
                        <template #trigger>
                            <el-button type="primary">设备库导入</el-button>
                        </template>
                    </el-upload>
                </div>
                <div>
                    <el-button type="primary" :disabled="addFlag == true" @click="addDevice">新增设备</el-button>
                </div>
            </div>

            <div>
                <el-button type="primary" @click="exportList">设备库导出</el-button>
                <el-button @click="downLoad" type="primary">设备库模板下载</el-button>
            </div>
        </div>
        <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
            <el-scrollbar wrap-style="padding:0px 0px 10px 0px" always :max-height="600">
                <!-- 表头 -->
                <div class="u-flex u-row-left u-col-center u-text-center u-head-stop">
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <div class="u-width-150  u-border u-height-60"><span>序号</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
                    </div>
                    <div class="u-text-center">
                        <div class="u-text-center u-border  u-p-t-5 u-p-b-5" style="background-color:#79bbff;"
                            :style="data.tableData.length < 1 ? 'min-width: 300px;min-height:50px;line-height: 50px' : ''">
                            设备部分
                        </div>
                        <div v-if="data.tableData[0]?.deviceList.length > 0"
                            class="u-flex u-row-left u-col-center  u-text-center">
                            <div v-for="index in data.tableData[0]?.deviceList.length" :key="index"
                                class="u-flex u-row-left u-col-center u-text-center">
                                <div class="u-width-200 u-border   u-p-t-5 u-p-b-5" style="background-color: #f29100;">
                                    <span>设备{{ index }}名称</span>
                                </div>
                                <div class="u-width-200  u-border   u-p-t-5 u-p-b-5" style="background-color: #eebe77;">
                                    <span>设备{{ index }}状态</span>
                                </div>
                                <div class="u-width-200  u-border   u-p-t-5 u-p-b-5">
                                    <span>设备{{ index }}单价</span>
                                </div>
                                <div class="u-width-200  u-border   u-p-t-5 u-p-b-5">
                                    <span>设备{{ index }}供应商</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <div class="u-width-150 u-border u-height-60"><span>设备维护人</span></div>
                        <div class="u-width-200 u-border u-height-60"><span>设备维护时间</span></div>
                        <div class="u-width-300 u-border u-height-60"><span>操作</span></div>
                    </div>
                </div>

                <div v-if="data.tableData?.length > 0">
                    <div v-for="(dataItem, dataIndex) in data.tableData" :key="dataIndex"
                        class="u-flex u-row-left u-col-center u-text-center">
                        <div class="u-flex u-row-left u-col-center  u-text-center">
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5"><span>{{ dataIndex + 1 }}</span></div>
                            <div class="u-width-150 u-border">
                                <el-select :disabled="data.currentEditProcessIndex != dataIndex"
                                    v-model="dataItem.processNumber" filterable remote reserve-keyword
                                    :remote-method="remoteMethodForProcessNumber"
                                    @change="processNumberChange($event, dataIndex)" :loading="optionLoading">
                                    <el-option v-for="item in processNumberOptions" :key="item.id"
                                        :label="item.processNumber" :value="item.processNumber" />
                                </el-select>
                            </div>
                            <div class="u-width-150 u-border">
                                <el-select v-model="dataItem.processName" filterable remote reserve-keyword
                                    :disabled="data.currentEditProcessIndex != dataIndex"
                                    :remote-method="remoteMethodForProcessName"
                                    @change="processNameChange($event, dataIndex)" :loading="optionLoading">
                                    <el-option v-for="item in processNameOptions" :key="item.id" :label="item.processName"
                                        :value="item.processName" />
                                </el-select>
                            </div>
                        </div>

                        <div class="u-text-center">
                            <div v-if="dataItem.deviceList && dataItem.deviceList.length > 0"
                                class="u-flex u-row-left u-col-center  u-text-center">
                                <div v-for="(deviceItem, deviceIndex) in dataItem.deviceList"
                                        :key="deviceIndex"
                                    class="u-flex u-row-left u-col-center u-text-center">
                                    <div class="u-width-200   u-border">
                                        <el-input v-model="deviceItem.deviceName"
                                            :disabled="data.currentEditProcessIndex != dataIndex" />
                                    </div>
                                    <div class="u-width-200   u-border">
                                        <el-select  v-model="deviceItem.deviceStatus"
                                            :disabled="data.currentEditProcessIndex != dataIndex">
                                            <el-option v-for="item in deviceStatusEnmus"
                                                        :key="item.code"
                                                        :label="item.value"
                                                        :value="item.code"/>
                                        </el-select>

                                    </div>
                                    <div class="u-width-200   u-border">
                                        <el-input-number @mousewheel.native.prevent v-model="deviceItem.devicePrice" :min="0"
                                            :disabled="data.currentEditProcessIndex != dataIndex"  />
                                    </div>
                                    <div class="u-width-200   u-border">
                                        <el-input v-model="deviceItem.deviceProvider"
                                            :disabled="data.currentEditProcessIndex != dataIndex" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div class="u-flex u-row-left u-col-center  u-text-center">
                            <div class="u-width-150  u-border">
                                <el-input v-model="dataItem.lastModifierUserName" style="border: none;" disabled />
                            </div>
                            <div class="u-width-200 u-border">
                                <!-- <el-input v-model="dataItem.deviceManageTime"  style="border: none;" /> -->
                                <el-date-picker v-model="dataItem.lastModificationTime" style="width: 200px;" disabled
                                    type="datetime" value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange"
                                    :disabled-date="disabledDate" placeholder="请输入工序维护时间" />
                            </div>
                            <div class="u-width-300 u-border  u-flex u-row-around u-col-center  u-text-center">
                                <template v-if="data.currentEditProcessIndex == dataIndex">
                                    <div>
                                        <el-button size="small" @click="cancelEdit(dataIndex, dataItem)">取消</el-button>
                                    </div>
                                    <div>
                                        <el-button type="primary" @click="saveEdit(dataIndex, dataItem)"
                                            size="small">保存</el-button>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="u-p-t-4 u-p-b-4">
                                        <el-button type="primary" size="small"
                                            @click="handleEdit(dataIndex, dataItem)">编辑</el-button>
                                    </div>
                                </template>
                                <div class="u-p-t-4 u-p-b-4">
                                    <el-button type="danger" size="small" @click="handleDelete(dataItem)">删除</el-button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-else>
                    <div class="u-text-center u-p-t-20 u-p-b-20"
                        style="background-color: #f8f8f8;color: #909399;min-width: 1400px;">
                        <span>暂无数据</span>
                    </div>
                </div>
            </el-scrollbar>
        </div>


        <div v-if="baseLibLogRecords.length > 0" class="u-m-t-20 u-p-10" style="background-color: #ffffff">
            <div class="u-flex u-row-between u-col-center" style="width: 100%;">
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
    </div>
</template>
<script setup lang="ts">
import { formatDateTime } from "@/utils"
import { reactive, toRefs, onMounted, ref } from 'vue';
import {
    getListAll, createFoundationDevice,
    updateFoundationDevice, deleteFoundationPFoundationDevice,
    getDeviceLog,
    saveDeviceLog, exportDevice, uploadAction,getDeviceStatus
} from '@/api/foundationDeviceDto';
import { ElMessage, ElMessageBox, genFileId } from "element-plus"
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import {
    createFoundationProcedure,
    deleteFoundationProcedure,
    updateFoundationProcedure
} from "@/api/foundationProcedure";
import { GetListAll as queryProcessList } from "@/api/process";
import { forIn } from "lodash";
import {getToken} from "@/utils/cookies";
interface selectOptionListItem {
    value: string
    label: string
}
let tableData = ref<any>([])
const data = reactive<any>({
    queryForm: {
        deviceName: ''
    },
    tableColumnWidth: 200,
    tableData: [],
    currentEditProcessIndex: -1,
    optionLoading: false,
    processIndexOptions: <Array<selectOptionListItem>>[],
    processNameOptions: <Array<selectOptionListItem>>[],
})

const deviceStatusEnmus=ref<any>([]);

let currentEditProcessItem: any = null;
onMounted(() => {
    initData();
})
//查询关键字
const queryForm = reactive({
    deviceName: ''
})
const initData = async () => {
    getDeviceStatuEnmu();
    addFlag.value = false;
    data.currentEditProcessIndex = -1;
    let listResult: any = await getListAll({ DeviceName: data.queryForm.deviceName })
    if (listResult.success) {
        data.tableData = listResult.result;
        console.log("工装数据数量", data.tableData.value);
    }
    getDeviceOptionLog()
}

const getDeviceStatuEnmu = () => {
    getDeviceStatus().then((response:any) => {
        console.log("======设备状态列表=======", response);
        if (response.success) {
            deviceStatusEnmus.value=response.result;
        }
    })
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
    if (response.result) {
        initData()
        ElMessage({
            type: 'success',
            message: '导入成功',
        })
    } else {
        ElMessage({
            type: 'error',
            message: response?.error?.message,
        })
    }
}
const AuthorizationdDta = {
  Authorization: "Bearer " + getToken()
}
const uploadErrror = (error: Error, uploadFile: any, uploadFiles: any) => {
    console.log("error", error);
    console.log("uploadFile", uploadFile);
    console.log("uploadFiles", uploadFiles);
    ElMessage({
        type: 'error',
        message: error?.message,
    })
}

const addFlag = ref(false);

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
        deviceList: [
            {
                deviceName: '',
                deviceStatus: '',
                devicePrice: '',
                deviceProvider: ''
            },
            {
                deviceName: '',
                deviceStatus: '',
                devicePrice: '',
                deviceProvider: ''
            },
            {
                deviceName: '',
                deviceStatus: '',
                devicePrice: '',
                deviceProvider: ''
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
    initData();
}

const exportList = () => {
    let param = {
        processName: queryForm.deviceName
    }
    exportDevice(param).then((response: any) => {
        if (response) {
            const data = new Blob([response], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', "设备.xlsx");
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

//下拉选项的数据类型定义
interface selectOptionListItem {
    id: Number,
    processName: String,
    processNumber: String
}
//异步请求loading
const optionLoading = ref(false)
const processNumberOptions = ref<selectOptionListItem[]>([])

//填写工装名称的时候需要从后台模糊查询工装名称,然后下拉选择
const remoteMethodForProcessNumber = async (query: string) => {
    if (query) {
        optionLoading.value = true;
        await getProcessIndex(query);
        optionLoading.value = false;
    } else {
        processNumberOptions.value = []
    }
}
//查询工装名称的方法,用于渲染工装名称下拉框选项
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

//监听工装序号变化
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
//填写工装名称的时候需要从后台模糊查询工装名称,然后下拉选择
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

const downLoad = async () => {
    const link = document.createElement('a')
    link.href = import.meta.env.VITE_BASE_API + "/Excel/设备库导入.xlsx"
    link.download = '设备库导入.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        console.log("编辑设备保存");
        tip = "修改设备";
        result = await updateFoundationDevice(row).catch((error) => {
          initData();
        });
    }
    //新增
    else if (row.id == -1) {
        console.log("新增设备");
        tip = "新增设备";
        let a = {
            "processName": row.processName,
            "processNumber": row.processNumber,
            "deviceList": row.deviceList
        }

        result = await createFoundationDevice(a).catch((error) => {
          initData();
        });
    }
    console.log("结果", result);
    console.log("结果", result);
    if (result.success == true) {
        initData();
    } else {
        initData();
        ElMessage({
            type: 'error',
            message: tip + result.error.message,
        })

    }
}


/** 删除按钮操作 */
function handleDelete(row: any) {
    const postIds = row.id
    ElMessageBox.confirm("是否确认删除!")
        .then(function () {
            return deleteFoundationPFoundationDevice(postIds)
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

const baseLibLogRecords = ref([])

//获取日志记录
const getDeviceOptionLog = () => {
    let data = {
        Type: 5
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
</script>
