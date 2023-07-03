import axios, { AxiosError, AxiosRequestHeaders } from "axios";

export type AxiosResponseType =
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text"
  | "stream";

const callApi = async (
  method: string,
  path: string,
  data?: any,
  jwt?: string,
  params?: any,
  responseType?: AxiosResponseType
) => {
  let headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    withCredentials: true,
  };
  // console.log(headers);
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  // let baseUrl: string = "";
  // if (window.location.protocol === "http:") {
  //   baseUrl = "http://sslo.ai:8829/rest/api/1";
  // } else {
  //   baseUrl = "https://sslo.ai/rest/api/1";
  // }
  const baseUrl = "http://sslo.ai:8829/rest/api/1";
  const requestUrl = `${baseUrl}${path}`;
  // ! method ===> GET | DELETE
  if (method === "get" || method === "delete") {
    if (params && responseType) {
      return axios[method](requestUrl, { headers, params, responseType }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            // if (
            //   err.response &&
            //   err.response.status === 401 &&
            //   err.response.statusText === "UNAUTHORIZED"
            // ) {
            //   window.location.href = "/login";
            //   return;
            // }
            // if (err.response && err.response.status === 500) {
            //   window.location.href = `/networkerror?statusCode=${
            //     err.response.status
            //   }&errorMsg=${err.response.data}`;
            //   return;
            // }
            console.log(err);
          } else {
            console.log(err);
          }
        }
      );
    }
    if (params && !responseType) {
      return axios[method](requestUrl, { headers, params }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            // if (
            //   err.response &&
            //   err.response.status === 401 &&
            //   err.response.statusText === "UNAUTHORIZED"
            // ) {
            //   window.location.href = "/login";
            //   return;
            // }
            // if (err.response && err.response.status === 500) {
            //   window.location.href = `/networkerror?statusCode=${
            //     err.response.status
            //   }&errorMsg=${err.response.data}`;
            //   return;
            // }
            console.log(err);
          } else {
            console.log(err);
          }
        }
      );
    }
    if (!params && responseType) {
      return axios[method](requestUrl, { headers, responseType }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            // if (
            //   err.response &&
            //   err.response.status === 401 &&
            //   err.response.statusText === "UNAUTHORIZED"
            // ) {
            //   window.location.href = "/login";
            //   return;
            // }
            // if (err.response && err.response.status === 500) {
            //   window.location.href = `/networkerror?statusCode=${
            //     err.response.status
            //   }&errorMsg=${err.response.data}`;
            //   return;
            // }
            console.log(err);
          } else {
            console.log(err);
          }
        }
      );
    }
    return axios[method](requestUrl, { headers }).catch(
      (err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          // if (
          //   err.response &&
          //   err.response.status === 401 &&
          //   err.response.statusText === "UNAUTHORIZED"
          // ) {
          //   window.location.href = "/login";
          //   return;
          // }
          // if (err.response && err.response.status === 500) {
          //   window.location.href = `/networkerror?statusCode=${
          //     err.response.status
          //   }&errorMsg=${err.response.data}`;
          //   return;
          // }
          console.log(err);
        } else {
          console.log(err);
        }
      }
    );
  }
  // ! method ===> POST | PUT
  if (method === "post" || method === "put") {
    if (params && data) {
      return axios[method](requestUrl, data, { headers, params }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            // if (
            //   err.response &&
            //   err.response.status === 401 &&
            //   err.response.statusText === "UNAUTHORIZED"
            // ) {
            //   window.location.href = "/login";
            //   return;
            // }
            // if (err.response && err.response.status === 500) {
            //   window.location.href = `/networkerror?statusCode=${
            //     err.response.status
            //   }&errorMsg=${err.response.data}`;
            //   return;
            // }
            console.log(err);
          } else {
            console.log(err);
          }
        }
      );
    }
    if (!params && responseType && data) {
      return axios[method](requestUrl, data, { headers, responseType }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            // if (
            //   err.response &&
            //   err.response.status === 401 &&
            //   err.response.statusText === "UNAUTHORIZED"
            // ) {
            //   window.location.href = "/login";
            //   return;
            // }
            // if (err.response && err.response.status === 500) {
            //   window.location.href = `/networkerror?statusCode=${
            //     err.response.status
            //   }&errorMsg=${err.response.data}`;
            //   return;
            // }
            console.log(err);
          } else {
            console.log(err);
          }
        }
      );
    }
    if (!params && data) {
      return axios[method](requestUrl, data, { headers }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            // if (
            //   err.response &&
            //   err.response.status === 401 &&
            //   err.response.statusText === "UNAUTHORIZED"
            // ) {
            //   window.location.href = "/login";
            //   return;
            // }
            // if (err.response && err.response.status === 500) {
            //   window.location.href = `/networkerror?statusCode=${
            //     err.response.status
            //   }&errorMsg=${err.response.data}`;
            //   console.log(err.response.data);
            //   return;
            // }
            // if (err.response.data === "current password is wrong") {
            //   return err.response;
            // }
            console.log(err);
            if (err.response) return err.response;
          } else {
            console.log(err);
          }
        }
      );
    }
    if (params && !responseType && !data) {
      return axios[method](requestUrl, null, { headers, params }).catch(
        (err: Error | AxiosError) => {
          if (axios.isAxiosError(err)) {
            /* if (
              err.response &&
              err.response.status === 401 &&
              err.response.statusText === "UNAUTHORIZED"
            ) {
              window.location.href = "/login";
              return;
            }
            if (err.response && err.response.status === 500) {
              window.location.href = `/networkerror?statusCode=${
                err.response.status
              }&errorMsg=${err.response.data}`;
              return;
            } */
          } else {
            console.log(err);
          }
        }
      );
    }
  }
};

export default callApi;
