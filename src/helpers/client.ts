import axios, { AxiosRequestConfig } from "axios";

export async function client<T>(
  endpoint: string,
  configs?: AxiosRequestConfig,
) {
  const defaultConfigs: AxiosRequestConfig = {
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await axios<T>(endpoint, {
    ...defaultConfigs,
    ...configs,
  });

  return res.data;
}
