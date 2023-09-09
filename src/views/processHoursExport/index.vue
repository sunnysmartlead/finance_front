<template>
  <div>
    <div class="u-flex u-row-between u-col-center u-p-t-10 u-p-b-10 u-border-bottom">
      <div class="u-flex u-row-left u-col-center" />
      <div>
        <!-- <el-button @click="handleSaveData" type="primary">保存</el-button>
        <el-button @click="handleSubmit" type="primary">提交</el-button> -->
        <ProcessVertifyBox :onSubmit="handleSubmit" processType="confirmProcessType" v-havedone />
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
        <ThreeDImage m="2" />
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="viewBOM(1)">结构BOM查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="viewBOM(2)">电子BOM查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="openPanelPartDialog">板部件以及拼版数量</el-button>
      </div>
      <div class="u-m-5">
        <el-upload class="upload-demo" ref="upload" accept=".xls,.xlsx" :show-file-list="false" :on-error="uploadErrror"
          :on-success="uploadSuccess" :on-exceed="handleExceed" :action="uploadAction" :limit="1">
          <template #trigger>
            <el-button type="primary">工序工时导入</el-button>
          </template>
        </el-upload>
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
              <template v-if="dataArr.length > 0 && dataArr[0].deviceInfo && dataArr[0].deviceInfo.deviceArr?.length > 0">
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
              <!-- <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                <span>追溯软件</span>
              </div>
              <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                <span>开发费(追溯)</span>
              </div> -->
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
              <template v-if="dataArr.length > 0 && dataArr[0]?.sopInfo != null">
                <div v-for="(scopItem, sopIndex) in dataArr[0].sopInfo" :key="sopIndex" class="u-text-center">
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
            <div class="u-flex u-row-left u-col-center u-text-center">
              <div class="u-width-300 u-flex u-row-around u-col-center u-border u-p-t-2 u-p-b-2">
                <template v-if="currentEditIndex == dataIndex">
                  <div class="u-width-100">
                    <el-button size="small" @click="cancalEdit(dataIndex, dataItem)">取消</el-button>
                  </div>
                  <!-- <div class="u-width-100">
                    <el-button type="primary" size="small" @click="handleSave(dataIndex, dataItem)">保存</el-button>
                  </div> -->
                </template>
                <template v-else class="u-width-100">
                  <el-button type="primary" size="small" @click="handleEdit(dataIndex, dataItem)">编辑</el-button>
                </template>
                <div class="u-width-100">
                  <el-button size="small" type="danger" @click="handleDel(dataIndex, dataItem)">删除</el-button>
                </div>
              </div>

              <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                <span>{{ dataIndex }}</span>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processNumber"
                        :disabled="isDisable(dataIndex)"
                        filterable remote reserve-keyword
                        :remote-method="remoteMethod"
                        @change="processNumberChange($event, dataIndex)"
                        :loading="processNumberloading">
                  <el-option v-for="item in processNumberOptions"
                        :key="item.id" :label="item.processNumber"
                    :value="item.processNumber" />
                </el-select>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processName" :disabled="isDisable(dataIndex)" filterable remote
                  reserve-keyword :remote-method="remoteMethodForProcessName"
                  @change="processNameChange($event, dataIndex)"
                  :loading="processNameLoading">
                  <el-option v-for="item in processNameOptions"
                        :key="item.id" :label="item.processName"
                    :value="item.processName" />
                </el-select>
              </div>
            </div>

            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <div v-for="(deviceItem, deviceIndex) in dataItem.deviceInfo.deviceArr" :key="deviceIndex"
                  class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border">
                    <el-select v-model="deviceItem.deviceName"
                          :disabled="isDisable(dataIndex)"
                          filterable remote  reserve-keyword
                          :remote-method="remoteMethodForDeviceName"
                          @change="deviceNameChange($event,deviceIndex,dataIndex)"
                          :loading="deviceNameLoading">
                      <el-option v-for="item in deviceListOptions"
                            :key="item.id" :label="item.deviceName" :value="item.deviceName"/>
                    </el-select>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-select v-model="deviceItem.deviceStatus" placeholder="选择状态"  :disabled="isDisable(dataIndex)">
                      <el-option v-for="item in deviceStatusEnmus"
                                        :key="item.code"
                                        :label="item.value"
                                        :value="item.value"/>
                    </el-select>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="deviceItem.deviceNumber" :min="1" :disabled="isDisable(dataIndex)"
                      @change="handleDeviceChange($event, dataIndex, deviceIndex)" />
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="deviceItem.devicePrice" :precision="2" :step="0.01"
                      :disabled="isDisable(dataIndex)" @change="handleDeviceChange($event, dataIndex, deviceIndex)" />
                  </div>
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.deviceInfo.deviceTotalCost.toFixed(2) }}</span>
                </div>
              </div>
            </div>
              <!--追溯  -->
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <div v-for="(hardInfo, hardIndex) in dataItem.developCostInfo.hardwareInfo" :key="hardIndex"
                  class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border">
                    <el-select v-model="hardInfo.hardwareDeviceName" :disabled="isDisable(dataIndex)" filterable remote
                      reserve-keyword :remote-method="remoteMethodForHardwareDeviceName"
                      :loading="hardwareDeviceNameLoading">
                      <el-option v-for="item in hardwareDeviceNameOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <div class="u-border u-width-150">
                    <el-input-number v-model="hardInfo.hardwareDeviceNumber" :min="1" :disabled="isDisable(dataIndex)"
                      @change="handleHardwareDeviceChange($event, dataIndex, hardIndex)" />
                  </div>
                  <div class="u-border u-width-150">
                    <el-input-number v-model="hardInfo.hardwareDevicePrice" :precision="2" :step="0.01"
                      :disabled="isDisable(dataIndex)"
                      @change="handleHardwareDeviceChange($event, dataIndex, hardIndex)" />
                  </div>
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  {{ dataItem.developCostInfo.hardwareTotalPrice.toFixed(2) }}
                </div>
                <!-- <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.zhuiSuSoft }}</span>
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.developCost_zhuisu }}</span>
                </div> -->
                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.developCostInfo.openDrawingSoftware" :disabled="isDisable(dataIndex)"
                    filterable remote reserve-keyword @change="kaiTuChange($event, dataIndex)"
                    :remote-method="remoteMethodForKaiTuName" :loading="kaiTuNameLoading">
                    <el-option v-for="item in kaiTuNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.softwarePrice.toFixed(2) }}</span>
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.hardwareDeviceTotalPrice }}</span>
                </div>
              </div>
            </div>
             <!-- 治具 -->
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center u-text-center">
                <div v-for="(zhiju, zhijuindex) in dataItem.toolInfo.zhiJuArr" :key="zhijuindex"
                  class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150 u-border">
                    <el-select v-model="zhiju.fixtureName" filterable remote reserve-keyword
                      :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForZhiJuName"
                      @change="fixtureNameChange($event, dataIndex, zhijuindex)" :loading="fixtureNameLoading">
                      <el-option v-for="item in fixtureNameOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="zhiju.fixtureNumber" :min="1" :disabled="isDisable(dataIndex)"
                      @change="handleZhiJuCountChange($event, dataIndex, zhijuindex)" />
                  </div>
                  <div class="u-width-150 u-border">
                    <el-input-number v-model="zhiju.fixturePrice" :precision="2" :step="0.01" disabled
                      @change="handleZhiJuCountChange($event, dataIndex, zhijuindex)" />
                  </div>
                </div>
                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.toolInfo.fixtureName" filterable remote reserve-keyword
                    :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForJianJuName"
                    @change="jianJuNameChange($event, dataIndex)" :loading="jianJuNameLoading">
                    <el-option v-for="item in jianJuNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150 u-border">
                  <el-input-number v-model="dataItem.toolInfo.fixtureNumber" :min="1" :disabled="isDisable(dataIndex)"
                    @change="handleJianJuCountChange($event, dataIndex)" />
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.toolInfo.fixturePrice }}</span>
                </div>

                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.toolInfo.frockName" filterable remote reserve-keyword
                    :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForGongZhuangName"
                    @change="gongZhuangNameChange($event, dataIndex)" :loading="gongZhuangNameLoading">
                    <el-option v-for="item in gongZhuangNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150 u-border">
                  <el-input-number v-model="dataItem.toolInfo.frockNumber" :min="1" :disabled="isDisable(dataIndex)"
                    @change="handleGongZhuangCountChange($event, dataIndex)" />
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.toolInfo.frockPrice }}</span>
                </div>

                <div class="u-width-150 u-border">
                  <el-select v-model="dataItem.toolInfo.testLineName" filterable remote reserve-keyword
                    :disabled="isDisable(dataIndex)" :remote-method="remoteMethodForTestLineName"
                    @change="testLineNameChange($event, dataIndex)" :loading="testLineNameLoading">
                    <el-option v-for="item in testLineNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150 u-border">
                  <el-input-number v-model="dataItem.toolInfo.testLineNumber" :min="1" :disabled="isDisable(dataIndex)"
                    @change="handleTestLineCountChange($event, dataIndex)" />
                </div>
                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.toolInfo.testLinePrice }}</span>
                </div>

                <div class="u-width-150 u-border u-p-t-5 u-p-b-5">
                  <span>{{ calToolTotalCost(dataIndex) }}</span>
                </div>
              </div>
            </div>
              <!-- 工时 -->
            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center">
                <div v-for="(scopItem, sopIndex) in dataItem.sopInfo" :key="sopIndex" class="u-text-center">
                  <div class="u-flex u-row-left u-col-center">
                    <div class="u-width-150 u-border">
                      <el-input-number v-model="scopItem.issues[0].laborHour" :min="1" :disabled="isDisable(dataIndex)" />
                    </div>
                    <div class="u-width-150 u-border">
                      <el-input-number v-model="scopItem.issues[0].machineHour" :min="1"
                        :disabled="isDisable(dataIndex)" />
                    </div>
                    <div class="u-width-150 u-border">
                      <el-input-number v-model="scopItem.issues[0].personnelNumber" :min="1"
                        :disabled="isDisable(dataIndex)" />
                    </div>
                  </div>
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
            <div class="u-border u-height-34 u-width-150" v-show="isCOB">
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
              <el-input v-model="uphItem.smtuph" />
            </div>
            <div class="u-border u-width-150 u-text-center" v-show="isCOB">
              <el-input v-model="uphItem.cobuph" class="u-text-center" />
            </div>
            <div class="u-border u-width-150 u-text-center">
              <el-input v-model="uphItem.zcuph" class="u-text-center" />
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
              <el-input v-model="lineItem.xtsl" />
            </div>
            <div class="u-border u-width-150 u-text-center">
              <el-input v-model="lineItem.gxftl" class="u-text-center" />
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
            <div style="font-weight: bold">{{ project.spec }}</div>
          </template>
          <div>
            <div class="u-flex u-row-left u-col-center">
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>序号</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>产品名称</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>产品大类</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5"
                v-for="(yearItem, yearIndex) in project.data[0]?.years" :key="yearIndex">
                <span>{{ yearItem.year }}</span>
              </div>
            </div>
            <div v-for="(dataItem, dataIndex) in project.data" class="u-flex u-row-left u-col-center">
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ dataItem.groupIndex }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ dataItem.prodName }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                <span>{{ dataItem.prodBigCategory }}</span>
              </div>
              <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5"
                v-for="(yearItem, yearIndex) in dataItem.years" :key="yearIndex">
                <span>{{ yearItem.yearVal }}</span>
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
          <el-select v-model="dialogForm" value-key="id"  clearable
            placeholder="选择标准工艺">
            <el-option v-for="item in standardProcessNameOptions"
                  :key="item.id" :label="item.name" :value="item" />
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
        <el-table-column property="boardName" label="板部件名称" align="center" />
        <el-table-column property="boardLenth" label="板部件长(mm)" align="center" />
        <el-table-column property="boardWidth" label="板部件宽(mm)" align="center" />
        <el-table-column property="boardSquare" label="板部件面积(mm^)" align="center" />
        <el-table-column property="stoneQuantity" label="拼板数量" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import ProcessVertifyBox from "@/components/ProcessVertifyBox/index.vue"
