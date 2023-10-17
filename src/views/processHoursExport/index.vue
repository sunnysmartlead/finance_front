<template>
  <div>
    <div class="u-flex u-row-between u-col-center u-p-t-10 u-p-b-10 u-border-bottom">
      <div class="u-flex u-row-left u-col-center"/>
      <div>
<!--        <el-button @click="handleSaveData" type="primary">保存</el-button>
        <el-button @click="handleSubmit" type="primary">提交</el-button>-->
        <ProcessVertifyBox :onSubmit="handleSubmit" processType="confirmProcessType" v-havedone/>
      </div>
    </div>
    <div class="u-p-t-10 u-p-b-10 u-flex u-flex-wrap u-row-left u-col-center">
      <div class="u-m-5">
        <el-button type="primary" @click="showProjectDialog">项目走量查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="sorDownloadFile">SOR下载</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="openStandardProcessDialogForm">选择工艺标准</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="addPH()">新增工序</el-button>
      </div>
      <div class="u-m-5">
        <ThreeDImage m="2"/>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="viewBOM">结构BOM查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="viewElectronicBOM">电子BOM查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="openPanelPartDialog">板部件以及拼版数量</el-button>
      </div>
      <div class="u-m-5">
        <el-upload class="upload-demo" ref="upload" accept=".xls,.xlsx" :show-file-list="showUploadFile"
                   :on-error="uploadErrror" :on-success="uploadSuccess" :on-exceed="handleExceed"
                   :action="uploadActionUrl"
                   :limit="1">
          <template #trigger>
            <el-button type="primary">工序工时导入</el-button>
          </template>
        </el-upload>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="exportTemplate()">工序工时导出</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="downloadTemplate()">工序工时模板下载</el-button>
      </div>
    </div>
    <div class="u-p-10 u-border process-hour-box">
      <div style="color: #000000; font-weight: bold">
        <span>工序列表录入</span>
      </div>
      <el-scrollbar wrap-style="padding:0 0 10px 0px" always :max-height="500">
        <!-- 头部区 -->
        <div class="u-flex u-row-left u-col-center u-text-center u-head-stop">
          <div class="u-flex u-row-left u-col-center u-text-center">
            <div class="u-width-300 u-border u-height-60">
              <span>操作</span>
            </div>
            <div class="u-width-150 u-border u-height-60"><span>序号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
          </div>

          <div class="u-text-center" style="background-color: rgb(122, 154, 223)">
            <div class="u-text-center u-border u-p-t-5 u-p-b-5">设备部分</div>
            <div class="u-flex u-row-left u-col-center u-text-center">
              <template
                v-if="dataArr.length > 0 && dataArr[0].deviceInfo && dataArr[0].deviceInfo.deviceArr?.length > 0">
                <div v-for="index in dataArr[0].deviceInfo.deviceArr.length" :key="index"
                     class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>设备{{ index }}</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>状态</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>数量</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>单价</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>设备序号</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>状态</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>数量</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>单价</span>
                  </div>
                </div>
              </template>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>设备总价</span>
              </div>
            </div>
          </div>

          <div class="u-text-center" style="background-color: rgb(223, 179, 122)">
            <div class="u-text-center u-border u-p-t-5 u-p-b-5">
              <span>追溯部分(硬件及软件开发费用)</span>
            </div>
            <div class="u-flex u-row-left u-col-center u-text-center">
              <template v-if="dataArr.length > 0 && dataArr[0]?.developCostInfo?.hardwareInfo?.length > 0">
                <div v-for="index in dataArr[0].developCostInfo.hardwareInfo.length" :key="index"
                     class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>硬件设备{{ index }}</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>数量</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>单价</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="u-flex u-row-left u-col-center u-text-center u-border">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>硬件设备</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>数量</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>单价</span>
                  </div>
                </div>
              </template>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>硬件总价</span>
              </div>
              <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                <span>追溯软件</span>
              </div>
              <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                <span>开发费(追溯)</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>开图软件</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>开发费(开图)</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>软硬件总价</span>
              </div>
            </div>
          </div>

          <div class="u-text-center" style="background-color: rgb(122, 162, 223)">
            <div class="u-text-center u-border u-p-t-5 u-p-b-5">
              <span>工装治具部分</span>
            </div>
            <div class="u-flex u-row-left u-col-center u-text-center">
              <template v-if="dataArr.length > 0 && dataArr[0]?.toolInfo?.zhiJuArr?.length > 0">
                <div v-for="index in dataArr[0].toolInfo.zhiJuArr.length" :key="index"
                     class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>治具{{ index }}名称</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>数量</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>治具单价</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="u-flex u-row-left u-col-center u-text-center u-border">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>治具名称</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>数量</span>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>治具单价</span>
                  </div>
                </div>
              </template>

              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>检具名称</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>数量</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>检具单价</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>工装名称</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>数量</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>工装单价</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>测试线名称</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>数量</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>线束单价</span>
              </div>
              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>工装治具总价</span>
              </div>
            </div>
          </div>

          <div class="u-text-center" style="background-color: rgb(223, 179, 122)">
            <div class="u-flex u-row-left u-col-center">
              <template v-if="yearList.length > 0">
                <div v-for="(scopItem, sopIndex) in yearList" :key="sopIndex" class="u-text-center">
                  <div class="u-p-t-5 u-p-b-5 u-border">SOP-{{ scopItem.year }}</div>
                  <div class="u-flex u-row-left u-col-center">
                    <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                      <span>标准人工工时</span>
                    </div>
                    <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                      <span>标准机器工时</span>
                    </div>
                    <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                      <span>人员数量</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="u-text-center">
                  <div class="u-p-t-5 u-p-b-5 u-border">年份</div>
                  <div class="u-flex u-row-left u-col-center">
                    <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                      <span>标准人工工时</span>
                    </div>
                    <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                      <span>标准机器工时</span>
                    </div>
                    <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                      <span>人员数量</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- 数据区域 -->
        <template v-if="dataArr.length > 0">
          <div v-for="(dataItem, dataIndex) in dataArr" :key="dataIndex"
               class="u-flex u-row-left u-col-center u-text-center">
            <template v-if="dataIndex == dataArr.length - 1">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <div class="u-width-750 u-border u-p-t-5 u-p-b-5 u-font-bold">
                  <span>合计</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="u-flex u-row-left u-col-center u-text-center">
                <!-- 操作项 -->
                <div class="u-width-300 u-flex u-row-around u-col-center u-border u-p-t-2 u-p-b-2">
                  <template v-if="currentEditIndex == dataIndex">
                    <div class="u-width-100">
                      <el-button size="small" @click="cancalEdit(dataIndex, dataItem)">取消</el-button>
                    </div>
                  </template>
                  <template v-else class="u-width-100">
                    <el-button type="primary" size="small" @click="handleEdit(dataIndex, dataItem)">编辑</el-button>
                  </template>
                  <div class="u-width-100">
                    <el-button size="small" type="danger" @click="handleDel(dataIndex, dataItem)">删除</el-button>
                  </div>
                </div>
                <!--序号  -->
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataIndex + 1 }}</span>
                </div>
                <!-- 工序序号 -->
                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.processNumber" :disabled="isDisable(dataIndex)" filterable remote
                             reserve-keyword :remote-method="remoteMethod"
                             @change="processNumberChange($event, dataIndex)"
                             :loading="processNumberloading">
                    <el-option v-for="item in processNumberOptions" :key="item.id" :label="item.processNumber"
                               :value="item.processNumber"/>
                  </el-select>
                </div>
                <!-- 工序名称 -->
                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.processName" :disabled="isDisable(dataIndex)" filterable remote
                             reserve-keyword :remote-method="remoteMethodForProcessName"
                             @change="processNameChange($event, dataIndex)" :loading="processNameLoading">
                    <el-option v-for="item in processNameOptions" :key="item.id" :label="item.processName"
                               :value="item.processName"/>
                  </el-select>
                </div>
              </div>
            </template>
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <template v-if="dataIndex == dataArr.length - 1">
                  <div v-for="(deviceItem, deviceIndex) in dataItem.deviceInfo.deviceArr" :key="deviceIndex"
                       class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(deviceItem, deviceIndex) in dataItem.deviceInfo.deviceArr" :key="deviceIndex"
                       class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-150 u-border">
                      <el-select v-model="deviceItem.deviceName" :disabled="isDisable(dataIndex)" filterable remote
                                 reserve-keyword :remote-method="remoteMethodForDeviceName"
                                 @change="deviceNameChange($event, deviceIndex, dataIndex)"
                                 :loading="deviceNameLoading">
                        <el-option v-for="item in deviceListOptions" :key="item.id" :label="item.deviceName"
                                   :value="item.deviceName"/>
                      </el-select>
                    </div>
                    <div class="u-width-150 u-border">
                      <el-select v-model="deviceItem.deviceStatus" placeholder="选择状态"
                                 :disabled="isDisable(dataIndex)">
                        <el-option v-for="item in deviceStatusEnmus" :key="item.code" :label="item.value"
                                   :value="item.value"/>
                      </el-select>
                    </div>
                    <div class="u-width-150 u-border">
                      <el-input-number v-model="deviceItem.deviceNumber" :min="0" :precision="2" :step="0.01"
                                       :disabled="isDisable(dataIndex)"
                                       @change="handleDeviceChange($event, dataIndex, deviceIndex)"/>

                    </div>
                    <div  v-if="!isDisable(dataIndex)" class="u-width-150 u-border">
                      <el-input-number v-model="deviceItem.devicePrice"
                                       @change="handleDeviceChange($event, dataIndex, deviceIndex)"/>
                    </div>

                    <div v-if="isDisable(dataIndex)" class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                            <span>{{
                                amoutInterval(deviceItem.devicePrice ,0)
                              }}</span>
                      </div>
                  </div>
                </template>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span v-if="dataIndex == dataArr.length - 1">{{ amoutInterval(sumDeviceTotalCost() ,0) }}</span>
                  <span v-else>
                    {{
                    amoutInterval(handleDeviceChange(null, dataIndex, null) ,0)
                    }}
                  </span>
                </div>
              </div>
            </div>
            <!--追溯  -->
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <template v-if="dataIndex == dataArr.length - 1">
                  <div v-for="(hardInfo, hardIndex) in dataItem.developCostInfo.hardwareInfo" :key="hardIndex"
                       class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(hardInfo, hardIndex) in dataItem.developCostInfo.hardwareInfo" :key="hardIndex"
                       class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-150 u-border">
                      <el-select v-model="hardInfo.hardwareDeviceName" :disabled="isDisable(dataIndex)" filterable
                                 remote
                                 reserve-keyword :remote-method="remoteMethodForHardwareDeviceName"
                                 @change="hardWareNameChange($event, hardIndex, dataIndex)"
                                 :loading="hardwareDeviceNameLoading">
                        <el-option v-for="item in hardwareDeviceNameOptions" :key="item.id" :label="item.hardwareName"
                                   :value="item.hardwareName"/>
                      </el-select>
                    </div>
                    <div class="u-border u-width-150">
                      <el-input-number v-model="hardInfo.hardwareDeviceNumber" :min="0" :step="1"
                                       :disabled="isDisable(dataIndex)"
                                       @change="handleHardwareDeviceChange($event, dataIndex, hardIndex)"/>
                    </div>
                    <div v-if="!isDisable(dataIndex)" class="u-border u-width-150">
                      <el-input-number v-model="hardInfo.hardwareDevicePrice" :disabled="isDisable(dataIndex)"
                                       @change="handleHardwareDeviceChange($event, dataIndex, hardIndex)"/>
                    </div>
                    <div v-if="isDisable(dataIndex)" class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                            <span>{{
                                amoutInterval(hardInfo.hardwareDevicePrice ,0)
                              }}</span>
                    </div>
                  </div>
                </template>
                <template v-if="dataIndex == dataArr.length - 1">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">{{
                    amoutInterval(sumHardWareTotalCost() ,0)
                    }}

                  </div>
                  <div class="u-width-150  u-border u-p-t-5 u-p-b-5">-</div>
                  <div class="u-width-150  u-border u-p-t-5 u-p-b-5">-</div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">-</div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">-</div>
                </template>
                <template v-else>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    {{
                    amoutInterval(caclHardWareCost(dataIndex) ,0)
                    }}
                  </div>
                  <div class="u-width-150  u-border">
                    <!-- <el-select v-model="dataItem.developCostInfo.traceabilitySoftware" filterable remote reserve-keyword
                      :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForZhuiSuSoft"
                      @change="zhuiSuSoftChange($event, dataIndex)" :loading="optionLoading">
                      <el-option v-for="item in zhuiSuSoftOptions" :key="item.id" :label="item.traceabilitySoftware"
                        :value="item.traceabilitySoftware" />
                    </el-select> -->
                    <el-input v-model="dataItem.developCostInfo.traceabilitySoftware" :disabled="isDisable(dataIndex)"/>
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="dataItem.developCostInfo.traceabilitySoftwareCost"
                                     @change="handleHardwareDeviceChange($event, dataIndex,null)"
                                     :disabled="isDisable(dataIndex)"/>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input @change="kaiTuChange($event, dataIndex)"
                              v-model="dataItem.developCostInfo.openDrawingSoftware"
                              :disabled="isDisable(dataIndex)"/>
                  </div>
                  <div v-if="!isDisable(dataIndex)" class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <el-input-number v-model="dataItem.developCostInfo.softwarePrice"
                                     :disabled="isDisable(dataIndex)"
                                     @change="handleHardwareDeviceChange($event, dataIndex,null)"/>
                  </div>
                  <div v-if="isDisable(dataIndex)" class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    {{
                      amoutInterval(dataItem.developCostInfo.softwarePrice ,0)
                    }}
                  </div>
                </template>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span v-if="dataIndex == dataArr.length - 1">{{
                      amoutInterval(sumHardwareDeviceTotalCost() ,0)
                      }}</span>
                  <span v-else>{{
                      amoutInterval(handleHardwareDeviceChange(null, dataIndex, null)  ,0)
                      }}</span>
                </div>
              </div>
            </div>
            <!-- 治具 -->
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <template v-if="dataItem.toolInfo.zhiJuArr.length > 0">
                  <template v-if="dataIndex == dataArr.length - 1">
                    <div v-for="(zhiju, zhijuindex) in dataItem.toolInfo.zhiJuArr" :key="zhijuindex"
                         class="u-flex u-row-left u-col-center u-text-center">
                      <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                      <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                      <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">-</div>
                    </div>
                  </template>
                  <template v-else>
                    <div v-for="(zhiju, zhijuindex) in dataItem.toolInfo.zhiJuArr" :key="zhijuindex"
                         class="u-flex u-row-left u-col-center u-text-center">
                      <div class="u-width-150 u-border">
                        <el-select v-model="zhiju.fixtureName" filterable remote reserve-keyword
                                   :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForZhiJuName"
                                   @change="fixtureNameChange($event, dataIndex, zhijuindex)"
                                   :loading="fixtureNameLoading">
                          <el-option v-for="item in fixtureNameOptions" :key="item.id" :label="item.fixtureName"
                                     :value="item.fixtureName"/>
                        </el-select>
                      </div>
                      <div class="u-width-150 u-border">
                        <el-input-number v-model="zhiju.fixtureNumber" :min="0" :precision="2"
                                         :disabled="isDisable(dataIndex)"
                                         @change="handleZhiJuCountChange(dataIndex, zhijuindex)"/>
                      </div>
                      <div v-if="!isDisable(dataIndex)" class="u-width-150 u-border">
                        <el-input-number v-model="zhiju.fixturePrice"
                                         @change="handleZhiJuCountChange(dataIndex, zhijuindex)"/>
                      </div>
                      <div v-if="isDisable(dataIndex)" class="u-width-150 u-border u-p-t-5 u-p-b-5">
                        {{
                          amoutInterval(zhiju.fixturePrice ,0)
                        }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                      <span>---</span>
                    </div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                      <span>---</span>
                    </div>
                    <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                      <span>---</span>
                    </div>
                  </div>
                </template>
                <template v-if="dataIndex == dataArr.length - 1">
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5" v-for="i in 9">-</div>
                </template>
                <template v-else>
                  <div class="u-width-150 u-border">
                    <el-select v-model="dataItem.toolInfo.fixtureName" filterable remote reserve-keyword
                               :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForJianJuName"
                               @change="jianJuNameChange($event, dataIndex)" :loading="jianJuNameLoading">
                      <el-option v-for="item in jianJuNameOptions" :key="item.id" :label="item.fixtureGaugeName"
                                 :value="item.fixtureGaugeName"/>
                    </el-select>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="dataItem.toolInfo.fixtureNumber" :min="0" :disabled="isDisable(dataIndex)"
                                     @change="handleJianJuCountChange($event, dataIndex)"/>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>{{
                      amoutInterval(dataItem.toolInfo.fixturePrice ,0)
                      }}</span>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-select v-model="dataItem.toolInfo.frockName" filterable remote reserve-keyword
                               :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForGongZhuangName"
                               @change="gongZhuangNameChange($event, dataIndex)" :loading="gongZhuangNameLoading">
                      <el-option v-for="item in gongZhuangNameOptions" :key="item.id" :label="item.installationName"
                                 :value="item.installationName"/>
                    </el-select>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="dataItem.toolInfo.frockNumber" :min="0" :disabled="isDisable(dataIndex)"
                                     @change="handleGongZhuangCountChange($event, dataIndex)"/>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>{{
                      amoutInterval(dataItem.toolInfo.frockPrice ,0)
                      }}</span>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-select v-model="dataItem.toolInfo.testLineName" filterable remote reserve-keyword
                               :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForTestLineName"
                               @change="testLineNameChange($event, dataIndex)" :loading="testLineNameLoading">
                      <el-option v-for="item in testLineNameOptions" :key="item.id" :label="item.testName"
                                 :value="item.testName"/>
                    </el-select>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="dataItem.toolInfo.testLineNumber" :min="0"
                                     :disabled="isDisable(dataIndex)"
                                     @change="handleTestLineCountChange($event, dataIndex)"/>
                  </div>
                  <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                    <span>{{
                      amoutInterval(dataItem.toolInfo.testLinePrice ,0)
                      }}</span>
                  </div>
                </template>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span v-if="dataIndex == dataArr.length - 1">{{amoutInterval(sumToolTotalCost(),0)  }}</span>
                  <span v-else>{{amoutInterval(calToolTotalCost(dataIndex) ,0) }}</span>
                </div>
              </div>
            </div>

            <!-- 工时 -->
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center">
                <div v-for="(scopItem, sopIndex) in dataItem.sopInfo" :key="sopIndex" class="u-text-center">
                  <template v-if="dataIndex == dataArr.length - 1">
                    <div class="u-flex u-row-left u-col-center">
                      <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                        {{ sumSopCost(1, sopIndex)}}
                      </div>
                      <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                        {{ sumSopCost(2, sopIndex)}}
                      </div>
                      <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                        {{ sumSopCost(3, sopIndex)}}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="u-flex u-row-left u-col-center">
                      <div class="u-width-150 u-border">
                        <el-input-number v-model="scopItem.issues[0].laborHour" :min="0" :precision="2" :step="0.01"
                                         :disabled="isDisable(dataIndex)"/>
                      </div>
                      <div class="u-width-150 u-border">
                        <el-input-number v-model="scopItem.issues[0].machineHour" :min="0" :precision="2" :step="0.01"
                                         :disabled="isDisable(dataIndex)"/>
                      </div>
                      <div class="u-width-150 u-border">
                        <el-input-number v-model="scopItem.issues[0].personnelNumber" :min="0" :precision="2"
                                         :step="0.01"
                                         :disabled="isDisable(dataIndex)"/>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>


          </div>
        </template>
        <template v-else>
          <div class="u-text-center u-p-t-20 u-p-b-20" style="color: #909399; width: 100%">
            <span>暂无数据</span>
          </div>
        </template>
      </el-scrollbar>
    </div>

    <div class="u-p-10 u-m-t-10 u-border uph-box" v-if="UPHData.length > 0">
      <div style="color: #000000; font-weight: bold">
        <span>UPH录入</span>
      </div>
      <el-scrollbar wrap-style="padding:10px 0px" always>
        <div class="u-flex u-row-left u-col-center">
          <div style="background-color: #e6a23c" class="u-text-center">
            <div class="u-border u-height-32 u-width-150">
              <span>UPH</span>
            </div>
            <div class="u-border u-height-34 u-width-150">
              <span>SMT-UPH值</span>
            </div>
            <div class="u-border u-height-34 u-width-150" v-if="isCOB">
              <span>COB-UPH值</span>
            </div>
            <div class="u-border u-height-34 u-width-150">
              <span>组测-UPH值</span>
            </div>
          </div>
          <div v-for="(uphItem, uphIndex) in UPHData" :key="uphIndex">
            <div class="u-border u-p-t-5 u-p-b-5 u-width-150 u-text-center">
              <span>{{ uphItem.year }}</span>
            </div>
            <div class="u-border u-width-150 u-text-center">
              <el-input v-model="uphItem.smtuph" @change="uphChange($event, uphIndex)"/>
            </div>
            <div class="u-border u-width-150 u-text-center" v-if="isCOB">
              <el-input v-model="uphItem.cobuph" class="u-text-center" @change="uphChange($event, uphIndex)"/>
            </div>
            <div class="u-border u-width-150 u-text-center">
              <el-input v-model="uphItem.zcuph" class="u-text-center" @change="uphChange($event, uphIndex)"/>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="u-p-10 u-m-t-10 u-border uph-box" v-if="lineData.length > 0">
      <div style="color: #000000; font-weight: bold">
        <span>线体数量、共线分摊率</span>
      </div>
      <el-scrollbar wrap-style="padding:10px 0px" always>
        <div class="u-flex u-row-left u-col-center">
          <div style="background-color: #e6a23c" class="u-text-center">
            <div class="u-border u-height-32 u-width-150">
              <span>项目\年份</span>
            </div>
            <div class="u-border u-height-34 u-width-150">
              <span>线体数量</span>
            </div>
            <div class="u-border u-height-34 u-width-150">
              <span>共线分摊率</span>
            </div>
          </div>
          <div v-for="(lineItem, lineIndex) in lineData" :key="lineIndex">
            <div class="u-border u-p-t-5 u-p-b-5 u-width-150 u-text-center">
              <span>{{ lineItem.year }}</span>
            </div>
            <div class="u-border u-width-150 u-text-center">
              <el-input v-model="lineItem.xtsl"/>
            </div>
            <div class="u-border u-width-150 u-text-center">
              <el-input v-model="lineItem.gxftl" class="u-text-center">
                <template v-slot:append>%</template>
              </el-input>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <!-- fullscreen -->
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
    <!-- 选择工艺标准 -->
    <el-dialog v-model="dialogFormVisible" :close-on-click-modal="false" v-loading="standardProcessLoading">
      <el-form :model="dialogForm">
        <!-- <el-form-item label="标准工艺名称" label-width="150px">
          <el-select v-model="dialogForm" value-key="id" filterable remote reserve-keyword clearable
            :remote-method="remoteMethodForStandardProcessName"
            placeholder="输入关键字查询" :loading="standardProcessLoading">
            <el-option v-for="item in standardProcessNameOptions" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item> -->

        <el-form-item label="标准工艺" label-width="150px">
          <el-select v-model="dialogForm" value-key="id" clearable placeholder="选择标准工艺">
            <el-option v-for="item in standardProcessNameOptions" :key="item.id" :label="item.name" :value="item"/>
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelSelectStandardProcess">取消</el-button>
          <el-button type="primary" @click="confirmSelectStandardProcess">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="panelPartDialogTableVisible" title="板部件及拼板数量" width="60%" :close-on-click-modal="false">
      <el-table :data="panelPartTableData" border>
        <el-table-column property="boardName" label="板部件名称" align="center"/>
        <el-table-column property="boardLenth" label="板部件长(mm)" align="center"/>
        <el-table-column property="boardWidth" label="板部件宽(mm)" align="center"/>
        <el-table-column property="boardSquare" label="板部件面积(mm^)" align="center"/>
        <el-table-column property="stoneQuantity" label="拼板数量" align="center"/>
      </el-table>
    </el-dialog>
    <el-dialog v-model="structuralDataDialogTableVisible" title="结构bom查看" width="60%" :close-on-click-modal="false">
      <el-table :data="structuralData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类" width="180"/>
        <el-table-column prop="typeName" label="物料种类" width="180"/>
        <el-table-column prop="isInvolveItem" label="是否涉及" width="180"/>
        <el-table-column prop="drawingNumName" label="图号名称" width="180"/>
        <el-table-column prop="sapItemNum" label="物料编号" width="180"/>
        <el-table-column prop="overallDimensionSize" label="外形尺寸mm" width="180"/>
        <el-table-column prop="materialName" label="材料名称" width="180"/>
        <el-table-column prop="weightNumber" label="重量" width="180"/>
        <el-table-column prop="moldingProcess" label="成型工艺" width="180"/>
        <el-table-column prop="isNewMouldProduct" label="是否新开模" width="180"/>
        <el-table-column prop="secondaryProcessingMethod" label="二次加工方法" width="180"/>
        <el-table-column prop="surfaceTreatmentMethod" label="表面处理" width="180"/>
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180"/>
        <el-table-column prop="dimensionalAccuracyRemark" label="关键尺寸精度及重要要求" width="200"/>
      </el-table>
    </el-dialog>
    <el-dialog v-model="FindElectronicBomByProcessOMDataDialogTableVisible" title="电子结构bom查看" width="60%"
               :close-on-click-modal="false">
      <el-table :data="electronicBomData" border style="width: 100%" height="500">
        <el-table-column prop="categoryName" label="物料大类" width="180"/>
        <el-table-column prop="typeName" label="物料种类" width="180"/>
        <el-table-column prop="isInvolveItem" label="是否涉及" width="180"/>
        <el-table-column prop="sapItemNum" label="物料编号" width="180"/>
        <el-table-column prop="sapItemName" label="材料名称" width="180"/>
        <el-table-column prop="assemblyQuantity" label="装配数量" width="180"/>
        <el-table-column prop="encapsulationSize" label="封装（需要体现PAD的数量）"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import {onMounted, reactive, ref, toRefs} from "vue"
import {ElMessage, ElMessageBox, genFileId} from "element-plus"
import getQuery from "@/utils/getQuery"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
import type {UploadInstance, UploadProps, UploadRawFile} from "element-plus"
import {
  GetListAll,
  GetYear,
  getProcessHourDetail,
  handleCreate,
  getListUphOrLine,
  changeUphData,
  handleUpdate,
  handleDelete,
  uploadAction,
  getProcessLog,
  saveProcessLog,
  handleSaveOption,
  handleSubmitOption,
  downLoad3DImg,
  FindStructureBomByProcess,
  FindElectronicBomByProcess,
  GetBoardInfomation,
  getDeviceStatus,
  getWorkClothsListForSelect,
  getJianJuListForSelect,
  getZhiJuListForSelect,
  handelExport,
  exportDownload,
  getHardWareListForSelect,
  GetEditorByProcessNumber,
  GetPriceEvaluationStartData,
} from "@/api/processHoursEnter"
import {GetListAll as queryProcessList} from "@/api/process"
import {getListAllForQuery as getStandardProcessList} from "@/api/standardProcess"
import {
  getListAllForSelect as getDeviceListForSelect
} from '@/api/foundationDeviceDto';
import {
  getListAll as getDataFoundationHardwares
} from '@/api/foundationHardware';
import {random} from "lodash"
import router from "@/router"
import {getSorByAuditFlowId} from "@/components/CustomerSpecificity/service"
import {CommonDownloadFile, GetStructionBom, GetElectronicBom} from "@/api/bom"
import {round} from "lodash-es";

const tempData: any = {
  id: 0,
  processName: "名称",
  processNumber: "编号",
  auditFlowId: 100,
  solutionId: 100,
  deviceInfo: {
    deviceTotalCost: 0,
    deviceArr: [
      {
        deviceName: "设备1",
        deviceNumber: 0,
        devicePrice: 0,
        deviceStatus: ""
      },
      {
        deviceName: "设备2",
        deviceNumber: 0,
        devicePrice: 0,
        deviceStatus: ""
      },
      {
        deviceName: "设备3",
        deviceNumber: 0,
        devicePrice: 0,
        deviceStatus: ""
      }
    ]
  },
  developCostInfo: {
    openDrawingSoftware: "",
    hardwareDeviceTotalPrice: 0,
    hardwareInfo: [
      {
        hardwareDeviceName: "硬件1",
        hardwareDeviceNumber: 0,
        hardwareDevicePrice: 0
      },
      {
        hardwareDeviceName: "硬件2",
        hardwareDeviceNumber: 0,
        hardwareDevicePrice: 0
      }
    ],
    traceabilitySoftware: '',//追溯软件名称
    traceabilitySoftwareCost: 0,          //追溯软件费用
    hardwareTotalPrice: 0,
    softwarePrice: 0
  },
  toolInfo: {
    zhiJuArr: [
      {
        fixtureName: "治具1",
        fixtureNumber: 0,
        fixturePrice: 0
      },
      {
        fixtureName: "治具2",
        fixtureNumber: 0,
        fixturePrice: 0
      }
    ],
    fixtureName: "检具名称",
    fixtureNumber: 0,
    fixturePrice: 0,
    frockName: "工装名称",
    frockNumber: 0,
    frockPrice: 0,
    testLineName: "测试线",
    testLineNumber: 0,
    testLinePrice: 0,
    developTotalPrice: 0
  },
  sopInfo: [
    {
      id: 0,
      issues: [
        {
          laborHour: 0,
          machineHour: 0,
          personnelNumber: 0,
          modelCountYearId: 0
        },
        {
          laborHour: 0,
          machineHour: 0,
          modelCountYearId: 0,
          personnelNumber: 0
        },
        {
          laborHour: 0,
          machineHour: 0,
          modelCountYearId: 0,
          personnelNumber: 0
        }
      ],
      year: "2023"
    },
    {
      id: 0,
      issues: [
        {
          laborHour: 0,
          machineHour: 0,
          modelCountYearId: 0,
          personnelNumber: 0
        },
        {
          laborHour: 0,
          machineHour: 0,
          personnelNumber: 0
        },
        {
          laborHour: 0,
          machineHour: 0,
          personnelNumber: 0
        }
      ],
      year: "2024"
    },
    {
      id: 0,
      issues: [
        {
          laborHour: 0,
          machineHour: 0,
          personnelNumber: 0,
          modelCountYearId: 0,
        },
        {
          laborHour: 0,
          machineHour: 0,
          modelCountYearId: 0,
          personnelNumber: 0
        },
        {
          laborHour: 0,
          machineHour: 0,
          modelCountYearId: 0,
          personnelNumber: 0
        }
      ],
      year: "2025"
    }
  ]
}
const deviceStatusEnmus = ref<any>([]);
const dataArr = ref<any>([])
const currentEditIndex = ref<number>()
let currentEditItem: any = null
const addFlag = ref(false)

const structuralDataDialogTableVisible = ref(false)
const FindElectronicBomByProcessOMDataDialogTableVisible = ref(false)
const {auditFlowId, productId}: any = getQuery()
const UPHData = ref<any>([])
const lineData = ref<any>([])
const structuralData = ref<any>([])
const electronicBomData = ref<any>([])
const yearList = ref<any>([])
const isCOB = ref(true)
const uploadActionUrl = ref(uploadAction + "?AuditFlowId=" + auditFlowId + "&SolutionId=" + productId)
onMounted(() => {
  initData()
})

const initData = () => {
  addFlag.value = false;
  currentEditIndex.value = -1;
  if (auditFlowId != undefined && productId != undefined) {
    dataArr.value = [];
    UPHData.value = [];
    lineData.value = [];
    yearList.value =[]
    getYearData()
    getTableData()
    getUPHAndLineData()
    getDeviceStatuEnmu();
  }
}
const getYearData = () => {
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  GetYear(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      yearList.value = data;
    } else {
      ElMessage({
        type: "error",
        message: "列表加载失败"
      })
    }
  })
}
const getTableData = () => {
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  GetListAll(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      console.log("工时工序列表", data)
      dataArr.value = data;
      if (dataArr.value.length > 0) {
        let lastObj = dataArr.value[(dataArr.value.length - 1)];
        dataArr.value.push(JSON.parse(JSON.stringify(lastObj)));
      }
    } else {
      ElMessage({
        type: "error",
        message: "列表加载失败"
      })
    }
  })
}

