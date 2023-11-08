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
        <el-button type="primary" @click="openDialog({ title: '新增', type: 1 })">新增</el-button>
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
            <el-button type="info" @click="openDialog({ title: '编辑', type: 2, id: row.id })" size="small">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteItem">
              删除
            </el-button>
            <el-button type="primary" size="small" @click="openDialog({ title: '查看', type: 3, id: row.id })">
              查看
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, h } from 'vue'
import { getMethodList, getMethodDetail, deleteMethod, deleteBatchMethod } from '@/api/user'
import { ElNotification, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs';
import { addDialog } from "@/components/ReDialog";
import { PureTableBar } from '@/components/RePureTableBar';
import editForm from "./form.vue";
import { message } from "@/utils/message";

const formRef = ref()
const tableRef = ref();
const dataList = ref([]);
const loading = ref(true);
const modelParams = reactive({
  keyword: '',
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

const reset = () => {
  modelParams.keyword = '';
  modelParams.method_type = '';
  modelParams.create_time = '';
  modelParams.rangeTime = '';
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
  const res = await deleteBatchMethod(getSelectionRows().map(v => v.id));
  if (res) {
    pagination.currentPage = 1;
    getDataList();
    ElNotification({
      title: '提醒',
      message: '删除成功',
      type: 'success',
    })
  }

}

const exportAction = () => {

}

const importAction = () => {

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
    label: "地址",
    prop: "status"
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

const openDialog = async ({ title, id, type }) => {
  const res = id ? await getMethodDetail({ id }) : { data: {} };
  const row = res.data;
  addDialog({
    title: `${title}方法`,
    props: {
      row: {
        id: row?.id ?? 0,
        method_cn_name: row?.method_cn_name ?? "",
        method_en_name: row?.method_en_name ?? "",
        status: row?.status ?? 1,
        time: row?.time ?? ""
      }
    },
    width: "50%",
    draggable: true,
    closeOnClickModal: false,
    contentRenderer: () => h(editForm, { ref: formRef }),
    beforeSure: async (done, { options }) => {
      const FormRef = formRef.value.getRef();
      const curData = options.props.row;
      const res = id ? await updateMethod(curData) : await addMethod(curData);
      message(`您${title}了部门名称为${curData.method_cn_name}的这条数据`, {
        type: "success"
      });
      done();
      getDataList()
    }
  });

}
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
      if (res) {
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
onMounted(() => {
  getDataList();
});


</script>
<style lang="scss" scoped></style>
