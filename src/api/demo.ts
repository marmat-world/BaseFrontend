
import { http } from "@/utils/http";

export const getMethodList = (data, pageInfo) => {
  return http.request("post", `/adminmethod/getMethodList`, {
    data,
    params: pageInfo
  });
};

export const addMethod = data => {
  return http.request("post", `/adminmethod/addMethod`, { data });
};

export const getMethodDetail = id => {
  return http.request("get", `/adminmethod/getMethodDetail`, { params: { id } });
};

export const updateMethod = data => {
  return http.request("patch", `/adminmethod/updateMethod`, {
    data,
    params: { id: data.id }
  });
};

export const deleteMethod = data => {
  return http.request("delete", `/adminmethod/deleteMethod`, {
    params: { id: data.id }
  });
}

export const deleteMethodBatch = data => {
  return http.request("delete", `/adminmethod/deleteMethodBatch`, {
    data,
    params: { ids: data }
  });
}

export const importMethod = data => {
  return http.request('post', '/adminmethod/importMethod', {
    data
  })
}
