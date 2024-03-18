<script setup lang="ts">
import { ref } from "vue";
import BaiduMap from "@/components/baiduMap.vue";

// 标记用变量
const all_sensor = ref([]);
const pointArr = ref([]); //存放一条路的起点与终点
const pts = ref([]); //存放一条路所有的传感器节点
const str = ref([]);
const pointIndex = ref(0); //初始化节点之间的距离
const all = ref([]); //存放地图上所有标记的节点

// 标记点
function addMark() {}
</script>

<template>
  <!--  <div class="bm-view" style="background-color:#c51313;"></div>-->
  <baidu-map></baidu-map>
</template>

<style></style>
