<template>
  <el-row align="middle" justify="end" m="2">
    <el-button type="primary" @click="submit(refForm)" v-if="!data.isShowBox" v-havedone>校验</el-button>
    <ProcessVertifyBox :onSubmit="handleSubmit" processType="confirmProcessType" v-if="data.isShowBox" v-havedone />
  </el-row>
  <div class="structuralMaterial-import">
    <InterfaceRequiredTime style="float: right" :ProcessIdentifier="Host" />
    <CustomerSpecificity />
    <TrView btnText="查看主方案设计" />
    <customerTargetPrice />
    <el-row class="structuralMaterial-import__btn-container">
      <el-upload :action="$baseUrl + 'api/services/app/StructionBom/LoadExcel'" :on-success="handleSuccess" show-file-list
        :on-progress="handleGetUploadProgress" :on-error="handleUploadError">
        <el-button type="primary">结构料上传</el-button>
      </el-upload>
      <el-upload :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'" :on-success="handleSuccess3D"
        show-file-list>
        <el-button class="gap" type="primary">附件上传：3D爆炸图</el-button>
      </el-upload>
      <el-button class="gap" type="primary" @click="downLoadTemplate">结构料模版下载</el-button>
    </el-row>

    <h5>结构料导入</h5>
    <el-table :data="data.tableData" border style="width: 100%" height="700">
      <el-table-column prop="categoryName" label="物料大类"  width="130" fixed="left" />
      <el-table-column prop="typeName" label="物料种类"  width="130"  fixed="left" />
      <el-table-column prop="isInvolveItem" label="是否涉及" width="80"  fixed="left" />
      <el-table-column prop="drawingNumName" label="图号名称"  width="130"  fixed="left" />
      <el-table-column prop="sapItemNum" label="物料编号"  width="130"  fixed="left" />
      <el-table-column prop="assemblyQuantity" label="装配数量" width="120"  fixed="left" />
      <el-table-column prop="overallDimensionSize" label="外形尺寸mm" width="100" />
      <el-table-column prop="materialName" label="材料名称"  width="130" />
      <el-table-column prop="weightNumber" label="重量" width="100" />
      <el-table-column prop="moldingProcess" label="成型工艺"  width="130" />
      <el-table-column prop="isNewMouldProduct" label="是否新开模" width="80" />
      <el-table-column prop="secondaryProcessingMethod" label="二次加工方法"  width="130" />
      <el-table-column prop="surfaceTreatmentMethod" label="表面处理"  width="130" />
      <el-table-column prop="dimensionalAccuracyRemark" label="关键尺寸精度及重要要求" width="200" />
    </el-table>

    <el-card>
      <template #header>
        <div>物流基础信息</div>
      </template>
      <el-form :model="data.logisticsForm" inline ref="refForm" :rules="rules">
        <!-- <h5>物流基础信息</h5> -->
        <h6>镜头参数</h6>
        <el-form-item label="像素" prop="pixel">
          <el-input v-model="data.logisticsForm.pixel" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>M</template>
          </el-input>
        </el-form-item>
        <el-form-item label="FOV" prop="fov">
          <el-input v-model="data.logisticsForm.fov" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <h6>外包装体积</h6>
        <el-form-item label="外包装长" prop="outerPackagingLength">
          <el-input v-model="data.logisticsForm.outerPackagingLength" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>cm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="外包装宽" prop="outerPackagingWidth">
          <el-input v-model="data.logisticsForm.outerPackagingWidth" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>cm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="外包装高" prop="outerPackagingHeight" oninput="value=value.replace(/[^0-9.]/g,'')">
          <el-input v-model="data.logisticsForm.outerPackagingHeight">
            <template #append>cm</template>
          </el-input>
        </el-form-item>
        <h6>重量</h6>
        <el-form-item label="单个产品重量" prop="singleProductWeight">
          <el-input v-model="data.logisticsForm.singleProductWeight" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>kg</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单箱数量" prop="singleBoxQuantity">
          <el-input v-model="data.logisticsForm.singleBoxQuantity" oninput="value=value.replace(/[^\d]/g,'')">
            <template #append>pcs</template>
          </el-input>
        </el-form-item>
        <h5>包装基础信息</h5>
        <h6>内包装体积</h6>
        <el-form-item label="内包装长" prop="innerPackagingLength">
          <el-input v-model="data.logisticsForm.innerPackagingLength" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>mm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="内包装宽" prop="innerPackagingWidth">
          <el-input v-model="data.logisticsForm.innerPackagingWidth" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>mm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="内包装高" prop="innerPackagingHeight">
          <el-input v-model="data.logisticsForm.innerPackagingHeight" oninput="value=value.replace(/[^0-9.]/g,'')">
            <template #append>mm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否打托">
          <el-select v-model="data.logisticsForm.isHit" placeholder="Select">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="每托盘箱数" prop="boxesPerPallet">
          <el-input v-model="data.logisticsForm.boxesPerPallet" oninput="value=value.replace(/[^\d]/g,'')">
            <template #append> 箱/托</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单箱包装数量" prop="quantityPerBox">
          <el-input v-model="data.logisticsForm.quantityPerBox" oninput="value=value.replace(/[^\d]/g,'')">
            <template #append> PCS/箱</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.logisticsForm.remarks" type="textarea" placeholder="若无具体包装数据,填写参考的具体项目及产品" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref } from "vue"
