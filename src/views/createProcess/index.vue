<template>
  <div class="div-card">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>集成流程</span>
        </div>
      </template>
      <el-row :gutter="12">
        <el-col :span="4" v-for="item in PROCESS_EUNM" :key="item.id">
          <el-card shadow="hover" class="card" @click="createFlow(item.id)">
            <img
              style="width: 100px; height: 100px"
              src="@/assets/images/mainProcess.png"
              :style="{ filter: `hue-rotate(${hueRotate}deg)` }"
            />
            <div class="text">{{ item.name }}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
const router = useRouter()
import { PROCESS_EUNM } from "./common/const"

const hueRotate = 10

const createFlow = (id: string) => {
  router.push({
    path: "/demandApply/index",
    query: {
      processType: id
    }
  })
}

</script>
<style scoped lang="scss">
.div-card {
  margin: 10px;
  .card {
    width: 150px;
    cursor: pointer;
    border-radius: 10px;
    margin-bottom: 10px;
    .text {
      margin: 5px;
      text-align: center;
      color: cadetblue;
    }
  }
  .card:hover {
    background-color: azure;
  }
}
</style>
