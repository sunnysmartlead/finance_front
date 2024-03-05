<template>
  <div class="div-card">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>集成流程</span>
        </div>
      </template>
      <el-row>
        <template :span="4" v-for="item in PROCESS_EUNM" :key="item.title">
          <el-card shadow="hover" class="card" :header="item.title" m="2">
            <template v-for="c in item.children">
              <el-button @click="createFlow(c.id, c?.to)" :disabled="!c.id" type="primary" m="2">{{
                c.name
              }}</el-button>
            </template>
          </el-card>
        </template>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
const router = useRouter()
import { PROCESS_EUNM } from "./common/const"

const hueRotate = 10

const createFlow = (id: string, to: string) => {
  if (to) {
      router.push({
      path: to,
      query: {
        opinion: id
      }
    })
  } else {
    router.push({
      path: "/demandApply/index",
      query: {
        opinion: id
      }
    })
  }
}
</script>
<style scoped lang="scss">
.div-card {
  margin: 10px;
  .card {
    width: 220px;
    flex-direction: column;
  }
  .card:hover {
    background-color: azure;
  }
}
</style>