import type { UploadProps, FormInstance, FormRules } from "element-plus"
import { ElMessage, ElLoading } from "element-plus"
import {
  SaveStructionBom,
  SaveBOM,
  getBomTemplate,
  SaveProductDevelopmentInput,
  GetStructionBom,
  getProductDevelopmentInput
} from "@/api/bom"
import getQuery from "@/utils/getQuery"
import CustomerSpecificity from "@/components/CustomerSpecificity/index.vue"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import TrDownLoad from "@/components/TrDownLoad/index.vue"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import { customerTargetPrice } from "@/views/demandApply"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import TrView from "@/components/TrView/index.vue"
import { isEmpty, map } from "lodash"

let Host = "StructBomImport"
const refForm = ref<FormInstance>()
let auditFlowId: any = null
let productId: any = null
const data = reactive<any>({
  tableData: [],
  setVisible: false,
  logisticsForm: {
    outerPackagingLength: "",
    outerPackagingWidth: "",
    outerPackagingHeight: "",
    singleProductWeight: "",
    singleBoxQuantity: "",
    innerPackagingLength: "",
    innerPackagingWidth: "",
    innerPackagingHeight: "",
    isHit: "",
    boxesPerPallet: "",
    quantityPerBox: "",
    remarks: "",
    picture3DFileId: ""
  },
  isShowBox: false
})
const rules = reactive<FormRules>({
  outerPackagingLength: [{ required: true, message: "请输入该值", trigger: "blur" }],
  outerPackagingWidth: [{ required: true, message: "请输入该值", trigger: "blur" }],
  outerPackagingHeight: [{ required: true, message: "请输入该值", trigger: "blur" }],
  singleProductWeight: [{ required: true, message: "请输入该值", trigger: "blur" }],
  singleBoxQuantity: [{ required: true, message: "请输入该值", trigger: "blur" }],
  innerPackagingLength: [{ required: true, message: "请输入该值", trigger: "blur" }],
  innerPackagingWidth: [{ required: true, message: "请输入该值", trigger: "blur" }],
  innerPackagingHeight: [{ required: true, message: "请输入该值", trigger: "blur" }],
  boxesPerPallet: [{ required: true, message: "请输入该值", trigger: "blur" }],
  quantityPerBox: [{ required: true, message: "请输入该值", trigger: "blur" }],
  remarks: [{ required: true, message: "请输入该值", trigger: "blur" }],
  picture3DFileId: [{ required: true, message: "请输入该值", trigger: "blur" }]
})

onMounted(async () => {
  let query = getQuery()
  auditFlowId = Number(query.auditFlowId) || 0
  productId = Number(query.productId) || 0
  data.auditFlowId = Number(query.auditFlowId) || null // 用来做数据绑定
  console.log(query, '结构料导入')
  if (auditFlowId && productId) {
    let { success, result }: any = await GetStructionBom({ auditFlowId, solutionId: productId })
    if (success) {
      data.tableData = result
    }
    initFetchProductDevelopmentInput(query)
  }
})

const initFetchProductDevelopmentInput = async (query: any) => {
  let { success, result }: any = await getProductDevelopmentInput({ auditFlowId: query.auditFlowId, solutionId: productId })
  if (success && !isEmpty(result)) {
    map(result, (val, key) => {
      data.logisticsForm[key] = val
    })
  }
}

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  if (res.success) {
    data.tableData = res.result.structureBomDtos
  } else {
    ElMessage({
      message: res.error.message,
      type: "error"
    })
  }
}
const handleSuccess3D: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  if (res.success) {
    data.logisticsForm.picture3DFileId = res.result.fileId
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}

const downLoadTemplate = async () => {
  let res: any = await getBomTemplate()
  const blob = res
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function () {
    let url = URL.createObjectURL(new Blob([blob]))
    let a = document.createElement("a")
    document.body.appendChild(a) //此处增加了将创建的添加到body当中
    a.href = url
    a.download = "模板文件.xlsx"
    a.target = "_blank"
    a.click()
    a.remove() //将a标签移除
  }
}

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      data.isShowBox = true
    } else {
      ElMessage({
        message: "有必填项没有填写",
        type: "error"
      })
      console.log("error submit!", fields)
    }
  })
}

const handleSubmit = async ({ comment, opinion, nodeInstanceId }: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    let params: SaveBOM = { ...data.logisticsForm, auditFlowId, solutionId: productId, structureBomDtos: data.tableData, comment, opinion, nodeInstanceId }
    let res: any = await SaveStructionBom(params)
    await SaveProductDevelopmentInput(params)
    loading.close()
    if (res.success) {
      ElMessage({
        message: "保存成功",
        type: "success"
      })
    }
  } catch (error) {
    loading.close()
  }
}
</script>
<style lang="scss" scoped>
.structuralMaterial-import {
  padding: 20px 0;

  &__btn-container {
    margin: 20px 0;
    position: relative;
  }

  .gap {
    margin: 0 5px;
  }
}
</style>
