import React, { ChangeEvent, MouseEventHandler } from "react";
import styled from "styled-components";
import "react-image-crop/dist/ReactCrop.css";
import iconHome from "../../../assets/images/studio/header/icon-home-gray.svg";
import iconLink from "../../../assets/images/studio/header/icon-link-gray.svg";
import iconKey from "../../../assets/images/studio/header/icon-key-dark.svg";
import iconCloseStudio from "../../../assets/images/studio/icon/icon-close-studio.svg"
import iconFullScreen from "../../../assets/images/studio/header/icon-fullscreen-gray.svg";
import iconLogout from "../../../assets/images/studio/header/icon-logout-gray.svg";
import iconPrev from "../../../assets/images/studio/header/icon-prev-gray.svg";
import iconNext from "../../../assets/images/studio/header/icon-next-gray.svg";
import iconZoomDec from "../../../assets/images/studio/header/icon-zoom-dec.svg";
import iconZoomInc from "../../../assets/images/studio/header/icon-zoom-inc.svg";
import arrowUp from "../../../assets/images/studio/icon/icon-up.svg";
import arrowDown from "../../../assets/images/studio/icon/icon-down.svg";
import iconArrowLeft from "../../../assets/images/studio/icon/icon-arrow-left.svg";
import iconArrowRight from "../../../assets/images/studio/icon/icon-arrow-right.svg";
import rejectBtn from "../../../assets/images/studio/reject-text.svg";
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
import Modal from "../../../components/studio/Modal";
import SmallTask from "../../../components/studio/SmallTask";
import { IProjectInfo } from "../../../api/projectApi";
import { IUser } from "../../../api/userApi";
import { IUserState } from "../../../redux/user/users";
import { ITask } from "../../../api/taskApi";
import { Helmet } from "react-helmet-async";

