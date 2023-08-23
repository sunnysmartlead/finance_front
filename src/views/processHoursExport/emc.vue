<template>
  <div class="u-p-20">
    <div>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="实验分类">
          <el-input v-model="queryParams.classification" placeholder="输入实验分类" clearable />
        </el-form-item>
        <el-form-item label="实验名称">
          <el-input v-model="queryParams.name" placeholder="输入实验名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="u-flex u-row-between u-col-center">
      <div>
        <div class="u-flex u-row-left u-col-center">
          <div class="u-m-r-20">
            <el-upload class="upload-demo" ref="upload" accept=".xls,.xlsx" :show-file-list="false"
              :on-error="uploadErrror" :on-success="uploadSuccess" :on-exceed="handleExceed" :action="uploadAction"
              :limit="1">
              <template #trigger>
                <el-button type="primary">表单导入</el-button>
              </template>
            </el-upload>
          </div>
          <div>
            <el-button type="primary" @click="downLoadEmc">模版下载</el-button>
            <el-button type="primary" @click="handleAdd(ruleFormRef)">创建实验项目</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <el-scrollbar wrap-style="padding:10px 0px" :max-height="600" native>
        <div>
          <el-table v-loading="loading" :data="tableData" style="width: 100%" border max-height="600px">
            <el-table-column label="实验分类" align="center" prop="classification" />
            <el-table-column label="实验名称" align="center" prop="name" />
            <el-table-column label="单价" align="center" prop="price" />
            <el-table-column label="计价单位" align="center" prop="unit" />
            <el-table-column label="工序维护人" align="center" prop="lastModifierUserName" />
            <el-table-column label="工序维护时间" align="center" width="160px">
              <template #default="scope">
                <div>
                  {{ formatDateTime(scope.row.creationTime) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="160px">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>

    <div v-if="baseLibLogRecords.length>0"
        class="u-m-t-20 u-p-10" style="background-color: #ffffff">
      <div class="u-flex u-row-between u-col-center" style="width: 100%;">
        <div>日志更新记录：</div>
        <div>
          <el-button v-if="editLogFlag == false" type="primary" @click="editLogFlag = true">编辑</el-button>
          <el-button v-else @click="editLogFlag = false">取消</el-button>
          <el-button type="primary" @click="saveLog">保存</el-button>
        </div>
      </div>
      <el-scrollbar :min-size="10" :max-height="600">
        <div class="u-m-t-20">
          <el-timeline>
            <el-timeline-item placement="top" v-for="(activity, index) in baseLibLogRecords" :key="index"
               :timestamp="formatDateTime(activity.lastModificationTime)">
              <div class="u-p-10 u-border-bottom u-font-12">
                <div style="font-weight: bold; color: #909399">
                  <span>版本号：</span>
                  <span>{{ activity.version?activity.version:'--' }}</span>
                </div>
                <div>
                  <div style="font-weight: bold; color: #909399" class="u-flex u-row-left u-col-center u-m-t-10">
                    <div>
                      <span>操作人：</span>
                    </div>
                    <div>
                      <span>{{ activity.lastModifierUserName }}</span>
                    </div>
                  </div>
                  <div class="u-m-t-10">
                    <div class="u-m-t-5 u-font-12">
                      <el-input :disabled="!editLogFlag" v-model="activity.remark" :rows="2" type="textarea"
                        placeholder="更新日志记录内容" />
                    </div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-scrollbar>
    </div>
    <!-- 添加或修改岗位对话框 -->
    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="400px" append-to-body>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="试验分类" prop="classification">
          <el-input v-model="ruleForm.classification" placeholder="" />
        </el-form-item>
        <el-form-item label="试验名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="" />
        </el-form-item>
        <el-form-item label="实验室" prop="laboratory">
          <el-input v-model="ruleForm.laboratory" controls-position="right" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="ruleForm.price" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="ruleForm.unit" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
          <el-button @click="cancel(ruleFormRef)">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs,onMounted } from "vue"
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick } from "process"
import {
  GetListAll,
  getFoundationEmcById,
  updateFoundationEmc,
  createFoundationEmc,
  deleteFoundationEmc,
  getEmcLog,
  saveEmcLog,
  baseDomain
} from "@/api/foundationEmc"
import { ElMessage, ElMessageBox,genFileId } from "element-plus"
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { formatDateTime } from "@/utils"
import {CommonDownloadFile} from "@/api/bom";
const uploadAction = baseDomain + "api/services/app/FoundationEmc/UploadFoundationEmc";
const data = reactive({
  queryParams: {
    name: undefined,
    classification: undefined
  },
})
const { queryParams } = toRefs(data)


