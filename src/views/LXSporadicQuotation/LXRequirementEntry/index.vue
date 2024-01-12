<template>
  <div class="demand-apply" v-loading="state.tableLoading">
    <el-row justify="end" v-if="!isDisabled" v-havedone>
      <el-button @click="save(refForm, false)" type="primary">保存</el-button>
      <el-button @click="save(refForm, true)" type="primary">提交</el-button>
    </el-row>
    <el-form :model="state.quoteForm" ref="refForm" :rules="rules">
      <!-- 拟稿人信息 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="引用核报价流程:" prop="quoteAuditFlowId"
            v-if="['EvalReason_Ffabg', 'EvalReason_Qtyylc'].includes(state.opinion)">
              <el-select v-model="state.quoteAuditFlowId" remote-show-suffix reserve-keyword filterable
                placeholder="Select" remote :remote-method="fetchWorkflowOvered" style="width: 300px" @change="handleSelectProcess">
                <el-option v-for="item in projectOptions" :disabled="!opinion" :key="item.id"
                  :label="`${item.title} （流程号：${item.id}）`" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="state.quoteForm.title" :disabled="notEdit">
                <template #append v-if="!isDisabled">
                  <el-button @click="generateTitle" v-havedone>自动生成</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿人:" prop="drafter">
              <el-input v-model="state.quoteForm.drafter" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿人工号:" prop="drafterNumber">
              <el-input v-model="state.quoteForm.drafterNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿公司:" prop="draftingCompany">
              <el-input v-model="state.quoteForm.draftingCompany" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿部门:" prop="draftingDepartment">
              <el-input v-model="state.quoteForm.draftingDepartment" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿日期:" prop="draftDate">
              <el-date-picker v-model="state.quoteForm.draftDate" @change="generateTitle" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号:" prop="number">
              <el-input v-model="state.quoteForm.number" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 项目信息 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
           <el-col :span="6">
            <el-form-item label="项目名称:" prop="projectName">
              <el-input v-model="state.quoteForm.projectName" @change="generateTitle" :disabled="notEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="直接客户名称:" prop="directCustomerName">
              <el-input v-model="state.quoteForm.directCustomerName" @change="generateTitle" :disabled="notEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户性质:" prop="customerNature">
              <el-input v-model="state.quoteForm.customerNature" @change="generateTitle" :disabled="notEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端客户名称:" prop="endCustomerName">
              <el-input v-model="state.quoteForm.endCustomerName" placeholder="终端客户名称" :disabled="notEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端客户性质:" prop="endCustomerNature">
               <el-input v-model="state.quoteForm.endCustomerNature" placeholder="终端客户名称" :disabled="notEdit" />
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="零部件类型:" prop="componentType">
              <el-select v-model="state.quoteForm.componentType" placeholder="零部件类型" :disabled="notEdit">
                <el-option v-for="item in state.terminalNatureOptions" :key="item.id" :label="item.displayName"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

        </el-row>

        <el-row v-if="state.quoteForm.priceEvalType == 'PriceEvalType_Quantity'">
          <el-col :span="6">
            <el-form-item label="是否包含样品核价:" prop="updateFrequency">
              <el-select v-model="state.quoteForm.isHasSample" placeholder="是否包含样品核价" :disabled="notEdit">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="state.quoteForm.isHasSample || state.quoteForm.priceEvalType == 'PriceEvalType_Sample'">
          <div class="demand-apply__btn-container" v-if="!isDisabled">
            <el-button type="primary" class="demand-apply__add-btn" @click="addSpecimen" v-havedone>新增</el-button>
          </div>
          <el-row>
            <el-table :data="specimenData" border style="width: 600px">
              <el-table-column prop="name" label="样品阶段" width="250">
                <template #default="{ row }">
                  <el-select v-model="row.name" placeholder="样品阶段" :disabled="notEdit">
                    <!-- <el-option :value="0" label="A样" />
                    <el-option :value="1" label="B样" />
                    <el-option :value="2" label="C样" />
                    <el-option :value="3" label="其他" /> -->
                    <el-option v-for="item in state.isSpecimenOptions" :key="item.id" :label="item.displayName"
                      :value="item.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="pcs" label="需求量(pcs)" width="250">
                <template #default="{ row }">
                  <el-input v-model="row.pcs" :disabled="notEdit" />
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template #default="{ $index }" v-if="!isDisabled">
                  <el-button @click="deleteSpecimen($index)" type="danger" :disabled="specimenData.length === 1"
                    v-havedone>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <h6 />
      </el-card>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, computed } from "vue"
