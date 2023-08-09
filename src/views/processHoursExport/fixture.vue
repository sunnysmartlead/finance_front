<template>
    <div class="u-p-20">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item label="设备名称">
                    <el-input v-model="queryForm.deviceName" placeholder="输入设备名称" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="u-flex u-row-between u-col-center u-m-t-10">
            <div>
                <el-button type="primary">治具库导入</el-button>
                <el-button type="primary" @click="addDevice">新增治具</el-button>
            </div>
            <div>
                <el-button type="primary">治具库导出</el-button>
                <el-button type="primary">治具库模板下载</el-button>
            </div>
        </div>
        <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
            <el-scrollbar wrap-style="padding:10px 0px" always :max-height="500">
                <!-- 表头 -->
                <div class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <div class="u-width-150  u-border u-height-60"><span>序号</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
                    </div>
                    <div class="u-text-center">
                        <div class="u-text-center u-border  u-p-t-5 u-p-b-5" style="background-color:#79bbff;">治具部分</div>
                        <div class="u-flex u-row-left u-col-center  u-text-center">
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
                        </div>
                    </div>
                    <div class="u-flex u-row-left u-col-center  u-text-center">

                        <div class="u-width-150 u-border u-height-60"><span>检具名称</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>检具状态</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>检具单价</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>检具供应商</span></div>
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
                                    <el-input v-model="dataItem.processNumber" style="border: none;"
                                        :disabled="data.currentEditProcessIndex != dataIndex" />
                                </div>
                                <div class="u-width-150 u-border">
                                    <el-input v-model="dataItem.processName" style="border: none;"
                                        :disabled="data.currentEditProcessIndex != dataIndex" />
                                </div>
                            </div>

                            <div class="u-text-center">
                                <div class="u-flex u-row-left u-col-center  u-text-center">
                                    <div v-for="(deviceItem, deviceIndex) in dataItem.fixtureList" :key="deviceIndex"
                                        class="u-flex u-row-left u-col-center u-text-center">
                                        <div class="u-width-200   u-border">
                                            <el-input v-model="deviceItem.fixtureName"
                                                :disabled="data.currentEditProcessIndex != dataIndex" />
                                        </div>
                                        <div class="u-width-200   u-border">
                                          <el-input v-model="deviceItem.fixtureState"
                                                    :disabled="data.currentEditProcessIndex != dataIndex" />
                                        </div>
                                        <div class="u-width-200   u-border">
                                            <el-input-number v-model="deviceItem.fixturePrice" :min="1" :precision="2"
                                                :disabled="data.currentEditProcessIndex != dataIndex" :step="0.01" />
                                        </div>
                                        <div class="u-width-200   u-border">
                                            <el-input v-model="deviceItem.fixtureProvider"
                                                :disabled="data.currentEditProcessIndex != dataIndex" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="u-flex u-row-left u-col-center  u-text-center">
                                <div class="u-width-150  u-border">
                                    <el-input v-model="dataItem.fixtureGaugeName" style="border: none;"
                                        :disabled="data.currentEditProcessIndex != dataIndex" />
                                </div>
                              <div class="u-width-150  u-border">
                                <el-input v-model="dataItem.fixtureGaugeState" style="border: none;"
                                          :disabled="data.currentEditProcessIndex != dataIndex" />
                              </div>
                              <div class="u-width-150  u-border">
                                <el-input-number v-model="dataItem.fixtureGaugePrice" style="border: none;"
                                          :disabled="data.currentEditProcessIndex != dataIndex" />
                              </div>
                              <div class="u-width-150  u-border">
                                <el-input v-model="dataItem.fixtureGaugeBusiness" style="border: none;"
                                          :disabled="data.currentEditProcessIndex != dataIndex" />
                              </div>
                              <div class="u-width-150  u-border">
                                <el-input v-model="dataItem.lastModifierUserName" style="border: none;"
                                          disabled />
                              </div>
                                <div class="u-width-200 u-border">
                                    <!-- <el-input v-model="dataItem.deviceManageTime"  style="border: none;" /> -->
                                    <el-date-picker v-model="dataItem.lastModificationTime" style="width: 200px;"
                                        disabled type="datetime"
                                        value-format="YYYY-MM-DD hh:mm:ss" @change="timeChange"
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
                                        <el-button type="danger" size="small"
                                            @click="handleDelete(dataItem)">删除</el-button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </template>
            </el-scrollbar>
        </div>


    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
        <el-scrollbar  :min-size="10">
        <div class="u-flex u-row-between u-col-center  u-p-r-20">
          <div>日志更新记录：</div>
          <div>
              <el-button v-if="editLogFlag==false" type="primary" @click="editLogFlag=true">编辑</el-button>
              <el-button v-else @click="editLogFlag=false">取消</el-button>
              <el-button type="primary" @click="saveLog">保存</el-button>
          </div>
        </div>
        <div class="u-m-t-20">
          <el-timeline>
              <el-timeline-item placement="top"
                  v-for="(activity, index) in baseLibLogRecords" :key="index"
                  :timestamp="activity.timestamp">
                 <div class="u-p-10 u-border-bottom u-font-12">
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
                          <span>{{activity.optionUser}}</span>
                        </div>
                      </div>
                      <div class="u-m-t-10">
                          <div class="u-m-t-5 u-font-12">
                              <el-input :disabled="!editLogFlag" v-model="activity.content" :rows="2"
                            type="textarea" placeholder="更新日志记录内容"/>
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
import { reactive, toRefs, onMounted,ref } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus"
import {getListAll,updateFoundationFixture,createFoundationFixture,deleteFoundationPFoundationFixture} from "@/api/foundationFixtureDto";
interface selectOptionListItem {
    value: string
    label: string
}
const data = reactive<any>({
    tableColumnWidth: 200,
    tableData: [],
    currentEditProcessIndex: -1,
    optionLoading: false,
    processIndexOptions: <Array<selectOptionListItem>>[],
    processNameOptions: <Array<selectOptionListItem>>[],
})
//查询关键字
const queryForm = reactive({
  deviceName: ''
})
let currentEditProcessItem: any = null;
onMounted(() => {
    initData();
})

const initData = async () => {
  let listResult: any = await getListAll({DeviceName: queryForm.deviceName})
  if (listResult.success) {
    data.tableData = listResult.result
  }
}

const addDevice = () => {
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
    currentEditProcessItem= item;
    data.currentEditProcessIndex = data.tableData.length - 1;
}

const submitSearch = () => {
    console.log('搜索设备')
    initData()
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


const handleEdit = (index: number, row: any) => {
    console.log(index, row);
    data.currentEditProcessIndex = index;
    currentEditProcessItem = JSON.parse(JSON.stringify(row));
}

const cancelEdit = (index: number, row: any) => {
    data.currentEditProcessIndex = -1;
    data.tableData[index] = currentEditProcessItem;
}


//新增或者修改
const saveEdit = async (index: number, row: any) => {
  console.log("保存编辑内容", row);
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
    let a ={
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
    .catch(() => {})
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
    data,
    ...toRefs(data),
    editLogFlag,
    baseLibLogRecords
})
</script>
