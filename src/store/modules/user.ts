import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession, storageLocal } from "@pureadmin/utils";
import { getLogin, refreshTokenApi } from "@/api/user";
import { UserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  type DataInfo,
  setToken,
  removeToken,
  TokenKey,
  sessionKey,
  rolesKey
} from "@/utils/auth";

const userTypeData = {
  userInfo() {
    const userInfo: string = storageLocal().getItem(sessionKey);
    return userInfo ? JSON.parse(userInfo) : {};
  },
  role() {
    const r: string = storageLocal().getItem(rolesKey);
    return r ? JSON.parse(r) : [];
  }
};

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    userInfo: userTypeData.userInfo(),
    // 页面级别权限
    roles: userTypeData.role()
  }),
  actions: {
    /** 存储用户名 */
    SET_USERINFO(userInfo: DataInfo["userInfo"]) {
      this.userInfo = userInfo;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(res => {
            if (res) {
              setToken(res.data);
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.userInfo = null;
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(res => {
            if (res) {
              //setToken(res.data);
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
