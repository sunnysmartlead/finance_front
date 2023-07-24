<template>
  <div>
    <div class="u-flex u-row-between u-col-center u-p-t-10 u-p-b-10 u-border-bottom">
      <div class="u-flex u-row-left u-col-center">
        <div style="font-size: 14px;font-weight: bold;">
          <span>零件列表</span>
        </div>
        <div class="u-m-l-10">
          <el-select v-model="currentPlan" placeholder="请选择方案" size="large">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div>
        <el-button type="primary">提交</el-button>
      </div>
    </div>
    <div class="u-p-t-10 u-p-b-10  u-flex u-flex-wrap u-row-left u-col-center">
      <div class="u-m-5">
        <el-button type="primary" @click="showProjectDialog">项目走量查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">SOR下载</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">选择工艺标准</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary" @click="addPH()">新增工序</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">3D爆炸图下载</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">结果BOM查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">电子BOM查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">板部件以及拼版数量</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">工序工时导入</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">工序工时模板下载</el-button>
      </div>
    </div>
    <div class="u-p-10 u-border process-hour-box">
      <div style="color:#000000;font-weight:bold">
        <span>工序列表录入</span>
      </div>
      <!-- <custom-table-form-list :dataArr="dataArr" @delPH="delPH"></custom-table-form-list> -->
      <el-scrollbar wrap-style="padding:10px 0px" always :max-height="500">
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
              <div v-for="index in 2" :key="index" class="u-flex u-row-left u-col-center u-text-center u-border">
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
              <!-- <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                <span>追溯软件</span>
              </div>
              <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                <span>开发费(追溯)</span>
              </div> -->
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
              <div v-for="index in 2" :key="index" class="u-flex u-row-left u-col-center u-text-center u-border">
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
        <!-- 数据区域 -->
        <template v-if="dataArr.length > 0">
          <div v-for="(dataItem, dataIndex) in dataArr" :key="dataIndex"
            class="u-flex u-row-left u-col-center u-text-center">
            <div class="u-flex u-row-left u-col-center  u-text-center">
              <div class="u-width-300 u-border  u-flex u-row-left u-col-center  u-text-center">
                <div class="u-width-150  u-p-t-2 u-p-b-2">
                  <el-button type="primary" size="small">编辑</el-button>
                </div>
                <div class="u-width-150  u-p-t-2 u-p-b-2">
                  <el-button type="danger" size="small" @click="$emit('delPH', dataIndex)">删除</el-button>
                </div>
              </div>
              <div class="u-width-150 u-border  u-p-t-5 u-p-b-5">
                <span>{{ dataIndex }}</span>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processIndex" filterable remote reserve-keyword :remote-method="remoteMethod"
                  :loading="processIndexloading">
                  <el-option v-for="item in processIndexOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
              <div class="u-width-150 u-border">
                <el-select v-model="dataItem.processName" filterable remote reserve-keyword
                  :remote-method="remoteMethodForProcessName" :loading="processNameLoading">
                  <el-option v-for="item in processNameOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </div>
            </div>

            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center  u-text-center">
                <div v-for="(deviceItem, deviceIndex) in dataItem.deviceInfo.deviceArr" :key="deviceIndex"
                  class="u-flex u-row-left u-col-center u-text-center">
                  <div class="u-width-150  u-border">
                    <el-select v-model="deviceItem.deviceName" filterable remote reserve-keyword
                      :remote-method="remoteMethodForDeviceName" :loading="deviceNameLoading">
                      <el-option v-for="item in deviceNameOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input v-model="deviceItem.deviceStatus" class="input-with-select">
                      <template #append>
                        <el-select v-model="deviceItem.deviceStatus" placeholder="选择" style="width:75px">
                          <el-option label="正常" value="正常" />
                          <el-option label="异常" value="异常" />
                        </el-select>
                      </template>
                    </el-input>
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="deviceItem.deviceCount" :min="1"
                      @change="handleDeviceChange($event, dataIndex, deviceIndex)" />
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="deviceItem.devicePrice" :precision="2" :step="0.01"
                      @change="handleDeviceChange($event, dataIndex, deviceIndex)" />
                  </div>
                </div>
                <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.deviceInfo.deviceTotalCost.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center  u-text-center">
                <div v-for="(hardInfo, hardIndex) in dataItem.developCostInfo.hardwareInfo" :key="hardIndex"
                  class="u-flex u-row-left u-col-center u-text-center u-border">
                  <div class="u-width-150  u-border">
                    <el-select v-model="hardInfo.hardwareDeviceName" filterable remote reserve-keyword
                      :remote-method="remoteMethodForHardwareDeviceName" :loading="hardwareDeviceNameLoading">
                      <el-option v-for="item in hardwareDeviceNameOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="hardInfo.hardwareDeviceCount" :min="1"
                      @change="handleHardwareDeviceChange($event, dataIndex, hardIndex)" />
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="hardInfo.hardwareDevicePrice" :precision="2" :step="0.01"
                      @change="handleHardwareDeviceChange($event, dataIndex, hardIndex)" />
                  </div>
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.hardwareTotalCost.toFixed(2) }}</span>
                </div>
                <!-- <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.zhuiSuSoft }}</span>
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.developCost_zhuisu }}</span>
                </div> -->
                <div class="u-width-150  u-border">
                  <el-select v-model="dataItem.developCostInfo.kaiTuSoft" filterable remote reserve-keyword
                    @change="kaiTuChange($event, dataIndex)" :remote-method="remoteMethodForKaiTuName"
                    :loading="kaiTuNameLoading">
                    <el-option v-for="item in kaiTuNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.developCostInfo.kaiTuCost.toFixed(2) }}</span>
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
                  <div class="u-width-150  u-border">
                    <el-select v-model="zhiju.zhiJuName" filterable remote reserve-keyword
                      :remote-method="remoteMethodForZhiJuName" @change="zhiJuNameChange($event, dataIndex, zhijuindex)"
                      :loading="zhiJuNameLoading">
                      <el-option v-for="item in zhiJuNameOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="zhiju.zhiJuCount" :min="1"
                      @change="handleZhiJuCountChange($event, dataIndex, zhijuindex)" />
                  </div>
                  <div class="u-width-150  u-border">
                    <el-input-number v-model="zhiju.zhiJuPrice" :precision="2" :step="0.01" disabled
                      @change="handleZhiJuCountChange($event, dataIndex, zhijuindex)" />
                  </div>
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <el-select v-model="dataItem.toolInfo.jianJu.jianJuName" filterable remote reserve-keyword
                    :remote-method="remoteMethodForJianJuName" @change="jianJuNameChange($event, dataIndex)"
                    :loading="jianJuNameLoading">
                    <el-option v-for="item in jianJuNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150  u-border">
                  <el-input-number v-model="dataItem.toolInfo.jianJu.jianJuCount" :min="1"
                    @change="handleJianJuCountChange($event, dataIndex)" />
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.toolInfo.jianJu.jianJuPrice }}</span>
                </div>

                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <el-select v-model="dataItem.toolInfo.gongZhuang.gongZhuangName" filterable remote reserve-keyword
                    :remote-method="remoteMethodForGongZhuangName" @change="gongZhuangNameChange($event, dataIndex)"
                    :loading="gongZhuangNameLoading">
                    <el-option v-for="item in gongZhuangNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150  u-border">
                  <el-input-number v-model="dataItem.toolInfo.gongZhuang.gongZhuangCount" :min="1"
                    @change="handleGongZhuangCountChange($event, dataIndex)" />
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.toolInfo.gongZhuang.gongZhuangPrice }}</span>
                </div>

                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <!-- <span>{{ dataItem.toolInfo.testLine.testLineName }}</span> -->
                  <el-select v-model="dataItem.toolInfo.testLine.testLineName" filterable remote reserve-keyword
                    :remote-method="remoteMethodForTestLineName" @change="testLineNameChange($event, dataIndex)"
                    :loading="testLineNameLoading">
                    <el-option v-for="item in testLineNameOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <el-input-number v-model="dataItem.toolInfo.testLine.testLineCount" :min="1"
                    @change="handleTestLineCountChange($event, dataIndex)" />
                </div>
                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <span>{{ dataItem.toolInfo.testLine.testLinePrice }}</span>
                </div>

                <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                  <!-- <span>{{ dataItem.toolInfo.toolTotalCost }}</span> -->
                  <span>{{ calToolTotalCost(dataIndex) }}</span>
                </div>
              </div>
            </div>

            <div class="u-text-center">
              <div class="u-flex u-row-left u-col-center">
                <div v-for="(scopItem, sopIndex) in dataItem.sopInfo" :key="sopIndex" class="u-text-center">
                  <div class="u-flex u-row-left u-col-center">
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.manWorkHour" :min="1" />
                    </div>
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.machineWorkHour" :min="1" />
                    </div>
                    <div class="u-width-150  u-border">
                      <el-input-number v-model="scopItem.manNumber" :min="1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </template>
      </el-scrollbar>
    </div>

    <div class="u-p-10 u-m-t-10 u-border uph-box">
      <div style="color:#000000;font-weight:bold">
        <span>UPH录入</span>
      </div>
      <el-scrollbar wrap-style="padding:10px 0px" always>
        <div class="u-flex u-row-left u-col-center">
          <div style="background-color:#E6A23C" class="u-text-center">
            <div class="u-border  u-height-32 u-width-150">
              <span>UPH</span>
            </div>
            <div class="u-border u-height-34 u-width-150">
              <span>SMT-UPH值</span>
            </div>
            <div class="u-border  u-height-34 u-width-150">
              <span>COB-UPH值</span>
            </div>
            <div class="u-border  u-height-34 u-width-150">
              <span>组测-UPH值</span>
            </div>
          </div>
          <div v-for="(uphItem, uphIndex) in UPHData" :key="uphIndex">
            <div class="u-border u-p-t-5 u-p-b-5 u-width-150 u-text-center">
              <span>{{ uphItem.year }}</span>
            </div>
            <div class="u-border  u-width-150 u-text-center">
              <el-input v-model="uphItem.smtVal" />
            </div>
            <div class="u-border  u-width-150 u-text-center">
              <el-input v-model="uphItem.cobVal" class="u-text-center" />
            </div>
            <div class="u-border  u-width-150 u-text-center">
              <el-input v-model="uphItem.groupTestVal" class="u-text-center" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="u-p-10 u-m-t-10 u-border uph-box">
      <div style="color:#000000;font-weight:bold">
        <span>线体数量、共线分辨率</span>
      </div>
      <el-scrollbar wrap-style="padding:10px 0px" always>
        <div class="u-flex u-row-left u-col-center">
          <div style="background-color:#E6A23C" class="u-text-center">
            <div class="u-border  u-height-32 u-width-150">
              <span>项目\年份</span>
            </div>
            <div class="u-border u-height-34 u-width-150">
              <span>线体数量</span>
            </div>
            <div class="u-border  u-height-34 u-width-150">
              <span>共线分辨率</span>
            </div>
          </div>
          <div v-for="(lineItem, lineIndex) in lineData" :key="lineIndex">
            <div class="u-border u-p-t-5 u-p-b-5 u-width-150 u-text-center">
              <span>{{ lineItem.year }}</span>
            </div>
            <div class="u-border  u-width-150 u-text-center">
              <el-input v-model="lineItem.lineBodyCount" />
            </div>
            <div class="u-border  u-width-150 u-text-center">
              <el-input v-model="lineItem.fenBianLvVal" class="u-text-center" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog v-model="dialogTableVisible" title="模组数量" :close-on-click-modal="false" fullscreen>
        <div>
          <el-card v-for="(project,index) in dialogProData" :key="index" class="u-m-b-10">
              <template #header>
                <div style="font-weight: bold;">{{project.spec}}</div>
              </template> 
              <div>
                  <div class="u-flex u-row-left u-col-center">
                     <div class="u-border u-text-center u-width-200 u-p-t-5 u-p-b-5">
                        <span>序号</span>
                     </div>
                     <div  class="u-border u-text-center  u-width-200  u-p-t-5 u-p-b-5">
                        <span>产品名称</span>
                     </div>
                     <div  class="u-border u-text-center  u-width-200  u-p-t-5 u-p-b-5">
                        <span>产品大类</span>
                     </div>
                     <div  class="u-border u-text-center  u-width-200  u-p-t-5 u-p-b-5"
                          v-for="(yearItem,yearIndex) in project.data[0]?.years" :key="yearIndex">
                          <span>{{ yearItem.year}}</span>
                     </div>
                  </div>
                  <div v-for="(dataItem,dataIndex) in project.data" class="u-flex u-row-left u-col-center">
                    <div class="u-border u-text-center u-width-200  u-p-t-5 u-p-b-5">
                        <span>{{dataItem.groupIndex}}</span>
                     </div>
                     <div  class="u-border u-text-center  u-width-200  u-p-t-5 u-p-b-5">
                        <span>{{dataItem.prodName}}</span>
                     </div>
                     <div  class="u-border u-text-center  u-width-200  u-p-t-5 u-p-b-5">
                        <span>{{dataItem.prodBigCategory}}</span>
                     </div>
                     <div  class="u-border u-text-center  u-width-200  u-p-t-5 u-p-b-5"
                          v-for="(yearItem,yearIndex) in dataItem.years" :key="yearIndex">
                          <span>{{ yearItem.yearVal}}</span>
                     </div>
                  </div>
              </div>
           </el-card>
        </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from "element-plus"
