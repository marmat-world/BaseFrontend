<template>
  <el-dialog :model-value="props.dialogVisible" :title="formTitle" width="50%" :before-close="cancelAction">
    <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="部门名称" prop="method_cn_name">
            <el-input v-model="newFormInline.method_cn_name" :disabled="type === 3" clearable placeholder="请输入部门名称" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="部门负责人" prop="method_en_name">
            <el-input v-model="newFormInline.method_en_name" :disabled="type === 3" clearable placeholder="请输入部门负责人" />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="手机号" prop="status">
            <el-input v-model="newFormInline.status" :disabled="type === 3" clearable placeholder="请输入手机号" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="邮箱" prop="time">
            <el-input v-model="newFormInline.time" :disabled="type === 3" clearable placeholder="请输入邮箱" />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelAction">取消</el-button>
        <el-button type="primary" v-if="type !== 3" @click="submitAction">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, computed } from "vue";
import ReCol from "@/components/ReCol";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 1
  },
  dataForm: {
    type: Object,
    default() {
      return {
        method_cn_name: '',
        method_en_name: '',
        status: '',
        time: ''
      }
    }
  }
})

const Emit = defineEmits(['update:dialogVisible'])

console.log(props.dataForm)
const ruleFormRef = ref();
const newFormInline = ref(props.dataForm);

const formTitle = computed(() => {
  const { type } = props
  if (type === 1) return '新增'
  if (type === 2) return '编辑'
  if (type === 3) return '查看'
})

const submitAction = () => {

}

const cancelAction = () => {
  Emit('update:dialogVisible', false)
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>


