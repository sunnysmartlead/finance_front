<template>
  <div class="demand-apply">
    <el-row justify="end" v-if="!isDisabled" v-havedone>
      <el-button type="primary" @click="dialogVisible = true">同意</el-button>
      <el-button type="danger" @click="dialogVisibleR = true"> 退回</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="ViewPriceList">查看核价表</el-button>
      <el-button type="primary" @click="DownloadTheQuotationReviewForm">下载报价审核表</el-button>
    </el-row>
    <el-form :model="state.quoteForm" ref="refForm" :rules="rules">
      <!-- 项目信息 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="项目名称:" prop="projectName">
              <el-input
                v-model="state.quoteForm.projectName"
                @change="generateTitle"
                :disabled="!canDo"
                placeholder="项目名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="直接客户名称:" prop="directCustomerName">
              <el-input
                v-model="state.quoteForm.directCustomerName"
                @change="generateTitle"
                :disabled="!canDo"
                placeholder="直接客户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户性质:" prop="customerNature">
              <el-input
                v-model="state.quoteForm.customerNature"
                @change="generateTitle"
                :disabled="!canDo"
                placeholder="客户性质"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端客户名称:" prop="endCustomerName">
              <el-input v-model="state.quoteForm.endCustomerName" placeholder="终端客户名称" :disabled="!canDo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端客户性质:" prop="endCustomerNature">
              <el-input v-model="state.quoteForm.endCustomerNature" placeholder="终端客户名称" :disabled="!canDo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="零部件类型:" prop="componentType">
              <el-select v-model="state.quoteForm.componentType" placeholder="零部件类型" :disabled="!canDo">
                <el-option
                  v-for="item in state.componentTypeOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            {{ DataListMapper }}
          </el-col>
        </el-row>
        <el-row :gutter="20"> </el-row>
      </el-card>
      <div>
        <!-- <div class="demand-apply__btn-container" v-if="!isDisabled">
          <el-button type="primary" class="demand-apply__add-btn" @click="addColumn" :disabled="!canDo">新增</el-button>
        </div> -->
        <el-row>
          <el-table :data="state.quoteForm.lxApprovalFormListDtos" border :span-method="arraySpanMethod"   style="width: 100%">
            <el-table-column prop="bjclu" label="" width="250" align="center">
               <template #default>
                <span>报价策略</span>
              </template>
            </el-table-column>
            <el-table-column prop="travelVolume" label="走量" width="250"> </el-table-column>
             <el-table-column prop="cost" label="成本" width="250"> </el-table-column>
              <el-table-column prop="grossProfitMargin" label="毛利率" width="250"> </el-table-column>
               <el-table-column prop="price" label="价格" width="250"> </el-table-column>
                <el-table-column prop="remarks" label="备注" width="250"> </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-form>
    <el-dialog v-model="dialogVisible" title="审批意见" width="30%" :before-close="handleClose">
      <el-input type="textarea" rows="4" v-model="confirmText" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="agreeConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleR" title="退回" width="30%" :before-close="handleClose">
      <el-form>
        <el-form-item label="退回原因">
          <el-input type="textarea" rows="4" v-model="refuseText" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleR = false">取消</el-button>
          <el-button type="primary" @click="refuseConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 审核报价策略 -->
  </div>
</template>
<script lang="ts" setup>
import { reactive, onBeforeMount, onMounted, watchEffect, ref,defineProps } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage,ElLoading } from "element-plus"
import { SubmitNode } from "@/api/WorkFlows"
import useJump from "@/hook/useJump"
import getQuery from "@/utils/getQuery"
import { getDictionaryAndDetail } from "@/api/dictionary"
import { DownloadFile } from "@/api/File"
import { QueryLXManagerApproval,DownloadQueryLXManagerApproval } from "./service"
const { closeSelectedTag } = useJump()
const dialogVisible = ref(false)
const dialogVisibleR = ref(false)
const refuseText = ref("")
const router = useRouter()
const route = useRoute()
const confirmText = ref("")

const { auditFlowId, opinion, nodeInstanceId } = getQuery()