import { onMounted, reactive, ref, toRefs } from "vue"
import { ElMessage, ElMessageBox, genFileId } from "element-plus"
import getQuery from "@/utils/getQuery"
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus"
import ThreeDImage from "@/components/ThreeDImage/index.vue"
import {
  GetListAll,
  getProcessHourDetail,
  handleCreate,
  getListUphOrLine,
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
  getDeviceStatus
} from "@/api/processHoursEnter"
import { GetListAll as queryProcessList } from "@/api/process"
import { getListAllForQuery as getStandardProcessList } from "@/api/standardProcess"
import {
  getListAllForSelect as  getDeviceListForSelect
} from '@/api/foundationDeviceDto';
import {random } from "lodash"
import router from "@/router"
import {GetPicture3DByAuditFlowId} from "@/components/ThreeDImage/service";
import { getSorByAuditFlowId } from "@/components/CustomerSpecificity/service"
import { CommonDownloadFile } from "@/api/bom"
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
      year: "2023"
    },
    {
      id: 0,
      issues: [
        {
          laborHour: 0,
          machineHour: 0,
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
      year: "2025"
    }
  ]
}
const deviceStatusEnmus=ref<any>([]);
const dataArr = ref<any>([])
const currentEditIndex = ref<number>()
let currentEditItem: any = null
const addFlag = ref(false)
const { auditFlowId, productId }: any = getQuery()
const UPHData = ref<any>([])
const lineData = ref<any>([])
const isCOB=ref(true)
onMounted(() => {
  initData()
})

