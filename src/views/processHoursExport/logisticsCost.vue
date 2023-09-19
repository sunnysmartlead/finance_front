<template>
  <div>
    <div style="margin: 10px 0; float: right">
      <ProcessVertifyBox :onSubmit="handleSetBomState" processType="confirmProcessType" v-havedone />
      <!-- <el-button type="primary" @click="agree(1, true)" v-havedone>同意</el-button>
        <el-button @click="agree(1, false)" type="danger" v-havedone>拒绝</el-button> -->
    </div>
    <div>
      <div class="u-flex u-row-between u-col-center u-p-t-10 u-p-b-10 u-border-bottom">
        <div class="u-flex u-row-left u-col-center">
          <!-- <div style="font-size: 14px;font-weight: bold;">
                        <span>零件列表</span>
                    </div>
                    <div class="u-m-l-10">
                        <el-select @change="planChange" v-model="queryParam.SolutionId" disabled placeholder="请选择方案"
                            size="large">
                            <el-option v-for="(item, index)  in  productStore.productList" :key="index"
                                :label="item.moduleName" :value="item.id + ''" /></el-select>
                    </div> -->
        </div>
        <div>
          <!-- <el-button
            type="primary"
            :disabled="cardData.length < 1 || cardData[0].logisticscostList?.length < 1"
            @click="submitData()"
            >提交</el-button
          >
          <el-button
            type="primary"
            :disabled="cardData.length < 1 || cardData[0].logisticscostList?.length < 1"
            @click="saveTableData()"
            >保存</el-button
          > -->
          <!-- <template  v-if="!data.editDisabled">
                        <el-button type="info"     @click="resetTableData()">重置</el-button>
                        <el-button type="primary"  @click="saveTableData()">保存</el-button>
                    </template>
                    <template v-else>
                        <el-button  type="primary" @click="openEdit()">开启编辑</el-button>
                    </template> -->
        </div>
      </div>

      <div class="u-p-t-10 u-p-b-10 u-flex u-flex-wrap u-row-left u-col-center">
        <div class="u-m-5">
          <el-button type="primary" @click="sorDownloadFile" >SOR查看</el-button>
        </div>
        <div class="u-m-5">
          <el-button type="primary" @click="initFetchProductDevelopmentInput">查看物流&包装基础数据</el-button>
        </div>
      </div>

      <div v-if="cardData.length > 0">
        <el-card class="box-card u-m-b-10" v-for="(cardItem, cardIndex) in cardData" :key="cardIndex">
          <template #header>
            <div style="font-weight: bold">
              <span>{{ cardItem.classification }}</span>
              <span>K/Y</span>
            </div>
          </template>
          <div>
            <el-table :data="cardItem.logisticscostList" max-height="500px" style="width: 100%" border>
              <el-table-column label="年份" align="center">
                <template #default="scope">
                  <div>
                    <span>{{ scope.row.year }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单PCS包装价格/元" align="center">
                <template #default="scope">
                  <div>
                    <!-- :disabled="data.editDisabled" -->
                    <el-input-number
                      v-model="scope.row.packagingPrice"
                      :precision="2"
                      :step="0.01"
                      @change="pcsPriceChange($event, scope.$index, scope.row,cardIndex)"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="运费/月" align="center">
                <template #default="scope">
                  <div>
                    <!-- :disabled="data.editDisabled" -->
                    <el-input-number
                      v-model="scope.row.freightPrice"
                      :precision="2"
                      :step="0.01"
                      @change="freightPriceChange($event, scope.$index, scope.row,cardIndex)"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="仓储费用/月" align="center">
                <template #default="scope">
                  <div>
                    <!--  :disabled="data.editDisabled" -->
                    <el-input-number
                      v-model="scope.row.storagePrice"
                      :precision="2"
                      :step="0.01"
                      @change="storagePriceChange($event, scope.$index, scope.row,cardIndex)"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="月需求量" align="center">
                <template #default="scope">
                  <div>
                    <span v-if="scope.row.yearMountCount">{{ (scope.row.yearMountCount / 12*1000).toFixed(2) }}</span>
                    <span v-else>--</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单PCS运输费" align="center">
                <template #default="scope">
                  <div>
                    <span>{{((scope.row.freightPrice +scope.row.storagePrice)/scope.row.yearMountCount).toFixed(2)}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单PCS总物流成本" align="center">
                <template #default="scope">
                  <div>
                    <span>{{ scope.row.transportPrice?Number(scope.row.transportPrice).toFixed(2):'0.00' }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template #default="scope">
                  <div>
                    <el-input type="textarea" v-model="scope.row.remark" placeholder="请输入备注内容" />
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作">
                                <template #default="scope">
                                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                </template>
                            </el-table-column>                      -->
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" :close-on-click-modal="false" >
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
          <el-input
            v-model="data.logisticsForm.remarks"
            type="textarea"
            placeholder="若无具体包装数据,填写参考的具体项目及产品"
          />
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import getQuery from "@/utils/getQuery"
import { useProductStore } from "@/store/modules/productList"
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"

import {
  GetListAll,
  createProcess,
  createSubmit,
  GetGradientllodelYearByProductId,
  GetGradientByAuditFlowId,
  viewSOR
} from "@/api/logisticsCost"
import {getSorByAuditFlowId} from "@/components/CustomerSpecificity/service";
import {CommonDownloadFile,getProductDevelopmentInput} from "@/api/bom";
import {isEmpty, map} from "lodash";

const data = reactive({
  editDisabled: true,
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
})
const productStore = useProductStore()
//路径上的参数
const queryParam = ref({
  AuditFlowId: "",
  SolutionId: ""
})
const { auditFlowId, productId }: any = getQuery()
const cardData = ref([])
let tempCardData: any = []
const dialogFormVisible = ref(false)
const initFetchProductDevelopmentInput = async () => {
  let { success, result }: any = await getProductDevelopmentInput({ auditFlowId: auditFlowId, solutionId: productId })
  if (success && !isEmpty(result)) {
    dialogFormVisible.value = true
    data.logisticsForm = result;
  }else {
    dialogFormVisible.value = false
    ElMessage({
      type: "error",
      message: "无数据"
    })
  }
}
onMounted(() => {
  queryParam.value.AuditFlowId = auditFlowId
  queryParam.value.SolutionId = productId
  getListData()
})
const sorDownloadFile =async () => {
  if (auditFlowId) {
    try {
      const {result}: any = (await getSorByAuditFlowId(auditFlowId)) || {}
      let res: any = await CommonDownloadFile(result.sorFileId)
      const blob = res
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        let url = URL.createObjectURL(new Blob([blob]))
        let a = document.createElement("a")
        document.body.appendChild(a) //此处增加了将创建的添加到body当中
        a.href = url
        a.download = result.sorFileName
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } catch (err: any) {
      console.log(err)
    }
  }
}
const getListData = () => {
  let param = queryParam.value
  if (param.SolutionId != undefined && param.AuditFlowId != undefined) {
    GetListAll(param).then((response: any) => {
      if (response.success) {
        let data = response.result
        console.log("物流列表", data)
        cardData.value = data
      } else {
        ElMessage({
          type: "error",
          message: "列表加载失败"
        })
      }
    })
  }
}

const showSor=()=>{
  if(auditFlowId != undefined){
    let param={
      auditFlowId:auditFlowId
    }
    viewSOR(param).then((response: any) => {
      if (response.success) {
        let data = response.result;
        console.log("SOR请求响应",data);
      } else {
        ElMessage({
          type: "error",
          message: "数据加载失败!"
        })
      }
    })
  }
}

const handleSetBomState = async ({ comment, opinion, nodeInstanceId }: any) => {
  saveTableData()
  submitData({ comment, opinion, nodeInstanceId })
}

const planChange = (value: any) => {
  console.log("当前方案", value)
  getListData()
}

//单PCS包装价格/元发生变化
const pcsPriceChange = (value: any, index: any, item: any,cardIndex:number) => {
  console.log("单片价格变化", value);
  console.log("当前下表",cardIndex);
  console.log(`index===${index}`,item)
  if (item.packagingPrice && item.singlyDemandPrice) {
    item.transportPrice = Number(item.packagingPrice) + item.singlyDemandPrice
  }
  if(cardIndex==0&&index==0){
    cardData.value.map(function(cardItem:any){
      if(cardItem.logisticscostList!=null&&cardItem.logisticscostList.length>0){
        cardItem.logisticscostList.map(function(logItem:any){
          logItem.packagingPrice=value;
        })
      }
    })
  }
}
//运费/月发生变化
const freightPriceChange = (value: any, index: any, item: any,cardIndex:number) => {
  console.log("运费变化", value)
  console.log(`index===${index}`, item)
  let yearCount = item.yearMountCount ? item.yearMountCount : 1
  let monthlyDemandPrice = yearCount / 12
  item.monthlyDemandPrice = monthlyDemandPrice
  console.log("月需求量", monthlyDemandPrice)
  let singlePCS = (item.freightPrice + item.storagePrice) / monthlyDemandPrice
  console.log("单PCS运输费", singlePCS)
  item.singlyDemandPrice = Number(singlePCS.toFixed(2))
  if (item.packagingPrice && item.singlyDemandPrice) {
    item.transportPrice = Number(item.packagingPrice) + item.singlyDemandPrice
    console.log("单PCS总物流成本", item.transportPrice)
  }
  if(cardIndex==0&&index==0){
    cardData.value.map(function(cardItem:any){
      if(cardItem.logisticscostList!=null&&cardItem.logisticscostList.length>0){
        cardItem.logisticscostList.map(function(logItem:any){
          logItem.freightPrice=value;
          let yearCount = logItem.yearMountCount ? logItem.yearMountCount : 1
          let monthlyDemandPrice = yearCount / 12
          logItem.monthlyDemandPrice = monthlyDemandPrice
          let singlePCS = (logItem.freightPrice + logItem.storagePrice) / monthlyDemandPrice
          logItem.singlyDemandPrice = Number(singlePCS.toFixed(2))
          if (logItem.packagingPrice && logItem.singlyDemandPrice) {
            logItem.transportPrice = Number(logItem.packagingPrice) + logItem.singlyDemandPrice
          }

        })
      }
    })
  }


}
//仓储费用/月发生变化
const storagePriceChange = (value: any, index: any, item: any,cardIndex:number) => {
  console.log("仓储费用变化", value)
  console.log(`index===${index}`, item)
  let yearCount = item.yearMountCount ? item.yearMountCount : 1
  let monthlyDemandPrice = yearCount / 12
  item.monthlyDemandPrice = monthlyDemandPrice
  console.log("月需求量", monthlyDemandPrice)
  let singlePCS = (item.freightPrice + item.storagePrice) / monthlyDemandPrice
  console.log("单PCS运输费", singlePCS)
  item.singlyDemandPrice = Number(singlePCS.toFixed(2))
  if (item.packagingPrice && item.singlyDemandPrice) {
    item.transportPrice = Number(item.packagingPrice) + item.singlyDemandPrice
    console.log("单PCS总物流成本", item.transportPrice)
  }

  if(cardIndex==0&&index==0){
    cardData.value.map(function(cardItem:any){
      if(cardItem.logisticscostList!=null&&cardItem.logisticscostList.length>0){
        cardItem.logisticscostList.map(function(logItem:any){
          logItem.storagePrice=value;
          let yearCount = logItem.yearMountCount ? logItem.yearMountCount : 1
          let monthlyDemandPrice = yearCount / 12
          logItem.monthlyDemandPrice = monthlyDemandPrice
          let singlePCS = (logItem.freightPrice + logItem.storagePrice) / monthlyDemandPrice
          logItem.singlyDemandPrice = Number(singlePCS.toFixed(2))
          if (logItem.packagingPrice && logItem.singlyDemandPrice) {
            logItem.transportPrice = Number(logItem.packagingPrice) + logItem.singlyDemandPrice
          }
        })
      }
    })
  }

}

//保存
const saveTableData = () => {
  console.log("保存数据", cardData.value)
  let param = {
    auditFlowId: queryParam.value.AuditFlowId,
    solutionId: queryParam.value.SolutionId,
    logisticscostList: JSON.parse(JSON.stringify(cardData.value))
  }
  createProcess(param).then((response: any) => {
    console.log("新增响应", response)
    if (response.success) {
      ElMessage({
        type: "success",
        message: "保存成功"
      })
      getListData()
    } else {
      ElMessage({
        type: "error",
        message: "保存失败"
      })
    }
  })
}

const submitData = ({ comment, opinion, nodeInstanceId }: any) => {
  let param = {
    auditFlowId: queryParam.value.AuditFlowId,
    solutionId: queryParam.value.SolutionId,
    opinionDescription: comment,
    opinion,
    nodeInstanceId
  }
  createSubmit(param).then((response: any) => {
    console.log("提交响应", response)
    if (response.success) {
      ElMessage({
        type: "success",
        message: response.result
      })
      getListData()
    } else {
      ElMessage({
        type: "error",
        message: "失败"
      })
    }
  })
}



const openEdit = () => {
  console.log("开启编辑")
  data.editDisabled = false
  tempCardData = JSON.parse(JSON.stringify(cardData.value))
}

const resetTableData = () => {
  console.log("重置数据")
  cardData.value = tempCardData
  data.editDisabled = true
}

const handleEdit = (index: any, item: any) => {
  console.log(`启用编辑,下标:${index}`, item)
}
</script>
<style></style>
