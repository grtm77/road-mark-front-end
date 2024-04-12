<script setup lang="ts">
import { ref } from "vue";
import BaiduMap from "@/components/baiduMap.vue";
import { addDatasetsApi, addMarksApi } from "@/api/markApi";
import { ElMessage, ElMessageBox } from "element-plus";

// 子组件实例
interface MapRef {
  addMarkOnMap: (
    url: string,
    size: number[],
    position: number[],
    offset?: number[],
  ) => void;
  getDistance: (start: number[], end: number[]) => number;
  clear: () => void;
}

const mapRef = ref<MapRef | null>(null);

// 标记用变量
const pointArr = ref([] as any); //存放一条路的起点与终点
const pts = ref([] as any); //存放一条路所有的传感器节点
const allSensors = ref([] as any); //存放地图上所有标记的传感器节点
const allGateways = ref([] as any); //存放地图上所有标记的网关节点
const allCrossings = ref([] as any); //存放地图上所有标记的路口节点

// 传感器图标
const SENSOR = "src/components/icons/point.png";
// 车位图标
// const PARK = 'src/components/icons/parkingspace.png'
// const SIZE2 = [32, 48]
// 网关图标
const GATEWAY = "src/components/icons/jian.png";
// 路口图标
const CROSSING = "src/components/icons/green.png";

// 间距
const sensorInterval = ref(5);
const gatewayInterval = ref(15);

// 选择器变量
const typeSelected = ref("sensors");
const options = [
  {
    value: "sensors",
    label: "车位-序列",
  },
  {
    value: "gateways",
    label: "灯杆-序列",
  },
  {
    value: "crossing",
    label: "路口",
  },
  {
    value: "sensor",
    label: "车位-单个",
  },
  {
    value: "gateway",
    label: "灯杆-单个",
  },
  // {
  //   value: "None",
  //   label: "不标记",
  // },
];

// 子组件点击地图时触发标注事件
function addMark(point: any) {
  let flag = 9;
  if (typeSelected.value === "crossing") {
    allCrossings.value.push({
      lng: point.lng.toString(),
      lat: point.lat.toString(),
    });
  } else if (typeSelected.value === "sensor") {
    allSensors.value.push([
      { lng: point.lng.toString(), lat: point.lat.toString() },
    ]);
  } else if (typeSelected.value === "gateway") {
    allGateways.value.push([
      { lng: point.lng.toString(), lat: point.lat.toString() },
    ]);
  } else if (
    typeSelected.value === "sensors" ||
    typeSelected.value === "gateways"
  ) {
    pointArr.value.push(point);
    flag = 1;
    mapRef.value?.addMarkOnMap(
      "",
      [16, 16],
      [pointArr.value[0].lng, pointArr.value[0].lat],
    );
  }
  // 如果点个数大于1
  if (pointArr.value.length > 1) {
    // console.log(pointArr.value)
    // mapRef.value?.addMarkOnMap(
    //     "",
    //     [16, 16],
    //     [pointArr.value[1].lng, pointArr.value[1].lat],
    // );
    const x1 = pointArr.value[0].lng;
    const y1 = pointArr.value[0].lat;
    const x2 = pointArr.value[1].lng;
    const y2 = pointArr.value[1].lat;
    pointArr.value = [];
    let chang = mapRef.value?.getDistance([x1, y1], [x2, y2]);
    // console.log(chang)
    if (chang) {
      // 识别节点种类
      if (typeSelected.value === "sensors") {
        //利用相似三角形求出所有点的坐标
        for (
          let i = sensorInterval.value;
          i < chang;
          i += sensorInterval.value
        ) {
          let x3 = (i / chang) * (x1 - x2) + x2;
          x3 = x3.toFixed(14);
          let y3 = (i / chang) * (y1 - y2) + y2;
          y3 = y3.toFixed(14);
          pts.value.push({ lng: x3, lat: y3 });
        }
        //二维数组，存放多条街道的坐标点
        allSensors.value.push(pts.value);
        pts.value = [];
        // console.log(allSensors.value)
      } else if (typeSelected.value === "gateways") {
        //利用相似三角形求出所有点的坐标
        for (
          let i = gatewayInterval.value;
          i < chang;
          i += gatewayInterval.value
        ) {
          let x3 = (i / chang) * (x1 - x2) + x2;
          x3 = x3.toFixed(14);
          let y3 = (i / chang) * (y1 - y2) + y2;
          y3 = y3.toFixed(14);
          pts.value.push({ lng: x3, lat: y3 });
        }
        //二维数组，存放多条街道的坐标点
        allGateways.value.push(pts.value);
        pts.value = [];
        // console.log(allSensors.value);
      }
    }
    flag = 2;
  }
  if (flag !== 1) {
    // 清除图上标记
    mapRef.value?.clear();
    // 在地图上标注这些点
    // 传感器
    for (let j = 0; j < allSensors.value.length; j++) {
      for (let k = 0; k < allSensors.value[j].length; k++) {
        mapRef.value?.addMarkOnMap(
          SENSOR,
          [16, 16],
          [allSensors.value[j][k].lng, allSensors.value[j][k].lat],
        );
      }
    }
    // 网关
    for (let j = 0; j < allGateways.value.length; j++) {
      for (let k = 0; k < allGateways.value[j].length; k++) {
        mapRef.value?.addMarkOnMap(
          GATEWAY,
          [32, 32],
          [allGateways.value[j][k].lng, allGateways.value[j][k].lat],
          [0, -16],
        );
      }
    }
    // 路口
    for (let j = 0; j < allCrossings.value.length; j++) {
      mapRef.value?.addMarkOnMap(
        CROSSING,
        [32, 32],
        [allCrossings.value[j].lng, allCrossings.value[j].lat],
        [0, -16],
      );
    }
  }
}