const initData = () => {
  addFlag.value = false
  currentEditIndex.value = -1
  if (auditFlowId != undefined && productId != undefined) {
    getTableData()
    getUPHAndLineData()
    getDeviceStatuEnmu();
  }
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
      dataArr.value = data
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
      isCOB.value=data.isCOB;
    } else {
      ElMessage({
        type: "error",
        message: "列表加载失败"
      })
    }
  })
}

const getDeviceStatuEnmu = () => {
    getDeviceStatus().then((response:any) => {
        console.log("======设备状态列表=======", response);
        if (response.success) {
            deviceStatusEnmus.value=response.result;
        }
    })
}


//整个页面保存
const handleSaveData = () => {
  let param = {
    auditFlowId: auditFlowId,
    solutionId: productId,
    listItemDtos: JSON.parse(JSON.stringify(dataArr.value)),
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

const handleSubmit = ({ comment, opinion, nodeInstanceId }: any) => {
  handleSaveData().then((p: any) => {
    let param = {
      auditFlowId: auditFlowId,
      solutionId: productId,
      comment,
      opinion,
      nodeInstanceId
    }
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
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const uploadSuccess = (response: any, uploadFile: any, uploadFiles: any) => {
  if (response.success) {
    let exportListData = response.result ? response.result : []
    console.log("导入工时工序",exportListData.length);
    //dataArr.value = exportData.concat(dataArr.value)
    if (exportListData == null || exportListData.length < 1) {
      ElMessage({
        type: "error",
        message: "导入数据为空!"
      })
      return
    }
    if (dataArr.value.length > 0) {
      let oldSop = JSON.parse(JSON.stringify(dataArr.value[0].sopInfo));
      let newSop = JSON.parse(JSON.stringify(exportListData[0].sopInfo ? exportListData[0].sopInfo : []));
      oldSop.map(function (item: any, index: number) {
        item.issues = [{
          id: 0,
          laborHour: 0,
          machineHour: 0,
          personnelNumber: 0,
        }];
        let yearIndex = item.year;
        newSop.map(function (newItem: any, newIndex: number) {
          let newYearIndex = newItem.year ? newItem.year : '----';
          if (newYearIndex.indexOf(yearIndex) != -1 || yearIndex.indexOf(newYearIndex) != -1) {
            item.issues = newItem.issues;
          }
        })
      })
      exportListData[0].sopInfo = oldSop;
      let newData: any = exportListData[0];
      dataArr.value.push(newData);
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
const downloadTemplate=()=>{
  const baseDomain=import.meta.env.VITE_BASE_API+"Excel/"
  let href=baseDomain+"工时工序导入.xlsx";
  console.log("下载模板==="+href);
  const a = document.createElement('a');
  a.href = href;
  a.setAttribute('download',"工时工序导入模板.xlsx");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
    dataArr.value.splice(index)
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
    handleDelete(row.id).then((response: any) => {
      if (response.success) {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        initData()
      } else {
        ElMessage({
          type: "error",
          message: "删除失败"
        })
      }
    })
  })
}

//-------------------------工序序号代码块代码块------------------------------
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
//-----------------------------------end------------------------------------

//-----------------------------工序名称代码块---------------------------------
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

//------------------------------end------------------------------------------

//---------------------------------硬件设备代码块-----------------------------
interface deviceListItem {
  deviceName:string,
  deviceNumber: string,
  devicePrice: number,
  deviceStatus: string,
  deviceProvider: string,
  processHoursEnterId: number,
  id:number
}
const deviceListOptions = ref<deviceListItem[]>([])
const deviceNameLoading = ref(false)
//模糊查询设备名称
const remoteMethodForDeviceName =async (query: string) => {
  if (query) {
    deviceNameLoading.value = true
    await getDeviceList(query)
    deviceNameLoading.value = false
  } else {
    deviceListOptions.value = []
  }
}
const getDeviceList = async (keyWord:string) => {
  let param={
    DeviceName : keyWord
  };
  await getDeviceListForSelect(param).then((response: any) => {
    if (response.success) {
      let data = response.result;
      if (data.length > 0) {
        deviceListOptions.value=data;
        console.log("===查询设备列表===",deviceListOptions.value);
      } else {
        ElMessage({
          type: "warning",
          message: "查询设备不存在!"
        })
        deviceListOptions.value=[];
      }
    } else {
      ElMessage({
        type: "error",
        message: "查询设备不存在!"
      })
      deviceListOptions.value=[];
    }
  })
  return []
}

const deviceNameChange=(value: any, deviceIndex : any,dataIndex : any)=>{

  if (deviceListOptions.value.length > 0) {
    let options = deviceListOptions.value;
        for (let i = 0; i < options.length; i++) {
            let item = options[i];
            if (item.deviceName == value) {
                console.log("当前的设备",item);
                dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].id=item.id;
                dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].devicePrice=item.devicePrice;
                dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].deviceStatus=item.deviceStatus;
                dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].deviceNumber=item.deviceNumber?item.deviceNumber:1;
                dataArr.value[dataIndex].deviceInfo.deviceArr[deviceIndex].devicePrice=item.devicePrice;
                handleDeviceChange(item.devicePrice,dataIndex,deviceIndex);
                return;
            }
        }
  }

}

//设备价格或数量变化
const handleDeviceChange = (value: any, dataIndex: any, deviceIndex: any) => {
  console.log("第" + dataIndex + "工序的第" + deviceIndex + "个的数量是" + value + "个")
  let deviceCost = 0.0
  dataArr.value[dataIndex].deviceInfo.deviceArr.forEach((item:any) => {
    deviceCost = deviceCost + item.deviceNumber * item.devicePrice
  })
  console.log("设备总价", deviceCost)
  dataArr.value[dataIndex].deviceInfo.deviceTotalCost = Number(Number(deviceCost).toFixed(2))
}
//-------------------------------------end----------------------------------

//--------------------------------软件代码块------------------------------
interface hardwareDeviceListItem {
  value: string
  label: string
}
const hardwareDeviceNameOptions = ref<hardwareDeviceListItem[]>([])
const hardwareDeviceNameLoading = ref(false)
//模糊查询软件名称
const remoteMethodForHardwareDeviceName = (query: string) => {
  if (query) {
    hardwareDeviceNameLoading.value = true
    setTimeout(() => {
      hardwareDeviceNameLoading.value = false
      hardwareDeviceNameOptions.value = getHardwareDeviceName(query)
    }, 200)
  } else {
    hardwareDeviceNameOptions.value = []
  }
}
const getHardwareDeviceName = (keyWord: String) => {
  return [
    { label: "硬件设备名称1" + keyWord, value: "aaaaa" },
    { label: "硬件设备名称2" + keyWord, value: "bbbbb" },
    { label: "硬件设备名称3" + keyWord, value: "ccccc" },
    { label: "硬件设备名称4" + keyWord, value: "ddddd" }
  ]
}
//软件设备数量和价格变化
const handleHardwareDeviceChange = (value: any, dataIndex: any, hardwareDeviceIndex: any) => {
  console.log("第" + dataIndex + "工序的第" + hardwareDeviceIndex + "个的数量是" + value + "个")
  let handleHardwareDeviceCost = 0.0
  dataArr.value[dataIndex].developCostInfo.hardwareInfo.forEach((item) => {
    handleHardwareDeviceCost = handleHardwareDeviceCost + item.hardwareDeviceNumber * item.hardwareDevicePrice
  })
  console.log("软件设备总价", handleHardwareDeviceCost)
  dataArr.value[dataIndex].developCostInfo.hardwareTotalPrice = Number(Number(handleHardwareDeviceCost).toFixed(2))
  dataArr.value[dataIndex].developCostInfo.hardwareDeviceTotalPrice =
    Number(handleHardwareDeviceCost) + Number(dataArr.value[dataIndex].developCostInfo.softwarePrice)
}
//-------------------------------------end-------------------------------

//------------------------------开图软件名称代码块-------------------------
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
    { label: "开图软件" + keyWord, value: "aaaaa", price: 50000 },
    { label: "开图软件" + keyWord, value: "bbbbb", price: 40000 },
    { label: "开图软件" + keyWord, value: "ccccc", price: 30000 },
    { label: "开图软件" + keyWord, value: "ddddd", price: 20000 }
  ]
}
//开图名称变化后,查询此开图的单价,并计算价格
const kaiTuChange = (kaitu: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的开图软件名称变化了" + kaitu)
  dataArr.value[dataIndex].developCostInfo.softwarePrice = Number(random(50000))
  dataArr.value[dataIndex].developCostInfo.hardwareDeviceTotalPrice =
    Number(dataArr.value[dataIndex].developCostInfo.hardwareTotalPrice) +
    Number(dataArr.value[dataIndex].developCostInfo.softwarePrice)
}
//-------------------------------end---------------------------------------