import customTableFormList from "@/components/processHoursExport/custom-table-form-list.vue"
import { randomInt } from 'crypto'
import { random } from 'lodash'

const currentPlan = ref('1')
const options = [
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
]
const dataArr = reactive([
  {
    processIndex: '000111',
    processName: '工序1',
    deviceInfo: {
      deviceArr: [
        {
          deviceName: '设备1',
          deviceStatus: '正常',
          deviceCount: 1,
          devicePrice: 100.00
        },
        {
          deviceName: '设备2',
          deviceStatus: '离线',
          deviceCount: 2,
          devicePrice: 200.00
        },
        {
          deviceName: '设备3',
          deviceStatus: '待维修',
          deviceCount: 3,
          devicePrice: 300.00
        },
      ],
      deviceTotalCost: 1400.00
    },
    developCostInfo: {
      hardwareInfo: [
        {
          hardwareDeviceName: '硬件设备1',
          hardwareDeviceCount: 1,
          hardwareDevicePrice: 100.00
        },
        {
          hardwareDeviceName: '硬件设备2',
          hardwareDeviceCount: 2,
          hardwareDevicePrice: 200.00
        }
      ],
      hardwareTotalCost: 500.00,
      kaiTuSoft: '开图软件',
      kaiTuCost: 1000.00,
      //zhuiSuSoft: '追溯软件',
      // developCost_zhuisu: 22222.22,
      developTotalCost: 1500.00
    },
    toolInfo: {
      zhiJuArr: [
        {
          zhiJuName: '治具1',
          zhiJuCount: 1,
          zhiJuPrice: 500.00
        },
        {
          zhiJuName: '治具2',
          zhiJuCount: 1,
          zhiJuPrice: 500.00
        }
      ],
      jianJu: {
        jianJuName: '检具1',
        jianJuCount: 1,
        jianJuPrice: 1000.00
      },
      gongZhuang: {
        gongZhuangName: '工装1',
        gongZhuangCount: 1,
        gongZhuangPrice: 3000.00
      },
      testLine: {
        testLineName: '测试线名称',
        testLineCount: 1,
        testLinePrice: 5000
      },
      toolTotalCost: 10000.00
    },
    sopInfo: [
      {
        year: '2023',
        manWorkHour: 8,
        manNumber: 1,
        machineWorkHour: 4,
      },
      {
        year: '2024',
        manWorkHour: 18,
        manNumber: 11,
        machineWorkHour: 14,
      }
    ]
  }
])

