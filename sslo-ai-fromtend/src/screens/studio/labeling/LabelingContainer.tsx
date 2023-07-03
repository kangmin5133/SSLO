import React, {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { useToast } from "@chakra-ui/react";
import LabelingPresenter from "./LabelingPresenter";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import taskApi, { ITask } from "../../../api/taskApi";
import userApi, { IUser } from "../../../api/userApi";
import projectApi, {
  IGetProjectParam,
  IProjectInfo,
  IProjectAnnotation
} from "../../../api/projectApi";
import { useAppSelector } from "../../../hooks";
import labelingApi, { ICheckAutoLabeling } from "../../../api/labelingApi";
import { fabric } from "fabric";
import iconDefault from "../../../assets/images/studio/icon/instanceTools/icon-instance-default.svg";
import iconSmartpen from "../../../assets/images/studio/icon/instanceTools/icon-instance-smartpen.svg";
import iconAutopoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-autopoint.svg";
import iconBoxing from "../../../assets/images/studio/icon/instanceTools/icon-instance-boxing.svg";
import iconPolyline from "../../../assets/images/studio/icon/instanceTools/icon-instance-polyline.svg";
import iconPolygon from "../../../assets/images/studio/icon/instanceTools/icon-instance-polygon.svg";
import iconPoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-point.svg";
import iconBrush from "../../../assets/images/studio/icon/instanceTools/icon-instance-brush.svg";
import icon3Dcube from "../../../assets/images/studio/icon/instanceTools/icon-instance-3Dcube.svg";
import iconSegment from "../../../assets/images/studio/icon/instanceTools/icon-instance-segment.svg";
import iconKeypoint from "../../../assets/images/studio/icon/instanceTools/icon-instance-keypoint.svg";
import iconOD from "../../../assets/images/studio/icon/instanceTools/icon-instance-OD.svg";
import iconIS from "../../../assets/images/studio/icon/instanceTools/icon-instance-IS.svg";
import iconSES from "../../../assets/images/studio/icon/instanceTools/icon-instance-SES.svg";
import iconLock from "../../../assets/images/studio/icon/instanceTools/icon-lock-active.svg";
import iconUnLock from "../../../assets/images/studio/icon/instanceTools/icon-unlock-dark.svg";
import iconVisible from "../../../assets/images/studio/icon/instanceTools/icon-visible-dark.svg";
import iconInvisible from "../../../assets/images/studio/icon/instanceTools/icon-invisible-active.svg";
import iconToolOD from "../../../assets/images/studio/icon/icon-OD-dark.svg";
import iconToolODActive from "../../../assets/images/studio/icon/icon-OD-active.svg";
import iconToolODSelected from "../../../assets/images/studio/icon/icon-OD-selected.svg";
import iconToolODLearning from "../../../assets/images/studio/icon/icon-OD-learning.svg";
import iconToolODWorking10 from "../../../assets/images/studio/icon/icon-OD-working-10.svg";
import iconToolODWorking20 from "../../../assets/images/studio/icon/icon-OD-working-20.svg";
import iconToolODWorking30 from "../../../assets/images/studio/icon/icon-OD-working-30.svg";
import iconToolODWorking40 from "../../../assets/images/studio/icon/icon-OD-working-40.svg";
import iconToolODWorking50 from "../../../assets/images/studio/icon/icon-OD-working-50.svg";
import iconToolODWorking60 from "../../../assets/images/studio/icon/icon-OD-working-60.svg";
import iconToolODWorking70 from "../../../assets/images/studio/icon/icon-OD-working-70.svg";
import iconToolODWorking80 from "../../../assets/images/studio/icon/icon-OD-working-80.svg";
import iconToolODWorking90 from "../../../assets/images/studio/icon/icon-OD-working-90.svg";
import iconToolIS from "../../../assets/images/studio/icon/icon-IS-dark.svg";
import iconToolISActive from "../../../assets/images/studio/icon/icon-IS-active.svg";
import iconToolISSelected from "../../../assets/images/studio/icon/icon-IS-selected.svg";
import iconToolISLearning from "../../../assets/images/studio/icon/icon-IS-learning.svg";
import iconToolISWorking10 from "../../../assets/images/studio/icon/icon-IS-working-10.svg";
import iconToolISWorking20 from "../../../assets/images/studio/icon/icon-IS-working-20.svg";
import iconToolISWorking30 from "../../../assets/images/studio/icon/icon-IS-working-30.svg";
import iconToolISWorking40 from "../../../assets/images/studio/icon/icon-IS-working-40.svg";
import iconToolISWorking50 from "../../../assets/images/studio/icon/icon-IS-working-50.svg";
import iconToolISWorking60 from "../../../assets/images/studio/icon/icon-IS-working-60.svg";
import iconToolISWorking70 from "../../../assets/images/studio/icon/icon-IS-working-70.svg";
import iconToolISWorking80 from "../../../assets/images/studio/icon/icon-IS-working-80.svg";
import iconToolISWorking90 from "../../../assets/images/studio/icon/icon-IS-working-90.svg";
import iconToolSES from "../../../assets/images/studio/icon/icon-SES-dark.svg";
import iconToolSESActive from "../../../assets/images/studio/icon/icon-SES-active.svg";
import iconToolSESSelected from "../../../assets/images/studio/icon/icon-SES-selected.svg";
import iconToolSESLearning from "../../../assets/images/studio/icon/icon-SES-learning.svg";
import iconToolSESWorking10 from "../../../assets/images/studio/icon/icon-SES-working-10.svg";
import iconToolSESWorking20 from "../../../assets/images/studio/icon/icon-SES-working-20.svg";
import iconToolSESWorking30 from "../../../assets/images/studio/icon/icon-SES-working-30.svg";
import iconToolSESWorking40 from "../../../assets/images/studio/icon/icon-SES-working-40.svg";
import iconToolSESWorking50 from "../../../assets/images/studio/icon/icon-SES-working-50.svg";
import iconToolSESWorking60 from "../../../assets/images/studio/icon/icon-SES-working-60.svg";
import iconToolSESWorking70 from "../../../assets/images/studio/icon/icon-SES-working-70.svg";
import iconToolSESWorking80 from "../../../assets/images/studio/icon/icon-SES-working-80.svg";
import iconToolSESWorking90 from "../../../assets/images/studio/icon/icon-SES-working-90.svg";
import MagicWand from "magic-wand-tool";
import { saveAs } from "file-saver";
import { getKeyPoint, getCube, IPresetItem } from "../../../components/studio/labeling/PresetObject";

export const WORKSTATUS_ALL = "전체";
export const WORKSTATUS_1 = "미작업";
export const WORKSTATUS_2 = "진행중";
export const WORKSTATUS_3 = "완료";
export const WORKSTATUS_4 = "반려";
export type WorkStatusType = "전체" | "미작업" | "진행중" | "완료" | "반려";

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
  title: string;
  date: string;
  data: any;
  objects: any[];
}

export interface IimgInfo {
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  data?: ImageData;
}
export interface Iimg {
  width: number;
  height: number;
  ratio: number;
  data?: ImageData;
}