interface RuleForm {
  id: number,
  classification: string,
  name: string,
  price: number,
  unit: string,
  IsDeleted: number,
  laboratory: string
}
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive<RuleForm>({
  id: 0,
  classification: '',
  name: '',
  price: 0.00,
  unit: '',
  IsDeleted: 1,
  laboratory: ''
})
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '名称不能为空!', trigger: 'blur' },
  ],
  classification: [
    { required: true, message: '类别不能为空!', trigger: 'blur' },
  ],
  price: [
    {
      required: true,
      message: '价格不能为空',
      trigger: 'change',
    }
  ],
  unit: [
    { required: true, message: '单位不能为空!', trigger: 'blur' },
  ],
  laboratory: [
    { required: true, message: '实验室不能为空!', trigger: 'blur' },
  ],
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const uploadSuccess = (response: any, uploadFile: any, uploadFiles: any) => {
    console.log("responese", response);
    console.log("uploadFile", uploadFile);
    console.log("uploadFiles", uploadFiles);
    if(response.result){
      initData()
      ElMessage({
        type: 'success',
        message: '导入成功',
       })
    }else{
      ElMessage({
        type: 'error',
        message: '导入失败',
       })
    }
}
const uploadErrror = (error: Error, uploadFile: any, uploadFiles: any) => {
    console.log("error", error);
    console.log("uploadFile", uploadFile);
    console.log("uploadFiles", uploadFiles);
    ElMessage({
        type: 'error',
        message: '导入失败',
    })
}

//新增
const handleAdd = (formEl: FormInstance | undefined) => {
  open.value = true
  resetForm(formEl)
  title.value = "试验信息"
}
//取消
const cancel = (formEl: FormInstance | undefined) => {
  resetForm(formEl)
  open.value = false
}
//提交新增或者修改
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (ruleForm.id == 0) {
        createFoundationEmc(ruleForm).then((response) => {
          open.value = false
          initData()
        })
      } else {
        updateFoundationEmc(ruleForm).then((response) => {
          open.value = false
          initData()
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}


const title = ref("")
const open = ref(false)
const loading = ref(true)
const tableData = ref([])
function getList() {
  loading.value = true
  GetListAll(queryParams.value).then((response) => {
    tableData.value = response.result
    loading.value = false
  })
}
const submitSearch = () => {
  getList()
}

const downLoadEmc= async () => {
  const link = document.createElement('a')
  link.href = import.meta.env.VITE_BASE_API + "/Excel/EMC导入.xlsx"
  link.download = 'EMC导入模版.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}



const editLogFlag = ref(false)



interface environmentItem {
  classification: string
  laboratory: string
  name: string
  unit: string
  price: number
  id: number
}

/** 修改按钮操作 */
function handleEdit(index: number, row: environmentItem) {
  console.log(index, row.id)
  const postId = row.id
  getFoundationEmcById(postId).then((response) => {
    ruleForm = Object.assign(ruleForm, response.result);
    open.value = true
    title.value = "编辑试验信息"
  })
}
/** 删除按钮操作 */
function handleDelete(row) {
  const postIds = row.id
  ElMessageBox.confirm("是否确认删除!")
    .then(function () {
      return deleteFoundationEmc(postIds)
    })
    .then(() => {
      initData()
      ElMessage({
        type: "success",
        message: "删除成功"
      })
    })
    .catch(() => { })
}

const baseLibLogRecords = ref([])

//获取日志记录
const getEmcOptionLog = () => {
  let data={
    Type: 2
  };
  getEmcLog(data).then((response) => {
    console.log("======getEmcLog ===response=======",response);
    if(response.success){
      baseLibLogRecords.value = response.result
      console.log("======baseLibLogRecords=======", baseLibLogRecords.value);
    }
    else{
      ElMessage({
        type:'error',
        message:'加载日志记录失败'
      })
    }
  })
}

const saveLog =async () => {
  let data=JSON.parse(JSON.stringify(baseLibLogRecords.value))
  await saveEmcLog({
    listFoundationLogs:data
    }).then((response) => {
     if(response.success){
      ElMessage({
        type:'success',
        message:'修改成功'
      });
      initData()
     }else{
      ElMessage({
        type:'error',
        message:'修改失败'
      });
     }
  })
  editLogFlag.value = false
}

const initData = () => {
  loading.value = true;
  getList()
  getEmcOptionLog()
  loading.value = false;
}

onMounted(() => {
  initData();
})

defineExpose({
  ...toRefs(tableData)
})
</script>
<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
