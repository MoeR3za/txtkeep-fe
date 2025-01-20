import { AxiosResponse } from "axios";
import apiClient from "@/app/api/util/client";
import { IUser, IUserLogin } from "@/models/user";

export const login = (
  username: string,
  password: string,
): Promise<AxiosResponse<IUserLogin>> => {
  return apiClient.post(`/auth/login`, { username, password });
};

export const logout = (): Promise<AxiosResponse> => {
  return apiClient.post(`/auth/logout`);
};

export const register = (
  data: FormData,
): Promise<AxiosResponse<IUser>> => {
  return apiClient.post(`/auth`, data);
};
