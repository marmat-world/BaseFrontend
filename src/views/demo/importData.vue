<template>
  <el-dialog :model-value="props.dialogVisible" title="导入excel" width="600px" :before-close="closeForm">
    <el-upload v-if="!process" class="upload-demo" action :auto-upload="false" :show-file-list="false"
      :on-change="chooseFile">
      <el-button type="primary">
        <el-icon>
          <UploadFilled />
        </el-icon>
        请选择导入excel
      </el-button>
      <span style="color:#ff0000; margin-left: 10px;">{{ fileProp.name }}</span>
    </el-upload>
    <el-progress v-else :percentage="excelParam.percentage"></el-progress>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">
          <span v-if="!loading">确 定</span>
          <span v-else>提 交 中...</span>
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { importMethod } from '@/api/demo'
import { ElNotification } from 'element-plus'
import * as XLSX from 'xlsx'
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
})
const loading = ref(false);
const fileProp = ref({});
const process = ref(false)
const excelImportData = ref([]);
const excelParam = reactive({
  page: 1,
  limit: 200,
  percentage: 0,
});
const Emit = defineEmits(['update:dialogVisible', 'initList'])

const chooseFile = (file) => {
  console.log(file)
  fileProp.value = file
  importExcel(file)
}
const importExcel = (file) => {
  var excelData = []
  const fileReader = new FileReader()
  fileReader.onload = (ev) => {
    try {
      const data = ev.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      Object.keys(workbook.Sheets).map((sheet) => {
        excelData.push(
          ...XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        )
      })
      excelImportData.value = excelData
    } catch (e) {
      console.log(e)
      ElNotification({
        title: '提醒',
        message: '文件类型不正确',
        type: 'warning',
      })
    }
  }
  fileReader.readAsBinaryString(file.raw)
}
const submit = async () => {
  process.value = true
  loading.value = true
  let data = getData()
  const totalPage = Math.ceil(excelImportData.value.length / excelParam.limit)
  excelParam.percentage = Math.ceil(excelParam.page * 100 / totalPage)
  const res = await importMethod(data);
  if (res.statusCode === 200) {
    if (excelParam.page <= totalPage - 1) {
      excelParam.page = excelParam.page + 1
      submit()
    } else {
      ElNotification({ title: '导入完成', type: 'success' })
      Emit('initList')
      closeForm()
      excelImportData.value = []
      loading.value = false
    }
  }
}
const getData = () => {
  let perData = []
  for (let i = (excelParam.page - 1) * excelParam.limit; i < excelParam.page * excelParam.limit; i++) {
    if (excelImportData.value[i]) {
      perData.push(excelImportData.value[i])
    }
  }
  return perData
}
const closeForm = () => {
  Emit('update:dialogVisible', false);
  fileProp.value = {}
  process.value = false
  excelParam.percentage = 0
  excelParam.page = 1
  excelParam.limit = 200
  loading.value = false
}

</script>