<template>
  <div class="second-form">
    <el-form>
      <el-card class="second-form__card">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="核价团队:">
              <el-input type="textarea" :rows="10" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-card class="second-form__card">
      <h5>物流基础数据</h5>
      <el-table :data="tableData" style="width: 100%">
        <!-- <el-table-column prop="date" label="Date" width="150" /> -->
        <el-table-column label="每次发货量">
          <el-table-column label="外包装体积">
            <el-table-column label="长">
              <template #default="scope">
                <el-input v-model="scope.row.long" type="number">
                  <template #append>cm</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="宽">
              <template #default="scope">
                <el-input v-model="scope.row.long" type="number">
                  <template #append>cm</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="高">
              <template #default="scope">
                <el-input v-model="scope.row.long" type="number">
                  <template #append>cm</template>
                </el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column label="重量" width="120" /> -->
          <el-table-column label="重量">
            <el-table-column label="单个产品重量">
              <template #default="scope">
                <el-input v-model="scope.row.long" type="number">
                  <template #append>kg</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="单箱数量">
              <template #default="scope">
                <el-input v-model="scope.row.long" type="number">
                  <template #append>个</template>
                </el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="second-form__card">
      <h5>包装基础数据</h5>
      <el-table :data="tableData" style="width: 100%">
        <!-- <el-table-column prop="date" label="Date" width="150" /> -->
        <el-table-column label="内包装体积">
          <el-table-column label="长">
            <template #default="scope">
              <el-input v-model="scope.row.long" type="number">
                <template #append>cm</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="宽">
            <template #default="scope">
              <el-input v-model="scope.row.long" type="number">
                <template #append>cm</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="高">
            <template #default="scope">
              <el-input v-model="scope.row.long" type="number">
                <template #append>cm</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="重量" width="120" /> -->
        <el-table-column label="外包装体积">
          <el-table-column label="长">
            <template #default="scope">
              <el-input v-model="scope.row.long" type="number">
                <template #append>cm</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="宽">
            <template #default="scope">
              <el-input v-model="scope.row.long" type="number">
                <template #append>cm</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="高">
            <template #default="scope">
              <el-input v-model="scope.row.long" type="number">
                <template #append>cm</template>
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="每托盘箱数">
          <template #default="scope">
            <el-input v-model="scope.row.long" type="number">
              <!-- <template #append>箱</template> -->
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="是否打托">
          <template #default="scope">
            <el-input v-model="scope.row.long" type="number">
              <!-- <template #append>箱</template> -->
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="单箱包装数量">
          <template #default="scope">
            <el-input v-model="scope.row.long" type="number">
              <!-- <template #append>个</template> -->
            </el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue"
// import { useRouter } from "vue-router"

const tableData = reactive([
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-08",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-06",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  },
  {
    date: "2016-05-07",
    name: "Tom",
    state: "California",
    city: "Los Angeles",
    address: "No. 189, Grove St, Los Angeles",
    zip: "CA 90036"
  }
])
</script>
<style lang="scss" scoped>
.second-form {
  &__card {
    margin: 10px 0;
  }
}
</style>
