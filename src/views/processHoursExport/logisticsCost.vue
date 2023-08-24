<template>
    <div>
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
                    <el-button type="primary" :disabled="cardData.length < 1 || cardData[0].logisticscostList?.length < 1"
                        @click="submitData()">提交</el-button>
                    <el-button type="primary" :disabled="cardData.length < 1 || cardData[0].logisticscostList?.length < 1"
                        @click="saveTableData()">保存</el-button>
                    <!-- <template  v-if="!data.editDisabled">
                        <el-button type="info"     @click="resetTableData()">重置</el-button>
                        <el-button type="primary"  @click="saveTableData()">保存</el-button>
                    </template>
                    <template v-else>
                        <el-button  type="primary" @click="openEdit()">开启编辑</el-button>
                    </template> -->
                </div>
            </div>

            <div class="u-p-t-10 u-p-b-10  u-flex u-flex-wrap u-row-left u-col-center">
                <div class="u-m-5">
                    <el-button type="primary">SOR查看</el-button>
                </div>
                <div class="u-m-5">
                    <el-button type="primary">查看物流&包装基础数据</el-button>
                </div>
            </div>

            <div v-if="cardData.length > 0">
                <el-card class="box-card u-m-b-10" v-for="(cardItem, cardIndex) in cardData" :key="cardIndex">
                    <template #header>
                        <div style="font-weight: bold;">
                            <span>{{ cardItem.classification }}</span>
                            <span>K/Y</span>
                        </div>
                    </template>
                    <div>
                        <el-table :data="(cardItem.logisticscostList)" max-height="500px" style="width: 100%" border>
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
                                        <el-input-number v-model="scope.row.packagingPrice" :precision="2" :step="0.01"
                                            @change="pcsPriceChange($event, scope.$index, scope.row)" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="运费/月" align="center">
                                <template #default="scope">
                                    <div>
                                        <!-- :disabled="data.editDisabled" -->
                                        <el-input-number v-model="scope.row.freightPrice" :precision="2" :step="0.01"
                                            @change="freightPriceChange($event, scope.$index, scope.row)" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="仓储费用/月" align="center">
                                <template #default="scope">
                                    <div>
                                        <!--  :disabled="data.editDisabled" -->
                                        <el-input-number v-model="scope.row.storagePrice" :precision="2" :step="0.01"
                                            @change="storagePriceChange($event, scope.$index, scope.row)" />
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="月需求量" align="center">
                                <template #default="scope">
                                    <div>
                                        <span v-if="scope.row.yearMountCount">{{ (scope.row.yearMountCount / 12).toFixed(2)
                                        }}</span>
                                        <span v-else>--</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="单PCS运输费" align="center">
                                <template #default="scope">
                                    <div>
                                        <span>{{ scope.row.singlyDemandPrice }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="单PCS总物流成本" align="center">
                                <template #default="scope">
                                    <div>
                                        <span>{{ scope.row.transportPrice }}</span>
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
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import getQuery from "@/utils/getQuery";
import { useProductStore } from "@/store/modules/productList"
import { GetListAll, createProcess, createSubmit, GetGradientllodelYearByProductId, GetGradientByAuditFlowId } from "@/api/logisticsCost";
const data = reactive({
    editDisabled: true,
    planOptions: [
        {
            value: '100',
            label: '前视-方案一',
        },
        {
            value: '200',
            label: '前视-方案二',
        },
        {
            value: '300',
            label: '侧视-方案一',
        },
        {
            value: '400',
            label: '侧视-方案二',
        },
    ],
})
const productStore = useProductStore()
//路径上的参数
const queryParam = ref({
    AuditFlowId: "",
    SolutionId: "",
})
const { auditFlowId, productId }: any = getQuery()
const cardData = ref([]);
let tempCardData: any = [];

onMounted(() => {
    queryParam.value.AuditFlowId = auditFlowId
    queryParam.value.SolutionId = productId;
    getListData();
})

const getListData = () => {
    let param = queryParam.value;
    if (param.SolutionId != undefined && param.AuditFlowId != undefined) {
        GetListAll(param).then((response: any) => {
            if (response.success) {
                let data = response.result;
                console.log("物流列表", data);
                cardData.value = data;
            } else {
                ElMessage({
                    type: 'error',
                    message: '列表加载失败'
                })
            }
        })
    }
}

const planChange = (value: any) => {
    console.log("当前方案", value);
    getListData();
}

//单PCS包装价格/元发生变化
const pcsPriceChange = (value: any, index: any, item: any) => {
    console.log("单片价格变化", value);
    console.log(`index===${index}`, item);
    if (item.packagingPrice && item.singlyDemandPrice) {
        item.transportPrice = Number(item.packagingPrice) + item.singlyDemandPrice;
    }
}
//运费/月发生变化
const freightPriceChange = (value: any, index: any, item: any) => {
    console.log("运费变化", value);
    console.log(`index===${index}`, item);
    let yearCount = item.yearMountCount ? item.yearMountCount : 1;
    let monthlyDemandPrice = yearCount / 12;
    item.monthlyDemandPrice = monthlyDemandPrice;
    console.log("月需求量", monthlyDemandPrice);
    let singlePCS = (item.freightPrice + item.storagePrice) / monthlyDemandPrice;
    console.log("单PCS运输费", singlePCS);
    item.singlyDemandPrice = Number(singlePCS.toFixed(2));
    if (item.packagingPrice && item.singlyDemandPrice) {
        item.transportPrice = Number(item.packagingPrice) + item.singlyDemandPrice;
        console.log("单PCS总物流成本", item.transportPrice);
    }
}
//仓储费用/月发生变化
const storagePriceChange = (value: any, index: any, item: any) => {
    console.log("仓储费用变化", value);
    console.log(`index===${index}`, item);
    let yearCount = item.yearMountCount ? item.yearMountCount : 1;
    let monthlyDemandPrice = yearCount / 12;
    item.monthlyDemandPrice = monthlyDemandPrice;
    console.log("月需求量", monthlyDemandPrice);
    let singlePCS = (item.freightPrice + item.storagePrice) / monthlyDemandPrice;
    console.log("单PCS运输费", singlePCS);
    item.singlyDemandPrice = Number(singlePCS.toFixed(2));
    if (item.packagingPrice && item.singlyDemandPrice) {
        item.transportPrice = Number(item.packagingPrice) + item.singlyDemandPrice;
        console.log("单PCS总物流成本", item.transportPrice);
    }
}

//保存
const saveTableData = () => {
    console.log("保存数据", cardData.value);
    let param = {
        auditFlowId: queryParam.value.AuditFlowId,
        solutionId: queryParam.value.SolutionId,
        logisticscostList: JSON.parse(JSON.stringify(cardData.value))
    };
    createProcess(param).then((response: any) => {
        console.log("新增响应", response);
        if (response.success) {
            ElMessage({
                type: 'success',
                message: '保存成功'
            })
            getListData()
        } else {
            ElMessage({
                type: 'error',
                message: '保存失败'
            })
        }
    })
}

const submitData = () => {
    let param = {
        auditFlowId: queryParam.value.AuditFlowId,
    };
    createSubmit(param).then((response: any) => {
        console.log("提交响应", response);
        if (response.success) {
            ElMessage({
                type: 'success',
                message: response.result
            })
            getListData()
        } else {
            ElMessage({
                type: 'error',
                message: '失败'
            })
        }
    })
}

const openEdit = () => {
    console.log("开启编辑");
    data.editDisabled = false;
    tempCardData = JSON.parse(JSON.stringify(cardData.value));
}

const resetTableData = () => {
    console.log("重置数据")
    cardData.value = tempCardData;
    data.editDisabled = true;
}


const handleEdit = (index: any, item: any) => {
    console.log(`启用编辑,下标:${index}`, item);
}
</script>
<style></style>
