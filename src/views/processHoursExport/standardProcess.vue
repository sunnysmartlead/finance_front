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
            </div>
        </div>
        <div class="u-m-t-10">
            <el-table :data="data.standardProcessList" :border="true">
                <el-table-column label="序号" type="index" min-width="80px" align="center" />
                <el-table-column prop="standardProcessName" label="标准工艺名称" align="center" />
                <el-table-column prop="manageTime" label="维护时间" align="center" />
                <el-table-column prop="manager" label="维护人" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default>
                        <el-button type="info" size="small">查看</el-button>
                        <el-button type="primary" size="small">编辑</el-button>
                        <el-button type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                            <div class="u-p-10 u-font-12">
                                <div style="font-weight: bold;color: #909399;">
                                    <span>版本号：</span>
                                    <span>{{ activity.version }}</span>
                                </div>
                                <div>
                                    <div style="font-weight: bold;color: #909399;"
                                        class="u-flex u-row-left u-col-center u-m-t-10">
                                        <div>
                                            <span>操作人：</span>
                                        </div>
                                        <div>
                                            <span>{{ activity.optionUser }}</span>
                                        </div>
                                    </div>
                                    <div class="u-m-t-10">
                                        <div class="u-m-t-5 u-font-12">
                                            <el-input :disabled="!editLogFlag" v-model="activity.content" :rows="2"
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

        <el-dialog title="新增标准工艺" v-model="data.addDialogFlag" :close-on-click-modal="false" width="40%">
            <div style="width: 70%;">
                <div>
                    <el-form :model="data.dialogAddProcessForm">
                        <el-form-item label="标准工艺名称" label-width="150px">
                            <el-input v-model="data.dialogAddProcessForm.standardProcessName"></el-input>
                        </el-form-item>
                        <el-form-item label="维护人" label-width="150px">
                            <el-input v-model="data.dialogAddProcessForm.manager"></el-input>
                        </el-form-item>
                        <el-form-item label="选择文件" label-width="150px">
                            <el-upload class="upload-demo" ref="upload"
                                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1"
                                :on-error="uploadErrror" :on-success="uploadSuccess" :on-exceed="handleExceed">
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

        <el-dialog   width="95%"
                     title="标准工艺数据导入确认"
                     v-model="data.processDialogTableFlag"
                    :close-on-click-modal="false"
                    :fullscreen="false">
            <div>
                <custom-table-form-list :data-arr="data.exportTableData"></custom-table-form-list>
            </div>
            <template #footer>
                <div class="u-flex u-row-right u-col-center">
                    <div class="u-m-l-20">
                        <el-button @click="cancelSaveProcess">取消</el-button>
                        <el-button type="primary" @click="confirmSaveProcess">保存</el-button>
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
import customTableFormList from "@/components/processHoursExport/custom-table-form-list.vue"
const data = reactive({
    queryForm: {
        standardProcessName: '',
    },
    addDialogFlag: false,
    standardProcessList: [],
    dialogAddProcessForm: {
        standardProcessName: '',
        manager: ''
    },
    processDialogTableFlag: false,
    exportTableData: []
})

onMounted(async () => {
    data.standardProcessList = await initData();
})


const initData = () => {
    let res: any = [
        {
            id: '',
            standardProcessName: '标准工艺名称',
            manageTime: '维护时间',
            manager: '维护人'
        }
    ];
    return res;
}

const submitSearch = () => {
    console.log("搜索");
    ElMessage({
        type: "info",
        message: "搜索标准工艺:" + data.queryForm.standardProcessName
    })
}

const addStandardProcess = () => {
    data.addDialogFlag = true;
}
const cancelAddProcess = () => {
    data.addDialogFlag = false;
    data.dialogAddProcessForm.manager = "";
    data.dialogAddProcessForm.standardProcessName = "";
}

const confirmAddProcess =  () => {
    if (data.dialogAddProcessForm.standardProcessName.length < 1) {
        ElMessage({
            type: 'warning',
            message: '标准工艺名称不能为空'
        })
        return;
    }
    if (data.dialogAddProcessForm.manager.length < 1) {
        ElMessage({
            type: 'warning',
            message: '维护人不能为空!'
        })
        return;
    }
    console.log(data.dialogAddProcessForm);
    data.addDialogFlag = false;
    data.exportTableData = getFileTableData();
    data.processDialogTableFlag = true;
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
}
const uploadErrror = (error: Error, uploadFile: any, uploadFiles: any) => {
    console.log("error", error);
    console.log("uploadFile", uploadFile);
    console.log("uploadFiles", uploadFiles);
}

