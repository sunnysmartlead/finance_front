<template>
  <div class="demand-apply" v-loading="state.taebleLoading">
    <el-form :model="state.quoteForm" ref="refForm" :rules="rules">
      <!-- 拟稿人信息 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标题:" prop="title">
              <el-input v-model="state.quoteForm.title" :disabled="isDisabled">
                <template #append v-if="!isDisabled">
                  <el-button @click="generateTitle" v-havedone>自动生成</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿人:" prop="drafter">
              <el-input v-model="state.quoteForm.drafter" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿人工号:" prop="drafterNumber">
              <el-input v-model="state.quoteForm.drafterNumber" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿公司:" prop="draftingCompany">
              <el-input v-model="state.quoteForm.draftingCompany" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿部门:" prop="draftingDepartment">
              <el-input v-model="state.quoteForm.draftingDepartment" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="拟稿日期:" prop="draftDate">
              <el-date-picker v-model="state.quoteForm.draftDate" @change="generateTitle" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号:" prop="number">
              <el-input v-model="state.quoteForm.number" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 项目信息 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目名称:" prop="projectName">
              <el-input v-model="state.quoteForm.projectName" placeholder="与PLM系统保持一致" :disabled="isDisabled" />
              <!-- <el-input v-model="state.quoteForm.projectName" placeholder="与PLM系统保持一致" @change="generateTitle" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目代码(自动带出):" prop="projectCode">
              <el-select v-model="state.quoteForm.projectCode" filterable placeholder="Select" :disabled="isDisabled">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目版本号:">
              <el-input v-model="state.quoteForm.quoteVersion" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称:" prop="customerName">
              <el-input v-model="state.quoteForm.customerName" @change="generateTitle" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户类别:" prop="customerNature">
              <el-select v-model="state.quoteForm.customerNature" placeholder="客户类别" :disabled="isDisabled">
                <el-option
                  v-for="item in state.customerNatureOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="终端名称:" prop="terminalName">
              <el-input v-model="state.quoteForm.terminalName" placeholder="终端名称" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端类别:" prop="terminalNature">
              <el-select v-model="state.quoteForm.terminalNature" placeholder="终端类别" :disabled="isDisabled">
                <el-option
                  v-for="item in state.terminalNatureOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="6"> 二开中去掉了
            <el-form-item label="报价形式:" prop="quotationType">
              <el-select v-model="state.quoteForm.quotationType" placeholder="Select" @change="generateTitle">
                <el-option
                  v-for="item in state.quotationTypeOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>         -->
          <el-col :span="6">
            <el-form-item label="sop时间:" prop="sopTime">
              <el-date-picker
                type="year"
                placeholder="Pick a year"
                v-model="state.quoteForm.sopTime"
                value-format="YYYY"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="价格有效期:" prop="updateFrequency">
              <el-select
                v-model="state.quoteForm.updateFrequency"
                placeholder="价格有效期"
                :disabled="isDisabled"
                @change="yearChange(0)"
              >
                <el-option
                  v-for="item in state.updateFrequencyOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目周期:" prop="projectCycle">
              <el-input-number
                v-model="state.quoteForm.projectCycle"
                @change="yearChange"
                :min="0"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-row :span="15">
            <el-form-item label="核价类型:" prop="updateFrequency">
              <el-select v-model="state.quoteForm.priceEvalType" placeholder="核价类型" :disabled="isDisabled">
                <!-- <el-option :value="0" label="量产品核价" />
                <el-option :value="1" label="样品核价" /> -->
                <el-option
                  v-for="item in state.valenceTypeOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-row
              :span="7"
              style="color: red; margin: 10px"
              v-if="state.quoteForm.priceEvalType == 'PriceEvalType_Sample'"
            >
              提示:样品核价按量产品核价进行,走量输入量产品走量</el-row
            >
          </el-row>
        </el-row>
        <el-row v-if="state.quoteForm.priceEvalType == 'PriceEvalType_Quantity'">
          <el-col :span="6">
            <el-form-item label="是否包含样品核价:" prop="updateFrequency">
              <el-select v-model="state.quoteForm.isHasSample" placeholder="是否包含样品核价" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="state.quoteForm.isHasSample || state.quoteForm.priceEvalType == 'PriceEvalType_Sample'">
          <div class="demand-apply__btn-container" v-if="!isDisabled">
            <el-button type="primary" class="demand-apply__add-btn" @click="addSpecimen" v-havedone>新增</el-button>
          </div>
          <el-row>
            <el-table :data="specimenData" border style="width: 600px">
              <el-table-column prop="name" label="样品阶段" width="250">
                <template #default="{ row }">
                  <el-select v-model="row.name" placeholder="样品阶段" :disabled="isDisabled">
                    <!-- <el-option :value="0" label="A样" />
                    <el-option :value="1" label="B样" />
                    <el-option :value="2" label="C样" />
                    <el-option :value="3" label="其他" /> -->
                    <el-option
                      v-for="item in state.isSpecimenOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="pcs" label="需求量(pcs)" width="250">
                <template #default="{ row }">
                  <el-input v-model="row.pcs" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template #default="{ $index }" v-if="!isDisabled">
                  <el-button
                    @click="deleteSpecimen($index)"
                    type="danger"
                    :disabled="specimenData.length === 1"
                    v-havedone
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </div>
        <h6 />
        <el-card header="项目走量">
          <el-row justify="space-between" align="middle" style="margin: 10px 0px">
            <h6 style="margin: 0px">客户输入终端走量K（台）</h6>
            <el-button type="primary" @click="addPCS" v-havedone>新增车型</el-button>
          </el-row>
          <el-table :data="pcsTableData" show-summary :summary-method="getPcsTableDatSummaries" border>
            <el-table-column label="车厂" width="180" fixed="left">
              <template #default="{ row }">
                <el-input v-model="row.carFactory" :disabled="isDisabled" />
              </template>
            </el-table-column>
            <el-table-column label="车型" width="180" fixed="left">
              <template #default="{ row }">
                <el-input v-model="row.carModel" :disabled="isDisabled" />
              </template>
            </el-table-column>
            <el-table-column
              :label="year + yearNote(index)"
              v-for="(year, index) in state.yearCols"
              :key="year + ''"
              width="150"
              :prop="`pcsYearList[${index}].quantity`"
            >
              <template #default="{ row }">
                <!-- {{ row.pcsYearList[index] }} -->
                <el-input
                  v-model="row.pcsYearList[index].quantity"
                  @change="pcsYearQuantitySum(row, index)"
                  :disabled="isDisabled"
                />
              </template>
            </el-table-column>
            <el-table-column prop="rowSum" label="合计">
              <template #default="{ row }">
                {{ formatThousandths(null, null, getRowSum(row)) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="85">
              <template #default="{ $index }" v-if="!isDisabled">
                <el-button @click="deletePcs($index)" type="danger" :disabled="pcsTableData.length === 1" v-havedone>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <h6 />
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item>
              <h6 style="margin: 0px">内部评估后终端走量K（台)</h6>
            </el-form-item>
            <el-form-item label="系数K">
              <el-input
                type="number"
                min="0"
                v-model="state.quoteForm.kValue"
                placeholder="手工录入"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-form>
          <el-table :data="interiorPcsTableData" show-summary :summary-method="getPcsTableDatSummaries" border>
            <el-table-column label="车厂" width="180" fixed="left">
              <template #default="{ row }">
                <el-input v-model="row.carFactory" :disabled="isDisabled" />
              </template>
            </el-table-column>
            <el-table-column label="车型" width="180" fixed="left">
              <template #default="{ row }">
                <el-input v-model="row.carModel" :disabled="isDisabled" />
              </template>
            </el-table-column>
            <el-table-column
              :label="year + yearNote(index)"
              v-for="(year, index) in state.yearCols"
              :key="year + ''"
              width="150"
              :prop="`pcsYearList[${index}].quantity`"
            >
              <template #default="{ row }">
                {{ formatThousandths(null, null, row.pcsYearList?.[index]?.quantity) }}
                <!-- <el-input v-model="row.pcsYearList[index].quantity" @change="pcsYearQuantitySum(row, index)" /> -->
              </template>
            </el-table-column>
            <el-table-column prop="rowSum" label="合计" width="150">
              <template #default="{ row }">
                {{ formatThousandths(null, null, getRowSum(row)) }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" fixed="right">
            <template #default="{ $index }">
              <el-button @click="deletePcs($index)" type="danger" :disabled="pcsTableData.length === 1" v-havedone>
                删除
              </el-button>
            </template>
          </el-table-column> -->
          </el-table>
          <!-- <h6>模组数量</h6> -->
          <!-- <div class="demand-apply__btn-container">
          <el-button type="primary" @click="addProduct" v-havedone>同步</el-button>
        </div> -->
          <div v-for="(item, Findex) in moduleTableDataV2" :key="Findex">
            <el-row justify="space-between" align="middle">
              <h6 class="mx-1" size="large">{{ item[0].carModel }} - 模组数量K</h6>
              <div>
                <el-button type="primary" @click="addProduct(Findex)" v-havedone v-if="!isDisabled">新增模组</el-button>
                <el-button
                  type="primary"
                  @click="syncModuleTableDataV2(Findex)"
                  v-havedone
                  v-if="!isDisabled && Findex === 0"
                  >一键同步</el-button
                >
              </div>
            </el-row>
            <el-table :data="item" style="width: 100%" border>
              <el-table-column type="index" width="80" label="序号" />
              <el-table-column label="客户零件号" width="180">
                <template #default="{ row }">
                  <el-input v-model="row.partNumber" placeholder="若没有，填写 /" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="子项目代码" width="180">
                <template #default="{ row }">
                  <el-input v-model="row.code" placeholder="未导入PLM" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="产品名称" width="180">
                <template #default="{ row }">
                  <el-input v-model="row.product" :disabled="isDisabled" @change="productChange" />
                </template>
              </el-table-column>
              <el-table-column label="产品大类" width="180">
                <template #default="{ row }">
                  <el-select v-model="row.productType" placeholder="产品大类" :disabled="isDisabled">
                    <el-option
                      v-for="item in state.productTypeOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="像素" width="180">
                <template #default="{ row }">
                  <el-input v-model="row.pixel" placeholder="像素" :disabled="isDisabled" />
                </template>
              </el-table-column>
              <el-table-column label="我司角色" width="180">
                <template #default="{ row }">
                  <el-select v-model="row.role" placeholder="我司角色" :disabled="isDisabled">
                    <el-option
                      v-for="item in state.roleOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="市场份额" width="180">
                <template #default="{ row }">
                  <el-input
                    v-model="row.marketShare"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="模组搭载率" width="180">
                <template #default="{ row }">
                  <el-input
                    v-model="row.moduleCarryingRate"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>%</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="单车产品数量" width="180">
                <template #default="{ row }">
                  <el-input
                    v-model="row.singleCarProductsQuantity"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    :disabled="isDisabled"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :label="year + yearNote(index)"
                v-for="(year, index) in state.yearCols"
                :key="year + ''"
                width="180"
                :prop="`modelCountYearList.${index}.quantity`"
              >
                <template #default="{ row }">
                  <!-- <el-input
                    v-model="row.modelCountYearList[index].quantity"
                    @input="modelCountYearListQuantitySum(row)"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    :disabled="isDisabled"
                  /> -->
                  {{ formatThousandths(null, null, row.modelCountYearList?.[index]?.quantity) }}
                </template>
              </el-table-column>
              <el-table-column label="模组总量" prop="modelTotal" width="180" :formatter="formatThousandths">
                <template #default="{ row }">
                  {{ price(row) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="85">
                <template #default="{ $index }" v-if="!isDisabled">
                  <el-button
                    @click="deleteProduct(Findex, $index)"
                    type="danger"
                    :disabled="moduleTableDataV2[Findex].length === 1"
                    v-havedone
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <h5>合计：</h5>
          <el-table :data="moduleTableTotal" style="width: 100%" border>
            <el-table-column label="客户零件号" prop="partNumber" width="180" />
            <el-table-column label="子项目代码" prop="code" width="180" />
            <el-table-column label="产品名称" prop="product" width="180" />
            <el-table-column label="产品大类" width="180">
              <template #default="{ row }">
                <el-select v-model="row.productType" placeholder="产品大类" multiple disabled>
                  <el-option
                    v-for="item in state.productTypeOptions"
                    :key="item.id"
                    :label="item.displayName"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="像素" prop="pixel" width="180" />
            <el-table-column label="我司角色" prop="role" width="180">
              <template #default="{ row }">
                <el-select v-model="row.role" multiple placeholder="我司角色" disabled>
                  <el-option
                    v-for="item in state.roleOptions"
                    :key="item.id"
                    :label="item.displayName"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="市场份额" prop="marketShare" width="180" />
            <el-table-column label="模组搭载率" prop="moduleCarryingRate" width="180" />
            <el-table-column label="单车产品数量" prop="singleCarProductsQuantity" width="180" />
            <el-table-column
              :label="year + yearNote(index)"
              v-for="(year, index) in state.yearCols"
              :key="year + ''"
              width="180"
              :prop="`modelCountYearList.${index}.quantity`"
            />
          </el-table>
        </el-card>
        <h6 />
        <el-card>
          <el-form-item label="是否分梯度核价：">
            <el-select v-model="state.quoteForm.isHasGradient" placeholder="是否包含样品核价" :disabled="isDisabled">
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </el-form-item>
          <el-row justify="end" v-if="state.quoteForm.isHasGradient">
            <el-button type="primary" :disabled="isDisabled" @click="handleChangekvPricingData('add')" v-havedone
              >新增梯度</el-button
            >
          </el-row>
          <h6 />
          <el-table :data="kvPricingData" border style="width: 600px">
            <el-table-column type="index" label="梯度序号" width="100" />
            <el-table-column prop="gradientValue" label="梯度" width="250">
              <template #default="{ row }">
                <el-input-number
                  controls-position="right"
                  v-model="row.gradientValue"
                  :disabled="isDisabled || !state.quoteForm.isHasGradient"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template #default="{ $index }" v-if="!isDisabled">
                <el-button
                  type="danger"
                  :disabled="kvPricingData.length === 1"
                  @click="handleChangekvPricingData('delete', $index)"
                  v-havedone
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-for="(item, Findex) in gradientModelTable" :key="Findex">
            <p class="mx-1" size="large">{{ item.kv }} (K/Y)</p>
            <el-table :data="item.children" style="width: 100%" border>
              <el-table-column type="index" width="80" label="序号" />
              <el-table-column label="客户零件号" prop="number" width="180" />
              <el-table-column label="子项目代码" prop="code" width="180" />
              <el-table-column label="产品名称" prop="name" width="180" />
              <el-table-column label="产品大类" width="180">
                <template #default="{ row }">
                  <el-select v-model="row.type" placeholder="产品大类" multiple disabled>
                    <el-option
                      v-for="item in state.productTypeOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                :label="year + yearNote(index)"
                v-for="(year, index) in state.yearCols"
                :key="year + ''"
                width="180"
              >
                <template #default="{ row }">
                  {{ formatThousandths(null, null, row.gradientModelYear?.[index]?.count) }}
                </template>
              </el-table-column>
              <el-table-column prop="rowSum" label="合计" width="150">
                <template #default="{ row }">
                  {{ formatThousandths(null, null, getRowSum(row, "gradientModelYear", "count")) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <h6>要求</h6>
        <el-table :data="requireTableData" style="width: 100%; margin: 20px 0" border>
          <el-table-column label="年份" width="180" prop="year" />
          <el-table-column label="类型" width="180" prop="type">
            <template #default="{ $index }">
              {{ yearNote($index) }}
            </template>
          </el-table-column>
          <el-table-column label="客户年降率(%)">
            <template #default="{ row, $index }">
              <el-input v-model="row.annualDeclineRate" :disabled="isDisabled || !$index">
                <template #append>%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="年度返利要求(%)">
            <template #default="{ row }">
              <el-input v-model="row.annualRebateRequirements" :disabled="isDisabled">
                <template #append>%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="一次性折让率(%)">
            <template #default="{ row }">
              <el-input v-model="row.oneTimeDiscountRate" :disabled="isDisabled">
                <template #append>%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="年度佣金比例(%)">
            <template #default="{ row }">
              <el-input v-model="row.commissionRate" :disabled="isDisabled">
                <template #append>%</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="是否有NRE费用分摊至模组:" prop="isHasNre">
          <el-select v-model="state.quoteForm.isHasNre" placeholder="Select" :disabled="isDisabled">
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </el-form-item>
        <div v-if="state.quoteForm.isHasNre">
          <h6>分摊数量：</h6>
          <el-table :data="shareCountTable">
            <el-table-column prop="name" label="产品名称" width="100" />
            <el-table-column prop="count" label="分摊数量" width="250">
              <template #default="{ row }">
                <el-input-number controls-position="right" v-model="row.count" :disabled="isDisabled" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <h6 />
        <el-row :gutter="20" v-if="state.quoteForm.isHasNre">
          <el-col :span="6">
            <el-form-item label="模具费分摊:" prop="allocationOfMouldCost">
              <el-select v-model="state.quoteForm.allocationOfMouldCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="治具费分摊:" prop="allocationOfFixtureCost">
              <el-select v-model="state.quoteForm.allocationOfFixtureCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工装分摊:" prop="frockCost">
              <el-select v-model="state.quoteForm.frockCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="专用设备费分摊:" prop="allocationOfEquipmentCost">
              <el-select
                v-model="state.quoteForm.allocationOfEquipmentCost"
                placeholder="Select"
                :disabled="isDisabled"
              >
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检具费用分摊:" prop="fixtureCost">
              <el-select v-model="state.quoteForm.fixtureCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实验费用分摊:" prop="experimentCost">
              <el-select v-model="state.quoteForm.experimentCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试软件费分摊:" prop="testCost">
              <el-select v-model="state.quoteForm.testCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="差旅费分摊:" prop="travelCost">
              <el-select v-model="state.quoteForm.travelCost" placeholder="Select" :disabled="isDisabled">
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="其他费用分摊:" prop="allocationOfEquipmentCost">
              <el-select
                v-model="state.quoteForm.allocationOfEquipmentCost"
                placeholder="Select"
                :disabled="isDisabled"
              >
                <el-option :value="true" label="是" />
                <el-option :value="false" label="否" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="落地工厂:" prop="landingFactory">
              <el-select v-model="state.quoteForm.landingFactory" placeholder="请选择" :disabled="isDisabled">
                <el-option
                  v-for="item in state.landingFactoryOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 产品信息 -->
      <el-card class="demand-apply__card">
        <h6>产品信息</h6>
        <el-table :data="productTableData" style="width: 100%" border>
          <el-table-column label="产品名称" width="180" fixed="left">
            <template #default="{ row }">
              <el-input v-model="row.name" disabled />
            </template>
          </el-table-column>
          <!-- <el-table-column label="目标价" width="180" fixed="left">
            <template #default="{ row }">
              <el-input v-model="row.customerTargetPrice" oninput="value=value.replace(/[^0-9.]/g,'')">
                <template #append>元</template>
              </el-input>
            </template>
          </el-table-column> -->
          <el-table-column label="Sensor" width="650">
            <template #default="{ row, $index }">
              <el-input v-model="row.sensor" placeholder="品牌/型号" :disabled="isDisabled">
                <template #prepend>
                  <el-select v-model="row.sensorTypeSelect" :disabled="isDisabled">
                    <!-- <el-option label="我司推荐" value="1" />
                    <el-option label="客户指定" value="2" />
                    <el-option label="客户供应采购" value="3" />
                    <el-option label="客户要求" value="4" /> -->
                    <el-option
                      v-for="item in state.TypeSelectOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #append>
                  <el-input
                    v-model="row.sensorPrice"
                    placeholder="单价"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>
                      <el-select
                        v-model="row.sensorCurrency"
                        @change="(val) => SensorChange(val, $index)"
                        :disabled="isDisabled"
                      >
                        <el-option
                          v-for="item in state.ExchangeSelectOptions"
                          :key="item.id"
                          :label="item.exchangeRateKind"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-input>
                  <!-- <el-text class="mx-1">汇率:{{ row.sensorExchangeRate }}</el-text> -->
                  <el-input
                    v-model="row.sensorExchangeRate"
                    placeholder="汇率:"
                    :disabled="isDisabled"
                    style="width: 100px"
                  />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="Lens" width="650">
            <template #default="{ row, $index }">
              <el-input v-model="row.lens" placeholder="品牌/型号" :disabled="isDisabled">
                <template #prepend>
                  <el-select v-model="row.lensTypeSelect" :disabled="isDisabled">
                    <!-- <el-option label="我司推荐" value="1" />
                    <el-option label="客户指定" value="2" />
                    <el-option label="客户供应采购" value="3" />
                    <el-option label="客户要求" value="4" /> -->
                    <el-option
                      v-for="item in state.TypeSelectOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #append>
                  <el-input
                    v-model="row.lensPrice"
                    placeholder="单价"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>
                      <el-select
                        v-model="row.lensCurrency"
                        @change="(val) => LensChange(val, $index)"
                        :disabled="isDisabled"
                      >
                        <el-option
                          v-for="item in state.ExchangeSelectOptions"
                          :key="item.id"
                          :label="item.exchangeRateKind"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-input>
                  <!-- <el-text class="mx-1">汇率:{{ row.lensExchangeRate }}</el-text> -->
                  <el-input
                    v-model="row.lensExchangeRate"
                    placeholder="汇率:"
                    :disabled="isDisabled"
                    style="width: 100px"
                  />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="ISP" width="650">
            <template #default="{ row, $index }">
              <el-input v-model="row.isp" placeholder="品牌/型号" :disabled="isDisabled">
                <template #prepend>
                  <el-select v-model="row.ispTypeSelect" :disabled="isDisabled">
                    <!-- <el-option label="我司推荐" value="1" />
                    <el-option label="客户指定" value="2" />
                    <el-option label="客户供应采购" value="3" />
                    <el-option label="客户要求" value="4" /> -->
                    <el-option
                      v-for="item in state.TypeSelectOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #append>
                  <el-input
                    v-model="row.ispPrice"
                    placeholder="单价"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>
                      <el-select
                        v-model="row.ispCurrency"
                        @change="(val) => ISPChange(val, $index)"
                        :disabled="isDisabled"
                      >
                        <el-option
                          v-for="item in state.ExchangeSelectOptions"
                          :key="item.id"
                          :label="item.exchangeRateKind"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-input>
                  <!-- <el-text class="mx-1">汇率:{{ row.ispExchangeRate }}</el-text> -->
                  <el-input
                    v-model="row.ispExchangeRate"
                    placeholder="汇率:"
                    :disabled="isDisabled"
                    style="width: 100px"
                  />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="串行芯片" width="650">
            <template #default="{ row, $index }">
              <el-input v-model="row.serialChip" placeholder="品牌/型号" :disabled="isDisabled">
                <template #prepend>
                  <el-select v-model="row.serialChipTypeSelect" :disabled="isDisabled">
                    <!-- <el-option label="我司推荐" value="1" />
                    <el-option label="客户指定" value="2" />
                    <el-option label="客户供应采购" value="3" />
                    <el-option label="客户要求" value="4" /> -->
                    <el-option
                      v-for="item in state.TypeSelectOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #append>
                  <el-input
                    v-model="row.serialChipPrice"
                    placeholder="单价"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>
                      <el-select
                        v-model="row.serialChipCurrency"
                        @change="(val) => serialChipPriceChange(val, $index)"
                        :disabled="isDisabled"
                      >
                        <el-option
                          v-for="item in state.ExchangeSelectOptions"
                          :key="item.id"
                          :label="item.exchangeRateKind"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-input>
                  <!-- <el-text class="mx-1">汇率:{{ row.serialChipExchangeRate }}</el-text> -->
                  <el-input
                    v-model="row.serialChipExchangeRate"
                    placeholder="汇率:"
                    :disabled="isDisabled"
                    style="width: 100px"
                  />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="线缆" width="650">
            <template #default="{ row, $index }">
              <el-input v-model="row.cable" placeholder="品牌/型号" :disabled="isDisabled">
                <template #prepend>
                  <el-select v-model="row.cableTypeSelect" :disabled="isDisabled">
                    <!-- <el-option label="我司推荐" value="1" />
                    <el-option label="客户指定" value="2" />
                    <el-option label="客户供应采购" value="3" />
                    <el-option label="客户要求" value="4" /> -->
                    <el-option
                      v-for="item in state.TypeSelectOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #append>
                  <el-input
                    v-model="row.cablePrice"
                    placeholder="单价"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>
                      <el-select
                        v-model="row.cableCurrency"
                        @change="(val) => cableTypeChange(val, $index)"
                        :disabled="isDisabled"
                      >
                        <el-option
                          v-for="item in state.ExchangeSelectOptions"
                          :key="item.id"
                          :label="item.exchangeRateKind"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-input>
                  <!-- <el-text class="mx-1">汇率:{{ row.cableExchangeRate }}</el-text> -->
                  <el-input
                    v-model="row.cableExchangeRate"
                    placeholder="汇率:"
                    :disabled="isDisabled"
                    style="width: 100px"
                  />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="其它" width="650">
            <template #default="{ row, $index }">
              <el-input v-model="row.other" placeholder="品牌/型号" :disabled="isDisabled">
                <template #prepend>
                  <el-select v-model="row.otherTypeSelect" :disabled="isDisabled">
                    <!-- <el-option label="我司推荐" value="1" />
                    <el-option label="客户指定" value="2" />
                    <el-option label="客户供应采购" value="3" />
                    <el-option label="客户要求" value="4" /> -->
                    <el-option
                      v-for="item in state.TypeSelectOptions"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #append>
                  <el-input
                    v-model="row.otherPrice"
                    placeholder="单价"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    :disabled="isDisabled"
                  >
                    <template #append>
                      <el-select
                        v-model="row.otherCurrency"
                        @change="(val) => ledTypeSelectChange(val, $index)"
                        :disabled="isDisabled"
                      >
                        <el-option
                          v-for="item in state.ExchangeSelectOptions"
                          :key="item.id"
                          :label="item.exchangeRateKind"
                          :value="item.id"
                        />
                      </el-select>
                    </template>
                  </el-input>
                  <!-- <el-text class="mx-1">汇率:{{ row.otherExchangeRate }}</el-text> -->
                  <el-input
                    v-model="row.otherExchangeRate"
                    placeholder="汇率:"
                    :disabled="isDisabled"
                    style="width: 100px"
                  />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="制程" width="180">
            <template #default="{ row }">
              <el-input v-model="row.manufactureProcess" :disabled="isDisabled" />
            </template>
          </el-table-column>
          <el-table-column label="安装位置" width="180">
            <template #default="{ row }">
              <el-input v-model="row.installationPosition" :disabled="isDisabled" />
            </template>
          </el-table-column>
        </el-table>
        <h6>客户指定/供应详情</h6>
        <el-button @click="customerTargetPriceTable" type="primary" style="margin: 20px 0" :disabled="isDisabled"
          >点击生成</el-button
        >
        <el-table :data="specifyTableData" style="width: 100%" border>
          <el-table-column prop="productType" label="类型" />
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="main" label="核心部件" />
          <el-table-column prop="type" label="品牌/型号" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="currency" label="币别">
            <template #default="{ row }">
              <el-select v-model="row.currency" disabled>
                <el-option
                  v-for="item in state.ExchangeSelectOptions"
                  :key="item.id"
                  :label="item.exchangeRateKind"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="exchange" label="汇率" />
          <el-table-column prop="total" label="合计" />
        </el-table>
        <h6 />
        <h6 />
        <h6>
          客户目标价<el-button
            type="primary"
            size="large"
            style="margin: 0px 20px"
            @click="targetPriceCalcul"
            v-havedone
            v-if="!isDisabled"
            >计算</el-button
          >
        </h6>
        <el-table :data="customerTargetPrice" border style="width: 100%">
          <el-table-column label="梯度">
            <template #default="{ row }">
              <el-text class="mx-1" size="large">{{ row.kv }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="产品名称" label="产品名称">
            <template #default="{ row }">
              <el-text class="mx-1" size="large">{{ row.product }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="目标价" label="目标价">
            <template #default="{ row }">
              <el-input v-model="row.targetPrice" :disabled="isDisabled" />
            </template>
          </el-table-column>
          <el-table-column prop="报价币种" label="报价币种">
            <template #default="{ row, $index }">
              <el-select
                v-model="row.currency"
                @change="(val) => cableTypeSelectChange(val, $index)"
                :disabled="isDisabled"
              >
                <el-option
                  v-for="item in state.ExchangeSelectOptions"
                  :key="item.id"
                  :label="item.exchangeRateKind"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="汇率" label="汇率">
            <template #default="{ row }">
              <!-- <el-text class="mx-1" size="large">{{ row.exchangeRate }}</el-text> -->
              <el-input v-model="row.exchangeRate" :disabled="isDisabled" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 商务需求 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="贸易方式:" prop="tradeMode">
              <el-select v-model="state.quoteForm.tradeMode" placeholder="Select" :disabled="isDisabled">
                <el-option
                  v-for="item in state.TradeMethodOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-input v-model="state.quoteForm.tradeMode" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售类型:" prop="salesType">
              <el-select v-model="state.quoteForm.salesType" placeholder="Select" :disabled="isDisabled">
                <el-option
                  v-for="item in state.salesTypeOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="付款方式:" prop="paymentMethod">
              <el-input v-model="state.quoteForm.paymentMethod" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="报价币种:" prop="currency">
              <el-select v-model="state.quoteForm.currency" placeholder="Select" @change="rateChange">
                <el-option
                  v-for="item in state.ExchangeSelectOptions"
                  :key="item.id"
                  :label="item.exchangeRateKind"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="6">
            <el-form-item label="客户目标价（整套）:" prop="customerTargetPrice">
              <el-input v-model="state.quoteForm.customerTargetPrice" oninput="value=value.replace(/[^0-9.]/g,'')" />
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="6">
            <el-form-item label="汇率:" prop="exchangeRate">
              <el-input v-model="state.quoteForm.exchangeRate" disabled />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="客户特殊性要求:" prop="customerSpecialRequest">
              <el-input
                type="textarea"
                :rows="10"
                v-model="state.quoteForm.customerSpecialRequest"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 其它 -->
      <el-card class="demand-apply__card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="运输方式:" prop="shippingType">
              <el-select v-model="state.quoteForm.shippingType" placeholder="Select" :disabled="isDisabled">
                <el-option
                  v-for="item in state.shippingTypeOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="包装方式:" prop="packagingType">
              <el-select v-model="state.quoteForm.packagingType" placeholder="Select" :disabled="isDisabled">
                <el-option
                  v-for="item in state.packagingTypeOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="核价要求完成时间:" prop="deadline">
              <el-date-picker
                type="date"
                placeholder="Pick a day"
                v-model="state.quoteForm.deadline"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目经理:" prop="projectManager" :disabled="isDisabled">
              <!-- <SearchPerson v-model="state.quoteForm.projectManager" /> -->
              <SearchDepartMentPerson
                v-model="state.quoteForm.projectManager"
                roleName="项目经理"
                :disabled="isDisabled"
              />

              <!-- <el-input :suffix-icon="Search" v-model="state.quoteForm.projectManager" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出口国家:" prop="country">
              <el-select v-model="state.quoteForm.country" placeholder="Select" :disabled="isDisabled">
                <el-option
                  v-for="item in state.countryOptions"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交货地点:" prop="placeOfDelivery">
              <el-input type="textarea" :rows="10" v-model="state.quoteForm.placeOfDelivery" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核价原因:" prop="reason">
              <el-input type="textarea" :rows="10" v-model="state.quoteForm.reason" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="sorFile">
              <el-upload
                v-model:file-list="fileList"
                :action="$baseUrl + 'api/services/app/FileCommonService/UploadFile'"
                :on-success="handleSuccess"
                :on-error="handleUploadError"
                :on-change="handleFileChange"
                multiple
                :on-progress="handleGetUploadProgress"
                show-file-list
                :disabled="isDisabled"
              >
                <el-button>SOR(中文版)文件上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          type="primary"
          size="large"
          style="float: right; margin: 20px 0"
          @click="save(refForm)"
          v-havedone
          :loading="saveloading"
          v-if="!isDisabled"
          >提交</el-button
        >
      </el-card>
    </el-form>
    <!-- <div class="demand-apply__step">
      <el-steps :active="1" direction="vertical">
        <el-step title="Step 1" description="Some description" />
        <el-step title="Step 2" description="Some description" />
        <el-step title="Step 3" description="Some description" />
      </el-steps>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, computed } from "vue"
import { productTypeMap, Pcs, YearListItem, updateFrequency } from "./data.type"
import getQuery from "@/utils/getQuery"
import { useRoute, useRouter } from "vue-router"
// import { Search } from "@element-plus/icons-vue"

import type { UploadProps, UploadUserFile } from "element-plus"

import _, { uniq, map } from "lodash"
import { saveApplyInfo, getExchangeRate, getPriceEvaluationStartData } from "./service"
import { getDictionaryAndDetail } from "@/api/dictionary"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
// import { SearchPerson } from "@/components/SearchPerson"
import { SearchDepartMentPerson } from "@/components/SearchDepartMentPerson"
import { handleGetUploadProgress, handleUploadError } from "@/utils/upload"

import dayjs from "dayjs"

//整个页面是否可以编辑
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  }
})
//客户目标价
var customerTargetPrice: any = ref([])
const options = [
  {
    value: "Option1",
    label: "卡宴"
  },
  {
    value: "Option2",
    label: "吉利"
  },
  {
    value: "Option3",
    label: "天马"
  },
  {
    value: "Option4",
    label: "小鹏"
  },
  {
    value: "Option5",
    label: "小米"
  }
]
const refForm = ref<FormInstance>()
interface Options {
  id: number
  displayName: string
}

const rules = reactive<FormRules>({
  projectName: [{ required: true, message: "请输入该值", trigger: "blur" }],
  projectCode: [{ required: true, message: "请输入该值", trigger: "blur" }],
  customerName: [{ required: true, message: "请输入该值", trigger: "blur" }],
  customerNature: [{ required: true, message: "请输入该值", trigger: "blur" }],
  country: [{ required: true, message: "请输入该值", trigger: "blur" }],
  //quotationType: [{ required: true, message: "请输入该值", trigger: "blur" }],//二开中去掉
  sopTime: [{ required: true, message: "请输入该值", trigger: "blur" }],
  projectCycle: [{ required: true, message: "请输入该值", trigger: "blur" }],
  allocationOfMouldCost: [{ required: true, message: "请输入该值", trigger: "blur" }],
  allocationOfFixtureCost: [{ required: true, message: "请输入该值", trigger: "blur" }],
  allocationOfEquipmentCost: [{ required: true, message: "请输入该值", trigger: "blur" }],
  //reliabilityCost: [{ required: true, message: "请输入该值", trigger: "blur" }],//二开中去掉
  //developmentCost: [{ required: true, message: "请输入该值", trigger: "blur" }],//二开中去掉
  landingFactory: [{ required: true, message: "请输入该值", trigger: "blur" }],
  tradeMode: [{ required: true, message: "请输入该值", trigger: "blur" }],
  salesType: [{ required: true, message: "请输入该值", trigger: "blur" }],
  paymentMethod: [{ required: true, message: "请输入该值", trigger: "blur" }],
  //currency: [{ required: true, message: "请输入该值", trigger: "blur" }],//二开中去掉
  //customerTargetPrice: [{ required: true, message: "请输入该值", trigger: "blur" }],//二开去掉
  customerSpecialRequest: [{ required: true, message: "请输入该值", trigger: "blur" }],
  shippingType: [{ required: true, message: "请输入该值", trigger: "blur" }],
  packagingType: [{ required: true, message: "请输入该值", trigger: "blur" }],
  placeOfDelivery: [{ required: true, message: "请输入该值", trigger: "blur" }],
  deadline: [{ required: true, message: "请输入该值", trigger: "blur" }],
  projectManager: [{ required: true, message: "请输入该值", trigger: "blur" }],
  sorFile: [{ required: true, message: "请上传SOR文件", trigger: "blur" }]
})

let userStorage = window.localStorage.getItem("user")
let userInfo: any = userStorage ? JSON.parse(userStorage) : {}
let isEdit = false //是否查看
let saveloading = ref(false)
const getRowSum = (row: any, key?: string, childkey?: string) => {
  if (Array.isArray(row[key || "pcsYearList"]) && row[key || "pcsYearList"].length > 0) {
    return row[key || "pcsYearList"]
      .map((item: any) => item[childkey || "quantity"])
      .reduce((prev: any, curr: any) => Number(prev) + Number(curr))
  }
}

const kvPricingData = ref<any>([])
const shareCountTable = ref<any>([])

const state = reactive({
  taebleLoading: false,
  quoteForm: {
    isHasNre: false,
    isHasGradient: null,
    title: "" as any, //标题
    drafter: "", //拟稿人
    drafterNumber: null, //拟稿人工号
    draftingDepartment: "", //拟稿部门
    draftingCompany: "", //拟稿公司
    draftDate: new Date(), //拟稿日期
    number: "", //单据编号
    projectName: "", //项目名称
    projectCode: "", //项目代码
    customerName: "", //客户名称
    customerNature: "", //客户类别
    country: "", //
    terminalName: "", //终端名称
    terminalNature: "", //终端性质
    //quotationType: "",//二开中去掉
    // sampleQuotationType: "测试mock",
    sopTime: dayjs(new Date()).format("YYYY"), //Sop时间
    projectCycle: 0, //项目周期(年)
    updateFrequency: updateFrequency.Year, //价格有效期(二开新增属性)
    kValue: 0, //走量系数K
    pcs: [] as any, //终端走量(PCS)
    sample: [] as any, //样品
    modelCount: [] as any, //模组数量
    requirement: [] as any, //要求
    customerTargetPrice: [] as any, //客户目标价(二开新增)
    allocationOfMouldCost: true, //模具费分摊
    allocationOfFixtureCost: true, //治具费分摊
    frockCost: true, //工装费分摊(二开新增属性)
    fixtureCost: true, //检具费用分摊(二开新增属性)
    experimentCost: true, //实验费分摊(二开新增属性)
    testCost: true, //测试软件费分摊(二开新增属性)
    travelCost: true, //差旅费分摊(二开新增属性)
    otherCost: true, //其他费用分摊(二开新增属性)
    allocationOfEquipmentCost: true, //设备费分摊
    //reliabilityCost: true,//二开中去掉
    //developmentCost: true,//二开中去掉
    landingFactory: "", //落地工厂
    productInformation: [] as any, //产品信息
    tradeMode: "", //贸易方式
    salesType: "", //销售类型
    paymentMethod: "", //付款方式
    //currency: "",//二开去掉
    //customerTargetPrice: 0, //客户目标价(二开去掉)
    //exchangeRate: 0,//二开去掉
    customerSpecialRequest: "", //客户特殊要求
    shippingType: "", //运输方式
    packagingType: "", //包装方式
    placeOfDelivery: "", //交货地点
    deadline: new Date(), //要求核价完成时间
    projectManager: undefined, //项目经理
    sorFile: [] as any, //SOR附件上传
    reason: "", //核价原因
    quoteVersion: "", //核报价流程版本
    auditFlowId: null as any,
    priceEvalType: null, //核价类型(二开新增)
    isHasSample: false //是否包含样品核价(二开新增)
  },
  yearCols: [] as Number[],
  carAnnualTotal: 0, //列年度总量，把sum取出
  sumArr: [] as number[],
  customerNatureOptions: [] as unknown as Options[],
  terminalNatureOptions: [] as unknown as Options[],
  quotationTypeOptions: [] as unknown as Options[],
  sampleQuotationTypeOptions: [] as unknown as Options[],
  countryOptions: [] as unknown as Options[],
  productOptions: [] as unknown as Options[],
  productTypeOptions: [] as unknown as Options[],
  allocationOfMouldCostOptions: [] as unknown as Options[],
  allocationOfFixtureCostOptions: [] as unknown as Options[],
  allocationOfEquipmentCostOptions: [] as unknown as Options[],
  reliabilityCostOptions: [] as unknown as Options[],
  developmentCostOptions: [] as unknown as Options[],
  landingFactoryOptions: [] as unknown as Options[],
  salesTypeOptions: [] as unknown as Options[],
  currencyOptions: [] as unknown as Options[],
  shippingTypeOptions: [] as unknown as Options[],
  packagingTypeOptions: [] as unknown as Options[],
  TypeSelectOptions: [] as unknown as Options[],
  TradeMethodOptions: [] as unknown as Options[],
  ExchangeSelectOptions: [] as any,
  updateFrequencyOptions: [] as unknown as Options[],
  valenceTypeOptions: [] as unknown as Options[],
  isSpecimenOptions: [] as unknown as Options[],
  roleOptions: [
    { id: "1", displayName: "一供" },
    { id: "2", displayName: "二供" },
    { id: "3", displayName: "三供" },
    { id: "4", displayName: "四供" }
  ]
})

const getPcsTableDatSummaries = (param: any) => {
  const { columns, data: tempData } = param
  const sums: string[] = []
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = "合计"
      return
    }
    const values = tempData.map((_item: any) => {
      const val = eval("_item." + column.property)
      return Number(val)
    })
    if (!values.every((value: any) => Number.isNaN(value))) {
      sums[index] = `${values
        .reduce((prev: any, curr: any) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        .toFixed(2)
        .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")}`
    } else {
      sums[index] = ""
    }
  })

  return sums
}

// 车型模组合计
const moduleTableTotal = computed(() => {
  const flatData = _.cloneDeep(moduleTableDataV2.value.flat(Infinity))
  const filterData = uniq(map(flatData, (c) => c?.product))
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  shareCountTable.value = map(filterData, (item, index: number) => ({
    count: shareCountTable.value?.[index]?.count || 0,
    name: item
  })).filter((c) => !!c.name)
  const productName = new Map()

  flatData.forEach((item: any) => {
    const currentData = productName.get(item.product) || {}
    if (item.product && _.isEmpty(productName.get(`${item.product}-${item.pixel}-${item.productType}`))) {
      productName.set(`${item.product}-${item.pixel}-${item.productType}`, {
        ...item,
        productType: [item.productType],
        role: [item.role]
      })
    }

    if (
      currentData?.product &&
      currentData?.product === item?.product &&
      currentData?.pixel === item?.pixel &&
      currentData?.productType === item?.productType
    ) {
      const carModal = compareString(currentData.carModel, item.carModel)
      productName.set(`${item.product}-${item.pixel}-${item.productType}`, {
        ...currentData,
        carModal,
        partNumber: compareString(currentData.partNumber, item.partNumber),
        code: compareString(currentData.code, item.code),
        productType: compareString(currentData.productType, item.productType),
        role: compareString(currentData.role, item.role),
        pixel: compareString(currentData.pixel, item.pixel),
        marketShare: compareString(currentData.marketShare, item.marketShare),
        moduleCarryingRate: (currentData.moduleCarryingRate += item.moduleCarryingRate || 0),
        singleCarProductsQuantity: (currentData.singleCarProductsQuantity += item.singleCarProductsQuantity || 0),
        modelTotal: (currentData.modelTotal += item.modelTotal || 0),
        modelCountYearList: currentData.modelCountYearList.map((m: any, i: number) => {
          const modalCountYearItem: any = item.modelCountYearList[i] || {}
          return {
            ...m,
            quantity: (m.quantity += modalCountYearItem?.quantity || 0)
          }
        })
      })
    }
  })

  const filterProductModuleTotal = [...productName.values()]

  console.log(filterProductModuleTotal, "[productName]")
  return filterProductModuleTotal
})

const gradientModelTable = ref<any>([])

const fileList = ref<UploadUserFile[]>([])
const yearCount = ref(0)
let route = useRoute()
let router = useRouter()
const pcsYearQuantitySum = (row: Pcs, count: number) => {
  var numReg = /[^\d]/g
  var numRe = new RegExp(numReg)
  let rowSum = 0
  row.pcsYearList.forEach((item: any, index: number) => {
    if (numRe.test(item.quantity) && count == index) {
      ElMessage.warning("不能输入小数以及特殊符号!")
      item.quantity = 0
    }
    rowSum = rowSum + Number(item.quantity)
  })
  row.rowSum = rowSum
}

const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return ""
  }
}

