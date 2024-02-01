<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <el-card mb-10px>
      <h4 mb-10px>已保存的方案版本</h4>
      <div mb-10px>
        <el-table :data="versionList" border max-height="300px">
          <el-table-column type="selection" width="55" />
          <el-table-column label="版本号" width="200" align="center" prop="version" />
          <el-table-column label="提交次数" width="200" align="center" prop="ntime" />
          <el-table-column label="组合方案" width="300" align="center">
            <template #default="scope">
              <div v-for="item in scope.row.solutionList" :key="item.product">
                {{ item.product }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="selectVersion(scope.row)" type="primary">加载该版本</el-button>
              <el-button @click="deleteVersion(scope.row)" type="danger" :disabled="!scope.row.isFirst">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="20">
           <p>请选择报价方案组合：</p>
           <el-button type="primary" @click="addNewPlan" ml-auto float-right>新增方案</el-button>
      </el-row>
      <el-table :data="planList" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="报价模组" width="200" align="center">
          <template #default="scope">
            <el-select clearable v-model="scope.row.value">
              <el-option
                v-for="item in productList"
                :label="item.product"
                :value="item.id"
                :key="item.id"
                :disabled="hasSelectPlans.includes(item.id)"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否报价" width="200" align="center">
          <template #default="scope">
            <el-select clearable v-model="scope.row.isOffer">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="deletePlan(scope.$index)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="20">
          <h4 mt-20px>方案组合</h4>
          <el-button type="primary" mt-20px ml-auto v-loading.fullscreen.lock="fullscreenLoading" @click="comfirmPlans"
      >确定</el-button
      >
      </el-row>
      <div v-for="(plan, index) in planListArr" :key="index" mt="20px">
        <el-descriptions :title="`方案${index + 1}`" :column="1" border>
          <template #extra>
            <el-button type="primary" @click="planListArrChange(index)">选择该方案</el-button>
            <el-button type="danger" @click="deletePlanListArr(index)">删除方案</el-button>
          </template>
          <el-descriptions-item label="产品" v-for="item in plan" :key="item.id">
            {{ item.product }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <el-button type="primary" @click="downLoad">成本信息表下载</el-button>
    <el-button-group style="float: right">
      <el-button type="primary" @click="postOffer(true)" v-havedone>报价</el-button>
      <el-button type="primary" @click="dialogVisibleR=true" v-havedone>不报价</el-button>
      <el-button type="primary" @click="submitProcess(true)" v-havedone>提交流程</el-button>
    </el-button-group>
    <div>
      <!-- nre -->
      <h3>NRE</h3>
      <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
        <p>{{ nre.solutionName }}</p>
        <p v-if="nre.solutionName!='汇总'">线体数量：{{ nre.numberLine }} 共线分摊率：{{ nre.collinearAllocationRate }}%</p>
        <el-table
          :data="nre.models"
          style="width: 100%"
          border
          max-height="400px"
          :summary-method="getSummaries"
          show-summary
          table-layout="auto"
        >
          <el-table-column label="序号" type="index"  align="center" />
          <el-table-column prop="formName" label="费用名称"  align="center" />
          <el-table-column
            prop="pricingMoney"
            label="核价金额"
            :formatter="formatThousandths"
            align="center"
          />
          <el-table-column label="报价系数" align="center">
            <template #default="scope">
              <el-input-number
                @mousewheel.native.prevent
                v-model="scope.row.offerCoefficient"
                controls-position="right"
                @change="offerCoefficientChange(scope.row, index, scope.$index)"
                :precision="2"
                :min="0"
                :disabled="index === data.allRes.nres.length - 1"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="offerMoney"
            label="报价金额"
            :formatter="formatThousandths"
           align="center"
          />
          <el-table-column label="备注" align="center">
            <template #default="scope">
              <el-input
                v-model="scope.row.remark"
                type="textarea"
                autosize
                :disabled="index === data.allRes.nres.length - 1"
              />
            </template>
          </el-table-column>
        </el-table>
        <p>专用设备</p>
        <el-table :data="nre.devices" border max-height="250px">
          <el-table-column prop="deviceName" label="设备名称" width="200" align="center" />
          <el-table-column
            prop="devicePrice"
            label="设备单价"
            align="center"
            :formatter="formatThousandths"
          />
          <el-table-column prop="number" label="设备数量" width="200" align="center" :formatter="formatThousandths"/>
          <el-table-column
            prop="equipmentMoney"
            label="设备金额"
            align="center"
            :formatter="formatThousandths"
          />
        </el-table>
      </el-card>
      <!-- 样品 -->
      <h3>样品报价</h3>
      <el-card v-for="(sample, index) in data.allRes.sampleOffer" :key="sample.solutionName">
        <p>{{ sample.solutionName }}</p>
        <el-table :data="sample.onlySampleModels" border max-height="500px">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column prop="name" label="样品阶段" width="200" align="center" />
          <el-table-column prop="pcs" label="需求量（pcs）" width="200" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.pcs" type="number" @change="pcsChange(scope.row, index, scope.$index)" :input-style="{'text-align': 'center'}"/>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="成本" :formatter="formatThousandths" width="200" align="center" />
          <el-table-column prop="unitPrice" label="单价" width="200" align="center">
            <template #default="scope">
              <el-input-number
                @mousewheel.native.prevent
                v-model="scope.row.unitPrice"
                controls-position="right"
                @change="unitPriceChange(scope.row, index, scope.$index)"
                :precision="2"
              />
            </template>
          </el-table-column>
          <el-table-column prop="grossMargin" label="毛利率" width="200" align="center">
            <template #default="scope"> {{ scope.row.grossMargin }}% </template>
          </el-table-column>
          <el-table-column prop="salesRevenue" label="销售收入" align="center">
            <template #default="scope">
              {{ formatThousandths(null, null, scope.row.unitPrice * scope.row.pcs) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- sop -->
      <h3>单价表（sop年）</h3>
      <el-table :data="data.allRes.sops" style="width: 100%" border max-height="500px">
        <el-table-column prop="gradientValue" label="梯度" width="150" align="center" />
        <el-table-column prop="product" label="产品" width="150" align="center" />
        <el-table-column
          :label="item.gross + '%'"
          v-for="(item, index) in data.allRes.sops[0]?.grossValues"
          :key="item.gross"
          :formatter="toFixedTwo"
          width="150"
          align="center"
        >
          <template #default="scope">
            <div>{{ scope.row.grossValues[index].grossvalue.toFixed(2) }}</div>
            <!-- <el-input-number @mousewheel.native.prevent v-model="scope.row.grossValues[index].grossvalue" controls-position="right" :precision="2" /> -->
          </template>
        </el-table-column>
      </el-table>
      <p>项目全生命周期汇总分析表-实际数量</p>
      <el-table :data="data.allRes.fullLifeCycle" style="width: 100%" border max-height="500px">
        <el-table-column prop="projectName" label="项目名称" width="150" align="center" />
        <el-table-column
          v-for="(item, index) in data.allRes?.fullLifeCycle[0]?.grossMarginList"
          :label="item.grossMargin + '%'"
          :key="index"
          width="150"
          align="center"
        >
          <template #default="scope">
            <div>
              {{ formatThousandths(null, scope.row, scope.row.grossMarginList[index].grossMarginNumber) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <p>报价毛利率测算-阶梯数量</p>
      <el-card class="card">
        <el-table :data="data.allRes.gradientQuotedGrossMargins" border>
          <el-table-column label="梯度" prop="gradient" align="center" />
          <el-table-column label="产品" prop="product" align="center" />
          <el-table-column label="目标价（内部）" width="300" align="center" >
            <el-table-column label="单价" prop="interiorPrice" :formatter="formatThousandths" align="center" />
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.interiorGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="目标价（客户）" align="center" >
            <el-table-column label="单价" prop="clientPrice" :formatter="formatThousandths" align="center" />
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.clientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.clientClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="剔除分摊费用毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.clientNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="本次报价" align="center" >
            <el-table-column label="单价" width="150" align="center" >
              <template #default="scope">
                <el-input v-model="scope.row.thisQuotationPrice">
                  <template #append>
                    <el-button @click="calculateFullGrossMarginNew(scope.row, scope.$index)">计算</el-button>
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.thisQuotationGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.thisQuotationClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="剔除分摊费用毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.thisQuotationNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="上轮报价" align="center" >
            <el-table-column label="单价"  prop="lastRoundPrice" :formatter="formatThousandths" align="center" >
              <!-- <template #default="scope">
              <el-input v-model="scope.row.lastRoundPrice" />
            </template> -->
            </el-table-column>
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.lastRoundGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.lastRoundClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="剔除分摊费用毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.lastRoundNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column width="140" label="操作" align="center" >
            <template #default="{ row }">
              <el-row justify="end" m="2">
                <el-button @click="openDialog(row, 1)" type="primary">年份维度对比</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="card" v-for="(item, index) in data.allRes.quotedGrossMargins" :key="index">
        <p>{{ item.project }}</p>
        <el-table :data="item.quotedGrossMarginActualList" border>
          <el-table-column label="产品" prop="product" align="center" />
          <el-table-column
            label="单车产品数量"
            prop="carNum"
            v-if="index !== data.allRes?.quotedGrossMargins?.length - 1"
            align="center"
          />
          <el-table-column label="目标价（内部）" align="center" >
            <el-table-column label="单价" prop="interiorPrice" :formatter="formatThousandths" width="80" align="center"/>
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.interiorGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.interiorClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="毛利率剔除NRE分摊费用毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.interiorNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="目标价（客户）" align="center" >
            <el-table-column label="单价"   prop="clientPrice" :formatter="formatThousandths" width="80"/>
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.clientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.clientClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="毛利率剔除NRE分摊费用毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.clientNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="本次报价" align="center" >
            <el-table-column label="单价" width="150" align="center">
              <template #default="scope">
                <el-input v-model="scope.row.thisQuotationPrice">
                  <template #append>
                    <el-button
                      @click="
                        calculateFullGrossMarginNewSj(scope.row, scope.$index, index, item.quotedGrossMarginActualList)
                      "
                      >计算</el-button
                    >
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.thisQuotationGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.thisQuotationClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="毛利率剔除NRE分摊费用毛利率" align="center" >
              <template #default="{ row }">
                {{ `${row.thisQuotationNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column width="140" label="操作" align="center" >
            <template #default="{ row }">
              <el-row justify="end" m="2">
                <el-button @click="openDialog(row, 2, item.quotedGrossMarginActualList)" type="primary"
                  >年份维度对比</el-button
                >
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- projectBoard -->
      <el-card class="card">
        <div v-for="item in data.allRes.projectBoard" :key="item.title">
          <p>{{ item.title }}</p>
          <el-table :data="item.projectBoardModels" border>
            <el-table-column label="产品" prop="projectName" align="center"/>
            <el-table-column
              label="目标价（内部）"
              width="300"
              prop="interiorTarget"
              :formatter="formatThousandths"
              align="center"
            >
              <template #default="{ row }">
                <div v-if="row.projectName !== '毛利率'">
                  {{ formatThousandths(null, null, row.interiorTarget) }}
                </div>
                <div v-else>{{ row.interiorTarget?.toFixed(2) }}%</div>
                <!-- <div v-else>{{ row.interiorTarget}}%</div> -->
              </template>
            </el-table-column>
            <el-table-column label="目标价（客户）" prop="clientTarget" :formatter="formatThousandths" align="center">
              <template #default="{ row }">
                <div v-if="row.projectName !== '毛利率'">
                  {{ formatThousandths(null, null, row.clientTarget) }}
                </div>
                <div v-else>{{ row.clientTarget?.toFixed(2) }}%</div>
                <!-- <div v-else>{{ row.clientTarget}}%</div> -->
              </template>
            </el-table-column>
            <el-table-column label="本次报价" prop="offer" :formatter="formatThousandths" align="center">
              <template #default="{ row }">
                <div v-if="row.projectName !== '毛利率'">
                  {{ formatThousandths(null, null, row.offer) }}
                </div>
                <div v-else>{{ row.offer?.toFixed(2) }}%</div>
                <!-- <div v-else>{{ row.offer}}%</div> -->
              </template>
            </el-table-column>
            <el-table-column label="上轮报价" prop="oldOffer" :formatter="formatThousandths" align="center">
              <template #default="{ row }">
                <div v-if="row.projectName !== '毛利率'">
                  {{ formatThousandths(null, null, row.oldOffer) }}
                </div>
                <div v-else>{{ row.oldOffer?.toFixed(2) }}%</div>
                <!-- <div v-else>{{ row.oldOffer }}%</div> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-for="(value, key) in gradientTableMap" :key="key">
          <div :id="'unitpriceChart' + key" class="h-400px" />
          <div :id="'revenueGrossMarginChart' + key" class="h-400px" />
        </div>
        <div>
          <div :id="'unitpriceChart' + 'shiji'" class="h-400px" />
          <div :id="'revenueGrossMarginChart' + 'shiji'" class="h-400px" />
        </div>
      </el-card>
      <el-button @click="save" type="primary" float-right my-20px>保存</el-button>
      <el-button @click="toMarketingApproval" type="primary" float-right my-20px mr-20px>生成审批表</el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="年份维度对比">
      <h4>数量K</h4>
      <el-table :data="yearDimension.numk" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="数量K" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>单价</h4>
      <el-table :data="yearDimension.prices" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="单价" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售成本</h4>
      <el-table :data="yearDimension.sellingCost" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="销售成本" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>单位平均成本</h4>
      <el-table :data="yearDimension.averageCost" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="单位平均成本" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售收入</h4>
      <el-table :data="yearDimension.salesRevenue" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="销售收入" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售毛利（千元）</h4>
      <el-table :data="yearDimension.salesMargin" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="销售毛利（千元）" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>佣金</h4>
      <el-table :data="yearDimension.commission" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="佣金" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>毛利率</h4>
      <el-table :data="yearDimension.grossMargin" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" align="center"/>
        <el-table-column label="年份" prop="key" align="center"/>
        <el-table-column label="毛利率" prop="value" align="center">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)}% ` }}</div>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleR" title="不报价填写" width="30%" :before-close="handleClose">
      <el-form>
        <el-form-item label="备注">
          <el-input type="textarea" rows="4" v-model="refuseText" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleR = false">取消</el-button>
          <el-button type="primary" @click="refuseConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import * as echarts from "echarts"
import { ElMessage, ElMessageBox } from "element-plus"
// import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { useProductStore } from "@/store/modules/productList"
import {
  PostStatementAnalysisBoardSecond,
  GetSolution,
  PostDownloadMessageSecond,
  PostYearDimensionalityComparisonForGradient,
  PostGrossMarginForGradient,
  PostGrossMarginForactual,
  PostYearDimensionalityComparisonForactual,
  PostYearDimensionalityComparisonForactualQt,
  PostGrossMarginForactualQt,
  PostIsOfferSaveSecond,
  PostIsOfferSecond,
  SubmitNode,
  getStatementAnalysisBoardSecond,
  PostIsOfferSecondOnlySave,
  GeCatalogue,
  PostIsOfferSecondDelete
} from "./service"
import { getProductByAuditFlowId } from "@/views/productList/service"
/**
 * 路由对象
 */
const route = useRoute()
/**
 * 路由实例
 */
const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
let { auditFlowId, productId, nodeInstanceId, right } = getQuery()
interface planListItem {
  value: string
  isOffer: boolean
}

const planList: Array<planListItem> = reactive([])
const productStore = useProductStore()
const version = ref(1)
const productList = ref<any[]>([])
const fullscreenLoading = ref(false)
const dialogVisible = ref(false)
let planListArr = reactive<any[]>([])
let versionList = reactive<any[]>([])
let selectPlan = ref<any[]>([])
const planListArrVal = ref(null)
let versionChosen: any = null // 选中的以前版本

const yearDimension = ref({
  numk: [],
  prices: [],
  sellingCost: [],
  averageCost: [],
  salesRevenue: [],
  salesMargin: [],
  commission: [],
  grossMargin: []
})
const data = reactive({
  //仅含样品
  sampleOnlyRes: {
    nre: null,
    unitPrice: null,
    sampleOffer: [
      {
        onlySampleModels: [
          {
            sampleName: "SampleName_C",
            pcs: 200,
            cost: 0,
            unitPrice: 0,
            grossMargin: 0,
            salesRevenue: 0
          }
        ],
        solutionName: "样品报价-前是有一"
      }
    ],
    isSuccess: true,
    message: "调用成功"
  },
  allRes: {
    isOffer: false,
    noOfferReason: "string",
    auditFlowId: 0,
    grossMarginList: null,
    unitPrice: null,
    nres: [
      // {
      //   solutionName: "NRE AR0820",
      //   solutionId: 0,
      //   auditFlowId: 0,
      //   models: [],
      //   devices: [],
      //   numberLine: 0,
      //   collinearAllocationRate: 0
      // }
    ],
    sampleOffer: [
      // {
      //   solutionName: "AR0820",
      //   auditFlowId: 0,
      //   solutionId: 0,
      //   onlySampleModels: []
      // }
    ],
    sops: [
      // {
      //   gradientValue: "25K/Y",
      //   product: "AR0820",
      //   grossValues: [
      //     {
      //       gross: "5",
      //       grossvalue: 1961.647296461244
      //     }
      //   ]
      // }
    ],
    quotedGrossMargins: [
      // {
      //   quotedGrossMarginActualList: [
      //     {
      //       carModel: "Y1",
      //       solutionId: 0,
      //       product: "延锋科技前装车内1M",
      //       carNum: 2,
      //       id: 0,
      //       version: 0,
      //       auditFlowId: 337,
      //       interiorPrice: 0.0,
      //       interiorGrossMargin: 0.0,
      //       interiorClientGrossMargin: 0.0,
      //       interiorNreGrossMargin: 0.0,
      //       clientPrice: 0.0,
      //       clientGrossMargin: 0.0,
      //       clientClientGrossMargin: 0.0,
      //       clientNreGrossMargin: 0.0,
      //       thisQuotationPrice: 0.0,
      //       thisQuotationGrossMargin: 0.0,
      //       thisQuotationClientGrossMargin: 0.0,
      //       thisQuotationNreGrossMargin: 0.0,
      //       lastRoundPrice: 0.0,
      //       lastRoundGrossMargin: 0.0,
      //       lastRoundClientGrossMargin: 0.0,
      //       lastRoundNreGrossMargin: 0.0
      //     }
      //   ],
      //   project: "报价毛利率测算-实际数量-Y1"
      // }
    ],
    gradientQuotedGrossMargins: [
      // {
      //   gradient: "2664.9k/y",
      //   gradientId: 599,
      //   solutionId: 664,
      //   product: "延锋科技前装车内1M",
      //   id: 0,
      //   version: 0,
      //   auditFlowId: 337,
      //   interiorPrice: 783.3082529596942, //目标价（内部）单价
      //   interiorGrossMargin: 20, // 目标价（内部）毛利率
      //   interiorClientGrossMargin: 86.31, // 目标价（内部）增加客供料毛利率
      //   interiorNreGrossMargin: 86.31, // 目标价（内部）剔除分摊费用毛利率
      //   clientPrice: 1000, // 目标价（客户）单价
      //   clientGrossMargin: 0, // 目标价（客户）毛利率
      //   clientClientGrossMargin: 0, // 目标价（客户）增加客供料毛利率
      //   clientNreGrossMargin: 0, // 目标价（客户）剔除分摊费用毛利率
      //   thisQuotationPrice: 1222, /// 本次报价单价
      //   thisQuotationGrossMargin: 0, // 本次报价毛利率
      //   thisQuotationClientGrossMargin: 0, // 本次报价增加客供料毛利率
      //   thisQuotationNreGrossMargin: 0, // 本次报价剔除NRE分摊费用毛利率
      //   lastRoundPrice: 0, // 上轮报价单价
      //   lastRoundGrossMargin: 0, // 上轮报价毛利率
      //   lastRoundClientGrossMargin: 0, // 上轮报价增加客供料毛利率
      //   lastRoundNreGrossMargin: 0 // 上轮报价剔除NRE分摊费用毛利率
      // }
    ],
    fullLifeCycle: [
      // {
      //   projectName: "数量",
      //   grossMarginList: [
      //     {
      //       grossMargin: 5,
      //       grossMarginNumber: 1.05
      //     }
      //   ]
      // }
    ],
    projectBoard: [
      // {
      //   title: "2664.9KV",
      //   projectBoardModels: [
      //     {
      //       version: 0,
      //       auditFlowId: 0,
      //       id: 0,
      //       projectName: "数量",
      //       interiorTarget: 21319.2,
      //       clientTarget: 21319.2,
      //       offer: 0.0,
      //       oldOffer: null
      //     }
      //   ]
      // },
    ]
  } as any
})
const planListArrChange = async (val) => {
  fullscreenLoading.value = true
  try {
    versionChosen = null // 清空
    selectPlan.value = planListArr[val]
    let res = await PostStatementAnalysisBoardSecond({
      auditFlowId,
      solutionTables: planListArr[val]
    })
    fullscreenLoading.value = false
    data.allRes = res.result
  } catch (error) {
    fullscreenLoading.value = false
  }
}

const dialogVisibleR = ref(false)
const refuseText = ref("")
const handleClose = () => {
  refuseText.value = ""
}
const refuseConfirm = () => {
  if (!refuseText.value) {
    ElMessage({
      type: "warning",
      message: "请填写备注"
    })
    return false
  } else {
    postOffer(false)
  }
}
/**
 * 加载之前的版本
 */
const selectVersion = async (row: any) => {
  fullscreenLoading.value = true
  try {
    versionChosen = row

    // let res = await PostStatementAnalysisBoardSecond({
    //   ...versionChosen,
    //   solutionTables: versionChosen.solutionList
    // })
    // fullscreenLoading.value = false
    // data.allRes = res.result

    /**
     * 根据版本号查询该版本数据
     */
    debugger
    let res = await getStatementAnalysisBoardSecond({
      auditFlowId,
      version: row.version,
      ntype: 0,
      ntime: row.ntime
    })
    data.allRes = res.result
    /**
     * 触发nre汇总计算
     */
    getNreChange()
    fullscreenLoading.value = false
  } catch (error) {
    fullscreenLoading.value = false
  }
}
const deleteVersion = async (row: any) => {
  ElMessageBox.confirm("是否确认删除!")
    .then(async function () {
      await PostIsOfferSecondDelete({ auditFlowId, version: row.version, isFirst: row.isFirst })
    })
    .then(() => {
      getVersionList()
      ElMessage({
        type: "success",
        message: "删除成功"
      })
    })
    .catch(() => {})
}
// 过滤相同梯度的数据
interface stringKeyObj {
  [propName: string]: any
}
const gradientTableMap = computed(() => {
  let gradientTableMap: stringKeyObj = {}
  data.allRes.gradientQuotedGrossMargins.forEach((item) => {
    if (!gradientTableMap[item.gradientId]) {
      gradientTableMap[item.gradientId] = []
    }
    gradientTableMap[item.gradientId].push(item)
  })

  // setChartData(gradientTableMap)
  return gradientTableMap
})
let gradientTableMapResult = ref([])
const hasSelectPlans = computed(() => {
  let ids = planList.map((item) => item.value)
  return ids
})

const deletePlan = (index: number) => {
  planList.splice(index, 1)
}
const deletePlanListArr = (index: number) => {
  planListArr.splice(index, 1)
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    if (_row && _row.projectName === "毛利率") {
      return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,") + "%"
    }
    return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}
// 报价分析看板 单价计算
const openDialog = async (row: any, type: number, list: any) => {
  dialogVisible.value = true
  if (row.product === "齐套") {
    try {
      const { result } = await PostYearDimensionalityComparisonForactualQt({
        AuditFlowId: auditFlowId,
        CarModel: row.carModel,
        SoltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
          return {
            Gradientid: item.gradientId,
            UnitPrice: item.thisQuotationPrice,
            SolutionId: item.solutionId
          }
        }),
        SolutionIdsAndcarNums: list
          .map((item: any) => {
            return {
              carNum: item.carNum,
              SolutionId: item.solutionId
            }
          })
          .slice(0, list.length - 1)
      })
      console.log(result)
      yearDimension.value = result
    } catch (error) {
      console.log(error)
    }
    return
  }
  if (type === 1) {
    try {
      const { result } = await PostYearDimensionalityComparisonForGradient({
        auditFlowId: auditFlowId,
        gradientId: row.gradientId,
        unitPrice: row.thisQuotationPrice,
        solutionId: row.solutionId
      })
      console.log(result)
      yearDimension.value = result
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const { result } = await PostYearDimensionalityComparisonForactual({
        auditFlowId: auditFlowId,
        gradientId: row.gradientId,
        unitPrice: row.thisQuotationPrice,
        solutionId: row.solutionId,
        carModel: row.carModel,
        soltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
          return {
            gradientId: item.gradientId,
            unitPrice: item.thisQuotationPrice,
            solutionId: item.solutionId
          }
        })
      })
      console.log(result)
      yearDimension.value = result
    } catch (error) {
      console.log(error)
    }
  }
}
const getSummaries = (param: { columns: any; data: any }) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: { property: string | number }, index: number) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    if (index === 2 || index === 4) {
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value))) {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
        sums[index] = (Number(sums[index]).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      } else {
        sums[index] = "N/A"
      }
    }
  })
  return sums
}
const addNewPlan = () => {
  planList.push({
    value: "",
    isOffer: true
  })
}
// 设置图表
const setChartData = () => {
  /**梯度图表 */
  let ProjectUnitPrice: stringKeyObj = {}
  let RevenueGrossMargin: stringKeyObj = {}
  let keys = Object.keys(gradientTableMap.value)
  keys.forEach((key) => {
    let gradientItem = data.allRes.projectBoard.filter((item: any) => item.gradientId === Number(key))
    ProjectUnitPrice[key] = {
      title: {
        text: `${gradientItem[0].title}项目单价对比`
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          // Use axis to trigger tooltip
          type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: ["目标价（内部）", "目标价（客户）", "本次报价"]
      },
      yAxis: [
        {
          type: "value",
          name: "单价",
          min: 0,
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        {
          type: "value",
          name: "毛利率",
          min: 0,
          axisLabel: {
            formatter: "{value}%"
          }
        }
      ],
      series: []
    }

    ProjectUnitPrice[key].xAxis.data = ["目标价（内部）", "目标价（客户）", "本次报价"]
    ProjectUnitPrice[key].series = gradientTableMap.value[key].map((item: any) => {
      return {
        name: item.product,
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: [item.interiorPrice, item.clientPrice, item.thisQuotationPrice]
      }
    })
    RevenueGrossMargin[key] = {
      title: {
        text: `${gradientItem[0].title}收入和毛利率对比`
      },
      xAxis: {
        type: "category",
        data: ["目标价(内部)", "目标价(客户)", "本次报价"]
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          // Use axis to trigger tooltip
          type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {},
      yAxis: [
        {
          type: "value",
          name: "收入",
          min: 0,
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        {
          type: "value",
          name: "毛利率",
          min: 0,
          axisLabel: {
            formatter: "{value}%"
          }
        }
      ],
      series: []
    }

    data.allRes.projectBoard.forEach((item) => {
      if (item.gradientId === Number(key)) {
        let ritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "毛利率")
        let xssritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "销售收入")

        let ritem = ritems[0]
        let xssritem = xssritems[0]
        ProjectUnitPrice[key].series.push({
          yAxisIndex: 1,
          name: "整体毛利率",
          type: "line",
          tooltip: {
            formatter: "{a}{b}{c}%"
          },
          // 临时造的数据没有看到该字段
          data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
        })
        RevenueGrossMargin[key].series.push({
          yAxisIndex: 1,
          name: "整体毛利率",
          type: "line",
          tooltip: {
            formatter: "{a}{b}{c}%"
          },
          // 临时造的数据没有看到该字段
          data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
        })
        RevenueGrossMargin[key].series.push({
          name: "销售收入",
          type: "bar",
          stack: "total",
          label: {
            show: true
          },
          emphasis: {
            focus: "series"
          },
          data: [xssritem.interiorTarget, xssritem.clientTarget, xssritem.offer]
        })
      }
    })
    setTimeout(() => {
      initCharts("unitpriceChart" + key, ProjectUnitPrice[key])
      initCharts("revenueGrossMarginChart" + key, RevenueGrossMargin[key])
    }, 500)
  })
  /** 实际图表 */
  let length = data.allRes.quotedGrossMargins.length
  let sjTable = data.allRes.quotedGrossMargins[length - 1].quotedGrossMarginActualList
  ProjectUnitPrice["shiji"] = {
    title: {
      text: "实际数量项目单价对比"
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: ["目标价（内部）", "目标价（客户）", "本次报价"]
    },
    yAxis: [
      {
        type: "value",
        name: "单价",
        min: 0,
        axisLabel: {
          formatter: "{value} 元"
        }
      },
      {
        type: "value",
        name: "毛利率",
        min: 0,
        axisLabel: {
          formatter: "{value}%"
        }
      }
    ],
    series: []
  }
  ProjectUnitPrice["shiji"].xAxis.data = ["目标价（内部）", "目标价（客户）", "本次报价"]
  ProjectUnitPrice["shiji"].series = sjTable.map((item: any) => {
    return {
      name: item.product,
      type: "bar",
      stack: "total",
      label: {
        show: true
      },
      emphasis: {
        focus: "series"
      },
      data: [item.interiorPrice, item.clientPrice, item.thisQuotationPrice]
    }
  })
  RevenueGrossMargin["shiji"] = {
    title: {
      text: "实际数量收入和毛利率对比"
    },
    xAxis: {
      type: "category",
      data: ["目标价(内部)", "目标价(客户)", "本次报价"]
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {},
    yAxis: [
      {
        type: "value",
        name: "收入",
        min: 0,
        axisLabel: {
          formatter: "{value} 元"
        }
      },
      {
        type: "value",
        name: "毛利率",
        min: 0,
        axisLabel: {
          formatter: "{value}%"
        }
      }
    ],
    series: []
  }
  data.allRes.projectBoard.forEach((item) => {
    if (!item.gradientId) {
      let ritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "毛利率")
      let xssritems = item.projectBoardModels.filter((fitem) => fitem.projectName === "销售收入")
      let ritem = ritems[0]
      let xssritem = xssritems[0]
      ProjectUnitPrice["shiji"].series.push({
        yAxisIndex: 1,
        name: "整体毛利率",
        type: "line",
        tooltip: {
          formatter: "{a}{b}{c}%"
        },
        // 临时造的数据没有看到该字段
        data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
      })
      RevenueGrossMargin["shiji"].series.push({
        yAxisIndex: 1,
        name: "整体毛利率",
        type: "line",
        tooltip: {
          formatter: "{a}{b}{c}%"
        },
        // 临时造的数据没有看到该字段
        data: [ritem.interiorTarget, ritem.clientTarget, ritem.offer]
      })
      RevenueGrossMargin["shiji"].series.push({
        name: "销售收入",
        type: "bar",
        stack: "total",
        label: {
          show: true
        },
        emphasis: {
          focus: "series"
        },
        data: [xssritem.interiorTarget, xssritem.clientTarget, xssritem.offer]
      })
    }
  })
  setTimeout(() => {
    initCharts("unitpriceChart" + "shiji", ProjectUnitPrice["shiji"])
    initCharts("revenueGrossMarginChart" + "shiji", RevenueGrossMargin["shiji"])
  }, 500)
}
const initCharts = (id: string, chartOption: any) => {
  // 基于准备好的dom，初始化echarts实例
  let chartEl: HTMLElement | null = document.getElementById(id)
  if (chartEl) {
    var chart = echarts.init(chartEl)
    // 绘制图表
    chart.setOption(chartOption)
    return chart
  }
}

//成本信息表
const downLoad = async () => {
  console.log("downLoad")
  let planMap = {}
  let solutionTables: any[] = []
  productList.value.forEach((item: any) => {
    planMap[item.id as keyof Object] = item
  })
  planList.forEach((item) => {
    if (planMap[item.value as keyof Object] && item.isOffer) {
      solutionTables.push(planMap[item.value as keyof Object])
    }
  })
  /**
   * 如果是版本加载的数据，那么下载只需要版本号和ntime,solutionTables字段传的是未保存的当前数据
   */
  if (versionChosen && solutionTables.length === 0) {
    try {
      let res: any = await PostDownloadMessageSecond({
        auditFlowId,
        version: versionChosen.version,
        ntime: versionChosen.ntime,
        solutionTables: []
      })
      const blob = res
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        let url = URL.createObjectURL(new Blob([blob]))
        let a = document.createElement("a")
        document.body.appendChild(a) //此处增加了将创建的添加到body当中
        a.href = url
        a.download = "成本信息表.xlsx"
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      let res: any = await PostDownloadMessageSecond({ auditFlowId, solutionTables })
      const blob = res
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        let url = URL.createObjectURL(new Blob([blob]))
        let a = document.createElement("a")
        document.body.appendChild(a) //此处增加了将创建的添加到body当中
        a.href = url
        a.download = "成本信息表.xlsx"
        a.target = "_blank"
        a.click()
        a.remove() //将a标签移除
      }
    } catch (error) {
      console.log(error)
    }
  }
}
//报价值change
const offerCoefficientChange = (row: any, index: number, rowIndex: number) => {
  let length = data.allRes.nres.length
  if (index === length - 1) {
    return false
  }
  row.offerMoney = row.offerCoefficient * row.pricingMoney
  /**
   * hack数据，scope的值无法取得
   */
  data.allRes.nres[index].models[rowIndex].offerMoney = row.offerCoefficient * row.pricingMoney
  let sbjf: any = []
  let mjf: any = []
  let scsbf: any = []
  let gzf: any = []
  let zjf: any = []
  let jjf: any = []
  let syf: any = []
  let csrjf: any = []
  let clf: any = []
  let qtf: any = []
  for (let i = 0; i < data.allRes.nres.length - 1; i++) {
    data.allRes.nres[i].models.forEach((item: any) => {
      if (item.formName === "手板件费") {
        sbjf.push(item.offerMoney)
      } else if (item.formName === "模具费") {
        mjf.push(item.offerMoney)
      } else if (item.formName === "生产设备费") {
        scsbf.push(item.offerMoney)
      } else if (item.formName === "工装费") {
        gzf.push(item.offerMoney)
      } else if (item.formName === "治具费") {
        zjf.push(item.offerMoney)
      } else if (item.formName === "检具费") {
        jjf.push(item.offerMoney)
      } else if (item.formName === "实验费") {
        syf.push(item.offerMoney)
      } else if (item.formName === "测试软件费") {
        csrjf.push(item.offerMoney)
      } else if (item.formName === "差旅费") {
        clf.push(item.offerMoney)
      } else if (item.formName === "其他费用") {
        qtf.push(item.offerMoney)
      }
    })
  }
  let rsbjf = sbjf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rmjf = mjf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rscsbf = scsbf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rgzf = gzf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rzjf = zjf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rjjf = jjf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rsyf = syf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rcsrjf = csrjf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rclf = clf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  let rqtf = qtf.reduce((pre: any, cur: any) => {
    if (!pre) {
      pre = 0
    }
    if (!cur) {
      cur = 0
    }
    return pre + cur
  })
  data.allRes.nres[length - 1].models.forEach((item) => {
    item.offerMoney = 0
    if (item.formName === "手板件费") {
      item.offerMoney = rsbjf
    } else if (item.formName === "模具费") {
      item.offerMoney = rmjf
    } else if (item.formName === "生产设备费") {
      item.offerMoney = rscsbf
    } else if (item.formName === "工装费") {
      item.offerMoney = rgzf
    } else if (item.formName === "治具费") {
      item.offerMoney = rzjf
    } else if (item.formName === "检具费") {
      item.offerMoney = rjjf
    } else if (item.formName === "实验费") {
      item.offerMoney = rsyf
    } else if (item.formName === "测试软件费") {
      item.offerMoney = rcsrjf
    } else if (item.formName === "差旅费") {
      item.offerMoney = rclf
    } else if (item.formName === "其他费用") {
      item.offerMoney = rqtf
    }

    if (Number(item.offerMoney) && Number(item.pricingMoney)) {
      item.offerCoefficient = Number(item.offerMoney) / Number(item.pricingMoney)
    } else {
      item.offerCoefficient = 0
    }
  })
}
//主动触发nre汇总计算
const getNreChange = () => {
  let row = data.allRes.nres[0].models[0]
  let index = 0
  offerCoefficientChange(row, index, 0)
}
const unitPriceChange = (row: any, index: number, rowIndex: number) => {
  row.grossMargin = (((row.unitPrice - row.cost) / row.unitPrice) * 100).toFixed(2)
  row.salesRevenue = row.pcs * row.unitPrice
  data.allRes.sampleOffer[index][rowIndex].grossMargin = (((row.unitPrice - row.cost) / row.unitPrice) * 100).toFixed(2)
  data.allRes.sampleOffer[index][rowIndex].salesRevenue = row.pcs * row.unitPrice
}
const pcsChange = (row: any, index: number, rowIndex: number) => {
  row.salesRevenue = row.pcs * row.unitPrice
  data.allRes.sampleOffer[index][rowIndex].salesRevenue = row.pcs * row.unitPrice
}

