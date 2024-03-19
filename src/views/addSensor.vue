<script setup lang="ts">
import { ref } from "vue";
import BaiduMap from "@/components/baiduMap.vue";

// 子组件实例
interface MapRef {
  hw: () => void;
  addMarkOnMap: (url: string, size: number[], position: number[]) => void;
  getDistance: (start: number[], end: number[]) => number;
  clear: () => void;
}
const mapRef = ref<MapRef | null>(null);

// 标记用变量
const pointArr = ref([] as any); //存放一条路的起点与终点
const pts = ref([] as any); //存放一条路所有的传感器节点
const pointIndex = ref(0); //初始化节点之间的距离
const all = ref([] as any); //存放地图上所有标记的节点

// 传感器图标
const SENSOR = "src/components/icons/point.png";
// 车位图标
// const PARK = 'src/components/icons/parkingspace.png'
// const SIZE2 = [32, 48]

// 子组件点击地图时触发标注事件
function addMark(point: any) {
  pointArr.value.push(point);
  mapRef.value?.addMarkOnMap(
    "",
    [16, 16],
    [pointArr.value[0].lng, pointArr.value[0].lat],
  );
  // // 如果点个数大于1
  if (pointArr.value.length > 1) {
    // console.log(pointArr.value)
    mapRef.value?.addMarkOnMap(
      "",
      [16, 16],
      [pointArr.value[1].lng, pointArr.value[1].lat],
    );
    const x1 = pointArr.value[0].lng;
    const y1 = pointArr.value[0].lat;
    const x2 = pointArr.value[1].lng;
    const y2 = pointArr.value[1].lat;
    pointArr.value = [];
    // 节点间距
    pointIndex.value = 5;
    let chang = mapRef.value?.getDistance([x1, y1], [x2, y2]);
    // console.log(chang)
    if (chang) {
      //利用相似三角形求出所有点的坐标
      for (let i = pointIndex.value; i < chang; i += pointIndex.value) {
        let x3 = (i / chang) * (x1 - x2) + x2;
        x3 = x3.toFixed(8);
        let y3 = (i / chang) * (y1 - y2) + y2;
        y3 = y3.toFixed(8);
        pts.value.push([x3, y3]);
      }
    }

    //二维数组，存放多条街道的坐标点
    all.value.push(pts.value);
    console.log(all.value);

    // 清除图上标记
    mapRef.value?.clear();
    // 在地图上标注这些点
    for (let j = 0; j < all.value.length; j++) {
      for (let k = 0; k < all.value[j].length; k++) {
        mapRef.value?.addMarkOnMap(
          SENSOR,
          [16, 16],
          [all.value[j][k][0], all.value[j][k][1]],
        );
      }
    }
  }
}
</script>

<template>
  <!--  <div class="bm-view" style="background-color:#c51313;"></div>-->
  <baidu-map ref="mapRef" noti-text="车位" @add-mark="addMark"></baidu-map>
</template>

<style></style>