//--------------------------治具代码块--------------------------------------
interface fixtureNameListItem {
  value: string
  label: string
}
const fixtureNameOptions = ref<fixtureNameListItem[]>([])
const fixtureNameLoading = ref(false)
//模糊查询治具名称
const remoteMethodForZhiJuName = (query: string) => {
  if (query) {
    fixtureNameLoading.value = true
    setTimeout(() => {
      fixtureNameLoading.value = false
      fixtureNameOptions.value = getZhiJuName(query)
    }, 200)
  } else {
    fixtureNameOptions.value = []
  }
}
const getZhiJuName = (keyWord: String) => {
  return [
    { label: "治具名称" + keyWord, value: "aaaaa" },
    { label: "治具名称" + keyWord, value: "bbbbb" },
    { label: "治具名称" + keyWord, value: "ccccc" },
    { label: "治具名称" + keyWord, value: "ddddd" }
  ]
}
//治具名称发生变化,从而获取治具的价格,并计算总价
const fixtureNameChange = (zhiju: any, dataIndex: number, zhiJuIndex: number) => {
  console.log("第" + dataIndex + "工序的第" + zhiJuIndex + "个的治具名称发生了变化" + zhiju)
  //模拟后台查询此治具的单价
  dataArr.value[dataIndex].toolInfo.zhiJuArr[zhiJuIndex].fixturePrice = Number(random(1000))
  //这里还要计算总价
}
//治具数量变化监听
const handleZhiJuCountChange = (value: any, dataIndex: any, zhijuIndex: any) => {
  console.log("第" + dataIndex + "工序的第" + zhijuIndex + "个的治具数量是" + value + "个")
}
//---------------------------------end-------------------------------------

