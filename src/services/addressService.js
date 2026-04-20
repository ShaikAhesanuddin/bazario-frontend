import api from "./api";

export const addAddress = async (data) => {
  const res = await api.post(`/users/me/addresses`, data);
  return res.data;
};

export const getAddresses = async () => {
  const res = await api.get(`/users/me/addresses`);
  return res.data;
};

export const setDefaultAddress = async (addressId) => {
  const res = await api.patch(`/users/me/addresses/${addressId}/default`);
  return res.data;
};

export const deleteAddress = async (addressId) => {
  const res = await api.delete(`/users/me/addresses/${addressId}`);
  return res.data;
};