const getUPHAndLineData = () => {
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  getListUphOrLine(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      console.log("getListUphOrLine接口响应", data)
      UPHData.value = data.processHoursEnterUphList;
      lineData.value = data.processHoursEnterLineList;
      isCOB.value = data.isCOB;
    } else {
      ElMessage({
        type: "error",
        message: "列表加载失败"
      })
    }
  })
}

const uphChange = async (value: any, uphIndex: number) => {
  let uphData = UPHData.value;
  let param = {
    "auditFlowId": auditFlowId,
    "solutionId": productId,
    "processHoursEnterUphListDtos": uphData
  }
  console.log("uphData", uphData);
  await changeUphData(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      lineData.value = data;
      return;
    }
  })
}

const getDeviceStatuEnmu = () => {
  getDeviceStatus().then((response: any) => {
    console.log("======设备状态列表=======", response);
    if (response.success) {
      deviceStatusEnmus.value = response.result;
    }
  })
}


//整个页面保存
const handleSaveData = () => {
  let pList = JSON.parse(JSON.stringify(dataArr.value));
  if (pList.length > 0) {
    pList.pop();
  }
  let param = {
    auditFlowId: auditFlowId,
    solutionId: productId,
    listItemDtos: pList,
    processHoursEnterUphList: JSON.parse(JSON.stringify(UPHData.value)),
    processHoursEnterLineList: JSON.parse(JSON.stringify(lineData.value))
  }
  console.log("保存参数", param)
  return handleSaveOption(param).then((response: any) => {
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
        message: "新增失败"
      })
    }
  })
}
// //整个页面提交
// const handleSubmit = () => {
//   let param = {
//     auditFlowId: auditFlowId,
//     solutionId: productId
//   }
//   handleSubmitOption(param).then((response: any) => {
//     console.log("提交响应", response)
//     if (response.success) {
//       ElMessage({
//         type: "success",
//         message: response.result
//       })
//       initData()
//     } else {
//       ElMessage({
//         type: "error",
//         message: "失败"
//       })
//     }
//   })
// }

