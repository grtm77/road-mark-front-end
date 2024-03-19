<script setup lang="ts">
import { ref } from "vue";
import { BaiduMap } from "vue-baidu-map-3x";
import { defineProps, defineEmits } from "vue";

// 显示当前标注内容
defineProps<{
  notiText?: string;
}>();

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
// 传感器图标
const SENSOR = "src/components/icons/point.png";
// 车位图标
// const PARK = 'src/components/icons/parkingspace.png'
// const SIZE2 = [32, 48]
// 路口图标
const CROSSING = "src/components/icons/green.png";

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
function addMarkOnMap(
  url: string,
  size: number[],
  position: number[],
  offset: number[] = [0, 0],
) {
  let myIcon;
  if (url === "") {
    myIcon = null;
  } else {
    myIcon = new BMap.Icon(url, new BMap.Size(size[0], size[1]));
  }
  let offset1 = new BMap.Size(offset[0], offset[1]);
  let point = new BMap.Point(position[0], position[1]);
  let marker = new BMap.Marker(point, {
    icon: myIcon,
    offset: offset1,
  });
  map.addOverlay(marker);
}

// 获取点距离
function getDistance(start: number[], end: number[]) {
  return map
    .getDistance(
      new BMap.Point(start[0], start[1]),
      new BMap.Point(end[0], end[1]),
    )
    .toFixed(4);
}

// 清除标记
function clear() {
  map.clearOverlays();
}

// 向父组件传递事件
const emit = defineEmits(["addMark"]);

function hw() {
  console.log("Yes");
}

// 地图点击事件,传递给父组件
function mapClick({ point }: any) {
  emit("addMark", point);
}

// 向外暴露方法
defineExpose({
  hw,
  addMarkOnMap,
  getDistance,
  clear,
});
</script>

<template>
  <div class="notification">现在进行{{ notiText }}标注</div>
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
    @click="
      addMarkOnMap(SENSOR, [16, 16], [113.80848202641658, 22.816506505348503])
    "
    >传感器</el-button
  >
  <el-button
    @click="
      addMarkOnMap(GATEWAY, [32, 32], [113.80868202641658, 22.816506505348503])
    "
    >网关</el-button
  >
  <el-button
    @click="
      addMarkOnMap(CROSSING, [32, 32], [113.80848202641658, 22.816906505348503])
    "
    >路口</el-button
  >
  <!--  <el-button @click="callParent()">向父组件发送事件</el-button>-->
  <el-button @click="map.clearOverlays()">清空</el-button>
</template>

<style scoped>
.bm-view {
  width: 100%;
  height: 90%;
}
.notification {
  position: absolute;
  top: 10px; /* 调整位置 */
  left: 20px; /* 调整位置 */
  background-color: rgba(182, 182, 182, 0.8);
  padding: 5px;
  border-radius: 20px;
  font-size: 40px;
  z-index: 50;
  font-weight: bold;
}
</style>
