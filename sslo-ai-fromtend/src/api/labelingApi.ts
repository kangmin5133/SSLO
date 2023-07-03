import callApi from "./module";
import { IProjectAnnotation } from "./projectApi";

export interface IUpdateTaskParams {
  project_id: number;
  task_id?: number;
}

export interface ICheckAutoLabeling {
  category_id: number;
  category_name: string;
  labeled_instance_count: number;
}

export interface IAnnotationType {
  annotation_type_id: number;
  annotation_type_name: string;
  annotation_type_desc: string;
  created: number;
  updated: number;
}

export interface IAnnotation {
  annotation_id: number;
  task_id: number;
  annotation_type: IAnnotationType;
  annotation_category: IProjectAnnotation;
  annotation_data: any[];
  created: number;
  updated: number;
}

export default {
  searchAnnotationByTask: (param: any) =>
    callApi("get", "/task/annotation/search", null, undefined, param),
  getAnnotation: (param: any) =>
    callApi("get", "/task/annotation", null, undefined, param),
  deleteAnnotation: (param: any, jwt?: string) =>
    callApi("delete", "/task/annotation/delete", null, jwt, param, undefined),
  updateAnnotation: (param: any, payload: any, jwt?: string) =>
    callApi("post", "/task/annotation/update", payload, jwt, param, undefined),
  createAnnotation: (param: any, payload: any, jwt?: string) =>
    callApi("post", "/task/annotation/create", payload, jwt, param, undefined),
  getAutoLabeling: (param: any) =>
    callApi("get", "/ai/autolabeling", null, undefined, param),
  checkLabelingStatus: (param: any) =>
    callApi("get", "/project/labeling/status/", null, undefined, param),
  startActiveLearning: (param: any) =>
    callApi("post", "/ai/activelearning/start", null, undefined, param),
  checkActiveAutoLabeling: (param: any) =>
    callApi("get", "/ai/activelearning/status", null, undefined, param),
  exportAnnotation: (payload: any, responseType: any) =>
    callApi("post", "/task/export", payload, undefined, null, responseType),
  getAutoLabelingBatch: (param: any) =>
    callApi("get", "/ai/autolabeling/batch", null, undefined, param),
  unloadModel: (param: any) =>
    callApi("get", "/ai/model/unload", null, undefined, param),
  uploadModel: (param: any) =>
    callApi("get", "/ai/model/upload", null, undefined, param),
};
