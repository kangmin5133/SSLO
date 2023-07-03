import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IDataset } from "../../api/datasetApi";
import { getFormattedDate, truncate } from "../../utils";
import iconSelected from "../../assets/images/project/icon/icon-selected.svg";
import { Link } from "react-router-dom";
import { IProject } from "../../api/projectApi";
import taskApi, { ITask } from "../../api/taskApi";
import userApi, { IProjectUser, IUser } from "../../api/userApi";
import { IUserState } from "../../redux/user/users";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Checkbox as ChakraCheckBox,
  Button as ChakraBtn,
  Modal,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { IWorkerStatics } from "../../api/staticsApi";
import { useAppSelector } from "../../hooks";
import PopupTaskInfo from "./PopupTaskInfo";

export type ListType =
  | "ALL_PRJECT"
  | "DATASET TYPE"
  | "SETTING DATASET TYPE"
  | "DATALIST"
  | "SETTING_MEMBERS"
  | "EXPORT_MODEL"
  | "DASHBOARD_PROJECT_STATUS"
  | "USER_WORK_STATICS"
  | "USER_WORK_AMOUNT"
  | "MY_WORK_LIST"
  | "MY_PAGE_MEMBERS"
  | "MY_PAGE_WAIT_MEMBERS";
export interface IListItem {
  type: ListType;
  currentUser?: IUserState;
  project?: IProject;
  dataset?: IDataset;
  task?: ITask;
  projectUsers?: IUser[];
  member?: IUser;
  workerStatics?: IWorkerStatics;
  workerStaticsType?: 1 | 2;
  selectDataset?: (datasetId: number) => void;
  removeDataset?: (datasetId: number) => void;
  isSelectedDataset?: (datasetId: number) => boolean;
  selectTask?: (taskId: number) => void;
  removeTask?: (taskId: number) => void;
  isSelectedTask?: (taskId: number) => boolean;
  projectMember?: IProjectUser;
  selectMember?: (member: IProjectUser) => void;
  removeMember?: (memberId: number) => void;
  isSelectedMember?: (member: IProjectUser) => boolean;
  model?: any;
  selectModel?: (e: any, model: any) => void;
  isSelectedModel?: (model: any) => boolean;
  selectedUser?: (userId: string) => void;
  removeUser?: (userId: string) => void;
  isSelectedUser?: (userId: string) => boolean;
  getTasksByProject?: () => Promise<void>;
  tasks?: ITask[];
  getModelTrainLog?: (model: any) => void;
}

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 15px 25px;
  :nth-child(even) {
    background-color: #f7fafe;
  }
`;
const CCheckbox = styled(ChakraCheckBox)`
  border-color: #6b78a1;
  margin-right: 30px;
  width: 15px;
  height: 15px;
`;
const Data = styled.span`
  width: 100%;
  font-size: 13px;
  font-weight: 700;
  color: #243654;
  margin-right: 0;
  :last-child {
    text-align: center;
  }
  :nth-last-child(2) {
    text-align: center;
  }
`;
const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const ProgressDiv = styled.div`
  border: 0.5px solid #c0c3c7;
  border-radius: 20px;
  margin-right: 10px;
  width: 100px;
  height: 5px;
`;
const Progress = styled.div<{ percentage: number }>`
  width: ${(props) =>
    props.percentage <= 0
      ? "0px"
      : props.percentage < 20
      ? "15px"
      : props.percentage < 30
      ? "25px"
      : props.percentage < 40
      ? "35px"
      : props.percentage < 45
      ? "40px"
      : props.percentage < 50
      ? "45px"
      : props.percentage < 60
      ? "55px"
      : props.percentage < 70
      ? "65px"
      : props.percentage < 80
      ? "75px"
      : props.percentage < 90
      ? "85px"
      : props.percentage < 95
      ? "90px"
      : props.percentage < 99
      ? "95px"
      : "100px"};
  height: 100%;
  border-radius: 20px;
  border: 0.5px solid #3db79f;
  background-color: #3db79f;
`;
const ProgressPercentage = styled.span`
  color: #243654;
  font-size: 12px;
  font-weight: 700;
  margin-right: 3px;
