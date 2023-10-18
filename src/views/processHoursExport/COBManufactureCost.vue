<template>
  <div class="u-p-20">
    <div>
      <ProcessVertifyBox :onSubmit="submitData" processType="confirmProcessType" v-havedone />
    </div>
    <div class="u-p-t-10 u-p-b-10 u-flex u-flex-wrap u-row-left u-col-center">
      <div class="u-m-5">
        <el-button type="primary"  @click="BomProjectDialog" >查看BOM单价</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="showProjectDialog" >查看项目走量</el-button>
      </div>
    </div>
    <!-- COB-UPH表格区 -->
    <el-card class="u-m-b-30" v-if="COBUPHData.isCOB">
      <el-scrollbar wrap-style="padding:10px 0px;">
        <div class="u-flex u-row-left u-col-center u-text-center">
          <div style="background-color: rgb(247, 247, 96)">
            <div class="u-border u-width-200 u-height-26">
              <span> </span>
            </div>
            <div class="u-border u-width-200 u-height-26">COB-UPH</div>
          </div>
          <template v-if="COBUPHData.processHoursEnterUphBomItemsList.length > 0">
            <div
              v-for="(uph, uphIndex) in COBUPHData.processHoursEnterUphBomItemsList"
              :key="uphIndex"
              style="background-color: rgb(247, 247, 96)"
            >
              <div class="u-border u-width-200 u-height-26">
                <span>{{ uph.year }}</span>
              </div>
              <div class="u-border u-width-200 u-height-26">
                <span>{{ uph.comPuh }}</span>
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </el-card>
    <!-- 表格数据录入区 -->
    <div class="table-box">
      <!-- max-height="800px" -->
      <el-scrollbar>
        <div style="color: #000000">
          <div class="u-m-b-20" v-for="(dataItem, dataIndex) in tableData" :key="dataIndex">
            <el-card>
              <template #header>
                <div class="title-box u-font-20">
                  <span>{{ dataItem.classification }}</span>
                  <span>K/Y</span>
                </div>
              </template>
              <div>
                <div class="title-box">
                  <span>COB制造成本</span>
                </div>
                <div class="u-m-t-10">
                  <el-table :data="dataItem.listBomEnter" border style="color: #000000" max-height="400px">
                    <el-table-column label="年份" align="center">
                      <template #default="scope">
                        <span>{{ scope.row.year }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="直接制造成本" align="center">
                      <el-table-column label="直接人工" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.directLaborPrice }}</span> -->
                          <el-input-number
                            v-model="scope.row.directLaborPrice"
                            @change="directChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="设备折旧" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.directDepreciation }}</span> -->
                          <el-input-number
                            v-model="scope.row.directDepreciation"
                            @change="directChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="换线成本" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.directLineChangeCost }}</span> -->
                          <el-input-number
                            v-model="scope.row.directLineChangeCost"
                            @change="directChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="制造费用" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.directManufacturingCosts }}</span> -->
                          <el-input-number
                            v-model="scope.row.directManufacturingCosts"
                            @change="directChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="小计" width="200" align="center" label-class-name="labelClassName">
                        <template #default="scope">
                          <span>{{ scope.row.directSummary ? Number(scope.row.directSummary).toFixed(2) : 0.0 }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="间接制造成本" align="center">
                      <el-table-column label="直接人工" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.indirectLaborPrice }}</span> -->
                          <el-input-number
                            v-model="scope.row.indirectLaborPrice"
                            @change="indirectChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="设备折旧" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.indirectDepreciation }}</span> -->
                          <el-input-number
                            v-model="scope.row.indirectDepreciation"
                            @change="indirectChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>

                      <el-table-column label="制造费用" width="200" align="center">
                        <template #default="scope">
                          <!-- <span>{{ scope.row.indirectManufacturingCosts }}</span> -->
                          <el-input-number
                            v-model="scope.row.indirectManufacturingCosts"
                            @change="indirectChange($event, scope.$index, scope.row, dataIndex)"
                            :precision="2"
                            :step="0.01"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column label="小计" width="200" align="center" label-class-name="labelClassName">
                        <template #default="scope">
                          <span>{{
                            scope.row.indirectSummary ? Number(scope.row.indirectSummary).toFixed(2) : 0.0
                          }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="合计成本" align="center" width="200">
                      <template #default="scope">
                        <span>{{ scope.row.totalCost ? Number(scope.row.totalCost).toFixed(2) : 0.0 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" align="center" width="200">
                      <template #default="scope">
                        <!-- <span>{{ scope.row.remark }}</span> -->
                        <el-input type="textarea" autosize v-model="scope.row.remark" placeholder="请输入备注内容" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="u-m-t-20">
                <div class="title-box">
                  <span>Other</span>
                </div>
                <div class="u-m-t-10">
                  <el-table
                    :data="dataItem.listBomEnterTotal"
                    border
                    max-height="400px"
                    style="width: 600px; color: #000000"
                  >
                    <el-table-column label="年份" align="center" width="200">
                      <template #default="scope">
                        <span>{{ scope.row.year }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="合计" align="center" width="200">
                      <template #default="scope">
                        <!-- <span>{{ scope.row.totalCost }}</span> -->
                        <el-input-number v-model="scope.row.totalCost" :precision="2" :step="0.01" />
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" align="center" width="200">
                      <template #default="scope">
                        <!-- <span>{{ scope.row.remark }}</span> -->
                        <el-input type="textarea" autosize v-model="scope.row.remark" placeholder="请输入备注内容" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog v-model="open"  width="1400px">
      <el-card header="结构BOM单价" class="m-2">
        <ConstructionTable ref="constructionRef" />
      </el-card>
      <el-card header="电子料单价" class="m-2">
        <ElectronicTable ref="electronicRef" />
      </el-card>
    </el-dialog>

    <el-dialog v-model="dialogTableVisible" title="模组数量" :close-on-click-modal="false" width="60%">
      <div>
        <el-card v-for="(project, index) in dialogProData" :key="index" class="u-m-b-10">
          <template #header>
            <div style="font-weight: bold">{{ project.sumQuantity }}/KY</div>
          </template>
          <div>
            <div class="u-flex u-row-left u-col-center">
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>客户零件号</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>子项目代码</span>
              </div>
              <div class="u-border u-text-center u-width-500 u-p-t-5 u-p-b-5">
                <span>产品名称</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>产品大类</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>像素</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5"
                   v-for="(yearItem, yearIndex) in project.modelCountYearList" :key="yearIndex">

                <span v-if="yearItem.upDown==1">{{ yearItem.year }}上半年</span>
                <span v-if="yearItem.upDown==2">{{ yearItem.year }}下半年</span>
                <span v-if="yearItem.upDown==0">{{ yearItem.year }}</span>
              </div>
            </div>
            <div class="u-flex u-row-left u-col-center">
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ project.partNumber }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ project.code }}</span>
              </div>
              <div class="u-border u-text-center u-width-500 u-p-t-5 u-p-b-5">
                <span>{{ project.product }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ project.productTypeName }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ project.pixel }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5"
                   v-for="(yearItem, yearIndex) in project.modelCountYearList" :key="yearIndex">
                <span>{{ yearItem.quantity }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import getQuery from "@/utils/getQuery"
import { ElMessage, ElMessageBox, genFileId } from "element-plus"
import { GetListAll, getCOBUPH, update, create, handleSubmit, deleteItem, uploadAction } from "@/api/COB"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import router from "@/router";
import ElectronicTable from "@/components/comTable/index.vue"
import ConstructionTable from "@/components/cobconstructionVTable/index.vue"
import {GetPriceEvaluationStartData} from "@/api/processHoursEnter";
//路径上的参数
const queryParam = ref({
  AuditFlowId: undefined,
  SolutionId: undefined
})
const open = ref(false)
const { auditFlowId, productId }: any = getQuery()
//COB-UPH
const COBUPHData = ref<any>({
  processHoursEnterUphBomItemsList: [],
  isCOB: false
})

//表格数据
const tableData = ref<any>([])
const dialogTableVisible = ref(false)
const dialogProData = ref([])

let tempTableDataArr = [
  {
    classification: "500K",
    listBomEnter: [
      {
        year: "15/Jul", //年份
        //直接制造成本
        directLaborPrice: "sss", //直接人工
        directDepreciation: "vvv", //设备折旧
        directLineChangeCost: "sss", //换线成本
        directManufacturingCosts: "aaa", //制造费用
        directSummary: "ggg",
        //间接制造成本
        indirectLaborPrice: "www", //直接人工
        indirectDepreciation: "qqq", //设备折旧
        indirectManufacturingCosts: "trttt", //制造费用
        indirectSummary: "ggg",
        totalCost: "12345", //合计成本
        remark: "fgdf" //备注
      },
      {
        year: "16/Jul", //年份
        //直接制造成本
        directLaborPrice: "sss", //直接人工
        directDepreciation: "vvv", //设备折旧
        directLineChangeCost: "sss", //换线成本
        directManufacturingCosts: "aaa", //制造费用
        directSummary: "ggg",
        //间接制造成本
        indirectLaborPrice: "www", //直接人工
        indirectDepreciation: "qqq", //设备折旧
        indirectManufacturingCosts: "trttt", //制造费用
        indirectSummary: "ggg",
        totalCost: "12345", //合计成本
        remark: "fgdf" //备注
      }
    ],
    listBomEnterTotal: [
      {
        year: "15/Jul",
        totalCost: "xxx",
        remark: "yyyy"
      },
      {
        year: "16/Jul",
        totalCost: "1111",
        remark: "2222"
      }
    ]
  }
]
//页面加载函数
onMounted(async () => {
  queryParam.value.AuditFlowId = auditFlowId
  queryParam.value.SolutionId = productId
  initData()
})

const getListData = async (param: any) => {
  await GetListAll(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      tableData.value = data
      console.log("COB列表数据", data)
    } else {
      ElMessage({
        type: "error",
        message: "COB列表数据加载失败"
      })
    }
  })
}

