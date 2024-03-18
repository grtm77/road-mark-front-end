<script setup lang="ts">
import { ref } from "vue";
import BaiduMap from "@/components/baiduMap.vue";

// 子组件出发标注事件
function addMark(point: any) {
  console.log(point);
}
</script>

<template>
  <!--  <div class="bm-view" style="background-color:#c51313;"></div>-->
  <baidu-map @add-mark="addMark"></baidu-map>
</template>

<style></style>
