<template>
  <div class="manager-operate">
    <el-form :model="formData">
      <el-card class="manager-operate__card">
        <h4>核价团队</h4>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="产品部-电子工程师:">
              <SearchDepartMentPerson v-model="formData.electronicEngineerId" roleName="产品开发部-电子工程师" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品部-结构工程师:">
              <SearchDepartMentPerson v-model="formData.structureEngineerId" roleName="产品开发部-结构工程师" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="资源管理部-电子资源开发:">
              <SearchDepartMentPerson v-model="formData.resourceElecId" roleName="资源管理部-电子单价录入员" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源管理部-结构子资源开发:">
              <SearchDepartMentPerson v-model="formData.resourceStructId" roleName="资源管理部-结构单价录入员" />
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="工程技术部-损耗率录入员:">
              <SearchDepartMentPerson v-model="formData.engineerLossRateId" roleName="工程技术部-损耗率录入员" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工程技术部-工序工时录入员:">
              <SearchDepartMentPerson v-model="formData.engineerWorkHourId" roleName="工程技术部-工序工时录入员" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品质保证部-实验费用录入员:">
              <SearchDepartMentPerson v-model="formData.qualityBenchId" roleName="品质保证部-实验费用录入员" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品质保证部-检具费用录入员:">
              <SearchDepartMentPerson v-model="formData.qualityToolId" roleName="品质保证部-检具费用录入员" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="生产管理部-物流成本录入员:">
              <SearchDepartMentPerson v-model="formData.productManageId" roleName="生产管理部-物流成本录入员" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="项目部核价审核员:">
              <SearchDepartMentPerson v-model="formData.projectAuditorId" roleName="项目课长" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="manager-operate__card">
        <h4>核价截止时间</h4>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="营销要求核价完成时间:">
              <el-date-picker type="date" v-model="formData.deadline" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="TR预计提交时间:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.trSubmitTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品部-电子工程师:">
              <el-date-picker type="date" placeholder="请输入预计提交时间" v-model="formData.elecEngineerTime" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品部-结构工程师:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.structEngineerTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品质保证部-实验费用录入员:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.qualityBenchTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品质保证部-检具费用录入员:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.qualityToolTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="资源管理部-电子资源开发:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.resourceElecTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资源管理部-结构资源开发:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.resourceStructTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="工程技术部-损耗率录入员:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.engineerLossRateTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工程技术部-工序工时录入员:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.engineerWorkHourTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生产管理部-物流成本录入员:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.productManageTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制造成本录入员:">
              <el-date-picker
                type="date"
                placeholder="请输入预计提交时间"
                v-model="formData.productCostInputTime"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="manager-operate__card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="是否为首款产品:">
              <el-select v-model="formData.isFirst" placeholder="Select">
                <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="TR-主方案:">
              <el-upload
                v-model:file-list="fileList"
                :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
                :on-progress="handleGetUploadProgress"
                :on-error="handleUploadError"
                :on-success="handleSuccess"
                :limit="1"
                show-file-list
              >
                <el-button type="primary" v-havedone>文件上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="是否NRE核价:">
              <el-select v-model="formData.isNRE" placeholder="Select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-card>
    </el-form>
    <el-button @click="save" type="primary" style="float: right" size="large" v-havedone>保存录入</el-button>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"