const handleSubmit = ({comment, opinion, nodeInstanceId}: any) => {
  handleSaveData().then((p: any) => {
    let param = {
      auditFlowId: auditFlowId,
      solutionId: productId,
      comment,
      opinion,
      nodeInstanceId
    }
    console.log("提交参数", param);
    handleSubmitOption(param).then((response: any) => {
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
  }) // 保存
}

const upload = ref<UploadInstance>()
const showUploadFile = ref(false)
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const uploadSuccess = (response: any, uploadFile: any, uploadFiles: any) => {
  if (response.success) {
    let exportListData = response.result ? response.result : []
    console.log("导入工时工序", exportListData.length);
    //dataArr.value = exportData.concat(dataArr.value)
    if (exportListData == null || exportListData.length < 1) {
      ElMessage({
        type: "error",
        message: "导入数据为空!"
      })
      return
    }
    //showUploadFile.value=true;
    if (dataArr.value.length > 0) {
      let oldSop = JSON.parse(JSON.stringify(dataArr.value[0].sopInfo));
      for (let k = 0; k < exportListData.length; k++) {
        let newExportItem = exportListData[k];
        let newSop = JSON.parse(JSON.stringify(newExportItem.sopInfo ? newExportItem.sopInfo : []));
        oldSop.map(function (oldItem: any, index: number) {
          oldItem.issues = [{
            id: 0,
            laborHour: 0,
            machineHour: 0,
            personnelNumber: 0,
            modelCountYearId: 0,
          }];
          let yearIndex = oldItem.year;
          console.log(yearIndex)
          newSop.map(function (newItem: any, newIndex: number) {
            console.log(newItem)
            let newYearIndex = newItem.year ? newItem.year : '----';
            if (newYearIndex.indexOf(yearIndex) != -1 || yearIndex.indexOf(newYearIndex) != -1) {
              oldItem.issues = newItem.issues;
            }
          })
        })
        newExportItem.sopInfo = oldSop;
        dataArr.value.push(newExportItem);
      }
      // let newSop = JSON.parse(JSON.stringify(exportListData[0].sopInfo ? exportListData[0].sopInfo : []));
      // oldSop.map(function (item: any, index: number) {
      //   item.issues = [{
      //     id: 0,
      //     laborHour: 0,
      //     machineHour: 0,
      //     personnelNumber: 0,
      //   }];
      //   let yearIndex = item.year;
      //   newSop.map(function (newItem: any, newIndex: number) {
      //     let newYearIndex = newItem.year ? newItem.year : '----';
      //     if (newYearIndex.indexOf(yearIndex) != -1 || yearIndex.indexOf(newYearIndex) != -1) {
      //       item.issues = newItem.issues;
      //     }
      //   })
      // })
      // exportListData[0].sopInfo = oldSop;
      // let newData: any = exportListData[0];
      // dataArr.value.push(newData);
    } else {
      dataArr.value = exportListData;
    }
    ElMessage({
      type: "success",
      message: "请确认无误后保存"
    })
  } else {
    ElMessage({
      type: "error",
      message: "导入失败"
    })
  }
}
const uploadErrror = (error: Error, uploadFile: any, uploadFiles: any) => {
  console.log("error", error)
  console.log("uploadFile", uploadFile)
  console.log("uploadFiles", uploadFiles)
  ElMessage({
    type: "error",
    message: "导入失败"
  })
}
//下载模板
const downloadTemplate = () => {
  let param={
    auditFlowId: auditFlowId,
    solutionId: productId,
  }
  handelExport(param).then((response: any) => {
    if (response) {
      const data = new Blob([response],{ type: 'application/octet-stream'});
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download',"工时工序模板.xlsx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      ElMessage({
        type: 'error',
        message: '导出失败'
      })
    }
  })
}
const exportTemplate = () => {
  let param={
    auditFlowId: auditFlowId,
    solutionId: productId,
  }
  exportDownload(param).then((response: any) => {
    if (response) {
      const data = new Blob([response],{ type: 'application/octet-stream'});
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download',"工时工序.xlsx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      ElMessage({
        type: 'error',
        message: '导出失败'
      })
    }
  })
}