//---------------------------检具代码块-------------------------------------
interface jianJuNameListItem {
  value: string
  label: string
}
const jianJuNameOptions = ref<jianJuNameListItem[]>([])
const jianJuNameLoading = ref(false)
//模糊查询检具名称
const remoteMethodForJianJuName = (query: string) => {
  if (query) {
    jianJuNameLoading.value = true
    setTimeout(() => {
      jianJuNameLoading.value = false
      jianJuNameOptions.value = getJianJuName(query)
    }, 200)
  } else {
    jianJuNameOptions.value = []
  }
}
const getJianJuName = (keyWord: String) => {
  return [
    { label: "检具名称1" + keyWord, value: "aaaaa" },
    { label: "检具名称2" + keyWord, value: "bbbbb" },
    { label: "检具名称3" + keyWord, value: "ccccc" },
    { label: "检具名称4" + keyWord, value: "ddddd" }
  ]
}
//选择检具名称,查询出检具的单价
const jianJuNameChange = (jianJu: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的检具名称发生了变化" + jianJu)
  //模拟后台查询此检具的单价
  dataArr.value[dataIndex].toolInfo.fixturePrice = Number(random(1000))
  //这里还要计算总价
}
//检具数量变化监听
const handleJianJuCountChange = (value: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的检举数量变化" + value + "个")
}
//------------------------------end----------------------------------------