const UPHData = reactive([])
const lineData = reactive([])

onMounted(() => {
  // console.log('数据结构',JSON.stringify(dataArr));
  getUPHData();
  getLineData();
})


//新增工序
const addPH = () => {
  dataArr.push(dataArr[dataArr.length - 1]);
  console.log("新增工序", dataArr.length);
}
//删除工序
const delPH = (index: number) => {
  console.log("====删除下标===", index);
  if (dataArr.length < 2) {
    ElMessage({
      type: "warning",
      message: "至少保留一条记录"
    })
    return;
  }
  ElMessageBox.confirm("是否删除该记录!", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    dataArr.splice(index);
  })
}

//-------------------------工序序号代码块代码块------------------------------
interface processIndexListItem {
  value: string
  label: string
}
const processIndexOptions = ref<processIndexListItem[]>([])
const processIndexloading = ref(false)
//模糊查询工序序号
const remoteMethod = (query: string) => {
  if (query) {
    processIndexloading.value = true;
    setTimeout(() => {
      processIndexloading.value = false;
      processIndexOptions.value = getProcessIndex(query);
    }, 200)
  } else {
    processIndexOptions.value = []
  }
}
//获取工序序号
const getProcessIndex = (keyWord: String) => {
  return [
    { label: keyWord + '00000', value: 'aaaaa' },
    { label: keyWord + '11111', value: 'bbbbb' },
    { label: keyWord + '22222', value: 'ccccc' },
    { label: keyWord + '33333', value: 'ddddd' }
  ]
}
//-----------------------------------end------------------------------------



