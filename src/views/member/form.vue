<script setup>
import { ref } from "vue";
import ReCol from "@/components/ReCol";

const props = defineProps({
  row: {
    id: 0,
    method_cn_name: "",
    method_en_name: "",
    status: 1,
    time: ""
  }
})


const ruleFormRef = ref();
const newFormInline = ref(props.row);
function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="method_cn_name">
          <el-input v-model="newFormInline.method_cn_name" clearable placeholder="请输入部门名称" />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门负责人" prop="method_en_name">
          <el-input v-model="newFormInline.method_en_name" clearable placeholder="请输入部门负责人" />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="status">
          <el-input v-model="newFormInline.status" clearable placeholder="请输入手机号" />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="time">
          <el-input v-model="newFormInline.time" clearable placeholder="请输入邮箱" />
        </el-form-item>
      </re-col>

    </el-row>
  </el-form>
</template>
