import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapStore = defineStore({
  id: "map",
  state: () => ({
    mapRef: null as any,
  }),
  actions: {
    setMapRef(ref: HTMLDivElement) {
      this.mapRef = ref;
    },
  },
});
