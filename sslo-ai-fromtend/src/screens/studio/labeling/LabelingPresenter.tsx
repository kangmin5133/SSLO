import React, { ChangeEvent, MouseEventHandler } from "react";
import styled from "styled-components";
import "react-image-crop/dist/ReactCrop.css";
import iconHome from "../../../assets/images/studio/header/icon-home-gray.svg";
import iconLink from "../../../assets/images/studio/header/icon-link-gray.svg";
import iconSave from "../../../assets/images/studio/header/icon-save-gray.svg";
import iconKey from "../../../assets/images/studio/header/icon-key-dark.svg";
import iconFullScreen from "../../../assets/images/studio/header/icon-fullscreen-gray.svg";
import iconLogout from "../../../assets/images/studio/header/icon-logout-gray.svg";
import iconPrev from "../../../assets/images/studio/header/icon-prev-gray.svg";
import iconNext from "../../../assets/images/studio/header/icon-next-gray.svg";
import iconUndo from "../../../assets/images/studio/header/icon-undo-gray.svg";
import iconDo from "../../../assets/images/studio/header/icon-do-gray.svg";
import iconClose from "../../../assets/images/studio/icon/icon-close.svg";
import iconCloseStudio from "../../../assets/images/studio/icon/icon-close-studio.svg"
import iconZoomDec from "../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../assets/images/studio/header/icon-zoom-inc.svg";
import iconToolMove from "../../../assets/images/studio/icon/icon-move-dark.svg";
import iconToolMoveSelected from "../../../assets/images/studio/icon/icon-move-selected.svg";
import iconToolTag from "../../../assets/images/studio/icon/icon-tag-dark.svg";
import iconToolTagSelected from "../../../assets/images/studio/icon/icon-tag-selected.svg";
import iconToolClass from "../../../assets/images/studio/icon/icon-class-dark.svg";
import iconToolClassSelected from "../../../assets/images/studio/icon/icon-class-selected.svg";
import iconToolReset from "../../../assets/images/studio/icon/icon-reset-dark.svg";
import iconToolResetSelected from "../../../assets/images/studio/icon/icon-reset-selected.svg";
import iconToolHD from "../../../assets/images/studio/icon/icon-HD-dark.svg";
import iconToolHDworking from "../../../assets/images/studio/icon/icon-HD-working.svg";
import iconToolHDlearning from "../../../assets/images/studio/icon/icon-HD-learning.svg";
import iconToolHDActive from "../../../assets/images/studio/icon/icon-HD-active.svg";
import iconToolOD from "../../../assets/images/studio/icon/icon-OD-dark.svg";
import iconToolODActive from "../../../assets/images/studio/icon/icon-OD-active.svg";
import iconToolODSelected from "../../../assets/images/studio/icon/icon-OD-selected.svg";
import iconToolIS from "../../../assets/images/studio/icon/icon-IS-dark.svg";
import iconToolISActive from "../../../assets/images/studio/icon/icon-IS-active.svg";
import iconToolISSelected from "../../../assets/images/studio/icon/icon-IS-selected.svg";
import iconToolSES from "../../../assets/images/studio/icon/icon-SES-dark.svg";
import iconToolSESActive from "../../../assets/images/studio/icon/icon-SES-active.svg";
import iconToolSESSelected from "../../../assets/images/studio/icon/icon-SES-selected.svg";
import iconToolSmartpen from "../../../assets/images/studio/icon/icon-smartpen-dark.svg";
import iconToolSmartpenSelected from "../../../assets/images/studio/icon/icon-smartpen-selected.svg";
import iconToolAutopoint from "../../../assets/images/studio/icon/icon-autopoint-dark.svg";
import iconToolAutopointSelected from "../../../assets/images/studio/icon/icon-autopoint-selected.svg";
import iconToolBoxing from "../../../assets/images/studio/icon/icon-boxing-dark.svg";
import iconToolBoxingSelected from "../../../assets/images/studio/icon/icon-boxing-selected.svg";
import iconToolPolyline from "../../../assets/images/studio/icon/icon-polyline-dark.svg";
import iconToolPolylineSelected from "../../../assets/images/studio/icon/icon-polyline-selected.svg";
import iconToolPolygon from "../../../assets/images/studio/icon/icon-polygon-dark.svg";
import iconToolPolygonSelected from "../../../assets/images/studio/icon/icon-polygon-selected.svg";
import iconToolPoint from "../../../assets/images/studio/icon/icon-point-dark.svg";
import iconToolPointSelected from "../../../assets/images/studio/icon/icon-point-selected.svg";
import iconToolBrush from "../../../assets/images/studio/icon/icon-brush-group-dark.svg";
import iconToolBrushSelected from "../../../assets/images/studio/icon/icon-brush-group-selected.svg";
import iconTool3Dcube from "../../../assets/images/studio/icon/icon-3dcube-dark.svg";
import iconTool3DcubeSelected from "../../../assets/images/studio/icon/icon-3dcube-selected.svg";
import iconToolSegment from "../../../assets/images/studio/icon/icon-segment-dark.svg";
import iconToolSegmentSelected from "../../../assets/images/studio/icon/icon-segment-selected.svg";
import iconToolKeypoint from "../../../assets/images/studio/icon/icon-keypoint-dark.svg";
import iconToolKeypointSelected from "../../../assets/images/studio/icon/icon-keypoint-selected.svg";

import iconSubToolPolygonNew from "../../../assets/images/studio/icon/subTools/icon-tool-polygon-pen-dark.svg";
import iconSubToolPolygonNewSelected from "../../../assets/images/studio/icon/subTools/icon-tool-polygon-pen-active.svg";
import iconSubToolPolygonAdd from "../../../assets/images/studio/icon/subTools/icon-tool-polygon-plus-dark.svg";
import iconSubToolPolygonAddSelected from "../../../assets/images/studio/icon/subTools/icon-tool-polygon-plus-active.svg";
import iconSubToolPolygonDel from "../../../assets/images/studio/icon/subTools/icon-tool-polygon-minus-dark.svg";
import iconSubToolPolygonDelSelected from "../../../assets/images/studio/icon/subTools/icon-tool-polygon-minus-active.svg";

import iconSubToolBrushCircle from "../../../assets/images/studio/icon/subTools/icon-tool-brush-circle-dark.svg";
import iconSubToolBrushCircleSelected from "../../../assets/images/studio/icon/subTools/icon-tool-brush-circle-active.svg";
import iconSubToolBrushSquare from "../../../assets/images/studio/icon/subTools/icon-tool-brush-square-dark.svg";
import iconSubToolBrushSquareSelected from "../../../assets/images/studio/icon/subTools/icon-tool-brush-square-active.svg";

import iconSubToolAutopointBBox from "../../../assets/images/studio/icon/subTools/icon-tool-autopoint-bbox-dark.svg";
import iconSubToolAutopointBBoxSelected from "../../../assets/images/studio/icon/subTools/icon-tool-autopoint-bbox-active.svg";
import iconSubToolAutopointPolygon from "../../../assets/images/studio/icon/subTools/icon-tool-autopoint-polygon-dark.svg";
import iconSubToolAutopointPolygonSelected from "../../../assets/images/studio/icon/subTools/icon-tool-autopoint-polygon-active.svg";

import iconSubToolKeypointPerson from "../../../assets/images/studio/icon/subTools/icon-tool-keypoint-person-dark.svg";
import iconSubToolKeypointPersonSelected from "../../../assets/images/studio/icon/subTools/icon-tool-keypoint-person-active.svg";
import iconSubToolKeypointAnimal from "../../../assets/images/studio/icon/subTools/icon-tool-keypoint-animal-dark.svg";
import iconSubToolKeypointAnimalSelected from "../../../assets/images/studio/icon/subTools/icon-tool-keypoint-animal-active.svg";
import iconSubToolKeypointHand from "../../../assets/images/studio/icon/subTools/icon-tool-keypoint-hand-dark.svg";
import iconSubToolKeypointHandSelected from "../../../assets/images/studio/icon/subTools/icon-tool-keypoint-hand-active.svg";

import iconArrowTop from "../../../assets/images/studio/icon/icon-scroll-up-dark.svg";
import iconArrowBottom from "../../../assets/images/studio/icon/icon-scroll-down-dark.svg";
import iconArrowLeft from "../../../assets/images/studio/icon/icon-scroll-left-dark.svg";
import iconArrowRight from "../../../assets/images/studio/icon/icon-scroll-right-dark.svg";
import iconLock from "../../../assets/images/studio/icon/instanceTools/icon-lock-active.svg";
import iconUnLock from "../../../assets/images/studio/icon/instanceTools/icon-unlock-dark.svg";
import iconVisible from "../../../assets/images/studio/icon/instanceTools/icon-visible-dark.svg";
import iconInvisible from "../../../assets/images/studio/icon/instanceTools/icon-invisible-active.svg";
import iconDelete from "../../../assets/images/studio/icon/instanceTools/icon-delete-dark.svg";
import iconBoxingOn from "../../../assets/images/studio/icon/icon-boxing02.svg";
import iconBoxingOff from "../../../assets/images/studio/icon/icon-boxing03.svg";
import arrowUp from "../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../assets/images/studio/icon/icon-down.svg";
import rejectBtn from "../../../assets/images/studio/reject-text.svg";
import tooltipImgOD from "../../../assets/images/studio/tooltip-img-OD.jpg";
import tooltipImgIS from "../../../assets/images/studio/tooltip-img-IS.jpg";
import tooltipImgSES from "../../../assets/images/studio/tooltip-img-SES.jpg";
import { Link } from "react-router-dom";
import {
  Button,
  ChakraProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Spinner,
  Tooltip,
  Kbd,
  Stack,
  Text,
  Image,
  Progress,
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Heading,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  ListItem,
  UnorderedList,
  extendTheme,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import SmallTask from "../../../components/studio/SmallTask";
import Modal from "../../../components/studio/Modal";
import AlertModal from "../../../components/studio/AlertModal";
import { IProjectAnnotation, IProjectInfo } from "../../../api/projectApi";
import { IUser } from "../../../api/userApi";
import { ITask } from "../../../api/taskApi";
import { ICheckAutoLabeling } from "../../../api/labelingApi";
import { IUserState } from "../../../redux/user/users";
import { Helmet } from "react-helmet-async";
import { fabric } from "fabric";
import { ICanvasHistory } from "./LabelingContainer";

interface ILabelingPresenter {
  currentUser: IUserState;
  currentDataURL: string | null;
  projectInfo: IProjectInfo | null | undefined;
  isFileSelectorOpen: boolean;
  toggleFileSelector: () => void;
  tasks: ITask[];
  labelingAssignee: IUser | undefined;
  projectUser: IUser[];
  _setLabelingAssignee: (
    user: IUser
  ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  examinee: IUser | undefined;
  _setExaminee: (
    user: IUser
  ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  isFileInfoOpen: boolean;
  isInstanceOpen: boolean;
  isHistoryOpen: boolean;
  toggleFileInfoOpen: () => void;
  toggleInstanceOpen: () => void;
  toggleHistoryOpen: () => void;
  workStatutes: "전체" | "미작업" | "완료" | "진행중" | "반려";
  _setWorkStatutes: (
    status: "전체" | "미작업" | "완료" | "진행중" | "반려"
  ) => void;
  selectedTask: ITask | null;
  _setSelectedTask: (task: ITask) => void;
  loading: boolean;
  isFirst: boolean;
  handlePrevTask: (
    taskId: number
  ) => MouseEventHandler<HTMLImageElement> | undefined;
  handleNextTask: (
    taskId: number
  ) => MouseEventHandler<HTMLImageElement> | undefined;
  _setDownload: (file: string) => void;
  onCancelDownload: () => void;
  onSubmitDownload: () => void;
  onCancelMove: () => void;
  onCancelClass: () => void;
  onCancelReset: () => void;
  onSubmitReset: () => void;
  onCancelSmartpen: () => void;
  onCancelAutopoint: () => void;
  onCancelBrush: () => void;
  onCancel3Dcube: () => void;
  onCancelKeypoint: () => void;
  resizingVal: string | null;
  handleResizing: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOriginalImage: () => void;
  handleToggleFullScreen: () => void;
  handleUnDo: () => void;
  handleRedo: () => void;
  saveStatus: (status: number) => Promise<void>;
  goBack: () => void;

  handleCompleted: () => Promise<void>
  isOpenReject: boolean;
  handleOpenReject: () => void;
  handleCancelReject: () => void;
  onSubmitReject: () => void;
  handleSetRejectText: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleShowRejctHelp: () => Promise<void>;
  rejectComment: string | undefined;
  showRejectComment: boolean;
  handleCancelRejectComment: () => void;

  checkIsDownload: () => void;
  checkIsMove: () => void;
  checkIsTag: () => void;
  checkIsClass: () => void;
  checkIsReset: () => void;
  checkIsHD: () => void;
  checkIsOD: () => void;
  checkIsIS: () => void;
  checkIsSES: () => void;
  checkIsSmartpen: () => void;
  checkIsAutopoint: () => void;
  checkIsBoxing: () => void;
  checkIsPolyline: () => void;
  checkIsPolygon: () => void;
  checkIsPoint: () => void;
  checkIsBrush: () => void;
  checkIs3Dcube: () => void;
  checkIsSegment: () => void;
  checkIsKeypoint: () => void;
  setIsClass: (index: number) => void;
  isLock: (id: number, index: number) => void;
  isVisible: (id: number, index: number) => void;
  isDelete: (id: number) => void;
  setInstanceIcon: (tool: string) => string;
  setAnnotationClass: (item: any) => void;
  setAnnotationAttr: (attr: any, attrId: number, item: any) => void;
  isDownload: string;
  selectDownload: string;
  isDownloadOn: boolean;
  isMoveOn: boolean;
  isTagOn: boolean;
  isClassOn: boolean;
  isResetOn: boolean;
  isHDOn: boolean;
  isODOn: boolean;
  isISOn: boolean;
  isSESOn: boolean;
  isSmartpenOn: boolean;
  isAutopointOn: boolean;
  isBoxingOn: boolean;
  isPolylineOn: boolean;
  isPolygonOn: boolean;
  isPointOn: boolean;
  isBrushOn: boolean;
  is3DcubeOn: boolean;
  isSegmentOn: boolean;
  isKeypointOn: boolean;
  canvas: fabric.Canvas | undefined;
  labelWidth: number; 
  labelHeight: number;  
  labelDiag: string;  
  labelCoordX: number;  
  labelCoordY: number; 
  labelPerWidth: string; 
  labelPerHeight: string; 
  labelPerDiag: string;
  ObjectListItem: any[];
  objectType: string;
  refTools: any;
  refPicker: any;
  refTop: any;
  refBottom: any;
  refBtnLock: any;
  refBtnVisible: any;
  refBtnDelete: any;
  onMoveToToolsTop: () => void;
  onMoveToToolsEnd: () => void;
  onMoveToToolsLeft: () => void;
  onMoveToToolsRight: () => void;
  isAutoLabeling: boolean;
  isDeleteInstance: boolean;
  checkIsDeleteInstance: () => void;
  onCancelDelete: () => void;
  selectedObjectId: number;
  selectedObject: fabric.Object;
  isHDLabelingOn: boolean;
  projectCategories: IProjectAnnotation[];
  instanceClass: string;
  instanceAttrList: any[];
  instance: IProjectAnnotation;
  currentObjectItem: any[];
  setKeyOnOff: () => void;
  isKeyOnOff: boolean;
  isCrossOnOff: boolean;
  countListOD: ICheckAutoLabeling[];
  countListISES: ICheckAutoLabeling[];
  isLearningOD: boolean;
  isLearningISES: boolean;
  countOD: number;
  countISES: number;
  isActiveOD: boolean;
  isActiveISES: boolean;
  isPopupOD: boolean;
  isPopupIS: boolean;
  isPopupSES: boolean;
  closePopupOD: () => void;
  closePopupIS: () => void;
  closePopupSES: () => void;
  toggleCountClassOpen: () => void;
  isCountClassOpen: boolean;
  iconCheckOD: string;
  iconCheckIS: string;
  iconCheckSES: string;

  setIsBrush: (tool: string) => void;
  isBrushCircleOn: boolean;
  isBrushSquareOn: boolean;
  isBrushOpen: boolean;
  openIsBrush: () => void;
  closeIsBrush: () => void;

  setIsAutopoint: (tool: string) => void;
  isAutopointBBoxOn: boolean;
  isAutopointPolygonOn: boolean;
  isAutopointOpen: boolean;
  openIsAutopoint: () => void;
  closeIsAutopoint: () => void;

  setIsKeypoint: (tool: string) => void;
  isKeypointPersonOn: boolean;
  isKeypointAnimalOn: boolean;
  isKeypointHandOn: boolean;
  isKeypointOpen: boolean;
  openIsKeypoint: () => void;
  closeIsKeypoint: () => void;
  alertKeypointOpen: boolean;
  openAlertKeypoint: () => void;
  canvasHistory: ICanvasHistory[];
  selectHistory: (index: number) => void;
  historyId: number;
  onChangeAttrNum: (e: any, max:number) => void;
  onChangeAttrTxt: (e: any, max: number) => void;
  handleSetAttrNum: (attr: any, attrId: number, min: number, max: number) => void;
  handleSetAttrTxt: (attr: any, attrId: number, min: number, max: number) => void;
  attrNumList: number[];
  attrTxtList: string[];
  valAttrNum: number;
  valAttrTxt: string;
  handleRemoveAttrNum: (attr: any, attrId: number, item: any) => void;
  handleRemoveAttrTxt: (attr: any, attrId: number, item: any) => void;
  sliderValueSmartpen: number;
  setSliderValueSmartpen: React.Dispatch<React.SetStateAction<number>>;
  showTooltipSmartpen: boolean;
  setShowTooltipSmartpen: React.Dispatch<React.SetStateAction<boolean>>;
  sliderValuePoint: number;
  setSliderValuePoint: React.Dispatch<React.SetStateAction<number>>;
  showTooltipPoint: boolean;
  setShowTooltipPoint: React.Dispatch<React.SetStateAction<boolean>>;
  sliderValueBrush: number;
  setSliderValueBrush: React.Dispatch<React.SetStateAction<number>>;
  showTooltipBrush: boolean;
  setShowTooltipBrush: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPolygon: (tool: string) => void;
  isPolygonNewOn: boolean;
  isPolygonAddOn: boolean;
  isPolygonDelOn: boolean;
}

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      // ...
      900: "#1a202c",
    },
    ssloGreen: {
      100: "#2EA090",
      500: "#2EA090",
    },
    ssloGrey: {
      100: "#5F6164",
      500: "#5F6164",
    }
  },
  components: {
    Link: {
      baseStyle: {
          _focus: {
              boxShadow: 'none'
          }
      }
    },
    Card: {
      baseStyle: {
        _focus: {
            boxShadow: 'none'
        }
      }
    },
    PopoverArrow: {
      baseStyle: {
        _focus: {
            boxShadow: 'none'
        }
      }
    },
  }
});
  
const StudioWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #c0c3c7;
  font-family: NanumSquare;
  overflow: hidden;
`;
const StudioHeader = styled.div`
  position: relative;
  height: 70px;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #e2e4e7;
  display: flex;
  z-index: 5;
`;
const HeaderLeft = styled.div`
  width: 20%;
  display: flex;
  height: 100%;
`;
const NavLink = styled(Link)`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #c0c3c7;
`;
const NavButton = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #c0c3c7;
`;
const Icon = styled.img``;
const ToolsIcon = styled.img<{isSelect: boolean}>`
  border-radius: 7px;
  background: ${(props) =>
    props.isSelect ? "#B5B5B5" : "transparent"};
`;
const HeaderCenter = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
`;
const HeaderCenterLeft = styled.div`
  width: 20%;
  height: 100%;
`;
const HeaderCenterRight = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
`;
const HeaderCenterTextContainer = styled.div`
  width: 49%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const HeaderCenterText = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  color: #5f6164;
  max-width: 80%;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const HeaderCenterImageTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  margin-top: 10px;
  line-height: 20px;
  color: #5f6164;
  max-width: 80%;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  width: 25%;
`;
const ProgressTextBox = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BoldText = styled.span`
  font-size: 16px;
  line-height: 18px;
  font-weight: 800;
  color: #5f6164;
`;
const Divider = styled.div`
  width: 0;
  height: 16px;
  border: 1px solid #a4a8ad;
`;
const Ball = styled.span`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  margin-right: 10px;
`;
const NormalText = styled.span`
  font-size: 16px;
  line-height: 18px;
  font-weight: 700;
  color: #5f6164;
`;
const HeaderRight = styled.div`
  height: 100%;
  width: 20%;
  display: flex;
`;
const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 20%;
  border-left: 1px solid #c0c3c7;
  border-right: 1px solid #c0c3c7;
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
const Main = styled.div`
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  overflow: hidden;
`;
const MainLeftWrap = styled.div`
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 5;
`;
const MainLeft = styled.div`
  &::-webkit-scrollbar {
    appearance: none;
    display: none;
  }
  width: 100px;
  height: 100%;
  background-color: #e2e4e7;
  display: flex;
  padding: 15px;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;
const LeftListArrow = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; 
  padding-top: 3px;
  padding-bottom: 3px;
  background: #A4A8AD;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 5;
`;
const LeftItemContainer = styled.div`
  width: 70px;
  height: 59px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const TooltipItemContainer = styled.div`
  width: 70px;
  height: 59px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const ToolSubWrapper = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const LeftItemText = styled.span`
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #5f6164;
`;
const UnderBar = styled.span`
  width: 100%;
  height: 0px;
  margin: 10px 0;
  border: 1px solid #A4A8AD;
  transform: rotate(-180deg);
  flex: none;
  order: 0;
  align-self: stretch;

  flex-grow: 0;
`;
const MainCenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-width: 900px;
`;

const HotKeyPopup = styled.div`
  position: absolute; 
  top: 100px; 
  left: 130px; 
  width: 350px; 
  padding: 20px;
  background: #E2E4E7; 
  border: 1px solid #5F6164;
  border-radius: 5px; 
  color: #5F6164;
`;
const HotKeyClose = styled.button`
  position: absolute; 
  right: 15px; 
  top: 10px; 
  cursor: pointer;
`;
const HotKeyWrapper = styled.ul`
  width: 100%;
`;
const HotKeyHeader = styled.li`
  font-size: 18px;
  font-weight: 800;
  line-height: 16px;
  margin-bottom: 30px;
`;
const HotKeyContent = styled.li`
  display: flex;
  width: 100%;
  flex-direction: column;
`;
const HotKeyContentRow = styled.li`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
`;
const HotKeyContentLeft = styled.div`
  display: flex;
  width: 130px;
  justify-content: right;
  margin-right: 20px;
`;
const HotKeyContentRight = styled.div`
  display: flex;
  justify-content: left;
  flex-grow: 1;
`;
const HotKeyBoldText = styled.span`
  font-size: 15px;
  font-weight: 600;
  line-height: 16px;
`;
const HotKeyNormalText = styled.span`
  font-size: 15px;
  font-weight: 400;
  line-height: 16px;
  align-items: center;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const PopupClose = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
`;

const AnnotationPopup = styled.div`
  position: absolute; 
  top: 100px; 
  left: 130px; 
  width: 280px; 
  padding: 20px;
  background: #E2E4E7; 
  border: 1px solid #5F6164;
  border-radius: 5px; 
  color: #5F6164;
`;
const AnnotationClose = styled.button`
  position: absolute; 
  right: 15px; 
  top: 10px; 
  cursor: pointer;
`;
const AnnotationClassWrapper = styled.ul`
  border-bottom: 1px solid #CFD1D4;
  margin-bottom: 15px;
  padding-bottom: 10px;
`;
const AnnotationClassHeader = styled.li`
  margin-bottom: 15px;
`;
const AnnotationClassContent = styled.li`
  border-bottom: 1px solid #CFD1D4; 
`;
const AnnotationBottom = styled.div`
&::-webkit-scrollbar {
  width: 10px;
  display: none;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 10px;
}
:last-child {
  border-bottom: 0px;
}
  max-height: 700px;
  overflow-y: scroll;
`;
const AnnotationAttrWrapper = styled.ul`
  padding-bottom: 10px;
  border-bottom: 1px solid #CFD1D4;
`;
const AnnotationAttrHeader = styled.li`
  margin-bottom: 15px;
`;
const AnnotationAttrContent = styled.li`
&::-webkit-scrollbar {
  width: 5px;
  
}
&::-webkit-scrollbar-thumb {
  background: #C0C3C7;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 5px;
}
  overflow-x: hidden;
  overflow-y: scroll;
  border-bottom: 1px solid #CFD1D4; 
`;
const MainCenterUpper = styled.div<{ isFileSelectorOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 900px;
  width: 100%;
  overflow: hidden;
  height: ${(props) =>
    props.isFileSelectorOpen ? "calc(100% - 210px)" : "calc(100% - 50px)"};
`;
const MainImage = styled.img<{
  isFileSelectorOpen: boolean;
  resizingVal?: string | null;
}>`
  width: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
        : "810px"
      : props.resizingVal
      ? `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
      : "900px"};
  height: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
        : "540px"
      : props.resizingVal
      ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
      : "600px"};
`;
const MainCenterBottom = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  padding: 0 40px;
  background-color: #e2e4e7;
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #c0c3c7;
  display: flex;
  align-items: center;
  z-index: 3;
`;
const ArrowDropDownBox = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: 24px;
  cursor: pointer;
`;
const ArrowDropDownText = styled.span`
  font-size: 16px;
  line-height: 18px;
  font-weight: 800;
  color: #5f6164;
`;
const MainCenterImagePickerWrapper = styled.div`
  display: flex;
  height: 160px;
  z-index: 3;
`;
const MainCenterImagePicker = styled.div`
&::-webkit-scrollbar {
  height: 10px;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  height: 10px;
}
  display: flex;
  width: 100%;
  height: 160px;
  padding: 0 20px 10px;
  background-color: #e2e4e7;
  border-left: 1px solid #c0c3c7;
  overflow-x: scroll;
  z-index: 2;
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
const PickedImageContainer = styled.div`
  height: 100%;
  width: 180px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
`;
const NonPickedImageWrapper = styled.div`
  height: 100%;
  width: 180px;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
  margin-right: 7px;
`;
const ImageWrapper = styled.div`
`;
const ImagePickerListContainer = styled.div`
  display: flex;
  align-items: center;
`;
const FileListArrow = styled.div`
  width: 20px;
  display: none;
  align-items: center;
  justify-content: center;
  padding-left: 3px;
  padding-right: 3px;
  background: #A4A8AD;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 5;
`;
const MainRight = styled.div`
  height: 100%;
  width: 250px;
  background-color: #e2e4e7;
  z-index: 5;
`;
const MainRightUpper = styled.div`
  width: 100%;
  height: calc(100% - 50px);
`;
const DropBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  border-bottom: 2px solid #c0c3c7;
`;
const MainRightContainer = styled.div`
&::-webkit-scrollbar {
  width: 10px;
  display: none;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 10px;
}
:focus {
  background: #5f6164;
}
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100% - 142px);
  overflow-y: auto;
`;
const VerticalDivider = styled.div`
  height: 20px;
`;
const DropBoxTextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;
const DropBoxBoldText = styled.span`
  font-size: 14px;
  font-weight: 800;
  line-height: 16px;
`;
const DropBoxNormalText = styled.span`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  align-items: center;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const DropBoxContentWrapper = styled.div`
  width: 100%;
  border-top: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxContentTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const DropBoxContentDescWrapper = styled.div`
  padding: 15px 20px 10px;
  display: flex;
`;
const DropBoxInstanceDescWrapper = styled.div`
  padding: 15px 20px 10px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxContentDescLeft = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`;
const DropBoxContentDescRight = styled.div`
  display: flex;
  flex-direction: column;
