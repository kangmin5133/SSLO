import TrialPresenter from "./TrialPresenter";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import React, {
    ChangeEvent,
    MouseEventHandler,
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
  } from "react";
  import { useToast } from "@chakra-ui/react";
  import {
    dataUrlToBlob,
    getDataUrlByCanvasWithImg,
    getDataUrlWithFilter,
    IParamTransform,
  } from "../../../utils";
  import mergeImages from "merge-images";
  import { useLocation, useNavigate, useParams } from "react-router-dom";
  import { ITask } from "../../../api/taskApi";
  import {
    IGetProjectParam,
    IProjectInfo,
    IProjectCategories,
    IProjectAnnotation,
    IAnnotationAttribute
  } from "../../../api/projectApi";
  import { useAppSelector } from "../../../hooks";
  import labelingApi from "../../../api/labelingApi";
  import { fabric } from "fabric";
  import iconDefault from "../../../assets/images/studio/icon/instanceTools/icon-instance-default.svg";
  import iconBoxing from "../../../assets/images/studio/icon/instanceTools/icon-instance-boxing.svg";
  import iconPolygon from "../../../assets/images/studio/icon/instanceTools/icon-instance-polygon.svg";
  import iconKeypoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-keypoint.svg";
  import iconOD from "../../../assets/images/studio/icon/instanceTools/icon-instance-OD.svg";
  import iconIS from "../../../assets/images/studio/icon/instanceTools/icon-instance-IS.svg";
  import iconSES from "../../../assets/images/studio/icon/instanceTools/icon-instance-SES.svg";
  import iconLock from "../../../assets/images/studio/icon/instanceTools/icon-lock-active.svg";
  import iconUnLock from "../../../assets/images/studio/icon/instanceTools/icon-unlock-dark.svg";
  import iconVisible from "../../../assets/images/studio/icon/instanceTools/icon-visible-dark.svg";
  import iconInvisible from "../../../assets/images/studio/icon/instanceTools/icon-invisible-active.svg";
  import JSZIP from "jszip";
  import { trialProject, trialTasks } from "../../../components/studio/TestDataset";
  
  export const SYMMETRY_LEFT_RIGHT = "LeftRight";
  export const SYMMETRY_UP_DOWN = "UpDown";
  
  //! 가공처리를 이행할때마다 History에 대한 Interface
  export interface IDataURLHistory {
    taskId: number;
    order: number;
    dataURL: string;
  }
  
  export interface ICanvasHistory {
    order: number; 
    data: any;
  }
  
  export interface Iimg {
    width: number;
    height: number;
    ratio: number;
    data?: ImageData;
  }

  export interface FormatCOCO {
    info: any;
    images: FormatImage[]; 
    annotations: FormatAnnotation[];
    licenses: any[]; 
    categories: FormatCategory[];
  }  
  export interface FormatImage {
    id: number; 
    file_name: string; 
    height: number; 
    width: number; 
    size: number; 
    created: number; 
    updated: number; 
    md5: string;
  }
  export interface FormatAnnotation {
    id: number; 
    image_id: number; 
    category_id: number;
    bbox?: number[]; 
    segmentation?: number[];
    keypoint?: number[]; 
    num_keypoints?: number;
    iscrowd: number;
  }
  export interface FormatCategory {
    id: number; 
    name: string;
    supercategory?: string;
  }

