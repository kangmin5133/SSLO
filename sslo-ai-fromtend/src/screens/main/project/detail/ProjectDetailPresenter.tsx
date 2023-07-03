import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  ChakraProvider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuOptionGroup,
  MenuItemOption,
  Button as ChakraBtn,
  Text as ChakraText,
  Checkbox as ChakraCheckbox,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
  extendTheme,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Spinner,
  Td,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { ChangeEvent, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import iconArrow from "../../../../assets/images/project/icon/icon-arrow01.svg";
import {
  IAnnotationAttribute,
  IGetProjectParam,
  IProject,
  IProjectAnnotation,
} from "../../../../api/projectApi";
import { ITask } from "../../../../api/taskApi";
import { IUser, IProjectUser } from "../../../../api/userApi";
import Header from "../../../../components/main/Header";
import InnerSidebar from "../../../../components/main/InnerSidebar";
import ListHeader from "../../../../components/main/ListHeader";
import ListItem from "../../../../components/main/ListItem";
import Paginator from "../../../../components/main/Paginator";
import Loader from "../../../../components/Loader";
import iconSearch from "../../../../assets/images/project/icon/icon-search-white.svg";
import iconPrev from "../../../../assets/images/project/icon/icon-prev.svg";
import iconNext from "../../../../assets/images/project/icon/icon-next.svg";
import iconZoomDec from "../../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../../assets/images/studio/header/icon-zoom-inc.svg";
import iconCalendar from "../../../../assets/images/project/icon/icon-calendar.svg";
import { CollectDataType, InnerSidebarItem } from "./ProjectDetailContainer";
import iconSelected from "../../../../assets/images/project/icon/icon-selected.svg";
import iconGuideModelSetting from "../../../../assets/images/project/icon/icon-guide-model-setting.svg";
import iconDragTask from "../../../../assets/images/project/icon/icon-drag-task.svg";
import arrowUp from "../../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../../assets/images/studio/icon/icon-down.svg";
import logoPytorch from "../../../../assets/images/project/img/logo-pytorch.svg";
import logoOnnx from "../../../../assets/images/project/img/logo-onnx.svg";
import logoTensorflow from "../../../../assets/images/project/img/logo-tensorflow.svg";
import logoKeras from "../../../../assets/images/project/img/logo-keras.svg";
import {
  LineChart,
  PieArcSeries,
  PieChart,
  Gridline,
  GridlineSeries,
  LineSeries,
  Line,
  BarChart,
  LinearXAxis,
  LinearYAxis,
  LinearYAxisTickSeries,
  BarSeries,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  PointSeries,
} from "reaviz";
import {
  IPAllStatics,
  IStaticsTaskByDay,
  IWorkerStatics,
} from "../../../../api/staticsApi";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../all/calendar.css";
import { Helmet } from "react-helmet-async";
import { IUserState } from "../../../../redux/user/users";
import LoaderText from "../../../../components/LoaderText";
import {
  ClassAttrType,
  IClassAttr,
} from "../../../../components/main/ClassGenerator";
import { IDataset } from "../../../../api/datasetApi";
import { getFormattedDate } from "../../../../utils";
import { IModelConfig } from "../../../../api/projectApi";

export interface IProjectDetailPresenter {
  loggedInUser: IUserState;
  page: string;
  totalTasksCount: number | undefined;
  project: IProject | undefined;
  projectTasks: ITask[] | undefined;
  projectUsers: IUser[] | undefined;
  openSidebarUpper: boolean;
  selectedInnerTab: InnerSidebarItem;
  fileInput: React.MutableRefObject<HTMLInputElement | null>;
  openWorkerAssign: boolean;
  assignProgress: "전처리" | "수집" | "가공" | "검수" | undefined;
  assignees: IUser[] | undefined;
  assigneePage: number;
  searchText: string | undefined;
  assignee: IUser | undefined;
  totalMembersCount: number | undefined;
  members: IUser[] | undefined;
  staticType: "공통" | "작업자" | "클래스";
  projectAllStatics: IPAllStatics | undefined;
  progressDay: number;
  onOpenBatchPreProcess: boolean;
  batchPreProcess: "grayscale" | "brighten" | "threshold" | "noiseremove";
  batchValue: number;
  batchLoading: boolean;
  batchDoLoading: boolean;
  stepOneProgressData: IStaticsTaskByDay[];
  stepTwoProgressData: IStaticsTaskByDay[];
  settingsPName: string;
  settingsPDesc: string;
  showDeletePAlert: boolean;
  pDeleteLoading: boolean;
  cancelRef: React.MutableRefObject<null>;
  pUpdateLoading: boolean;
  workerStatics: IWorkerStatics[];
  workerStaticsType: 1 | 2;
  workerStaticsSearchText: string;
  dateRange: Date[] | null;
  calendar: boolean;
  selectedDay: "오늘" | "3일" | "1주일" | "1개월" | undefined;
  classesStatics: any[];
  openAutoLabel: boolean;
  processingTargets: IProjectAnnotation[];
  labelingType: number;
  projectAnnotation: IProjectAnnotation[];
  currentSelectedClass: string;
  showAttrDiv: boolean;
  attrName: string;
  selectedAttrType: ClassAttrType;
  currentSelectedAttr: string;
  minValue: number;
  maxValue: number;
  collectDataType: CollectDataType;
  datasets: IDataset[];
  crawling: IGetProjectParam;
  openExport: boolean;
  activeOD: boolean;
  activeISES: boolean;
  onOpenExport: () => void;
  onCancelExport: () => void;
  onSubmitExport: () => void;
  isSelectedProgress: (progressType: any) => boolean;
  selectProgress: (progressType: any) => void;
  removeProgress: (progressType: any) => void;
  isSelectedExport: boolean;
  setSelectedClasses: (item: any) => void;
  selectedClass: IProjectAnnotation[];
  setSelectedClassAttrs: (id: number, item: any) => void;
  selectedAttrs: IExportAttribute[];
  exportClasses: IProjectAnnotation[];
  setSelectedOptions: (option: string) => void;
  selectedOption: string[];
  exportAttrs: IExportAttribute[];
  handleSelectType: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  showCalendar: () => void;
  resetSearch: () => void;
  handleChangeCalendar: (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handlePopupDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  dateToString: () => string;
  searchByDays: (days: "오늘" | "3일" | "1주일" | "1개월") => Promise<void>;
  searchWorkerStaticsByUserId: () => Promise<void>;
  handleEnterOnWorkerStatics: React.KeyboardEventHandler<HTMLInputElement>;
  handleChangeSearchTextOnWorkerStatics: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  handleChangeOneTwoWorkerStaticsType: () => void;
  handleChangeStepTwoWorkerStaticsType: () => void;
  doUpdateProject: () => Promise<void>;
  filterTaskByWorkStep: (step: string) => void;
  filterTaskByWorkProgress: (progress: string) => void;
  handleShowDeleteAlert: () => void;
  handleCancelDeleteAlert: () => void;
  handleChangeBatchValue: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeBatchPreProcess: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleChangeSettingsPName: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSettingsPDesc: (e: ChangeEvent<HTMLInputElement>) => void;
  doDeleteProject: () => Promise<void>;
  cancelBatchPreProcess: () => void;
  handleGoCleanStudio: () => void;
  handleBatchPreProcess: () => void;
  handleChangeProgressDay: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleWorkerStatic: () => void;
  handleCommonStatic: () => void;
  handleClassStatic: () => void;
  handleSelectInnerTab: (tab: InnerSidebarItem) => void;
  handleGoStudio: () => void;
  selectTask: (taskId: number) => void;
  removeTask: (taskId: number) => void;
  isSelectedTask: (taskId: number) => boolean;
  isSelectedAllTasks: () => boolean;
  selectAllTask: () => void;
  removeAllTask: () => void;
  handleDoSearch: () => Promise<void>;
  handleChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  selectFile: () => void;
  handleChangeFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onOpenWorkerAssign: () => void;
  onCancelWorkerAssign: () => void;
  onSubmitWorkerAssign: () => Promise<void>;
  onChangeAssignProgress: (e: ChangeEvent<HTMLSelectElement>) => void;
  getPages: () => number | undefined;
  nextPage: () => void;
  prevPage: () => void;
  doSearchUserByUsername: () => Promise<void>;
  resetSearchResults: () => void;
  selectAssignee: (user: IUser) => void;
  onSubmitBatchProcess: () => void;
  onCancelAutoLabel: () => void;
  onOpenAutoLabel: () => void;
  onSubmitLabelingInfo: (data: any) => void;
  handleSetAttr: (className: string) => void;
  handleSetAttrOfClass: (attr: IAnnotationAttribute) => void;
  getCurrentSelectedClassAttr: () => undefined | IAnnotationAttribute[];
  getCurrentSelectedAttrValues: () => null | IClassAttr;
  handleCollectDataSet: () => void;
  handleCollectCrawling: () => void;
  handleCollectUpload: () => void;
  isSelectedClasses: (item: any) => boolean;
  isSelectedClassAttrs: (id: number, item: any) => boolean;
  valSearchClass: string;
  handleChangeSearchClass: (e: any) => void;
  handleSearchClass: () => void;
  isSearchClass: boolean;
  isSelectedOptions: (option: string) => boolean;
  cntAllAttrs: number;
  valSearchAttrs: string;
  handleChangeSearchAttrs: (e: any) => void;
  handleSearchAttrs: () => void;
  isSearchAttrs: boolean;
  _setDownload: (type: string) => void;
  selectDownload: string;
  isDownload: string;
  openImport: boolean;
  onOpenImport: () => void;
  onCancelImport: () => void;
  onSubmitImport: () => void;
  setSelectedTypeImport: (type: string) => void;
  isSelectedTypeImport: (type: string) => boolean;
  isSelectedImportTask: (task: ITask) => boolean;
  selectedImportTasks: ITask[];
  selectedImportType: string[];
  importTasks: ITask[];
  handleSelectImportItem: (type: string, item: ITask) => void;
  handleSearchImport: () => void;
  handleChangeSearchImport: (e: any) => void;
  valSearchImport: string;
  dateRangeImport: Date[] | null;
  dateImportToString: () => string;
  handleChangeImportCalendar: (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  dateRangeExport: Date[] | null;
  dateExportToString: () => string;
  handleChangeExportCalendar: (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  settingType: "정보" | "멤버";
  handleInfoSetting: (e: any) => void;
  handleMemberSetting: (e: any) => void;
  handleChangeSearchProjectMember: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSearchProjectMember: () => void;
  handleChangeSearchOrganizationMember: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  handleSearchOrganizationMember: () => void;
  isSelectedProjectMember: (member: IProjectUser) => boolean;
  setSelectedProjectMembers: (member: IProjectUser) => void;
  isSelectedAllProjectMember: () => boolean;
  selectedProjectMemberList: IProjectUser[];
  searchedProjectMemberList: IProjectUser[];
  setSelectedAllProjectMembers: () => void;
  onOpenOrganizationMember: () => void;
  onCancelOrganizationMember: () => void;
  openOrganizationMember: boolean;
  onSubmitOrganizationMember: () => Promise<void>;
  isSelectedOrganizationMember: (member: IProjectUser) => boolean;
  setSelectedOrganizationMembers: (member: IProjectUser) => void;
  isSelectAllOrganizationMember: () => boolean;
  selectedOrganizationMemberList: IProjectUser[];
  searchedOrganizationMemberList: IProjectUser[];
  setSelectedTypeProjectMember: (type: string) => void;
  isSelectedTypeProjectMember: (type: string) => boolean;
  selectedProjectMemberType: string[];
  onRemoveProjectMember: () => Promise<void>;
  openRemovePMember: boolean;
  onOpenRemovePMember: () => void;
  onCancelRemovePMember: () => void;
  txtRemovePMember: string;
  fUploadLoading: boolean;
  getTasksByProject: () => Promise<void>;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  fileDrag: React.MutableRefObject<HTMLInputElement | null>;
  filterModelByWorkStep: (step: string) => void;
  loading: boolean;
  modelConfig: IModelConfig;
  modelConfigList: string[];
  handleSetConfigName: (value: any) => void;
  handleSetConfigAug: (type: any) => void;
  handleSetConfigEpoch: (type: any) => void;
  handleSetConfigLr: (type: any) => void;
  handleSetConfigConf: (type: any) => void;
  handleSetConfigBatch: (type: any) => void;
  updateModelConfig: (e: any) => void;
  modelExportList: any[];
  exportModel: (e: any) => void;
  handleSelectModel: (e: any, model: any) => void;
  isSelectedModel: (model: any) => boolean;
  getModelTrainLog: (model: any) => void;
  modelLog: any;
  modelLoss: any;
  modelLr: any;
  modelAccuracy: any;
  modelNegative: any;
  modelFgPositive: any;
  openExportModel: boolean;
  onOpenExportModel: () => void;
  onCancelExportModel: () => void;
  setExportModelType: (type: string) => void;
  selectedTasks: number[];
  mExportLoading: boolean;
  selectedExportModelType: string;
  selectedModelTypeInfo: any[];
  assignLoading: boolean;
}

export interface IExportAttribute {
  class_id: number;
  attrs: IAnnotationAttribute;
}

const theme = extendTheme({
  colors: {
    ssloGreen: {
      100: "#2EA090",
      500: "#2EA090",
    },
  },
});

const Container = styled.div`
  display: flex;
  font-family: NanumSquare;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  width: 100%;
  height: 100%;
`;
const MainCenter = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #ecf3fb;
  width: 100%;
  height: 100%;
  padding: 30px 60px;
`;
const MainSearchContainer = styled.div`
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 120px;
`;
const SearchInput = styled.input`
  padding: 8px 10px;
  min-width: 720px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 16px;
  font-weight: 700;
  margin-right: 25px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #6b78a1;
  }
`;
const SearchBtn = styled.div<{ isValid: boolean }>`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid ${(props) => (props.isValid ? "#afccf4" : "gray")};
  font-size: 16px;
  font-weight: 700;
  color: #6b78a1;
  margin-right: 20px;
  background-color: ${(props) => (props.isValid ? "#3480E3" : "gray")};
  color: #ffffff;
  cursor: ${(props) => (props.isValid ? "pointer" : "not-allowed")};
`;
const MainActionBtnDiv = styled(MainSearchContainer)`
  width: 100%;
  padding: 15px 30px;
  margin-top: 20px;
  flex-direction: row;
  box-sizing: border-box;
`;
const Horizontal = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const Vertical = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
`;
const Button = styled.div`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
`;
const MainListContainer = styled(MainSearchContainer)`
  margin-top: 20px;
  min-height: 400px;
  max-height: 700px;
  display: flex;
  box-sizing: border-box;
  overflow-y: auto;
  flex-direction: column;
  padding: 0;
`;
const MainListTop = styled.div`
  padding: 20px 40px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ListTopLeftLabel = styled(Label)`
  margin-right: 0;
`;
const ListTopRightContainer = styled.div`
  display: flex;
`;
const MainListCenter = styled.div`
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a4a8ad;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #e2e4e7;
    width: 10px;
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
`;
const Icon = styled.img``;
const Select = styled.select`
  width: 150px;
  padding: 8px 10px;
  background-color: #f7fafe;
  font-size: 13px;
  font-weight: 800;
  border: 1px solid #aeccf4;
  font-weight: 500;
  :focus {
    outline: none;
  }
`;
const AssigneeHeader = styled.div`
  width: 100%;
  height: 40px;
  background-color: #f7fafe;
  display: flex;
  align-items: center;
`;
const AssigneeWrapper = styled.div`
  &::-webkit-scrollbar {
    width: 10px;
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background: #a4a8ad;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #e2e4e7;
    width: 10px;
  }
  :focus {
    background: #5f6164;
  }
  width: 100%;
  height: 410px;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
`;
const AssigneeRow = styled.div<{ isSelected: boolean }>`
  width: 100%;
  height: 40px;
  border-top: 1px solid #aeccf4;
  :last-child {
    border-bottom: 1px solid #aeccf4;
  }
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? "#aeccf4" : "#FFF")};
  display: flex;
  align-items: center;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
`;
const LabelWrapper = styled.div`
  display: flex;
  width: 150px;
`;
const LabelDiv = styled.div`
  width: 100px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d2e2f8;
  font-size: 14px;
  font-weight: 800;
  color: #243654;
`;
const LabelValueDiv = styled.div`
  width: 160px;
  height: 32px;
  background-color: #f4f4f4;
  color: #707075;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 0 15px;
`;
const StaticsContainer = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
`;
const MainWorkProgressContainer = styled(MainSearchContainer)`
  width: 45%;
  box-sizing: border-box;
  min-height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;
const MainWorkProgressCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px 20px;
  flex-direction: column;
  background-color: #f7fafe;
  border: 1px solid #ccdff8;
`;
const WorkProgressBox = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;
const PieChartContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const Text = styled.span`
  color: #243654;
  font-size: 13px;
  font-weight: 700;
`;
const MainDaysWorkProgressContainer = styled(MainSearchContainer)`
  width: 55%;
  box-sizing: border-box;
  min-height: 750px;
  margin-left: 10px;
  padding: 20px;
`;
const LineIdentifier = styled.div`
  border-top-width: 2px;
  border-bottom-width: 1px;
  width: 20px;
  border-radius: 10px;
  border-style: solid;
`;
const StaticButton = styled(Button)<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? "#3580E3" : "#FFF")};
  border: 1px solid #aeccf4;
  font-size: 12px;
  border-radius: 20px;
  color: ${(props) => (props.isSelected ? "#FFF" : "#243654")};
`;
const MainWorkerStaticsContainer = styled(MainSearchContainer)`
  box-sizing: border-box;
`;
const DateDivContainer = styled.div`
  min-width: 300px;
  display: flex;
  position: relative;
`;
const DateDiv = styled.div`
  position: relative;
  min-width: 200px;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background-color: #f7fafe;
  border: 1px solid #afccf4;
  cursor: pointer;
`;
const DateString = styled.span<{ dates: number | null }>`
  font-size: 13px;
  font-weight: 700;
  color: #243754;
  margin-right: ${(props) =>
    props.dates !== null && props.dates === 2 && "30px"};
`;
const DatePickButton = styled.div<{ isSelected: boolean }>`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  background-color: ${(props) => (props.isSelected ? "#3480e3" : "")};
  font-size: 13px;
  font-weight: 700;
  transition: background-color 0.5s linear;
  color: ${(props) => (props.isSelected ? "#ffffff" : "#6b78a1")};
  margin-right: 20px;
  cursor: pointer;
`;
const EffectValueContainer = styled.div`
  width: 30%;
  height: 36px;
  background-color: #ffffff;
  border: 1px solid #c0c3c7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;
`;
const EffectValue = styled.span`
  color: #414244;
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
`;
const ZoomBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
`;
const ZoomInput = styled.input`
  &::-webkit-slider-thumb {
    appearance: none;
    width: 8px;
    height: 18px;
    border-radius: 3px;
    border: 2px solid #5f6164;
    background: #5f6164;
    user-select: unset;
    :focus {
      outline: none;
    }
  }
  :focus {
    outline: none;
  }
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  letter-spacing: -0.3px;
  background: linear-gradient(to right, #5f6164, #5f6164);
  margin: 0 15px;
`;
const MainProjectInfoContainer = styled.div`
  width: 100%;
  padding: 30px 30px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const PTypeSelect = styled.select`
  padding: 8px 10px;
  width: 205px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 16px;
  font-weight: 700;
  margin-right: 25px;
  :focus {
    outline: none;
  }
`;
const MainBottomDiv = styled(MainProjectInfoContainer)`
  background-color: inherit;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CreateButton = styled.button`
  display: flex;
  width: 100px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #3480e3;
  color: #fff;
  margin-right: 10px;
`;
const CancelButton = styled.button`
  display: flex;
  width: 100px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #fe9f46;
  color: #243754;
`;
const CheckBox = styled.div<{ isSelected: boolean }>`
  width: 80px;
  max-width: 80px;
  height: 13px;
  border: 1px solid ${(props) => (props.isSelected ? "#2EA08F" : "#6b78a1")};
  background-color: ${(props) => (props.isSelected ? "#2EA08F" : "none")};
  margin-right: 100px;
  cursor: pointer;
`;
const DropBoxTextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;
const DropBoxNormalText = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;
const ClassContainer = styled.div`
  display: flex;
  width: 100%;
  padding-right: 30px;
`;
const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  max-width: 500px;
  margin-right: 30px;
`;
const ClassWrapperTitleBox = styled.div`
  width: 200px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccdff8;
`;
const ClassWrapperTitle = styled.span`
  color: #243654;
  font-size: 14px;
  font-weight: 800;
`;
const ClassWrapperBody = styled.div`
  box-sizing: border-box;
  width: 200px;
  min-height: 220px;
  max-height: 250px;
  padding: 10px;
  background-color: #f7fafe;
  overflow-y: auto;
