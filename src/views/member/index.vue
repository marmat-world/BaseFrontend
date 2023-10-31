<template>
  <div class="main">
    <el-form :inline="true" :model="modelParams" class="search-form bg-bg_color w-[99/100] pl-5 pt-[18px]">
      <el-form-item label="方法名称">
        <el-input v-model="modelParams.keyword" placeholder="请输入方法名称" clearable />
      </el-form-item>
      <el-form-item label="方法类型">
        <el-select v-model="modelParams.method_type" placeholder="请选择方法类型" clearable>
          <el-option label="列表" :value="1" />
          <el-option label="新增" :value="2" />
          <el-option label="修改" :value="3" />
          <el-option label="删除" :value="4" />
          <el-option label="查看详情" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker v-model="modelParams.create_time" type="date" placeholder="选择时间" clearable format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="modelParams.rangeTime" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchMethod">查询</el-button>
        <el-button @click="reset">重置</el-button>

      </el-form-item>
    </el-form>
    <PureTableBar title="" :columns="columns" :tableRef="tableRef?.getTableRef()" @refresh="getDataList">
      <template #buttons>
        <el-button type="primary" @click="openDialog()">新增</el-button>
        <el-button type="danger" @click="deleteBatchAction">删除</el-button>
        <el-button type="success" @click="exportAction">导出</el-button>
        <el-button type="success" @click="importAction">导入</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table row-key="id" :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)'
        }" adaptive ref="tableRef" alignWhole="center" showOverflowTooltip :loading="loading" :data="dataList"
          :columns="columns" :pagination="pagination" @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange">
          <template #time="{ row }">
            {{ dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template #operation="{ row }">
            <el-button type="primary" size="small">
              查看
            </el-button>
            <el-button type="info" @click="openDialog('编辑', row.id)" size="small">
              编辑
            </el-button>
            <el-button type="danger" size="small">
              删除
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getMethodList } from '@/api/user'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs';
import { useColumns } from "./columns";
import { PureTableBar } from '@/components/RePureTableBar';
const {
  form,
  resetForm,
  openDialog,
  dataList,
  loading,
  pagination,
  columns,
  getDataList,
  modelParams,
  handleDelete,
  handleSelectionChange
} = useColumns();

const tableRef = ref();

const reset = () => {
  modelParams.keyword = '';
  modelParams.method_type = '';
  modelParams.create_time = '';
  modelParams.rangeTime = '';
}


const deleteBatchAction = () => {

  const { getSelectionRows } = tableRef.value.getTableRef();
  console.log(getSelectionRows())

  if (getSelectionRows().length === 0) {
    ElNotification({
      title: '提醒',
      message: '请选择需要删除的数据',
      type: 'warning',
    })
    return
  }
}

const exportAction = () => {

}

const importAction = () => {

}

const searchMethod = () => {
  pagination.currentPage = 1;
  getDataList();
}



const onSizeChange = (val) => {
  loading.value = true;
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getDataList();
}

const onCurrentChange = (val) => {
  loading.value = true;
  pagination.currentPage = val;
  getDataList();
}

onMounted(() => {
  getDataList();
});


</script>
<style lang="scss" scoped></style>
