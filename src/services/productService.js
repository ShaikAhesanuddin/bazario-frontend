import api from "./api";

export const searchProducts = async (query) => {
  const res = await api.get(`/products?query=${query}`);
  return res.data;
};

export const searchDefaultProducts = async () => {
  const res = await api.get(`/products`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};


export const getRelatedProducts = async (id) => {
  const res = await api.get(`/products/${id}/related`);
  return res.data;
};