<script setup>
import { ref } from "vue";
import ReCol from "@/components/ReCol";

const props = withDefaults(defineProps(), {
  formInline: () => ({
    higherDeptOptions: [],
    parentId: 0,
    name: "",
    principal: "",
    phone: "",
    email: "",
    sort: 0,
    status: 1,
    remark: ""
  })
});



const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
console.log(props, 123123)
function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
    <el-row :gutter="30">

    </el-row>
  </el-form>
</template>