`;
const InstanceBoldText = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 14px;
`;
const InstanceNormalText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  align-items: center;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const DropBoxInstanceDescRow = styled.div`
  display: flex;
`;
const DropBoxInstanceDescLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
`;
const DropBoxInstanceDescRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`;
const DropBoxInstanceWrapper = styled.div`
&::-webkit-scrollbar {
  width: 10px;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 10px;
}
:focus {
  background: #5f6164;
}
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxInstanceItem = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;
const MainRightBottom = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
`;
const FinishButton = styled.button`
  width: 100%;
  height: 100%;
  background-color: #3580e3;
  color: white;
  font-size: 18px;
  font-weight: 800;
  line-height: 20px;
`;
const RejectButton = styled(FinishButton)`
  background-color: #f28f40;
`;
const RoundedButton = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 20px;
  justify-content: center;
  border: 1px solid #5f6164;
  width: 100px;
  height: 36px;
  transition: color 0.3s linear;
  transition: background-color 0.3s linear;
  color: ${(props) => (props.isSelected ? "#FFFFFF" : "#5F6164")};
  background-color: ${(props) => (props.isSelected ? "#414244" : "none")};
`;
const Input = styled.input`
  text-align: center;
  width: 80%;
  padding: 8px 8px;
  :focus {
    outline: none;
  }
  border-radius: 10px;
`;
const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  border-radius: 10px;
  padding: 5px 10px;
  :focus {
    outline: none;
  }
`;
const Canvas = styled.canvas<{
  isFileSelectorOpen: boolean;
  resizingVal?: string | null;
}>`
  width: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
        : "810px"
      : props.resizingVal
      ? `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
      : "900px"};
  height: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
        : "540px"
      : props.resizingVal
      ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
      : "600px"};
`;
const TopCanvas = styled.canvas<{
  isFileSelectorOpen: boolean;
  resizingVal?: string | null;
}>`
  position: absolute;
  top: 0;
  left: 0;
  display: none;
`;
const Left = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  layer-background-color:#ffffff;
  background-color:#ffffff;
  z-index: 1;
`;
const Top = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  layer-background-color:#ffffff;
  background-color:#ffffff;
  z-index: 1;
`;
const Right = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  layer-background-color:#ffffff;
  background-color:#ffffff;
  z-index: 1;
`;
const Down = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  layer-background-color:#ffffff;
  background-color:#ffffff;
  z-index: 1;