import { productTypeMap, YearListItem, updateFrequency } from "./data.type"
import getQuery from "@/utils/getQuery"
import { useRoute, useRouter } from "vue-router"
import type { UploadProps, UploadUserFile } from "element-plus"
import _, { uniq, map, cloneDeep } from "lodash"
import { saveApplyInfo, priceEvaluationStartSave, getExchangeRate, getPriceEvaluationStartData, GetQuoteVersion, getWorkflowOvered, priceEvaluationStart } from "./service"
import { getDictionaryAndDetail } from "@/api/dictionary"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage, ElLoading } from "element-plus"
import { SearchDepartMentPerson } from "@/components/SearchDepartMentPerson"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import { GetAllProjectSelf } from "@/views/financeDepartment/common/request"
import { getCountryLibraryList } from "@/api/countrylibrary"
import dayjs from "dayjs"
import { CountryTypeEnum } from "./common/util"
import { debounce } from "lodash"

let { right, opinion } = getQuery()

let userStorage = window.localStorage.getItem("user")
let userInfo: any = userStorage ? JSON.parse(userStorage) : {}
const kvPricingData = ref<any>([])
const shareCountTable = ref<any>([])
const isFirstShow = ref(false)
const state = reactive<any>({

  quoteForm: {
    shareCount: [],
    countryType: "", // 国家类型
    isHasNre: false,
    isHasGradient: false,
    title: "" as any, //标题
    drafter: "", //拟稿人
    drafterNumber: null, //拟稿人工号
    draftingDepartment: "", //拟稿部门
    draftingCompany: "", //拟稿公司
    draftDate: new Date(), //拟稿日期
    number: "", //单据编号

    ProjectName:"",//项目名称


  },


})
//自动生成标题
const generateTitle = () => {
  let { quoteForm } = state
  let nowDate = dayjs(quoteForm.draftDate ? quoteForm.draftDate : new Date()).format("YYYY-MM-DD")
  let userDepartment = quoteForm.draftingDepartment
  let title = `${nowDate + userDepartment}关于${quoteForm.customerName + quoteForm.projectName + "第" + state.quoteForm.quoteVersion + "版"
    }的核价报价申请`
  state.quoteForm.title = title
}

//单据编号
const setNumber = () => {
  let { quoteForm } = state
  let nowDate = dayjs(quoteForm.draftDate ? quoteForm.draftDate : new Date()).format("YYYYMMDD")
  let number = "BJHJ-ZL" + nowDate + "-001"
  quoteForm.number = number
}

const init = async (tempAuditFlowId?: any) => {
  let query = getQuery() || {}
  state.quoteForm.projectName = query.projectName ? query.projectName + "" : ""
  state.quoteForm.projectCode = query.projectCode ? query.projectCode + "" : ""
  state.quoteForm.quoteVersion = query.quoteVersion ? query.quoteVersion + "" : ""
  state.quoteForm.drafter = userInfo.name
  state.quoteForm.drafterNumber = userInfo.userNumber || "未成功获取"
  state.quoteForm.draftingCompany = userInfo.userCompany?.name || "未成功获取"
  state.quoteForm.draftingDepartment = userInfo.userDepartment?.name || "未成功获取"
  state.tableLoading = true
  isFirstShow.value = false
  state.tableLoading = false
  //生成单据编号
  setNumber()
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
