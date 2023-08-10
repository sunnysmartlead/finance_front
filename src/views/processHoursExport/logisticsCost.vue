<template>
    <div>
        <div>
            <div class="u-flex u-row-between u-col-center u-p-t-10 u-p-b-10 u-border-bottom">
                <div class="u-flex u-row-left u-col-center">
                    <div style="font-size: 14px;font-weight: bold;">
                        <span>零件列表</span>
                    </div>
                    <div class="u-m-l-10">
                        <el-select v-model="data.currentPlan" placeholder="请选择方案" size="large">
                            <el-option v-for="item in data.planOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                </div>
                <div>
                    <el-button type="primary">提交</el-button>
                    <el-button type="primary"  @click="saveTableData()">保存</el-button>
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

            <div v-if="data.cardData.length>0">
                <el-card class="box-card u-m-b-10" v-for="(cardItem,cardIndex) in data.cardData" :key="cardIndex">
                    <template #header>
                            <div style="font-weight: bold;">
                                <span>{{cardItem.spec}}</span>
                            </div>
                    </template>
                    <div>
                        <el-table :data="(cardItem.tableData)" style="width: 100%" border>
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
                                        <el-input-number  v-model="scope.row.pcsPrice"  :precision="2" :step="0.01"  @change="pcsPriceChange($event,scope.$index, scope.row)"/>
                                    </div>
                                </template>   
                            </el-table-column>
                            <el-table-column label="运费/月" align="center">
                                <template #default="scope">
                                    <div>
                                        <!-- :disabled="data.editDisabled" -->
                                        <el-input-number  v-model="scope.row.monthFreight"  :precision="2" :step="0.01"  @change="monthFreightChange($event,scope.$index, scope.row)"/>
                                    </div>
                                </template>   
                            </el-table-column>
                            <el-table-column label="仓储费用/月" align="center">
                                <template #default="scope">
                                    <div>
                                        <!--  :disabled="data.editDisabled" -->
                                        <el-input-number v-model="scope.row.monthStorage"  :precision="2" :step="0.01"  @change="monthStorageChange($event,scope.$index, scope.row)"/>
                                    </div>
                                </template>   
                            </el-table-column> 
                            <el-table-column label="月需求量" align="center">
                                <template #default="scope">
                                    <div>
                                        <span>{{ scope.row.monthRequirement }}</span>
                                    </div>
                                </template>   
                            </el-table-column>
                            <el-table-column label="单PCS运输费" align="center">
                                <template #default="scope">
                                    <div>
                                        <span>{{ scope.row.pcsFreight }}</span>
                                    </div>
                                </template>   
                            </el-table-column>  
                            <el-table-column label="单PCS总物流成本" align="center">
                                <template #default="scope">
                                    <div>
                                        <span>{{ scope.row.pcsFreightCost }}</span>
                                    </div>
                                </template>   
                            </el-table-column>   
                            <el-table-column label="备注" align="center">
                                <template #default="scope">
                                    <div>
                                        <el-input v-model="scope.row.remark" placeholder="请输入备注内容"/>
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
import { ref, reactive, toRefs,onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
const data = reactive({
    currentPlan: '1',
    editDisabled:true,
    planOptions: [
        {
            value: '1',
            label: '前视-方案一',
        },
        {
            value: '2',
            label: '前视-方案二',
        },
        {
            value: '3',
            label: '侧视-方案一',
        },
        {
            value: '4',
            label: '侧视-方案二',
        },
    ],
    cardData:<any>[],
})
   
let tempCardData:any=[];

onMounted(async ()=>{
    data.cardData=await initData(); 
})

const initData=()=>{
    let res:any= [{
            spec:'500K/Y',
            tableData:[
                {
                    year:'2023',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                },
                {
                    year:'2024',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                },
                {
                    year:'2025',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                }
            ]
        },
        {
            spec:'1000K/Y',
            tableData:[
                {
                    year:'2023',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                },
                {
                    year:'2024',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                },
                {
                    year:'2025',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                }
            ]
        },
        {
            spec:'2000K/Y',
            tableData:[
                {
                    year:'2023',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                },
                {
                    year:'2024',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                },
                {
                    year:'2025',
                    pcsPrice:0.00,
                    monthFreight:0.00,
                    monthStorage:0.00,
                    monthRequirement:0.00,
                    pcsFreight:0.00,
                    pcsFreightCost:0.00,
                    remark:'',
                }
            ]
    }];
    return res;
}

const pcsPriceChange=(value: any,index :any,item:any)=>{
    console.log("单片价格变化",value);
    console.log(`index===${index}`,item);
}
const monthFreightChange=(value: any,index :any,item:any)=>{
    console.log("运费变化",value);
    console.log(`index===${index}`,item);
}

const monthStorageChange=(value: any,index :any,item:any)=>{
    console.log("仓储费用变化",value);
    console.log(`index===${index}`,item);
}


const resetTableData=()=>{
    console.log("重置数据")
    data.cardData=tempCardData;
    data.editDisabled=true;
}

const saveTableData=()=>{
    console.log("保存数据");
    data.editDisabled=true;
}

const openEdit=()=>{
    console.log("开启编辑");
    data.editDisabled=false;
    tempCardData=JSON.parse(JSON.stringify(data.cardData));
}

const handleEdit=(index :any,item:any)=>{
    console.log(`启用编辑,下标:${index}`,item);
}



defineExpose({
    ...toRefs(data),
})
</script>
<style></style>