`;

const PopupAutoLabeling = (props) => {
  const tooltipTextOD = "Object Detection";
  const tooltipTextIS = "Instance Segmentation";
  const tooltipTextSES = "Semantic Segmentation";
  const tooltipContentOD = "OD Assistant란 원클릭만으로 특정 이미지에서 객체를 찾고 해당 경계 상자를 예측합니다.";
  const tooltipContentIS = "IS Assistant란 원클릭만으로 특정 이미지에서 객체를 찾고 해당 모양을 예측합니다";
  const tooltipContentSES = "SES Assistant란 원클릭만으로 이미지의 각 픽셀이 어떤 클래스에 속하는지 분류하고 해당 모양을 예측합니다.";

  const textHeader = props.type === 1? tooltipTextOD : props.type === 2? tooltipTextIS : tooltipTextSES;
  const imgSrc = props.type === 1? tooltipImgOD : props.type === 2? tooltipImgIS : tooltipImgSES;
  const btnClose = props.type === 1? props.closePopupOD : props.type === 2? props.closePopupIS : props.closePopupSES;
  let status = 1, textSub = "", count = 0;
  const textContent = props.type === 1? tooltipContentOD : props.type === 2? tooltipContentIS : tooltipContentSES;
  const color = (props.type === 1? props.isActiveOD : props.isActiveISES)?"blue":"green";
  const val = (props.type === 1? props.isActiveOD : props.isActiveISES)? 100 : props.type === 1? props.countOD : props.countISES;
  const list = props.type === 1? props.countListOD : props.countListISES;

  if (props.type === 1? (!props.isActiveOD && !props.isLearningOD) : (!props.isActiveISES && !props.isLearningISES)) {
    status = 1;
    textSub = (props.type === 1? "OD" : props.type === 2? "IS" : "SES") + "버튼을 활성화하려면 클래스 별로 20개 이미지에 레이블링하고 작업을 완료합니다.";
    count = props.type === 1? props.countOD : props.countISES;
  }
  else if (props.type === 1? (!props.isActiveOD && props.isLearningOD) : (!props.isActiveISES && props.isLearningISES)) {
    status = 2;
    textSub = "현재 모델 훈련 중입니다. 모델 훈련이 완료되면, " + (props.type === 1? "OD" : props.type === 2? "IS" : "SES") + " Tool 사용이 가능합니다.";
  }
  else if (props.type === 1? props.isActiveOD : props.isActiveISES) {
    status = 3;
  }

  return (
    <PopoverContent bg='#E2E4E7' color='#5F6164' style={{ border: "none", marginLeft: "50px" }}>
      <PopoverArrow bg='#E2E4E7'/>
      <Card maxW='sm' variant={"unstyled"} style={{ padding:"20px", zIndex: 5 }}>
        <CardHeader style={{ position:"relative", width: "100%", paddingBottom:"10px" }}>
          <Image
            src={imgSrc}
            borderRadius='lg'
            width={"100%"}
          />
          <PopupClose onClick={btnClose}>
            <Icon src={iconCloseStudio} />
          </PopupClose>
        </CardHeader>
        <CardBody width={"100%"} style={{marginBottom: "20px"}}>
          <Stack mt='6' spacing='3'>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Heading size='15px' style={{marginBottom: "10px"}}>
                {textHeader}
              </Heading>
              {status === 1 && (<Text>비활성화</Text>)}
              {status === 2 && (<Text color={"#F28F40"}>훈련중</Text>)}
              {status === 3 && (<Text color={"#3580E3"}>활성화</Text>)}
            </Box>
            <Text fontSize={'13px'}>
              {textContent}
            </Text>
            <Text fontSize={'13px'}>
              {textSub}
            </Text>
          </Stack>
        </CardBody>
        <CardFooter width={"100%"}>
          <Stack width={"100%"}>
            {status === 1 && (
              <Heading size='15px' style={{marginBottom: "10px"}}>
                레이블링 완료 : {count}%
              </Heading>
            )}
            {status === 2 && (
              <Heading size='15px' style={{marginBottom: "10px"}}>
                모델 훈련중
              </Heading>
            )}
            {status === 2 && (
              <Progress colorScheme={"orange"} isIndeterminate width={"100%"} />
            )}
            {status !== 2 && (
              <Progress colorScheme={color} value={val} width={"100%"} />
            )}
            {status === 1 && (
              <>
              <DropBoxContentTitle onClick={props.toggleCountClassOpen} style={{marginTop: 20, marginBottom: 10}}>
                <ArrowDropDownText>클래스</ArrowDropDownText>
                <Icon
                  src={props.isCountClassOpen ? arrowDown : arrowUp}
                  style={{ marginLeft: 17 }}
                />
              </DropBoxContentTitle>
              {props.isCountClassOpen && (
                <UnorderedList style={{ overflowY: "auto", maxHeight: "100px" }}>
                {list && list.length > 0 && list.map((item, index) => {
                  return (
                    <ListItem
                    key={index}>
                      {/* <ListIcon as={MdCheckCircle} color={item.labeled_instance_count >= 20?'green.500':'red.500'} /> */}
                      {item.category_name} : {item.labeled_instance_count}<Box as='span' fontSize='sm' color={item.labeled_instance_count >= 20?'green':'red'}> / 20</Box>
                    </ListItem>
                  )
                })}
                </UnorderedList>
              )}
              </>
            )}
          </Stack>
        </CardFooter>
      </Card>
    </PopoverContent>
  );
};



const LabelingPresenter: React.FC<ILabelingPresenter> = ({
  currentUser,
  currentDataURL,
  projectInfo,
  isFileSelectorOpen,
  tasks,
  labelingAssignee,
  projectUser,
  examinee,
  isFileInfoOpen,
  isInstanceOpen,
  isHistoryOpen,
  workStatutes,
  selectedTask,
  loading,
  isFirst,
  resizingVal,
  isDownloadOn,
  isDownload,
  selectDownload,
  isMoveOn,
  isTagOn,
  isClassOn,
  isResetOn,
  isHDOn,
  isODOn,
  isISOn,
  isSESOn,
  isSmartpenOn,
  isAutopointOn,
  isBoxingOn,
  isPolylineOn,
  isPolygonOn,
  isPointOn,
  isBrushOn,
  is3DcubeOn,
  isSegmentOn,
  isKeypointOn,
  labelWidth, 
  labelHeight, 
  labelDiag, 
  labelCoordX, 
  labelCoordY,
  labelPerWidth, 
  labelPerHeight, 
  labelPerDiag,
  ObjectListItem,
  objectType,
  refTools,
  refPicker,
  refTop,
  refBottom,
  refBtnLock,
  refBtnVisible,
  refBtnDelete,
  isAutoLabeling,

  isOpenReject,
  rejectComment,
  showRejectComment,
  isHDLabelingOn,
  projectCategories,

  selectedObject,
  instance,
  currentObjectItem,
  isKeyOnOff,
  isCrossOnOff,
  countListOD,
  countListISES,
  isLearningOD,
  isLearningISES,
  countOD,
  countISES,
  isActiveOD,
  isActiveISES,
  isPopupOD,
  isPopupIS,
  isPopupSES,
  isCountClassOpen,
  iconCheckOD,
  iconCheckIS,
  iconCheckSES,

  isBrushCircleOn,
  isBrushSquareOn,
  isBrushOpen,

  isAutopointBBoxOn,
  isAutopointPolygonOn,
  isAutopointOpen,

  isKeypointPersonOn,
  isKeypointAnimalOn,
  isKeypointHandOn,
  isKeypointOpen,
  alertKeypointOpen,
  canvasHistory,
  attrNumList,
  attrTxtList,
  valAttrNum,
  valAttrTxt,

  selectHistory,
  isLock,
  isVisible,
  isDelete,
  _setLabelingAssignee,
  _setExaminee,
  toggleFileInfoOpen,
  toggleInstanceOpen,
  toggleHistoryOpen,
  _setWorkStatutes,
  _setSelectedTask,
  handlePrevTask,
  handleNextTask,
  _setDownload,
  onCancelDownload,
  onSubmitDownload,
  onCancelMove,
  onCancelClass,
  onCancelReset,
  onSubmitReset,
  onCancelSmartpen,
  onCancelAutopoint,
  onCancelBrush,
  onCancel3Dcube,
  onCancelKeypoint,
  toggleFileSelector,
  handleResizing,
  handleToggleFullScreen,
  handleUnDo,
  handleRedo,
  saveStatus,
  goBack,

  handleCompleted,
  handleOpenReject,
  handleCancelReject,
  onSubmitReject,
  handleSetRejectText,
  handleShowRejctHelp,
  handleCancelRejectComment,

  checkIsDownload,
  checkIsMove,
  checkIsTag,
  checkIsClass,
  checkIsReset,
  checkIsHD,
  checkIsOD,
  checkIsIS,
  checkIsSES,
  checkIsSmartpen,
  checkIsAutopoint,
  checkIsBoxing,
  checkIsPolyline,
  checkIsPolygon,
  checkIsPoint,
  checkIsBrush,
  checkIs3Dcube,
  checkIsSegment,
  checkIsKeypoint,
  setIsClass,
  onMoveToToolsTop,
  onMoveToToolsEnd,
  onMoveToToolsLeft,
  onMoveToToolsRight,
  setInstanceIcon,
  isDeleteInstance,
  checkIsDeleteInstance,
  onCancelDelete,
  setAnnotationClass,
  setAnnotationAttr,
  setKeyOnOff,
  closePopupOD,
  closePopupIS,
  closePopupSES,
  toggleCountClassOpen,

  setIsBrush,
  openIsBrush,
  closeIsBrush,

  setIsAutopoint,
  openIsAutopoint,
  closeIsAutopoint,

  setIsKeypoint,
  openIsKeypoint,
  closeIsKeypoint,
  openAlertKeypoint,
  onChangeAttrNum,
  onChangeAttrTxt,
  handleSetAttrNum,
  handleSetAttrTxt,
  handleRemoveAttrNum,
  handleRemoveAttrTxt,
  sliderValuePoint,
  setSliderValuePoint,
  showTooltipPoint,
  setShowTooltipPoint,
  sliderValueBrush,
  setSliderValueBrush,
  showTooltipBrush,
  setShowTooltipBrush,
  sliderValueSmartpen,
  setSliderValueSmartpen,
  showTooltipSmartpen,
  setShowTooltipSmartpen,
  setIsPolygon,
  isPolygonNewOn,
  isPolygonAddOn,
  isPolygonDelOn,
}) => {
  const tooltipTextHD = "Human Detection";
  const tooltipContentsHD = () => {
    return (
      <>
        <Stack>
          <Text>Human Detection</Text>
          <Text>(OD + IS + SES)</Text>
        </Stack>
      </>
    );
  };
  const tooltipTextOD = "Object Detection";
  const tooltipTextIS = "Instance Segmentation";
  const tooltipTextSES = "Semantic Segmentation";
  const tooltipContentOD = "OD Assistant란 원클릭만으로 특정 이미지에서 객체를 찾고 해당 경계 상자를 예측합니다.";
  const tooltipContentIS = "IS Assistant란 원클릭만으로 특정 이미지에서 객체를 찾고 해당 모양을 예측합니다";
  const tooltipContentSES = "SES Assistant란 원클릭만으로 이미지의 각 픽셀이 어떤 클래스에 속하는지 분류하고 해당 모양을 예측합니다.";
  const checkLearning = (type: number) => {
    const textHeader = type === 1? tooltipTextOD : type === 2? tooltipTextIS : tooltipTextSES;
    const textContent = type === 1? tooltipContentOD : type === 2? tooltipContentIS : tooltipContentSES;

    return (
      <Card maxW='sm' variant={"unstyled"} style={{ padding:"20px", background: "#E2E4E7", color:"#5F6164" }}>
        <CardBody width={"100%"} style={{marginBottom: "20px"}}>
          <Image
            src={tooltipImgOD}
            borderRadius='lg'
            width={"100%"}
            style={{marginBottom: "10px"}}
          />
          <Stack mt='6' spacing='3'>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Heading size='15px' style={{marginBottom: "10px"}}>
                {textHeader}
              </Heading>
              <Text color={"#3580E3"}>활성화</Text>
            </Box>
            <Text fontSize={'13px'}>
              {textContent}
            </Text>
          </Stack>
        </CardBody>
        <CardFooter width={"100%"}>
          <Stack width={"100%"}>
            <Progress colorScheme={"blue"} value={100} width={"100%"} />
          </Stack>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <>
      <ChakraProvider theme={theme}>
        <Helmet>
          <title>SSLO | STUDIO</title>
        </Helmet>
        <StudioWrapper>
          <StudioHeader>
            <HeaderLeft>
              <NavLink to={"/"}>
                <Icon
                  src={iconHome}
                  alt="icon-home"
                  style={{ width: 20, height: 17 }} />
              </NavLink>
              {selectedTask &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ?
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={checkIsDownload}
              >
                <Icon
                  src={iconLink}
                  alt="icon-download"
                  style={{ width: 17.38, height: 17.67 }} />
                <Modal
                  isOpen={isDownloadOn}
                  onClose={onCancelDownload}
                  title={"산출물 내보내기"}
                  txtSubmit={"내려받기"}
                  onSubmit={onSubmitDownload}
                >
                  <>
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
                            as={Button}
                            rightIcon={isOpen ? (
                              <Icon src={arrowUp} />
                            ) : (
                              <Icon src={arrowDown} />
                            )}
                          >
                            <DropBoxTextWrapper>
                              <DropBoxNormalText style={{ height: 20 }}>
                                {isDownload !== "" ? selectDownload : "다운로드할 파일 형식을 선택해주세요."}
                              </DropBoxNormalText>
                            </DropBoxTextWrapper>
                          </MenuButton>
                          <MenuList
                            bgColor={"#e2e4e7"}
                            border={"1px"}
                            alignItems={"center"}
                            width={"100%"}
                            borderColor={"#c0c3c7"}
                            borderRadius={"none"}
                          >
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("coco")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"COCO Dataset Format"}
                              </DropBoxNormalText>
                            </MenuItem>
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("yolo")}
                              disabled={true}
                              isDisabled={true}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"YOLO Dataset Format"}
                              </DropBoxNormalText>
                            </MenuItem>
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("image")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"Image"}
                              </DropBoxNormalText>
                            </MenuItem>
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("label")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"Label Image"}
                              </DropBoxNormalText>
                            </MenuItem>
                            <MenuItem
                              _hover={{ bgColor: "#CFD1D4" }}
                              _focusWithin={{ bgColor: "#CFD1D4" }}
                              onClick={() => _setDownload("json")}
                            >
                              <DropBoxNormalText style={{ height: 20 }}>
                                {"Image + JSON"}
                              </DropBoxNormalText>
                            </MenuItem>
                          </MenuList>
                        </>
                      )}
                    </Menu>
                  </>
                </Modal>
              </NavButton> : <NavButton style={{ cursor: "not-allowed" }}>
                <Icon
                  src={iconLink}
                  alt="icon-download"
                  style={{ width: 17.38, height: 17.67 }} />
              </NavButton>}
              {selectedTask && selectedTask.taskStatus !== 3 &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <NavButton style={{ cursor: "pointer" }} onClick={() => saveStatus(2)}>
                  <Icon
                    src={iconSave}
                    alt="icon-save"
                    style={{ width: 18, height: 18 }}
                  />
              </NavButton> : <NavButton style={{ cursor: "not-allowed" }}>
                  <Icon
                    src={iconSave}
                    alt="icon-save"
                    style={{ width: 18, height: 18 }}
                  />
              </NavButton>}
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={setKeyOnOff}
              >
                <Icon
                  src={iconKey}
                  alt="icon-key"
                  style={{ width: 22, height: 15 }}
                />
              </NavButton>
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={handleToggleFullScreen}
              >
                <Icon
                  src={iconFullScreen}
                  alt="icon-fullscreen"
                  style={{ width: 14, height: 14 }}
                />
              </NavButton>
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={goBack}
              >
                <Icon
                  src={iconLogout}
                  alt="icon-logout"
                  style={{ width: 20, height: 18 }}
                />
              </NavButton>
            </HeaderLeft>
            <HeaderCenter>
              <HeaderCenterLeft />
              <HeaderCenterRight>
                <Icon
                  src={iconPrev}
                  style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                  onClick={selectedTask
                    ? () => handlePrevTask(selectedTask.taskId)
                    : undefined} />
                <HeaderCenterTextContainer>
                  <HeaderCenterText>
                    {projectInfo ? projectInfo.projectName : "프로젝트 명"}
                  </HeaderCenterText>
                  <HeaderCenterImageTitle>
                    {selectedTask ? selectedTask.imageName : ""}
                  </HeaderCenterImageTitle>
                </HeaderCenterTextContainer>
                <Icon
                  src={iconNext}
                  style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                  onClick={selectedTask
                    ? () => handleNextTask(selectedTask.taskId)
                    : undefined} />
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>작업단계</BoldText>
                  </ProgressTextBox>
                  <Divider style={{ marginLeft: 4 }} />
                  <ProgressTextBox>
                    <NormalText>{selectedTask && selectedTask.taskStep === 1 ? "가공" : "검수"}</NormalText>
                  </ProgressTextBox>
                </ProgressContainer>
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>작업상태</BoldText>
                  </ProgressTextBox>
                  <Divider />
                  <ProgressTextBox>
                    {selectedTask && selectedTask.taskStatus === 1 && (
                      <>
                        <Ball style={{ backgroundColor: "#E2772A" }} />
                        <NormalText style={{ color: "#E2772A" }}>
                          미작업
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 2 && (
                      <>
                        <Ball style={{ backgroundColor: "#3580E3" }} />
                        <NormalText style={{ color: "#3580E3" }}>
                          진행중
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 3 && (
                      <>
                        <Ball style={{ backgroundColor: "#2EA090" }} />
                        <NormalText style={{ color: "#2EA090" }}>
                          작업완료
                        </NormalText>
                      </>
                    )}
                    {selectedTask && selectedTask.taskStatus === 4 && (
                      <>
                        <Ball style={{ backgroundColor: "#FF4343" }} />
                        <NormalText style={{ color: "#FF4343" }}>
                          반려
                        </NormalText>
                        <Icon src={rejectBtn}
                          style={{ marginLeft: 5, cursor: "pointer" }}
                          onClick={handleShowRejctHelp} />
                        <Modal
                          isOpen={showRejectComment}
                          onClose={handleCancelRejectComment}
                          title={"반려사유"}
                          onSubmit={onSubmitReject}
                          noSubmit={true}
                          txtSubmit={""}
                        >
                          <>
                            <BoldText>{rejectComment}</BoldText>
                          </>
                        </Modal>
                      </>
                    )}
                  </ProgressTextBox>
                </ProgressContainer>
              </HeaderCenterRight>
            </HeaderCenter>
            <HeaderRight>
              <IconBox
                style={{ borderRight: 0, cursor: "pointer" }}
                onClick={handleUnDo}
              >
                <Icon src={iconUndo} />
              </IconBox>
              <IconBox style={{ cursor: "pointer" }} onClick={handleRedo}>
                <Icon src={iconDo} />
              </IconBox>
              <ZoomBox>
                <Icon src={iconZoomDec} />
                <ZoomInput
                  id={"zoom-range"}
                  type={"range"}
                  min={10}
                  max={200}
                  //defaultValue={"100"}
                  value={resizingVal === null ? "100" : resizingVal}
                  onChange={handleResizing} />
                <Icon src={iconZoomInc} />
              </ZoomBox>
            </HeaderRight>
          </StudioHeader>
          <Main>
            <MainLeftWrap>
              <LeftListArrow id={"arrowToolsTop"} onClick={() => onMoveToToolsTop()}>
                <Icon
                  src={iconArrowTop} />
              </LeftListArrow>
              <MainLeft id={"toolsWrap"} ref={refTools}>
              {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="이동" placement="right">
                  <LeftItemContainer onClick={checkIsMove} ref={refTop}>
                    <Icon
                      src={isMoveOn ? iconToolMoveSelected : iconToolMove} />
                    <LeftItemText>이동</LeftItemText>
                    {/* <AlertModal
      isOpen={isMoveOn}
      onClose={onCancelMove}
      title={"이동"}
    >
      <>
        <p>
          {"준비중입니다."}
        </p>
      </>
    </AlertModal> */}
                  </LeftItemContainer>
                </Tooltip>:<LeftItemContainer ref={refTop} style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolMove} />
                    <LeftItemText>이동</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="태그" placement="right">
                  <LeftItemContainer onClick={checkIsTag}>
                    <Icon
                      src={isTagOn ? iconToolTagSelected : iconToolTag} />
                    <LeftItemText>태그</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolTag} />
                    <LeftItemText>태그</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="클래스" placement="right">
                  <LeftItemContainer onClick={checkIsClass}>
                    <Icon
                      src={isClassOn ? iconToolClassSelected : iconToolClass} />
                    <LeftItemText>클래스</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolClass} />
                    <LeftItemText>클래스</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="리셋" placement="right">
                  <LeftItemContainer onClick={checkIsReset}>
                    <Icon
                      src={isResetOn ? iconToolResetSelected : iconToolReset} />
                    <LeftItemText>리셋</LeftItemText>
                    <Modal
                      isOpen={isResetOn}
                      onClose={onCancelReset}
                      title={"리셋"}
                      txtSubmit={"확인"}
                      onSubmit={onSubmitReset}
                    >
                      <>
                        <p>
                          {"작업 내용을 초기화하시겠습니까?"}
                        </p>
                      </>
                    </Modal>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                 <Icon
                   src={iconToolReset} />
                 <LeftItemText>리셋</LeftItemText>
                </LeftItemContainer>}
                <UnderBar></UnderBar>
                {/* //! HD */}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label={tooltipContentsHD()} placement="right">
                  <LeftItemContainer onClick={checkIsHD}>
                    {/* // Todo: Active, Learning, Working, Inactive */}
                    <ToolsIcon isSelect={isHDOn}
                      src={isHDLabelingOn ? isHDOn ? iconToolHDActive : iconToolHDActive : iconToolHD} />
                    <LeftItemText>HD</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolHD} />
                    <LeftItemText>HD</LeftItemText>
                </LeftItemContainer>}
                {/* // Todo: 추후 Tooltip -> Popup 수정 필요 : 비활성화, 훈련중의 경우만 */}
                {/* //! OD */}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isPopupOD}
                  onClose={closePopupOD}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={checkIsOD}>
                      <Tooltip 
                        hasArrow 
                        label={isActiveOD?checkLearning(1):tooltipTextOD} 
                        bg={isActiveOD?"#E2E4E7":"gray.700"}
                        color={isActiveOD?"#5F6164":"whiteAlpha.900"}
                        marginLeft={isActiveOD?"50px":"0"}
                        placement="right"
                      >
                        <TooltipItemContainer>
                          <Icon
                            src={isActiveOD ? isODOn ? iconToolODSelected : iconToolODActive : iconCheckOD} />
                          <LeftItemText>OD</LeftItemText>
                        </TooltipItemContainer>
                      </Tooltip>
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopupAutoLabeling 
                    type={1}
                    isActiveOD={isActiveOD}
                    isActiveISES={isActiveISES}
                    isLearningOD={isLearningOD}
                    isLearningISES={isLearningISES}
                    countOD={countOD}
                    countISES={countISES}
                    countListOD={countListOD}
                    countListISES={countListISES}
                    closePopupOD={closePopupOD}
                    closePopupIS={closePopupIS}
                    closePopupSES={closePopupSES}
                    toggleCountClassOpen={toggleCountClassOpen}
                    isCountClassOpen={isCountClassOpen} 
                  />
                </Popover> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolOD} />
                    <LeftItemText>OD</LeftItemText>
                </LeftItemContainer>}
                {/* //! IS */}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isPopupIS}
                  onClose={closePopupIS}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={checkIsIS}>
                      <Tooltip 
                        hasArrow 
                        label={isActiveISES?checkLearning(2):tooltipTextIS} 
                        bg={isActiveISES?"#E2E4E7":"gray.700"}
                        color={isActiveISES?"#5F6164":"whiteAlpha.900"}
                        marginLeft={isActiveISES?"50px":"0"}
                        placement="right"
                      >
                        <TooltipItemContainer>
                          <Icon
                            src={isActiveISES ? isISOn ? iconToolISSelected : iconToolISActive : iconCheckIS} />
                          <LeftItemText>IS</LeftItemText>
                        </TooltipItemContainer>
                      </Tooltip>
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopupAutoLabeling 
                    type={2}
                    isActiveOD={isActiveOD}
                    isActiveISES={isActiveISES}
                    isLearningOD={isLearningOD}
                    isLearningISES={isLearningISES}
                    countOD={countOD}
                    countISES={countISES}
                    countListOD={countListOD}
                    countListISES={countListISES}
                    closePopupOD={closePopupOD}
                    closePopupIS={closePopupIS}
                    closePopupSES={closePopupSES}
                    toggleCountClassOpen={toggleCountClassOpen}
                    isCountClassOpen={isCountClassOpen} 
                  />
                </Popover> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolIS} />
                    <LeftItemText>IS</LeftItemText>
                </LeftItemContainer>}
                {/* //! SES */}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isPopupSES}
                  onClose={closePopupSES}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={checkIsSES}>
                      <Tooltip 
                        hasArrow 
                        label={isActiveISES?checkLearning(3):tooltipTextSES} 
                        bg={isActiveISES?"#E2E4E7":"gray.700"}
                        color={isActiveISES?"#5F6164":"whiteAlpha.900"}
                        marginLeft={isActiveISES?"50px":"0"}
                        placement="right"
                      >
                        <TooltipItemContainer>
                          <Icon
                            src={isActiveISES ? isSESOn ? iconToolSESSelected : iconToolSESActive : iconCheckSES} />
                          <LeftItemText>SES</LeftItemText>
                        </TooltipItemContainer>
                      </Tooltip>
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopupAutoLabeling 
                    type={3}
                    isActiveOD={isActiveOD}
                    isActiveISES={isActiveISES}
                    isLearningOD={isLearningOD}
                    isLearningISES={isLearningISES}
                    countOD={countOD}
                    countISES={countISES}
                    countListOD={countListOD}
                    countListISES={countListISES}
                    closePopupOD={closePopupOD}
                    closePopupIS={closePopupIS}
                    closePopupSES={closePopupSES}
                    toggleCountClassOpen={toggleCountClassOpen}
                    isCountClassOpen={isCountClassOpen} 
                  />
                </Popover> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolSES} />
                    <LeftItemText>SES</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isSmartpenOn}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={checkIsSmartpen}>
                      <Tooltip hasArrow label="스마트펜" placement="right">
                        <TooltipItemContainer>
                          <Icon
                            src={isSmartpenOn ? iconToolSmartpenSelected : iconToolSmartpen} />
                          <LeftItemText>스마트펜</LeftItemText>
                          {/* <AlertModal
                            isOpen={isSmartpenOn}
                            onClose={onCancelSmartpen}
                            title={"스마트펜"}
                          >
                            <>
                              <p>
                                {"준비중입니다."}
                              </p>
                            </>
                          </AlertModal> */}
                        </TooltipItemContainer>
                      </Tooltip> 
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopoverContent 
                    bg={'#E2E4E7' }
                    minWidth={"150px"}
                    width={"100%" }
                    height={"100%" }
                    color={'#5F6164' }
                    marginLeft={"15px"}
                    style={{ border: "1px solid #A4A8AD" }}
                  >
                    <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                    <ToolSubWrapper style={{ padding: "20px", flexDirection: "column", justifyContent: "flex-start" }}>
                      <Text width={"100%"} fontSize={"18px"} fontWeight={"800"} marginBottom={"10px"}>스마트펜</Text>
                      <Box width={"100%"} display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                        <Text fontSize={"16px"} fontWeight={"800"}>Threshold</Text>
                        <Box fontSize={"16px"} fontWeight={"800"}>{sliderValueSmartpen}px</Box>
                      </Box>
                      <Box width={"100%"} display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                        <Icon src={iconZoomDec} style={{ marginRight: "10px"}} />
                        <Slider
                          id='slider'
                          defaultValue={50}
                          min={10}
                          max={100}
                          colorScheme='ssloGrey'
                          onChange={(v) => setSliderValueSmartpen(v)}
                          onMouseEnter={() => setShowTooltipSmartpen(true)}
                          onMouseLeave={() => setShowTooltipSmartpen(false)}
                        >
                          <SliderTrack bg='ssloGrey.500' height={"5px"} borderRadius={"3px"}>
                            <SliderFilledTrack bg='ssloGrey.500' />
                          </SliderTrack>
                          <Tooltip
                            hasArrow
                            bg='ssloGreen.500'
                            color='white'
                            placement='top'
                            isOpen={showTooltipSmartpen}
                            label={`${sliderValueSmartpen}`}
                          >
                            <SliderThumb bg='ssloGrey.500'/>
                          </Tooltip>
                        </Slider>
                        <Icon src={iconZoomInc} style={{ marginLeft: "10px"}} />
                      </Box>
                    </ToolSubWrapper>
                  </PopoverContent>
                </Popover>
                : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                  <Icon
                    src={iconToolSmartpen} />
                  <LeftItemText>스마트펜</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isAutopointOpen}
                  onClose={closeIsAutopoint}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                  <LeftItemContainer onClick={openIsAutopoint}>
                    <Tooltip hasArrow label="오토포인트" placement="right">
                      <TooltipItemContainer>
                        <Icon
                          src={isAutopointBBoxOn ? iconSubToolAutopointBBoxSelected : isAutopointPolygonOn ? iconSubToolAutopointPolygonSelected : iconToolAutopoint} />
                        <LeftItemText>오토포인트</LeftItemText>
                      </TooltipItemContainer>
                    </Tooltip>
                  </LeftItemContainer>
                  </PopoverTrigger>
                  <PopoverContent bg='#E2E4E7' width="100%" height="100%" color='#5F6164' style={{ border: "1px solid #A4A8AD", marginLeft: "15px" }}>
                    <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                    <ToolSubWrapper>
                      <TooltipItemContainer onClick={() => setIsAutopoint("bbox")}>
                        <Icon
                          src={isAutopointBBoxOn ? iconSubToolAutopointBBoxSelected : iconSubToolAutopointBBox} />
                        <LeftItemText>박싱</LeftItemText>
                      </TooltipItemContainer>
                      <TooltipItemContainer onClick={() => setIsAutopoint("polygon")}>
                        <Icon
                          src={isAutopointPolygonOn ? iconSubToolAutopointPolygonSelected : iconSubToolAutopointPolygon} />
                        <LeftItemText>폴리곤</LeftItemText>
                      </TooltipItemContainer>
                    </ToolSubWrapper>
                  </PopoverContent>
                </Popover> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                  <Icon
                    src={iconToolAutopoint} />
                  <LeftItemText>오토포인트</LeftItemText>
                </LeftItemContainer>}
                <UnderBar></UnderBar>
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="박싱" placement="right">
                  <LeftItemContainer onClick={checkIsBoxing}>
                    <Icon
                      src={isBoxingOn ? iconToolBoxingSelected : iconToolBoxing} />
                    <LeftItemText>박싱</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolBoxing} />
                    <LeftItemText>박싱</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="폴리라인" placement="right">
                  <LeftItemContainer onClick={checkIsPolyline}>
                    <Icon
                      src={isPolylineOn ? iconToolPolylineSelected : iconToolPolyline} />
                    <LeftItemText>폴리라인</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolPolyline} />
                    <LeftItemText>폴리라인</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isPolygonOn}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={checkIsPolygon}>
                      <Tooltip hasArrow label="폴리곤" placement="right">
                        <TooltipItemContainer>
                          <Icon
                            src={isPolygonOn ? iconToolPolygonSelected : iconToolPolygon} />
                          <LeftItemText>폴리곤</LeftItemText>
                        </TooltipItemContainer>
                      </Tooltip> 
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopoverContent bg='#E2E4E7' width="100%" height="100%" color='#5F6164' style={{ border: "1px solid #A4A8AD", marginLeft: "15px" }}>
                    <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                    <ToolSubWrapper>
                      <TooltipItemContainer onClick={() => setIsPolygon("new")}>
                        <Icon
                          src={isPolygonNewOn ? iconSubToolPolygonNewSelected : iconSubToolPolygonNew} />
                        <LeftItemText>new</LeftItemText>
                      </TooltipItemContainer>
                      <TooltipItemContainer onClick={() => setIsPolygon("add")}>
                        <Icon
                          src={isPolygonAddOn ? iconSubToolPolygonAddSelected : iconSubToolPolygonAdd} />
                        <LeftItemText>add</LeftItemText>
                      </TooltipItemContainer>
                      <TooltipItemContainer onClick={() => setIsPolygon("del")}>
                        <Icon
                          src={isPolygonDelOn ? iconSubToolPolygonDelSelected : iconSubToolPolygonDel} />
                        <LeftItemText>del</LeftItemText>
                      </TooltipItemContainer>
                    </ToolSubWrapper>
                  </PopoverContent>
                </Popover>
                : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolPolygon} />
                    <LeftItemText>폴리곤</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isPointOn}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={checkIsPoint}>
                      <Tooltip hasArrow label="포인트" placement="right">
                        <TooltipItemContainer>
                          <Icon
                            src={isPointOn ? iconToolPointSelected : iconToolPoint} />
                          <LeftItemText>포인트</LeftItemText>
                        </TooltipItemContainer>
                      </Tooltip> 
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopoverContent 
                    bg={'#E2E4E7' }
                    minWidth={"150px"}
                    width={"100%" }
                    height={"100%" }
                    color={'#5F6164' }
                    marginLeft={"15px"}
                    style={{ border: "1px solid #A4A8AD" }}
                  >
                    <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                    <ToolSubWrapper style={{ padding: "20px", flexDirection: "column", justifyContent: "flex-start" }}>
                      <Text width={"100%"} fontSize={"18px"} fontWeight={"800"} marginBottom={"10px"}>포인트</Text>
                      <Box width={"100%"} display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                        <Text fontSize={"16px"} fontWeight={"800"}>Size</Text>
                        <Box fontSize={"16px"} fontWeight={"800"}>{sliderValuePoint}px</Box>
                      </Box>
                      <Box width={"100%"} display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                        <Icon src={iconZoomDec} style={{ marginRight: "10px"}} />
                        <Slider
                          id='slider'
                          defaultValue={4}
                          min={3}
                          max={15}
                          colorScheme='ssloGrey'
                          onChange={(v) => setSliderValuePoint(v)}
                          onMouseEnter={() => setShowTooltipPoint(true)}
                          onMouseLeave={() => setShowTooltipPoint(false)}
                        >
                          <SliderTrack bg='ssloGrey.500' height={"5px"} borderRadius={"3px"}>
                            <SliderFilledTrack bg='ssloGrey.500' />
                          </SliderTrack>
                          <Tooltip
                            hasArrow
                            bg='ssloGreen.500'
                            color='white'
                            placement='top'
                            isOpen={showTooltipPoint}
                            label={`${sliderValuePoint}`}
                          >
                            <SliderThumb bg='ssloGrey.500'/>
                          </Tooltip>
                        </Slider>
                        <Icon src={iconZoomInc} style={{ marginLeft: "10px"}} />
                      </Box>
                    </ToolSubWrapper>
                  </PopoverContent>
                </Popover>
                : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolPoint} />
                    <LeftItemText>포인트</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isBrushOpen}
                  onClose={closeIsBrush}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer>
                      <Popover
                        isOpen={isBrushOn}
                        placement='right'
                        closeOnBlur={false}
                        autoFocus={false}
                      >
                        <PopoverTrigger>
                          <LeftItemContainer onClick={openIsBrush}>
                            <Tooltip hasArrow label="브러쉬" placement="right">
                              <TooltipItemContainer>
                                <Icon
                                  src={isBrushCircleOn ? iconSubToolBrushCircleSelected : isBrushSquareOn ? iconSubToolBrushSquareSelected : isBrushOn ? iconToolBrushSelected : iconToolBrush} />
                                <LeftItemText>브러쉬</LeftItemText>
                              </TooltipItemContainer>
                            </Tooltip>
                          </LeftItemContainer>
                        </PopoverTrigger>
                        <PopoverContent 
                          bg={'#E2E4E7' }
                          minWidth={"150px"}
                          width={"100%" }
                          height={"100%" }
                          color={'#5F6164' }
                          marginLeft={"15px"}
                          style={{ border: "1px solid #A4A8AD" }}
                        >
                          <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                          <ToolSubWrapper style={{ padding: "20px", flexDirection: "column", justifyContent: "flex-start" }}>
                            <Text width={"100%"} fontSize={"18px"} fontWeight={"800"} marginBottom={"10px"}>브러쉬</Text>
                            <Box width={"100%"} display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                              <Text fontSize={"16px"} fontWeight={"800"}>Size</Text>
                              <Box fontSize={"16px"} fontWeight={"800"}>{sliderValueBrush}px</Box>
                            </Box>
                            <Box width={"100%"} display={"flex"} justifyContent={"space-between"} marginBottom={"20px"}>
                              <Icon src={iconZoomDec} style={{ marginRight: "10px"}} />
                              <Slider
                                id='slider'
                                defaultValue={20}
                                min={5}
                                max={30}
                                colorScheme='ssloGrey'
                                onChange={(v) => setSliderValueBrush(v)}
                                onMouseEnter={() => setShowTooltipBrush(true)}
                                onMouseLeave={() => setShowTooltipBrush(false)}
                              >
                                <SliderTrack bg='ssloGrey.500' height={"5px"} borderRadius={"3px"}>
                                  <SliderFilledTrack bg='ssloGrey.500' />
                                </SliderTrack>
                                <Tooltip
                                  hasArrow
                                  bg='ssloGreen.500'
                                  color='white'
                                  placement='top'
                                  isOpen={showTooltipBrush}
                                  label={`${sliderValueBrush}`}
                                >
                                  <SliderThumb bg='ssloGrey.500' width={"7px"} height={"15px"}/>
                                </Tooltip>
                              </Slider>
                              <Icon src={iconZoomInc} style={{ marginLeft: "10px"}} />
                            </Box>
                          </ToolSubWrapper>
                        </PopoverContent>
                      </Popover>
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopoverContent bg='#E2E4E7' width="100%" height="100%" color='#5F6164' style={{ border: "1px solid #A4A8AD", marginLeft: "15px" }}>
                    <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                    <ToolSubWrapper>
                      <TooltipItemContainer onClick={() => setIsBrush("circle")}>
                        <Icon
                          src={isBrushCircleOn ? iconSubToolBrushCircleSelected : iconSubToolBrushCircle} />
                        <LeftItemText>원형</LeftItemText>
                      </TooltipItemContainer>
                      <TooltipItemContainer onClick={() => setIsBrush("square")}>
                        <Icon
                          src={isBrushSquareOn ? iconSubToolBrushSquareSelected : iconSubToolBrushSquare} />
                        <LeftItemText>사각형</LeftItemText>
                      </TooltipItemContainer>
                    </ToolSubWrapper>
                  </PopoverContent>
                </Popover> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolBrush} />
                    <LeftItemText>브러쉬</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="3D큐브" placement="right">
                  <LeftItemContainer onClick={checkIs3Dcube}>
                    <Icon
                      src={is3DcubeOn ? iconTool3DcubeSelected : iconTool3Dcube} />
                    <LeftItemText>3D 큐브</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconTool3Dcube} />
                    <LeftItemText>3D 큐브</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Tooltip hasArrow label="세그먼트" placement="right">
                  <LeftItemContainer onClick={checkIsSegment}>
                    <Icon
                      src={isSegmentOn ? iconToolSegmentSelected : iconToolSegment} />
                    <LeftItemText>세그먼트</LeftItemText>
                  </LeftItemContainer>
                </Tooltip> : <LeftItemContainer style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolSegment} />
                    <LeftItemText>세그먼트</LeftItemText>
                </LeftItemContainer>}
                {selectedTask &&
               (currentUser.isAdmin || 
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === currentUser.id) ?
                <Popover
                  isOpen={isKeypointOpen}
                  onClose={closeIsKeypoint}
                  placement='right'
                  closeOnBlur={false}
                  autoFocus={false}
                >
                  <PopoverTrigger>
                    <LeftItemContainer onClick={openIsKeypoint} ref={refBottom}>
                      <Tooltip hasArrow label="키포인트" placement="right">
                        <TooltipItemContainer>
                          <Icon
                            src={isKeypointPersonOn ? iconSubToolKeypointPersonSelected : isKeypointAnimalOn ? iconSubToolKeypointAnimalSelected : isKeypointHandOn ? iconSubToolKeypointHandSelected : iconToolKeypoint} />
                          <LeftItemText>키포인트</LeftItemText>
                        </TooltipItemContainer>
                      </Tooltip>
                      <AlertModal
                        isOpen={alertKeypointOpen}
                        onClose={closeIsKeypoint}
                        title={"키포인트"}
                      >
                        <>
                          <p>
                            {"준비중입니다."}
                          </p>
                        </>
                      </AlertModal>
                    </LeftItemContainer>
                  </PopoverTrigger>
                  <PopoverContent bg='#E2E4E7' width="100%" height="100%" color='#5F6164' style={{ border: "1px solid #A4A8AD", marginLeft: "15px" }}>
                    <PopoverArrow bg='#E2E4E7' boxShadow="none !important" style={{ borderLeft: "1px solid #A4A8AD", borderBottom: "1px solid #A4A8AD" }}/>
                    <ToolSubWrapper>
                      <TooltipItemContainer onClick={() => setIsKeypoint("person")}>
                        <Icon
                          src={isKeypointPersonOn ? iconSubToolKeypointPersonSelected : iconSubToolKeypointPerson} />
                        <LeftItemText>사람</LeftItemText>
                      </TooltipItemContainer>
                      <TooltipItemContainer onClick={() => openAlertKeypoint()/* setIsKeypoint("animal") */}>
                        <Icon
                          src={isKeypointAnimalOn ? iconSubToolKeypointAnimalSelected : iconSubToolKeypointAnimal} />
                        <LeftItemText>동물</LeftItemText>
                      </TooltipItemContainer>
                      <TooltipItemContainer onClick={() => openAlertKeypoint()/* setIsKeypoint("hand") */}>
                        <Icon
                          src={isKeypointHandOn ? iconSubToolKeypointHandSelected : iconSubToolKeypointHand} />
                        <LeftItemText>뼈대</LeftItemText>
                      </TooltipItemContainer>
                    </ToolSubWrapper>
                  </PopoverContent>
                </Popover> : <LeftItemContainer ref={refBottom} style={{ cursor: "not-allowed" }}>
                    <Icon
                      src={iconToolKeypoint} />
                    <LeftItemText>키포인트</LeftItemText>
                </LeftItemContainer>}
              </MainLeft>
              <LeftListArrow id={"arrowToolsBottom"} onClick={() => onMoveToToolsEnd()}>
                <Icon
                  src={iconArrowBottom} />
              </LeftListArrow>
            </MainLeftWrap>
            <MainCenterWrapper>
              <MainCenterUpper
                id={"mainCenterUpper"}
                isFileSelectorOpen={isFileSelectorOpen}
              >
                {/*//! 아래는 데이터를 서버로부터 받으면 화면 중앙에 뿌려주는 이미지 */}
                {/* {selectedTask &&
                  (currentDataURL ? (
                    <MainImage
                      id={"mainImage"}
                      isFileSelectorOpen={isFileSelectorOpen}
                      resizingVal={resizingVal}
                      style={{
                        display: "none",
                        filter: undefined,
                      }}
                      src={currentDataURL ? currentDataURL : selectedTask.image} />
                  ) : (
                    <Spinner speed="0.35s" />
                  ))} */}
                {/*//! Canvas */}
                <div style={{ position: "relative" }}>
                  <Canvas
                    id={"fCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    resizingVal={resizingVal} />
                  <TopCanvas
                    id={"magicCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    resizingVal={resizingVal}
                    style={{ display: "none" }} />
                </div>
                <Left id={"left"} style={{ display: isCrossOnOff? "block":"none" }}></Left>
                <Top id={"top"} style={{ display: isCrossOnOff? "block":"none" }}></Top>
                <Right id={"right"} style={{ display: isCrossOnOff? "block":"none" }}></Right>
                <Down id={"down"} style={{ display: isCrossOnOff? "block":"none" }}></Down>

                {loading && isAutoLabeling ? (
                  <SpinnerWrapper style={{position: "absolute"}}>
                    <Spinner speed="0.35s" />
                  </SpinnerWrapper>
                ) : (<></>)}

                {isKeyOnOff && (
                  <>
                    <HotKeyPopup>
                      <HotKeyWrapper>
                        <HotKeyHeader>
                          <h3>공통 단축키</h3>
                          <HotKeyClose onClick={setKeyOnOff}>
                            <Icon src={iconCloseStudio} />
                          </HotKeyClose>
                        </HotKeyHeader>
                        <HotKeyContent>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                저장
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Shift</Kbd> + <Kbd>S</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                완료 / 완료취소
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Q</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                이전 파일
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>E</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                다음 파일
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>R</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                십자선 켜기 / 끄기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>M</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                이동모드 켜기 / 끄기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Delete</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                선택된 객체 라벨링 삭제
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>T</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                태그 숨기기 / 표시하기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Shift</Kbd> + <Kbd>R</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                라벨링 전체 초기화
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                복사
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                붙여넣기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>X</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                잘라내기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                되돌리기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>Y</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                이전 행동 되돌리기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>+</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                확대
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>-</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                축소
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>L</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                라벨링 잠금 / 잠금해제
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                          <HotKeyContentRow>
                            <HotKeyContentLeft>
                              <HotKeyBoldText style={{ marginBottom: 8 }}>
                                <Kbd>Ctrl</Kbd> + <Kbd>H</Kbd>
                              </HotKeyBoldText>
                            </HotKeyContentLeft>
                            <HotKeyContentRight>
                              <HotKeyNormalText style={{ marginBottom: 8 }}>
                                라벨링 숨기기 / 표시하기
                              </HotKeyNormalText>
                            </HotKeyContentRight>
                          </HotKeyContentRow>
                        </HotKeyContent>
                      </HotKeyWrapper>
                    </HotKeyPopup>
                  </>
                )}
                {/*//! 선택한 object의 annotation 정보 가져와서 디폴트로 표시 필요 */}
                {isClassOn && selectedObject && (
                  <>
                    <AnnotationPopup>
                      <AnnotationClassWrapper>
                        <AnnotationClassHeader>
                          <h3>클래스 설정</h3>
                          <AnnotationClose onClick={onCancelClass}>
                            <Icon src={iconCloseStudio} />
                          </AnnotationClose>
                        </AnnotationClassHeader>
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
                                  as={Button}
                                  rightIcon={<Icon src={arrowDown} />}
                                >
                                  <DropBoxTextWrapper>
                                    <DropBoxNormalText>
                                      {/*//! 선택한 object의 class 표시 - 없으면 instance 수정 필요!!! */}
                                      {currentObjectItem[selectedObject.id] && currentObjectItem[selectedObject.id].annotation? currentObjectItem[selectedObject.id].annotation.annotation_category.annotation_category_name : "인간"}
                                    </DropBoxNormalText>
                                  </DropBoxTextWrapper>
                                </MenuButton>
                                <MenuList
                                  bgColor={"#e2e4e7"}
                                  border={"1px"}
                                  borderColor={"#c0c3c7"}
                                  borderRadius={"none"}
                                >
                                  <MenuOptionGroup defaultValue={"인간"} type={"radio"}>
                                    {projectCategories &&
                                      projectCategories.length > 0 &&
                                      projectCategories.map((item, index) => {
                                        return (
                                          <MenuItemOption
                                            key={index}
                                            _hover={{ bgColor: "#CFD1D4" }}
                                            _focusWithin={{ bgColor: "#CFD1D4" }}
                                            onClick={() =>
                                              setAnnotationClass(item)
                                            }
                                            isChecked={item.annotation_category_name === instance.annotation_category_name}
                                            value={item.annotation_category_name}
                                          >
                                            <DropBoxNormalText>
                                              {item.annotation_category_name}
                                            </DropBoxNormalText>
                                          </MenuItemOption>
                                        );
                                      })}
                                  </MenuOptionGroup>
                                </MenuList>
                              </>
                            )}
                          </Menu>
                      </AnnotationClassWrapper>
                      {instance && instance.annotation_category_attributes.map((attr, attrId) => {
                          return (
                            <AnnotationAttrWrapper
                              key={attrId}
                              style={{ marginTop: attrId>0?"20px":"0" }}
                            >
                              <AnnotationAttrHeader>
                                <h3>{attr.annotation_category_attr_name}</h3>
                              </AnnotationAttrHeader>
                              {/*//! 단일 선택형 */}
                              {attr.annotation_category_attr_type === 1 && (
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
                                        as={Button}
                                        rightIcon={<Icon src={arrowDown} />}
                                      >
                                        <DropBoxTextWrapper>
                                          <DropBoxNormalText>
                                            {/*//! 선택한 Object의 속성값 표시 */}
                                            {currentObjectItem[selectedObject.id].annotation?.annotation_category.annotation_category_attributes[attrId]?.annotation_category_attr_val_select
? currentObjectItem[selectedObject.id].annotation.annotation_category.annotation_category_attributes[attrId].annotation_category_attr_val_select : "선택"}
                                          </DropBoxNormalText>
                                        </DropBoxTextWrapper>
                                      </MenuButton>
                                      <MenuList
                                        bgColor={"#e2e4e7"}
                                        border={"1px"}
                                        borderColor={"#c0c3c7"}
                                        borderRadius={"none"}
                                      >
                                        {attr.annotation_category_attr_val &&
                                          attr.annotation_category_attr_val.length > 0 &&
                                          attr.annotation_category_attr_val.map((item, itemId) => {
                                            return (
                                              <MenuItem
                                                key={itemId}
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{ bgColor: "#CFD1D4" }}
                                                onClick={() =>
                                                  setAnnotationAttr(attr, attrId, item)
                                                }
                                                value={item}
                                              >
                                                <DropBoxNormalText>
                                                  {item}
                                                </DropBoxNormalText>
                                              </MenuItem>
                                            );
                                          })}
                                      </MenuList>
                                    </>
                                  )}
                                </Menu>
                              )}
                              {/*//! 다중 선택형 */}
                              {attr.annotation_category_attr_type === 2 && (
                                <Menu closeOnSelect={false}>
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
                                        as={Button}
                                        rightIcon={<Icon src={arrowDown} />}
                                      >
                                        <DropBoxTextWrapper>
                                          <DropBoxNormalText>
                                            {currentObjectItem[selectedObject.id].annotation?.annotation_category.annotation_category_attributes[attrId]?.annotation_category_attr_val_select
                                            ? currentObjectItem[selectedObject.id].annotation.annotation_category.annotation_category_attributes[attrId].annotation_category_attr_val_select.map((element, index) => { 
                                              return ((index > 0 ? ", " : "") + element);  }) : "선택"}
                                          </DropBoxNormalText>
                                        </DropBoxTextWrapper>
                                      </MenuButton>
                                      <MenuList
                                        bgColor={"#e2e4e7"}
                                        border={"1px"}
                                        borderColor={"#c0c3c7"}
                                        borderRadius={"none"}
                                      >
                                        {attr.annotation_category_attr_val &&
                                          attr.annotation_category_attr_val.length > 0 &&
                                          attr.annotation_category_attr_val.map((item, itemId) => {
                                            return (
                                              <MenuItem
                                                key={itemId}
                                                _hover={{ bgColor: "#CFD1D4" }}
                                                _focusWithin={{ bgColor: "#CFD1D4" }}
                                                /* onClick={() =>
                                                  setAnnotationAttr(attr, attrId, item)
                                                } */
                                                value={item}
                                              >
                                                <Checkbox 
                                                  isChecked={currentObjectItem[selectedObject.id].annotation?.annotation_category.annotation_category_attributes[attrId]?.annotation_category_attr_val_select?.includes(item)}
                                                  colorScheme={"ssloGreen"}
                                                  onChange={() => setAnnotationAttr(attr, attrId, item)}
                                                />
                                                <DropBoxNormalText
                                                  onClick={() =>
                                                    setAnnotationAttr(attr, attrId, item)
                                                  }
                                                >
                                                  {item}
                                                </DropBoxNormalText>
                                              </MenuItem>
                                            );
                                          })}
                                      </MenuList>
                                    </>
                                  )}
                                </Menu>
                              )}
                              {/*//! 입력형 숫자 */}
                              {attr.annotation_category_attr_type === 3 && (
                                <>
                                  <AnnotationClassContent style={{ border: "none" }}>
                                    <input
                                      className="attr_num"
                                      placeholder="속성 값 입력 후 Enter (숫자)."
                                      minLength={attr.annotation_category_attr_limit_min}
                                      maxLength={attr.annotation_category_attr_limit_max}
                                      value={valAttrNum?valAttrNum:""}
                                      onChange={(e) => onChangeAttrNum(e, attr.annotation_category_attr_limit_max)}
                                      onKeyDown={(e) => {
                                        if(e.key === "Enter") { handleSetAttrNum(attr, attrId, attr.annotation_category_attr_limit_min, attr.annotation_category_attr_limit_max); return false; }
                                      }}
                                      style={{
                                        width: "100%",
                                        height: "40px",
                                        background: "#e2e4e7",
                                        border: "1px solid #c0c3c7",
                                        padding: "0 2px"
                                      }}
                                    />
                                  </AnnotationClassContent>
                                  <AnnotationAttrContent style={{ maxHeight: "100px" }}>
                                    {currentObjectItem[selectedObject.id].annotation?.annotation_category.annotation_category_attributes[attrId]?.annotation_category_attr_val_input
                                            && currentObjectItem[selectedObject.id].annotation.annotation_category.annotation_category_attributes[attrId].annotation_category_attr_val_input.map((element, index) => {
                                      return (
                                        <Button 
                                          key={index} 
                                          style={{ 
                                            background: "#737680", 
                                            width: "100%", 
                                            maxWidth: "70px", 
                                            height: "30px", 
                                            margin: index % 3 === 0?"2px 5px 2px 0":index%3 === 1?"2px 5px":"2px 0 2px 5px", 
                                            padding: "2px",
                                          }}
                                        >
                                          <Text 
                                            width={"calc(100% - 17px)"} 
                                            overflowX={"hidden"} 
                                            whiteSpace={"nowrap"} 
                                            textOverflow={"ellipsis"} 
                                            color={"white"} 
                                            fontSize={"12px"} 
                                            textAlign={"center"}
                                            verticalAlign={"middle"}
                                            paddingTop={"2px"}
                                            margin={"0 5px"}
                                          >
                                            {element}
                                          </Text>
                                          <Icon 
                                            src={iconClose} 
                                            style={{ width:"15px", height:"15px", marginRight:"2px" }} 
                                            onClick={() => handleRemoveAttrNum(attr, attrId, element)}
                                          />
                                        </Button>
                                      );
                                    })}
                                  </AnnotationAttrContent>
                                </>
                              )}
                              {/*//! 입력형 문자 */}
                              {attr.annotation_category_attr_type === 4 && (
                                <>
                                  <AnnotationClassContent>
                                    <input
                                      className="attr_txt"
                                      placeholder="속성 값 입력 후 Enter (문자)."
                                      value={valAttrTxt?valAttrTxt:""}
                                      onChange={(e) => onChangeAttrTxt(e, attr.annotation_category_attr_limit_max)}
                                      onKeyDown={(e) => {
                                        e.key === "Enter" ? handleSetAttrTxt(attr, attrId, attr.annotation_category_attr_limit_min, attr.annotation_category_attr_limit_max) : null
                                      }}
                                      style={{
                                        width: "100%",
                                        height: "40px",
                                        background: "#e2e4e7",
                                        border: "1px solid #c0c3c7",
                                        padding: "0 2px"
                                      }}
                                    />
                                  </AnnotationClassContent>
                                  <AnnotationAttrContent style={{ maxHeight: "100px" }}>
                                    {currentObjectItem[selectedObject.id].annotation?.annotation_category.annotation_category_attributes[attrId]?.annotation_category_attr_val_input
                                            && currentObjectItem[selectedObject.id].annotation.annotation_category.annotation_category_attributes[attrId].annotation_category_attr_val_input.map((element, index) => {
                                      return (
                                        <Button 
                                          key={index} 
                                          style={{ 
                                            background: "#737680", 
                                            width: "100%", 
                                            maxWidth: "70px", 
                                            height: "30px", 
                                            margin: index % 3 === 0?"2px 5px 2px 0":index%3 === 1?"2px 5px":"2px 0 2px 5px", 
                                            padding: "2px",
                                          }}
                                        >
                                          <Text 
                                            width={"calc(100% - 17px)"} 
                                            overflowX={"hidden"} 
                                            whiteSpace={"nowrap"} 
                                            textOverflow={"ellipsis"} 
                                            color={"white"} 
                                            fontSize={"12px"} 
                                            textAlign={"center"}
                                            verticalAlign={"middle"}
                                            paddingTop={"2px"}
                                            margin={"0 5px"}
                                          >
                                            {element}
                                          </Text>
                                          <Icon 
                                            src={iconClose} 
                                            style={{ width:"15px", height:"15px", marginRight:"2px" }} 
                                            onClick={() => handleRemoveAttrTxt(attr, attrId, element)}
                                          />
                                        </Button>
                                      );
                                    })}
                                  </AnnotationAttrContent>
                                </>
                              )}
                            </AnnotationAttrWrapper>
                        )}
                      )}
                    </AnnotationPopup>
                  </>
                )}
                {isClassOn && !selectedObject && (
                  <AnnotationPopup>
                    <div>
                      <h3 style={{display: "flex", justifyContent: "center"}}>Select Object</h3>
                      <AnnotationClose onClick={onCancelClass}>
                        <Icon src={iconCloseStudio} />
                      </AnnotationClose>
                    </div>
                  </AnnotationPopup>
                )}
              </MainCenterUpper>
              <MainCenterBottom>
                <ArrowDropDownBox onClick={toggleFileSelector}>
                  <Icon
                    src={isFileSelectorOpen ? arrowDown : arrowUp}
                    style={{ marginRight: 17 }}
                  />
                  <ArrowDropDownText>{`File List (${
                    tasks.length
                  })`}</ArrowDropDownText>
                </ArrowDropDownBox>
                <Menu>
                  {({ isOpen }) => (
                    <>
                      <MenuButton
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        bgColor={"#e2e4e7"}
                        border={"1px"}
                        borderColor={"#737680"}
                        borderRadius={20}
                        width={"145px"}
                        height={"24px"}
                        ml={30}
                        py={"4"}
                        _focus={{ bgColor: "#e2e4e7" }}
                        _hover={{ bgColor: "#e2e4e7" }}
                        _expanded={{ bgColor: "#e2e4e7" }}
                        isActive={isOpen}
                        as={Button}
                        rightIcon={
                          isOpen ? (
                            <Icon src={arrowUp} />
                          ) : (
                            <Icon src={arrowDown} />
                          )
                        }
                      >
                        <DropBoxTextWrapper>
                          <DropBoxNormalText style={{ marginRight: 12 }}>
                            작업상태
                          </DropBoxNormalText>
                          <DropBoxNormalText>{workStatutes}</DropBoxNormalText>
                        </DropBoxTextWrapper>
                      </MenuButton>
                      <MenuList
                        bgColor={"#e2e4e7"}
                        border={"1px"}
                        borderColor={"#c0c3c7"}
                        borderRadius={"none"}
                      >
                        {["전체", "미작업", "완료", "진행중", "반려"].map(
                          (status, index) => {
                            if (status === workStatutes) return null;
                            return (
                              <MenuItem
                                key={index}
                                _hover={{ bgColor: "#CFD1D4" }}
                                _focusWithin={{ bgColor: "#CFD1D4" }}
                                onClick={() => _setWorkStatutes(status as any)}
                              >
                                <DropBoxNormalText>{status}</DropBoxNormalText>
                              </MenuItem>
                            );
                          }
                        )}
                      </MenuList>
                    </>
                  )}
                </Menu>
              </MainCenterBottom>
              {isFileSelectorOpen && (
                <MainCenterImagePickerWrapper>
                  <FileListArrow id={"arrowPickerLeft"} onClick={() => onMoveToToolsLeft()}>
                    <Icon
                      src={iconArrowLeft} />
                  </FileListArrow>
                  <MainCenterImagePicker id={"imgPicker"} ref={refPicker}>
                    {loading && isFirst && !isAutoLabeling ? (
                      <SpinnerWrapper>
                        <Spinner speed="0.35s" />
                      </SpinnerWrapper>
                    ) : (
                      <>
                        {/* // Todo: 관리자가 아닐 경우, 내작업만 표시되도록 task filter 필요 */}
                        <ImagePickerListContainer>
                          {workStatutes === "전체" &&
                            tasks.map((task, index) => {
                              if(currentUser.isAdmin || 
                                task.taskStep === 1 && task.taskWorker?.id === currentUser.id ||
                                task.taskStep === 2 && task.taskValidator?.id === currentUser.id) {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
                                      //onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={selectedTask} isSelected={true} />
                                    </ImageWrapper>
                                  );
                                return (
                                  <ImageWrapper
                                    id={"img" + index}
                                    onClick={() => _setSelectedTask(task)}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask task={task} isSelected={false} />
                                  </ImageWrapper>
                                );
                              }
                            })}
                          {workStatutes === "미작업" &&
                            tasks
                              .filter((t) => t.taskStatus === 1)
                              .map((task, index) => {
                                if(currentUser.isAdmin || 
                                  task.taskStep === 1 && task.taskWorker?.id === currentUser.id ||
                                  task.taskStep === 2 && task.taskValidator?.id === currentUser.id) {
                                  if (selectedTask &&
                                    task.taskId === selectedTask.taskId)
                                    return (
                                      <ImageWrapper
                                        //onClick={() => _setSelectedTask(task)}
                                        id={"img" + index}
                                        key={index}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <SmallTask task={selectedTask} isSelected={true} />
                                      </ImageWrapper>
                                    );
                                  return (
                                    <ImageWrapper
                                      onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={task} isSelected={false} />
                                    </ImageWrapper>
                                  );
                                }
                              })}
                          {workStatutes === "진행중" &&
                            tasks
                              .filter((t) => t.taskStatus === 2)
                              .map((task, index) => {
                                if(currentUser.isAdmin || 
                                  task.taskStep === 1 && task.taskWorker?.id === currentUser.id ||
                                  task.taskStep === 2 && task.taskValidator?.id === currentUser.id) {
                                  if (selectedTask &&
                                    task.taskId === selectedTask.taskId)
                                    return (
                                      <ImageWrapper
                                        //onClick={() => _setSelectedTask(task)}
                                        id={"img" + index}
                                        key={index}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <SmallTask task={selectedTask} isSelected={true} />
                                      </ImageWrapper>
                                    );
                                  return (
                                    <ImageWrapper
                                      onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={task} isSelected={false} />
                                    </ImageWrapper>
                                  );
                                }
                              })}
                          {workStatutes === "완료" &&
                            tasks
                              .filter((t) => t.taskStatus === 3)
                              .map((task, index) => {
                                if(currentUser.isAdmin || 
                                task.taskStep === 1 && task.taskWorker?.id === currentUser.id ||
                                task.taskStep === 2 && task.taskValidator?.id === currentUser.id) {
                                  if (selectedTask &&
                                    task.taskId === selectedTask.taskId)
                                    return (
                                      <ImageWrapper
                                        //onClick={() => _setSelectedTask(task)}
                                        id={"img" + index}
                                        key={index}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <SmallTask task={selectedTask} isSelected={true} />
                                      </ImageWrapper>
                                    );
                                  return (
                                    <ImageWrapper
                                      onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={task} isSelected={false} />
                                    </ImageWrapper>
                                  );
                                }
                              })}
                          {workStatutes === "반려" &&
                            tasks
                              .filter((t) => t.taskStatus === 4)
                              .map((task, index) => {
                                if(currentUser.isAdmin || 
                                  task.taskStep === 1 && task.taskWorker?.id === currentUser.id ||
                                  task.taskStep === 2 && task.taskValidator?.id === currentUser.id) {
                                  if (selectedTask &&
                                    task.taskId === selectedTask.taskId)
                                    return (
                                      <ImageWrapper
                                        //onClick={() => _setSelectedTask(task)}
                                        id={"img" + index}
                                        key={index}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <SmallTask task={selectedTask} isSelected={true} />
                                      </ImageWrapper>
                                    );
                                  return (
                                    <ImageWrapper
                                      onClick={() => _setSelectedTask(task)}
                                      id={"img" + index}
                                      key={index}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <SmallTask task={task} isSelected={false} />
                                    </ImageWrapper>
                                  );
                                }
                              })}
                        </ImagePickerListContainer>
                      </>
                    )}
                  </MainCenterImagePicker>
                  <FileListArrow id={"arrowPickerRight"} onClick={() => onMoveToToolsRight()}>
                    <Icon
                      src={iconArrowRight} />
                  </FileListArrow>
                </MainCenterImagePickerWrapper>
              )}
            </MainCenterWrapper>
            <MainRight>
              <MainRightUpper>
                <DropBoxContainer>
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
                          width={"210px"}
                          _focus={{ bgColor: "#e2e4e7" }}
                          _hover={{ bgColor: "#e2e4e7" }}
                          _expanded={{ bgColor: "#e2e4e7" }}
                          isActive={isOpen}
                          as={Button}
                          disabled={!currentUser.isAdmin}
                          rightIcon={<Icon src={arrowDown} />}
                        >
                          <DropBoxTextWrapper>
                            <DropBoxBoldText>가공 담당자</DropBoxBoldText>
                            <Divider
                              style={{ marginLeft: 8, marginRight: 8 }}
                            />
                            <DropBoxNormalText>
                              {labelingAssignee
                                ? labelingAssignee.userDisplayName
                                : selectedTask && selectedTask.taskWorker
                                ? selectedTask.taskWorker.displayName
                                : ""}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                        </MenuButton>
                        <MenuList
                          bgColor={"#e2e4e7"}
                          border={"1px"}
                          borderColor={"#c0c3c7"}
                          borderRadius={"none"}
                          width={"210px"}
                          maxH={"700px"}
                          overflow={"auto"}
                        >
                          {projectUser &&
                            projectUser.length > 0 &&
                            projectUser.map((user, index) => {
                              if (user === labelingAssignee) return null;
                              return (
                                <MenuItem
                                  key={index}
                                  _hover={{ bgColor: "#CFD1D4" }}
                                  _focusWithin={{ bgColor: "#CFD1D4" }}
                                  onClick={() =>
                                    _setLabelingAssignee(user)
                                  }
                                >
                                  <DropBoxNormalText>
                                    {user.userDisplayName}
                                  </DropBoxNormalText>
                                </MenuItem>
                              );
                            })}
                        </MenuList>
                      </>
                    )}
                  </Menu>
                  <VerticalDivider />
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
                          width={"210px"}
                          _focus={{ bgColor: "#e2e4e7" }}
                          _hover={{ bgColor: "#e2e4e7" }}
                          _expanded={{ bgColor: "#e2e4e7" }}
                          isActive={isOpen}
                          as={Button}
                          disabled={!currentUser.isAdmin}
                          rightIcon={<Icon src={arrowDown} />}
                        >
                          <DropBoxTextWrapper>
                            <DropBoxBoldText>검수 담당자</DropBoxBoldText>
                            <Divider
                              style={{ marginLeft: 8, marginRight: 8 }}
                            />
                            <DropBoxNormalText>
                              {examinee
                                ? examinee.userDisplayName
                                : selectedTask && selectedTask.taskValidator
                                ? selectedTask.taskValidator.displayName
                                : ""}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                        </MenuButton>
                        <MenuList
                          bgColor={"#e2e4e7"}
                          border={"1px"}
                          borderColor={"#c0c3c7"}
                          borderRadius={"none"}
                          maxH={"700px"}
                          overflow={"auto"}
                        >
                          {projectUser &&
                            projectUser.length > 0 &&
                            projectUser.map((user, index) => {
                              if (user === examinee) return null;
                              return (
                                <MenuItem
                                  key={index}
                                  _hover={{ bgColor: "#CFD1D4" }}
                                  _focusWithin={{ bgColor: "#CFD1D4" }}
                                  onClick={() => _setExaminee(user)}
                                >
                                  <DropBoxNormalText>
                                    {user.userDisplayName}
                                  </DropBoxNormalText>
                                </MenuItem>
                              );
                            })}
                        </MenuList>
                      </>
                    )}
                  </Menu>
                </DropBoxContainer>
                <MainRightContainer>
                <DropBoxContainer style={{ padding: 0, borderBottom: 0 }}>
                  <DropBoxContentWrapper
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 12,
                      paddingBottom: 12,
                    }}
                  >
                    <DropBoxContentTitle onClick={toggleFileInfoOpen}>
                      <Icon
                        src={isFileInfoOpen ? arrowDown : arrowUp}
                        style={{ marginRight: 17 }}
                      />
                      <ArrowDropDownText>File Info.</ArrowDropDownText>
                    </DropBoxContentTitle>
                  </DropBoxContentWrapper>
                  {isFileInfoOpen && (
                    <DropBoxContentDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                      }}
                    >
                      <DropBoxContentDescLeft>
                        {/* <DropBoxBoldText style={{ marginBottom: 8 }}>
                          파일명
                        </DropBoxBoldText> */}
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          파일크기
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          용량
                        </DropBoxBoldText>
                      </DropBoxContentDescLeft>
                      <DropBoxContentDescRight>
                        {/* <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageName
                            ? `${selectedTask.imageName}`
                            : "file.png"}
                        </DropBoxNormalText> */}
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageWidth &&
                          selectedTask.imageHeight
                            ? `${selectedTask.imageWidth}px*${
                                selectedTask.imageHeight
                              }px`
                            : "1600px*900px"} 
                        </DropBoxNormalText>
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageSize
                            ? `${selectedTask.imageSize}KB`
                            : "123KB"}
                        </DropBoxNormalText>
                      </DropBoxContentDescRight>
                    </DropBoxContentDescWrapper>
                  )}
                </DropBoxContainer>
                <DropBoxContainer style={{ padding: 0, borderBottom: 0 }}>
                  <DropBoxContentWrapper
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 12,
                      paddingBottom: 12,
                    }}
                  >
                    <DropBoxContentTitle onClick={toggleInstanceOpen}>
                      <Icon
                        src={isInstanceOpen ? arrowDown : arrowUp}
                        style={{ marginRight: 17 }}
                      />
                      <ArrowDropDownText>
                        {`Instance (${
                          ObjectListItem.length
                        })`}
                      </ArrowDropDownText>
                    </DropBoxContentTitle>
                  </DropBoxContentWrapper>
                  {isInstanceOpen && (
                    <DropBoxContentDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                        flexDirection: "column",
                      }}
                    >
                      <DropBoxInstanceDescRow>
                        <DropBoxContentDescLeft style={{ width: "25%", justifyContent: "center" }}>
                          <DropBoxBoldText style={{ marginBottom: 8, textAlign: "center" }}>
                            클래스
                          </DropBoxBoldText>
                        </DropBoxContentDescLeft>
                        <DropBoxContentDescRight>
                          {selectedObject && ObjectListItem.map((item, index) => {
                            return item.annotation && item.object.id === selectedObject.id ? 
                              <DropBoxNormalText
                                key={index}
                                style={{
                                  marginBottom: 8
                                }}
                              >
                                <Ball style={{ backgroundColor: item.annotation.annotation_category.annotation_category_color }} />
                                {item.annotation.annotation_category.annotation_category_name}
                              </DropBoxNormalText>
                          : null})}
                        </DropBoxContentDescRight>
                      </DropBoxInstanceDescRow>
                      {selectedObject && ObjectListItem.map((item, index) => {
                       return item.annotation && item.object.id === selectedObject.id ?
                          item.annotation.annotation_category.annotation_category_attributes.map((attr, aId) => {
                            return <DropBoxInstanceDescRow
                              key={aId}
                              style={{width:"100%"}}
                            >
                              <DropBoxContentDescLeft style={{ width: "25%", justifyContent: "center" }}>
                                <DropBoxBoldText style={{ marginBottom: 8, textAlign: "center" }}>
                                    {attr.annotation_category_attr_name}
                                </DropBoxBoldText>
                              </DropBoxContentDescLeft>
                              <DropBoxContentDescRight>
                                <DropBoxNormalText style={{ marginBottom: 8 }}>
                                  {
                                    attr.annotation_category_attr_type === 1 ?
                                    attr.annotation_category_attr_val_select? attr.annotation_category_attr_val_select : ""
                                    : attr.annotation_category_attr_type === 2 ?
                                    attr.annotation_category_attr_val_select?.map((val, vId) => {return vId < attr.annotation_category_attr_val_select.length - 1 ? val + ", " : val;})
                                    : attr.annotation_category_attr_type === 3 ?
                                    attr.annotation_category_attr_val_input?.map((val, vId) => {return vId < attr.annotation_category_attr_val_input.length - 1 ? val + ", " : val;})
                                    : attr.annotation_category_attr_val_input?.map((val, vId) => {return vId < attr.annotation_category_attr_val_input.length - 1 ? val + ", " : val;})
                                  }
                                </DropBoxNormalText>
                              </DropBoxContentDescRight>
                            </DropBoxInstanceDescRow>
                          })
                        : null})
                      } 
                    </DropBoxContentDescWrapper>
                  )}
                  {isInstanceOpen && ObjectListItem.length > 0 && (
                    <DropBoxInstanceWrapper>
                      {ObjectListItem.map((item, index) => {
                            return <DropBoxInstanceItem
                          key={index}
                          id={"instance" + item.object.id}
                          style={{
                            borderBottom: 2,
                            borderBottomColor: "#c0c3c7",
                            borderBottomStyle: "solid",
                          }}
                        >
                          <DropBoxTextWrapper onClick={() => setIsClass(index)}>
                            <Icon
                              src={setInstanceIcon(item.object.tool)}
                              style={{ marginLeft: 10, marginRight: 10 }}
                            />
                            <DropBoxNormalText>
                              {"(" + item.object.id + ") " + item.annotation.annotation_category.annotation_category_name}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                          <Icon
                            id={"lockBtn" + index}
                            ref={refBtnLock}
                            src={item.object.selectable ? iconUnLock : iconLock}
                            style={{ marginLeft: 10, marginRight: 5 }}
                            onClick={() => isLock(item.object.id, index)}
                          />
                          <Icon
                            id={"visibleBtn" + index}
                            ref={refBtnVisible}
                            src={item.object.visible ? iconVisible : iconInvisible}
                            style={{ marginLeft: 5, marginRight: 5 }}
                            onClick={() => isVisible(item.object.id, index)}
                          />
                          <div>
                          <Icon
                            id={"deleteBtn" + index}
                            ref={refBtnDelete}
                            src={iconDelete}
                            style={{ marginLeft: 5, marginRight: 5 }}
                            //onClick={checkIsDeleteInstance}
                            onClick={() => isDelete(item.object.id)}
                          /> 
                          {/* <Modal
                            isOpen={isDeleteInstance}
                            onClose={onCancelDelete}
                            title={"Instance 삭제"}
                            onSubmit={() => isDelete(item.object.id)}
                            txtSubmit={"확인"}
                          >
                            <>
                              <BoldText>{"Instance를 삭제하시겠습니까?"}</BoldText>
                            </>
                          </Modal> */}
                          </div>
                        </DropBoxInstanceItem>
                      })}
                    </DropBoxInstanceWrapper>
                  )}
                  {isInstanceOpen && (
                    <DropBoxInstanceDescWrapper
                      style={{
                        borderBottom: 2,
                        borderBottomColor: "#c0c3c7",
                        borderBottomStyle: "solid",
                      }}
                    >
                      <DropBoxInstanceDescRow>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            높이
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            {labelHeight}px<br></br>({labelPerHeight}%)
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            대각선
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            {labelDiag}px<br></br>({labelPerDiag}%)
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                      </DropBoxInstanceDescRow>
                      <DropBoxInstanceDescRow>
                        <DropBoxInstanceDescLeft>
                          <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                            너비
                          </InstanceBoldText>
                        </DropBoxInstanceDescLeft>
                        <DropBoxInstanceDescRight>
                          <InstanceNormalText style={{ marginBottom: 8 }}>
                            {labelWidth}px<br></br>({labelPerWidth}%)
                          </InstanceNormalText>
                        </DropBoxInstanceDescRight>
                        {isInstanceOpen && objectType === "rect" && (
                          <>
                          <DropBoxInstanceDescLeft>
                            <InstanceBoldText style={{ width: 40, marginBottom: 8 }}>
                              위치
                            </InstanceBoldText>
                          </DropBoxInstanceDescLeft>
                          <DropBoxInstanceDescRight>
                            <InstanceNormalText style={{ marginBottom: 8 }}>
                              x: {labelCoordX}px<br></br> y: {labelCoordY}px
                            </InstanceNormalText>
                          </DropBoxInstanceDescRight>
                          </>
                        )}
                      </DropBoxInstanceDescRow>
                    </DropBoxInstanceDescWrapper>
                  )}
                </DropBoxContainer>
                <DropBoxContainer style={{ padding: 0, borderBottom: 0 }}>
                  <DropBoxContentWrapper
                    style={{
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 12,
                      paddingBottom: 12,
                    }}
                  >
                    <DropBoxContentTitle onClick={toggleHistoryOpen}>
                      <Icon
                        src={isHistoryOpen ? arrowDown : arrowUp}
                        style={{ marginRight: 17 }}
                      />
                      <ArrowDropDownText>
                        {`History (${
                          canvasHistory.length
                        })`}
                      </ArrowDropDownText>
                    </DropBoxContentTitle>
                  </DropBoxContentWrapper>
                  {isHistoryOpen && canvasHistory.length > 0 && (
                    <DropBoxInstanceWrapper>
                      {canvasHistory.map((history, index) => {
                            return <DropBoxInstanceItem
                          key={index}
                          id={"history"+index}
                          //_hover={{ bgColor: "#CFD1D4" }}
                          //_focusWithin={{ bgColor: "#CFD1D4" }}
                          onClick={() => selectHistory(index)}
                          style={{
                            borderBottom: 2,
                            borderBottomColor: "#c0c3c7",
                            borderBottomStyle: "solid",
                            flexDirection: "column",
                            padding: "10px 20px",
                          }}
                        >
                          <DropBoxTextWrapper 
                            style={{ 
                              justifyContent: "flex-start", 
                              marginBottom: "5px", 
                            }}
                          >
                            <DropBoxNormalText>
                              {history.order + ": " + history.title}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                          <DropBoxTextWrapper 
                            style={{ justifyContent: "flex-start" }}
                          >
                            <DropBoxNormalText 
                              style={{ 
                                fontSize: "11px",
                                color: "#999999",
                              }}
                            >
                              {history.date}
                            </DropBoxNormalText>
                          </DropBoxTextWrapper>
                        </DropBoxInstanceItem>
                      })}
                    </DropBoxInstanceWrapper>
                  )}
                </DropBoxContainer>
                </MainRightContainer>
              </MainRightUpper>
              <MainRightBottom>
                {selectedTask &&
                !(selectedTask.taskStep === 2 && selectedTask.taskStatus === 3) &&
                (currentUser.id === selectedTask.taskValidator?.id || currentUser.id === selectedTask.taskWorker?.id) &&
                <FinishButton onClick={handleCompleted}>완료</FinishButton>}
                {selectedTask &&
                  currentUser.id !== selectedTask.taskValidator?.id &&
                  currentUser.id !== selectedTask.taskWorker?.id &&
                <FinishButton style={{ cursor: "not-allowed", backgroundColor: "#c0c3c7"}}>완료</FinishButton>}
                {selectedTask &&
                  selectedTask.taskValidator &&
                  selectedTask.taskStep === 2 &&
                  selectedTask.taskValidator.id === currentUser.id && (
                    <>
                      <RejectButton onClick={handleOpenReject}>반려</RejectButton>
                      <Modal
                        isOpen={isOpenReject}
                        onClose={handleCancelReject}
                        title={"반려"}
                        onSubmit={onSubmitReject}
                        txtSubmit={"적용"}
                      >
                        <>
                          <Text as={"b"} color="purple">현재까지 검수 진행한 내용을 포함하여 되돌리시겠습니까?</Text>
                          <Text color="grey">반려사유</Text>
                          <TextArea 
                            placeholder="반려사유를 입력하세요." 
                            rows={5} 
                            autoFocus={false}
                            onChange={handleSetRejectText}
                          />
                        </>
                    </Modal>
                </>
                  )}
              </MainRightBottom>
            </MainRight>
          </Main>
        </StudioWrapper>
      </ChakraProvider>
    </>
  );
};

export default LabelingPresenter;