//------------------------------------工装代码块--------------------------
interface gongZhuangNameListItem {
  value: string
  label: string
}
const gongZhuangNameOptions = ref<gongZhuangNameListItem[]>([])
const gongZhuangNameLoading = ref(false)
//模糊查询工装的名称
const remoteMethodForGongZhuangName = (query: string) => {
  if (query) {
    gongZhuangNameLoading.value = true
    setTimeout(() => {
      gongZhuangNameLoading.value = false
      gongZhuangNameOptions.value = getGongZhuangName(query)
    }, 200)
  } else {
    gongZhuangNameOptions.value = []
  }
}
const getGongZhuangName = (keyWord: String) => {
  return [
    { label: "工装名称1" + keyWord, value: "aaaaa" },
    { label: "工装名称2" + keyWord, value: "bbbbb" },
    { label: "工装名称3" + keyWord, value: "ccccc" },
    { label: "工装名称4" + keyWord, value: "ddddd" }
  ]
}
//工装名称变化,查询工装的价格
const gongZhuangNameChange = (gongZhuang: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的工装名称发生了变化" + gongZhuang)
  //模拟后台查询此工装的单价
  dataArr.value[dataIndex].toolInfo.frockPrice = Number(random(1000))
  //这里还要计算总价
}
//工装数量变化
const handleGongZhuangCountChange = (value: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的工装数量变化" + value + "个")
}
//----------------------------------end----------------------------------