//-----------------------------工序名称代码块---------------------------------
interface processNameListItem {
  value: string
  label: string
}
const processNameOptions = ref<processNameListItem[]>([])
const processNameLoading = ref(false)
//模糊查询工序名称
const remoteMethodForProcessName = (query: string) => {
  if (query) {
    processNameLoading.value = true;
    setTimeout(() => {
      processNameLoading.value = false;
      processNameOptions.value = getProcessName(query);
    }, 200)
  } else {
    processNameOptions.value = []
  }
}
const getProcessName = (keyWord: String) => {
  return [
    { label: "工序名称1" + keyWord, value: 'aaaaa' },
    { label: "工序名称2" + keyWord, value: 'bbbbb' },
    { label: "工序名称3" + keyWord, value: 'ccccc' },
    { label: "工序名称4" + keyWord, value: 'ddddd' }
  ]
}
//------------------------------end------------------------------------------




//---------------------------------硬件设备代码块-----------------------------
interface deviceNameListItem {
  value: string
  label: string
}
const deviceNameOptions = ref<deviceNameListItem[]>([])
const deviceNameLoading = ref(false)
//模糊查询设备名称
const remoteMethodForDeviceName = (query: string) => {
  if (query) {
    deviceNameLoading.value = true;
    setTimeout(() => {
      deviceNameLoading.value = false;
      deviceNameOptions.value = getDeviceName(query);
    }, 200)
  } else {
    deviceNameOptions.value = []
  }
}
const getDeviceName = (keyWord: String) => {
  return [
    { label: "设备名称1" + keyWord, value: 'aaaaa' },
    { label: "设备名称2" + keyWord, value: 'bbbbb' },
    { label: "设备名称3" + keyWord, value: 'ccccc' },
    { label: "设备名称4" + keyWord, value: 'ddddd' }
  ]
}
//设备价格或数量变化
const handleDeviceChange = (value: any, dataIndex: any, deviceIndex: any) => {
  console.log("第" + dataIndex + "工序的第" + deviceIndex + "个的数量是" + value + "个");
  let deviceCost = 0.00;
  dataArr[dataIndex].deviceInfo.deviceArr.forEach(item => {
    deviceCost = deviceCost + item.deviceCount * item.devicePrice;
  })
  console.log("设备总价", deviceCost);
  dataArr[dataIndex].deviceInfo.deviceTotalCost = Number(Number(deviceCost).toFixed(2));
}
//-------------------------------------end----------------------------------



