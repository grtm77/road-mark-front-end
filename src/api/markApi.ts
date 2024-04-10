import server from "../utils/axios";

export const addMarksApi = async (
  sensors: number[],
  gateways: number[],
  crossings: number[],
) => {
  return await server.post("/addMarks", {
    sensors: sensors,
    gateways: gateways,
    crossings: crossings,
  });
};

export const getDatasetsListApi = async () => {
  return await server.get("/loadDatasets");
};

export const getDataApi = async (name: any) => {
  return await server.get("/loadData?table_name=" + name);
};

export const calcApi = async (name: string, algorithm: number) => {
  return await server.get("/calc?table_name=" + name + "&algorithm=" + algorithm);
};
