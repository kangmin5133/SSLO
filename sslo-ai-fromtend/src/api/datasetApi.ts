import callApi from "./module";

export interface IDataset {
  datasetId: number;
  datasetName: string;
  datasetItemsCount: number;
  datasetItemsSize: number;
  datasetCategory: string;
  datasetSubCategory: string;
}

export interface IGetDatasetParams {
  dataset_name?: string;
  startAt?: number;
  maxResults?: number;
}

// eslint-disable-next-line
export default {
  getDatasets: (params?: IGetDatasetParams, jwt?: string) =>
    callApi("get", "/dataset/search", null, jwt, params),
};