const getFileTableData = () => {
   let res: any = [
        {
            processIndex: '000111',
            processName: '工序1',
            deviceInfo: {
                deviceArr: [
                    {
                        deviceName: '设备1',
                        deviceStatus: '正常',
                        deviceCount: 1,
                        devicePrice: 100.00
                    },
                    {
                        deviceName: '设备2',
                        deviceStatus: '离线',
                        deviceCount: 2,
                        devicePrice: 200.00
                    },
                    {
                        deviceName: '设备3',
                        deviceStatus: '待维修',
                        deviceCount: 3,
                        devicePrice: 300.00
                    },
                ],
                deviceTotalCost: 1400.00
            },
            developCostInfo: {
                hardwareInfo: [
                    {
                        hardwareDeviceName: '硬件设备1',
                        hardwareDeviceCount: 1,
                        hardwareDevicePrice: 100.00
                    },
                    {
                        hardwareDeviceName: '硬件设备2',
                        hardwareDeviceCount: 2,
                        hardwareDevicePrice: 200.00
                    }
                ],
                hardwareTotalCost: 500.00,
                kaiTuSoft: '开图软件',
                kaiTuCost: 1000.00,
                zhuiSuSoft: '追溯软件',
                developCost_zhuisu: 22222.22,
                developTotalCost: 1500.00
            },
            toolInfo: {
                zhiJuArr: [
                    {
                        zhiJuName: '治具1',
                        zhiJuCount: 1,
                        zhiJuPrice: 500.00
                    },
                    {
                        zhiJuName: '治具2',
                        zhiJuCount: 1,
                        zhiJuPrice: 500.00
                    }
                ],
                jianJu: {
                    jianJuName: '检具1',
                    jianJuCount: 1,
                    jianJuPrice: 1000.00
                },
                gongZhuang: {
                    gongZhuangName: '工装1',
                    gongZhuangCount: 1,
                    gongZhuangPrice: 3000.00
                },
                testLine: {
                    testLineName: '测试线名称',
                    testLineCount: 1,
                    testLinePrice: 5000
                },
                toolTotalCost: 10000.00
            },
            sopInfo: [
                {
                    year: '2023',
                    manWorkHour: 8,
                    manNumber: 1,
                    machineWorkHour: 4,
                },
                {
                    year: '2024',
                    manWorkHour: 18,
                    manNumber: 11,
                    machineWorkHour: 14,
                }
            ]
        },

     {
       processIndex: '000111',
       processName: '工序1',
       deviceInfo: {
         deviceArr: [
           {
             deviceName: '设备1',
             deviceStatus: '正常',
             deviceCount: 1,
             devicePrice: 100.00
           },
           {
             deviceName: '设备2',
             deviceStatus: '离线',
             deviceCount: 2,
             devicePrice: 200.00
           },
           {
             deviceName: '设备3',
             deviceStatus: '待维修',
             deviceCount: 3,
             devicePrice: 300.00
           },
         ],
         deviceTotalCost: 1400.00
       },
       developCostInfo: {
         hardwareInfo: [
           {
             hardwareDeviceName: '硬件设备1',
             hardwareDeviceCount: 1,
             hardwareDevicePrice: 100.00
           },
           {
             hardwareDeviceName: '硬件设备2',
             hardwareDeviceCount: 2,
             hardwareDevicePrice: 200.00
           }
         ],
         hardwareTotalCost: 500.00,
         kaiTuSoft: '开图软件',
         kaiTuCost: 1000.00,
         zhuiSuSoft: '追溯软件',
         developCost_zhuisu: 22222.22,
         developTotalCost: 1500.00
       },
       toolInfo: {
         zhiJuArr: [
           {
             zhiJuName: '治具1',
             zhiJuCount: 1,
             zhiJuPrice: 500.00
           },
           {
             zhiJuName: '治具2',
             zhiJuCount: 1,
             zhiJuPrice: 500.00
           }
         ],
         jianJu: {
           jianJuName: '检具1',
           jianJuCount: 1,
           jianJuPrice: 1000.00
         },
         gongZhuang: {
           gongZhuangName: '工装1',
           gongZhuangCount: 1,
           gongZhuangPrice: 3000.00
         },
         testLine: {
           testLineName: '测试线名称',
           testLineCount: 1,
           testLinePrice: 5000
         },
         toolTotalCost: 10000.00
       },
       sopInfo: [
         {
           year: '2023',
           manWorkHour: 8,
           manNumber: 1,
           machineWorkHour: 4,
         },
         {
           year: '2024',
           manWorkHour: 18,
           manNumber: 11,
           machineWorkHour: 14,
         }
       ]
     }
    ]
    console.log(JSON.stringify(res));
    return res;
}

const cancelSaveProcess = () => {
    data.processDialogTableFlag=false;
}

const confirmSaveProcess = async () => {
    data.processDialogTableFlag=false;
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
</script>
<style></style>
