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
            <div>
                <el-button type="primary">设备库导入</el-button>
                <el-button type="primary">新增设备</el-button>
            </div>
            <div>
                <el-button type="primary">设备库导出</el-button>
                <el-button type="primary">设备库模板下载</el-button>
            </div>
        </div>
        <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
            <div class="table-box">
                <el-table :data="data.tableData" style="width: 100%;" :scrollbar-always-on="false" max-height="400" border>
                    <el-table-column label="序号" type="index" width="80" align="center" />
                    <el-table-column label="工序编号" :width="data.tableColumnWidth" align="center">
                        <template #default="scope">
                            <div>
                                <el-select :disabled="data.currentEditProcessIndex != scope.row.processIndex"
                                    v-model="scope.row.processIndex" filterable remote reserve-keyword
                                    :remote-method="remoteMethodForprocessIndex"
                                    @change="processIndexChange($event, scope.$index)" :loading="data.optionLoading">
                                    <el-option v-for="item in data.processIndexOptions" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="工序名称" :width="data.tableColumnWidth" align="center">
                        <template #default="scope">
                            <div>
                                <el-select :disabled="data.currentEditProcessIndex != scope.row.processIndex"
                                    v-model="scope.row.processName" filterable remote reserve-keyword
                                    :remote-method="remoteMethodForProcessName"
                                    @change="processNameChange($event, scope.$index)" :loading="data.optionLoading">
                                    <el-option v-for="item in data.processNameOptions" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <template v-for="(device,deviceIndex) in data.tableData.deviceList"> 
                        <el-table-column label="设备信息" align="center">
                        
                                
                        
                        </el-table-column>
                    </template>
                    <el-table-column label="设备维护人" :width="data.tableColumnWidth" align="center">
                        <template #default="scope">
                            <div>
                                <el-input v-model="scope.row.deviceManager"
                                    :disabled="data.currentEditProcessIndex != scope.row.processIndex"
                                    placeholder="请输入设备维护人" />
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="设备维护时间" :width="data.tableColumnWidth" align="center">
                        <template #default="scope">
                            <div>
                                <el-date-picker v-model="scope.row.deviceManageTime"
                                    :disabled="data.currentEditProcessIndex != scope.row.processIndex" type="datetime"
                                    value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange" :disabled-date="disabledDate"
                                    placeholder="请输入设备维护时间" />
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" :width="data.tableColumnWidth" align="center" fixed="right">
                        <template #default="scope">
                            <template v-if="data.currentEditProcessIndex == scope.row.processIndex">
                                <el-button size="small" @click="cancelEdit(scope.$index, scope.row)">取消</el-button>
                                <el-button type="primary" @click="saveEdit(scope.$index, scope.row)"
                                    size="small">保存</el-button>
                            </template>
                            <template v-else>
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            </template>
                            <el-button size="small" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="data.tableData.length >= 10" class="u-flex u-row-center u-col-center u-m-t-20">
                <div>
                    <el-pagination :page-size="10" :pager-count="5" layout="prev, pager, next"
                        :total="data.tableData.length" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus"
interface selectOptionListItem {
    value: string
    label: string
}
const data = reactive<any>({
    queryForm: {
        deviceName: ''
    },
    tableColumnWidth: 200,
    tableData: [],
    currentEditProcessIndex: '',
    optionLoading: false,
    processIndexOptions: <Array<selectOptionListItem>>[],
    processNameOptions: <Array<selectOptionListItem>>[],
})

onMounted(() => {
    initData();
})

const initData = () => {
    data.tableData = [{
        processIndex: '0001',
        processName: '工序1',
        deviceManager: '张三',
        deviceManageTime: '2023--7-20',
        deviceList: [
            {
                deviceName: '工序1-设备1',
                deviceStatus: '工序1-设备1状态',
                devicePrice: '工序1-设备1价格',
                deviceProvider: '工序1-设备1供应商'
            },
            {
                deviceName: '工序1-设备2',
                deviceStatus: '工序1-设备2状态',
                devicePrice: '工序1-设备2价格',
                deviceProvider: '工序1-设备2供应商'
            },
        ]
    },
    {
        processIndex: '0002',
        processName: '工序2',
        deviceManager: '李四',
        deviceManageTime: '2023--7-19',
        deviceList: [
            {
                deviceName: '工序2-设备1',
                deviceStatus: '工序2-设备1状态',
                devicePrice: '工序2-设备1价格',
                deviceProvider: '工序2-设备1供应商'
            },
            {
                deviceName: '工序2-设备2',
                deviceStatus: '工序2-设备2状态',
                devicePrice: '工序2-设备2价格',
                deviceProvider: '工序2-设备2供应商'
            }
        ]
    }
    ]
}
const submitSearch = () => {
    console.log('搜索设备')
}

//选择查询回调
const remoteMethodForprocessIndex = (query: string) => {
    if (query) {
        data.optionLoading = true;
        setTimeout(() => {
            data.optionLoading = false;
            data.processIndexOptions = getprocessIndex(query);
        }, 200)
    } else {
        data.processIndexOptions = []
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

//模糊查询工序名称
const remoteMethodForProcessName = (query: string) => {
    if (query) {
        data.optionLoading = true;
        setTimeout(() => {
            data.optionLoading = false;
            data.processNameOptions = getProcessName(query);
        }, 200)
    } else {
        data.processNameOptions = []
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

const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}

const timeChange = (val: string) => {
    console.log("维护时间发生了变化", val);
}

let currentEditProcessItem: any = null;

const handleEdit = (index: number, row: any) => {
    console.log(index, row);
    data.currentEditProcessIndex = row.processIndex;
    currentEditProcessItem = JSON.parse(JSON.stringify(row));
}

const cancelEdit = (index: number, row: any) => {
    console.log("currentEditProcessItem", currentEditProcessItem);
    data.tableData[index] = currentEditProcessItem;
    data.currentEditProcessIndex = "";
}

const saveEdit = (index: number, row: any) => {
    console.log("保存编辑内容", row);
    data.currentEditProcessIndex = "";
}

const handleDelete = (index: number, row: any) => {
    console.log(index, row);
    ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        data.tableData.splice(index);
        ElMessage({
            type: "success",
            message: "删除成功"
        })
    })
}



defineExpose({
    data
})
</script>