//---------------------------测试线代码块------------------------------------
interface testLineNameListItem {
  value: string
  label: string
}
const testLineNameOptions = ref<testLineNameListItem[]>([])
const testLineNameLoading = ref(false)
//模糊查询测试线的名称
const remoteMethodForTestLineName = (query: string) => {
  if (query) {
    testLineNameLoading.value = true
    setTimeout(() => {
      testLineNameLoading.value = false
      testLineNameOptions.value = getTestLineName(query)
    }, 200)
  } else {
    testLineNameOptions.value = []
  }
}
const getTestLineName = (keyWord: String) => {
  return [
    { label: "线束名称1" + keyWord, value: "aaaaa" },
    { label: "线束名称2" + keyWord, value: "bbbbb" },
    { label: "线束名称3" + keyWord, value: "ccccc" },
    { label: "线束名称4" + keyWord, value: "ddddd" }
  ]
}
//测试先名称变化,查询对应的单价
const testLineNameChange = (testLine: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的线束名称发生了变化" + testLine)
  //模拟后台查询此线束的单价
  dataArr.value[dataIndex].toolInfo.testLinePrice = Number(random(1000))
  //这里还要计算总价
}
//测试线数量变化
const handleTestLineCountChange = (value: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的线束数量变化" + value + "个")
}
//-----------------------------------end---------------------------------------

