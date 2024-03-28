<template>
  <div class="demand-apply" v-loading="state.tableLoading">
    <el-row justify="end" v-if="!isDisabled" v-havedone>
      <el-button @click="save(false)" type="primary">保存</el-button>
      <el-button @click="save(true)" type="primary">提交</el-button>
    </el-row>
    <el-form :model="state.quoteForm" ref="refForm" :rules="rules">
      <!-- 拟稿人信息 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <!-- <el-col :span="24">
            <el-form-item
              label="引用核报价流程:"
              prop="quoteAuditFlowId"
              v-if="['EvalReason_Ffabg', 'EvalReason_Qtyylc'].includes(state.opinion)"
            >
              <el-select
                v-model="state.quoteAuditFlowId"
                remote-show-suffix
                reserve-keyword
                filterable
                placeholder="Select"
                remote
                :remote-method="fetchWorkflowOvered"
                style="width: 300px"
                @change="handleSelectProcess"
              >
                <el-option
                  v-for="item in projectOptions"
                  :disabled="!opinion"
                  :key="item.id"
                  :label="`${item.title} （流程号：${item.id}）`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="state.quoteForm.title" :disabled="!canDo" placeholder="可自动生成">
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
        <div class="demand-apply__btn-container" v-if="!isDisabled">
          <el-button type="primary" class="demand-apply__add-btn" @click="addColumn" :disabled="!canDo">新增</el-button>
        </div>
        <el-row>
          <el-table :data="state.quoteForm.lxDataListDtos" border>
            <el-table-column prop="listNameDisplayName" label="" width="250"> </el-table-column>

            <el-table-column
              :label="'零件' + (index + 1)"
              v-for="(item, index) in state.quoteForm.lxDataListDtos[0].data.length"
              :key="index"
              width="200"
            >
              <template #header>
                <span class="header-icon"> {{ "零件" + (index + 1) }} </span>
                <el-popconfirm title="确定删除嘛?" @Confirm="DelColumn(index)">
                  <template #reference>
                    <el-button :style="{ margin: '0 0 0 30px' }" text type="danger" bg :disabled="!canDo"
                      >X 删除该列</el-button
                    >
                  </template>
                </el-popconfirm>
              </template>
              <template #default="{ row }">
                <div v-if="['零件名称', '备注'].includes(row.listNameDisplayName)">
                  <el-input v-model="row.data[index]"> </el-input>
                </div>
                <div v-else-if="['毛利率'].includes(row.listNameDisplayName)">
                  <el-input v-model="row.data[index]" type="number">
                    <template #append>%</template>
                  </el-input>
                </div>
                <div v-else>
                  <el-input v-model="row.data[index]" type="number"> </el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <el-col :span="6">
        <h5></h5>
        <el-form-item prop="sorFile">
          <el-upload
            v-model:file-list="fileList"
            :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
            :on-success="handleSuccess"
            :on-error="handleUploadError"
            multiple
            :on-progress="handleGetUploadProgress"
            show-file-list
            :disabled="!canDo"
            :limit="1"
          >
            <el-button>上传附件核价表</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, computed } from "vue"
import { LXRequirementEntDto } from "./data.type"
import getQuery from "@/utils/getQuery"
import { useRoute, useRouter } from "vue-router"
import type { UploadProps, UploadUserFile } from "element-plus"
import { ElMessage, ElLoading } from "element-plus"
import _, { uniq, map, cloneDeep } from "lodash"
//录入  查询
import { LXRequirementEnt, QueryLXRequirementEnt } from "./service"
import { getDictionaryAndDetail } from "@/api/dictionary"

import { SearchDepartMentPerson } from "@/components/SearchDepartMentPerson"
import { GetAllProjectSelf } from "@/views/financeDepartment/common/request"
import { getCountryLibraryList } from "@/api/countrylibrary"
import dayjs from "dayjs"
import { CountryTypeEnum } from "./common/util"
import { debounce } from "lodash"

