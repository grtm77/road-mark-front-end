<script setup lang="ts">
import { ref } from "vue";
import { BaiduMap } from "vue-baidu-map-3x";
import { defineProps, defineEmits } from "vue";

// 设置地图风格
const mapStyle = ref({
  styleJson: [
    {
      featureType: "building",
      elementType: "all",
      stylers: {
        visibility: "off",
      },
    },
    {
      featureType: "poilabel",
      elementType: "all",
      stylers: {
        visibility: "off",
      },
    },
    {
      featureType: "manmade",
      elementType: "all",
      stylers: {
        visibility: "off",
      },
    },
  ],
});
const mapType = ref("");

// 定义地图对象
let BMap: any = null; // 保存 BMap 对象的全局变量
let map: any = null; // 保存 map 对象的全局变量

// 地图标记点图标
// 网关图标
const GATEWAY = "src/components/icons/jian.png";
const SIZE = [16, 16];
// 传感器图标
const SENSOR = "src/components/icons/point.png";
// 车位图标
// const PARK = 'src/components/icons/parkingspace.png'
// const SIZE2 = [32, 48]
// 路口图标
const CROSSING = "src/components/icons/green.png";

// 标记用变量
const all_sensor = ref([] as any);
const pointArr = ref([] as any); //存放一条路的起点与终点
const pts = ref([] as any); //存放一条路所有的传感器节点
const pointIndex = ref(0); //初始化节点之间的距离
const all = ref([] as any); //存放地图上所有标记的节点

// 地图加载完成，拿到地图对象
function ready({ BMap: BMapInstance, map: mapInstance }: any) {
  BMap = BMapInstance; // 将 BMap 保存到全局变量中
  map = mapInstance; // 将 map 保存到全局变量中
  const defaultMapType = map.getMapType();
  const defaultTileLayer = defaultMapType.getTileLayer(); //创建一个地图图层
  mapType.value = new BMap.MapType("newmap", defaultTileLayer, {
    minZoom: 15,
    maxZoom: 18,
  });
  // map.setMapType(mapType);
}

// 新增单个标记点
function addMark(url: string, size: number[], position: number[]) {
  let myIcon = new BMap.Icon(url, new BMap.Size(size[0], size[1]));
  let point = new BMap.Point(position[0], position[1]);
  let marker = new BMap.Marker(point, {
    icon: myIcon,
  });
  map.addOverlay(marker);
}

// 向父组件传递事件
const emit = defineEmits(["addMark"]);
function callParent() {
  // 向上传递事件
  emit("addMark", "Hello world");
}

// 地图点击事件
function mapClick({ point }: any) {
  pointArr.value.push(point);
  // console.log(pointArr.value[0].lng)
  const start = new BMap.Point(pointArr.value[0].lng, pointArr.value[0].lat);
  let marker = new BMap.Marker(start);
  map.addOverlay(marker);
  // 如果点个数大于1
  if (pointArr.value.length > 1) {
    const end = new BMap.Point(pointArr.value[1].lng, pointArr.value[1].lat);
    let marker = new BMap.Marker(end);
    map.addOverlay(marker);
    const x1 = start.lng;
    const y1 = start.lat;
    const x2 = end.lng;
    const y2 = end.lat;
    pointArr.value = [];
    // 节点间距
    pointIndex.value = 5;
    const chang = map.getDistance(start, end).toFixed(4);
    // console.log(chang)

    //利用相似三角形求出所有点的坐标
    for (let i = pointIndex.value; i < chang; i += pointIndex.value) {
      let x3 = (i / chang) * (x1 - x2) + x2;
      x3 = x3.toFixed(8);
      let y3 = (i / chang) * (y1 - y2) + y2;
      y3 = y3.toFixed(8);
      let point1 = new BMap.Point(x3, y3);
      pts.value.push(point1);
    }

    //二维数组，存放多条街道的坐标点
    all_sensor.value.push(pts.value);
    all.value.push(pts.value);
    // console.log(all_sensor.value)

    // 清除图上标记
    map.clearOverlays();
    // 在地图上标注这些点
    for (let j = 0; j < all_sensor.value.length; j++) {
      for (let k = 0; k < all_sensor.value[j].length; k++) {
        addMark(SENSOR, SIZE, [
          all_sensor.value[j][k].lng,
          all_sensor.value[j][k].lat,
        ]);
        // console.log(all_sensor.value[j][k].lng, all_sensor.value[j][k].lat)
        // marker0.setRotation(theta)
      }
    }
  }
}
</script>

<template>
  <baidu-map
    class="bm-view"
    :center="{ lng: 113.80848202641658, lat: 22.816506505348503 }"
    :zoom="21"
    :min-zoom="15"
    :max-zoon="25"
    :scroll-wheel-zoom="true"
    :mapStyle="mapStyle"
    @ready="ready"
    @click="mapClick"
  >
    <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
    <!--    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>-->
    <bm-geolocation
      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      :showAddressBar="false"
    ></bm-geolocation>
    <!--    <bm-marker :position="{lng: 113.80848202641658, lat: 22.816506505348503}" :dragging="false" :icon=sIcon></bm-marker>-->
  </baidu-map>
  <el-button
    @click="addMark(SENSOR, SIZE, [113.80848202641658, 22.816506505348503])"
    >传感器</el-button
  >
  <el-button
    @click="addMark(GATEWAY, SIZE, [113.80868202641658, 22.816506505348503])"
    >网关</el-button
  >
  <el-button
    @click="addMark(CROSSING, SIZE, [113.80848202641658, 22.816906505348503])"
    >路口</el-button
  >
  <el-button @click="callParent()">向父组件发送事件</el-button>
  <el-button @click="map.clearOverlays()">清空</el-button>
</template>

<style scoped>
.bm-view {
  width: 100%;
  height: 90%;
}
</style>
