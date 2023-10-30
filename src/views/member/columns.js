import { clone, delay } from "@pureadmin/utils";
import { ref, onMounted, reactive, h } from "vue";
import { getMethodList } from '@/api/user'
import { addDialog } from "@/components/ReDialog";
import editForm from "./form.vue";
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


  onMounted(async () => {
    const res = await getMethodList({ menu_id: 2 });
    if (res.statusCode === 200) {
      dataList.value = res.data;
      pagination.total = dataList.value.length;
    }
    loading.value = false;
  });

  const openDialog = (title = "新增", row) => {
    console.log(title, row)
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          name: row?.name ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          sort: row?.sort ?? 0,
          status: row?.status ?? 1,
          remark: row?.remark ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline;
        function chores() {
          message(`您${title}了部门名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              chores();
            }
          }
        });
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
    onCurrentChange
  };
}
