import { clone, delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import { getMethodList } from '@/api/user'

export const useColumns = () => {
  const dataList = ref([]);
  const loading = ref(true);

  const columns = [
    {
      type: "selection",
      align: "left",
      reserveSelection: true
    },
    {
      label: "日期",
      prop: "method_cn_name"
    },
    {
      label: "姓名",
      prop: "method_en_name"
    },
    {
      label: "地址",
      prop: "status"
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


  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loading.value = true;
    delay(600).then(() => {
      loading.value = false;
    });
  }


  onMounted(async () => {
    const res = await getMethodList({ menu_id: 2 });
    if (res.statusCode === 200) {
      dataList.value = res.data;
      pagination.total = dataList.value.length;
    }
    loading.value = false;
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    onSizeChange,
    onCurrentChange
  };
}