const getCOBUPHData = async (param: any) => {
  await getCOBUPH(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      COBUPHData.value = data
      console.log("======COBUPHData=====", data)
    } else {
      ElMessage({
        type: "error",
        message: "COB列表数据加载失败"
      })
    }
  })
}

const initData = () => {
  let param = queryParam.value
  if (param.SolutionId != undefined && param.AuditFlowId != undefined) {
    getCOBUPHData(param)
    getListData(param)
  }
}

const directChange = (value: any, index: any, item: any, tableIndex: number) => {
  let directLaborPrice = item.directLaborPrice ? item.directLaborPrice : 0.0
  let directDepreciation = item.directDepreciation ? item.directDepreciation : 0.0
  let directManufacturingCosts = item.directManufacturingCosts ? item.directManufacturingCosts : 0.0
  let directLineChangeCost = item.directLineChangeCost ? item.directLineChangeCost : 0.0
  let subTotal =
    Number(directLaborPrice) +
    Number(directDepreciation) +
    Number(directManufacturingCosts) +
    Number(directLineChangeCost)
  tableData.value[tableIndex].listBomEnter[index].directSummary = subTotal
  let indirectSummary = tableData.value[tableIndex].listBomEnter[index].indirectSummary
  tableData.value[tableIndex].listBomEnter[index].totalCost = subTotal + (indirectSummary ? indirectSummary : 0.0)
}

