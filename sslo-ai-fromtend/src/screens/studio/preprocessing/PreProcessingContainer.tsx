import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { useToast } from "@chakra-ui/react";
import PreProcessingPresenter from "./PreProcessingPresenter";
import { Crop } from "react-image-crop";
import removeBg from "../../../tensorflow";
import {
  dataUrlToBlob,
  getDataUrlByCanvasWithImg,
  getDataUrlWithFilter,
  IParamResizingScale,
  IParamTransform,
} from "../../../utils";
import * as tf from "@tensorflow/tfjs";
import mergeImages from "merge-images";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import taskApi, { ITask } from "../../../api/taskApi";
import userApi, { IUser } from "../../../api/userApi";
import projectApi, {
  IGetProjectParam,
  IProjectInfo,
} from "../../../api/projectApi";
import { useAppSelector } from "../../../hooks";

//! opencv lib import
import cv from "@techstark/opencv-js"

export const WORKSTATUS_ALL = "전체";
export const WORKSTATUS_1 = "미작업";
export const WORKSTATUS_2 = "진행중";
export const WORKSTATUS_3 = "완료";
export const WORKSTATUS_4 = "반려";
export type WorkStatusType = "전체" | "미작업" | "진행중" | "완료" | "반려";

export const SYMMETRY_LEFT_RIGHT = "LeftRight";
export const SYMMETRY_UP_DOWN = "UpDown";
export const ROTATE_90 = "R90";
export const ROTATE_180 = "R180";
export const ROTATE_270 = "R270";
export const ROTATE_360 = "R360";
export type SymmetryType = "HORIZONTAL" | "VERTICAL";
export type RotateType =
  | "ROTATE_90"
  | "ROTATE_180"
  | "ROTATE_270"
  | "ROTATE_360";

//! 이미지 전처리를 이행할때마다 History에 대한 Interface
export interface IDataURLHistory {
  taskId: number;
  order: number;
  dataURL: string;
}

export enum TransType {
  translation = "트랜스레이션",
  scale = "스케일링",
}

export interface IImageInfo {
  width: number;
  height: number;
}

const PreProcessingContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  // ! project ID를 URL로부터 Get
  const { pId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //**! 기본 state, set */
  const toast = useToast();
  // ! display Matrix on symmetry
  const [dm, setDm] = useState<any>(null);
  // ! effect를 적용 시, 적용 기간동안 loading state가 true가 되고 화면에 로딩 컴포넌트를 뿌려주기 위함
  const [effectLoading, setEffectLoading] = useState<boolean>(false);
  // ! Canvas is on ?
  const [isCanvasOn, setIsCanvasOn] = useState<boolean>(false);
  // ! MainCenterBottom의 file select state
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState<boolean>(true);
  // ! 우측 DropBoxContentDescWrapper의 File 정보 노출 state
  const [isFileInfoOpen, setIsFileInfoOpen] = useState<boolean>(false);
  // ! loading state
  const [loading, setLoading] = useState<boolean>(false);
  // ! Main 화면 File List를 처음 여는지 아닌지 여부 (이거는 처음 렌더링할때 로딩하는 시간이 있어서 로딩 이펙트를 넣어주기 위함)
  const [isFirst, setIsFirst] = useState<boolean>(true);
  // ! MainCenterImagePicker의 파일 리스트
  const [tasks, setTasks] = useState<ITask[]>([]);
  // ! current selected file
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const currentTask = useRef(selectedTask);
  // ! 단축키 팝업
  const [isKeyOnOff, setIsKeyOnOff] = useState<boolean>(false);
  // ! 
  const [isRow, setIsRow] = useState<boolean>(true);
  // ! history about task
  const [dataURLHistory, setDataURLHistory] = useState<IDataURLHistory[]>([]);
  // ! current image data url
  const [currentDataURL, setCurrentDataURL] = useState<string | null>(null);
  // ! work statutes
  const [workStatutes, setWorkStatutes] = useState<WorkStatusType>(
    WORKSTATUS_ALL
  );
  // ! 프로젝트 전처리 담당자
  const [preProcessingAssignee, setPreProcessingAssignee] = useState<IUser>();
  // ! 프로젝트 검수 담당자
  const [examinee, setExaminee] = useState<IUser>();
  // ! 프로젝트 참여자
  const [projectUser, setProjectUser] = useState<IUser[]>([]);
  // ! 프로젝트 정보
  const [projectInfo, setProjectInfo] = useState<IProjectInfo | null>();
  // ! MainCenterBottom의 isOpen state toggle method
  const toggleFileSelector = () => {
    setLoading(true);
    setIsFileSelectorOpen((prev) => !prev);
    setTimeout(() => {
      setLoading(false);
      setIsFirst(false);
    }, 1500);
    return;
  };
  // ! set preProcessingAssignee
  const _setPreProcessingAssignee = (
    user: IUser
  ): React.MouseEventHandler<HTMLButtonElement> | undefined => {
    // TODO: Toast Popup ??
    doUpdateTaskUser(user, "Worker");
    setSelectedTask((prev) => ({
      ...prev!,
      taskWorker: {
        id: user.userId,
        displayName: user.userDisplayName,
        email: user.userEmail,
      },
    }));
    setPreProcessingAssignee(user);
    return;
  };
  // ! set examinee
  const _setExaminee = (
    user: IUser
  ): React.MouseEventHandler<HTMLButtonElement> | undefined => {
    // TODO: Toast Popup ??
    doUpdateTaskUser(user, "Validator");
    setSelectedTask((prev) => ({
      ...prev!,
      taskValidator: {
        id: user.userId,
        displayName: user.userDisplayName,
        email: user.userEmail,
      },
    }));
    setExaminee(user);
    return;
  };
  // ! Task의 전처리 담당자 / 검수 담당자를 바꿀 때 호출되는 메소드
  const doUpdateTaskUser = async (
    user: IUser,
    type: "Worker" | "Validator"
  ) => {
    if (pId && selectedTask) {
      const updateTaskParams = {
        project_id: parseInt(pId),
      };
      let updateTaskPayload;
      if (type === "Worker") {
        updateTaskPayload = {
          task_id: selectedTask.taskId,
          task_worker: {
            user_id: user.userId,
          },
          task_validator: selectedTask.taskValidator ? {
            user_id: selectedTask.taskValidator.id,
          } : null,
        };
      }
      if (type === "Validator") {
        updateTaskPayload = {
          task_id: selectedTask.taskId,
          task_validator: {
            user_id: user.userId,
          },
          task_worker: selectedTask.taskWorker ? {
            user_id: selectedTask.taskWorker.id,
          } : null,
        };
      }
      await taskApi.updateTask(
        updateTaskParams,
        updateTaskPayload,
        loggedInUser.accessToken!
      );
    } else {
      return;
    }
  };
  // ! toggle File info state on MainRightPanel
  const toggleFileInfoOpen = () => {
    setIsFileInfoOpen((prev) => !prev);
    return;
  };
  // ! set work status on MainBottomPanel
  const _setWorkStatutes = (
    status: "전체" | "미작업" | "완료" | "진행중" | "반려"
  ) => {
    setWorkStatutes(status);
  };
  // ! call api search task then set tasks
  const searchTasks = async (param: any) => {
    const res = await taskApi.searchTaskByProject(
      param,
      loggedInUser.accessToken!
    );
    if (res && res.status === 200 && res.statusText === "OK") {
      await cleanTasks(res.data.datas);
    } else {
      // TODO: error handling
    }
  };
  // ! call api get project
  const getProject = async (param: IGetProjectParam) => {
    const res = await projectApi.getProject(param, loggedInUser.accessToken!);
    if (res && res.status === 200) {
      setProjectInfo({
        projectId: res.data.project_id,
        projectName: res.data.project_name,
      });
      let users: IUser[] = [];
      res.data.project_members.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setProjectUser(users);
    } else {
      // TODO: error handling
    }
  };
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: any[]) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    for (let i = 0; i < tasks.length; i++) {
      const taskId = tasks[i].task_id;
      const imageName = tasks[i].task_detail.image_name;
      const imageThumbnail = tasks[i].task_detail.image_thumbnail;
      const taskStep = tasks[i].task_status.task_status_step;
      const taskStatus = tasks[i].task_status.task_status_progress;
      const taskStatusName =
        taskStatus === 1
          ? "미작업"
          : taskStatus === 2
          ? "진행중"
          : taskStatus === 3
          ? "완료"
          : taskStatus === 4
          ? "반려"
          : undefined;
      const imageFormat = tasks[i].task_detail.image_format;
      const imageWidth = tasks[i].task_detail.image_width;
      const imageHeight = tasks[i].task_detail.image_height;
      const imageSize = tasks[i].task_detail.image_size
        ? tasks[i].task_detail.image_size
        : null;

      // ! task worker info
      let taskWorker = null;
      if (tasks[i].task_worker) {
        const displayName = tasks[i].task_worker.user_display_name;
        const id = tasks[i].task_worker.user_id;
        const email = tasks[i].task_worker.user_email;
        taskWorker = { id, email, displayName };
      }

      // ! task validator info
      let taskValidator = null;
      if (tasks[i].task_validator) {
        const valDisplayName = tasks[i].task_validator.user_display_name;
        const valId = tasks[i].task_validator.user_id;
        const valEmail = tasks[i].task_validator.user_email;
        taskValidator = {
          id: valId,
          email: valEmail,
          displayName: valDisplayName,
        };
      }

      // ! cleanTask는 Task Type이고 Task 타입에 맞게 아래 form을 형성후 cleanTask에 form push
      form = {
        taskId,
        imageName,
        imageThumbnail,
        image: "",
        taskStep,
        taskStatus,
        taskStatusName,
        imageFormat,
        imageWidth,
        imageHeight,
        imageSize,
        taskWorker,
        taskValidator,
      };
      cleanedTasks.push(form);
    }
    setTasks(() => cleanedTasks);
  };
  // ! set selected task
  const _setSelectedTask = (task: ITask) => {
    setSelectedTask(task);
  };
  // ! Header 상단 prev 버튼 클릭 시 handler
  const handlePrevTask = (
    taskId: number
  ): MouseEventHandler<HTMLImageElement> | undefined => {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskId === taskId && i !== 0) {
        setSelectedTask(tasks[i - 1]);
        if (
          tasks[i - 1].taskWorker !== null &&
          tasks[i - 1].taskWorker !== undefined
        ) {
          const worker: IUser = {
            userId: tasks[i - 1].taskWorker!.id,
            userDisplayName: tasks[i - 1].taskWorker!.displayName,
            userEmail: tasks[i - 1].taskWorker!.email,
            created: 0,
          };
          setPreProcessingAssignee(worker);
        } else {
          setPreProcessingAssignee(undefined);
        }
        if (
          tasks[i - 1].taskValidator !== null &&
          tasks[i - 1].taskValidator !== undefined
        ) {
          const validator: IUser = {
            userId: tasks[i - 1].taskValidator!.id,
            userDisplayName: tasks[i - 1].taskValidator!.displayName,
            userEmail: tasks[i - 1].taskValidator!.email,
            created: 0,
          };
          setExaminee(validator);
        } else {
          setExaminee(undefined);
        }
        return;
      }
      if (tasks[i].taskId === taskId && i === 0) {
        toast({
          title: "첫번째 페이지입니다.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  // ! Header 상단 next 버튼 클릭 시 handler
  const handleNextTask = (
    taskId: number
  ): MouseEventHandler<HTMLImageElement> | undefined => {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskId === taskId && i !== tasks.length - 1) {
        setSelectedTask(tasks[i + 1]);
        if (
          tasks[i + 1].taskWorker !== null &&
          tasks[i + 1].taskWorker !== undefined
        ) {
          const worker: IUser = {
            userId: tasks[i + 1].taskWorker!.id,
            userDisplayName: tasks[i + 1].taskWorker!.displayName,
            userEmail: tasks[i + 1].taskWorker!.email,
            created: 0,
          };
          setPreProcessingAssignee(worker);
        } else {
          setPreProcessingAssignee(undefined);
        }
        if (
          tasks[i + 1].taskValidator !== null &&
          tasks[i + 1].taskValidator !== undefined
        ) {
          const validator: IUser = {
            userId: tasks[i + 1].taskValidator!.id,
            userDisplayName: tasks[i + 1].taskValidator!.displayName,
            userEmail: tasks[i + 1].taskValidator!.email,
            created: 0,
          };
          setExaminee(validator);
        } else {
          setExaminee(undefined);
        }
        return;
      }
      if (tasks[i].taskId === taskId && i === tasks.length - 1) {
        toast({
          title: "마지막 페이지입니다.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  // ! 아래 searchTasks가 실행된 후 task 데이터가 들어와서 tasks 길이에 변화가 생기면 selectedTask에 값을 넣음
  useEffect(() => {
    const selectedTask = location.search.split("?")[1];
    if (selectedTask) {
      let index: number;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === parseInt(selectedTask.split("=")[1])) {
          index = i;
          break;
        }
      }
      setSelectedTask(tasks[index!]);
    } else {
      setSelectedTask(tasks[0]);
    }
    // eslint-disable-next-line
  }, [tasks.length]);
  // ! dataURLHistory's first order stored when selectedTask changed.
  useEffect(() => {
    currentTask.current = selectedTask;
    setHotKey();
    if (selectedTask) {
      tasks.forEach((t, index) => {
        if(t.taskId === selectedTask.taskId) {
          document.getElementById("img"+index).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      if(selectedTask.imageWidth > selectedTask.imageHeight) {
        setIsRow(true);
      } else {
        setIsRow(false);
      }
      setImageInfo({
        width: selectedTask.imageWidth,
        height: selectedTask.imageHeight
      });
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].order === 0
        )
          return;
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].dataURL === selectedTask.image
        )
          return;
      }
      if (selectedTask.image === "") return;
      const history: IDataURLHistory = {
        taskId: selectedTask.taskId,
        order: 0,
        dataURL: selectedTask.image,
      };
      setDataURLHistory([...dataURLHistory, history]);
      setPreProcessingAssignee(null);
      setExaminee(null);
    }
    // eslint-disable-next-line
  }, [selectedTask]);

  //! Task의 ID를 받아서 해당 이미지를 getTaskData API를 호출하여 받고 그 바이너리 이미지를 base64로 변환하여 state에 저장
  const setTaskInitImage = async () => {
    if (selectedTask) {
      const res = await taskApi.getTaskData(
        { project_id: pId, task_id: selectedTask.taskId },
        "blob",
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        const blob = res.data;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          if (typeof reader.result === "string") {
            setSelectedTask((prev) => ({
              ...prev!,
              image: reader.result as string,
            }));
            setCurrentDataURL(reader.result);
          }
        };
      } else {
        // TODO: Error handling
      }
    }
  };

  // ! 최초에 selectedTask가 가진 이미지는 없어야 하며 그 때 호출되는 useEffect()
  useEffect(() => {
    if (selectedTask && selectedTask.image === "") {
      setTaskInitImage();
    }
    // eslint-disable-next-line
  }, [selectedTask]);

  // ! 이미지에 새로운 이펙트가 들어가면 그때마다 order를 하나 올려서 히스토리를 저장
  useEffect(() => {
    if (selectedTask && currentDataURL) {
      let lastOrder = 0;
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].dataURL === currentDataURL
        ) {
          return;
        }
        if (dataURLHistory[i].taskId === selectedTask.taskId) {
          if (dataURLHistory[i].order >= lastOrder)
            lastOrder = dataURLHistory[i].order + 1;
        }
      }
      const newHistory: IDataURLHistory = {
        taskId: selectedTask.taskId,
        order: lastOrder,
        dataURL: currentDataURL,
      };
      setDataURLHistory([...dataURLHistory, newHistory]);
    }
    // eslint-disable-next-line
  }, [currentDataURL]);

  // ! 최초 렌더링 시 searchTasks 실행
  useEffect(() => {
    searchTasks({
      project_id: pId,
      orderBy: "task_id",
      order: "ASC",
      maxResults: 10000,
    });
    //searchAllUsers({ maxResults: 50 });
    if (pId) getProject({ project_id: parseInt(pId) });
    // eslint-disable-next-line
  }, []);

  //*************** Header function **********************/
  const setHotKey = () => {
    document.onkeydown = function (e) {
      if(selectedTask &&
               (loggedInUser.isAdmin ||
                selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === loggedInUser.id ||
                selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === loggedInUser.id)){
        console.log(e);
        let key = e.key || e.keyCode;
        
        if (e.ctrlKey && (key === '+' || key === 107)) {
          //resizingVal + 10;
          let size = parseInt(currentResizingVal.current) + 10;
          if(size > 200) {
            size = 200;
          }
          setResizingVal(size.toString());
          return false;
        }
        else if (e.ctrlKey && (key === '-' || key === 109)) {
          //resizingVal - 10;
          let size = parseInt(currentResizingVal.current) - 10;
          if(size < 10) {
            size = 10;
          }
          setResizingVal(size.toString());
          return false;
        }

        else if(e.ctrlKey && (key === 'z' || key === 90)){
          handleUnDo();
          return false;
        }
        else if(e.ctrlKey && (key === 'y' || key === 89)){
          handleRedo();
          return false;
        }

        else if(e.shiftKey && (key === 'S' || key === 83)){
          handleCompleted();
          return false;
        }

        else if(e.ctrlKey && (key === 's' || key === 83)){
          saveImage();
          return false;
        }
        else if (key === 81 || key === 'q') {
          if(currentTask.current){
            handlePrevTask(currentTask.current.taskId);
          }
          return false;
        }
        else if (key === 69 || key === 'e') {
          if(currentTask.current){
            handleNextTask(currentTask.current.taskId);
          }
          return false;
        }
      } else {
        
      }
    };
  };

  // ! Download image
  const handleDownloadImage = () => {
    if (selectedTask && currentDataURL) {
      const a = document.createElement("a");
      const img = document.createElement("img");
      img.src = currentDataURL;
      console.log(img);
      console.log(currentDataURL);
      a.setAttribute("download", selectedTask.imageName);
      a.setAttribute("href", currentDataURL);
      a.click();
    }
  };
  // ! Toggle Hot Key
  const setKeyOnOff = () => {
    setIsKeyOnOff((prev) => !prev);
  };

  // ! Toggle full screen
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  // ! Filtering only selected task's history
  const getFilteredSelectedTask = (selectedTask: ITask): IDataURLHistory[] => {
    return currentDataURLHistory.current.filter(
      (history) => history.taskId === selectedTask.taskId
    );
  };
  const currentDataURLHistory = useRef(dataURLHistory);
  useEffect(() => {
    currentDataURLHistory.current = dataURLHistory;
  }, [dataURLHistory]);

  // ! Undo
  const handleUnDo = () => {
    if (selectedTask) {
      const currentTaskHistory = getFilteredSelectedTask(selectedTask);
      console.log(currentTaskHistory);
      let pointer;
      for (let i = 0; i < currentTaskHistory.length; i++) {
        console.log(currentDataURL);
        console.log(currentTaskHistory[i].dataURL);
        if (currentDataURL === currentTaskHistory[i].dataURL) {
          console.log("same: " + i);
          if (currentTaskHistory[i].order === 0) {
            continue;
          }
          pointer = currentTaskHistory[i - 1].order;
          break;
        }
      }
      if (pointer !== undefined) {
        setCurrentDataURL(currentTaskHistory[pointer].dataURL);
      }
    }
  };
  // ! Redo
  const handleRedo = () => {
    if (selectedTask) {
      const currentTaskHistory = getFilteredSelectedTask(selectedTask);
      let pointer;
      for (let i = 0; i < currentTaskHistory.length; i++) {
        if (currentDataURL === currentTaskHistory[i].dataURL) {
          if (currentTaskHistory[i].order === currentTaskHistory.length - 1) {
            return;
          }
          pointer = currentTaskHistory[i + 1].order;
          break;
        }
      }
      if (pointer !== undefined) {
        setCurrentDataURL(currentTaskHistory[pointer].dataURL);
      }
    }
  };
  // ! Save (Update)
  const saveImage = async () => {
    if (currentDataURL && selectedTask) {
      const file = dataUrlToBlob(currentDataURL, selectedTask.imageName);
      let formdata = new FormData();
      formdata.append("image", file);

      if (pId) {
        const res = await taskApi.updateTaskData(
          { project_id: parseInt(pId), task_id: selectedTask.taskId },
          formdata,
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          console.log(res.data);
          // ! taskStep -> 1: 1단계(전처리면 전처리, 가공이면 가공, 수집이면 수집) / 2: 2단계 (검수)
          const saveRes = await taskApi.updateTaskStatus(
            { project_id: parseInt(pId), task_id: selectedTask.taskId },
            { task_status_progress: 2 },
            loggedInUser.accessToken!
          );
          if (saveRes && saveRes.status === 200) {
            console.log(saveRes.data);
            toast({
              title: "Task Image 업데이트 완료",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }
          setSelectedTask((prev) => ({
            ...prev!,
            imageThumbnail: res.data.task_detail.image_thumbnail,
            taskStatus: 2,
          }));
        }
        searchTasks({
          project_id: pId,
          orderBy: "task_id",
          order: "ASC",
          maxResults: 10000,
        });
      }
    }
  };
  // ! 스튜디오의 좌측 상단 헤더의 뒤로가기 버튼
  const goBack = () => {
    navigate(-1);
  };
  // ! 완료 버튼 클릭 시 호출
  const handleCompleted = async () => {
    if (pId && selectedTask && currentDataURL) {
      const currentStep = selectedTask.taskStep;
      if (currentStep === 2) {
        if (!selectedTask.taskValidator) {
          toast({
            title: "Task의 검수담당자가 아닙니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        if (
          selectedTask.taskValidator &&
          loggedInUser.id !== selectedTask.taskValidator.id
        ) {
          toast({
            title: "Task의 검수담당자만 가능한 작업입니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      }

      const file = dataUrlToBlob(currentDataURL, selectedTask.imageName);
      let formdata = new FormData();
      formdata.append("image", file);

      const imageSaveRes = await taskApi.updateTaskData(
        { project_id: parseInt(pId), task_id: selectedTask.taskId },
        formdata,
        loggedInUser.accessToken!
      );

      if (imageSaveRes && imageSaveRes.status === 200) {
        const res = await taskApi.updateTaskStatus(
          { project_id: parseInt(pId), task_id: selectedTask.taskId },
          { task_status_progress: 3 },
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          toast({
            title: "Task Image 업데이트 완료",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          switch (currentStep) {
            case 1:
              setSelectedTask((prev) => ({
                ...prev!,
                imageThumbnail: imageSaveRes.data.task_detail.image_thumbnail,
                taskStep: 2,
                taskStatus: 1,
              }));
              break;
            case 2:
              setSelectedTask((prev) => ({
                ...prev!,
                imageThumbnail: imageSaveRes.data.task_detail.image_thumbnail,
                taskStatus: 3,
              }));
              break;
          }
        }
        searchTasks({
          project_id: pId,
          orderBy: "task_id",
          order: "ASC",
          maxResults: 10000,
        });
      }
    }
  };
  // ! 반려 팝업 노출 상태 state
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  // ! 반려 팝업에서 반려 사유 입력 내용 저장 state
  const [rejectText, setRejectText] = useState<string>();
  // ! 반려 버튼 클릭 시 반려 팝업 노출 on
  const handleOpenReject = () => {
    setIsOpenReject(true);
    document.onkeydown = null;
  };
  // ! 반려 팝업 닫기 버튼 클릭 시 팝업 미노출 on
  const handleCancelReject = () => {
    setIsOpenReject(false);
    setHotKey();
  };
  // ! 반려 팝업에서 적용 버튼 클릭 시 호출 function
  const onSubmitReject = async () => {
    if (pId && selectedTask && rejectText && rejectText !== "") {
      const res = await taskApi.updateTaskStatus(
        { project_id: parseInt(pId), task_id: selectedTask.taskId },
        { task_status_progress: 4, comment_body: rejectText },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        toast({
          title: "반려 처리 완료",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        setSelectedTask((prev) => ({
          ...prev!,
          taskStatus: 4,
        }));
      }
    }
    setIsOpenReject(false);
  };
  // ! 반려 팝업에서 textarea의 입력 내용 handle change
  const handleSetRejectText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRejectText(e.target.value);
  };
  // ! 반려 상태일 때 반려 사유 보기 버튼 클릭에 관한 state
  const [showRejectComment, setShowRejectComment] = useState<boolean>(false);
  // ! 반려 사유 보기 팝업 닫기 시 호출
  const handleCancelRejectComment = () => {
    setShowRejectComment(false);
    setRejectComment(undefined);
  };
  // ! 반려 사유 보기 팝업의 반려 사유 내용 저장 state
  const [rejectComment, setRejectComment] = useState<string>();
  // !
  // ! 반려 사유 보기 버튼 클릭 시 호출되며 반려 사유를 서버로부터 받아온다.
  const handleShowRejctHelp = async () => {
    if (pId && selectedTask) {
      const res = await taskApi.getTaskRejectComment(
        {
          project_id: parseInt(pId),
          task_id: selectedTask.taskId,
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        setRejectComment(res.data.comment_body);
        setShowRejectComment(true);
      }
    }
  };

  //*************** Main function **********************/

  const [imageInfo, setImageInfo] = useState<IImageInfo>({
    width: 0,
    height: 0
  });

  //**! rotate / symmetry  */
  // ! rotate / symmetry effect 팝업 노출상태 state
  const [isRotateSymmetry, setIsRotateSymmetry] = useState<boolean>(false);
  // ! rotate / symmetry 팝업창을 열음
  const onOpenRotateSymmetry = () => {
    setIsRotateSymmetry(true);
  };
  // ! rotate / symmetry 팝업창을 닫음 (취소 버튼)
  const onCancelRotateSymmetry = () => {
    setDm(null);
    setIsCanvasOn(false);
    setIsRotateSymmetry(false);
  };
  // ! rotate / symmetry 팝업창을 적용 (적용 버튼)
  const onSubmitRotateSymmetry = () => {
    const canvas = document.getElementById("rsCanvas") as HTMLCanvasElement;
    let imageElement = document.getElementById("mainImage");
    imageElement.style.width = canvas.width + "px";
    const newDataURL = canvas.toDataURL("image/jpeg");
    setCurrentDataURL(newDataURL);
    setDm(null);
    setIsCanvasOn(false);
    setIsRotateSymmetry(false);
  };
  // ! 대칭 버튼 클릭 시 대칭 이펙트 메소드
  const doSymmetry = (type: SymmetryType) => {
    setEffectLoading(true);
    setIsCanvasOn(true);
    let imageElement = document.getElementById("mainImage");
    let image = cv.imread(imageElement);
    let displayMat = image.clone();
    let dst = new cv.Mat();

    let flipType;
    switch (type) {
      case "HORIZONTAL":
        flipType = 1;
        break;
      case "VERTICAL":
        flipType = 0;
        break;
    }

    if (dm === null) {
      cv.flip(displayMat, dst, flipType);
    } else {
      cv.flip(dm, dst, flipType);
    }
    cv.imshow("rsCanvas", dst);
    setDm(dst);
    displayMat.delete();
    setEffectLoading(false);
  };
  // ! 회전 버튼 클릭 시 회전 이펙트 메소드
  const doRotate = (type: RotateType) => {
    if(type === "ROTATE_360") {
      return;
    }
    setEffectLoading(true);
    setIsCanvasOn(true);

    let imageElement = document.getElementById("mainImage");
    let image = cv.imread(imageElement);
    let displayMat = image.clone();
    let dst = new cv.Mat();

    let angle;
    switch (type) {
      case "ROTATE_90":
        angle = cv.ROTATE_90_COUNTERCLOCKWISE;
        break;
      case "ROTATE_180":
        angle = cv.ROTATE_180;
        break;
      case "ROTATE_270":
        angle = cv.ROTATE_90_CLOCKWISE;
        break;
    }

    if (dm) {
      cv.rotate(dm, dst, angle);
    } else {
      cv.rotate(displayMat, dst, angle);
    }
    cv.imshow("rsCanvas", dst);
    setDm(dst);
    displayMat.delete();
    setEffectLoading(false);
  };

  //**! thresholding */
  const [isThresholding, setIsThresholding] = useState<boolean>(false);
  const [threshValue, setThreshValue] = useState<string | null>(null);
  const [showThresholding, setShowThresholding] = useState<boolean>(false);
  const onOpenThresholding = () => {
    setIsThresholding(true);
  };
  const onCancelThresholding = () => {
    setThreshValue(null);
    setIsThresholding(false);
    setShowThresholding(false);
  };
  const onSubmitThresholding = () => {
    const canvas = document.getElementById("thCanvas") as HTMLCanvasElement;
    const newDataURL = canvas.toDataURL("image/jpeg");
    setCurrentDataURL(newDataURL);
    setThreshValue(null);
    setIsThresholding(false);
    setShowThresholding(false);
  };
  const handleChangeThresholding = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowThresholding(false);
    setThreshValue(e.target.value);
  };
  const onChangeCaptureThresholding = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    let img = document.getElementById("mainImage");
    let canvas = document.getElementById("thCanvas");
    let base = cv.imread(img);
    let cloned = base.clone();
    let dst = new cv.Mat();

    cv.threshold(cloned, dst, parseInt(threshValue!), 255, cv.THRESH_TOZERO);
    cv.imshow(canvas, dst);
    cloned.delete();
    dst.delete();
    setShowThresholding(true);
  };

  //**! grayscale effect */
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [grayscaleVal, setGrayscaleVal] = useState<string | null>(null);
  const handleGrayscaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrayscaleVal(e.target.value);
  };
  const onOpenGrayscale = () => {
    setIsGrayscale(true);
  };
  const onCancelGrayscale = () => {
    setGrayscaleVal(null);
    setIsGrayscale(false);
  };
  const onSubmitGrayscale = () => {
    const mainImage = document.getElementById("mainImage") as HTMLImageElement;
    const grayscale = `grayscale(${grayscaleVal}%)`;
    const newDataURL = getDataUrlWithFilter(mainImage, imageInfo.width, imageInfo.height, grayscale);
    setCurrentDataURL(newDataURL);
    setIsGrayscale(false);
    setGrayscaleVal(null);
  };

  //**! transform effect */
  // ! 스케일링인지 확대/축소인지 여부
  const [isScaleToResizing, setIsScaleToResizing] = useState<boolean>(false);
  // ! 변환 버튼을 클릭했는지에 대한 여부
  const [isTransform, setIsTransfrom] = useState<boolean>(false);
  // ! 변환 팝업 내 트랜스레이션 / 스케일링 타입 state
  const [transType, setTransType] = useState<TransType>(TransType.translation);
  // ! 스케일링 X값 state
  const [scaleX, setScaleX] = useState<string>("1.0");
  // ! 스케일링 Y값 state
  const [scaleY, setScaleY] = useState<string>("1.0");
  // ! 트랜스레이션 작업 시, 작업한 translation xy 값 저장 state
  const [translationXY, setTranslationXY] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  // ! 트랜스레이션 작업 시, 왼쪽으로 평행 이동 버튼 클릭
  const handleLeftTX = () => {
    //setLeftTranslationX((prev) => -(prev + 5));
    setTranslationXY((prev) => {
      return { x: prev.x - 5, y: prev.y };
    });
  };
  // ! 트랜스레이션 작업 시, 오른쪽으로 평행 이동 버튼 클릭
  const handleRightTX = () => {
    setTranslationXY((prev) => {
      return { x: prev.x + 5, y: prev.y };
    });
  };
  // ! 트랜스레이션 작업 시, 위로 평행 이동 버튼 클릭
  const handleUpTX = () => {
    setTranslationXY((prev) => {
      return { x: prev.x, y: prev.y - 5 };
    });
  };
  // ! 트랜스레이션 작업 시, 아래로 평행 이동 버튼 클릭
  const handleDownTX = () => {
    setTranslationXY((prev) => {
      return { x: prev.x, y: prev.y + 5 };
    });
  };
  const [valueX, setValueX] = useState<string>("1.0");
  const [valueY, setValueY] = useState<string>("1.0");
  const [prevX, setPrevX] = useState<string>(scaleX);
  const [prevY, setPrevY] = useState<string>(scaleY);
  useEffect(() => {
    console.log(scaleX);
    setValueX(scaleX);
  }, [scaleX]);
  useEffect(() => {
    setValueY(scaleY);
  }, [scaleY]);
  // ! 스케일링 작업 시, X값 변경
  const handleChangeScaleX = (e: ChangeEvent<HTMLInputElement>) => {
    let x = e.target.value;
    const splitX = x.split(".");
    setValueX(x);
    if(x.length >= 3 || parseFloat(x) > 1.0) {
      if (parseFloat(x) > 2.0) {
        x = "2.0";
      } else if (parseFloat(x) < 0.1) {
        x = "0.1";
      } else {
        if(splitX.length >= 2 && parseInt(splitX[1]) >= 0) 
          x = splitX[0] + "." + (parseInt(splitX[1]) % 10);
      }
      setScaleX(x);
      setValueX(x);
      if(isScaleToResizing) {
        setScaleRatio(x);
        setScaleY(x);
        setValueY(x);
      }
    }
  };
  // ! 스케일링 작업 시, Y값 변경
  const handleChangeScaleY = (e: ChangeEvent<HTMLInputElement>) => {
    let y = e.target.value;
    const splitY = y.split(".");
    setValueY(y);
    if(y.length >= 3 || parseFloat(y) > 1.0) {
      if (parseFloat(y) > 2.0) {
        y = "2.0";
      } else if (parseFloat(y) < 0.1) {
        y = "0.1";
      } else {
        if(splitY.length >= 2 && parseInt(splitY[1]) >= 0) 
          y = splitY[0] + "." + (parseInt(splitY[1]) % 10);
      }
      setScaleY(y);
      setValueY(y);
      if(isScaleToResizing) {
        setScaleRatio(y);
        setScaleX(y);
        setValueX(y);
      }
    }
  };

  const handleScaleToResizing = () => {
    setIsScaleToResizing((prev) => !prev);
  };

  useEffect(() => {
    if(parseFloat(scaleX) !== 1.0) {
      setScaleY(scaleX);
    } else if(parseFloat(scaleY) !== 1.0) {
      setScaleX(scaleY);
    }
  }, [isScaleToResizing]);

  // ! 트랜스레이션 작업 시 초기화 버튼
  const cleanTransformEffect = () => {
    setTranslationXY({ x: 0, y: 0 });
  };
  // ! 변환 팝업 내 상단 트랜스레이션 버튼 클릭
  const handleTransTypeToTranslation = () => {
    setTransType(TransType.translation);
  };
  // ! 변환 팝업 내 상단 스케일링 버튼 클릭
  const handleTransTypeToScale = () => {
    setTransType(TransType.scale);
  };
  // ! 변환 버튼 클릭 시 호출
  const onOpenTransform = () => {
    setIsTransfrom(true);
  };
  // ! 변환 팝업 닫을 때 호출
  const onCancelTransform = () => {
    // setScaleX("1.0");
    // setScaleY("1.0");
    setTranslationXY({ x: 0, y: 0 });
    setTransType(TransType.translation);
    setIsTransfrom(false);
  };
  // ! 변환 팝업 적용 시 호출
  const onSubmitTransform = () => {
    if(scaleX === scaleY) {
      onSubmitResizingScale();
      setIsTransfrom(false);
    } else {
      const tempImg = document.getElementById("mainImage") as HTMLImageElement;
      const transform: IParamTransform = {
        scaleX: parseFloat(scaleX),
        scaleY: parseFloat(scaleY),
        transX: translationXY.x,
        transY: translationXY.y,
      };
      const newDataURL = getDataUrlWithFilter(tempImg, imageInfo.width, imageInfo.height, undefined, transform);
      setCurrentDataURL(newDataURL);
      setIsTransfrom(false);
    }
  };

  //**! brightness, contrast */
  const [isBCOpen, setIsBCOpen] = useState<boolean>(false);
  const [brVal, setBrVal] = useState<string | null>(null);
  const [conVal, setConVal] = useState<string | null>(null);
  const handleBrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrVal(e.target.value);
  };
  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConVal(e.target.value);
  };
  const onOpenBC = () => {
    setIsBCOpen(true);
  };
  const onCancelBC = () => {
    setBrVal(null);
    setConVal(null);
    setIsBCOpen(false);
  };
  const onSubmitBC = () => {
    const mainImage = document.getElementById("mainImage") as HTMLImageElement;
    let filter = "";
    if (brVal && !conVal) {
      filter = `brightness(${brVal}%)`;
    } else if (!brVal && conVal) {
      filter = `contrast(${conVal}%)`;
    } else if (brVal && conVal) {
      filter = `brightness(${brVal}%) contrast(${conVal}%)`;
    }
    const newDataURL = getDataUrlWithFilter(mainImage, imageInfo.width, imageInfo.height, filter);
    setCurrentDataURL(newDataURL);
    setBrVal(null);
    setConVal(null);
    setIsBCOpen(false);
  };

  //**! resize  */
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizingVal, setResizingVal] = useState<string | null>("100");
  const currentResizingVal = useRef(resizingVal);
  useEffect(() => {
    currentResizingVal.current = resizingVal;
  }, [resizingVal]);
  const handleResizing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizingVal(e.target.value);
  };
  const onOpenResizing = () => {
    setIsResizing(true);
  };
  const onCancelResizing = () => {
    //setResizingVal(null);
    setScaleX(prevX);
    setScaleY(prevY);
    setScaleRatio(scaleRatioVal);
    setIsResizing(false);
  };
  const onSubmitResizing = () => {
    //   let img = document.getElementById('mainImage');
    //   let canvas = document.getElementById('canvas');
    //   let base = cv.imread(img);
    //   let dst = new cv.Mat();
    //   let dsize = new cv.Size(
    //     base.cols + (parseInt(resizingVal) - 100),
    //     base.rows + (parseInt(resizingVal) - 100)
    //   );
    //   console.log(dsize);
    //   cv.resize(base, dst, dsize, 0, 0, cv.INTER_LINEAR);
    //   cv.imshow(canvas, dst);
    //   dst.delete();
    setIsResizing(false);
  };

  // ! 확대 축소 배율 state
  const [scaleRatio, setScaleRatio] = useState<string>("1.0");
  const [scaleRatioVal, setScaleRatioVal] = useState<string>("1.0");

  // ! 확대 축소 작업
  const handleChangeResizingScale = (e: ChangeEvent<HTMLInputElement>) => {
    let ratio = e.target.value;
    let fRatio = parseFloat(ratio)/100;
    if (fRatio > 2.0) {
      setScaleRatio("2");
    } else {
      setScaleRatio(fRatio.toString());
    }
  };

  const resizingScale: IParamResizingScale = {
    scale: parseFloat(scaleRatio),
  };
  /* const [resizingScale, setResizingScale] = useState<IParamResizingScale>({
    scale: 1.0
  });

  useEffect(() => {
    setResizingScale({
      scale: parseFloat(scaleRatio),
    })
  }, [scaleRatio]); */

  // ! 확대 축소 적용 시 호출
  const onSubmitResizingScale = () => {
    const tempImg = document.getElementById("mainImage") as HTMLImageElement;
    let newDataURL = currentDataURL;
    if(isScaleToResizing) {
      newDataURL = getDataUrlWithFilter(tempImg, selectedTask.imageWidth, selectedTask.imageHeight, undefined, undefined, resizingScale);
      setImageInfo({
        width: selectedTask.imageWidth * resizingScale.scale,
        height: selectedTask.imageHeight * resizingScale.scale,
      });
      setScaleRatioVal(scaleRatio);
    } else {
      const transform: IParamTransform = {
        scaleX: parseFloat(scaleX),
        scaleY: parseFloat(scaleY),
        transX: translationXY.x,
        transY: translationXY.y,
      };
      newDataURL = getDataUrlWithFilter(tempImg, selectedTask.imageWidth, selectedTask.imageHeight, undefined, transform);
      setImageInfo({
        width: selectedTask.imageWidth * parseFloat(scaleX),
        height: selectedTask.imageHeight * parseFloat(scaleY),
      });
      setPrevX(scaleX);
      setPrevY(scaleY);
    }
    console.log(newDataURL);
    setCurrentDataURL(newDataURL);
    setIsResizing(false);
  };

  //**! Cut */
  const [crop, setCrop] = useState<Crop>();
  const [startCrop, setStartCrop] = useState<boolean>(false);
  const handleCrop = (e: PointerEvent) => {
    if (crop) {
      const cropCanvas = document.createElement("canvas") as HTMLCanvasElement;
      const cropImage = document.getElementById(
        "cropImage"
      ) as HTMLImageElement;
      const scaleX = cropImage.naturalWidth / cropImage.width;
      const scaleY = cropImage.naturalHeight / cropImage.height;
      cropCanvas.width = crop.width;
      cropCanvas.height = crop.height;
      const ctx = cropCanvas.getContext("2d");

      if (ctx) {
        const pixelRatio = window.devicePixelRatio;
        cropCanvas.width = crop.width * pixelRatio;
        cropCanvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        ctx.drawImage(
          cropImage,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );
        const base64Image = cropCanvas.toDataURL("image/jpeg");
        setCurrentDataURL(base64Image);
      }
    }
    setStartCrop(false);
  };
  const toggleCrop = () => {
    if (!startCrop) {
      toast({
        title: "이미지를 드래그하여 자르세요.",
        status: "info",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    } else {
      toast({
        title: "자르기를 종료합니다.",
        status: "info",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    }
    setStartCrop((prev) => !prev);
  };

  //**! remove background */
  const [isOpenRemoveBg, setIsOpenRemoveBg] = useState<boolean>(false);
  const [removedBgImage, setRemovedBgImage] = useState<any>(null);
  const [removeBgLoading, setRemoveBgLoading] = useState<boolean>(false);

  const handleRemoveBackground = async (imgSrc: string) => {
    await removeBg(imgSrc, (result) => setRemovedBgImage(result));
    setTimeout(() => {
      setRemoveBgLoading(false);
    }, 2000);
  };
  const doRemoveBg = async () => {
    setRemoveBgLoading(true);
    let img = document.getElementById("mainImage") as HTMLImageElement;
    let canvas = document.createElement("canvas") as HTMLCanvasElement;
    let f = dataUrlToBlob(getDataUrlByCanvasWithImg(img, canvas));

    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        await handleRemoveBackground(reader.result);
      }
    };
  };
  const onOpenRemoveBg = () => {
    setIsOpenRemoveBg(true);
  };
  const onCancelRemoveBg = () => {
    setRemovedBgImage(null);
    setIsOpenRemoveBg(false);
  };
  const onSubmitRemoveBg = () => {
    setCurrentDataURL(removedBgImage.src);
    setRemovedBgImage(null);
    setIsOpenRemoveBg(false);
  };
  useEffect(() => {
    tf.getBackend();
  }, []);

  //**! de-identification */
  const [startBlurCrop, setStartBlurCrop] = useState<boolean>(false);
  const [cropBlurPart, setCropBlurPart] = useState<Crop>();
  const toggleBlurCrop = () => {
    if (!startBlurCrop) {
      toast({
        title: "비식별할 부분을 드래그하세요.",
        status: "info",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    } else {
      toast({
        title: "비식별화를 중지합니다.",
        status: "info",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    }
    setStartBlurCrop((prev) => !prev);
  };
  const handleBlurCrop = async () => {
    if (cropBlurPart) {
      let img = document.getElementById("cropBlurImage") as HTMLImageElement;
      let clonedCanvas = document.createElement("canvas");
      const imgSrc = getDataUrlByCanvasWithImg(img, clonedCanvas);

      let canvas = document.createElement("canvas") as HTMLCanvasElement;
      let base = cv.imread(img);
      let dst = new cv.Mat();
      // let dsize = new cv.Size(5, 5);
      // // new Rect(x, y, width, height)

      // cv.GaussianBlur(
      // base.roi(
      //   new cv.Rect(
      //     cropBlurPart.x,
      //     cropBlurPart.y,
      //     cropBlurPart.width,
      //     cropBlurPart.height
      //   )
      // ),
      // dst,
      //   dsize,
      //   555,
      //   555,
      //   cv.BORDER_DEFAULT
      // );
      cv.medianBlur(
        base.roi(
          new cv.Rect(
            cropBlurPart.x,
            cropBlurPart.y,
            cropBlurPart.width,
            cropBlurPart.height
          )
        ),
        dst,
        15
      );
      cv.imshow(canvas, dst);

      const newImage = new Image();
      newImage.src = canvas.toDataURL("image/jpeg");

      await mergeImages(
        [
          { src: imgSrc, x: 0, y: 0 },
          { src: newImage.src, x: cropBlurPart.x, y: cropBlurPart.y },
        ],
        { format: "image/jpeg" }
      ).then((b64) => {
        setCurrentDataURL(b64);
        // setMergeImageSrc(b64);
      });
    }
    setCropBlurPart(undefined);
    // ! 아래 주석을 하면 내가 비식별화 버튼을 눌러야 비식별화를 멈출 수 있음
    setStartBlurCrop(false);
  };

  //**! noise remove */
  const [isNoiseRemove, setIsNoiseRemove] = useState<boolean>(false);
  const [afterNoiseRemove, setAfterNoiseRemove] = useState<boolean>(false);
  const [showNoiseRemove, setShowNoiseRemove] = useState<boolean>(false);

  const onOpenNoiseRemove = () => {
    setIsNoiseRemove(true);
  };
  const onCancelNoiseRemove = () => {
    setIsNoiseRemove(false);
    setShowNoiseRemove(false);
    setAfterNoiseRemove(false);
  };
  const onSubmitNoiseRemove = () => {
    let currentImg = document.createElement("img") as HTMLImageElement;
    let canvas = document.getElementById(
      "noiseRemoveCanvas"
    ) as HTMLCanvasElement;
    setShowNoiseRemove(false);
    currentImg.onload = () => {
      const context = canvas.getContext("2d");
      context!.clearRect(0, 0, canvas.width, canvas.height);

      let base = cv.imread(currentImg);
      let clone = base.clone();
      let dst = new cv.Mat();
  
      cv.medianBlur(clone, dst, 3);
      cv.imshow(canvas, dst);
      clone.delete();
      dst.delete();

      const newDataURL = canvas.toDataURL("image/jpeg");
      setCurrentDataURL(newDataURL);
      setIsNoiseRemove(false);
      // setShowNoiseRemove(false);
      setAfterNoiseRemove(false);
    };
    currentImg.src = currentDataURL;
  };
  const noiseRemove = () => {
    // let img = document.getElementById("mainImage") as HTMLImageElement;
    let noiseImg = document.getElementById("noiseRemoveImg") as HTMLImageElement;
    let canvas = document.getElementById(
      "noiseRemoveCanvas"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    context!.clearRect(0, 0, canvas.width, canvas.height);
    let base = cv.imread(noiseImg);
    let clone = base.clone();
    let dst = new cv.Mat();

    cv.medianBlur(clone, dst, 3);
    cv.imshow(canvas, dst);
    clone.delete();
    dst.delete();
    setAfterNoiseRemove(true);
    setShowNoiseRemove(true);
  };

  //**! original image */
  const onOriginalImage = () => {
    if (selectedTask) {
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].order === 0
        ) {
          resetDatas();
          if (dataURLHistory[i].dataURL.includes("data:image")) {
            setCurrentDataURL(dataURLHistory[i].dataURL);
          } else {
            setCurrentDataURL(
              `data:image/${selectedTask.imageFormat};base64,` +
                dataURLHistory[i].dataURL
            );
          }
        }
      }
    }
  };

  const resetDatas = () => {
    setScaleRatio("1");
    setScaleRatioVal("1");
    setScaleX("1.0");
    setScaleY("1.0");
    setTranslationXY({ x: 0, y: 0 });
    setTransType(TransType.translation);
    setImageInfo({
      width: selectedTask.imageWidth,
      height: selectedTask.imageHeight,
    });
  };

  let imgIndexCount = document.getElementById("imgPicker")? Math.floor(document.getElementById("imgPicker").clientWidth / 180) - 1 : 0;
  let imgIndexLeft = 0, imgIndexRight = imgIndexCount;

  const refPicker = useRef<any>(undefined);

  useLayoutEffect(() => {
    if(!refPicker) return;
    const { current } = refPicker;
    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;
      if (hasOverflow) {
        if(imgIndexLeft <= 0) {
          document.getElementById("arrowPickerLeft").style.display = "none";
        } else {
          document.getElementById("arrowPickerLeft").style.display = "flex";
        }
        if(imgIndexRight >= tasks.length - 1) {
          document.getElementById("arrowPickerRight").style.display = "none";
        } else {
          document.getElementById("arrowPickerRight").style.display = "flex";
        }
      }
    };
    if (current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }
      trigger();
    }
    let picker = document.getElementById("imgPicker"); 
    if(picker) {
      imgIndexCount = Math.floor(picker.clientWidth / 180) - 1;
      picker.addEventListener("scroll", handlePickerScroll);
    }
  });

  const handlePickerScroll = () => {
    let scrollLocation = refPicker.current.scrollLeft; // 현재 스크롤바 위치
    let boundary = refPicker.current.scrollWidth / tasks.length;
    
    imgIndexLeft = Math.round(scrollLocation / boundary);
    imgIndexRight = imgIndexLeft + imgIndexCount;

    if(imgIndexLeft <= 0) {
      document.getElementById("arrowPickerLeft").style.display = "none";
    } else {
      document.getElementById("arrowPickerLeft").style.display = "flex";
    }
    if(imgIndexRight >= tasks.length - 1) {
      document.getElementById("arrowPickerRight").style.display = "none";
    } else {
      document.getElementById("arrowPickerRight").style.display = "flex";
    }
  };

  const onMoveToToolsLeft = () => {
    if(imgIndexLeft < imgIndexCount){
      imgIndexLeft = 0; 
      imgIndexRight = imgIndexCount;
    } else {
      imgIndexLeft -= imgIndexCount;
      imgIndexRight -= imgIndexCount; 
    }
    document.getElementById("img"+imgIndexLeft).scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onMoveToToolsRight = () => {
    if(imgIndexRight > tasks.length - imgIndexCount){
      imgIndexLeft = tasks.length - 1 - imgIndexCount; 
      imgIndexRight = tasks.length - 1;
    } else {
      imgIndexLeft += imgIndexCount;
      imgIndexRight += imgIndexCount; 
    }
    document.getElementById("img"+imgIndexRight).scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  if (pId) {
    return (
      <PreProcessingPresenter
        currentUser={loggedInUser}
        currentDataURL={currentDataURL}
        projectInfo={projectInfo}
        examinee={examinee}
        tasks={tasks}
        isFileSelectorOpen={isFileSelectorOpen}
        preProcessingAssignee={preProcessingAssignee}
        projectUser={projectUser}
        isFileInfoOpen={isFileInfoOpen}
        workStatutes={workStatutes}
        selectedTask={selectedTask}
        loading={loading}
        isFirst={isFirst}
        isRotateSymmetry={isRotateSymmetry}
        effectLoading={effectLoading}
        isCanvasOn={isCanvasOn}
        isThresholding={isThresholding}
        threshValue={threshValue}
        showThresholding={showThresholding}
        isGrayscale={isGrayscale}
        grayscaleVal={grayscaleVal}
        isBCOpen={isBCOpen}
        brVal={brVal}
        isResizing={isResizing}
        resizingVal={resizingVal}
        crop={crop}
        startCrop={startCrop}
        isOpenRemoveBg={isOpenRemoveBg}
        removedBgImage={removedBgImage}
        removeBgLoading={removeBgLoading}
        startBlurCrop={startBlurCrop}
        cropBlurPart={cropBlurPart}
        isNoiseRemove={isNoiseRemove}
        isTransform={isTransform}
        transType={transType}
        scaleX={scaleX}
        scaleY={scaleY}
        translationXY={translationXY}
        isOpenReject={isOpenReject}
        showRejectComment={showRejectComment}
        rejectComment={rejectComment}
        showNoiseRemove={showNoiseRemove}
        afterNoiseRemove={afterNoiseRemove}
        handleOpenReject={handleOpenReject}
        handleCancelReject={handleCancelReject}
        onSubmitReject={onSubmitReject}
        _setExaminee={_setExaminee}
        _setPreProcessingAssignee={_setPreProcessingAssignee}
        toggleFileSelector={toggleFileSelector}
        toggleFileInfoOpen={toggleFileInfoOpen}
        _setWorkStatutes={_setWorkStatutes}
        _setSelectedTask={_setSelectedTask}
        handlePrevTask={handlePrevTask}
        handleNextTask={handleNextTask}
        onOpenRotateSymmetry={onOpenRotateSymmetry}
        onSubmitRotateSymmetry={onSubmitRotateSymmetry}
        onCancelRotateSymmetry={onCancelRotateSymmetry}
        doSymmetry={doSymmetry}
        doRotate={doRotate}
        onOpenThresholding={onOpenThresholding}
        onCancelThresholding={onCancelThresholding}
        onSubmitThresholding={onSubmitThresholding}
        handleChangeThresholding={handleChangeThresholding}
        onChangeCaptureThresholding={onChangeCaptureThresholding}
        handleGrayscaleChange={handleGrayscaleChange}
        onOpenGrayscale={onOpenGrayscale}
        onCancelGrayscale={onCancelGrayscale}
        onSubmitGrayscale={onSubmitGrayscale}
        handleBrChange={handleBrChange}
        onOpenBC={onOpenBC}
        onCancelBC={onCancelBC}
        onSubmitBC={onSubmitBC}
        handleResizing={handleResizing}
        onOpenResizing={onOpenResizing}
        onCancelResizing={onCancelResizing}
        onSubmitResizing={onSubmitResizing}
        setCrop={setCrop}
        handleCrop={handleCrop}
        toggleCrop={toggleCrop}
        doRemoveBg={doRemoveBg}
        onOpenRemoveBg={onOpenRemoveBg}
        onCancelRemoveBg={onCancelRemoveBg}
        onSubmitRemoveBg={onSubmitRemoveBg}
        setCropBlurPart={setCropBlurPart}
        toggleBlurCrop={toggleBlurCrop}
        handleBlurCrop={handleBlurCrop}
        onOpenNoiseRemove={onOpenNoiseRemove}
        onCancelNoiseRemove={onCancelNoiseRemove}
        onSubmitNoiseRemove={onSubmitNoiseRemove}
        noiseRemove={noiseRemove}
        onOriginalImage={onOriginalImage}
        handleDownloadImage={handleDownloadImage}
        handleToggleFullScreen={handleToggleFullScreen}
        handleUnDo={handleUnDo}
        handleRedo={handleRedo}
        saveImage={saveImage}
        handleLeftTX={handleLeftTX}
        handleRightTX={handleRightTX}
        handleUpTX={handleUpTX}
        handleDownTX={handleDownTX}
        handleChangeScaleX={handleChangeScaleX}
        handleChangeScaleY={handleChangeScaleY}
        cleanTransformEffect={cleanTransformEffect}
        handleTransTypeToTranslation={handleTransTypeToTranslation}
        handleTransTypeToScale={handleTransTypeToScale}
        onOpenTransform={onOpenTransform}
        onCancelTransform={onCancelTransform}
        onSubmitTransform={onSubmitTransform}
        goBack={goBack}
        handleCompleted={handleCompleted}
        handleSetRejectText={handleSetRejectText}
        handleShowRejctHelp={handleShowRejctHelp}
        handleCancelRejectComment={handleCancelRejectComment} 
        refPicker={refPicker} 
        onMoveToToolsLeft={onMoveToToolsLeft} 
        onMoveToToolsRight={onMoveToToolsRight}      
        conVal={conVal}
        handleContrastChange={handleContrastChange}
        scaleRatio={scaleRatio}
        handleChangeResizingScale={handleChangeResizingScale}
        onSubmitResizingScale={onSubmitResizingScale}
        scaleRatioVal={scaleRatioVal}
        isRow={isRow}
        handleScaleToResizing={handleScaleToResizing}
        isScaleToResizing={isScaleToResizing}
        setKeyOnOff={setKeyOnOff}
        isKeyOnOff={isKeyOnOff}
        valueX={valueX}
        valueY={valueY}
      />
    );
  }
  return null;
};

export default PreProcessingContainer;
