import { defineStore } from "pinia";
import { ref } from "vue";

export const useResponseStore = defineStore({
  id: "response",
  state: () => ({
    responseData: null as any,
  }),
  actions: {
    setResponseData(data: any) {
      this.responseData = data;
    },
  },
});
