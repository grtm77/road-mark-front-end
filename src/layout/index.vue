<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { calcApi, getDatasetsListApi } from "@/api/markApi";
import { ElMessage } from "element-plus";
import { useResponseStore } from "@/stores/response";
import { storeToRefs } from "pinia";

const store = useResponseStore();

const datasets = ref([
  {
    id: 1,
    table_name: "default",
    table_remark: "数据库可能还未启动或连接失败！",
  },
]);

onBeforeMount(async () => {
  try {
    const { data } = await getDatasetsListApi();
    if (data.success === true) {
      datasets.value = data.data;
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
});

const gotoPage = (key: string, keyPath: string[]) => {
  // console.log(key);
  switch (key) {
    case "1": {
      router.push("/mark");
      return;
    }
    case "1-2": {
      router.push("/addGateway");
      return;
    }
    case "1-3": {
      router.push("/addCrossing");
      return;
    }
  }
};

// 数据集选择dialog
const dataDialog = ref(false);
const algorithm = ref(0);

function openDialog(a: number) {
  algorithm.value = a;
  dataDialog.value = true;
}

// 请求计算
async function askForCalc(name: string) {
  try {
    ElMessage({
      type: "warning",
      message: "正在计算，可能时间较长，请耐心等待，不要重复点击！",
    });
    const { data } = await calcApi(name, algorithm.value);
    if (data.success === true) {
      ElMessage({
        type: "success",
        message: "计算成功！",
      });
      store.responseData = data.data;
      dataDialog.value = false;
      await router.push("/result");
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
  <el-container class="main">
    <el-header>GIS Based IOT Gateway Deployment System</el-header>
    <el-container>
      <el-aside>
        <el-scrollbar>
          <el-menu :default-openeds="['2']" @select="gotoPage">
            <el-menu-item index="1">
              <template #title>
                <el-icon>
                  <Location />
                </el-icon>
                新建标记
              </template>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Calendar />
                </el-icon>
                覆盖计算
              </template>
              <el-menu-item index="2-1" @click="openDialog(1)"
                >朴素贪心</el-menu-item
              >
              <el-menu-item index="2-2" @click="openDialog(2)"
                >定向贪心</el-menu-item
              >
              <el-menu-item index="2-3" @click="openDialog(3)"
                >线性规划</el-menu-item
              >
              <el-menu-item index="2-4" @click="openDialog(4)"
                >蚁群算法</el-menu-item
              >
              <el-menu-item index="2-5" @click="openDialog(5)"
                >遗传算法</el-menu-item
              >
              <el-menu-item index="2-6" @click="openDialog(6)"
                >分支定界</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <GoldMedal />
                </el-icon>
                数据查看
              </template>
              <el-menu-item
                v-for="(d, i) in datasets"
                :index="'3-' + i"
                @click="
                  router.push({
                    path: '/viewData',
                    query: { dataset: d.table_name },
                  })
                "
                >{{ d.table_remark }}
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

  <!--  数据选择对话框-->
  <el-dialog v-model="dataDialog" :show-close="false" width="500">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">请选择需要使用的数据集</h4>
        <el-button type="danger" @click="close" size="small">
          <el-icon>
            <CircleCloseFilled />
          </el-icon>
        </el-button>
      </div>
    </template>
    <el-button v-for="d in datasets" @click="askForCalc(d.table_name)"
      >{{ d.table_remark }}
    </el-button>
  </el-dialog>
</template>

<style scoped lang="less">
.el-header {
  background-color: #e3d964;
  color: #333;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  z-index: 100;
  font-size: 25px;
  font-weight: bold;
}

.el-aside {
  //background-color: #256eb4;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  padding-top: 60px;
  width: 15vi;
  z-index: 99;
}

.el-main {
  color: #333;
  text-align: center;
  position: absolute;
  top: 60px; /* 考虑 header 的高度 */
  left: 15vi; /* 考虑 aside 的宽度 */
  right: 0;
  bottom: 0;
  font-size: 40px;
  padding: 0;
  //background-color: #2c3e50;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
