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

    <pure-table border row-key="id" alignWhole="center" showOverflowTooltip :loading="loading" :data="dataList"
      :columns="columns" :pagination="pagination" @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange" />

  </el-card>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { reactive, ref } from 'vue'
import { useColumns } from "./columns";
const date = dayjs(new Date()).format("YYYY-MM-DD");

const {
  loading,
  columns,
  dataList,
  pagination,
  onSizeChange,
  onCurrentChange
} = useColumns();

const formInline = reactive({
  user: '',
  region: '',
  date: '',
  rangeTime: ''
})

</script>
<style lang="scss" scoped></style>
