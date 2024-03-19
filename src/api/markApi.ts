import server from "../utils/axios";

export const addMarksApi = async (
  sensors: number[],
  gateways: number[],
  crossings: number[],
) => {
  return await server.put("/addMarks", {
    sensors: sensors,
    gateways: gateways,
    crossings: crossings,
  });
};
