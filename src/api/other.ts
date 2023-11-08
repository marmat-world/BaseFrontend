import { http } from "@/utils/http";

type Result = {
  statusCode: number;
  data: Array<any>;
};

export const getUploadConfig = () => {
  return http.request<Result>("get", "/auth/getAsyncRoutes");
};
