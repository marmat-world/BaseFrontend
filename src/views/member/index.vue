<template>
  <el-card>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="方法名称">
        <el-input v-model="formInline.method_cn_name" placeholder="请输入方法名称" clearable />
      </el-form-item>
      <el-form-item label="方法类型">
        <el-select v-model="formInline.method_type" placeholder="请选择方法类型" clearable>
          <el-option label="列表" :value="1" />
          <el-option label="新增" :value="2" />
          <el-option label="修改" :value="3" />
          <el-option label="删除" :value="4" />
          <el-option label="查看详情" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期">
        <el-date-picker v-model="formInline.date" type="date" placeholder="选择时间" clearable format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="formInline.rangeTime" type="daterange" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchMethod">查询</el-button>
        <el-button>重置</el-button>
        <el-button>新增</el-button>
        <el-button>删除</el-button>
        <el-button>导出</el-button>
        <el-button>导入</el-button>
      </el-form-item>
    </el-form>

    <pure-table border row-key="id" alignWhole="center" showOverflowTooltip :loading="loading" :data="dataList"
      :columns="columns" :pagination="pagination" @page-size-change="onSizeChange" @page-current-change="onCurrentChange">
      <template #time="{ row }">
        {{ dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </pure-table>
  </el-card>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getMethodList } from '@/api/user'
import dayjs from 'dayjs';

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
    label: "地址",
    prop: "status"
  },
  {
    label: "日期",
    slot: 'time'
  },
];

const dataList = ref([]);
const loading = ref(true);
const formInline = reactive({
  method_cn_name: '',
  method_type: '',
  create_time: '',
  rangeTime: ''
})

/** 分页配置 */
const pagination = reactive({
  pageSize: 10,
  currentPage: 1,
  pageSizes: [10, 20, 50, 100],
  total: 0,
  align: "right",
  background: true,
  small: false
});

const searchMethod = () => {
  pagination.currentPage = 1;
  getDataList();
}

const getDataList = async () => {
  const paramData = {}
  Object.entries(formInline).map(item => {
    const [k, v] = item;
    if (![null, undefined, ''].includes(v)) {
      paramData[k] = v;
    }
  })
  const res = await getMethodList(paramData, { current: pagination.currentPage, pageSize: pagination.pageSize });
  if (res.statusCode === 200) {
    dataList.value = res.data;
    pagination.total = res.pageInfo.total;
  }
  loading.value = false;
}

const onSizeChange = (val) => {
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
