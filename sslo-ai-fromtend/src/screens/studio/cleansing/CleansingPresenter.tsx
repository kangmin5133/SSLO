import React, { ChangeEvent, MouseEventHandler } from "react";
import styled from "styled-components";
import "react-image-crop/dist/ReactCrop.css";
import iconHome from "../../../assets/images/studio/header/icon-home-gray.svg";
import iconLink from "../../../assets/images/studio/header/icon-link-gray.svg";
import iconSave from "../../../assets/images/studio/header/icon-save-gray.svg";
import iconFullScreen from "../../../assets/images/studio/header/icon-fullscreen-gray.svg";
import iconLogout from "../../../assets/images/studio/header/icon-logout-gray.svg";
import iconPrev from "../../../assets/images/studio/header/icon-prev-gray.svg";
import iconNext from "../../../assets/images/studio/header/icon-next-gray.svg";
import iconUndo from "../../../assets/images/studio/header/icon-undo-gray.svg";
import iconDo from "../../../assets/images/studio/header/icon-do-gray.svg";
import iconZoomDec from "../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../assets/images/studio/header/icon-zoom-inc.svg";
import arrowUp from "../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../assets/images/studio/icon/icon-down.svg";
import iconArrowLeft from "../../../assets/images/studio/icon/icon-arrow-left.svg";
import iconArrowRight from "../../../assets/images/studio/icon/icon-arrow-right.svg";
import iconPause from "../../../assets/images/studio/icon/icon-pause.svg";
import iconPlay from "../../../assets/images/studio/icon/icon-play.svg";
import iconReject from "../../../assets/images/studio/icon/icon-reject.svg";
import iconStop from "../../../assets/images/studio/icon/icon-stop.svg";
import iconAuto from "../../../assets/images/studio/icon/icon-autoselect.svg";
import iconAuto_active from "../../../assets/images/studio/icon/icon-autoselect_active.svg";
import keyboardReturn from "../../../assets/images/studio/icon/keyboardReturn.svg";
import { Link } from "react-router-dom";
import Modal from "../../../components/studio/Modal";
import {
  Button,
  ChakraProvider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Progress,
  Image,
  Text,
} from "@chakra-ui/react";
import SmallTask from "../../../components/studio/SmallTask";
import { IProjectInfo } from "../../../api/projectApi";
import { ITask } from "../../../api/taskApi";
import { Helmet } from "react-helmet-async";
import { IUserState } from "../../../redux/user/users";

