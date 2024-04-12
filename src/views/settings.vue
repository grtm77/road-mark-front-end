<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
import { deleteApi, getDatasetsListApi } from "@/api/markApi";
import { ElMessage } from "element-plus";
import { onBeforeMount, ref } from "vue";

const tableData = ref([
  {
    id: "2016-05-03",
    table_name: "Tom",
    table_remark: "No. 189, Grove St, Los Angeles",
    created_at: "",
  },
]);

async function getList() {
  try {
    const { data } = await getDatasetsListApi();
    if (data.success === true) {
      tableData.value = data.data;
    } else {
      ElMessage({
        type: "error",
        message: data.msg,
      });
    }
  } catch (error: any) {
    ElMessage({
      type: "error",
      message: error.message,
    });
  }
}

onBeforeMount(() => {
  getList();
});

async function deleteAction(id: number) {
  try {
    const { data } = await deleteApi(id);
    if (data.success === true) {
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
      await getList();
    } else {
      ElMessage({
        type: "error",
        message: data.msg,
      });
    }
  } catch (error: any) {
    ElMessage({
      type: "error",
      message: error.message,
    });
  }
}
</script>

<template>
  <div style="margin: 40px 100px">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="数据集id" width="120" />
      <el-table-column prop="table_name" label="表名" width="100" />
      <el-table-column prop="created_at" label="创建日期" width="280" />
      <el-table-column prop="table_remark" label="备注" />
      <el-table-column label="操作" width="60">
        <template #default="scope">
          <el-popconfirm
            title="你确定要删除这个数据集吗？"
            @confirm="deleteAction(scope.row.id)"
            v-if="scope.row.id !== 1"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" circle />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped></style>
