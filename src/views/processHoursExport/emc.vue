<template>
  <div class="u-p-20">
    <div>
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="实验分类">
          <el-input v-model="queryForm.processName" placeholder="输入实验分类" clearable />
        </el-form-item>
        <el-form-item label="实验名称">
          <el-input v-model="queryForm.processName" placeholder="输入实验名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-flex u-row-between u-col-center">
      <div>
        <el-button type="primary" @click="submitSearch">表单导入</el-button>
        <el-button type="primary" @click="submitSearch">模版下载</el-button>
        <el-button type="primary" @click="submitSearch">创建实验项目</el-button>
      </div>
    </div>
    <div  class="u-m-t-20 u-p-10" style="background-color: #ffffff;">
      <el-scrollbar wrap-style="padding:10px 0px" :max-height="400" native>
        <div>
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column label="实验分类" align="center" prop="classification">
            </el-table-column>
            <el-table-column label="实验名称" align="center" prop="name"></el-table-column>
            <el-table-column label="单价" align="center" prop="price"></el-table-column>
            <el-table-column label="计价单位" align="center" prop="unit"></el-table-column>
            <el-table-column label="工序维护人" align="center" prop="processManager">
            </el-table-column>
            <el-table-column label="工序维护时间" align="center" prop="processManageTime">
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
const queryForm = reactive({
  processName: ''
})

const tableData = reactive([
  {
    classification: '实验分类',
    processManageTime: '2016-05-03 10:00:00',
    processManager: 'Tom',
    name: '实验名称',
    price: '100',
    unit: '元',
  },
  {
    classification: '实验分类',
    processManageTime: '2016-05-03 10:00:00',
    processManager: 'Tom',
    name: '实验名称',
    price: '100',
    unit: '元',
  },
  {
    classification: '实验分类',
    processManageTime: '2016-05-03 10:00:00',
    processManager: 'Tom',
    name: '实验名称',
    price: '100',
    unit: '元',
  },
  {
    classification: '实验分类',
    processManageTime: '2016-05-03 10:00:00',
    processManager: 'Tom',
    name: '实验名称',
    price: '100',
    unit: '元',
  }
])

const submitSearch = () => {
  console.log('submitSearch!')
}


interface processItem {
  processIndex: string
  processName: string
  processManager: string,
  processManageTime: string
}

const currentEditProcessIndex = ref<string>("")

const handleEdit = (index: number, row: processItem) => {
  console.log(index, row);
  currentEditProcessIndex.value = row.processIndex;
}
const handleDelete = (index: number, row: processItem) => {
  console.log(index, row);
  ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    tableData.splice(index);
    ElMessage({
      type: "success",
      message: "删除成功"
    })
  })
}


const timeChange = (val: string) => {
  console.log("维护时间发生了变化", val);
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

defineExpose({
  ...toRefs(tableData),
})

</script>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
