<template>
    <div class="u-p-20">
        <div class="u-flex u-row-between u-col-center u-p-t-10 u-p-b-10 u-border-bottom">
            <div class="u-flex u-row-left u-col-center">
                <div style="font-size: 14px;font-weight: bold;">
                    <span>零件列表</span>
                </div>
                <div class="u-m-l-10">
                    <el-select v-model="currentPlan" placeholder="请选择方案" size="large">
                        <el-option v-for="item in planOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div>
                <el-button type="primary">提交</el-button>
            </div>
        </div>

        <div class="u-p-t-10 u-p-b-10  u-flex u-flex-wrap u-row-left u-col-center">
            <div class="u-m-5">
                <el-button type="primary">查看BOM单价</el-button>
            </div>
            <div class="u-m-5">
                <el-button type="primary">查看项目走量</el-button>
            </div>
        </div>
        <!-- COB-UPH表格区 -->
        <el-card class="u-m-b-30">
            <el-scrollbar wrap-style="padding:10px 0px;">
                <div class="u-flex u-row-left u-col-center u-text-center">
                    <div style="background-color: rgb(247, 247, 96);">
                        <div class="u-border u-width-200 u-height-26">
                            <span> </span>
                        </div>
                        <div class="u-border u-width-200  u-height-26">
                            COB-UPH
                        </div>
                    </div>
                    <template v-for="i in 10">
                        <div v-for="(uph, uphIndex) in COBUPHData" :key="uphIndex"
                            style="background-color: rgb(247, 247, 96);;">
                            <div class="u-border u-width-200  u-height-26">
                                <span>{{ uph.yearIndex }}</span>
                            </div>
                            <div class="u-border u-width-200  u-height-26">
                                <span>{{ uph.UPHValue }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </el-scrollbar>
        </el-card>
        <!-- 表格数据录入区 -->
        <div class="table-box">
            <el-scrollbar>
                <div style="color:#000000">
                    <div class="u-m-b-20" v-for="(dataItem, dataIndex) in tableData" :key="dataIndex">
                        <el-card>
                            <template #header>
                                <div class="title-box u-font-20">
                                    <span>{{dataItem.spec}}</span>
                                </div>
                            </template>
                            <div>
                                <div class="title-box">
                                    <span>COB制造成本</span>
                                </div>
                                <div class="u-m-t-10">
                                    <el-table :data="dataItem.COBCost" border style="color:#000000">
                                        <el-table-column label="年份" align="center">
                                            <template #default="scope">
                                                <span>{{ scope.row.yearIndex }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="直接制造成本" align="center">
                                            <el-table-column label="直接人工" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.directCost.directLaborCosts }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="设备折旧" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.directCost.equipmentDepreciation }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="换线成本" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.directCost.changeLineCost }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="制造费用" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.directCost.manuFree }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="小计" width="200" align="center"
                                                label-class-name="labelClassName">
                                                <template #default="scope">
                                                    <span>{{ scope.row.directCost.subTotal }}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table-column>
                                        <el-table-column label="间接制造成本" align="center">
                                            <el-table-column label="直接人工" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.indirectCost.directLaborCosts }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="设备折旧" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.indirectCost.equipmentDepreciation }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="换线成本" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.indirectCost.changeLineCost }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="制造费用" width="200" align="center">
                                                <template #default="scope">
                                                    <span>{{ scope.row.indirectCost.manuFree }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="小计" width="200" align="center"
                                                label-class-name="labelClassName">
                                                <template #default="scope">
                                                    <span>{{ scope.row.indirectCost.subTotal }}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table-column>
                                        <el-table-column label="合计成本" align="center" width="200">
                                            <template #default="scope">
                                                <span>{{ scope.row.totalCost }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="备注" align="center" width="200">
                                            <template #default="scope">
                                                <span>{{ scope.row.remark }}</span>
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
                                    <el-table :data="dataItem.Other" border style="width:600px;color: #000000;">
                                        <el-table-column label="年份" align="center" width="200">
                                            <template #default="scope">
                                                <span>{{ scope.row.yearIndex }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="合计" align="center" width="200">
                                            <template #default="scope">
                                                <span>{{ scope.row.totalCost }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="备注" align="center" width="200">
                                            <template #default="scope">
                                                <span>{{ scope.row.remark }}</span>
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
    </div>
</template>
<script setup lang="ts">
import { table } from 'console';
import { ref, onMounted } from 'vue';
//方案下拉选项
const planOptions = ref([
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
])
//选中的方案
const currentPlan = ref("")
//COB-UPH
const COBUPHData = ref<any>([])
let tempUPHData = [
    {
        yearIndex: '15/Jul',
        UPHValue: 'xxx',
    },
    {
        yearIndex: '16/Jul',
        UPHValue: 'xxx',
    }
]
//表格数据    
const tableData = ref<any>([])
let tempTableDataArr = [
    {
        spec: "500K",
        COBCost: [
            {
                yearIndex: '15/Jul',  //年份
                //直接制造成本
                directCost: {
                    directLaborCosts: 'sss',    //直接人工
                    equipmentDepreciation: 'vvv',//设备折旧
                    changeLineCost: 'sss',//换线成本
                    manuFree: 'aaa',    //制造费用
                    subTotal: 'ggg',
                },
                //间接制造成本
                indirectCost: {
                    directLaborCosts: 'www',    //直接人工
                    equipmentDepreciation: 'qqq',//设备折旧
                    changeLineCost: 'eee',//换线成本
                    manuFree: 'trttt',    //制造费用
                    subTotal: 'ggg',
                },
                totalCost: '12345', //合计成本
                remark: 'fgdf'       //备注
            },
            {
                yearIndex: '16/Jul',  //年份
                //直接制造成本
                directCost: {
                    directLaborCosts: 'sss',    //直接人工
                    equipmentDepreciation: 'vvv',//设备折旧
                    changeLineCost: 'sss',//换线成本
                    manuFree: 'aaa',    //制造费用
                    subTotal: 'ggg',
                },
                //间接制造成本
                indirectCost: {
                    directLaborCosts: 'www',    //直接人工
                    equipmentDepreciation: 'qqq',//设备折旧
                    changeLineCost: 'eee',//换线成本
                    manuFree: 'trttt',    //制造费用
                    subTotal: 'ggg',
                },
                totalCost: '12345', //合计成本
                remark: 'fgdf'       //备注
            }
        ],
        Other: [
            {
                yearIndex: '15/Jul',
                totalCost: 'xxx',
                remark: 'yyyy',
            },
            {
                yearIndex: '16/Jul',
                totalCost: '1111',
                remark: '2222',
            }
        ]
    },
    {
        spec: "1000K",
        COBCost: [
            {
                yearIndex: '15/Jul',  //年份
                //直接制造成本
                directCost: {
                    directLaborCosts: 'sss',    //直接人工
                    equipmentDepreciation: 'vvv',//设备折旧
                    changeLineCost: 'sss',//换线成本
                    manuFree: 'aaa',    //制造费用
                    subTotal: 'ggg',
                },
                //间接制造成本
                indirectCost: {
                    directLaborCosts: 'www',    //直接人工
                    equipmentDepreciation: 'qqq',//设备折旧
                    changeLineCost: 'eee',//换线成本
                    manuFree: 'trttt',    //制造费用
                    subTotal: 'ggg',
                },
                totalCost: '12345', //合计成本
                remark: 'fgdf'       //备注
            },
            {
                yearIndex: '15/Jul',  //年份
                //直接制造成本
                directCost: {
                    directLaborCosts: 'sss',    //直接人工
                    equipmentDepreciation: 'vvv',//设备折旧
                    changeLineCost: 'sss',//换线成本
                    manuFree: 'aaa',    //制造费用
                    subTotal: 'ggg',
                },
                //间接制造成本
                indirectCost: {
                    directLaborCosts: 'www',    //直接人工
                    equipmentDepreciation: 'qqq',//设备折旧
                    changeLineCost: 'eee',//换线成本
                    manuFree: 'trttt',    //制造费用
                    subTotal: 'ggg',
                },
                totalCost: '12345', //合计成本
                remark: 'fgdf'       //备注
            }
        ],
        Other: [
            {
                yearIndex: '15/Jul',
                totalCost: 'xxx',
                remark: 'yyyy',
            },
            {
                yearIndex: '16/Jul',
                totalCost: '1111',
                remark: '2222',
            }
        ]
    },
    {
        spec: "2000K",
        COBCost: [
            {
                yearIndex: '15/Jul',  //年份
                //直接制造成本
                directCost: {
                    directLaborCosts: 'sss',    //直接人工
                    equipmentDepreciation: 'vvv',//设备折旧
                    changeLineCost: 'sss',//换线成本
                    manuFree: 'aaa',    //制造费用
                    subTotal: 'ggg',
                },
                //间接制造成本
                indirectCost: {
                    directLaborCosts: 'www',    //直接人工
                    equipmentDepreciation: 'qqq',//设备折旧
                    changeLineCost: 'eee',//换线成本
                    manuFree: 'trttt',    //制造费用
                    subTotal: 'ggg',
                },
                totalCost: '12345', //合计成本
                remark: 'fgdf'       //备注
            },
            {
                yearIndex: '15/Jul',  //年份
                //直接制造成本
                directCost: {
                    directLaborCosts: 'sss',    //直接人工
                    equipmentDepreciation: 'vvv',//设备折旧
                    changeLineCost: 'sss',//换线成本
                    manuFree: 'aaa',    //制造费用
                    subTotal: 'ggg',
                },
                //间接制造成本
                indirectCost: {
                    directLaborCosts: 'www',    //直接人工
                    equipmentDepreciation: 'qqq',//设备折旧
                    changeLineCost: 'eee',//换线成本
                    manuFree: 'trttt',    //制造费用
                    subTotal: 'ggg',
                },
                totalCost: '12345', //合计成本
                remark: 'fgdf'       //备注
            }
        ],
        Other: [
            {
                yearIndex: '15/Jul',
                totalCost: 'xxx',
                remark: 'yyyy',
            },
            {
                yearIndex: '16/Jul',
                totalCost: '1111',
                remark: '2222',
            }
        ]
    },
]
//页面加载函数
onMounted(async () => {
    await initData();
})

const initData = () => {
    COBUPHData.value = tempUPHData;
    tableData.value = tempTableDataArr;
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
}</style>