const save = async (formEl: FormInstance | undefined) => {
  let { auditFlowId } = route.query
  // 模组走量不能为0
  let isModuleTableDataQuantity = false
  moduleTableDataV2.value.forEach((row: any) => {
    row.forEach((prop: any) => {
      prop.modelCountYearList.forEach((item: any) => {
        if (!item.quantity) {
          isModuleTableDataQuantity = true
        }
      })
    })
  })
  const isPass = pcsTableData.value.some((item: any) => {
    if (!item.carFactory || !item.carModel) return false
    return true
  })
  const isPassTwo = interiorPcsTableData.value.some((item: any) => {
    if (!item.carFactory || !item.carModel) return false
    return true
  })
  if (!isPass || !isPassTwo) {
    ElMessage({
      type: "error",
      message: "请填写完整的终端走量！"
    })
    return
  }
  if (isModuleTableDataQuantity) {
    ElMessage({
      type: "error",
      message: "模组走量不能为空！"
    })
    return
  }
  if (!formEl) return
  console.log(state.quoteForm.sorFile, "{state.quoteForm.sorFile}")
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      saveloading.value = true
      let { quoteForm } = state
      quoteForm.auditFlowId = auditFlowId ? Number(auditFlowId) : null //审批流程主ID
      quoteForm.sample = specimenData //样品
      console.log(interiorPcsTableData.value, "[interiorPcsTableData.value]")
      quoteForm.pcs = [...pcsTableData.value, ...interiorPcsTableData.value] //终端走量（PCS）
      let prop = _.cloneDeep(moduleTableDataV2.value.flat(Infinity))
      prop.forEach((item: any, index: number) => {
        item.order = ++index
      }) // 模组数量
      quoteForm.modelCount = prop
      console.log(quoteForm.modelCount, "quoteForm.modelCount")
      quoteForm.requirement = requireTableData // 要求
      quoteForm.productInformation = productTableData.value // 产品信息（下表【客户指定/供应详情】，根据此表内容生成，只作展示用，不填写）
      quoteForm.customerTargetPrice = customerTargetPrice // 客户目标价
      // state.quoteForm.sorFile = fileList.value.map((item: any) => item.response.result?.fileId) // SOR附件上传
      let gradientModel = map(gradientModelTable.value, (item: any) =>
        map(item.children, (v) => ({ ...v, type: v.type?.join(",") }))
      ).flat(2)
      try {
        let res: any = await saveApplyInfo({
          ...quoteForm,
          shareCount: shareCountTable.value,
          gradient: kvPricingData.value.map((v: any, index: number) => ({ ...v, index })),
          gradientModel
        })
        if (res.success) {
          ElMessage({
            type: "success",
            message: "保存成功"
          })
          router.push({
            path: "/todoCenter/index"
          })
          saveloading.value = false
        }
      } catch (error) {
        console.log(error, "[参数错误]")
        saveloading.value = false
      }
    } else {
      saveloading.value = false
      console.log("error submit!", fields)
      console.log(state.quoteForm, "quoteForm")
    }
  })
}

