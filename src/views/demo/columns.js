import { clone, delay } from "@pureadmin/utils";
import { ref, onMounted, reactive, h } from "vue";
import { getMethodDetail, addMethod, updateMethod, getMethodList } from '@/api/demo'
import { addDialog } from "@/components/ReDialog";
import editForm from "./form.vue";
import { message } from "@/utils/message";

export const useColumns = () => {
  const dataList = ref([]);
  const loading = ref(true);
  const modelParams = reactive({
    keyword: '',
    method_type: '',
    create_time: '',
    rangeTime: ''
  })
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
  const formRef = ref()

  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loading.value = true;
    delay(600).then(() => {
      loading.value = false;
    });
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


  onMounted(() => {
    getDataList()
  });

  const openDialog = async (title = "新增", id) => {
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
      width: "40%",
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



  return {
    loading,
    columns,
    dataList,
    pagination,
    onSizeChange,
    openDialog,
    getDataList,
    modelParams,
    onCurrentChange
  };
}
