import React, { ChangeEvent, MouseEventHandler } from "react";
import styled from "styled-components";
import "react-image-crop/dist/ReactCrop.css";
import iconHome from "../../../assets/images/studio/header/icon-home-gray.svg";
import iconLink from "../../../assets/images/studio/header/icon-link-gray.svg";
import iconSave from "../../../assets/images/studio/header/icon-save-gray.svg";
import iconKey from "../../../assets/images/studio/header/icon-key-dark.svg";
import iconCloseStudio from "../../../assets/images/studio/icon/icon-close-studio.svg"
import iconFullScreen from "../../../assets/images/studio/header/icon-fullscreen-gray.svg";
import iconLogout from "../../../assets/images/studio/header/icon-logout-gray.svg";
import iconPrev from "../../../assets/images/studio/header/icon-prev-gray.svg";
import iconNext from "../../../assets/images/studio/header/icon-next-gray.svg";
import iconUndo from "../../../assets/images/studio/header/icon-undo-gray.svg";
import iconDo from "../../../assets/images/studio/header/icon-do-gray.svg";
import iconZoomDec from "../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../assets/images/studio/header/icon-zoom-inc.svg";
import iconOriginal from "../../../assets/images/studio/header/icon-original.svg";
import iconGrayscale from "../../../assets/images/studio/header/icon-grayscale.svg";
import iconGrayscaleSelected from "../../../assets/images/studio/header/icon-grayscale-selected.svg";
import iconThresholding from "../../../assets/images/studio/header/icon-thresholding.svg";
import iconThresholdingSelected from "../../../assets/images/studio/header/icon-thresholding-selected.svg";
import iconZoomInOut from "../../../assets/images/studio/header/icon-zoominout.svg";
import iconZoomInOutSelected from "../../../assets/images/studio/header/icon-zoominout-selected.svg";
import iconRotate from "../../../assets/images/studio/header/icon-rotate.svg";
import iconRotateSelected from "../../../assets/images/studio/header/icon-rotate-selected.svg";
import iconTransfer from "../../../assets/images/studio/header/icon-transfer.svg";
import iconTransferSelected from "../../../assets/images/studio/header/icon-transfer-selected.svg";
import iconBrighten from "../../../assets/images/studio/header/icon-brighten.svg";
import iconBrightenSelected from "../../../assets/images/studio/header/icon-brighten-selected.svg";
import iconCut from "../../../assets/images/studio/header/icon-cut.svg";
import iconCutSelected from "../../../assets/images/studio/header/icon-cut-selected.svg";
import iconNoiseRemove from "../../../assets/images/studio/header/icon-noiseremove.svg";
import iconNoiseRemoveSelected from "../../../assets/images/studio/header/icon-noiseremove-selected.svg";
import iconBackgroundRemove from "../../../assets/images/studio/header/icon-backgroundremove.svg";
import iconBackgroundRemoveSelected from "../../../assets/images/studio/header/icon-backgroundremove-selected.svg";
import iconNonIdentify from "../../../assets/images/studio/header/icon-nonidentify.svg";
import iconNonIdentifySelected from "../../../assets/images/studio/header/icon-nonidentify-selected.svg";
import iconArrowLeft from "../../../assets/images/studio/icon/icon-arrow-left.svg";
import iconArrowRight from "../../../assets/images/studio/icon/icon-arrow-right.svg";
import iconArrowUp from "../../../assets/images/studio/icon/icon-arrow_up.svg";
import iconArrowDown from "../../../assets/images/studio/icon/icon-arrow_down.svg";
import arrowUp from "../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../assets/images/studio/icon/icon-down.svg";
import rejectBtn from "../../../assets/images/studio/reject-text.svg";
import syncBtn from "../../../assets/images/studio/icon/icon-sync.svg";
import syncBtnActive from "../../../assets/images/studio/icon/icon-sync-active.svg";
import { Link } from "react-router-dom";
import {
  Button,
  ChakraProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Kbd,
} from "@chakra-ui/react";
import { RotateType, SymmetryType, TransType } from "./PreProcessingContainer";
import SmallTask from "../../../components/studio/SmallTask";
import Modal from "../../../components/studio/Modal";
import ReactCrop, { Crop } from "react-image-crop";
import { IProjectInfo } from "../../../api/projectApi";
import { IUser } from "../../../api/userApi";
import { ITask, ITaskCommonUser } from "../../../api/taskApi";
import { Helmet } from "react-helmet-async";
import { IUserState } from "../../../redux/user/users";
import Loader from "../../../components/Loader";

