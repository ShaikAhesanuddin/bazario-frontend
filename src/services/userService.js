import api from "./api";

export const getMyProfile = async () => {
  const res = await api.get(`/users/me`);
  return res.data;
};

export const updateMyProfile = async (data) => {
  const res = await api.put(`/users/me`, data);
  return res.data;
};

export const deleteMyProfile = async () => {
  const res = await api.delete(`/users/me`);
  return res.data;
};