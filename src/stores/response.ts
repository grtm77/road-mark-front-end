import { defineStore } from "pinia";
import { ref } from "vue";

export const useResponseStore = defineStore({
  id: "response",
  state: () => ({
    loading: true,
    responseData: null as any,
  }),
  actions: {},
});
