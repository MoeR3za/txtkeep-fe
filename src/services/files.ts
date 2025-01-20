import { AxiosResponse } from "axios";
import apiClient from "@/app/api/util/client";
import { IFile } from "@/models/files";
import { IPaginated } from "@/models/paginated";
import { ISuccessResponse } from "@/models/api";

export const uploadFile = (
  data: FormData,
): Promise<AxiosResponse<IFile>> => {
  return apiClient.post(`/files`, data);
};

export const getFile = (id: string): Promise<AxiosResponse<IFile>> => {
  return apiClient.get(`/files/${id}`);
};

export const getFiles = (): Promise<AxiosResponse<IPaginated<IFile>>> => {
  return apiClient.get(`/files`);
};

export const searchFiles = (query: string): Promise<AxiosResponse<IPaginated<IFile>>> => {
  return apiClient.get(`/files?q=${query}`);
};

export const deleteFile = (id: string): Promise<AxiosResponse<ISuccessResponse>> => {
  return apiClient.delete(`/files/${id}`);
};