interface ICollectInspectionPresenter {
  currentUser: IUserState;
  checkSelectedIndex: any[];
  currentDataURL: string | null;
  projectInfo: IProjectInfo | null | undefined;
  isFileSelectorOpen: boolean;
  toggleFileSelector: () => void;
  tasks: ITask[];
  // collectAssignee: IUser | undefined;
  // projectUser: IUser[];
  // _setCollectAssignee: (
  //   user: IUser
  // ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
  // examinee: IUser | undefined;
  // _setExaminee: (
  //   user: IUser
  // ) => React.MouseEventHandler<HTMLButtonElement> | undefined;
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
  handleToggleFullScreen: () => void;
  goBack: () => void;
  _setIsPlayed: () => void;
  isPlayed: boolean;
  _setIsPaused: () => void;
  isPaused: boolean;
  _setIsStopped: () => void;
  isStopped: boolean;
  progressValue: number;
  progressMaxValue: number;
  formatTime: () => void;
  hours;
  minutes;
  seconds;
  checkIsPlayed;
  allDupTasks: any[];
  _setMainSelectedTask: (task: ITask) => void;
  checkSelectedTask: boolean;
  isOpenReject: boolean;
  handleOpenReject: () => void;
  handleCancelReject: () => void;
  onSubmitReject: () => void;
  handleSetRejectText: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  _setAutoSelect: () => void;
  //duplicateSelectedList: (task: ITask) => boolean;
  isAutoSelect: boolean;
  refPicker: any;
  onMoveToToolsLeft: () => void;
  onMoveToToolsRight: () => void;
  isWorked: boolean;
  cntDupTasks: number;
  isSubmit: boolean;
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
  width: 335px;
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
  border-bottom: 1px solid #c0c3c7;
`;
const NavButton = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #c0c3c7;
  border-bottom: 1px solid #c0c3c7;
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
  max-width: 350px;
  font-size: 18px;
  font-weight: 800;
  margin-top: 10px;
  line-height: 20px;
  color: #5f6164;
  overflow: hidden;
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
const MainCenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-width: 900px;
`;
// const MainCenterUpperTemp = styled.div<{ isFileSelectorOpen: boolean }>`
//   display: flex;
//   align-items: center;
//   //justify-content: center;
//   box-sizing: border-box;
//   width: 100%;
//   min-width: 900px;
//   overflow: hidden;
//   height: ${(props) =>
//     props.isFileSelectorOpen ? "calc(100% - 210px)" : "calc(100% - 50px)"};
//   padding: 0 20px;
// `;
const MainCenterUpperImg = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 900px;
  width: 100%;
`;
const MainCenterUpper = styled.div<{ isFileSelectorOpen: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  box-sizing: border-box;
  flex-direction: column;
  min-width: 900px;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  height: ${(props) =>
    props.isFileSelectorOpen
      ? "calc(100% - 210px)"
      : "calc(100% - 50px)"}; //file list열고 닫았을때 높이
`;
const ImageTemp = styled.img<{ isSelected: boolean }>`
  width: 150px;
  height: 100px;
  left: 200px;
top: 90px;
  background-repeat: no-repeat;
  border-width: ${(props) => (props.isSelected ? "2px" : null)};
  //border-style: ${(props) => (props.isSelected ? "solid" : null)};
  //border-color: ${(props) => (props.isSelected ? "#0d018e" : null)};
  //opacity: ${(props) => (props.isSelected ? "0.8" : null)};
  //hover effect 를 선택되면으로 바꿔야함....................
  :hover {
    filter: brightness(70%);
  }
  `;
const ImageWrapperTemp = styled.div<{ isSelected: boolean }>`
  height: 100%;
  width: 180px;
  display: flex;
  align-items: flex-start;
  //flex-direction: column;
  //justify-content: center;
  padding-top: 25px;
  left: 10px;
  padding-bottom: 10px;
  //margin-right: 2px;
  background: ${(props) => (props.isSelected ? "#c0c3c7" : null)};
`;

export interface ISmallTaskProps {
  task: ITask;
  isSelected: boolean;
  checkIsPlayed: boolean;
  dupLength: number;
  isFirst: boolean;
  isCheckSelected: boolean;
  isStopped: boolean;
  isPaused: boolean;
}

const SmallTaskTemp: React.FC<ISmallTaskProps> = ({
  task,
  isSelected,
  isCheckSelected,
  dupLength,
  checkIsPlayed,
  isFirst,
  isStopped,
  isPaused,
}) => {
  return (
    <>
      <ImageWrapperTemp
        isSelected={isSelected}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {dupLength && isFirst && (checkIsPlayed || isPaused || isStopped) && (
          <div
            style={{
              position: "absolute",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              gap: 10,
              width: 35,
              height: 25,
              left: 130,
              top: 25,
              color: "#ffffff",
              backgroundColor: "#1154C4",
              borderRadius: "0px 0px 0px 5px",
            }}
          >
            {dupLength}
          </div>
        )}
        <ImageTemp
          id={"imgTemp"}
          src={`data:image/jpeg;base64,${task.imageThumbnail}`}
          isSelected={isSelected}
        />
        {isCheckSelected && (
          <Icon
            style={{
              position: "absolute",
            }}
            src={keyboardReturn}
          />
        )}
      </ImageWrapperTemp>
    </>
  );
};
const TextArea = styled.textarea`
  width: 100%;
  resize: none;
  border-radius: 10px;
  padding: 5px 10px;
  :focus {
    outline: none;
  }
`;
const MainImage = styled.img<{
  isFileSelectorOpen: boolean;
  resizingVal?: string | null;
}>`
  width: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
        : "900px"
      : props.resizingVal
      ? `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
      : "810px"};
  height: ${(props) =>
    props.isFileSelectorOpen
      ? props.resizingVal
        ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
        : "600px"
      : props.resizingVal
      ? `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
      : "540px"};
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
const ImageWrapper = styled.div``;
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
  `;
const MainRight = styled.div`
  height: 100%;
  width: 310px;
  background-color: #e2e4e7;
`;
const MainLeft = styled.div`
  height: 100%;
  width: 240px;
  display: flex;
  flex-direction: column;
  background-color: #e2e4e7;
`;
const LeftText = styled.div`
  font-size: 14px;
  padding-top: 30px;
  text-align: center;
  //line-height: 18px;
  font-weight: 800;
  color: #5f6164;
`;
const LeftNavButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  float: left;
`;

const LeftPlayerContainer = styled.div`
  --seek-before-width: 0%;
  --buffered-width: 0%;
  min-width: 100px;
  max-width: 300px;
  margin-top: 20px;
`;
const LeftTimeContainer = styled.div`
  --seek-before-width: 0%;
  --buffered-width: 0%;
  min-width: 100px;
  max-width: 300px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const LeftPlayerProgress = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const CurrentTime = styled.div`
  //display:none;
  width: 100px;
  text-align: center;
  display: flex;
  float: left;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  //font-size: 20px;
`;

const Range = styled.input`
  &::before {
    position: absolute;
    content: "";
    top: 8px;
    left: 0;
    width: var(--seek-before-width);
    height: 3px;
    background-color: #fff;
    cursor: pointer;
    border-radius: 50px;
  }
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #5f6164;
    background: #5f6164;
    user-select: unset;
    transition: all 0.3s;
    cursor: pointer;
    :focus {
      outline: none;
    }
  }
  :focus {
    outline: none;
  }
  width: 120px;
  height: 4px;
  border-radius: 40px;
  -webkit-appearance: none;
  letter-spacing: -0.3px;
  background: #cfcfcf;
  //margin: 0 15px;
`;
const Duration = styled.div`
  //display:none;
  width: 100px;
  text-align: center;
  display: flex;
  float: left;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  //font-size: 20px;
`;

const LeftNavButtonContainer = styled.div`
  width: 200px;
  //float: left;
  display: flex;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const LeftTextBottom = styled.div`
  //float: left;
  display: flex;
  font-weight: 700;
  font-size: 13px;
  line-height: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
  color: #5f6164;
`;

const IconWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LeftUnderBar = styled.span`
  width: 80%;
  height: 0px;
  border: 1px solid #c0c3c7;
  margin-top: 40px;
  margin-left: 20px;
  border-width: light;
  transform: rotate(-180deg);
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
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
  :hover {
  }
  max-width: 130px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const DropBoxContentWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #c0c3c7;
  border-top: 1px solid #c0c3c7;
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
const Canvas = styled.canvas<{ isFileSelectorOpen: boolean }>``;

const CleansingPresenter: React.FC<ICollectInspectionPresenter> = ({
  currentUser,
  currentDataURL,
  projectInfo,
  isFileSelectorOpen,
  tasks,
  isFileInfoOpen,
  workStatutes,
  selectedTask,
  loading,
  isFirst,
  checkSelectedIndex,
  isPlayed,
  isPaused,
  isStopped,
  toggleFileInfoOpen,
  _setWorkStatutes,
  _setSelectedTask,
  toggleFileSelector,
  handleToggleFullScreen,
  goBack,
  _setIsPlayed,
  _setIsPaused,
  _setIsStopped,
  progressValue,
  progressMaxValue,
  formatTime,
  hours,
  minutes,
  seconds,
  checkIsPlayed,
  allDupTasks,
  _setMainSelectedTask,
  checkSelectedTask,
  handleOpenReject,
  handleCancelReject,
  onSubmitReject,
  handleSetRejectText,
  isOpenReject,
  isLoading,
  _setAutoSelect,
  //duplicateSelectedList,
  isAutoSelect,
  refPicker,
  onMoveToToolsLeft,
  onMoveToToolsRight,
  isWorked,
  cntDupTasks,
  isSubmit,
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
              {/* <NavButton
                  style={{ cursor: "pointer" }}
                  onClick={handleDownloadImage}
                >
                  <Icon
                    src={iconLink}
                    alt="icon-download"
                    style={{ width: 17.38, height: 17.67 }}
                  />
                </NavButton> */}
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
              <NavButton style={{ cursor: "pointer" }} onClick={goBack}>
                <Icon
                  src={iconLogout}
                  alt="icon-logout"
                  style={{ width: 20, height: 18 }}
                />
              </NavButton>

              {/* <View>
                <Progress.Bar progress={0.3} width={200} />
              </View> */}
            </HeaderLeft>
            <HeaderCenter>
              <HeaderCenterLeft />
              {/* <HeaderCenterRight>
                  <Icon
                    src={iconPrev}
                    style={{ width: 23.33, height: 23.33, cursor: "pointer" }}
                    onClick={
                      selectedTask
                        ? () => handlePrevTask(selectedTask.taskId)
                        : undefined
                    }
                  /> */}
              <HeaderCenterTextContainer>
                <HeaderCenterText>
                  {projectInfo ? projectInfo.projectName : "프로젝트 명"}
                </HeaderCenterText>
                {/* <HeaderCenterImageTitle>
                      {selectedTask ? selectedTask.imageName : ""}
                    </HeaderCenterImageTitle> */}
              </HeaderCenterTextContainer>
              {/*  <Icon
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
                      <NormalText>수집</NormalText>
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
                        </>
                      )}
                    </ProgressTextBox>
                  </ProgressContainer>
                </HeaderCenterRight> */}
            </HeaderCenter>
            {/* <HeaderRight>
                <IconBox
                  style={{ borderRight: 0, cursor: "pointer" }}
                  onClick={handleUnDo}
                >
                  <Icon src={iconUndo} />
                </IconBox>
                <IconBox style={{ cursor: "pointer" }} onClick={handleRedo}>
                  <Icon src={iconDo} />
                </IconBox>Zoom
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
              </HeaderRight> */}
          </StudioHeader>
          <Main>
            <MainLeft>
              <LeftText>중복데이터 제거</LeftText>
              <LeftPlayerContainer>
                <Progress
                  value={progressValue}
                  max={tasks.length}
                  //max={50}
                  size="xs"
                  colorScheme="gray"
                  //isIndeterminate={isPlayed ? true : false}
                  style={{ width: 120, marginLeft: 40, borderRadius: 100 }}
                />
              </LeftPlayerContainer>
              <LeftTimeContainer>
                <span>{hours} :</span>
                <span>&nbsp;{minutes} :</span>
                <span>&nbsp;{seconds}</span>
              </LeftTimeContainer>
              <LeftNavButton style={{ cursor: "pointer" }}>
                <Icon
                  src={iconPlay}
                  alt="icon-iconPlay"
                  style={{
                    width: 33,
                    height: 33,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: isPlayed ? "#CFD1D4" : "",
                    cursor: isPlayed ? "not-allowed" : "",
                    //display: isPlayed ? "none" : "block",
                  }}
                  onClick={() => _setIsPlayed()}
                />

                <Icon
                  src={iconPause}
                  alt="icon-iconPause"
                  style={{
                    width: 33,
                    height: 33,
                    marginLeft: 5,
                    marginRight: 5,
                    backgroundColor: isPaused ? "#CFD1D4" : "",
                    cursor: isPaused || isStopped ? "not-allowed" : "",
                  }}
                  onClick={() => _setIsPaused()}
                />

                <Icon
                  src={iconStop}
                  alt="icon-iconStop"
                  style={{
                    width: 33,
                    height: 33,
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: isStopped ? "#CFD1D4" : "",
                    cursor: isStopped ? "not-allowed" : "",
                  }}
                  onClick={() => _setIsStopped()}
                />
              </LeftNavButton>
              <LeftUnderBar />
              <LeftNavButtonContainer>
                <IconWrap style={{ marginRight: 30 }}>
                  <Icon
                    src={isAutoSelect ? iconAuto_active : iconAuto}
                    alt="icon-iconAuto"
                    style={{ width: 40, height: 40 }}
                    onClick={() => _setAutoSelect()}
                  />
                  <LeftTextBottom>Auto Select</LeftTextBottom>
                </IconWrap>
                <IconWrap style={{ marginRight: 10 }}>
                  <Icon
                    src={iconReject}
                    alt="icon-iconReject"
                    style={{ width: 40, height: 40 }}
                    onClick={handleOpenReject}
                  />
                  <Modal
                    isOpen={isOpenReject}
                    onClose={handleCancelReject}
                    title={"반려"}
                    onSubmit={onSubmitReject}
                    txtSubmit={isSubmit? "Loading..." : "적용"}
                  >
                    <>
                      <TextArea
                        placeholder="중복이미지"
                        rows={5}
                        autoFocus={false}
                        onChange={handleSetRejectText}
                      />
                    </>
                  </Modal>
                  <LeftTextBottom>반려</LeftTextBottom>
                </IconWrap>
              </LeftNavButtonContainer>
            </MainLeft>
            <MainCenterWrapper>
              <MainCenterUpper isFileSelectorOpen={isFileSelectorOpen}>
                {/* {selectedTask && (
                  <>
                    <ImageWrapper
                      style={{ cursor: "pointer" }}
                      id={"mainimage"}
                    >
                      <SmallTaskTemp
                        task={selectedTask}
                        isSelected={true}
                        similarHash={similarHash}
                        checkIsPlayed={checkIsPlayed}
                      />
                    </ImageWrapper>
                    {similarHash.length > 0 &&
                      (checkIsPlayed || isPaused || isStopped) &&
                      similarHash.map((m, index) => {
                        if (
                          selectedTask &&
                          m.imgFolder.taskId === selectedTask.taskId
                        ) {
                          return (
                            <ImageWrapper
                              key={index}
                              style={{ cursor: "pointer" }}
                              id={"mainimage"}
                            >
                              <SmallTaskTemp
                                task={m.imgFolder}
                                isSelected={true}
                                checkSelectedIndex={checkSelectedIndex}
                                similarHash={similarHash}
                                checkIsPlayed={checkIsPlayed}
                              />
                            </ImageWrapper>
                          );
                        }
                        return (
                          <div key={index}>
                            <ImageWrapper
                              onClick={() => _setMainSelectedTask(m.imgFolder)}
                              style={{
                                cursor: "pointer",
                                filter: checkSelectedIndex.includes(
                                  m.imgFolder.taskId
                                )
                                  ? "brightness(70%)"
                                  : "",
                              }}
                              id={"imgWrapper"}
                            >
                              <SmallTaskTemp
                                task={m.imgFolder}
                                isSelected={false}
                                checkSelectedIndex={checkSelectedIndex}
                                similarHash={similarHash}
                                checkIsPlayed={checkIsPlayed}
                              />
                            </ImageWrapper>
                          </div>
                        );
                      })}
                  </>
                )} */}
                {/* {allDupTasks.length === 0 && checkIsPlayed && (
                  <SpinnerWrapper>
                    <Spinner speed="0.35s" />
                  </SpinnerWrapper>
                )} */}

                {allDupTasks && allDupTasks.length > 0 &&
                  (checkIsPlayed || isPaused || isStopped || !isLoading) &&
                  cntDupTasks > 0 &&
                  allDupTasks.map((dupTasksArr: any[], index) => {
                    if (dupTasksArr.length === 1) {
                      return "";
                    }
                    return (
                      <div key={index} style={{ display: "flex" }}>
                        {dupTasksArr &&
                          dupTasksArr.map((dt, index) => (
                            <ImageWrapper
                              key={index}
                              onClick={() => _setMainSelectedTask(dt.imgFolder)}
                              style={{
                                cursor: "pointer",
                                filter: dt.isSelected ? "brightness(70%)" : "",
                              }}
                            >
                              <SmallTaskTemp
                                task={dt.imgFolder}
                                isSelected={false}
                                isFirst={index === 0}
                                isCheckSelected={dt.isSelected}
                                dupLength={dupTasksArr.length}
                                checkIsPlayed={checkIsPlayed}
                                isStopped={isStopped}
                                isPaused={isPaused}
                              />
                            </ImageWrapper>
                          ))}
                      </div>
                    );
                  })}
                { allDupTasks && allDupTasks.length > 0 && cntDupTasks === 0 && (
                  <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Text fontSize={"x-large"}>중복 데이터가 없습니다.</Text>
                  </div>
                )}
                { !isWorked && selectedTask && allDupTasks.length === 0 && !checkIsPlayed && (
                  <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Text fontSize={"x-large"}>시작 버튼을 클릭하세요.</Text>
                  </div>
                )}
                {(!selectedTask || (isLoading && isPlayed)) && (
                  <SpinnerWrapper>
                    <Spinner speed="0.35s" />
                  </SpinnerWrapper>
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
                <FileListArrow id={"arrowPickerLeft"} onClick={onMoveToToolsLeft}>
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
                            if (
                              selectedTask &&
                              task.taskId === selectedTask.taskId
                            )
                              return (
                                <ImageWrapper
                                  id={"img" + index}
                                  key={index}
                                  style={{ cursor: "pointer" }}
                                >
                                  <SmallTask
                                    task={selectedTask}
                                    isSelected={true}
                                  />
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
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return (
                                  <ImageWrapper
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask
                                      task={selectedTask}
                                      isSelected={true}
                                    />
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
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return (
                                  <ImageWrapper
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask
                                      task={selectedTask}
                                      isSelected={true}
                                    />
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
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return (
                                  <ImageWrapper
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask
                                      task={selectedTask}
                                      isSelected={true}
                                    />
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
                              if (
                                selectedTask &&
                                task.taskId === selectedTask.taskId
                              )
                                return (
                                  <ImageWrapper
                                    id={"img" + index}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <SmallTask
                                      task={selectedTask}
                                      isSelected={true}
                                    />
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
                <FileListArrow id={"arrowPickerRight"} onClick={onMoveToToolsRight}>
                    <Icon
                      src={iconArrowRight} />
                  </FileListArrow>
                </MainCenterImagePickerWrapper>
              )}
            </MainCenterWrapper>
            <MainRight>
              <MainRightUpper>
                <DropBoxContainer style={{ borderTop: "1px solid #c0c3c7" }}>
                  <Image src={currentDataURL} />
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
                        <DropBoxBoldText style={{ marginBottom: 12 }}>
                          크기
                        </DropBoxBoldText>
                        <DropBoxBoldText style={{ marginBottom: 12 }}>
                          용량
                        </DropBoxBoldText>
                      </DropBoxContentDescLeft>
                      <DropBoxContentDescRight>
                        <DropBoxNormalText style={{ marginBottom: 12 }}>
                          {selectedTask &&
                          selectedTask.imageWidth &&
                          selectedTask.imageHeight
                            ? `${selectedTask.imageWidth}px*${
                                selectedTask.imageHeight
                              }px`
                            : "900px*1600px"}
                        </DropBoxNormalText>
                        <DropBoxNormalText style={{ marginBottom: 12 }}>
                          {selectedTask && selectedTask.imageSize
                            ? `${selectedTask.imageSize}KB`
                            : "123KB"}
                        </DropBoxNormalText>
                      </DropBoxContentDescRight>
                    </DropBoxContentDescWrapper>
                  )}
                </DropBoxContainer>
              </MainRightUpper>
              <MainRightBottom>
                <FinishButton onClick={goBack}>완료</FinishButton>
                {/* <RejectButton>반려</RejectButton> */}
              </MainRightBottom>
            </MainRight>
          </Main>
        </StudioWrapper>
      </ChakraProvider>
    </>
  );
};

export default CleansingPresenter;
