import { ClassAttrType } from "../components/main/ClassGenerator";
import callApi from "./module";

export interface IGetAllProjectsParams {
  startAt?: number;
  maxResults?: number;
  project_name?: string;
  created_start?: number;
  created_end?: number;
  project_type_id?: number;
  project_status?:number;
}

/** 1: 수집/정제, 2: 전처리, 3: 가공 */
export interface IPType {
  project_type_id: number;
  project_type_name: string;
  created: number;
}
/** 1: 데이터셋, 2:크롤링, 3:데이터업로드 */
export interface IPDetail {
  data_type: number;
  dataset_ids?: number;
}

export interface IProject {
  pNo: number;
  pName: string;
  pDesc?: string;
  pType: IPType;
  pDetail?:IPDetail;
  pWorkerCount: any;
  pCreated: number;
  pUpdated?: number;
}

export interface IGetProjectParam {
  project_id: number;
  project_detail?: {
    data_type?: number;
    dataset_ids?: number[];
    crawling_channel_type?: string;
    crawling_keywords?: string[];
    crawling_period_type?: number;
    crawling_period_start?: number;
    crawling_period_end?: number;
    crawling_limit?: number;
    project_categories?: IProjectAnnotation[];
  };
}

export interface ISimpleProjectInfo {
  projectId: number;
  projectName: string;
  projectType: number;
}

export interface IProjectInfo {
  projectId: number;
  projectName: string;
}

export interface IProjectCategories {
  projectId: number;
  project_categories: IProjectAnnotation[];
}

export interface IAnnotationAttribute {
  annotation_category_attr_name: string;
  annotation_category_attr_desc?: string;
  annotation_category_attr_type?: number;
  annotation_category_attr_type_name?: ClassAttrType;
  annotation_category_attr_val?: string[];
  annotation_category_attr_limit_min?: number;
  annotation_category_attr_limit_max?: number;
}

export interface IProjectAnnotation {
  annotation_category_id?: number;
  annotation_category_name?: string;
  annotation_category_parent_id?: number;
  annotation_category_color?: string;
  annotation_category_attributes?: IAnnotationAttribute[];
}


export interface ICreatePcrawlPayload {
  project_name: string;
  project_desc: string;
  project_manager: {
    user_id: string;
  };
  project_type: {
    project_type_id: number;
  };
  project_detail?: {
    data_type?: number;
    dataset_ids?: number[];
    crawling_channel_type?: string;
    crawling_keywords?: string[];
    crawling_period_type?: number;
    crawling_period_start?: number;
    crawling_period_end?: number;
    crawling_limit?: number;
    project_categories?: IProjectAnnotation[];
  };
}

export interface IUpdateProjectPayload {
  project_id: number;
  project_name: string;
  project_desc: string;
  project_manager: {
    user_id: string;
  };
}

export interface IModelConfig {
  project_id: number;
  model_name: string;
  model_aug: number;
  model_epoch: number;
  model_lr: number;
  model_conf: number;
  model_batch: number;
  created?: number;
  updated?: number;
}

export interface IModel {
  name: string; 
  type: string;
  version: number;
  status: string;
  progress: number;
  backbone: string;
  create: string;
}

export interface IModelLog {
  project_id: number; 
  task_type: string;
  version: number;
  metrics: IModelMetrics[];
}

export interface IModelMetrics {
  data_time: number; 
  eta_seconds: number;
  'fast_rcnn/cls_accuracy': number;
  'fast_rcnn/false_negative': number;
  'fast_rcnn/fg_cls_accuracy': number;
  iteration: number; 
  loss_box_reg: number;
  loss_cls: number;
  loss_rpn_cls: number;
  loss_rpn_loc: number;
  lr: number;
  'roi_head/num_bg_samples': number;
  'roi_head/num_fg_samples': number;
  'rpn/num_neg_anchors': number;
  'rpn/num_pos_anchors': number;
  time: number;
  total_loss: number;
}

// eslint-disable-next-line
export default {
  getAllProjects: (params?: IGetAllProjectsParams, jwt?: string) =>
    callApi("get", "/project/search", null, jwt, params),
  getProject: (param: IGetProjectParam, jwt?: string) =>
    callApi("get", "/project", null, jwt, param),
  createProject: (payload: ICreatePcrawlPayload, jwt?: string) =>
    callApi("post", "/project/create", payload, jwt, null),
  deleteProject: (params: IGetProjectParam, jwt?: string) =>
    callApi("delete", "/project/delete", null, jwt, params),
  updateProject: (payload: IUpdateProjectPayload, jwt?: string) =>
    callApi("post", "/project/update", payload, jwt, null),
  addProjectMember: (payload: any, jwt?: string) =>
    callApi("post", "/project/member/add", payload, jwt, null),
  removeProjectMember: (payload: any) =>
    callApi("post", "/project/member/del", payload, undefined, null),
  searchModelList: (param: any) => 
    callApi("get", "/ai/model/search", null, undefined, param),
  getModelConfig: (param: any) => 
    callApi("get", "/ai/model/config", null, undefined, param),
  updateModelConfig: (payload: any) =>
    callApi("post", "/ai/model/config/update", payload, undefined, null),
  getModelTrainLog: (payload: any) =>
    callApi("post", "/ai/model/logs", payload, undefined, null),
  exportModel: (payload: any) => 
    callApi("post", "/ai/model/export", payload, undefined, null, "blob"),
};
