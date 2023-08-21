<template>
      <!-- 日志记录 -->
      <div  class="u-m-t-20 u-p-10" style="background-color: #ffffff">
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
            <el-timeline-item placement="top" v-for="(activity, index) in props.baseLibLogRecords" :key="index"
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
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
import { formatDateTime } from "@/utils"
import {getLogRecord,saveOptionLog} from "@/api/logRecord"
let props = defineProps(['baseLibLogRecords'])
const emit=defineEmits(["reloadData"])
//-------------------------------------日志更新记录相关代码块 start-------------------
//#region
const editLogFlag = ref(false);
//保存日志方法
const saveLog =async () => {
  let data=JSON.parse(JSON.stringify(props.baseLibLogRecords))
  await saveOptionLog({
    listFoundationLogs:data
    }).then((response) => {
     if(response.success){
      ElMessage({
        type:'success',
        message:'修改成功'
      });
      emit("reloadData")
     }else{
      ElMessage({
        type:'error',
        message:'修改失败'
      });
     }
  })
  editLogFlag.value = false
}
//#endregion
</script>