//--------------------------------软件代码块------------------------------
interface hardwareDeviceNameListItem {
  value: string
  label: string
}
const hardwareDeviceNameOptions = ref<hardwareDeviceNameListItem[]>([])
const hardwareDeviceNameLoading = ref(false)
//模糊查询软件名称
const remoteMethodForHardwareDeviceName = (query: string) => {
  if (query) {
    hardwareDeviceNameLoading.value = true;
    setTimeout(() => {
      hardwareDeviceNameLoading.value = false;
      hardwareDeviceNameOptions.value = getHardwareDeviceName(query);
    }, 200)
  } else {
    hardwareDeviceNameOptions.value = []
  }
}
const getHardwareDeviceName = (keyWord: String) => {
  return [
    { label: "硬件设备名称1" + keyWord, value: 'aaaaa' },
    { label: "硬件设备名称2" + keyWord, value: 'bbbbb' },
    { label: "硬件设备名称3" + keyWord, value: 'ccccc' },
    { label: "硬件设备名称4" + keyWord, value: 'ddddd' }
  ]
}
//软件设备数量和价格变化
const handleHardwareDeviceChange = (value: any, dataIndex: any, hardwareDeviceIndex: any) => {
  console.log("第" + dataIndex + "工序的第" + hardwareDeviceIndex + "个的数量是" + value + "个");
  let handleHardwareDeviceCost = 0.00;
  dataArr[dataIndex].developCostInfo.hardwareInfo.forEach(item => {
    handleHardwareDeviceCost = handleHardwareDeviceCost + item.hardwareDeviceCount * item.hardwareDevicePrice;
  })
  console.log("软件设备总价", handleHardwareDeviceCost);
  dataArr[dataIndex].developCostInfo.hardwareTotalCost = Number(Number(handleHardwareDeviceCost).toFixed(2));
  dataArr[dataIndex].developCostInfo.developTotalCost = Number(handleHardwareDeviceCost) + Number(dataArr[dataIndex].developCostInfo.kaiTuCost);
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
    kaiTuNameLoading.value = true;
    setTimeout(() => {
      kaiTuNameLoading.value = false;
      kaiTuNameOptions.value = getKaiTuName(query);
    }, 200)
  } else {
    kaiTuNameOptions.value = []
  }
}
const getKaiTuName = (keyWord: String) => {
  return [
    { label: "开图软件" + keyWord, value: 'aaaaa', price: 50000 },
    { label: "开图软件" + keyWord, value: 'bbbbb', price: 40000 },
    { label: "开图软件" + keyWord, value: 'ccccc', price: 30000 },
    { label: "开图软件" + keyWord, value: 'ddddd', price: 20000 }
  ]
}
//开图名称变化后,查询此开图的单价,并计算价格
const kaiTuChange = (kaitu: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的开图软件名称变化了" + kaitu);
  dataArr[dataIndex].developCostInfo.kaiTuCost = Number(random(50000));
  dataArr[dataIndex].developCostInfo.developTotalCost = Number(dataArr[dataIndex].developCostInfo.hardwareTotalCost) + Number(dataArr[dataIndex].developCostInfo.kaiTuCost);
}
//-------------------------------end---------------------------------------




