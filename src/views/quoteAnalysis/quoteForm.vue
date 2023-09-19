<!-- 报价单 -->
<template>
  <div>
    <el-card>
      <el-button type="primary" @click="downLoad" mb-20px float-right>下载报价单</el-button>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="客户名称">
          {{ data.form.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="报价单位">
          <!-- {{ data.form.customerAdd }} -->
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ data.form.customerAdd }}
        </el-descriptions-item>
        <el-descriptions-item label="地址（报价单位）">
          {{ data.form.quotationAdd }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          <el-input v-model="data.form.customerLink" />
        </el-descriptions-item>
        <el-descriptions-item label="联系人">
          <el-input v-model="data.form.quotationLink" />
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          <el-input v-model="data.form.customerNum" />
        </el-descriptions-item>
        <el-descriptions-item label="电话">
          <el-input v-model="data.form.quotationNum" />
        </el-descriptions-item>
        <el-descriptions-item label="项目名称">
          <el-input v-model="data.form.projectName" />
        </el-descriptions-item>
        <el-descriptions-item label="项目生命周期">
          <el-input v-model="data.form.projectCycle" />
        </el-descriptions-item>
        <el-descriptions-item label="项目SOP时间">
          <el-input v-model="data.form.sopTime" />
        </el-descriptions-item>
        <el-descriptions-item label="报价币种">
          <el-input v-model="data.form.currency" />
        </el-descriptions-item>
        <el-descriptions-item label="项目走量信息">
          <el-table :data="data.form.sopls" style="width: 100%" border height="500px">
            <el-table-column prop="year" label="年份" />
            <el-table-column prop="value" label="走量" />
            <el-table-column prop="sopValue" label="sop走量" />
            <el-table-column prop="fullValue" label="全周期走量" />
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item label="报价清单">
          <el-table :data="data.form.mxs" style="width: 100%" border height="500px">
            <el-table-column type="index" label="年份" />
            <el-table-column prop="productName" label="产品名称" />
            <el-table-column prop="year" label="年份" />
            <el-table-column prop="amout" label="数量" />
            <el-table-column prop="unitPrice" label="单价" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { getDownloadMessage } from "./service"
const data = reactive({
  form: {
    sopls: [
      {
        year: 2024,
        value: 11,
        sopValue: 0,
        fullValue: 0
      },
      {
        year: 2025,
        value: 11,
        sopValue: 0,
        fullValue: 0
      },
      {
        year: 2026,
        value: 11,
        sopValue: 0,
        fullValue: 0
      }
    ],
    mxs: [
      {
        productName: "后视",
        year: "2024",
        amout: 4,
        unitPrice: 0,
        remark: null
      },
      {
        productName: "侧前",
        year: "2024",
        amout: 4,
        unitPrice: 0,
        remark: null
      },
      {
        productName: "侧后",
        year: "2024",
        amout: 4,
        unitPrice: 0,
        remark: null
      },
      {
        productName: "前视",
        year: "2024",
        amout: 4,
        unitPrice: 0,
        remark: null
      }
    ],
    customerName: "理想",
    customerAdd: null,
    customerLink: null,
    customerNum: null,
    quotationName: null,
    quotationAdd: null,
    quotationLink: null,
    quotationNum: null,
    projectCycle: 3,
    projectName: "流程测试OK，测试数据1",
    sopTime: 2024,
    currency: 0
  },
  auditFlowId: 0
})

const downLoad = async () => {
  let res: any = await getDownloadMessage(data.auditFlowId, "报价单")
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
}
</script>
<style scoped></style>
