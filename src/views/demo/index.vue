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
        <el-button type="primary" @click="openDialog({ type: 1, id: 0 })">新增</el-button>
        <el-button type="danger" @click="deleteBatchAction">删除</el-button>
        <el-button type="success" @click="exportAction">导出</el-button>
        <el-button type="info" @click="importAction">导入</el-button>
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
            <el-button type="info" @click="openDialog({ type: 2, id: row.id })" size="small">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteItem(row)">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="openDialog({ type: 3, id: row.id })">
              查看
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <DataForm v-model:dialog-visible="formDialog" @init-list="searchMethod" :form-id="formId" :type="formType" />
    <ImportData v-model:dialog-visible="importDialog" @init-list="searchMethod" />
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getMethodList, deleteMethod, deleteMethodBatch } from '@/api/demo'
import { ElNotification, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs';
import { PureTableBar } from '@/components/RePureTableBar';
import DataForm from "./form.vue";
import ImportData from "./importData.vue";


const tableRef = ref();
const dataList = ref([]);
const loading = ref(true);
const modelParams = reactive({
  keyword: '',
  method_type: '',
  create_time: '',
  rangeTime: ''
})
/* 分页配置 */
const pagination = reactive({
  pageSize: 10,
  currentPage: 1,
  pageSizes: [10, 20, 50, 100],
  total: 0,
  align: "right",
  background: true,
  small: false
});


const formType = ref(1);
const formDialog = ref(false);
const importDialog = ref(false);
const formId = ref(0);

const reset = () => {
  modelParams.keyword = '';
  modelParams.method_type = '';
  modelParams.create_time = '';
  modelParams.rangeTime = '';
}

const columns = [
  {
    type: "selection",
    align: "left",
    reserveSelection: true
  },
  {
    label: "姓名",
    prop: "method_cn_name"
  },
  {
    label: "英文",
    prop: "method_en_name"
  },
  {
    label: "状态",
    prop: "status"
  },
  {
    label: "图标",
    prop: "btn_icon"
  },
  {
    label: "日期",
    slot: 'time'
  },
  {
    label: "操作",
    fixed: "right",
    slot: "operation"
  }
];

const deleteItem = (data) => {
  ElMessageBox.confirm(
    '是否删除此数据？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const res = await deleteMethod(data);
      if (res.statusCode === 200) {
        pagination.currentPage = 1;
        getDataList();
        ElNotification({
          title: '提醒',
          message: '删除成功',
          type: 'success',
        })
      }
    })
    .catch(() => {
    })
}

const deleteBatchAction = async () => {
  const { getSelectionRows } = tableRef.value.getTableRef();
  if (getSelectionRows().length === 0) {
    ElNotification({
      title: '提醒',
      message: '请选择需要删除的数据',
      type: 'warning',
    })
    return
  }

  ElMessageBox.confirm(
    '是否删除选中数据？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await deleteMethodBatch(getSelectionRows().map(v => v.id));
    if (res.statusCode === 200) {
      pagination.currentPage = 1;
      getDataList();
      tableRef.value.clearSelection()
      ElNotification({
        title: '提醒',
        message: '删除成功',
        type: 'success',
      })
    }
  })

}

const exportAction = () => {
}

const importAction = () => {
  importDialog.value = true;
}

const searchMethod = () => {
  loading.value = true;
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


const getDataList = async () => {
  const paramData = {}
  Object.entries(modelParams).map(item => {
    const [k, v] = item;
    if (![null, undefined, ''].includes(v)) {
      paramData[k] = v;
      if (k === 'rangeTime') {
        const [start, end] = v;
        paramData.start = start;
        paramData.end = end;
      }
    }
  })

  const res = await getMethodList(paramData, { current: pagination.currentPage, pageSize: pagination.pageSize });
  if (res.statusCode === 200) {
    dataList.value = res.data;
    pagination.total = res.pageInfo.total;
  }
  loading.value = false;
}

const openDialog = async ({ type, id }) => {
  formId.value = id;
  formType.value = type;
  formDialog.value = true;
}

onMounted(() => {
  getDataList();
});


</script>
<style lang="scss" scoped></style>