//新增工序(新增的时候旧的记录作为模板,需要将数据复原)
const addPH = () => {
  if (addFlag.value == true) {
    ElMessage({
      type: "warning",
      message: "您有新的记录尚未保存"
    })
    return
  } else {
    let size = dataArr.value.length
    if (size > 0) {
      let item = JSON.parse(JSON.stringify(dataArr.value[size - 1]))
      item.id = 0
      dataArr.value.push(item)
    } else {
      tempData.auditFlowId = auditFlowId
      tempData.solutionId = productId
      dataArr.value.push(tempData)
    }
    addFlag.value = true
    currentEditIndex.value = dataArr.value.length - 1
  }
}

//保存
const handleSave = (index: number, row: any) => {
  handleSaveData()
  return
  let param = JSON.parse(JSON.stringify(row))
  let id = row.id
  if (row.id && row.id != 0) {
    console.log("保存修改")
    handleUpdate(param).then((response: any) => {
      console.log("修改响应", response)
      if (response.success) {
        ElMessage({
          type: "success",
          message: "修改成功"
        })
        initData()
      } else {
        ElMessage({
          type: "error",
          message: "编辑保存失败"
        })
      }
    })
  }
  //新增
  else {
    console.log("保存新增")
    handleCreate(param).then((response: any) => {
      console.log("新增响应", response)
      if (response.success) {
        ElMessage({
          type: "success",
          message: "保存成功"
        })
        initData()
      } else {
        ElMessage({
          type: "error",
          message: "新增失败"
        })
      }
    })
  }
}
//取消保存
const cancalEdit = (index: number, row: any) => {
  currentEditIndex.value = -1
  if (addFlag.value == true) {
    console.log("取消新增")
    dataArr.value.splice(index, 1);
    addFlag.value = false
  } else {
    console.log("取消修改")
    dataArr.value[index] = currentEditItem
  }
}