const indirectChange = (value: any, index: any, item: any, tableIndex: number) => {
  let indirectLaborPrice = item.indirectLaborPrice ? item.indirectLaborPrice : 0.0
  let indirectDepreciation = item.indirectDepreciation ? item.indirectDepreciation : 0.0
  let indirectManufacturingCosts = item.indirectManufacturingCosts ? item.indirectManufacturingCosts : 0.0
  let subTotal = Number(indirectLaborPrice) + Number(indirectDepreciation) + Number(indirectManufacturingCosts)
  tableData.value[tableIndex].listBomEnter[index].indirectSummary = subTotal
  let directSummary = tableData.value[tableIndex].listBomEnter[index].directSummary
  tableData.value[tableIndex].listBomEnter[index].totalCost = subTotal + (directSummary ? directSummary : 0.0)
}

//保存
const saveTableData = () => {
  let param = {
    auditFlowId: queryParam.value.AuditFlowId,
    solutionId: queryParam.value.SolutionId,
    listBomEnter: JSON.parse(JSON.stringify(tableData.value))
  }
  console.log("财务部提交保存参数", param)
  return create(param).then((response: any) => {
    console.log("保存响应", response)
    if (response.success) {
      ElMessage({
        type: "success",
        message: "保存成功"
      })
      initData()
    } else {
      ElMessage({
        type: "error",
        message: "保存失败"
      })
    }
  })
}
const BomProjectDialog = () => {
  open.value = true
}
//模组数据
const showProjectDialog = async () => {

  await GetPriceEvaluationStartData({auditFlowId: auditFlowId}).then((response: any) => {
    console.log("项目走量数据", response);
    if (response.success) {
      let modelCounts = response.result.modelCount;
      dialogProData.value = response.result.modelCount;
      dialogTableVisible.value = true;
    } else {
      ElMessage({
        type: "warning",
        message: "数据加载失败!"
      })
      return;
    }
  })
}
//提交
const submitData = ({ comment, opinion, nodeInstanceId }: any) => {
  let param = {
    auditFlowId: queryParam.value.AuditFlowId,
    solutionId: queryParam.value.SolutionId,
    comment,
    opinion,
    nodeInstanceId
  }
  saveTableData().then((p) => {
    handleSubmit(param).then((response: any) => {
      console.log("提交响应", response)
      if (response.success) {
        ElMessage({
          type: "success",
          message: response.result
        })
        initData()
      } else {
        ElMessage({
          type: "error",
          message: "失败"
        })
      }
    })
  })
}
</script>
<style>
.table-box {
  color: #000000;
  font-size: 16px;
}

.table-box .el-table__body-wrapper .el-scrollbar__bar.is-horizontal {
  height: 8px !important;
}

.table-box .el-scrollbar__bar {
  bottom: 0 !important;
}

.table-box .title-box {
  font-size: 16px;
  color: #000000;
  font-weight: bold;
}

.labelClassName {
  background-color: rgb(247, 247, 96) !important;
}
</style>