const calculateFullGrossMarginNew = async (row: any, index: any) => {
  let { result } = await PostGrossMarginForGradient({
    auditFlowId: auditFlowId,
    gradientId: row.gradientId,
    unitPrice: row.thisQuotationPrice,
    solutionId: row.solutionId
  })
  data.allRes.gradientQuotedGrossMargins[index].thisQuotationGrossMargin = result.grossMargin
  data.allRes.gradientQuotedGrossMargins[index].thisQuotationClientGrossMargin = result.clientGrossMargin
  data.allRes.gradientQuotedGrossMargins[index].thisQuotationNreGrossMargin = result.nreGrossMargin
  let grossMargins = data.allRes.gradientQuotedGrossMargins.filter((item) => item.thisQuotationGrossMargin)
  // console.log(grossMargins, grossMargins.length)

  let { sl, xscb, xsml, xssr, yj } = result
  data.allRes.gradientQuotedGrossMargins[index].sl = sl // 数量
  data.allRes.gradientQuotedGrossMargins[index].xscb = xscb // 销售成本
  data.allRes.gradientQuotedGrossMargins[index].xsml = xsml // 销售毛利
  data.allRes.gradientQuotedGrossMargins[index].xssr = xssr // 销售收入
  data.allRes.gradientQuotedGrossMargins[index].yj = yj // 佣金

  console.log(gradientTableMap)
  // 当所有都计算完成时，触发报价毛利率测算-实际数量的联动
  if (grossMargins.length === data.allRes.gradientQuotedGrossMargins.length) {
    data.allRes.quotedGrossMargins.forEach((item, index) => {
      item.quotedGrossMarginActualList.forEach(async (row, rowIndex) => {
        await calculateFullGrossMarginNewSj(row, rowIndex, index, item.quotedGrossMarginActualList)
      })
    })
    gradientTableMapResult.value = []
    data.allRes.projectBoard.forEach((item) => {
      if (gradientTableMap.value[item.gradientId]) {
        let result = gradientTableMap.value[item.gradientId].reduce((pre, cur) => {
          return {
            sl: pre.sl + cur.sl,
            xscb: pre.xscb + cur.xscb,
            yj: pre.yj + cur.yj,
            xssr: pre.xssr + cur.xssr,
            gradientId: item.gradientId
          }
        })
        gradientTableMapResult.value.push(result)
        console.log(result, "result", gradientTableMap.value[item.gradientId])
      }
    })
    data.allRes.projectBoard.forEach((item) => {
      gradientTableMapResult.value.forEach((ritem) => {
        if (item.gradientId === ritem.gradientId) {
          item.projectBoardModels.forEach((row) => {
            if (row.projectName === "数量") {
              row.offer = ritem.sl
            }
            if (row.projectName === "销售成本") {
              row.offer = ritem.xscb
            }
            if (row.projectName === "销售收入") {
              row.offer = ritem.xssr
            }
            if (row.projectName === "单位平均成本") {
              row.offer = ritem.xscb / ritem.sl
            }
            if (row.projectName === "平均单价") {
              row.offer = ritem.xssr / ritem.sl
            }
            if (row.projectName === "销售毛利") {
              row.offer = ritem.xssr - ritem.xscb - ritem.yj
            }
            if (row.projectName === "毛利率") {
              row.offer = ((ritem.xssr - ritem.xscb - ritem.yj) / ritem.xssr) * 100
            }
            if (row.projectName === "佣金") {
              row.offer = ritem.yj
            }
          })
        }
      })
    })
  }
}