//开启编辑
const handleEdit = (index: number, row: any) => {
  console.log(index, row)
  currentEditIndex.value = index
  currentEditItem = JSON.parse(JSON.stringify(row))
}

//删除
const handleDel = (index: number, row: any) => {
  console.log(index, row)
  if (dataArr.value.length < 2) {
    ElMessage({
      type: "warning",
      message: "至少保留一条记录"
    })
    return
  }
  ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    dataArr.value.splice(index, 1);
    ElMessage({
      type: "success",
      message: "删除成功,确认无误请保存!"
    })
    // handleDelete(row.id).then((response: any) => {
    //   if (response.success) {
    //     ElMessage({
    //       type: "success",
    //       message: "删除成功"
    //     })
    //     initData()
    //   } else {
    //     ElMessage({
    //       type: "error",
    //       message: "删除失败"
    //     })
    //   }
    // })
  })
}

//-------------------------工序序号代码块代码块------------------------------
//#region
interface processNumberListItem {
  id: Number
  processName: String
  processNumber: String
}

const processNumberOptions = ref<processNumberListItem[]>([])
const processNumberloading = ref(false)
//模糊查询工序序号
const remoteMethod = async (query: string) => {
  if (query) {
    processNumberloading.value = true
    await getProcessIndex(query)
    processNumberloading.value = false
  } else {
    processNumberOptions.value = []
  }
}
//获取工序序号
const getProcessIndex = async (keyWord: String) => {
  let param = {
    processNumber: keyWord
  }
  await queryProcessList(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      processNumberOptions.value = data
    } else {
      ElMessage({
        type: "error",
        message: "列表加载失败"
      })
      processNumberOptions.value = []
    }
  })
}

//监听工装序号变化
const processNumberChange = (value: any, dataIndex: any) => {
  getProcessInfoByID(value, dataIndex);
  return;
  if (processNumberOptions.value.length > 0) {
    let options = processNumberOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.processNumber == value) {
        dataArr.value[dataIndex].processName = item.processName;
        return;
      }
    }
  }
}

const getProcessInfoByID = (ProcessNumber: string, dataIndex: number) => {
  let param = {
    ProcessNumber: ProcessNumber
  }
  GetEditorByProcessNumber(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      console.log("根据工序序号查询信息结果", data)
      dataArr.value[dataIndex] = data
      console.log(yearList)
      console.log(yearList)
      console.log(data.sopInfo.length)
      console.log(yearList.value.length )
      if (data.sopInfo.length != yearList.value.length) {
        dataArr.value[dataIndex].sopInfo = yearList
      }
      console.log("根据工序序号查询信息111结果", dataArr.value[dataIndex])
    } else {
      ElMessage({
        type: "error",
        message: "信息加载失败"
      })
    }
  })
}

//#endregion
//-----------------------------------end------------------------------------

//-----------------------------工序名称代码块---------------------------------
//#region
interface processNameListItem {
  id: Number
  processName: String
  processNumber: String
}

const processNameOptions = ref<processNameListItem[]>([])
const processNameLoading = ref(false)
//模糊查询工序名称
const remoteMethodForProcessName = async (query: string) => {
  if (query) {
    processNameLoading.value = true
    await getProcessName(query)
    processNameLoading.value = false
  } else {
    processNameOptions.value = []
  }
}
const getProcessName = async (keyWord: String) => {
  let param = {
    ProcessName: keyWord
  }
  await queryProcessList(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      processNameOptions.value = data
    } else {
      ElMessage({
        type: "error",
        message: "列表加载失败"
      })
      processNameOptions.value = []
    }
  })
}
//监听工序名称变化
const processNameChange = (value: any, dataIndex: any) => {
  console.log(`第${dataIndex + 1}条的工序名称变化了${value}`);
  if (processNameOptions.value.length > 0) {
    let options = processNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.processName == value) {
        dataArr.value[dataIndex].processNumber = item.processNumber;
        return;
      }
    }
  }
}
//#endregion
//------------------------------end------------------------------------------

//---------------------------------硬件设备代码块-----------------------------
//#region
interface deviceListItem {
  deviceName: string,
  deviceNumber: string,
  devicePrice: number,
  deviceStatus: string,
  deviceProvider: string,
  processHoursEnterId: number,
  id: number
}

const deviceListOptions = ref<deviceListItem[]>([])
const deviceNameLoading = ref(false)
//模糊查询设备名称
const remoteMethodForDeviceName = async (query: string) => {
  if (query) {
    deviceNameLoading.value = true
    await getDeviceList(query)
    deviceNameLoading.value = false
  } else {
    deviceListOptions.value = []
  }
}
const getDeviceList = async (keyWord: string) => {
  let param = {
    DeviceName: keyWord
  };
  await getDeviceListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        deviceListOptions.value = data;
        console.log("===查询设备列表===", deviceListOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询设备不存在!"
        })
        deviceListOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询设备不存在!"
      })
      deviceListOptions.value = [];
    }
  })
  return []
}

const deviceNameChange = (value: any, deviceIndex: any, dataIndex: any) => {

  if (deviceListOptions.value.length > 0) {
    let options = deviceListOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.deviceName == value) {
        console.log("当前的设备", item);
        dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].id = item.id;
        dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].devicePrice = item.devicePrice;
        dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].deviceStatus = item.deviceStatus;
        dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].deviceNumber = item.deviceNumber ? item.deviceNumber : 1;
        dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].devicePrice = item.devicePrice;
        handleDeviceChange(item.devicePrice, dataIndex, deviceIndex);
        return;
      }
    }
  }

}
//设备价格或数量变化
const handleDeviceChange = (value: any, dataIndex: any, deviceIndex: any) => {
  let deviceCost = 0.0
  dataArr.value[dataIndex].deviceInfo.deviceArr.forEach((item: any) => {
    deviceCost = deviceCost + item.deviceNumber * item.devicePrice
  })
  dataArr.value[dataIndex].deviceInfo.deviceTotalCost = Number(Number(deviceCost).toFixed(2))
  //sumDeviceTotalCost();
  return Number(Number(deviceCost).toFixed(2));
}
//#endregion
//-------------------------------------end----------------------------------

//--------------------------------软件代码块------------------------------
//#region
interface hardwareDeviceListItem {
  foundationHardwareId: number,
  hardwareBusiness: string,
  hardwareName: string,
  hardwareDeviceNumber: number,
  hardwarePrice: number,
  hardwareState: string,
  id: number
}

