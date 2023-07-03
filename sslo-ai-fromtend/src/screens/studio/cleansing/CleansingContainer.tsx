import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { useToast } from "@chakra-ui/react";
import CleansingPresenter from "./CleansingPresenter";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import taskApi, { ITask } from "../../../api/taskApi";
import userApi, { IUser } from "../../../api/userApi";
import projectApi, {
  IGetProjectParam,
  IProjectInfo,
} from "../../../api/projectApi";
import { useAppSelector } from "../../../hooks";
//let fabric = require("fabric.js");

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

const CleansingContainer = () => {
  // ! project ID를 URL로부터 Get
  const { pId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUser = useAppSelector((state) => state.userReducer);
  //**! 기본 state, set */
  const toast = useToast();
  // ! MainCenterBottom의 file select state
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState<boolean>(true);
  // ! 우측 DropBoxContentDescWrapper의 File 정보 노출 state
  const [isFileInfoOpen, setIsFileInfoOpen] = useState<boolean>(true);
  // ! loading state
  const [loading, setLoading] = useState<boolean>(false);
  // ! Main 화면 File List를 처음 여는지 아닌지 여부 (이거는 처음 렌더링할때 로딩하는 시간이 있어서 로딩 이펙트를 넣어주기 위함)
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [isWorked, setIsWorked] = useState<boolean>(false);
  // ! MainCenterImagePicker의 파일 리스트
  const [tasks, setTasks] = useState<ITask[]>([]);
  // ! current selected file
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  // ! history about task
  const [dataURLHistory, setDataURLHistory] = useState<IDataURLHistory[]>([]);
  // ! current image data url
  const [currentDataURL, setCurrentDataURL] = useState<string | null>(null);
  // ! work statutes
  const [workStatutes, setWorkStatutes] = useState<WorkStatusType>(
    WORKSTATUS_ALL
  );
  const [allFileHashes, setAllFileHashes] = useState<any>([]);
  const [allDupTasks, setAllDupTasks] = useState([]);
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
  // ! call api search all users
  const searchAllUsers = async (param: any) => {
    const res = await userApi.getAllUsers(param);
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
      //setProjectUser(users);
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
    } else {
      // TODO: error handling
    }
  };
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const [dupFileList, setDupFileList] = useState([]);
  //const [isCheckDuplicated, setIsCheckDuplicate] = useState<boolean>(false);
  const cleanTasks = async (tasks: any[]) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    for (let i = 0; i < tasks.length; i++) {
      const taskId = tasks[i].task_id;
      const imageName = tasks[i].task_detail.image_name;
      const imageThumbnail = tasks[i].task_detail.image_thumbnail;
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
    //! cleanedTasks와 중복검사를 했는지에 대한 여부를 알 수 있는 isCheckDuplicated를 넣어 새로운 배열을 만든다.
    let newTasks = [];
    for (let i = 0; i < cleanedTasks.length; i++) {
      let tempObj = { ...cleanedTasks[i], isCheckDuplicated: false };
      newTasks.push(tempObj);
    }
    setTasks(cleanedTasks);
    setDupFileList(newTasks);
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
    initAllHashes();
    // eslint-disable-next-line
  }, [tasks.length]);
  // ! dataURLHistory's first order stored when selectedTask changed.
  useEffect(() => {
    if (selectedTask) {
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
  //! selectedTask값이 바뀔 때마다 selectedTask에 그 바뀐 값을 바로 설정해주는 useEffect()
  useEffect(() => {
    if (selectedTask) {
      _setSelectedTask(selectedTask);
    }
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
    searchAllUsers({ maxResults: 50 });
    if (pId) getProject({ project_id: parseInt(pId) });
    //doSimilar();
    // eslint-disable-next-line
  }, []);

  //*************** Header function **********************/

  // ! Toggle full screen
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
  const goBack = () => {
    navigate(-1);
  };

  const initAllHashes = async () => {
    const hashes = await restAllHash2();
    setAllFileHashes(hashes);
  };

  useEffect(() => {
    if(allFileHashes && allFileHashes.length > 0) {
      initSetHash();
    }
  }, [allFileHashes]);

  const [hashSet, setHashSet] = useState<any>([]);
  const initSetHash = () => {
    const hash = new Set();
    allFileHashes.map(element => hash.add(element.hash));
    setHashSet(hash);
  };

  // //***************Blockhash library 이용해 중복 이미지 뽑아내기  ****************/
  const blockHash = require("blockhash-core");
  const { getImageData } = require("@canvas/image");

  //let [selectedHash, setSelectedHash] = useState<any>("");

  //!가져온 이미지를 hash값으로 변경해주는 method
  let obj = [];
  const [hashObj, setHashObj] = useState([]);
  const hash = async (img, imgFolder) => {
    try {
      const hash = await blockHash.bmvbhash(getImageData(img), 8);
      let objHashImg = {
        hash: hash,
        img: img,
        imgFolder: imgFolder,
      };
      obj.push(objHashImg);

      //return hexToBin(hash);
    } catch (error) {
      console.log(error);
    }
  };
  //! hash값을 16진법으로 바꿔주는 method
  /* const hexToBin = (hexString) => {
    const hexBinLookup = {
      0: "0000",
      1: "0001",
      2: "0010",
      3: "0011",
      4: "0100",
      5: "0101",
      6: "0110",
      7: "0111",
      8: "1000",
      9: "1001",
      a: "1010",
      b: "1011",
      c: "1100",
      d: "1101",
      e: "1110",
      f: "1111",
      A: "1010",
      B: "1011",
      C: "1100",
      D: "1101",
      E: "1110",
      F: "1111",
    };
    let result = "";
    for (let i = 0; i < hexString.length; i++) {
      result += hexBinLookup[hexString[i]];
    }
    return result;
  }; */
  // ! set selected task
  const _setSelectedTask = async (task: ITask) => {
    const img = `data:image/${task.imageFormat};base64,` + task.imageThumbnail;
    const image = new Image();
    image.src = img;

    image.onload = async function() {
      // console.log(image.width, image.height);
      const hash = await blockHash.bmvbhash(getImageData(image), 8);
      //console.log(hash);
      //setSelectedHash(hash);
      setSelectedTask(task);
      if (checkIsPlayed === false) {
        setCheckSelectedIndex([]);
        // checkSelectedIndex.splice(0);
      }
    };
  };

  //! imgFolder에 담겨있는 tasks의 length만큼 반복문으로 image들을 뽑아내,
  //! DataURL에 담는다.
  const getAllImage = () => {
    const imgFolder = tasks.filter(element => element.taskStatus !== 4);
    //console.log(imgFolder);
    let files = [];
    for (let i = 0; i < imgFolder.length; i++) {
      //! 이미지의 src
      const img =
        `data:image/${imgFolder[i].imageFormat};base64,` +
        imgFolder[i].imageThumbnail;
      const imgTag = document.createElement("img");
      imgTag.src = img;

      let imgObj = {
        imgTag: imgTag,
        imgFolder: imgFolder[i],
      };
      files.push(imgObj);
    }
    return files;
  };

  //let result = [];
  //let final = [];
  /* const restAllHash = async () => {
    const files = await getAllImage();
    //let count = 0;
    for (let i = 0; i < files.length; i++) {
      await hash(files[i].imgTag, files[i].imgFolder);
    }
    result = obj.filter((obj) => obj.hash === selectedHash);
    // final = result.filter(
    //   (obj) => obj.imgFolder.taskId !== selectedTask.taskId
    // );
    console.log(result);
    return result;
  }; */

  //! Progress Bar ..............................//
  const [progressValue, setProgressValue] = useState<number>(0);
  const progressMaxValue = tasks.length;
  //const _setProgressValue = useRef(null);
  //! 중복된 hash값 받아서 similarHash에 넣어주는 method
  //! 재생버튼을 눌러 중복된 값을 뿌려주면 isCheckDuplicated를 true로 바꿔주고,
  //! 그 바뀐 열을 새로운 배열에 넣어줌

  //const [similarHash, setSimilarHash] = useState<any>([]);
  /* const filterHashContainer = async () => {
    let newFileList = [];
    //console.log("get2 --->");
    const filterHash = await restAllHash();
    console.log(filterHash);
    const tempList = dupFileList;
    for (let i = 0; i < tempList.length; i++) {
      if (selectedTask.taskId === tempList[i].taskId) {
        tempList[i].isCheckDuplicated = true;
      }
      if (tempList[i].isCheckDuplicated === true) {
        newFileList.push(tempList[i]);
      }
    }

    setSimilarHash(filterHash);
    setProgressValue(newFileList.length);
    if (progressValue > tasks.length) {
      clearInterval(increment.current);
      setIsStopped(true);
    }

    return newFileList;
  }; */

  //******************************중복이미지 뽑아내기 끝****************************** */

  //******************************중복이미지 선택************************************ */

  const [checkSelectedTask, setCheckSelectedTask] = useState<boolean>(false);
  const [checkSelectedIndex, setCheckSelectedIndex] = useState([]);
  const _setMainSelectedTask = async (task: ITask) => {
    let newAllDupTasks = [];
    let prevDupArray;

    for (let i = 0; i < allDupTasks.length; i++) {
      let isPushed = false;
      prevDupArray = allDupTasks[i];
      for (let j = 0; j < allDupTasks[i].length; j++) {
        if (task.taskId === allDupTasks[i][j].imgFolder.taskId) {
          allDupTasks[i][j].isSelected = !allDupTasks[i][j].isSelected;
          let items = prevDupArray.find(
            (t) => t.imgFolder.taskId !== allDupTasks[i][j].imgFolder.taskId
          );
          let newItems = allDupTasks[i][j];
          //prevDupArray = tempArr;
          // const newArr = allDupTasks[i].filter(
          //   (t) => t.imgFolder.taskId !== allDupTasks[i][j].imgFolder.taskId
          // );
          prevDupArray.concat(items, newItems);
          //prevDupArray = newArr;
          newAllDupTasks.push(prevDupArray);
          isPushed = true;
        }
      }
      if (!isPushed) newAllDupTasks.push(prevDupArray);
    }
    //console.log("클릭후", newAllDupTasks);
    setAllDupTasks(newAllDupTasks);
  };
  //******************************중복이미지 선택 끝************************************ */
  //! 재생버튼 누르면 변경되는 useState / trtrue바꾸는 함수
  const [isPlayed, setIsPlayed] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(true);
  const [checkIsPlayed, setCheckIsPlayed] = useState<boolean>(false);
  const copyTasks = tasks;

  const isPausedNow = useRef(isPaused);
  useEffect(() => {
    isPausedNow.current = isPaused;
  }, [isPaused]);

  //******************** timer start *************************/
  const [timer, setTimer] = useState(0);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${+minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    setHours(getHours);
    setMinutes(getMinutes);
    setSeconds(getSeconds);
  };
  useEffect(() => {
    formatTime();
  }, [timer]);
  const increment = useRef(null);

  const handleStart = () => {
    if (isPlayed === true) return;
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(increment.current);
  };
  const handleReset = () => {
    clearInterval(increment.current);
    setTimer(0);
  };

  const restAllHash2 = async () => {
    const files = await getAllImage();
    for (let i = 0; i < files.length; i++) {
      await hash(files[i].imgTag, files[i].imgFolder);
    }
    //result = obj.filter((obj) => obj.hash === selectedHash);
    // final = result.filter(
    //   (obj) => obj.imgFolder.taskId !== selectedTask.taskId
    // );
    //console.log(obj);
    return obj;
  };
  const [isLoading, setIsLoading] = useState(false);
  // Todo: cnt부터 동작하도록 수정 필요
  const [cnt, setCnt] = useState<number>(0);
  const currentCnt = useRef(cnt);
  useEffect(() => {
    currentCnt.current = cnt;
  }, [cnt]);
  const start = async () => {
    // ! 처음 cleanTask 시 Hash 생성?
    //const allFileHashes = await restAllHash2();
    // ! Set을 만들어서 모든 파일의 해쉬값들을 중복을 제거하여 저장하는 부분 (Set과 Array의 차이점은 Set이 Array의 일종인데 중복값을 넣지 않는다.)
    /* let temp = [];
    for (let i = 0; i < allFileHashes.length; i++) {
      temp.push(allFileHashes[i].hash);
    } */
    //const hashSet = new Set(temp);

    // ! 하나의 배열에 같은 hash를 가지는 object를 담고 divider로 구분짓는다.
    let filteredDupTasks = [];
    let index = 0;
    let isDone = false;
    console.log(cnt);
    hashSet.forEach((hash) => {
      if(isPausedNow.current) {
        console.log("puase: " + index);
        setCnt(index);
        return;
      }
      if(index >= cnt) {
        for (let i = 0; i < allFileHashes.length; i++) {
          let tempObj = { ...allFileHashes[i], isSelected: false };
          if (hash === allFileHashes[i].hash) filteredDupTasks.push(tempObj);
        }
        if (index === hashSet.size - 1) {
          isDone = true;
          setCnt(0);
          return;
        }
        filteredDupTasks.push("divider");
        index++;
        console.log("play: " + index);

      }
    });
    // ! divider로 구분된 한개의 배열을 divider를 기준으로 배열로 만들고 배열안에 배열을 넣는다 -> [ [], [], [] ]
    let resultsArray = [];
    for (let i = 0; i < filteredDupTasks.length; i++) {
      let t = [];
      for (let j = i; j < filteredDupTasks.length; j++) {
        if (filteredDupTasks[j] !== "divider") {
          t.push(filteredDupTasks[j]);
          if (j !== filteredDupTasks.length - 1) continue;
        }
        i = j;
        resultsArray.push(t);
        break;
      }
    }
    // ! 모든 정리가 끝나면 state에 저장한다.
    // ! 완료/정지 후 실행시 처음부터 실행이므로 전체 치환, 일시정지 후 실행시 기존 데이터에 이어서 추가
    if(currentCnt.current === 0)
      setAllDupTasks(resultsArray);
    else 
      setAllDupTasks(allDupTasks => [...allDupTasks, ...resultsArray]);
    //console.log(allDupTasks);
    if(isDone) {
      setProgressValue(tasks.length);
      clearInterval(increment.current);
      setIsStopped(true);
      setIsPlayed(false);
      setCheckIsPlayed(false);
      setIsPaused(false);
    } else {
      console.log("???");
    }
  };

  const _setIsPlayed = async () => {
    if (isPlayed === true) return;
    formatTime();
    setIsLoading(true);
    setTimeout(() => {
      start();
      setIsLoading(false);
    }, 1200);

    setIsPlayed(!isPlayed);
    setCheckIsPlayed(!checkIsPlayed);
    setIsPaused(false);
    handleStart();
    setIsStopped(false);
    setIsWorked(true);
    // filterHashContainer();
    // //same();
    // //autoList();
    // if (progressValue + 1 === tasks.length) {
    //   clearInterval(increment.current);
    //   setIsStopped(true);
    //   setCheckIsPlayed(false);
    // }
  };

  //! selectedTask가 바뀔때마다 가상재생버튼을 false로 바꿔줌
  useEffect(() => {
    setCheckIsPlayed(false);
    //setIsPlayed(false);
  }, [selectedTask]);

  // Todo: 동작 중지 기능 필요
  const _setIsPaused = () => {
    setIsPaused(true);
    handlePause();
    setIsPlayed(false);
    setCheckIsPlayed(false);
    setIsStopped(false);
    //}
  };
  const _setIsStopped = () => {
    //! 정지버튼 누르면 dupFileList 초기화
    console.log(dupFileList);
    for (let i = 0; i < dupFileList.length; i++) {
      if (dupFileList[i].isCheckDuplicated === true) {
        dupFileList[i].isCheckDuplicated = false;
      }
    }
    console.log(dupFileList);

    setIsStopped(true);
    setProgressValue(0);
    handleReset();
    setIsPlayed(false);
    setCheckIsPlayed(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if(!isStopped) {
      if(!isPausedNow) {
        setProgressValue(0);
        handleReset();
      }
    }
  }, [isStopped]);
  //** AutoSelect 누르면 전체선택 / 해제 function */
  const [isAutoSelect, setIsAutoSelect] = useState<boolean>(false);
  let autoSelectList = [];
  let autoSelectListCon = [];
  const _setAutoSelect = () => {
    //console.log(allTasks, allDupTasks);
    setIsAutoSelect((prev) => !prev);

    for (let i = 0; i < allDupTasks.length; i++) {
      //setCheckSelectedIndex(temp);
      //let temp = [];
      for (let j = 1; j < allDupTasks[i].length; j++) {
        if (allDupTasks[i].length === 1) continue;
        //console.log(allTasks[i][j]);
        //const temp = [[...allTasks[i]][j]];
        //temp.push(allTasks[i][j]);
        allDupTasks[i][j].isSelected = !allDupTasks[i][j].isSelected;
        //autoSelectList.filter((value) => value === false);
        //console.log(temp[i][i].imgFolder.taskId);
      }
      //autoSelectList.push(temp);
    }
    console.log(allDupTasks);
    // for (let i = 0; i < autoSelectList.length; i++) {
    //   autoSelectList[i].isSelected = !autoSelectList[i].isSelected;
    // }
    //setAllDupTasks([autoSelectList]);
    setAllDupTasks(allDupTasks);
    //console.log(autoSelectList);
    //console.log(checkSelectedIndex);
  };
  //******************** timer end *************************/
  //********************** 반려 function start ************************ */
  // ! 반려 팝업 노출 상태 state
  const [isOpenReject, setIsOpenReject] = useState<boolean>(false);
  // ! 반려 팝업에서 반려 사유 입력 내용 저장 state
  const [rejectText, setRejectText] = useState<string>("중복이미지");
  // ! 반려 버튼 클릭 시 반려 팝업 노출 on
  const handleOpenReject = () => {
    setIsOpenReject(true);
  };
  // ! 반려 팝업 닫기 버튼 클릭 시 팝업 미노출 on
  const handleCancelReject = () => {
    setIsOpenReject(false);
  };
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  // ! 반려 팝업에서 적용 버튼 클릭 시 호출 function
  const onSubmitReject = async () => {
    setIsSubmit(true);
    const isSelectedTrue = [];
    for (let i = 0; i < allDupTasks.length; i++) {
      //console.log(allDupTasks[i]);
      for (let j = 0; j < allDupTasks[i].length; j++) {
        if (allDupTasks[i][j].isSelected === true) {
          isSelectedTrue.push(allDupTasks[i][j]);
        }
      }
    }

    if (isSelectedTrue.length === 0) {
      toast({
        title: "데이터를 하나 이상 선택해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (pId) {
      // loop 선택한 task들을 담고있는 배열:
      let result = false;
      for (let i = 0; i < isSelectedTrue.length; i++) {
        //console.log(checkSelectedIndex[i])
        const res = await taskApi.updateTaskStatus(
          { project_id: parseInt(pId), task_id: isSelectedTrue[i].imgFolder.taskId },
          { task_status_progress: 3 },
          //loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          const resReject = await taskApi.updateTaskStatus(
            {
              project_id: parseInt(pId),
              task_id: isSelectedTrue[i].imgFolder.taskId,
            },
            { task_status_progress: 4, comment_body: rejectText },
            //loggedInUser.accessToken!
          );
          if (resReject && resReject.status === 200) {
            result = true;
          } else {
            result = false;
            toast({
              title: "반려 실패",
              status: "error",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
            _setIsStopped();
            searchTasks({
              project_id: pId,
              orderBy: "task_id",
              order: "ASC",
              maxResults: 10000,
            });
            setIsOpenReject(false);
            return;
          }
        }
      }
      console.log(result);
      if(result) {
        toast({
          title: "반려 완료",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        _setIsStopped();
        setIsOpenReject(false);
        setIsSubmit(false);
        //window.location.reload();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      setIsSubmit(false);
    }
    /* searchTasks({
      project_id: pId,
      orderBy: "task_id",
      order: "ASC",
      maxResults: 10000,
    });
    setIsOpenReject(false); */
  };
  // ! 반려 팝업에서 textarea의 입력 내용 handle change
  const handleSetRejectText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRejectText(e.target.value);
  };
  //********************** 반려 function end ************************ */

  //*************** Main function **********************/

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
	  let fullWidth = refPicker.current.scrollWidth; // 전체 길이
    let clientWidth = refPicker.current.clientWidth; // 보이는 길이

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

  // ! allFileHashes 데이터 활용 가능?
  const [cntDupTasks, setCntDupTasks] = useState<number>(0);

  useEffect(() => {
    console.log(allDupTasks);
    if(allDupTasks.length > 0) {
      let cnt = 0;
      allDupTasks.forEach((element) => { 
        if (element.length > 1)
          cnt++;
       });
      setCntDupTasks(cnt);
    }
  }, [allDupTasks]);

  useEffect(() => {
    console.log(cntDupTasks);
  }, [cntDupTasks]);
  
  if (pId) {
    return (
      <CleansingPresenter
        currentUser={loggedInUser}
        currentDataURL={currentDataURL}
        projectInfo={projectInfo}
        checkSelectedIndex={checkSelectedIndex}
        //examinee={examinee}
        tasks={tasks}
        isFileSelectorOpen={isFileSelectorOpen}
        //collectAssignee={collectAssignee}
        //projectUser={projectUser}
        isFileInfoOpen={isFileInfoOpen}
        workStatutes={workStatutes}
        selectedTask={selectedTask}
        loading={loading}
        isFirst={isFirst}
        //_setExaminee={_setExaminee}
        //_setCollectAssignee={_setCollectAssignee}
        toggleFileSelector={toggleFileSelector}
        toggleFileInfoOpen={toggleFileInfoOpen}
        _setWorkStatutes={_setWorkStatutes}
        _setSelectedTask={_setSelectedTask}
        handleToggleFullScreen={handleToggleFullScreen}
        goBack={goBack}
        isPlayed={isPlayed}
        _setIsPlayed={_setIsPlayed}
        isPaused={isPaused}
        _setIsPaused={_setIsPaused}
        isStopped={isStopped}
        _setIsStopped={_setIsStopped}
        progressValue={progressValue}
        progressMaxValue={progressMaxValue}
        formatTime={formatTime}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        checkIsPlayed={checkIsPlayed}
        _setMainSelectedTask={_setMainSelectedTask}
        checkSelectedTask={checkSelectedTask}
        allDupTasks={allDupTasks}
        handleOpenReject={handleOpenReject}
        handleCancelReject={handleCancelReject}
        onSubmitReject={onSubmitReject}
        handleSetRejectText={handleSetRejectText}
        isOpenReject={isOpenReject}
        isLoading={isLoading}
        _setAutoSelect={_setAutoSelect}
        isAutoSelect={isAutoSelect}
        refPicker={refPicker} 
        onMoveToToolsLeft={onMoveToToolsLeft} 
        onMoveToToolsRight={onMoveToToolsRight}
        isWorked={isWorked}
        cntDupTasks={cntDupTasks}
        isSubmit={isSubmit}
      />
    );
  }
  return null;
};

export default CleansingContainer;