//--------------------------治具代码块--------------------------------------
interface zhiJuNameListItem {
  value: string
  label: string
}
const zhiJuNameOptions = ref<zhiJuNameListItem[]>([])
const zhiJuNameLoading = ref(false)
//模糊查询治具名称
const remoteMethodForZhiJuName = (query: string) => {
  if (query) {
    zhiJuNameLoading.value = true;
    setTimeout(() => {
      zhiJuNameLoading.value = false;
      zhiJuNameOptions.value = getZhiJuName(query);
    }, 200)
  } else {
    zhiJuNameOptions.value = []
  }
}
const getZhiJuName = (keyWord: String) => {
  return [
    { label: "治具名称" + keyWord, value: 'aaaaa' },
    { label: "治具名称" + keyWord, value: 'bbbbb' },
    { label: "治具名称" + keyWord, value: 'ccccc' },
    { label: "治具名称" + keyWord, value: 'ddddd' }
  ]
}
//治具名称发生变化,从而获取治具的价格,并计算总价
const zhiJuNameChange = (zhiju: any, dataIndex: number, zhiJuIndex: number) => {
  console.log("第" + dataIndex + "工序的第" + zhiJuIndex + "个的治具名称发生了变化" + zhiju);
  //模拟后台查询此治具的单价
  dataArr[dataIndex].toolInfo.zhiJuArr[zhiJuIndex].zhiJuPrice = Number(random(1000));
  //这里还要计算总价
}
//治具数量变化监听
const handleZhiJuCountChange = (value: any, dataIndex: any, zhijuIndex: any) => {
  console.log("第" + dataIndex + "工序的第" + zhijuIndex + "个的治具数量是" + value + "个");
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
    jianJuNameLoading.value = true;
    setTimeout(() => {
      jianJuNameLoading.value = false;
      jianJuNameOptions.value = getJianJuName(query);
    }, 200)
  } else {
    jianJuNameOptions.value = []
  }
}
const getJianJuName = (keyWord: String) => {
  return [
    { label: "检具名称1" + keyWord, value: 'aaaaa' },
    { label: "检具名称2" + keyWord, value: 'bbbbb' },
    { label: "检具名称3" + keyWord, value: 'ccccc' },
    { label: "检具名称4" + keyWord, value: 'ddddd' }
  ]
}
//选择检具名称,查询出检具的单价
const jianJuNameChange = (jianJu: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的检具名称发生了变化" + jianJu);
  //模拟后台查询此检具的单价
  dataArr[dataIndex].toolInfo.jianJu.jianJuPrice = Number(random(1000));
  //这里还要计算总价
}
//检具数量变化监听
const handleJianJuCountChange = (value: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的检举数量变化" + value + "个");
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
    gongZhuangNameLoading.value = true;
    setTimeout(() => {
      gongZhuangNameLoading.value = false;
      gongZhuangNameOptions.value = getGongZhuangName(query);
    }, 200)
  } else {
    gongZhuangNameOptions.value = []
  }
}
const getGongZhuangName = (keyWord: String) => {
  return [
    { label: "工装名称1" + keyWord, value: 'aaaaa' },
    { label: "工装名称2" + keyWord, value: 'bbbbb' },
    { label: "工装名称3" + keyWord, value: 'ccccc' },
    { label: "工装名称4" + keyWord, value: 'ddddd' }
  ]
}
//工装名称变化,查询工装的价格
const gongZhuangNameChange = (gongZhuang: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的工装名称发生了变化" + gongZhuang);
  //模拟后台查询此工装的单价
  dataArr[dataIndex].toolInfo.gongZhuang.gongZhuangPrice = Number(random(1000));
  //这里还要计算总价
}
//工装数量变化
const handleGongZhuangCountChange = (value: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的工装数量变化" + value + "个");
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
    testLineNameLoading.value = true;
    setTimeout(() => {
      testLineNameLoading.value = false;
      testLineNameOptions.value = getTestLineName(query);
    }, 200)
  } else {
    testLineNameOptions.value = []
  }
}
const getTestLineName = (keyWord: String) => {
  return [
    { label: "线束名称1" + keyWord, value: 'aaaaa' },
    { label: "线束名称2" + keyWord, value: 'bbbbb' },
    { label: "线束名称3" + keyWord, value: 'ccccc' },
    { label: "线束名称4" + keyWord, value: 'ddddd' }
  ]
}
//测试先名称变化,查询对应的单价
const testLineNameChange = (testLine: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的线束名称发生了变化" + testLine);
  //模拟后台查询此线束的单价
  dataArr[dataIndex].toolInfo.testLine.testLinePrice = Number(random(1000));
  //这里还要计算总价
}
//测试线数量变化
const handleTestLineCountChange = (value: any, dataIndex: number) => {
  console.log("第" + dataIndex + "工序的线束数量变化" + value + "个");
}
//-----------------------------------end---------------------------------------


