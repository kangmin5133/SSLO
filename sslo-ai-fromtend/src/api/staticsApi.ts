import callApi from "./module";

export interface IGetStaticsTaskByProjectParams {
  project_id: number;
}

export interface IGetStaticsTaskByUserParams {
  project_id: number;
  user_id?: string;
  start?: number;
  end?: number;
}

export interface IGetStaticsTaskByDayParams {
  project_id: number;
  startBeforeDays?: number;
}

export interface IGetStaticsClassesParams {
  project_id: number;
}

export interface IStaticsTaskByDay {
  key: Date;
  data: number;
}

/** 개별 프로젝트 통계화면에서 프로젝트 전체 작업진행률에 필요한 데이터 */
export interface IPAllStatics {
  stepOneComplete: number;
  stepTwoComplete: number;
  totalCount: number;
}

/** 프로젝트 통계 > 작업자 통계에서 하단 단계별 작업자의 작업량에 필요한 데이터의 타입 <br>
 * stepOneComplete - 1단계(전처리 or 가공 or 수집/정제) 작업 파일 수 <br>
 * stepOneReject - 1단계(전처리 or 가공 or 수집/정제) 반려 파일 수 <br>
 * stepTwoComplete - 2단계(검수) 작업 파일 수 <br>
 * stepTwoReject - 2단계(검수) 반려 파일 수 <br>
 */
export interface IWorkerStatics {
  userId: string;
  userEmail: string;
  stepOneComplete: number;
  stepOneReject: number;
  stepTwoComplete: number;
  stepTwoReject: number;
}
/** 내 작업 > 내 작업 통계에서 작업상태
 * progressOneComplete - 1단계(미작업) 작업 파일 수
 * progressTwoComplete - 2단계(진행중) 작업 파일 수
 * progressThreeComplete - 3단계(완료) 작업 파일 수
 * progressFourComplete - 4단계(반려) 작업 파일 수
 **/
export interface IWorksProgressStatics {
  progressOneComplete: number;
  progressTwoComplete: number;
  progressThreeComplete: number;
  progressFourComplete: number;
  totalCount: number; //전체 총 카운트(작업+검수)
  stepCount?: number; //단계별 카운트
}

// eslint-disable-next-line
export default {
  getStaticsTaskByProject: (
    params: IGetStaticsTaskByProjectParams,
    jwt?: string
  ) => callApi("get", "/statics/project/task", null, jwt, params),
  getStaticsTaskByUser: (params: IGetStaticsTaskByUserParams, jwt?: string) =>
    callApi("get", "/statics/project/task/user", null, jwt, params),
  getStaticsTaskByDay: (params: IGetStaticsTaskByDayParams, jwt?: string) =>
    callApi("get", "/statics/project/task/day", null, jwt, params),
  getStaticsClasses: (params: IGetStaticsClassesParams, jwt?: string) =>
    callApi("get", "/statics/project/task/category", null, jwt, params),
  getMyStatics: (param: any, jwt?: string) =>
    callApi("get", "/statics/project/my/task", null, jwt, param),
  getMyStaticByDay: (param: any, jwt?: string) =>
    callApi("get", "/statics/project/my/task/day", null, jwt, param),
};