const hardwareDeviceNameOptions = ref<hardwareDeviceListItem[]>([])
const hardwareDeviceNameLoading = ref(false)
//模糊查询软件名称
const remoteMethodForHardwareDeviceName = async (query: string) => {
  if (query) {
    hardwareDeviceNameLoading.value = true
    await getHardwareDeviceName(query);
    hardwareDeviceNameLoading.value = false
  } else {
    hardwareDeviceNameOptions.value = []
  }
}
const getHardwareDeviceName = async (keyWord: String) => {
  let param = {
    HardwareName: keyWord
  };
  await getHardWareListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        hardwareDeviceNameOptions.value = data;
        console.log("===查询硬件列表===", hardwareDeviceNameOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询硬件不存在!"
        })
        hardwareDeviceNameOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询设备不存在!"
      })
      hardwareDeviceNameOptions.value = [];
    }
  })
  return []
}
//硬件设备名称变化
const hardWareNameChange = (value: any, deviceIndex: any, dataIndex: any) => {
  if (hardwareDeviceNameOptions.value.length > 0) {
    let options = hardwareDeviceNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.hardwareName == value) {
        console.log("当前的硬件", item);
        dataArr.value[dataIndex].developCostInfo.hardwareInfo[deviceIndex].id = item.id;
        dataArr.value[dataIndex].developCostInfo.hardwareInfo[deviceIndex].hardwareDeviceName = item.hardwareName;
        dataArr.value[dataIndex].developCostInfo.hardwareInfo[deviceIndex].hardwareDeviceNumber = item.hardwareDeviceNumber ? item.hardwareDeviceNumber : 1;
        dataArr.value[dataIndex].developCostInfo.hardwareInfo[deviceIndex].hardwareDevicePrice = item.hardwarePrice;
        handleHardwareDeviceChange(item.hardwarePrice, dataIndex, deviceIndex);
        return;
      }
    }
  }
}
//软件设备数量和价格变化
const handleHardwareDeviceChange = (inputValue: any, dataIndex: any, hardwareDeviceIndex: any) => {
  let handleHardwareDeviceCost = 0.0
  dataArr.value[dataIndex].developCostInfo.hardwareInfo.forEach((item: any) => {
    handleHardwareDeviceCost = handleHardwareDeviceCost + item.hardwareDeviceNumber * item.hardwareDevicePrice
  })
  dataArr.value[dataIndex].developCostInfo.hardwareTotalPrice = Number(Number(handleHardwareDeviceCost).toFixed(2));
  let kaituCost = dataArr.value[dataIndex].developCostInfo.softwarePrice ? dataArr.value[dataIndex].developCostInfo.softwarePrice : 0;
  let zhuiSuCost = dataArr.value[dataIndex].developCostInfo.traceabilitySoftwareCost ? dataArr.value[dataIndex].developCostInfo.traceabilitySoftwareCost : 0;
  let hardwareDeviceTotalPrice = Number(handleHardwareDeviceCost) + Number(kaituCost) + Number(zhuiSuCost);
  dataArr.value[dataIndex].developCostInfo.hardwareDeviceTotalPrice = hardwareDeviceTotalPrice;
  return hardwareDeviceTotalPrice;
}

const caclHardWareCost = (dataIndex: any) => {
  let handleHardwareDeviceCost = 0.0;
  dataArr.value[dataIndex].developCostInfo.hardwareInfo.forEach((item: any) => {
    handleHardwareDeviceCost = handleHardwareDeviceCost + (Number(item.hardwareDeviceNumber) * Number(item.hardwareDevicePrice))
    console.log("计算硬件总价====", handleHardwareDeviceCost);
  })
  return handleHardwareDeviceCost;
}
//#endregion
//-------------------------------------end-------------------------------


//---------------------------追溯软件名称查询代码块------------------------------------
//#region
//追溯软件下拉选项的数据类型定义
interface zhuiSuOptionListItem {
  id: number,
  traceabilitySoftware: String,
  traceabilitySoftwareCost: number
}

const optionLoading = ref(false)
//异步请求loading
const zhuiSuSoftOptions = ref<zhuiSuOptionListItem[]>([])
//填写追溯软件名称的时候需要从后台模糊查询工装名称,然后下拉选择
const remoteMethodForZhuiSuSoft = async (query: string) => {
  if (query) {
    optionLoading.value = true;
    await getZhuiSuSofts(query);
    optionLoading.value = false;
  } else {
    zhuiSuSoftOptions.value = []
  }
}
//查询追溯软件名称的方法,用于渲染追溯软件名称下拉框选项
const getZhuiSuSofts = async (keyWord: String) => {
  let param = {
    TraceabilitySoftware: keyWord
  };
  await getDataFoundationHardwares(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        zhuiSuSoftOptions.value = data;
        console.log("===查询追溯软件列表===", fixtureNameOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询追溯软件不存在!"
        })
        zhuiSuSoftOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询追溯软件不存在!"
      })
      zhuiSuSoftOptions.value = [];
    }
  })
  return [];

  // let param = {
  //   processNumber: keyWord
  // }
  // await queryProcessList(param).then((response: any) => {
  //   if (response.success) {
  //     let data = response.result;
  //     processNumberOptions.value = data;
  //   } else {
  //     ElMessage({
  //       type: 'error',
  //       message: '列表加载失败'
  //     })
  //     processNumberOptions.value = [];
  //   }
  // })
}
//监听追溯变化
const zhuiSuSoftChange = (value: any, dataIndex: any) => {
  if (zhuiSuSoftOptions.value.length > 0) {
    let options = zhuiSuSoftOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.traceabilitySoftware == value) {
        dataArr.value[dataIndex].developCostInfo.traceabilitySoftwareCost = item.traceabilitySoftwareCost;
        dataArr.value[dataIndex].developCostInfo.traceabilitySoftware = item.traceabilitySoftware;
        //这里计算总价
        let hardwareTotalPrice = dataArr.value[dataIndex].developCostInfo.hardwareTotalPrice;
        let softwarePrice = dataArr.value[dataIndex].developCostInfo.softwarePrice;
        dataArr.value[dataIndex].developCostInfo.hardwareDeviceTotalPrice = Number(hardwareTotalPrice) + Number(softwarePrice) + Number(item.traceabilitySoftwareCost);
        return;
      }
    }
  }
}
//#endregion
//-----------------------------------end---------------------------------------


//------------------------------开图软件名称代码块-------------------------
//#region
interface kaiTuNameListItem {
  value: string
  label: string
  price: number
}

const kaiTuNameOptions = ref<kaiTuNameListItem[]>([])
const kaiTuNameLoading = ref(false)
//模糊查询开图工具名称
const remoteMethodForKaiTuName = (query: string) => {
  if (query) {
    kaiTuNameLoading.value = true
    setTimeout(() => {
      kaiTuNameLoading.value = false
      kaiTuNameOptions.value = getKaiTuName(query)
    }, 200)
  } else {
    kaiTuNameOptions.value = []
  }
}
const getKaiTuName = (keyWord: String) => {
  return [
    {label: "开图软件" + keyWord, value: "aaaaa", price: 50000},
    {label: "开图软件" + keyWord, value: "bbbbb", price: 40000},
    {label: "开图软件" + keyWord, value: "ccccc", price: 30000},
    {label: "开图软件" + keyWord, value: "ddddd", price: 20000}
  ]
}
//开图名称变化后,查询此开图的单价,并计算价格
const kaiTuChange = (kaitu: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的开图软件名称变化了" + kaitu)
  //TODO 这里要根据开图软件名称获取到对应的单价  Number(random(50000))
  dataArr.value[dataIndex].developCostInfo.softwarePrice = 0.00;
  //这里计算总价
  let hardwareTotalPrice = dataArr.value[dataIndex].developCostInfo.hardwareTotalPrice;
  let softwarePrice = dataArr.value[dataIndex].developCostInfo.softwarePrice;
  let zhuiSuCost = dataArr.value[dataIndex].developCostInfo.traceabilitySoftwareCost;
  dataArr.value[dataIndex].developCostInfo.hardwareDeviceTotalPrice = Number(hardwareTotalPrice) + Number(softwarePrice) + Number(zhuiSuCost);
}
//#endregion
//-------------------------------end---------------------------------------

//--------------------------治具代码块--------------------------------------
//#region
interface fixtureNameListItem {
  fixtureBusiness: string,
  fixtureName: string,
  fixturePrice: number,
  fixtureProvider: string,
  fixtureState: string,
  foundationFixtureId: number,
  fixtureNumber: number,
  id: number
}

const fixtureNameOptions = ref<fixtureNameListItem[]>([])
const fixtureNameLoading = ref(false)
//模糊查询治具名称
const remoteMethodForZhiJuName = async (query: string) => {
  if (query) {
    fixtureNameLoading.value = true;
    await getZhiJuName(query);
    fixtureNameLoading.value = false;
  } else {
    fixtureNameOptions.value = []
  }
}
const getZhiJuName = async (keyWord: String) => {
  let param = {
    FixtureName: keyWord
  };
  await getZhiJuListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        zhuiSuSoftOptions.value = data;
        console.log("===查询治具列表===", fixtureNameOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询治具不存在!"
        })
        fixtureNameOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询治具不存在!"
      })
      fixtureNameOptions.value = [];
    }
  })
  return []
}
//治具名称发生变化,从而获取治具的价格,并计算总价
const fixtureNameChange = (value: any, dataIndex: number, zhiJuIndex: number) => {
  if (fixtureNameOptions.value.length > 0) {
    let options = fixtureNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.fixtureName == value) {
        console.log("当前的治具", item);
        dataArr.value[dataIndex].toolInfo.zhiJuArr[zhiJuIndex].id = item.id;
        dataArr.value[dataIndex].toolInfo.zhiJuArr[zhiJuIndex].fixtureName = item.fixtureName;
        dataArr.value[dataIndex].toolInfo.zhiJuArr[zhiJuIndex].fixtureNumber = item.fixtureNumber ? item.fixtureNumber : 1;
        dataArr.value[dataIndex].toolInfo.zhiJuArr[zhiJuIndex].fixturePrice = item.fixturePrice;
        handleZhiJuCountChange(dataIndex, zhiJuIndex);
        return;
      }
    }
  }
}
//治具数量变化监听
const handleZhiJuCountChange = (dataIndex: number, zhiJuIndex: number) => {
  calToolTotalCost(dataIndex)
}
//#endregion
//---------------------------------end-------------------------------------