`;
const ProgressCounts = styled(ProgressPercentage)``;
const CheckBox = styled.div<{ isSelected: boolean }>`
  width: 80px;
  max-width: 80px;
  height: 13px;
  border: 1px solid ${(props) => (props.isSelected ? "#2EA08F" : "#6b78a1")};
  background-color: ${(props) => (props.isSelected ? "#2EA08F" : "none")};
  margin-right: 100px;
  cursor: pointer;
`;
const ThumbNail = styled.img`
  width: 60px;
  height: 44px;
`;
const Icon = styled.img`
  cursor: pointer;
  max-width: 80px;
  margin-right: 100px;
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
  background-color: #5f6164;
  color: #fff;
`;
const Select = styled.select`
  width: 150px;
  padding: 7px 10px;
  background-color: #f7fafe;
  font-size: 11px;
  border: 1px solid #aeccf4;
  font-weight: 500;
  :focus {
    outline: none;
  }
`;
/** 전체 프로젝트 화면 등 화면에서 리스트로 사용되는 리스트 아이템
 * 타입에 따라 받는 props가 달라진다.
 */
const ListItem: React.FC<IListItem> = ({
  type,
  task,
  project,
  currentUser,
  dataset,
  member,
  projectUsers,
  workerStatics,
  workerStaticsType,
  projectMember,
  model,
  selectModel,
  isSelectedModel,
  selectMember,
  isSelectedMember,
  selectDataset,
  removeDataset,
  isSelectedDataset,
  selectTask,
  removeTask,
  isSelectedTask,
  selectedUser,
  removeUser,
  isSelectedUser,
  getTasksByProject,
  tasks,
  getModelTrainLog,
}) => {
  const user = useAppSelector((state) => state.userReducer);
  // ! type이 DATALIST일 때만 유효한 state
  const [isTaskPopupOn, setIsTaskPopupOn] = useState<boolean>(false);
  // ! type이 DATALIST일 때만 유효한 function
  const openTaskPopup = () => {
    setIsTaskPopupOn(true);
  };
  const closeTaskPopup = () => {
    setIsTaskPopupOn(false);
  };

  useEffect(() => {
    setWorker("");
    setValidator("");
  }, [task]);

  // ! type이 DATALIST일 때만 유효한 state
  const [worker, setWorker] = useState<string>(
    task && task.taskWorker ? task.taskWorker.id : ""
  );
  const [tempWorker, setTempWorker] = useState<string>("");
  // ! type이 DATALIST일 때만 유효한 state
  const [validator, setValidator] = useState<string>(
    task && task.taskValidator ? task.taskValidator.id : ""
  );
  const [tempValidator, setTempValidator] = useState<string>("");
  const [showWorkerAlert, setShowWorkerAlert] = useState<boolean>(false);
  const [showValidatorAlert, setShowValidatorAlert] = useState<boolean>(false);
  const handleShowWorkerAlert = (e: ChangeEvent<HTMLSelectElement>) => {
    setShowWorkerAlert(true);
    setTempWorker(e.target.value);
  };
  const handleCancelWorkerAlert = () => {
    setShowWorkerAlert(false);
  };
  const handleShowValidatorAlert = (e: ChangeEvent<HTMLSelectElement>) => {
    setShowValidatorAlert(true);
    setTempValidator(e.target.value);
  };
  const handleCancelValidatorAlert = () => {
    setShowValidatorAlert(false);
  };
  // ! type이 DATALIST일 때만 유효한 function
  const handleChangeWorker = async () => {
    if (!project || !task) {
      return;
    }
    const updateTaskParams = {
      project_id: project.pNo,
    };
    const updateTaskPayload = {
      task_id: task.taskId,
      task_worker: {
        user_id: tempWorker,
      },
      task_validator: task.taskValidator
        ? {
            user_id: task.taskValidator.id,
          }
        : null,
    };
    setWorker(tempWorker);
    await taskApi.updateTask(
      updateTaskParams,
      updateTaskPayload,
      user.accessToken!
    );
    toast.success("담당자 변경 완료");
    getTasksByProject();
    setShowWorkerAlert(false);
  };
  // ! type이 DATALIST일 때만 유효한 function
  const handleChangeValidator = async () => {
    if (!project || !task) {
      return;
    }
    const updateTaskParams = {
      project_id: project.pNo,
    };
    const updateTaskPayload = {
      task_id: task.taskId,
      task_validator: {
        user_id: tempValidator,
      },
      task_worker: task.taskWorker
        ? {
            user_id: task.taskWorker.id,
          }
        : null,
    };
    setValidator(tempValidator);
    await taskApi.updateTask(
      updateTaskParams,
      updateTaskPayload,
      user.accessToken!
    );
    toast.success("담당자 변경 완료");
    getTasksByProject();
    setShowValidatorAlert(false);
  };
  const cancelRef = useRef(null);
  useEffect(() => {
    if (task) {
      if (task.taskWorker) setWorker(task.taskWorker.id);
      if (task.taskValidator) setValidator(task.taskValidator.id);
    }
  }, [task]);

  // ! 멤버설정 탭의 권한변경
  // ! 기존의 권한
  //const [permission, setPermission] = useState<number>(0);
  // ! 변경 후 권한
  const [modifyPermission, setModifyPermission] = useState<number>(0);
  // ! alert 창
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleShowAlert = (e: ChangeEvent<HTMLSelectElement>) => {
    setModifyPermission(parseInt(e.target.value));
    setShowAlert(true);
  };

  const handleCancelAlert = () => {
    setShowAlert(false);
  };

  const handleChangePermission = async () => {
    const res = await userApi.updatePermission({
      user_id: member.userId,
      role_id: modifyPermission,
    });
    if (modifyPermission === 1) {
      toast.error("Admin은 한 명만 가능합니다.");
      window.setTimeout("location.reload()", 1000);
      return;
    }
    if (res && res.status === 200) {
      console.log(res.data);
      //setPermission(modifyPermission);
      toast.success("권한 변경 완료");
      setShowAlert(false);
      console.log(modifyPermission);
    }
  };
  const permissionData = [
    { role_id: 1, role_name: "Admin" },
    { role_id: 2, role_name: "Manager" },
    { role_id: 3, role_name: "Member" },
  ];
  // useEffect(() => {
  //   if (member) setPermission(member.member_permission);
  // }, [member]);

  return (
    <>
      {type === "ALL_PRJECT" && project && (
        <Row>
          <Data style={{ width: "5%", textAlign: "center" }}>{project.pNo}</Data>
          <Data style={{ width: "20%", textAlign: "center" }}>
            {project.pType.project_type_id === 1
              ? "데이터 수집/정제"
              : project.pType.project_type_id === 2
              ? "데이터 전처리"
              : "데이터 가공"}
          </Data>
          <Data style={{ width: "20%", textAlign: "center" }}>
            <Link to={`${project.pNo}`} style={{ color: "#357FE3" }}>
              {project.pName}
            </Link>
          </Data>
          <Data style={{ width: "20%", paddingLeft: "4%" }}>
            <ProgressWrapper>
              <ProgressDiv>
                <Progress
                  percentage={
                    !project.pWorkerCount
                      ? 0
                      : project.pWorkerCount.task_count_total === 0
                      ? 0
                      : (project.pWorkerCount.task_count_complete /
                          project.pWorkerCount.task_count_total) *
                        100
                  }
                />
              </ProgressDiv>
              <ProgressPercentage>
                {!project.pWorkerCount
                  ? "0 / 0"
                  : project.pWorkerCount.task_count_total === 0
                  ? "0%"
                  : `${Math.ceil(
                      (project.pWorkerCount.task_count_complete /
                        project.pWorkerCount.task_count_total) *
                        100
                    )}%`}
              </ProgressPercentage>
              <ProgressCounts>
                {!project.pWorkerCount
                  ? ""
                  : project.pWorkerCount.task_count_total === 0
                  ? 0
                  : `(${project.pWorkerCount.task_count_complete} /
                      ${project.pWorkerCount.task_count_total})`}
              </ProgressCounts>
            </ProgressWrapper>
          </Data>
          <Data style={{ width: "15%", textAlign: "center" }}>
            {project.pWorkerCount ? project.pWorkerCount.count_worker : "3"}명
          </Data>
          <Data style={{ width: "20%", textAlign: "center" }}>{getFormattedDate(project.pCreated)}</Data>
        </Row>
      )}
      {type === "DASHBOARD_PROJECT_STATUS" && project && (
        <Row>
          <Data>{project.pNo}</Data>
          <Data>
            {project.pType.project_type_id === 1
              ? "데이터 수집"
              : project.pType.project_type_id === 2
              ? "데이터 전처리"
              : "데이터 가공"}
          </Data>
          <Data>{project.pName}</Data>
          <Data>
            <ProgressWrapper>
              <ProgressDiv>
                <Progress
                  percentage={
                    !project.pWorkerCount
                      ? 0
                      : project.pWorkerCount.task_count_total === 0
                      ? 0
                      : (project.pWorkerCount.task_count_complete /
                          project.pWorkerCount.task_count_total) *
                        100
                  }
                />
              </ProgressDiv>
              <ProgressPercentage>
                {!project.pWorkerCount
                  ? "0%"
                  : project.pWorkerCount.task_count_total === 0
                  ? "0%"
                  : `${Math.ceil(
                      (project.pWorkerCount.task_count_complete /
                        project.pWorkerCount.task_count_total) *
                        100
                    )}%`}
              </ProgressPercentage>
            </ProgressWrapper>
          </Data>
          <Data>{getFormattedDate(project.pCreated)}</Data>
          <Data>
            {getFormattedDate(
              project.pUpdated ? project.pUpdated : project.pCreated
            )}
          </Data>
        </Row>
      )}
      {type === "USER_WORK_STATICS" && member && member.index && (
        <Row>
          <Data>{member.index}</Data>
          <Data>{member.userDisplayName}</Data>
          <Data>{member.userEmail}</Data>
          <Data style={{ textAlign: "center" }}>
            {member.workStatics ? member.workStatics.stepOneCount : 0}
          </Data>
          <Data>
            {member.workStatics ? member.workStatics.stepTwoCount : 0}
          </Data>
          <Data>
            {member.workStatics
              ? getFormattedDate(member.workStatics.lastUpdated)
              : "없음"}
          </Data>
        </Row>
      )}
      {type === "USER_WORK_AMOUNT" && workerStatics && workerStaticsType && (
        <Row>
          <Data>{workerStatics.userId}</Data>
          <Data>{workerStatics.userEmail}</Data>
          <Data>
            {workerStaticsType === 1
              ? workerStatics.stepOneComplete
              : workerStatics.stepTwoComplete}
          </Data>
          <Data>
            {workerStaticsType === 1
              ? workerStatics.stepOneReject
              : workerStatics.stepTwoReject}
          </Data>
        </Row>
      )}
      {type === "DATASET TYPE" &&
        dataset &&
        selectDataset &&
        removeDataset &&
        isSelectedDataset && (
          <Row>
            {isSelectedDataset(dataset.datasetId) ? (
              <Icon
                src={iconSelected}
                onClick={() => removeDataset(dataset.datasetId)}
              />
            ) : (
              <CheckBox
                onClick={() => selectDataset(dataset.datasetId)}
                isSelected={isSelectedDataset(dataset.datasetId)}
              />
            )}
            <Data>{dataset.datasetId}</Data>
            <Data>{dataset.datasetName}</Data>
            <Data>{dataset.datasetItemsCount}</Data>
            <Data>
              {dataset.datasetCategory ? dataset.datasetCategory : "미지정"}
            </Data>
            <Data>
              {dataset.datasetSubCategory
                ? dataset.datasetSubCategory
                : "미지정"}
            </Data>
            <Data>{Math.round(dataset.datasetItemsSize * 0.000001)}MB</Data>
          </Row>
        )}
      {type === "SETTING DATASET TYPE" && dataset && (
        <Row>
          <Data>{dataset.datasetId}</Data>
          <Data>{dataset.datasetName}</Data>
          <Data>{dataset.datasetItemsCount}</Data>
          <Data>
            {dataset.datasetCategory ? dataset.datasetCategory : "미지정"}
          </Data>
          <Data>
            {dataset.datasetSubCategory ? dataset.datasetSubCategory : "미지정"}
          </Data>
          <Data>{Math.round(dataset.datasetItemsSize * 0.000001)}MB</Data>
        </Row>
      )}
      {type === "DATALIST" &&
        task &&
        tasks &&
        project &&
        getTasksByProject &&
        projectUsers &&
        currentUser &&
        selectTask &&
        removeTask &&
        isSelectedTask && (
          <Row
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              justifyContent: "none",
            }}
          >
            <CCheckbox 
              colorScheme={"ssloGreen"}
              onChange={ 
                isSelectedTask(task.taskId) ? () => removeTask(task.taskId)
                : () => selectTask(task.taskId)
              }
              isChecked={isSelectedTask(task.taskId)}
            />
            <Data
              style={{
                display: "flex",
                alignItems: "center",
                width: "30%",
                justifyContent: "space-between",
              }}
            >
              <ThumbNail src={`data:image/png;base64,${task.imageThumbnail}`} />
              <span onClick={openTaskPopup} style={{  cursor: "pointer" }}>{truncate(task.imageName, 35)}
                <Modal size={"6xl"} isOpen={isTaskPopupOn} onClose={closeTaskPopup} isCentered autoFocus={false}>
                  <ModalOverlay />
                  <PopupTaskInfo
                    project={project}
                    t={task}
                    tasks={tasks}
                    closeTaskPopup={closeTaskPopup}
                  />
                </Modal>
              </span>
              <Link
                to={`/studio/${
                  project.pType.project_type_id === 1
                    ? "collect"
                    : project.pType.project_type_id === 2
                    ? "preprocessing"
                    : "labeling"
                }/${project.pNo}?selectedTask=${task.taskId}`}
              >
                <Button>STUDIO</Button>
              </Link>
            </Data>
            {project.pType.project_type_id === 1 && task.taskStep === 1 && (
              <Data style={{ width: "10%", textAlign: "center" }}>수집</Data>
            )}
            {project.pType.project_type_id === 2 && task.taskStep === 1 && (
              <Data style={{ width: "10%", textAlign: "center" }}>전처리</Data>
            )}
            {project.pType.project_type_id === 3 && task.taskStep === 1 && (
              <Data style={{ width: "10%", textAlign: "center" }}>가공</Data>
            )}
            {task.taskStep === 2 && <Data style={{ width: "10%", textAlign: "center" }}>검수</Data>}
            <Data style={{ width: "10%", textAlign: "center" }}>{task.taskStatusName}</Data>
            <Data style={{ width: "10%", textAlign: "center" }}>
              {task.updated
                ? getFormattedDate(task.updated)
                : getFormattedDate(task.created!)}
            </Data>
            <Data style={{ width: "15%" }}>
              <Select
                onChange={handleShowWorkerAlert}
                value={worker}
                disabled={!currentUser.isAdmin}
              >
                <option value="" disabled>
                  담당자명
                </option>
                {projectUsers.map((u, index) => (
                  <option key={index} value={u.userId}>
                    {u.userDisplayName}
                  </option>
                ))}
              </Select>
              <AlertDialog
                isOpen={showWorkerAlert}
                onClose={handleCancelWorkerAlert}
                isCentered
                leastDestructiveRef={cancelRef}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>담당자 변경</AlertDialogHeader>
                    <AlertDialogBody>담당자를 변경할까요?</AlertDialogBody>
                    <AlertDialogFooter>
                      <ChakraBtn
                        ref={cancelRef}
                        onClick={handleCancelWorkerAlert}
                        style={{ marginRight: 7 }}
                      >
                        취소
                      </ChakraBtn>
                      <ChakraBtn
                        style={{ backgroundColor: "#3480E3", color: "#FFF" }}
                        onClick={handleChangeWorker}
                      >
                        변경
                      </ChakraBtn>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Data>
            <Data style={{ width: "15%" }}>
              <Select
                onChange={handleShowValidatorAlert}
                value={validator}
                disabled={!currentUser.isAdmin}
              >
                <option value="" disabled>
                  담당자명
                </option>
                {projectUsers.map((u, index) => (
                  <option key={index} value={u.userId}>
                    {u.userDisplayName}
                  </option>
                ))}
              </Select>
              <AlertDialog
                isOpen={showValidatorAlert}
                onClose={handleCancelValidatorAlert}
                isCentered
                leastDestructiveRef={cancelRef}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>담당자 변경</AlertDialogHeader>
                    <AlertDialogBody>담당자를 변경할까요?</AlertDialogBody>
                    <AlertDialogFooter>
                      <ChakraBtn
                        ref={cancelRef}
                        onClick={handleCancelValidatorAlert}
                        style={{ marginRight: 7 }}
                      >
                        취소
                      </ChakraBtn>
                      <ChakraBtn
                        style={{ backgroundColor: "#3480E3", color: "#FFF" }}
                        onClick={handleChangeValidator}
                      >
                        변경
                      </ChakraBtn>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Data>
          </Row>
        )}
      {type === "SETTING_MEMBERS" &&
        project &&
        projectMember &&
        selectMember &&
        isSelectedMember && (
          <Row>
            <CCheckbox
              colorScheme={"ssloGreen"}
              onChange={() => selectMember(projectMember)}
              isChecked={isSelectedMember(projectMember)}
            />
            <Data style={{ textAlign: "center" }}>
              {projectMember.userEmail}
            </Data>
            <Data>{projectMember.userDisplayName}</Data>
            <Data style={{ textAlign: "center" }}>
              {projectMember.isWorker && projectMember.isValidator
                ? "전체"
                : projectMember.isWorker
                ? project.pType.project_type_id === 1
                  ? "수집"
                  : project.pType.project_type_id === 2
                  ? "전처리"
                  : project.pType.project_type_id === 3
                  ? "가공"
                  : ""
                : projectMember.isValidator
                ? "검수"
                : "없음"}
            </Data>
          </Row>
        )}
      {type === "EXPORT_MODEL" && 
        model && 
        selectModel && 
        isSelectedModel && 
        getModelTrainLog && (
          <Row 
            style={{ 
              background: isSelectedModel(model) ? "#aeccf4" : "#fff",    //transparent
            }}  
          >
            {model.status === "done" ? 
              <CCheckbox
                colorScheme={"ssloGreen"}
                onChange={(e) => selectModel(e, model)}
                isChecked={isSelectedModel(model)}
              />
            : <div style={{ width: "15px", height: "15px", marginRight: "30px" }}>
              </div>
            }
            <Data
              style={{
                display: "flex",
                alignItems: "center",
                width: "30%",
                padding: "0 5%",
                justifyContent: "space-between",
              }}
            >
              <Text 
                marginLeft={"10%"} 
                width={"60%"} 
                onClick={model.status === "done" ? (e) => selectModel(e, model) : null}
                textColor={
                  model.status === "fail" ? "grey"
                  : "black"
                }
              >
                {model.name}
              </Text>
              <ChakraBtn 
                width={"30%"} 
                height={"30px"} 
                padding={"3px"} 
                backgroundColor={"#5f6164"} 
                color={"#fff"}
                fontSize={"14px"}
                onClick={() => getModelTrainLog(model)}
                disabled={model.status !== "done"}
              >
                상세보기
              </ChakraBtn>
            </Data>
            <Data 
              style={{ 
                width: "15%", 
                textAlign: "center", 
                color: model.status === "done" ? "#2EA090"
                : model.status === "fail" ? "#f10c08"
                : model.status === "inprogress" ? "#5495D1"
                : "grey",
              }}
            >
              {model.status === "done" ? "완료" 
              : model.status === "fail" ? "실패" 
              : model.status === "inprogress" ? "진행중" 
              : "알 수 없음"}
            </Data>
            <Data style={{ width: "15%", textAlign: "center" }}>
              {model.progress ? model.progress +"%" : "" }
            </Data>
            <Data style={{ width: "20%", textAlign: "center" }}>
              {model.create && model.create !== "none" ? model.create : ""}
            </Data>
            <Data style={{ width: "19%", textAlign: "center" }}>{model.backbone? model.backbone : "model_name"}</Data>
          </Row>
        )}
      {type === "MY_WORK_LIST" &&
        task &&
        project &&
        currentUser &&
        selectTask &&
        removeTask &&
        isSelectedTask && (
          <Row
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              justifyContent: "none",
            }}
          >
            {isSelectedTask(task.taskId) ? (
              <Icon
                src={iconSelected}
                onClick={() => removeTask(task.taskId)}
                style={{
                  marginLeft: 8,
                  width: "15px",
                  height: "15px",
                }}
              />
            ) : (
              <CheckBox
                onClick={() => selectTask(task.taskId)}
                isSelected={isSelectedTask(task.taskId)}
                style={{
                  marginLeft: 8,
                  width: "15px",
                  height: "15px",
                }}
              />
            )}
            <Data
              style={{
                marginLeft: -170,
                display: "flex",
                alignItems: "center",
                width: "30%",
                justifyContent: "space-between",
              }}
            >
              <ThumbNail src={`data:image/png;base64,${task.imageThumbnail}`} />
              <span style={{ marginLeft: 30 }}>
                {truncate(task.imageName, 35)}
              </span>
              {project.pType.project_type_id === 2 && (
                <Link
                  to={`/studio/preprocessing/${project.pNo}?selectedTask=${
                    task.taskId
                  }`}
                >
                  <Button>STUDIO</Button>
                </Link>
              )}
              {project.pType.project_type_id === 3 && (
                <Link
                  to={`/studio/labeling/${project.pNo}?selectedTask=${
                    task.taskId
                  }`}
                >
                  <Button>STUDIO</Button>
                </Link>
              )}
              {project.pType.project_type_id === 1 && (
                <Link
                  to={`/studio/collect/${project.pNo}?selectedTask=${
                    task.taskId
                  }`}
                >
                  <Button>STUDIO</Button>
                </Link>
              )}
            </Data>
            {task.taskStatus === 1 && (
              <Data style={{ width: "3%" }}>미작업</Data>
            )}
            {task.taskStatus === 2 && (
              <Data style={{ width: "3%" }}>진행중</Data>
            )}
            {task.taskStatus === 3 && <Data style={{ width: "3%" }}>완료</Data>}
            {task.taskStatus === 4 && <Data style={{ width: "3%" }}>반려</Data>}
            {project.pType.project_type_id === 3 &&
              <Data style={{ width: "5%", marginRight: "-50px" }}>
                {task.objectCount}
              </Data>
            }
            <Data style={{ width: "8%", marginRight: "-40px" }}>
              {task.updated
                ? getFormattedDate(task.updated)
                : getFormattedDate(task.created!)}
            </Data>
            <Data style={{ width: "10%" }}>
              {task.taskStep === 1 && project.pType.project_type_id === 1 && (
                <Data style={{ width: "10%" }}>수집</Data>
              )}
              {task.taskStep === 1 && project.pType.project_type_id === 2 && (
                <Data style={{ width: "10%" }}>전처리</Data>
              )}
              {task.taskStep === 1 && project.pType.project_type_id === 3 && (
                <Data style={{ width: "10%" }}>가공</Data>
              )}
              {task.taskStep === 2 && (
                <Data style={{ width: "10%" }}>검수</Data>
              )}
            </Data>
          </Row>
        )}
      {type === "MY_PAGE_MEMBERS" &&
        member &&
        isSelectedUser &&
        removeUser &&
        selectedUser && (
          <Row
            style={{
              justifyContent: "none",
            }}
          >
            {isSelectedUser(member.userId) ? (
              <Icon
                src={iconSelected}
                onClick={() => removeUser(member.userId)}
                style={{
                  marginLeft: 8,
                  marginRight: 0,
                  width: "15px",
                  height: "15px",
                }}
              />
            ) : (
              <CheckBox
                onClick={() => selectedUser(member.userId)}
                isSelected={isSelectedUser(member.userId)}
                style={{
                  marginLeft: 8,
                  marginRight: 0,
                  width: "15px",
                  height: "15px",
                }}
              />
            )}
            <Data style={{ width: "25%", textAlign: "center" }}>
              {member.userEmail}
            </Data>
            <Data style={{ width: "25%", textAlign: "center" }}>
              {member.userDisplayName}
            </Data>
            <Data style={{ width: "25%", textAlign: "center" }}>
              <Select
                disabled={member.userId === user.id}
                onChange={handleShowAlert}
                value={
                  modifyPermission !== 0
                    ? modifyPermission
                    : member.member_permission
                }
              >
                {permissionData.map((a, index) => (
                  <option key={index} value={a.role_id}>
                    {a.role_name}
                  </option>
                ))}
              </Select>
              <AlertDialog
                isOpen={showAlert}
                onClose={handleCancelAlert}
                isCentered
                leastDestructiveRef={cancelRef}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>권한 변경</AlertDialogHeader>
                    <AlertDialogBody>권한을 변경할까요?</AlertDialogBody>
                    <AlertDialogFooter>
                      <ChakraBtn
                        ref={cancelRef}
                        onClick={handleCancelAlert}
                        style={{ marginRight: 7 }}
                      >
                        취소
                      </ChakraBtn>
                      <ChakraBtn
                        style={{ backgroundColor: "#3480E3", color: "#FFF" }}
                        onClick={handleChangePermission}
                      >
                        변경
                      </ChakraBtn>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Data>
            <Data style={{ width: "25%", textAlign: "center" }}>
              {member.created}
            </Data>
          </Row>
        )}
    </>
  );
};

export default ListItem;
