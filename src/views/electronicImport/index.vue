<template>
  <div class="electronic-import">
    <el-row justify="end" m="2">
      <!-- <el-button type="primary" @click="submit" v-havedone>提交</el-button> -->
      <ProcessVertifyBox :onSubmit="handleSubmit" processType="confirmProcessType" v-if="data.canDo" v-havedone />
    </el-row>
    <el-row justify="end">
      <InterfaceRequiredTime :ProcessIdentifier="Host" />
    </el-row>
    <CustomerSpecificity />
    <TrView btnText="查看主方案设计" />
    <customerTargetPrice />
    <div class="electronic-import__btn-container">
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" @click="data.setVisible = true">电子料模版下载</el-button>
        </el-form-item>
      </el-form>
    </div>
    <h5>电子料导入</h5>
    <el-card>
      <el-button :style="{ margin: '10px' }" type="primary" @click="addPlatePart" :disabled="!data.canDo" v-havedone>新增</el-button>
      <el-table :data="platePart" border style="width: 100%">
        <el-table-column type="index" width="50" align="center"/>
        <el-table-column prop="boardName" label="板部件名称" align="center">
          <template #default="{ row }">
            <el-input v-model="row.boardName" placeholder="请录入板部件名称" />
          </template>
        </el-table-column>
        <el-table-column prop="boardLenth"  width="175" label="板部件长(mm)" align="center">
          <template #default="{ row }">
            <el-input-number @mousewheel.native.prevent v-model="row.boardLenth" controls-position="right" :min="0" placeholder="请录入板部件长"/>
          </template>
        </el-table-column>
        <el-table-column prop="boardWidth" width="175" label="板部件宽(mm)" align="center">
          <template #default="{ row }">
            <el-input-number @mousewheel.native.prevent v-model="row.boardWidth" controls-position="right" :min="0" placeholder="请录入板部件宽" />
          </template>
        </el-table-column>
        <el-table-column prop="boardSquare" label="板部件面积(mm^2)" align="center">
          <template #default="{ row }">
            <!-- <el-input-number @mousewheel.native.prevent v-model="row.sapItemNum" placeholder="请录入板部件面积" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="stoneQuantity" label="拼板数量" align="center">
          <template #default="{ row }">
            <el-input-number @mousewheel.native.prevent :min="0" v-model="row.stoneQuantity" :precision="0" placeholder="请录入拼板数量" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ $index }">
            <el-button type="danger" @click="deletePlatePart($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="max-width: '350px'">
        <el-upload
          :action="$baseUrl + 'api/services/app/ElectronicBom/UploadExcel'"
          :on-success="handleSuccess"
          :on-error="handleUploadError"
          show-file-list
          :on-progress="handleGetUploadProgress"
          :disabled="!data.canDo"
        >
          <el-button :style="{ margin: '15px' }" type="primary" :disabled="!data.canDo" v-havedone>电子料上传</el-button>
        </el-upload>
      </el-row>

      <el-table :data="data.tableData" border style="width: 100%">
        <el-table-column prop="categoryName" label="物料大类" width="200" align="center"/>
        <el-table-column prop="typeName" label="物料种类" width="300" align="center"/>
        <el-table-column prop="isInvolveItem" label="是否涉及" width="120" align="center"/>
        <el-table-column prop="sapItemNum" label="物料编号" width="180" align="center"/>
        <el-table-column prop="sapItemName" label="材料名称" width="500" align="center"/>
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180" align="center"/>
        <el-table-column prop="encapsulationSize" label="封装（需要体现PAD的数量）" align="center"/>
      </el-table>
    </el-card>

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
import { ref, reactive, onMounted, watch } from "vue"
import type { UploadProps } from "element-plus"
import { ElLoading, ElMessage, ElNotification } from "element-plus"
// import type { TabsPaneContext } from "element-plus"
import { SaveElectronicBom, DownloadFile, GetElectronicBom, SaveBoard, GetBOMViewPermissions } from "@/api/bom"
import getQuery from "@/utils/getQuery"
import CustomerSpecificity from "@/components/CustomerSpecificity/index.vue"
// import ProductInfo from "@/components/ProductInfo/index.vue"
import TrView from "@/components/TrView/index.vue"
import InterfaceRequiredTime from "@/components/InterfaceRequiredTime/index.vue"
import { customerTargetPrice } from "@/views/demandApply"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { GetBoardInfomation } from "@/api/processHoursEnter"
import useJump from "@/hook/useJump"
import { map } from "lodash"
const { jumpTodoCenter } = useJump()

const Host = "ElectronicBomImport"
const { auditFlowId, productId: solutionId } = getQuery()
const platePart: any = ref<any>([])
const fileId = ref<any>("")

watch(
  () => platePart.value,
  () => {
    platePart.value.forEach((item) => {
      item.boardSquare = (item.boardLenth || 0) * (item.boardWidth || 0)
    })
  },
  {
    deep: true
  }
)

const data = reactive<any>({
  activeIndex: 0,
  productList: [],
  tableData: [],
  setVisible: false,
  downloadSetForm: {
    number: 1
  },
  auditFlowId: null as any,
  canDo: false,
})

const getRole = async () => {
  const { success, result } = await GetBOMViewPermissions({ auditFlowId, solutionId, bOMtype: 1 })
  if (success) {
    data.canDo = result
    if (!result) {
      ElMessage({
        message: '您当前暂无操作权限！',
        type: 'error',
        grouping: true,
        zIndex: 1
      })
    }
  }
}

const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  if (res.success) {
    // data.tableDataList[data.activeIndex] = res.result
    data.tableData = res.result.electronicBomDtos
    fileId.value = res.result.elcFileId
  } else {
    ElMessage({
      message: res.error.message,
      type: "error"
    })
  }
}

const queryBoardInfomation = async () => {
  const { success, result }: any = (await GetBoardInfomation({
    auditFlowId,
    solutionId
  })) || {}
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

const handleSubmit = async ({ comment, opinion, nodeInstanceId, label }: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  if (!solutionId) {
    loading.close()
    ElMessage.error("未选择零件！")
    return
  }
  const notPass = platePart.value.some(item => {
    return !item.boardLenth || !item.boardWidth
  })

  if (notPass || !platePart.value?.length) {
    loading.close()
    ElMessage.error("请填写完整表单信息！")
    return
  }
  try {
    const params = {
      auditFlowId: Number(auditFlowId),
      solutionId,
      electronicBomDtos: map(data.tableData, (item: any) => ({ ...item,elcFileId: fileId.value || item.fileId,fileId: fileId.value || item.fileId })),
      boardDtos: map(platePart.value, item => ({...item, auditFlowId, solutionId })),
      comment,
      opinion,
      nodeInstanceId,
      elcFileId: fileId.value || data.tableData[0]?.fileId,
    }
    const { success }: any = await SaveBoard(params).then(async(p:any)=>{
       let res: any = {}
      if (p.success) {
        res = await SaveElectronicBom(params)
      }
      loading.close()

      if (res.success) {
        ElMessage.success(`${label} 成功！`)
      }
    })
  } catch (error) {
    loading.close()
  }finally
  {
    loading.close()
  }
}
const init = async () => {
  let { success, result }: any = await GetElectronicBom({ auditFlowId, solutionId }) || {}
  if (success) {
    data.tableData = result || []
  }
}

onMounted(async () => {
  if (auditFlowId && solutionId) {
    init()
    queryBoardInfomation()
    getRole()
  }
})
</script>
<style lang="scss" scoped>
.electronic-import {
  padding:20px 0;
  &__btn-container {
    margin: 20px 0;
    position: relative;
  }
}
</style>
