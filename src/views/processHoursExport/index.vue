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
        <el-button type="primary">项目走量查看</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">SOR下载</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">选择工艺标准</el-button>
      </div>
      <div class="u-m-5">
        <el-button type="primary">新增工序</el-button>
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

    <div class="u-p-10">
      <el-scrollbar  :height="dataArr.length>0?(dataArr.length*70+70):140">
        <!-- 头部区 -->
        <div class="u-flex u-row-left u-col-center u-text-center">
          <div class="u-flex u-row-left u-col-center  u-text-center">
            <div class="u-width-150  u-border u-height-60"><span>序号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序编号</span></div>
            <div class="u-width-150 u-border u-height-60"><span>工序名称</span></div>
          </div>
          <div class="u-text-center">
            <div class="u-text-center u-border  u-p-t-5 u-p-b-5">设备部分</div>
            <div class="u-flex u-row-left u-col-center  u-text-center">
              <div v-for="index in 3" :key="index" 
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
          <div class="u-text-center">
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

          <div  class="u-text-center">
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

          <!-- <div v-for="(dataItem,index) in dataArr[0].sopInfo" :key="index">
            <div  class="u-text-center">
              <div class="u-text-center   u-border u-p-t-5 u-p-b-5"></div>
              <div class="u-flex u-row-left u-col-center  u-text-center"></div> 
            </div>
          </div> -->
         
        </div>
        <template v-if="dataArr.length>0">
            <!-- 数据区域 -->
            <div v-for="(dataItem,dataIndex) in dataArr" :key="dataIndex" 
                class="u-flex u-row-left u-col-center u-text-center">
              <div class="u-flex u-row-left u-col-center  u-text-center">
                <div class="u-width-150 u-border  u-p-t-5 u-p-b-5"><span>{{dataIndex}}</span></div>
                <div class="u-width-150 u-border  u-p-t-5 u-p-b-5"><span>{{dataItem.processIndex}}</span></div>
                <div class="u-width-150 u-border  u-p-t-5 u-p-b-5"><span>{{dataItem.processName}}</span></div>
              </div>
              <div class="u-text-center">
                <div class="u-flex u-row-left u-col-center  u-text-center">
                  <div v-for="(deviceItem,deviceIndex) in dataItem.deviceInfo.deviceArr" 
                    :key="deviceIndex" 
                    class="u-flex u-row-left u-col-center u-text-center">
                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                      <span>{{deviceItem.deviceName}}</span>
                    </div>
                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                      <span>{{deviceItem.deviceStatus}}</span>
                    </div>
                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                      <span>{{deviceItem.deviceCount}}</span>
                    </div>
                    <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                      <span>{{deviceItem.devicePrice}}</span>
                    </div>
                  </div>
                  <div class="u-width-150  u-border   u-p-t-5 u-p-b-5">
                    <span>{{dataItem.deviceInfo.deviceTotalCost}}</span>
                  </div>
                </div>
              </div>
              <div class="u-text-center">
                <div class="u-flex u-row-left u-col-center  u-text-center">
                  <div v-for="(hardInfo,hardIndex) in dataItem.developCostInfo.hardwareInfo" 
                    :key="hardIndex" 
                      class="u-flex u-row-left u-col-center u-text-center u-border">
                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                      <span>{{hardInfo.hardwareDeviceName}}</span>
                    </div>
                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                      <span>{{hardInfo.hardwareDeviceCount}}</span>
                    </div>
                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                      <span>{{hardInfo.hardwareDevicePrice}}</span>
                    </div>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.developCostInfo.hardwareTotalCost}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.developCostInfo.zhuiSuSoft}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.developCostInfo.developCost_zhuisu}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.developCostInfo.kaiTu_Soft}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.developCostInfo.developCost_kaiTu}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.developCostInfo.developTotalCost}}</span>
                  </div>
                </div>
              </div>

              <div  class="u-text-center">
                <div class="u-flex u-row-left u-col-center  u-text-center">
                  <div v-for="(zhiju,zhijuindex) in dataItem.toolInfo.zhiJuArr" :key="zhijuindex" 
                      class="u-flex u-row-left u-col-center u-text-center u-border">
                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                      <span>{{zhiju.zhiJuName}}</span>
                    </div>
                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                      <span>{{zhiju.zhiJuCount}}</span>
                    </div>
                    <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                      <span>{{zhiju.zhiJuPrice}}</span>
                    </div>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.jianJu.jianJuName}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.jianJu.jianJuCount}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.jianJu.jianJuPrice}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.gongZhuang.gongZhuangName}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.gongZhuang.gongZhuangCount}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.gongZhuang.gongZhuangPrice}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.testLine.testLineName}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.testLine.testLineCount}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.testLine.testLinePrice}}</span>
                  </div>
                  <div class="u-width-150  u-border  u-p-t-5 u-p-b-5">
                    <span>{{dataItem.toolInfo.toolTotalCost}}</span>
                  </div>
                </div> 
              </div>
              <!-- <div  class="u-flex u-row-left u-col-center  u-border  u-text-center">
                <div class=" u-text-center u-width-150  u-border">
                  <span>SOP</span>
                </div>
              </div> -->
            </div>
        </template>
      </el-scrollbar>
    </div>


  </div>
</template>

<script lang="ts" setup>
import { da } from 'element-plus/es/locale';
import { ref } from 'vue'

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

const dataArr = [
  {
    processIndex: '000111',
    processName: '工序1',
    deviceInfo: {
      deviceArr: [
        {
          deviceName: '设备1',
          deviceStatus: '正常',
          deviceCount: 5,
          devicePrice: 1314.52
        },
        {
          deviceName: '设备2',
          deviceStatus: '离线',
          deviceCount: 5,
          devicePrice: 52.13
        },
        {
          deviceName: '设备3',
          deviceStatus: '待维修',
          deviceCount: 5,
          devicePrice: 14.52
        },
      ],
      deviceTotalCost: 0.00
    },
    developCostInfo: {
      hardwareInfo: [
        {
          hardwareDeviceName: '硬件设备1',
          hardwareDeviceCount: 2,
          hardwareDevicePrice: 88.88
        },
        {
          hardwareDeviceName: '硬件设备2',
          hardwareDeviceCount: 3,
          hardwareDevicePrice: 99.99
        }
      ],
      hardwareTotalCost: 8899.89,
      zhuiSuSoft: '追溯软件',
      developCost_zhuisu: 22222.22,
      kaiTu_Soft: '开图软件',
      developCost_kaiTu: 4444.44,
      developTotalCost: 9999.99
    },
    toolInfo: {
      zhiJuArr: [
        {
          zhiJuName: '治具1',
          zhiJuCount: 2,
          zhiJuPrice: 66.88
        },
        {
          zhiJuName: '治具2',
          zhiJuCount: 2,
          zhiJuPrice: 88.88
        }
      ],
      jianJu: {
        jianJuName: '检具1',
        jianJuCount: 2,
        jianJuPrice: 66.88
      },
      gongZhuang: {
        gongZhuangName: '治具1',
        gongZhuangCount: 2,
        gongZhuangPrice: 66.88
      },
      testLine: {
        testLineName: '测试线名称',
        testLineCount: 3,
        testLinePrice: 22.22
      },
      toolTotalCost: 888.88
    },
    sopInfo: [
      {
        manWorkHour: 8,
        manNumber: 1,
        machineWorkHour: 4,
      }
    ]
  }
]
</script>

<style scoped>
.scrollbar-flex-content {
  display: flex;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
</style>