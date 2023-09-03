<template>
  <el-card>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <el-scrollbar :min-size="10">
        <div class="u-flex u-row-between u-col-center u-p-r-20">
          <div>日志更新记录：</div>
          <div>
            <el-button v-if="editLogFlag == false" type="primary" @click="editLogFlag = true">编辑</el-button>
            <el-button v-else @click="editLogFlag = false">取消</el-button>
            <el-button type="primary" @click="saveLog">保存</el-button>
          </div>
        </div>
        <div class="u-m-t-20 content-wrap">
          <el-timeline>
            <el-timeline-item placement="top" v-for="(activity, index) in baseLibLogRecords" :key="index"
              :timestamp="formatDateTime(activity.lastModificationTime)">
              <div class="u-p-10 u-border-bottom u-font-12">
                <div style="font-weight: bold; color: #909399">
                  <span>版本号：</span>
                  <span>{{ activity?.version || "--" }}</span>
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
  </el-card>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import {
  getEnvLog,
  saveEnvLog,
} from "@/api/foundationreliable"
import { ElMessage } from "element-plus"
import { cloneDeep } from "lodash"
import { formatDateTime } from "@/utils"

const baseLibLogRecords = ref<any[]>([])
const editLogFlag = ref(false)

export interface LogListAPI {
  onRefresh: () => void
}

const props = defineProps({
  type: Number
})

//获取日志记录
const getEnvOptionLog = () => {
  let data = {
    Type: props.type
  }
  getEnvLog(data).then((response) => {
    baseLibLogRecords.value = response.result
    console.log("======baseLibLogRecords=======", baseLibLogRecords.value);
  })
}

const saveLog = async () => {
  let data = cloneDeep(baseLibLogRecords.value)
  await saveEnvLog({
    listFoundationLogs: data
  }).then((response: any) => {
    if (response.success) {
      ElMessage({
        type: "success",
        message: "修改成功"
      })
      getEnvOptionLog()
    } else {
      ElMessage({
        type: "error",
        message: "修改失败"
      })
    }
  })
  editLogFlag.value = false
}

onMounted(() => {
  getEnvOptionLog()
})
defineExpose({
  onRefresh: () => getEnvOptionLog()
})
</script>

<style lang="scss" scoped>
.content-wrap {
  max-height: 600px;
  overflow-y: auto;
}
</style>
