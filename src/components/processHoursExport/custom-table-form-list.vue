<template>
    <el-scrollbar wrap-style="padding:10px 0px" always :max-height="500">
        <!-- 头部区 -->
        <div class="u-flex u-row-left u-col-center u-text-center">
            <div class="u-flex u-row-left u-col-center  u-text-center">
                <div class="u-width-150  u-border u-height-60"><span>序号</span></div>
                <div style="background-color: yellow;" class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
                <div style="background-color: greenyellow;" class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
            </div>
            <!-- 设备部分 -->
            <div class="u-text-center" style="background-color: rgb(122, 154, 223);">
                <div class="u-text-center u-border  u-p-t-5 u-p-b-5">设备部分</div>
                <div class="u-flex u-row-left u-col-center  u-text-center">
                    <div v-for="index in dataArr[0].deviceInfo.deviceArr.length" :key="index"
                        class="u-flex u-row-left u-col-center u-text-center">
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
            <!--追溯部分(硬件及软件开发费用)  -->
            <div class="u-text-center" style="background-color: rgb(223, 179, 122);">
                <div class="u-text-center   u-border u-p-t-5 u-p-b-5">
                    <span>追溯部分(硬件及软件开发费用)</span>
                </div>
                <div class="u-flex u-row-left u-col-center  u-text-center">
                    <div v-for="index in dataArr[0].developCostInfo.hardwareInfo.length" :key="index"
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
            <!-- 工装治具部分 -->
            <div class="u-text-center" style="background-color: rgb(122, 162, 223);">
                <div class="u-text-center   u-border u-p-t-5 u-p-b-5">
                    <span>工装治具部分</span>
                </div>
                <div class="u-flex u-row-left u-col-center  u-text-center">
                    <div v-for="index in dataArr[0].toolInfo.zhiJuArr.length" :key="index"
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
            <!-- 工时 -->
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
        <!-- 数据区域 -->
        <template v-if="props.dataArr.length > 0">
            <div v-for="(dataItem, dataIndex) in props.dataArr" :key="dataIndex"
                class="u-flex u-row-left u-col-center u-text-center">
                <div class="u-flex u-row-left u-col-center  u-text-center">
                    <!-- 序号 -->
                    <div class="u-width-150 u-border u-p-t-b-5">
                        <span>{{ dataIndex }}</span>
                    </div>
                    <!-- 工序序号 -->
                    <div class="u-width-150 u-border  u-p-t-b-5">
                        <span>{{ dataItem.processNumber }}</span>
                    </div>
                    <!-- 工序名称 -->
                    <div class="u-width-150 u-border  u-p-t-b-5">
                        <span>{{ dataItem.processName }}</span>
                    </div>
                </div>
                <!-- 设备部分 -->
                <div class="u-text-center">
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <div v-for="(deviceItem, deviceIndex) in dataItem.deviceInfo.deviceArr" :key="deviceIndex"
                            class="u-flex u-row-left u-col-center u-text-center">
                            <!-- 设备名称 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ deviceItem.deviceName }}</span>
                            </div>
                            <!-- 设备状态 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                              <el-select v-model="deviceItem.deviceStatus" placeholder="选择状态"
                                         >
                                <el-option v-for="item in deviceStatusEnmus" :key="item.code" :label="item.value"
                                           :value="item.code"/>
                              </el-select>
                            </div>
                            <!-- 设备数量 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ deviceItem.deviceNumber }}</span>
                            </div>
                            <!-- 设备价格 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ deviceItem.devicePrice }}</span>
                            </div>
                        </div>
                        <!-- 设备总价 -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.deviceInfo.deviceTotalPrice?dataItem.deviceInfo.deviceTotalPrice.toFixed(2):0.00 }}</span>
                        </div>
                    </div>
                </div>
                <!--追溯部分(硬件及软件开发费用)  -->
                <div class="u-text-center">
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <!-- 硬件设备 -->
                        <div v-for="(hardInfo, hardIndex) in dataItem.developCostInfo.hardwareInfo" :key="hardIndex"
                            class="u-flex u-row-left u-col-center u-text-center u-border">
                            <!-- 设备名称 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ hardInfo.hardwareDeviceName }}</span>
                            </div>
                            <!-- 设备数量 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ hardInfo.hardwareDeviceNumber }}</span>
                            </div>
                            <!-- 设备价格 -->
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ hardInfo.hardwareDevicePrice }}</span>
                            </div>
                        </div>
                        <!-- 硬件总价 -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{dataItem.developCostInfo.totalHardwarePrice?dataItem.developCostInfo.totalHardwarePrice:0.00}}</span>
                        </div>
                        <!-- 追溯软件 -->
                        <div class="u-width-150  u-border   u-p-t-b-5">
                            <span>{{ dataItem.developCostInfo.traceabilitySoftware?dataItem.developCostInfo.traceabilitySoftware:'--'}}</span>
                        </div>
                        <!-- 开发费(追溯) -->
                        <div class="u-width-150  u-border   u-p-t-b-5">
                            <span>{{ dataItem.developCostInfo.development}}</span>
                        </div>
                        <!-- 开图软件 -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.developCostInfo.drawingSoftware }}</span>
                        </div>
                        <!-- 开发费(开图) -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{dataItem.developCostInfo.pictureDevelopment?dataItem.developCostInfo.pictureDevelopment.toFixed(2):dataItem.developCostInfo.pictureDevelopment }}</span>
                        </div>
                        <!-- 软硬件总价 -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.developCostInfo.softwareHardPrice?dataItem.developCostInfo.softwareHardPrice:0.00 }}</span>
                        </div>
                    </div>
                </div>
                <!--工具治具  -->
                <div class="u-text-center">
                    <div class="u-flex u-row-left u-col-center  u-text-center">
                        <!-- 治具 -->
                        <div v-for="(zhiju, zhijuindex) in dataItem.toolInfo.zhiJuArr" :key="zhijuindex"
                            class="u-flex u-row-left u-col-center u-text-center u-border">
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ zhiju.fixtureName }}</span>
                            </div>
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ zhiju.fixtureNumber }}</span>

                            </div>
                            <div class="u-width-150  u-border  u-p-t-b-5">
                                <span>{{ zhiju.fixturePrice }}</span>
                            </div>
                        </div>
                        <!-- 检具 -->
                        <div class="u-width-150 u-border u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.fixtureName }}</span>
                        </div>
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.fixtureNumber }}</span>
                        </div>
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.fixturePrice }}</span>
                        </div>
                        <!--工装  -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.frockName }}</span>
                        </div>
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.frockNumber }}</span>
                        </div>
                        <div class="u-width-150  u-border   u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.frockPrice }}</span>
                        </div>
                        <!-- 测试线 -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.testLineName }}</span>
                        </div>
                        <div class="u-width-150  u-border   u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.testLineNumber }}</span>
                        </div>
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.testLinePrice }}</span>
                        </div>
                        <!-- 工装治具总价 -->
                        <div class="u-width-150  u-border  u-p-t-b-5">
                            <span>{{ dataItem.toolInfo.hardwareDeviceTotalPrice?dataItem.toolInfo.hardwareDeviceTotalPrice:'0.00'}}</span>
                            <!-- <span>{{ calToolTotalCost(dataIndex) }}</span> -->
                        </div>
                    </div>
                </div>
                <!-- 工时 -->
                <div class="u-text-center">
                    <div class="u-flex u-row-left u-col-center">
                        <div v-for="(scopItem, sopIndex) in dataItem.sopInfo" :key="sopIndex" class="u-text-center">
                            <div class="u-flex u-row-left u-col-center">
                                <!-- 标准人工工时 -->
                                <div class="u-width-150  u-border  u-p-t-b-5">
                                    <span>{{ scopItem.laborHour }}</span>
                                </div>
                                <!-- 标准机器工时 -->
                                <div class="u-width-150  u-border  u-p-t-b-5">
                                    <span>{{ scopItem.machineHour }}</span>
                                </div>
                                <!-- 人员数量 -->
                                <div class="u-width-150  u-border  u-p-t-b-5">
                                    <span>{{ scopItem.numberPersonnel }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </el-scrollbar>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getDeviceStatus} from "@/api/processHoursEnter";
const deviceStatusEnmus = ref<any>([]);
let props = defineProps(['dataArr'])
onMounted(() => {
  getDeviceStatus().then((response: any) => {
    console.log("======设备状态列表=======", response);
    if (response.success) {
      deviceStatusEnmus.value = response.result;
    }
  })
})
</script>

<style scoped lang="scss">
.u-p-t-b-5 {
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>