import useJump from "@/hook/useJump"
const { closeSelectedTag } = useJump()
let { right, opinion, auditFlowId } = getQuery()
let route = useRoute()
const fileList = ref<UploadUserFile[]>([])
let userStorage = window.localStorage.getItem("user")
let userInfo: any = userStorage ? JSON.parse(userStorage) : {}
const kvPricingData = ref<any>([])
const shareCountTable = ref<any>([])
const isFirstShow = ref(false)
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
    lxDataListDtos: [
      {
        /**
         *数据
         */
        data: [], //
        /**
         *Id
         */
        id: 0, //
        listName: "",
        /**
         *列名称注释
         */
        listNameDisplayName: "",
        /**
         *零星报价需求录入主表Id
         */
        requirementEntryId: 0
      }
    ]
  },
  componentTypeOptions: [],
  opinion
})

//整个页面是否可以编辑
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  }
})

const canDo = computed(() => {
  return right !== "1"
})

//上传附件
const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  let { quoteForm } = state
  if (res.success) {
    quoteForm.enclosureId = fileList.value.map((item: any) => item.response.result.fileId)?.[0]
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}

//自动生成标题
const generateTitle = () => {
  let { quoteForm } = state
  let nowDate = dayjs(quoteForm.draftDate ? quoteForm.draftDate : new Date()).format("YYYY-MM-DD")
  let userDepartment = quoteForm.draftingDepartment
  let title = `${nowDate + userDepartment}关于${state.quoteForm.projectName}的项目变更核报价申请`
  state.quoteForm.title = title
}

//单据编号
const setNumber = () => {
  let { quoteForm } = state
  let nowDate = dayjs(quoteForm.draftDate ? quoteForm.draftDate : new Date()).format("YYYYMMDD")
  let number = "BJHJ-ZL" + nowDate + "-001"
  quoteForm.number = number
}
//添加
const addColumn = () => {
  state.quoteForm.lxDataListDtos.forEach((item: any, index: number) => {
    let count = item.data.length
    if (count === 15) {
      ElMessage({
        type: "success",
        message: "已经最大列了",
        grouping: true,
      })
      throw new Error("已经最大列了") //报错，就跳出循环
    }
    item.data.push("")
  })
}
//删除列
const DelColumn = (index: number) => {
  state.quoteForm.lxDataListDtos.forEach((item: any, inde: number) => {
    if (item.data.length == 1) {
      ElMessage({
        type: "success",
        message: "最后一列不可删除",
        grouping: true,
      })
      throw new Error("最后一列不可删除") //报错，就跳出循环
    }
    item.data.splice(index, 1)
  })
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
  let componentType: any = await getDictionaryAndDetail("ComponentType") //销售类型
  state.componentTypeOptions = componentType?.result?.financeDictionaryDetailList
  //生成单据编号
  setNumber()
  //查询数据
  var rowData: any = await QueryLXRequirementEnt({ auditFlowId: auditFlowId })
  if (!rowData.success) {
    ElMessage({
      type: "error",
      message: "查询错误"
    })
  } else {
    var data = rowData.result
    if (data.id) {
      state.quoteForm = data
      await ReverseFillingEnclosure(state.quoteForm)
    } else {
      state.quoteForm.lxDataListDtos = data?.lxDataListDtos
    }
  }
}

//反填附件
const ReverseFillingEnclosure = async (result: any) => {
  fileList.value.push({
    name: result.file.fileName ? result.file.fileName : "",
    response: {
      result: {
        fileId: result.file?.fileId
      }
    }
  })
}

const save = debounce(async (isSubmit: boolean) => {
  const loading = ElLoading.service({
    lock: true,
    text: "下载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    let { nodeInstanceId } = route.query
    state.quoteForm.isSubmit = isSubmit
    state.quoteForm.auditFlowId = auditFlowId
    state.quoteForm.opinion = state.opinion || state.quoteForm.opinion
    const { success }: any = await LXRequirementEnt({ ...state.quoteForm, nodeInstanceId })
    if (!success) {
      ElMessage({
        type: "error",
        message: "添加错误"
      })
      loading.close()
    } else {
      ElMessage({
        type: "success",
        message: "添加成功"
      })
      loading.close()
      closeSelectedTag(route.path)
    }
  } catch (error) {
     loading.close()
  }
  finally
  {
     loading.close()
  }
}, 300)

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