const calculateFullGrossMarginNewSj = async (row: any, rowIndex: number, index: number, list: any) => {
  if (row.product === "齐套" || row.product === "") {
    try {
      const { result } = await PostGrossMarginForactualQt({
        AuditFlowId: auditFlowId,
        CarModel: row.carModel,
        SoltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
          return {
            Gradientid: item.gradientId,
            UnitPrice: item.thisQuotationPrice,
            SolutionId: item.solutionId
          }
        }),
        SolutionIdsAndcarNums: list
          .map((item: any) => {
            return {
              carNum: item.carNum,
              SolutionId: item.solutionId
            }
          })
          .slice(0, list.length - 1)
      })
      console.log(result)
      // yearDimension.value = result

      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationGrossMargin =
        result.grossMargin
      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationClientGrossMargin =
        result.clientGrossMargin
      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationNreGrossMargin =
        result.nreGrossMargin
      data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationPrice = result.unitPrice
    } catch (error) {
      console.log(error)
    }
    return
  }
  let { result } = await PostGrossMarginForactual({
    AuditFlowId: auditFlowId,
    gradientId: row.gradientId,
    // unitPrice: row.thisQuotationPrice,
    SolutionId: row.solutionId,
    CarModel: row.carModel,
    SoltionGradPrices: data.allRes.gradientQuotedGrossMargins.map((item) => {
      return {
        Gradientid: item.gradientId,
        UnitPrice: item.thisQuotationPrice,
        SolutionId: item.solutionId
      }
    })
  })
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationGrossMargin =
    result.grossMargin
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationClientGrossMargin =
    result.clientGrossMargin
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationNreGrossMargin =
    result.nreGrossMargin
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].thisQuotationPrice = result.unitPrice

  let { sl, xscb, xsml, xssr, yj } = result
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].sl = sl // 数量
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].xscb = xscb // 销售成本
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].xsml = xsml // 销售毛利
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].xssr = xssr // 销售收入
  data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList[rowIndex].yj = yj // 佣金

  if (
    data.allRes.quotedGrossMargins.length === index + 1 &&
    data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.length === rowIndex + 1
  ) {
    let slLenth = data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.filter((item) => item.sl)
    if (slLenth.length === data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.length) {
      let ritem = data.allRes.quotedGrossMargins[index].quotedGrossMarginActualList.reduce((pre, cur) => {
        return {
          sl: pre.sl + cur.sl,
          xscb: pre.xscb + cur.xscb,
          yj: pre.yj + cur.yj,
          xssr: pre.xssr + cur.xssr
        }
      })

      data.allRes.projectBoard.forEach((item) => {
        if (!item.gradientId) {
          item.projectBoardModels.forEach((row) => {
            if (row.projectName === "数量") {
              row.offer = ritem.sl
            }
            if (row.projectName === "销售成本") {
              row.offer = ritem.xscb
            }
            if (row.projectName === "销售收入") {
              row.offer = ritem.xssr
            }
            if (row.projectName === "单位平均成本") {
              row.offer = ritem.xscb / ritem.sl
            }
            if (row.projectName === "平均单价") {
              row.offer = ritem.xssr / ritem.sl
            }
            if (row.projectName === "销售毛利") {
              row.offer = ritem.xssr - ritem.xscb - ritem.yj
            }
            if (row.projectName === "毛利率") {
              row.offer = ((ritem.xssr - ritem.xscb - ritem.yj) / ritem.xssr) * 100
            }
            if (row.projectName === "佣金") {
              row.offer = ritem.yj
            }
          })
        }
      })
    }
    setChartData()
  }
}
const comfirmPlans = async () => {
  // fullscreenLoading.value = true
  let planMap = {}
  let solutionTables: any[] = []
  productList.value.forEach((item: any) => {
    planMap[item.id as keyof Object] = item
  })
  planList.forEach((item) => {
    if (planMap[item.value as keyof Object] && item.isOffer) {
      solutionTables.push(planMap[item.value as keyof Object])
    }
  })
  planListArr.push(solutionTables)
  // try {
  //   let res = await PostStatementAnalysisBoardSecond({ auditFlowId, solutionTables })
  //   console.log(res)
  //   console.log(planList)
  //   console.log(solutionTables)
  //   data.allRes = res.result
  //   fullscreenLoading.value = false
  // } catch (error) {
  //   fullscreenLoading.value = false
  // }
}
const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}
/**
 * 保存版本号，如当前没有版本从1开始，后面保存版本版本号保持不变
 */