//每条工序工具部分的总费用
const calToolTotalCost = (dataIndex: number) => {
  let toolTotalCost = 0.00;
  let toolInfo = dataArr[dataIndex].toolInfo;
  let gzCount = toolInfo.gongZhuang.gongZhuangCount;
  let gzPrice = toolInfo.gongZhuang.gongZhuangPrice;
  let gzCost = Number(gzCount) * Number(gzPrice);
  let tlCount = toolInfo.testLine.testLineCount;
  let tlPrice = toolInfo.testLine.testLinePrice;
  let tlCost = Number(tlCount) * Number(tlPrice);
  let jzCount = toolInfo.jianJu.jianJuCount;
  let jzPrice = toolInfo.jianJu.jianJuPrice;
  let jzCost = Number(jzCount) * Number(jzPrice);
  let zhiJuCost = 0.00;
  toolInfo.zhiJuArr.forEach((item) => {
    zhiJuCost = zhiJuCost + Number(item.zhiJuCount) * Number(item.zhiJuPrice);
  })
  toolTotalCost = gzCost + tlCost + jzCost + zhiJuCost;
  return toolTotalCost;
}



const getUPHData = () => {
  for (let i = 25; i >= 10; i--) {
    let item = {
      year: '20' + i,
      smtVal: random(100 * i),
      cobVal: random(500 * i),
      groupTestVal: random(1000 * i)
    }
    UPHData.unshift(item)
  }
}

