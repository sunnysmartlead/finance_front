<template>
  <div class="electronic-import">
    <InterfaceRequiredTime style="float: right" :ProcessIdentifier="Host" />
    <CustomerSpecificity />
    <TrView btnText="查看主方案设计" />
    <customerTargetPrice />
    <div class="electronic-import__btn-container">
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" @click="data.setVisible = true">电子料模版下载</el-button>
        </el-form-item>
        <!-- <el-form-item label="">
          <ProductInfo :auditFlowId="data.auditFlowId" />
        </el-form-item> -->
      </el-form>
    </div>
    <h5>电子料导入</h5>
    <el-card>
      <el-button :style="{ margin: '10px' }" type="primary" @click="addPlatePart">新增</el-button>
      <el-table :data="platePart" border style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="categoryName" label="板部件名称">
          <template #default="{ row }">
            <el-input v-model="row.categoryName" placeholder="请录入板部件名称" />
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="板部件长(mm)">
          <template #default="{ row }">
            <el-input v-model="row.typeName" placeholder="请录入板部件长" />
          </template>
        </el-table-column>
        <el-table-column prop="isInvolveItem" label="板部件宽(mm)">
          <template #default="{ row }">
            <el-input v-model="row.isInvolveItem" placeholder="请录入板部件宽" />
          </template>
        </el-table-column>
        <el-table-column prop="sapItemNum" label="板部件面积(mm^2)">
          <template #default="{ row }">
            <el-input v-model="row.sapItemNum" placeholder="请录入板部件面积" />
          </template>
        </el-table-column>
        <el-table-column prop="sapItemName" label="拼板数量">
          <template #default="{ row }">
            <el-input v-model="row.sapItemName" placeholder="请录入拼板数量" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ $index }">
            <el-button type="danger" @click="deletePlatePart($index)" :disabled="platePart.length == 1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-upload
        :action="$baseUrl + 'api/services/app/ElectronicBom/UploadExcel'"
        :on-success="handleSuccess"
        :on-error="handleUploadError"
        show-file-list
        :on-progress="handleGetUploadProgress"
      >
        <el-button :style="{ margin: '15px' }" type="primary">电子料上传</el-button>
      </el-upload>

      <el-table :data="data.tableData" border style="width: 100%">
        <el-table-column prop="categoryName" label="物料大类" width="180" />
        <el-table-column prop="typeName" label="物料种类" width="180" />
        <el-table-column prop="isInvolveItem" label="是否涉及" width="180" />
        <el-table-column prop="sapItemNum" label="物料编号" width="180" />
        <el-table-column prop="sapItemName" label="材料名称" width="180" />
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" />
        <el-table-column prop="encapsulationSize" label="封装（需要体现PAD的数量）" />
      </el-table>
    </el-card>

    <div style="float: right; margin-top: 20px">
      <el-button type="primary" @click="submit" v-havedone>提交</el-button>
    </div>

    <el-dialog v-model="data.setVisible">
      <el-form :model="data.downloadSetForm">
        <el-form-item label="板部件数量">
          <el-input v-model="data.downloadSetForm.number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.setVisible = false">取消</el-button>
          <el-button type="primary" @click="downLoadTemplate">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import type { UploadProps } from "element-plus"
import { ElLoading, ElMessage } from "element-plus"
// import type { TabsPaneContext } from "element-plus"
import { SaveElectronicBom, DownloadFile, GetElectronicBom, getBoardInfomation } from "@/api/bom"
import getQuery from "@/utils/getQuery"
import CustomerSpecificity from "@/components/CustomerSpecificity/index.vue"
// import ProductInfo from "@/components/ProductInfo/index.vue"
import TrView from "@/components/TrView/index.vue"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import { customerTargetPrice } from "@/views/demandApply"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
const Host = "ElectronicBomImport"

let auditFlowId: any = null
let productId: any = null

const platePart: any = ref([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
])

const data = reactive({
  activeIndex: 0,
  productList: [],
  tableData: [],
  setVisible: false,
  downloadSetForm: {
    number: 0
  },
  auditFlowId: null as any,
})

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  if (res.success) {
    // data.tableDataList[data.activeIndex] = res.result
    data.tableData = res.result.electronicBomDtos
  } else {
    ElMessage({
      message: res.error.message,
      type: "error"
    })
  }
}

const queryBoardInfomation = async () => {
  const { success, result } = await getBoardInfomation({
    auditFlowId: auditFlowId,
    solutionId: productId,
  })
  if (success && result?.length) {
    platePart.value = result
  }
}

const downLoadTemplate = async () => {
  let res: any = await DownloadFile(Number(data.downloadSetForm.number))
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
  data.setVisible = false
}

const addPlatePart = async () => {
  platePart.value.push({})
}

const deletePlatePart = async (index: number) => {
  platePart.value.splice(index, 1)
}

const submit = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  if (!productId) {
    loading.close()
    ElMessage.error("未选择零件！")
    return
  }
  try {
    let { success }: any = await SaveElectronicBom({
      auditFlowId,
      solutionId: productId,
      electronicBomDtos: data.tableData,
      boardDtos: platePart.value
    })
    loading.close()
    success && ElMessage.success("提交成功！")
  } catch (error) {
    loading.close()
  }
}

const init = async () => {
  let resElectronic: any = await GetElectronicBom({ auditFlowId, solutionId: productId })
  data.tableData = resElectronic.result

}

onMounted(async () => {
  let query = getQuery()
  auditFlowId = Number(query.auditFlowId) || null
  productId = Number(query.productId) || null
  data.auditFlowId = Number(query.auditFlowId) || null // 用来做数据绑定
  if (auditFlowId && productId) {
    init()
    queryBoardInfomation()
  }
})
</script>
<style lang="scss" scoped>
.electronic-import {
  &__btn-container {
    margin: 20px 0;
    position: relative;
  }
}
</style>