const save = async () => {
  if (auditFlowId) {
    let saveData = {
      ...data.allRes,
      auditFlowId,
      solutions: selectPlan.value,
      version: version.value,
      ntime: 1
    }
    if (versionChosen) {
      saveData.version = versionChosen.version // 版本不变
      saveData.ntime = versionChosen.ntime // 保存提交次数 不变
      saveData.solutions = versionChosen.solutionList
    }
    delete saveData.isSuccess
    delete saveData.message
    delete saveData.mes
    let res = await PostIsOfferSecondOnlySave(saveData)
    if (res.success) {
      ElMessage({
        type: "success",
        message: "操作成功"
      })
      getVersionList()
    }
  }
}
/**
 * 报价和不报价 结合流程接口
 */
const postOffer = async (isOffer: boolean) => {
  if (auditFlowId) {
    let saveData = {
      version: version.value,
      ntime: 1,
      solutions: selectPlan.value,
      ...data.allRes,
      isOffer,
      auditFlowId
    }
    //如果存在选择过的版本对象，那么提交的就是该版本
    if (versionChosen) {
      saveData.version = versionChosen.version // 版本不变
      saveData.ntime = versionChosen.ntime + 1 // 提交次数+1
      saveData.solutions = versionChosen.solutionList
    }
    delete saveData.isSuccess
    delete saveData.message
    delete saveData.mes
    let res = await PostIsOfferSecond(saveData)
    if (res.success) {
      ElMessage.success("操作成功")
    }
    if (!isOffer) {
      // 点不报价的话，调完报价接口以后直接走拒绝归档流程
      submitProcess(isOffer)
    }
  }
}
/**
 * 拆开来是因为有多个报价，都执行完让他再执行提交
 */
