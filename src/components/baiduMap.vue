<script setup lang="ts">
import { ref } from "vue";
import { BaiduMap } from "vue-baidu-map-3x";

// 显示当前标注内容
// defineProps<{
//   notiText?: string;
// }>();

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

// 向父组件传递事件
const emit = defineEmits(["addMark", "mapReady"]);

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
  console.log("Map ready!");
  emit("mapReady");
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
    .toFixed(10);
}

// 清除标记
function clear() {
  map.clearOverlays();
}

// 地图点击事件,传递给父组件
function mapClick({ point }: any) {
  emit("addMark", point);
}

// 向外暴露方法
defineExpose({
  addMarkOnMap,
  getDistance,
  clear,
});
</script>

<template>
  <!--  <div class="notification">现在进行{{ notiText }}标注</div>-->
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
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
      anchor="BMAP_ANCHOR_TOP_LEFT"
    ></bm-map-type>
    <bm-geolocation
      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      :showAddressBar="false"
    ></bm-geolocation>
    <!--    <bm-marker :position="{lng: 113.80848202641658, lat: 22.816506505348503}" :dragging="false" :icon=sIcon></bm-marker>-->
  </baidu-map>
</template>

<style scoped>
.bm-view {
  width: 100%;
  height: 90%;
}
</style>
