import { http } from "@/utils/http";

export type UserResult = {
  statusCode: number,
  data: {
    /** token */
    tokenInfo: {
      /** `token值 */
      token: string,
      /** `accessToken`的过期时间（时间戳） */
      expires: number
    },
    userInfo: {
      avatar: string,
      /** 用户名 */
      username: string,
      id: number,
      last_login_time: number
      roles?: Array<string>;
    }
  }
};

export type RefreshTokenResult = {
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/auth/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};

export const getMethodList = (data) => {
  return http.request("post", "/adminmethod/getMethodAll", { data })
}