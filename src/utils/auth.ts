import Cookies from "js-cookie";
import { storageSession, storageLocal } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo {
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

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";
export const rolesKey = 'roles-key';

/** 获取`token` */
export function getToken(): DataInfo['tokenInfo'] {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  const tokenInfo: string = storageLocal().getItem(TokenKey)
  return tokenInfo ? JSON.parse(tokenInfo) : {};
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo) {
  const { userInfo, tokenInfo } = data;
  // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可
  const tokenInfoString = JSON.stringify(tokenInfo);
  const userInfoString = JSON.stringify(userInfo)
  const roleString = JSON.stringify(userInfo.roles)

  useUserStoreHook().SET_USERINFO(userInfo);
  useUserStoreHook().SET_ROLES(userInfo.roles);
  storageLocal().setItem(TokenKey, tokenInfoString);
  storageLocal().setItem(sessionKey, userInfoString);
  storageLocal().setItem(rolesKey, roleString);

}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  storageLocal().removeItem(TokenKey)
  storageLocal().removeItem(sessionKey)
  storageLocal().removeItem(rolesKey)
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