let specimenData: any = ref([
  {
    name: "",
    pcs: ""
  }
])
//终端走量（PCS）table
let pcsTableData: any = ref([
  {
    carFactory: "",
    carModel: "",
    pcsYearList: [] as YearListItem[],
    sum: 0,
    pcsType: 0 //走量类型
  }
])
let interiorPcsTableData: any = ref([
  {
    carFactory: "",
    carModel: "",
    pcsYearList: [] as YearListItem[],
    sum: 0,
    pcsType: 1 //走量类型
  }
])
//模组数量table
let moduleTableData: any = ref([
  {
    partNumber: "",
    code: "",
    product: "",
    productType: null,
    pixel: "",
    marketShare: 0,
    moduleCarryingRate: 0,
    singleCarProductsQuantity: 0,
    modelTotal: 0,
    modelCountYearList: [] as YearListItem[]
  }
])
//车型模组数量table
let moduleTableDataV2: any = ref<any[][]>([
  [
    {
      carModel: 0, // 车型
      partNumber: "",
      code: "",
      product: "",
      productType: null,
      pixel: "",
      marketShare: 0,
      moduleCarryingRate: 0,
      singleCarProductsQuantity: 0,
      modelTotal: 0,
      modelCountYearList: [] as YearListItem[]
    }
  ]
])

