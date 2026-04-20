import api from "./api";

export const getMyOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const placeOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};