const state = reactive<any>({
  quoteForm: {
    title: "" as string, //标题
    drafter: "", //拟稿人
    drafterNumber: null, //拟稿人工号
    draftingDepartment: "", //拟稿部门
    draftingCompany: "", //拟稿公司
    draftDate: new Date(), //拟稿日期
    number: "", //单据编号
    ProjectName: "", //项目名称
    componentType: null, //销售类型
    enclosureId: 0, //上传附件核价表id
    opinion: "",
    lxDataListDtos: [],
    lxApprovalFormListDtos:[]
  },
  componentTypeOptions: [],
  opinion,
  OrderIndexArr: [],
  OrderObj: {}
})
const props = defineProps({
  disabled: {
    type:Boolean,
    default:true
  }
})
const refuseConfirm = async () => {
  if (refuseText.value) {
    await SubmitNode({
      comment: refuseText.value,
      nodeInstanceId,
      financeDictionaryDetailId: "YesOrNo_No"
    })
    ElMessage.success("操作成功")
    dialogVisibleR.value = false
    closeSelectedTag(route.path)
  } else {
    ElMessage.warning("退回原因必填！")
  }
}
/**
 * 同意提交流程
 */
const agreeConfirm = async () => {
  /**
   * 保存数据需要确认
   */
  let res = await SubmitNode({
    comment: confirmText.value,
    nodeInstanceId,
    financeDictionaryDetailId: "YesOrNo_Yes"
  })
  if (res.success) {
    ElMessage.success("操作成功")
    closeSelectedTag(route.path)
    dialogVisible.value = false
  }
}



const init = async (tempAuditFlowId?: any) => {
  let query = getQuery() || {}
  let componentType: any = await getDictionaryAndDetail("ComponentType") //销售类型
  state.componentTypeOptions = componentType?.result?.financeDictionaryDetailList
  //查询数据
  var rowData: any = await QueryLXManagerApproval({ auditFlowId: auditFlowId })
  if (!rowData.success) {
    ElMessage({
      type: "error",
      message: "查询错误"
    })
  } else {
    var data = rowData.result
    state.quoteForm = data
  }
  await getOrderNumber()
}

const arraySpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: any) => {
  if (columnIndex === 0) {
      for (var i = 0; i <state.OrderIndexArr.length; i++) {
      var element = state.OrderIndexArr[i]
      for (var j = 0; j < element.length; j++) {
        var item = element[j]
        if (rowIndex == item) {
          if (j == 0) {
            return {
              rowspan: element.length,
              colspan: 1
            }
          } else if (j != 0) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
  }
}
const getOrderNumber = () => {
  state.OrderObj = {}
  state.quoteForm.lxApprovalFormListDtos.forEach(function (element: any, index: any) {
    element.rowIndex = index
    if (state.OrderObj[element.typeName]) {
      state.OrderObj[element.typeName].push(index)
    } else {
      state.OrderObj[element.typeName] = []
      state.OrderObj[element.typeName].push(index)
    }
  }, this)

  for (var k in state.OrderObj) {
    if (state.OrderObj[k].length > 1) {
      state.OrderIndexArr.push(state.OrderObj[k])
    }
  }
}

//查看核价比表
const ViewPriceList=async()=>{
  const loading = ElLoading.service({
    lock: true,
    text: "下载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    //下载上传的核价表
    const fileId=state.quoteForm?.file?.fileId
    const result: any = await DownloadFile({fileId})
    const blob = result
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      let url = URL.createObjectURL(new Blob([blob]))
      let a = document.createElement("a")
      document.body.appendChild(a) //此处增加了将创建的添加到body当中
      a.href = url
      a.download = state.quoteForm?.file?.fileName
      a.target = "_blank"
      a.click()
      a.remove() //将a标签移除
    }
    loading.close()
  } catch {
    loading.close()
  }
}

//下载报价审核表
const DownloadTheQuotationReviewForm=async()=>{
   const loading = ElLoading.service({
    lock: true,
    text: "下载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    //下载报价审核表
    const result: any = await DownloadQueryLXManagerApproval({ auditFlowId: auditFlowId })
    const blob = result
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = function () {
      let url = URL.createObjectURL(new Blob([blob]))
      let a = document.createElement("a")
      document.body.appendChild(a) //此处增加了将创建的添加到body当中
      a.href = url
      a.download ="报价审核表.xlsx"
      a.target = "_blank"
      a.click()
      a.remove() //将a标签移除
    }
    loading.close()
  } catch {
    loading.close()
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.demand-apply {
  padding: 10px;

  &__step {
    margin: 20px 0;
    height: 400px;
  }

  &__card {
    margin: 10px 0;
  }

  &__mass-production-table {
    margin: 20px 0;
  }

  &__btn-container {
    height: 60px;
    position: relative;
  }

  &__add-btn {
    position: absolute;
    right: 0px;
    top: 15px;
  }
}
</style>