const getLineData = () => {
  for (let i = 25; i >= 10; i--) {
    let item = {
      year: '20' + i,
      lineBodyCount: random(100 * i),
      fenBianLvVal: random(500 * i),
    }
    lineData.unshift(item)
  }
}


const dialogTableVisible = ref(false)
const dialogProData = [
  {
    spec: '300K/Y',
    data: [
      {
        groupIndex: '序号1',
        prodName: '产品名称1',
        prodBigCategory: '产品大类1',
        years: [
          {
            year: '2023',
            yearVal: '二零二三'
          },
          {
            year: '2024',
            yearVal: '二零二四'
          }
        ]
      },
      {
        groupIndex: '序号',
        prodName: '产品名称',
        prodBigCategory: '产品大类',
        years: [
          {
            year: '2023',
            yearVal: '二零二三'
          },
          {
            year: '2024',
            yearVal: '二零二四'
          }
        ]
      },
    ]
  },
  {
    spec: '600K/Y',
    data: [
      {
        groupIndex: '序号1',
        prodName: '产品名称1',
        prodBigCategory: '产品大类1',
        years: [
          {
            year: '2023',
            yearVal: '二零二三'
          },
          {
            year: '2024',
            yearVal: '二零二四'
          }
        ]
      },
      {
        groupIndex: '序号',
        prodName: '产品名称',
        prodBigCategory: '产品大类',
        years: [
          {
            year: '2023',
            yearVal: '二零二三'
          },
          {
            year: '2024',
            yearVal: '二零二四'
          }
        ]
      },
    ]
  },
  {
    spec: '1200K/Y',
    data: [
      {
        groupIndex: '序号1',
        prodName: '产品名称1',
        prodBigCategory: '产品大类1',
        years: [
          {
            year: '2023',
            yearVal: '二零二三'
          },
          {
            year: '2024',
            yearVal: '二零二四'
          }
        ]
      },
      {
        groupIndex: '序号',
        prodName: '产品名称',
        prodBigCategory: '产品大类',
        years: [
          {
            year: '2023',
            yearVal: '二零二三'
          },
          {
            year: '2024',
            yearVal: '二零二四'
          }
        ]
      },
    ]
  }
]



const showProjectDialog = () => {
  dialogTableVisible.value = true
}


// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(dataArr),
  ...toRefs(UPHData),
  ...toRefs(lineData),
  dialogTableVisible
})

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