<template>
    <div>
        <div class="u-p-10">
            <el-scrollbar wrap-style="padding:10px 0px" always>
                <!-- 头部区 -->
                <div class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <div class="u-width-300 u-border u-height-60">
                            <span>操作</span>
                        </div>
                        <div class="u-width-150  u-border u-height-60"><span>序号</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
                        <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
                    </div>
                    <div class="u-text-center" style="background-color: rgb(122, 154, 223);">
                        <div class="u-text-center u-border  u-p-t-5 u-p-b-5">设备部分</div>
                        <div class="u-flex u-row-left u-col-center  u-text-center">
                            <div v-for="index in 3" :key="index" class="u-flex u-row-left u-col-center u-text-center">
                                <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                    <span>设备{{ index }}</span>
                                </div>
                                <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                    <span>状态</span>
                                </div>
                                <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                    <span>数量</span>
                                </div>
                                <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                    <span>单价</span>
                                </div>
                            </div>
                            <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                <span>设备总价</span>
                            </div>
                        </div>
                    </div>
                    <div class="u-text-center" style="background-color: rgb(223, 179, 122);">
                        <div class="u-text-center   u-border u-p-t-5 u-p-b-5">
                            <span>追溯部分(硬件及软件开发费用)</span>
                        </div>
                        <div class="u-flex u-row-left u-col-center  u-text-center">
                            <div v-for="index in 2" :key="index"
                                class="u-flex u-row-left u-col-center u-text-center u-border">
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>硬件设备{{ index }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>数量</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>单价</span>
                                </div>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>硬件总价</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>追溯软件</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>开发费(追溯)</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>开图软件</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>开发费(开图)</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>软硬件总价</span>
                            </div>
                        </div>
                    </div>

                    <div class="u-text-center" style="background-color: rgb(122, 162, 223);">
                        <div class="u-text-center   u-border u-p-t-5 u-p-b-5">
                            <span>工装治具部分</span>
                        </div>
                        <div class="u-flex u-row-left u-col-center  u-text-center">
                            <div v-for="index in 2" :key="index"
                                class="u-flex u-row-left u-col-center u-text-center u-border">
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>治具{{ index }}名称</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>数量</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>治具单价</span>
                                </div>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>检具名称</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>数量</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>检具单价</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>工装名称</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>数量</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>工装单价</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>测试线名称</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>数量</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>线束单价</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                <span>工装治具总价</span>
                            </div>
                        </div>
                    </div>

                    <div class="u-text-center" style="background-color: rgb(223, 179, 122);">
                        <div class="u-flex u-row-left u-col-center">
                            <div v-for="(scopItem, sopIndex) in dataArr[0].sopInfo" :key="sopIndex" class="u-text-center">
                                <div class="u-p-t-5 u-p-b-5 u-border"> SOP-{{ scopItem.year }}年 </div>
                                <div class="u-flex u-row-left u-col-center">
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>标准人工工时</span>
                                    </div>
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>标准机器工时</span>
                                    </div>
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>人员数量</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <template v-if="props.dataArr.length > 0">
                    <!-- 数据区域 -->
                    <div v-for="(dataItem, dataIndex) in props.dataArr" :key="dataIndex"
                        class="u-flex u-row-left u-col-center u-text-center">
                        <div class="u-flex u-row-left u-col-center  u-text-center">
                            <div class="u-width-300 u-border  u-flex u-row-left u-col-center  u-text-center">
                                <div class="u-width-150  u-p-t-2 u-p-b-2">
                                    <el-button type="primary" size="small">编辑</el-button>
                                </div>
                                <div class="u-width-150  u-p-t-2 u-p-b-2">
                                    <el-button type="danger" size="small" 
                                        @click="$emit('delPH',dataIndex)">删除</el-button>
                                </div>
                            </div>
                            <div class="u-width-150 u-border  u-p-t-5 u-p-b-5"><span>{{ dataIndex }}</span></div>
                            <div class="u-width-150 u-border  u-p-t-5 u-p-b-5"><span>{{ dataItem.processIndex }}</span></div>
                            <div class="u-width-150 u-border  u-p-t-5 u-p-b-5"><span>{{ dataItem.processName }}</span></div>
                        </div>
                        <div class="u-text-center">
                            <div class="u-flex u-row-left u-col-center  u-text-center">
                                <div v-for="(deviceItem, deviceIndex) in dataItem.deviceInfo.deviceArr" :key="deviceIndex"
                                    class="u-flex u-row-left u-col-center u-text-center">
                                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                        <span>{{ deviceItem.deviceName }}</span>
                                    </div>
                                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                        <span>{{ deviceItem.deviceStatus }}</span>
                                    </div>
                                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                        <span>{{ deviceItem.deviceCount }}</span>
                                    </div>
                                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                        <span>{{ deviceItem.devicePrice }}</span>
                                    </div>
                                </div>
                                <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.deviceInfo.deviceTotalCost }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="u-text-center">
                            <div class="u-flex u-row-left u-col-center  u-text-center">
                                <div v-for="(hardInfo, hardIndex) in dataItem.developCostInfo.hardwareInfo" :key="hardIndex"
                                    class="u-flex u-row-left u-col-center u-text-center u-border">
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>{{ hardInfo.hardwareDeviceName }}</span>
                                    </div>
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>{{ hardInfo.hardwareDeviceCount }}</span>
                                    </div>
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>{{ hardInfo.hardwareDevicePrice }}</span>
                                    </div>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.developCostInfo.hardwareTotalCost }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.developCostInfo.zhuiSuSoft }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.developCostInfo.developCost_zhuisu }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.developCostInfo.kaiTu_Soft }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.developCostInfo.developCost_kaiTu }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.developCostInfo.developTotalCost }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="u-text-center">
                            <div class="u-flex u-row-left u-col-center  u-text-center">
                                <div v-for="(zhiju, zhijuindex) in dataItem.toolInfo.zhiJuArr" :key="zhijuindex"
                                    class="u-flex u-row-left u-col-center u-text-center u-border">
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>{{ zhiju.zhiJuName }}</span>
                                    </div>
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>{{ zhiju.zhiJuCount }}</span>
                                    </div>
                                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                        <span>{{ zhiju.zhiJuPrice }}</span>
                                    </div>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.jianJu.jianJuName }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.jianJu.jianJuCount }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.jianJu.jianJuPrice }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.gongZhuang.gongZhuangName }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.gongZhuang.gongZhuangCount }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.gongZhuang.gongZhuangPrice }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.testLine.testLineName }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.testLine.testLineCount }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.testLine.testLinePrice }}</span>
                                </div>
                                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                    <span>{{ dataItem.toolInfo.toolTotalCost }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="u-text-center">
                            <div class="u-flex u-row-left u-col-center">
                                <div v-for="(scopItem, sopIndex) in dataItem.sopInfo" :key="sopIndex" class="u-text-center">
                                    <div class="u-flex u-row-left u-col-center">
                                        <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                            <span>{{ scopItem.manWorkHour }}</span>
                                        </div>
                                        <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                            <span>{{ scopItem.machineWorkHour }}</span>
                                        </div>
                                        <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                                            <span>{{ scopItem.manNumber }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </template>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref,toRefs} from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
const props = defineProps({
    dataArr: {
        type: Array,
        required: true,
        default:()=>{
            return []
        }
    }
})
</script>