<template>
  <div class="role">
    <div class="role__btn-container">
      <el-form :model="data.searchForm" inline>
        <el-form-item label="关键字">
          <el-input v-model="data.searchForm.keyword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="role__btn-container">
      <el-button type="primary" @click="handleCreateRole">创建角色</el-button>
    </div>
    <el-table :data="data.tableData" style="width: 100%">
      <el-table-column label="id" prop="id" />
      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="角色描述" prop="description" />
      <el-table-column label="角色权限" prop="grantedPermissions" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="role__btn-container">
      <el-pagination background layout="prev, pager, next" :total="data.total" :page-size="data.pageSize"
        v-model:currentPage="data.pageNo" @update:current-page="handlePageChange" />
    </div>

    <el-dialog v-model="data.dialogVisible" title="角色信息" @close="clearRoleForm">
      <el-form :model="data.roleForm">
        <el-form-item label="角色名称" :label-width="data.formLabelWidth">
          <el-input v-model="data.roleForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色描述" :label-width="data.formLabelWidth">
          <el-input v-model="data.roleForm.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限选择" :label-width="data.formLabelWidth">
          <el-select v-model="data.roleForm.grantedPermissions" multiple>
            <el-option :value="item.name" v-for="item in data.permissionList" :key="item.name"
              :label="item.displayName" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted, watchEffect } from "vue"
// import { useRoute, useRouter } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { createRole, updateRole, deleteRole, RoleParams, getRoleList, getPermissionList } from "@/api/role"
interface PermissionDto {
  /**
   * 权限描述
   */
  description?: null | string
  /**
   * 权限显示名称
   */
  displayName: string
  id: number
  /**
   * 权限名称
   */
  name: string
}
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
const data = reactive({
  tableData: [],
  dialogVisible: false,
  formLabelWidth: "140px",
  searchForm: {
    keyword: ""
  },
  pageSize: 20,
  pageNo: 1,
  total: 0,
  roleForm: {
    id: null as any,
    name: "",
    description: "",
    grantedPermissions: []
  } as any,
  permissionList: [] as PermissionDto[],
  isEdit: false
})

const saveUser = async () => {
  ElMessageBox.confirm(
    '【如果有 待办未处理，要处理完再更改，否则系统流程会出错】',
    '警告',
    {
      confirmButtonText: '仍然保存',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    }
  )
    .then(async() => {
      ElMessage({
        type: 'success',
        message: '保存成功',
      })
      let res: any = null
      if (data.isEdit) {
        res = await updateRole(data.roleForm)
      } else {
        res = await createRole(data.roleForm)
      }
      if (res.success) {
        ElMessage({
          type: "success",
          message: "保存成功"
        })
        data.dialogVisible = false
        search()
      }
    })
}
const handleEdit = (index: number, row: role) => {
  data.isEdit = true
  data.roleForm = row
  data.dialogVisible = true
}
const clearRoleForm = () => {
  data.roleForm = {
    id: null,
    name: "",
    description: "",
    grantedPermissions: []
  }
}
const handleDelete = (index: number, row: role) => {
  console.log(index, row)
  ElMessageBox.confirm("确定删除该角色?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    if (typeof row.id === "number") {
      let res: any = await deleteRole(row.id)
      if (res.success) {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        search()
      }
    }
  })
}
interface role {
  id?: number | null | undefined
  name: string
  displayName: string
  normalizedName: string
  description: string
  grantedPermissions: Array<string>
}

const getList = async () => {
  let params: RoleParams = {
    keyword: "",
    maxResultCount: 20,
    skipCount: 0
  }
  params.keyword = data.searchForm.keyword
  params.skipCount = (data.pageNo - 1) * data.pageSize
  params.maxResultCount = data.pageSize

  let res: any = await getRoleList(params)
  // console.log(res)
  data.tableData = res.result.items
  data.total = res.result.totalCount
}
const search = () => {
  getList()
}
const handlePageChange = () => {
  getList()
}
const handleCreateRole = () => {
  data.dialogVisible = true
  data.isEdit = false
}
// const tableData: role[] = [
//   {
//     id: 1,
//     name: "Tom",
//     displayName: "No. 189, Grove St, Los Angeles",
//     normalizedName: "222",
//     description: "123123",
//     grantedPermissions: []
//   }
// ]
onBeforeMount(() => {
  //console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(async () => {
  let res: any = await getPermissionList()
  data.permissionList = res.result.items
  search()
  //console.log('3.-组件挂载到页面之后执行-------onMounted')
})
watchEffect(() => { })
// 使用toRefs解构
// let { } = { ...toRefs(data) }
defineExpose({
  ...toRefs(data)
})
</script>
<style scoped lang="scss">
.role {
  &__btn-container {
    margin: 20px 0;
  }
}
</style>