const TrialContainer = () => {
  // ! project ID를 URL로부터 Get
  const navigate = useNavigate();
  //**! 기본 state, set */
  const toast = useToast();
  // ! Canvas set
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  // ! MainCenterBottom의 file select state
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState<boolean>(true);
  // ! 우측 DropBoxContentDescWrapper의 File 정보 노출 state
  const [isFileInfoOpen, setIsFileInfoOpen] = useState<boolean>(false);
  // ! 우측 DropBoxContentDescWrapper의 Instance 정보 노출 state
  const [isInstanceOpen, setIsInstanceOpen] = useState<boolean>(true);
  // ! 우측 DropBoxContentDescWrapper의 History 정보 노출 state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  // ! loading state
  const [loading, setLoading] = useState<boolean>(false);
  // ! Main 화면 File List를 처음 여는지 아닌지 여부 (이거는 처음 렌더링할때 로딩하는 시간이 있어서 로딩 이펙트를 넣어주기 위함)
  const [isFirst, setIsFirst] = useState<boolean>(true);
  // ! MainCenterImagePicker의 파일 리스트
  const [tasks, setTasks] = useState<ITask[]>([]);
  
  // ! current selected file
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const currentTask = useRef(selectedTask);
  // ! history about task
  const [dataURLHistory, setDataURLHistory] = useState<IDataURLHistory[]>([]);
  // ! current image data url
  const [currentDataURL, setCurrentDataURL] = useState<string | null>(null);

  const [isKeyOnOff, setIsKeyOnOff] = useState<boolean>(false);
  const [isCrossOnOff, setIsCrossOnOff] = useState<boolean>(true);
  const [isCountClassOpen, setIsCountClassOpen] = useState<boolean>(false);

  // ! 프로젝트 정보
  const [projectInfo, setProjectInfo] = useState<IProjectInfo | null>();
  const [selectedTool, setSelectedTool] = useState("");
  const currentTool = useRef(selectedTool);

  const [canvasHistory, setCanvasHistory] = useState<ICanvasHistory[]>([]);
  const [cHistory, setCHistory] = useState([]);

  let isDown = false, drawMode = false, isDragging = false, selection = false;  // isSelectObjectOn = false;
  let objId = 0;
  let startX = 0, startY = 0, endX = 0, endY = 0;
  let pointArray: any[] = [];
  let activeLine: any = null;
  let activeShape: any = null;
  let lineArray: any[] = [];
  const defaultColor = "#F379B4";

  const [isSelectObjectOn, setIsSelectObjectOn] = useState(false);
  const isSelectOn = useRef(isSelectObjectOn);

  const [objectId, setObjectId] = useState(0);

  const [instanceWidth, setInstanceWidth] = useState(0);
  const [instanceHeight, setInstanceHeight] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [objectType, setObjectType] = useState("");
  const [selectedObjectId, setSelectedObjectId] = useState(-1);

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const currentSelectedObject = useRef(selectedObject);
  const [labelWidth, setLabelWidth] = useState(0);
  const [labelHeight, setLabelHeight] = useState(0);
  const [labelCoordX, setLabelCoordX] = useState(0);
  const [labelCoordY, setLabelCoordY] = useState(0);
  const [labelDiag, setLabelDiag] = useState("");
  const [labelPerWidth, setLabelPerWidth] = useState("");
  const [labelPerHeight, setLabelPerHeight] = useState("");
  const [labelPerDiag, setLabelPerDiag] = useState("");

  const [imgRatio, setimgRatio] = useState(1);
  const iRatio = useRef(imgRatio);
  const [imgWidth, setimgWidth] = useState(0);
  const [imgHeight, setimgHeight] = useState(0);
  const [iImage, setIImage] = useState<Iimg>();
  const currentImage = useRef(iImage);

  const [ObjectListItem, setObjectListItem] = useState([]);
  const currentObjectItem = useRef(ObjectListItem);
  /* const [InstanceListItem, setInstanceListItem] = useState([]);
  const [AnnotationListItem, setAnnotationListItem] = useState([]);
  const [TagListItem, setTagListItem] = useState([]); */
  const [DeleteIDList, setDeleteIDList] = useState([]);
  const currentDeleteIDList = useRef(DeleteIDList);
  const [instance, setInstance] = useState<IProjectAnnotation>();
  const [instanceAttrList, setInstanceAttrList] = useState([]);

  const [isHDLabelingOn, setHDLabelingOn] = useState(true);
  // Todo: 오토라벨링 Active 체크 수정
  const [isAutoLabelingOn, setAutoLabelingOn] = useState(false);

  const [isDownloadOn, setIsDownloadOnOff] = useState<boolean>(false);
  const [isDownload, setDownload] = useState("");
  const [selectDownload, setSelectDownload] = useState("");

  const [resizingVal, setResizingVal] = useState<string | null>("100");
  const currentResizingVal = useRef(resizingVal);

  const [isMoveOn, setIsMoveOnOff] = useState<boolean>(false);

  const [isTagOn, setIsTagOnOff] = useState<boolean>(false);
  const isTag = useRef(isTagOn);

  const [isClassOn, setIsClassOnOff] = useState<boolean>(false);

  const [isResetOn, setIsResetOnOff] = useState<boolean>(false);

  const [isHDOn, setIsHDOnOff] = useState<boolean>(false);
  const [isODOn, setIsODOnOff] = useState<boolean>(false);
  const [isISOn, setIsISOnOff] = useState<boolean>(false);
  const [isSESOn, setIsSESOnOff] = useState<boolean>(false);

  let autoPointList = [];
  const [isBoxingOn, setIsBoxingOnOff] = useState<boolean>(false);
  const [isKeypointOn, setIsKeypointOnOff] = useState<boolean>(false);
  const [isAutoLabeling, setIsAutoLabeling] = useState<boolean>(false);

  // ! Instance 삭제 확인 팝업 노출 상태 state
  const [isDeleteInstance, setIsDeleteInstance] = useState<boolean>(false);

  const refTools = useRef<any>(undefined);
  const refTop = useRef<any>(undefined);
  const refBottom = useRef<any>(undefined);

  //const canvasDOM = document.getElementById("fCanvas");
  const canvasDOM = document.getElementsByClassName("canvas-container")[0] as HTMLElement;


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
  const toggleInstanceOpen = () => {
    setIsInstanceOpen((prev) => !prev);
    return;
  };
  const toggleHistoryOpen = () => {
    setIsHistoryOpen((prev) => !prev);
    return;
  };

  // ! call api search task then set tasks
  const searchTasks = async () => {

      await cleanTasks(trialTasks);
  };

  // ! call api HD Labeling
  const getHD = async () => {
    const url = selectedTask.imageThumbnail;
    //const url = "../../../assets/images/studio/trial/trial_" + selectedTask.taskId + ".jpg";

    const response = await fetch(url);
    const data = await response.blob();
    const metadata = { type: `image/jpeg` };
    const file = new File([data], selectedTask.imageName, metadata);

    /* const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = selectedTask.imageName + ".jpg";
    a.click(); */

    console.log(file);

    let formdata = new FormData();
    formdata.append("images", file);
    console.log(formdata);

    let headers: AxiosRequestHeaders = {
      "Content-Type": "multipart/form-data",
      withCredentials: true,
    };
    const path = "/ai/inference/batch";
    const baseUrl = "http://210.113.122.196:8838/rest/api/1";
    const requestUrl = `${baseUrl}${path}`;
    const params = {
      task_type: 1,
    }
    console.log(requestUrl);
    const res = await axios["post"](requestUrl, formdata, { headers, params }).catch(
      (err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.status === 500) {
            window.location.href = `/networkerror?statusCode=${
              err.response.status
            }&errorMsg=${err.response.data}`;
            return;
          }
        } else {
          console.log(err);
        }
      }
    ).then((res) => {
      console.log(res);
      if(res && res.status === 200) {
        const annotations = res.data.annotations;
        let oId = currentObjectId.current;
        annotations.forEach(anno => {
          let color = defaultColor;
          let coordOD = {
            left: anno.bbox[0],
            top: anno.bbox[1],
            width: anno.bbox[2],
            height: anno.bbox[3],
          };
          setPositionX(() => anno.bbox[0]);
          setPositionY(() => anno.bbox[1]);
          setInstanceWidth(() => anno.bbox[2]);
          setInstanceHeight(() => anno.bbox[3]);
          drawBoxing('HOD', coordOD, color, null, null, oId++);


          let colorIS = '#';
          for (let c = 0; c < 6; c++) {
            colorIS += Math.round(Math.random() * 0xf).toString(16);
          }
          let items = anno.segmentation;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          drawPolyItem('HIS', coordinates, "Polygon", colorIS, null, null, 2, oId++);
          drawPolyItem('HSES', coordinates, "Segmentation", color, null, null, 3, oId++);
        });
      }
    });
  };

  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: ITask[]) => {
    tasks.forEach((element) => {
      //element.imageThumbnail = imgToBase64ByCanvas(element.imageThumbnail, element.imageWidth, element.imageHeight);
    });
    setTasks(tasks);
    setHDLabelingOn(() => true);
    setAutoLabelingOn(() => true);
  };

  const imgToBase64ByCanvas = (url: string, w: number, h: number) => {
		//let image = new Image();
    const image = document.createElement('img');
    image.src = url;
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(image, 0, 0);

    const uri = canvas.toDataURL('image/jpeg', 1.0);
    return uri.replace('data:', '').replace(/^.+,/, '');
	}

  const toggleCountClassOpen = () => {
    setIsCountClassOpen((prev) => !prev);
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
    setSelectedTask(tasks[0]);
    setTimeout(() => {
      setIsFirst(false);
    }, 2500);
    // eslint-disable-next-line
  }, [tasks.length]);
  // ! dataURLHistory's first order stored when selectedTask changed.
  useEffect(() => {
    currentTask.current = selectedTask;
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
      resetTools("");
      clearDatas();
    }
    // eslint-disable-next-line
  }, [selectedTask]);

  //! Task의 ID를 받아서 해당 이미지를 getTaskData API를 호출하여 받고 그 바이너리 이미지를 base64로 변환하여 state에 저장
  const setTaskInitImage = async () => {
    if (selectedTask) {
      setSelectedTask((prev) => ({
        ...prev!,
        image: selectedTask.imageThumbnail as string,
      }));
      setCurrentDataURL(selectedTask.imageThumbnail);
    }
  };

  // ! 최초에 selectedTask가 가진 이미지는 없어야 하며 그 때 호출되는 useEffect()
  useEffect(() => {
    if (selectedTask && selectedTask.image === "") {
      setTaskInitImage();
    }
    searchTasks();
    // eslint-disable-next-line
  }, [selectedTask]);

  // ! 이미지에 새로운 이펙트가 들어가면 그때마다 order를 하나 올려서 히스토리를 저장
  useEffect(() => {
    if (selectedTask && currentDataURL) {
      canvas.off('mouse:wheel');
      setCanvasImage();
      canvasDOM.style.left = "0";
      canvasDOM.style.top = "0";
      canvas.on('mouse:wheel', handleMouseWheel);
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
      //setHotKey();
    }
    // eslint-disable-next-line
  }, [currentDataURL]);

  // ! 최초 렌더링 시 searchTasks 실행
  useEffect(() => {
    searchTasks();
    setCanvas(initCanvas());
    setGuideLine();
    // eslint-disable-next-line
  }, []);

  const setGuideLine = () => {
    const left = document.getElementById("left");
    const top = document.getElementById("top");
    const right = document.getElementById("right");
    const down = document.getElementById("down");
    document.getElementById("mainCenterUpper").addEventListener("mousemove", (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      left.style.width = mouseX - 2 + "px";
      left.style.left = 0 + 'px';
      left.style.top = mouseY + 'px';
      top.style.height = mouseY - 2 + "px";
      top.style.left = mouseX + 'px';
      top.style.top = 0 + 'px';

      right.style.width = document.body.clientWidth - mouseX - 2 + "px";
      right.style.left = mouseX + 2 + 'px';
      right.style.top = mouseY + 'px';
      down.style.height = document.body.clientHeight - mouseY - 2 + "px";
      down.style.left = mouseX + 'px';
      down.style.top = mouseY + 2 + 'px';
    });
  };

  const initCanvas = () => new fabric.Canvas("fCanvas", { selection: false });

  useEffect(() => {
    if(canvas) {
      setContext(() => canvas.getContext());
      canvas.on('mouse:down:before', handleBeforeCanvasDown);
      canvas.on('mouse:down', handleCanvasDown);
      canvas.on('mouse:move', handleCanvasMove);
      canvas.on('mouse:up', handleCanvasUp);
      canvas.on('object:moving', handleMoveObject);
      canvas.on('object:scaling', handleScaleObject);
      canvas.on('object:modified', handleModifiedObject);
      fabric.Object.prototype.setControlsVisibility({
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mb: true,
        ml: true,
        mr: true,
        mt: true,
        mtr: false,
      });
    }
  }, [canvas]);

  const setCanvasImage = async () => {
    if (currentDataURL && canvas) {
      canvas.clear();
      resetTools("");
      resetAutoTools();
      clearDatas();
      fabric.Image.fromURL(currentDataURL, (image) => {
        let width = image.width, height = image.height, ratio = 0;
        if(width && height) {
          if (width > height) {
            ratio = 810 / width;
            if (height * ratio > 540) {
              ratio = 540 / height;
            }
          } else {
            ratio = 540 / height;
            if (width * ratio > 810) {
              ratio = 810 / width;
            }
          }
          image.selectable = false;
          setimgWidth(width);
          setimgHeight(height);
          setimgRatio(ratio);
          setIImage({
            width: width,
            height: height,
            ratio: ratio,
          });
          //canvas.add(image);
          canvas.setBackgroundImage(image, () => {});
          canvas.setWidth(width * ratio);
          canvas.setHeight(height * ratio);
          //canvasWidth = width * imgRatio;
          //canvasHeight = height * imgRatio;
          canvas.setZoom(ratio);
        }
        //fc.add(image);
        //fc.renderAll();
      }, { crossOrigin: 'anonymous' });
      setCHistory(cHistory => [...cHistory, canvas.toDatalessJSON(['id', 'tool'])]);
      const hData: ICanvasHistory = {
        order: canvasHistory.length,
        data: canvas.toDatalessJSON(['id', 'tool']),
      }
      setCanvasHistory(canvasHistory => [...canvasHistory, hData]);
      setHotKey();
    }
  };

  useEffect(() => {
    currentImage.current = iImage;
  }, [iImage]);

  // ! 확대 배율 불러오는 부분 수정 필요
  useEffect(() => {
    console.log(imgRatio);
    iRatio.current = imgRatio;
  }, [imgRatio]);

  /* useEffect(() => {
    if(!canvas || !selectObject) return;
    canvas.setActiveObject(selectObject);
    canvas.renderAll();
  }, [selectObject]); */

  const setHotKey = () => {
    document.onkeydown = function (e) {
      if(selectedTask){
        console.log(e);
        let key = e.key || e.keyCode;
        if (key === 46 || key === 'Delete') {
          deleteItem('Delete');
          return false;
        }
        else if (key === 'esc') {
          resetAutoTools();
          resetTools("");
          return false;
        }
        else if (e.ctrlKey && (key === '+' || key === 107)) {
          //resizingVal + 10;
          let size = parseInt(currentResizingVal.current) + 10;
          if(size > 200) {
            size = 200;
          }
          zoomAdjustment(size.toString());
          setResizingVal(size.toString());
          return false;
        }
        else if (e.ctrlKey && (key === '-' || key === 109)) {
          //resizingVal - 10;
          let size = parseInt(currentResizingVal.current) - 10;
          if(size < 10) {
            size = 10;
          }
          zoomAdjustment(size.toString());
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

        else if(e.ctrlKey && (key === 'c' || key === 67)){
          //Todo: object copy
          handleObjectCopy();
          return false;
        }
        else if(e.ctrlKey && (key === 'v' || key === 86)){
          //Todo: object paste
          handleObjectPaste();
          return false;
        }

        else if(e.ctrlKey && e.altKey && (key === 'r' || key === 82)){
          //onSubmitReset();
          setIsResetOnOff((prev) => !prev);
          return false;
        }

        else if(e.ctrlKey && (key === 'l' || key === 76)){
          if (currentSelectedObject.current) {
            isLock(currentSelectedObject.current.id, currentSelectedObject.current.id);
          }
          return false;
        }
        else if(e.ctrlKey && (key === 'h' || key === 72)){
          if (currentSelectedObject.current) {
            isVisible(currentSelectedObject.current.id, currentSelectedObject.current.id);
          }
          return false;
        }

        // else if(e.ctrlKey && (key === 's' || key === 83)){
        //   return false;
        // }

        else if(key === 't' || key === 84){
          setIsTagOnOff((prev) => !prev);
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
        else if (!e.metaKey && (key === 82 || key === 'r')) {
          //Todo: 십자선 onoff
          setIsCrossOnOff((prev) => !prev);
          return false;
        }
        else if (key === 77 || key === 'm') {
          //Todo: 이동 onoff
          setIsMoveOnOff((prev) => !prev);
          return false;
        }
      } else {
        
      }
    };
  };

  let clipboard = null;
  let clipboardId = 0;
  const handleObjectCopy = () => {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    const object = canvas.getActiveObject();
    object.clone((cloned) => {
      clipboard = cloned;
      clipboardId = object.id;
      console.log(object);
    });
  };

  const handleObjectPaste = () => {
    // clone again, so you can do multiple copies.
    clipboard.clone((clonedObj) => {
      canvas.discardActiveObject();
      console.log(clonedObj);
      clonedObj.set({
        left: clonedObj.left + 50,
        top: clonedObj.top + 50,
        evented: true,
      });
      clonedObj.on('selected', handleSelectObject);
      clonedObj.on('deselected', handleDeSelectObject);
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj) => {
          canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
        let obj = null;
        currentObjectItem.current.forEach((element) => {
          if(element.object.id === clipboardId) {
            obj = element;
          }
        });
        const itemId = currentObjectId.current;
        clonedObj.set({
          id: itemId,
          tool: obj.object.tool,
          color: obj.object.color,
          strokeWidth: 2 * (1 / iRatio.current),
          stroke: obj.object.color,
          fill: 'transparent',
          hoverCursor: 'pointer',
          objectCaching: false,
        });
        const annotation = {
          annotation_id: null,
          annotation_type: obj.annotation.annotation_type,
          annotation_category: obj.annotation.annotation_category,
          annotation_data: [clonedObj.left, clonedObj.top, clonedObj.width, clonedObj.height],
        };
        setObjectItem(clonedObj, undefined, annotation, itemId);
        setObjectId((prev) => prev + 1);
      }
      clipboard.top += 50;
      clipboard.left += 50;
      //canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  };

  const handleMouseMove = (options) => {
    //console.log("over");
    if(!canvas) return;
    let pointer = canvas.getPointer(options);
  };

  useEffect(() => {
    currentTool.current = selectedTool;
  }, [selectedTool]);

  const handleBeforeCanvasDown = (options) => {
    if(options.target){
      if(options.target.tool){
        const regex = /[^0-9]/g;
        const result = regex.test(options.target.tool);
        if(result && options.target.selectable) return;
      }
    }
  };

  let isCanvasDown = false;
  const handleCanvasDown = (options) => {
    console.log("down");
    isCanvasDown = true;
    if(isSelectOn.current) return;
    if(options.target){
      if(options.target.tool){
        const regex = /[^0-9]/g;
        const result = regex.test(options.target.tool);
        if(result && options.target.selectable) return;
      }
    }
    switch(currentTool.current) {
      case "BBox":
        handleBoxingDown(options);
        break;
      case "Polygon":
        handlePolygonDown(options);
        break;
      case "KeyPoint":
        handleKeypointDown(options);
        break;
      case "move":
        handleMoveDown(options);
        break;
    }
  };

  const handleCanvasMove = (options) => {
    if(isCanvasDown) {
    switch(currentTool.current) {
      case "BBox":
        handleBoxingMove(options);
        break;
      case "Polygon":
        handlePolygonMove(options);
        break;
      case "KeyPoint":
        handleKeypointMove(options);
        break;
      case "move":
        handleMoveMove(options);
        break;
    }
  } else {
  }
  };

  const handleCanvasUp = (options) => {
    switch(currentTool.current) {
      case "BBox":
        handleBoxingUp(options);
        break;
      case "Polygon":
        handlePolygonUp(options);
        break;
      case "KeyPoint":
        handleKeypointUp(options);
        break;
      case "move":
        handleMoveUp(options);
        break;
    }
  };

  let isPress = false, prevPosX = 0, prevPosY = 0;
  const mainCenter = document.getElementById("mainCenterUpper");

  const handleMoveDown = (options) => {
    console.log("movemove");
    prevPosX = options.e.clientX;
    prevPosY = options.e.clientY;
    isPress = true;
  };

  const handleMoveMove = (options) => {
    if(isPress) {
      const posX = prevPosX - options.e.clientX; 
      const posY = prevPosY - options.e.clientY; 

      const limitX = (currentTask.current.imageWidth * iRatio.current * (parseInt(currentResizingVal.current) / 100)) / 2;
      const limitY = (currentTask.current.imageHeight * iRatio.current * (parseInt(currentResizingVal.current) / 100)) / 2;
    
      // left, top으로 이동
      if(posX > 0 && canvasDOM.parentElement.offsetLeft + limitX - 100 + canvasDOM.offsetLeft > 0 ||
        posX < 0 && mainCenter.clientWidth - canvasDOM.parentElement.offsetLeft - canvasDOM.offsetWidth - canvasDOM.offsetLeft + limitX + 100 > 0) {
        prevPosX = options.e.clientX;
        canvasDOM.style.left = (canvasDOM.offsetLeft - posX) + "px";
      }
      if(posY > 0 && canvasDOM.parentElement.offsetTop + limitY - 70 + canvasDOM.offsetTop > 0 ||
        posY < 0 && mainCenter.clientHeight - canvasDOM.parentElement.offsetTop - canvasDOM.offsetHeight - canvasDOM.offsetTop + limitY + 70 > 0) {
        prevPosY = options.e.clientY;
        canvasDOM.style.top = (canvasDOM.offsetTop - posY) + "px";
      }
    }
  };

  const handleMoveUp = (options) => {
    isPress = false;
  };

  const handleSelectObject = (options) => {
    if(!options.target) return;
    console.log("selcet");
    setIsSelectObjectOn(() => true);
    let object = null;
    for(let i = 0; i < ObjectListItem.length; i++) {
      if(ObjectListItem[i].object.id === options.target.id) {
        object = ObjectListItem[i].object;
        // Todo: ???
      }
    }
    for(let i = 0; i < currentObjectItem.current.length; i++) {
      if(currentObjectItem.current[i].object.id === options.target.id) {
        object = currentObjectItem.current[i].object;
        // Todo: ???
        setInstanceClass(() => currentObjectItem.current[i].annotation.annotation_category.annotation_category_name);
        setInstanceAttr(() => currentObjectItem.current[i].annotation.annotation_category.annotation_category_attributes);
      }
    }
    setSelectedObject(() => options.target);
    setObjectType(() => options.target.type);
    setSelectedObjectId(() => options.target.id);
  };

  const handleDeSelectObject = (options) => {
    if(!options.target) return;
    console.log("deselcet");
    setIsSelectObjectOn(() => false);
    setSelectedObject(() => null);
    setObjectType(() => "");
    setSelectedObjectId(() => -1);
  };

  useEffect(() => {
    isSelectOn.current = isSelectObjectOn;
  }, [isSelectObjectOn]);

  const handleMoveObject = (options) => {
    if(!options.target) return;
    if(options.target.type === "rect") {
      setInstanceWidth(() => options.target.width * options.target.scaleX);
      setInstanceHeight(() => options.target.height * options.target.scaleY);
      setPositionX(() => options.target.left);
      setPositionY(() => options.target.top);
      
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2 - item.tag.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2 - item.tag.height / 2;
          item.idTag.left = options.target.left;
          item.idTag.top = options.target.top - item.idTag.height;
          currentObjectItem.current[i].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
        }
      }
    } else if(options.target.type === "Polygon" || options.target.type === "Segmentation" || options.target.type === "Polyline") {
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2 - item.tag.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2 - item.tag.height / 2;
          item.idTag.left = options.target.left;
          item.idTag.top = options.target.top - item.idTag.height;
          const mPoints = [];
          item.object.points.forEach((pElement) => {
            mPoints.push(pElement.x + (item.object.left - item.origin.originLeft));
            mPoints.push(pElement.y + (item.object.top - item.origin.originTop));
          });
          if(mPoints.length > 0)
            item.annotation.annotation_data = mPoints;
        }
      }
    } else if (options.target.tool === "Point") {
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2 - item.tag.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2 - item.tag.height / 2;
          item.idTag.left = options.target.left;
          item.idTag.top = options.target.top - item.idTag.height;
          currentObjectItem.current[i].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
        }
      }      
    } else if (options.target.tool === "KeyPoint") {
      const p = options.target;
      const mat = p.group.calcTransformMatrix();
      p.line1 && p.line1.set({ x2: p.left + mat[4], y2: p.top + mat[5] });
      p.line2 && p.line2.set({ x2: p.left + mat[4], y2: p.top + mat[5] });
      p.line3 && p.line3.set({ x1: p.left + mat[4], y1: p.top + mat[5] });
      p.line4 && p.line4.set({ x1: p.left + mat[4], y1: p.top + mat[5] });
      p.line5 && p.line5.set({ x1: p.left + mat[4], y1: p.top + mat[5] });
      p.line6 && p.line6.set({ x1: p.left + mat[4], y1: p.top + mat[5] });

      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === p.group.id) {
          let item = currentObjectItem.current[i];
          for(let j = 0; j < item.object.getObjects().length; j++){
            if(p.id === item.object.getObjects()[j].id){
              switch(item.object.getObjects()[j].id){
                case p.group.id + "_nose":
                  item.annotation.annotation_data[0] = p.left + mat[4];
                  item.annotation.annotation_data[1] = p.top + mat[5];
                  break;
                case p.group.id + "_leye":
                  item.annotation.annotation_data[3] = p.left + mat[4];
                  item.annotation.annotation_data[4] = p.top + mat[5];
                  break;
                case p.group.id + "_reye":
                  item.annotation.annotation_data[6] = p.left + mat[4];
                  item.annotation.annotation_data[7] = p.top + mat[5];
                  break;
                case p.group.id + "_lear":
                  item.annotation.annotation_data[9] = p.left + mat[4];
                  item.annotation.annotation_data[10] = p.top + mat[5];
                  break;
                case p.group.id + "_rear":
                  item.annotation.annotation_data[12] = p.left + mat[4];
                  item.annotation.annotation_data[13] = p.top + mat[5];
                  break;
                case p.group.id + "_lshoulder":
                  item.annotation.annotation_data[15] = p.left + mat[4];
                  item.annotation.annotation_data[16] = p.top + mat[5];
                  break;
                case p.group.id + "_rshoulder":
                  item.annotation.annotation_data[18] = p.left + mat[4];
                  item.annotation.annotation_data[19] = p.top + mat[5];
                  break;
                case p.group.id + "_lelbow":
                  item.annotation.annotation_data[21] = p.left + mat[4];
                  item.annotation.annotation_data[22] = p.top + mat[5];
                  break;
                case p.group.id + "_relbow":
                  item.annotation.annotation_data[24] = p.left + mat[4];
                  item.annotation.annotation_data[25] = p.top + mat[5];
                  break;
                case p.group.id + "_lwrist":
                  item.annotation.annotation_data[27] = p.left + mat[4];
                  item.annotation.annotation_data[28] = p.top + mat[5];
                  break;
                case p.group.id + "_rwrist":
                  item.annotation.annotation_data[30] = p.left + mat[4];
                  item.annotation.annotation_data[31] = p.top + mat[5];
                  break;
                case p.group.id + "_lhip":
                  item.annotation.annotation_data[33] = p.left + mat[4];
                  item.annotation.annotation_data[34] = p.top + mat[5];
                  break;
                case p.group.id + "_rhip":
                  item.annotation.annotation_data[36] = p.left + mat[4];
                  item.annotation.annotation_data[37] = p.top + mat[5];
                  break;
                case p.group.id + "_lknee":
                  item.annotation.annotation_data[39] = p.left + mat[4];
                  item.annotation.annotation_data[40] = p.top + mat[5];
                  break;
                case p.group.id + "_rknee":
                  item.annotation.annotation_data[42] = p.left + mat[4];
                  item.annotation.annotation_data[43] = p.top + mat[5];
                  break;
                case p.group.id + "_lankle":
                  item.annotation.annotation_data[45] = p.left + mat[4];
                  item.annotation.annotation_data[46] = p.top + mat[5];
                  break;
                case p.group.id + "_rankle":
                  item.annotation.annotation_data[48] = p.left + mat[4];
                  item.annotation.annotation_data[49] = p.top + mat[5];
                  break;
              }
            }
          }
        }
      }
    } else if (options.target.tool === "Cube") {
      const p = options.target;
      const mat = p.group.calcTransformMatrix();
      p.line1 && p.line1.set({ x2: p.left + mat[4], y2: p.top + mat[5] });
      p.line2 && p.line2.set({ x2: p.left + mat[4], y2: p.top + mat[5] });
      p.line3 && p.line3.set({ x2: p.left + mat[4], y2: p.top + mat[5] });
      p.line4 && p.line4.set({ x1: p.left + mat[4], y1: p.top + mat[5] });
      p.line5 && p.line5.set({ x1: p.left + mat[4], y1: p.top + mat[5] });
      p.line6 && p.line6.set({ x1: p.left + mat[4], y1: p.top + mat[5] });

      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === p.group.id) {
          let item = currentObjectItem.current[i];
          for(let j = 0; j < item.object.getObjects().length; j++){
            if(p.id === item.object.getObjects()[j].id){
              switch(item.object.getObjects()[j].id){
                case p.group.id + "_0":
                  item.annotation.annotation_data[0] = p.left + mat[4];
                  item.annotation.annotation_data[1] = p.top + mat[5];
                  break;
                case p.group.id + "_1":
                  item.annotation.annotation_data[2] = p.left + mat[4];
                  item.annotation.annotation_data[3] = p.top + mat[5];
                  break;
                case p.group.id + "_2":
                  item.annotation.annotation_data[4] = p.left + mat[4];
                  item.annotation.annotation_data[5] = p.top + mat[5];
                  break;
                case p.group.id + "_3":
                  item.annotation.annotation_data[6] = p.left + mat[4];
                  item.annotation.annotation_data[7] = p.top + mat[5];
                  break;
                case p.group.id + "_4":
                  item.annotation.annotation_data[8] = p.left + mat[4];
                  item.annotation.annotation_data[9] = p.top + mat[5];
                  break;
                case p.group.id + "_5":
                  item.annotation.annotation_data[10] = p.left + mat[4];
                  item.annotation.annotation_data[11] = p.top + mat[5];
                  break;
                case p.group.id + "_6":
                  item.annotation.annotation_data[12] = p.left + mat[4];
                  item.annotation.annotation_data[13] = p.top + mat[5];
                  break;
                case p.group.id + "_7":
                  item.annotation.annotation_data[14] = p.left + mat[4];
                  item.annotation.annotation_data[15] = p.top + mat[5];
                  break;
              }
            }
          }
        }
      }
    }
  };

  const handleScaleObject = (options) => {
    if(!options.target) return;
    if(options.target.type === "rect") {
      let coords = {
        left: options.target.left,
        top: options.target.top,
        width: options.target.width * options.target.scaleX,
        height: options.target.height * options.target.scaleY,
      };
      setInstanceWidth(() => coords.width);
      setInstanceHeight(() => coords.height);
      setPositionX(() => coords.left);
      setPositionY(() => coords.top);
      options.target.set({
        width: coords.width,
        height: coords.height,
        scaleX: 1,
        scaleY: 1,
      });
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2 - item.tag.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2 - item.tag.height / 2;
          item.idTag.left = options.target.left;
          item.idTag.top = options.target.top - item.idTag.height;
          currentObjectItem.current[i].annotation.annotation_data = [
            coords.left,
            coords.top,
            coords.width,
            coords.height,
          ];
        }
      }
    }
    if(canvas) canvas.renderAll();
  };

  const handleModifiedObject = (options) => {
    if(options.target.type === "Polygon" || options.target.type === "Segmentation" || options.target.type === "Polyline") {
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2 - item.tag.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2 - item.tag.height / 2;
          item.idTag.left = options.target.left;
          item.idTag.top = options.target.top - item.idTag.height;
          console.log(currentObjectItem.current[i]);
        }
      }
    }
  };

  useEffect(() => {
    console.log(ObjectListItem);
    if(selectedObject) {
      setLabelHeight(() => Math.round(selectedObject.height));
      setLabelPerHeight(() => ((selectedObject.height / imgHeight * iRatio.current) * 100).toFixed(2));
      setLabelWidth(() => Math.round(selectedObject.width));
      setLabelPerWidth(() => ((selectedObject.width / imgWidth * iRatio.current) * 100).toFixed(2));
      setLabelDiag(() => Math.sqrt(Math.pow(selectedObject.width, 2) + Math.pow(selectedObject.height, 2)).toFixed(2));
      setLabelPerDiag(() => ((Math.sqrt(Math.pow(selectedObject.width, 2) + Math.pow(selectedObject.height, 2)) / Math.sqrt(Math.pow(imgWidth * iRatio.current, 2) + Math.pow(imgHeight * iRatio.current, 2))) * 100).toFixed(2));
      setLabelCoordX(() => Math.round(selectedObject.left));
      setLabelCoordY(() => Math.round(selectedObject.top));
      ObjectListItem.forEach(element => {
        if(element.object.id === selectedObject.id) {
          document.getElementById("instance" + selectedObject.id).style.background = "#CFD1D4";
        } else {
          document.getElementById("instance" + element.object.id).style.background = "transparent";
        }
      });
    } else {
      if(ObjectListItem && ObjectListItem.length > 0) {
        ObjectListItem.forEach(element => {
          if(document.getElementById("instance" + element.object.id) && document.getElementById("instance" + element.object.id).style)
            document.getElementById("instance" + element.object.id).style.background = "transparent";
        });
      }
      setLabelHeight(() => 0);
      setLabelPerHeight(() => "");
      setLabelWidth(() => 0);
      setLabelPerWidth(() => "");
      setLabelDiag(() => "");
      setLabelPerDiag(() => "");
      setLabelCoordX(() => 0);
      setLabelCoordY(() => 0);
    }
    currentSelectedObject.current = selectedObject;
  }, [selectedObject]);

  useEffect(() => {
    setLabelHeight(() => Math.round(instanceHeight));
    setLabelPerHeight(() => ((instanceHeight / imgHeight * iRatio.current) * 100).toFixed(2));
    setLabelWidth(() => Math.round(instanceWidth));
    setLabelPerWidth(() => ((instanceWidth / imgWidth * iRatio.current) * 100).toFixed(2));
    setLabelDiag(() => Math.sqrt(Math.pow(instanceWidth, 2) + Math.pow(instanceHeight, 2)).toFixed(2));
    setLabelPerDiag(() => ((Math.sqrt(Math.pow(instanceWidth, 2) + Math.pow(instanceHeight, 2)) / Math.sqrt(Math.pow(imgWidth * iRatio.current, 2) + Math.pow(imgHeight * iRatio.current, 2))) * 100).toFixed(2));
    setLabelCoordX(() => Math.round(positionX));
    setLabelCoordY(() => Math.round(positionY));
  }, [instanceWidth, instanceHeight, positionX, positionY]);


  //*************** Header function **********************/
  const format_license = [
    {
      id: 1, 
      name: "no license", 
      url: "http://"
    }, {
      id: 2, 
      name: "sslo license", 
      url: "http://sslo.ai"
    }
  ];

  // ! Download image
  const handleDownloadCoco = () => {
    if (selectedTask && currentDataURL && canvas) {
      const datas: FormatAnnotation[] = [];
      for (let i = 0; i < ObjectListItem.length; i++) {
        const isSegment = ObjectListItem[i].object.tool === "Polygon" || ObjectListItem[i].object.tool === "Segmentation" || ObjectListItem[i].object.tool === "Polyline";
        datas.push({
          id: ObjectListItem[i].object.id,
          image_id: selectedTask.taskId,
          category_id: ObjectListItem[i].annotation.annotation_category.annotation_category_id,
          bbox: [ObjectListItem[i].object.left, ObjectListItem[i].object.top, ObjectListItem[i].object.width, ObjectListItem[i].object.height],
          segmentation: isSegment? ObjectListItem[i].annotation.annotation_data : [],
          keypoint: ObjectListItem[i].object.tool === "KeyPoint"? ObjectListItem[i].annotation.annotation_data : [], 
          num_keypoints: ObjectListItem[i].object.tool === "KeyPoint"? ObjectListItem[i].annotation.annotation_data.length / 3 : 0,
          iscrowd: 0,
        });
      }
      const dateTime = new Date();
      const coco: FormatCOCO = {
        info: {
          description: "SSLO Custom Dataset", 
          url: "http://sslo.ai", 
          version: "1.0", 
          year: dateTime.getFullYear(), 
          date_created: dateTime.getFullYear() + "/" + dateTime.getMonth + 1 + "/" + dateTime.getDate,
        },
        images: [{
          id: selectedTask.taskId, 
          file_name: selectedTask.imageName, 
          height: selectedTask.imageHeight, 
          width: selectedTask.imageWidth,
          size: selectedTask.imageSize,
          created: dateTime.getMilliseconds(),
          updated: dateTime.getMilliseconds(), 
          md5: "",
        }],
        annotations: datas,
        licenses: format_license,
        categories: [{ id: 1000, name: "인간" }]
      }
      const data = JSON.stringify(coco);
      const a = document.createElement("a");
      let file = new Blob([data], { type: "text/plain" });
      a.href = URL.createObjectURL(file);
      a.download = selectedTask.imageName + ".json";
      a.click();
    }
  };

  // ! Download image
  const handleDownloadImage = (type: string) => {
    if (selectedTask && currentDataURL && canvas) {
      const a = document.createElement("a");
      //a.setAttribute("download", selectedTask.imageName);
      if (type === "image") {
        a.setAttribute("download", selectedTask.imageName + "." + selectedTask.imageFormat);
        a.setAttribute("href", currentDataURL);
      } else if (type === "label") {
        a.setAttribute("download", selectedTask.imageName + "_label" + "." + selectedTask.imageFormat);
        a.setAttribute("href", canvas.toDataURL({
          //format: 'jpeg',
          format: "image/jpeg",
          quality: 1.0,
          multiplier: 1 / imgRatio,
          }),
        );
      } else {
        //
      }
      a.click();
    }
  };
  const handleDownloadJsonSet = () => {
    if (selectedTask && currentDataURL && canvas) {
      // Todo: ProjectName, TaskName, Class 선택 기능 추가 예정
      const datas: FormatAnnotation[] = [];
      for (let i = 0; i < ObjectListItem.length; i++) {
        const isSegment = ObjectListItem[i].object.tool === "Polygon" || ObjectListItem[i].object.tool === "Segmentation" || ObjectListItem[i].object.tool === "Polyline";
        datas.push({
          id: ObjectListItem[i].object.id,
          image_id: selectedTask.taskId,
          category_id: ObjectListItem[i].annotation.annotation_category.annotation_category_id,
          bbox: [ObjectListItem[i].object.left, ObjectListItem[i].object.top, ObjectListItem[i].object.width, ObjectListItem[i].object.height],
          segmentation: isSegment? ObjectListItem[i].annotation.annotation_data : [],
          keypoint: ObjectListItem[i].object.tool === "KeyPoint"? ObjectListItem[i].annotation.annotation_data : [], 
          num_keypoints: ObjectListItem[i].object.tool === "KeyPoint"? ObjectListItem[i].annotation.annotation_data.length / 3 : 0,
          iscrowd: 0,
        });
      }
      const dateTime = new Date();
      const coco: FormatCOCO = {
        info: {
          description: "SSLO Custom Dataset", 
          url: "http://sslo.ai", 
          version: "1.0", 
          year: dateTime.getFullYear(), 
          date_created: dateTime.getFullYear() + "/" + dateTime.getMonth + 1 + "/" + dateTime.getDate,
        },
        images: [{
          id: selectedTask.taskId, 
          file_name: selectedTask.imageName, 
          height: selectedTask.imageHeight, 
          width: selectedTask.imageWidth,
          size: selectedTask.imageSize,
          created: dateTime.getMilliseconds(),
          updated: dateTime.getMilliseconds(), 
          md5: "",
        }],
        annotations: datas,
        licenses: format_license,
        categories: [{ id: 1000, name: "인간" }]
      }
      const jsonData = JSON.stringify(coco);
      const jsonFile = new Blob([jsonData], { type: "text/plain" });

      //const img = currentDataURL.split(',')[1];
      const imgFile = dataUrlToBlob(currentDataURL, selectedTask.imageName);


      const zip = new JSZIP();
      zip.file(selectedTask.imageName + ".json", jsonFile);
      zip.file(selectedTask.imageName + ".jpeg", imgFile);
      //zip.file(selectedTask.imageName + ".jpeg", img, {base64: true});

      zip.generateAsync({ type: "base64", }).then(
        function( base64 )
        {
          const a = document.createElement("a");
          a.href = 'data:application/octastream;base64,' + base64;
          a.download = selectedTask.imageName + ".zip";
          a.click();
        }
      );
    }
  };
  // ! Toggle full screen
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // ! Toggle Hot Key
  const setKeyOnOff = () => {
    setIsKeyOnOff((prev) => !prev);
  };

  const [historyPointer, setHistoryPointer] = useState(0);
  const hPointer = useRef(historyPointer);
  useEffect(() => {
    hPointer.current = historyPointer;
  }, [historyPointer]);
  // ! Undo
  const handleUnDo = () => {
    if (selectedTask) {
      if(hPointer.current <= 0) {
        setHistoryPointer(() => 0);
        return;
      }
      setHistoryPointer(() => hPointer.current - 1);
      console.log(hPointer.current);
      console.log(cHistory[hPointer.current]);
    }
  };
  // ! Redo
  const handleRedo = () => {
    if (selectedTask) {
      if(hPointer.current === cHistory.length - 1) return;
      setHistoryPointer(() => hPointer.current + 1);
    }
  };
  useEffect(() => {
    console.log(DeleteIDList);
    currentDeleteIDList.current = DeleteIDList;
  }, [DeleteIDList]);

  const isLock = (item: any, index: number) => {
    if(!canvas) return;
    for (let i = 0; i < currentObjectItem.current.length; i++) {
      let lock = false;
      if (currentObjectItem.current[i].object.id === item) {
        if(currentObjectItem.current[i].object.tool === "Cube" ||
          currentObjectItem.current[i].object.tool === "KeyPoint") {
          const elements = currentObjectItem.current[i].object.getObjects();
          for(let j=0; j<elements.length; j++) {
            elements[j].selectable = !elements[j].selectable;
            lock = elements[j].selectable;
          }
        } else {
          currentObjectItem.current[i].object.selectable =
            !currentObjectItem.current[i].object.selectable;
          lock = currentObjectItem.current[i].object.selectable;
        }
        if (!lock) {
          (document.getElementById('lockBtn' + index) as HTMLImageElement).src = iconLock;
        } else {
          (document.getElementById('lockBtn' + index) as HTMLImageElement).src = iconUnLock;
        }
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };
  const isVisible = (item: any, index: number) => {
    for (let i = 0; i < currentObjectItem.current.length; i++) {
      if (currentObjectItem.current[i].object.id === item) {
        let visible = false;
        if(currentObjectItem.current[i].object.tool === "Cube" ||
          currentObjectItem.current[i].object.tool === "KeyPoint") {
          const elements = currentObjectItem.current[i].object.getObjects();
          elements.forEach(element => {
            element.visible = !element.visible;
            element.line1 && element.line1.set({visible: element.visible});
            element.line2 && element.line2.set({visible: element.visible});
            element.line3 && element.line3.set({visible: element.visible});
            element.line4 && element.line4.set({visible: element.visible});
            element.line5 && element.line5.set({visible: element.visible});
            element.line6 && element.line6.set({visible: element.visible});
            visible = element.visible;
          });
        } else {
          currentObjectItem.current[i].object.visible = !currentObjectItem.current[i].object.visible;
          visible = currentObjectItem.current[i].object.visible;
        }
        currentObjectItem.current[i].tag.visible = visible && isTagOn;
        currentObjectItem.current[i].idTag.visible = visible;
        if (visible) {
          (document.getElementById('visibleBtn' + index) as HTMLImageElement).src = iconVisible;
        } else {
          (document.getElementById('visibleBtn' + index) as HTMLImageElement).src = iconInvisible;
        }
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
  };
  const isDelete = (index: any) => {
    for(let i = 0; i < currentObjectItem.current.length; i++) {
      if(currentObjectItem.current[i].object.id === index){
        canvas.setActiveObject(currentObjectItem.current[i].object);
        document.getElementById("instance" + index).style.background = "#CFD1D4";
        deleteItem(index);
      } else {
        document.getElementById("instance" + currentObjectItem.current[i].object.id).style.background = "transparent";
      }
    }
    /* setIsHDOnOff(() => false);
    setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false); */
  };
  
  const deleteItem = (key: any) => {
    if(!canvas) return;
    let check = /^[0-9]+$/;
    if (key === 'Delete') {
      if(currentSelectedObject.current && currentSelectedObject.current.group) {
        for (let i = 0; i < currentObjectItem.current.length; i++) {
          if (currentObjectItem.current[i].object.id === currentSelectedObject.current.group.id) {
            canvas.remove(currentObjectItem.current[i].tag)
            canvas.remove(currentObjectItem.current[i].idTag)
            canvas.remove(currentSelectedObject.current.line1);
            canvas.remove(currentSelectedObject.current.line2);
            canvas.remove(currentSelectedObject.current.line3);
            canvas.remove(currentSelectedObject.current.line4);
            canvas.remove(currentSelectedObject.current.line5);
            canvas.remove(currentSelectedObject.current.line6);
            canvas.remove(currentSelectedObject.current);

            const mat = currentSelectedObject.current.group.calcTransformMatrix();
            const data = currentObjectItem.current[i].annotation.annotation_data;
            for(let j = 0; j < data.length; j++){
              if(Math.round(data[j]) === Math.round(currentSelectedObject.current.left + mat[4]) && Math.round(data[j+1]) === Math.round(currentSelectedObject.current.top + mat[5])) {
                data[j] = null;
                data[j+1] = null;
              }
            }
            //ObjectListItem[i].object.getObjects().forEach((item) => {
            for(let k = 0; k < currentObjectItem.current[i].object.getObjects().length; k++){
              //ObjectListItem[i].object.remove(item);
              if(currentObjectItem.current[i].object.getObjects()[k].id === currentSelectedObject.current.id){
                currentObjectItem.current[i].object.getObjects()[k].left = null;
                currentObjectItem.current[i].object.getObjects()[k].top = null;
                //ObjectListItem[i].object.getObjects()[k] = null;
              }
            //});
            };
            break;
          }
        }
      } else {
        for (let i = 0; i < currentObjectItem.current.length; i++) {
          if (currentObjectItem.current[i].object.id === currentSelectedObject.current.id) { //currentSelectedObject.current.id
            if (currentObjectItem.current[i].annotation.annotation_id) {
              /* DeleteIDList.push(
                currentObjectItem.current[i].annotation.annotation_id,
              ); */
              setDeleteIDList(DeleteIDList => [...DeleteIDList, currentObjectItem.current[i].annotation.annotation_id]);
            }
            canvas.remove(currentObjectItem.current[i].tag)
            canvas.remove(currentObjectItem.current[i].idTag)
            canvas.remove(currentSelectedObject.current);
            currentObjectItem.current.splice(i, 1);
            console.log(ObjectListItem);
            console.log(currentObjectItem.current);
            for(let j=i; j<currentObjectItem.current.length; j++){
              currentObjectItem.current[j].object.id = j;
              currentObjectItem.current[j].idTag.text = "ID: " + j;
            }
            setObjectId(() => currentObjectItem.current.length);
            break;
          }
        }
      }
      //isClassSettingOn = false;
      //document.onkeydown = null;
    } else if (check.test(key)) {
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === key) {
          if (currentObjectItem.current[i].annotation.annotation_id) {
            const id = currentObjectItem.current[i].annotation.annotation_id;
            /* DeleteIDList.push(
              currentObjectItem.current[i].annotation.annotation_id,
            ); */
            setDeleteIDList(DeleteIDList => [...DeleteIDList, id]);
          }
          canvas.remove(currentObjectItem.current[i].tag)
          canvas.remove(currentObjectItem.current[i].idTag)
          if(currentObjectItem.current[i].object.tool === "KeyPoint") {
            currentObjectItem.current[i].object.getObjects().forEach((item) => {
              canvas.remove(item.line1);
              canvas.remove(item.line2);
              canvas.remove(item.line3);
              canvas.remove(item.line4);
              canvas.remove(item.line5);
              canvas.remove(item.line6);
              canvas.remove(item);
            });
          } else {
            canvas.remove(currentObjectItem.current[i].object);
          }
          currentObjectItem.current.splice(i, 1);
          console.log(ObjectListItem);
          console.log(currentObjectItem.current);
          for(let j=i; j<currentObjectItem.current.length; j++){
            currentObjectItem.current[j].object.id = j;
            currentObjectItem.current[j].idTag.text = "ID: " + j;
          }
          setObjectId(() => currentObjectItem.current.length);
          break;
        }
      }
      //_this.fCanvas.remove(_this.objSelected);
      //isClassSettingOn = false;
    }
    setIsClassOnOff(() => false);
    setSelectedObject(() => null);
    setSelectedObjectId(() => -1);
    setIsSelectObjectOn(() => false);
    setObjectType(() => "");
    setIsDeleteInstance(false);
    setLabelHeight(() => 0);
    setLabelPerHeight(() => "");
    setLabelWidth(() => 0);
    setLabelPerWidth(() => "");
    setLabelDiag(() => "");
    setLabelPerDiag(() => "");
    setLabelCoordX(() => 0);
    setLabelCoordY(() => 0);
    /* setCHistory(cHistory => [...cHistory, canvas.toDatalessJSON(['id', 'tool'])]);
    const hData: ICanvasHistory = {
      order: canvasHistory.length,
      data: canvas.toDatalessJSON(['id', 'tool']),
    }
    setCanvasHistory(canvasHistory => [...canvasHistory, hData]); */
    canvas.discardActiveObject();
    canvas.renderAll();
  }

  const [zoomVal, setzoomVal] = useState(1);
  const currentZoom = useRef(zoomVal);
  useEffect(() => {
    currentZoom.current = zoomVal;
  }, [zoomVal]);

  const handleMouseWheel = (options: any) => {
    if(canvas) {
      let delta = options.e.deltaY;
      //let zoom = canvas.getZoom();
      let zoom = currentZoom.current;
      console.log(zoom);
      zoom *= 0.999 ** delta;
      console.log(zoom);
      if (delta < 0) {
        zoom += 0.1;
      } else {
        zoom -= 0.1;
      }
      setzoomVal(() => zoom);
      if (zoom > 2) zoom = 2;
      if (zoom < 0.1) zoom = 0.1;
      let img = canvas.backgroundImage as fabric.Image;
      let width = img.width * zoom * iRatio.current;
      let height = img.height * zoom * iRatio.current;
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setZoom(zoom * iRatio.current);
      setResizingVal((zoom * 100).toString());
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  //*************** Main function **********************/

  const currentObjectId = useRef(objectId);
  useEffect(() => {
    currentObjectId.current = objectId;
    //console.log(objectId);
    //console.log(currentObjectId.current);
  }, [objectId]);

  const resetAutoTools = () => {
    setIsHDOnOff(() => false);
    setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false);
  }
  const resetTools = (tool: string) => {
    if(canvas && tool === "") {
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "crosshair";
    }
    setIsKeypointOpen(false);
    setIsMoveOnOff(() => tool === "move");
    /* setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false); */
    setIsBoxingOnOff(() => tool === "BBox");
    setIsPolygonOnOff(() => tool === "Polygon");
    setIsKeypointOnOff(() => tool === "KeyPoint");
    if(tool === "") setSelectedTool(() => "");
    if(tool !== "KeyPoint") {
      setIsKeypointPersonOn(false);
      setIsKeypointAnimalOn(false);
      setIsKeypointHandOn(false);
    }
  }
  const clearDatas = () => {
    canvas.clear();
    setObjectListItem(() => []);
    setDeleteIDList(() => []);
    setInstanceClass(() => "");
    setObjectId(() => 0);
    setObjectListItem(() => []);
    setCHistory(() => []);
    setCanvasHistory(() => []);
    setLabelHeight(() => 0);
    setLabelPerHeight(() => "");
    setLabelWidth(() => 0);
    setLabelPerWidth(() => "");
    setLabelDiag(() => "");
    setLabelPerDiag(() => "");
    setLabelCoordX(() => 0);
    setLabelCoordY(() => 0);
    setInstance(() => null);
  }
  const clearAutoLabeling = (tool: string) => {
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.tool === tool) {
        if (ObjectListItem[i].annotation.annotation_id) {
          DeleteIDList.push(
            ObjectListItem[i].annotation.annotation_id,
          );
        }
        canvas.remove(ObjectListItem[i].tag);
        canvas.remove(ObjectListItem[i].object);
        //this.ObjectListItem.splice(i, 1);
      }
    }
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.tool === tool) {
        ObjectListItem.splice(i, 1);
      }
    }
  }

  const setObjectItem = (object: fabric.Object, tagText: fabric.Text, annotation: any, iId: number) => {
    let itemId = iId;
    if(!itemId)
      itemId = currentObjectId.current;
    let optionTag = {
      //id: objectId,
      fill: '#ffffff',
      backgroundColor: annotation.annotation_category.annotation_category_color,
      fontFamily: 'Comic Sans',
      fontSize: 10 * (1 / iRatio.current),
      padding: 5,
      visible: isTag.current,
      selectable: false,
    };
    let tag = new fabric.Text(annotation.annotation_category.annotation_category_name, optionTag);
    tag.set('top', object.top + object.height / 2 - tag.height / 2);
    tag.set('left', object.left + object.width / 2 - tag.width / 2);
    canvas.add(tag);

    let optionId = {
      fill: '#ffffff',
      backgroundColor: annotation.annotation_category.annotation_category_color,
      fontFamily: 'Comic Sans',
      fontSize: 10 * (1 / iRatio.current),
      //height: 100,
      textAlign: 'center',
      /* padding: 5,
      styles: { 
        padding: 5,
      }, */
      selectable: false,
    };
    let idTag = new fabric.Text("ID: " + itemId, optionId);
    idTag.set('width', idTag.width);  // + 50);
    idTag.set('top', object.top - idTag.height);
    idTag.set('left', object.left);
    canvas.add(idTag);

    let ObjectItem = {
      idTag: idTag,
      object: object, 
      tag: tag,
      annotation: annotation,
      origin: { originLeft: object.left, originTop: object.top },
    };
    setObjectListItem(ObjectListItem => [...ObjectListItem, ObjectItem]);
    /* setCHistory(cHistory => [...cHistory, canvas.toDatalessJSON(['id', 'tool'])]);
    const hData: ICanvasHistory = {
      order: canvasHistory.length,
      data: canvas.toDatalessJSON(['id', 'tool']),
    }
    setCanvasHistory(canvasHistory => [...canvasHistory, hData]);
    console.log(canvas.toJSON(['id', 'tool']));
    console.log(canvas.toDatalessJSON(['id', 'tool'])); */
  };

  useEffect(() => {
    console.log(ObjectListItem);
    currentObjectItem.current = ObjectListItem;
    if(!ObjectListItem || ObjectListItem.length === 0) {
      setLabelHeight(() => 0);
      setLabelPerHeight(() => "");
      setLabelWidth(() => 0);
      setLabelPerWidth(() => "");
      setLabelDiag(() => "");
      setLabelPerDiag(() => "");
      setLabelCoordX(() => 0);
      setLabelCoordY(() => 0);
    } else {
      setCHistory(cHistory => [...cHistory, canvas.toDatalessJSON(['id', 'tool'])]);
      const hData: ICanvasHistory = {
        order: canvasHistory.length,
        data: canvas.toDatalessJSON(['id', 'tool']),
      }
      setCanvasHistory(canvasHistory => [...canvasHistory, hData]);
    }
  }, [ObjectListItem]);

  useEffect(() => {
    console.log(cHistory);
    setHistoryPointer(() => cHistory.length - 1);
  }, [cHistory]);

  useEffect(() => {
    console.log(canvasHistory);
  }, [canvasHistory]);

  //**! download */
  const checkIsDownload = () => {
    setIsDownloadOnOff((prev) => !prev);
  };
  const onCancelDownload = () => {
    setIsDownloadOnOff(false);
    setDownload(() => "");
    setSelectDownload(() => "");
  };
  const onSubmitDownload = () => {
    switch(isDownload) {
      case "coco":
        handleDownloadCoco();
        break;
      case "yolo":
        // Todo
        //handleDownload(false, true, "YOLO");
        break;
      case "image":
        handleDownloadImage("image");
        break;
      case "label":
        handleDownloadImage("label");
        break;
      case "json":
        // Todo: JSON + 원본 이미지 Set
        handleDownloadJsonSet();
        break;
    }
    setIsDownloadOnOff(false);
  };
  const _setDownload = (file: string) => {
    setDownload(() => file);
    let txt = "";
    switch(file) {
      case "coco":
        txt = "COCO Dataset Format";
        break;
      case "yolo":
        txt = "YOLO Dataset Format";
        break;
      case "image":
        txt = "Image";
        break;
      case "label":
        txt = "Label Image";
        break;
      case "json":
        txt = "Json + Image";
        break;
    }
    setSelectDownload(() => txt);
  };

  //**! resize  */
  const handleResizing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizingVal(e.target.value);
    zoomAdjustment(e.target.value);
  };

  useEffect(() => {
    currentResizingVal.current = resizingVal;
  }, [resizingVal]);

  const zoomAdjustment = (value: string) => {
    console.log(value);
    if(canvas) {
      let zoom = parseInt(value);
      if(zoom < 10) zoom = 10;
      //zoom *= imgRatio;
      zoom *= currentImage.current.ratio;
      let width = currentImage.current.width * (zoom / 100);
      let height = currentImage.current.height * (zoom / 100);
      console.log(width + ", " + height + ", " + currentImage.current.ratio);
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setZoom(zoom / 100);
      console.log(zoom / 100);
    }
  };

  //**! move */
  const checkIsMove = () => {
    if(currentTool.current === "move") {
      resetTools("");
    } else {
      resetTools("move");
    }
    //setIsMoveOnOff((prev) => !prev);
  };
  const onCancelMove = () => {
    setIsMoveOnOff(() => false);
  };
  useEffect(() => {
    if(canvas && isMoveOn) {
      canvas.defaultCursor = "move";
      canvas.hoverCursor = "move";
      setSelectedTool(() => "move");
    } else {
      if(canvas) {
        canvas.defaultCursor = "default";
        setSelectedTool(() => "");
      }
    }
  }, [isMoveOn]);

  //**! tag */
  const checkIsTag = () => {
    setIsTagOnOff((prev) => !prev);
  };
  useEffect(() => {
    isTag.current = isTagOn;
    if (!isTagOn) {
      /*let items = this.fCanvas.getObjects();
      for (let i = 0; i < items.length; i++) {
        this.fCanvas.remove(this.TagListItem[i]);
      }*/
      for (let i = 0; i < ObjectListItem.length; i++) {
        ObjectListItem[i].tag.visible = false;
      }
    } else {
      for (let i = 0; i < ObjectListItem.length; i++) {
        //this.fCanvas.add(this.TagListItem[i]);
        ObjectListItem[i].tag.visible = true;
      }
    }
    if(canvas)
      canvas.renderAll();
  }, [isTagOn]);

  //**! class */
  const checkIsClass = () => {
    // 클래스 팝업
    setIsClassOnOff((prev) => !prev);
  };
  const onCancelClass = () => {
    setIsClassOnOff(false);
  };

  useEffect(() => {
    if(!canvas) return;
    if(isClassOn){
      if(!selectedObject && ObjectListItem.length > 0) {
        //! useState -> 2번 동작 필요
        //setIsClass(0);
      }
    } else {
      setInstanceClass(() => "");
      setInstanceAttrList(() => []);
      canvas.discardActiveObject();
    }
  }, [isClassOn]);
  const [instanceId, setInstanceId] = useState(-1);
  const currentInstanceId = useRef(instanceId);
  useEffect(() => {
    currentInstanceId.current = instanceId;
  }, [instanceId]);
  const setIsClass = (index: number) => {
    if(currentInstanceId.current === index) {
      setIsClassOnOff((prev) => !prev);
      setInstanceId(() => -1);
      canvas.discardActiveObject();
      canvas.renderAll();
    } else {
      if(currentInstanceId.current === -1) {
        setIsClassOnOff((prev) => !prev);
      }
      const object = ObjectListItem[index].object;
      if(object) {
        setSelectedObject(() => object);
        setSelectedObjectId(() => object.id);
        const anno = ObjectListItem[index].annotation.annotation_category;
        setInstanceClass(() => anno.annotation_category_name);
        setInstanceAttr(() => anno.annotation_category_attributes);
        setInstanceId(() => index);
        canvas.setActiveObject(object);
        canvas.renderAll();
      }
    }
  };
  
  const setAnnotationClass = (item) => {
    setInstance(() => item);
    //setInstanceClass(() => item.annotation_category_name);
    if(currentSelectedObject.current){
      console.log(currentSelectedObject.current);
      currentObjectItem.current.forEach(element => {
        if(element.object.id === currentSelectedObject.current.id){
          const category = element.annotation.annotation_category;
          category.annotation_category_id = item.annotation_category_id;
          category.annotation_category_name = item.annotation_category_name;
          category.annotation_category_color = item.annotation_category_color;
          element.object.stroke = item.annotation_category_color;
          //element.object.fill = item.annotation_category_color;
          element.object.color = item.annotation_category_color;
          element.tag.text = item.annotation_category_name;
          element.tag.backgroundColor = item.annotation_category_color;
          element.tag.left =
            element.object.left + element.object.width / 2 - element.tag.width / 2;
          element.tag.top =
            element.object.top + element.object.height / 2 - element.tag.height / 2;
          element.tag.center(element.object);
          element.idTag.backgroundColor = item.annotation_category_color;
          if(element.object.type === "Segmentation")
            element.object.fill = item.annotation_category_color + "4D";
          /* const objs = canvas.getObjects();
          objs.forEach(el => {
            if(el.id === element.object.id) {
              el.color = item.annotation_category_color;
            }
          }); */
        }
      });
      canvas.renderAll();
    }
  };
  
  const [instanceClass, setInstanceClass] = useState<string>("");
  const [isEditInstanceClass, setIsEditInstanceClass] = useState<boolean>(false);
  const [textInstanceClass, setTextInstanceClass] = useState<string>();
  
  const _setIsEditInstanceClass = () => {
    setIsEditInstanceClass(() => true);
  };

  const onChangeInstanceClass = (e: any) => {
    const classTxt = e.target.value;
    if(classTxt.length > 10) {
      toast({
        title: "10글자 이하로 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setTextInstanceClass(classTxt);
  };

  const handleSetInstanceClass = () => {
    setInstanceClass(textInstanceClass);
    setTextInstanceClass("");
    setIsEditInstanceClass(() => false);
  };

  const [instanceAttr, setInstanceAttr] = useState<IAnnotationAttribute>({
    annotation_category_attr_name: "",
    annotation_category_attr_val: [],
  });
  const [isEditInstanceAttr, setIsEditInstanceAttr] = useState<boolean>(false);
  const [textInstanceAttr, setTextInstanceAttr] = useState<string>();

  useEffect(() => {
    console.log(instanceAttr);
    console.log(Boolean(instanceAttr.annotation_category_attr_name));
    console.log(instanceAttr.annotation_category_attr_name !== "");
    console.log(Boolean(instanceAttr && instanceAttr.annotation_category_attr_name && instanceAttr.annotation_category_attr_name !== ""));

    console.log(Boolean(!instanceAttr) || Boolean(!instanceAttr.annotation_category_attr_name) || instanceAttr.annotation_category_attr_name === "");
    console.log(Boolean(!instanceAttr || !instanceAttr.annotation_category_attr_name || instanceAttr.annotation_category_attr_name === ""));

  }, [instanceAttr]);

  const _setIsEditInstanceAttr = () => {
    setIsEditInstanceAttr(() => true);
  };

  const onChangeInstanceAttrName = (e: any) => {
    const attrNameTxt = e.target.value;
    if(attrNameTxt.length > 10) {
      toast({
        title: "10글자 이하로 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setTextInstanceAttr(attrNameTxt);
  };

  const handleSetInstanceAttrName = () => {
    const attr:IAnnotationAttribute = {
      annotation_category_attr_name: textInstanceAttr,
      annotation_category_attr_val: instanceAttr.annotation_category_attr_val,
    };
    setInstanceAttr(attr);
    setTextInstanceAttr("");
    setIsEditInstanceAttr(() => false);
  };

  const [textInstanceAttrVal, setTextInstanceAttrVal] = useState<string>();

  const onChangeInstanceAttrVal = (e: any) => {
    const attrNameVal = e.target.value;
    if(attrNameVal.length > 10) {
      toast({
        title: "10글자 이하로 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setTextInstanceAttrVal(attrNameVal);
  };

  const handleSetInstanceAttrVal = () => {
    const attr:IAnnotationAttribute = {
      annotation_category_attr_name: instanceAttr.annotation_category_attr_name,
      annotation_category_attr_val: [...instanceAttr.annotation_category_attr_val, textInstanceAttrVal],
    };
    setInstanceAttr(attr);
    setTextInstanceAttrVal("");
  };

  useEffect(() => {
    console.log(instanceClass);
  }, [instanceClass]);

  //**! reset */
  const checkIsReset = () => {
    setIsResetOnOff((prev) => !prev);
  };
  const onCancelReset = () => {
    setIsResetOnOff(false);
  };
  const onSubmitReset = () => {
    // Todo: 리셋 시 Instance List 초기화 구현 필요
    resetAutoTools();
    resetTools("");
    clearDatas();
    //canvas.clear();
    setCanvasImage();
    setIsResetOnOff(false);
  };

  //**! HD */
  const checkIsHD = () => {
    /* if(isAutoLabelingOn) {
      resetTools();
      setIsHDOnOff((prev) => !prev);
    } */
    setIsHDOnOff((prev) => !prev);
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isHDOn) {
      clearAutoLabeling('HOD');
      clearAutoLabeling('HIS');
      clearAutoLabeling('HSES');
      setIsISOnOff(() => false);
      setIsSESOnOff(() => false);
      getHD();
    } else if (!isHDOn) {
      clearAutoLabeling('HOD');
      clearAutoLabeling('HIS');
      clearAutoLabeling('HSES');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
    }
    setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500);
  }, [isHDOn]);

  //**! boxing */
  const checkIsBoxing = () => {
    resetTools("BBox");
    //setIsBoxingOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isBoxingOn && canvas) {
      setSelectedTool(() => "BBox");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isBoxingOn && canvas) {
    }
  }, [isBoxingOn]);
  let tempRect: fabric.Rect = null;
  const handleBoxingDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
    if(!tempRect) {
      let color = "rgba(0,0,0,0.3)";
      if(currentTool.current === "AutoPoint") {
        color = "#2EA090";
      }
      tempRect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        strokeWidth: 2 * (1 / iRatio.current),
        stroke: color,
        strokeDashArray: [5 * (1 / iRatio.current), 5 * (1 / iRatio.current)],
        fill: 'transparent',
      });
      canvas.add(tempRect);
      canvas.renderAll();
    }
    if(!isDown) isDown = true;
  };
  const handleBoxingMove = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    setDragBox(pointer.x, pointer.y);
  };
  const handleBoxingUp = (options: any) => {
    if(!canvas || isSelectOn.current || !isDown) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if (
      Math.abs(endX - startX) < 3 &&
      Math.abs(endY - startY) < 3
    ) {
      drawPoints(pointer, "BBox", "yellow", null, null, null);
      if(autoPointList.length === 2){
        isDown = false;
      }
    } else {
      setRect('BBox');
      //this.drawBoxing();
      isDown = false;
    }
  };
  const setDragBox = (nowX, nowY) => {
    let rTop, rLeft, rBottom, rRight;
    if (startX > nowX) {
      rLeft = nowX;
      rRight = startX;
    } else {
      rLeft = startX;
      rRight = nowX;
    }
    if (startY > nowY) {
      rTop = nowY;
      rBottom = startY;
    } else {
      rTop = startY;
      rBottom = nowY;
    }
    setInstanceWidth(() => rRight - rLeft);
    setInstanceHeight(() => rBottom - rTop);
    setPositionX(() => rLeft);
    setPositionY(() => rTop);

    if(tempRect)
      tempRect.set({
        left: rLeft,
        top: rTop,
        width: rRight - rLeft,
        height: rBottom - rTop,
      });
    //this.DragRectListItem.push(rect);
    canvas.renderAll();
  }
  const setRect = (tool: any) => {
    let rTop, rLeft, rBottom, rRight;
    if (startX > endX) {
      rLeft = endX;
      rRight = startX;
    } else {
      rLeft = startX;
      rRight = endX;
    }
    if (startY > endY) {
      rTop = endY;
      rBottom = startY;
    } else {
      rTop = startY;
      rBottom = endY;
    }
    setInstanceWidth(() => rRight - rLeft);
    setInstanceHeight(() => rBottom - rTop);
    setPositionX(() => rLeft);
    setPositionY(() => rTop);
    let coordinate = {
      left: rLeft,
      top: rTop,
      width: rRight - rLeft,
      height: rBottom - rTop,
    };
    //console.log(coordinate);
    drawBoxing(tool, coordinate, '#000000', null, null, null);
  }
  const drawBoxing = (tool: string, coordinate: any, color: string, aId: number, annotation: any, itemId: number) => {
    canvas.remove(tempRect);
    tempRect = null;
    if(!itemId) {
      itemId = currentObjectId.current;
    }
    console.log(iRatio.current);
    let optionRect = {
      id: itemId,
      tool: tool,
      color: color,
      left: coordinate.left,
      top: coordinate.top,
      width: coordinate.width,
      height: coordinate.height,
      strokeWidth: 2 * (1 / iRatio.current),
      //stroke: 'rgba(0,0,0,0.5)',
      stroke: color,
      //strokeOpacity: '.5',
      fill: 'transparent',
      //fill: 'rgba(0,0,0,0.3)',
      //fill: color,
      //fillOpacity: '.3',
      //strokeDashArray: [5, 5],
      hoverCursor: 'pointer',
      objectCaching: false,
    };
    let rect = new fabric.Rect(optionRect);
    rect.on('selected', handleSelectObject);
    rect.on('deselected', handleDeSelectObject);

    //setObjectListItem(ObjectListItem => [...ObjectListItem, ObjectItem]); */
    const clr = "#F379B4";
    if(annotation === null) {
      annotation = {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: 1,
        },
        annotation_category: {
          annotation_category_id: 1000,
          annotation_category_name: "인간",
          annotation_category_color: clr,
          annotation_category_attributes: [],
        },
        annotation_data: [rect.left, rect.top, rect.width, rect.height],
      };
    }
    setObjectItem(rect, undefined, annotation, itemId);
    //AnnotationListItem.push(annotation);
    //console.log(AnnotationListItem);
    //this.setDataImage();
    setObjectId((prev) => prev + 1);
    canvas.add(rect);
    //canvas.add(tag);
    canvas.renderAll();
    canvas.requestRenderAll();
  }

  //**! polygon */
  const [isPolygonOn, setIsPolygonOnOff] = useState<boolean>(false);
  const checkIsPolygon = () => {
    resetTools("Polygon");
    //setIsPolygonOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPolygonOn && canvas) {
      setSelectedTool(() => "Polygon");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isPolygonOn && canvas) {
    }
  }, [isPolygonOn]);
  const handlePolygonDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "Polygon", "#0084ff");
      } else {
        addPoint(options, "Polygon");
      }
    } else {
      toggleDrawPolygon(options, "Polygon");
    }
  };
  const handlePolygonMove = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    if (drawMode) {
      if (activeLine && activeLine.type === 'line') {
        activeLine.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        if(activeShape) {
          const points = activeShape.get('points');
          points[pointArray.length] = {
            x: pointer.x,
            y: pointer.y,
          };
          activeShape.set({
            points,
          });
        }
      }
      canvas.renderAll();
    }
  };
  const handlePolygonUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    isDragging = false;
    selection = true;
  };

  const handlePointDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
  };
  const handlePointMove = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
  };
  const handlePointUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    drawPoints(pointer, "Point", "red", null, null, null);
  };

  const drawPoints = (point: any, type: string, color: any, aId: number, annotation: any, iId: number) => {
    if(type === "Point") {
      let itemId = iId;
      if(!itemId) {
        itemId = currentObjectId.current;
      }
      let optionPoint = {
        id: itemId,
        tool: type,
        radius: 4 / iRatio.current,
        stroke: 'black',
        strokeWidth: 1 / iRatio.current,
        color: color,
        fill: color,
        //startAngle: 0,
        //endAngle: 2,
        left: point.x,
        top: point.y,
        hasBorders: false,
        hasControls: false,
        cornerSize: 5 / iRatio.current,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'pointer',
        selectable: true,
      };
      let boxingPoint = new fabric.Circle(optionPoint);
      boxingPoint.on('selected', handleSelectObject);
      boxingPoint.on('deselected', handleDeSelectObject);
      canvas.add(boxingPoint);
      const clr = "#F379B4";
      if(annotation === null) {
        annotation = {
          annotation_id: aId,
          annotation_type: {
            annotation_type_id: 5,
          },
          annotation_category: {
            annotation_category_id: 1000,
            annotation_category_name: "인간",
            annotation_category_color: clr,
            annotation_category_attributes: [],
          },
          annotation_data: [point.x, point.y],
        };
      }
      //setAnnotationListItem(AnnotationListItem => [...AnnotationListItem, annotation]);
      setObjectItem(boxingPoint, undefined, annotation, itemId);
      setObjectId((prev) => prev + 1);
      canvas.renderAll();
    } else {
      let optionAutopoint = {
        //id: currentObjectId.current,
        tool: type,
        radius: 5 / iRatio.current,
        stroke: 'black',
        strokeWidth: 1 / iRatio.current,
        color: '#999999',
        fill: '#ffcc00',
        //startAngle: 0,
        //endAngle: 2,
        left: point.x,
        top: point.y,
        hasBorders: false,
        hasControls: false,
        cornerSize: 5 / iRatio.current,
        originX: 'center',
        originY: 'center',
        hoverCursor: 'pointer',
        selectable: true,
      };
      let autoPoint = new fabric.Circle(optionAutopoint);
      autoPointList.push(autoPoint);
      canvas.add(autoPoint);
      if(type !== "Cube") {
        if (autoPointList.length === 2) {
          isDown = false;
          let ePoint = autoPointList.pop();
          let sPoint = autoPointList.pop();
          startX = sPoint.left;
          startY = sPoint.top;
          endX = ePoint.left;
          endY = ePoint.top;
          //console.log(ePoint);
          //console.log(sPoint);
          canvas.remove(ePoint);
          canvas.remove(sPoint);
          setRect(type);
        }
      }
    } 
  }

  //**! keypoint */
  const [keypointType, setKeypointType] = useState<number>(1);
  const currentKeypointType = useRef(keypointType);
  const [isKeypointOpen, setIsKeypointOpen] = useState<boolean>(false);
  const [alertKeypointOpen, setAlertKeypointOpen] = useState<boolean>(false);
  const openIsKeypoint = () => {
    setIsKeypointOpen((prev) => !prev);
  }
  const closeIsKeypoint = () => {
    setIsKeypointOpen(false);
    setAlertKeypointOpen(false);
  }
  const openAlertKeypoint = () => {
    setAlertKeypointOpen(true);
  }
  const checkIsKeypoint = () => {
    resetTools("KeyPoint");
    //setIsKeypointOnOff((prev) => !prev);
  };
  const onCancelKeypoint = () => {
    setIsKeypointOnOff(false);
  };
  useEffect(() => {
    if(isKeypointOn && canvas) {
      setSelectedTool(() => "KeyPoint");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isKeypointOn && canvas) {
    }
  }, [isKeypointOn]);

  const [isKeypointPersonOn, setIsKeypointPersonOn] = useState<boolean>(false);
  const [isKeypointAnimalOn, setIsKeypointAnimalOn] = useState<boolean>(false);
  const [isKeypointHandOn, setIsKeypointHandOn] = useState<boolean>(false);

  const setIsKeypoint = (tool: string) => {
    if(tool === "person") {
      setIsKeypointPersonOn(true);
      setIsKeypointAnimalOn(false);
      setIsKeypointHandOn(false);
      setKeypointType(() => 1);
    } else if (tool === "animal") {
      setIsKeypointAnimalOn(true);
      setIsKeypointPersonOn(false);
      setIsKeypointHandOn(false);
      setKeypointType(() => 2);
    } else if (tool === "hand") {
      setIsKeypointHandOn(true);
      setIsKeypointPersonOn(false);
      setIsKeypointAnimalOn(false);
      setKeypointType(() => 3);
    }
    checkIsKeypoint();
    closeIsKeypoint();
  }
  useEffect(() => {
    currentKeypointType.current = keypointType;
  }, [keypointType]);

  const handleKeypointDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    //if(options.e.ctrlKey){
      let pointer = canvas.getPointer(options);
      startX = pointer.x;
      startY = pointer.y;
      tempRect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        strokeWidth: 2 * (1 / iRatio.current),
        stroke: 'rgba(0,0,0,0.3)',
        strokeDashArray: [5 * (1 / iRatio.current), 5 * (1 / iRatio.current)],
        fill: 'transparent',
      });
      canvas.add(tempRect);
      isDown = true;
    //}
  };
  const handleKeypointMove = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    setDragBox(pointer.x, pointer.y);
  };
  const handleKeypointUp = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if (
      Math.abs(endX - startX) > 1 &&
      Math.abs(endY - startY) > 1
    ) {
      switch(currentKeypointType.current) {
        case 1:
          drawKeypoint(null, null, null, null);
          break;
        case 2:
          break;
        case 3:
          break;
      }
    }
    isDown = false;
  };

  const drawKeypoint = (aId: number, annotation: any, iId: number, data: any) => {
    canvas.remove(tempRect);
    let itemId = iId;
    if(!itemId) {
      itemId = currentObjectId.current;
    }

    if(!data) {
      let left = startX,
      top = startY,
      right = endX,
      bottom = endY,
      width = endX - startX,
      height = endY - startY,
      centerX = startX + width / 2,
      centerY = startY + height / 2;
    if (endX < startX) {
      left = endX;
      right = startX;
      width = startX - endX;
      centerX = endX + width / 2;
    }
    if (endY < startY) {
      top = endY;
      bottom = startY;
      height = startY - endY;
      centerY = + height / 2;
    }

    const cData =
      [
        //key: "nose",
        centerX,
        top + (centerY - top) * 0.1,
        2,
        //leye
        centerX - (centerX - left) * 0.1,
        top,
        2, 
        //reye
        centerX + (right - centerX) * 0.1,
        top,
        2,
        //lear
        centerX - (centerX - left) * 0.2,
        top + (centerY - top) * 0.05,
        2,
        //rear
        centerX + (right - centerX) * 0.2,
        top + (centerY - top) * 0.05,
        2,
        //key: "lshoulder",
        centerX - (centerX - left) * 0.5,
        top + (centerY - top) * 0.3,
        2,
        //key: "rshoulder",
        centerX + (right - centerX) * 0.5,
        top + (centerY - top) * 0.3,
        2,
        //key: "lelbow",
        centerX - (centerX - left) * 0.7,
        top + (centerY - top) * 0.7,
        2,
        //key: "relbow",
        centerX + (right - centerX) * 0.7,
        top + (centerY - top) * 0.7,
        2,
        //key: "lwrist",
        centerX - (centerX - left) * 0.5,
        centerY,
        2,
        //key: "rwrist",
        centerX + (right - centerX) * 0.5,
        centerY,
        2,
        //key: "lhip",
        centerX - (centerX - left) * 0.2,
        centerY,
        2,
        //key: "rhip",
        centerX + (right - centerX) * 0.2,
        centerY,
        2,
        //key: "lknee",
        centerX - (centerX - left) * 0.3,
        centerY + (bottom - centerY) * 0.5,
        2,
        //key: "rknee",
        centerX + (right - centerX) * 0.3,
        centerY + (bottom - centerY) * 0.5,
        2,
        //key: "lankle",
        centerX - (centerX - left) * 0.3,
        bottom,
        2,
        //key: "rankle",
        centerX + (right - centerX) * 0.3,
        bottom,
        2,
      ];
      data = cData;
    }

    let nosePoint = makeCircle("KeyPoint", itemId + "_nose", imgRatio, data[0], data[1]),
      leyePoint = makeCircle("KeyPoint", itemId + "_leye", imgRatio, data[3], data[4]),
      reyePoint = makeCircle("KeyPoint", itemId + "_reye", imgRatio, data[6], data[7]),
      learPoint = makeCircle("KeyPoint", itemId + "_lear", imgRatio, data[9], data[10]),
      rearPoint = makeCircle("KeyPoint", itemId + "_rear", imgRatio, data[12], data[13]),
      lshoulderPoint = makeCircle("KeyPoint", itemId + "_lshoulder", imgRatio, data[15], data[16]),
      rshoulderPoint = makeCircle("KeyPoint", itemId + "_rshoulder", imgRatio, data[18], data[19]),
      lelbowPoint = makeCircle("KeyPoint", itemId + "_lelbow", imgRatio, data[21], data[22]),
      relbowPoint = makeCircle("KeyPoint", itemId + "_relbow", imgRatio, data[24], data[25]),
      lwristPoint = makeCircle("KeyPoint", itemId + "_lwrist", imgRatio, data[27], data[28]),
      rwristPoint = makeCircle("KeyPoint", itemId + "_rwrist", imgRatio, data[30], data[31]),
      lhipPoint = makeCircle("KeyPoint", itemId + "_lhip", imgRatio, data[33], data[34]),
      rhipPoint = makeCircle("KeyPoint", itemId + "_rhip", imgRatio, data[36], data[37]),
      lkneePoint = makeCircle("KeyPoint", itemId + "_lknee", imgRatio, data[39], data[40]),
      rkneePoint = makeCircle("KeyPoint", itemId + "_rknee", imgRatio, data[42], data[43]),
      lanklePoint = makeCircle("KeyPoint", itemId + "_lankle", imgRatio, data[45], data[46]),
      ranklePoint = makeCircle("KeyPoint", itemId + "_rankle", imgRatio, data[48], data[49]);

    let nlyLine = makeLine("KeyPoint", [data[0], data[1], data[3], data[4]]),
      nryLine = makeLine("KeyPoint", [data[0], data[1], data[6], data[7]]),
      lyryLine = makeLine("KeyPoint", [data[3], data[4], data[6], data[7]]),
      lylrLine = makeLine("KeyPoint", [data[3], data[4], data[9], data[10]]),
      ryrrLine = makeLine("KeyPoint", [data[6], data[7], data[12], data[13]]),
      lrlsLine = makeLine("KeyPoint", [data[9], data[10], data[15], data[16]]),
      rrrsLine = makeLine("KeyPoint", [data[12], data[13], data[18], data[19]]),
      lsrsLine = makeLine("KeyPoint", [data[15], data[16], data[18], data[19]]),
      lsleLine = makeLine("KeyPoint", [data[15], data[16], data[21], data[22]]),
      rsreLine = makeLine("KeyPoint", [data[18], data[19], data[24], data[25]]),
      lelwLine = makeLine("KeyPoint", [data[21], data[22], data[27], data[28]]),
      rerwLine = makeLine("KeyPoint", [data[24], data[25], data[30], data[31]]),
      lslhLine = makeLine("KeyPoint", [data[15], data[16], data[33], data[34]]),
      rsrhLine = makeLine("KeyPoint", [data[18], data[19], data[36], data[37]]),
      lhrhLine = makeLine("KeyPoint", [data[33], data[34], data[36], data[37]]),
      lhlkLine = makeLine("KeyPoint", [data[33], data[34], data[39], data[40]]),
      rhrkLine = makeLine("KeyPoint", [data[36], data[37], data[42], data[43]]),
      lklaLine = makeLine("KeyPoint", [data[39], data[40], data[45], data[46]]),
      rkraLine = makeLine("KeyPoint", [data[42], data[43], data[48], data[49]]);

    nosePoint ? setLine(nosePoint, null, null, nlyLine, nryLine) : null;
    leyePoint ? setLine(leyePoint, nlyLine, null, lyryLine, lylrLine) : null;
    reyePoint ? setLine(reyePoint, nryLine, lyryLine, ryrrLine) : null;
    learPoint ? setLine(learPoint, lylrLine, null, lrlsLine) : null;
    rearPoint ? setLine(rearPoint, ryrrLine, null, rrrsLine) : null;
    lshoulderPoint ? setLine(lshoulderPoint, lrlsLine, null, lsrsLine, lsleLine, lslhLine) : null;
    rshoulderPoint ? setLine(rshoulderPoint, rrrsLine, lsrsLine, rsreLine, rsrhLine) : null;
    lelbowPoint ? setLine(lelbowPoint, lsleLine, null, lelwLine) : null;
    relbowPoint ? setLine(relbowPoint, rsreLine, null, rerwLine) : null;
    lwristPoint ? setLine(lwristPoint, lelwLine, null) : null;
    rwristPoint ? setLine(rwristPoint, rerwLine, null) : null;
    lhipPoint ? setLine(lhipPoint, lslhLine, null, lhrhLine, lhlkLine) : null;
    rhipPoint ? setLine(rhipPoint, rsrhLine, lhrhLine, rhrkLine) : null;
    lkneePoint ? setLine(lkneePoint, lhlkLine, null, lklaLine) : null;
    rkneePoint ? setLine(rkneePoint, rhrkLine, null, rkraLine) : null;
    lanklePoint ? setLine(lanklePoint, lklaLine, null) : null;
    ranklePoint ? setLine(ranklePoint, rkraLine, null) : null;

    let points = [];
    nosePoint ? points.push(nosePoint) : null;
    leyePoint ? points.push(leyePoint) : null;
    reyePoint ? points.push(reyePoint) : null;
    learPoint ? points.push(learPoint) : null;
    rearPoint ? points.push(rearPoint) : null;
    lshoulderPoint ? points.push(lshoulderPoint) : null;
    rshoulderPoint ? points.push(rshoulderPoint) : null;
    lelbowPoint ? points.push(lelbowPoint) : null;
    relbowPoint ? points.push(relbowPoint) : null;
    lwristPoint ? points.push(lwristPoint) : null;
    rwristPoint ? points.push(rwristPoint) : null;
    lhipPoint ? points.push(lhipPoint) : null;
    rhipPoint ? points.push(rhipPoint) : null;
    lkneePoint ? points.push(lkneePoint) : null;
    rkneePoint ? points.push(rkneePoint) : null;
    lanklePoint ? points.push(lanklePoint) : null;
    ranklePoint ? points.push(ranklePoint) : null;

    let lines = [];
    nlyLine ? lines.push(nlyLine) : null;
    nryLine ? lines.push(nryLine) : null;
    lyryLine ? lines.push(lyryLine) : null;
    lylrLine ? lines.push(lylrLine) : null;
    ryrrLine ? lines.push(ryrrLine) : null;
    lrlsLine ? lines.push(lrlsLine) : null;
    rrrsLine ? lines.push(rrrsLine) : null;
    lsrsLine ? lines.push(lsrsLine) : null;
    lsleLine ? lines.push(lsleLine) : null;
    rsreLine ? lines.push(rsreLine) : null;
    lelwLine ? lines.push(lelwLine) : null;
    rerwLine ? lines.push(rerwLine) : null;
    lslhLine ? lines.push(lslhLine) : null;
    rsrhLine ? lines.push(rsrhLine) : null;
    lhrhLine ? lines.push(lhrhLine) : null;
    lhlkLine ? lines.push(lhlkLine) : null;
    rhrkLine ? lines.push(rhrkLine) : null;
    lklaLine ? lines.push(lklaLine) : null;
    rkraLine ? lines.push(rkraLine) : null;

    lines.forEach((item) => {canvas.add(item);});
    points.forEach((item) => {canvas.add(item);});

    const clr = "#F379B4";
    let optionPoint = {
      id: itemId,
      tool: "KeyPoint",
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      hoverCursor: 'pointer',
      // selectable: false,
    };
    let optionLine = {
      id: itemId,
      hasBorders: false,
      hasControls: false,
      selectable: false,
    };

    const keyPoints = new fabric.Group(points, optionPoint);
    const keyPointLines = new fabric.Group(lines, optionLine);
    if (annotation === null) {
      annotation = {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: 5,
        },
        annotation_category: {
          annotation_category_id: 1000,
          annotation_category_name: "인간",
          annotation_category_color: clr,
          annotation_category_attributes: [],
        },
        annotation_data: data,
      };
    }
    setObjectItem(keyPoints, undefined, annotation, itemId);
    setObjectId((prev) => prev + 1);
    canvas.renderAll();
  };

  //**! polygon module */
  const toggleDrawPolygon = (options, type: string) => {
    if(!canvas) return;
    if (drawMode) {
      // stop draw mode
      activeLine = null;
      activeShape = null;
      lineArray = [];
      pointArray = [];
      //canvas.selection = true;
      //drawMode = false;
    } else {
      // start draw mode
      canvas.selection = false;
      drawMode = true;
      if(options)
        addPoint(options, type);
    }
  };

  const drawPolyItem = (tool: any, coordinate: any, type: any, color: any, aId: any, annotation: any, type_id: any, itemId: number) => {
    if(!canvas) return;
    canvas.remove(tempRect);
    tempRect = null;
    if(!itemId) {
      itemId = currentObjectId.current;
    }
    let fill = 'transparent';
    if(type === "Segmentation") {
      fill = color + "4D";
    }
    let option = {
      id: itemId,
      tool: tool,
      type: type,
      color: color,
      fill: fill,
      selectable: true,
      strokeWidth: 2 * (1 / iRatio.current),
      //strokeLinejoin: 'round',
      //stroke: 'rgba(0,0,0,0.5)',
      stroke: color,
      objectCaching: false,
      edit: true,
      hoverCursor: 'pointer',
      hasBorders: false,
      //hasControls: false,
    };
    let polyItem = new fabric.Polygon(coordinate, option);
    if (type === "Polyline") {
      polyItem = new fabric.Polyline(coordinate, option);
    }
    canvas.add(polyItem);
    polyItem.on('selected', handleSelectObject);
    polyItem.on('deselected', handleDeSelectObject);
    let cData = [];
    if(coordinate){
      for (let i = 0; i < coordinate.length; i++) {
        cData.push(coordinate[i].x);
        cData.push(coordinate[i].y);
      }
    }
    const clr = "#F379B4";
    if (annotation === null) {
      annotation = {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: type_id,
          annotation_type_name: type,
        },
        annotation_category: {
          annotation_category_id: 1000,
          annotation_category_name: "인간",
          annotation_category_color: clr,
          annotation_category_attributes: [],
        },
        annotation_data: cData,
      };
    }
    setObjectItem(polyItem, undefined, annotation, itemId);
    if (type === "Polygon" || type === "Segmentation" || type === "Polyline") {
      editPolygon(polyItem);
    }
    setObjectId((prev) => prev + 1);
    canvas.renderAll();
  };
  const addPoint = (options: any, type: string) => {
    if(!canvas) return;
    let pointer = canvas.getPointer(options);
    const pointOption = {
      id: new Date().getTime(),
      radius: 5 * (1 / iRatio.current),
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 0.5,
      left: pointer.x,
      top: pointer.y,
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      objectCaching: false,
    };
    const point = new fabric.Circle(pointOption);

    if (pointArray.length === 0) {
      // fill first point with red color
      /*point.set({
        fill: 'red',
      });*/
      point.fill = 'red';
    }

    const linePoints = [pointer.x, pointer.y, pointer.x, pointer.y];
    const lineOption = {
      strokeWidth: 2,
      fill: 'transparent',
      stroke: '#999999',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false,
    };
    const line = new fabric.Line(linePoints, lineOption);
    //line.class = 'line';
    if(type !== "Polyline") {
      if (activeShape) {
        const pos = canvas.getPointer(options.e);
        const points = activeShape.get('points');
        points.push({
          x: pos.x,
          y: pos.y,
        });
        const polygon = new fabric.Polygon(points, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        canvas.remove(activeShape);
        canvas.add(polygon);
        activeShape = polygon;
        canvas.renderAll();
      } else {
        const polyPoint = [
          {
            x: pointer.x,
            y: pointer.y,
          },
        ];
        const polygon = new fabric.Polygon(polyPoint, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        activeShape = polygon;
        canvas.add(polygon);
      }
    }
    activeLine = line;
    pointArray.push(point);
    lineArray.push(line);

    canvas.add(line);
    canvas.add(point);
    //console.log(canvas);
  };
  const generatePolygon = (pointArray: any, type: string, color: string) => {
    if(!canvas) return;
    const points = [];
    // collect points and remove them from canvas
    for (const point of pointArray) {
      points.push({
        x: point.left,
        y: point.top,
      });
      canvas.remove(point);
    }

    // remove lines from canvas
    for (const line of lineArray) {
      canvas.remove(line);
    }

    // remove selected Shape and Line
    canvas.remove(activeShape).remove(activeLine);

    let typeId = 2;
    if(type ==="Segmentation") {
      typeId = 3;
    } else if(type ==="Polyline") {
      typeId = 4;
    }

    drawPolyItem(type, points, type, color, null, null, typeId, null);
    toggleDrawPolygon(null, "");
  };
  /**
   * define a function that can locate the controls.
   * this function will be used both for drawing and for interaction.
   */
  function polygonPositionHandler(dim: any, finalMatrix: any, fabricObject: any) {
    let x =
        fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    return fabric.util.transformPoint(
      //{ x: x, y: y },
      new fabric.Point(x, y),
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix(),
      ),
    );
  };
  /**
   * define a function that will define what the control does
   * this function will be called on every mouse move after a control has been
   * clicked and is being dragged.
   * The function receive as argument the mouse event, the current trasnform object
   * and the current position in canvas coordinate
   * transform.target is a reference to the current object being transformed,
   */
  function actionHandler (eventData: any, transform: any, x: any, y: any) {
    let polygon = transform.target,
      currentControl = polygon.controls[polygon.__corner],
      mouseLocalPosition = polygon.toLocalPoint(
        new fabric.Point(x, y),
        'center',
        'center',
      ),
      polygonBaseSize = polygon._getNonTransformedDimensions(),
      size = polygon._getTransformedDimensions(0, 0);
    polygon.points[currentControl.pointIndex] = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    };
    return true;
  };
  /**
   * define a function that can keep the polygon in the same position when we change its
   * width/height/top/left.
   */
  function anchorWrapper (anchorIndex: any, fn: any) {
    return function (eventData: any, transform: any, x: any, y: any) {
      let fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
            type: "",
            add: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            addEquals: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarAdd: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarAddEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            subtract: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            subtractEquals: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarSubtract: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            scalarSubtractEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            multiply: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            multiplyEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            divide: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            divideEquals: function (scalar: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            eq: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            lt: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            lte: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            gt: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            gte: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            lerp: function (that: fabric.IPoint, t: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            distanceFrom: function (that: fabric.IPoint): number {
              throw new Error("Function not implemented.");
            },
            midPointFrom: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            min: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            max: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setXY: function (x: number, y: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setX: function (x: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setY: function (y: number): fabric.Point {
              throw new Error("Function not implemented.");
            },
            setFromPoint: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            swap: function (that: fabric.IPoint): fabric.Point {
              throw new Error("Function not implemented.");
            },
            clone: function (): fabric.Point {
              throw new Error("Function not implemented.");
            }
          },
          fabricObject.calcTransformMatrix(),
        ),
        actionPerformed = fn(eventData, transform, x, y),
        // eslint-disable-next-line no-unused-vars
        newDim = fabricObject._setPositionDimensions({}),
        polygonBaseSize = fabricObject._getNonTransformedDimensions(),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  };
  const editPolygon = (object: any) => {
    if(!canvas) return;
    let activeObject = object;
    if (object === null || object === undefined) {
      activeObject = canvas.getActiveObject();
    }
    if (!activeObject) {
      activeObject = canvas.getObjects()[0];
      canvas.setActiveObject(activeObject);
    }

    activeObject.edit = true;
    activeObject.objectCaching = false;

    const lastControl = activeObject.points.length - 1;
    activeObject.cornerStyle = 'circle';
    activeObject.controls = activeObject.points.reduce(
      (acc: any, point: any, index: number) => {
        acc['p' + index] = new fabric.Control({
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(
            index > 0 ? index - 1 : lastControl,
            actionHandler,
          ),
          actionName: 'modifyPolygon',
          pointIndex: index,
          x: point.x,
          y: point.y,
        });
        //console.log(index);
        return acc;
      },
      {},
    );
    activeObject.hasBorders = false;
    canvas.requestRenderAll();
  };

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
  
  // ! MainCenterBottom의 file select state
  const makeCircle = (tool: string, oId: any, ratio: number, left: number, top: number) => {
    if(!left || !top) return null;
    const isBorder = tool === "Cube" ? false : true;
    let optionCircle = {
      id: oId,
      tool: tool,
      left: left,
      top: top,
      strokeWidth: 2 / ratio,
      radius: 4 / ratio,
      fill: '#fff',
      stroke: '#666',
      originX: 'center',
      originY: 'center',
      hoverCursor: 'pointer',
      line1: '',
      line2: '',
      line3: '',
      line4: '',
      line5: '',
      line6: '',
      hasControls: false,
      hasBorders: isBorder,
    };
    let c = new fabric.Circle(optionCircle);
    c.setControlsVisibility({
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mb: false,
      ml: false,
      mr: false,
      mt: false,
      mtr: false,
    });
    //c.hasControls = c.hasBorders = false;
    c.on('selected', handleSelectObject);
    c.on('deselected', handleDeSelectObject);
    return c;
  };
  const setLine = (c: any, line1: any, line2: any, line3?: any, line4?: any, line5?: any, line6?: any) => {
    if(!c) return;
    let optionCircle = {
      line1: line1,
      line2: line2,
      line3: line3,
      line4: line4,
      line5: line5,
      line6: line6,
    };
    c.set(optionCircle);
  };
  const makeLine = (tool: string, coords: Array<number>) => {
    if(!coords || !coords[0] || !coords[1] || !coords[2] || !coords[3]) return null;
    let optionLine = {
      tool: tool,
      fill: 'red',
      stroke: 'red',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    };
    return new fabric.Line(coords, optionLine);
  };

  useLayoutEffect(() => {
    if(!refTools) return;
    const { current } = refTools;
    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;
      if (hasOverflow) {
        document.getElementById("arrowToolsTop").style.display = "flex";
        document.getElementById("arrowToolsBottom").style.display = "flex";
      } else {
        document.getElementById("arrowToolsTop")?document.getElementById("arrowToolsTop").style.display = "none":null;
        document.getElementById("arrowToolsBottom")?document.getElementById("arrowToolsBottom").style.display = "none":null;
      }
    };
    if (current) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(trigger).observe(current);
      }
      trigger();
    }
  }, [refTools, refTools.current, refTools.current?.scrollHeight, refTools.current?.clientHeight]);

  const onMoveToToolsTop = () => {
    refTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onMoveToToolsEnd = () => {
    refBottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  let imgIndexLeft = 0, imgIndexRight = 5;

  const refPicker = useRef<any>(undefined);

  // ! 해상도 체크 동작 확인 필요
  useLayoutEffect(() => {
    if(!refPicker) return;
    const { current } = refPicker;
    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;
      //console.log(current.scrollWidth + " : " + current.clientWidth);
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
    if(picker)
      picker.addEventListener("scroll", handlePickerScroll);
  }, [refPicker, refPicker.current, refPicker.current?.scrollWidth, refPicker.current?.clientWidth, tasks]);

  const handlePickerScroll = () => {
    let scrollLocation = refPicker.current.scrollLeft; // 현재 스크롤바 위치
	  let fullWidth = refPicker.current.scrollWidth; // 전체 길이
    let clientWidth = refPicker.current.clientWidth; // 보이는 길이

    let boundary = refPicker.current.scrollWidth / tasks.length;
    
    imgIndexLeft = Math.round(scrollLocation / boundary);
    imgIndexRight = imgIndexLeft + 5;

    console.log(imgIndexLeft + " : " + imgIndexRight);

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
    if(imgIndexLeft < 5){
      imgIndexLeft = 0; 
      imgIndexRight = 5;
    } else {
      imgIndexLeft -= 5;
      imgIndexRight -= 5; 
    }
    let left = document.getElementById("img"+imgIndexLeft);
    left.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const onMoveToToolsRight = () => {
    if(imgIndexRight > tasks.length - 5){
      imgIndexLeft = tasks.length - 6; 
      imgIndexRight = tasks.length - 1;
    } else {
      imgIndexLeft += 5;
      imgIndexRight += 5; 
    }
    let right = document.getElementById("img"+imgIndexRight);
    right.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const setInstanceIcon = (tool: string) => {
    let icon = iconDefault;
    switch(tool) {
      case "HOD":
        icon = iconOD;
        break;
      case "OD":
        icon = iconOD;
        break;
      case "IS":
        icon = iconIS;
        break;
      case "HIS":
        icon = iconIS;
        break;
      case "SES":
        icon = iconSES;
        break;
      case "HSES":
        icon = iconSES;
        break;
      case "BBox":
        icon = iconBoxing;
        break;
      case "Polygon":
        icon = iconPolygon;
        break;
      case "KeyPoint":
        icon = iconKeypoint;
        break;
    }
    return icon;
  };

  const refBtnLock = useRef<any>(undefined);
  const refBtnVisible = useRef<any>(undefined);
  const refBtnDelete = useRef<any>(undefined);

  const checkIsDeleteInstance = () => {
    setIsDeleteInstance((prev) => !prev);
  };

  const onCancelDelete = () => {
    setIsDeleteInstance(false);
  };

  return (
    <TrialPresenter
      currentDataURL={currentDataURL}
      projectInfo={projectInfo}
      tasks={tasks}
      isFileSelectorOpen={isFileSelectorOpen}
      isFileInfoOpen={isFileInfoOpen}
      selectedTask={selectedTask}
      loading={loading}
      isFirst={isFirst}
      resizingVal={resizingVal}
      toggleFileSelector={toggleFileSelector}
      toggleFileInfoOpen={toggleFileInfoOpen}
      _setSelectedTask={_setSelectedTask}
      handlePrevTask={handlePrevTask}
      handleNextTask={handleNextTask}
      onCancelMove={onCancelMove}
      onCancelClass={onCancelClass}
      onCancelReset={onCancelReset}
      onSubmitReset={onSubmitReset}
      onCancelKeypoint={onCancelKeypoint}
      handleResizing={handleResizing}
      onOriginalImage={onOriginalImage}
      handleToggleFullScreen={handleToggleFullScreen}
      handleUnDo={handleUnDo}
      handleRedo={handleRedo}
      goBack={goBack}
      isMoveOn={isMoveOn}
      isTagOn={isTagOn}
      isClassOn={isClassOn}
      isResetOn={isResetOn}
      isHDOn={isHDOn}
      isBoxingOn={isBoxingOn}
      isPolygonOn={isPolygonOn}
      isKeypointOn={isKeypointOn}
      isInstanceOpen={isInstanceOpen}
      isHistoryOpen={isHistoryOpen}
      toggleInstanceOpen={toggleInstanceOpen}
      toggleHistoryOpen={toggleHistoryOpen}
      checkIsMove={checkIsMove}
      checkIsTag={checkIsTag}
      checkIsClass={checkIsClass}
      checkIsReset={checkIsReset}
      checkIsHD={checkIsHD}
      checkIsBoxing={checkIsBoxing}
      checkIsPolygon={checkIsPolygon}
      checkIsKeypoint={checkIsKeypoint}
      canvas={canvas}
      _setDownload={_setDownload}
      onCancelDownload={onCancelDownload}
      onSubmitDownload={onSubmitDownload}
      checkIsDownload={checkIsDownload}
      setIsClass={setIsClass}
      isLock={isLock}
      isVisible={isVisible}
      isDelete={isDelete}
      isDownloadOn={isDownloadOn}
      isDownload={isDownload}
      selectDownload={selectDownload}
      labelWidth={labelWidth}
      labelHeight={labelHeight}
      labelDiag={labelDiag}
      labelCoordX={labelCoordX}
      labelCoordY={labelCoordY}
      labelPerWidth={labelPerWidth}
      labelPerHeight={labelPerHeight}
      labelPerDiag={labelPerDiag}
      ObjectListItem={ObjectListItem}
      isAutoLabelingOn={isAutoLabelingOn}
      objectType={objectType}
      refTools={refTools}
      refPicker={refPicker}
      refTop={refTop}
      refBottom={refBottom}
      onMoveToToolsTop={onMoveToToolsTop}
      onMoveToToolsEnd={onMoveToToolsEnd}
      onMoveToToolsLeft={onMoveToToolsLeft}
      onMoveToToolsRight={onMoveToToolsRight}
      setInstanceIcon={setInstanceIcon}
      refBtnLock={refBtnLock}
      refBtnVisible={refBtnVisible}
      refBtnDelete={refBtnDelete}
      isAutoLabeling={isAutoLabeling}
      isDeleteInstance={isDeleteInstance}
      checkIsDeleteInstance={checkIsDeleteInstance}
      onCancelDelete={onCancelDelete}
      selectedObjectId={selectedObjectId}
      selectedObject={selectedObject}
      isHDLabelingOn={isHDLabelingOn}
      setAnnotationClass={setAnnotationClass}
      instanceClass={instanceClass}
      instanceAttrList={instanceAttrList}
      instance={instance}
      currentObjectItem={currentObjectItem.current}
      setKeyOnOff={setKeyOnOff}
      isKeyOnOff={isKeyOnOff}
      isCrossOnOff={isCrossOnOff}
      toggleCountClassOpen={toggleCountClassOpen}
      isCountClassOpen={isCountClassOpen}
      isKeypointPersonOn={isKeypointPersonOn}
      isKeypointAnimalOn={isKeypointAnimalOn}
      isKeypointHandOn={isKeypointHandOn}
      setIsKeypoint={setIsKeypoint}
      isKeypointOpen={isKeypointOpen}
      openIsKeypoint={openIsKeypoint}
      closeIsKeypoint={closeIsKeypoint}
      alertKeypointOpen={alertKeypointOpen}
      openAlertKeypoint={openAlertKeypoint} 
      onChangeInstanceClass={onChangeInstanceClass}
      handleSetInstanceClass={handleSetInstanceClass}
      isEditInstanceClass={isEditInstanceClass}
      _setIsEditInstanceClass={_setIsEditInstanceClass}
      instanceAttr={instanceAttr}
      isEditInstanceAttr={isEditInstanceAttr}
      onChangeInstanceAttrName={onChangeInstanceAttrName}
      handleSetInstanceAttrName={handleSetInstanceAttrName}
      _setIsEditInstanceAttr={_setIsEditInstanceAttr}
      onChangeInstanceAttrVal={onChangeInstanceAttrVal}
      handleSetInstanceAttrVal={handleSetInstanceAttrVal}
    />
  );
}
export default TrialContainer;