//要求
let requireTableData: any = ref([])

let productTableData: any = ref([
  {
    name: "",
    sensor: "",
    sensorTypeSelect: productTypeMap.recommend,
    sensorPrice: 0,
    lens: "",
    lensTypeSelect: productTypeMap.recommend,
    lensPrice: 0,
    isp: "",
    ispTypeSelect: productTypeMap.recommend,
    ispPrice: 0,
    serialChip: "",
    serialChipTypeSelect: productTypeMap.recommend,
    serialChipPrice: 0,
    cable: "",
    cableTypeSelect: productTypeMap.recommend,
    cablePrice: 0,
    other: "",
    otherTypeSelect: productTypeMap.recommend,
    otherPrice: 0,
    manufactureProcess: "",
    installationPosition: "",
    product: ""
  }
])

let specifyTableData: any = ref([])
const addPCS = () => {
  // let newLine = {
  //   carFactory: "",
  //   carModel: "",
  //   pcsYearList: [] as YearListItem[],
  //   sum: 0
  // }
  pcsTableData.value.push(_.cloneDeep(pcsTableData.value[0]))
  interiorPcsTableData.value.push(_.cloneDeep(interiorPcsTableData.value[0]))
  // pcsTableData.push(Object.assign({}, _.cloneDeep(pcsTableData[0]), newLine))
}
const addSpecimen = () => {
  specimenData.value.push({
    name: "",
    pcs: ""
  })
}
const addProduct = (index: number) => {
  // if (!index) {
  //   let newLineP = {
  //     name: "",
  //     sensor: "",
  //     sensorTypeSelect: "1",
  //     sensorPrice: 0,
  //     lens: "",
  //     lensTypeSelect: "1",
  //     lensPrice: 0,
  //     isp: "",
  //     ispTypeSelect: "1",
  //     ispPrice: 0,
  //     serialChip: "",
  //     serialChipTypeSelect: "1",
  //     serialChipPrice: 0,
  //     cable: "",
  //     cableTypeSelect: "1",
  //     cablePrice: 0,
  //     other: "",
  //     otherTypeSelect: "1",
  //     otherPrice: 0,
  //     manufactureProcess: "",
  //     installationPosition: ""
  //   }
  //   productTableData.value.push(newLineP)
  // }

  // let moduleTableDataNew = Object.assign(_.cloneDeep(moduleTableData.value[0]), {
  //   partNumber: "",
  //   product: "",
  //   productType: null,
  //   marketShare: 0,
  //   moduleCarryingRate: 0,
  //   singleCarProductsQuantity: 0,
  //   modelTotal: 0
  // })
  // moduleTableDataNew.modelCountYearList.forEach((item: any) => {
  //   item.quantity = ""
  // })
  // moduleTableDataNew.productType = state.productTypeOptions[0]?.id
  // moduleTableData.value.push(moduleTableDataNew)
  // 每次执行添加都对模组上的产品名称进行复制
  // productTableData.value.forEach((item: any, index: any) => {
  //   item.name = moduleTableData.value[index].product
  //   item.product = moduleTableData.value[index].product
  // })
  let modelCountYear = state.yearCols.map((item, index) => {
    return {
      year: item,
      quantity: null,
      upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1
    }
  })
  let carModelVal = moduleTableDataV2.value[index][0].carModel
  var prop = {
    carModel: carModelVal, //车型
    partNumber: "",
    code: "",
    product: "",
    productType: null,
    pixel: "",
    marketShare: 0,
    moduleCarryingRate: 0,
    singleCarProductsQuantity: 0,
    modelTotal: 0,
    modelCountYearList: modelCountYear
  }

  moduleTableDataV2.value[index].push(_.cloneDeep(prop))
}