// 格式化标记点
function format() {
  pointArr.value = [];
  pts.value = [];
  allSensors.value = [];
  allGateways.value = [];
  allCrossings.value = [];
  mapRef.value?.clear();
}

async function sendData() {
  try {
    const { data } = await addMarksApi(
      allSensors.value,
      allGateways.value,
      allCrossings.value,
    );
    if (data.success === true) {
      ElMessage({
        type: "success",
        message: "成功",
      });
      format();
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

const saveDataDialog = ref(false);
const table_name = ref("");
const remarks = ref("");
async function sendDatasets() {
  try {
    const { data } = await addDatasetsApi(
      table_name.value,
      remarks.value,
      allSensors.value,
      allGateways.value,
      allCrossings.value,
    );
    if (data.success === true) {
      saveDataDialog.value = false;
      table_name.value = "";
      remarks.value = "";
      ElMessage({
        type: "success",
        message: "保存成功",
      });
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
  <!--  <div class="bm-view" style="background-color:#c51313;"></div>-->
  <div class="notification">
    车位:
    {{ allSensors.reduce((total: any, arr: any) => total + arr.length, 0) }}个
    灯杆:
    {{ allGateways.reduce((total: any, arr: any) => total + arr.length, 0) }}个
    路口: {{ allCrossings.length }}个
  </div>
  <baidu-map ref="mapRef" @add-mark="addMark"></baidu-map>
  <div class="func-area">
    节点类型:
    <el-select v-model="typeSelected" style="width: 120px">
      <el-option
        v-for="item in options"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <span class="typeS" v-if="typeSelected === 'sensors'">
      车位间距:
      <el-input-number v-model="sensorInterval" :min="2" :max="10" />
    </span>
    <span v-if="typeSelected === 'gateways'">
      灯杆间距:
      <el-input-number v-model="gatewayInterval" :min="10" :max="40" />
    </span>
    <el-button @click="format()">清空</el-button>
    <el-button @click="sendData()">保存数据</el-button>
    <el-button @click="saveDataDialog = true">保存到数据集</el-button>
  </div>
  <!--  输入对话框-->
  <el-dialog v-model="saveDataDialog" width="500">
    <span>请输入数据库表名：</span>
    <el-input v-model="table_name" style="width: 240px"></el-input><br /><br />
    <span>请输入数据集备注：</span>
    <el-input v-model="remarks" style="width: 240px"></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="saveDataDialog = false">取消</el-button>
        <el-button type="primary" @click="sendDatasets()"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.func-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-size: 20px;
}

.func-area > * {
  margin-right: 10px;
}

.func-area .typeS {
  display: flex;
  align-items: center;
  justify-content: center;
}
.notification {
  position: absolute;
  top: 10px; /* 调整位置 */
  left: 100px; /* 调整位置 */
  background-color: rgba(182, 182, 182, 0.8);
  padding: 5px;
  border-radius: 20px;
  font-size: 30px;
  z-index: 50;
  font-weight: bold;
}
</style>