const submitProcess = async (isOffer: boolean) => {
  const baseProcessType = [
    //YesOrNo
    {
      label: "不同意",
      val: "YesOrNo_No"
    },
    {
      label: "同意",
      val: "YesOrNo_Yes"
    },
    {
      label: "保存",
      val: "YesOrNo_Save"
    }
  ]
  // // 报价分析看板选择方案
  // const confirmProcessType = [
  //   //Done
  //   {
  //     label: "提交",
  //     val: "Done"
  //   },
  //   {
  //     label: "保存",
  //     val: "Save"
  //   }
  // ]
  let FangAnres: any = await SubmitNode({
    comment: isOffer ? "" : refuseText.value,
    nodeInstanceId,
    financeDictionaryDetailId: isOffer ? baseProcessType[1].val : baseProcessType[0].val
  })
  if (FangAnres.success) {
    ElMessage({
      type: "success",
      message: "操作成功"
    })
  }
}
/**
 * 生成审批表
 */
const toMarketingApproval = async () => {
  if (!versionChosen) {
    await save()
    router.push({
      path: "/quoteAnalysis/marketingApproval",
      query: {
        auditFlowId,
        version: version.value,
        showBtn: "false" // 预览报价表
      }
    })
  } else {
    router.push({
      path: "/quoteAnalysis/marketingApproval",
      query: {
        auditFlowId,
        version: versionChosen.version,
        showBtn: "false" // 预览报价表
      }
    })
  }
}
// const handleSubmit = async ({ comment, opinion, nodeInstanceId }: any) => {
//   let res: any = await SubmitNode({
//     comment,
//     nodeInstanceId,
//     financeDictionaryDetailId: opinion
//   })
//   if (res.success) {
//     ElMessage({
//       type: "success",
//       message: "操作成功"
//     })
//     // postOffer
//   }
// }
/**
 * 获取版本号
 */
const getVersionList = async () => {
  if (auditFlowId) {
    let { result }: any = await GeCatalogue({ auditFlowId })
    versionList.length = 0
    //如果方案组合接口没有那么就从初始1开始计数
    if (result.length === 0) {
      version.value = 1
    } else {
      // 如果不是，那么当前默认从之前的开始
      let versions = result.map((item: any) => Number(item.version))
      let maxVersion = Math.max(...versions)
      version.value = maxVersion + 1
      result.forEach((item: any) => {
        versionList.push(item)
      })
    }
  }
}
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  // await GetSolution(auditFlowId)
  const resp: any = await getProductByAuditFlowId(auditFlowId)
  productList.value = resp.result
  getVersionList()
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.Inputcenter
{
  text-align: center;
}
</style>