//---------------------------检具代码块-------------------------------------
//#region
interface jianJuNameListItem {
  fixtureGaugeBusiness: string
  fixtureGaugeName: string,
  fixtureGaugePrice: number,
  fixtureGaugestate: string,
  fixtureGaugeNumber: number,
  id: number,
}

const jianJuNameOptions = ref<jianJuNameListItem[]>([])
const jianJuNameLoading = ref(false)
//模糊查询检具名称
const remoteMethodForJianJuName = async (query: string) => {
  if (query) {
    jianJuNameLoading.value = true;
    await getJianJuName(query);
    jianJuNameLoading.value = false
  } else {
    jianJuNameOptions.value = []
  }
}
const getJianJuName = async (keyWord: String) => {
  let param = {
    FixtureName: keyWord
  };
  await getJianJuListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        jianJuNameOptions.value = data;
        console.log("===查询检具列表===", jianJuNameOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询检具不存在!"
        })
        jianJuNameOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询检具不存在!"
      })
      jianJuNameOptions.value = [];
    }
  })
  return []
}
//选择检具名称,查询出检具的单价
const jianJuNameChange = (value: string, dataIndex: number) => {

  if (jianJuNameOptions.value.length > 0) {
    let options = jianJuNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.fixtureGaugeName == value) {
        console.log("当前的检具", item);
        dataArr.value[dataIndex].toolInfo.id = item.id;
        dataArr.value[dataIndex].toolInfo.fixtureName = item.fixtureGaugeName;
        dataArr.value[dataIndex].toolInfo.fixtureNumber = item.fixtureGaugeNumber ? item.fixtureGaugeNumber : 1;
        dataArr.value[dataIndex].toolInfo.fixturePrice = item.fixtureGaugePrice;
        handleJianJuCountChange(value, dataIndex);
        return;
      }
    }
  }
}
//检具数量变化监听
const handleJianJuCountChange = (value: any, dataIndex: number) => {
  calToolTotalCost(dataIndex)
}
//#endregion
//------------------------------end----------------------------------------

//------------------------------------工装代码块--------------------------
//#region
interface gongZhuangNameListItem {
  id: number,
  installationName: string,
  installationNumer: number,
  installationPrice: number,
  installationSupplier: string,
  testName: string,
  testPrice: number,
}

const gongZhuangNameOptions = ref<gongZhuangNameListItem[]>([])
const gongZhuangNameLoading = ref(false)
//模糊查询工装的名称
const remoteMethodForGongZhuangName = async (query: string) => {
  if (query) {
    gongZhuangNameLoading.value = true
    await getGongZhuangName(query)
    gongZhuangNameLoading.value = false
  } else {
    gongZhuangNameOptions.value = []
  }
}
const getGongZhuangName = async (keyWord: String) => {
  let param = {
    InstallationName: keyWord
  }
  await getWorkClothsListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        gongZhuangNameOptions.value = data;
        console.log("===查询工装列表===", gongZhuangNameOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询工装不存在!"
        })
        gongZhuangNameOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询工装不存在!"
      })
      gongZhuangNameOptions.value = [];
    }
  })
  return []
}
//工装名称变化,查询工装的价格
const gongZhuangNameChange = (value: string, dataIndex: number) => {
  //模拟后台查询此工装的单价
  //dataArr.value[dataIndex].toolInfo.frockPrice = Number(random(1000))
  if (gongZhuangNameOptions.value.length > 0) {
    let options = gongZhuangNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.installationName == value) {
        console.log("当前的工装", item);
        dataArr.value[dataIndex].toolInfo.frockName = item.installationName;
        dataArr.value[dataIndex].toolInfo.frockNumber = item.installationNumer ? item.installationNumer : 1;
        dataArr.value[dataIndex].toolInfo.frockPrice = item.installationPrice;
        handleGongZhuangCountChange(value, dataIndex);
        return;
      }
    }
  }
}
//工装数量变化
const handleGongZhuangCountChange = (value: any, dataIndex: number) => {
  calToolTotalCost(dataIndex)
}
//#endregion
//----------------------------------end----------------------------------

//---------------------------测试线代码块------------------------------------
//#region
interface testLineNameListItem {
  id: number,
  installationName: string,
  installationNumer: number,
  installationPrice: number,
  installationSupplier: string,
  testName: string,
  testPrice: number,
  testNumber: number,
}

const testLineNameOptions = ref<testLineNameListItem[]>([])
const testLineNameLoading = ref(false)
//模糊查询测试线的名称
const remoteMethodForTestLineName = async (query: string) => {
  if (query) {
    testLineNameLoading.value = true
    await getTestLineName(query)
    testLineNameLoading.value = false
  } else {
    testLineNameOptions.value = []
  }
}
const getTestLineName = async (keyWord: String) => {
  let param = {
    TestName: keyWord
  }
  await getWorkClothsListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        testLineNameOptions.value = data;
        console.log("===查询测试线列表===", testLineNameOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询测试线不存在!"
        })
        testLineNameOptions.value = [];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询工装不存在!"
      })
      testLineNameOptions.value = [];
    }
  })
  return []
}
//测试先名称变化,查询对应的单价
const testLineNameChange = (value: any, dataIndex: number) => {
  if (testLineNameOptions.value.length > 0) {
    let options = testLineNameOptions.value;
    for (let i = 0; i < options.length; i++) {
      let item = options[i];
      if (item.testName == value) {
        console.log("当前的测试线", item);
        dataArr.value[dataIndex].toolInfo.testLineName = item.testName;
        dataArr.value[dataIndex].toolInfo.testLinePrice = item.testPrice;
        handleTestLineCountChange(value, dataIndex);
        return;
      }
    }
  }
}
//测试线数量变化
const handleTestLineCountChange = (value: any, dataIndex: number) => {
  calToolTotalCost(dataIndex)
}
//#endregion
//-----------------------------------end---------------------------------------


//每条工序工具部分的总费用
const calToolTotalCost = (dataIndex: number) => {
  let developTotalPrice = 0.0
  let toolInfo = dataArr.value[dataIndex].toolInfo;
  let gzCount = toolInfo.frockNumber
  let gzPrice = toolInfo.frockPrice
  let gzCost = Number(gzCount) * Number(gzPrice)
  let tlCount = toolInfo.testLineNumber
  let tlPrice = toolInfo.testLinePrice
  let tlCost = Number(tlCount) * Number(tlPrice)
  let jzCount = toolInfo.fixtureNumber
  let jzPrice = toolInfo.fixturePrice
  let jzCost = Number(jzCount) * Number(jzPrice)
  let zhiJuCost = 0.0;
  if (toolInfo.zhiJuArr && toolInfo.zhiJuArr.length > 0) {
    toolInfo.zhiJuArr.forEach((item: any) => {
      zhiJuCost = zhiJuCost + Number(item.fixtureNumber) * Number(item.fixturePrice)
    })
  }
  developTotalPrice = gzCost + tlCost + jzCost + zhiJuCost;
  return developTotalPrice
}

//3D爆炸图下载

const viewBOM = async () => {
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  let resStruction: any = await GetStructionBom(param)
  structuralDataDialogTableVisible.value = true
  structuralData.value = resStruction.result

}

const viewElectronicBOM = async () => {
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  let resStruction: any = await GetElectronicBom(param)
  FindElectronicBomByProcessOMDataDialogTableVisible.value = true
  electronicBomData.value = resStruction.result

}

