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
          <el-button type="primary" >工序库导入</el-button>
          <el-button type="primary" @click="addworkingHours">新增工序</el-button>
        </div>
        <div>
          <el-button type="primary"  >工序库导出</el-button>
          <el-button type="primary" >工序库模板下载</el-button>
        </div>
      </div>
    <div  class="u-m-t-20 u-p-10" style="background-color: #ffffff;">

      <!-- <custom-table-form-list :dataArr="dataArr" @delPH="delPH"></custom-table-form-list> -->
      <el-scrollbar wrap-style="padding:10px 0px" always :max-height="500">
        <!-- 头部区 -->
        <div class="u-flex u-row-left u-col-center u-text-center">
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-100  u-border u-height-60"><span>序号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序维护人</span></div>
          </div>
          <div class="u-text-center" style="background-color: rgb(223, 179, 122);">
            <div class="u-flex u-row-left u-col-center">
              <div v-for="(scopItem, sopIndex) in dataArr[0].sopInfo" :key="sopIndex" class="u-text-center">
                <div class="u-p-t-5 u-p-b-5 u-border"> SOP-{{ scopItem.year }}年 </div>
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

          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-200 u-border u-height-60"><span>操作</span></div>
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
                <el-select v-model="dataItem.processIndex"
                           filterable remote reserve-keyword
                           :remote-method="remoteMethod"
                           :loading="processIndexloading">
                  <el-option v-for="item in processIndexOptions" :key="item.value"
                             :label="item.label" :value="item.value" />
                </el-select>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processName"
                           filterable remote reserve-keyword
                           :remote-method="remoteMethodForProcessName"
                           :loading="processNameLoading">
                  <el-option v-for="item in processNameOptions" :key="item.value"
                             :label="item.label" :value="item.value" />
                </el-select>
              </div>
              <div class="u-width-150 u-border">
                <el-input v-model="dataItem.UserName" />
              </div>
            </div>
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center">
                <div v-for="(scopItem, sopIndex) in dataItem.sopInfo" :key="sopIndex" class="u-text-center">
                  <div class="u-flex u-row-left u-col-center">
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.manWorkHour" :min="1"/>
                    </div>
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.machineWorkHour" :min="1"/>
                    </div>
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.manNumber" :min="1"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-width-200 u-border  u-flex u-row-left u-col-center  u-text-center">
              <div class="u-width-100  u-p-t-5 u-p-b-5">
                <el-button type="primary" size="small">编辑</el-button>
              </div>
              <div class="u-width-100  u-p-t-5 u-p-b-5">
                <el-button type="danger" size="small" @click="delPH(dataIndex)">删除</el-button>
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

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
const currentPlan = ref('1')
const queryForm = reactive({
  processName: ''
})

const dataArr = reactive([
  {
    processIndex: '000111',
    processName: '工序1',
    UserName: '张三',
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
])


onMounted(() => {
  // console.log('数据结构',JSON.stringify(dataArr));
})

//新增工序
const addworkingHours = () => {
  dataArr.push(dataArr[dataArr.length - 1]);
  console.log("新增工序", dataArr.length);
}
//删除工序
const delPH = (index: number) => {
  console.log("====删除下标===", index);
  if (dataArr.length < 2) {
    ElMessage({
      type: "warning",
      message: "至少保留一条记录"
    })
    return;
  }
  ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    dataArr.splice(index);
  })
}

const editLogFlag=ref(false);
const baseLibLogRecords = reactive([
  {
    content: '修改记录1',
    version:'2.0.0',
    timestamp: '2023-07-15',
    optionUser:'张三'
  },
  {
    content: '修改记录2',
    version:'2.0.0',
    timestamp: '2023-07-14',
    optionUser:'张三'
  },
  {
    content: '修改记录3',
    version:'2.0.0',
    timestamp: '2013-07-13',
    optionUser:'张三'
  },
])
const saveLog=()=>{
  console.log(baseLibLogRecords);
  editLogFlag.value=false;
}


const submitSearch=()=>{
  
}










// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(dataArr),
})

</script>

<style scoped>
</style>
<style>

</style>