const yearChange = (val: number) => {
  yearCount.value = val
  let i = state.quoteForm.projectCycle
  state.yearCols = []
  state.quoteForm.sopTime
  for (let j = 0; j < i; j++) {
    if (state.quoteForm.updateFrequency == updateFrequency.HalfYear)
      state.yearCols.push(Number(state.quoteForm.sopTime) + j)
    state.yearCols.push(Number(state.quoteForm.sopTime) + j)
  }
  // console.log(state.yearCols, "state.yearCols ")
}

const yearNote = (index: number) => {
  if (state.quoteForm.updateFrequency != updateFrequency.HalfYear) return "年"
  if (index % 2) {
    return "年下"
  } else {
    return "年上"
  }
}

// 监听年数的变化，对应表格赋值年份
watch(
  () => state.yearCols,
  (val) => {
    if (isEdit) return
    pcsTableData.value.forEach((row: any) => {
      row.pcsYearList = val.map((item: any, index: number) => {
        return {
          year: item,
          quantity: null,
          upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1
        }
      })
    })
    interiorPcsTableData.value.forEach((row: any) => {
      row.pcsYearList = val.map((item: any, index: number) => {
        return {
          year: item,
          quantity: null,
          upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1
        }
      })
    })
    moduleTableData.value.forEach((row: any) => {
      row.modelCountYearList = val.map((item: any, index: number) => {
        return {
          year: item,
          quantity: null,
          upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1
        }
      })
    })
    moduleTableDataV2.value.forEach((row: any) => {
      row.forEach((irow: any) => {
        irow.modelCountYearList = val.map((item: any, index: number) => {
          return {
            year: item,
            quantity: 0,
            upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1
          }
        })
      })
    })
    // 要求表格动态加载行数
    requireTableData.value.splice(0, requireTableData.value.length)
    val.forEach((year: any, index: number) => {
      let pro = year
      requireTableData.value.push({
        year: pro,
        upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1,
        annualDeclineRate: 0,
        annualRebateRequirements: 0,
        oneTimeDiscountRate: 0,
        commissionRate: 0
      })
    })
  }
)
//同步产品名称
// watch(
//   moduleTableData,
//   (val) => {
//     val.forEach((item: any, index: any) => {
//       // 同步带入下面表格的名称
//       productTableData.value[index].name = item.product
//       productTableData.value[index].product = item.product
//       moduleTableData.value.forEach((row: any) => {
//         row.modelCountYearList.forEach((item: any, index: any) => {
//           if (row.marketShare && row.moduleCarryingRate && row.singleCarProductsQuantity && state.sumArr[index]) {
//             item.quantity = Math.round(
//               (row.marketShare * row.moduleCarryingRate * row.singleCarProductsQuantity * state.sumArr[index]) / 10000
//             )
//           }
//         })
//       })
//       if (item.marketShare && item.moduleCarryingRate && item.singleCarProductsQuantity && state.carAnnualTotal) {
//         item.modelTotal = Math.round(
//           (item.marketShare * item.moduleCarryingRate * item.singleCarProductsQuantity * state.carAnnualTotal) / 10000
//         )
//       }
//     })
//   },
//   { deep: true }
// )
//监听终端走量同步内部评估后的终端走量
watch(
  () => pcsTableData.value,
  (val, _old) => {
    const rowOneData = map(val[0].pcsYearList, (v: any) => ({
      ...v,
      quantity: Number(v.quantity || 0) * state.quoteForm.kValue
    }))
    console.log(rowOneData, "[rowOneDataOne]")
    val.forEach((item: any, index: number) => {
      var itemNew = _.cloneDeep(item)
      itemNew.pcsType = 1
      itemNew.pcsYearList.forEach((pro: any, i: number) => {
        pro.quantity = Math.floor(Number(pro.quantity || 0) * state.quoteForm.kValue)
        const rowOneItem = rowOneData[i]
        if (index > 0) {
          rowOneItem.quantity += Number(pro.quantity)
        }
      })
      interiorPcsTableData.value[index] = itemNew
    })
    moduleTableDataV2.value.forEach((moduleTable: any) => {
      moduleTable?.forEach((moduleItem: any) => {
        moduleItem?.modelCountYearList?.forEach((pscY: any, pscYIndex: number) => {
          const { quantity } = rowOneData[pscYIndex] || {}
          pscY.quantity = Math.floor(
            (moduleItem.moduleCarryingRate / 100) *
              moduleItem.singleCarProductsQuantity *
              moduleItem.marketShare *
              quantity
          )
        })
      })
    })
    console.log(moduleTableDataV2.value, "{moduleTableDataV2.value}")
  },
  { deep: true }
)
//系数
watch(
  () => state.quoteForm.kValue,
  (val) => {
    pcsTableData.value.forEach((item: any, index: number) => {
      let itemNew = JSON.parse(JSON.stringify(item))
      // itemNew.kv = item.kv * val
      itemNew.pcsType = 1
      itemNew.pcsYearList.forEach((pro: any) => {
        pro.quantity = Math.floor(pro.quantity * val)
      })
      interiorPcsTableData.value[index] = itemNew
    })
  },
  { deep: true }
)
//监听终端走量的车型
watch(
  () => interiorPcsTableData.value.map((item: any) => item.carModel),
  (val, _old) => {
    console.log(val, "val123")
    let modelCountYear = state.yearCols.map((item: any, index: number) => {
      return {
        year: item,
        quantity: null,
        upDown: state.quoteForm.updateFrequency != updateFrequency.HalfYear ? 0 : index % 2 ? 2 : 1
      }
    })
    val.forEach((item: any, index: number) => {
      if (moduleTableDataV2.value[index]) {
        moduleTableDataV2.value[index]?.forEach((pr: any) => {
          pr.carModel = item
        })
      } else {
        var prop = [
          {
            carModel: item, //车型
            partNumber: "",
            code: "",
            product: "",
            productType: null,
            pixel: "",
            marketShare: 0,
            moduleCarryingRate: 0,
            singleCarProductsQuantity: 0,
            modelTotal: 0,
            modelCountYearList: modelCountYear
          }
        ]
        moduleTableDataV2.value[index] = _.cloneDeep(prop)
      }
    })
    console.log("difference", moduleTableDataV2.value)
  },
  { deep: true }
)
//监听产品信息第一行
watch(
  () => customerTargetPrice.value[0],
  (val) => {
    customerTargetPrice.value.forEach((item: any, index: number) => {
      if (index) {
        item.currency = val.currency
        item.exchangeRate = val.exchangeRate
      }
    })
  },
  { deep: true }
)