import { reactive, onBeforeMount, onMounted, watchEffect, ref, watch, computed } from "vue"
import { SearchDepartMentPerson } from "@/components/SearchDepartMentPerson"
import { PostManagement, getManagement } from "@/api/partEntry"
import type { UploadProps, UploadUserFile } from "element-plus"
import getQuery from "@/utils/getQuery"
import { ElMessage } from "element-plus"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { getPriceEvaluationStartData } from "../demandApply/service"
import dayjs from "dayjs"
let formData: any = reactive({
  fileId: null,
  isFirst: true,
  auditFlowId: null,
  electronicEngineerId: undefined, //产品部-电子工程师
  engineerLossRateId: undefined, //工程技术部-损耗率录入员
  engineerWorkHourId: undefined, //工程技术部-工序工时录入员
  id: 0,
  productId: null,
  productManageId: undefined, //生产管理部-物流成本录入员
  qualityBenchId: undefined, //品质保证部-实验费用录入员
  qualityToolId: undefined, //品质保证部-检具费用录入员
  resourceElecId: 0,
  resourceStructId: 0,
  structureEngineerId: undefined, //产品部-结构工程师
  projectAuditorId: undefined, // 项目部核价审核员
  trSubmitTime: "", // TR预计提交时间
  elecEngineerTime: "", // 产品部-电子工程师期望完成时间
  structEngineerTime: "", // 产品部-结构工程师期望完成时间
  qualityBenchTime: "", // 品质保证部-实验室费用录入员期望完成时间
  qualityToolTime: "", // 品质保证部-检具费用录入员期望完成时间
  resourceElecTime: "", // // 资源管理部-电子资源开发期望完成时间
  resourceStructTime: "", // 资源管理部-结构资源开发期望完成时间
  engineerLossRateTime: "", // 工程技术部-损耗率录入员期望完成时间
  engineerWorkHourTime: "", // 工程技术部-工序工时录入员期望完成时间
  productManageTime: "", // 生成管理部-物流成本录入员期望完成时间
  productCostInputTime: "", // 制造成本录入员期望完成时间
  deadline: undefined
})
const fileList = ref<UploadUserFile[]>([])
const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  if (res.success) {
    formData.fileId = res.result.fileId
    ElMessage.success("上传成功")
  }
}
const options = [
  {
    value: true,
    label: "是"
  },
  {
    value: false,
    label: "否"
  }
]
const save = async () => {
  if (
    !formData.electronicEngineerId ||
    !formData.structureEngineerId ||
    !formData.engineerLossRateId ||
    !formData.engineerWorkHourId ||
    !formData.qualityBenchId ||
    !formData.qualityToolId ||
    !formData.productManageId ||
    !formData.projectAuditorId
  ) {
    ElMessage.warning("请正确选择核价团队")
    return
  }

  let res: any = await PostManagement(formData)
  if (res?.success) {
    ElMessage.success("提交成功")
  }
}

watch(
  () => {
    return formData.trSubmitTime
  },
  (newValue) => {
    if (!formData.trSubmitTime) return
    formData.elecEngineerTime = dayjs(formData.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    formData.structEngineerTime = dayjs(formData.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    formData.qualityBenchTime = dayjs(formData.trSubmitTime).add(2, "day").format("YYYY-MM-DD")
    formData.qualityToolTime = dayjs(formData.trSubmitTime).add(1, "day").format("YYYY-MM-DD")
    formData.resourceElecTime = dayjs(formData.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    formData.resourceStructTime = dayjs(formData.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    formData.engineerLossRateTime = dayjs(formData.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    formData.engineerWorkHourTime = dayjs(formData.trSubmitTime).add(4, "day").format("YYYY-MM-DD")
    formData.productManageTime = dayjs(formData.trSubmitTime).add(3, "day").format("YYYY-MM-DD")
    formData.productCostInputTime = dayjs(formData.trSubmitTime).add(5, "day").format("YYYY-MM-DD")
  },
  { deep: true }
)

/**
 * 仓库
 */
// const store = useStore()
/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  let query = getQuery()
  if (query.auditFlowId) {
    formData.auditFlowId = Number(query.auditFlowId)
    // 查看
    let { result }: any = await getPriceEvaluationStartData(query.auditFlowId)
    if (result) {
      formData.deadline = result.deadline
    }
  }
  if (query.productId) {
    formData.productId = Number(query.productId)
  }
  if (query.auditFlowId) {
    let res: any = await getManagement(query.auditFlowId)
    let keys = Object.keys(formData)
    keys.forEach((key) => {
      if (key != "deadline") formData[key] = res.result[key]
    })
    fileList.value = [
      {
        name: res.result.fileName
        // url: res.result.fileId
      }
    ]
  }
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
// defineExpose({
//   ...toRefs(data)
// })
</script>
<style scoped lang="scss">
.manager-operate {
  &__card {
    margin: 20px 0;
  }
}
</style>