`;
const ClassWrapperBodyInput = styled.input`
  border: 1px solid #aeccf4;
  box-sizing: border-box;
  background-color: #f7fafe;
  width: 100%;
  padding: 6px 10px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #707075;
  }
  font-size: 11px;
  font-weight: 700;
`;
const ClassWrapperLists = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ClassLayout = styled.div<{ classBg: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0px 0px 15px;
  background-color: ${(props) => (props.classBg ? "#ECF3FB" : "none")};
`;
const AttrLayout = styled.div<{ attrBg: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0 0 10px;
  background-color: ${(props) => (props.attrBg ? "#ECF3FB" : "none")};
`;

const ClassDiv = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
`;
const ClassColor = styled.div<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  border: 1px solid ${(props) => props.bgColor};
  width: 12px;
  height: 12px;
  border-radius: 20px;
  margin-right: 7px;
`;
const ClassLabel = styled.span`
  color: #212122;
  font-size: 12px;
  font-weight: 700;
`;
const ClassAttrForm = styled.div<{ attrType: ClassAttrType }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: ${(props) =>
    props.attrType === ClassAttrType.multi ? "230px" : "200px"};
  background-color: #ffffff;
  border: 1px solid #aeccf4;
  padding: 10px 10px;
`;
const FormSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  :first-child {
    margin-right: 10px;
  }
`;

const SelectedContainer = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  padding: 0 5px;
  background-color: #f7fafe;
`;
const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid #aeccf4;
  background-color: #ffffff;
  border-radius: 20px;
  min-width: 45px;
  max-width: 70px;
  padding: 2px 3px;
  height: 28px;
  margin-right: 3px;
`;
const ItemLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  margin-right: 5px;
  color: #243654;
`;
const PConfigureContainer = styled.div`
  margin-top: 30px;
  min-height: 400px;
  max-height: 480px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px 0;
  box-sizing: content-box;
  background-color: #fff;
`;
const PTypeBtn = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 36px;
  border-radius: 20px;
  border: 1px solid #afccf4;
  background-color: ${(props) => (props.isSelected ? "#3580E3" : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#ffffff" : "#243654")};
  transition: background-color 0.5s linear;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  margin-right: 20px;
`;
const PConfigureUpper = styled.div`
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
const SmallSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const SmallLabel = styled(Label)`
  font-size: 15px;
  margin: 0px 70px 0px 0px;
`;
const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000000;
  background: #00000000;
  width: 100%;
  height: 100%;
`;
const ModelSection = styled.div`
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #a4a8ad;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #e2e4e7;
    width: 10px;
  }
  :focus {
    background: #5f6164;
  }
  width: 100%;
  display: flex;
  align-items: center;
`;
const ProjectDetailPresenter: React.FC<IProjectDetailPresenter> = ({
  loggedInUser,
  page,
  totalTasksCount,
  project,
  projectTasks,
  projectUsers,
  openSidebarUpper,
  selectedInnerTab,
  fileInput,
  openWorkerAssign,
  assignProgress,
  assignees,
  searchText,
  assigneePage,
  assignee,
  totalMembersCount,
  members,
  staticType,
  projectAllStatics,
  progressDay,
  onOpenBatchPreProcess,
  batchPreProcess,
  batchValue,
  batchLoading,
  batchDoLoading,
  stepOneProgressData,
  stepTwoProgressData,
  settingsPName,
  settingsPDesc,
  showDeletePAlert,
  cancelRef,
  pDeleteLoading,
  pUpdateLoading,
  workerStatics,
  workerStaticsType,
  workerStaticsSearchText,
  selectedDay,
  dateRange,
  calendar,
  classesStatics,
  openAutoLabel,
  processingTargets,
  labelingType,
  projectAnnotation,
  currentSelectedClass,
  showAttrDiv,
  attrName,
  selectedAttrType,
  currentSelectedAttr,
  minValue,
  maxValue,
  collectDataType,
  datasets,
  crawling,
  activeOD,
  activeISES,
  openExport,
  onOpenExport,
  onCancelExport,
  onSubmitExport,
  isSelectedProgress,
  selectProgress,
  removeProgress,
  isSelectedExport,
  setSelectedClasses,
  selectedClass,
  setSelectedClassAttrs,
  selectedAttrs,
  valSearchClass,
  handleChangeSearchClass,
  handleSearchClass,
  exportClasses,
  isSearchClass,
  setSelectedOptions,
  isSelectedOptions,
  selectedOption,
  cntAllAttrs,
  valSearchAttrs,
  handleChangeSearchAttrs,
  handleSearchAttrs,
  isSearchAttrs,
  exportAttrs,
  _setDownload,
  selectDownload,
  isDownload,

  handleEnter,
  showCalendar,
  handleChangeCalendar,
  handlePopupDown,
  dateToString,
  searchByDays,
  handleEnterOnWorkerStatics,
  handleChangeSearchTextOnWorkerStatics,
  searchWorkerStaticsByUserId,
  resetSearch,
  handleChangeOneTwoWorkerStaticsType,
  handleChangeStepTwoWorkerStaticsType,
  doUpdateProject,
  filterTaskByWorkStep,
  filterTaskByWorkProgress,
  handleShowDeleteAlert,
  handleCancelDeleteAlert,
  handleChangeSettingsPName,
  handleChangeSettingsPDesc,
  doDeleteProject,
  handleChangeBatchValue,
  onSubmitBatchProcess,
  onChangeBatchPreProcess,
  cancelBatchPreProcess,
  handleGoCleanStudio,
  handleBatchPreProcess,
  handleChangeProgressDay,
  handleWorkerStatic,
  handleCommonStatic,
  handleClassStatic,
  handleSelectInnerTab,
  handleGoStudio,
  selectTask,
  removeTask,
  isSelectedTask,
  isSelectedAllTasks,
  selectAllTask,
  removeAllTask,
  handleChangeSearch,
  handleDoSearch,
  selectFile,
  handleChangeFileUpload,
  onOpenWorkerAssign,
  onCancelWorkerAssign,
  onSubmitWorkerAssign,
  selectAssignee,
  doSearchUserByUsername,
  onChangeAssignProgress,
  getPages,
  nextPage,
  prevPage,
  resetSearchResults,
  onCancelAutoLabel,
  onOpenAutoLabel,
  handleSelectType,
  onSubmitLabelingInfo,
  handleSetAttr,
  handleSetAttrOfClass,
  getCurrentSelectedClassAttr,
  getCurrentSelectedAttrValues,
  handleCollectDataSet,
  handleCollectCrawling,
  isSelectedClasses,
  isSelectedClassAttrs,

  openImport,
  onOpenImport,
  onCancelImport,
  onSubmitImport,
  setSelectedTypeImport,
  isSelectedTypeImport,
  isSelectedImportTask,
  selectedImportTasks,
  selectedImportType,
  importTasks,
  handleSelectImportItem,
  handleSearchImport,
  handleChangeSearchImport,
  valSearchImport,
  dateRangeImport,
  dateImportToString,
  handleChangeImportCalendar,
  dateRangeExport,
  dateExportToString,
  handleChangeExportCalendar,
  settingType,
  handleInfoSetting,
  handleMemberSetting,
  handleChangeSearchProjectMember,
  handleSearchProjectMember,
  handleChangeSearchOrganizationMember,
  handleSearchOrganizationMember,

  isSelectedProjectMember,
  setSelectedProjectMembers,
  isSelectedAllProjectMember,
  selectedProjectMemberList,
  searchedProjectMemberList,
  setSelectedAllProjectMembers,
  onOpenOrganizationMember,
  onCancelOrganizationMember,
  openOrganizationMember,
  onSubmitOrganizationMember,
  isSelectedOrganizationMember,
  setSelectedOrganizationMembers,
  isSelectAllOrganizationMember,
  selectedOrganizationMemberList,
  searchedOrganizationMemberList,
  setSelectedTypeProjectMember,
  isSelectedTypeProjectMember,
  selectedProjectMemberType,
  onRemoveProjectMember,
  openRemovePMember,
  onOpenRemovePMember,
  onCancelRemovePMember,
  txtRemovePMember,
  fUploadLoading,
  getTasksByProject,
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  fileDrag,
  filterModelByWorkStep,
  loading,
  modelConfig,
  modelConfigList,
  handleSetConfigName,
  handleSetConfigAug,
  handleSetConfigEpoch,
  handleSetConfigLr,
  handleSetConfigConf,
  handleSetConfigBatch,
  updateModelConfig,
  modelExportList,
  exportModel,
  handleSelectModel,
  isSelectedModel,
  getModelTrainLog,
  modelLog,
  modelLoss,
  modelLr,
  modelAccuracy,
  modelNegative,
  modelFgPositive,
  openExportModel,
  onOpenExportModel,
  onCancelExportModel,
  setExportModelType,
  selectedTasks,
  mExportLoading,
  selectedExportModelType,
  selectedModelTypeInfo,
  handleCollectUpload,
  assignLoading,
}) => {
  const [windowXSize, setWindowXSize] = useState(0);
  useLayoutEffect(() => {
    function updateWindowSize() {
      setWindowXSize(window.innerWidth);
    }
    window.addEventListener("resize", updateWindowSize);
    updateWindowSize();
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);
  if (
    project &&
    projectTasks &&
    (totalTasksCount || totalTasksCount === 0) &&
    projectUsers &&
    assignees &&
    loggedInUser &&
    stepOneProgressData
  ) {
    return (
      <ChakraProvider theme={theme}>
        <Helmet>
          <title>SSLO | {project.pName}</title>
        </Helmet>
        <Container onClick={handlePopupDown}>
          <InnerSidebar
            openSidebarUpper={openSidebarUpper}
            selectedInnerTab={selectedInnerTab}
            classification={"allProjects"}
            handleSelectInnerTab={handleSelectInnerTab}
          />
          <MainWrapper>
            <Header
              title={project.pName}
              projectType={project.pType.project_type_id}
            />
            <MainCenter>
              {selectedInnerTab === InnerSidebarItem.dataList && (
                <>
                  <MainSearchContainer>
                    <Section>
                      <Label>검색어</Label>
                      <SearchInput
                        placeholder={"파일명을 입력해주세요."}
                        onChange={handleChangeSearch}
                        onKeyDown={handleEnter}
                      />
                      <SearchBtn isValid={true} onClick={handleDoSearch}>
                        검색
                      </SearchBtn>
                    </Section>
                  </MainSearchContainer>
                  <MainActionBtnDiv>
                    <Horizontal
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Section>
                        <Button
                          onClick={handleGoStudio}
                          style={{
                            backgroundColor: "#5F6164",
                            color: "#FFF",
                          }}
                        >
                          {project.pType.project_type_id === 1
                            ? "수집 STUDIO"
                            : project.pType.project_type_id === 2
                            ? "전처리 STUDIO"
                            : "가공 STUDIO"}
                        </Button>

                        {/*//! 스튜디오 우측 버튼  */}
                        {project.pType.project_type_id === 1 && (
                          <Button
                            style={{
                              backgroundColor: "#5F6164",
                              color: "#FFF",
                            }}
                            onClick={handleGoCleanStudio}
                          >
                            중복 제거 STUDIO
                          </Button>
                        )}
                        {project.pType.project_type_id === 2 && (
                          <Button
                            style={{
                              backgroundColor: "#3580E3",
                              color: "#FFF",
                              cursor: batchLoading ? "not-allowed" : "pointer",
                            }}
                            onClick={
                              batchLoading ? undefined : handleBatchPreProcess
                            }
                          >
                            {batchLoading ? <LoaderText /> : "전처리 일괄처리"}
                          </Button>
                        )}
                        {project.pType.project_type_id === 3 && (
                          <Button
                            style={{
                              backgroundColor: "#3580E3",
                              color: "#FFF",
                            }}
                            onClick={onOpenAutoLabel}
                          >
                            Auto_Label
                            {/*//! Auto_Label 관련 팝업 */}
                            <Modal
                              isOpen={openAutoLabel}
                              onClose={onCancelAutoLabel}
                              size={"2xl"}
                              isCentered
                            >
                              <ModalOverlay />
                              <ModalContent>
                                <ModalHeader
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: 50,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    backgroundColor: "#D2E2F8",
                                    justifyContent: "center",
                                    color: "#243654",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                  }}
                                >
                                  Auto-Label
                                </ModalHeader>
                                <ModalCloseButton style={{ marginTop: -3 }} />
                                <ModalBody style={{ marginLeft: "20px" }}>
                                  <Horizontal>
                                    <Label
                                      style={{
                                        marginTop: "20px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      가공 유형
                                    </Label>
                                  </Horizontal>
                                  <Horizontal
                                    style={{
                                      marginTop: 10,
                                      marginBottom: 20,
                                    }}
                                  >
                                    <Select
                                      style={{ width: "200px" }}
                                      onChange={handleSelectType}
                                      value={labelingType}
                                    >
                                      <option value={1}>
                                        Object Detection
                                      </option>
                                      <option value={2}>
                                        Instance Segmentation
                                      </option>
                                      <option value={3}>
                                        Semantic Segmentation
                                      </option>
                                    </Select>
                                  </Horizontal>
                                  <Horizontal>
                                    <Label style={{ fontSize: "14px" }}>
                                      가공 대상
                                    </Label>
                                  </Horizontal>
                                  <Horizontal
                                    style={{ marginTop: 10, marginBottom: 10 }}
                                  >
                                    <Menu closeOnSelect={false}>
                                      {({ isOpen }) => (
                                        <>
                                          <MenuButton
                                            display={"flex"}
                                            flexDirection={"row"}
                                            alignItems={"center"}
                                            bgColor={"#F7FAFE"}
                                            border={"1px"}
                                            borderColor={"#c0c3c7"}
                                            borderRadius={"none"}
                                            width={"330px"}
                                            height={"30px"}
                                            _focus={{ bgColor: "#F7FAFE" }}
                                            _hover={{ bgColor: "#F7FAFE" }}
                                            _expanded={{ bgColor: "#F7FAFE" }}
                                            isActive={isOpen}
                                            as={ChakraBtn}
                                            rightIcon={<Icon src={arrowDown} />}
                                          >
                                            <DropBoxTextWrapper>
                                              <DropBoxNormalText
                                                style={{ overflow: "hidden" }}
                                              >
                                                {selectedClass &&
                                                selectedClass.length > 0
                                                  ? selectedClass.length ===
                                                    processingTargets.length
                                                    ? "전체"
                                                    : selectedClass.map(
                                                        (item, index) => {
                                                          return (
                                                            (index > 0
                                                              ? ", "
                                                              : "") +
                                                            item.annotation_category_name
                                                          );
                                                        }
                                                      )
                                                  : "선택"}
                                              </DropBoxNormalText>
                                            </DropBoxTextWrapper>
                                          </MenuButton>
                                          <MenuList
                                            bgColor={"#e2e4e7"}
                                            border={"1px"}
                                            borderColor={"#c0c3c7"}
                                            borderRadius={"none"}
                                            width={"330px"}
                                            minW={"328px"}
                                            paddingTop={"0"}
                                            paddingBottom={"0"}
                                            paddingRight={"2"}
                                          >
                                            <MenuItem
                                              _hover={{ bgColor: "#CFD1D4" }}
                                              _focusWithin={{
                                                bgColor: "#CFD1D4",
                                              }}
                                              value={"전체"}
                                              width={"328px"}
                                              isDisabled={
                                                labelingType === 1 &&
                                                activeOD === false
                                                  ? true
                                                  : labelingType !== 1 &&
                                                    activeISES === false
                                                  ? true
                                                  : false
                                              }
                                            >
                                              <ChakraCheckbox
                                                isDisabled={
                                                  labelingType === 1 &&
                                                  activeOD === false
                                                    ? true
                                                    : labelingType !== 1 &&
                                                      activeISES === false
                                                    ? true
                                                    : false
                                                }
                                                isChecked={
                                                  selectedClass &&
                                                  selectedClass.length ===
                                                    processingTargets.length
                                                }
                                                onChange={(e) =>
                                                  setSelectedClasses(null)
                                                }
                                                width={"100%"}
                                                colorScheme={"ssloGreen"}
                                              >
                                                {selectedClass &&
                                                selectedClass.length ===
                                                  processingTargets.length ? (
                                                  <ChakraText
                                                    fontSize={"14px"}
                                                    color="#2EA090"
                                                  >
                                                    {"전체"}
                                                  </ChakraText>
                                                ) : (
                                                  <ChakraText
                                                    fontSize={"14px"}
                                                    color="#243654"
                                                  >
                                                    {"전체"}
                                                  </ChakraText>
                                                )}
                                              </ChakraCheckbox>
                                            </MenuItem>

                                            {exportClasses &&
                                              exportClasses.length > 0 &&
                                              exportClasses.map(
                                                (item, itemId) => {
                                                  return (
                                                    <MenuItem
                                                      key={itemId}
                                                      _hover={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      _focusWithin={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      value={
                                                        item.annotation_category_name
                                                      }
                                                      width={"328px"}
                                                      borderTop={
                                                        "1px solid #c0c3c7"
                                                      }
                                                      isDisabled={
                                                        labelingType === 1 &&
                                                        activeOD === false &&
                                                        item.annotation_category_name !==
                                                          "인간"
                                                          ? true
                                                          : labelingType !==
                                                              1 &&
                                                            activeISES ===
                                                              false &&
                                                            item.annotation_category_name !==
                                                              "인간"
                                                          ? true
                                                          : false
                                                      }
                                                    >
                                                      <ChakraCheckbox
                                                        isDisabled={
                                                          labelingType === 1 &&
                                                          activeOD === false &&
                                                          item.annotation_category_name !==
                                                            "인간"
                                                            ? true
                                                            : labelingType !==
                                                                1 &&
                                                              activeISES ===
                                                                false &&
                                                              item.annotation_category_name !==
                                                                "인간"
                                                            ? true
                                                            : false
                                                        }
                                                        width={"100%"}
                                                        isChecked={isSelectedClasses(
                                                          item
                                                        )}
                                                        onChange={(e) =>
                                                          setSelectedClasses(
                                                            item
                                                          )
                                                        }
                                                        colorScheme={
                                                          "ssloGreen"
                                                        }
                                                      >
                                                        {isSelectedClasses(
                                                          item
                                                        ) ? (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#2EA090"
                                                          >
                                                            {
                                                              item.annotation_category_name
                                                            }
                                                          </ChakraText>
                                                        ) : (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#243654"
                                                          >
                                                            {
                                                              item.annotation_category_name
                                                            }
                                                          </ChakraText>
                                                        )}
                                                      </ChakraCheckbox>
                                                    </MenuItem>
                                                  );
                                                }
                                              )}
                                          </MenuList>
                                        </>
                                      )}
                                    </Menu>
                                  </Horizontal>
                                </ModalBody>
                                <ModalFooter>
                                  <Button
                                    style={{
                                      width: "15%",
                                      backgroundColor: "#3580E3",
                                      fontSize: 12,
                                      color: "#FFF",
                                      marginRight: 0,
                                      cursor: batchLoading
                                        ? "not-allowed"
                                        : "pointer",
                                    }}
                                    onClick={onSubmitLabelingInfo}
                                  >
                                    {loading ? (
                                      <LoaderText text={"Processing..."} />
                                    ) : (
                                      "적용하기"
                                    )}
                                  </Button>
                                </ModalFooter>
                              </ModalContent>
                            </Modal>
                          </Button>
                        )}

                        {/*//! 전처리 일괄처리 관련 팝업 */}
                        <Modal
                          isOpen={onOpenBatchPreProcess}
                          onClose={cancelBatchPreProcess}
                          size={"2xl"}
                          isCentered
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader
                              style={{
                                display: "flex",
                                alignItems: "center",
                                height: 50,
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: "#D2E2F8",
                                justifyContent: "center",
                                color: "#243654",
                                fontSize: "14px",
                                fontWeight: 700,
                              }}
                            >
                              전처리 일괄처리
                            </ModalHeader>
                            <ModalCloseButton style={{ marginTop: -3 }} />
                            <ModalBody>
                              <Horizontal>
                                <Label style={{ fontSize: "14px" }}>
                                  전처리 유형
                                </Label>
                              </Horizontal>
                              <Horizontal style={{ marginBottom: 20 }}>
                                <Select
                                  onChange={onChangeBatchPreProcess}
                                  value={batchPreProcess}
                                >
                                  <option value="grayscale">
                                    그레이스케일
                                  </option>
                                  <option value="brighten">밝기/대비</option>
                                  <option value="threshold">이진화</option>
                                  <option value="noiseremove">
                                    노이즈제거
                                  </option>
                                </Select>
                              </Horizontal>
                              {batchPreProcess !== "noiseremove" && (
                                <>
                                  <Horizontal style={{ marginBottom: 10 }}>
                                    <Label style={{ fontSize: "14px" }}>
                                      전처리 설정
                                    </Label>
                                  </Horizontal>
                                  <EffectValueContainer>
                                    <EffectValue>
                                      {`${batchValue}`}
                                      {batchPreProcess === "threshold"
                                        ? ""
                                        : "%"}
                                    </EffectValue>
                                  </EffectValueContainer>
                                  <ZoomBox style={{ width: "30%" }}>
                                    <Icon src={iconZoomDec} />
                                    <ZoomInput
                                      type={"range"}
                                      min={0}
                                      max={
                                        batchPreProcess === "grayscale"
                                          ? 100
                                          : batchPreProcess === "brighten"
                                          ? 200
                                          : batchPreProcess === "threshold"
                                          ? 255
                                          : 100
                                      }
                                      value={batchValue}
                                      style={{ width: "100%" }}
                                      onChange={handleChangeBatchValue}
                                    />
                                    <Icon src={iconZoomInc} />
                                  </ZoomBox>
                                </>
                              )}
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                style={{
                                  width: "10%",
                                  backgroundColor: "#3580E3",
                                  fontSize: 12,
                                  color: "#FFF",
                                  marginRight: 0,
                                  cursor: batchLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                onClick={
                                  batchDoLoading
                                    ? undefined
                                    : onSubmitBatchProcess
                                }
                              >
                                {batchDoLoading ? (
                                  <LoaderText size={"small"} />
                                ) : (
                                  "적용하기"
                                )}
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </Section>
                      <Section style={{ justifyContent: "flex-end" }}>
                        {project.pType.project_type_id !== 1 && (
                          <>
                            <Button
                              onClick={onOpenImport}
                              style={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#AECCF4",
                                color: "#243654",
                              }}
                            >
                              데이터 불러오기
                              <Modal
                                isOpen={openImport}
                                onClose={onCancelImport}
                                size={"3xl"}
                                isCentered
                              >
                                <ModalOverlay />
                                <ModalContent>
                                  <ModalHeader
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      height: 50,
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      backgroundColor: "#D2E2F8",
                                      justifyContent: "center",
                                      color: "#243654",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    데이터 불러오기
                                  </ModalHeader>
                                  <ModalCloseButton style={{ marginTop: -3 }} />
                                  <ModalBody>
                                    <Horizontal style={{ marginBottom: 5 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        프로젝트 유형
                                      </Label>
                                    </Horizontal>
                                    <Horizontal
                                      style={{
                                        marginBottom: 20,
                                        alignItems: "center",
                                      }}
                                    >
                                      {/* // Todo 메뉴 리스트 */}
                                      <Menu closeOnSelect={false}>
                                        {({ isOpen }) => (
                                          <>
                                            <MenuButton
                                              display={"flex"}
                                              flexDirection={"row"}
                                              alignItems={"center"}
                                              bgColor={"#F7FAFE"}
                                              border={"1px"}
                                              borderColor={"#c0c3c7"}
                                              borderRadius={"none"}
                                              width={"400px"}
                                              _focus={{ bgColor: "#F7FAFE" }}
                                              _hover={{ bgColor: "#F7FAFE" }}
                                              _expanded={{ bgColor: "#F7FAFE" }}
                                              isActive={isOpen}
                                              as={ChakraBtn}
                                              rightIcon={
                                                isOpen ? (
                                                  <Icon src={arrowUp} />
                                                ) : (
                                                  <Icon src={arrowDown} />
                                                )
                                              }
                                            >
                                              <DropBoxTextWrapper>
                                                <DropBoxNormalText
                                                  style={{ height: 20 }}
                                                >
                                                  {selectedImportType &&
                                                  selectedImportType.length > 0
                                                    ? selectedImportType.length ===
                                                      3
                                                      ? "전체"
                                                      : selectedImportType.map(
                                                          (element, index) => {
                                                            return (
                                                              (index > 0
                                                                ? ", "
                                                                : "") + element
                                                            );
                                                          }
                                                        )
                                                    : "선택"}
                                                </DropBoxNormalText>
                                              </DropBoxTextWrapper>
                                            </MenuButton>
                                            <MenuList
                                              bgColor={"#e2e4e7"}
                                              border={"1px"}
                                              alignItems={"center"}
                                              width={"398px"}
                                              borderColor={"#c0c3c7"}
                                              borderRadius={"none"}
                                            >
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                value={"전체"}
                                                width={"396px"}
                                              >
                                                <ChakraCheckbox
                                                  isChecked={
                                                    selectedImportType &&
                                                    selectedImportType.length ===
                                                      3
                                                  }
                                                  onChange={(e) =>
                                                    setSelectedTypeImport("all")
                                                  }
                                                  width={"100%"}
                                                  colorScheme={"ssloGreen"}
                                                >
                                                  {selectedImportType &&
                                                  selectedImportType.length ===
                                                    3 ? (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#2EA090"
                                                    >
                                                      {"전체"}
                                                    </ChakraText>
                                                  ) : (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#243654"
                                                    >
                                                      {"전체"}
                                                    </ChakraText>
                                                  )}
                                                </ChakraCheckbox>
                                              </MenuItem>
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                value={"수집/정제"}
                                                width={"396px"}
                                              >
                                                <ChakraCheckbox
                                                  isChecked={isSelectedTypeImport(
                                                    "수집/정제"
                                                  )}
                                                  onChange={(e) =>
                                                    setSelectedTypeImport(
                                                      "수집/정제"
                                                    )
                                                  }
                                                  width={"100%"}
                                                  colorScheme={"ssloGreen"}
                                                >
                                                  {isSelectedTypeImport(
                                                    "수집/정제"
                                                  ) ? (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#2EA090"
                                                    >
                                                      {"수집/정제"}
                                                    </ChakraText>
                                                  ) : (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#243654"
                                                    >
                                                      {"수집/정제"}
                                                    </ChakraText>
                                                  )}
                                                </ChakraCheckbox>
                                              </MenuItem>
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                value={"전처리"}
                                                width={"396px"}
                                              >
                                                <ChakraCheckbox
                                                  isChecked={isSelectedTypeImport(
                                                    "전처리"
                                                  )}
                                                  onChange={(e) =>
                                                    setSelectedTypeImport(
                                                      "전처리"
                                                    )
                                                  }
                                                  width={"100%"}
                                                  colorScheme={"ssloGreen"}
                                                >
                                                  {isSelectedTypeImport(
                                                    "전처리"
                                                  ) ? (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#2EA090"
                                                    >
                                                      {"전처리"}
                                                    </ChakraText>
                                                  ) : (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#243654"
                                                    >
                                                      {"전처리"}
                                                    </ChakraText>
                                                  )}
                                                </ChakraCheckbox>
                                              </MenuItem>
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                value={"가공"}
                                                width={"396px"}
                                              >
                                                <ChakraCheckbox
                                                  isChecked={isSelectedTypeImport(
                                                    "가공"
                                                  )}
                                                  onChange={(e) =>
                                                    setSelectedTypeImport(
                                                      "가공"
                                                    )
                                                  }
                                                  width={"100%"}
                                                  colorScheme={"ssloGreen"}
                                                >
                                                  {isSelectedTypeImport(
                                                    "가공"
                                                  ) ? (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#2EA090"
                                                    >
                                                      {"가공"}
                                                    </ChakraText>
                                                  ) : (
                                                    <ChakraText
                                                      fontSize={"14px"}
                                                      color="#243654"
                                                    >
                                                      {"가공"}
                                                    </ChakraText>
                                                  )}
                                                </ChakraCheckbox>
                                              </MenuItem>
                                            </MenuList>
                                          </>
                                        )}
                                      </Menu>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 10 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        프로젝트 생성일
                                      </Label>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 20 }}>
                                      {/* // Todo 날짜 설정 */}
                                      <DateDivContainer>
                                        <DateDiv onClick={showCalendar}>
                                          <DateString
                                            dates={
                                              dateRangeImport &&
                                              dateRangeImport.length
                                            }
                                          >
                                            {dateRangeImport
                                              ? dateImportToString()
                                              : "날짜 선택"}
                                          </DateString>
                                          <Icon src={iconCalendar} />
                                        </DateDiv>
                                        {calendar && (
                                          <Calendar
                                            formatDay={(locale, date) =>
                                              date.toLocaleString("en", {
                                                day: "numeric",
                                              })
                                            }
                                            value={dateRangeImport as any}
                                            onChange={(
                                              value: Date[],
                                              event: ChangeEvent<
                                                HTMLInputElement
                                              >
                                            ) =>
                                              handleChangeImportCalendar(
                                                value,
                                                event
                                              )
                                            }
                                            prev2Label={null}
                                            next2Label={null}
                                            minDetail="month"
                                            selectRange
                                            minDate={
                                              new Date(
                                                Date.now() -
                                                  60 *
                                                    60 *
                                                    24 *
                                                    7 *
                                                    4 *
                                                    6 *
                                                    10000
                                              )
                                            }
                                            maxDate={
                                              new Date(
                                                Date.now() +
                                                  60 *
                                                    60 *
                                                    24 *
                                                    7 *
                                                    4 *
                                                    6 *
                                                    1000
                                              )
                                            }
                                          />
                                        )}
                                      </DateDivContainer>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 10 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        검색어
                                      </Label>
                                    </Horizontal>
                                    {/* // Todo 검색 설정 */}
                                    <Horizontal style={{ marginBottom: 20 }}>
                                      <InputGroup
                                        width={"400px"}
                                        height={"35px"}
                                        border={"1px"}
                                        borderColor={"#AECCF4"}
                                      >
                                        <ChakraInput
                                          width={"398px"}
                                          height={"33px"}
                                          fontSize={"14px"}
                                          variant="unstyled"
                                          marginLeft={"4"}
                                          placeholder={"검색 (프로젝트 명)"}
                                          value={valSearchImport}
                                          onChange={handleChangeSearchImport}
                                        />
                                        <InputRightElement
                                          width={"33px"}
                                          height={"33px"}
                                        >
                                          <IconButton
                                            colorScheme={"blue"}
                                            aria-label="Search Class"
                                            width={"33px"}
                                            minW={"29px"}
                                            height={"33px"}
                                            icon={
                                              <SearchIcon color={"white"} />
                                            }
                                            onClick={handleSearchImport}
                                          />
                                        </InputRightElement>
                                      </InputGroup>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 20 }}>
                                      {/* // Todo 작업 리스트 */}
                                      {importTasks && importTasks.length > 0 ? (
                                        <TableContainer
                                          maxH={"350px"}
                                          width={"100%"}
                                          overflowY={"auto"}
                                        >
                                          <Table variant="simple">
                                            <Thead>
                                              <Tr
                                                bgColor={"#F7FAFE"}
                                                borderTop={"1px solid #AECCF4"}
                                                borderBottom={
                                                  "1px solid #AECCF4"
                                                }
                                              >
                                                <Th minW={"29px"} maxW={"33px"}>
                                                  <ChakraCheckbox
                                                    isChecked={
                                                      selectedImportTasks &&
                                                      selectedImportTasks.length ===
                                                        importTasks.length
                                                    }
                                                    onChange={(e) => {
                                                      handleSelectImportItem(
                                                        "all",
                                                        null
                                                      );
                                                    }}
                                                    width={"29px"}
                                                    colorScheme={"ssloGreen"}
                                                  />
                                                </Th>
                                                <Th maxW={"200px"}>
                                                  데이터 목록
                                                </Th>
                                                <Th maxW={"140px"}>
                                                  프로젝트 유형
                                                </Th>
                                                <Th maxW={"150px"}>
                                                  프로젝트 명
                                                </Th>
                                                <Th maxW={"140px"}>
                                                  프로젝트 생성일
                                                </Th>
                                              </Tr>
                                            </Thead>
                                            <Tbody>
                                              {importTasks.map(
                                                (item, index) => {
                                                  return (
                                                    <Tr
                                                      key={index}
                                                      borderBottom={
                                                        "1px solid #AECCF4"
                                                      }
                                                    >
                                                      <Th
                                                        minW={"29px"}
                                                        maxW={"33px"}
                                                      >
                                                        <ChakraCheckbox
                                                          isChecked={isSelectedImportTask(
                                                            item
                                                          )}
                                                          onChange={(e) => {
                                                            handleSelectImportItem(
                                                              "select",
                                                              item
                                                            );
                                                          }}
                                                          width={"29px"}
                                                          colorScheme={
                                                            "ssloGreen"
                                                          }
                                                        />
                                                      </Th>
                                                      <Th
                                                        maxW={"200px"}
                                                        overflow={"hidden"}
                                                        textOverflow={
                                                          "ellipsis"
                                                        }
                                                        whiteSpace={"nowrap"}
                                                      >
                                                        {item.imageName +
                                                          "." +
                                                          item.imageFormat}
                                                      </Th>
                                                      <Th maxW={"140px"}>
                                                        {"데이터 " +
                                                          item.projectTypeName}
                                                      </Th>
                                                      <Th
                                                        maxW={"150px"}
                                                        overflow={"hidden"}
                                                        textOverflow={
                                                          "ellipsis"
                                                        }
                                                        whiteSpace={"nowrap"}
                                                      >
                                                        {item.projectName}
                                                      </Th>
                                                      <Th maxW={"140px"}>
                                                        {getFormattedDate(
                                                          item.created
                                                        )}
                                                      </Th>
                                                    </Tr>
                                                  );
                                                }
                                              )}
                                            </Tbody>
                                          </Table>
                                        </TableContainer>
                                      ) : loading ? (
                                        <>
                                        <SpinnerWrapper
                                          style={{
                                            background: "transparent",
                                            width: "100%",
                                            display: "flex",
                                          }}
                                        >
                                          <Spinner speed="0.35s" />
                                        </SpinnerWrapper>
                                        </>
                                      ) : (
                                        <>
                                          {
                                            "작업 데이터가 없습니다. (검수 완료된 작업만 불러오기가 가능합니다.)"
                                          }
                                        </>
                                      )}
                                    </Horizontal>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      style={{
                                        width: "10%",
                                        backgroundColor: "#3580E3",
                                        fontSize: 12,
                                        color: "#FFF",
                                        marginRight: 0,
                                      }}
                                      onClick={onSubmitImport}
                                    >
                                      불러오기
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </Button>
                          </>
                        )}
                        <input
                          type={"file"}
                          style={{ display: "none" }}
                          ref={fileInput}
                          accept={"image/jpeg"}
                          multiple
                          onChange={handleChangeFileUpload}
                        />
                        <Button
                          onClick={selectFile}
                          style={{
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: "#AECCF4",
                            color: "#243654",
                          }}
                        >
                          데이터 업로드
                        </Button>
                        <Button
                          onClick={onOpenExport}
                          style={{
                            backgroundColor: "#3580E3",
                            color: "#FFF",
                          }}
                        >
                          산출물 내보내기
                          <Modal
                            isOpen={openExport}
                            onClose={onCancelExport}
                            //size={"2xl"}
                            size={"md"}
                            isCentered
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: 50,
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                  backgroundColor: "#D2E2F8",
                                  justifyContent: "center",
                                  color: "#243654",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                산출물 내보내기
                              </ModalHeader>
                              <ModalCloseButton style={{ marginTop: -3 }} />
                              <ModalBody>
                                {!isSelectedExport && (
                                  <>
                                    <Horizontal style={{ marginBottom: 5 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        작업단계 설정 *
                                      </Label>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 5 }}>
                                      <Label
                                        style={{
                                          fontSize: "13px",
                                          color: "purple",
                                        }}
                                      >
                                        ※ 작업상태가 완료된 작업만 추출
                                        가능합니다.
                                      </Label>
                                    </Horizontal>
                                    <Horizontal
                                      style={{
                                        marginBottom: 20,
                                        alignItems: "center",
                                      }}
                                    >
                                      {isSelectedProgress(
                                        project.pType.project_type_id
                                      ) ? (
                                        <Icon
                                          src={iconSelected}
                                          onClick={() =>
                                            removeProgress(
                                              project.pType.project_type_id
                                            )
                                          }
                                          style={{ width: 14, marginRight: 10 }}
                                        />
                                      ) : (
                                        <CheckBox
                                          onClick={() =>
                                            selectProgress(
                                              project.pType.project_type_id
                                            )
                                          }
                                          isSelected={isSelectedProgress(
                                            project.pType.project_type_id
                                          )}
                                          style={{ width: 14, marginRight: 10 }}
                                        />
                                      )}
                                      {project.pType.project_type_id === 1 && (
                                        <Label style={{ fontSize: "14px" }}>
                                          수집
                                        </Label>
                                      )}
                                      {project.pType.project_type_id === 2 && (
                                        <Label style={{ fontSize: "14px" }}>
                                          전처리
                                        </Label>
                                      )}
                                      {project.pType.project_type_id === 3 && (
                                        <Label style={{ fontSize: "14px" }}>
                                          가공
                                        </Label>
                                      )}

                                      {isSelectedProgress(4) ? (
                                        <Icon
                                          src={iconSelected}
                                          onClick={() => removeProgress(4)}
                                          style={{ width: 14, marginRight: 10 }}
                                        />
                                      ) : (
                                        <CheckBox
                                          onClick={() => selectProgress(4)}
                                          isSelected={isSelectedProgress(4)}
                                          style={{ width: 14, marginRight: 10 }}
                                        />
                                      )}
                                      <Label style={{ fontSize: "14px" }}>
                                        검수
                                      </Label>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 10 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        추출기간 설정 *
                                      </Label>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 20 }}>
                                      {/* // Todo 날짜 설정 */}
                                      <DateDivContainer>
                                        <DateDiv onClick={showCalendar}>
                                          <DateString
                                            dates={
                                              dateRangeExport &&
                                              dateRangeExport.length
                                            }
                                          >
                                            {dateRangeExport
                                              ? dateExportToString()
                                              : "날짜 선택"}
                                          </DateString>
                                          <Icon src={iconCalendar} />
                                        </DateDiv>
                                        {calendar && (
                                          <Calendar
                                            formatDay={(locale, date) =>
                                              date.toLocaleString("en", {
                                                day: "numeric",
                                              })
                                            }
                                            value={dateRangeExport as any}
                                            onChange={(
                                              value: Date[],
                                              event: ChangeEvent<
                                                HTMLInputElement
                                              >
                                            ) =>
                                              handleChangeExportCalendar(
                                                value,
                                                event
                                              )
                                            }
                                            prev2Label={null}
                                            next2Label={null}
                                            minDetail="month"
                                            selectRange
                                            minDate={
                                              new Date(
                                                Date.now() -
                                                  60 *
                                                    60 *
                                                    24 *
                                                    7 *
                                                    4 *
                                                    6 *
                                                    10000
                                              )
                                            }
                                            maxDate={
                                              new Date(
                                                Date.now() +
                                                  60 *
                                                    60 *
                                                    24 *
                                                    7 *
                                                    4 *
                                                    6 *
                                                    1000
                                              )
                                            }
                                          />
                                        )}
                                      </DateDivContainer>
                                    </Horizontal>
                                  </>
                                )}
                                {!isSelectedExport && (
                                  <>
                                    <Horizontal style={{ marginBottom: 5 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        선택된 작업의 산출물이 내보내기됩니다.
                                      </Label>
                                    </Horizontal>
                                  </>
                                )}
                                {project.pType.project_type_id === 3 && (
                                  <>
                                    <Horizontal style={{ marginBottom: 10 }}>
                                      <Label style={{ fontSize: "14px" }}>
                                        다운로드 파일 형식 *
                                      </Label>
                                    </Horizontal>
                                    <Horizontal style={{ marginBottom: 10 }}>
                                      <Menu>
                                        {({ isOpen }) => (
                                          <>
                                            <MenuButton
                                              display={"flex"}
                                              flexDirection={"row"}
                                              alignItems={"center"}
                                              bgColor={"#e2e4e7"}
                                              border={"1px"}
                                              borderColor={"#c0c3c7"}
                                              borderRadius={"none"}
                                              width={"100%"}
                                              _focus={{ bgColor: "#e2e4e7" }}
                                              _hover={{ bgColor: "#e2e4e7" }}
                                              _expanded={{ bgColor: "#e2e4e7" }}
                                              isActive={isOpen}
                                              as={ChakraBtn}
                                              rightIcon={
                                                isOpen ? (
                                                  <Icon src={arrowUp} />
                                                ) : (
                                                  <Icon src={arrowDown} />
                                                )
                                              }
                                            >
                                              <DropBoxTextWrapper>
                                                <DropBoxNormalText
                                                  style={{ height: 20 }}
                                                >
                                                  {isDownload !== ""
                                                    ? selectDownload
                                                    : "다운로드할 파일 형식을 선택해주세요."}
                                                </DropBoxNormalText>
                                              </DropBoxTextWrapper>
                                            </MenuButton>
                                            <MenuList
                                              bgColor={"#e2e4e7"}
                                              border={"1px"}
                                              alignItems={"center"}
                                              width={"398px"}
                                              borderColor={"#c0c3c7"}
                                              borderRadius={"none"}
                                            >
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                width={"398px"}
                                                onClick={() =>
                                                  _setDownload("coco")
                                                }
                                              >
                                                <DropBoxNormalText
                                                  style={{ height: 20 }}
                                                >
                                                  {"COCO Dataset Format"}
                                                </DropBoxNormalText>
                                              </MenuItem>
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                width={"398px"}
                                                onClick={() =>
                                                  _setDownload("yolo")
                                                }
                                                disabled={true}
                                                isDisabled={true}
                                              >
                                                <DropBoxNormalText
                                                  style={{ height: 20 }}
                                                >
                                                  {"YOLO Dataset Format"}
                                                </DropBoxNormalText>
                                              </MenuItem>
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                width={"398px"}
                                                onClick={() =>
                                                  _setDownload("image")
                                                }
                                              >
                                                <DropBoxNormalText
                                                  style={{ height: 20 }}
                                                >
                                                  {"Image"}
                                                </DropBoxNormalText>
                                              </MenuItem>
                                              <MenuItem
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{
                                                  bgColor: "#CFD1D4",
                                                }}
                                                width={"398px"}
                                                onClick={() =>
                                                  _setDownload("json")
                                                }
                                              >
                                                <DropBoxNormalText
                                                  style={{ height: 20 }}
                                                >
                                                  {"JSON + Image"}
                                                </DropBoxNormalText>
                                              </MenuItem>
                                            </MenuList>
                                          </>
                                        )}
                                      </Menu>
                                    </Horizontal>
                                    {isDownload !== "" &&
                                      isDownload !== "image" && (
                                        <>
                                          <Horizontal
                                            style={{ marginBottom: 10 }}
                                          >
                                            <Label style={{ fontSize: "14px" }}>
                                              추출 범위 *
                                            </Label>
                                          </Horizontal>
                                          <Horizontal
                                            style={{
                                              display: "flex",
                                              width: "100%",
                                              marginBottom: 10,
                                              alignItems: "center",
                                            }}
                                          >
                                            <Label
                                              style={{
                                                width: "50px",
                                                fontSize: "14px",
                                                marginRight: "20px",
                                              }}
                                            >
                                              클래스
                                            </Label>
                                            <Menu closeOnSelect={false}>
                                              {({ isOpen }) => (
                                                <>
                                                  <MenuButton
                                                    display={"flex"}
                                                    flexDirection={"row"}
                                                    alignItems={"center"}
                                                    bgColor={"#F7FAFE"}
                                                    border={"1px"}
                                                    borderColor={"#c0c3c7"}
                                                    borderRadius={"none"}
                                                    width={"330px"}
                                                    height={"30px"}
                                                    _focus={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    _hover={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    _expanded={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    isActive={isOpen}
                                                    as={ChakraBtn}
                                                    rightIcon={
                                                      <Icon src={arrowDown} />
                                                    }
                                                  >
                                                    <DropBoxTextWrapper>
                                                      <DropBoxNormalText
                                                        style={{
                                                          overflow: "hidden",
                                                        }}
                                                      >
                                                        {selectedClass &&
                                                        selectedClass.length > 0
                                                          ? selectedClass.length ===
                                                            processingTargets.length
                                                            ? "전체"
                                                            : selectedClass.map(
                                                                (
                                                                  item,
                                                                  index
                                                                ) => {
                                                                  return (
                                                                    (index > 0
                                                                      ? ", "
                                                                      : "") +
                                                                    item.annotation_category_name
                                                                  );
                                                                }
                                                              )
                                                          : "선택"}
                                                      </DropBoxNormalText>
                                                    </DropBoxTextWrapper>
                                                  </MenuButton>
                                                  <MenuList
                                                    bgColor={"#e2e4e7"}
                                                    border={"1px"}
                                                    borderColor={"#c0c3c7"}
                                                    borderRadius={"none"}
                                                    width={"330px"}
                                                    minW={"328px"}
                                                    paddingTop={"0"}
                                                    paddingBottom={"0"}
                                                    paddingRight={"2"}
                                                  >
                                                    <InputGroup
                                                      width={"328px"}
                                                      height={"35px"}
                                                      border={"1px"}
                                                      borderColor={"#AECCF4"}
                                                    >
                                                      <ChakraInput
                                                        width={"326px"}
                                                        height={"33px"}
                                                        fontSize={"14px"}
                                                        variant="unstyled"
                                                        marginLeft={"4"}
                                                        placeholder={"검색"}
                                                        value={valSearchClass}
                                                        onChange={
                                                          handleChangeSearchClass
                                                        }
                                                      />
                                                      <InputRightElement
                                                        width={"29px"}
                                                        height={"29px"}
                                                        marginRight={"3"}
                                                      >
                                                        <IconButton
                                                          aria-label="Search Class"
                                                          variant="unstyled"
                                                          icon={<SearchIcon />}
                                                          onClick={
                                                            handleSearchClass
                                                          }
                                                        />
                                                      </InputRightElement>
                                                    </InputGroup>
                                                    {!isSearchClass && (
                                                      <MenuItem
                                                        _hover={{
                                                          bgColor: "#CFD1D4",
                                                        }}
                                                        _focusWithin={{
                                                          bgColor: "#CFD1D4",
                                                        }}
                                                        value={"전체"}
                                                        width={"328px"}
                                                      >
                                                        <ChakraCheckbox
                                                          isChecked={
                                                            selectedClass &&
                                                            selectedClass.length ===
                                                              processingTargets.length
                                                          }
                                                          onChange={(e) =>
                                                            setSelectedClasses(
                                                              null
                                                            )
                                                          }
                                                          width={"100%"}
                                                          colorScheme={
                                                            "ssloGreen"
                                                          }
                                                        >
                                                          {selectedClass &&
                                                          selectedClass.length ===
                                                            processingTargets.length ? (
                                                            <ChakraText
                                                              fontSize={"14px"}
                                                              color="#2EA090"
                                                            >
                                                              {"전체"}
                                                            </ChakraText>
                                                          ) : (
                                                            <ChakraText
                                                              fontSize={"14px"}
                                                              color="#243654"
                                                            >
                                                              {"전체"}
                                                            </ChakraText>
                                                          )}
                                                        </ChakraCheckbox>
                                                      </MenuItem>
                                                    )}
                                                    {exportClasses &&
                                                      exportClasses.length >
                                                        0 &&
                                                      exportClasses.map(
                                                        (item, itemId) => {
                                                          return (
                                                            <MenuItem
                                                              key={itemId}
                                                              _hover={{
                                                                bgColor:
                                                                  "#CFD1D4",
                                                              }}
                                                              _focusWithin={{
                                                                bgColor:
                                                                  "#CFD1D4",
                                                              }}
                                                              value={
                                                                item.annotation_category_name
                                                              }
                                                              width={"328px"}
                                                              borderTop={
                                                                "1px solid #c0c3c7"
                                                              }
                                                            >
                                                              <ChakraCheckbox
                                                                width={"100%"}
                                                                isChecked={isSelectedClasses(
                                                                  item
                                                                )}
                                                                onChange={(e) =>
                                                                  setSelectedClasses(
                                                                    item
                                                                  )
                                                                }
                                                                colorScheme={
                                                                  "ssloGreen"
                                                                }
                                                              >
                                                                {isSelectedClasses(
                                                                  item
                                                                ) ? (
                                                                  <ChakraText
                                                                    fontSize={
                                                                      "14px"
                                                                    }
                                                                    color="#2EA090"
                                                                  >
                                                                    {
                                                                      item.annotation_category_name
                                                                    }
                                                                  </ChakraText>
                                                                ) : (
                                                                  <ChakraText
                                                                    fontSize={
                                                                      "14px"
                                                                    }
                                                                    color="#243654"
                                                                  >
                                                                    {
                                                                      item.annotation_category_name
                                                                    }
                                                                  </ChakraText>
                                                                )}
                                                              </ChakraCheckbox>
                                                            </MenuItem>
                                                          );
                                                        }
                                                      )}
                                                  </MenuList>
                                                </>
                                              )}
                                            </Menu>
                                          </Horizontal>
                                          <Horizontal
                                            style={{
                                              display: "flex",
                                              width: "100%",
                                              marginBottom: 10,
                                              alignItems: "center",
                                            }}
                                          >
                                            <Label
                                              style={{
                                                width: "50px",
                                                fontSize: "14px",
                                                marginRight: "20px",
                                              }}
                                            >
                                              속성
                                            </Label>
                                            <Menu closeOnSelect={false}>
                                              {({ isOpen }) => (
                                                <>
                                                  <MenuButton
                                                    display={"flex"}
                                                    flexDirection={"row"}
                                                    alignItems={"center"}
                                                    bgColor={"#F7FAFE"}
                                                    border={"1px"}
                                                    borderColor={"#c0c3c7"}
                                                    borderRadius={"none"}
                                                    width={"330px"}
                                                    height={"30px"}
                                                    _focus={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    _hover={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    _expanded={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    isActive={isOpen}
                                                    as={ChakraBtn}
                                                    rightIcon={
                                                      <Icon src={arrowDown} />
                                                    }
                                                  >
                                                    <DropBoxTextWrapper>
                                                      <DropBoxNormalText
                                                        style={{
                                                          overflow: "hidden",
                                                        }}
                                                      >
                                                        {selectedClass &&
                                                        selectedClass.length > 0
                                                          ? selectedAttrs &&
                                                            selectedAttrs.length >
                                                              0
                                                            ? selectedAttrs.length ===
                                                              cntAllAttrs
                                                              ? "전체"
                                                              : selectedAttrs.map(
                                                                  (
                                                                    item,
                                                                    index
                                                                  ) => {
                                                                    return (
                                                                      (index > 0
                                                                        ? ", "
                                                                        : "") +
                                                                      item.attrs
                                                                        .annotation_category_attr_name
                                                                    );
                                                                  }
                                                                )
                                                            : "선택"
                                                          : "선택"}
                                                      </DropBoxNormalText>
                                                    </DropBoxTextWrapper>
                                                  </MenuButton>
                                                  <MenuList
                                                    bgColor={"#e2e4e7"}
                                                    border={"1px"}
                                                    borderColor={"#c0c3c7"}
                                                    borderRadius={"none"}
                                                    width={"330px"}
                                                    minW={"328px"}
                                                    paddingTop={"0"}
                                                    paddingBottom={"0"}
                                                    paddingRight={"2"}
                                                  >
                                                    <InputGroup
                                                      width={"328px"}
                                                      height={"35px"}
                                                      border={"1px"}
                                                      borderColor={"#AECCF4"}
                                                    >
                                                      <ChakraInput
                                                        width={"326px"}
                                                        height={"33px"}
                                                        fontSize={"14px"}
                                                        variant="unstyled"
                                                        marginLeft={"4"}
                                                        placeholder={"검색"}
                                                        value={valSearchAttrs}
                                                        onChange={
                                                          handleChangeSearchAttrs
                                                        }
                                                      />
                                                      <InputRightElement
                                                        width={"29px"}
                                                        height={"29px"}
                                                        marginRight={"3"}
                                                      >
                                                        <IconButton
                                                          aria-label="Search Class"
                                                          variant="unstyled"
                                                          icon={<SearchIcon />}
                                                          onClick={
                                                            handleSearchAttrs
                                                          }
                                                        />
                                                      </InputRightElement>
                                                    </InputGroup>
                                                    {!isSearchAttrs && (
                                                      <MenuItem
                                                        _hover={{
                                                          bgColor: "#CFD1D4",
                                                        }}
                                                        _focusWithin={{
                                                          bgColor: "#CFD1D4",
                                                        }}
                                                        value={"전체"}
                                                        width={"328px"}
                                                      >
                                                        <ChakraCheckbox
                                                          isChecked={
                                                            selectedAttrs &&
                                                            selectedAttrs.length >
                                                              0 &&
                                                            selectedAttrs.length ===
                                                              cntAllAttrs
                                                          }
                                                          onChange={(e) =>
                                                            setSelectedClassAttrs(
                                                              -10,
                                                              null
                                                            )
                                                          }
                                                          width={"100%"}
                                                          colorScheme={
                                                            "ssloGreen"
                                                          }
                                                        >
                                                          {selectedAttrs &&
                                                          selectedAttrs.length >
                                                            0 &&
                                                          selectedAttrs.length ===
                                                            cntAllAttrs ? (
                                                            <ChakraText
                                                              fontSize={"14px"}
                                                              color="#2EA090"
                                                            >
                                                              {"전체"}
                                                            </ChakraText>
                                                          ) : (
                                                            <ChakraText
                                                              fontSize={"14px"}
                                                              color="#243654"
                                                            >
                                                              {"전체"}
                                                            </ChakraText>
                                                          )}
                                                        </ChakraCheckbox>
                                                      </MenuItem>
                                                    )}
                                                    <>
                                                      {selectedClass &&
                                                        selectedClass.length >
                                                          0 &&
                                                        selectedClass.map(
                                                          (item, itemId) => {
                                                            return (
                                                              item.annotation_category_attributes &&
                                                              item
                                                                .annotation_category_attributes
                                                                .length > 0 && (
                                                                <MenuGroup
                                                                  key={itemId}
                                                                  title={
                                                                    item.annotation_category_name
                                                                  }
                                                                  fontSize={
                                                                    "12px"
                                                                  }
                                                                  color={
                                                                    "#2EA090"
                                                                  }
                                                                  bgColor={
                                                                    "white"
                                                                  }
                                                                  width={
                                                                    "328px"
                                                                  }
                                                                  borderTop={
                                                                    "1px solid #AECCF4"
                                                                  }
                                                                  borderBottom={
                                                                    "1px solid #AECCF455"
                                                                  }
                                                                  /*  borderColor={"#AECCF4"} */
                                                                  margin={"0"}
                                                                  paddingTop={
                                                                    "1"
                                                                  }
                                                                  paddingBottom={
                                                                    "1"
                                                                  }
                                                                  paddingLeft={
                                                                    "3"
                                                                  }
                                                                  paddingRight={
                                                                    "3"
                                                                  }
                                                                >
                                                                  {exportAttrs.map(
                                                                    (
                                                                      attr,
                                                                      attrId
                                                                    ) => {
                                                                      return (
                                                                        attr.class_id ===
                                                                          item.annotation_category_id && (
                                                                          <MenuItem
                                                                            key={
                                                                              attrId
                                                                            }
                                                                            _hover={{
                                                                              bgColor:
                                                                                "#CFD1D4",
                                                                            }}
                                                                            _focusWithin={{
                                                                              bgColor:
                                                                                "#CFD1D4",
                                                                            }}
                                                                            value={
                                                                              attr
                                                                                .attrs
                                                                                .annotation_category_attr_name
                                                                            }
                                                                            width={
                                                                              "328px"
                                                                            }
                                                                          >
                                                                            <ChakraCheckbox
                                                                              width={
                                                                                "100%"
                                                                              }
                                                                              isChecked={isSelectedClassAttrs(
                                                                                item.annotation_category_id,
                                                                                attr.attrs
                                                                              )}
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                setSelectedClassAttrs(
                                                                                  item.annotation_category_id,
                                                                                  attr.attrs
                                                                                )
                                                                              }
                                                                              colorScheme={
                                                                                "ssloGreen"
                                                                              }
                                                                            >
                                                                              {isSelectedClassAttrs(
                                                                                item.annotation_category_id,
                                                                                attr.attrs
                                                                              ) ? (
                                                                                <ChakraText
                                                                                  fontSize={
                                                                                    "14px"
                                                                                  }
                                                                                  color="#2EA090"
                                                                                >
                                                                                  {
                                                                                    attr
                                                                                      .attrs
                                                                                      .annotation_category_attr_name
                                                                                  }
                                                                                </ChakraText>
                                                                              ) : (
                                                                                <ChakraText
                                                                                  fontSize={
                                                                                    "14px"
                                                                                  }
                                                                                  color="#243654"
                                                                                >
                                                                                  {
                                                                                    attr
                                                                                      .attrs
                                                                                      .annotation_category_attr_name
                                                                                  }
                                                                                </ChakraText>
                                                                              )}
                                                                            </ChakraCheckbox>
                                                                          </MenuItem>
                                                                        )
                                                                      );
                                                                    }
                                                                  )}
                                                                </MenuGroup>
                                                              )
                                                            );
                                                          }
                                                        )}
                                                    </>
                                                  </MenuList>
                                                </>
                                              )}
                                            </Menu>
                                          </Horizontal>
                                          <Horizontal
                                            style={{
                                              display: "none", //"flex",
                                              width: "100%",
                                              marginBottom: 10,
                                              alignItems: "center",
                                            }}
                                          >
                                            <Label
                                              style={{
                                                width: "50px",
                                                fontSize: "14px",
                                                marginRight: "20px",
                                              }}
                                            >
                                              옵션
                                            </Label>
                                            <Menu closeOnSelect={false}>
                                              {({ isOpen }) => (
                                                <>
                                                  <MenuButton
                                                    display={"flex"}
                                                    flexDirection={"row"}
                                                    alignItems={"center"}
                                                    bgColor={"#F7FAFE"}
                                                    border={"1px"}
                                                    borderColor={"#c0c3c7"}
                                                    borderRadius={"none"}
                                                    width={"330px"}
                                                    height={"30px"}
                                                    _focus={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    _hover={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    _expanded={{
                                                      bgColor: "#F7FAFE",
                                                    }}
                                                    isActive={isOpen}
                                                    as={ChakraBtn}
                                                    rightIcon={
                                                      <Icon src={arrowDown} />
                                                    }
                                                    disabled={true}
                                                  >
                                                    <DropBoxTextWrapper>
                                                      <DropBoxNormalText
                                                        style={{
                                                          overflow: "hidden",
                                                        }}
                                                      >
                                                        {selectedOption &&
                                                        selectedOption.length >
                                                          0
                                                          ? selectedOption.length ===
                                                            3
                                                            ? "전체"
                                                            : selectedOption.map(
                                                                (
                                                                  item,
                                                                  index
                                                                ) => {
                                                                  return (
                                                                    (index > 0
                                                                      ? ", "
                                                                      : "") +
                                                                    (item ===
                                                                    "projectName"
                                                                      ? "프로젝트명"
                                                                      : item ===
                                                                        "fileName"
                                                                      ? "파일명"
                                                                      : item ===
                                                                        "imageSize"
                                                                      ? "이미지 크기"
                                                                      : "선택")
                                                                  );
                                                                }
                                                              )
                                                          : "선택"}
                                                      </DropBoxNormalText>
                                                    </DropBoxTextWrapper>
                                                  </MenuButton>
                                                  <MenuList
                                                    bgColor={"#e2e4e7"}
                                                    border={"1px"}
                                                    borderColor={"#c0c3c7"}
                                                    borderRadius={"none"}
                                                    width={"330px"}
                                                    minW={"328px"}
                                                    paddingTop={"0"}
                                                    paddingBottom={"0"}
                                                    paddingRight={"2"}
                                                  >
                                                    <MenuItem
                                                      _hover={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      _focusWithin={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      value={"전체"}
                                                      width={"328px"}
                                                    >
                                                      <ChakraCheckbox
                                                        isChecked={
                                                          selectedOption &&
                                                          selectedOption.length ===
                                                            3
                                                        }
                                                        onChange={(e) =>
                                                          setSelectedOptions(
                                                            "all"
                                                          )
                                                        }
                                                        width={"100%"}
                                                        colorScheme={
                                                          "ssloGreen"
                                                        }
                                                      >
                                                        {selectedOption &&
                                                        selectedOption.length ===
                                                          3 ? (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#2EA090"
                                                          >
                                                            {"전체"}
                                                          </ChakraText>
                                                        ) : (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#243654"
                                                          >
                                                            {"전체"}
                                                          </ChakraText>
                                                        )}
                                                      </ChakraCheckbox>
                                                    </MenuItem>
                                                    <MenuItem
                                                      _hover={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      _focusWithin={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      value={"프로젝트명"}
                                                      width={"328px"}
                                                    >
                                                      <ChakraCheckbox
                                                        isChecked={isSelectedOptions(
                                                          "projectName"
                                                        )}
                                                        onChange={(e) =>
                                                          setSelectedOptions(
                                                            "projectName"
                                                          )
                                                        }
                                                        width={"100%"}
                                                        colorScheme={
                                                          "ssloGreen"
                                                        }
                                                      >
                                                        {isSelectedOptions(
                                                          "projectName"
                                                        ) ? (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#2EA090"
                                                          >
                                                            {"프로젝트명"}
                                                          </ChakraText>
                                                        ) : (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#243654"
                                                          >
                                                            {"프로젝트명"}
                                                          </ChakraText>
                                                        )}
                                                      </ChakraCheckbox>
                                                    </MenuItem>
                                                    <MenuItem
                                                      _hover={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      _focusWithin={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      value={"파일명"}
                                                      width={"328px"}
                                                    >
                                                      <ChakraCheckbox
                                                        isChecked={isSelectedOptions(
                                                          "fileName"
                                                        )}
                                                        onChange={(e) =>
                                                          setSelectedOptions(
                                                            "fileName"
                                                          )
                                                        }
                                                        width={"100%"}
                                                        colorScheme={
                                                          "ssloGreen"
                                                        }
                                                      >
                                                        {isSelectedOptions(
                                                          "fileName"
                                                        ) ? (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#2EA090"
                                                          >
                                                            {"파일명"}
                                                          </ChakraText>
                                                        ) : (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#243654"
                                                          >
                                                            {"파일명"}
                                                          </ChakraText>
                                                        )}
                                                      </ChakraCheckbox>
                                                    </MenuItem>
                                                    <MenuItem
                                                      _hover={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      _focusWithin={{
                                                        bgColor: "#CFD1D4",
                                                      }}
                                                      value={"이미지 크기"}
                                                      width={"328px"}
                                                    >
                                                      <ChakraCheckbox
                                                        isChecked={isSelectedOptions(
                                                          "imageSize"
                                                        )}
                                                        onChange={(e) =>
                                                          setSelectedOptions(
                                                            "imageSize"
                                                          )
                                                        }
                                                        width={"100%"}
                                                        colorScheme={
                                                          "ssloGreen"
                                                        }
                                                      >
                                                        {isSelectedOptions(
                                                          "imageSize"
                                                        ) ? (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#2EA090"
                                                          >
                                                            {"이미지 크기"}
                                                          </ChakraText>
                                                        ) : (
                                                          <ChakraText
                                                            fontSize={"14px"}
                                                            color="#243654"
                                                          >
                                                            {"이미지 크기"}
                                                          </ChakraText>
                                                        )}
                                                      </ChakraCheckbox>
                                                    </MenuItem>
                                                  </MenuList>
                                                </>
                                              )}
                                            </Menu>
                                          </Horizontal>
                                        </>
                                      )}
                                  </>
                                )}
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  style={{
                                    width: "10%",
                                    backgroundColor: "#3580E3",
                                    fontSize: 12,
                                    color: "#FFF",
                                    marginRight: 0,
                                  }}
                                  onClick={onSubmitExport}
                                >
                                  내보내기
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Button>
                        <Button
                          onClick={onOpenWorkerAssign}
                          style={{
                            backgroundColor: "#3580E3",
                            color: "#FFF",
                          }}
                        >
                          할당하기
                          <Modal
                            isOpen={openWorkerAssign}
                            onClose={onCancelWorkerAssign}
                            size={"2xl"}
                            isCentered
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: 50,
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                  backgroundColor: "#D2E2F8",
                                  justifyContent: "center",
                                  color: "#243654",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                할당하기
                              </ModalHeader>
                              <ModalCloseButton style={{ marginTop: -3 }} />
                              <ModalBody>
                                <Horizontal>
                                  <Label style={{ fontSize: "14px" }}>
                                    작업단계
                                  </Label>
                                </Horizontal>
                                <Horizontal style={{ marginBottom: 20 }}>
                                  <Select
                                    onChange={onChangeAssignProgress}
                                    value={assignProgress}
                                  >
                                    {project.pType.project_type_id === 1 && (
                                      <option value="수집">수집</option>
                                    )}
                                    {project.pType.project_type_id === 2 && (
                                      <option value="전처리">전처리</option>
                                    )}
                                    {project.pType.project_type_id === 3 && (
                                      <option value="가공">가공</option>
                                    )}
                                    <option value="검수">검수</option>
                                  </Select>
                                </Horizontal>
                                <Horizontal>
                                  <Label style={{ fontSize: "14px" }}>
                                    담당자
                                  </Label>
                                </Horizontal>
                                <Horizontal>
                                  <SearchInput
                                    placeholder={"멤버명으로 검색해주세요."}
                                    onChange={handleChangeSearch}
                                    value={searchText || ""}
                                    style={{
                                      minWidth: "80%",
                                      width: "80%",
                                      marginRight: 0,
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        searchText || searchText !== ""
                                          ? doSearchUserByUsername
                                          : undefined;
                                      }
                                    }}
                                  />
                                  <Icon
                                    src={iconSearch}
                                    onClick={
                                      searchText || searchText !== ""
                                        ? doSearchUserByUsername
                                        : undefined
                                    }
                                    style={{
                                      padding: 10,
                                      cursor: searchText
                                        ? "pointer"
                                        : "not-allowed",
                                      backgroundColor: "#3580E3",
                                      fill: "white",
                                    }}
                                  />
                                  <Button
                                    style={{
                                      marginLeft: 7,
                                      width: "10%",
                                      backgroundColor: "#3580E3",
                                      fontSize: 12,
                                      color: "#FFF",
                                    }}
                                    onClick={resetSearchResults}
                                  >
                                    검색 초기화
                                  </Button>
                                </Horizontal>
                                <Vertical style={{ marginTop: 20 }}>
                                  <AssigneeHeader>
                                    <Label
                                      style={{
                                        fontSize: 14,
                                        width: "50%",
                                        textAlign: "center",
                                      }}
                                    >
                                      멤버 이메일
                                    </Label>
                                    <Label
                                      style={{
                                        fontSize: 14,
                                        width: "50%",
                                        textAlign: "center",
                                      }}
                                    >
                                      멤버명
                                    </Label>
                                  </AssigneeHeader>
                                  {assignees.map((u, index) => (
                                    <AssigneeRow
                                      key={index}
                                      isSelected={
                                        assignee
                                          ? assignee.userId === u.userId
                                          : false
                                      }
                                      onClick={() => selectAssignee(u)}
                                    >
                                      <Label
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 600,
                                          width: "50%",
                                          textAlign: "center",
                                        }}
                                      >
                                        {u.userEmail}
                                      </Label>
                                      <Label
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 600,
                                          width: "50%",
                                          textAlign: "center",
                                        }}
                                      >
                                        {u.userDisplayName}
                                      </Label>
                                    </AssigneeRow>
                                  ))}
                                </Vertical>
                                <Horizontal
                                  style={{
                                    marginTop: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    {assigneePage !== 1 && (
                                      <Icon
                                        src={iconPrev}
                                        onClick={prevPage}
                                        style={{
                                          width: 10,
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                    <Label
                                      style={{
                                        marginRight: 0,
                                        marginLeft: 5,
                                      }}
                                    >
                                      {assigneePage}
                                    </Label>
                                    <Label
                                      style={{
                                        marginRight: 5,
                                        marginLeft: 5,
                                        fontWeight: 500,
                                      }}
                                    >{`of ${getPages()}`}</Label>
                                    {assigneePage < getPages()! && (
                                      <Icon
                                        src={iconNext}
                                        onClick={nextPage}
                                        style={{
                                          width: 10,
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                  </Box>
                                  <Box>
                                    <LabelWrapper style={{ width: 100 }}>
                                      <LabelDiv>담당자</LabelDiv>
                                    </LabelWrapper>
                                    <LabelValueDiv>
                                      {assignee ? assignee.userDisplayName : ""}
                                    </LabelValueDiv>
                                  </Box>
                                </Horizontal>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  style={{
                                    width: "10%",
                                    backgroundColor: "#3580E3",
                                    fontSize: 12,
                                    color: "#FFF",
                                    marginRight: 0,
                                  }}
                                  onClick={assignLoading? null:onSubmitWorkerAssign}
                                >
                                  {assignLoading? (<LoaderText text={"Loading..."} />) : "작업할당"}
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Button>
                      </Section>
                    </Horizontal>
                  </MainActionBtnDiv>
                  <MainListContainer>
                    <MainListTop>
                      <ListTopLeftLabel>{`전체 이미지 ${totalTasksCount} 건`}</ListTopLeftLabel>
                      <ListTopLeftLabel style={{ color: "#2EA090" }}>{`${
                        selectedTasks.length
                      } 건 선택`}</ListTopLeftLabel>
                    </MainListTop>
                    <ListHeader
                      type={"DATALIST"}
                      projectType={project.pType.project_type_id}
                      isSelectedAllTasks={isSelectedAllTasks}
                      selectAllTask={selectAllTask}
                      removeAllTask={removeAllTask}
                      filterTaskByWorkStep={filterTaskByWorkStep}
                      filterTaskByWorkProgress={filterTaskByWorkProgress}
                    />
                    <MainListCenter
                      id={"secDragTask"}
                      ref={fileDrag}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {projectTasks.length > 0 ? (
                        projectTasks.map((t, index) => {
                          return (
                            <ListItem
                              key={index}
                              task={t}
                              tasks={projectTasks}
                              type={"DATALIST"}
                              getTasksByProject={getTasksByProject}
                              project={project}
                              currentUser={loggedInUser}
                              projectUsers={projectUsers}
                              selectTask={selectTask}
                              removeTask={removeTask}
                              isSelectedTask={isSelectedTask}
                            />
                          );
                        })
                      ) : (
                        <Section
                          style={{
                            height: "100%",
                            minHeight: "400px",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <Icon src={iconDragTask} width={"50px"} />
                          <Text
                            style={{
                              color: "#3580E3",
                              fontSize: "18px",
                              fontWeight: "700",
                              marginTop: "15px",
                            }}
                          >
                            데이터를 업로드해주세요.
                          </Text>
                        </Section>
                      )}
                    </MainListCenter>
                    <Paginator
                      itemCount={10}
                      page={page}
                      totalCount={totalTasksCount}
                    />
                  </MainListContainer>

                  <SpinnerWrapper
                    style={{
                      background: "#00000099",
                      position: "absolute",
                      width: "calc(100% - 340px)",
                      height: "calc(100% - 90px)",
                      right: 0,
                      bottom: 0,
                      display: fUploadLoading ? "flex" : "none",
                    }}
                  >
                    <Spinner speed="0.35s" />
                  </SpinnerWrapper>
                </>
              )}
              {selectedInnerTab === InnerSidebarItem.member &&
              totalMembersCount === undefined ? (
                <Loader />
              ) : (
                selectedInnerTab === InnerSidebarItem.member &&
                members && (
                  <MainListContainer>
                    <ListHeader
                      type={"USER_WORK_STATICS"}
                      projectType={project.pType.project_type_id}
                    />
                    {members.map((m, index) => (
                      <ListItem
                        key={index}
                        type={"USER_WORK_STATICS"}
                        member={m}
                      />
                    ))}
                    {/* <Paginator
                      itemCount={5}
                      page={membersPage}
                      totalCount={totalMembersCount!}
                      stateChangeFn={handleChangeMemberPage}
                    /> */}
                  </MainListContainer>
                )
              )}
              {selectedInnerTab === InnerSidebarItem.statics &&
              projectAllStatics === undefined ? (
                <Loader />
              ) : (
                selectedInnerTab === InnerSidebarItem.statics &&
                projectAllStatics && (
                  <>
                    <MainActionBtnDiv
                      style={{ marginBottom: 20, marginTop: -15 }}
                    >
                      <StaticButton
                        isSelected={staticType === "공통"}
                        onClick={handleCommonStatic}
                      >
                        공통 통계
                      </StaticButton>
                      <StaticButton
                        isSelected={staticType === "작업자"}
                        onClick={handleWorkerStatic}
                      >
                        작업자 통계
                      </StaticButton>
                      {project.pType.project_type_id === 3 && (
                        <StaticButton
                          isSelected={staticType === "클래스"}
                          onClick={handleClassStatic}
                        >
                          클래스 통계
                        </StaticButton>
                      )}
                    </MainActionBtnDiv>
                    {staticType === "공통" && (
                      <StaticsContainer>
                        <MainWorkProgressContainer
                          style={{ maxHeight: "600px" }}
                        >
                          <Section style={{ marginBottom: 20 }}>
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              전체 작업직행률
                            </Label>
                          </Section>
                          <MainWorkProgressCard>
                            <Section
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 20,
                              }}
                            >
                              <Label style={{ marginRight: 0, fontSize: 15 }}>
                                프로젝트 진행현황
                              </Label>
                            </Section>
                            <WorkProgressBox>
                              <PieChartContainer>
                                <PieChart
                                  width={500}
                                  height={300}
                                  data={
                                    projectAllStatics.stepTwoComplete === 0 &&
                                    projectAllStatics.stepOneComplete === 0
                                      ? [{ key: "데이터 없음", data: 1 }]
                                      : [
                                          {
                                            key: "검수완료",
                                            data:
                                              projectAllStatics.stepTwoComplete,
                                          },
                                          {
                                            key:
                                              project.pType.project_type_id ===
                                              1
                                                ? "수집완료"
                                                : project.pType
                                                    .project_type_id === 2
                                                ? "전처리완료"
                                                : "가공완료",
                                            data:
                                              projectAllStatics.stepOneComplete,
                                          },
                                        ]
                                  }
                                  series={
                                    <PieArcSeries
                                      doughnut={true}
                                      cornerRadius={4}
                                      padAngle={0.02}
                                      padRadius={200}
                                    />
                                  }
                                />
                              </PieChartContainer>
                              <Label style={{ marginRight: 0, fontSize: 15 }}>
                                {projectAllStatics.totalCount === 0
                                  ? "0"
                                  : Math.ceil(
                                      (projectAllStatics.stepTwoComplete /
                                        projectAllStatics.totalCount) *
                                        100
                                    )}
                                % 완료
                              </Label>
                            </WorkProgressBox>
                            <Section
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 5,
                                paddingRight: 5,
                                borderStyle: "solid",
                                borderColor: "#ccdff8",
                              }}
                            >
                              <Label style={{ marginRight: 50, fontSize: 15 }}>
                                작업단계
                              </Label>
                              <Label style={{ marginRight: 50, fontSize: 15 }}>
                                완료 파일개수
                              </Label>
                              <Label style={{ marginRight: 50, fontSize: 15 }}>
                                전체 개수 대비 비율
                              </Label>
                            </Section>
                            <Section
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 5,
                                paddingRight: 5,
                                borderStyle: "solid",
                                backgroundColor: "#FFF",
                                borderColor: "#ccdff8",
                              }}
                            >
                              <Text style={{ marginRight: 50 }}>
                                {project.pType.project_type_id === 1
                                  ? "수집완료"
                                  : project.pType.project_type_id === 2
                                  ? "전처리완료"
                                  : "가공완료"}
                              </Text>
                              <Text style={{ marginRight: 100 }}>
                                {projectAllStatics.stepOneComplete}
                              </Text>
                              <Text style={{ marginRight: 100 }}>
                                {projectAllStatics.totalCount === 0
                                  ? "0"
                                  : Math.ceil(
                                      (projectAllStatics.stepOneComplete /
                                        projectAllStatics.totalCount) *
                                        100
                                    )}
                                %
                              </Text>
                            </Section>
                            <Section
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 5,
                                paddingRight: 5,
                                borderStyle: "solid",
                                backgroundColor: "#FFF",
                                borderColor: "#ccdff8",
                              }}
                            >
                              <Text
                                style={{
                                  marginRight:
                                    project.pType.project_type_id === 2
                                      ? 60
                                      : 50,
                                }}
                              >
                                검수완료
                              </Text>
                              <Text style={{ marginRight: 100 }}>
                                {projectAllStatics.stepTwoComplete}
                              </Text>
                              <Text style={{ marginRight: 100 }}>
                                {projectAllStatics.totalCount === 0
                                  ? "0"
                                  : Math.ceil(
                                      (projectAllStatics.stepTwoComplete /
                                        projectAllStatics.totalCount) *
                                        100
                                    )}
                                %
                              </Text>
                            </Section>
                          </MainWorkProgressCard>
                        </MainWorkProgressContainer>
                        <MainDaysWorkProgressContainer>
                          <Section
                            style={{
                              marginBottom: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              일별 작업 진행 추이
                            </Label>
                            <Select
                              onChange={handleChangeProgressDay}
                              value={progressDay}
                            >
                              <option value={7}>최근 7일</option>
                              <option value={14}>최근 14일</option>
                              <option value={30}>최근 30일</option>
                            </Select>
                          </Section>

                          <MainWorkProgressCard>
                            <Section
                              style={{
                                marginBottom: 30,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Label style={{ marginRight: 0, fontSize: 15 }}>
                                {`데이터 ${
                                  project.pType.project_type_id === 1
                                    ? "수집"
                                    : project.pType.project_type_id === 2
                                    ? "전처리"
                                    : "가공"
                                }량`}
                              </Label>
                            </Section>
                            <LineChart
                              height={200}
                              data={
                                stepOneProgressData.length !== 0
                                  ? stepOneProgressData
                                  : []
                              }
                              xAxis={
                                <LinearXAxis
                                  type={"time"}
                                  tickSeries={
                                    <LinearXAxisTickSeries
                                      label={
                                        <LinearXAxisTickLabel
                                          align="center"
                                          padding={20}
                                        />
                                      }
                                    />
                                  }
                                />
                              }
                              series={
                                <LineSeries
                                  symbols={<PointSeries show={true} />}
                                  line={<Line strokeWidth={1} />}
                                  colorScheme={["#1C63CF"]}
                                />
                              }
                              gridlines={
                                <GridlineSeries
                                  line={
                                    <Gridline direction={"y"} strokeWidth={1} />
                                  }
                                />
                              }
                            />
                            <Section
                              style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <LineIdentifier
                                style={{
                                  borderColor: "#1C63CF",
                                  marginRight: 5,
                                }}
                              />
                              <Text style={{ marginRight: 0 }}>
                                {`${
                                  project.pType.project_type_id === 1
                                    ? "수집"
                                    : project.pType.project_type_id === 2
                                    ? "전처리"
                                    : "가공"
                                } 건수`}
                              </Text>
                            </Section>
                          </MainWorkProgressCard>
                          <MainWorkProgressCard style={{ marginTop: 20 }}>
                            <Section
                              style={{
                                marginBottom: 30,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Label style={{ marginRight: 0, fontSize: 15 }}>
                                단계별 완료 파일량
                              </Label>
                            </Section>
                            <LineChart
                              height={200}
                              data={[
                                {
                                  key:
                                    project.pType.project_type_id === 1
                                      ? "수집"
                                      : project.pType.project_type_id === 2
                                      ? "전처리"
                                      : "가공",
                                  data:
                                    stepOneProgressData.length !== 0
                                      ? stepOneProgressData
                                      : [{ key: new Date(), data: 0 }],
                                },
                                {
                                  key: "검수",
                                  data:
                                    stepTwoProgressData.length !== 0
                                      ? stepTwoProgressData
                                      : [{ key: new Date(), data: 0 }],
                                },
                              ]}
                              xAxis={
                                <LinearXAxis
                                  type={"time"}
                                  tickSeries={
                                    <LinearXAxisTickSeries
                                      label={
                                        <LinearXAxisTickLabel
                                          align="center"
                                          padding={20}
                                        />
                                      }
                                    />
                                  }
                                />
                              }
                              series={
                                <LineSeries
                                  symbols={<PointSeries show={true} />}
                                  line={<Line strokeWidth={1} />}
                                  type={"grouped"}
                                  colorScheme={["#1C63CF", "#F24C74"]}
                                />
                              }
                              gridlines={
                                <GridlineSeries
                                  line={<Gridline direction={"y"} />}
                                />
                              }
                            />
                            <Section
                              style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <>
                                <LineIdentifier
                                  style={{
                                    borderColor: "#1C63CF",
                                    marginRight: 5,
                                  }}
                                />
                                <Text style={{ marginRight: 15 }}>
                                  {project.pType.project_type_id === 1
                                    ? "수집"
                                    : project.pType.project_type_id === 2
                                    ? "전처리"
                                    : "가공"}
                                </Text>
                              </>
                              <>
                                <LineIdentifier
                                  style={{
                                    borderColor: "#F24C74",
                                    marginRight: 5,
                                  }}
                                />
                                <Text style={{ marginRight: 0 }}>검수</Text>
                              </>
                            </Section>
                          </MainWorkProgressCard>
                        </MainDaysWorkProgressContainer>
                      </StaticsContainer>
                    )}
                    {staticType === "작업자" && workerStatics && (
                      <StaticsContainer style={{ flexDirection: "column" }}>
                        <MainWorkerStaticsContainer>
                          <MainWorkProgressCard>
                            <Section
                              style={{
                                marginBottom: 30,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Label style={{ marginRight: 0, fontSize: 15 }}>
                                일별 작업자의 작업량
                              </Label>
                            </Section>
                            <LineChart
                              width={windowXSize - 550}
                              height={180}
                              data={[
                                {
                                  key:
                                    project.pType.project_type_id === 1
                                      ? "수집"
                                      : project.pType.project_type_id === 2
                                      ? "전처리"
                                      : "가공",
                                  data:
                                    stepOneProgressData.length !== 0
                                      ? stepOneProgressData
                                      : [
                                          {
                                            key: new Date("2022-11-15"),
                                            data: 0,
                                          },
                                        ],
                                },
                                {
                                  key: "검수",
                                  data:
                                    stepTwoProgressData.length !== 0
                                      ? stepTwoProgressData
                                      : [
                                          {
                                            key: new Date("2022-11-15"),
                                            data: 0,
                                          },
                                        ],
                                },
                              ]}
                              xAxis={
                                <LinearXAxis
                                  type={"time"}
                                  tickSeries={
                                    <LinearXAxisTickSeries
                                      label={
                                        <LinearXAxisTickLabel
                                          align="center"
                                          padding={20}
                                        />
                                      }
                                    />
                                  }
                                />
                              }
                              series={
                                <LineSeries
                                  line={<Line strokeWidth={1} />}
                                  symbols={<PointSeries show={true} />}
                                  type={"grouped"}
                                  colorScheme={["#1C63CF", "#F24C74"]}
                                />
                              }
                              gridlines={
                                <GridlineSeries
                                  line={<Gridline direction={"y"} />}
                                />
                              }
                            />
                            <Section
                              style={{
                                marginTop: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <>
                                <LineIdentifier
                                  style={{
                                    borderColor: "#1C63CF",
                                    marginRight: 5,
                                  }}
                                />
                                <Text style={{ marginRight: 15 }}>
                                  {project.pType.project_type_id === 1
                                    ? "수집"
                                    : project.pType.project_type_id === 2
                                    ? "전처리"
                                    : "가공"}
                                </Text>
                              </>
                              <>
                                <LineIdentifier
                                  style={{
                                    borderColor: "#F24C74",
                                    marginRight: 5,
                                  }}
                                />
                                <Text style={{ marginRight: 0 }}>검수</Text>
                              </>
                            </Section>
                          </MainWorkProgressCard>
                        </MainWorkerStaticsContainer>
                        <MainListContainer
                          style={{ marginTop: 20, maxHeight: "400px" }}
                        >
                          <Section
                            style={{
                              marginBottom: 10,
                              paddingLeft: 10,
                              paddingRight: 10,
                              paddingTop: 10,
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              단계별 작업자의 작업량
                            </Label>
                          </Section>
                          <Section
                            style={{
                              paddingLeft: 10,
                              paddingRight: 10,
                            }}
                          >
                            <StaticButton
                              isSelected={workerStaticsType === 1}
                              onClick={handleChangeOneTwoWorkerStaticsType}
                            >
                              {project.pType.project_type_id === 1
                                ? "수집"
                                : project.pType.project_type_id === 2
                                ? "전처리"
                                : "가공"}
                            </StaticButton>
                            <StaticButton
                              isSelected={workerStaticsType === 2}
                              onClick={handleChangeStepTwoWorkerStaticsType}
                            >
                              검수
                            </StaticButton>
                          </Section>
                          <Section
                            style={{
                              marginTop: 10,
                              paddingLeft: 10,
                              paddingRight: 10,
                            }}
                          >
                            <Label style={{ marginRight: 10, fontSize: 15 }}>
                              검색어
                            </Label>
                            <SearchInput
                              placeholder={"멤버명으로 검색해주세요."}
                              value={workerStaticsSearchText}
                              onChange={handleChangeSearchTextOnWorkerStatics}
                              onKeyDown={handleEnterOnWorkerStatics}
                              style={{
                                padding: 7,
                                width: "350px",
                                minWidth: "150px",
                                fontSize: 15,
                                marginRight: 0,
                              }}
                            />
                            <Icon
                              src={iconSearch}
                              onClick={searchWorkerStaticsByUserId}
                              style={{
                                padding: 10,
                                cursor:
                                  workerStaticsSearchText ||
                                  workerStaticsSearchText === ""
                                    ? "pointer"
                                    : "not-allowed",
                                backgroundColor: "#3580E3",
                                fill: "white",
                              }}
                            />
                            <Button
                              style={{
                                marginLeft: 15,
                                width: "3%",
                                backgroundColor: "#3580E3",
                                fontSize: 12,
                                color: "#FFF",
                                padding: 9,
                              }}
                              onClick={resetSearch}
                            >
                              검색 초기화
                            </Button>
                            <DatePickButton
                              isSelected={selectedDay === "오늘"}
                              style={{ marginLeft: 10 }}
                              onClick={() => searchByDays("오늘")}
                            >
                              오늘
                            </DatePickButton>
                            <DatePickButton
                              isSelected={selectedDay === "3일"}
                              onClick={() => searchByDays("3일")}
                            >
                              3일
                            </DatePickButton>
                            <DatePickButton
                              isSelected={selectedDay === "1주일"}
                              onClick={() => searchByDays("1주일")}
                            >
                              1주일
                            </DatePickButton>
                            <DatePickButton
                              isSelected={selectedDay === "1개월"}
                              onClick={() => searchByDays("1개월")}
                            >
                              1개월
                            </DatePickButton>
                            <DateDivContainer style={{ marginLeft: 20 }}>
                              <DateDiv onClick={showCalendar}>
                                <DateString
                                  dates={dateRange && dateRange.length}
                                >
                                  {dateRange ? dateToString() : "날짜 선택"}
                                </DateString>
                                <Icon src={iconCalendar} />
                              </DateDiv>
                              {calendar && (
                                <Calendar
                                  formatDay={(locale, date) =>
                                    date.toLocaleString("en", {
                                      day: "numeric",
                                    })
                                  }
                                  value={dateRange as any}
                                  onChange={(
                                    value: Date[],
                                    event: ChangeEvent<HTMLInputElement>
                                  ) => handleChangeCalendar(value, event)}
                                  prev2Label={null}
                                  next2Label={null}
                                  minDetail="month"
                                  selectRange
                                  minDate={
                                    new Date(
                                      Date.now() -
                                        60 * 60 * 24 * 7 * 4 * 6 * 10000
                                    )
                                  }
                                  maxDate={
                                    new Date(
                                      Date.now() +
                                        60 * 60 * 24 * 7 * 4 * 6 * 1000
                                    )
                                  }
                                />
                              )}
                            </DateDivContainer>
                          </Section>
                          <Section style={{ marginTop: 20 }}>
                            <ListHeader type={"USER_WORK_AMOUNT"} />
                          </Section>
                          <Vertical>
                            {workerStatics.map((w, index) => (
                              <ListItem
                                key={index}
                                type={"USER_WORK_AMOUNT"}
                                workerStatics={w}
                                workerStaticsType={workerStaticsType}
                              />
                            ))}
                          </Vertical>
                        </MainListContainer>
                      </StaticsContainer>
                    )}
                    {staticType === "클래스" && classesStatics && (
                      <StaticsContainer>
                        <MainWorkerStaticsContainer>
                          <Section style={{ marginBottom: 10 }}>
                            <Label style={{ fontSize: 15 }}>오브젝트</Label>
                          </Section>
                          <MainWorkProgressCard>
                            <BarChart
                              width={windowXSize - 550}
                              height={300}
                              data={classesStatics}
                              xAxis={<LinearXAxis type="value" />}
                              yAxis={
                                <LinearYAxis
                                  type="category"
                                  tickSeries={
                                    <LinearYAxisTickSeries tickSize={20} />
                                  }
                                />
                              }
                              series={
                                <BarSeries
                                  colorScheme={"cybertron"}
                                  layout="horizontal"
                                  padding={0.6}
                                />
                              }
                            />
                          </MainWorkProgressCard>
                        </MainWorkerStaticsContainer>
                      </StaticsContainer>
                    )}
                  </>
                )
              )}
              {selectedInnerTab === InnerSidebarItem.settings && (
                <>
                  <MainActionBtnDiv
                    style={{ marginBottom: 20, marginTop: -15 }}
                  >
                    <StaticButton
                      isSelected={settingType === "정보"}
                      onClick={handleInfoSetting}
                    >
                      프로젝트 정보
                    </StaticButton>
                    <StaticButton
                      isSelected={settingType === "멤버"}
                      onClick={handleMemberSetting}
                    >
                      프로젝트 멤버
                    </StaticButton>
                  </MainActionBtnDiv>
                  {settingType === "정보" && (
                    <>
                      <MainProjectInfoContainer>
                        <Section style={{ marginBottom: 10 }}>
                          <Label>프로젝트 이름*</Label>
                          <SearchInput
                            value={settingsPName}
                            onChange={handleChangeSettingsPName}
                            placeholder={"프로젝트 이름을 입력해주세요."}
                          />
                        </Section>
                        <Section style={{ marginBottom: 10 }}>
                          <Label>프로젝트 설명</Label>
                          <SearchInput
                            style={{ marginLeft: 8 }}
                            value={settingsPDesc}
                            onChange={handleChangeSettingsPDesc}
                            placeholder={"프로젝트 설명을 입력해주세요."}
                          />
                        </Section>
                        <Section style={{ marginBottom: 10 }}>
                          <Label>프로젝트 유형*</Label>
                          <PTypeSelect
                            disabled={true}
                            style={{ backgroundColor: "#E3E8E9" }}
                            value={
                              project.pType.project_type_id === 1
                                ? "데이터 수집/정제"
                                : project.pType.project_type_id === 2
                                ? "데이터 전처리"
                                : "데이터 가공"
                            }
                          >
                            <option value={"데이터 수집/정제"}>
                              데이터 수집/정제
                            </option>
                            <option value={"데이터 가공"}>데이터 가공</option>
                            <option value={"데이터 전처리"}>
                              데이터 전처리
                            </option>
                          </PTypeSelect>
                        </Section>
                      </MainProjectInfoContainer>
                      {project.pType.project_type_id === 1 && (
                        <PConfigureContainer>
                          <PConfigureUpper>
                            <Section style={{ marginBottom: 20 }}>
                              <Label>프로젝트 설정*</Label>
                            </Section>
                            <SmallSection>
                              <SmallLabel>데이터 유형*</SmallLabel>
                            </SmallSection>
                            <SmallSection style={{ marginTop: 20 }}>
                              {project.pDetail &&
                                project.pDetail.data_type === 1 && (
                                  <PTypeBtn
                                    isSelected={
                                      collectDataType ===
                                      CollectDataType.dataset
                                    }
                                    onClick={handleCollectDataSet}
                                  >
                                    인간 데이터셋
                                  </PTypeBtn>
                                )}
                              {project.pDetail &&
                                project.pDetail.data_type === 2 && (
                                  <PTypeBtn
                                    isSelected={
                                      collectDataType ===
                                      CollectDataType.crawling
                                    }
                                    onClick={handleCollectCrawling}
                                  >
                                    웹 크롤링 데이터
                                  </PTypeBtn>
                                )}
                              {project.pDetail &&
                                project.pDetail.data_type === 3 && (
                                  <PTypeBtn
                                    isSelected={
                                      collectDataType === CollectDataType.upload
                                    }
                                    onClick={handleCollectUpload}
                                  >
                                    데이터 업로드
                                  </PTypeBtn>
                                )}
                            </SmallSection>
                          </PConfigureUpper>
                          {collectDataType === CollectDataType.dataset && (
                            <>
                              <ListHeader type="SETTING DATASET TYPE" />
                              {datasets.map((data, index) => (
                                <ListItem
                                  key={index}
                                  type={"SETTING DATASET TYPE"}
                                  dataset={data}
                                />
                              ))}
                            </>
                          )}
                          {collectDataType === CollectDataType.crawling && (
                            <PConfigureUpper>
                              <Section style={{ margin: "15px 0px" }}>
                                <SmallLabel>수집채널</SmallLabel>
                                <SmallLabel style={{ fontWeight: 500 }}>
                                  {
                                    crawling.project_detail
                                      .crawling_channel_type
                                  }
                                </SmallLabel>
                              </Section>
                              <Section style={{ margin: "15px 0px" }}>
                                <SmallLabel style={{ marginRight: 80 }}>
                                  키워드
                                </SmallLabel>
                                <SmallLabel style={{ fontWeight: 500 }}>
                                  {crawling.project_detail.crawling_keywords}
                                </SmallLabel>
                              </Section>
                              <Section style={{ margin: "15px 0px" }}>
                                <SmallLabel>수집기간</SmallLabel>
                                <SmallLabel style={{ fontWeight: 500 }}>
                                  {crawling.project_detail
                                    .crawling_period_type === 1
                                    ? "직접입력"
                                    : crawling.project_detail
                                        .crawling_period_type === 2
                                    ? "일주일"
                                    : crawling.project_detail
                                        .crawling_period_type === 3
                                    ? "3개월"
                                    : "1년"}
                                </SmallLabel>
                              </Section>
                              <Section style={{ margin: "15px 0px" }}>
                                <SmallLabel>수집건수</SmallLabel>
                                <SmallLabel style={{ fontWeight: 500 }}>
                                  {crawling.project_detail.crawling_limit}
                                </SmallLabel>
                              </Section>
                            </PConfigureUpper>
                          )}
                          {collectDataType === CollectDataType.upload && (
                            <PConfigureUpper>
                              <Section style={{ margin: "15px 0px" }}>
                                <SmallLabel>보유 데이터 업로드</SmallLabel>
                              </Section>
                            </PConfigureUpper>
                          )}
                        </PConfigureContainer>
                      )}
                      {project.pType.project_type_id === 3 && (
                        <MainProjectInfoContainer style={{ marginTop: 20 }}>
                          <Section style={{ marginBottom: 10 }}>
                            <Label>프로젝트 설정*</Label>
                          </Section>
                          <Section style={{ marginTop: 10, marginBottom: 20 }}>
                            <Label style={{ fontSize: 15 }}>클래스 설정*</Label>
                          </Section>
                          <ClassContainer>
                            <ClassWrapper>
                              <ClassWrapperTitleBox>
                                <ClassWrapperTitle>클래스</ClassWrapperTitle>
                              </ClassWrapperTitleBox>
                              <ClassWrapperBody>
                                <ClassWrapperLists>
                                  {projectAnnotation &&
                                    projectAnnotation.map((p, index) => (
                                      <ClassLayout
                                        key={index}
                                        classBg={
                                          currentSelectedClass ===
                                          p.annotation_category_name
                                        }
                                      >
                                        <ClassDiv>
                                          <ClassColor
                                            bgColor={
                                              p.annotation_category_color
                                            }
                                          />
                                          <ClassLabel
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              handleSetAttr(
                                                p.annotation_category_name
                                              )
                                            }
                                          >
                                            {p.annotation_category_name}
                                          </ClassLabel>
                                        </ClassDiv>
                                        <Icon
                                          src={iconArrow}
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleSetAttr(
                                              p.annotation_category_name
                                            )
                                          }
                                        />
                                      </ClassLayout>
                                    ))}
                                </ClassWrapperLists>
                              </ClassWrapperBody>
                            </ClassWrapper>
                            {showAttrDiv && (
                              <>
                                <ClassWrapper>
                                  <ClassWrapperTitleBox>
                                    <ClassWrapperTitle>
                                      클래스 별 속성
                                    </ClassWrapperTitle>
                                  </ClassWrapperTitleBox>
                                  <ClassWrapperBody>
                                    <ClassWrapperLists style={{ padding: 0 }}>
                                      {currentSelectedClass &&
                                        getCurrentSelectedClassAttr() &&
                                        getCurrentSelectedClassAttr() !==
                                          undefined &&
                                        getCurrentSelectedClassAttr()!.map(
                                          (a, index) => (
                                            <AttrLayout
                                              attrBg={
                                                currentSelectedAttr ===
                                                a.annotation_category_attr_name
                                              }
                                              onClick={() =>
                                                handleSetAttrOfClass(a)
                                              }
                                              key={index}
                                              style={{
                                                width: "100%",
                                                color: "#6B78A1",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {a.annotation_category_attr_name}
                                            </AttrLayout>
                                          )
                                        )}
                                    </ClassWrapperLists>
                                  </ClassWrapperBody>
                                </ClassWrapper>
                                <ClassWrapper>
                                  <ClassWrapperTitleBox>
                                    <ClassWrapperTitle>
                                      클래스 별 속성 값
                                    </ClassWrapperTitle>
                                  </ClassWrapperTitleBox>
                                  <ClassWrapperBody style={{ width: 430 }}>
                                    <ClassAttrForm attrType={selectedAttrType}>
                                      <FormSection>
                                        <FormColumn>
                                          <ClassLabel
                                            style={{
                                              fontWeight: 800,
                                              marginBottom: 5,
                                            }}
                                          >
                                            속성명
                                          </ClassLabel>
                                          <ClassWrapperBodyInput
                                            disabled
                                            type={"text"}
                                            placeholder={"속성명"}
                                            value={attrName}
                                            style={{
                                              width: "100%",
                                              border: 0,
                                            }}
                                          />
                                        </FormColumn>
                                        <FormColumn>
                                          <ClassLabel
                                            style={{
                                              fontWeight: 800,
                                              marginBottom: 5,
                                            }}
                                          >
                                            속성유형
                                          </ClassLabel>
                                          <ClassWrapperBodyInput
                                            disabled
                                            type={"text"}
                                            value={selectedAttrType}
                                            style={{
                                              width: "100%",
                                              border: 0,
                                            }}
                                          />
                                        </FormColumn>
                                      </FormSection>
                                      {selectedAttrType ===
                                        ClassAttrType.mono &&
                                        ClassAttrType.multi && (
                                          <FormSection>
                                            <FormColumn
                                              style={{
                                                width: "100%",
                                                marginRight: 0,
                                              }}
                                            >
                                              <ClassLabel
                                                style={{
                                                  fontWeight: 800,
                                                  marginBottom: 5,
                                                }}
                                              >
                                                속성값
                                              </ClassLabel>
                                              <SelectedContainer>
                                                {currentSelectedAttr &&
                                                  getCurrentSelectedAttrValues() !==
                                                    null &&
                                                  getCurrentSelectedAttrValues()!
                                                    .attrValue &&
                                                  getCurrentSelectedAttrValues()!
                                                    .attrValue!.length > 0 &&
                                                  getCurrentSelectedAttrValues()!.attrValue!.map(
                                                    (av, index) => (
                                                      <SelectedItem key={index}>
                                                        <ItemLabel>
                                                          {av}
                                                        </ItemLabel>
                                                      </SelectedItem>
                                                    )
                                                  )}
                                              </SelectedContainer>
                                            </FormColumn>
                                          </FormSection>
                                        )}
                                      {selectedAttrType ===
                                        ClassAttrType.multi && (
                                        <FormSection>
                                          <FormColumn
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <ClassLabel>
                                              최소 선택 수
                                            </ClassLabel>
                                            <ClassWrapperBodyInput
                                              disabled
                                              name={"min"}
                                              type={"number"}
                                              value={minValue}
                                              style={{
                                                border: 0,
                                                width: "50%",
                                              }}
                                            />
                                          </FormColumn>
                                          <FormColumn
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <ClassLabel>
                                              최대 선택 수
                                            </ClassLabel>
                                            <ClassWrapperBodyInput
                                              disabled
                                              name={"max"}
                                              type={"number"}
                                              value={maxValue}
                                              style={{
                                                border: 0,
                                                width: "50%",
                                              }}
                                            />
                                          </FormColumn>
                                        </FormSection>
                                      )}

                                      {/* 입력형 숫자에서는 숫자의 최소최대범위 나오도록 */}
                                      {selectedAttrType ===
                                        ClassAttrType.customNumber && (
                                        <FormSection style={{ marginTop: 40 }}>
                                          <FormColumn
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <ClassLabel>
                                              최소 입력 값
                                            </ClassLabel>
                                            <ClassWrapperBodyInput
                                              disabled
                                              name={"min"}
                                              type={"number"}
                                              value={minValue}
                                              style={{
                                                border: 0,
                                                width: "50%",
                                              }}
                                            />
                                          </FormColumn>
                                          <FormColumn
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <ClassLabel>
                                              최대 입력 값
                                            </ClassLabel>
                                            <ClassWrapperBodyInput
                                              disabled
                                              name={"max"}
                                              type={"number"}
                                              value={maxValue}
                                              style={{
                                                border: 0,
                                                width: "50%",
                                              }}
                                            />
                                          </FormColumn>
                                        </FormSection>
                                      )}
                                      {/* 입력형 문자에서는 글자의 최소최대범위 나오도록 */}
                                      {selectedAttrType ===
                                        ClassAttrType.customString && (
                                        <FormSection style={{ marginTop: 40 }}>
                                          <FormColumn
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <ClassLabel>
                                              최소 입력 값
                                            </ClassLabel>
                                            <ClassWrapperBodyInput
                                              disabled
                                              name={"min"}
                                              type={"number"}
                                              value={minValue}
                                              style={{
                                                border: 0,
                                                width: "50%",
                                              }}
                                            />
                                          </FormColumn>
                                          <FormColumn
                                            style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <ClassLabel>
                                              최대 입력 값
                                            </ClassLabel>
                                            <ClassWrapperBodyInput
                                              disabled
                                              name={"max"}
                                              type={"number"}
                                              value={maxValue}
                                              style={{
                                                border: 0,
                                                width: "50%",
                                              }}
                                            />
                                          </FormColumn>
                                        </FormSection>
                                      )}
                                    </ClassAttrForm>
                                  </ClassWrapperBody>
                                </ClassWrapper>
                              </>
                            )}
                          </ClassContainer>
                        </MainProjectInfoContainer>
                      )}
                      <MainProjectInfoContainer style={{ marginTop: 20 }}>
                        <Section style={{ marginBottom: 10 }}>
                          <Label>작업단계</Label>
                        </Section>
                        <Section style={{ marginBottom: 10 }}>
                          <LabelWrapper style={{ marginRight: 10, width: 100 }}>
                            <LabelDiv>1단계</LabelDiv>
                          </LabelWrapper>
                          <LabelValueDiv>
                            {project.pType.project_type_id === 1
                              ? "수집/정제"
                              : project.pType.project_type_id === 2
                              ? "전처리"
                              : "가공"}
                          </LabelValueDiv>
                        </Section>
                        <Section>
                          <LabelWrapper style={{ marginRight: 10, width: 100 }}>
                            <LabelDiv>2단계</LabelDiv>
                          </LabelWrapper>
                          <LabelValueDiv>검수</LabelValueDiv>
                        </Section>
                      </MainProjectInfoContainer>
                      <MainBottomDiv>
                        <CreateButton
                          onClick={doUpdateProject}
                          disabled={!loggedInUser.isAdmin || pUpdateLoading}
                          style={{
                            cursor: loggedInUser.isAdmin
                              ? "pointer"
                              : "not-allowed",
                            backgroundColor: loggedInUser.isAdmin
                              ? "#3480e3"
                              : "#E3E8E9",
                          }}
                        >
                          {pUpdateLoading ? <LoaderText /> : "저장"}
                        </CreateButton>
                        <CancelButton
                          onClick={handleShowDeleteAlert}
                          disabled={!loggedInUser.isAdmin}
                          style={{
                            cursor: loggedInUser.isAdmin
                              ? "pointer"
                              : "not-allowed",
                            backgroundColor: loggedInUser.isAdmin
                              ? "#fe9f46"
                              : "#E3E8E9",
                          }}
                        >
                          삭제
                          <AlertDialog
                            isOpen={showDeletePAlert}
                            onClose={handleCancelDeleteAlert}
                            isCentered
                            leastDestructiveRef={cancelRef}
                          >
                            <AlertDialogOverlay>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  프로젝트 삭제
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                  프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴
                                  수 없습니다.
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                  <ChakraBtn
                                    ref={cancelRef}
                                    onClick={handleCancelDeleteAlert}
                                    style={{ marginRight: 7 }}
                                  >
                                    취소
                                  </ChakraBtn>
                                  <ChakraBtn
                                    colorScheme="red"
                                    onClick={doDeleteProject}
                                  >
                                    {pDeleteLoading ? <LoaderText /> : "삭제"}
                                  </ChakraBtn>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialogOverlay>
                          </AlertDialog>
                        </CancelButton>
                      </MainBottomDiv>
                    </>
                  )}
                  {settingType === "멤버" && (
                    <>
                      <MainSearchContainer>
                        <Section>
                          <Label>검색어</Label>
                          <SearchInput
                            placeholder={"이름, 이메일로 검색해주세요."}
                            onChange={handleChangeSearchProjectMember}
                            onKeyDown={(e) => {
                              e.key === "Enter"
                                ? handleSearchProjectMember()
                                : null;
                            }}
                          />
                          <SearchBtn
                            isValid={true}
                            onClick={handleSearchProjectMember}
                          >
                            검색
                          </SearchBtn>
                        </Section>
                      </MainSearchContainer>
                      <MainListContainer>
                        <MainListTop>
                          <ListTopLeftLabel>{`전체 멤버 ${
                            searchedProjectMemberList.length
                          } 명`}</ListTopLeftLabel>
                          <ListTopRightContainer>
                            {selectedProjectMemberList &&
                              selectedProjectMemberList.length > 0 && (
                                <>
                                  {false && (
                                    <Menu closeOnSelect={false}>
                                      {({ isOpen }) => (
                                        <>
                                          <MenuButton
                                            display={"flex"}
                                            flexDirection={"row"}
                                            alignItems={"center"}
                                            bgColor={"#F7FAFE"}
                                            border={"1px"}
                                            borderColor={"#AECCF4"}
                                            borderRadius={"none"}
                                            width={"150px"}
                                            marginRight={"20px"}
                                            _focus={{ bgColor: "#F7FAFE" }}
                                            _hover={{ bgColor: "#F7FAFE" }}
                                            _expanded={{ bgColor: "#F7FAFE" }}
                                            isActive={isOpen}
                                            as={ChakraBtn}
                                            rightIcon={
                                              isOpen ? (
                                                <Icon src={arrowUp} />
                                              ) : (
                                                <Icon src={arrowDown} />
                                              )
                                            }
                                          >
                                            <DropBoxTextWrapper>
                                              <DropBoxNormalText>
                                                {selectedProjectMemberType &&
                                                selectedProjectMemberType.length >
                                                  0
                                                  ? selectedProjectMemberType.length ===
                                                    2
                                                    ? "전체"
                                                    : selectedProjectMemberType[0]
                                                  : "작업단계 변경"}
                                              </DropBoxNormalText>
                                            </DropBoxTextWrapper>
                                          </MenuButton>
                                          <MenuList
                                            bgColor={"#e2e4e7"}
                                            border={"1px"}
                                            alignItems={"center"}
                                            width={"148px"}
                                            minWidth={"148px"}
                                            padding={"0"}
                                            borderColor={"#AECCF4"}
                                            borderRadius={"none"}
                                          >
                                            <MenuItem
                                              _hover={{ bgColor: "#CFD1D4" }}
                                              _focusWithin={{
                                                bgColor: "#CFD1D4",
                                              }}
                                              value={"전체"}
                                              width={"146px"}
                                            >
                                              <ChakraCheckbox
                                                isChecked={
                                                  selectedProjectMemberType &&
                                                  selectedProjectMemberType.length ===
                                                    2
                                                }
                                                onChange={(e) =>
                                                  setSelectedTypeProjectMember(
                                                    "all"
                                                  )
                                                }
                                                width={"100%"}
                                                colorScheme={"ssloGreen"}
                                              >
                                                <ChakraText
                                                  fontSize={"14px"}
                                                  color={
                                                    selectedProjectMemberType &&
                                                    selectedProjectMemberType.length ===
                                                      2
                                                      ? "#2EA090"
                                                      : "#243654"
                                                  }
                                                >
                                                  {"전체"}
                                                </ChakraText>
                                              </ChakraCheckbox>
                                            </MenuItem>
                                            <MenuItem
                                              _hover={{ bgColor: "#CFD1D4" }}
                                              _focusWithin={{
                                                bgColor: "#CFD1D4",
                                              }}
                                              value={
                                                project.pType
                                                  .project_type_id === 1
                                                  ? "수집"
                                                  : project.pType
                                                      .project_type_id === 2
                                                  ? "전처리"
                                                  : "가공"
                                              }
                                              width={"146px"}
                                            >
                                              <ChakraCheckbox
                                                isChecked={isSelectedTypeProjectMember(
                                                  project.pType
                                                    .project_type_id === 1
                                                    ? "수집"
                                                    : project.pType
                                                        .project_type_id === 2
                                                    ? "전처리"
                                                    : "가공"
                                                )}
                                                onChange={(e) =>
                                                  setSelectedTypeProjectMember(
                                                    project.pType
                                                      .project_type_id === 1
                                                      ? "수집"
                                                      : project.pType
                                                          .project_type_id === 2
                                                      ? "전처리"
                                                      : "가공"
                                                  )
                                                }
                                                width={"100%"}
                                                colorScheme={"ssloGreen"}
                                              >
                                                <ChakraText
                                                  fontSize={"14px"}
                                                  color={
                                                    isSelectedTypeProjectMember(
                                                      project.pType
                                                        .project_type_id === 1
                                                        ? "수집"
                                                        : project.pType
                                                            .project_type_id ===
                                                          2
                                                        ? "전처리"
                                                        : "가공"
                                                    )
                                                      ? "#2EA090"
                                                      : "#243654"
                                                  }
                                                >
                                                  {project.pType
                                                    .project_type_id === 1
                                                    ? "수집"
                                                    : project.pType
                                                        .project_type_id === 2
                                                    ? "전처리"
                                                    : "가공"}
                                                </ChakraText>
                                              </ChakraCheckbox>
                                            </MenuItem>
                                            <MenuItem
                                              _hover={{ bgColor: "#CFD1D4" }}
                                              _focusWithin={{
                                                bgColor: "#CFD1D4",
                                              }}
                                              value={"검수"}
                                              width={"146px"}
                                            >
                                              <ChakraCheckbox
                                                isChecked={isSelectedTypeProjectMember(
                                                  "검수"
                                                )}
                                                onChange={(e) =>
                                                  setSelectedTypeProjectMember(
                                                    "검수"
                                                  )
                                                }
                                                width={"100%"}
                                                colorScheme={"ssloGreen"}
                                              >
                                                <ChakraText
                                                  fontSize={"14px"}
                                                  color={
                                                    isSelectedTypeProjectMember(
                                                      "검수"
                                                    )
                                                      ? "#2EA090"
                                                      : "#243654"
                                                  }
                                                >
                                                  {"검수"}
                                                </ChakraText>
                                              </ChakraCheckbox>
                                            </MenuItem>
                                          </MenuList>
                                        </>
                                      )}
                                    </Menu>
                                  )}
                                  <Button
                                    onClick={onOpenRemovePMember}
                                    style={{
                                      width: "100px",
                                      backgroundColor: "#FF9F46",
                                      color: "#000",
                                    }}
                                  >
                                    삭제
                                    <Modal
                                      isOpen={openRemovePMember}
                                      onClose={onCancelRemovePMember}
                                      size={"md"}
                                      isCentered
                                    >
                                      <ModalOverlay />
                                      <ModalContent>
                                        <ModalHeader
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            height: 50,
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            backgroundColor: "#D2E2F8",
                                            justifyContent: "center",
                                            color: "#243654",
                                            fontSize: "14px",
                                            fontWeight: 700,
                                          }}
                                        >
                                          프로젝트 멤버 삭제
                                        </ModalHeader>
                                        <ModalCloseButton
                                          style={{ marginTop: -3 }}
                                        />
                                        <ModalBody
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            padding: 50,
                                            flexDirection: "column",
                                          }}
                                        >
                                          {/* // ! Task 담당자 해지 기능 (Api) 구현 후 활성화 예정 */}
                                          <Text>{txtRemovePMember}</Text>
                                          <Text>
                                            {"선택한 멤버를 삭제하시겠습니까?"}
                                          </Text>
                                        </ModalBody>
                                        <ModalFooter>
                                          <Button
                                            style={{
                                              width: "10%",
                                              backgroundColor: "#FF9F46",
                                              fontSize: 12,
                                              color: "#000",
                                              marginRight: 10,
                                            }}
                                            onClick={onRemoveProjectMember}
                                          >
                                            삭제
                                          </Button>
                                          <Button
                                            style={{
                                              width: "10%",
                                              backgroundColor: "#fff",
                                              border: "1px solid #3580E3",
                                              fontSize: 12,
                                              color: "#3580E3",
                                              marginRight: 0,
                                            }}
                                            onClick={onCancelRemovePMember}
                                          >
                                            취소
                                          </Button>
                                        </ModalFooter>
                                      </ModalContent>
                                    </Modal>
                                  </Button>
                                </>
                              )}
                            <Button
                              onClick={onOpenOrganizationMember}
                              style={{
                                width: "150px",
                                backgroundColor: "#3580E3",
                                color: "#FFF",
                              }}
                            >
                              작업자 추가하기
                              <Modal
                                isOpen={openOrganizationMember}
                                onClose={onCancelOrganizationMember}
                                size={"3xl"}
                                isCentered
                              >
                                <ModalOverlay />
                                <ModalContent>
                                  <ModalHeader
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      height: 50,
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      backgroundColor: "#D2E2F8",
                                      justifyContent: "center",
                                      color: "#243654",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    프로젝트 멤버 추가
                                  </ModalHeader>
                                  <ModalCloseButton style={{ marginTop: -3 }} />
                                  <ModalBody>
                                    {/* //! 검색 기능 함수 수정 필요 */}
                                    <Horizontal>
                                      <SearchInput
                                        placeholder={
                                          "이름 또는 이메일로 검색해주세요."
                                        }
                                        onChange={
                                          handleChangeSearchOrganizationMember
                                        }
                                        value={searchText || ""}
                                        onKeyDown={(e) => {
                                          e.key === "Enter"
                                            ? handleSearchOrganizationMember()
                                            : null;
                                        }}
                                        style={{
                                          minWidth: "80%",
                                          width: "80%",
                                          marginRight: 0,
                                        }}
                                      />
                                      <Icon
                                        src={iconSearch}
                                        onClick={
                                          searchText || searchText !== ""
                                            ? handleSearchOrganizationMember
                                            : undefined
                                        }
                                        style={{
                                          padding: 10,
                                          cursor: searchText
                                            ? "pointer"
                                            : "not-allowed",
                                          backgroundColor: "#3580E3",
                                          fill: "white",
                                        }}
                                      />
                                    </Horizontal>
                                    <Horizontal
                                      style={{
                                        marginTop: 20,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Vertical
                                        style={{
                                          width: "55%",
                                          maxWidth: "55%",
                                          overflowY: "hidden",
                                        }}
                                      >
                                        <AssigneeHeader
                                          style={{
                                            borderTop: "1px solid #aeccf4",
                                          }}
                                        >
                                          <ChakraCheckbox
                                            colorScheme={"ssloGreen"}
                                            style={{
                                              width: "5%",
                                              margin: "0 2%",
                                            }}
                                            isChecked={isSelectAllOrganizationMember()}
                                            onChange={(e) =>
                                              setSelectedOrganizationMembers(
                                                null
                                              )
                                            }
                                          />
                                          <Label
                                            style={{
                                              fontSize: 12,
                                              width: "45%",
                                              textAlign: "center",
                                              marginRight: "0",
                                            }}
                                          >
                                            멤버명
                                          </Label>
                                          <Label
                                            style={{
                                              fontSize: 12,
                                              width: "50%",
                                              textAlign: "center",
                                              marginRight: "0",
                                            }}
                                          >
                                            멤버 이메일
                                          </Label>
                                        </AssigneeHeader>
                                        <AssigneeWrapper>
                                          {searchedOrganizationMemberList.map(
                                            (m, index) => (
                                              <AssigneeRow
                                                key={index}
                                                isSelected={
                                                  false
                                                  /* assignee
                                                  ? assignee.userId === u.userId
                                                  : false */
                                                }
                                                /* onClick={() => {setSelectedProjectMembers(u)}} */
                                              >
                                                <ChakraCheckbox
                                                  colorScheme={"ssloGreen"}
                                                  style={{
                                                    width: "5%",
                                                    margin: "0 2%",
                                                  }}
                                                  isChecked={isSelectedOrganizationMember(
                                                    m
                                                  )}
                                                  // isDisabled={true}
                                                  onChange={(e) =>
                                                    setSelectedOrganizationMembers(
                                                      m
                                                    )
                                                  }
                                                />
                                                <Label
                                                  style={{
                                                    fontSize: 12,
                                                    width: "45%",
                                                    textAlign: "center",
                                                    marginRight: "0",
                                                  }}
                                                  onClick={() => setSelectedOrganizationMembers(m)}
                                                >
                                                  {m.userDisplayName}
                                                </Label>
                                                <Label
                                                  style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    width: "50%",
                                                    textAlign: "center",
                                                    marginRight: "0",
                                                  }}
                                                  onClick={() => setSelectedOrganizationMembers(m)}
                                                >
                                                  {m.userEmail}
                                                </Label>
                                              </AssigneeRow>
                                            )
                                          )}
                                        </AssigneeWrapper>
                                      </Vertical>
                                      <Vertical
                                        style={{
                                          width: "45%",
                                          maxWidth: "45%",
                                          overflowY: "hidden",
                                          marginLeft: "20px",
                                          backgroundColor: "#f7fafe",
                                        }}
                                      >
                                        <AssigneeWrapper
                                          style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            border: "1px solid #aeccf4",
                                            height: "450px",
                                            padding: "10px",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            alignContent: "flex-start",
                                          }}
                                        >
                                          {selectedOrganizationMemberList &&
                                            selectedOrganizationMemberList.length >
                                              0 &&
                                            selectedOrganizationMemberList.map(
                                              (member, index) => {
                                                return (
                                                  <SelectedItem key={index} style={{ width: "70px", maxWidth: "70px", margin: "10px", }}>
                                                    <Text>
                                                      {member.userDisplayName}
                                                    </Text>
                                                  </SelectedItem>
                                                );
                                              }
                                            )}
                                        </AssigneeWrapper>
                                      </Vertical>
                                    </Horizontal>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      style={{
                                        width: "10%",
                                        backgroundColor: "#3580E3",
                                        fontSize: 12,
                                        color: "#FFF",
                                        marginRight: 0,
                                      }}
                                      onClick={onSubmitOrganizationMember}
                                    >
                                      추가
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </Button>
                          </ListTopRightContainer>
                        </MainListTop>
                        <ListHeader
                          type={"SETTING_MEMBERS"}
                          isSelectedAllProjectMember={
                            isSelectedAllProjectMember
                          }
                          setSelectedAllProjectMembers={
                            setSelectedAllProjectMembers
                          }
                        />
                        <MainListCenter>
                          {searchedProjectMemberList.map((m, index) => {
                            return (
                              <ListItem
                                key={index}
                                type={"SETTING_MEMBERS"}
                                project={project}
                                projectMember={m}
                                selectMember={setSelectedProjectMembers}
                                isSelectedMember={isSelectedProjectMember}
                              />
                            );
                          })}
                        </MainListCenter>
                        <Paginator
                          itemCount={10}
                          page={page}
                          totalCount={searchedProjectMemberList.length}
                        />
                      </MainListContainer>
                    </>
                  )}
                </>
              )}
              {selectedInnerTab === InnerSidebarItem.modelSettings && (
                <>
                  <MainListContainer style={{ maxHeight: "100%" }}>
                    <MainListTop>
                      <ListTopLeftLabel>{"모델 설정"}</ListTopLeftLabel>
                    </MainListTop>
                    <Section
                      style={{
                        flexDirection: "column",
                        maxWidth: "775px",
                        padding: "20px 30px",
                        marginLeft: "40px",
                        marginBottom: 40,
                        background: "#FCF8FF",
                      }}
                    >
                      <SmallSection>
                        <Icon src={iconGuideModelSetting} />
                        <Label style={{ color: "#6F16B6", marginLeft: 10 }}>
                          모델설정 가이드
                        </Label>
                      </SmallSection>
                      <SmallSection
                        style={{
                          flexDirection: "column",
                          marginTop: "20px",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            color: "#6F16B6",
                          }}
                        >
                          {
                            "aug : 데이터 증강 배율 (eg. 10 -> 현재 라벨링된 데이터 개수 X 10)"
                          }
                          <div style={{ marginBottom: "5px" }}></div>
                          {
                            "epoch : 1 epoch는 전체 데이터 셋에 대해 1번 학습을 완료한 상태"
                          }
                          <div style={{ marginBottom: "5px" }}></div>
                          {
                            "Ir(Learning Rate) : 모델이 학습되는 과정에서 최적의 해를 찾기 위한 파라미터"
                          }
                          <div style={{ marginBottom: "5px" }}></div>
                          {
                            "conf : 학습이 완료된 후 모델 추론시 결과값에 대한 필터링 조건 (eg. 0.67 = 67% 이상의 정확도를 가진 객체만 검출)"
                          }
                          <div style={{ marginBottom: "5px" }}></div>
                          {
                            "batch_size : 전체 데이터 셋을 그룹화 하는 단위로써 실제 모델 학 습 시 데이터는 batch size 단위로 모델에 입력되어 학습이 진행됨"
                          }
                        </Text>
                      </SmallSection>
                    </Section>
                    <Section
                      style={{
                        flexDirection: "column",
                        paddingLeft: "40px",
                        marginBottom: 10,
                      }}
                    >
                      <SmallSection style={{ marginBottom: 30 }}>
                        <Label style={{ width: "100px", marginRight: "40px" }}>
                          적용모델
                        </Label>
                        <Menu>
                          {({ isOpen }) => (
                            <>
                              <MenuButton
                                display={"flex"}
                                flexDirection={"row"}
                                alignItems={"center"}
                                bgColor={"#F7FAFE"}
                                border={"1px"}
                                borderColor={"#AECCF4"}
                                borderRadius={"none"}
                                width={"200px"}
                                marginRight={"20px"}
                                _focus={{ bgColor: "#F7FAFE" }}
                                _hover={{ bgColor: "#F7FAFE" }}
                                _expanded={{ bgColor: "#F7FAFE" }}
                                isActive={isOpen}
                                as={ChakraBtn}
                                rightIcon={
                                  isOpen ? (
                                    <Icon src={arrowUp} />
                                  ) : (
                                    <Icon src={arrowDown} />
                                  )
                                }
                              >
                                <DropBoxTextWrapper>
                                  <DropBoxNormalText>
                                    {modelConfig
                                      ? modelConfig.model_name
                                      : modelConfigList[0]}
                                  </DropBoxNormalText>
                                </DropBoxTextWrapper>
                              </MenuButton>
                              <MenuList
                                bgColor={"#e2e4e7"}
                                border={"1px"}
                                alignItems={"center"}
                                width={"198px"}
                                minWidth={"198px"}
                                padding={"0"}
                                borderColor={"#AECCF4"}
                                borderRadius={"none"}
                              >
                                <MenuOptionGroup
                                  defaultValue={
                                    modelConfig
                                      ? modelConfig.model_name
                                      : modelConfigList[0]
                                  }
                                  type="radio"
                                >
                                  {modelConfigList &&
                                    modelConfigList.map((m, index) => {
                                      return (
                                        <MenuItemOption
                                          key={index}
                                          _hover={{ bgColor: "#CFD1D4" }}
                                          _focusWithin={{
                                            bgColor: "#CFD1D4",
                                          }}
                                          value={m}
                                          width={"196px"}
                                          onClick={() => handleSetConfigName(m)}
                                        >
                                          {m}
                                        </MenuItemOption>
                                      );
                                    })}
                                </MenuOptionGroup>
                              </MenuList>
                            </>
                          )}
                        </Menu>
                      </SmallSection>
                      <SmallSection style={{ marginBottom: 30 }}>
                        <Label style={{ width: "100px", marginRight: "40px" }}>
                          aug
                        </Label>
                        <div style={{ position: "relative" }}>
                          <ClassWrapperBodyInput
                            name={"inputAug"}
                            type={"number"}
                            value={modelConfig ? modelConfig.model_aug : 10}
                            style={{
                              width: "200px",
                              height: "40px",
                              padding: "0 16px",
                            }}
                            placeholder={""}
                            readOnly={true}
                          />
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              flexDirection: "column",
                              right: 0,
                              top: 0,
                              padding: "2px",
                            }}
                          >
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigAug("inc")}
                            >
                              <Icon src={arrowUp} />
                            </ChakraBtn>
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigAug("dec")}
                            >
                              <Icon src={arrowDown} />
                            </ChakraBtn>
                          </div>
                        </div>
                      </SmallSection>
                      <SmallSection style={{ marginBottom: 30 }}>
                        <Label style={{ width: "100px", marginRight: "40px" }}>
                          epoch
                        </Label>
                        <div style={{ position: "relative" }}>
                          <ClassWrapperBodyInput
                            name={"inputEpach"}
                            type={"number"}
                            value={modelConfig ? modelConfig.model_epoch : 300}
                            style={{
                              width: "200px",
                              height: "40px",
                              padding: "0 16px",
                            }}
                            placeholder={""}
                            readOnly={true}
                          />
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              flexDirection: "column",
                              right: 0,
                              top: 0,
                              padding: "2px",
                            }}
                          >
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigEpoch("inc")}
                            >
                              <Icon src={arrowUp} />
                            </ChakraBtn>
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigEpoch("dec")}
                            >
                              <Icon src={arrowDown} />
                            </ChakraBtn>
                          </div>
                        </div>
                      </SmallSection>
                      <SmallSection style={{ marginBottom: 30 }}>
                        <Label style={{ width: "100px", marginRight: "40px" }}>
                          lr
                        </Label>
                        <div style={{ position: "relative" }}>
                          <ClassWrapperBodyInput
                            name={"inputLr"}
                            type={"number"}
                            value={modelConfig ? modelConfig.model_lr : 0.00015}
                            style={{
                              width: "200px",
                              height: "40px",
                              padding: "0 16px",
                            }}
                            placeholder={""}
                            readOnly={true}
                          />
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              flexDirection: "column",
                              right: 0,
                              top: 0,
                              padding: "2px",
                            }}
                          >
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigLr("inc")}
                            >
                              <Icon src={arrowUp} />
                            </ChakraBtn>
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigLr("dec")}
                            >
                              <Icon src={arrowDown} />
                            </ChakraBtn>
                          </div>
                        </div>
                      </SmallSection>
                      <SmallSection style={{ marginBottom: 30 }}>
                        <Label style={{ width: "100px", marginRight: "40px" }}>
                          conf
                        </Label>
                        <div style={{ position: "relative" }}>
                          <ClassWrapperBodyInput
                            name={"inputConf"}
                            type={"number"}
                            value={modelConfig ? modelConfig.model_conf : 0.0}
                            style={{
                              width: "200px",
                              height: "40px",
                              padding: "0 16px",
                            }}
                            placeholder={""}
                            readOnly={true}
                          />
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              flexDirection: "column",
                              right: 0,
                              top: 0,
                              padding: "2px",
                            }}
                          >
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigConf("inc")}
                            >
                              <Icon src={arrowUp} />
                            </ChakraBtn>
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigConf("dec")}
                            >
                              <Icon src={arrowDown} />
                            </ChakraBtn>
                          </div>
                        </div>
                      </SmallSection>
                      <SmallSection style={{ marginBottom: 30 }}>
                        <Label style={{ width: "100px", marginRight: "40px" }}>
                          Batch size
                        </Label>
                        <div style={{ position: "relative" }}>
                          <ClassWrapperBodyInput
                            name={"inputBatch"}
                            type={"number"}
                            value={modelConfig ? modelConfig.model_batch : 0.1}
                            style={{
                              width: "200px",
                              height: "40px",
                              padding: "0 16px",
                            }}
                            placeholder={""}
                            readOnly={true}
                          />
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              flexDirection: "column",
                              right: 0,
                              top: 0,
                              padding: "2px",
                            }}
                          >
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigBatch("inc")}
                            >
                              <Icon src={arrowUp} />
                            </ChakraBtn>
                            <ChakraBtn
                              background={"transparent"}
                              width={"40px"}
                              height={"18px"}
                              padding={"0 15px"}
                              onClick={() => handleSetConfigBatch("dec")}
                            >
                              <Icon src={arrowDown} />
                            </ChakraBtn>
                          </div>
                        </div>
                      </SmallSection>
                    </Section>
                  </MainListContainer>
                  <MainBottomDiv>
                    <CreateButton
                      onClick={updateModelConfig}
                      disabled={!loggedInUser.isAdmin || pUpdateLoading}
                      style={{
                        cursor: loggedInUser.isAdmin
                          ? "pointer"
                          : "not-allowed",
                        backgroundColor: loggedInUser.isAdmin
                          ? "#3480e3"
                          : "#E3E8E9",
                      }}
                    >
                      {pUpdateLoading ? <LoaderText /> : "저장"}
                    </CreateButton>
                  </MainBottomDiv>
                </>
              )}
              {selectedInnerTab === InnerSidebarItem.modelRelease && (
                <>
                  <MainListContainer>
                    <MainListTop>
                      <ListTopLeftLabel>{`전체 ${
                        modelExportList.length
                      } 건`}</ListTopLeftLabel>
                    </MainListTop>
                    <ListHeader
                      type={"EXPORT_MODEL"}
                      filterModelByWorkStep={filterModelByWorkStep}
                    />
                    <MainListCenter
                      style={{ borderBottom: "1px solid #afccf4" }}
                    >
                      {modelExportList.map((m, index) => {
                        return (
                          <ListItem
                            key={index}
                            type={"EXPORT_MODEL"}
                            model={m}
                            selectModel={handleSelectModel}
                            isSelectedModel={isSelectedModel}
                            getModelTrainLog={getModelTrainLog}
                          />
                        );
                      })}
                    </MainListCenter>
                  </MainListContainer>
                  {modelLog && (
                    <Section
                      style={{
                        flexDirection: "column",
                        background: "#fff",
                        padding: "3%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Section style={{ justifyContent: "space-between" }}>
                        <SmallSection
                          style={{
                            flexDirection: "column",
                            width: "30%",
                            padding: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <SmallSection
                            style={{
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <LineIdentifier
                              style={{
                                borderColor: "#59b959",
                                marginRight: 10,
                              }}
                            />
                            <ChakraText fontSize={"14px"} fontWeight={"700"}>
                              {modelLog.task_type === "od"
                                ? "fast_rcnn/cls_accuracy"
                                : "mask_rcnn/accuracy"}
                            </ChakraText>
                          </SmallSection>
                          <SmallSection
                            style={{
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <LineIdentifier
                              style={{
                                borderColor: "#f10c08",
                                marginRight: 10,
                              }}
                            />
                            <ChakraText
                              fontSize={"14px"}
                              fontWeight={"700"}
                              marginTop={"10px"}
                            >
                              {modelLog.task_type === "od"
                                ? "fast_rcnn/false_negative"
                                : "mask_rcnn/false_negative"}
                            </ChakraText>
                          </SmallSection>
                          <SmallSection
                            style={{
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <LineIdentifier
                              style={{
                                borderColor: "#5495D1",
                                marginRight: 10,
                              }}
                            />
                            <ChakraText
                              fontSize={"14px"}
                              fontWeight={"700"}
                              marginTop={"10px"}
                            >
                              {modelLog.task_type === "od"
                                ? "fast_rcnn/fg_cls_accuracy"
                                : "mask_rcnn/false_positive"}
                            </ChakraText>
                          </SmallSection>
                        </SmallSection>
                        <SmallSection
                          style={{
                            width: "30%",
                            padding: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <LineIdentifier
                            style={{
                              borderColor: "#5495D1",
                              marginRight: 10,
                            }}
                          />
                          <ChakraText fontSize={"14px"} fontWeight={"700"}>
                            {"lr(e-06)"}
                          </ChakraText>
                        </SmallSection>
                        <SmallSection
                          style={{
                            width: "30%",
                            padding: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <LineIdentifier
                            style={{
                              borderColor: "#f10c08",
                              marginRight: 10,
                            }}
                          />
                          <ChakraText fontSize={"14px"} fontWeight={"700"}>
                            {"total_loss"}
                          </ChakraText>
                        </SmallSection>
                      </Section>
                      <Section
                        style={{
                          marginTop: "20px",
                          justifyContent: "space-between",
                        }}
                      >
                        <SmallSection
                          style={{
                            width: "30%",
                            height: "350px",
                            background: "#D9D9D9",
                            padding: "10px",
                          }}
                        >
                          <LineChart
                            height={300}
                            data={[
                              {
                                key:
                                  modelLog.task_type === "od"
                                    ? "fast_rcnn/cls_accuracy"
                                    : "mask_rcnn/accuracy",
                                data: modelAccuracy,
                              },
                              {
                                key:
                                  modelLog.task_type === "od"
                                    ? "fast_rcnn/false_negative"
                                    : "mask_rcnn/false_negative",
                                data: modelNegative,
                              },
                              {
                                key:
                                  modelLog.task_type === "od"
                                    ? "fast_rcnn/fg_cls_accuracy"
                                    : "mask_rcnn/false_positive",
                                data: modelFgPositive,
                              },
                            ]}
                            xAxis={
                              <LinearXAxis
                                type={"value"}
                                tickSeries={
                                  <LinearXAxisTickSeries
                                    label={
                                      <LinearXAxisTickLabel
                                        align="center"
                                        padding={10}
                                      />
                                    }
                                  />
                                }
                              />
                            }
                            series={
                              <LineSeries
                                type={"grouped"}
                                symbols={<PointSeries show={true} />}
                                line={<Line strokeWidth={1} />}
                                colorScheme={["#59b959", "#f10c08", "#5495D1"]}
                              />
                            }
                            gridlines={
                              <GridlineSeries
                                line={<Gridline direction={"y"} />}
                              />
                            }
                          />
                        </SmallSection>
                        <SmallSection
                          style={{
                            width: "30%",
                            height: "350px",
                            background: "#D9D9D9",
                            padding: "10px",
                          }}
                        >
                          <LineChart
                            height={300}
                            data={[
                              {
                                key: "lr(e-06)",
                                data: modelLr,
                              },
                            ]}
                            xAxis={
                              <LinearXAxis
                                type={"value"}
                                tickSeries={
                                  <LinearXAxisTickSeries
                                    label={
                                      <LinearXAxisTickLabel
                                        align="center"
                                        padding={10}
                                      />
                                    }
                                  />
                                }
                              />
                            }
                            series={
                              <LineSeries
                                type={"grouped"}
                                symbols={<PointSeries show={true} />}
                                line={<Line strokeWidth={1} />}
                                colorScheme={["#5495D1"]}
                              />
                            }
                            gridlines={
                              <GridlineSeries
                                line={<Gridline direction={"y"} />}
                              />
                            }
                          />
                        </SmallSection>
                        <SmallSection
                          style={{
                            width: "30%",
                            height: "350px",
                            background: "#D9D9D9",
                            padding: "10px",
                          }}
                        >
                          <LineChart
                            height={300}
                            data={[
                              {
                                key: "total_loss",
                                data: modelLoss,
                              },
                            ]}
                            xAxis={
                              <LinearXAxis
                                type={"value"}
                                tickSeries={
                                  <LinearXAxisTickSeries
                                    label={
                                      <LinearXAxisTickLabel
                                        align="center"
                                        padding={10}
                                      />
                                    }
                                  />
                                }
                              />
                            }
                            series={
                              <LineSeries
                                type={"grouped"}
                                symbols={<PointSeries show={true} />}
                                line={<Line strokeWidth={1} />}
                                colorScheme={["#f10c08"]}
                              />
                            }
                            gridlines={
                              <GridlineSeries
                                line={<Gridline direction={"y"} />}
                              />
                            }
                          />
                        </SmallSection>
                      </Section>
                    </Section>
                  )}
                  {/* //! 프로젝트 => 모델로 수정 */}
                  <MainBottomDiv>
                    <CreateButton
                      onClick={onOpenExportModel}
                      disabled={!loggedInUser.isAdmin || pUpdateLoading}
                      style={{
                        cursor: loggedInUser.isAdmin
                          ? "pointer"
                          : "not-allowed",
                        backgroundColor: loggedInUser.isAdmin
                          ? "#3480e3"
                          : "#E3E8E9",
                      }}
                    >
                      {pUpdateLoading ? <LoaderText /> : "export"}
                      <Modal
                        isOpen={openExportModel}
                        onClose={onCancelExportModel}
                        size={"5xl"}
                        isCentered
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: 50,
                              paddingTop: 10,
                              paddingBottom: 10,
                              backgroundColor: "#D2E2F8",
                              justifyContent: "center",
                              color: "#243654",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            모델 내보내기
                          </ModalHeader>
                          <ModalCloseButton style={{ marginTop: -3 }} />
                          <ModalBody
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              padding: "30px",
                              flexDirection: "column",
                            }}
                          >
                            <Section
                              style={{ justifyContent: "space-between" }}
                            >
                              <Button
                                style={{
                                  width: "22%",
                                  height: "60px",
                                  backgroundColor:
                                    selectedExportModelType === "pytorch"
                                      ? "#3580E3"
                                      : "#AECCF4",
                                  borderRadius: "9px",
                                  marginRight: 0,
                                  cursor: mExportLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                onClick={() =>
                                  mExportLoading
                                    ? null
                                    : setExportModelType("pytorch")
                                }
                              >
                                <Icon src={logoPytorch} />
                              </Button>
                              <Button
                                style={{
                                  width: "22%",
                                  height: "60px",
                                  backgroundColor:
                                    selectedExportModelType === "onnx"
                                      ? "#3580E3"
                                      : "#AECCF4",
                                  borderRadius: "9px",
                                  marginRight: 0,
                                  cursor: mExportLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                onClick={() =>
                                  mExportLoading
                                    ? null
                                    : setExportModelType("onnx")
                                }
                              >
                                <Icon src={logoOnnx} />
                              </Button>
                              <Button
                                style={{
                                  position: "relative",
                                  width: "22%",
                                  height: "60px",
                                  backgroundColor:
                                    selectedExportModelType === "tensorflow"
                                      ? "#3580E3"
                                      : "#AECCF4",
                                  borderRadius: "9px",
                                  marginRight: 0,
                                  cursor: mExportLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                onClick={() =>
                                  mExportLoading
                                    ? null
                                    : setExportModelType("tensorflow")
                                }
                              >
                                <Icon src={logoTensorflow} />
                                <div
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "#ccccccad",
                                    borderRadius: "9px",
                                  }}
                                />
                              </Button>
                              <Button
                                style={{
                                  position: "relative",
                                  width: "22%",
                                  height: "60px",
                                  backgroundColor:
                                    selectedExportModelType === "keras"
                                      ? "#3580E3"
                                      : "#AECCF4",
                                  borderRadius: "9px",
                                  marginRight: 0,
                                  cursor: mExportLoading
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                onClick={() =>
                                  mExportLoading
                                    ? null
                                    : setExportModelType("keras")
                                }
                              >
                                <Icon src={logoKeras} />
                                <div
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: "#ccccccad",
                                    borderRadius: "9px",
                                  }}
                                />
                              </Button>
                            </Section>
                            <Section
                              style={{
                                marginTop: "30px",
                                justifyContent: "space-between",
                              }}
                            >
                              {mExportLoading ? (
                                <Text>{"Export ..."}</Text>
                              ) : (
                                <>
                                  <ModelSection
                                    style={{
                                      flexDirection: "column",
                                      width: "100%",
                                      height: "400px",
                                      padding: "10px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {selectedModelTypeInfo.length > 0 &&
                                      selectedModelTypeInfo.map(
                                        (type, index) => {
                                          return (
                                            <SmallSection
                                              key={index}
                                              style={{
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                width: "100%",
                                                padding:
                                                  index === 0
                                                    ? "0 10px 10px 10px"
                                                    : "10px",
                                                marginBottom:
                                                  index <
                                                  selectedModelTypeInfo.length -
                                                    1
                                                    ? "10px"
                                                    : 0,
                                              }}
                                            >
                                              <ChakraText
                                                width={"100%"}
                                                height={"100%"}
                                                color={"#3580E3"}
                                                fontSize={"18px"}
                                                fontWeight={700}
                                                marginBottom={"10px"}
                                                whiteSpace={"pre-line"}
                                              >
                                                {type.key}
                                              </ChakraText>
                                              <ChakraText
                                                width={"100%"}
                                                height={"100%"}
                                                background={
                                                  index === 0
                                                    ? "white"
                                                    : "#D9D9D9"
                                                }
                                                border={
                                                  index === 0
                                                    ? "none"
                                                    : "2px double #AECCF4"
                                                }
                                                borderRadius={"9px"}
                                                fontSize={"16px"}
                                                fontWeight={
                                                  index === 0 ? 600 : 700
                                                }
                                                padding={
                                                  index === 0 ? 0 : "15px"
                                                }
                                                whiteSpace={"pre-line"}
                                              >
                                                {type.value}
                                              </ChakraText>
                                            </SmallSection>
                                          );
                                        }
                                      )}
                                  </ModelSection>
                                </>
                              )}
                            </Section>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              style={{
                                width: "15%",
                                height: "45px",
                                backgroundColor: "#3580E3",
                                border: "1px solid #3580E3",
                                fontSize: 12,
                                color: "#fff",
                                marginRight: 0,
                                cursor: mExportLoading
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                              onClick={
                                mExportLoading
                                  ? null
                                  : selectedExportModelType === "tensorflow" ||
                                    selectedExportModelType === "keras"
                                  ? null
                                  : exportModel
                              }
                            >
                              {mExportLoading ? "Export ..." : "내보내기"}
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </CreateButton>
                    <CancelButton
                      onClick={() => {} /* handleShowDeleteAlert */}
                      disabled={!loggedInUser.isAdmin}
                      style={{
                        display: "none",
                        cursor: loggedInUser.isAdmin
                          ? "pointer"
                          : "not-allowed",
                        backgroundColor: loggedInUser.isAdmin
                          ? "#fe9f46"
                          : "#E3E8E9",
                      }}
                    >
                      삭제
                      <AlertDialog
                        isOpen={showDeletePAlert}
                        onClose={handleCancelDeleteAlert}
                        isCentered
                        leastDestructiveRef={cancelRef}
                      >
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader>모델 삭제</AlertDialogHeader>
                            <AlertDialogBody>
                              선택한 모델을 삭제하시겠습니까? 이 작업은 되돌릴
                              수 없습니다.
                            </AlertDialogBody>
                            <AlertDialogFooter>
                              <ChakraBtn
                                ref={cancelRef}
                                onClick={() => {} /* handleCancelDeleteAlert */}
                                style={{ marginRight: 7 }}
                              >
                                취소
                              </ChakraBtn>
                              <ChakraBtn
                                colorScheme="red"
                                onClick={() => {} /* doDeleteProject */}
                              >
                                {pDeleteLoading ? <LoaderText /> : "삭제"}
                              </ChakraBtn>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogOverlay>
                      </AlertDialog>
                    </CancelButton>
                  </MainBottomDiv>
                </>
              )}
            </MainCenter>
          </MainWrapper>
        </Container>
      </ChakraProvider>
    );
  }
  return <Loader />;
};

export default ProjectDetailPresenter;