watch(
  () => [state.quoteForm.isHasGradient, moduleTableTotal.value],
  (val) => {
    const isHasGradient = val[0]
    const moduleTableTotalData = val[1]
    if (!isHasGradient && !_.isEmpty(moduleTableTotalData)) {
      const rowOne = moduleTableTotal.value[0]
      const yearTotal = state.yearCols.length
      const countData = rowOne.modelCountYearList.map((item: any) => item.quantity || 0)
      const totalData = countData.reduce((a: number, b: number) => a + b)
      kvPricingData.value = [{ gradientValue: Number((totalData / yearTotal).toFixed(2)) }]
    }
  }
)

watch(
  () => [moduleTableTotal.value, map(kvPricingData.value, (v: any) => v.gradientValue)],
  (val) => {
    const [moduleTableTotalData, kvList] = val
    console.log(kvList, "kvList")
    if (kvPricingData.value.length && !_.isEmpty(moduleTableTotalData)) {
      let filterData = _.cloneDeep(kvList)

      filterData = filterData.map((item: any) => {
        return {
          kv: item,
          children: map(moduleTableTotalData, (c, index: number) => ({
            gradientValue: item,
            index,
            name: c.product,
            number: c.partNumber,
            code: c.code,
            type: c.productType,
            gradientModelYear: map(c.modelCountYearList, (y) => ({ year: y.year, count: item }))
          }))
        }
      })
      console.log(filterData, "[filterDatafilterData]")
      gradientModelTable.value = filterData
    }
  }
)

