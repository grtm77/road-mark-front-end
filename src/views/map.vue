<script setup lang="ts">

import {ref} from "vue";
import {BaiduMap} from "vue-baidu-map-3x";

// 设置地图风格
const mapStyle = ref({
  styleJson: [
    {
      "featureType": "building",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    },
    {
      "featureType": "poilabel",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    },
    {
      "featureType": "manmade",
      "elementType": "all",
      "stylers": {
        "visibility": "off"
      }
    },
  ]
});

// 地图标记点图标
// 网关图标
const gIcon = {url: 'src/components/icons/jian.png', size: {width: 32, height: 32}}
// 传感器图标
const sIcon = {url: 'src/components/icons/point.png', size: {width: 32, height: 32}}
// 车位图标
const rIcon = {url: 'src/components/icons/parkingspace.png', size: {width: 48, height: 48}}
// 路口图标
const cIcon = {url: 'src/components/icons/green.png', size: {width: 32, height: 32}}


// 标记用变量
const all_sensor = ref([]);
const pointArr = ref([]);//存放一条路的起点与终点
const pts = ref([]);//存放一条路所有的传感器节点
const str = ref([]);
const pointIndex = ref(0); //初始化节点之间的距离
const all = ref([]);//存放地图上所有标记的节点

// 标记点
function addMark() {

}



</script>

<template>
  <!--  <div class="bm-view" style="background-color:#c51313;"></div>-->
  <baidu-map
      class="bm-view"
      :center="{ lng: 113.80848202641658, lat: 22.816506505348503 }"
      zoom="21"
      min-zoom="15"
      max-zoon="25"
      scroll-wheel-zoom="true"
      :mapStyle="mapStyle"
  >
    <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false"></bm-geolocation>
    <bm-marker :position="{lng: 113.80848202641658, lat: 22.816506505348503}" :dragging="false" :icon=sIcon></bm-marker>
  </baidu-map>
</template>

<style>
.bm-view {
  width: 100%;
  height: 100%;
}
</style>
