import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import datasetApi, { IDataset } from "../../../../api/datasetApi";
import labelingApi from "../../../../api/labelingApi";
import projectApi, {
  IAnnotationAttribute,
  IGetProjectParam,
  IModel,
  IModelConfig,
  IModelLog,
  IProject,
  IProjectAnnotation,
} from "../../../../api/projectApi";
import staticsApi, {
  IPAllStatics,
  IStaticsTaskByDay,
  IWorkerStatics,
} from "../../../../api/staticsApi";
import taskApi, { ITask } from "../../../../api/taskApi";
import userApi, {
  IUser,
  IUserWorkStatics,
  IProjectUser,
} from "../../../../api/userApi";
import {
  ClassAttrType,
  IClassAttr,
} from "../../../../components/main/ClassGenerator";
import { useAppSelector } from "../../../../hooks";
import {
  dataUrlToBlob,
  setOffset,
  getADayOfCurrentMonthMillisecondsDate,
  getTodayMillisecondsDate,
  getTodayOfAMonthMillisecondsDate,
} from "../../../../utils";
import { toast as alertToast } from "react-toastify";
import ProjectDetailPresenter from "./ProjectDetailPresenter";
import { saveAs } from "file-saver";
import { constConfigModelNameList, constInfoExportModelType, constOptionsExportTask } from "../../../../components/ConstantData";
import exifr from 'exifr';

//let cv = require("opencv.js");
import cv from "@techstark/opencv-js"

export enum CollectDataType {
  dataset = "인간 데이터셋 제공",
  crawling = "웹 크롤링 데이터",
  upload = "데이터 업로드",
}
export enum InnerSidebarItem {
  dataList = "데이터 목록",
  member = "멤버작업현황",
  statics = "프로젝트 통계",
  settings = "설정",
  modelSettings = "모델 설정",
  modelRelease = "모델 배포",
}

export interface IExportAttribute {
  class_id: number;
  attrs: IAnnotationAttribute;
}

const ProjectDetailContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  // ! project state
  const [project, setProject] = useState<IProject>();
  // ! 산출물 내보내기 Class
  const [selectedClass, setSelectedClass] = useState<IProjectAnnotation[]>();
  // ! 산출물 내보내기 Class Attributes
  const [selectedAttrs, setSelectedAttrs] = useState<IExportAttribute[]>();
  // ! 산출물 내보내기 Option
  const [selectedOption, setSelectedOption] = useState<string[]>();
  // ! project task list state
  const [pTasks, setPTasks] = useState<ITask[]>();
  const [vTasks, setVTasks] = useState<ITask[]>();

  // ! 전체 타스크 개수 state
  const [totalTasksCount, setTotalTasksCount] = useState<number>(0);
  const [projectUsers, setProjectUsers] = useState<IUser[]>();
  // ! Inner 사이드바의 메뉴 오픈 state
  const [openSidebarUpper, setOpenSidebarUpper] = useState<boolean>(true);
  // ! 노출되는 프로젝트의 task들 중 선택된 tasks
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  // ! Inner 사이드바에서 선택된 탭 state
  const [selectedInnerTab, setSelectedInnerTab] = useState<InnerSidebarItem>(
    InnerSidebarItem.dataList
  );
  // ! 검색어 state
  const [searchText, setSearchText] = useState<string>();

  const [filterStep, setFilterStep] = useState<number>(0);
  const [filterProgress, setFilterProgress] = useState<number>(0);

  const [selectedProgresses, setSelectedProgresses] = useState<number[]>([]);


  // ! Project id
  const { pId } = useParams();
  // ! location (for get page queryParameter)
  const location = useLocation();
  // ! location key가 달라질 때 (location query parameter가 달라지는 경우와 같음) task refetch
  useEffect(() => {
    //getTasksByProject();
    if (pTasks) {
      const page = parseInt(location.search.split("=")[1]);
      setVTasks(
        pTasks.filter((t, id) => {
          return id >= (page - 1) * 10 && id < page * 10;
        })
      );
    }
    // eslint-disable-next-line
  }, [location.key]);
  // ! navigate hook
  const navigate = useNavigate();
  const toast = useToast();
  // ! pID가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!pId) {
      navigate("/");
    }
  }, [navigate, pId]);

  // ! call api search all users
  /* const searchAllUsers = async (param: any) => {
    const res = await userApi.getAllUsers(param, loggedInUser.accessToken!);
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setProjectUsers(users);
    } else {
      // TODO: error handling
    }
  }; */
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: any[], pageinfo: any, step?: number) => {
    console.log(tasks);
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    for (let i = 0; i < tasks.length; i++) {
      if (step) {
        if (step === 1 && step !== tasks[i].task_status.task_status_step) {
          continue;
        }
        if (step === 2 && step !== tasks[i].task_status.task_status_step) {
          continue;
        }
      }
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
      const imageSize = tasks[i].task_detail.image_size;
      const imageFormat = tasks[i].task_detail.image_format;
      const imageWidth = tasks[i].task_detail.image_width;
      const imageHeight = tasks[i].task_detail.image_height;
      const updated = tasks[i].updated;
      const created = tasks[i].created;
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
        imageSize,
        taskStatus,
        taskStep,
        taskStatusName,
        imageFormat,
        imageWidth,
        imageHeight,
        taskWorker,
        taskValidator,
        updated,
        created,
      };
      cleanedTasks.push(form);
    }
    setPTasks(cleanedTasks);
    let page = parseInt(location.search.split("=")[1]);
    if (!page) page = 1;
    setVTasks(
      cleanedTasks.filter((t, id) => {
        return id >= (page - 1) * 10 && id < page * 10;
      })
    );
    setTotalTasksCount(pageinfo.totalResults);
    // if (step) {
    //   setTotalTasksCount(cleanedTasks.length);
    // } else {
    //   setTotalTasksCount(pageinfo.totalResults);
    // }
  };

  useEffect(() => {
    if (pTasks && pTasks.length > 0) {
      getTaskDatas();
      getAnnotationByTask();
    }
  }, [pTasks]);

  const getTaskDatas = async () => {
    for (let i = 0; i < pTasks.length; i++) {
      const blobImageResponse = await taskApi.getTaskData(
        { project_id: pId, task_id: pTasks[i].taskId },
        "blob",
        loggedInUser.accessToken!
      );
      if (blobImageResponse && blobImageResponse.status === 200) {
        const blob = blobImageResponse.data;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          if (typeof reader.result === "string") {
            pTasks[i].image = reader.result;
          }
        };
      }
    }
  };

  const getAnnotationByTask = async () => {
    for (let i = 0; i < pTasks.length; i++) {
      const res = await labelingApi.searchAnnotationByTask({
        project_id: pId,
        task_id: pTasks[i].taskId,
        maxResults: 10000,
      });
      if (res && res.status === 200) {
        pTasks[i].annotation = res.data.datas;
      }
    }
  };

  // ! 프로젝트 ID를 통해 프로젝트의 Task들을 가져온다.
  const getTasksByProject = async () => {
    if (pId) {
      const res = await taskApi.searchTaskByProject(
        {
          project_id: parseInt(pId),
          orderBy: "task_id",
          order: "DESC",
          ...(filterStep !== 0 && { task_status_step: filterStep }),
          ...(filterProgress !== 0 && { task_status_progress: filterProgress }),
          //...setOffset(parseInt(location.search.split("=")[1]) || 1),
          maxResults: 1000,
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        cleanTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };

  // ! 프로젝트 내 데이터 목록에서 필터링 조건이 걸렸을 때 해당 조건에 맞게 데이터 refetch
  const getTasksByProjectAndFilter = async (
    step?: number,
    progress?: number
  ) => {
    location.search = "";
    if (pId) {
      const res = await taskApi.searchTaskByProject(
        {
          project_id: parseInt(pId),
          orderBy: "task_id",
          order: "DESC",
          ...(step && step !== 0 && { task_status_step: step }),
          ...(step !== 0 &&
            !step &&
            filterStep !== 0 && { task_status_step: filterStep }),
          ...(progress && progress !== 0 && { task_status_progress: progress }),
          ...(progress !== 0 &&
            !progress &&
            filterProgress !== 0 && { task_status_progress: filterProgress }),
          //...setOffset(parseInt(location.search.split("=")[1]) || 1),
          maxResults: 1000,
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        cleanTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };
  // ! 프로젝트 내 데이터 목록에서 작업단계의 필터링 조건이 걸링 경우 호출
  const filterTaskByWorkStep = (step: string) => {
    getTasksByProjectAndFilter(parseInt(step), undefined);
    setFilterStep(parseInt(step));
  };
  const filterTaskByWorkProgress = (progress: string) => {
    getTasksByProjectAndFilter(undefined, parseInt(progress));
    setFilterProgress(parseInt(progress));
  };
  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    handleDoSearch();
  };
  // ! 검색어 입력 후 검색 버튼 클릭 하면 called
  const handleDoSearch = async () => {
    if (pId) {
      const res = await taskApi.searchTaskByProject(
        {
          project_id: parseInt(pId),
          orderBy: "task_id",
          order: "DESC",
          ...(filterStep !== 0 && { task_status_step: filterStep }),
          ...(filterProgress !== 0 && { task_status_progress: filterProgress }),
          //...setOffset(parseInt(location.search.split("=")[1]) || 1),
          maxResults: 1000,
          task_name: searchText,
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        cleanTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };
  // ! project data 정제 후 state 저장
  const cleanProject = (data: any) => {
    setProject({
      pNo: data.project_id,
      pName: data.project_name,
      pDesc: data.project_desc,
      pType: {
        project_type_id: data.project_type.project_type_id,
        project_type_name: data.project_type.project_type_name,
        created: data.project_type.created,
      },
      pDetail: data.project_detail
        ? {
            data_type: data.project_detail.data_type,
            dataset_ids: data.project_detail.dataset_ids,
          }
        : null,
      pCreated: data.created,
      pWorkerCount: data.project_member_statics || null,
    });

    let users: IUser[] = [];
    data.project_members.forEach((user: any) => {
      const u = {
        userId: user.user_id,
        userDisplayName: user.user_display_name,
        userEmail: user.user_email,
        created: user.created,
      };
      users.push(u);
    });
    setProjectUsers(users);
    //setCleanProjectMembers(data.project_members);
  };

  // ! pID가 있으면 해당 id로 project data fetch
  const getProject = async () => {
    if (pId) {
      const res = await projectApi.getProject(
        { project_id: parseInt(pId) },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        cleanProject(res.data);
      }
    }
  };

  // ! pId가 있다면, 렌더링 시 해당 데이터로 프로젝트와 그 프로젝트의 Task들을 fetch
  useEffect(() => {
    getProject();
    getTasksByProject();
    //searchAllUsers({ maxResults: 10000 });
    // eslint-disable-next-line
  }, [pId]);
  // ! Inner 사이드바에서 탭 선택하면 해당 탭으로 state change
  const handleSelectInnerTab = (tab: InnerSidebarItem) => {
    setSelectedInnerTab(tab);
  };
  // ! 이미지마다 붙어있는 STUDIO 버튼 말고 상단 STUDIO 버튼 클릭 시 전처리 / 가공 / 정제에 따라 스튜디오로 navigate
  const handleGoStudio = () => {
    if (project) {
      switch (project.pType.project_type_id) {
        case 1:
          navigate(`/studio/collect/${project.pNo}`);
          break;
        case 2:
          navigate(`/studio/preprocessing/${project.pNo}`);
          break;
        case 3:
          navigate(`/studio/labeling/${project.pNo}`);
          break;
      }
    } else {
      return;
    }
  };

  // ! 선택된 task 정보들
  const [selectedTaskInfo, setSelectedTaskInfo] = useState<ITask[]>([]);

  // ! task의 좌측 체크박스 선택 시 해당 task 선택
  const selectTask = (taskId: number) => {
    setSelectedTasks((prev) => [...prev, taskId]);
  };
  // ! task의 좌측 체크박스 선택 시 task 정보들 state
  const selectedTask = (t: any) => {
    if (!pTasks) return;
    let taskInfo: ITask[] = [];
    let form: ITask;
    for (let k = 0; k < pTasks.length; k++) {
      for (let l = 0; l < selectedTasks.length; l++) {
        if (pTasks[k].taskId === selectedTasks[l]) {
          const taskId = pTasks[k].taskId;
          const taskStep = pTasks[k].taskStep;
          const taskStatus = pTasks[k].taskStatus;
          form = {
            taskId,
            taskStep,
            taskStatus,
          };
          taskInfo.push(form);
          setSelectedTaskInfo(taskInfo);
        }
      }
    }
  };

  useEffect(() => {
    selectedTask(selectedTaskInfo);
  }, [selectedTasks]);

  // ! remove task on selected tasks
  const removeTask = (taskId: number) => {
    const removedTasks = selectedTasks.filter((s) => s !== taskId);
    setSelectedTasks(removedTasks);
  };
  // ! check task is selected
  const isSelectedTask = (taskId: number): boolean => {
    let isSelected = false;
    for (let i = 0; i < selectedTasks.length; i++) {
      if (selectedTasks[i] === taskId) {
        isSelected = true;
        break;
      }
    }
    return isSelected;
  };
  // ! check task is all selected
  const isSelectedAllTasks = (): boolean => {
    if (pTasks) {
      return pTasks.length === selectedTasks.length;
    }
    return false;
  };
  // ! select all task state
  const selectAllTask = () => {
    if (pTasks) {
      let all: number[] = [];
      pTasks.forEach((t) => {
        all.push(t.taskId);
      });
      setSelectedTasks(all);
    }
    return;
  };
  // ! remove all task state
  const removeAllTask = () => {
    setSelectedTasks([]);
  };
  // ! 검색어 입력 시 해당 검색어를 state에 저장
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  // ! 유저 검색 버튼 클릭 시 호출
  const doSearchUserByUsername = async () => {
    setAssignees(
      projectUsers.filter(
        (user) =>
          user.userEmail.includes(searchText) ||
          user.userDisplayName.includes(searchText)
      )
    );
  };
  // ! 할당하기에서 유저 검색 초기화
  const resetSearchResults = () => {
    setSearchText("");
    setAssignees(projectUsers);
    //getAssignees();
  };

  useEffect(() => {
    setAssignees(projectUsers);
  }, [projectUsers]);

  const [fUploadLoading, setFUploadLoading] = useState<boolean>(false);
  const isUploading = useRef(fUploadLoading);
  useEffect(() => {
    isUploading.current = fUploadLoading;
  }, [fUploadLoading]);
  // ! 데이터 업로드 버튼 클릭 시 input ref
  const fileInput = useRef<HTMLInputElement | null>(null);
  // ! input ref가 호출될 때 실행하는 메소드
  const selectFile = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };

  const fileDrag = useRef<HTMLInputElement | null>(null);
  /* 박스 안으로 Drag가 들어올 때 */
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("dragenter");
  };

  /* 박스 안에 Drag를 하고 있을 때 */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("dragover");
    if (fileDrag && fileDrag.current) {
      //fileDrag.current.style.backgroundColor = '#AECCF4';
      fileDrag.current.style.border = "3px solid #3580E3";
    }
  };

  /* 박스 밖으로 Drag가 나갈 때 */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (fileDrag && fileDrag.current) {
      //fileDrag.current.style.backgroundColor = 'transparent';
      fileDrag.current.style.border = "none";
    }
    console.log("dragleave");
  };

  /* 박스 안에서 Drag를 Drop했을 때 */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileDrag && fileDrag.current) {
      if (fUploadLoading) {
        toast({
          title: "업로드 중입니다. 완료 후 다시 시도해주세요.",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
      } else {
        if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
          toast({
            title: "파일이 존재하지 않습니다. 확인 후 다시 시도해주세요.",
            status: "error",
            position: "top",
            duration: 1500,
            isClosable: true,
          });
        } else {
          checkFileUpload(e.dataTransfer.files);
        }
      }
      console.log('drop');
      //fileDrag.current.style.backgroundColor = 'transparent';
      fileDrag.current.style.border = "none";
    }
  };

  const imgFileType = [
    "jpg",
    "jpe",
    "jpeg",
    "jfif",
    "JPG",
    "JPE",
    "JPEG",
    "JFIF",
  ];
  // ! 데이터 업로드 버튼 클릭 후 파일 선택 시 호출되는 메소드
  const handleChangeFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast({
        title: "파일이 존재하지 않습니다. 확인 후 다시 시도해주세요.",
        status: "error",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      return;
    }
    checkFileUpload(e.target.files);
  };

  const isKorean = (text: string) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };

  const generateRandomString = (num: number) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };

  const checkEXIF = async (checkFile: File) => {
    let defaultOptions = {
      tiff: false,
      xmp: false,
      icc: false,
      iptc: false,
      jfif: true, // (jpeg only)
      ihdr: false, // (png only)
      ifd1: false, // aka thumbnail
      exif: false,
      gps: false,
      interop: false,
      makerNote: false,
      userComment: false,
      sanitize: false,
      mergeOutput: false,
      silentErrors: false,
      chunked: true,
      firstChunkSize: undefined,
      firstChunkSizeNode: 512,
      firstChunkSizeBrowser: 65536, // 64kb
      chunkSize: 65536, // 64kb
      chunkLimit: 5,
    };
  
    let isJPEG = false;
    console.log(checkFile);
    await exifr.parse(checkFile, defaultOptions).then(out => 
      {
        console.log(out);
        if(out && out !== undefined) {
          isJPEG = true;
        }
      }
    ).catch(e => {
      console.log(e);
    });
    return isJPEG;
  };

  const checkFileUpload = async (files: FileList) => {
    let cnt = 0,
      result = true;
    const maxSize = 100 * 1024 * 1024;
    let formdata = new FormData();
    for (let i = 0; i < files.length; i++) {
      const isJPEG = await checkEXIF(files[i]);
      const orgFile = files[i];
      const blobFile = orgFile.slice(0, orgFile.size, 'image/jpeg');
      const pName = project.pType.project_type_id === 1 ? "collect" : project.pType.project_type_id === 2 ? "preprocess" : "labeling";
      let fileName = orgFile.name;
      if(isKorean(fileName)){
        fileName = generateRandomString(fileName.length);
      }
      const file = new File([blobFile], pName + "-" + project.pNo + "-" + fileName, {type: 'image/jpeg'});
      if (
        files[i].type !== "image/jpeg" || !isJPEG ||
        !imgFileType.includes(files[i].name.split(".")[1].toLowerCase())
      ) {
        toast({
          title:
            "지원하지 않는 파일입니다. jpeg 형식의 파일만 업로드 가능합니다.",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
        fileInput.current.value = "";
        return;
      }
      // 1080 * 1080 , 100 * 1024 * 1024
      if (files[i].size > maxSize) {
        toast({
          title: "100MB 이하의 파일만 업로드 가능합니다.",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
        return;
      }

      const imgEl = document.createElement("img");
      imgEl.onload = function() {
        if (imgEl.naturalWidth > 1080 || imgEl.naturalHeight > 1080) {
          toast({
            title: "가로 1080 세로 1080 이하의 파일만 업로드 가능합니다.",
            status: "error",
            position: "top",
            duration: 1500,
            isClosable: true,
          });
          result = false;
        } else {
          console.log("onLoad");
          //setUploadFiles(uploadFiles => [...uploadFiles, e.target.files[i]]);
          formdata.append("image", file);
          cnt++;
        }
      };
      imgEl.src = window.URL.createObjectURL(files[i]);
    }
    setFUploadLoading(true);
    const timer = setInterval(async () => {
      if (!result) {
        clearInterval(timer);
        setFUploadLoading(false);
        console.log("error");
      } else {
        if (cnt === files.length) {
          clearInterval(timer);
          for (let value of formdata.values()) {
            console.log(value);
          }
          const res = await taskApi.createTask(
            { project_id: parseInt(pId) },
            formdata,
            loggedInUser.accessToken!
          );
          if (res && res.status === 200) {
            toast({
              title: "업로드가 완료되었습니다.",
              status: "success",
              position: "top",
              duration: 1500,
              isClosable: true,
            });
            getTasksByProject();
          } else {
            toast({
              title: "업로드가 실패했습니다. 확인 후 다시 시도해주세요.",
              status: "error",
              position: "top",
              duration: 1500,
              isClosable: true,
            });
          }
          setFUploadLoading(false);
        }
      }
    }, 100);
  };

  // ! 날짜 선택 시 시작날짜 - 종료날짜
  const [dateRange, setDateRange] = useState<Date[] | null>(null);

  // ! 데이터 불러오기 팝업의 노출 여부 state
  const [openImport, setOpenImport] = useState<boolean>(false);
  // ! 전체 Task
  const [searchAllTasks, setSearchAllTasks] = useState<ITask[]>([]);
  const types = ["수집/정제", "전처리", "가공"];
  const [selectedImportType, setSelectedImportType] = useState<string[]>(types);
  // ! 프로젝트 유형 filter Task
  const [filteredTypeTasks, setFilteredTypeTasks] = useState<ITask[]>([]);
  // ! 프로젝트 생성일 filter Task
  const [filteredDateTasks, setFilteredDateTasks] = useState<ITask[]>([]);
  // ! 프로젝트 검색 filter Task
  const [filteredSearchTasks, setFilteredSearchTasks] = useState<ITask[]>([]);
  // ! 리스트에 출력되는 Task
  const [importTasks, setImportTasks] = useState<ITask[]>([]);
  // ! 선택한 Task
  const [selectedImportTasks, setSelectedImportTasks] = useState<ITask[]>([]);

  // ! 데이터 불러오기 버튼 누를 때 호출
  const onOpenImport = async () => {
    setOpenImport(true);
    setLoading(true);
    await searchTasks();
  };

  const searchTasks = async () => {
    const resProject = await projectApi.getAllProjects(
      {
        maxResults: 1000,
      },
      loggedInUser.accessToken!
    );
    if (!resProject || resProject.status !== 200) {
      alertToast.error("error");
      return;
    }
    let pIds = [];
    console.log(resProject.data.datas);
    resProject.data.datas.forEach((element) => {
      if(element.project_manager.organization_id === loggedInUser.organizationId) {
        if (element.project_id !== parseInt(pId)) {
          pIds.push(element.project_id);
        }
      }
    });

    let tasks: ITask[] = [];
    let result = false;
    let index = 0;
    pIds.forEach(async (element) => {
      const resTasks = await taskApi.searchTaskByProject(
        {
          project_id: element,
          maxResults: 1000,
        },
        loggedInUser.accessToken!
      );
      console.log(element);
      console.log(resTasks);
      if (resTasks && resTasks.status === 200) {
        //let tasks: ITask[] = [];
        for (let i = 0; i < resTasks.data.datas.length; i++) {
          const data = resTasks.data.datas[i];
          const task: ITask = {
            projectId: data.task_project.project_id,
            projectType: data.task_project.project_type.project_type_id,
            projectTypeName: data.task_project.project_type.project_type_name,
            projectName: data.task_project.project_name,
            taskId: data.task_id,
            imageName: data.task_detail.image_name,
            image: data.task_detail.image_thumbnail,
            imageThumbnail: data.task_detail.image_thumbnail,
            taskStep: data.task_status.task_status_step,
            taskStatus: data.task_status.task_status_progress,
            taskStatusName: undefined,
            imageFormat: data.task_detail.image_format,
            imageWidth: data.task_detail.image_width,
            imageHeight: data.task_detail.image_height,
            created: data.created,
          };
          tasks.push(task);
        }
        //setSearchAllTasks((searchAllTasks) => [...searchAllTasks, ...tasks]);
        if(index === pIds.length - 1) {
          console.log("last");
          result = true;
        } //setLoading(false);
        else {
          index++;
        }
      } else {
        clearInterval(timer);
      }
    });
    const timer = setInterval(async () => {
      if (result) {
        setLoading(false);
        clearInterval(timer);
        setSearchAllTasks((searchAllTasks) => [...searchAllTasks, ...tasks]);        
      }
    }, 100);
  };

  useEffect(() => {
    setFilteredTypeTasks(searchAllTasks);
  }, [searchAllTasks]);

  // ! 데이터 불러오기 팝업을 닫을 때 호출
  const onCancelImport = () => {
    setOpenImport(false);
    setDateRange(null);
    setCalendar(false);
    setSelectedDay(undefined);
    setSelectedImportType(types);
    setSearchAllTasks([]);
    setFilteredTypeTasks([]);
    setFilteredDateTasks([]);
    setFilteredSearchTasks([]);
    setImportTasks([]);
    setValSearchImport("");
    setDateRangeImport(null);
  };

  // ! 프로젝트 유형 선택
  const setSelectedTypeImport = (type: string) => {
    if (type === "all") {
      if (selectedImportType && selectedImportType.length === types.length) {
        setSelectedImportType([]);
      } else {
        setSelectedImportType(types);
      }
    } else {
      if (!selectedImportType) {
        setSelectedImportType([type]);
      } else {
        if (selectedImportType.length > 0) {
          for (let i = 0; i < selectedImportType.length; i++) {
            if (selectedImportType[i] === type) {
              setSelectedImportType(
                selectedImportType.filter((item) => item !== type)
              );
              return;
            }
          }
        }
        setSelectedImportType((selectedImportType) => [
          ...selectedImportType,
          type,
        ]);
      }
    }
  };

  // ! 프로젝트 유형 선택 확인
  const isSelectedTypeImport = (type: string) => {
    if (type && selectedImportType) {
      return selectedImportType.includes(type);
    }
    return false;
  };

  // ! 프로젝트 유형 필터링
  useEffect(() => {
    // Todo: Date, 검색어 필터링 적용 상태에서 유형 변경시 동작 방법 구상 필요
    if (!selectedImportType || selectedImportType.length === 0) return;
    if (searchAllTasks && searchAllTasks.length > 0) {
      setFilteredTypeTasks(
        searchAllTasks.filter((element) =>
          selectedImportType.includes(element.projectTypeName)
        )
      );
    }
  }, [selectedImportType]);

  useEffect(() => {
    setFilteredDateTasks(filteredTypeTasks);
    console.log(filteredTypeTasks);
  }, [filteredTypeTasks]);

  const [dateRangeImport, setDateRangeImport] = useState<Date[] | null>(null);

  const dateImportToString = (): string => {
    if (!dateRangeImport) return "날짜 선택";
    let startDate;
    let endDate;
    for (let i = 0; i < dateRangeImport.length; i++) {
      if (i === 0) startDate = dateRangeImport[i].toLocaleDateString("en-US");
      if (i === 1) endDate = dateRangeImport[i].toLocaleDateString("en-US");
    }
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    return "날짜 선택";
  };

  const handleChangeImportCalendar = (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDateRangeImport(value);
    setCalendar(false);
  };

  useEffect(() => {
    if (!dateRangeImport) return;
    if (!filteredTypeTasks) {
      toast({
        title: "프로젝트 유형을 먼저 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let startDate;
    let endDate;
    for (let i = 0; i < dateRangeImport.length; i++) {
      if (i === 0) startDate = dateRangeImport[i];
      if (i === 1) endDate = dateRangeImport[i];
    }
    if (startDate && endDate) {
      setFilteredDateTasks(
        filteredTypeTasks.filter(
          (element) =>
            element.created >= startDate.getTime() &&
            element.created <= endDate.getTime()
        )
      );
    } else {
      setFilteredDateTasks(filteredTypeTasks);
    }
    // eslint-disable-next-line
  }, [dateRangeImport]);

  useEffect(() => {
    setFilteredSearchTasks(filteredDateTasks);
    console.log(filteredDateTasks);
  }, [filteredDateTasks]);

  const [valSearchImport, setValSearchImport] = useState("");
  const handleChangeSearchImport = (e) => {
    if (!filteredDateTasks) {
      toast({
        title: "프로젝트 생성일을 먼저 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!e.target.value || e.target.value === null || e.target.value === "") {
      setFilteredSearchTasks(filteredDateTasks);
    }
    setValSearchImport(e.target.value);
  };

  useEffect(() => {
    document.onkeydown = function(e) {
      let key = e.key || e.keyCode;
      if (key === 13 || key === "Enter") {
        handleSearchImport();
      }
    };
  }, [valSearchImport]);

  const handleSearchImport = () => {
    if (
      !valSearchImport ||
      valSearchImport === null ||
      valSearchImport === ""
    ) {
      //setValSearchClass("");
      setFilteredSearchTasks(filteredDateTasks);
    } else {
      setFilteredSearchTasks(
        filteredDateTasks.filter((element) =>
          element.projectName.toLowerCase().includes(valSearchImport.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    setImportTasks(
      filteredSearchTasks.filter(
        (element) => element.taskStep === 2 && element.taskStatus === 3
      )
    );
    console.log(filteredSearchTasks);
  }, [filteredSearchTasks]);

  useEffect(() => {
    console.log(importTasks);
  }, [importTasks]);

  // ! 체크박스로 작업 선택
  const handleSelectImportItem = (type: string, item: ITask) => {
    if (!type || type === "") return;
    if (type === "all") {
      if (
        selectedImportTasks &&
        selectedImportTasks.length >= importTasks.length
      ) {
        setSelectedImportTasks([]);
      } else {
        setSelectedImportTasks(importTasks);
      }
    } else {
      if (!selectedImportTasks || selectedImportTasks === null) {
        setSelectedImportTasks([item]);
      } else {
        if (selectedImportTasks.length > 0) {
          for (let i = 0; i < selectedImportTasks.length; i++) {
            if (
              selectedImportTasks[i].projectId === item.projectId &&
              selectedImportTasks[i].taskId === item.taskId
            ) {
              setSelectedImportTasks(
                selectedImportTasks.filter(
                  (element) =>
                    element.projectId !== item.projectId ||
                    element.taskId !== item.taskId
                )
              );
              return;
            }
          }
          setSelectedImportTasks((selectedImportTasks) => [
            ...selectedImportTasks,
            item,
          ]);
        } else {
          setSelectedImportTasks((selectedImportTasks) => [
            ...selectedImportTasks,
            item,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    console.log(selectedImportTasks);
  }, [selectedImportTasks]);

  const isSelectedImportTask = (task: ITask) => {
    // Todo: 작업 리스트 체크여부
    if (selectedImportTasks) {
      return selectedImportTasks.includes(task);
    }
    return false;
  };

  const onSubmitImport = async () => {
    // Todo: 불러오기 버튼 클릭
    if (!selectedImportTasks || selectedImportTasks.length === 0) {
      alertToast.error("작업을 선택해주세요.");
      return;
    }
    for (let i = 0; i < selectedImportTasks.length; i++) {
      const res = await taskApi.importTaskByProject(
        {
          project_id: parseInt(pId),
        },
        {
          source_project_id: selectedImportTasks[i].projectId,
          task_ids: [selectedImportTasks[i].taskId],
        },
        loggedInUser!.accessToken
      );
      if (res && res.status === 200) {
      } else {
        alertToast.error("불러오기 실패");
        return;
      }
    }
    alertToast.success("불러오기 성공");
    setOpenImport(false);
    getTasksByProject();
  };

  // ! 산출물 내보내기 팝업의 노출 여부 state
  const [openExport, setOpenExport] = useState<boolean>(false);
  const [isSelectedExport, setIsSelectedExport] = useState<boolean>(false);
  const [isDownload, setDownload] = useState("");
  const [selectDownload, setSelectDownload] = useState("");

  // ! 산출물 내보내기 버튼 누를 때 호출
  const onOpenExport = () => {
    if (selectedTasks.length === 0) {
      setIsSelectedExport(false);
    } else {
      setIsSelectedExport(true);
    }
    setOpenExport(true);
  };
  // ! 산출물 내보내기 팝업을 닫을 때 호출
  const onCancelExport = () => {
    setOpenExport(false);
    setIsSelectedExport(false);
    setSelectedProgresses([]);
    setDownload(() => "");
    setSelectDownload(() => "");

    setSelectedClass([]);
    setIsSearchClass(false);
    setValSearchClass("");
    setCntAllAttrs(0);
    setAllAttrs([]);
    setSelectedAttrs([]);
    setExportAttrs(allAttrs);
    setIsSearchAttrs(false);
    setValSearchAttrs("");
    setSelectedOption([]);

    setDateRangeExport(null);
    setCalendar(false);
    //setSelectedDay(undefined);
  };

  // ! 작업단계의 좌측 체크박스 선택 시 해당 task 선택
  const selectProgress = (progressType: number) => {
    setSelectedProgresses((prev) => [...prev, progressType]);
  };
  // ! remove progress on selected progresses
  const removeProgress = (progressType: number) => {
    const removedProgresses = selectedProgresses.filter(
      (s) => s !== progressType
    );
    setSelectedProgresses(removedProgresses);
  };
  // ! check progress is selected
  const isSelectedProgress = (progressType: number): boolean => {
    let isSelected = false;
    for (let i = 0; i < selectedProgresses.length; i++) {
      if (selectedProgresses[i] === progressType) {
        isSelected = true;
      }
    }
    return isSelected;
  };

  const [filteredProgressTasks, setFilteredProgressTasks] = useState<ITask[]>();
  const [filteredDateExportTasks, setFilteredDateExportTasks] = useState<
    ITask[]
  >();

  useEffect(() => {
    if (selectedProgresses && selectedProgresses.length > 0) {
      //! Task progress filtering
      //! taskStep === 1 -> projectType
      if (selectedProgresses.length === 2) {
        setFilteredProgressTasks(
          pTasks.filter(
            (element) =>
              element.taskStep === 2 &&
              (element.taskStatus === 1 || element.taskStatus === 3)
          )
        );
      } else {
        const step =
          selectedProgresses[0] === project.pType.project_type_id ? 1 : 2;
        setFilteredProgressTasks(
          pTasks.filter((element) =>
            selectedProgresses[0] === project.pType.project_type_id
              ? element.taskStep === 2 && element.taskStatus === 1
              : element.taskStep === 2 && element.taskStatus === 3
          )
        );
      }
    }
  }, [selectedProgresses]);

  useEffect(() => {
    setFilteredDateExportTasks(filteredProgressTasks);
  }, [filteredProgressTasks]);

  const [dateRangeExport, setDateRangeExport] = useState<Date[] | null>(null);

  const dateExportToString = (): string => {
    if (!dateRangeExport) return "날짜 선택";
    let startDate;
    let endDate;
    for (let i = 0; i < dateRangeExport.length; i++) {
      if (i === 0) startDate = dateRangeExport[i].toLocaleDateString("en-US");
      if (i === 1) endDate = dateRangeExport[i].toLocaleDateString("en-US");
    }
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    return "날짜 선택";
  };

  const handleChangeExportCalendar = (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDateRangeExport(value);
    setCalendar(false);
  };

  useEffect(() => {
    if (!dateRangeExport) return;
    if (!filteredProgressTasks) {
      toast({
        title: "작업 단계를 먼저 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let startDate;
    let endDate;
    for (let i = 0; i < dateRangeExport.length; i++) {
      if (i === 0) startDate = dateRangeExport[i];
      if (i === 1) endDate = dateRangeExport[i];
    }
    if (startDate && endDate) {
      setFilteredDateExportTasks(
        filteredProgressTasks.filter(
          (element) =>
            element.updated >= startDate.getTime() &&
            element.updated <= endDate.getTime()
        )
      );
    }
    // eslint-disable-next-line
  }, [dateRangeExport]);

  useEffect(() => {}, [filteredDateExportTasks]);

  // ! 산출물 내보내기 다운로드 유형
  const _setDownload = (file: string) => {
    setDownload(() => file);
    let txt = "";
    switch (file) {
      case "coco":
        txt = "COCO Dataset Format";
        break;
      case "yolo":
        txt = "YOLO Dataset Format";
        break;
      case "image":
        txt = "Image";
        break;
      case "json":
        txt = "Json + Image";
        break;
    }
    setSelectDownload(() => txt);
  };

  const [exportClasses, setExportClasses] = useState<IProjectAnnotation[]>([]);

  const [allAttrs, setAllAttrs] = useState<IExportAttribute[]>([]);
  const [exportAttrs, setExportAttrs] = useState<IExportAttribute[]>([]);

  // ! 산출물 내보내기 클래스 선택
    const [cntAllAttrs, setCntAllAttrs] = useState<number>(0);

  const setSelectedClasses = (item: any) => {
    if (!item || item === null) {
      // 전체
      if (
        !selectedClass ||
        selectedClass === null ||
        (selectedClass && selectedClass.length < processingTargets.length)
      ) {
        setSelectedClass(processingTargets);
        let cnt = 0;
        processingTargets.forEach((target) => {
          cnt += target.annotation_category_attributes.length;
        });
        setCntAllAttrs(cnt);
      } else {
        setSelectedClass([]);
        setCntAllAttrs(0);
      }
    } else {
      // 최초 null 상태
      if (!selectedClass || selectedClass === null) {
        setSelectedClass([item]);
        setCntAllAttrs(item.annotation_category_attributes.length);
      } else {
        // 기존 값이 있는 상태
        if (selectedClass.length > 0) {
          for (let i = 0; i < selectedClass.length; i++) {
            if (
              selectedClass[i].annotation_category_id ===
              item.annotation_category_id
            ) {
              setSelectedClass(
                selectedClass.filter(
                  (element) =>
                    element.annotation_category_id !==
                    item.annotation_category_id
                )
              );
              setSelectedAttrs(
                selectedAttrs ?
                selectedAttrs.filter(
                  (element) => element.class_id !== item.annotation_category_id
                )
                : []
              );
              setCntAllAttrs(
                (prev) => prev - item.annotation_category_attributes.length
              );
              return;
            }
          }
          setSelectedClass((selectedClass) => [...selectedClass, item]);
          setCntAllAttrs(
            (prev) => prev + item.annotation_category_attributes.length
          );
        } else {
          // 초기화 상태
          setSelectedClass((selectedClass) => [...selectedClass, item]);
          setCntAllAttrs(
            (prev) => prev + item.annotation_category_attributes.length
          );
        }
      }
    }
  };

  useEffect(() => {}, [cntAllAttrs]);
  const isSelectedClasses = (item: any) => {
    if (item && selectedClass) {
      return selectedClass.includes(item);
    }
    return false;
  };

  useEffect(() => {
    if (selectedClass) {
      let attrArr: IExportAttribute[] = [];
      selectedClass.map((element) => {
        element.annotation_category_attributes.map((subElement) => {
          attrArr.push({
            class_id: element.annotation_category_id,
            attrs: subElement,
          });
        });
      });
      setAllAttrs(attrArr);
    }
  }, [selectedClass]);

  useEffect(() => {
    setExportAttrs(allAttrs);
    setCntAllAttrs(allAttrs.length);
  }, [allAttrs]);

  const [isSearchClass, setIsSearchClass] = useState(false);
  const [valSearchClass, setValSearchClass] = useState("");
  const handleChangeSearchClass = (e) => {
    if (!e.target.value || e.target.value === null || e.target.value === "") {
      setExportClasses(processingTargets);
      setIsSearchClass(false);
    }
    setValSearchClass(e.target.value);
  };

  useEffect(() => {
    document.onkeydown = function(e) {
      let key = e.key || e.keyCode;
      if (key === 13 || key === "Enter") {
        handleSearchClass();
      }
    };
  }, [valSearchClass]);

  const handleSearchClass = () => {
    if (!valSearchClass || valSearchClass === null || valSearchClass === "") {
      //setValSearchClass("");
      setExportClasses(processingTargets);
      setIsSearchClass(false);
    } else {
      setExportClasses(
        processingTargets.filter(
          (element) => element.annotation_category_name === valSearchClass
        )
      );
      setIsSearchClass(true);
    }
  };

  // ! 산출물 내보내기 클래스 속성 선택
  const setSelectedClassAttrs = (id: number, item: any) => {
    if (!item || item === null) {
      //setSelectedAttrs(() => null);
      if (id === -10 && (selectedAttrs && selectedAttrs.length < cntAllAttrs)) {
        const classArr: IExportAttribute[] = [];
        selectedClass.forEach((element) => {
          element.annotation_category_attributes.forEach((subElement) => {
            classArr.push({
              class_id: element.annotation_category_id,
              attrs: subElement,
            });
          });
        });
        setSelectedAttrs(classArr);
      } else {
        setSelectedAttrs([]);
      }
    } else {
      if (!selectedAttrs || selectedAttrs === null) {
        setSelectedAttrs([
          {
            class_id: id,
            attrs: item,
          },
        ]);
      } else {
        if (selectedAttrs.length > 0) {
          for (let i = 0; i < selectedAttrs.length; i++) {
            if (
              selectedAttrs[i].class_id === id &&
              selectedAttrs[i].attrs.annotation_category_attr_name ===
                item.annotation_category_attr_name
            ) {
              setSelectedAttrs(
                selectedAttrs.filter(
                  (element) =>
                    element.class_id !== id ||
                    element.attrs.annotation_category_attr_name !==
                      item.annotation_category_attr_name
                )
              );
              return;
            }
          }
          setSelectedAttrs((selectedAttrs) => [
            ...selectedAttrs,
            { class_id: id, attrs: item },
          ]);
        } else {
          setSelectedAttrs((selectedAttrs) => [
            ...selectedAttrs,
            { class_id: id, attrs: item },
          ]);
        }
      }
    }
  };

  const isSelectedClassAttrs = (id: number, item: any) => {
    if (item && selectedAttrs) {
      return selectedAttrs.some(element => element.class_id === id && element.attrs === item);
    }
    return false;
  };

  const [isSearchAttrs, setIsSearchAttrs] = useState(false);
  const [valSearchAttrs, setValSearchAttrs] = useState("");
  const handleChangeSearchAttrs = (e) => {
    if (!e.target.value || e.target.value === null || e.target.value === "") {
      setExportAttrs(allAttrs);
      setIsSearchAttrs(false);
    }
    setValSearchAttrs(e.target.value);
  };

  useEffect(() => {
    document.onkeydown = function(e) {
      let key = e.key || e.keyCode;
      if (key === 13 || key === "Enter") {
        handleSearchAttrs();
      }
    };
  }, [valSearchAttrs]);

  const handleSearchAttrs = () => {
    if (!valSearchAttrs || valSearchAttrs === null || valSearchAttrs === "") {
      setExportAttrs(allAttrs);
      setIsSearchAttrs(false);
    } else {
      setExportAttrs(
        allAttrs.filter(
          (element) =>
            element.attrs.annotation_category_attr_name === valSearchAttrs
        )
      );
      setIsSearchAttrs(true);
    }
  };

  const options = constOptionsExportTask;//["projectName", "fileName", "imageSize"];

  // ! 산출물 내보내기 옵션 선택
  const setSelectedOptions = (option: string) => {
    if (!option || option === null || option === "") {
      setSelectedOption(() => null);
    } else if (option === "all") {
      if (selectedOption && selectedOption.length === options.length) {
        setSelectedOption([]);
      } else {
        setSelectedOption(options);
      }
    } else {
      if (!selectedOption || selectedOption === null) {
        setSelectedOption([option]);
      } else {
        if (selectedOption.length > 0) {
          for (let i = 0; i < selectedOption.length; i++) {
            if (selectedOption[i] === option) {
              setSelectedOption(
                selectedOption.filter((element) => element !== option)
              );
              return;
            }
          }
          setSelectedOption((selectedOption) => [...selectedOption, option]);
        } else {
          setSelectedOption((selectedOption) => [...selectedOption, option]);
        }
      }
    }
  };

  const isSelectedOptions = (option: string) => {
    if (option && selectedOption) {
      return selectedOption.includes(option);
    }
    return false;
  };

  // ! 산출물 내보내기 팝업에서 내보내기 버튼 누를 때 호출
  const onSubmitExport = async () => {
    const type_id = project.pType.project_type_id;
    if (!isSelectedExport) {
      if (!selectedProgresses || selectedProgresses.length === 0) {
        alertToast.error("작업 단계를 선택해주세요.");
        return;
      } else if (!filteredProgressTasks || filteredProgressTasks.length === 0) {
        alertToast.error("선택된 단계에 내보내기 가능한 작업이 업습니다.");
        return;
      }
      //! 날짜 미선택시???
      if (!dateRangeExport || dateRangeExport.length === 0) {
        alertToast.error("추출기간을 설정해주세요.");
        return;
      }
      if (!filteredDateExportTasks || filteredDateExportTasks.length === 0) {
        alertToast.error("선택된 기간에 내보내기 가능한 작업이 업습니다.");
        return;
      }
    }

    let isImage = true,
      isAnnotation = false;
    let fileName = "";
    let format = "COCO";
    let classIds = [];
    let values: string[] = null;

    if (type_id === 3) {
      if (!isDownload || isDownload === "") {
        alertToast.error("다운로드 파일 형식을 선택해주세요.");
        return;
      } else {
        if (isDownload !== "image") {
          if (!selectedClass || selectedClass.length === 0) {
            alertToast.error("클래스를 한개 이상 선택해주세요.");
            return;
          }
        }
      }
      isImage = isDownload === "image" || isDownload === "json";
      isAnnotation = isDownload === "coco" || isDownload === "json";

      if (isImage && !isAnnotation) {
        fileName = "_image";
      } else if (!isImage && isAnnotation) {
        fileName = "_annotation";
      }

      format = "COCO";
      if (isDownload === "yolo") {
        format = "YOLO";
      } else {
        format = "COCO";
      }

      if (selectedClass && selectedClass.length > 0) {
        selectedClass.forEach((element) => {
          classIds.push(element.annotation_category_id);
        });
      }
      if (selectedAttrs && selectedAttrs.length > 0) {
        values = [];
        selectedAttrs.forEach((attrs) => {
          values.push(...attrs.attrs.annotation_category_attr_val);
        });
      }
    }

    let taskIds: number[] = [];
    if (selectedTasks && selectedTasks.length > 0) {
      // ! task 선택 시 ------- 최대 100개 제한 및 알림 필요
      taskIds = selectedTasks;
    } else {
      filteredDateExportTasks.forEach((filterTasks) => {
        taskIds.push(filterTasks.taskId);
      });
    }
    const res = await labelingApi.exportAnnotation(
      {
        source_project_id: parseInt(pId),
        task_ids: taskIds,
        include_data: isImage,
        include_annotation: isAnnotation,
        annotation_format: format,
        filter_category_ids: classIds,
        filter_category_attribute_select_or_input_values: values,
      },
      "blob"
    );

    if (res && res.status === 200) {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/zip" })
      );
      saveAs(url, project.pName + "_" + pId + fileName + ".zip");
      onCancelExport();
    }
  };

  // ! 할당하기 팝업의 노출 여부 state
  const [openWorkerAssign, setOpenWorkerAssign] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<IUser>();
  // ! 할당하기 팝업의 page state
  const [assigneePage, setAssigneePage] = useState<number>(1);
  // ! 할당하기 팝업의 작업단계 선택 state
  const [assignProgress, setAssignProgress] = useState<
    "전처리" | "수집" | "가공" | "검수"
  >();
  useEffect(() => {
    setAssignProgress(
      project && project.pType.project_type_id === 1
        ? "수집"
        : project && project.pType.project_type_id === 2
        ? "전처리"
        : "가공"
    );
    setSettingsPName(project ? project.pName : "");
    setSettingsPDesc(project && project.pDesc ? project.pDesc : "");
  }, [project]);
  // ! 할당하기 팝업의 assignee users state
  const [assignees, setAssignees] = useState<IUser[]>();
  const selectAssignee = (user: IUser) => {
    setAssignee(user);
  };
  // ! 할당하기 버튼 누를 때 호출
  const onOpenWorkerAssign = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "최소 한 개 이상의 Task를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setOpenWorkerAssign(true);
  };
  // ! 할당하기 팝업을 닫을 때 호출
  const onCancelWorkerAssign = () => {
    setOpenWorkerAssign(false);
  };
  const [assignLoading, setAssignLoading] = useState<boolean>(false);
  // ! 할당하기 팝업에서 할당하기 버튼 누를 때 호출
  const onSubmitWorkerAssign = async () => {
    if (!selectedTasks || selectedTasks.length === 0) {
      toast({
        title: "최소 한 개 이상의 Task를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!assignee) {
      toast({
        title: "담당자를 지정해야 합니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!pId) {
      toast({
        title: "프로젝트 ID를 읽어오지 못했습니다. 다시 시도해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setAssignLoading(true);
    const updateTaskParams = {
      project_id: parseInt(pId),
    };

    for (let i = 0; i < selectedTasks.length; i++) {
      let updateTaskPayload;
      if (assignProgress === "검수") {
        updateTaskPayload = {
          task_id: selectedTasks[i],
          task_validator: {
            user_id: assignee.userId,
          },
          task_worker: pTasks.find((task) => task.taskId === selectedTasks[i])
            .taskWorker
            ? {
                user_id: pTasks.find((task) => task.taskId === selectedTasks[i])
                  .taskWorker.id,
              }
            : null,
        };
      } else {
        updateTaskPayload = {
          task_id: selectedTasks[i],
          task_worker: {
            user_id: assignee.userId,
          },
          task_validator: pTasks.find(
            (task) => task.taskId === selectedTasks[i]
          ).taskValidator
            ? {
                user_id: pTasks.find((task) => task.taskId === selectedTasks[i])
                  .taskValidator.id,
              }
            : null,
        };
      }

      const res = await taskApi.updateTask(
        updateTaskParams,
        updateTaskPayload,
        loggedInUser.accessToken!
      );
      if (res && res.status !== 200) {
        toast({
          title: `${selectedTasks[i]} -> ${res.status}`,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    setAssignLoading(false);
    toast({
      title: "작업할당이 완료되었습니다.",
      status: "success",
      position: "top",
      duration: 1500,
      isClosable: true,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  };
  // ! 할당하기 팝업에서 작업단계 변경할 때 해당 작업단계를 state에 저장
  const onChangeAssignProgress = (e: ChangeEvent<HTMLSelectElement>) => {
    if (
      e.target.value === "수집" ||
      e.target.value === "전처리" ||
      e.target.value === "가공" ||
      e.target.value === "검수"
    ) {
      setAssignProgress(e.target.value);
    }
  };
  // ! 할당하기 팝업에서 유저 개수를 기준으로 page count를 리턴
  const getPages = () => {
    if (projectUsers && !searchText) {
      return Math.ceil(projectUsers.length / 5);
    }
    if (searchText && assignees) {
      return Math.ceil(assignees.length / 5);
    }
  };
  // ! 할당하기 팝업에서 유저들을 리턴해야 하므로 해당 유저들을 가져오기 위한 api 호출 후 state에 유저들 저장
  /* const getAssignees = async () => {
    const res = await userApi.getAllUsers(
      { ...setOffset(assigneePage, 5) },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setAssignees(users);
    } else {
      // TODO: error handling
    }
  }; */
  // ! 할당하기 팝업에서 다음 페이지 버튼 클릭 시 호출
  const nextPage = () => {
    setAssigneePage((prev) => prev + 1);
  };
  // ! 할당하기 팝업에서 이전 페이지 버튼 클릭 시 호출
  const prevPage = () => {
    setAssigneePage((prev) => prev - 1);
  };
  // ! page state가 변경될 때마다 리렌더링
  useEffect(() => {
    setAssignees(projectUsers);
    //getAssignees();
    // eslint-disable-next-line
  }, [assigneePage]);
  // ! 멤버작업현황 화면에서 총 멤버 개수에 대한 state
  const [totalMembersCount, setTotalMembersCount] = useState<number>();
  // ! 멤버작업현황 화면에서 현재 페이지 state
  //const [membersPage, setMembersPage] = useState<number>(1);
  // ! 멤버작업현황 화면에서 멤버에 대한 정보 state
  const [members, setMembers] = useState<IUser[]>();
  // ! 멤버작업현황에서 렌더링할 멤버들에 대한 데이터 패치
  const getMembers = async () => {
    if (!pId) return;
    let users: IUser[] = [];
    projectUsers.forEach((user, index) => {
      const u = {
        index: index + 1,
        userId: user.userId,
        userDisplayName: user.userDisplayName,
        userEmail: user.userEmail,
        created: user.created,
      };
      users.push(u);
    });
    const staticsRes = await staticsApi.getStaticsTaskByUser(
      {
        project_id: parseInt(pId),
      },
      loggedInUser.accessToken!
    );
    if (staticsRes && staticsRes.status === 200) {
      const userStatics = staticsRes.data;
      for (let i = 0; i < userStatics.length; i++) {
        for (let k = 0; k < users.length; k++) {
          if (userStatics[i].user.user_id === users[k].userId) {
            const statics: IUserWorkStatics = {
              stepOneCount:
                userStatics[i].statics_tasks.statics_status_steps[0]
                  .task_status_complete_count,
              stepTwoCount:
                userStatics[i].statics_tasks.statics_status_steps[1]
                  .task_status_complete_count,
              lastUpdated: userStatics[i].statics_tasks.task_last_updated || 0,
            };
            users[k].workStatics = statics;
          }
        }
      }
    }
    console.log(users);
    setMembers(users);
    setTotalMembersCount(projectUsers.length);
  };
  // ! 멤버작업현황 화면에서 페이지 변경 시 호출되는 method
  /* const handleChangeMemberPage = async (page: number) => {
    if (!pId) return;
    const res = await userApi.getAllUsers(
      { ...setOffset(page, 5) },
      loggedInUser.accessToken!
    );
    let users: IUser[] = [];
    if (res && res.status === 200) {
      for (let i = 0; i < res.data.datas.length; i++) {
        const u = {
          index: page !== 1 ? i + 1 + 5 * (page - 1) : i + 1,
          userId: res.data.datas[i].user_id,
          userDisplayName: res.data.datas[i].user_display_name,
          userEmail: res.data.datas[i].user_email,
          created: res.data.datas[i].created,
        };
        users.push(u);
      }
      const staticsRes = await staticsApi.getStaticsTaskByUser(
        {
          project_id: parseInt(pId),
        },
        loggedInUser.accessToken!
      );
      if (staticsRes && staticsRes.status === 200) {
        const userStatics = staticsRes.data;
        for (let i = 0; i < userStatics.length; i++) {
          for (let k = 0; k < users.length; k++) {
            if (userStatics[i].user.user_id === users[k].userId) {
              const statics: IUserWorkStatics = {
                stepOneCount:
                  userStatics[i].statics_tasks.statics_status_steps[0]
                    .task_status_complete_count,
                stepTwoCount:
                  userStatics[i].statics_tasks.statics_status_steps[1]
                    .task_status_complete_count,
                lastUpdated:
                  userStatics[i].statics_tasks.task_last_updated || 0,
              };
              users[k].workStatics = statics;
            }
          }
        }
      }
    } else {
      // TODO: error handling
    }
    setMembers(users);
    setMembersPage(page);
  }; */
  // ! 멤버작업현황 Tab을 클릭 시 멤버 리스트 데이터 패치
  useEffect(() => {
    if (selectedInnerTab === InnerSidebarItem.member) {
      getMembers();
    }
    if (selectedInnerTab === InnerSidebarItem.dataList) {
      getProject();
      getTasksByProject();
    }
    if (
      selectedInnerTab === InnerSidebarItem.settings &&
      settingType === "멤버"
    ) {
      console.log("mem");
      getProjectMember();
    }
    if (selectedInnerTab === InnerSidebarItem.modelSettings) {
      //getModelConfigList();
      getModelConfig();
    }
    if (selectedInnerTab === InnerSidebarItem.modelRelease) {
      setModelList([]);
      getModelExportList();
    }
    return;
    // eslint-disable-next-line
  }, [selectedInnerTab]);

  // ! 프로젝트 통계 화면에서 탭 정보에 대한 state
  const [staticType, setStaticType] = useState<"공통" | "작업자" | "클래스">(
    "공통"
  );
  // ! 프로젝트 통계 화면에서 프로젝트 전체 작업진행률에 필요한 데이터 state
  const [projectAllStatics, setProjectAllStatics] = useState<IPAllStatics>();
  // ! 프로젝트 통계 화면에서 공통 통계의 우측 날짜 값 state (7: 최근 7일, 14: 최근 14일, 30: 최근 30일)
  const [progressDay, setProgressDay] = useState<number>(7);
  // ! 프로젝트 통계 화면에서 공통 통계의 일별 작업 진행 추이의 step 1 (전처리 or 가공 or 수집) 데이터
  const [stepOneProgressData, setStepOneProgressData] = useState<
    IStaticsTaskByDay[]
  >([]);
  // ! 프로젝트 통계 화면에서 공통 통계의 일별 작업 진행 추이의 step 2 (검수) 데이터
  const [stepTwoProgressData, setStepTwoProgressData] = useState<
    IStaticsTaskByDay[]
  >([]);
  const handleChangeProgressDay = (e: ChangeEvent<HTMLSelectElement>) => {
    setProgressDay(parseInt(e.target.value));
  };
  // ! 프로젝트 통계 화면에서 작업자 통계 탭 클릭 시 호출
  const handleWorkerStatic = () => {
    setStaticType("작업자");
  };
  // ! 프로젝트 통계 화면에서 공통 통계 탭 클릭 시 호출
  const handleCommonStatic = () => {
    setStaticType("공통");
  };
  const handleClassStatic = () => {
    setStaticType("클래스");
  };
  // ! 서버로부터 프로젝트 타스크 통계 데이터를 받아 정제 후 state에 저장
  const cleanProjectAllStatics = (data: any) => {
    const statics = data.statics_status_steps;
    if (statics.length > 0) {
      let pAllStatics: IPAllStatics = {
        stepOneComplete: 0,
        stepTwoComplete: 0,
        totalCount: data.count,
      };

      for (let i = 0; i < statics.length; i++) {
        if (statics[i].task_status_step === 1) {
          pAllStatics.stepOneComplete = statics[i].task_status_complete_count;
        }
        if (statics[i].task_status_step === 2) {
          pAllStatics.stepTwoComplete = statics[i].task_status_complete_count;
        }
      }
      setProjectAllStatics(pAllStatics);
    }
  };
  // ! 특정 프로젝트의 task static data fetch
  const getProjectAllStatics = async () => {
    if (pId) {
      const res = await staticsApi.getStaticsTaskByProject(
        {
          project_id: parseInt(pId),
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        cleanProjectAllStatics(res.data);
      }
    }
    return;
  };
  // ! 일별 작업 진행 추이의 데이터를 서버로부터 get
  const getProjectStaticsByDay = async () => {
    if (!pId) return;
    const res = await staticsApi.getStaticsTaskByDay(
      {
        project_id: parseInt(pId),
        startBeforeDays: progressDay - 1,
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      const dayStatics = res.data;
      let dayStaticsStepOneValues: IStaticsTaskByDay[] = [];
      let dayStaticsStepTwoValues: IStaticsTaskByDay[] = [];
      for (let i = 0; i < dayStatics.length; i++) {
        const dayStaticsStepOneValue = {
          key: new Date(dayStatics[i].day),
          data:
            dayStatics[i].statics_tasks.statics_status_steps[0]
              .task_status_complete_count,
        };
        const dayStaticsStepTwoValue = {
          key: new Date(dayStatics[i].day),
          data:
            dayStatics[i].statics_tasks.statics_status_steps[1]
              .task_status_complete_count,
        };
        dayStaticsStepOneValues.push(dayStaticsStepOneValue);
        dayStaticsStepTwoValues.push(dayStaticsStepTwoValue);
      }
      setStepOneProgressData(dayStaticsStepOneValues);
      setStepTwoProgressData(dayStaticsStepTwoValues);
    }
  };

  const [classesStatics, setClassesStatics] = useState<any[]>([]);
  const cleanStaticsClasses = (data: any) => {
    const classesStatics: any[] = [];
    data.forEach((c: any) => {
      const classStatics = {
        key: c.category.annotation_category_name,
        data: c.count,
      };
      classesStatics.push(classStatics);
    });
    setClassesStatics(classesStatics);
  };

  const getStaticsClasses = async () => {
    if (!pId) return;
    const res = await staticsApi.getStaticsClasses(
      {
        project_id: parseInt(pId),
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      cleanStaticsClasses(res.data);
    }
  };

  useEffect(() => {
    if (staticType === "클래스") {
      getStaticsClasses();
    }
  }, [staticType]);

  //************************** 프로젝트 통계 > 작업자 통계 관련 **************************/
  const [workerStatics, setWorkerStatics] = useState<IWorkerStatics[]>([]);
  const [workerStaticsType, setWorkerStaticsType] = useState<1 | 2>(1);
  const [workerStaticsSearchText, setWorkerStaticsSearchText] = useState<
    string
  >("");
  const handleChangeSearchTextOnWorkerStatics = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setWorkerStaticsSearchText(e.target.value);
  };
  const handleEnterOnWorkerStatics: React.KeyboardEventHandler<
    HTMLInputElement
  > = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    searchWorkerStaticsByUserId();
  };
  const searchWorkerStaticsByUserId = async () => {
    if (!pId) return;
    const res = await staticsApi.getStaticsTaskByUser(
      {
        project_id: parseInt(pId),
        user_id: workerStaticsSearchText,
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      cleanWorkerStatics(res.data);
    }
  };
  const resetSearch = () => {
    getWorkerStaticsByProject();
    setDateRange(null);
    setCalendar(false);
    setSelectedDay(undefined);
    setWorkerStaticsSearchText("");
  };
  const handleChangeOneTwoWorkerStaticsType = () => {
    setWorkerStaticsType(1);
  };
  const handleChangeStepTwoWorkerStaticsType = () => {
    setWorkerStaticsType(2);
  };
  const cleanWorkerStatics = (data: any) => {
    let workerStaticsArr: IWorkerStatics[] = [];
    data.forEach((d: any) => {
      if (d.user.user_id !== "") {
        const workerStaticsTemp: IWorkerStatics = {
          userId: d.user.user_id,
          userEmail: d.user.user_email,
          stepOneComplete:
            d.statics_tasks.statics_status_steps[0].task_status_complete_count,
          stepOneReject:
            d.statics_tasks.statics_status_steps[0].task_status_progress[3]
              .count,
          stepTwoComplete:
            d.statics_tasks.statics_status_steps[1].task_status_complete_count,
          stepTwoReject:
            d.statics_tasks.statics_status_steps[1].task_status_progress[3]
              .count,
        };
        workerStaticsArr.push(workerStaticsTemp);
      }
    });
    setWorkerStatics(workerStaticsArr);
  };
  // ! 프로젝트 통계 화면에서 "작업자 통계" 탭을 클릭했을 경우에 필요 데이터 패치
  const getWorkerStaticsByProject = async () => {
    if (!pId) return;
    const res = await staticsApi.getStaticsTaskByUser(
      {
        project_id: parseInt(pId),
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      cleanWorkerStatics(res.data);
    }
  };
  // ! 프로젝트 통계 화면에서 작업자 통계 화면으로 전환 시 called
  useEffect(() => {
    if (staticType === "작업자") {
      getWorkerStaticsByProject();
    }
  }, [staticType]);

  //********************** calendar functions ***********************/
  // ! 날짜 선택 시 시작날짜 - 종료날짜
  /* const [dateRange, setDateRange] = useState<Date[] | null>(null); */
  // ! is calendar open ?
  const [calendar, setCalendar] = useState<boolean>(false);
  // ! selected month button
  const [selectedDay, setSelectedDay] = useState<
    "오늘" | "3일" | "1주일" | "1개월"
  >();
  // ! show calendar
  const showCalendar = () => {
    setCalendar(true);
    setSelectedDay(undefined);
  };
  // ! calendar에서 날짜 선택을 다 하고 나면 해당 값을 state에 저장후 calendar를 닫는다.
  const handleChangeCalendar = (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDateRange(value);
    setCalendar(false);
  };
  // ! calendar component 외 부분을 클릭 시 calendar를 닫는다.
  const handlePopupDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target as HTMLElement;
    if (
      element.hasAttribute("aria-label") ||
      element.classList.contains("react-calendar__tile")
    ) {
      return;
    }
    if (calendar) {
      setCalendar(false);
    }
  };
  // ! 날짜 인풋 값에 인풋값을 cleaned하여 입력시킨다.
  const dateToString = (): string => {
    if (!dateRange) return "날짜 선택";
    let startDate;
    let endDate;
    for (let i = 0; i < dateRange.length; i++) {
      if (i === 0) startDate = dateRange[i].toLocaleDateString("en-US");
      if (i === 1) endDate = dateRange[i].toLocaleDateString("en-US");
    }
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    return "날짜 선택";
  };
  // ! 날짜 선택 팝업에서 날짜 range를 선택하면 호출되는 function -> 해당 date range로 filtering 해서 데이터를 fetch
  useEffect(() => {
    if (!dateRange) return;
    let startDate;
    let endDate;
    for (let i = 0; i < dateRange.length; i++) {
      if (i === 0) startDate = dateRange[i];
      if (i === 1) endDate = dateRange[i];
    }
    if (startDate && endDate) {
      searchCustomDaysByUserSelected(startDate.getTime(), endDate.getTime());
    }
    // eslint-disable-next-line
  }, [dateRange]);
  const searchCustomDaysByUserSelected = async (start: number, end: number) => {
    if (!pId) return;
    const res = await staticsApi.getStaticsTaskByUser(
      {
        project_id: parseInt(pId),
        start,
        end,
        ...(workerStaticsSearchText && { user_id: workerStaticsSearchText }),
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      cleanWorkerStatics(res.data);
    }
  };
  // ! 당월, 1개월, 3개월, 6개월, 12개월 버튼 클릭 시 호출되는 function -> data를 서버로부터 fetch하고 다시 뿌려줌
  const searchByDays = async (days: "오늘" | "3일" | "1주일" | "1개월") => {
    if (!pId) return;
    let start;
    let end;
    switch (days) {
      case "오늘":
        start = getTodayMillisecondsDate();
        end = getTodayMillisecondsDate();
        break;
      case "3일":
        start = getADayOfCurrentMonthMillisecondsDate(-3);
        end = getTodayMillisecondsDate();
        break;
      case "1주일":
        start = getADayOfCurrentMonthMillisecondsDate(-6);
        end = getTodayMillisecondsDate();
        break;
      case "1개월":
        start = getTodayOfAMonthMillisecondsDate(-1);
        end = getTodayMillisecondsDate();
        break;
    }

    const res = await staticsApi.getStaticsTaskByUser(
      {
        project_id: parseInt(pId),
        start,
        end,
        ...(workerStaticsSearchText && { user_id: workerStaticsSearchText }),
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      cleanWorkerStatics(res.data);
    }

    setSelectedDay(days);
    setDateRange(null);
  };
  //************************** End *********************************/

  // ! 프로젝트 통계 화면에서 "공통 통계" 탭을 클릭했을 경우에 필요 데이터 패치
  useEffect(() => {
    if (staticType === "공통") {
      getProjectAllStatics();
      getProjectStaticsByDay();
    }
  }, [staticType, progressDay]);
  const handleGoCleanStudio = () => {
    navigate(`/studio/cleansing/${project.pNo}`);
  };

  //** 일괄처리, 중복제거 스튜디오, Auto Label 버튼 */

  //******************************** 전처리 일괄처리 ********************************/
  // ! 전처리 일괄처리 팝업이 열려있는지 아닌지 state
  const [onOpenBatchPreProcess, setOnOpenBatchPreProcess] = useState<boolean>(
    false
  );
  // ! 전처리 일괄처리의 처리 형태 선택 state
  const [batchPreProcess, setBatchPreProcess] = useState<
    "grayscale" | "brighten" | "threshold" | "noiseremove"
  >("grayscale");
  // ! 전처리 일괄처리 시 일괄처리 적용할 value state
  const [batchValue, setBatchValue] = useState<number>(0);
  // ! 전처리 일괄처리 시 일괄처리 값의 인풋값 변경 onChange
  const handleChangeBatchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setBatchValue(parseInt(e.target.value));
  };
  // ! 전처리 일괄처리 할 tasks들에 대한 정보 state
  const [batchTasks, setBatchTasks] = useState<any>();
  // ! 전처리 일괄처리 시 전처리 일괄처리 버튼을 누르면 팝업을 띄우기 전에 선택된 task들에 대한 정보를 가져와서
  // ! 해당 task를 읽고 promise에 다 넣음, 이렇게 하는 이유는 reader로 blob 파일을 읽을 때 기다려줘야하기 때문
  const handleBatchPreProcess = async () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "최소 한 개 이상의 Task를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setBatchLoading(true);
    let promises = [];
    for (let i = 0; i < selectedTasks.length; i++) {
      let imgWidth: number, imgHeight: number, imgName: string;
      const dataImageResponse = await taskApi.getTask(
        {
          project_id: pId,
          task_id: selectedTasks[i],
        },
        loggedInUser.accessToken!
      );
      if (dataImageResponse && dataImageResponse.status === 200) {
        imgName = dataImageResponse.data.task_name;
        imgWidth = dataImageResponse.data.task_detail.image_width;
        imgHeight = dataImageResponse.data.task_detail.image_height;
      }
      const blobImageResponse = await taskApi.getTaskData(
        { project_id: pId, task_id: selectedTasks[i] },
        "blob",
        loggedInUser.accessToken!
      );
      if (blobImageResponse && blobImageResponse.status === 200) {
        const blob = blobImageResponse.data;
        const promise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = async () => {
            resolve({
              originalTaskName: imgName,
              originalTaskId: selectedTasks[i],
              originalDataURL: reader.result,
              originalWidth: imgWidth,
              originalHeight: imgHeight,
            });
          };
        });
        promises.push(promise);
      }
    }
    Promise.all(promises).then((p) => {
      setBatchTasks(p);
      setOnOpenBatchPreProcess(true);
      setBatchLoading(false);
    });
  };
  // ! 전처리 일괄처리 팝업 닫기 시 호출
  const cancelBatchPreProcess = () => {
    setOnOpenBatchPreProcess(false);
  };
  // ! 전처리 일괄처리 팝업에서 유형 변경 시 호출
  const onChangeBatchPreProcess = (e: ChangeEvent<HTMLSelectElement>) => {
    if (
      e.target.value === "grayscale" ||
      e.target.value === "brighten" ||
      e.target.value === "threshold" ||
      e.target.value === "noiseremove"
    ) {
      setBatchValue(0);
      setBatchPreProcess(e.target.value);
    }
  };
  // ! 전처리 일괄처리 시 이미지가 로드가 다 끝나면 그 이후에 전처리를 작업한 후, 해당 task의 status, progress 변경 작업까지 끝내는 function
  const doBatchOnloadAndUpdate = (
    image: HTMLImageElement,
    filter: string,
    taskName: string,
    taskId: number
  ) => {
    // ! image를 new로 객체로 만들고 그 이미지에 소스를 넣었을 때 load가 된 후에 해당 이미지로 작업해야한다. (sync)
    image.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) {
        toast({
          title: "작업 진행 중 문제가 발생했습니다.",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.filter = filter;
      context.drawImage(image, 0, 0);
      const newDataURL = canvas.toDataURL("image/jpeg");

      const file = dataUrlToBlob(newDataURL, taskName);
      let formdata = new FormData();
      formdata.append("image", file);

      if (pId && taskId) {
        const res = await taskApi.updateTaskData(
          { project_id: parseInt(pId), task_id: taskId },
          formdata,
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          const updateTaskRes = await taskApi.updateTaskStatus(
            {
              project_id: parseInt(pId),
              task_id: taskId,
            },
            { task_status_progress: 2 },
            loggedInUser.accessToken!
          );
          if (updateTaskRes && updateTaskRes.status === 200) {
            setBatchDoLoading(false);
            toast({
              title: "Task Image 업데이트 완료",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
            setTimeout(() => {
              window.location.reload();
            }, 2500);
          }
        }
      }
    };
  };
  // ! 전처리 일괄처리에 대한 작업을 수행하는 function
  const doBatchProcess = async (
    batchType: string,
    batchValue: number,
    taskId: number,
    taskName: string,
    dataURL: string,
    width: number,
    height: number
  ) => {
    setBatchDoLoading(true);
    const image = new Image();
    image.src = dataURL;
    image.width = width;
    image.height = height;
    switch (batchType) {
      case "grayscale":
        const grayscale = `grayscale(${batchValue}%)`;
        doBatchOnloadAndUpdate(image, grayscale, taskName, taskId);
        break;
      case "brighten":
        const brightness = `brightness(${batchValue}%)`;
        doBatchOnloadAndUpdate(image, brightness, taskName, taskId);
        break;
      case "threshold":
        image.onload = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          if (!context) {
            toast({
              title: "작업 진행 중 문제가 발생했습니다.",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
            return;
          }
          context.clearRect(0, 0, canvas.width, canvas.height);
          let base = cv.imread(image);
          let cloned = base.clone();
          let dst = new cv.Mat();

          cv.threshold(cloned, dst, batchValue, 255, cv.THRESH_BINARY);
          cv.imshow(canvas, dst);
          cloned.delete();
          dst.delete();

          const newDataURL = canvas.toDataURL("image/jpeg");
          const file = dataUrlToBlob(newDataURL, taskName);
          let formdata = new FormData();
          formdata.append("image", file);

          if (pId && taskId) {
            const res = await taskApi.updateTaskData(
              { project_id: parseInt(pId), task_id: taskId },
              formdata,
              loggedInUser.accessToken!
            );
            if (res && res.status === 200) {
              const updateTaskRes = await taskApi.updateTaskStatus(
                {
                  project_id: parseInt(pId),
                  task_id: taskId,
                },
                { task_status_progress: 2 },
                loggedInUser.accessToken!
              );
              if (updateTaskRes && updateTaskRes.status === 200) {
                setBatchDoLoading(false);
                toast({
                  title: "Task Image 업데이트 완료",
                  status: "success",
                  position: "top",
                  duration: 2000,
                  isClosable: true,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 2500);
              }
            }
          }
        };
        break;
      case "noiseremove":
        image.onload = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          if (!context) {
            toast({
              title: "작업 진행 중 문제가 발생했습니다.",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
            return;
          }
          context.clearRect(0, 0, canvas.width, canvas.height);
          let base = cv.imread(image);
          let clone = base.clone();
          let dst = new cv.Mat();

          cv.medianBlur(clone, dst, 3);
          cv.imshow(canvas, dst);
          clone.delete();
          dst.delete();
          const newDataURL = canvas.toDataURL("image/jpeg");
          const file = dataUrlToBlob(newDataURL, taskName);
          let formdata = new FormData();
          formdata.append("image", file);

          if (pId && taskId) {
            const res = await taskApi.updateTaskData(
              { project_id: parseInt(pId), task_id: taskId },
              formdata,
              loggedInUser.accessToken!
            );
            if (res && res.status === 200) {
              const updateTaskRes = await taskApi.updateTaskStatus(
                {
                  project_id: parseInt(pId),
                  task_id: taskId,
                },
                { task_status_progress: 2 },
                loggedInUser.accessToken!
              );
              if (updateTaskRes && updateTaskRes.status === 200) {
                setBatchDoLoading(false);
                toast({
                  title: "Task Image 업데이트 완료",
                  status: "success",
                  position: "top",
                  duration: 2000,
                  isClosable: true,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 2500);
              }
            }
          }
        };
        break;
    }
  };
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [batchDoLoading, setBatchDoLoading] = useState<boolean>(false);
  // ! 전처리 일괄처리 팝업에서 일괄처리 적용 버튼 클릭 시 호출
  const onSubmitBatchProcess = async () => {
    if (pId) {
      try {
        for (let i = 0; i < batchTasks.length; i++) {
          doBatchProcess(
            batchPreProcess,
            batchValue,
            batchTasks[i].originalTaskId,
            batchTasks[i].originalTaskName,
            batchTasks[i].originalDataURL,
            batchTasks[i].originalWidth,
            batchTasks[i].originalHeight
          );
        }
      } catch (e) {}
    }
  };

  //************************* Auto-Label ***************************/
  // ! 팝업창 state
  const [openAutoLabel, setOpenAutoLabel] = useState<boolean>(false);
  // ! 가공 유형 state
  const [labelingType, setLabelingType] = useState<number>(1);
  const handleSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    setLabelingType(parseInt(e.target.value));
  };
  // ! 가공 대상 selectBox의 category_name list state
  const [processingTargets, setProcessingTargets] = useState<
    IProjectAnnotation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  // ! OD 가 active가 안되있을 경우 true
  const [activeOD, setActiveOD] = useState<boolean>(false);
  // ! IS/SES 가 active가 안되있을 경우 true
  const [activeISES, setActiveISES] = useState<boolean>(false);

  // ! AutoLabel 버튼 누를 때 호출
  const onOpenAutoLabel = async () => {
    for (let i = 0; i < selectedTaskInfo.length; i++) {
      if (
        selectedTaskInfo[i].taskStep === 2 &&
        selectedTaskInfo[i].taskStatus === 3
      ) {
        toast({
          title: "검수-완료된 파일은 작업이 불가합니다.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    if (selectedTasks.length === 0) {
      toast({
        title: "최소 한 개 이상의 Task를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const res = await labelingApi.checkActiveAutoLabeling({
      project_id: parseInt(pId),
      task_type: labelingType === 1 ? 1 : 2,
    });
    if (res && res.status === 200) {
      if (labelingType === 1 && res.data.model_path !== "none") {
        setActiveOD(true);
      }
      if (labelingType !== 1 && res.data.model_path !== "none") {
        setActiveISES(true);
      }
    }
    setOpenAutoLabel(true);
  };
  // ! AutoLabel 팝업창 닫을 때 호출
  const onCancelAutoLabel = () => {
    setOpenAutoLabel(false);
    setLabelingType(1);
    setSelectedTasks(() => []);
    setSelectedClass(() => []);
  };

  // ! selectBox에 project_categories 불러옴
  const getProcessingTarget = async () => {
    if (!pId) return;
    const res = await projectApi.getProject(
      {
        project_id: parseInt(pId),
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      let targets: IProjectAnnotation[] = [];
      if (
        !res.data ||
        !res.data.project_detail ||
        !res.data.project_detail.project_categories
      )
        return;
      for (
        let i = 0;
        i < res.data.project_detail.project_categories.length;
        i++
      ) {
        const t = {
          annotation_category_id:
            res.data.project_detail.project_categories[i]
              .annotation_category_id,
          annotation_category_name:
            res.data.project_detail.project_categories[i]
              .annotation_category_name,
          annotation_category_attributes:
            res.data.project_detail.project_categories[i]
              .annotation_category_attributes,
        };
        targets.push(t);
      }
      setProcessingTargets(targets);
      setExportClasses(targets);
    }
  };

  // ! 적용하기 버튼 클릭 시 labeling type에 따른 정보 호출
  const onSubmitLabelingInfo = async () => {
    setLoading(true);
    let taskIds: number[] = [];
    let categoryIds: number[] = [];
    for (let i = 0; i < selectedTasks.length; i++) {
      const t = selectedTasks[i];
      taskIds.push(t);
    }
    if (!selectedClass || !selectedClass.length) {
      toast({
        title: "가공대상을 하나 이상 선택해주세요.",
        status: "error",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      return;
    } else {
      for (let i = 0; i < selectedClass.length; i++) {
        const c = selectedClass[i].annotation_category_id;
        categoryIds.push(c);
      }
    }
    const ti = "[" + taskIds.toString() + "]";
    const ci = "[" + categoryIds.toString() + "]";
    console.log(ti);
    console.log(ci);

    console.log(labelingType);
    const res = await labelingApi.getAutoLabelingBatch({
      project_id: parseInt(pId),
      task_ids: ti,
      labeling_type: labelingType,
      category_ids: ci,
    });
    if (res && res.status === 200) {
      for (let i = 0; i < res.data.length; i++) {
        let data = [];
        //***OD일 때에는 단일배열로 받아오므로 바로 출력가능*/
        if (labelingType === 1) {
          data = res.data[i].annotation_data;
        } else {
          //***IS/SES일 때에는 annotation_data를 이중배열로 받아오므로 단일배열로 가공하여 보내줌*/
          let item = res.data[i].annotation_data;
          for (let k = 0; k < item.length; k++) {
            for (let l = 0; l < item[k].length; l++) {
              data.push(item[k][l]);
            }
          }
        }
        const createAnnotationParam = {
          project_id: parseInt(pId),
          task_id: res.data[i].task_id,
        };
        const createAnnotationPayload = {
          annotation_type: {
            annotation_type_id: labelingType,
          },
          annotation_category: {
            annotation_category_id:
              res.data[i].annotation_category.annotation_category_id,
          },
          annotation_data: data,
        };

        const createRes = await labelingApi.createAnnotation(
          createAnnotationParam,
          createAnnotationPayload
        );
        if (createRes && createRes.status !== 200) {
          toast({
            title: `${createRes.status}`,
            status: "error",
            position: "top",
            duration: 1500,
            isClosable: true,
          });
          return;
        }
      }
      for (let i = 0; i < selectedTasks.length; i++) {
        const updateParam = {
          project_id: parseInt(pId),
          task_id: selectedTasks[i],
        };
        const updateRes = await taskApi.updateTaskStatus(
          updateParam,
          { task_status_progress: 2 },
          loggedInUser.accessToken!
        );
        if (updateRes && updateRes.status !== 200) {
          toast({
            title: `${updateRes.status}`,
            status: "error",
            position: "top",
            duration: 1500,
            isClosable: true,
          });
          return;
        }
      }
      // updateRes.status===200 조건문 안에 들어가게 될 경우 for문이 계속 돌아가야하므로
      // 200 아닌 경우 오류 토스트창을 띄우게 하고, 성공인 경우를 밖으로 빼주어 for문에 들어가지 않게함
      setLoading(false);
      toast({
        title: "성공적으로 완료하였습니다.",
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      window.location.reload();
      // setOpenAutoLabel(false);
      // setLabelingType(1);
      // setSelectedTasks(() => []);
      // setSelectedClass(() => []);
      return;
    }
  };

  useEffect(() => {
    getProcessingTarget();
  }, [pId]);

  //************************* 프로젝트 설정 페이지 ***************************/
  // ! 프로젝트 설정의 프로젝트 명
  const [settingsPName, setSettingsPName] = useState<string>("");
  // ! 프로젝트 설정의 프로젝트 설명
  const [settingsPDesc, setSettingsPDesc] = useState<string>("");
  /**************************프로젝트 설정-수집****************************/

  // ! 프로젝트 설정 화면에서 탭 정보에 대한 state
  const [settingType, setSettingType] = useState<"정보" | "멤버">("정보");

  // ! datasets state
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  // ! 데이터 유형 state
  const [collectDataType, setCollectDataType] = useState<CollectDataType>(
    CollectDataType.dataset
  );
  // ! 데이터 수집 > 인간 데이터셋 제공 > pagination의 현재 page state
  const [currentPage, setCurrentPage] = useState<number>(1);
  // ! dataset tatal count
  const [totalDatasets, setTotalDatasets] = useState<number>(0);
  // ! crawling state
  const [crawling, setCrawling] = useState<IGetProjectParam>();
  /***********************************************************************/
  // ! 프로젝트 유형의 데이터 수집 > 데이터 유형의 인간 데이터셋 제공으로 state change
  const handleCollectDataSet = () => {
    setCollectDataType(CollectDataType.dataset);
  };
  // ! 프로젝트 유형의 데이터 수집 > 데이터 유형의 웹 크롤링 데이터로 state change
  const handleCollectCrawling = () => {
    setCollectDataType(CollectDataType.crawling);
  };
  const handleCollectUpload = () => {
    setCollectDataType(CollectDataType.upload);
  };
  /**************************프로젝트 설정-가공****************************/
  // ! 프로젝트 설정의 클래스 list
  const [projectAnnotation, setProjectAnnotation] = useState<
    IProjectAnnotation[]
  >();
  // ! 클래스의 우측 ">" 버튼 클릭 시 선택되는 클래스 state
  const [currentSelectedClass, setCurrentSelectedClass] = useState<string>();
  // ! 클래스의 속성을 클릭할 때 해당 속성 state
  const [currentSelectedAttr, setCurrentSelectedAttr] = useState<string>();
  // ! class attr, class attr value 창 노출 여부
  const [showAttrDiv, setShowAttrDiv] = useState<boolean>(false);
  // ! 프로젝트 설정의 삭제 버튼 클릭 시 삭제 팝업 show true
  const [showDeletePAlert, setShowDeletePAlert] = useState<boolean>(false);
  // ! 프로젝트 설정의 삭제 버튼 클릭 시 로딩 true
  const [pDeleteLoading, setPDeleteLoading] = useState<boolean>(false);
  // ! 프로젝트 설정의 프로젝트 수정 시 로딩 true
  const [pUpdateLoading, setPUpdateLoading] = useState<boolean>(false);
  // ! 클래스 별 속성 값 작성 시 속성명에 대한 state
  const [attrName, setAttrName] = useState<string>("");
  // ! 클래스 별 속성 값 작성 시 속성값에 대한 array state
  const [tempAttrInfo, setTempAttrInfo] = useState<string[]>([]);
  // ! 속성유형 선택 select box의 선택된 값 state
  const [selectedAttrType, setSelectedAttrType] = useState<ClassAttrType>(
    ClassAttrType.mono
  );
  // ! 최소 선택 수 (다중 선택형,입력형)
  const [minValue, setMinValue] = useState<number>(0);
  // ! 최대 선택 수 (다중 선택형,입력형)
  const [maxValue, setMaxValue] = useState<number>(0);
  /***********************************************************************/
  // ! 프로젝트 설정의 삭제 버튼 클릭 시 호출
  const handleShowDeleteAlert = () => {
    setShowDeletePAlert(true);
  };
  // ! 프로젝트 설정에서 삭제 팝업을 닫을 때 호출
  const handleCancelDeleteAlert = () => {
    setShowDeletePAlert(false);
  };
  // ! 프로젝트 설정의 프로젝트명 수정 시 state 저장
  const handleChangeSettingsPName = (e: ChangeEvent<HTMLInputElement>) => {
    setSettingsPName(e.target.value);
  };
  // ! 프로젝트 설정의 프로젝트 설명 수정 시 state 저장
  const handleChangeSettingsPDesc = (e: ChangeEvent<HTMLInputElement>) => {
    setSettingsPDesc(e.target.value);
  };
  // ! 클래스의 우측 ">" 버튼 클릭할 때 해당 클래스를 state에 저장하고, attr창 노출
  const handleSetAttr = (className: string) => {
    setCurrentSelectedClass(className);
    setCurrentSelectedAttr(undefined);
    setShowAttrDiv(true);
  };
  // ! 클래스의 속성을 선택할 때 해당 속성을 state에 저장
  const handleSetAttrOfClass = (attr: IAnnotationAttribute) => {
    setCurrentSelectedAttr(attr.annotation_category_attr_name);
    setAttrName(attr.annotation_category_attr_name);
    setSelectedAttrType(
      attr.annotation_category_attr_type === 1
        ? ClassAttrType.mono
        : attr.annotation_category_attr_type === 2
        ? ClassAttrType.multi
        : attr.annotation_category_attr_type === 3
        ? ClassAttrType.customNumber
        : ClassAttrType.customString
    );
    //setSelectedAttrType(attr.annotation_category_attr_type_name);
    setTempAttrInfo(attr.annotation_category_attr_val);
    setMinValue(
      attr.annotation_category_attr_limit_min
        ? attr.annotation_category_attr_limit_min
        : 0
    );
    setMaxValue(
      attr.annotation_category_attr_limit_max
        ? attr.annotation_category_attr_limit_max
        : 0
    );
  };
  // ! 클래스를 선택했을경우, 해당 클래스의 속성이 있으면 그 리스트를 반환
  const getCurrentSelectedClassAttr = ():
    | undefined
    | IAnnotationAttribute[] => {
    for (let i = 0; i < projectAnnotation.length; i++) {
      if (
        projectAnnotation[i].annotation_category_name === currentSelectedClass
      ) {
        if (
          !projectAnnotation[i].annotation_category_attributes ||
          projectAnnotation[i].annotation_category_attributes === undefined
        ) {
          console.log(projectAnnotation[i].annotation_category_attributes);
          return undefined;
        }
        return projectAnnotation[i].annotation_category_attributes;
      }
      console.log(projectAnnotation[i].annotation_category_attributes);
    }
    return undefined;
  };
  // ! 클래스의 속성과 클래스가 선택됐을 때 해당 속성의 values를 반환
  const getCurrentSelectedAttrValues = (): null | IClassAttr => {
    for (let i = 0; i < projectAnnotation.length; i++) {
      if (
        projectAnnotation[i].annotation_category_name === currentSelectedClass
      ) {
        const attrs = projectAnnotation[i].annotation_category_attributes!;
        if (!attrs) return null;
        for (let k = 0; k < attrs.length; k++) {
          if (attrs[k].annotation_category_attr_name === currentSelectedAttr) {
            const annotation_category_attr_type =
              attrs[k].annotation_category_attr_type === 1
                ? ClassAttrType.mono
                : attrs[k].annotation_category_attr_type === 2
                ? ClassAttrType.multi
                : attrs[k].annotation_category_attr_type === 3
                ? ClassAttrType.customNumber
                : ClassAttrType.customString;
            let classAttrs: IClassAttr = {
              attrName: attrs[k].annotation_category_attr_name,
              attrType: annotation_category_attr_type,
              attrValue: attrs[k].annotation_category_attr_val,
              attrMin: attrs[k].annotation_category_attr_limit_min,
              attrMax: attrs[k].annotation_category_attr_limit_max,
            };
            return classAttrs;
          }
        }
      }
      return null;
    }
    return null;
  };
  // ! 프로젝트 설정의 삭제 팝업에서 삭제 버튼 클릭 시 삭제 api 실행
  const doDeleteProject = async () => {
    if (!pId) return;
    setPDeleteLoading(true);
    const res = await projectApi.deleteProject(
      { project_id: parseInt(pId) },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      //setPDeleteLoading(false);
      toast({
        title: "프로젝트가 삭제되었습니다.",
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      handleCancelDeleteAlert();
      setTimeout(() => {
        setPDeleteLoading(false);
        navigate("/main/projects");
      }, 1000);
    }
  };
  // ! 프로젝트 설정의 저장 버튼 클릭 시 수정 api 실행
  const doUpdateProject = async () => {
    if (!pId) return;
    setPUpdateLoading(true);
    const res = await projectApi.updateProject(
      {
        project_id: parseInt(pId),
        project_name: settingsPName,
        project_desc: settingsPDesc,
        project_manager: {
          user_id: loggedInUser.id,
        },
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      setPUpdateLoading(false);
      toast({
        title: "프로젝트 갱신 성공",
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  // ! pId로 project detail data fetch
  const getAnnotation = async () => {
    if (pId) {
      const res = await projectApi.getProject(
        {
          project_id: parseInt(pId),
        },
        loggedInUser.accessToken!
      );
      if (res && res.status === 200) {
        if (
          !res.data ||
          !res.data.project_detail ||
          !res.data.project_detail.project_categories
        )
          return;
        //console.log(res.data.project_detail.project_categories);
        //*project annotation
        let annotations: IProjectAnnotation[] = [];
        res.data.project_detail.project_categories.forEach((data: any) => {
          const annotation = {
            annotation_category_color: data.annotation_category_color,
            annotation_category_name: data.annotation_category_name,
            annotation_category_attributes: data.annotation_category_attributes,
          };
          annotations.push(annotation);
        });
        setProjectAnnotation(annotations);
        console.log(annotations);

        //*project annotation attribute
        let attributes: IAnnotationAttribute[] = [];
        for (let i = 0; i < annotations.length; i++) {
          annotations[i].annotation_category_attributes.forEach((data: any) => {
            const attribute = {
              annotation_category_attr_name: data.annotation_category_attr_name,
              annotation_category_attr_type: data.annotation_category_attr_type,
              annotation_category_attr_val: data.annotation_category_attr_val,
              annotation_category_attr_limit_min:
                data.annotation_category_attr_limit_min,
              annotation_category_attr_limit_max:
                data.annotation_category_attr_limit_max,
            };
            attributes.push(attribute);
          });
        }
      }
    }
  };
  // ! 받은 dataset을 정제 후 state에 저장
  const cleanDatasets = (data: any) => {
    let cleanedDatasets: IDataset[] = [];
    data.datas.forEach((s: any) => {
      if (project.pDetail.data_type && project.pDetail.data_type === 1) {
        const datasetId = s.dataset_id;
        const datasetName = s.dataset_name;
        const datasetItemsCount = s.dataset_items_count;
        const datasetItemsSize = s.dataset_items_size;
        const datasetCategory = s.dataset_category;
        const datasetSubCategory = s.dataset_sub_category;
        const sForm = {
          datasetId,
          datasetName,
          datasetItemsCount,
          datasetItemsSize,
          datasetCategory,
          datasetSubCategory,
        };
        cleanedDatasets.push(sForm);
      }
    });
    setDatasets(cleanedDatasets);
    setTotalDatasets(data.pageinfo.totalResults);
  };

  // ! 인간 데이터셋 제공 유형에서 특정 페이지넘버 클릭 시 호출되는 메소드
  const getDataset = async () => {
    const res = await datasetApi.getDatasets(
      { maxResults: 10 },
      loggedInUser.accessToken!
    );
    if (res && res.data && res.status === 200) {
      console.log(res.data);
      cleanDatasets(res.data);
    }
  };

  // ! crawling data
  const getCrawling = async () => {
    const res = await projectApi.getProject(
      {
        project_id: parseInt(pId),
      },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      console.log(res.data.project_detail);
      const cleanCrawling: IGetProjectParam = {
        project_id: parseInt(pId),
        project_detail: res.data.project_detail,
      };

      setCrawling(cleanCrawling);
    }
  };

  // !프로젝트 멤버 설정
  const [projectMemberList, setProjectMemberList] = useState<IProjectUser[]>(
    []
  );
  const [searchProjectMemberText, setSearchProjectMemberText] = useState<
    string
  >("");
  const [
    searchOrganizationMemberText,
    setSearchOrganizationMemberText,
  ] = useState<string>("");
  const [searchedProjectMemberList, setSearchedProjectMemberList] = useState<
    IProjectUser[]
  >([]);
  const currentSearchedProjectMemberList = useRef(searchedProjectMemberList);
  const [selectedProjectMemberList, setSelectedProjectMemberList] = useState<
    IProjectUser[]
  >([]);
  const [openRemovePMember, setOpenRemovePMember] = useState<boolean>(false);
  const [organizationMemberList, setOrganizationMemberList] = useState<
    IProjectUser[]
  >([]);
  const [
    searchedOrganizationMemberList,
    setSearchedOrganizationMemberList,
  ] = useState<IProjectUser[]>([]);
  const [openOrganizationMember, setOpenOrganizationMember] = useState<boolean>(
    false
  );
  const [
    selectedOrganizationMemberList,
    setSelectedOrganizationMemberList,
  ] = useState<IProjectUser[]>([]);

  const handleInfoSetting = (e: any) => {
    setSettingType("정보");
  };

  const handleMemberSetting = (e: any) => {
    setSettingType("멤버");
    getProjectMember();
  };

  // ! 프로젝트 멤버들을 가져오기 위한 api 호출 후 state에 멤버들 저장
  const getProjectMember = async () => {
    const res = await projectApi.getProject(
      { project_id: parseInt(pId) },
      loggedInUser.accessToken!
    );
    if (res && res.status === 200) {
      let users: IProjectUser[] = [];
      res.data.project_members.forEach((user: any) => {
        let isWorkerUser = false,
          isValidatorUser = false;
        pTasks.forEach((task) => {
          if (task.taskWorker && user.user_id === task.taskWorker.id)
            isWorkerUser = true;
          if (task.taskValidator && user.user_id === task.taskValidator.id)
            isValidatorUser = true;
        });
        const u = {
          pId: parseInt(pId),
          taskId: 0,
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          isValidator: isValidatorUser,
          isWorker: isWorkerUser,
        };
        //if(isWorkerUser || isValidatorUser)
        users.push(u);
      });
      setProjectMemberList(users);
    } else {
      // TODO: error handling
    }
  };

  const handleChangeSearchProjectMember = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const txt = e.target.value;
    if (!txt || txt === "") {
      //전체 리스트
      setSearchedProjectMemberList(projectMemberList);
      return;
    }
    setSearchProjectMemberText(txt);
  };

  const handleSearchProjectMember = () => {
    setSearchedProjectMemberList(
      projectMemberList.filter(
        (element) =>
          element.userEmail.includes(searchProjectMemberText) ||
          element.userDisplayName.includes(searchProjectMemberText)
      )
    );
  };

  const setSelectedProjectMembers = (member: IProjectUser) => {
    if (!member || member === null) {
      if (selectedOrganizationMemberList.length === 0) {
        setSelectedProjectMemberList(projectMemberList);
      } else {
        setSelectedProjectMemberList([]);
      }
    } else {
      let result = false;
      selectedProjectMemberList.map((element) => {
        if (element === member) result = true;
      });
      if (result) {
        setSelectedProjectMemberList(
          selectedProjectMemberList.filter((element) => element !== member)
        );
      } else {
        setSelectedProjectMemberList((selectedProjectMemberList) => [
          ...selectedProjectMemberList,
          member,
        ]);
      }
    }
  };

  const isSelectedProjectMember = (member: IProjectUser) => {
    let result = false;
    selectedProjectMemberList.map((element) => {
      if (element === member) result = true;
    });
    return result;
  };

  const isSelectedAllProjectMember = () => {
    return (
      selectedProjectMemberList.length > 0 &&
      selectedProjectMemberList.length === projectMemberList.length
    );
  };

  const setSelectedAllProjectMembers = () => {
    if (selectedProjectMemberList.length !== projectMemberList.length) {
      setSelectedProjectMemberList(projectMemberList);
    } else {
      setSelectedProjectMemberList([]);
    }
  };

  useEffect(() => {
    console.log(projectMemberList);
    setSearchedProjectMemberList(projectMemberList);
  }, [projectMemberList]);

  useEffect(() => {
    currentSearchedProjectMemberList.current = searchedProjectMemberList;
    console.log(searchedProjectMemberList);
  }, [searchedProjectMemberList]);

  const [selectedProjectMemberType, setSelectedProjectMemberType] = useState<
    string[]
  >([]);

  const setSelectedTypeProjectMember = (type: string) => {
    if (type === "all") {
      if (selectedProjectMemberType.length < 2) {
        setSelectedProjectMemberType([project.pType.project_type_name, "검수"]);
      } else {
        setSelectedProjectMemberType([]);
      }
    } else {
      let result = false;
      selectedProjectMemberType.map((element) => {
        if (element === type) result = true;
      });
      if (result) {
        setSelectedProjectMemberType(
          selectedProjectMemberType.filter((element) => element !== type)
        );
      } else {
        setSelectedProjectMemberType((selectedProjectMemberType) => [
          ...selectedProjectMemberType,
          type,
        ]);
      }
    }
  };

  const isSelectedTypeProjectMember = (type: string) => {
    return selectedProjectMemberType.includes(type);
  };

  const [txtRemovePMember, setTxtRemovePMember] = useState<string>("");
  const onOpenRemovePMember = () => {
    let result = true;
    if (!selectedProjectMemberList || selectedProjectMemberList.length === 0) {
      toast({
        title: "한 명 이상의 멤버를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      result = false;
      return;
    }
    selectedProjectMemberList.forEach((member) => {
      if (member.isWorker || member.isValidator) {
        setTxtRemovePMember(
          "작업이 할당된 멤버가 포함되어 있습니다. 멤버를 삭제할 경우 해당 작업의 담당자가 해지됩니다."
        );
      }
    });
    if (result) setOpenRemovePMember(true);
  };

  const onCancelRemovePMember = () => {
    setSelectedProjectMemberList([]);
    setTxtRemovePMember("");
    setOpenRemovePMember(false);
  };

  const onRemoveProjectMember = async () => {
    if (!pId) {
      toast({
        title: "프로젝트 ID를 읽어오지 못했습니다. 다시 시도해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    let removeResult = true;
    // ! Task 해지 부분 => Task 담당자 해지 기능 (Api) 구현 후 구현 예정
    selectedProjectMemberList.forEach((member) => {
      pTasks.forEach(async (task) => {
        if (
          member.isWorker &&
          task.taskWorker &&
          task.taskWorker.id === member.userId
        ) {
          const resWorker = await taskApi.updateTask(
            {
              project_id: parseInt(pId),
            },
            {
              task_id: task.taskId,
              task_worker: null,
              task_validator: {
                user_id: task.taskValidator.id,
              },
            }
          );
          if (!resWorker || resWorker.status !== 200) {
            removeResult = false;
            return false;
          }
        }
        if (
          member.isValidator &&
          task.taskValidator &&
          task.taskValidator.id === member.userId
        ) {
          const resValidator = await taskApi.updateTask(
            {
              project_id: parseInt(pId),
            },
            {
              task_id: task.taskId,
              task_worker: {
                user_id: task.taskWorker.id,
              },
              task_validator: null,
            }
          );
          if (!resValidator || resValidator.status !== 200) {
            removeResult = false;
            return false;
          }
        }
      });
    });

    if (!removeResult) {
      console.log("error");
      return;
    }

    const mIds = [];
    selectedProjectMemberList.forEach((member) => mIds.push(member.userId));

    const res = await projectApi.removeProjectMember(
      {
        project_id: parseInt(pId),
        del_project_member_ids: mIds,
      }
      //loggedInUser.accessToken!
    );
    if (res && res.status !== 200) {
      toast({
        title: "멤버 삭제가 실패하였습니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "멤버 삭제가 완료되었습니다.",
      status: "success",
      position: "top",
      duration: 1500,
      isClosable: true,
    });
    onCancelRemovePMember();
    getTasksByProject();
    getProjectMember();
    return;
  };

  const getUserInfo = async () => {
    const res = await userApi.getUserInfo(
      {
        user_id: loggedInUser.id,
      },
      loggedInUser.accessToken
    );
    if (res && res.status === 200) {
      console.log(res.data);
      getOrganizationMember(res.data.organization_id);
    }
  };
  // ! 추가하기 팝업에서 유저들을 리턴해야 하므로 해당 유저들을 가져오기 위한 api 호출 후 state에 유저들 저장
  const getOrganizationMember = async (id: number) => {
    const res = await userApi.getOrganizationMember({
      organization_id: id,
    });
    if (res && res.status === 200) {
      let users: IProjectUser[] = [];
      res.data.forEach((member) => {
        if (
          member.user_id !== loggedInUser.id &&
          projectMemberList.find(
            (element) => element.userId === member.user_id
          ) === undefined
        ) {
          const u = {
            pId: parseInt(pId),
            taskId: 0,
            userId: member.user_id,
            userDisplayName: member.user_display_name,
            userEmail: member.user_email,
          };
          users.push(u);
        }
      });
      setOrganizationMemberList(users);
    }
  };

  useEffect(() => {
    console.log(organizationMemberList);
    setSearchedOrganizationMemberList(organizationMemberList);
  }, [organizationMemberList]);

  const onOpenOrganizationMember = () => {
    setOpenOrganizationMember(true);
  };

  const onCancelOrganizationMember = () => {
    setOrganizationMemberList([]);
    setSelectedOrganizationMemberList([]);
    setOpenOrganizationMember(false);
  };

  useEffect(() => {
    if (openOrganizationMember) getUserInfo(); // => api 개발 이후 변경 예정
  }, [openOrganizationMember]);

  const onSubmitOrganizationMember = async () => {
    if (
      !selectedOrganizationMemberList ||
      selectedOrganizationMemberList.length === 0
    ) {
      toast({
        title: "한 명 이상의 멤버를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!pId) {
      toast({
        title: "프로젝트 ID를 읽어오지 못했습니다. 다시 시도해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const mIds = [];
    if (projectMemberList && projectMemberList.length > 0)
      projectMemberList.forEach((member) => mIds.push(member.userId));
    selectedOrganizationMemberList.forEach((member) =>
      mIds.push(member.userId)
    );

    const res = await projectApi.addProjectMember(
      {
        project_id: parseInt(pId),
        project_member_ids: mIds,
      },
      loggedInUser.accessToken!
    );
    if (res && res.status !== 200) {
      toast({
        title: "멤버 추가가 실패하였습니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: "멤버 추가가 완료되었습니다.",
      status: "success",
      position: "top",
      duration: 1500,
      isClosable: true,
    });
    onCancelOrganizationMember();
    getProjectMember();
    return;
  };

  const handleChangeSearchOrganizationMember = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const txt = e.target.value;
    if (!txt || txt === "") {
      //전체 리스트
      setSearchedOrganizationMemberList(organizationMemberList);
      return;
    }
    setSearchOrganizationMemberText(txt);
  };

  const handleSearchOrganizationMember = () => {
    setSearchedOrganizationMemberList(
      organizationMemberList.filter(
        (element) =>
          element.userEmail.includes(searchOrganizationMemberText) ||
          element.userDisplayName.includes(searchOrganizationMemberText)
      )
    );
  };

  const setSelectedOrganizationMembers = (member: IProjectUser) => {
    if (!member || member === null) {
      if (selectedOrganizationMemberList.length === 0) {
        setSelectedOrganizationMemberList(organizationMemberList);
      } else {
        setSelectedOrganizationMemberList([]);
      }
    } else {
      let result = false;
      selectedOrganizationMemberList.map((element) => {
        if (element === member) result = true;
      });
      if (result) {
        setSelectedOrganizationMemberList(
          selectedOrganizationMemberList.filter((element) => element !== member)
        );
      } else {
        setSelectedOrganizationMemberList((selectedOrganizationMemberList) => [
          ...selectedOrganizationMemberList,
          member,
        ]);
      }
    }
  };

  const isSelectedOrganizationMember = (member: IProjectUser) => {
    let result = false;
    selectedOrganizationMemberList.map((element) => {
      if (element === member) result = true;
    });
    return result;
  };

  const isSelectAllOrganizationMember = () => {
    return (
      selectedOrganizationMemberList.length > 0 &&
      selectedOrganizationMemberList.length === organizationMemberList.length
    );
  };

  useEffect(() => {
    console.log(selectedOrganizationMemberList);
  }, [selectedOrganizationMemberList]);

  // ! 모델 설정
  const [modelConfigList, setModelConfigList] = useState<string[]>(constConfigModelNameList);
  
  const [modelConfig, setModelConfig] = useState<IModelConfig>({
    project_id: parseInt(pId),
    model_name: "R_50_FPN_3x",
    model_aug: 20,
    model_epoch: 1000,
    model_lr: 0.00025,
    model_conf: 0.5,
    model_batch: 2,
  });
  
  /* const getModelConfigList = async () => {
  }; */

  const getModelConfig = async () => {
    if (!pId) return;
    const res = await projectApi.getModelConfig({
      project_id: parseInt(pId),
    });
    if (res && res.status === 200) {
      const model = res.data;
      setModelConfig({
        project_id: parseInt(pId),
        model_name: model.model_name,
        model_aug: model.model_aug,
        model_epoch: model.model_epoch,
        model_lr: model.model_lr,
        model_conf: model.model_conf,
        model_batch: model.model_batch,
      });
    }
  };

  const handleSetConfigName = (value: any) => {
    setModelConfig((prev) => {
      return { ...prev, model_name: value };
    });
  };

  const handleSetConfigAug = (type: any) => {
    let value = modelConfig.model_aug;
    if (type === "inc") {
      value += 5;
      if (value > 30) value = 30;
    } else {
      value -= 5;
      if (value < 10) value = 10;
    }
    setModelConfig((prev) => {
      return { ...prev, model_aug: value };
    });
  };

  const handleSetConfigEpoch = (type: any) => {
    let value = modelConfig.model_epoch;
    if (type === "inc") {
      value += 100;
      if (value > 3000) value = 3000;
    } else {
      value -= 100;
      if (value < 500) value = 500;
    }
    setModelConfig((prev) => {
      return { ...prev, model_epoch: value };
    });
  };

  const handleSetConfigLr = (type: any) => {
    let value = modelConfig.model_lr;
    if (type === "inc") {
      value += 0.00005;
      if (value > 0.00095) value = 0.00095;
    } else {
      value -= 0.00005;
      if (value < 0.00005) value = 0.00005;
    }
    value = Math.round(value * 100000) / 100000;
    setModelConfig((prev) => {
      return { ...prev, model_lr: value };
    });
  };

  const handleSetConfigConf = (type: any) => {
    let value = modelConfig.model_conf;
    if (type === "inc") {
      value += 0.1;
      if (value > 0.9) value = 0.9;
    } else {
      value -= 0.1;
      if (value < 0.3) value = 0.3;
    }
    value = Math.round(value * 10) / 10;
    setModelConfig((prev) => {
      return { ...prev, model_conf: value };
    });
  };

  const handleSetConfigBatch = (type: any) => {
    let value = modelConfig.model_batch;
    if (type === "inc") {
      value += 2;
      if (value > 8) value = 8.0;
    } else {
      value -= 2;
      if (value < 2) value = 2.0;
    }
    value = Math.round(value * 10) / 10;
    setModelConfig((prev) => {
      return { ...prev, model_batch: value };
    });
  };

  const updateModelConfig = async (e: any) => {
    if (!pId) return;
    const res = await projectApi.updateModelConfig(modelConfig);
    if (res && res.status === 200) {
      toast({
        title: "모델 설정이 완료되었습니다.",
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      return;
    }
  };

  const [modelAccuracy, setModelAccuracy] = useState<any[]>([]);
  const [modelNegative, setModelNegative] = useState<any[]>([]);
  const [modelFgPositive, setModelFgPositive] = useState<any[]>([]);
  const [modelLr, setModelLr] = useState<any[]>([]);
  const [modelLoss, setModelLoss] = useState<any[]>([]);
  const [openExportModel, setOpenExportModel] = useState<boolean>(false);
  const [filterModelStep, setFilterModelStep] = useState<string>("");
  const [modelExportList, setModelExportList] = useState<IModel[]>([]);
  const [modelList, setModelList] = useState<IModel[]>([]);
  const [modelLog, setModelLog] = useState<IModelLog>();
  const [mExportLoading, setMExportLoading] = useState<boolean>(false);

  const getModelExportList = async () => {
    if(!pId) return;
    await getModelOD();
    await getModelISES();
  };

  const getModelOD = async () => {
    const res = await projectApi.searchModelList({
      project_id: parseInt(pId),
      task_type: 1,
    });
    if (res && res.status === 200) {
      console.log(res.data);
      const replaceData = res.data.replaceAll("'", '"');
      const datas = JSON.parse(replaceData);
      const mList = datas.model_list;
      const data: IModel[] = [];
      mList.forEach(m => {
        const mEl = m.model_name.split("_");
        data.push({
          name: m.model_name,
          type: mEl[1],
          version: mEl[2].split("v")[1],
          status: m.status,
          progress: parseFloat(m.progress),
          backbone: m.model_backbone,
          create: convertDate(m.create_time),
        });
      });
      setModelList((modelList) => [...modelList, ...data]);
    }
  };

  const getModelISES = async () => {
    const res = await projectApi.searchModelList({
      project_id: parseInt(pId),
      task_type: 2,
    });
    if (res && res.status === 200) {
      console.log(res.data);
      const replaceData = res.data.replaceAll("'", '"');
      const datas = JSON.parse(replaceData);
      const mList = datas.model_list;
      const data: IModel[] = [];
      mList.forEach(m => {
        const mEl = m.model_name.split("_");
        data.push({
          name: m.model_name,
          type: mEl[1],
          version: mEl[2].split("v")[1],
          status: m.status,
          progress: parseFloat(m.progress),
          backbone: m.model_backbone,
          create: convertDate(m.create_time),
        });
      });
      setModelList((modelList) => [...modelList, ...data]);
    }
  };

  const convertDate = (date: string) => {
    if (!date || date === "" || date === "none") return "";
    const datas = date.split(" ");
    const year = datas[4].slice(2);
    let month = "01";
    switch (datas[1]) {
      case "Jan":
        month = "01";
        break;
      case "Feb":
        month = "02";
        break;
      case "Mar":
        month = "03";
        break;
      case "Apr":
        month = "04";
        break;
      case "May":
        month = "05";
        break;
      case "Jun":
        month = "06";
        break;
      case "Jul":
        month = "07";
        break;
      case "Aug":
        month = "08";
        break;
      case "Sep":
        month = "09";
        break;
      case "Oct":
        month = "10";
        break;
      case "Nov":
        month = "11";
        break;
      case "Dec":
        month = "12";
        break;
    }
    return year + "." + month + "." + datas[2] + " " + datas[3];
  };

  useEffect(() => {
    setModelExportList(modelList);
  }, [modelList]);

  const getModelTrainLog = async (model: any) => {
    if (!pId) return;
    setSelectedModel(model);
    const res = await projectApi.getModelTrainLog({
      project_id: parseInt(pId),
      task_type: model.type,
      version: parseInt(model.version),
    });
    if (res && res.status === 200) {
      const data = res.data;
      const replaceData = data.replaceAll("'", '"');
      const datas = JSON.parse(replaceData);
      console.log(datas);
      setModelAccuracy(datas.metrics.map((el, id) => {
        return {
          key: el.iteration,
          data: datas.task_type === "od" ? el["fast_rcnn/cls_accuracy"] : el["mask_rcnn/accuracy"]
        };
      }));
      setModelNegative(datas.metrics.map((el, id) => {
        return {
          key: el.iteration,
          data: datas.task_type === "od" ? el["fast_rcnn/false_negative"] : el["mask_rcnn/false_negative"]
        };
      }));
      setModelFgPositive(datas.metrics.map((el, id) => {
        return {
          key: el.iteration,
          data: datas.task_type === "od" ? el["fast_rcnn/fg_cls_accuracy"] : el["mask_rcnn/false_positive"]
        };
      }));
      setModelLr(datas.metrics.map((el, id) => {
        return {
          key: el.iteration,
          data: el.lr * 100000
        };
      }));
      setModelLoss(datas.metrics.map((el, id) => {
        return {
          key: el.iteration,
          data: el.total_loss
        };
      }));
      setModelLog(datas);
    }
  };

  const filterModelByWorkStep = (step: string) => {
    setFilterModelStep(step);
  };

  useEffect(() => {
    setModelExportList(
      modelList.filter((m) =>
        filterModelStep === "" ? m : m.status === filterModelStep
      )
    );
  }, [filterModelStep]);

  const [selectedModel, setSelectedModel] = useState<IModel>();
  const [selectedExportModelType, setSelectedExportModelType] = useState<
    string
  >("pytorch");
  const [selectedModelTypeInfo, setSelectedModelTypeInfo] = useState<any[]>([]);
  const exportModelType = constInfoExportModelType;

  const handleSelectModel = (e: any, model: any) => {
    if (selectedModel === model) {
      setSelectedModel(null);
      setModelLog(null);
    } else {
      setSelectedModel(model);
      if (modelLog) {
        getModelTrainLog(model);
      }
    }
  };

  const isSelectedModel = (model: any) => {
    return selectedModel === model;
  };

  const onOpenExportModel = () => {
    if (!selectedModel) {
      toast({
        title: "모델을 선택해주세요.",
        status: "error",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      return;
    }
    if (selectedModel.status !== "done") {
      const status = selectedModel.status === "inprogress" ? "진행중" : "실패";
      toast({
        title: status + " 모델은 내보낼 수 없습니다.",
        status: "error",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      return;
    }
    if (!selectedExportModelType || selectedExportModelType === "")
      setSelectedExportModelType("pytorch");
    setOpenExportModel(true);
  };

  const onCancelExportModel = () => {
    setSelectedExportModelType("");
    setOpenExportModel(false);
  };

  const setExportModelType = (type: string) => {
    console.log(type);
    setSelectedExportModelType(type);
  };

  useEffect(() => {
    if (selectedExportModelType && selectedExportModelType !== "") {
      const info = exportModelType.find(
        (type) => type.type === selectedExportModelType
      ).info;
      setSelectedModelTypeInfo(info);
    } else {
      setSelectedModelTypeInfo([]);
    }
  }, [selectedExportModelType]);

  const exportModel = async (e: any) => {
    setMExportLoading(true);
    if (!pId) return;
    if (!selectedModel) return;
    if (!selectedExportModelType || selectedExportModelType === "") return;
    console.log(selectedExportModelType);
    let payload = {
      project_id: parseInt(pId),
      task_type: selectedModel.type,
      version: selectedModel.version,
      export_type: selectedExportModelType,
    };

    const res = await projectApi.exportModel(payload);
    if (res && res.status === 200) {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/zip" })
      );
      saveAs(url, selectedModel.name + "_" + selectedExportModelType + ".zip");
      toast({
        title: "모델 배포가 완료되었습니다.",
        status: "success",
        position: "top",
        duration: 1500,
        isClosable: true,
      });
      setSelectedModel(null);
      setSelectedExportModelType("");
      onCancelExportModel();
      setMExportLoading(false);
      return;
    }
    setMExportLoading(false);
  };

  useEffect(() => {
    if (project) {
      if (project.pType.project_type_id === 1) {
        if (project.pDetail.data_type && project.pDetail.data_type === 1) {
          getDataset();
          setCollectDataType(CollectDataType.dataset);
        } else if (
          project.pDetail.data_type &&
          project.pDetail.data_type === 2
        ) {
          getCrawling();
          setCollectDataType(CollectDataType.crawling);
        } else if (
          project.pDetail.data_type &&
          project.pDetail.data_type === 3
        ) {
          setCollectDataType(CollectDataType.upload);
        }
      }
      getAnnotation();
    }
  }, [project]);
  // ! 프로젝트 설정에서 삭제 팝업이 아닌 부분을 전부로 설정하고 해당 위치 클릭 시 삭제 팝업 닫기 Ref
  const cancelRef = useRef(null);
  return (
    <ProjectDetailPresenter
      loggedInUser={loggedInUser}
      project={project}
      projectTasks={vTasks}
      page={location.search.split("=")[1] || "1"}
      totalTasksCount={totalTasksCount}
      projectUsers={projectUsers}
      openSidebarUpper={openSidebarUpper}
      selectedInnerTab={selectedInnerTab}
      fileInput={fileInput}
      searchText={searchText}
      openWorkerAssign={openWorkerAssign}
      assignProgress={assignProgress}
      assignees={assignees}
      assignee={assignee}
      assigneePage={assigneePage}
      members={members}
      totalMembersCount={totalMembersCount}
      staticType={staticType}
      projectAllStatics={projectAllStatics}
      progressDay={progressDay}
      onOpenBatchPreProcess={onOpenBatchPreProcess}
      batchPreProcess={batchPreProcess}
      batchValue={batchValue}
      batchLoading={batchLoading}
      batchDoLoading={batchDoLoading}
      stepOneProgressData={stepOneProgressData}
      stepTwoProgressData={stepTwoProgressData}
      settingsPName={settingsPName}
      settingsPDesc={settingsPDesc}
      showDeletePAlert={showDeletePAlert}
      showAttrDiv={showAttrDiv}
      cancelRef={cancelRef}
      pDeleteLoading={pDeleteLoading}
      pUpdateLoading={pUpdateLoading}
      workerStatics={workerStatics}
      workerStaticsType={workerStaticsType}
      workerStaticsSearchText={workerStaticsSearchText}
      selectedDay={selectedDay}
      dateRange={dateRange}
      calendar={calendar}
      openAutoLabel={openAutoLabel}
      classesStatics={classesStatics}
      processingTargets={processingTargets}
      labelingType={labelingType}
      projectAnnotation={projectAnnotation}
      currentSelectedClass={currentSelectedClass}
      currentSelectedAttr={currentSelectedAttr}
      attrName={attrName}
      selectedAttrType={selectedAttrType}
      minValue={minValue}
      maxValue={maxValue}
      collectDataType={collectDataType}
      datasets={datasets}
      crawling={crawling}
      activeOD={activeOD}
      activeISES={activeISES}
      handleEnter={handleEnter}
      showCalendar={showCalendar}
      handleClassStatic={handleClassStatic}
      resetSearch={resetSearch}
      handleChangeCalendar={handleChangeCalendar}
      handlePopupDown={handlePopupDown}
      dateToString={dateToString}
      searchByDays={searchByDays}
      searchWorkerStaticsByUserId={searchWorkerStaticsByUserId}
      handleEnterOnWorkerStatics={handleEnterOnWorkerStatics}
      handleChangeSearchTextOnWorkerStatics={
        handleChangeSearchTextOnWorkerStatics
      }
      handleChangeOneTwoWorkerStaticsType={handleChangeOneTwoWorkerStaticsType}
      handleChangeStepTwoWorkerStaticsType={
        handleChangeStepTwoWorkerStaticsType
      }
      doUpdateProject={doUpdateProject}
      filterTaskByWorkStep={filterTaskByWorkStep}
      filterTaskByWorkProgress={filterTaskByWorkProgress}
      handleShowDeleteAlert={handleShowDeleteAlert}
      handleCancelDeleteAlert={handleCancelDeleteAlert}
      handleChangeSettingsPName={handleChangeSettingsPName}
      handleChangeSettingsPDesc={handleChangeSettingsPDesc}
      doDeleteProject={doDeleteProject}
      onSubmitBatchProcess={onSubmitBatchProcess}
      handleChangeBatchValue={handleChangeBatchValue}
      onChangeBatchPreProcess={onChangeBatchPreProcess}
      cancelBatchPreProcess={cancelBatchPreProcess}
      handleGoCleanStudio={handleGoCleanStudio}
      handleBatchPreProcess={handleBatchPreProcess}
      handleChangeProgressDay={handleChangeProgressDay}
      handleWorkerStatic={handleWorkerStatic}
      handleCommonStatic={handleCommonStatic}
      handleSelectInnerTab={handleSelectInnerTab}
      handleGoStudio={handleGoStudio}
      selectTask={selectTask}
      removeTask={removeTask}
      isSelectedTask={isSelectedTask}
      isSelectedAllTasks={isSelectedAllTasks}
      selectAllTask={selectAllTask}
      removeAllTask={removeAllTask}
      handleChangeSearch={handleChangeSearch}
      handleDoSearch={handleDoSearch}
      selectFile={selectFile}
      handleChangeFileUpload={handleChangeFileUpload}
      onOpenWorkerAssign={onOpenWorkerAssign}
      onCancelWorkerAssign={onCancelWorkerAssign}
      onSubmitWorkerAssign={onSubmitWorkerAssign}
      onChangeAssignProgress={onChangeAssignProgress}
      getPages={getPages}
      nextPage={nextPage}
      prevPage={prevPage}
      resetSearchResults={resetSearchResults}
      doSearchUserByUsername={doSearchUserByUsername}
      selectAssignee={selectAssignee}
      openExport={openExport}
      onOpenExport={onOpenExport}
      onCancelExport={onCancelExport}
      onSubmitExport={onSubmitExport}
      isSelectedProgress={isSelectedProgress}
      selectProgress={selectProgress}
      removeProgress={removeProgress}
      isSelectedExport={isSelectedExport}
      setSelectedClasses={setSelectedClasses}
      selectedClass={selectedClass}
      onOpenAutoLabel={onOpenAutoLabel}
      onCancelAutoLabel={onCancelAutoLabel}
      handleSelectType={handleSelectType}
      onSubmitLabelingInfo={onSubmitLabelingInfo}
      handleSetAttr={handleSetAttr}
      handleSetAttrOfClass={handleSetAttrOfClass}
      getCurrentSelectedClassAttr={getCurrentSelectedClassAttr}
      getCurrentSelectedAttrValues={getCurrentSelectedAttrValues}
      handleCollectDataSet={handleCollectDataSet}
      handleCollectCrawling={handleCollectCrawling}
      isSelectedClasses={isSelectedClasses}
      setSelectedClassAttrs={setSelectedClassAttrs}
      selectedAttrs={selectedAttrs}
      isSelectedClassAttrs={isSelectedClassAttrs}
      valSearchClass={valSearchClass}
      handleChangeSearchClass={handleChangeSearchClass}
      handleSearchClass={handleSearchClass}
      exportClasses={exportClasses}
      isSearchClass={isSearchClass}
      isSelectedOptions={isSelectedOptions}
      setSelectedOptions={setSelectedOptions}
      selectedOption={selectedOption}
      cntAllAttrs={cntAllAttrs}
      valSearchAttrs={valSearchAttrs}
      handleChangeSearchAttrs={handleChangeSearchAttrs}
      handleSearchAttrs={handleSearchAttrs}
      isSearchAttrs={isSearchAttrs}
      exportAttrs={exportAttrs}
      _setDownload={_setDownload}
      selectDownload={selectDownload}
      isDownload={isDownload}
      openImport={openImport}
      onOpenImport={onOpenImport}
      onCancelImport={onCancelImport}
      onSubmitImport={onSubmitImport}
      setSelectedTypeImport={setSelectedTypeImport}
      isSelectedTypeImport={isSelectedTypeImport}
      isSelectedImportTask={isSelectedImportTask}
      selectedImportTasks={selectedImportTasks}
      selectedImportType={selectedImportType}
      importTasks={importTasks}
      handleSelectImportItem={handleSelectImportItem}
      handleSearchImport={handleSearchImport}
      handleChangeSearchImport={handleChangeSearchImport}
      valSearchImport={valSearchImport}
      dateRangeImport={dateRangeImport}
      dateImportToString={dateImportToString}
      handleChangeImportCalendar={handleChangeImportCalendar}
      dateRangeExport={dateRangeExport}
      dateExportToString={dateExportToString}
      handleChangeExportCalendar={handleChangeExportCalendar}
      settingType={settingType}
      handleInfoSetting={handleInfoSetting}
      handleMemberSetting={handleMemberSetting}
      handleChangeSearchProjectMember={handleChangeSearchProjectMember}
      handleSearchProjectMember={handleSearchProjectMember}
      handleChangeSearchOrganizationMember={
        handleChangeSearchOrganizationMember
      }
      handleSearchOrganizationMember={handleSearchOrganizationMember}
      onOpenOrganizationMember={onOpenOrganizationMember}
      onCancelOrganizationMember={onCancelOrganizationMember}
      openOrganizationMember={openOrganizationMember}
      onSubmitOrganizationMember={onSubmitOrganizationMember}
      setSelectedOrganizationMembers={setSelectedOrganizationMembers}
      isSelectedOrganizationMember={isSelectedOrganizationMember}
      isSelectAllOrganizationMember={isSelectAllOrganizationMember}
      selectedOrganizationMemberList={selectedOrganizationMemberList}
      searchedOrganizationMemberList={searchedOrganizationMemberList}
      isSelectedProjectMember={isSelectedProjectMember}
      setSelectedProjectMembers={setSelectedProjectMembers}
      isSelectedAllProjectMember={isSelectedAllProjectMember}
      setSelectedAllProjectMembers={setSelectedAllProjectMembers}
      selectedProjectMemberList={selectedProjectMemberList}
      searchedProjectMemberList={searchedProjectMemberList}
      setSelectedTypeProjectMember={setSelectedTypeProjectMember}
      isSelectedTypeProjectMember={isSelectedTypeProjectMember}
      selectedProjectMemberType={selectedProjectMemberType}
      onRemoveProjectMember={onRemoveProjectMember}
      openRemovePMember={openRemovePMember}
      onOpenRemovePMember={onOpenRemovePMember}
      onCancelRemovePMember={onCancelRemovePMember}
      txtRemovePMember={txtRemovePMember}
      fUploadLoading={fUploadLoading}
      getTasksByProject={getTasksByProject}
      handleDragEnter={handleDragEnter}
      handleDragOver={handleDragOver}
      handleDragLeave={handleDragLeave}
      handleDrop={handleDrop}
      fileDrag={fileDrag}
      filterModelByWorkStep={filterModelByWorkStep}
      loading={loading}
      modelConfig={modelConfig}
      modelConfigList={modelConfigList}
      handleSetConfigName={handleSetConfigName}
      handleSetConfigAug={handleSetConfigAug}
      handleSetConfigEpoch={handleSetConfigEpoch}
      handleSetConfigLr={handleSetConfigLr}
      handleSetConfigConf={handleSetConfigConf}
      handleSetConfigBatch={handleSetConfigBatch}
      updateModelConfig={updateModelConfig}
      modelExportList={modelExportList}
      exportModel={exportModel}
      handleSelectModel={handleSelectModel}
      isSelectedModel={isSelectedModel}
      getModelTrainLog={getModelTrainLog}
      modelLog={modelLog}
      modelLr={modelLr}
      modelLoss={modelLoss}
      modelAccuracy={modelAccuracy}
      modelNegative={modelNegative}
      modelFgPositive={modelFgPositive}
      openExportModel={openExportModel}
      onOpenExportModel={onOpenExportModel}
      onCancelExportModel={onCancelExportModel}
      setExportModelType={setExportModelType}
      selectedTasks={selectedTasks}
      mExportLoading={mExportLoading}
      selectedExportModelType={selectedExportModelType}
      selectedModelTypeInfo={selectedModelTypeInfo}
      handleCollectUpload={handleCollectUpload}
      assignLoading={assignLoading}
    />
  );
};

export default ProjectDetailContainer;