const compareString = (a: string, b: string) => {
  if (_.isArray(a)) {
    return uniq([...(a || []), b]).filter((v) => !!v)
  } else if (a === b) {
    return [a]
  }
  return [a, b]
}

const targetPriceCalcul = () => {
  customerTargetPrice.value.forEach((item: any) => {
    item.targetPrice = 0
    customerTargetPrice.value
      .filter((pro: any) => pro.carModel === item.carModel)
      .forEach((customerTarget: any) => {
        moduleTableDataV2.value.forEach((moduleTable: any) => {
          let value = moduleTable.filter((p: any) => p.carModel == customerTarget.carModel)
          value.forEach((valueitem: any) => {
            if (valueitem.product == customerTarget.product) {
              item.targetPrice += customerTarget.targetPrice * valueitem.singleCarProductsQuantity
            }
          })
        })
      })
  })
}

const price = (row: any) => {
  let modelTotal = 0
  row.modelCountYearList.forEach((item: any) => {
    modelTotal += item.quantity
  })
  return modelTotal
}

const productChange = (_value: string) => {
  let product: any = []
  moduleTableDataV2.value.forEach((item: any) => {
    product.push(item.map((p: any) => p.product))
  })
  product = [...new Set(product.reduce((prev: any, curr: any) => prev.concat(curr), []))]
  product.forEach((item: any, index: number) => {
    if (productTableData.value[index]) {
      productTableData.value[index].name = item
      productTableData.value[index].product = item
    } else {
      let newLineP = {
        product: item,
        name: item,
        sensor: "",
        sensorTypeSelect: productTypeMap.recommend,
        sensorPrice: 0,
        lens: "",
        lensTypeSelect: productTypeMap.recommend,
        lensPrice: 0,
        isp: "",
        ispTypeSelect: productTypeMap.recommend,
        ispPrice: 0,
        serialChip: "",
        serialChipTypeSelect: productTypeMap.recommend,
        serialChipPrice: 0,
        cable: "",
        cableTypeSelect: productTypeMap.recommend,
        cablePrice: 0,
        other: "",
        otherTypeSelect: productTypeMap.recommend,
        otherPrice: 0,
        manufactureProcess: "",
        installationPosition: ""
      }
      productTableData.value.push(newLineP)
    }
  })
}

const deleteProduct = (i: number, y: number) => {
  moduleTableDataV2.value[i].splice(y, 1)
}

const deletePcs = (i: number) => {
  pcsTableData.value.splice(i, 1)
  //删除模组数量中的数据
  moduleTableDataV2.value.splice(i, 1)
  //删除内部评估后终端走量
  interiorPcsTableData.value.splice(i, 1)
}
const deleteSpecimen = (index: number) => {
  specimenData.value.splice(index, 1)
}
const handleSuccess: UploadProps["onSuccess"] = (res: any) => {
  console.log(res)
  let { quoteForm } = state
  if (res.success) {
    quoteForm.sorFile = fileList.value.map((item: any) => item.response.result.fileId)
    ElMessage({
      message: "上传成功",
      type: "success"
    })
  }
}
const handleFileChange: UploadProps["onChange"] = (_file, uploadFiles) => {
  console.log(uploadFiles)
  console.log(fileList, "handleFileChange")
}

const syncModuleTableDataV2 = (_index: number) => {
  const temp = _.cloneDeep(moduleTableDataV2.value[0] || {})
  console.log(temp, "syncModuleTableDataV2")
  moduleTableDataV2.value = moduleTableDataV2.value.map((val: any, i: number, _arr: any[]) => {
    if (i !== 0) {
      return map(temp, (item) => ({ ...item, carModel: val[0].carModel }))
    }
    return val
  })
}

