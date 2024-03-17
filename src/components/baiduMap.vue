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

// 定义地图对象
let BMap: any = null; // 保存 BMap 对象的全局变量
let map: any = null; // 保存 map 对象的全局变量

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

// 地图加载完成，拿到地图对象
function ready({ BMap: BMapInstance, map: mapInstance }: any) {
  BMap = BMapInstance; // 将 BMap 保存到全局变量中
  map = mapInstance; // 将 map 保存到全局变量中

}
// 标记点
function addMark() {
  var myIcon = new BMap.Icon("src/components/icons/point.png", new BMap.Size(32, 32))
  var point1 = new BMap.Point(113.80848202641658, 22.816506505348503);
  var marker1 = new BMap.Marker(point1,{
    icon: myIcon
  });
  map.addOverlay(marker1)
  // $(function () {
  //   map.addEventListener('click', function (e) {
  //     var cros = $("#nodeType").val();
  //
  //     if (cros == "cros") {
  //
  //       pts.push(e.point);
  //       var markerCros = new BMap.Marker(e.point, {
  //         icon: sIcon
  //       });
  //
  //       map.addOverlay(markerCros);
  //     } else {
  //       pointArr.push(e.point);
  //       var start = new BMap.Point(pointArr[0].lng, pointArr[0].lat);
  //       map.addOverlay(new BMap.Marker(start));
  //       // pts.push(start);
  //
  //       var end = new BMap.Point(pointArr[1].lng, pointArr[1].lat);
  //       map.addOverlay(new BMap.Marker(end));
  //       // pts.push(end);
  //       pointArr = []
  //
  //       var x1 = start.lng;
  //       var y1 = start.lat;
  //       var x2 = end.lng;
  //       var y2 = end.lat;
  //
  //       var bool = $("#nodeType").val();
  //       if (bool == "sensor") {
  //         pointIndex = 5;
  //       } else {
  //         pointIndex = 15;
  //       }
  //
  //       var chang = map.getDistance(start, end).toFixed(2);
  //       //利用相似三角形求出等距离的点的坐标
  //       for (var i = pointIndex; i < chang; i += pointIndex) {
  //         var x3 = i / chang * (x1 - x2) + x2;
  //         x3 = x3.toFixed(6);
  //         var y3 = i / chang * (y1 - y2) + y2;
  //         y3 = y3.toFixed(6);
  //         var point = new BMap.Point(x3, y3);
  //         pts.push(point);
  //       }
  //
  //       //二维数组，存放多条街道的坐标点
  //       if (bool == "sensor") {
  //         all_sensor.push(pts)
  //         console.log(all_sensor[0][0].lng, all_sensor[0][0].lat);
  //       }
  //       all.push(pts)
  //       //pts = []//计算时需注释
  //       // 删除已经标注的点
  //       map.clearOverlays()
  //       //在地图上标注这些点
  //       // for (let j = pts.length; j >1; j--) {
  //       for (var j = 0; j < all.length; j++) {
  //         for (var k = 0; k < all[j].length; k++) {
  //           var point1 = new BMap.Point(all[j][k].lng, all[j][k].lat);
  //           var myNode = $("#nodeType").val();
  //           if (myNode == "sensor") {
  //             var xx1 = all[j][0].lng;
  //             var yy1 = all[j][0].lat;
  //             var xx2 = all[j][all[j].length - 1].lng;
  //             var yy2 = all[j][all[j].length - 1].lat;
  //             var angle = Math.atan2((yy1 - yy2), (xx2 - xx1))  //弧度  0.6435011087932844
  //             var theta = angle * (180 / Math.PI);  //角度  36.86989764584402
  //             var marker0 = new BMap.Marker(point1, {
  //               icon: rIcon
  //             });
  //             var marker1 = new BMap.Marker(point1, {
  //               icon: sIcon
  //             });
  //             marker0.setRotation(theta)
  //             map.addOverlay(marker0)
  //           } else {
  //             marker1 = new BMap.Marker(point1, {
  //               icon: gIcon
  //             });
  //           }
  //           map.addOverlay(marker1)
  //         }
  //       }
  //     }
  //   });
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
  >
    <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false"></bm-geolocation>
<!--    <bm-marker :position="{lng: 113.80848202641658, lat: 22.816506505348503}" :dragging="false" :icon=sIcon></bm-marker>-->
  </baidu-map>
  <el-button @click="addMark()">点击测试</el-button>
</template>

<style scoped>
.bm-view {
  width: 100%;
  height: 90%;
}
</style>