//每条工序工具部分的总费用
const calToolTotalCost = (dataIndex: number) => {
  let developTotalPrice = 0.0
  let toolInfo = dataArr.value[dataIndex].toolInfo
  let gzCount = toolInfo.frockNumber
  let gzPrice = toolInfo.frockPrice
  let gzCost = Number(gzCount) * Number(gzPrice)
  let tlCount = toolInfo.testLineNumber
  let tlPrice = toolInfo.testLinePrice
  let tlCost = Number(tlCount) * Number(tlPrice)
  let jzCount = toolInfo.fixtureNumber
  let jzPrice = toolInfo.fixturePrice
  let jzCost = Number(jzCount) * Number(jzPrice)
  let zhiJuCost = 0.0
  toolInfo.zhiJuArr.forEach((item) => {
    zhiJuCost = zhiJuCost + Number(item.fixtureNumber) * Number(item.fixturePrice)
  })
  developTotalPrice = gzCost + tlCost + jzCost + zhiJuCost
  return developTotalPrice
}
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
//3D爆炸图下载
const viewBOM = (type: Number) => {
  ElMessage({
        type: "error",
        message: "接口尚未提供,无法实现!!!"
      })
  return;
  let param = {
    AuditFlowId: auditFlowId,
    SolutionId: productId
  }
  //结构
  if (type == 1) {
    FindStructureBomByProcess(param).then((response: any) => {
      console.log("结构BOM", response)
      return
      if (response.success) {
        let data = response.result
        let fileId = data.threeDFileId
        let fileName = data.threeDFileName
        let url = "" + fileName
        const a = document.createElement("a")
        a.href = url
        a.setAttribute("download", fileName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        ElMessage({
          type: "error",
          message: "失败"
        })
      }
    })
  }
  //电子
  else {
    FindElectronicBomByProcess(param).then((response: any) => {
      console.log("电子BOM", response)
      return
      if (response.success) {
        let data = response.result
        let fileId = data.threeDFileId
        let fileName = data.threeDFileName
        let url = "" + fileName
        const a = document.createElement("a")
        a.href = url
        a.setAttribute("download", fileName)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        ElMessage({
          type: "error",
          message: "失败"
        })
      }
    })
  }
}
//模组数据
const showProjectDialog = () => {
  router.push({
    path: "/resourcesDepartment/moduleNumber",
    query: {
      auditFlowId
    }
  })
  return;
  dialogTableVisible.value = true;
}
const dialogTableVisible = ref(false)
const dialogProData = reactive([
  {
    spec: "300K/Y",
    data: [
      {
        groupIndex: "序号1",
        prodName: "产品名称1",
        prodBigCategory: "产品大类1",
        years: [
          {
            year: "2023",
            yearVal: "二零二三"
          },
          {
            year: "2024",
            yearVal: "二零二四"
          }
        ]
      },
      {
        groupIndex: "序号",
        prodName: "产品名称",
        prodBigCategory: "产品大类",
        years: [
          {
            year: "2023",
            yearVal: "二零二三"
          },
          {
            year: "2024",
            yearVal: "二零二四"
          }
        ]
      }
    ]
  },
  {
    spec: "600K/Y",
    data: [
      {
        groupIndex: "序号1",
        prodName: "产品名称1",
        prodBigCategory: "产品大类1",
        years: [
          {
            year: "2023",
            yearVal: "二零二三"
          },
          {
            year: "2024",
            yearVal: "二零二四"
          }
        ]
      },
      {
        groupIndex: "序号",
        prodName: "产品名称",
        prodBigCategory: "产品大类",
        years: [
          {
            year: "2023",
            yearVal: "二零二三"
          },
          {
            year: "2024",
            yearVal: "二零二四"
          }
        ]
      }
    ]
  },
  {
    spec: "1200K/Y",
    data: [
      {
        groupIndex: "序号1",
        prodName: "产品名称1",
        prodBigCategory: "产品大类1",
        years: [
          {
            year: "2023",
            yearVal: "二零二三"
          },
          {
            year: "2024",
            yearVal: "二零二四"
          }
        ]
      },
      {
        groupIndex: "序号",
        prodName: "产品名称",
        prodBigCategory: "产品大类",
        years: [
          {
            year: "2023",
            yearVal: "二零二三"
          },
          {
            year: "2024",
            yearVal: "二零二四"
          }
        ]
      }
    ]
  }
])

//-----------------------------标准工艺名称代码块---------------------------------
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
const openStandardProcessDialogForm =async () => {
  dialogFormVisible.value = false;
  dialogForm.value.name = "";
  dialogForm.value.id = 0;
  dialogForm.value.processHoursEnterDtoList = [];
  await getStandardProcessList({name:""}).then((response: any) => {
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
    let newSop = JSON.parse(JSON.stringify(pList[0].sopInfo ? pList[0].sopInfo : []));
    oldSop.map(function (item: any, index: number) {
      item.issues = [{
        id: 0,
        laborHour: 0,
        machineHour: 0,
        personnelNumber: 0,
      }];
      let yearIndex = item.year;
      newSop.map(function (newItem: any, newIndex: number) {
        let newYearIndex = newItem.year ? newItem.year : '----';
        if (newYearIndex.indexOf(yearIndex) != -1 || yearIndex.indexOf(newYearIndex) != -1) {
          item.issues = newItem.issues;
        }
      })
    })
    pList[0].sopInfo = oldSop;
    let newData: any = pList[0];
    dataArr.value.push(newData);
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