const sorDownloadFile = async () => {
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
//模组数据
const showProjectDialog = async () => {
  await GetPriceEvaluationStartData({auditFlowId: productId}).then((response: any) => {
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
const dialogTableVisible = ref(false)
const dialogProData = ref([

])

//-----------------------------选择标准工艺名称代码块---------------------------------
//#region
const dialogFormVisible = ref(false)
const dialogForm = ref({
  name: "",
  id: 0,
  processHoursEnterDtoList: []
})

interface standardProcessNameListItem {
  id: number
  name: string
  list: Array<any>
}

const standardProcessNameOptions = ref<standardProcessNameListItem[]>([])
const standardProcessLoading = ref(false)
//打开选择标准工艺的弹窗
const openStandardProcessDialogForm = async () => {
  dialogFormVisible.value = false;
  dialogForm.value.name = "";
  dialogForm.value.id = 0;
  dialogForm.value.processHoursEnterDtoList = [];
  await getStandardProcessList({name: ""}).then((response: any) => {
    if (response.success) {
      let data = response.result
      if (data.length > 0) {
        standardProcessNameOptions.value = data;
        dialogFormVisible.value = true
      } else {
        ElMessage({
          type: "warning",
          message: "标准工艺数据不存在!"
        })
        standardProcessNameOptions.value = []
      }
    } else {
      ElMessage({
        type: "error",
        message: "标准工艺数据不存在!"
      })
      standardProcessNameOptions.value = []
    }
  })
}
//模糊查询标准工艺名称(废弃)
const remoteMethodForStandardProcessName = async (query: string) => {
  if (query) {
    standardProcessLoading.value = true
    await getStandardProcessName(query)
    standardProcessLoading.value = false
  } else {
    standardProcessNameOptions.value = []
  }
}
//模糊查询工艺标准(废弃)
const getStandardProcessName = async (keyWord: String) => {
  let param = {
    name: keyWord
  }
  standardProcessNameOptions.value = []
  await getStandardProcessList(param).then((response: any) => {
    if (response.success) {
      let data = response.result
      if (data.length > 0) {
        standardProcessNameOptions.value = data
      } else {
        ElMessage({
          type: "warning",
          message: "查询标准工艺不存在"
        })
        standardProcessNameOptions.value = []
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询标准工艺名称失败"
      })
      standardProcessNameOptions.value = []
    }
  })
}

//取消选择工艺标准
const cancelSelectStandardProcess = () => {
  // ElMessage({
  //   type: "warning",
  //   message: "取消选择标准工序"
  // })
  dialogFormVisible.value = false;
}
//确认选择工艺标准
const confirmSelectStandardProcess = () => {
  console.log("选择的标准工艺", dialogForm.value)
  if (dialogForm.value.name.length < 1 || dialogForm.value.id == 0) {
    ElMessage({
      type: "error",
      message: "标准工艺不能为空!"
    })
    return
  }
  let pList = dialogForm.value.processHoursEnterDtoList;
  console.log("pList", pList);
  if (pList == null || pList.length < 1) {
    ElMessage({
      type: "error",
      message: "标准工艺所含工序数据为空!"
    })
    return
  }
  standardProcessLoading.value = true;
  if (dataArr.value.length > 0) {
    let oldSop = JSON.parse(JSON.stringify(dataArr.value[0].sopInfo));
    for (let k = 0; k < pList.length; k++) {
      let newExportItem = pList[k];
      let newSop = JSON.parse(JSON.stringify(newExportItem.sopInfo ? newExportItem.sopInfo : []));
      oldSop.map(function (oldItem: any, index: number) {
        oldItem.issues = [{
          id: 0,
          laborHour: 0,
          machineHour: 0,
          personnelNumber: 0,
        }];
        let yearIndex = oldItem.year;
        newSop.map(function (newItem: any, newIndex: number) {
          let newYearIndex = newItem.year ? newItem.year : '----';
          if (newYearIndex.indexOf(yearIndex) != -1 || yearIndex.indexOf(newYearIndex) != -1) {
            oldItem.issues = newItem.issues;
          }
        })
      })
      newExportItem.sopInfo = oldSop;
      dataArr.value.push(newExportItem);
    }
    // let newSop = JSON.parse(JSON.stringify(pList[0].sopInfo ? pList[0].sopInfo : []));
    // oldSop.map(function (item: any, index: number) {
    //   item.issues = [{
    //     id: 0,
    //     laborHour: 0,
    //     machineHour: 0,
    //     personnelNumber: 0,
    //   }];
    //   let yearIndex = item.year;
    //   newSop.map(function (newItem: any, newIndex: number) {
    //     let newYearIndex = newItem.year ? newItem.year : '----';
    //     if (newYearIndex.indexOf(yearIndex) != -1 || yearIndex.indexOf(newYearIndex) != -1) {
    //       item.issues = newItem.issues;
    //     }
    //   })
    // })
    // pList[0].sopInfo = oldSop;
    // let newData: any = pList[0];
    // dataArr.value.push(newData);
  } else {
    dataArr.value = pList;
  }
  console.log("列表", dataArr.value);
  standardProcessLoading.value = false;
  dialogFormVisible.value = false
  ElMessage({
    type: "success",
    message: "success!"
  })
}
//#endregion
//------------------------------end------------------------------------------

// --------------------------板部件弹窗代码块 start-----------
const panelPartDialogTableVisible = ref(false)
const panelPartTableData = ref<any>([])
const openPanelPartDialog = () => {
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  GetBoardInfomation(param).then((response: any) => {
    console.log("板部件", response)
    if (response.success) {
      let data = response.result
      panelPartTableData.value = data
      panelPartDialogTableVisible.value = true
    } else {
      ElMessage({
        type: "error",
        message: "失败"
      })
      panelPartDialogTableVisible.value = false
    }
  })
}
//---------------------------板部件弹窗代码块 end-----------

const isDisable = (index: number) => {
  if (currentEditIndex.value == index) {
    return false
  }
  return true
}


//设备总计合计列
const sumDeviceTotalCost = () => {
  let sumVal = 0;
  for (let i = 0; i < dataArr.value.length - 1; i++) {
    let dataItem = dataArr.value[i];
    let subValItem = dataItem.deviceInfo.deviceTotalCost ? dataItem.deviceInfo.deviceTotalCost : 0;
    sumVal = sumVal + Number(subValItem);
  }
  ;
  console.log("设备总计求和", sumVal);
  return sumVal.toFixed(0);
}

const sumHardWareTotalCost=()=>{
  let sumVal = 0;
  for (let i = 0; i < dataArr.value.length - 1; i++) {
    let dataItem = dataArr.value[i];
    let hardwareTotalPrice = dataItem.developCostInfo.hardwareTotalPrice ? Number(dataItem.developCostInfo.hardwareTotalPrice) : 0;
    sumVal = sumVal + Number(hardwareTotalPrice);
  }
  console.log("硬件总计求和", sumVal);
  return sumVal.toFixed(0);
}

//软硬件总计求和
const sumHardwareDeviceTotalCost = () => {
  let sumVal = 0;
  for (let i = 0; i < dataArr.value.length - 1; i++) {
    let dataItem = dataArr.value[i];
    let hardwareTotalPrice = dataItem.developCostInfo.hardwareTotalPrice ? Number(dataItem.developCostInfo.hardwareTotalPrice) : 0;
    let softwarePrice = dataItem.developCostInfo.softwarePrice ? Number(dataItem.developCostInfo.softwarePrice) : 0;
    let zhuiSuCost = dataItem.developCostInfo.traceabilitySoftwareCost ? Number(dataItem.developCostInfo.traceabilitySoftwareCost) : 0;
    sumVal = sumVal + Number(hardwareTotalPrice) + Number(softwarePrice) + Number(zhuiSuCost);
  }
  console.log("软硬件总计求和", sumVal);
  return sumVal.toFixed(0);
}
//工装治具列求和
const sumToolTotalCost = () => {
  let sumVal = 0;
  for (let i = 0; i < dataArr.value.length - 1; i++) {
    let dataItem = dataArr.value[i];
    let developTotalPrice = 0.0
    let toolInfo = dataItem.toolInfo;
    let gzCount = toolInfo.frockNumber
    let gzPrice = toolInfo.frockPrice
    let gzCost = Number(gzCount) * Number(gzPrice)
    let tlCount = toolInfo.testLineNumber
    let tlPrice = toolInfo.testLinePrice
    let tlCost = Number(tlCount) * Number(tlPrice)
    let jzCount = toolInfo.fixtureNumber
    let jzPrice = toolInfo.fixturePrice
    let jzCost = Number(jzCount) * Number(jzPrice)
    let zhiJuCost = 0.0;
    if (toolInfo.zhiJuArr && toolInfo.zhiJuArr.length > 0) {
      toolInfo.zhiJuArr.forEach((item: any) => {
        zhiJuCost = zhiJuCost + Number(item.fixtureNumber) * Number(item.fixturePrice)
      })
    }
    developTotalPrice = gzCost + tlCost + jzCost + zhiJuCost;
    sumVal = sumVal + developTotalPrice;
  }
  console.log("工装治具列求和", sumVal);
  return sumVal.toFixed(0);
}

/**
 * 数字格式化
 * @param a 数字
 * @param b 保留后几位
 * @returns
 */
const amoutInterval = function (a: number, b: number) {
  const amout = round(a, b).toLocaleString()
  // 如果不需要保留后几位，直接返回
  if (!b) {
    return amout
  }
  // 如果小数点后几位不符合要求，则动态+0
  if (amout.includes('.')) {
    const num = amout.length - amout.indexOf('.') - 1
    return num < b ? `${amout}${Array(b - num).fill(0).join('')}` : amout
  }
  //如是整数，则动态补0
  return `${amout}.${Array(b).fill(0).join('')}`
}
//人工工时合计
const sumSopCost = (type: number, sopIndex: number) => {
  let sumVal = 0;
  for (let i = 0; i < dataArr.value.length - 1; i++) {
    let dataItem = dataArr.value[i];
    if (type == 1) {
      if (null != dataItem.sopInfo[sopIndex] && undefined != dataItem.sopInfo[sopIndex]) {
        if (null != dataItem.sopInfo[sopIndex].issues) {
          sumVal = sumVal + dataItem.sopInfo[sopIndex].issues[0].laborHour;
        } else {
          sumVal = 0;
        }
      } else {
        sumVal = 0;
      }
    }
    if (type == 2) {

      if (null != dataItem.sopInfo[sopIndex] && undefined != dataItem.sopInfo[sopIndex]) {
        if (null != dataItem.sopInfo[sopIndex].issues) {
          sumVal = sumVal + dataItem.sopInfo[sopIndex].issues[0].machineHour;
        } else {
          sumVal = 0;
        }
      } else {
        sumVal = 0;
      }
    }
    if (type == 3) {
      if (null != dataItem.sopInfo[sopIndex] && undefined != dataItem.sopInfo[sopIndex]) {
        if (null != dataItem.sopInfo[sopIndex].issues) {
          sumVal = sumVal + dataItem.sopInfo[sopIndex].issues[0].personnelNumber;
        } else {
          sumVal = 0;
        }
      } else {
        sumVal = 0;
      }
    }
  }
  return sumVal.toFixed(2);
}

</script>

<style scoped>
.process-hour-box {
  background-color: #ffffff;
}

.uph-box {
  background-color: #ffffff;
}
</style>
<style>
.uph-box .el-input__inner {
  text-align: center;
}
</style>