const LabelingContainer = () => {
  const loggedInUser = useAppSelector((state) => state.userReducer);
  const checkNum = /^[0-9]+$/;
  // ! project ID를 URL로부터 Get
  const { pId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  //**! 기본 state, set */
  const toast = useToast();
  // ! Canvas set
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const context = useRef(ctx);
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

  // ! 단축키 팝업
  const [isKeyOnOff, setIsKeyOnOff] = useState<boolean>(false);
  const [isCrossOnOff, setIsCrossOnOff] = useState<boolean>(true);
  const [isLearningOD, setIsLearningOD] = useState<boolean>(false);
  const [isLearningISES, setIsLearningISES] = useState<boolean>(false);
  const [isActiveOD, setIsActiveOD] = useState<boolean>(false);
  const [isActiveISES, setIsActiveISES] = useState<boolean>(false);
  const [isCountClassOpen, setIsCountClassOpen] = useState<boolean>(false);

  // ! work statutes
  const [workStatutes, setWorkStatutes] = useState<WorkStatusType>(
    WORKSTATUS_ALL
  );
  // ! 프로젝트 가공 담당자
  const [labelingAssignee, setLabelingAssignee] = useState<IUser>();
  // ! 프로젝트 검수 담당자
  const [examinee, setExaminee] = useState<IUser>();
  // ! 프로젝트 참여자
  const [projectUser, setProjectUser] = useState<IUser[]>([]);
  // ! 프로젝트 정보
  const [projectInfo, setProjectInfo] = useState<IProjectInfo | null>();
  const [projectCategories, setProjectCategories] = useState<IProjectAnnotation[]>([]);
  const pCategories = useRef(projectCategories);
  const defaultColor = "#F379B4";
  const [selectedTool, setSelectedTool] = useState("");
  const currentTool = useRef(selectedTool);

  const [canvasHistory, setCanvasHistory] = useState<ICanvasHistory[]>([]);
  const [isLoadHistory, setIsLoadHistory] = useState<boolean>(false);

  let isDown = false, drawMode = false, isDragging = false, selection = false;  // isSelectObjectOn = false;
  let startX = 0, startY = 0, endX = 0, endY = 0;
  let pointArray: any[] = [];
  let activeLine: any = null;
  let activeShape: any = null;
  let lineArray: any[] = [];

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

  const [imgInfo, setimgInfo] = useState<IimgInfo>();
  const [imgRatio, setimgRatio] = useState(1);
  const iRatio = useRef(imgRatio);
  const [imgWidth, setimgWidth] = useState(0);
  const [imgHeight, setimgHeight] = useState(0);
  const [iImage, setIImage] = useState<Iimg>();
  const currentImage = useRef(iImage);

  const [ObjectListItem, setObjectListItem] = useState([]);
  const currentObjectItem = useRef(ObjectListItem);
  const [DeleteIDList, setDeleteIDList] = useState([]);
  const currentDeleteIDList = useRef(DeleteIDList);
  const [instance, setInstance] = useState<IProjectAnnotation>();
  const [instanceClass, setInstanceClass] = useState("");
  const [instanceAttrList, setInstanceAttrList] = useState([]);

  const [isHDLabelingOn, setHDLabelingOn] = useState(true);

  const [isDownloadOn, setIsDownloadOnOff] = useState<boolean>(false);
  const [isDownload, setDownload] = useState("");
  const [selectDownload, setSelectDownload] = useState("");

  const [resizingVal, setResizingVal] = useState<string | null>("100");
  const currentResizingVal = useRef(resizingVal);

  const [isMoveOn, setIsMoveOnOff] = useState<boolean>(false);

  const [isTagOn, setIsTagOnOff] = useState<boolean>(false);
  const isTag = useRef(isTagOn);

  const [isClassOn, setIsClassOnOff] = useState<boolean>(false);
  const isClassOnOff = useRef(isClassOn);

  const [isResetOn, setIsResetOnOff] = useState<boolean>(false);

  const [isHDOn, setIsHDOnOff] = useState<boolean>(false);
  const [isODOn, setIsODOnOff] = useState<boolean>(false);
  const [isISOn, setIsISOnOff] = useState<boolean>(false);
  const [isSESOn, setIsSESOnOff] = useState<boolean>(false);
  const [isPopupOD, setIsPopupOD] = useState<boolean>(false);
  const [isPopupIS, setIsPopupIS] = useState<boolean>(false);
  const [isPopupSES, setIsPopupSES] = useState<boolean>(false);
  
  const [iconCheckOD, setIconCheckOD] = useState(iconToolOD);
  const [iconCheckIS, setIconCheckIS] = useState(iconToolIS);
  const [iconCheckSES, setIconCheckSES] = useState(iconToolSES);

  const [isSmartpenOn, setIsSmartpenOnOff] = useState<boolean>(false);

  const [sliderValueSmartpen, setSliderValueSmartpen] = useState<number>(50)
  const [showTooltipSmartpen, setShowTooltipSmartpen] = useState<boolean>(false)
  const smartpenThreshold = useRef(sliderValueSmartpen);

  let autoPointList = [];
  const [isAutopointOn, setIsAutopointOnOff] = useState<boolean>(false);

  const [isBoxingOn, setIsBoxingOnOff] = useState<boolean>(false);

  const [isPolylineOn, setIsPolylineOnOff] = useState<boolean>(false);

  const [isPointOn, setIsPointOnOff] = useState<boolean>(false);

  const [sliderValuePoint, setSliderValuePoint] = useState<number>(4)
  const [showTooltipPoint, setShowTooltipPoint] = useState<boolean>(false)
  const pointSize = useRef(sliderValuePoint);

  const [isBrushOn, setIsBrushOnOff] = useState<boolean>(false);

  const [sliderValueBrush, setSliderValueBrush] = useState<number>(20)
  const [showTooltipBrush, setShowTooltipBrush] = useState<boolean>(false)
  const brushSize = useRef(sliderValueBrush);

  const [is3DcubeOn, setIs3DcubeOnOff] = useState<boolean>(false);

  const [isSegmentOn, setIsSegmentOnOff] = useState<boolean>(false);

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
  // ! set preProcessingAssignee
  const _setLabelingAssignee = (
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
    setLabelingAssignee(user);
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
    // TODO: role based 권한 처리
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
  const toggleInstanceOpen = () => {
    setIsInstanceOpen((prev) => !prev);
    return;
  };
  const toggleHistoryOpen = () => {
    setIsHistoryOpen((prev) => !prev);
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
    console.log("2");

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
      setProjectUser(users);
    } else {
      // TODO: error handling
    }
  };
  // ! call api get project
  const getProject = async (param: IGetProjectParam) => {
    const categories: IProjectAnnotation[] = [];
    const res = await projectApi.getProject(param);
    if (res && res.status === 200) {
      setProjectInfo({
        projectId: res.data.project_id,
        projectName: res.data.project_name,
      });
      const cs = res.data.project_detail.project_categories;
      cs.forEach(item => {
        const c = {
          annotation_category_id: item.annotation_category_id,
          annotation_category_name: item.annotation_category_name,
          annotation_category_color: item.annotation_category_color,
          annotation_category_attributes: item.annotation_category_attributes,
        };
        categories.push(c);
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
    setProjectCategories(categories);
  };
  useEffect(() => {
    pCategories.current = projectCategories;
  }, [projectCategories]);

  // ! call api HD Labeling
  const getHD = async () => {
    let param = {
      project_id: pId,
      task_id: selectedTask.taskId,
      labeling_type: 4,
      //maxResults: 10000,
    };
    const res = await labelingApi.getAutoLabeling(param);
    if (res && res.status === 200) {
      console.log(res.data);
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          let cColor = item.annotation_category.annotation_category_color;

          const dataOD = item.annotation_data[0].bbox;
          const dataISES = item.annotation_data[1].segmentation;
          const dataKeyPoint = item.annotation_data[2].keypoints;
          const dataKeyNum = item.annotation_data[0].num_keypoints;

          if (dataOD && dataOD.length > 0) {
            let coordOD = {
              left: dataOD[0],
              top: dataOD[1],
              width: dataOD[2],
              height: dataOD[3],
            };
            setPositionX(() => dataOD[0]);
            setPositionY(() => dataOD[1]);
            setInstanceWidth(() => dataOD[2]);
            setInstanceHeight(() => dataOD[3]);
            drawBoxing('HOD', coordOD, cColor, null, null, iId++);
          }
          if (dataISES && dataISES.length > 0) {
            let iColor = '#';
            for (let c = 0; c < 6; c++) {
              iColor += Math.round(Math.random() * 0xf).toString(16);
            }
            let coordinates = [];
            for (let i = 0; i < dataISES.length; i++) {
              for (let j = 0; j < dataISES[i].length; j = j + 2) {
                coordinates.push(
                  new fabric.Point(dataISES[i][j], dataISES[i][j + 1]),
                );
              }
            }
            drawPolyItem('HIS', coordinates, "Polygon", iColor, null, null, 2, iId++);
            drawPolyItem('HSES', coordinates, "Segmentation", cColor, null, null, 3, iId++);
          }
          if (dataKeyPoint && dataKeyPoint.length > 0) {
            let coords = [];
            dataKeyPoint.forEach((p) => {
              //if(p[2] > 0.08) {
                coords.push(p[0]);
                coords.push(p[1]);
                coords.push(p[2]);
              /* } else {
                coords.push(null);
                coords.push(null);
                coords.push(null);
              } */
            });
            drawKeypoint(null, null, iId++, coords, cColor);
          }
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }
    setLoading(false);
    setIsAutoLabeling(false);
  };

  const oldGetHD = async () => {
    let paramOD = {
      project_id: pId,
      task_id: selectedTask.taskId,
      labeling_type: 1,
      //maxResults: 10000,
    };
    const resOD = await labelingApi.getAutoLabeling(paramOD);
    if (resOD && resOD.status === 200) {
      if (resOD.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < resOD.data.length; i++) {
          let item = resOD.data[i];
          let color = item.annotation_category.annotation_category_color;
          let coordinate = {
            left: item.annotation_data[0],
            top: item.annotation_data[1],
            width: item.annotation_data[2] - item.annotation_data[0],
            height: item.annotation_data[3] - item.annotation_data[1],
          };
          setPositionX(() => item.annotation_data[0]);
          setPositionY(() => item.annotation_data[1]);
          setInstanceWidth(() => item.annotation_data[2] - item.annotation_data[0]);
          setInstanceHeight(() => item.annotation_data[3] - item.annotation_data[1]);
          drawBoxing('HOD', coordinate, color, null, null, iId++);
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }

    let paramIS = {
      project_id: pId,
      task_id: selectedTask.taskId,
      labeling_type: 2,
      //maxResults: 10000,
    };
    const resIS = await labelingApi.getAutoLabeling(paramIS);
    if (resIS && resIS.status === 200) {
      if (resIS.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < resIS.data.length; i++) {
          let item = resIS.data[i];
          //let color = item.annotation_category.annotation_category_color;
          //let color = Math.floor(Math.random() * 16777215).toString(16);
          //0xffffff = 16777215
          let color = '#';
          for (let c = 0; c < 6; c++) {
            color += Math.round(Math.random() * 0xf).toString(16);
          }
          let items = item.annotation_data;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          drawPolyItem('HIS', coordinates, "Polygon", color, null, null, 2, iId++);
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }

    let paramSES = {
      project_id: pId,
      task_id: selectedTask.taskId,
      labeling_type: 3,
      //maxResults: 10000,
    };
    const resSES = await labelingApi.getAutoLabeling(paramSES);
    if (resSES && resSES.status === 200) {
      if (resSES.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < resSES.data.length; i++) {
          let item = resSES.data[i];
          let color = item.annotation_category.annotation_category_color;
          let items = item.annotation_data;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          drawPolyItem('HSES', coordinates, "Segmentation", color, null, null, 3, iId++);
        }
        //setObjectId(() => iId);
      }
    } else {
      // TODO: error handling
    }
  };

  // ! call api OD Labeling
  const getOD = async (param: any) => {
    const res = await labelingApi.getAutoLabeling(param);
    if (res && res.status === 200) {
      let count = 0;
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          /* if(item.annotation_category.annotation_category_id === 1000 ||
            item.annotation_category.annotation_category_name === "인간") continue; */
          let color = item.annotation_category.annotation_category_color;
          let coordinate = {
            left: item.annotation_data[0],
            top: item.annotation_data[1],
            width: item.annotation_data[2] - item.annotation_data[0],
            height: item.annotation_data[3] - item.annotation_data[1],
          };
          setPositionX(() => item.annotation_data[0]);
          setPositionY(() => item.annotation_data[1]);
          setInstanceWidth(() => item.annotation_data[2] - item.annotation_data[0]);
          setInstanceHeight(() => item.annotation_data[3] - item.annotation_data[1]);
          //projectCategories
          const annotation = {
            annotation_type: item.annotation_type,
            annotation_category: item.annotation_category,
            annotation_data: [coordinate.left, coordinate.top, coordinate.width, coordinate.height]
          };
          drawBoxing('OD', coordinate, color, null, annotation, iId++);
          count++;
        }
        //setObjectId(() => iId);
      }
      if(count === 0) {
        toast({
          title: "검출된 객체가 존재하지 않습니다. 추가 학습을 진행해주세요.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setIsODOnOff(() => false);
      }
    } else {
      // TODO: error handling
      toast({
        title: "검출에 실패했습니다. 확인 후 다시 시도해주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setIsODOnOff(() => false);
    }
    setLoading(false);
    setIsAutoLabeling(false);
  };
  const getIS = async (param: any) => {
    const res = await labelingApi.getAutoLabeling(param);
    if (res && res.status === 200) {
      let count = 0;
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          /* if(item.annotation_category.annotation_category_id === 1000 ||
            item.annotation_category.annotation_category_name === "인간") continue; */
          //let color = item.annotation_category.annotation_category_color;
          //let color = Math.floor(Math.random() * 16777215).toString(16);
          //0xffffff = 16777215
          let color = '#';
          for (let c = 0; c < 6; c++) {
            color += Math.round(Math.random() * 0xf).toString(16);
          }
          let items = item.annotation_data;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          const annotation = {
            annotation_type: item.annotation_type,
            annotation_category: item.annotation_category,
            annotation_data: coordinates
          };
          drawPolyItem('IS', coordinates, "Polygon", color, null, annotation, 2, iId++);
          count++;
        }
        //setObjectId(() => iId);
        if(count === 0) {
          toast({
            title: "검출된 객체가 존재하지 않습니다. 추가 학습을 진행해주세요.",
            status: "info",
            position: "top",
            duration: 3000,
            isClosable: true,
          });
          setIsISOnOff(() => false);
        }
      }
    } else {
      // TODO: error handling
      toast({
        title: "검출에 실패했습니다. 확인 후 다시 시도해주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setIsISOnOff(() => false);
    }
    setLoading(false);
    setIsAutoLabeling(false);
  };
  const getSES = async (param: any) => {
    const res = await labelingApi.getAutoLabeling(param);
    if (res && res.status === 200) {
      let count = 0;
      if (res.data.length > 0) {
        let iId = currentObjectId.current;
        for (let i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          /* if(item.annotation_category.annotation_category_id === 1000 ||
            item.annotation_category.annotation_category_name === "인간") continue; */
          let color = item.annotation_category.annotation_category_color;
          let items = item.annotation_data;
          let coordinates = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].length; j = j + 2) {
              coordinates.push(
                new fabric.Point(items[i][j], items[i][j + 1]),
              );
            }
          }
          const annotation = {
            annotation_type: item.annotation_type,
            annotation_category: item.annotation_category,
            annotation_data: coordinates
          };
          drawPolyItem('SES', coordinates, "Segmentation", color, null, annotation, 3, iId++);
          count++;
        }
        //setObjectId(() => iId);
        if(count === 0) {
          toast({
            title: "검출된 객체가 존재하지 않습니다. 추가 학습을 진행해주세요.",
            status: "info",
            position: "top",
            duration: 3000,
            isClosable: true,
          });
          setIsSESOnOff(() => false);
        }
      }
    } else {
      // TODO: error handling
      toast({
        title: "검출에 실패했습니다. 확인 후 다시 시도해주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      setIsSESOnOff(() => false);
    }
    setLoading(false);
    setIsAutoLabeling(false);
  };
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: any[]) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    let cnt = 0;
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
      if(taskStep === 2 || taskStatus === 3) {
        cnt++;
      }
    }
    setTasks(cleanedTasks);
    //checkAutoLabelingOn();
  };

  const [countListOD, setCountListOD] = useState<ICheckAutoLabeling[]>([]);
  const [countListISES, setCountListISES] = useState<ICheckAutoLabeling[]>([]);
  const [countOD, setCountOD] = useState<number>(0);
  const [countISES, setCountISES] = useState<number>(0);
  const currentCountListOD = useRef(countListOD);
  const currentCountListISES = useRef(countListISES);
  const currentCountOD = useRef(countOD);
  const currentCountISES = useRef(countISES);
  const activeNum = 20;
  useEffect(() => {
    currentCountListOD.current = countListOD;
    currentCountListISES.current = countListISES;
    currentCountOD.current = countOD;
    currentCountISES.current = countISES;
  }, [countListOD, countListISES, countOD, countISES]);
  const toggleCountClassOpen = () => {
    setIsCountClassOpen((prev) => !prev);
  };
  const checkAutoLabelingOn = async () => {
    let checkOD = await checkActiveOD();
    let checkISES = await checkActiveISES();
    if(checkOD.isActive && checkISES.isActive) return;
    checkAutoLabelingWorking(checkOD.status, checkISES.status, checkOD.isActive, checkISES.isActive);    // if(!isOD || !isISES) 
  };

  const checkActiveOD = async () => {
    const res = await labelingApi.checkActiveAutoLabeling({
      project_id: pId,
      task_type: 1,
    });
    let isActive = false;
    let status = "";
    if(res && res.status === 200) {
      const result = res.data;
      status = result.learning_status;
      if (result.model_path && result.model_path !== "none" && result.model_path.length > 0) {
        isActive = true;
      } else if (result.result === "success") {
        isActive = true;
      }
      if(isActive) {
        setIsActiveOD(isActive);
        await unloadModel(1);
      }
    }
    return { status: status , isActive: isActive };
  };

  const checkActiveISES = async () => {
    const res = await labelingApi.checkActiveAutoLabeling({
      project_id: pId,
      task_type: 2,
    });
    let isActive = false;
    let status = "";
    if(res && res.status === 200) {
      const result = res.data;
      status = result.learning_status;
      if (result.model_path && result.model_path !== "none" && result.model_path.length > 0) {
        isActive = true;
      } else if (result.result === "success") {
        isActive = true;
      }
      if(isActive) {
        setIsActiveISES(isActive);
        await unloadModel(2);
      }
    }
    return { status: status , isActive: isActive };
  };

  const checkAutoLabelingWorking = async (statusOD: string, statusISES: string, isOD?: boolean, isISES?: boolean) => {
    const res = await labelingApi.checkLabelingStatus({
      project_id: parseInt(pId),
    });
    if (res && res.status === 200) {
      const data = res.data;
      const replaceData = data.replaceAll("\'", "\"");  //.replaceAll("\{", "\'{").replaceAll("\}", "\}'").replaceAll("\[", "\'[").replaceAll("\]", "\]'");
      const datas = JSON.parse(replaceData);
      console.log(datas);
      let typeOD = datas[0];
      let typeISES = datas[1];
      for (let i = 0; i < datas.length; i++){
        if(datas[i].labeling_type === 1){
          typeOD = datas[i];
        } else {
          typeISES = datas[i];
        }
      }
      const listOD: ICheckAutoLabeling[] = [];
      const listISES: ICheckAutoLabeling[] = [];
      for (let j = 0; j < typeOD.label_info.length; j++){
        //if(typeOD.label_info[j].category_name === '인간') continue;
        listOD.push(typeOD.label_info[j]);
      }
      setCountListOD(listOD);
      const cntOD = countCheckAutoLabeling(listOD);
      if(!isOD && cntOD === 100) {
        setIsLearningOD(true);
        if (statusOD !== "active") startLearning();
      } else if (isOD && cntOD === 100 && checkActiveLearning(listOD)) {
        startLearning();
      }
      setCountOD(cntOD);
      for (let j = 0; j < typeISES.label_info.length; j++){
        //if(typeISES.label_info[j].category_name === '인간') continue;
        listISES.push(typeISES.label_info[j]);
      }
      setCountListISES(listISES);
      const cntISES = countCheckAutoLabeling(listISES);
      if(!isISES && cntISES === 100) {
        setIsLearningISES(true);
        if (statusISES !== "active") startLearning();
      } else if (isISES && cntISES === 100 && checkActiveLearning(listISES)) {
        startLearning();
      }
      setCountISES(cntISES);
      setCheckIcon(cntOD, cntISES);
      //setAutoLabelingOn(() => true);
    }
  };

  const unloadModel = async (type: number) => {
    const res = await labelingApi.unloadModel({
      project_id: parseInt(pId),
      task_type: type,
    });
    const result = await uploadModel(type);
  };

  const uploadModel = async (type: number) => {
    const res = await labelingApi.uploadModel({
      project_id: parseInt(pId),
      task_type: type,
    });
    if(res && res.status === 200) {
      console.log(res.data);
      return true;
    } else {
      return false;
    }
  };

  const countCheckAutoLabeling = (data: any[]) => {
    let count = 0;
    data.forEach((item) => {
      let cnt = item.labeled_instance_count;
      if(cnt > activeNum) cnt = activeNum;
      count += Math.round(cnt / activeNum * 100);
    });
    return count !== 0 ? Math.round(count / data.length) : 0;
  };

  const checkActiveLearning = (data: any[]) => {
    let count = 0;
    data.forEach((item) => {
      count += item.labeled_instance_count;
    });
    const checkCnt = Math.floor(count / tasks.length * 100);
    return checkCnt === 25 || checkCnt === 50 || checkCnt === 75;
  };

  const setCheckIcon = (cntOD:number, cntISES: number) => {
    let iconToolODWorking = iconToolOD;
    let iconToolISWorking = iconToolIS;
    let iconToolSESWorking = iconToolSES;

    if (isActiveOD) {
      iconToolODWorking = isODOn ? iconToolODSelected : iconToolODActive;
    } else if (cntOD >= 10 && cntOD < 20) {
      iconToolODWorking = iconToolODWorking10;
    } else if (cntOD >= 20 && cntOD < 30) {
      iconToolODWorking = iconToolODWorking20;
    } else if (cntOD >= 30 && cntOD < 40) {        
      iconToolODWorking = iconToolODWorking30;
    } else if (cntOD >= 40 && cntOD < 50) {    
      iconToolODWorking = iconToolODWorking40;
    } else if (cntOD >= 50 && cntOD < 60) {    
      iconToolODWorking = iconToolODWorking50;
    } else if (cntOD >= 60 && cntOD < 70) {    
      iconToolODWorking = iconToolODWorking60;
    } else if (cntOD >= 70 && cntOD < 80) {    
      iconToolODWorking = iconToolODWorking70;
    } else if (cntOD >= 80 && cntOD < 90) {    
      iconToolODWorking = iconToolODWorking80;
    } else if (cntOD >= 90 && cntOD < 100) {    
      iconToolODWorking = iconToolODWorking90;
    } else if (cntOD >= 100 || isLearningOD) {    
      iconToolODWorking = iconToolODLearning;
    } else {
      iconToolODWorking = iconToolOD;
    }
    const OD = isActiveOD ? isODOn ? iconToolODSelected : iconToolODActive : isLearningOD ? iconToolODLearning : iconToolODWorking;
    setIconCheckOD(OD);
    
    if (isActiveISES) {
      iconToolISWorking = isISOn ? iconToolISSelected : iconToolISActive;
      iconToolSESWorking = isSESOn ? iconToolSESSelected : iconToolSESActive;
    } else if (cntISES >= 10 && cntISES < 20) {
      iconToolISWorking = iconToolISWorking10;
      iconToolSESWorking = iconToolSESWorking10;
    } else if (cntISES >= 20 && cntISES < 30) {
      iconToolISWorking = iconToolISWorking20;
      iconToolSESWorking = iconToolSESWorking20;
    } else if (cntISES >= 30 && cntISES < 40) {
      iconToolISWorking = iconToolISWorking30;
      iconToolSESWorking = iconToolSESWorking30;
    } else if (cntISES >= 40 && cntISES < 50) {
      iconToolISWorking = iconToolISWorking40;
      iconToolSESWorking = iconToolSESWorking40;
    } else if (cntISES >= 50 && cntISES < 60) {
      iconToolISWorking = iconToolISWorking50;
      iconToolSESWorking = iconToolSESWorking50;
    } else if (cntISES >= 60 && cntISES < 70) { 
      iconToolISWorking = iconToolISWorking60;
      iconToolSESWorking = iconToolSESWorking60;
    } else if (cntISES >= 70 && cntISES < 80) {
      iconToolISWorking = iconToolISWorking70;
      iconToolSESWorking = iconToolSESWorking70;
    } else if (cntISES >= 80 && cntISES < 90) {
      iconToolISWorking = iconToolISWorking80;
      iconToolSESWorking = iconToolSESWorking80;
    } else if (cntISES >= 90 && cntISES < 100) {
      iconToolISWorking = iconToolISWorking90;
      iconToolSESWorking = iconToolSESWorking90;
    } else if (cntISES >= 100 || isLearningISES) {
      iconToolISWorking = iconToolISLearning;
      iconToolSESWorking = iconToolSESLearning;
    } else {
      iconToolISWorking = iconToolIS;
      iconToolSESWorking = iconToolSES;
    }
    const IS = isActiveISES ? isISOn ? iconToolISSelected : iconToolISActive : isLearningISES ? iconToolISLearning : iconToolISWorking;
    const SES = isActiveISES ? isSESOn ? iconToolSESSelected : iconToolSESActive : isLearningISES ? iconToolSESLearning : iconToolSESWorking;
    setIconCheckIS(IS);
    setIconCheckSES(SES);
    //setIconOD(icon);
  };

  const startLearning = async () => {
    const res = await labelingApi.startActiveLearning({
      project_id: parseInt(pId),
    });
    if(res && res.status === 200) {
      const data = res.data;
      console.log(data);
      if(data.train_status === "running") {
        toast({
          title: "모델이 훈련중입니다.",
          status: "info",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // ! set selected task
  const _setSelectedTask = (task: ITask) => {
    clearDatas();
    setIsLoadHistory(false);
    setSelectedTask(task);
  };
  // ! Header 상단 prev 버튼 클릭 시 handler
  const handlePrevTask = (
    taskId: number
  ): MouseEventHandler<HTMLImageElement> | undefined => {
    if(loggedInUser.isAdmin) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === taskId && i !== 0) {
          _setSelectedTask(tasks[i - 1]);
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
    } else {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === taskId) {
          for (let j = i - 1; j >= 0; j--) {
            if (tasks[j].taskStep === 1 && tasks[j].taskWorker.id === loggedInUser.id || 
              tasks[j].taskStep === 2 && tasks[j].taskValidator.id === loggedInUser.id) {
                _setSelectedTask(tasks[j]);
                return;
            } else if (j === 0) {
              toast({
                title: "첫번째 페이지입니다.",
                status: "info",
                position: "top",
                duration: 3000,
                isClosable: true,
              });
            }
          }
        }
      }
    }
  };
  // ! Header 상단 next 버튼 클릭 시 handler
  const handleNextTask = (
    taskId: number
  ): MouseEventHandler<HTMLImageElement> | undefined => {
    if(loggedInUser.isAdmin) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === taskId && i !== tasks.length - 1) {
          _setSelectedTask(tasks[i + 1]);
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
    } else {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].taskId === taskId) {
          for (let j = i + 1; j < tasks.length; j++) {
            if (tasks[j].taskStep === 1 && tasks[j].taskWorker.id === loggedInUser.id || 
              tasks[j].taskStep === 2 && tasks[j].taskValidator.id === loggedInUser.id) {
                _setSelectedTask(tasks[j]);
                return;
            } else if (j === tasks.length - 1) {
              toast({
                title: "마지막 페이지입니다.",
                status: "info",
                position: "top",
                duration: 3000,
                isClosable: true,
              });
            }
          }
        }
      }
    }
  };
  // ! 아래 searchTasks가 실행된 후 task 데이터가 들어와서 tasks 길이에 변화가 생기면 selectedTask에 값을 넣음
  // TODO: 근데 이게 추후에는 최초작업이냐 아니냐에 따라 selectedTask에 값을 넣을지 말지를 정해줘야 하는 작업이 필요
  useEffect(() => {
    if(tasks.length > 0) {
      console.log("task");
      const selectedTask = location.search.split("?")[1];
      let index: number;
      if (selectedTask) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].taskId === parseInt(selectedTask.split("=")[1])) {
            index = i;
            break;
          }
        }
        //setSelectedTask(tasks[index!]);
      } else {
        if (loggedInUser.isAdmin) {
          index = 0;
        } else {
          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskStep === 1 && tasks[i].taskWorker.id === loggedInUser.id || 
              tasks[i].taskStep === 2 && tasks[i].taskValidator.id === loggedInUser.id) {
              index = i;
              break;
            }
          }
        }
        //setSelectedTask(tasks[0]);
      }
      checkAutoLabelingOn();
      setSelectedTask(tasks[index!]);
      setTimeout(() => {
        setIsFirst(false);
      }, 2500);
      // eslint-disable-next-line
    }
  }, [tasks.length]);
  // ! dataURLHistory's first order stored when selectedTask changed.
  useEffect(() => {
    currentTask.current = selectedTask;
    if (selectedTask) {
      tasks.forEach((t, index) => {
        if(t.taskId === selectedTask.taskId) {
          document.getElementById("img"+index).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
      setLabelingAssignee(null);
      setExaminee(null);
      resetTools("");
      clearDatas();
      setResizingVal("100");
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
      //setHotKey();
    }
    /* searchTasks({
      project_id: pId,
      orderBy: "task_id",
      order: "ASC",
      maxResults: 10000,
    }); */
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
    searchTasks({
      project_id: pId,
      orderBy: "task_id",
      order: "ASC",
      maxResults: 10000,
    });
    //searchAllUsers({ maxResults: 50 });
    if (pId) getProject({ project_id: parseInt(pId) });
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
      canvas.on('path:created', handleCreatePath);
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

  useEffect(() => {
    context.current = ctx;
  }, [ctx]);

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
          canvas.setBackgroundImage(image, () => {});
          canvas.setWidth(width * ratio);
          canvas.setHeight(height * ratio);
          canvas.setZoom(ratio);
        }
      }, { crossOrigin: 'anonymous' });

      const res: any = await labelingApi.searchAnnotationByTask(
        {
          project_id: parseInt(pId),
          task_id: selectedTask.taskId,
          maxResults: 10000,
        }
      );
      if(res && res.status === 200) {
        let iId = currentObjectId.current;
        if(res.data.datas.length > 0) setIsLoadHistory(true);
        for (let j = 0; j < res.data.datas.length; j++) {
          let item = res.data.datas[j];
          //! item.annotation_id => 9 : AutoPoint 의 경우 bbox와 polygon 두가지 방안 필요
          if (item.annotation_id) {
            if (
              item.annotation_type.annotation_type_id === 1 ||
              item.annotation_type.annotation_type_id === 9
            ) {
              let coord = {
                left: item.annotation_data[0],
                top: item.annotation_data[1],
                width: item.annotation_data[2],
                height: item.annotation_data[3],
              };
              drawBoxing(item.annotation_type.annotation_type_name, coord, item.annotation_category.annotation_category_color, item.annotation_id, item, iId++);
            } else if (
              item.annotation_type.annotation_type_id === 2 ||
              item.annotation_type.annotation_type_id === 3 ||
              item.annotation_type.annotation_type_id === 4 ||
              item.annotation_type.annotation_type_id === 6 ||
              item.annotation_type.annotation_type_id === 8
            ) {
              let items = item.annotation_data;
              let coordinates = [];
              for (let l = 0; l < items.length; l++) {
                coordinates.push(new fabric.Point(items[l++], items[l]));
              }
              drawPolyItem(item.annotation_type.annotation_type_name, coordinates, item.annotation_type.annotation_type_name, item.annotation_category.annotation_category_color, item.annotation_id, item, item.annotation_type.annotation_type_id, iId++);
            } else if (item.annotation_type.annotation_type_id === 5) {
              let coord = {
                x: item.annotation_data[0],
                y: item.annotation_data[1],
              };
              drawPoints(coord, item.annotation_type.annotation_type_name, item.annotation_category.annotation_category_color, item.annotation_id, item, iId++);
            } else if (item.annotation_type.annotation_type_id === 7) {
              //Cube
              drawCube(item.annotation_data, item.annotation_id, item, iId++, item.annotation_category.annotation_category_color);
            } else if (item.annotation_type.annotation_type_id === 10) {
              //keypoint
              drawKeypoint(item.annotation_id, item, iId++, item.annotation_data, item.annotation_category.annotation_category_color);
            }
          }
        }
      }
      setHotKey();
    }
  };

  useEffect(() => {
    currentImage.current = iImage;
  }, [iImage]);

  // ! 확대 배율 불러오는 부분 수정 필요
  useEffect(() => {
    iRatio.current = Math.round(imgRatio * 10) / 10;
  }, [imgRatio]);

  const checkFunctionKey = /F1?[0-9]/;

  const setHotKey = () => {
    document.onkeydown = function (e) {
      console.log(e);
      if(!isClassOnOff.current){
        if(selectedTask &&
                (loggedInUser.isAdmin ||
                  selectedTask.taskStep === 1 && selectedTask.taskWorker?.id === loggedInUser.id ||
                  selectedTask.taskStep === 2 && selectedTask.taskValidator?.id === loggedInUser.id)){
          //console.log(e);
          let key = e.key || e.keyCode;
          if(!checkFunctionKey.test(key.toString())) 
            e.preventDefault();
          /* if (key === 13 || key === 'Enter') {
            if(canvas) canvas.discardActiveObject();
            return false;
          }
          else */ if (key === 46 || key === 'Delete') {
            deleteItem('Delete');
            return false;
          }
          else if (key === 27 || key === 'Escape') {
            if(autoPointList && autoPointList.length > 0) {
              for(let i=0; i < autoPointList.length; i++) {
                canvas.remove(autoPointList[i]);
              }
              autoPointList = [];
            }
            if(tempRect) {
              canvas.remove(tempRect);
              tempRect = null;
            }
            if(pointArray) {
              for (const point of pointArray) {
                canvas.remove(point);
              }
              pointArray = [];
            }
            if(lineArray) {
              for (const line of lineArray) {
                canvas.remove(line);
              }
              lineArray = [];
            }
            if(activeLine) {
              canvas.remove(activeLine);
              activeLine = null;
            }
            if(activeShape) {
              canvas.remove(activeShape);
              activeShape = null;
            }
            if(tempPolygon) {
              canvas.remove(tempPolygon);
              tempPolygon = null;
            }
            if(tempCube) {
              canvas.remove(tempCube);
              tempCube = null;
            }
            canvas.renderAll();
            resetAutoTools();
            resetTools("");
            return false;
          }
          else if (e.ctrlKey && (key === '+' || key === 107)) {
            let size = parseInt(currentResizingVal.current) + 10;
            if(size > 200) {
              size = 200;
            }
            zoomAdjustment(size.toString());
            setResizingVal(size.toString());
            return false;
          }
          else if (e.ctrlKey && (key === '-' || key === 109)) {
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
          else if(e.ctrlKey && (key === 'x' || key === 88)){
            //Todo: object cut
            toast({
              title: "준비중입니다.",
              status: "info",
              position: "top",
              duration: 3000,
              isClosable: true,
            });
            return false;
          }
          else if(e.ctrlKey && (key === 'v' || key === 86)){
            //Todo: object paste
            handleObjectPaste();
            return false;
          }

          else if(e.shiftKey && (key === 'R' || key === 82)){
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

          else if(e.shiftKey && (key === 'S' || key === 83)){
            /* if(currentTask.current && currentTask.current.taskStep === 2 && currentTask.current.taskStatus === 1) {
              //saveStatus(-3);
            } else  */if (currentTask.current && currentTask.current.taskStatus === 3) {
              saveStatus(22);
            } else {
              saveStatus(3);
            }
            return false;
          }

          else if(e.ctrlKey && (key === 's' || key === 83)){
            //if (currentTask.current && currentTask.current.taskStatus !== 3) {
              saveStatus(2);
            //}
            return false;
          }

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
    });
  };

  const handleObjectPaste = () => {
    // clone again, so you can do multiple copies.
    clipboard.clone((clonedObj) => {
      canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 50,
        top: clonedObj.top + 50,
        evented: true,
      });
      /* clonedObj.on('selected', handleSelectObject);
      clonedObj.on('deselected', handleDeSelectObject); */
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the canvas.
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj) => {
          canvas.add(obj);
        });
        // this should solve the unselectability
        clonedObj.setCoords();
      } else {
        //canvas.add(clonedObj);
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

  useEffect(() => {
    currentTool.current = selectedTool;
  }, [selectedTool]);

  const handleBeforeCanvasDown = (options) => {
    if(options.target){
      if(options.target.tool){
        if((options.e.ctrlKey || polygonTool.current === "add") && options.target.tool === "Polygon") {
          addPolyPoint(canvas.getPointer(options), options.target);
          return;
        } else if((options.e.altKey || polygonTool.current === "del") && options.target.tool === "Polygon") {
          console.log(options);
          removePolyPoint(canvas.getPointer(options), options.target);
          return;
        }
        const regex = /[^0-9]/g;
        const result = regex.test(options.target.tool);
        if(result && options.target.selectable) return;
      }
    }
    switch(currentTool.current) {
      case "BrushPen":
        setDrawingMode();
        break;
      /* case "Polygon":
        addPolyPoint(canvas.getPointer(options), options.target);
        break; */
    }
  };

  let isCanvasDown = false;
  const handleCanvasDown = (options) => {
    console.log(options);
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
      case "MagicWand":
        handleSmartpenDown(options);
        break;
      case "AutoPoint":
        handleBoxingDown(options);
        break;
      case "BBox":
        handleBoxingDown(options);
        break;
      case "Polyline":
        handlePolylineDown(options);
        break;
      case "Polygon":
        handlePolygonDown(options);
        break;
      case "Point":
        handlePointDown(options);
        break;
      case "BrushPen":
        handleBrushDown(options);
        break;
      case "Cube":
        handle3DcubeDown(options);
        break;
      case "Segmentation":
        handleSegmentDown(options);
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
      case "MagicWand":
        handleSmartpenMove(options);
        break;
      case "AutoPoint":
        handleBoxingMove(options);
        break;
      case "BBox":
        handleBoxingMove(options);
        break;
      case "Polyline":
        handlePolylineMove(options);
        break;
      case "Polygon":
        handlePolygonMove(options);
        break;
      case "Point":
        handlePointMove(options);
        break;
      case "BrushPen":
        handleBrushMove(options);
        break;
      case "Cube":
        handle3DcubeMove(options);
        break;
      case "Segmentation":
        handleSegmentMove(options);
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
      case "MagicWand":
        handleSmartpenUp(options);
        break;
      case "AutoPoint":
        handleAutopointUp(options);
        break;
      case "BBox":
        handleBoxingUp(options);
        break;
      case "Polyline":
        handlePolylineUp(options);
        break;
      case "Polygon":
        handlePolygonUp(options);
        break;
      case "Point":
        handlePointUp(options);
        break;
      case "BrushPen":
        handleBrushUp(options);
        break;
      case "Cube":
        handle3DcubeUp(options);
        break;
      case "Segmentation":
        handleSegmentUp(options);
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
    console.log(options.target);
    /* options.target.cornerStyle = "circle";
    options.target.cornerColor = "red"; */
    setIsSelectObjectOn(() => true);
    let object = null;
    for(let i = 0; i < currentObjectItem.current.length; i++) {
      if(currentObjectItem.current[i].object.id === options.target.id) {
        object = currentObjectItem.current[i].object;
        //! Object 선택시 Instance 클래스 셋팅 
        setInstance(pCategories.current.find(element => element.annotation_category_id === currentObjectItem.current[i].annotation.annotation_category.annotation_category_id));
      }
    }
    setSelectedObject(() => options.target);
    setObjectType(() => options.target.type);
    setSelectedObjectId(() => options.target.id);
  };

  const handleDeSelectObject = (options) => {
    if(!options.target) return;
    console.log("deselcet");
    //setInstance(null);
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
    //console.log(options.target);
    if(options.target.type === "rect") {
      if(options.target.left <= 0) options.target.left = 0;
      if(options.target.top <= 0) options.target.top = 0;
      if(options.target.left + options.target.width >= currentTask.current.imageWidth) options.target.left = currentTask.current.imageWidth - options.target.width - options.target.strokeWidth - 1;
      if(options.target.top + options.target.height >= currentTask.current.imageHeight) options.target.top = currentTask.current.imageHeight - options.target.height - options.target.strokeWidth - 1;
      if(options.target.width >= currentTask.current.imageWidth) options.target.width = currentTask.current.imageWidth - options.target.strokeWidth;
      if(options.target.height >= currentTask.current.imageHeight) options.target.height = currentTask.current.imageHeight - options.target.strokeWidth;
      options.target.left = Math.floor(options.target.left);
      options.target.top = Math.floor(options.target.top);
      options.target.width = Math.floor(options.target.width);
      options.target.height = Math.floor(options.target.height);
      setInstanceWidth(() => options.target.width * options.target.scaleX);
      setInstanceHeight(() => options.target.height * options.target.scaleY);
      setPositionX(() => options.target.left);
      setPositionY(() => options.target.top);
      
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2;
          item.idTag.left = options.target.left + item.idTag.padding;
          item.idTag.top = options.target.top > item.idTag.height ? options.target.top - item.idTag.height - item.idTag.padding : options.target.top + item.idTag.padding;
          currentObjectItem.current[i].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
        }
      }
    } else if(options.target.type === "Polygon" || options.target.type === "Segmentation" || options.target.type === "Polyline") {
      if(options.target.left <= 0) options.target.left = 0;
      if(options.target.top <= 0) options.target.top = 0;
      if(options.target.left + options.target.width >= currentTask.current.imageWidth) options.target.left = currentTask.current.imageWidth - options.target.width - options.target.strokeWidth - 1;
      if(options.target.top + options.target.height >= currentTask.current.imageHeight) options.target.top = currentTask.current.imageHeight - options.target.height - options.target.strokeWidth - 1;

      options.target.left = Math.floor(options.target.left);
      options.target.top = Math.floor(options.target.top);
      options.target.width = Math.floor(options.target.width);
      options.target.height = Math.floor(options.target.height);

      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2;
          item.idTag.left = options.target.left + item.idTag.padding;
          item.idTag.top = options.target.top > item.idTag.height ? options.target.top - item.idTag.height - item.idTag.padding : options.target.top + item.idTag.padding;
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
      if(options.target.left - options.target.radius <= 0) options.target.left = 0 + options.target.radius;
      if(options.target.top - options.target.radius <= 0) options.target.top = 0 + options.target.radius;
      if(options.target.left + options.target.radius >= currentTask.current.imageWidth) options.target.left = currentTask.current.imageWidth - options.target.radius - options.target.strokeWidth - 1;
      if(options.target.top + options.target.radius >= currentTask.current.imageHeight) options.target.top = currentTask.current.imageHeight - options.target.radius - options.target.strokeWidth - 1;

      options.target.left = Math.floor(options.target.left);
      options.target.top = Math.floor(options.target.top);
      options.target.width = Math.floor(options.target.width);
      options.target.height = Math.floor(options.target.height);

      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2;
          item.idTag.left = options.target.left > currentTask.current.imageWidth - item.idTag.width ? options.target.left - item.idTag.padding - item.idTag.width - options.target.radius : options.target.left + item.idTag.padding + options.target.radius;
          item.idTag.top = options.target.top > item.idTag.height ? options.target.top - item.idTag.height - item.idTag.padding - options.target.radius : options.target.top + item.idTag.padding + options.target.radius;
          currentObjectItem.current[i].annotation.annotation_data = [
            options.target.left,
            options.target.top,
            options.target.width,
            options.target.height,
          ];
        }
      }      
    } else if (options.target.tool === "KeyPoint") {
      // Todo: tag, idTag 위치 조정 필요
      const p = options.target;
      const mat = p.group.calcTransformMatrix();

      if(p.left + mat[4] <= 0) p.left = 0 - mat[4];
      if(p.top + mat[5] <= 0) p.top = 0 - mat[5];
      if(p.left + mat[4] >= currentTask.current.imageWidth) p.left = currentTask.current.imageWidth - mat[4] - 1;
      if(p.top + mat[5] >= currentTask.current.imageHeight) p.top = currentTask.current.imageHeight - mat[5] - 1;

      p.left = Math.floor(p.left);
      p.top = Math.floor(p.top);

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
      // Todo: tag, idTag 위치 조정 필요
      const p = options.target;
      const mat = p.group.calcTransformMatrix();

      if(p.left + mat[4] <= 0) p.left = 0 - mat[4];
      if(p.top + mat[5] <= 0) p.top = 0 - mat[5];
      if(p.left + mat[4] >= currentTask.current.imageWidth) p.left = currentTask.current.imageWidth - mat[4] - 1;
      if(p.top + mat[5] >= currentTask.current.imageHeight) p.top = currentTask.current.imageHeight - mat[5] - 1;

      p.left = Math.floor(p.left);
      p.top = Math.floor(p.top);

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
    console.log(options);
    if(options.target.type === "rect") {
      if(options.target.left <= 0) options.target.left = 0;
      if(options.target.top <= 0) options.target.top = 0;
      if(options.target.left + options.target.width >= currentTask.current.imageWidth) options.target.left = currentTask.current.imageWidth - options.target.width - options.target.strokeWidth - 1;
      if(options.target.top + options.target.height >= currentTask.current.imageHeight) options.target.top = currentTask.current.imageHeight - options.target.height - options.target.strokeWidth - 1;
      /* if(options.target.width >= currentTask.current.imageWidth) {
        options.target.left = 0;
        options.target.width = currentTask.current.imageWidth - options.target.strokeWidth - 1;
      }
      if(options.target.height >= currentTask.current.imageHeight) {
        options.target.top = 0;
        options.target.height = currentTask.current.imageHeight - options.target.strokeWidth - 1;
      } */

      options.target.left = Math.floor(options.target.left);
      options.target.top = Math.floor(options.target.top);
      options.target.width = Math.floor(options.target.width);
      options.target.height = Math.floor(options.target.height);

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
            options.target.left + options.target.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2;
          item.idTag.left = options.target.left + item.idTag.padding;
          item.idTag.top = options.target.top > item.idTag.height ? options.target.top - item.idTag.height - item.idTag.padding : options.target.top + item.idTag.padding;
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
    if(options.target.type === "rect") {
      if(options.target.left <= 0) options.target.left = 0;
      if(options.target.top <= 0) options.target.top = 0;
      if(options.target.left + options.target.width >= currentTask.current.imageWidth) options.target.left = currentTask.current.imageWidth - options.target.width - options.target.strokeWidth;
      if(options.target.top + options.target.height >= currentTask.current.imageHeight) options.target.top = currentTask.current.imageHeight - options.target.height - options.target.strokeWidth;
      /* if(options.target.width >= currentTask.current.imageWidth) {
        options.target.left = 0;
        options.target.width = currentTask.current.imageWidth - options.target.strokeWidth - 1;
      }
      if(options.target.height >= currentTask.current.imageHeight) {
        options.target.top = 0;
        options.target.height = currentTask.current.imageHeight - options.target.strokeWidth - 1;
      } */

      options.target.left = Math.floor(options.target.left);
      options.target.top = Math.floor(options.target.top);
      options.target.width = Math.floor(options.target.width);
      options.target.height = Math.floor(options.target.height);

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
            options.target.left + options.target.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2;
          item.idTag.left = options.target.left + item.idTag.padding;
          item.idTag.top = options.target.top > item.idTag.height ? options.target.top - item.idTag.height - item.idTag.padding : options.target.top + item.idTag.padding;
          currentObjectItem.current[i].annotation.annotation_data = [
            coords.left,
            coords.top,
            coords.width,
            coords.height,
          ];
        }
      }
    }
    if(options.target.type === "Polygon" || options.target.type === "Segmentation" || options.target.type === "Polyline") {
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        if (currentObjectItem.current[i].object.id === options.target.id) {
          let item = currentObjectItem.current[i];
          item.tag.left =
            options.target.left + options.target.width / 2;
          item.tag.top =
            options.target.top + options.target.height / 2;
          item.idTag.left = options.target.left + item.idTag.padding;
          item.idTag.top = options.target.top > item.idTag.height ? options.target.top - item.idTag.height - item.idTag.padding : options.target.top + item.idTag.padding;
          console.log(currentObjectItem.current[i]);
        }
      }
    }
  };

  useEffect(() => {
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
      currentSelectedObject.current = selectedObject;
      console.log(selectedObject);
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

  // ! Download coco
  /* const handleDownloadCoco = () => {
    if (selectedTask && currentDataURL && canvas) {
      let datas = [];
      for (let i = 0; i < ObjectListItem.length; i++) {
        datas.push(ObjectListItem[i].annotation);
      }
      let data = JSON.stringify(datas);
      const a = document.createElement("a");
      let file = new Blob([data], { type: "text/plain" });
      a.href = URL.createObjectURL(file);
      a.download = selectedTask.imageName + ".json";
      a.click();
    }
  }; */

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

  // ! Download image + json
  /* const handleDownloadJsonSet = () => {
    if (selectedTask && currentDataURL && canvas) {
      // Todo: ProjectName, TaskName, Class 선택 기능 추가 예정
      const datas = [];
      for (let i = 0; i < ObjectListItem.length; i++) {
        datas.push(ObjectListItem[i].annotation);
      }
      const jsonData = JSON.stringify(datas);
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
  }; */

  // ! Toggle full screen
  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // ! Toggle Hot Key Guide
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
    console.log("undo: " + hPointer.current);
    if (selectedTask) {
      if(hPointer.current <= 0) return;
      selectHistory(hPointer.current - 1);
    }
  };

  // ! Redo
  const handleRedo = () => {
    if (selectedTask) {
      if(hPointer.current === canvasHistory.length - 1) return;
      selectHistory(hPointer.current + 1);
    }
  };

  // ! Save (Update)
  const saveStatus = async (status: number) => {
    if (selectedTask && status === 2 && selectedTask.taskStatus === 3) {
      toast({
        title: "완료된 작업은 진행중으로 되돌릴 수 없습니다.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    const toastCheck = status;
    if (status === 22) status = 2;

    if (pId && selectedTask) {
      //const currentStep = selectedTask.taskStep;
      const currentStep = currentTask.current.taskStep;
      if (currentStep === 2) {
        if (!loggedInUser.isAdmin && !selectedTask.taskValidator) {
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
          !loggedInUser.isAdmin && 
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
      const save = await saveData();
      if(save) {
        setObjectId(0);
        toast({
          title: "작업 데이터 저장 완료",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        const res = await taskApi.updateTaskStatus(
          { 
            project_id: parseInt(pId), 
            task_id: selectedTask.taskId 
          },
          {
            task_status_progress: status,
            comment_body: '',
          },
          loggedInUser.accessToken!
        );
        if (res && res.status === 200) {
          if(toastCheck === 22){
            toast({
              title: "작업 완료 취소",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          } else {
            toast({
              title: "작업 저장 완료",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }
          if (status === 3) {
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
                if(!isActiveOD || !isActiveISES) checkAutoLabelingOn();
                break;
            }
          } else {
            setSelectedTask((prev) => ({
              ...prev!,
              taskStatus: status,
            }));
          }
          console.log("1");
          searchTasks({
            project_id: pId,
            orderBy: "task_id",
            order: "ASC",
            maxResults: 10000,
          });
        } 
        /* setTimeout(() => {
          window.location.reload();
        }, 2000); */
        setCanvasImage();
      } else {
        toast({
          title: "작업 데이터 저장중 오류 발생",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };
  const saveData = async () => {
    if((!currentObjectItem.current || currentObjectItem.current.length === 0) && currentDeleteIDList.current.length === 0) {
      toast({
        title: "변경된 데이터가 없습니다.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return false;
    }
    if (pId && selectedTask) {
      let resDelete = false, resUpdate = false, resCreate = false;
      let resDeleteList = [], resUpdateList = [], resCreateList = [];
      for (let i = 0; i < currentDeleteIDList.current.length; i++) {
        const res = await labelingApi.deleteAnnotation(
          {
            project_id: parseInt(pId), 
            task_id: selectedTask.taskId,
            annotation_id: currentDeleteIDList.current[i],
          }
        );
        if(res) resDeleteList.push({ action: "delete", annotation_id: currentDeleteIDList.current[i], status: res.status });
        if(res && res.status ===200) {
          //resDelete = true;
        } else {}
      }
      for (let i = 0; i < currentObjectItem.current.length; i++) {
        let data = currentObjectItem.current[i].annotation;
        data.created = null;
        data.updated = null;
        console.log(data);
        if (data.annotation_id) {
          const res = await labelingApi.updateAnnotation(
            {
              project_id: parseInt(pId), 
              task_id: selectedTask.taskId,
            }, 
            data
          );
          if(res) resUpdateList.push({ action: "update", annotation_id: data.annotation_id, status: res.status });
          if(res && res.status ===200) {
            //resUpdate = true;
          } else {}
        } else {
          const res = await labelingApi.createAnnotation(
            {
              project_id: parseInt(pId), 
              task_id: selectedTask.taskId,
            },
            data
          );
          if(res) resCreateList.push({ action: "create", annotation_id: currentObjectItem.current[i].object.id, status: res.status });
          if(res && res.status === 200) {
            //resCreate = true;
            currentObjectItem.current[i].annotation.annotation_id = res.data.annotation_id;
          } else {}
        }
      }
      console.log(resDeleteList);
      console.log(resUpdateList);
      console.log(resCreateList);
      resDeleteList.forEach((element, index) => {
        if(element.status === 200) {
          if(index === resDeleteList.length - 1) resDelete = true;
        } else {
          toast({
            title: "ID: " + element.annotation_id + " 데이터 삭제가 실패했습니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      });
      resUpdateList.forEach((element, index) => {
        if(element.status === 200) {
          if(index === resUpdateList.length - 1) resUpdate = true;
        } else {
          toast({
            title: "ID: " + element.annotation_id + " 데이터 수정이 실패했습니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      });
      resCreateList.forEach((element, index) => {
        if(element.status === 200) {
          if(index === resCreateList.length - 1) resCreate = true;
        } else {
          toast({
            title: "ID: " + element.annotation_id + " 데이터 생성이 실패했습니다.",
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      });
      console.log(resDelete || resUpdate|| resCreate);
      return (resDelete || resUpdate|| resCreate);
    } else {
      return false;
    }
  };

  useEffect(() => {
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
            canvas.remove(currentObjectItem.current[i].tag);
            canvas.remove(currentObjectItem.current[i].idTag);
            /* canvas.remove(currentObjectItem.current[i].idTag.getObjects()[0]);
            canvas.remove(currentObjectItem.current[i].idTag.getObjects()[1]); */
            if (currentSelectedObject.current.tool === "KeyPoint" || currentSelectedObject.current.tool === "Cube") {
              currentSelectedObject.current.getObjects().forEach((item) => {
                canvas.remove(item.line1);
                canvas.remove(item.line2);
                canvas.remove(item.line3);
                canvas.remove(item.line4);
                canvas.remove(item.line5);
                canvas.remove(item.line6);
                canvas.remove(item);
              });
            } else {
              canvas.remove(currentSelectedObject.current);
            }
            currentObjectItem.current.splice(i, 1);
            addHistoryItem("Instance 삭제");
            for(let j=i; j<currentObjectItem.current.length; j++){
              currentObjectItem.current[j].object.id = j;
              currentObjectItem.current[j].idTag.text = "ID: " + j;
              /* currentObjectItem.current[j].idTag.getObjects()[1].text = "ID: " + j; */
            }
            setObjectId(() => currentObjectItem.current.length);
            canvas.renderAll();
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
          canvas.remove(currentObjectItem.current[i].tag);
          canvas.remove(currentObjectItem.current[i].idTag);
          /* canvas.remove(currentObjectItem.current[i].idTag.getObjects()[0]);
          canvas.remove(currentObjectItem.current[i].idTag.getObjects()[1]); */
          if(currentObjectItem.current[i].object.tool === "Cube" || currentObjectItem.current[i].object.tool === "KeyPoint") {
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
          addHistoryItem("Instance 삭제");
          for(let j=i; j<currentObjectItem.current.length; j++){
            currentObjectItem.current[j].object.id = j;
            currentObjectItem.current[j].idTag.text = "ID: " + j;
            /* currentObjectItem.current[j].idTag.getObjects()[1].text = "ID: " + j; */
          }
          setObjectId(() => currentObjectItem.current.length);
          canvas.renderAll();
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
      let zoom = currentZoom.current;
      zoom *= 0.999 ** delta;
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
  }, [objectId]);

  const resetAutoTools = () => {
    setIsHDOnOff(() => false);
    setIsODOnOff(() => false);
    setIsISOnOff(() => false);
    setIsSESOnOff(() => false);
  }
  const resetTools = (tool: string) => {
    canvas.defaultCursor = "default";
    canvas.hoverCursor = "crosshair";
    canvas.discardActiveObject();
    if(canvas.isDrawingMode) {
      setDrawingMode();
    }
    setIsBrushOpen(false);
    setIsAutopointOpen(false);
    setIsKeypointOpen(false);
    setIsMoveOnOff(() => tool === "move");
    setIsSmartpenOnOff(() => tool === "MagicWand");
    setIsAutopointOnOff(() => tool === "AutoPoint");
    setIsBoxingOnOff(() => tool === "BBox");
    setIsPolylineOnOff(() => tool === "Polyline");
    setIsPolygonOnOff(() => tool === "Polygon");
    setIsPointOnOff(() => tool === "Point");
    setIsBrushOnOff(() => tool === "Brush");
    setIs3DcubeOnOff(() => tool === "Cube");
    setIsSegmentOnOff(() => tool === "Segmentation");
    setIsKeypointOnOff(() => tool === "KeyPoint");
    if(tool === "") setSelectedTool(() => "");
    if(tool !== "MagicWand") setimgInfo(() => null);
    if(tool !== "AutoPoint") {
      setIsAutopointBBoxOn(false);
      setIsAutopointPolygonOn(false);
    }
    if(tool !== "Brush") {
      setIsBrushCircleOn(false);
      setIsBrushSquareOn(false);
    }
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
    //setInstanceClass(() => "");
    //setInstanceAttr(()  => []);
    setObjectId(() => 0);
    setObjectListItem(() => []);
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
        canvas.remove(ObjectListItem[i].idTag);
        canvas.remove(ObjectListItem[i].object);
      }
    }
    for (let i = 0; i < ObjectListItem.length; i++) {
      if (ObjectListItem[i].object.tool === tool) {
        ObjectListItem.splice(i, 1);
      }
    }
  }

  const [isAddHistory, setIsAddHistory] = useState<boolean>(false);
  const isAdd = useRef(isAddHistory);
  useEffect(() => {
    isAdd.current = isAddHistory;
  }, [isAddHistory]);

  const TextboxWithPadding = fabric.util.createClass(fabric.Textbox, {
    _renderBackground: function(ctx) {
      if (!this.backgroundColor) {
        return;
      }
      const dim = this._getNonTransformedDimensions();
      ctx.fillStyle = this.backgroundColor;
  
      ctx.fillRect(
        -dim.x / 2 - this.padding,
        -dim.y / 2 - this.padding,
        dim.x + this.padding * 2,
        dim.y + this.padding * 2
      );
      // if there is background color no other shadows
      // should be casted
      this._removeShadow(ctx);
    }
  });

  // space bar 줄바꿈 이슈로 인해 Textbox => Text 변경
  fabric.TextboxWithPadding = fabric.util.createClass(fabric.Text, {
    type: 'textboxwithpadding',
  
    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        backgroundColor: this.get('backgroundColor'),
        padding: this.get('padding'),
      });
    },
  
    _renderBackground: function(ctx) {
      if (!this.backgroundColor) {
        return;
      }
      var dim = this._getNonTransformedDimensions();
      ctx.fillStyle = this.backgroundColor;
  
      ctx.fillRect(
        -dim.x / 2 - this.padding,
        -dim.y / 2 - this.padding,
        dim.x + this.padding * 2,
        dim.y + this.padding * 2
      );
      // if there is background color no other shadows
      // should be casted
      this._removeShadow(ctx);
    }
  });

  const setObjectItem = (object: fabric.Object, tagText: fabric.Text, annotation: any, iId: number, objArr?: any[]) => {
    let itemId = iId;
    if(!itemId)
      itemId = currentObjectId.current;
    const optionTag = {
      fill: '#ffffff',
      backgroundColor: annotation.annotation_category.annotation_category_color,
      fontFamily: 'Comic Sans',
      fontSize: 10 * (1 / iRatio.current),
      padding: 5,
      visible: isTag.current,
      selectable: false,
      originX: "center",
      originY: "center"
    };
    //let tag = new fabric.Text(annotation.annotation_category.annotation_category_name, optionTag);
    const tag = new fabric.TextboxWithPadding(annotation.annotation_category.annotation_category_name, optionTag);
    /* tag.set('top', object.top + object.height / 2 - tag.height / 2);
    tag.set('left', object.left + object.width / 2 - tag.width / 2); */
    tag.set('top', object.top + object.height / 2);
    tag.set('left', object.left + object.width / 2);


    const optionId = {
      fill: '#ffffff',
      backgroundColor: annotation.annotation_category.annotation_category_color,
      fontFamily: 'Comic Sans',
      padding: 5,
      fontSize: 10 * (1 / iRatio.current),
      selectable: false,
    };
    const idTag = new fabric.TextboxWithPadding("ID : " + itemId, optionId);
    /* idTag.set('width', idTag.width + 20);  // + 50);
    idTag.set('height', idTag.height + 10);  // + 50); */
    let idTop = object.top > idTag.height ? object.top - idTag.height - idTag.padding : object.top + idTag.padding;
    idTag.set('top', idTop);
    idTag.set('left', object.left + idTag.padding);

    if(object.tool === "Point") {
      const idLeft = object.left > currentTask.current.imageWidth - idTag.width ? object.left - idTag.padding - idTag.width - object.radius : object.left + idTag.padding + object.radius;
      idTop = object.top > idTag.height ? object.top - idTag.height - idTag.padding - object.radius : object.top + idTag.padding + object.radius;
      tag.set('top', object.top + object.height / 2 + object.radius);
      tag.set('left', object.left - tag.width / 2);
      idTag.set('top', idTop);
      idTag.set('left', idLeft);
    }

    if(object.tool !== "KeyPoint" && object.tool !== "Cube") {
      object.cornerStyle = "circle";
      object.cornerColor = "red";
      object.hasBorders = false;
      object.strokeWidth = 2 * (1 / iRatio.current);
      object.on('selected', handleSelectObject);
      object.on('deselected', handleDeSelectObject);
    }

    const ObjectItem = {
      idTag: idTag,
      object: object, 
      tag: tag,
      annotation: annotation,
      origin: { originLeft: object.left, originTop: object.top },
      objArr: objArr,
    };
    setIsAddHistory(() => true);
    setObjectListItem(ObjectListItem => [...ObjectListItem, ObjectItem]);
  };

  useEffect(() => {
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
      clearCanvasObjects();
      ObjectListItem.forEach(element => {
        canvas.add(element.tag);
        canvas.add(element.idTag);
        if(element.object.tool !== "Cube" && element.object.tool !== "KeyPoint") {
          canvas.add(element.object);
        } else {
          element.objArr.forEach(object => {canvas.add(object);});
        }
        //canvas.renderAll();
      });
      setObjectId(ObjectListItem.length);
      canvas.renderAll();
      if(isAddHistory) {
        if(isLoadHistory) {
          addHistoryItem("Instance 불러오기");
          setIsLoadHistory(false);
        } else {
          addHistoryItem(ObjectListItem[ObjectListItem.length - 1].object.tool + " Instance 추가");
        }
        setIsAddHistory(() => false);
      }
      console.log(ObjectListItem);
    }
  }, [ObjectListItem]);

  const clearCanvasObjects = () => {
    const objects = canvas.getObjects();
    objects.forEach(element => {
      canvas.remove(element);
    });
    canvas.renderAll();
  };

  const historyId = useRef<number>(0);
  const lastHistory = useRef<number>(0);
  const [isEditHistory, setIsEditHistory] = useState<boolean>(false);
  const historyState = useRef(isEditHistory);

  useEffect(() => {
    historyState.current = isEditHistory;
  }, [isEditHistory]);

  const addHistoryItem = (title: string) => {  
    if(historyState.current) {
      setCanvasHistory(canvasHistory.filter((element, index) => {return index < historyId.current}));
    }

    const now = new Date();
    const hData: ICanvasHistory = {
      order: historyId.current,
      title: title,
      date: now.getFullYear() + "." + now.getMonth() + "." + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
      data: canvas.toDatalessJSON(['id', 'tool']),
      objects: currentObjectItem.current,
    }
    setCanvasHistory(canvasHistory => [...canvasHistory, hData]);
  };

  useEffect(() => {
    historyId.current = canvasHistory.length;
    lastHistory.current = canvasHistory.length;
    setHistoryPointer(canvasHistory.length - 1);
    setIsEditHistory(false);
    if(canvasHistory && canvasHistory.length > 0) {
      for(let i = 0; i < canvasHistory.length; i++){
        const item = document.getElementById("history" + i);
        if(item)
          item.style.color = "#000000";
      }
    }
  }, [canvasHistory]);

  useEffect(() => {
  }, [canvasHistory.length]);

  const selectHistory = (index: number) => {
    setHistoryPointer(index);
    if(canvasHistory === undefined || historyId.current === (index + 1)) {
      setIsEditHistory(false);
      return;
    }
    if(index !== canvasHistory.length - 1) {
      historyId.current = index + 1;
      setIsEditHistory(true);
    }
    for(let i = 0; i < canvasHistory.length; i++){
      const item = document.getElementById("history" + i);
      let color = "#000000";
      if(i <= index)
        color = "#000000";
      else 
        color = "#999999";
      if(item)
        item.style.color = color;
    }
    setObjectListItem(canvasHistory[index].objects);
  };

  useEffect(() => {
  }, [historyId.current]);

  //**! download */
  const checkIsDownload = () => {
    setIsDownloadOnOff((prev) => !prev);
  };
  const onCancelDownload = () => {
    setIsDownloadOnOff(false);
    setDownload(() => "");
    setSelectDownload(() => "");
  };
  const onSubmitDownload = async () => {
    const res = await saveData();
    if(res) {
      switch(isDownload) {
        case "coco":
          //handleDownloadCoco(); // Local
          handleDownload(false, true, "COCO");
          break;
        case "yolo":
          // Todo : Backend
          //handleDownload(false, true, "YOLO");
          break;
        case "image":
          //handleDownloadImage("image");   // Local
          handleDownload(true, false, "COCO");
          break;
        case "label":
          handleDownloadImage("label");   // Local
          break;
        case "json":
          // Todo: JSON + 원본 이미지 Set
          //handleDownloadJsonSet();    // Local
          handleDownload(true, true, "COCO");
          break;
      }
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
  
  const handleDownload = async (isImage: boolean, isAnnotation: boolean, format: any) => {
    const res = await labelingApi.exportAnnotation(
      {
        source_project_id: parseInt(pId),
        task_ids: [selectedTask.taskId],
        include_data: isImage,
        include_annotation: isAnnotation,
        annotation_format: format,
        /* filter_category_ids: classIds,
        filter_category_attribute_select_or_input_values: values, */
      },
      "blob"
    );

    if (res && res.status === 200) {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/zip" })
      );
      saveAs(url, projectInfo.projectName + "_" + pId + "_" + selectedTask.taskId + ".zip");
    }
  }

  //**! resize  */
  const handleResizing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResizingVal(e.target.value);
    zoomAdjustment(e.target.value);
  };

  useEffect(() => {
    currentResizingVal.current = resizingVal;
  }, [resizingVal]);

  const zoomAdjustment = (value: string) => {
    if(canvas) {
      let zoom = parseInt(value);
      if(zoom < 10) zoom = 10;
      zoom *= currentImage.current.ratio;
      let width = currentImage.current.width * (zoom / 100);
      let height = currentImage.current.height * (zoom / 100);
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setZoom(zoom / 100);
    }
  };

  //**! move */
  const checkIsMove = () => {
    if(currentTool.current === "move") {
      resetTools("");
    } else {
      resetTools("move");
    }
    //resetTools("move");
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
      for (let i = 0; i < ObjectListItem.length; i++) {
        ObjectListItem[i].tag.visible = false;
      }
    } else {
      for (let i = 0; i < ObjectListItem.length; i++) {
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
    isClassOnOff.current = isClassOn;
    if(isClassOn){
      if(!selectedObject && ObjectListItem.length > 0) {
        //! useState -> 2번 동작 필요
        //setIsClass(0);
      }
    } else {
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
      //setIsClassOnOff((prev) => !prev);
      setInstanceId(() => -1);
      setInstance(null);
      canvas.discardActiveObject();
      canvas.renderAll();
    } else {
      /* if(currentInstanceId.current === -1) {
        setIsClassOnOff((prev) => !prev);
      } */
      const object = ObjectListItem[index].object;
      if(object) {
        setSelectedObject(() => object);
        setSelectedObjectId(() => object.id);
        setInstanceId(() => index);
        setInstance(pCategories.current.find(element => element.annotation_category_id === currentObjectItem.current[index]?.annotation?.annotation_category.annotation_category_id));
        canvas.setActiveObject(object);
        canvas.renderAll();
      }
    }
  };
  
  const setAnnotationClass = (item) => {
    setInstance(() => item);
    if(currentSelectedObject.current){
      currentObjectItem.current.forEach(element => {
        if(element.object.id === currentSelectedObject.current.id) {
          const category = element.annotation.annotation_category;
          category.annotation_category_id = item.annotation_category_id;
          category.annotation_category_name = item.annotation_category_name;
          category.annotation_category_color = item.annotation_category_color;
          element.object.stroke = item.annotation_category_color;
          element.object.color = item.annotation_category_color;
          element.tag.text = item.annotation_category_name;
          element.tag.backgroundColor = item.annotation_category_color;
          /* element.tag.left =
            element.object.left + (element.object.width / 2) - (element.tag.width / 2); */
          /* element.tag.top =
            element.object.top + element.object.height / 2 - element.tag.height / 2;
          element.tag.center(element.object); */
          element.tag.text = element.tag.text;
          element.idTag.backgroundColor = item.annotation_category_color;
          if(element.object.type === "Segmentation")
            element.object.fill = item.annotation_category_color + "4D";
          if(element.object.type === "Polygon")
            element.object.fill = item.annotation_category_color + "01";
          /* const objs = canvas.getObjects();
          objs.forEach(el => {
            if(el.id === element.object.id) {
              el.color = item.annotation_category_color;
            }
          }); */
          console.log(element);
          canvas.renderAll();
        }
      });
    }
  };

  useEffect(() => {
    //if(canvas) console.log(canvas.getObjects());
  }, [instance]);

  const [multiSelectAttrs, setMultiSelectAttrs] = useState<string[]>([]);

  const setAnnotationAttr = (attr: any, attrId: number, item: any) => {
    if(!instance) return;
    if(currentSelectedObject.current){
      currentObjectItem.current.forEach(element => {
        if(element.object.id === currentSelectedObject.current.id){
          const category = element.annotation.annotation_category;
          let valItem = [];
          if (attr.annotation_category_attr_type === 1) {
            valItem = [item];
          } else if (attr.annotation_category_attr_type === 2) {
            const min = instance.annotation_category_attributes[attrId].annotation_category_attr_limit_min;
            const max = instance.annotation_category_attributes[attrId].annotation_category_attr_limit_max;

            if(!category.annotation_category_attributes[attrId] || 
              !category.annotation_category_attributes[attrId].annotation_category_attr_val_select || 
              category.annotation_category_attributes[attrId].annotation_category_attr_val_select.length === 0) {
              valItem = [item];
            } else {
              if(category.annotation_category_attributes[attrId].annotation_category_attr_val_select.includes(item)) {
                if (category.annotation_category_attributes[attrId].annotation_category_attr_val_select.length <= min) {
                  toast({
                    title: min + "개 이상 선택해주세요.",
                    status: "error",
                    position: "top",
                    duration: 2000,
                    isClosable: true,
                  });
                  return;
                } else {
                  valItem = category.annotation_category_attributes[attrId].annotation_category_attr_val_select.filter(element => element !== item);
                  setMultiSelectAttrs(multiSelectAttrs.filter(element => element !== item));
                }
              } else {
                if (category.annotation_category_attributes[attrId].annotation_category_attr_val_select.length >= max) {
                  toast({
                    title: max + "개 이하로 선택해주세요.",
                    status: "error",
                    position: "top",
                    duration: 2000,
                    isClosable: true,
                  });
                  return;
                } else {
                  valItem = [...category.annotation_category_attributes[attrId].annotation_category_attr_val_select, item];
                  setMultiSelectAttrs(multiSelectAttrs => [...multiSelectAttrs, item]);
                }
              }
            }
          } else if (attr.annotation_category_attr_type === 3 || attr.annotation_category_attr_type === 4) {
            if(!category.annotation_category_attributes[attrId] || 
              !category.annotation_category_attributes[attrId].annotation_category_attr_val_input || 
              category.annotation_category_attributes[attrId].annotation_category_attr_val_input.length === 0) {
              valItem = [item];
            } else {
              if(category.annotation_category_attributes[attrId].annotation_category_attr_val_input.includes(item)) {
                toast({
                  title: "중복된 속성값입니다.",
                  status: "error",
                  position: "top",
                  duration: 2000,
                  isClosable: true,
                });
                return;
              } else {
                if (category.annotation_category_attributes[attrId].annotation_category_attr_val_input.length >= 100) {
                  toast({
                    title: "100개 이하로 입력해주세요.",
                    status: "error",
                    position: "top",
                    duration: 2000,
                    isClosable: true,
                  });
                  return;
                } else {
                  valItem = [...category.annotation_category_attributes[attrId].annotation_category_attr_val_input, item];
                }
              }
            }
          }
          let attribute = {
            annotation_category_attr_name: attr.annotation_category_attr_name,
            annotation_category_attr_type: attr.annotation_category_attr_type,
            annotation_category_attr_val: valItem,
            annotation_category_attr_id: attr.annotation_category_attr_id,
            annotation_category_attr_val_select: (attr.annotation_category_attr_type === 1 || attr.annotation_category_attr_type === 2)? valItem : null,
            annotation_category_attr_val_input: (attr.annotation_category_attr_type === 3 || attr.annotation_category_attr_type === 4)? valItem : null,
          };

          //! 현재 팝업에 표시되는 순서대로 attrId 값을 통해 고정 위치에 데이터 처리 ==> ex) attrId: 2일 경우, [0], [1] 공간이 비어있고 [2]번에 데이터 처리
          //! 데이터 처리가 꼬이는 현상 발생하는지 확인 필요 ==> 서버에 저장 및 불러오기 시
          // Todo: 서버 통신에 문제 발생할 경우 추후 수정 필요 ==> 
          // Todo: 1) category.annotation_category_attributes === null || length === 0 일 경우 초기값 추가
          // Todo: 2) category.annotation_category_attributes 에 attr.annotation_category_attr_id 일치하는 데이터 없을 경우 데이터 추가
          // Todo: 3) category.annotation_category_attributes[i].annotation_category_attr_id === attr.annotation_category_attr_id 이면 데이터 변경
          //if(category.annotation_category_attributes.length > attrId){
            category.annotation_category_attributes[attrId] = attribute;
          /* } else {
            category.annotation_category_attributes.push(attribute);
          } */
        }
      });
    }
  };
  
  const removeInstanceAttr = (attr: any, attrId: number, item: any) => {
    if(!instance) return;
    if(currentSelectedObject.current){
      currentObjectItem.current.forEach(element => {
        if(element.object.id === currentSelectedObject.current.id){
          const category = element.annotation.annotation_category;
          let valItem = [];
          if(!category.annotation_category_attributes[attrId] || 
            !category.annotation_category_attributes[attrId].annotation_category_attr_val || 
            category.annotation_category_attributes[attrId].annotation_category_attr_val.length === 0) {
              return;
          }
          if(category.annotation_category_attributes[attrId].annotation_category_attr_val.includes(item)) {
            valItem = category.annotation_category_attributes[attrId].annotation_category_attr_val.filter(element => element !== item);
          }
          let attribute = {
            annotation_category_attr_name: attr.annotation_category_attr_name,
            annotation_category_attr_type: attr.annotation_category_attr_type,
            annotation_category_attr_val: valItem,
            annotation_category_attr_id: attr.annotation_category_attr_id,
            annotation_category_attr_val_select: attr.annotation_category_attr_val_select,
            annotation_category_attr_val_input: valItem,
          };
          category.annotation_category_attributes[attrId] = attribute;
          if(attr.annotation_category_attr_type === 3)
            setAttrNumList(attrNumList.filter((element) => element !== item));
          if(attr.annotation_category_attr_type === 4)
            setAttrTxtList(attrTxtList.filter((element) => element !== item));
        }
      });
    }
  };

  const [valAttrNum, setValAttrNum] = useState<number>();
  const [valAttrTxt, setValAttrTxt] = useState<string>("");

  const [attrNumList, setAttrNumList] = useState<number[]>([]);
  const [attrTxtList, setAttrTxtList] = useState<string[]>([]);
  const onChangeAttrNum = (e: any, max: number) => {
    const valNum = e.target.value;
    if(!valNum || valNum === "" || valNum.length > max) return;
    if(checkNum.test(valNum))
      setValAttrNum(parseInt(valNum));
    else {
      toast({
        title: "숫자만 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  };

  const onChangeAttrTxt = (e: any, max: number) => {
    const valTxt = e.target.value;
    if(!valTxt || valTxt === "" || valTxt.length > max) return;
    setValAttrTxt(valTxt);
  };

  const handleSetAttrNum = (attr: any, attrId: number, min: number, max: number) => {
    if(attrNumList.length >= 100){
      toast({
        title: "최대 100개까지 추가 가능합니다.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(valAttrNum.toString().length < min) {
      toast({
        title: min + "글자 이상 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(valAttrNum.toString().length > max) {
      toast({
        title: max + "글자 이하로 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setAttrNumList(attrNumList => [...attrNumList, valAttrNum]);
    setAnnotationAttr(attr, attrId, valAttrNum);
    setValAttrNum(null);
  };

  const handleRemoveAttrNum = (attr: any, attrId: number, item: any) => {
    //setAttrNumList(attrNumList.filter((element, elId) => elId !== index));
    removeInstanceAttr(attr, attrId, item);
  };

  useEffect(() => {

  }, [attrNumList]);

  const handleSetAttrTxt = (attr: any, attrId: number, min: number, max: number) => {
    if(attrTxtList.length >= 100){
      toast({
        title: "최대 100개까지 추가 가능합니다.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(valAttrTxt.length < min) {
      toast({
        title: min + "글자 이상 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if(valAttrTxt.length > max) {
      toast({
        title: max + "글자 이하로 입력해주세요.",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setAttrTxtList(attrTxtList => [...attrTxtList, valAttrTxt]);
    setAnnotationAttr(attr, attrId, valAttrTxt);
    setValAttrTxt(null);
  };

  const handleRemoveAttrTxt = (attr: any, attrId: number, item: any) => {
    //setAttrTxtList(attrTxtList.filter((element, elId) => elId !== index));
    removeInstanceAttr(attr, attrId, item);
  };

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
    setIsLoadHistory(false);
    setCanvasImage();
    setIsResetOnOff(false);
  };

  const AlertAutoLabelingOn = () => {
    toast({
      title: "AutoLabeling 활성화를 위해서는 4개 이상의 완료된 작업이 필요합니다.",
      status: "error",
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  };

  //**! HD */
  const checkIsHD = () => {
    if(isHDLabelingOn) {
      //resetTools();
      setIsHDOnOff((prev) => !prev);
    }
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
      setLoading(false);
      setIsAutoLabeling(false);
    }
    /* setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500); */
  }, [isHDOn]);

  //**! OD */
  const checkIsOD = () => {
    if(isActiveOD) {
      //resetTools("");
      setIsODOnOff((prev) => !prev);
    } else {
      if (isPopupOD) setIsPopupOD(false);
      setIsPopupOD((prev) => !prev);
      setIsPopupIS(() => false);
      setIsPopupSES(() => false);
      //AlertAutoLabelingOn();
    }
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isODOn) {
      clearAutoLabeling('OD');
      clearAutoLabeling('IS');
      clearAutoLabeling('SES');
      setIsISOnOff(() => false);
      setIsSESOnOff(() => false);
      getOD({
        project_id: pId,
        task_id: selectedTask.taskId,
        labeling_type: 1,
        //maxResults: 10000,
      });
    } else if (!isODOn) {
      clearAutoLabeling('OD');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
      setLoading(false);
      setIsAutoLabeling(false);
    }
    /* setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500); */
  }, [isODOn]);
  const closePopupOD = () => {
    setIsPopupOD((prev) => !prev);
  };

  //**! IS */
  const checkIsIS = () => {
    if(isActiveISES) {
      //resetTools("");
      setIsISOnOff((prev) => !prev);
    } else {
      if (isPopupIS) setIsPopupIS(false);
      setIsPopupIS((prev) => !prev);
      setIsPopupOD(() => false);
      setIsPopupSES(() => false);
      //AlertAutoLabelingOn();
    }
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isISOn) {
      clearAutoLabeling('OD');
      clearAutoLabeling('IS');
      clearAutoLabeling('SES');
      setIsODOnOff(() => false);
      setIsSESOnOff(() => false);
      getIS({
        project_id: pId,
        task_id: selectedTask.taskId,
        labeling_type: 2,
      });
    } else {
      clearAutoLabeling('IS');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
      setLoading(false);
      setIsAutoLabeling(false);
    }
    /* setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500); */
  }, [isISOn]);
  const closePopupIS = () => {
    setIsPopupIS((prev) => !prev);
  };

  //**! SES */
  const checkIsSES = () => {
    if(isActiveISES) {
      //resetTools("");
      setIsSESOnOff((prev) => !prev);
    } else {
      if (isPopupSES) setIsPopupSES(false);
      setIsPopupSES((prev) => !prev);
      setIsPopupOD(() => false);
      setIsPopupIS(() => false);
      //AlertAutoLabelingOn();
    }
  };
  useEffect(() => {
    setLoading(true);
    setIsAutoLabeling(true);
    if (isSESOn) {
      clearAutoLabeling('OD');
      clearAutoLabeling('IS');
      clearAutoLabeling('SES');
      setIsODOnOff(() => false);
      setIsISOnOff(() => false);
      getSES({
        project_id: pId,
        task_id: selectedTask.taskId,
        labeling_type: 3,
      });
    } else {
      clearAutoLabeling('SES');
      //isClassSettingOn = false;
      setIsClassOnOff(() => false);
      setLoading(false);
      setIsAutoLabeling(false);
    }
    /* setTimeout(() => {
      setLoading(false);
      setIsAutoLabeling(false);
    }, 1500); */
  }, [isSESOn]);
  const closePopupSES = () => {
    setIsPopupSES((prev) => !prev);
  };

  //**! smartpen */
  const currentImgInfo = useRef(imgInfo);

  useEffect(() => {
    currentImgInfo.current = imgInfo;
  }, [imgInfo]);

  const checkIsSmartpen = () => {
    resetTools("MagicWand");
    //setIsSmartpenOnOff(!isSmartpenOn);
  };
  const onCancelSmartpen = () => {
    setIsSmartpenOnOff(false);
  };

  useEffect(() => {
    if(isSmartpenOn && canvas) {
      setSelectedTool(() => "MagicWand");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      initSmartpen();
    } else if(!isSmartpenOn && canvas) {
      //dissSmartpen();
      mask = null;
      setimgInfo(null);
    }
  }, [isSmartpenOn]);

  useEffect(() => {
    smartpenThreshold.current = sliderValueSmartpen;
    //currentThreshold = sliderValueSmartpen;
  }, [sliderValueSmartpen]);

  const handleSmartpenDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    console.log(options);
    let pointer = canvas.getPointer(options);
    console.log(pointer);
    console.log(iRatio.current);
    startX = pointer.x * iRatio.current;
    startY = pointer.y * iRatio.current;
    //! canvas event handler
    if (options.e.button === 0) {
      //allowDraw = true;
      addMode = options.e.ctrlKey;
      console.log(addMode);
      downPoint = pointer;
      drawMask(Math.round(downPoint.x), Math.round(downPoint.y));
    } else { 
        //allowDraw = false;
        addMode = false;
        oldMask = null;
    }
  };
  const handleSmartpenMove = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    let nowX = pointer.x;
    let nowY = pointer.y;

    /* if (allowDraw) {
      var p = pointer;
      if (p.x != downPoint.x || p.y != downPoint.y) {
          var dx = p.x - downPoint.x,
              dy = p.y - downPoint.y,
              len = Math.sqrt(dx * dx + dy * dy),
              adx = Math.abs(dx),
              ady = Math.abs(dy),
              sign = adx > ady ? dx / adx : dy / ady;
          sign = sign < 0 ? sign / 5 : sign / 3;
          var thres = Math.min(Math.max(colorThreshold + Math.floor(sign * len), 1), 255);
          //var thres = Math.min(colorThreshold + Math.floor(len / 3), 255);
          if (thres != currentThreshold) {
              currentThreshold = thres;
              drawMask(downPoint.x, downPoint.y);
          }
      }
    } */
  };
  const handleSmartpenUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;

    //allowDraw = false;
    addMode = false;
    oldMask = null;
    //currentThreshold = colorThreshold;
  };

  const drawMask= (x: number, y: number) => {
    if (!currentImgInfo.current) return;
    let image = {
        data: currentImgInfo.current.data.data,
        width: currentImgInfo.current.width,
        height: currentImgInfo.current.height,
        bytes: 4
    };
    if (addMode && !oldMask) {
    	oldMask = mask;
    } else if (!addMode) {
      mask = null;
    }
    
    let old = oldMask ? oldMask.data : null;
    mask = MagicWand.floodFill(image, x, y, smartpenThreshold.current, old, true);
    if (mask) mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius, old);
    
    if (addMode && oldMask) {
      console.log("addMode");
    	mask = mask ? concatMasks(mask, oldMask) : oldMask;
    }
    //drawBorder(null);
    trace();
  };

  const concatMasks = (mask, old) => {
    let
      data1 = old.data,
      data2 = mask.data,
      w1 = old.width,
      w2 = mask.width,
      b1 = old.bounds,
      b2 = mask.bounds,
      b = { // bounds for new mask
        minX: Math.min(b1.minX, b2.minX),
        minY: Math.min(b1.minY, b2.minY),
        maxX: Math.max(b1.maxX, b2.maxX),
        maxY: Math.max(b1.maxY, b2.maxY)
      },
      w = old.width, // size for new mask
      h = old.height,
      i, j, k, k1, k2, len;
  
    let result = new Uint8Array(w * h);
  
    // copy all old mask
    len = b1.maxX - b1.minX + 1;
    i = b1.minY * w + b1.minX;
    k1 = b1.minY * w1 + b1.minX;
    k2 = b1.maxY * w1 + b1.minX + 1;
    // walk through rows (Y)
    for (k = k1; k < k2; k += w1) {
      result.set(data1.subarray(k, k + len), i); // copy row
      i += w;
    }
  
    // copy new mask (only "black" pixels)
    len = b2.maxX - b2.minX + 1;
    i = b2.minY * w + b2.minX;
    k1 = b2.minY * w2 + b2.minX;
    k2 = b2.maxY * w2 + b2.minX + 1;
    // walk through rows (Y)
    for (k = k1; k < k2; k += w2) {
      // walk through cols (X)
      for (j = 0; j < len; j++) {
        if (data2[k + j] === 1) result[i + j] = 1;
      }
      i += w;
    }
  
    return {
      data: result,
      width: w,
      height: h,
      bounds: b
    };
  };

  const trace = () => {
    let oldCs;
    let cs = MagicWand.traceContours(mask);
    cs = MagicWand.simplifyContours(cs, simplifyTolerant, simplifyCount);
    //mask = null;

    if(addMode) {
      oldCs = MagicWand.traceContours(oldMask);
      oldCs = MagicWand.simplifyContours(oldCs, simplifyTolerant, simplifyCount);
      console.log(oldMask.data);
      console.log(mask.data);
      let temp = new Object();
      for (let i=0; i < mask.data.length; i++) {
        if(mask.data[i] === oldMask.data[i]) {
          temp[i] = mask.data[i];
        } else {
          temp[i] = 0;
        }
      }
      console.log(JSON.stringify(temp) === JSON.stringify(oldMask.data));
    }
    
    //inner
    for (let i = 0; i < cs.length; i++) {
      let innerPs = [];
      if (!cs[i].inner) continue;
      //ps = cs[i].points;
      innerPs = cs[i].points;
      //drawPolyItem("MagicWand", innerPs, "Polygon", null, null, null, 8, null);
    }
    //outer
    let iId = currentObjectId.current;
    if (addMode) {
      for(let l=0;l<oldCs.length;l++) {
        console.log(oldCs);
        if (oldCs[l].inner) continue;
        deleteItem(--iId);
      }
    }
    for (let i = 0; i < cs.length; i++) {
      let outerPs = [];
      if (cs[i].inner) continue;
      //ps = cs[i].points;
      outerPs = cs[i].points;
      drawPolyItem("MagicWand", outerPs, "Polygon", null, null, null, 8, iId++);
    }
    //drawPolyItem("MagicWand", ps, "Polygon", null, null, null, 8, null);
};

  //let colorThreshold = 50;
  let blurRadius = 5;
  let simplifyTolerant = 0;
  let simplifyCount = 30;
  //let hatchLength = 4;
  //let hatchOffset = 0;

  //let cacheInd = null;
  let mask = null;
  let oldMask = null;
  let downPoint = null;
  //let allowDraw = false;
  let addMode = false;
  //let currentThreshold = colorThreshold;

  const initSmartpen = () => {
    let imageInfo: IimgInfo = {
      width: selectedTask.imageWidth,  //imgWidth,
      height: selectedTask.imageHeight,  //imgHeight,
      context: ctx,
    };

    let imgEl = document.createElement("img");
    imgEl.src = currentDataURL;

    let tempCtx = document.createElement("canvas").getContext("2d");
    tempCtx.canvas.width = selectedTask.imageWidth;
    tempCtx.canvas.height = selectedTask.imageHeight;
    imgEl.width = selectedTask.imageWidth;
    imgEl.height = selectedTask.imageHeight;
    //console.log(imgEl);
    tempCtx.drawImage(imgEl, 0, 0);
    //console.log(tempCtx);
    imageInfo.data = tempCtx.getImageData(0, 0, selectedTask.imageWidth, selectedTask.imageHeight);
    setimgInfo(() => imageInfo);
    //setInterval(function () { hatchTick(); }, 100);
  };

  const dissSmartpen = () => {
    setimgInfo(null);
  };

  //**! autopoint */
  const [autopointType, setAutopointType] = useState<number>(1);
  const currentAutopointType = useRef(autopointType);
  const [isAutopointOpen, setIsAutopointOpen] = useState<boolean>(false);
  const openIsAutopoint = () => {
    setIsAutopointOpen((prev) => !prev);
    setIsBrushOpen(false);
    setIsKeypointOpen(false);
  }
  const closeIsAutopoint = () => {
    setIsAutopointOpen(false);
  }
  const checkIsAutopoint = () => {
    resetTools("AutoPoint");
    //setIsAutopointOnOff((prev) => !prev);
  };
  const onCancelAutopoint = () => {
    setIsAutopointOnOff(false);
  };
  useEffect(() => {
    if(isAutopointOn && canvas) {
      setSelectedTool(() => "AutoPoint");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isAutopointOn && canvas) {
    }
  }, [isAutopointOn]);

  const [isAutopointBBoxOn, setIsAutopointBBoxOn] = useState<boolean>(false);
  const [isAutopointPolygonOn, setIsAutopointPolygonOn] = useState<boolean>(false);

  const setIsAutopoint = (tool: string) => {
    if(tool === "bbox") {
      setIsAutopointBBoxOn(true);
      setIsAutopointPolygonOn(false);
      setAutopointType(() => 1);
    } else if (tool === "polygon") {
      setIsAutopointPolygonOn(true);
      setIsAutopointBBoxOn(false);
      setAutopointType(() => 3);
    }
    checkIsAutopoint();
    closeIsAutopoint();
  }
  useEffect(() => {
    currentAutopointType.current = autopointType;
  }, [autopointType]);

  const handleAutopointUp = (options: any) => {
    if(!canvas || isSelectOn.current || !isDown) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if(endX < 0) endX = 0;
    if(endY < 0) endY = 0;
    if(endX > currentImage.current.width) endX = currentImage.current.width - 1;
    if(endY > currentImage.current.height) endY = currentImage.current.height - 1;
    //drawPoints(pointer, "AutoPoint", "red", null, null);
    if (
      Math.abs(endX - startX) < 3 &&
      Math.abs(endY - startY) < 3
    ) {
      drawPoints(pointer, "AutoPoint", "red", null, null, null);
      if(autoPointList.length === 2){
        isDown = false;
      }
    } else {
      drawAutoPoint();
      isDown = false;
    }
  };

  const drawAutoPoint = async () => {
    const type = currentAutopointType.current;

    tempRect.set({strokeDashArray: [0, 0],});
    canvas.renderAll();

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

    if(rLeft < 0) rLeft = 0;
    if(rTop < 0) rTop = 0;
    if(rRight > currentImage.current.width) rRight = currentImage.current.width - 1;
    if(rBottom > currentImage.current.height) rBottom = currentImage.current.height - 1;
    
    // startX, startY, endX, endY
    let param = {
      project_id: pId,
      task_id: currentTask.current.taskId,
      labeling_type: type,
      //maxResults: 10000,
    };

    const res = await labelingApi.getAutoLabeling(param);
    if (res && res.status === 200 && res.data.length > 0) {
      if(type === 1) {
        let iId = currentObjectId.current;
        let item = null;
        let color = "";
        let coordinate = null;
        for (let i = 0; i < res.data.length; i++) {
          item = res.data[i];
          const left = item.annotation_data[0];
          const top = item.annotation_data[1];
          const right = item.annotation_data[2];
          const bottom = item.annotation_data[3];
          if(left > rLeft 
            && top > rTop 
            && right < rRight 
            && bottom < rBottom) 
          {
            if(coordinate && 
              (left > coordinate.left && (top > coordinate.top || top - rTop > coordinate.left - rLeft)
                  || top > coordinate.top && (left > coordinate.left || left - rLeft > coordinate.top - rTop))) continue;

            color = item.annotation_category.annotation_category_color;
            coordinate = {
              left: item.annotation_data[0],
              top: item.annotation_data[1],
              width: item.annotation_data[2] - item.annotation_data[0],
              height: item.annotation_data[3] - item.annotation_data[1],
            };
          }
        }
        if(coordinate){
          setPositionX(() => coordinate.left);
          setPositionY(() => coordinate.top);
          setInstanceWidth(() => coordinate.width);
          setInstanceHeight(() => coordinate.height);

          tempRect.animate('left', coordinate.left, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          tempRect.animate('top', coordinate.top, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          tempRect.animate('width', coordinate.width, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          tempRect.animate('height', coordinate.height, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          setTimeout(
            () => drawBoxing('AutoPoint', coordinate, color, null, null, iId++),
            1000
          );
        } else {
          // TODO: error handling
          canvas.remove(tempRect);
          tempRect = null;
        }
      } else if(type === 3) {
        let iId = currentObjectId.current;
        let item = null;
        let color = "";
        let coordinate = null;
        for (let i = 0; i < res.data.length; i++) {
          item = res.data[i];
          //color = item.annotation_category.annotation_category_color;
          let coordinates = [];
          let datas = item.annotation_data;
          for (let i = 0; i < datas.length; i++) {
            coordinates = [];
            for (let j = 0; j < datas[i].length; j = j + 2) {
              //! 범위 조건 체크
              if (datas[i][j] < rLeft || datas[i][j + 1] < rTop || datas[i][j] > rRight || datas[i][j + 1] > rBottom) {
                coordinates = [];
                //continue;
                break;
              } 
              coordinates.push(
                new fabric.Point(datas[i][j], datas[i][j + 1]),
              );
            }
            if(coordinates.length > 0) {
              const minCurrentX = coordinates.slice(0).sort((a,b) => a.x - b.x)[0].x;
              const minCurrentY = coordinates.slice(0).sort((a,b) => a.y - b.y)[0].y;
              const xMin = Math.min.apply(null, coordinates.map((o) => { return o.x; }));
              const xMin2 = Math.min(...Array.from(coordinates, o => o.x));

              //!기존 데이터 비교하여 선택
              if(coordinate) {
                const minPrevX = coordinate.slice(0).sort((a,b) => a.x - b.x)[0].x;
                const minPrevY = coordinate.slice(0).sort((a,b) => a.y - b.y)[0].y;
                if(minCurrentX > minPrevX && (minCurrentY > minPrevY || minCurrentY - rTop > minPrevX - rLeft)
                  || minCurrentY > minPrevY && (minCurrentX > minPrevX || minCurrentX - rLeft > minPrevY - rTop)) {
                  console.log("continue");
                  continue;
                }
              }
              coordinate = coordinates;
              color = item.annotation_category.annotation_category_color;
            }
          }
          //console.log(item.annotation_type.annotation_type_id);
        }
        if(coordinate){
          const minX = coordinate.slice(0).sort((a,b) => a.x - b.x)[0].x;
          const minY = coordinate.slice(0).sort((a,b) => a.y - b.y)[0].y;
          const maxX = coordinate.slice(0).sort((a,b) => b.x - a.x)[0].x;
          const maxY = coordinate.slice(0).sort((a,b) => b.y - a.y)[0].y;
          tempRect.animate('left', minX, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          tempRect.animate('top', minY, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          tempRect.animate('width', maxX - minX, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          tempRect.animate('height', maxY - minY, { onChange: canvas.renderAll.bind(canvas), duration: 1000 });
          setTimeout(
            () => drawPolyItem('AutoPoint', coordinate, "Segmentation", color, null, null, 3, iId++),
            1000
          );
        } else {
          // TODO: error handling
          canvas.remove(tempRect);
          tempRect = null;
        }
      }
    } else {
      // TODO: error handling
      canvas.remove(tempRect);
      tempRect = null;
    }
  };

  //**! boxing */
  const checkIsBoxing = () => {
    resetTools("BBox");
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
    if(pointer.x < 0) pointer.x = 0;
    if(pointer.y < 0) pointer.y = 0;
    if(pointer.x > currentImage.current.width) pointer.x = currentImage.current.width - 1;
    if(pointer.y > currentImage.current.height) pointer.y = currentImage.current.height - 1;
    setDragBox(pointer.x, pointer.y);
  };
  const handleBoxingUp = (options: any) => {
    if(!canvas || isSelectOn.current || !isDown) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if(endX < 0) endX = 0;
    if(endY < 0) endY = 0;
    if(endX > currentImage.current.width) endX = currentImage.current.width - 1;
    if(endY > currentImage.current.height) endY = currentImage.current.height - 1;
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
    if(rLeft < 0) rLeft = 0;
    if(rTop < 0) rTop = 0;
    if(rRight > currentImage.current.width) rRight = currentImage.current.width - 1;
    if(rBottom > currentImage.current.height) rBottom = currentImage.current.height - 1;
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
    if(rLeft < 0) rLeft = 0;
    if(rTop < 0) rTop = 0;
    if(rRight > currentImage.current.width) rRight = currentImage.current.width - 1;
    if(rBottom > currentImage.current.height) rBottom = currentImage.current.height - 1;
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
    drawBoxing(tool, coordinate, null, null, null, null);
  }

  const drawBoxing = (tool: string, coordinate: any, color: string, aId: number, annotation: any, itemId: number) => {
    canvas.remove(tempRect);
    tempRect = null;
    if(!itemId) {
      itemId = currentObjectId.current;
    } 
    const clr = color? color : pCategories.current.length > 0 ? pCategories.current.find((element) => element.annotation_category_name === "인간").annotation_category_color : defaultColor;
    let optionRect = {
      id: itemId,
      tool: tool,
      color: clr,
      left: Math.floor(coordinate.left),
      top: Math.floor(coordinate.top),
      width: Math.floor(coordinate.width),
      height: Math.floor(coordinate.height),
      strokeWidth: 2 * (1 / iRatio.current),
      //stroke: 'rgba(0,0,0,0.5)',
      stroke: clr,
      //strokeOpacity: '.5',
      fill: 'transparent',
      //fill: 'rgba(0,0,0,0.3)',
      //fill: color,
      //fillOpacity: '.3',
      //strokeDashArray: [5, 5],
      hasBorders: true,
      hasControls: true,
      hoverCursor: 'pointer',
      objectCaching: false,
    };
    let rect = new fabric.Rect(optionRect);
    /* rect.on('selected', handleSelectObject);
    rect.on('deselected', handleDeSelectObject); */

    //setObjectListItem(ObjectListItem => [...ObjectListItem, ObjectItem]); */
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
    //this.setDataImage();
    setObjectId((prev) => prev + 1);
    //canvas.add(rect);
    //canvas.add(tag);
    canvas.renderAll();
    canvas.requestRenderAll();
  }

  //**! polyline */
  const checkIsPolyline = () => {
    resetTools("Polyline");
    //setIsPolylineOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPolylineOn && canvas) {
      setSelectedTool(() => "Polyline");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isPolylineOn && canvas) {
    }
  }, [isPolylineOn]);
  const handlePolylineDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[pointArray.length - 1].id) {
        // when click on the first point
        generatePolygon(pointArray, "Polyline", null);
      } else {
        addPoint(options, "Polyline");
      }
    } else {
      toggleDrawPolygon(options, "Polyline");
    }
  };
  const handlePolylineMove = (options: any) => {
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
  const handlePolylineUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    isDragging = false;
    selection = true;
  };

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

  const [isPolygonNewOn, setIsPolygonNewOn] = useState<boolean>(true);
  const [isPolygonAddOn, setIsPolygonAddOn] = useState<boolean>(false);
  const [isPolygonDelOn, setIsPolygonDelOn] = useState<boolean>(false);
  const polygonTool = useRef("new");

  useEffect(() => {
    if (isPolygonAddOn) {
      polygonTool.current = "add";
    } else if (isPolygonDelOn) {
      polygonTool.current = "del";
    } else {
      polygonTool.current = "new";
    }
  }, [isPolygonNewOn, isPolygonAddOn, isPolygonDelOn]);

  const setIsPolygon = (tool: string) => {
    if (tool === "add") {
      setIsPolygonNewOn(false);
      setIsPolygonAddOn(true);
      setIsPolygonDelOn(false);
    } else if(tool === "del") {
      setIsPolygonNewOn(false);
      setIsPolygonAddOn(false);
      setIsPolygonDelOn(true);
    } else {
      setIsPolygonNewOn(true);
      setIsPolygonAddOn(false);
      setIsPolygonDelOn(false);
    }
  };

  let isAddPolygon = false;
  const handlePolygonDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    if (options.e.ctrlKey || isPolygonAddOn) {
      isAddPolygon = true;
      return;
    }
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "Polygon", null);
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
    if(isAddPolygon) {
      let pointer = canvas.getPointer(options);
      let p = options.target.point;
      for (let i=0; i<p.length; i++) {
        if(i === p.length - 1) {

          if((p[i].x > pointer.x && p[0].x < pointer.x)
            || (p[i].x < pointer.x && p[0].x > pointer.x)) {
              console.log("add 0 x");
            }
          if((p[i].y > pointer.y && p[0].y < pointer.y)
            || (p[i].y < pointer.y && p[0].y > pointer.y)) {
              console.log("add 0 y");
            }

        } else {
          if((p[i].x > pointer.x && p[i+1].x < pointer.x)
            || (p[i].x < pointer.x && p[i+1].x > pointer.x)) {
              console.log("add x");
            }
          if((p[i].y > pointer.y && p[i+1].y < pointer.y)
            || (p[i].y < pointer.y && p[i+1].y > pointer.y)) {
              console.log("add y");
            }
        }
      }
      isAddPolygon = false;
      return;
    }
    isDragging = false;
    selection = true;
  };

  const addPolyPoint = (pointer: any, obj: any) => {
    console.log(obj);
    let p = obj.points;
    
    let index = -1;
    for (let i=0; i<p.length; i++) {
      console.log(p[i].x + " : " + p[i].y);
      console.log(pointer.x + " : " + pointer.y);
      if(i === p.length - 1) {
        if((p[i].x > pointer.x && pointer.x > p[0].x)
          || (p[i].x < pointer.x && pointer.x < p[0].x)) {
            if((p[i].y > pointer.y && pointer.y > p[0].y)
              || (p[i].y < pointer.y && pointer.y < p[0].y)) {
                console.log("add 0 xy : " + i);
                index = i + 1;
                break;
              }
          }
      } else {
        if((p[i].x > pointer.x && pointer.x > p[i+1].x)
          || (p[i].x < pointer.x && pointer.x < p[i+1].x)) {
            if((p[i].y > pointer.y && pointer.y > p[i+1].y)
              || (p[i].y < pointer.y && pointer.y < p[i+1].y)) {
                console.log("add xy : " + i);
                index = i + 1;
                break;
              }
          }
      }
    }
    console.log(index);
    if(index < 0) return;
    p.splice(index, 0, { x:Math.floor(pointer.x), y:Math.floor(pointer.y) });
    const polygon = currentObjectItem.current.filter(el => el.object.id === obj.id)[0];
    const data = [];
    p.forEach((point) => {
      data.push(point.x);
      data.push(point.y);
    });
    polygon.annotation.annotation_data = data;
    canvas.remove(obj);
    console.log(polygon);
    editPolygon(polygon.object);
    canvas.add(polygon.object);
    canvas.renderAll();
  };

  const removePolyPoint = (pointer: any, obj: any) => {
    console.log(obj);
    let p = obj.points;
    if(p.length < 4) return;
    let index = -1;
    for (let i=0; i<p.length; i++) {
      console.log(i + " : " + p[i].x + ", " + Math.floor(pointer.x));
      console.log(i + " : " + p[i].y + ", " + Math.floor(pointer.y));

      if (Math.abs(p[i].x - Math.floor(pointer.x)) < 5 && Math.abs(p[i].y - Math.floor(pointer.y)) < 5) {
        index = i;
        break;
      }
    }
    if(index < 0) return;
    p.splice(index, 1);
    const polygon = currentObjectItem.current.filter(el => el.object.id === obj.id)[0];
    const data = [];
    p.forEach((point) => {
      data.push(point.x);
      data.push(point.y);
    });
    polygon.annotation.annotation_data = data;
    canvas.remove(obj);
    console.log(polygon);
    editPolygon(polygon.object);
    canvas.add(polygon.object);
    canvas.renderAll();
  };

  //**! point */
  const checkIsPoint = () => {
    resetTools("Point");
    //setIsPointOnOff((prev) => !prev);
  };
  useEffect(() => {
    if(isPointOn && canvas) {
      setSelectedTool(() => "Point");
      //canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
      canvas.defaultCursor = `url(${ getPointCursor() }) ${ pointSize.current } ${ pointSize.current }, crosshair`;
    } else if(!isPointOn && canvas) {
      canvas.defaultCursor = "default";
    }
  }, [isPointOn]);

  useEffect(() => {
    pointSize.current = sliderValuePoint;
    if (canvas && currentTool.current === "Point") {
      canvas.defaultCursor = `url(${ getPointCursor() }) ${ sliderValuePoint } ${ sliderValuePoint }, crosshair`;
    }
  }, [sliderValuePoint]);

  const getPointCursor = () => {
    const circle = `
      <svg
        height="${ pointSize.current * 2 }"
        fill="${ "red" }"
        viewBox="0 0 ${ pointSize.current * 4 } ${ pointSize.current * 4 }"
        width="${ pointSize.current * 2 }"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50%"
          cy="50%"
          r="${ pointSize.current * 2 }" 
        />
      </svg>
    `;
    return `data:image/svg+xml;base64,${ window.btoa(circle) }`;
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

  const drawPoints = (coord: any, type: string, color: any, aId: number, annotation: any, iId: number) => {
    const point = {
      x: Math.floor(coord.x),
      y: Math.floor(coord.y),
    }
    if(type === "Point") {
      let itemId = iId;
      if(!itemId) {
        itemId = currentObjectId.current;
      }
      let optionPoint = {
        id: itemId,
        tool: type,
        radius: pointSize.current / iRatio.current,
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
      /* boxingPoint.on('selected', handleSelectObject);
      boxingPoint.on('deselected', handleDeSelectObject); */
      //canvas.add(boxingPoint);
      const clr = pCategories.current.length > 0 ? pCategories.current[0].annotation_category_color : "";
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
          canvas.remove(ePoint);
          canvas.remove(sPoint);
          if(type === "AutoPoint") {
            drawAutoPoint();
          } else {
            setRect(type);
          }
        }
      }
    } 
  }

  //**! brush */
  const [isBrushOpen, setIsBrushOpen] = useState<boolean>(false);
  const openIsBrush = () => {
    setIsBrushOpen((prev) => !prev);
    setIsAutopointOpen(false);
    setIsKeypointOpen(false);
  }
  const closeIsBrush = () => {
    setIsBrushOpen(false);
  }

  const checkIsBrush = () => {
    resetTools("Brush");
    //setIsBrushOnOff((prev) => !prev);
  };
  const onCancelBrush = () => {
    setIsBrushOnOff(false);
  };

  useEffect(() => {
    if(isBrushOn && canvas) {
      console.log("cursor set1");
      setSelectedTool(() => "BrushPen");
      const cursor = isBrushCircleOn ? "circle" : "rect";
      canvas.defaultCursor = `url(${ getDrawCursor(cursor) }) ${ brushSize.current / 2 } ${ brushSize.current / 2 }, crosshair`;
      //canvas.hoverCursor = "crosshair";
      canvas.freeDrawingCursor = `url(${ getDrawCursor(cursor) }) ${ brushSize.current / 2 } ${ brushSize.current / 2 }, crosshair`;
      //canvas.freeDrawingBrush.limitedToCanvasSize = true;
    } else if(!isBrushOn && canvas) {
      console.log("cursor set off");
      //setDrawingMode(false);
      if(canvas.isDrawingMode) {
        setDrawingMode();
      }
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "crosshair";
    }
  }, [isBrushOn]);

  useEffect(() => {
    brushSize.current = sliderValueBrush;
    if(canvas && canvas.freeDrawingCursor) {
      console.log("cursor set2");
      const cursor = isBrushCircleOn ? "circle" : "rect";
      canvas.defaultCursor = `url(${ getDrawCursor(cursor) }) ${ sliderValueBrush / 2 } ${ sliderValueBrush / 2 }, crosshair`;
      canvas.freeDrawingCursor = `url(${ getDrawCursor(cursor) }) ${ sliderValueBrush / 2 } ${ sliderValueBrush / 2 }, crosshair`;
      canvas.freeDrawingBrush.width = sliderValueBrush;
    } else {
      if(canvas) { 
        console.log("cursor set off2");
        canvas.defaultCursor = "default";
      }
    }
  }, [sliderValueBrush]);

  const [isBrushCircleOn, setIsBrushCircleOn] = useState<boolean>(false);
  const [isBrushSquareOn, setIsBrushSquareOn] = useState<boolean>(false);

  const setIsBrush = (tool: string) => {
    console.log("cursor set3");
    checkIsBrush();
    if(tool === "circle") {
      console.log("cursor round");
      setIsBrushCircleOn(true);
      setIsBrushSquareOn(false);
      canvas.freeDrawingBrush.strokeLineCap = 'round';
      canvas.defaultCursor = `url(${ getDrawCursor("circle") }) ${ brushSize.current / 2 } ${ brushSize.current / 2 }, crosshair`;
      canvas.freeDrawingCursor = `url(${ getDrawCursor("circle") }) ${ brushSize.current / 2 } ${ brushSize.current / 2 }, crosshair`;
    } else if (tool === "square") {
      console.log("cursor square");
      setIsBrushSquareOn(true);
      setIsBrushCircleOn(false);
      canvas.freeDrawingBrush.strokeLineCap = 'square';
      canvas.defaultCursor = `url(${ getDrawCursor("rect") }) ${ brushSize.current / 2 } ${ brushSize.current / 2 }, crosshair`;
      canvas.freeDrawingCursor = `url(${ getDrawCursor("rect") }) ${ brushSize.current / 2 } ${ brushSize.current / 2 }, crosshair`;
    }
    console.log("default: ", canvas.defaultCursor);
    closeIsBrush();
  }

  const getDrawCursor = (type: string) => {
    const circle = `
      <svg
        height="${ brushSize.current }"
        fill="${ "#ffcc00" }"
        viewBox="0 0 ${ brushSize.current * 2 } ${ brushSize.current * 2 }"
        width="${ brushSize.current }"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50%"
          cy="50%"
          r="${ brushSize.current }" 
        />
      </svg>
    `;
    const rect = `
      <svg
        height="${ brushSize.current }"
        fill="${ "#ffcc00" }"
        viewBox="0 0 ${ brushSize.current * 2 } ${ brushSize.current * 2 }"
        width="${ brushSize.current }"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="${ brushSize.current * 2 }"
          height="${ brushSize.current * 2 }"
        />
      </svg>
    `;
    const cursor = type === "circle" ? circle : rect;
    console.log("cursor: ", cursor);
    return `data:image/svg+xml;base64,${ window.btoa(cursor) }`;
  };

  let paintPointList = [];

  const handleBrushDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    let opt = { pointer, e: {} };
    canvas.freeDrawingBrush.onMouseDown(pointer, opt);
  };
  const handleBrushMove = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    /* console.log(iRatio.current);
    console.log(sliderValueBrush + ", " + brushSize.current);
    console.log(canvas.defaultCursor);
    console.log(canvas.freeDrawingBrush.width); */
    let pointer = canvas.getPointer(options);
    paintPointList.push(new fabric.Point(pointer.x, pointer.y));
  };
  const handleBrushUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
  };

  const setDrawingMode = () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = brushSize.current / iRatio.current;
      canvas.freeDrawingBrush.color = '#ffcc00';
      // ! 버튼 선택에 따라 circle, square 선택
      //canvas.freeDrawingBrush.strokeLineCap = 'square';
      /*this.fCanvas.hoverCursor =
        'url(' + this.getDrawCursor() + ') 10 10, crosshair';*/
    } else {
      canvas.freeDrawingBrush.width = 0;
      canvas.freeDrawingBrush.color = 'transparent';
    }
  };

  const handleCreatePath = (options) => {
    /* if(options) {
      console.log(options);
      console.log(options.path);
      canvas.clipTo = function (ctx) {
        ctx.save();
        path.render(ctx);
        ctx.restore();
      };
      //canvas.add(imgInstance);
      return;
    } */
    //options.path.set();
    //this.fCanvas.renderAll();
    //this.drawOnCanvas(this.fCanvas.toJSON());
    console.log(options);
    let path = options.path;
    path.objectCaching = false;
    //console.log(path);
    /*this.fCanvas.isDra
    
    wingMode = false;
    this.fCanvas.freeDrawingBrush.width = 0;
    this.fCanvas.freeDrawingBrush.color = 'transparent';*/
    setDrawingMode();

    let path2 = options.path.path;

    const minX = Math.min(...path2.map(item => item[1]));
    const minY = Math.min(...path2.map(item => item[2]));
    const maxX = Math.max(...path2.map(item => item[1]));
    const maxY = Math.max(...path2.map(item => item[2]));

    const centerPathX = path.pathOffset.x;
    const centerPathY = path.pathOffset.y;
    const centerX = path.left + (path.width / 2);
    const centerY = path.top + (path.height / 2);

    console.log(centerPathX + " : " + centerPathY);
    console.log(centerX + " : " + centerY);

    let points = [];
    let rawPoints = [];
    for (let i = 0; i < path2.length; i++) {
      let posX = "", posY= "";
      let point = {
        x: Math.floor(path2[i][1]),
        y: Math.floor(path2[i][2]),
      };
      if(point.x < centerX) {
        posX = "left";
      }
      if(point.x > centerX) {
        posX = "right";
      }
      if(point.y < centerY) {
        posY = "top";
      }
      if(point.y > centerY) {
        posY = "bottom";
      }
      points.push({
        posX: posX,
        posY: posY,
        isBoundX: true,
        isBoundY: true,
        point: point
      });
      rawPoints.push(point);
    }
    
    const coordinates = [];
    for (let j = 0; j < points.length; j++) {
      for (let k = 0; k < points.length; k++) {
        if (j === k) continue;
        if (points[j].posX === "right" && 
          points[j].point.y === points[k].point.y && 
          points[j].point.x < points[k].point.x) 
        {
          points[j].isBoundX = false; 
          break;
        }
        if (points[j].posX === "left" && 
          points[j].point.y === points[k].point.y && 
          points[j].point.x > points[k].point.x) 
        {
          points[j].isBoundX = false;
          break;
        }
        if (points[j].posY === "bottom" && 
          points[j].point.x === points[k].point.x && 
          points[j].point.y < points[k].point.y) 
        {       
          points[j].isBoundY = false;
          break;
        }
        if (points[j].posY === "top" && 
          points[j].point.x === points[k].point.x && 
          points[j].point.y > points[k].point.y) 
        {
          points[j].isBoundY = false;
          break;
        }
      }
      if(points[j].isBoundX && points[j].isBoundY) {
        coordinates.push(points[j].point);
      }
    }
    console.log(points);
    console.log(coordinates);

    canvas.remove(path);
    //drawPolyItem("BrushPen", rawPoints, 'Polygon', "#0000ff", null, null, null, null);
    drawPolyItem("BrushPen", coordinates, 'Polygon', null, null, null, 6, null);

    //drawPolyItem("BrushPen", points, 'Polygon', null, null, null, null, null);

    /*path.on('selected', this.selectObject);
    path.on('deselected', this.deselectObject);
    this.paintPathList.push(path);
    this.fCanvas.setActiveObject(path);*/
    /*this.fCanvas.clipTo = function (ctx) {
      ctx.save();
      path.render(ctx);
      ctx.restore();
    };*/
    //this.fCanvas.add(imgInstance);
  };

  //**! 3Dcube */
  const checkIs3Dcube = () => {
    resetTools("Cube");
    //setIs3DcubeOnOff((prev) => !prev);
  };
  const onCancel3Dcube = () => {
    setIs3DcubeOnOff(false);
  };

  useEffect(() => {
    if(is3DcubeOn && canvas) {
      setSelectedTool(() => "Cube");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!is3DcubeOn && canvas) {
    }
  }, [is3DcubeOn]);

  const handle3DcubeDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    startX = pointer.x;
    startY = pointer.y;
    if(autoPointList.length === 0){
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
      canvas.renderAll();
      isDown = true;
    }
  };

  let tempPolygon: fabric.Polygon = null;
  const handle3DcubeMove = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    const pointer = canvas.getPointer(options);
    const pos = canvas.getPointer(options.e);
    if(tempRect) {
      setDragBox(pointer.x, pointer.y);
    } else if (tempPolygon) {
      canvas.remove(tempPolygon);
      const points = tempPolygon.get('points');
      points[autoPointList.length] = {
        x: pointer.x,
        y: pointer.y,
      };
      tempPolygon.set({
        points,
      });
      canvas.add(tempPolygon);
    }
  };

  let tempCube: fabric.Rect = null;
  const handle3DcubeUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    drawPoints(pointer, "Cube", "green", null, null, null);
    if(autoPointList.length === 3){
      let point = autoPointList[2];
      canvas.remove(point);
      canvas.remove(tempCube);
      canvas.remove(tempPolygon);
      drawCube(null, null, null, null, null);
      tempCube = null;
      tempPolygon = null;
      isDown = false;
    } else if (autoPointList.length === 2) {
      let ePoint = autoPointList[1];
      let sPoint = autoPointList[0];

      tempCube = new fabric.Rect({
        left: sPoint.left,
        top: sPoint.top,
        width: ePoint.left - sPoint.left,
        height: ePoint.top - sPoint.top,
        strokeWidth: 2 * (1 / iRatio.current),
        stroke: 'rgba(0,0,0,1)',
        strokeDashArray: [0, 0],
        fill: 'transparent',
      });
      canvas.remove(ePoint);
      canvas.remove(sPoint);
      canvas.remove(tempRect);
      canvas.add(tempCube);
      tempRect = null;

      const polyPoint = [
        {
          x: sPoint.left,
          y: sPoint.top,
        },
        {
          x: ePoint.left,
          y: sPoint.top,
        },
      ];
      const polygon = new fabric.Polygon(polyPoint, {
        stroke: 'rgba(0,0,0,1)',
        strokeWidth: 1,
        fill: 'transparent',
        //opacity: 0.3,
        strokeDashArray: [5, 5],
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
      });
      tempPolygon = polygon;
      canvas.add(tempPolygon);

      canvas.renderAll();
    }
  };

  const drawCube = (coords: any, aId: number, annotation: any, iId: number, color: string) => {
    let x1: fabric.Circle, x2: fabric.Circle, y1: fabric.Circle, y2: fabric.Circle, zx1: fabric.Circle, zx2: fabric.Circle, zy1: fabric.Circle, zy2: fabric.Circle;
    let itemId = iId;
    if(!itemId) {
      itemId = currentObjectId.current;
    }
    const clr = color? color : pCategories.current.length > 0 ? pCategories.current.find((element) => element.annotation_category_name === "인간").annotation_category_color : defaultColor;

    let data = [];
    if(coords) {
      data = coords;
    } else {
      const pointsZ = autoPointList.pop();
      const pointsY = autoPointList.pop();
      const pointsX = autoPointList.pop();
      const width = pointsY.left - pointsX.left;
      const height = pointsY.top - pointsX.top;

      data = [
        pointsX.left, pointsX.top,
        pointsY.left, pointsX.top,
        pointsX.left, pointsY.top,
        pointsY.left, pointsY.top,
        pointsZ.left - width, pointsZ.top,
        pointsZ.left, pointsZ.top,
        pointsZ.left - width, pointsZ.top + height,
        pointsZ.left, pointsZ.top + height,
      ]
    }
    console.log(data[0]);
    data.forEach((el) => {
      el = Math.floor(el);
    });
    console.log(data[0]);
    const points = [];
    points.push(x1 = makeCircle("Cube", itemId + "_0", imgRatio, data[0], data[1]));
    points.push(x2 = makeCircle("Cube", itemId + "_1", imgRatio, data[2], data[3]));
    points.push(y1 = makeCircle("Cube", itemId + "_2", imgRatio, data[4], data[5]));
    points.push(y2 = makeCircle("Cube", itemId + "_3", imgRatio, data[6], data[7]));

    points.push(zx1 = makeCircle("Cube", itemId + "_4", imgRatio, data[8], data[9]));
    points.push(zx2 = makeCircle("Cube", itemId + "_5", imgRatio, data[10], data[11]));
    points.push(zy1 = makeCircle("Cube", itemId + "_6", imgRatio, data[12], data[13]));
    points.push(zy2 = makeCircle("Cube", itemId + "_7", imgRatio, data[14], data[15]));

    const x1x2 = makeLine("Cube", [x1.left, x1.top, x2.left, x2.top], clr);
    const x1y1 = makeLine("Cube", [x1.left, x1.top, y1.left, y1.top], clr);
    const x2y2 = makeLine("Cube", [x2.left, x2.top, y2.left, y2.top], clr);
    const y1y2 = makeLine("Cube", [y1.left, y1.top, y2.left, y2.top], clr);

    const zx1zx2 = makeLine("Cube", [zx1.left, zx1.top, zx2.left, zx2.top], clr);
    const zx1zy1 = makeLine("Cube", [zx1.left, zx1.top, zy1.left, zy1.top], clr);
    const zx2zy2 = makeLine("Cube", [zx2.left, zx2.top, zy2.left, zy2.top], clr);
    const zy1zy2 = makeLine("Cube", [zy1.left, zy1.top, zy2.left, zy2.top], clr);

    const x1zx1 = makeLine("Cube", [x1.left, x1.top, zx1.left, zx1.top], clr);
    const x2zx2 = makeLine("Cube", [x2.left, x2.top, zx2.left, zx2.top], clr);
    const y1zy1 = makeLine("Cube", [y1.left, y1.top, zy1.left, zy1.top], clr);
    const y2zy2 = makeLine("Cube", [y2.left, y2.top, zy2.left, zy2.top], clr);

    const lines = [x1x2, x1y1, x2y2, y1y2, zx1zx2, zx1zy1, zx2zy2, zy1zy2, x1zx1, x2zx2, y1zy1, y2zy2];

    setLine(x1, null, null, null, x1x2, x1y1, x1zx1);
    setLine(x2, x1x2, null, null, x2y2, x2zx2);
    setLine(y1, x1y1, null, null, y1y2, y1zy1);
    setLine(y2, x2y2, y1y2, null, y2zy2);
    setLine(zx1, x1zx1, null, null, zx1zx2, zx1zy1);
    setLine(zx2, x2zx2, zx1zx2, null, zx2zy2);
    setLine(zy1, y1zy1, zx1zy1, null, zy1zy2);
    setLine(zy2, y2zy2, zx2zy2, zy1zy2);

    let optionGroup = {
      id: itemId,
      tool: "Cube",
      hasBorders: false,
      hasControls: false,
    };

    //const matrix = group.calcTransformMatrix();
    //const newPoint = fabric.util.transformPoint({y: x1.top, x: x1.left}, matrix);

    if (annotation === null) {
      annotation = {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: 7,
        },
        annotation_category: {
          annotation_category_id: 1000,
          annotation_category_name: "인간",
          annotation_category_color: clr,
          annotation_category_attributes: [],
        },
        annotation_data: data,  //cData
      };
    }

    const cubeItem: IPresetItem = getCube(data, itemId, imgRatio, clr);
    cubeItem.points.forEach((point) => {
      point.on('selected', handleSelectObject);
      point.on('deselected', handleDeSelectObject);
    });
    const group = new fabric.Group(cubeItem.points, optionGroup);
    const objectArray = [...cubeItem.points, ...cubeItem.lines];

    setObjectItem(group, undefined, annotation, itemId, objectArray);
    setObjectId((prev) => prev + 1);

    canvas.renderAll();
  };

  //**! segment */
  const checkIsSegment = () => {
    resetTools("Segmentation");
  };
  useEffect(() => {
    if(isSegmentOn && canvas) {
      setSelectedTool(() => "Segmentation");
      canvas.defaultCursor = "crosshair";
      canvas.hoverCursor = "crosshair";
    } else if(!isSegmentOn && canvas) {
    }
  }, [isSegmentOn]);
  const handleSegmentDown = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    if (drawMode) {
      if (options.target && pointArray.length > 0 && options.target.id === pointArray[0].id) {
        // when click on the first point
        generatePolygon(pointArray, "Segmentation", null);
      } else {
        addPoint(options, "Segmentation");
      }
    } else {
      toggleDrawPolygon(options, "Segmentation");
    }
  };
  const handleSegmentMove = (options: any) => {
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
  const handleSegmentUp = (options: any) => {
    if(!canvas || isSelectOn.current) return;
    isDragging = false;
    selection = true;
  };

  //**! keypoint */
  const [keypointType, setKeypointType] = useState<number>(1);
  const currentKeypointType = useRef(keypointType);
  const [isKeypointOpen, setIsKeypointOpen] = useState<boolean>(false);
  const [alertKeypointOpen, setAlertKeypointOpen] = useState<boolean>(false);
  const openIsKeypoint = () => {
    setIsKeypointOpen((prev) => !prev);
    setIsBrushOpen(false);
    setIsAutopointOpen(false);
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
    if(pointer.x < 0) pointer.x = 0;
    if(pointer.y < 0) pointer.y = 0;
    if(pointer.x > currentImage.current.width) pointer.x = currentImage.current.width;
    if(pointer.y > currentImage.current.height) pointer.y = currentImage.current.height;
    setDragBox(pointer.x, pointer.y);
  };
  const handleKeypointUp = (options: any) => {
    if(!canvas || !isDown || isSelectOn.current) return;
    let pointer = canvas.getPointer(options);
    endX = pointer.x;
    endY = pointer.y;
    if(endX < 0) endX = 0;
    if(endY < 0) endY = 0;
    if(endX > currentImage.current.width) endX = currentImage.current.width;
    if(endY > currentImage.current.height) endY = currentImage.current.height;
    if (
      Math.abs(endX - startX) > 1 &&
      Math.abs(endY - startY) > 1
    ) {
      drawKeypoint(null, null, null, null, null);
    }
    isDown = false;
  };

  const drawKeypoint = (aId: number, annotation: any, iId: number, data: any, color: string) => {
    canvas.remove(tempRect);
    let itemId = iId;
    if(!itemId) {
      itemId = currentObjectId.current;
    }

    let tag = "person";
    switch(currentKeypointType.current) {
      case 1:
        tag = "person";
        break;
      case 2:
        tag = "animal";
        break;
      case 3:
        tag = "hand";
        break;
    }

    const clr = color? color : pCategories.current.length > 0 ? pCategories.current.find((element) => element.annotation_category_name === "인간").annotation_category_color : defaultColor;

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

      let pointDatas = [];
      if(tag === "person") {
        pointDatas = [
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
      } else if (tag === "animal") {
        // Todo: pointDatas = animalDatas
      } else {
        // Todo: pointDatas = handDatas
      }
      data = pointDatas;
    }
    data.forEach((el) => {
      if(el) el = Math.floor(el);
      /* if(el[2] > 0.1) {
        data.push(Math.floor(el[0]));
        data.push(Math.floor(el[1]));
        data.push(Math.floor(el[2]));
      } else {
        data.push(null);
        data.push(null);
        data.push(null);
      }
      console.log(el); */
    });
    console.log(data);

    let optionPoint = {
      id: itemId,
      tool: "KeyPoint",
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      hoverCursor: 'pointer',
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingFlip: true,
      lockScalingX: true,
      lockScalingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
    };

    if (annotation === null) {
      annotation = {
        annotation_id: aId,
        annotation_type: {
          annotation_type_id: 10,
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

    const keypointItem: IPresetItem = getKeyPoint(tag, data, itemId, imgRatio, clr);
    keypointItem.points.forEach((point) => {
      point.on('selected', handleSelectObject);
      point.on('deselected', handleDeSelectObject);
    });
    const keyPoint = new fabric.Group(keypointItem.points, optionPoint);
    const objectArray = [...keypointItem.lines, ...keypointItem.points];

    setObjectItem(keyPoint, undefined, annotation, itemId, objectArray);
    setObjectId((prev) => prev + 1);
    canvas.renderAll();
    //}
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
    console.log(coordinate[0].x);
    coordinate.forEach((el) => {
      el.x = Math.floor(el.x);
      el.y = Math.floor(el.y);
    });
    console.log(coordinate[0].x);
    const clr = color? color : pCategories.current.length > 0 ? pCategories.current.find((element) => element.annotation_category_name === "인간").annotation_category_color : defaultColor;
    let fill = 'transparent';
    if(type === "Segmentation") {
      fill = clr + "4D";
    }
    if(type === "Polygon") {
      fill = clr + "01";
    }
    let option = {
      id: itemId,
      tool: tool,
      type: type,
      color: clr,
      fill: fill,
      selectable: true,
      strokeWidth: 2 * (1 / iRatio.current),
      stroke: clr,
      objectCaching: false,
      edit: true,
      hoverCursor: 'pointer',
      hasBorders: false,
      perPixelTargetFind: true,
    };
    let polyItem = new fabric.Polygon(coordinate, option);
    if (type === "Polyline") {
      polyItem = new fabric.Polyline(coordinate, option);
    }
    let cData = [];
    if(coordinate){
      for (let i = 0; i < coordinate.length; i++) {
        cData.push(coordinate[i].x);
        cData.push(coordinate[i].y);
      }
    }
    
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
      // Todo: 포인트 위치에 따른 제한 필요
      x = Math.floor(x);
      y = Math.floor(y);
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
    if(x <= 0) x = 0;
    if(y <= 0) y = 0;
    if(x >= currentTask.current.imageWidth) x = currentTask.current.imageWidth - 1;
    if(y >= currentTask.current.imageHeight) y = currentTask.current.imageHeight - 1;
    x = Math.floor(x);
    y = Math.floor(y);

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
          cursorStyle: 'pointer',
          actionName: 'modifyPolygon',
          pointIndex: index,
          x: Math.floor(point.x),
          y: Math.floor(point.y),
        });
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
  
  // ! 
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
      fill: 'red',
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
    /* c.on('selected', handleSelectObject);
    c.on('deselected', handleDeSelectObject); */
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
  const makeLine = (tool: string, coords: Array<number>, color: string) => {
    if(!coords || !coords[0] || !coords[1] || !coords[2] || !coords[3]) return null;
    let optionLine = {
      tool: tool,
      fill: color,
      stroke: color,
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

  let imgIndexCount = document.getElementById("imgPicker")? Math.floor(document.getElementById("imgPicker").clientWidth / 180) - 1 : 0;
  let imgIndexLeft = 0, imgIndexRight = imgIndexCount;

  const refPicker = useRef<any>(undefined);

  // ! 해상도 체크 동작 확인 필요
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
  });     //, [refPicker, refPicker.current, refPicker.current?.scrollWidth, refPicker.current?.clientWidth, tasks]);

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
      case "AutoPoint":
        icon = iconAutopoint;
        break;
      case "MagicWand":
        icon = iconSmartpen;
        break;
      case "BBox":
        icon = iconBoxing;
        break;
      case "Polyline":
        icon = iconPolyline;
        break;
      case "Polygon":
        icon = iconPolygon;
        break;
      case "Point":
        icon = iconPoint;
        break;
      case "BrushPen":
        icon = iconBrush;
        break;
      case "Cube":
        icon = icon3Dcube;
        break;
      case "Segmentation":
        icon = iconSegment;
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

  // ! 완료 버튼 클릭 시 호출
  const handleCompleted = async () => {
    saveStatus(3);
  };

  const checkIsDeleteInstance = () => {
    setIsDeleteInstance((prev) => !prev);
  };

  const onCancelDelete = () => {
    setIsDeleteInstance(false);
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
          taskStep: 1,
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

  if (pId) {
    return (
      <LabelingPresenter
        currentUser={loggedInUser}
        currentDataURL={currentDataURL}
        projectInfo={projectInfo}
        examinee={examinee}
        tasks={tasks}
        isFileSelectorOpen={isFileSelectorOpen}
        labelingAssignee={labelingAssignee}
        projectUser={projectUser}
        isFileInfoOpen={isFileInfoOpen}
        workStatutes={workStatutes}
        selectedTask={selectedTask}
        loading={loading}
        isFirst={isFirst}
        resizingVal={resizingVal}
        _setExaminee={_setExaminee}
        _setLabelingAssignee={_setLabelingAssignee}
        toggleFileSelector={toggleFileSelector}
        toggleFileInfoOpen={toggleFileInfoOpen}
        _setWorkStatutes={_setWorkStatutes}
        _setSelectedTask={_setSelectedTask}
        handlePrevTask={handlePrevTask}
        handleNextTask={handleNextTask}
        onCancelMove={onCancelMove}
        onCancelClass={onCancelClass}
        onCancelReset={onCancelReset}
        onSubmitReset={onSubmitReset}
        onCancelSmartpen={onCancelSmartpen}
        onCancelAutopoint={onCancelAutopoint}
        onCancelBrush={onCancelBrush}
        onCancel3Dcube={onCancel3Dcube}
        onCancelKeypoint={onCancelKeypoint}
        handleResizing={handleResizing}
        onOriginalImage={onOriginalImage}
        handleToggleFullScreen={handleToggleFullScreen}
        handleUnDo={handleUnDo}
        handleRedo={handleRedo}
        saveStatus={saveStatus}
        goBack={goBack}
        isMoveOn={isMoveOn}
        isTagOn={isTagOn}
        isClassOn={isClassOn}
        isResetOn={isResetOn}
        isHDOn={isHDOn}
        isODOn={isODOn}
        isISOn={isISOn}
        isSESOn={isSESOn}
        isSmartpenOn={isSmartpenOn}
        isAutopointOn={isAutopointOn}
        isBoxingOn={isBoxingOn}
        isPolylineOn={isPolylineOn}
        isPolygonOn={isPolygonOn}
        isPointOn={isPointOn}
        isBrushOn={isBrushOn}
        is3DcubeOn={is3DcubeOn}
        isSegmentOn={isSegmentOn}
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
        checkIsOD={checkIsOD}
        checkIsIS={checkIsIS}
        checkIsSES={checkIsSES}
        checkIsSmartpen={checkIsSmartpen}
        checkIsAutopoint={checkIsAutopoint}
        checkIsBoxing={checkIsBoxing}
        checkIsPolyline={checkIsPolyline}
        checkIsPolygon={checkIsPolygon}
        checkIsPoint={checkIsPoint}
        checkIsBrush={checkIsBrush}
        checkIs3Dcube={checkIs3Dcube}
        checkIsSegment={checkIsSegment}
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
        isAutoLabeling={isAutoLabeling}
        isDeleteInstance={isDeleteInstance}
        checkIsDeleteInstance={checkIsDeleteInstance}
        onCancelDelete={onCancelDelete}
        selectedObjectId={selectedObjectId}
        selectedObject={selectedObject}
        isHDLabelingOn={isHDLabelingOn}
        projectCategories={projectCategories}
        setAnnotationClass={setAnnotationClass}
        instanceClass={instanceClass}
        instanceAttrList={instanceAttrList}
        setAnnotationAttr={setAnnotationAttr}
        instance={instance}
        currentObjectItem={currentObjectItem.current}
        setKeyOnOff={setKeyOnOff}
        isKeyOnOff={isKeyOnOff}
        isCrossOnOff={isCrossOnOff}
        countListOD={currentCountListOD.current}
        countListISES={currentCountListISES.current}
        countOD={currentCountOD.current}
        countISES={currentCountISES.current} 
        isLearningOD={isLearningOD}      
        isLearningISES={isLearningISES} 
        isActiveOD={isActiveOD}      
        isActiveISES={isActiveISES} 
        isPopupOD={isPopupOD}      
        isPopupIS={isPopupIS}
        isPopupSES={isPopupSES}
        closePopupOD={closePopupOD}
        closePopupIS={closePopupIS}
        closePopupSES={closePopupSES}
        toggleCountClassOpen={toggleCountClassOpen}
        isCountClassOpen={isCountClassOpen}
        iconCheckOD={iconCheckOD}
        iconCheckIS={iconCheckIS}
        iconCheckSES={iconCheckSES}
        isBrushCircleOn={isBrushCircleOn}
        isBrushSquareOn={isBrushSquareOn}
        setIsBrush={setIsBrush}
        isBrushOpen={isBrushOpen}
        openIsBrush={openIsBrush}
        closeIsBrush={closeIsBrush}
        isAutopointBBoxOn={isAutopointBBoxOn}
        isAutopointPolygonOn={isAutopointPolygonOn}
        setIsAutopoint={setIsAutopoint}
        isAutopointOpen={isAutopointOpen}
        openIsAutopoint={openIsAutopoint}
        closeIsAutopoint={closeIsAutopoint}
        isKeypointPersonOn={isKeypointPersonOn}
        isKeypointAnimalOn={isKeypointAnimalOn}
        isKeypointHandOn={isKeypointHandOn}
        setIsKeypoint={setIsKeypoint}
        isKeypointOpen={isKeypointOpen}
        openIsKeypoint={openIsKeypoint}
        closeIsKeypoint={closeIsKeypoint}
        alertKeypointOpen={alertKeypointOpen}
        openAlertKeypoint={openAlertKeypoint}
        canvasHistory={canvasHistory}
        selectHistory={selectHistory}
        historyId={historyId.current}
        onChangeAttrNum={onChangeAttrNum}
        onChangeAttrTxt={onChangeAttrTxt}
        handleSetAttrNum={handleSetAttrNum}
        handleSetAttrTxt={handleSetAttrTxt}
        attrNumList={attrNumList}
        attrTxtList={attrTxtList}
        valAttrNum={valAttrNum}
        valAttrTxt={valAttrTxt}
        handleRemoveAttrNum={handleRemoveAttrNum}
        handleRemoveAttrTxt={handleRemoveAttrTxt}
        sliderValueSmartpen={sliderValueSmartpen}
        setSliderValueSmartpen={setSliderValueSmartpen}
        showTooltipSmartpen={showTooltipSmartpen}
        setShowTooltipSmartpen={setShowTooltipSmartpen}
        sliderValuePoint={sliderValuePoint}
        setSliderValuePoint={setSliderValuePoint}
        showTooltipPoint={showTooltipPoint}
        setShowTooltipPoint={setShowTooltipPoint}
        sliderValueBrush={sliderValueBrush}
        setSliderValueBrush={setSliderValueBrush}
        showTooltipBrush={showTooltipBrush}
        setShowTooltipBrush={setShowTooltipBrush}
        setIsPolygon={setIsPolygon}
        isPolygonNewOn={isPolygonNewOn}
        isPolygonAddOn={isPolygonAddOn}
        isPolygonDelOn={isPolygonDelOn}
      />
    );
  }
  return null;
};

export default LabelingContainer;