interface ICollectInspectionPresenter {
    currentUser: IUserState;
    currentDataURL: string | null;
    projectInfo: IProjectInfo | null | undefined;
    isFileSelectorOpen: boolean;
    toggleFileSelector: () => void;
    tasks: ITask[];
    collectAssignee: IUser | undefined;
    projectUser: IUser[];
    _setCollectAssignee: (
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
    resizingVal: string | null;
    handleResizing: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOriginalImage: () => void;
    handleDownloadImage: () => void;
    handleToggleFullScreen: () => void;
    saveImage: () => Promise<void>;
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
    isRow: boolean;
    setKeyOnOff: () => void;
    isKeyOnOff: boolean;
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
  }>`
    width: ${(props) =>
      props.isRow?
      props.isFileSelectorOpen
        ? props.resizingVal
          ? `${parseInt("810") + (parseInt(props.resizingVal) - 100)}px`
          : "810px"
        : props.resizingVal
        ? `${parseInt("900") + (parseInt(props.resizingVal) - 100)}px`
        : "900px"
      :"auto"};
    height: ${(props) =>
      !props.isRow?
      props.isFileSelectorOpen
        ? props.resizingVal
          ? `${parseInt("540") + (parseInt(props.resizingVal) - 100)}px`
          : "540px"
        : props.resizingVal
        ? `${parseInt("600") + (parseInt(props.resizingVal) - 100)}px`
        : "600px"
      :"auto"};
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
  const TextArea = styled.textarea`
    width: 100%;
    resize: none;
    border-radius: 10px;
    padding: 5px 10px;
    :focus {
      outline: none;
    }
  `;
  const CollectInspectionPresenter: React.FC<ICollectInspectionPresenter> = ({
    currentDataURL,
    projectInfo,
    isFileSelectorOpen,
    tasks,
    collectAssignee,
    projectUser,
    examinee,
    isFileInfoOpen,
    workStatutes,
    selectedTask,
    loading,
    isFirst,
    resizingVal,
    currentUser,
    isOpenReject,
    rejectComment,
    showRejectComment,
    refPicker,
    isRow,
    isKeyOnOff,
    setKeyOnOff,
    onMoveToToolsLeft,
    onMoveToToolsRight,
    _setCollectAssignee,
    _setExaminee,
    toggleFileInfoOpen,
    _setWorkStatutes,
    _setSelectedTask,
    handlePrevTask,
    handleNextTask,
    toggleFileSelector,
    handleResizing,
    handleDownloadImage,
    handleToggleFullScreen,
    handleCompleted,
    handleOpenReject,
    handleCancelReject,
    onSubmitReject,
    handleSetRejectText,
    handleShowRejctHelp,
    handleCancelRejectComment,
    goBack,
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
                      <NormalText>{selectedTask && selectedTask.taskStep === 1 ? "수집" : "검수"}</NormalText>
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
                <IconBox style={{ border: "none" }}>
                </IconBox>
                <IconBox style={{ border: "none" }}>
                </IconBox>
                <ZoomBox>
                  <Icon src={iconZoomDec} />
                  <ZoomInput
                    type={"range"}
                    min={0}
                    max={200}
                    value={resizingVal === null ? "100" : resizingVal}
                    onChange={handleResizing}
                  />
                  <Icon src={iconZoomInc} />
                </ZoomBox>
              </HeaderRight>
            </StudioHeader>
            <Main>
              <MainCenterWrapper>
                <MainCenterUpper
                  id={"mainCenterUpper"}
                  isFileSelectorOpen={isFileSelectorOpen}
                >
                  {/*//! 아래는 데이터를 서버로부터 받으면 화면 중앙에 뿌려주는 이미지 */}
                  {selectedTask &&
                    (currentDataURL ? (
                      <MainImage
                        id={"mainImage"}
                        isFileSelectorOpen={isFileSelectorOpen}
                        isRow={isRow}
                        resizingVal={resizingVal}
                        style={{
                          display: "block",
                        }}
                        src={currentDataURL ? currentDataURL : selectedTask.image}
                      />
                    ) : (
                      <Spinner />
                    ))}
                  </MainCenterUpper>
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
                            })}
                          {workStatutes === "미작업" &&
                            tasks
                              .filter((t) => t.taskStatus === 1)
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
                          {workStatutes === "진행중" &&
                            tasks
                              .filter((t) => t.taskStatus === 2)
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
                          {workStatutes === "완료" &&
                            tasks
                              .filter((t) => t.taskStatus === 3)
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
                  <FileListArrow id={"arrowPickerRight"} onClick={onMoveToToolsRight}>
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
                            rightIcon={<Icon src={arrowDown} />}
                          >
                            <DropBoxTextWrapper>
                              <DropBoxBoldText>수집 담당자</DropBoxBoldText>
                              <Divider
                                style={{ marginLeft: 8, marginRight: 8 }}
                              />
                              <DropBoxNormalText>
                                {collectAssignee
                                  ? collectAssignee.userDisplayName
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
                            maxH={"700px"}
                            overflow={"auto"}
                          >
                            {projectUser &&
                              projectUser.length > 0 &&
                              projectUser.map((user, index) => {
                                if (user === collectAssignee) return null;
                                return (
                                  <MenuItem
                                    key={index}
                                    _hover={{ bgColor: "#CFD1D4" }}
                                    _focusWithin={{ bgColor: "#CFD1D4" }}
                                    onClick={() =>
                                      _setCollectAssignee(user)
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
                  (currentUser.isAdmin || currentUser.id === selectedTask.taskValidator?.id || currentUser.id === selectedTask.taskWorker?.id) && (
                    <>
                      <FinishButton onClick={handleCompleted}>완료</FinishButton>
                      <RejectButton onClick={handleOpenReject}>반려</RejectButton>
                      <Modal
                        isOpen={isOpenReject}
                        onClose={handleCancelReject}
                        title={"반려"}
                        onSubmit={onSubmitReject}
                        txtSubmit={"확인"}
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
                  {selectedTask &&
                    !currentUser.isAdmin &&
                    currentUser.id !== selectedTask.taskValidator?.id &&
                    currentUser.id !== selectedTask.taskWorker?.id && (
                      <>
                        <FinishButton style={{ cursor: "not-allowed", backgroundColor: "#c0c3c7"}}>완료</FinishButton>
                        <RejectButton style={{ cursor: "not-allowed", backgroundColor: "#c0c3c7"}}>반려</RejectButton>
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

  export default CollectInspectionPresenter;
