<!-- eslint-disable prettier/prettier -->
<!-- 报价反馈 -->
<template>
  <div>
    <h4 mb-20px>已保存的方案版本</h4>
    <div mb-20px>
      <el-table :data="versionList" border max-height="300px">
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
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-button type="primary" @click="downLoad">成本信息表下载</el-button>
    <el-button-group style="float: right">
      <!-- EvalFeedback_Js, DisplayName="接受报价",},
      EvalFeedback_Bjsbzc, DisplayName="不接受此此价，不用再次报价/重新核价",},
      EvalFeedback_Bjsdjsjj, DisplayName="不接受此价，但接受降价，不用重新核价",},
      EvalFeedback_Bjxysp, DisplayName="报价金额小于审批金额",}, -->

      <el-button type="primary" @click="setSubmitType(`EvalFeedback_Js`)" v-havedone :disabled="!isSubmit"
        >接受报价</el-button
      >
      <el-popover placement="top-start" :width="200" trigger="hover" content="不接受此价，不用再次报价/重新核价">
        <template #reference>
          <el-button type="primary" @click="setSubmitType(`EvalFeedback_Bjsbzc`)" v-havedone :disabled="!isSubmit"
            >不接受报价</el-button
          >
        </template>
      </el-popover>
      <el-popover placement="top-start" :width="200" trigger="hover" content="不接受此价，但接受降价，不用重新核价">
        <template #reference>
          <el-button type="primary" @click="setSubmitType(`EvalFeedback_Bjsdjsjj`)" v-havedone :disabled="!isSubmit|| versionChosen?.ntime>=3">
            不接受此价（接受降价）</el-button
          >
        </template>
      </el-popover>
      <el-popover placement="top-start" :width="200" trigger="hover" content="报价金额小于审批金额">
        <template #reference>
          <el-button type="primary" @click="setSubmitType(`EvalFeedback_Bjxysp`)" v-havedone :disabled="isSubmit">
            报价金额小于审批金额</el-button
          >
        </template>
      </el-popover>
    </el-button-group>
    <el-upload
      v-model:file-list="fileList"
      :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
      :on-success="handleSuccess"
      :on-error="handleUploadError"
      :limit="1"
      :on-progress="handleGetUploadProgress"
      :before-upload="beforeupload"
      show-file-list
      style="float: right"
      ref="upload"
      v-havedone
    >
      <!-- <el-button type='primary' :disabled="submitType!=='EvalFeedback_Js'">文件上传</el-button> -->
      <el-button type="primary" >文件上传</el-button>
    </el-upload>
    <!-- nre -->
    <div v-if="data.allRes.nres">
      <h3>NRE</h3>
      <el-card v-for="(nre, index) in data.allRes.nres" :key="index">
        <p>{{ nre.solutionName }}</p>
        <p>线体数量：{{ nre.numberLine }} 共线分摊率：：{{ nre.collinearAllocationRate }}</p>
        <el-table
          :data="nre.models"
          style="width: 100%"
          border
          max-height="400px"
          :summary-method="getSummaries"
          show-summary
          table-layout="auto"
          :header-cell-style="{'text-align': 'center'}"
        >
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column prop="formName" label="费用名称" width="200" align="center" />
          <el-table-column
            prop="pricingMoney"
            label="核价金额"
            :formatter="formatThousandths"
            width="200"
            align="right"
          />
          <el-table-column label="报价系数" width="200" align="center">
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
            width="200"
            align="right"
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
            width="200"
            align="right"
            :formatter="formatThousandths"
          />
          <el-table-column prop="number" label="设备数量" width="200" align="center" />
          <el-table-column
            prop="equipmentMoney"
            label="设备金额"
            width="200"
            align="right"
            :formatter="formatThousandths"
          />
        </el-table>
      </el-card>
    </div>

    <!-- 样品 -->
    <div v-if="data.allRes.sampleOffer">
      <h3>样品报价</h3>
      <el-card v-for="sample in data.allRes.sampleOffer" :key="sample.solutionName">
        <p>{{ sample.solutionName }}</p>
        <el-table :data="sample.onlySampleModels" border max-height="500px">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column prop="name" label="样品阶段" width="200" align="center" />
          <el-table-column prop="pcs" label="需求量（pcs）" width="200" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.pcs" type="number" @change="pcsChange(scope.row, index, scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="成本" :formatter="formatThousandths" width="200" align="right" />
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
    </div>

    <!-- sop -->
    <div v-if="data.allRes.sops">
      <h3>单价表（sop年）</h3>
      <el-table :data="data.allRes.sops" style="width: 100%" border max-height="500px" :header-cell-style="{'text-align': 'center'}">
        <el-table-column prop="gradientValue" label="梯度" width="150" align="center" />
        <el-table-column prop="product" label="产品" width="150" align="center" />
        <el-table-column
          :label="item.gross + '%'"
          v-for="(item, index) in data.allRes.sops[0]?.grossValues"
          :key="item.gross"
          :formatter="toFixedTwo"
          width="150"
          align="right"
        >
          <template #default="scope">
            <div>{{ scope.row.grossValues[index].grossvalue.toFixed(2) }}</div>
            <!-- <el-input-number @mousewheel.native.prevent v-model="scope.row.grossValues[index].grossvalue" controls-position="right" :precision="2" /> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="data.allRes.fullLifeCycle">
      <p>项目全生命周期汇总分析表-实际数量</p>
      <el-table :data="data.allRes.fullLifeCycle" style="width: 100%" border max-height="500px" :header-cell-style="{'text-align': 'center'}">
        <el-table-column prop="projectName" label="项目名称" width="150" align="left" />
        <el-table-column
          v-for="(item, index) in data.allRes.fullLifeCycle[0]?.grossMarginList"
          :label="item.grossMargin + '%'"
          :key="index"
          width="150"
          align="right"
        >
          <template #default="scope">
            <div>
              {{ ["销售成本","返利后销售收入","销售毛利","佣金"].includes(scope.row?.projectName)? ZeroDecimalPlaces(scope.row, scope.row, scope.row.grossMarginList[index].grossMarginNumber):formatThousandths(scope.row, scope.row, scope.row.grossMarginList[index].grossMarginNumber) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="data.allRes.gradientQuotedGrossMargins">
      <p>报价毛利率测算-阶梯数量</p>
      <el-card class="card">
        <el-table :data="data.allRes.gradientQuotedGrossMargins" border>
          <el-table-column label="梯度" prop="gradient" />
          <el-table-column label="产品" prop="product" />
          <el-table-column label="目标价（内部）" width="300">
            <el-table-column label="单价" prop="interiorPrice" :formatter="formatThousandths" align="right"/>
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.interiorGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="目标价（客户）">
            <el-table-column label="单价" width="150" align="right">
              <template #default="scope">
                <el-input v-model="scope.row.clientPrice" :precision="2">
                  <!-- <template #append>
                  <el-button @click="
                    calculateFullGrossMargin(
                      scope.row,
                      scope.$index,
                      'clientTargetUnitPrice',
                      'clientTargetGrossMargin'
                    )
                    ">计算</el-button>
                </template> -->
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.clientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.clientClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="剔除分摊费用毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.clientNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="本次报价">
            <el-table-column label="单价" width="150" align="right">
              <template #default="scope">
                <el-input v-model="scope.row.thisQuotationPrice">
                  <template #append>
                    <el-button @click="calculateFullGrossMarginNew(scope.row, scope.$index)">计算</el-button>
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.thisQuotationGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.thisQuotationClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="剔除分摊费用毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.thisQuotationNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="上轮报价">
            <el-table-column label="单价" width="150" prop="lastRoundPrice" :formatter="formatThousandths" align="right">
              <!-- <template #default="scope">
              <el-input v-model="scope.row.lastRoundPrice" />
            </template> -->
            </el-table-column>
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.lastRoundGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.lastRoundClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="剔除分摊费用毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.lastRoundNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column width="140" label="操作">
            <template #default="{ row }">
              <el-row justify="end" m="2">
                <el-button @click="openDialog(row, 1)" type="primary">年份维度对比</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div v-if="data.allRes.quotedGrossMargins">
      <el-card class="card" v-for="(item, index) in data.allRes.quotedGrossMargins" :key="index">
        <p>{{ item.project }}</p>
        <el-table :data="item.quotedGrossMarginActualList" border>
          <el-table-column label="产品" prop="product" />
          <el-table-column label="单车产品数量" prop="carNum" />
          <el-table-column label="目标价（内部）" width="300">
            <el-table-column label="单价" prop="interiorPrice" :formatter="formatThousandths" align="right"/>
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.interiorGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.interiorClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="毛利率剔除NRE分摊费用毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.interiorNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="目标价（客户）">
            <el-table-column label="单价" prop="clientPrice" width="180" align="right">
              <template #default="scope">
                <el-input-number
                  @mousewheel.native.prevent
                  v-model="scope.row.clientPrice"
                  :precision="2"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.clientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.clientClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="毛利率剔除NRE分摊费用毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.clientNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="本次报价">
            <el-table-column label="单价" width="150" align="right">
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
            <el-table-column label="毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.thisQuotationGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="增加客供料毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.thisQuotationClientGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
            <el-table-column label="毛利率剔除NRE分摊费用毛利率" align="right">
              <template #default="{ row }">
                {{ `${row.thisQuotationNreGrossMargin?.toFixed(2)} %` }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column width="140" label="操作">
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
    </div>

    <!-- projectBoard -->
    <div v-if="data.allRes.projectBoard">
      <el-card class="card">
        <div v-for="item in data.allRes.projectBoard" :key="item.title">
          <p>{{ item.title }}</p>
          <el-table :data="item.projectBoardModels" border>
            <el-table-column label="产品" prop="projectName" />
            <el-table-column
              label="目标价（内部）"
              width="300"
              prop="interiorTarget"
              :formatter="ZeroOrformatThousandths"
              align="right"
            />
            <el-table-column label="目标价（客户）" prop="clientTarget" :formatter="ZeroOrformatThousandths" align="right" />
            <el-table-column label="本次报价" prop="offer" :formatter="ZeroOrformatThousandths" align="right" />
            <el-table-column label="上轮报价" prop="oldOffer" :formatter="ZeroOrformatThousandths" align="right" />
          </el-table>
        </div>

        <!-- <div v-for="(value, key) in gradientTableMap" :key="key">
        <p>{{ key }}</p>
        <el-table :data="value" border>
          <el-table-column label="产品" prop="product" />
          <el-table-column
            label="目标价（内部）"
            width="300"
            prop="quotedGrossMarginSimple.interior.price"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column
            label="目标价（客户）"
            prop="quotedGrossMarginSimple.client.price"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column
            label="本次报价"
            prop="quotedGrossMarginSimple.thisQuotation.price"
            :formatter="formatThousandths"
            align="right"
          />
          <el-table-column
            label="上轮报价"
            prop="quotedGrossMarginSimple.astRound.price"
            :formatter="formatThousandths"
            align="right"
          />
        </el-table>
        <div :id="'unitpriceChart' + key" class="h-400px" />
        <div :id="'revenueGrossMarginChart' + key" class="h-400px" />
      </div> -->
        <div v-for="(value, key) in gradientTableMap" :key="key">
          <div :id="'unitpriceChart' + key" class="h-400px" />
          <div :id="'revenueGrossMarginChart' + key" class="h-400px" />
        </div>
        <div>
          <div :id="'unitpriceChart' + 'shiji'" class="h-400px" />
          <div :id="'revenueGrossMarginChart' + 'shiji'" class="h-400px" />
        </div>
      </el-card>
    </div>
    <div><el-button @click="save" float-right my-20px type="primary">保存</el-button></div>

    <el-dialog v-model="dialogVisible" title="年份维度对比">
      <h4>数量K</h4>
      <el-table :data="yearDimension.numk" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="数量K" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>单价</h4>
      <el-table :data="yearDimension.prices" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="单价" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售成本</h4>
      <el-table :data="yearDimension.sellingCost" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="销售成本" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>单位平均成本</h4>
      <el-table :data="yearDimension.averageCost" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="单位平均成本" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售收入</h4>
      <el-table :data="yearDimension.salesRevenue" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="销售收入" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>销售毛利（千元）</h4>
      <el-table :data="yearDimension.salesMargin" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="销售毛利（千元）" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>佣金</h4>
      <el-table :data="yearDimension.commission" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="佣金" prop="value">
          <template #default="{ row }">
            <div>{{ `${row.value.toFixed(2)} ` }}</div>
          </template>
        </el-table-column>
      </el-table>
      <h4>毛利率</h4>
      <el-table :data="yearDimension.grossMargin" style="width: 100%" border max-height="300px">
        <el-table-column label="序号" type="index" width="100" />
        <el-table-column label="年份" prop="key" />
        <el-table-column label="毛利率" prop="value">
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
    <el-dialog v-model="opinionVisible" title="审批意见" width="30%" :before-close="handleClose">
      <el-input type="textarea" rows="4" v-model="confirmText" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="opinionVisible = false">取消</el-button>
          <el-button type="primary" @click="agreeConfirm"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import * as echarts from "echarts"
import { ElMessage, ElLoading,UploadInstance } from "element-plus"
// import debounce from "lodash/debounce"
import getQuery from "@/utils/getQuery"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"

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
  GetSoltionGradPriceList,
  PostQuotationFeedback,
  GetDownloadListSaveNoQuotation
} from "./service"
import { calculateRate, getQuotationFeedback } from "./service"
import { getProductByAuditFlowId } from "@/views/productList/service"
import {ZeroDecimalPlaces} from "@/utils/number"
const fileList = ref<any[]>([])
//报价反馈
//标识符：QuoteFeedback
// EvalFeedback_Js, DisplayName="接受报价",},
// EvalFeedback_Bjsbzc, DisplayName="不接受此此价，不用再次报价/重新核价",},
// EvalFeedback_Bjsdjsjj, DisplayName="不接受此价，但接受降价，不用重新核价",},
// EvalFeedback_Bjxysp, DisplayName="报价金额小于审批金额",},
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
let { auditFlowId, nodeInstanceId } = getQuery()
let isSave = false
let versionMapSubmit: any = reactive({})
const version = ref(1)
const confirmText = ref("")
const productList = ref<any[]>([])
const fullscreenLoading = ref(false)
const dialogVisible = ref(false)
let versionList = reactive<any[]>([])
let versionChosen: any = null // 选中的以前版本
let getVersionData = null
let versionData: any = null
// let isSubmit = ref(true)
const opinionVisible = ref(false)
let submitType = ref("")
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
      // {
      //   onlySampleModels: [
      //     {
      //       sampleName: "SampleName_C",
      //       pcs: 200,
      //       cost: 0,
      //       unitPrice: 0,
      //       grossMargin: 0,
      //       salesRevenue: 0
      //     }
      //   ],
      //   solutionName: "样品报价-前是有一"
      // }
    ],
    isSuccess: true,
    message: "调用成功"
  },
  allRes: {
    productName: null, //文件name
    productld: null, //文件上传id
    product: null, //文件url
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
      // }
    ]
  } as any
})
const handleClose = () => {
  confirmText.value = ""
}
const handleSuccess = (res: any) => {
  if (res.success) {
    data.allRes.productId = fileList.value.map((item: any) => item.response.result.fileId)[0] || null
    data.allRes.product = fileList.value.map((item: any) => item.response.result.fileUrl)[0] || null
    data.allRes.productName = fileList.value.map((item: any) => item.response.result.fileName)[0] || null
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
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
const isSubmit = computed(() => {
  let submit = true
  let keys = Object.keys(versionMapSubmit)
  keys.forEach((key) => {
    if (versionMapSubmit[key] === false) {
      submit = false
    }
  })
  return submit
})
let gradientTableMapResult = ref([])

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    if (_record && _record.projectName === "毛利率") {
      return (cellValue.toFixed(2) + "%").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
    }
    return (cellValue.toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}

const ZeroOrformatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (typeof cellValue === "number") {
    if(_record &&["销售成本","销售收入","销售毛利","佣金"].includes(_record?.projectName))
    {
       return (cellValue.toFixed(0) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
    }
    if (_record && _record.projectName === "毛利率") {
      return (cellValue.toFixed(2) + "%").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
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
// 设置图表
const setChartData = () => {
  /**梯度图表 */
  let ProjectUnitPrice: stringKeyObj = {}
  let RevenueGrossMargin: stringKeyObj = {}
  let keys = Object.keys(gradientTableMap.value)
  keys.forEach((key) => {
    ProjectUnitPrice[key] = {
      title: {
        text: "项目单价对比"
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
        text: "收入和毛利率对比"
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
      text: "项目单价对比"
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
      text: "收入和毛利率对比"
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
/**
 * 加载之前的版本
 */
const selectVersion = async (row: any) => {
  const loading = ElLoading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0, 0, 0, 0.7)"
  })
  try {
    // let res = await PostStatementAnalysisBoardSecond({
    //   ...versionChosen,
    //   solutionTables: versionChosen.solutionList
    // })
    // fullscreenLoading.value = false
    // data.allRes = res.result
    versionChosen = row
    /**
     * 根据版本号查询该版本数据
     */
    if (versionChosen.isQuotation) {
      let res = await getStatementAnalysisBoardSecond({
        auditFlowId,
        version: versionChosen.version,
        ntype: 1,
        ntime: versionChosen.ntime
      })
      data.allRes = res.result
    } else {
      let res: any = await getQuotationFeedback({
        auditFlowId,
        version: versionChosen.version,
        ntime: versionChosen.ntime
      })
      data.allRes = res.result
    }
    loading.close()
    /**
     * 触发nre汇总计算
     */
    getNreChange()
  } catch (error) {
    loading.close()
  }
}
//成本信息表
const downLoad = async () => {
  console.log("downLoad")
  // let planMap = {}
  let solutionTables: any[] = []
  // productList.value.forEach((item: any) => {
  //   planMap[item.id as keyof Object] = item
  // })
  // planList.forEach((item) => {
  //   if (planMap[item.value as keyof Object] && item.isOffer) {
  //     solutionTables.push(planMap[item.value as keyof Object])
  //   }
  // })
  solutionTables = versionChosen.solutionList
  try {
    let res: any = await PostDownloadMessageSecond({
      auditFlowId,
      solutionTables,
      version: versionChosen.version,
      ntime: versionChosen.ntime
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

const toFixedTwo = (_recoed: any, _row: any, val: any) => {
  if (typeof val === "number" && val > 0) return val.toFixed(2)
  return val
}

const beforeupload=(rawFile: any)=>{
  if(!versionChosen)
  {
    ElMessage.warning("请先加载数据")
     return false
  }
}

const setSubmitType = (type: string) => {
  if(!versionChosen)
  {
    ElMessage.warning("请先加载数据")
     return false
  }
 if (type === "EvalFeedback_Js" && !data.allRes.productId) {
    ElMessage.warning("上传完文件后再执行")
    return false
  }
  if (!isSave) {
    ElMessage.warning("保存后再执行")
    return false
  }
  submitType.value = type
  opinionVisible.value = true
}
/**
 * 同意提交流程
 */
const agreeConfirm = async () => {
  /**如果是拒绝报价 */
  if (submitType.value === "EvalFeedback_Bjsbzc") {
    await GetDownloadListSaveNoQuotation(auditFlowId)
  }
  //先保存数据 然后再提交流程
  /**
   * 保存数据需要确认
   */
  save(false).then(async(p:any)=>{
    let res = await SubmitNode({
      comment: confirmText.value,
      nodeInstanceId,
      financeDictionaryDetailId: submitType.value
    })
    if (res.success) {
      ElMessage.success("操作成功")
      opinionVisible.value = false
    }
  })
}
/**
 * 报价反馈提交
 */
const save = async (ismessage:boolean=true) => {
  if(!versionChosen)
  {
    ElMessage.warning("请先加载数据")
     return
  }
  versionMapSubmit[versionChosen.version] = true
  let saveData = {
    ...data.allRes,
    auditFlowId,
    version: versionChosen.version,
    ntime: versionChosen.ntime,
    isOffer: true
  }
  delete saveData.isSuccess
  delete saveData.message
  delete saveData.mes
  let res: any = await PostQuotationFeedback(saveData)
  if (res.success&&ismessage) {
    isSave = true
    ElMessage({
      type: "success",
      message: "操作成功"
    })
  }
  /**报价金额比大小  报价反馈的报价 要大于等于报价分析看板的报价才能下一个节点*/
  let resbj: any = await GetSoltionGradPriceList({ auditFlowId, version: versionChosen.version, ntype: 0 }) //报价分析看板0
  let resfk: any = await GetSoltionGradPriceList({ auditFlowId, version: versionChosen.version, ntype: 1 }) //报价反馈1

  if (resbj.result.length && resfk.result.length) {
    let length = resbj.result.length
    for (let i = 0; i < length; i++) {
      if (resbj.result[i].unitPrice > resfk.result[i].unitPrice) {
        versionMapSubmit[versionChosen.version] = false // 该版本无法提交
      }
    }
  }
  if (isSubmit.value === false) {
    ElMessage.warning(`${versionChosen.version}版本报价金额较小，无法提交`)
    console.log(resbj, resfk)
  }
}
const toMarketingApproval = () => {
  router.push({
    path: "/quoteAnalysis/marketingApproval",
    query: {
      auditFlowId
    }
  })
}

onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
  if (auditFlowId) {
    let { result }: any = await GeCatalogue({ auditFlowId })
    result.forEach((item: any) => {
      if (!item.isFirst) {
        versionList.push(item)
        versionMapSubmit[item.version] = true // 默认该版本可提交
      }
    })
  }
})
watchEffect(() => {})
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss"></style>
