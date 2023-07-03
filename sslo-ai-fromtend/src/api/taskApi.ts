import { WorkStatusType } from "../screens/studio/preprocessing/PreProcessingContainer";
import { IAnnotation } from "./labelingApi";
import callApi, { AxiosResponseType } from "./module";

export interface IUpdateTaskParams {
  project_id: number;
  task_id?: number;
}

export interface ITaskBatchPayload {
  originalDataURL: string;
  originalWidth: number;
  originalHeight: number;
}

export interface IUpdateTaskStatusParams {
  project_id: number;
  task_id: number;
}

//! Task에 할당되는 임의의 유저에 대한 interface
export interface ITaskCommonUser {
  id: string;
  displayName: string;
  email: string;
}

export interface IGetRejectCommentParams {
  project_id: number;
  task_id: number;
}

// ! Task interface
// ! taskStep -> 1: 1단계(전처리면 전처리, 가공이면 가공, 수집이면 수집) / 2: 2단계 (검수)
export interface ITask {
  projectId?: any;
  projectType?: number;
  projectName?: string;
  projectTypeName?: string;
  taskId: number;
  taskName?: string;
  imageName?: string;
  image?: string;
  imageThumbnail?: string;
  imageSize?: number;
  taskStatus: number;
  taskStep?: number;
  taskStatusName?: WorkStatusType | undefined;
  imageFormat?: string;
  imageWidth?: number;
  imageHeight?: number;
  taskWorker?: ITaskCommonUser | null;
  taskValidator?: ITaskCommonUser | null;
  created?: number;
  updated?: number;
  objectCount?: number;
  annotation?: IAnnotation[];
}

export interface IGetAllTaskParam {
  project_id: any;
  project_type?: number;
  task_name: string;
  task_status_progress: string;
  updated: number;
  task_status_step: number;
}
export interface IGetTaskByUserParam {
  project_id: any;
  task_name?: string;
  task_worker?: string;
  task_validator?: string;
  task_worker_or_validator?: string;
  task_status_step?: string;
  task_status_progress?: string;
}
// eslint-disable-next-line
export default {
  searchTaskByProject: (param: any, jwt?: string) =>
    callApi("get", "/task/search", null, jwt, param),
  getTaskData: (param: any, responseType: AxiosResponseType, jwt?: string) =>
    callApi("get", "/task/data", null, jwt, param, responseType),
  getTask: (param: any, jwt?: string) =>
    callApi("get", "/task", null, jwt, param),
  updateTaskData: (param: IUpdateTaskParams, payload: FormData, jwt?: string) =>
    callApi("post", "/task/data/update", payload, jwt, param, undefined),
  updateTask: (param: IUpdateTaskParams, payload: any, jwt?: string) =>
    callApi("post", "/task/update", payload, jwt, param, undefined),
  updateTaskStatus: (
    params: IUpdateTaskStatusParams,
    payload: any,
    jwt?: string
  ) => callApi("post", "/task/status/update", payload, jwt, params, undefined),
  createTask: (param: any, payload: FormData, jwt?: string) =>
    callApi("post", "/task/create", payload, jwt, param, undefined),
  getTaskRejectComment: (params: IGetRejectCommentParams, jwt?: string) =>
    callApi("get", "/task/comment/reject", undefined, jwt, params, undefined),
  getTaskByUser: (param: any, jwt?: string) =>
    callApi("get", "/task/my", null, jwt, param),
  importTaskByProject: (param: any, payload: any, jwt?: string) =>
    callApi("post", "/task/importFromProject", payload, jwt, param, undefined),
};
