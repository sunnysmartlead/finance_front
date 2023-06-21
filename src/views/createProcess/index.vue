<template>
  <div class="div-card">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>集成流程</span>
        </div>
      </template>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="hover" class="card" @click="createFlow(0)">
            <img style="width: 100px; height: 100px" src="@/assets/images/mainProcess.png" :style="{ filter: `hue-rotate(${hueRotate}deg)` }"/>
            <div class="text">主流程-变更</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
const router = useRouter()
const createFlow = (index: number) => {
  if (index==0) {
    router.push({
      path: "/demandApply/index"
    })
  }
}
</script>
<style scoped lang="scss">
.div-card {
  margin: 10px;
  .card {
    width: 150px;
    cursor: pointer;
    border-radius: 10px;
    .text {
      margin: 5px;
      color:cadetblue;
    }
  }
  .card:hover
  {
    background-color:azure;
  }
}
</style>
