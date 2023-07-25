<script lang="ts" setup>
import { SheetComponent } from "@antv/s2-vue";
import { defineComponent, shallowRef, reactive, PropType } from "vue";
import "@antv/s2-vue/dist/style.min.css";

const data = [{"province":"浙江","city":"杭州","type":"笔","price":1},{"province":"浙江","city":"杭州","type":"纸张","price":2},{"province":"浙江","city":"舟山","type":"笔","price":17},{"province":"浙江","city":"舟山","type":"纸张","price":6},{"province":"吉林","city":"长春","type":"笔","price":8},{"province":"吉林","city":"白山","type":"笔","price":12},{"province":"吉林","city":"长春","type":"纸张","price":3},{"province":"吉林","city":"白山","type":"纸张","price":25},{"province":"浙江","city":"杭州","type":"笔","price":20},{"province":"浙江","city":"杭州","type":"纸张","price":10},{"province":"浙江","city":"舟山","type":"笔","price":15},{"province":"浙江","city":"舟山","type":"纸张","price":2},{"province":"吉林","city":"长春","type":"笔","price":15},{"province":"吉林","city":"白山","type":"笔","price":30},{"province":"吉林","city":"长春","type":"纸张","price":40},{"province":"吉林","city":"白山","type":"纸张","price":50}]

// 2. 配置数据
const s2DataCfg = {
  fields: { columns: ['province', 'city', 'type', 'price'] },
  meta: [
    // 列头字段对应的元信息，比如展示的中文名
    {
      field: "province",
      name: "省份",
    },
    {
      field: "city",
      name: "城市",
    },
    {
      field: "type",
      name: "类型",
    },
    {
      field: "price",
      name: "价格",
    },
  ],
  data,
}

const rawOptions = {
  width: 480,
  height: 480,
  showSeriesNumber: true,
  frozenRowCount: 1, // 行头冻结数量
  frozenColCount: 1, // 列头冻结数量
  frozenTrailingRowCount: 1, // 列尾冻结数量
  frozenTrailingColCount: 1, // 列尾冻结数量
}

const dataCfg = shallowRef(s2DataCfg)
const options = reactive(rawOptions)
</script>

<template>
  <SheetComponent :dataCfg="dataCfg" :options="options" sheetType="editable" />
</template>

<style>
</style>
