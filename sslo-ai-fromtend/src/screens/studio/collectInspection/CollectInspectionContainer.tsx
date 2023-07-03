import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import { useToast } from "@chakra-ui/react";
import CollectInspectionPresenter from "./CollectInspectionPresenter";
import {
  dataUrlToBlob
} from "../../../utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import taskApi, { ITask } from "../../../api/taskApi";
import projectApi, {
  IGetProjectParam,
  IProjectInfo,
} from "../../../api/projectApi";
import { useAppSelector } from "../../../hooks";
import { IUser } from "../../../api/userApi";

export const WORKSTATUS_ALL = "전체";
export const WORKSTATUS_1 = "미작업";
export const WORKSTATUS_2 = "진행중";
export const WORKSTATUS_3 = "완료";
export const WORKSTATUS_4 = "반려";
export type WorkStatusType = "전체" | "미작업" | "진행중" | "완료" | "반려";

//! 이미지 전처리를 이행할때마다 History에 대한 Interface
export interface IDataURLHistory {
  taskId: number;
  order: number;
  dataURL: string;
}

const CollectInspectionContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  // ! project ID를 URL로부터 Get
  const { pId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //**! 기본 state, set */
  const toast = useToast();
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
  const [collectAssignee, setCollectAssignee] = useState<IUser>();
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
  const _setCollectAssignee = (
    user: IUser
  ): React.MouseEventHandler<HTMLButtonElement> | undefined => {
    doUpdateTaskUser(user, "Worker");
    setSelectedTask((prev) => ({
      ...prev!,
      taskWorker: {
        id: user.userId,
        displayName: user.userDisplayName,
        email: user.userEmail,
      },
    }));
    setCollectAssignee(user);
    return;
  };
  // ! set examinee
  const _setExaminee = (
    user: IUser
  ): React.MouseEventHandler<HTMLButtonElement> | undefined => {
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
          task_worker: selectedTask.taskWorker? {
            user_id: selectedTask.taskWorker.id,
          } : null,
        };
      }
      console.log(updateTaskPayload);
      await taskApi.updateTask(updateTaskParams, updateTaskPayload);
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
    const res = await taskApi.searchTaskByProject(param);
    if (res && res.status === 200 && res.statusText === "OK") {
      await cleanTasks(res.data.datas);
    } else {
      // TODO: error handling
    }
  };
  // ! call api get project
  const getProject = async (param: IGetProjectParam) => {
    const res = await projectApi.getProject(param);
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
      const imageSize = tasks[i].task_detail.image_size;

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
    setTasks(cleanedTasks);
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
  // TODO: 근데 이게 추후에는 최초작업이냐 아니냐에 따라 selectedTask에 값을 넣을지 말지를 정해줘야 하는 작업이 필요
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
          document.getElementById("img"+index)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      if(selectedTask.imageWidth > selectedTask.imageHeight) {
        setIsRow(true);
      } else {
        setIsRow(false);
      }
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
      setCollectAssignee(null);
      setExaminee(null);
    }
    // eslint-disable-next-line
  }, [selectedTask]);

  //! Task의 ID를 받아서 해당 이미지를 getTaskData API를 호출하여 받고 그 바이너리 이미지를 base64로 변환하여 state에 저장
  const setTaskInitImage = async () => {
    if (selectedTask) {
      const res = await taskApi.getTaskData(
        { project_id: pId, task_id: selectedTask.taskId },
        "blob"
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
        )
          return;
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

        else if(e.shiftKey && (key === 'S' || key === 83)){
          handleCompleted();
          return false;
        }

        else if(e.ctrlKey && (key === 's' || key === 83)){
          handleCompleted();
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
  
  // ! resize
  const [resizingVal, setResizingVal] = useState<string | null>("100");
  const currentResizingVal = useRef(resizingVal);
  const handleResizing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizingVal(e.target.value);
  };
  useEffect(() => {
    currentResizingVal.current = resizingVal;
  }, [resizingVal]);
  // ! Save (Update)
  const saveImage = async () => {
    // TODO: 아래처럼 구현하면 업로드는 진행되는데 파일명이 blob.png로 떨어짐 이거는 추후 수정
    if (currentDataURL) {
      const file = dataUrlToBlob(currentDataURL);
      let formdata = new FormData();
      formdata.append("image", file);

      if (pId && selectedTask) {
        const res = await taskApi.updateTaskData(
          { project_id: parseInt(pId), task_id: selectedTask.taskId },
          formdata
        );
        if (res && res.status === 200) {
          toast({
            title: "Task Image 업데이트 완료",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    }
  };
  const goBack = () => {
    navigate(-1);
  };

  //*************** Main function **********************/

  //**! original image */
  const onOriginalImage = () => {
    if (selectedTask) {
      for (let i = 0; i < dataURLHistory.length; i++) {
        if (
          dataURLHistory[i].taskId === selectedTask.taskId &&
          dataURLHistory[i].order === 0
        ) {
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

  // ! 완료 버튼 클릭 시 호출
  const handleCompleted = async () => {
    if (pId && selectedTask && currentDataURL) {
      const currentStep = selectedTask.taskStep;
      if (currentStep === 2) {
        if (!loggedInUser.isAdmin && !selectedTask.taskValidator) {
          toast({
            title: "Task의 검수 담당자가 아닙니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
        if (
          !loggedInUser.isAdmin && 
          selectedTask.taskValidator &&
          loggedInUser.id !== selectedTask.taskValidator.id
        ) {
          toast({
            title: "Task의 검수 담당자만 가능한 작업입니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          return;
        }
      }

      const res = await taskApi.updateTaskStatus(
        { project_id: parseInt(pId), task_id: selectedTask.taskId },
        { task_status_progress: 3 },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        toast({
          title: "Task 업데이트 완료",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        switch (currentStep) {
          case 1:
            setSelectedTask((prev) => ({
              ...prev!,
              taskStep: 2,
              taskStatus: 1,
            }));
            break;
          case 2:
            setSelectedTask((prev) => ({
              ...prev!,
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
        { task_status_progress: 3 },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        const resReject = await taskApi.updateTaskStatus(
          { project_id: parseInt(pId), task_id: selectedTask.taskId },
          { task_status_progress: 4, comment_body: rejectText },
          loggedInUser.accessToken!
        );
        if (resReject && resReject.status === 200) {
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
      searchTasks({
        project_id: pId,
        orderBy: "task_id",
        order: "ASC",
        maxResults: 10000,
      });
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
    document.getElementById("img"+imgIndexLeft)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onMoveToToolsRight = () => {
    if(imgIndexRight > tasks.length - imgIndexCount){
      imgIndexLeft = tasks.length - 1 - imgIndexCount; 
      imgIndexRight = tasks.length - 1;
    } else {
      imgIndexLeft += imgIndexCount;
      imgIndexRight += imgIndexCount; 
    }
    document.getElementById("img"+imgIndexRight)?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  if (pId) {
    return (
      <CollectInspectionPresenter
        currentDataURL={currentDataURL}
        projectInfo={projectInfo}
        examinee={examinee}
        tasks={tasks}
        isFileSelectorOpen={isFileSelectorOpen}
        collectAssignee={collectAssignee}
        projectUser={projectUser}
        isFileInfoOpen={isFileInfoOpen}
        workStatutes={workStatutes}
        selectedTask={selectedTask}
        loading={loading}
        isFirst={isFirst}
        _setExaminee={_setExaminee}
        _setCollectAssignee={_setCollectAssignee}
        toggleFileSelector={toggleFileSelector}
        toggleFileInfoOpen={toggleFileInfoOpen}
        _setWorkStatutes={_setWorkStatutes}
        _setSelectedTask={_setSelectedTask}
        handlePrevTask={handlePrevTask}
        handleNextTask={handleNextTask}
        onOriginalImage={onOriginalImage}
        handleDownloadImage={handleDownloadImage}
        handleToggleFullScreen={handleToggleFullScreen}
        resizingVal={resizingVal}
        handleResizing={handleResizing}
        saveImage={saveImage}
        goBack={goBack} 
        currentUser={loggedInUser} 
        isOpenReject={isOpenReject}
        rejectComment={rejectComment}
        showRejectComment={showRejectComment}
        handleCompleted={handleCompleted}
        handleOpenReject={handleOpenReject}
        handleCancelReject={handleCancelReject}
        onSubmitReject={onSubmitReject}
        handleSetRejectText={handleSetRejectText}
        handleShowRejctHelp={handleShowRejctHelp}
        handleCancelRejectComment={handleCancelRejectComment}
        refPicker={refPicker} 
        onMoveToToolsLeft={onMoveToToolsLeft} 
        onMoveToToolsRight={onMoveToToolsRight} 
        isRow={isRow}
        setKeyOnOff={setKeyOnOff}
        isKeyOnOff={isKeyOnOff}
      />
    );
  }
  return null;
};

export default CollectInspectionContainer;
