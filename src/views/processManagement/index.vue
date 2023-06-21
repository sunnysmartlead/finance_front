<template>
  <div class="process-management">
    <div class="process-management__btn-container">
      <el-button type="primary" @click="dialogFormVisible = true">添加工序</el-button>
      <el-button type="danger" @click="patchDelete">批量删除</el-button>
      <el-button type="text">结构bom</el-button>
      <el-button type="text">3d爆炸图</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" />

      <el-table-column type="expand">
        <template>
          <el-form inline>
            <el-form-item label="2022" />
            <el-form-item label="机器工时">
              <el-input />
            </el-form-item>
            <el-form-item label="人工工时">
              <el-input />
            </el-form-item>
            <el-form-item label="人员数量">
              <el-input />
            </el-form-item>
          </el-form>
          <el-form inline>
            <el-form-item label="2023" />
            <el-form-item label="机器工时">
              <el-input />
            </el-form-item>
            <el-form-item label="人工工时">
              <el-input />
            </el-form-item>
            <el-form-item label="人员数量">
              <el-input />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="工序名称" />
      <el-table-column prop="date" label="工位" />
      <el-table-column prop="name" label="设备总金额" />
    </el-table>
    <div>
      <span>UPX（自动计算）：</span>
      <el-input />
    </div>
    <el-dialog v-model="dialogFormVisible" title="工序添加">
      <el-form :model="form">
        <el-form-item label="选择工序" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width: 200px" />
        </el-form-item>
        <el-form-item label="设备" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="工位" :label-width="formLabelWidth" style="width: 200px">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { ref, reactive, toRefs, onBeforeMount, onMounted, watchEffect, computed } from "vue"
import { reactive, onBeforeMount, onMounted, watchEffect, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"

const dialogFormVisible = ref(false)
const formLabelWidth = "140px"

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
})
// import { useStore } from "vuex"
// import { useRoute, useRouter } from "vue-router"
/**
 * 仓库
 */
// const store = useStore()
/**
 * 路由对象
 */
// const route = useRoute()
/**
 * 路由实例
 */
// const router = useRouter()
//console.log('1-开始创建组件-setup')
/**
 * 数据部分
 */
const tableData = reactive([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
])
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => {})
const selectionChange = (selection: any) => {
  console.log(selection)
}
const patchDelete = () => {
  ElMessageBox.confirm("确定删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {})
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled"
      })
    })
}
// 使用toRefs解构
// let { } = { ...toRefs(data) }
// defineExpose({
//   ...toRefs(data)
// })
</script>
<style lang="scss" scoped>
.process-management {
  &__btn-container {
    margin: 20px 0;
  }
}
</style>