interface IPreProcessingPresenter {
  currentUser: IUserState;
  currentDataURL: string | null;
  projectInfo: IProjectInfo | null | undefined;
  isFileSelectorOpen: boolean;
  toggleFileSelector: () => void;
  tasks: ITask[];
  preProcessingAssignee: IUser | undefined;
  projectUser: IUser[];
  _setPreProcessingAssignee: (
    user: IUser
  ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  examinee: IUser | undefined;
  _setExaminee: (
    user: IUser
  ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  isFileInfoOpen: boolean;
  toggleFileInfoOpen: () => void;
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
  onOpenRotateSymmetry: () => void;
  isRotateSymmetry: boolean;
  onSubmitRotateSymmetry: () => void;
  effectLoading: boolean;
  doSymmetry: (type: SymmetryType) => void;
  doRotate: (type: RotateType) => void;
  isCanvasOn: boolean;
  onCancelRotateSymmetry: () => void;
  isThresholding: boolean;
  threshValue: string | null;
  showThresholding: boolean;
  onOpenThresholding: () => void;
  onCancelThresholding: () => void;
  onSubmitThresholding: () => void;
  handleChangeThresholding: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeCaptureThresholding: (e: React.MouseEvent<HTMLInputElement>) => void;
  isGrayscale: boolean;
  afterNoiseRemove: boolean;
  grayscaleVal: string | null;
  handleGrayscaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGrayscale: () => void;
  onCancelGrayscale: () => void;
  onSubmitGrayscale: () => void;
  isBCOpen: boolean;
  brVal: string | null;
  showNoiseRemove: boolean;
  handleBrChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenBC: () => void;
  onCancelBC: () => void;
  onSubmitBC: () => void;
  isResizing: boolean;
  resizingVal: string | null;
  handleResizing: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenResizing: () => void;
  onCancelResizing: () => void;
  onSubmitResizing: () => void;
  crop: Crop | undefined;
  setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  startCrop: boolean;
  handleCrop: (e: PointerEvent) => void;
  toggleCrop: () => void;
  isOpenRemoveBg: boolean;
  removedBgImage: any;
  removeBgLoading: boolean;
  doRemoveBg: () => Promise<void>;
  onOpenRemoveBg: () => void;
  onCancelRemoveBg: () => void;
  onSubmitRemoveBg: () => void;
  startBlurCrop: boolean;
  cropBlurPart: Crop | undefined;
  setCropBlurPart: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  toggleBlurCrop: () => void;
  handleBlurCrop: () => Promise<void>;
  isNoiseRemove: boolean;
  onOpenNoiseRemove: () => void;
  onCancelNoiseRemove: () => void;
  onSubmitNoiseRemove: () => void;
  noiseRemove: () => void;
  onOriginalImage: () => void;
  handleDownloadImage: () => void;
  handleToggleFullScreen: () => void;
  handleUnDo: () => void;
  handleRedo: () => void;
  saveImage: () => Promise<void>;
  isTransform: boolean;
  transType: TransType;
  scaleX: string;
  scaleY: string;
  translationXY: { x: number; y: number };
  handleLeftTX: () => void;
  handleRightTX: () => void;
  handleUpTX: () => void;
  handleDownTX: () => void;
  handleChangeScaleX: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeScaleY: (e: ChangeEvent<HTMLInputElement>) => void;
  cleanTransformEffect: () => void;
  handleTransTypeToTranslation: () => void;
  handleTransTypeToScale: () => void;
  onOpenTransform: () => void;
  onCancelTransform: () => void;
  onSubmitTransform: () => void;
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
  refPicker: any;
  onMoveToToolsLeft: () => void;
  onMoveToToolsRight: () => void;
  conVal:string;
  handleContrastChange:(e: ChangeEvent<HTMLInputElement>) => void;
  scaleRatio:string;
  scaleRatioVal:string;
  handleChangeResizingScale:(e: ChangeEvent<HTMLInputElement>) => void;
  onSubmitResizingScale:() => void;
  isRow: boolean;
  handleScaleToResizing:() => void;
  isScaleToResizing: boolean;
  setKeyOnOff: () => void;
  isKeyOnOff: boolean;
  valueX: string;
  valueY: string;
}

const StudioWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #c0c3c7;
  font-family: NanumSquare;
`;
const StudioHeader = styled.div`
  height: 70px;
  width: 100%;
  left: 0;
  top: 0;
  background-color: #e2e4e7;
  display: flex;
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
`;
const HeaderCenterImageTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  margin-top: 10px;
  line-height: 20px;
  color: #5f6164;
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
const MainLeft = styled.div`
  width: 100px;
  height: 100%;
  background-color: #e2e4e7;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LeftItemContainer = styled.div`
  width: 70px;
  height: 59px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 7px;
  cursor: pointer;
`;
const LeftItemText = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  margin-top: 11.02px;
  color: #5f6164;
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
  text-overflow: ellipsis;
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
  isRow: boolean;
  resizingVal?: string | null;
  scaleRatioVal?: string | null;
}>`
  width: ${(props) =>
    props.isRow?
    props.isFileSelectorOpen
      ? props.resizingVal
        ? props.scaleRatioVal
        ? `${(parseInt("810") + (parseInt(props.resizingVal) - 100)) * parseFloat(props.scaleRatioVal)}px`
        : `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
        : "810px"
      : props.resizingVal
        ? props.scaleRatioVal
        ? `${(parseInt("900") + (parseInt(props.resizingVal) - 100)) * parseFloat(props.scaleRatioVal)}px`
        : `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
      : "900px"
    : "auto"};
  height: ${(props) =>
    !props.isRow?
    props.isFileSelectorOpen
      ? props.resizingVal
        ? props.scaleRatioVal
        ? `${(parseInt("540") + (parseInt(props.resizingVal) - 100)) * parseFloat(props.scaleRatioVal)}px`
        : `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
        : "540px"
      : props.resizingVal
        ? props.scaleRatioVal
        ? `${(parseInt("540") + (parseInt(props.resizingVal) - 100)) * parseFloat(props.scaleRatioVal)}px`
        : `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
        : "600px"
      : "auto"};
`;
const MainCenterBottom = styled.div`
  width: 100%;
  height: 50px;
  padding: 0 40px;
  background-color: #e2e4e7;
  border-width: 1px 0 1px 1px;
  border-style: solid;
  border-color: #c0c3c7;
  display: flex;
  align-items: center;
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
`;
/* const MainCenterImagePicker = styled.div`
  display: flex;
  width: 100%;
  height: 160px;
  padding: 0 20px;
  background-color: #e2e4e7;
  border-left: 1px solid #c0c3c7;
  overflow-x: scroll;
`; */
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
`;
const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  overflow-x: hidden;
`;
const DropBoxContentWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #c0c3c7;
`;
const DropBoxContentTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const DropBoxContentDescWrapper = styled.div`
  padding: 20px;
  display: flex;
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
const EffectValueContainer = styled.div`
  width: 80%;
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
const RotatesSymmetryContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const RotateSymmetryCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 30px;
  cursor: pointer;
`;
const TransfromUpperContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: -40px;
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

const TransFormCenterContainer = styled.div`
  margin-top: 15px;
  display: flex;
  width: 100%;
`;
const TransFormImageWrapper = styled.div`
  width: 400px;
  height: auto;
  background-color: black;
  overflow: hidden;
`;
const NoiseRemoveFormCenterContainer = styled.div`
  margin-top: 15px;
  display: flex;
  width: 100%;
  max-width: 100%;
`;
const NoiseRemoveFormImageWrapper = styled(TransFormImageWrapper)``;
const NoiseRemoveBeforeImg = styled.img`
  width: 400px;
  height: auto;
`;
const TransFormTempImg = styled.img<{
  tXY: { x: number; y: number };
  sX: number;
  sY: number;
}>`
  width: 400px;
  height: auto;
  transition: transform 0.2s linear;
  transform: ${(props) =>
    `translate(${props.tXY.x}px, ${props.tXY.y}px) scale(${props.sX}, ${
      props.sY
    })`};
  //transform: ${(props) => ``};
`;
const TransFormBottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;
const TransFormButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  color: #243654;
  :focus {
    user-select: none;
  }
`;
const TransFormSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
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
const TextBox = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
`;
const Canvas = styled.canvas<{ isFileSelectorOpen: boolean }>``;

const PreProcessingPresenter: React.FC<IPreProcessingPresenter> = ({
  currentUser,
  currentDataURL,
  projectInfo,
  isFileSelectorOpen,
  tasks,
  preProcessingAssignee,
  projectUser,
  examinee,
  isFileInfoOpen,
  workStatutes,
  selectedTask,
  loading,
  isFirst,
  isRotateSymmetry,
  effectLoading,
  isCanvasOn,
  isThresholding,
  threshValue,
  showThresholding,
  isGrayscale,
  grayscaleVal,
  isBCOpen,
  brVal,
  isResizing,
  resizingVal,
  crop,
  startCrop,
  isOpenRemoveBg,
  removedBgImage,
  removeBgLoading,
  startBlurCrop,
  cropBlurPart,
  isNoiseRemove,
  isTransform,
  transType,
  scaleX,
  scaleY,
  translationXY,
  isOpenReject,
  showRejectComment,
  rejectComment,
  showNoiseRemove,
  afterNoiseRemove,
  refPicker,
  conVal,
  scaleRatio,
  scaleRatioVal,
  isRow,
  isScaleToResizing,
  isKeyOnOff,
  valueX,
  valueY,
  setKeyOnOff,
  handleScaleToResizing,
  handleChangeResizingScale,
  onSubmitResizingScale,
  handleContrastChange,
  onMoveToToolsLeft,
  onMoveToToolsRight,
  handleOpenReject,
  handleCancelReject,
  _setPreProcessingAssignee,
  _setExaminee,
  toggleFileInfoOpen,
  _setWorkStatutes,
  _setSelectedTask,
  handlePrevTask,
  handleNextTask,
  onOpenRotateSymmetry,
  onSubmitRotateSymmetry,
  doSymmetry,
  onCancelRotateSymmetry,
  doRotate,
  onOpenThresholding,
  onCancelThresholding,
  onSubmitThresholding,
  handleChangeThresholding,
  onChangeCaptureThresholding,
  handleGrayscaleChange,
  onOpenGrayscale,
  onCancelGrayscale,
  onSubmitGrayscale,
  handleBrChange,
  onOpenBC,
  onCancelBC,
  toggleFileSelector,
  onSubmitBC,
  handleResizing,
  onOpenResizing,
  onCancelResizing,
  onSubmitResizing,
  setCrop,
  handleCrop,
  toggleCrop,
  doRemoveBg,
  onOpenRemoveBg,
  onCancelRemoveBg,
  onSubmitRemoveBg,
  setCropBlurPart,
  toggleBlurCrop,
  handleBlurCrop,
  onOpenNoiseRemove,
  onCancelNoiseRemove,
  onSubmitNoiseRemove,
  noiseRemove,
  onOriginalImage,
  handleDownloadImage,
  handleToggleFullScreen,
  handleUnDo,
  handleRedo,
  saveImage,
  handleLeftTX,
  handleRightTX,
  handleUpTX,
  handleDownTX,
  handleChangeScaleX,
  handleChangeScaleY,
  cleanTransformEffect,
  handleTransTypeToTranslation,
  handleTransTypeToScale,
  onOpenTransform,
  onCancelTransform,
  onSubmitTransform,
  goBack,
  handleCompleted,
  onSubmitReject,
  handleSetRejectText,
  handleShowRejctHelp,
  handleCancelRejectComment,
}) => {
  return (
    <>
      <ChakraProvider>
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
                  style={{ width: 20, height: 17 }}
                />
              </NavLink>
              <NavButton
                style={{ cursor: "pointer" }}
                onClick={handleDownloadImage}
              >
                <Icon
                  src={iconLink}
                  alt="icon-download"
                  style={{ width: 17.38, height: 17.67 }}
                />
              </NavButton>
              {selectedTask &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ?
                <NavButton style={{ cursor: "pointer" }} onClick={saveImage}>
                  <Icon
                    src={iconSave}
                    alt="icon-home"
                    style={{ width: 18, height: 18 }}
                  />
              </NavButton> : <NavButton style={{ cursor: "not-allowed" }}>
                  <Icon
                    src={iconSave}
                    alt="icon-home"
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
              <NavButton>
                <Icon
                  src={iconLogout}
                  alt="icon-home"
                  onClick={goBack}
                  style={{ width: 20, height: 18, cursor: "pointer" }}
                />
              </NavButton>
            </HeaderLeft>
            <HeaderCenter>
              <HeaderCenterLeft />
              <HeaderCenterRight>
                <Icon
                  src={iconPrev}
                  style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                  onClick={
                    selectedTask
                      ? () => handlePrevTask(selectedTask.taskId)
                      : undefined
                  }
                />
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
                  onClick={
                    selectedTask
                      ? () => handleNextTask(selectedTask.taskId)
                      : undefined
                  }
                />
                <ProgressContainer>
                  <ProgressTextBox>
                    <BoldText>작업단계</BoldText>
                  </ProgressTextBox>
                  <Divider style={{ marginLeft: 4 }} />
                  <ProgressTextBox>
                    <NormalText>{selectedTask && selectedTask.taskStep === 1 ? "전처리" : "검수"}</NormalText>
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
                              onClick={handleShowRejctHelp} 
                        />
                        <Modal
                        isOpen={showRejectComment}
                        onClose={handleCancelRejectComment}
                        title={"반려사유"}
                        onSubmit={onSubmitReject}
                        txtSubmit={"적용"}
                        noSubmit={true}
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
                  type={"range"}
                  min={0}
                  max={200}
                  defaultValue={resizingVal === null ? "100" : resizingVal}
                  onChange={handleResizing}
                />
                <Icon src={iconZoomInc} />
              </ZoomBox>
            </HeaderRight>
          </StudioHeader>
          <Main>
            <MainLeft>
              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? 
                <LeftItemContainer onClick={onOriginalImage}>
                <Icon src={iconOriginal} />
                <LeftItemText>원본 이미지</LeftItemText>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon src={iconOriginal} />
                <LeftItemText>원본 이미지</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ?  
                <LeftItemContainer onClick={onOpenGrayscale}>
                <Icon
                  src={isGrayscale ? iconGrayscaleSelected : iconGrayscale}
                />
                <LeftItemText>그레이스케일</LeftItemText>
                <Modal
                  isOpen={isGrayscale}
                  onClose={onCancelGrayscale}
                  title={"그레이스케일"}
                  onSubmit={onSubmitGrayscale}
                  txtSubmit={"적용"}
                >
                  <>
                    <EffectValueContainer>
                      <EffectValue>
                        {grayscaleVal ? grayscaleVal : 0}%
                      </EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={100}
                        defaultValue={
                          grayscaleVal === null ? "0" : grayscaleVal
                        }
                        style={{ width: "100%" }}
                        onChange={handleGrayscaleChange}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={isGrayscale ? iconGrayscaleSelected : iconGrayscale}
                />
                <LeftItemText>그레이스케일</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenThresholding}>
                <Icon
                  src={
                    isThresholding ? iconThresholdingSelected : iconThresholding
                  }
                />
                <LeftItemText>이진화</LeftItemText>
                <Modal
                  isOpen={isThresholding}
                  onClose={onCancelThresholding}
                  title={"이진화"}
                  onSubmit={onSubmitThresholding}
                  txtSubmit={"적용"}
                >
                  <>
                    <EffectValueContainer>
                      <EffectValue>{threshValue ? threshValue : 0}</EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={255}
                        defaultValue={threshValue === null ? "0" : threshValue}
                        style={{ width: "100%" }}
                        onChange={handleChangeThresholding}
                        onMouseUp={onChangeCaptureThresholding}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={
                    isThresholding ? iconThresholdingSelected : iconThresholding
                  }
                />
                <LeftItemText>이진화</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenResizing}>
                <Icon
                  src={isResizing ? iconZoomInOutSelected : iconZoomInOut}
                />
                <LeftItemText>스케일링</LeftItemText>
                <Modal
                  isOpen={isResizing}
                  onClose={onCancelResizing}
                  title={"스케일링"}
                  onSubmit={onSubmitResizingScale}
                  txtSubmit={"적용"}
                >
                  <>
                    {/* <EffectValueContainer>
                      <EffectValue>
                        {scaleRatio ? parseFloat(scaleRatio) * 100 : 100}%
                      </EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={200}
                        value={
                          scaleRatio === null ? "100" : parseFloat(scaleRatio) * 100
                        }
                        style={{ width: "100%" }}
                        onChange={handleChangeResizingScale}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox> */}
                    <TransFormCenterContainer style={{ margin: "5px 0" }}>
                      {selectedTask ? (
                        <TransFormImageWrapper>
                          <TransFormTempImg
                            id={"transformImg"}
                            tXY={translationXY}
                            sX={parseFloat(scaleX) || 1}
                            sY={parseFloat(scaleY) || 1}
                            src={
                              currentDataURL
                                ? currentDataURL
                                : selectedTask.image
                            }
                          />
                        </TransFormImageWrapper>
                      ) : (
                        <Spinner />
                      )}
                    </TransFormCenterContainer>
                    <TransFormBottomContainer style={{ margin: "5px 0" }}>
                      <TransFormSection style={{ width:"auto" }}>
                        <NormalText style={{ margin: "0 10px" }}>X:</NormalText>
                        <Input
                          onChange={handleChangeScaleX}
                          value={valueX}
                          type={"text"}
                          placeholder={"1.0"}
                          style={{ margin: "0 10px", maxWidth: "100px" }}
                        />
                      </TransFormSection>
                      <RoundedButton
                        onClick={handleScaleToResizing}
                        isSelected={isScaleToResizing}
                        style={{ width:"60px", height:"100%", margin: "0 10px", padding: "2px" }}
                      >
                        <Icon src={isScaleToResizing?syncBtnActive:syncBtn} style={{ width:"25px", height:"25px" }} />
                      </RoundedButton>
                      <TransFormSection style={{ width:"auto" }}>
                        <NormalText style={{ margin: "0 10px" }}>Y:</NormalText>
                        <Input
                          type={"text"}
                          placeholder={"1.0"}
                          onChange={handleChangeScaleY}
                          value={valueY}
                          style={{ margin: "0 10px", maxWidth: "100px" }}
                        />
                      </TransFormSection>
                    </TransFormBottomContainer>
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={isResizing ? iconZoomInOutSelected : iconZoomInOut}
                />
                <LeftItemText>스케일링</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenRotateSymmetry}>
                <Icon
                  src={isRotateSymmetry ? iconRotateSelected : iconRotate}
                />
                <LeftItemText>회전 / 대칭</LeftItemText>
                <Modal
                  isOpen={isRotateSymmetry}
                  onClose={onCancelRotateSymmetry}
                  title={"회전 / 대칭"}
                  onSubmit={onSubmitRotateSymmetry}
                  txtSubmit={"적용"}
                  loading={effectLoading}
                >
                  <>
                    <RotatesSymmetryContainer style={{ marginBottom: 60 }}>
                      <RotateSymmetryCard onClick={() => doRotate("ROTATE_90")}>
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          90도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doRotate("ROTATE_180")}
                      >
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          180도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doRotate("ROTATE_270")}
                      >
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          270도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doRotate("ROTATE_360")}
                      >
                        <Icon src={iconRotate} />
                        <NormalText style={{ fontSize: "10px" }}>
                          360도 회전
                        </NormalText>
                      </RotateSymmetryCard>
                    </RotatesSymmetryContainer>
                    <RotatesSymmetryContainer>
                      <RotateSymmetryCard
                        onClick={() => doSymmetry("HORIZONTAL")}
                      >
                        <Icon src={iconTransfer} />
                        <NormalText style={{ fontSize: "10px" }}>
                          좌우 대칭
                        </NormalText>
                      </RotateSymmetryCard>
                      <RotateSymmetryCard
                        onClick={() => doSymmetry("VERTICAL")}
                      >
                        <Icon src={iconTransfer} />
                        <NormalText style={{ fontSize: "10px" }}>
                          상하 대칭
                        </NormalText>
                      </RotateSymmetryCard>
                    </RotatesSymmetryContainer>
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={isRotateSymmetry ? iconRotateSelected : iconRotate}
                />
                <LeftItemText>회전 / 대칭</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenTransform}>
                <Icon src={isTransform ? iconTransferSelected : iconTransfer} />
                <LeftItemText>트랜스레이션</LeftItemText>
                <Modal
                  isOpen={isTransform}
                  onClose={onCancelTransform}
                  title={"트랜스레이션"}
                  onSubmit={onSubmitTransform}
                  txtSubmit={"적용"}
                  loading={effectLoading}
                >
                  <>
                    {/* <TransfromUpperContainer>
                      <RoundedButton
                        onClick={handleTransTypeToTranslation}
                        isSelected={transType === TransType.translation}
                      >
                        트랜스레이션
                      </RoundedButton>
                      <RoundedButton
                        onClick={handleTransTypeToScale}
                        isSelected={transType === TransType.scale}
                      >
                        스케일링
                      </RoundedButton>
                    </TransfromUpperContainer> */}
                    <TransFormCenterContainer>
                      {selectedTask ? (
                        <TransFormImageWrapper>
                          <TransFormTempImg
                            id={"transformImg"}
                            tXY={translationXY}
                            sX={parseFloat(scaleX) || 1}
                            sY={parseFloat(scaleY) || 1}
                            src={
                              currentDataURL
                                ? currentDataURL
                                : selectedTask.image
                            }
                          />
                        </TransFormImageWrapper>
                      ) : (
                        <Spinner />
                      )}
                    </TransFormCenterContainer>
                    {transType === TransType.translation && (
                      <TransFormBottomContainer>
                        <TransFormButton
                          style={{ width: 70 }}
                          onClick={cleanTransformEffect}
                        >
                          초기화
                        </TransFormButton>
                        <TransFormButton onClick={handleLeftTX}>
                          <Icon
                            src={iconArrowLeft}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                        <TransFormButton onClick={handleRightTX}>
                          <Icon
                            src={iconArrowRight}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                        <TransFormButton onClick={handleUpTX}>
                          <Icon
                            src={iconArrowUp}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                        <TransFormButton onClick={handleDownTX}>
                          <Icon
                            src={iconArrowDown}
                            style={{ userSelect: "none" }}
                          />
                        </TransFormButton>
                      </TransFormBottomContainer>
                    )}
                    {transType === TransType.scale && (
                      <>
                        <TransFormBottomContainer>
                          <TransFormSection>
                            <NormalText>X:</NormalText>
                            <Input
                              onChange={handleChangeScaleX}
                              value={scaleX}
                              type={"text"}
                              placeholder={"1.0"}
                            />
                          </TransFormSection>
                        </TransFormBottomContainer>
                        <TransFormBottomContainer>
                          <TransFormSection>
                            <NormalText>Y:</NormalText>
                            <Input
                              type={"text"}
                              placeholder={"1.0"}
                              onChange={handleChangeScaleY}
                              value={scaleY}
                            />
                          </TransFormSection>
                        </TransFormBottomContainer>
                      </>
                    )}
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon src={isTransform ? iconTransferSelected : iconTransfer} />
                <LeftItemText>트랜스레이션</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenBC}>
                <Icon src={isBCOpen ? iconBrightenSelected : iconBrighten} />
                <LeftItemText>밝기 / 대비</LeftItemText>
                <Modal
                  isOpen={isBCOpen}
                  onClose={onCancelBC}
                  title={"밝기 / 대비"}
                  onSubmit={onSubmitBC}
                  txtSubmit={"적용"}
                  loading={effectLoading}
                >
                  <>
                  <TextBox>
                  <NormalText style={{ fontSize: "13px" }}>
                          밝기
                  </NormalText>
                  </TextBox>
                    <EffectValueContainer>
                      <EffectValue>{brVal ? brVal : 100}%</EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={200}
                        defaultValue={brVal === null ? "100" : brVal}
                        style={{ width: "100%" }}
                        onChange={handleBrChange}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                    <VerticalDivider style={{ height: "80px" }}/>
                    <TextBox>
                  <NormalText style={{ fontSize: "13px" }}>
                          대비
                  </NormalText>
                  </TextBox>
                    <EffectValueContainer>
                      <EffectValue>{conVal ? conVal : 100}%</EffectValue>
                    </EffectValueContainer>
                    <ZoomBox style={{ width: "80%" }}>
                      <Icon src={iconZoomDec} />
                      <ZoomInput
                        type={"range"}
                        min={0}
                        max={200}
                        defaultValue={conVal === null ? "100" : conVal}
                        style={{ width: "100%" }}
                        onChange={handleContrastChange}
                      />
                      <Icon src={iconZoomInc} />
                    </ZoomBox>
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon src={isBCOpen ? iconBrightenSelected : iconBrighten} />
                <LeftItemText>밝기 / 대비</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={toggleCrop}>
                <Icon src={startCrop ? iconCutSelected : iconCut} />
                <LeftItemText>자르기</LeftItemText>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon src={startCrop ? iconCutSelected : iconCut} />
                <LeftItemText>자르기</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenNoiseRemove}>
                <Icon
                  src={
                    isNoiseRemove ? iconNoiseRemoveSelected : iconNoiseRemove
                  }
                />
                <LeftItemText>노이즈 제거</LeftItemText>
                <Modal
                  isOpen={isNoiseRemove}
                  onClose={onCancelNoiseRemove}
                  title={"노이즈 제거"}
                  onSubmit={onSubmitNoiseRemove}
                  txtSubmit={"적용"}
                  removeEffect={true}
                  removeEffectFn={afterNoiseRemove ? undefined : noiseRemove}
                >
                  <>
                    <NoiseRemoveFormCenterContainer>
                    {selectedTask ? (
                        <NoiseRemoveFormImageWrapper>
                          <NoiseRemoveBeforeImg
                            id={"noiseRemoveImg"}
                            style={{ display: showNoiseRemove ? "none" : "block" }}
                            src={
                              currentDataURL
                                ? currentDataURL
                                : selectedTask.image
                            }
                          />
                          {isNoiseRemove && (
                            <Canvas
                              id={"noiseRemoveCanvas"}
                              isFileSelectorOpen={isFileSelectorOpen}
                              style={{ display: showNoiseRemove ? "block" : "none" }}
                            />
                          )}
                        </NoiseRemoveFormImageWrapper>
                      ) : (
                        <Spinner />
                      )}
                    </NoiseRemoveFormCenterContainer>
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={
                    isNoiseRemove ? iconNoiseRemoveSelected : iconNoiseRemove
                  }
                />
                <LeftItemText>노이즈 제거</LeftItemText>
              </LeftItemContainer>}

              {selectedTask && !startBlurCrop &&
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={onOpenRemoveBg}>
                <Icon
                  src={
                    isOpenRemoveBg
                      ? iconBackgroundRemoveSelected
                      : iconBackgroundRemove
                  }
                />
                <LeftItemText>배경 제거</LeftItemText>
                <Modal
                  isOpen={isOpenRemoveBg}
                  onClose={onCancelRemoveBg}
                  title={"배경 제거"}
                  onSubmit={onSubmitRemoveBg}
                  txtSubmit={"적용"}
                  loading={effectLoading}
                  removeEffect={true}
                  removeEffectFn={doRemoveBg}
                >
                  <>
                    {removeBgLoading && (
                      <ZoomBox style={{ width: "80%" }}>
                        <Spinner />
                      </ZoomBox>
                    )}
                  </>
                </Modal>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={
                    isOpenRemoveBg
                      ? iconBackgroundRemoveSelected
                      : iconBackgroundRemove
                  }
                />
                <LeftItemText>배경 제거</LeftItemText>
              </LeftItemContainer>} 

              {selectedTask && 
               (selectedTask.taskWorker?.id === currentUser.id ||
                selectedTask.taskValidator?.id === currentUser.id) ? <LeftItemContainer onClick={toggleBlurCrop}>
                <Icon
                  src={
                    startBlurCrop ? iconNonIdentifySelected : iconNonIdentify
                  }
                />
                <LeftItemText>비식별화</LeftItemText>
              </LeftItemContainer> : <LeftItemContainer style={{ cursor: "not-allowed"}}>
                <Icon
                  src={
                    startBlurCrop ? iconNonIdentifySelected : iconNonIdentify
                  }
                />
                <LeftItemText>비식별화</LeftItemText>
              </LeftItemContainer>}
            </MainLeft>
            <MainCenterWrapper>
              <MainCenterUpper
                id={"mainCenterUpper"}
                isFileSelectorOpen={isFileSelectorOpen}
              >
                {/*//! 아래는 데이터를 서버로부터 받으면 화면 중앙에 뿌려주는 이미지 */}
                {selectedTask &&
                  !startCrop &&
                  !showThresholding &&
                  !removedBgImage &&
                  !startBlurCrop &&
                  (currentDataURL ? (
                    <MainImage
                      id={"mainImage"}
                      isFileSelectorOpen={isFileSelectorOpen}
                      isRow={isRow}
                      resizingVal={resizingVal}
                      scaleRatioVal={scaleRatioVal}
                      style={{
                        display: isCanvasOn ? "none" : "block",
                        filter:
                          grayscaleVal !== null
                            ? `grayscale(${grayscaleVal}%)`
                            : (brVal !== null && conVal !== null)
                            ? `brightness(${brVal}%) contrast(${conVal}%)`
                            : undefined || brVal !== null
                            ? `brightness(${brVal}%)`
                            : undefined || conVal !== null
                            ? `contrast(${conVal}%)`
                            : undefined
                      }}
                      src={currentDataURL ? currentDataURL : selectedTask.image}
                    />
                  ) : (
                    <Spinner />
                  ))}

                {/*//! 이진화 작업 시 작업에 대한 결과를 Canvas에 잠시 뿌려주고 팝업의 취소 또는 적용 버튼 클릭 시 disappeared */}
                {isThresholding && (
                  <Canvas
                    id={"thCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    style={{ display: showThresholding ? "block" : "none" }}
                  />
                )}

                {/*//! 회전/대칭 작업 시 작업에 대한 결과를 Canvas에 잠시 뿌려주고 팝업의 취소 또는 적용 버튼 클릭 시 disappeared */}
                {isRotateSymmetry && (
                  <Canvas
                    id={"rsCanvas"}
                    isFileSelectorOpen={isFileSelectorOpen}
                    style={{ display: isCanvasOn ? "block" : "none" }}
                  />
                )}

                {/*//! 자르기를 실행하면 이 부분이 화면에 뿌려짐, 자른 후 호출되는 handleCrop이 끝나면 disappeared */}
                {selectedTask && startCrop && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onDragEnd={handleCrop}
                  >
                    <MainImage
                      id={"cropImage"}
                      src={currentDataURL ? currentDataURL : selectedTask.image}
                      isFileSelectorOpen={isFileSelectorOpen}
                      isRow={isRow}
                      resizingVal={resizingVal}
                    />
                  </ReactCrop>
                )}

                {/*//! 비식별화를 실행하면 이 부분이 화면에 뿌려짐, 비식별할 부분을 드래그한 후 호출되는 handleBlurCrop이 끝나면 disappeared */}
                {selectedTask && startBlurCrop && (
                  <ReactCrop
                    crop={cropBlurPart}
                    onChange={(c) => setCropBlurPart(c)}
                    onDragEnd={handleBlurCrop}
                  >
                    <MainImage
                      id={"cropBlurImage"}
                      src={currentDataURL ? currentDataURL : selectedTask.image}
                      isFileSelectorOpen={isFileSelectorOpen}
                      isRow={isRow}
                      resizingVal={resizingVal}
                    />
                  </ReactCrop>
                )}

                {/*//! 배경제거를 하면 배경제거가 된 이미지를 보여주기 위해 잠시 노출시킨 후 취소 또는 적용 버튼을 누르면 disappeared */}
                {removedBgImage && (
                  <MainImage
                    style={{
                      border: 1,
                      borderColor: "#e2e4e7",
                      borderStyle: "solid",
                    }}
                    src={removedBgImage.src}
                    isFileSelectorOpen={isFileSelectorOpen}
                    isRow={isRow}
                    resizingVal={resizingVal}
                  />
                )}
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
                        </HotKeyContent>
                      </HotKeyWrapper>
                    </HotKeyPopup>
                  </>
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
                    {loading && isFirst ? (
                      <SpinnerWrapper>
                        <Spinner speed="0.35s" />
                      </SpinnerWrapper>
                    ) : (
                      <>
                        <ImagePickerListContainer>
                          {workStatutes === "전체" &&
                            tasks.map((task, index) => {
                              if (selectedTask &&
                                task.taskId === selectedTask.taskId)
                                return (
                                  <ImageWrapper
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
                            })}
                          {workStatutes === "미작업" &&
                            tasks
                              .filter((t) => t.taskStatus === 1)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
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
                              })}
                          {workStatutes === "진행중" &&
                            tasks
                              .filter((t) => t.taskStatus === 2)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
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
                              })}
                          {workStatutes === "완료" &&
                            tasks
                              .filter((t) => t.taskStatus === 3)
                              .map((task, index) => {
                                if (selectedTask &&
                                  task.taskId === selectedTask.taskId)
                                  return (
                                    <ImageWrapper
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
                              })}
                          {workStatutes === "반려" &&
                            tasks
                              .filter((t) => t.taskStatus === 4)
                              .map((task, index) => {
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
              {/* {isFileSelectorOpen && (
                <MainCenterImagePicker>
                  {loading && isFirst ? (
                    <SpinnerWrapper>
                      <Spinner speed="0.35s" />
                    </SpinnerWrapper>
                  ) : (
                    <>
                      <PickedImageContainer>
                        {selectedTask && workStatutes === "전체" ? (
                          <SmallTask task={selectedTask} isSelected={true} />
                        ) : (
                          selectedTask &&
                          selectedTask.taskStatusName === workStatutes && (
                            <SmallTask task={selectedTask} isSelected={true} />
                          )
                        )}
                      </PickedImageContainer>
                      <ImagePickerListContainer>
                        {workStatutes === "전체" &&
                          tasks.map((task, index) => {
                            if (
                              selectedTask &&
                              task.taskId === selectedTask.taskId
                            )
                              return null;
                            return (
                              <NonPickedImageWrapper
                                onClick={() => _setSelectedTask(task)}
                                key={index}
                                style={{ cursor: "pointer" }}
                              >
                                <SmallTask task={task} isSelected={false} />
                              </NonPickedImageWrapper>
                            );
                          })}
                        {workStatutes === "미작업" &&
                          tasks
                            .filter((t) => t.taskStatus === 1)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                        {workStatutes === "진행중" &&
                          tasks
                            .filter((t) => t.taskStatus === 2)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                        {workStatutes === "완료" &&
                          tasks
                            .filter((t) => t.taskStatus === 3)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                        {workStatutes === "반려" &&
                          tasks
                            .filter((t) => t.taskStatus === 4)
                            .map((task, index) => {
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return null;
                              return (
                                <NonPickedImageWrapper
                                  onClick={() => _setSelectedTask(task)}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask task={task} isSelected={false} />
                                </NonPickedImageWrapper>
                              );
                            })}
                      </ImagePickerListContainer>
                    </>
                  )}
                </MainCenterImagePicker> 
              )} */}
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
                            <DropBoxBoldText>전처리 담당자</DropBoxBoldText>
                            <Divider
                              style={{ marginLeft: 8, marginRight: 8 }}
                            />
                            <DropBoxNormalText>
                              {preProcessingAssignee
                                ? preProcessingAssignee.userDisplayName
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
                        >
                          {projectUser &&
                            projectUser.length > 0 &&
                            projectUser.map((user, index) => {
                              if (user === preProcessingAssignee) return null;
                              return (
                                <MenuItem
                                  key={index}
                                  _hover={{ bgColor: "#CFD1D4" }}
                                  _focusWithin={{ bgColor: "#CFD1D4" }}
                                  onClick={() =>
                                    _setPreProcessingAssignee(user)
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
                      <ArrowDropDownText>File</ArrowDropDownText>
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
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          파일크기
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 8 }}>
                          용량
                        </DropBoxBoldText>
                      </DropBoxContentDescLeft>
                      <DropBoxContentDescRight>
                        <DropBoxNormalText style={{ marginBottom: 8 }}>
                          {selectedTask &&
                          selectedTask.imageWidth &&
                          selectedTask.imageHeight
                            ? `${selectedTask.imageWidth}px*${
                                selectedTask.imageHeight
                              }px`
                            : "900px*1600px"} 
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

export default PreProcessingPresenter;