const generateTitle = () => {
  let { quoteForm } = state
  let nowDate = dayjs(quoteForm.draftDate ? quoteForm.draftDate : new Date()).format("YYYY-MM-DD")
  let userDepartment = quoteForm.draftingDepartment
  let title = `${nowDate + userDepartment}关于${
    quoteForm.customerName + quoteForm.projectName + "第" + state.quoteForm.quoteVersion + "版"
  }的核价报价申请`
  state.quoteForm.title = title
}
const generateCustomTable = () => {
  specifyTableData.value.splice(0, specifyTableData.value.length) // 清空数据
  productTableData.value.forEach((item: any) => {
    if (item.sensorTypeSelect !== productTypeMap.recommend) {
      let price = item.sensorPrice
      let productName = item.name
      let main = "sensor"
      let type = item.sensor
      let productType = TypeSelectDisplayName(item.sensorTypeSelect)
      let currency = item.sensorCurrency
      let exchange = item.sensorExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.lensTypeSelect !== productTypeMap.recommend) {
      let price = item.lensPrice
      let productName = item.name
      let main = "lens"
      let type = item.lens
      let productType = TypeSelectDisplayName(item.lensTypeSelect)
      let currency = item.lensCurrency
      let exchange = item.lensExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.ispTypeSelect !== productTypeMap.recommend) {
      let price = item.ispPrice
      let productName = item.name
      let main = "isp"
      let type = item.isp
      let productType = TypeSelectDisplayName(item.ispTypeSelect)
      let currency = item.ispCurrency
      let exchange = item.ispExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.serialChipTypeSelect !== productTypeMap.recommend) {
      let price = item.serialChipPrice
      let productName = item.name
      let main = "serialChip"
      let type = item.serialChip
      let productType = TypeSelectDisplayName(item.serialChipTypeSelect)
      let currency = item.serialChipCurrency
      let exchange = item.serialChipExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.cableTypeSelect !== productTypeMap.recommend) {
      let price = item.cablePrice
      let productName = item.name
      let main = "线缆"
      let type = item.cable
      let productType = TypeSelectDisplayName(item.cableTypeSelect)
      let currency = item.cableCurrency
      let exchange = item.cableExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
    if (item.otherTypeSelect !== productTypeMap.recommend) {
      let price = item.otherPrice
      let productName = item.name
      let main = "其它"
      let type = item.other
      let productType = TypeSelectDisplayName(item.otherTypeSelect)
      let currency = item.otherCurrency
      let exchange = item.otherExchangeRate
      let total = price * exchange
      specifyTableData.value.push({
        price,
        productName,
        main,
        type,
        productType,
        currency,
        exchange,
        total
      })
    }
  })
}

const TypeSelectDisplayName = (label: string) => {
  if (label == productTypeMap.recommend) {
    return "我司推荐"
  } else if (label == productTypeMap.cspecify) {
    return "客户指定"
  } else if (label == productTypeMap.csupply) {
    return "客户供应"
  } else if (label == productTypeMap.cask) {
    return "客户要求"
  } else {
    return "非有效标识"
  }
}

const customerTargetPriceTable = () => {
  //客户目标价
  {
    customerTargetPrice.value = []
    //获取所有梯度
    let gradientAll = kvPricingData.value.map((item: any) => item.gradientValue)
    gradientAll.forEach((item: any) => {
      //获取所有产品名称
      let productAll: string[] = []
      moduleTableDataV2.value.forEach((moduleTable: any) => {
        let value = moduleTable.filter((p: any) => p.gradientValue == item)
        value.forEach((valueitem: any) => {
          productAll.push(valueitem.product)
        })
      })
      productAll = [...new Set(productAll)]
      //判断产品名称中是否 前视 测试 后视 都在
      let isproductName = productAll.every(
        (_item: any) => productAll.includes("前视") && productAll.includes("侧视") && productAll.includes("后视")
      )
      productAll.forEach((pro: any) => {
        let prop = {
          kv: item, //梯度
          product: pro,
          targetPrice: 0,
          currency: null,
          exchangeRate: 0
        }
        customerTargetPrice.value.push(prop)
      })
      if (isproductName) {
        customerTargetPrice.value.push({
          kv: item, //梯度
          product: "齐套",
          targetPrice: 0,
          currency: null,
          exchangeRate: 0
        })
      }
    })
  }
  generateCustomTable()
}

const setNumber = () => {
  let { quoteForm } = state
  let nowDate = dayjs(quoteForm.draftDate ? quoteForm.draftDate : new Date()).format("YYYYMMDD")
  let number = "BJHJ-ZL" + nowDate + "-001"
  quoteForm.number = number
}
// const rateChange = (val: any) => {
//   // state.quoteForm.exchangeRate = 0
//   state.ExchangeSelectOptions.forEach((item: any) => {
//     if (item.id === val) {
//       item.exchangeRateValue.forEach((yearItem: any) => {
//         if (yearItem.year === Number(state.quoteForm.sopTime)) {
//           state.quoteForm.exchangeRate = yearItem.value
//         }
//       })
//     }
//   })
// }
const cableTypeSelectChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          customerTargetPrice.value[index].exchangeRate = yearItem.value
        }
      })
    }
  })
}
const SensorChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          productTableData.value[index].sensorExchangeRate = yearItem.value
        }
      })
    }
  })
}
const LensChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          productTableData.value[index].lensExchangeRate = yearItem.value
        }
      })
    }
  })
}
const ISPChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          productTableData.value[index].ispExchangeRate = yearItem.value
        }
      })
    }
  })
}
const serialChipPriceChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          productTableData.value[index].serialChipExchangeRate = yearItem.value
        }
      })
    }
  })
}
const cableTypeChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          productTableData.value[index].cableExchangeRate = yearItem.value
        }
      })
    }
  })
}
const ledTypeSelectChange = (val: any, index: number) => {
  state.ExchangeSelectOptions.forEach((item: any) => {
    if (item.id === val) {
      item.exchangeRateValue.forEach((yearItem: any) => {
        if (yearItem.year === Number(state.quoteForm.sopTime)) {
          productTableData.value[index].otherExchangeRate = yearItem.value
        }
      })
    }
  })
}

onMounted(async () => {
  let query = getQuery()
  state.quoteForm.projectName = query.projectName ? query.projectName + "" : ""
  state.quoteForm.projectCode = query.projectCode ? query.projectCode + "" : ""
  state.quoteForm.quoteVersion = query.quoteVersion ? query.quoteVersion + "" : ""
  state.quoteForm.drafter = userInfo.name
  state.quoteForm.drafterNumber = userInfo.userNumber || "未成功获取"
  state.quoteForm.draftingCompany = userInfo.userCompany?.name || "未成功获取"
  state.quoteForm.draftingDepartment = userInfo.userDepartment?.name || "未成功获取"
  state.taebleLoading = true
  // 设置单据编号
  setNumber()
  try {
    let UpdateFrequency: any = await getDictionaryAndDetail("UpdateFrequency") //价格有效期
    state.updateFrequencyOptions = UpdateFrequency.result?.financeDictionaryDetailList

    let priceEvalType: any = await getDictionaryAndDetail("PriceEvalType") //核价类型
    state.valenceTypeOptions = priceEvalType.result?.financeDictionaryDetailList

    let isHasSample: any = await getDictionaryAndDetail("SampleName") //核价类型
    state.isSpecimenOptions = isHasSample.result?.financeDictionaryDetailList

    let customerNature: any = await getDictionaryAndDetail("CustomerNature") //客户性质
    state.customerNatureOptions = customerNature.result.financeDictionaryDetailList

    let terminalNature: any = await getDictionaryAndDetail("TerminalNature") //终端性质
    state.terminalNatureOptions = terminalNature.result.financeDictionaryDetailList

    // let quotationType: any = await getDictionaryAndDetail("QuotationType") //报价形式
    // state.quotationTypeOptions = quotationType.result.financeDictionaryDetailList

    let country: any = await getDictionaryAndDetail("Country") // 出国国家
    state.countryOptions = country.result.financeDictionaryDetailList

    let productType: any = await getDictionaryAndDetail("ProductType") // 产品小类
    state.productTypeOptions = productType.result.financeDictionaryDetailList
    // moduleTableDataV2.value[0].productType = state.productTypeOptions[0]?.id

    let landingFactory: any = await getDictionaryAndDetail("LandingFactory") //落地工厂
    state.landingFactoryOptions = landingFactory.result.financeDictionaryDetailList

    let salesType: any = await getDictionaryAndDetail("SalesType") //销售类型
    state.salesTypeOptions = salesType.result.financeDictionaryDetailList

    // let currency: any = await getDictionaryAndDetail("Currency") //报价币种
    // state.currencyOptions = currency.result.financeDictionaryDetailList

    let shippingType: any = await getDictionaryAndDetail("ShippingType") //运输方式
    state.shippingTypeOptions = shippingType.result.financeDictionaryDetailList

    let packagingType: any = await getDictionaryAndDetail("PackagingType") //包装方式
    state.packagingTypeOptions = packagingType.result.financeDictionaryDetailList

    let typeSelect: any = await getDictionaryAndDetail("TypeSelect") //类型
    state.TypeSelectOptions = typeSelect.result.financeDictionaryDetailList
    console.log(state.TypeSelectOptions, "state.TypeSelectOptions")
    let tradeMethodSelect: any = await getDictionaryAndDetail("TradeMethod") //类型
    state.TradeMethodOptions = tradeMethodSelect.result.financeDictionaryDetailList

    let exchangeSelect: any = await getExchangeRate({
      maxResultCount: 100,
      skipCount: 0
    })
    state.ExchangeSelectOptions = exchangeSelect.result.items
  } catch (error) {
    console.log(error)
  }
  if (query.auditFlowId) {
    // 查看
    let viewDataRes: any = await getPriceEvaluationStartData(query.auditFlowId)
    if (viewDataRes.result) {
      isEdit = true
      state.quoteForm = viewDataRes.result
      const sopTime: any = [viewDataRes.result.sopTime]
      state.quoteForm.sopTime = dayjs(sopTime).format("YYYY")
      pcsTableData.value = viewDataRes.result.pcs.filter((item: any) => item.pcsType == 0) //终端走量（PCS）
      yearChange(viewDataRes.result.projectCycle)

      productTableData.value = viewDataRes.result.productInformation
      shareCountTable.value = viewDataRes.result.shareCount
      gradientModelTable.value = viewDataRes.result.gradientModel
      moduleTableDataV2.value = Object.values(
        viewDataRes.result.modelCount.reduce((result: any, item: any) => {
          if (!result[item.carModel]) {
            result[item.carModel] = []
          }
          result[item.carModel].push(item)
          return result
        }, {})
      )
      requireTableData.value = viewDataRes.result.requirement // 要求
      specimenData.value = viewDataRes.result.sample //样品
      customerTargetPrice.value = viewDataRes.result.customerTargetPrice // 客户目标价
      fileList.value = viewDataRes.result.files.map((item: any) => {
        return {
          name: item.fileName,
          // url: item.fileId
          response: {
            result: {
              fileId: item.fileId
            }
          }
        }
      })
      generateCustomTable()
    }

    // 查看之后还需要编辑 --
    setTimeout(() => {
      isEdit = false
    }, 2000)
  }
  state.taebleLoading = false
})

const handleChangekvPricingData = (type: string, index?: number) => {
  if (type === "add") {
    kvPricingData.value.push({ gradientValue: 0, index: 0 })
  } else {
    kvPricingData.value = kvPricingData.value.splice(index, 1)
  }
}

defineExpose({
  ...toRefs(state)
})
</script>

<style lang="scss" scoped>
.demand-apply {
  padding: 10px;

  &__step {
    margin: 20px 0;
    height: 400px;
  }

  &__card {
    margin: 10px 0;
  }

  &__mass-production-table {
    margin: 20px 0;
  }

  &__btn-container {
    height: 60px;
    position: relative;
  }

  &__add-btn {
    position: absolute;
    right: 0px;
    top: 15px;
  }
}
</style>
