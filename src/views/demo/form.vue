<template>
  <el-dialog :model-value="props.dialogVisible" :title="formTitle" width="50%" :before-close="cancelAction">
    <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="方法名(中)" prop="method_cn_name">
            <el-input v-model="newFormInline.method_cn_name" :disabled="type === 3" clearable placeholder="请输入中文方法名" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="方法名(英)" prop="method_en_name">
            <el-input v-model="newFormInline.method_en_name" :disabled="type === 3" clearable placeholder="请输入英文方法名" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="状态" prop="status">
            <el-select v-model="newFormInline.status" :disabled="type === 3" clearable style="width: 100%;"
              placeholder="请选择状态">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="按钮" prop="btn_icon">
            <el-input v-model="newFormInline.btn_icon" :disabled="type === 3" clearable placeholder="请输入按钮" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="菜单" prop="menu_id">
            <el-input v-model="newFormInline.menu_id" :disabled="type === 3" clearable placeholder="请输入菜单" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="类型" prop="method_type">
            <el-input v-model="newFormInline.method_type" :disabled="type === 3" clearable placeholder="请输入类型" />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="日期" prop="time">
            <el-date-picker v-model="newFormInline.time" type="date" placeholder="选择时间" style="width: 100%" />
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
import { ref, computed, onMounted, watch } from "vue";
import ReCol from "@/components/ReCol";
import { addMethod, getMethodDetail, updateMethod } from '@/api/demo'
import { ElNotification } from 'element-plus'
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 1
  },
  formId: {
    type: Number,
    default: 0
  }
})

const Emit = defineEmits(['update:dialogVisible', 'initList'])
const ruleFormRef = ref();
const newFormInline = ref({
  method_cn_name: '',
  method_en_name: '',
  status: '',
  btn_icon: '',
  menu_id: '',
  method_type: '',
  time: ''
});

const formTitle = computed(() => {
  const { type } = props
  if (type === 1) return '新增'
  if (type === 2) return '编辑'
  if (type === 3) return '查看'
})
watch(() => props.dialogVisible,
  async (newX) => {
    if (!newX || props.formId === 0) return;
    const res = await getMethodDetail(props.formId);
    if (res) {
      newFormInline.value = res.data;
    }
  })

const submitAction = async () => {
  const res = props.formId === 0 ? await addMethod(newFormInline.value) : await updateMethod({
    ...newFormInline.value,
    id: props.formId
  });
  if (res.statusCode === 200) {
    Emit('initList')
    ElNotification({
      message: props.formId === 0 ? '新增成功' : '修改成功',
      type: 'success',
    })
    cancelAction();
  }
}

const cancelAction = () => {
  Emit('update:dialogVisible', false);
  newFormInline.value = {
    method_cn_name: '',
    method_en_name: '',
    status: '',
    btn_icon: ''
  }
}

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

onMounted(() => {
});


</script>


