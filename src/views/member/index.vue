<template>
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="Approved by">
        <el-input v-model="formInline.user" placeholder="Approved by" clearable />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable />
      </el-form-item>
      <el-form-item label="range time">
        <el-date-picker v-model="formInline.rangeTime" type="datetimerange" range-separator="To"
          start-placeholder="Start date" end-placeholder="End date" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
        <el-button>新增</el-button>
        <el-button>删除</el-button>
        <el-button>导出</el-button>
        <el-button>导入</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
      <el-table-column fixed="right" label="Operations">
        <template #default>
          <el-button type="primary" size="small">查看</el-button>
          <el-button type="primary" size="small">删除</el-button>
          <el-button type="primary" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="phantom-pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :background="true" layout="total, sizes, prev, pager, next, jumper" :total="400" />
    </div>
  </el-card>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { reactive, ref } from 'vue'
const date = dayjs(new Date()).format("YYYY-MM-DD");

const formInline = reactive({
  user: '',
  region: '',
  date: '',
  rangeTime: ''
})
const currentPage = ref(1)
const pageSize = ref(10)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
const tableData = [
  {
    date,
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Jack",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Dick",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Harry",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Sam",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Lucy",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Mary",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date,
    name: "Mike",
    address: "No. 189, Grove St, Los Angeles"
  }
]

</script>
<style lang="scss" scoped>
.phantom-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
