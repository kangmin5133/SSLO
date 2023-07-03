import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import labelingApi from "../../../api/labelingApi";
import projectApi, {
  IPType,
  IProject,
  ISimpleProjectInfo,
} from "../../../api/projectApi";
import staticsApi, {
  IStaticsTaskByDay,
  IWorksProgressStatics,
} from "../../../api/staticsApi";
import taskApi, { ITask } from "../../../api/taskApi";
import { useAppSelector } from "../../../hooks";
import MyWorksPresenter from "./MyWorksPresenter";

export enum MyWorksInnerSidebarItem { //enum : 열거하는 타입(상수값을 모아두고 사용하는데 유용)
  myWorks = "내 작업",
  myWorksStatics = "내 작업 통계",
}

const MyWorksContainer = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state: any) => state.userReducer);
  const loggedInUser = useAppSelector((state: any) => state.userReducer);
  const location = useLocation();
  useEffect(() => {
    if(filteredTasks) {
      const page= parseInt(location.search.split("=")[1]);
      setVTasks(filteredTasks.filter((t, id) => { return id >= ((page - 1) * 10) && id < (page * 10) }));
    }
  }, [location.key]);
  // ! 하나의 project state
  const [project, setProject] = useState<IProject>();
  // ! 전체 프로젝트
  const [allProjects, setAllProjects] = useState<ISimpleProjectInfo[]>([]);
  // ! project task list state
  const [pTasks, setPTasks] = useState<ITask[]>();
  // ! 전체 타스크 개수 state
  const [totalTasksCount, setTotalTasksCount] = useState<number>(0);
  // ! Inner 사이드바의 메뉴 오픈 state
  const [openSidebarUpper, setOpenSidebarUpper] = useState<boolean>(true);
  // ! Inner 사이드바에서 선택된 탭 state
  const [selectedInnerTab, setSelectedInnerTab] = useState<
    MyWorksInnerSidebarItem
  >(MyWorksInnerSidebarItem.myWorks);
  // ! Inner 사이드바에서 탭 선택하면 해당 탭으로 state change
  const handleSelectInnerTab = (tab: MyWorksInnerSidebarItem) => {
    console.log(tab);
    setSelectedInnerTab(tab);
  };
  // ! 검색어 state
  const [searchText, setSearchText] = useState<string>();
  // ! 작업단계 선택
  const [selectedStep, setSelectedStep] = useState<number>(1);
  // ! 내작업 현재 프로젝트
  const [inMyWorkCurrentProject, setInMyWorkCurrentProject] = useState<
    ISimpleProjectInfo
  >({
    projectId: -1,
    projectName: "프로젝트 없음",
    projectType: -1,
  });
  // ! 필터값 state
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [vTasks, setVTasks] = useState<ITask[]>([]);
  // ! 내작업 현재 project_id
  const [myWorkPId, setMyWorkPId] = useState<number>(0);
  const handleGetMyWorkPId = (pId: number) => {
    setMyWorkPId(pId);
  };
  // ! 내 작업 통계탭에서 작업자의 전체 작업진행률에 필요한 데이터 state
  const [myWorksWorkerStatics, setMyWorksWorkerStatics] = useState<
    IWorksProgressStatics
  >();
  const [myWorksValidatorStatics, setMyWorksValidatorStatics] = useState<
    IWorksProgressStatics
  >();
  // ! 내 작업 통계 화면에서 일별 작업량 우측 날짜 값 state
  const [progressDay, setProgressDay] = useState<number>(1);
  const handleChangeDay = (e: ChangeEvent<HTMLSelectElement>) => {
    setProgressDay(parseInt(e.target.value));
  };
  // ! 내 작업 통계 화면에서 일별 작업량 step 1(수집 or 전처리 or 가공)
  const [stepOneProgress, setStepOneProgress] = useState<IStaticsTaskByDay[]>(
    []
  );
  // ! 내 작업 통계 화면에서 일별 작업량 step 2(검수)
  const [stepTwoProgress, setStepTwoProgress] = useState<IStaticsTaskByDay[]>(
    []
  );
  // ! checkbox에서 선택된 tasks
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  //************** list check box 개별선택 *************
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

  const selectTask = (taskId: number) => {
    setSelectedTasks((prev) => [...prev, taskId]);
  };

  const removeTask = (taskId: number) => {
    const removedTasks = selectedTasks.filter((s) => s !== taskId);
    //선택된 넘버값과 taskId가 다를경우 []빈배열을 담아 removedTasks에 넣어줌
    setSelectedTasks(removedTasks);
    //setSelectedTasks에 빈배열이 들어가면서 화면에 선택된 체크박스들만 새로 덮어보여짐
  };

  //************** header check box 전체선택 *************
  const isSelectedAllTasks = (): boolean => {
    if (pTasks) {
      return pTasks.length === selectedTasks.length;
    }
    return false;
  };
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

  const removeAllTask = () => {
    setSelectedTasks([]);
  };

  useEffect(() => {}, [pTasks]);

  // ! 전처리/정제/가공에 따라 studio 이동
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
  //****************myWorks All Project data****************
  // ! 서버로부터 전체 프로젝트 가져와 정제하여 state에 저장(필요한 파라메타만 가져옴)
  const cleanAllProjects = (data: any) => {
    const cleanedProjects: ISimpleProjectInfo[] = [];
    data.forEach((p: any) => {
      if (p.project_manager.organization_id === user.organizationId 
        && p.project_members.some(m => m.user_id === user.id)
        ) {
        const project = {
          projectId: p.project_id,
          projectName: p.project_name,
          projectType: p.project_type.project_type_id,
        };
        cleanedProjects.push(project);
      }
    });
    setAllProjects(cleanedProjects);
    if(cleanedProjects.length > 0) {
      setInMyWorkCurrentProject(cleanedProjects[0]);

      //  pId가 바뀔 때마다 리렌더링 되므로 현재 프로젝트의 프로젝트 아이디를 바로 뽑아주게 되면
      //  화면이 보이자마자 렌더링이 되어 출력가능
      setMyWorkPId(cleanedProjects[0].projectId);
    }
  };
  // ! 서버로부터 전체 프로젝트 리스트 불러옴
  const getAllProjects = async () => {
    const res = await projectApi.getAllProjects(
      { startAt: 0, maxResults: 100000 },
      user.accessToken!
    );
    if (res && res.status === 200) {
      cleanAllProjects(res.data.datas);
    }
  };
  // ! project_id값을 받아와 선택한 프로젝트로 handling 및 해당 프로젝트 정보 불러옴
  const handleChangeMyWorkProject = async () => {
    if (!myWorkPId) return;
    console.log(myWorkPId);
    const res = await projectApi.getProject(
      { project_id: myWorkPId },
      user.accessToken!
    );
    if (res && res.status === 200) {
      setInMyWorkCurrentProject({
        projectId: res.data.project_id,
        projectName: res.data.project_name,
        projectType: res.data.project_type.project_type_id,
      });
      const prjType: IPType = {
        project_type_id: res.data.project_type.project_type_id,
        project_type_name: res.data.project_type.project_name,
        created: res.data.project_type.created,
      };
      const project: IProject = {
        //studio와 연결하기위해 project정보 필요(listItem.tsx참고)
        pNo: res.data.project_id,
        pName: res.data.project_name,
        pType: prjType,
        pWorkerCount: res.data.project_worker_count,
        pCreated: res.data.project_type.created,
      };
      console.log(project);
      setProject(project);
      getAllTasks();
    }
  };

  //****************myWorks Task data****************
  // ! task 정보 가져와 정제하여 state에 저장
  const cleanAllTasks = async (
    tasks: any[],
    pageinfo: any,
    progress?: number
  ) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    for (let i = 0; i < tasks.length; i++) {
      // 선택된 작업상태로 필터링되도록 함
      if (progress) {
        if (
          progress === 1 &&
          progress !== tasks[i].task_status.task_status_progress
        ) {
          continue;
        }
        if (
          progress === 2 &&
          progress !== tasks[i].task_status.task_status_progress
        ) {
          continue;
        }
        if (
          progress === 3 &&
          progress !== tasks[i].task_status.task_status_progress
        ) {
          continue;
        }
        if (
          progress === 4 &&
          progress !== tasks[i].task_status.task_status_progress
        ) {
          continue;
        }
      }
      //ITask에 정의된 필수 파라메타를 모두 불러와야함
      const taskId = tasks[i].task_id;
      const imageName = tasks[i].task_detail.image_name;
      const imageThumbnail = tasks[i].task_detail.image_thumbnail;
      const imageFormat = tasks[i].task_detail.image_format;
      const imageWidth = tasks[i].task_detail.image_width;
      const imageHeight = tasks[i].task_detail.image_height;
      const taskName = tasks[i].task_name;
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
      const created = tasks[i].created;
      const taskStep = tasks[i].task_status.task_status_step;

      let objectCount;
      // ! object 개수 불러오기
      if (myWorkPId && inMyWorkCurrentProject.projectId === 3) {
        const res = await labelingApi.searchAnnotationByTask({
          project_id: myWorkPId,
          task_id: taskId,
        });
        if (res && res.status === 200) {
          objectCount = res.data.pageinfo.totalResults;
        }
      }

      // Task 타입에 맞게 아래 form 을 형성 후 cleanedTasks에 form push
      // form 안에 objectCount까지 담아서 push시킴
      form = {
        taskId,
        imageName,
        imageThumbnail,
        imageFormat,
        imageWidth,
        imageHeight,
        taskName,
        taskStatus,
        taskStatusName,
        created,
        taskStep,
        image: "",
        objectCount,
      };
      cleanedTasks.push(form);
    }
    setPTasks(cleanedTasks);
    setFilteredTasks(cleanedTasks); //초기값선언
    if (progress) {
      setTotalTasksCount(cleanedTasks.length);
    } else {
      setTotalTasksCount(pageinfo.totalResults);
    }
  };

  useEffect(() => {
    if(filteredTasks) {
      let page= parseInt(location.search.split("=")[1]);
      if(!page) page = 1;
      setVTasks(filteredTasks.filter((t, id) => { return id >= ((page - 1) * 10) && id < (page * 10) }));
    }
  }, [filteredTasks]);

  // ! 서버로부터 task정보 불러옴
  const getAllTasks = async () => {
    if (!myWorkPId) return;
    if (myWorkPId) {
      let param = {};
      if (selectedStep === 1) {
        param = {
          project_id: myWorkPId,
          task_worker: user.id!,
          task_status_step: selectedStep,
          maxResults: 3000,
        };
      } else if (selectedStep === 2) {
        param = {
          project_id: myWorkPId,
          task_validator: user.id!,
          task_status_step: selectedStep,
          maxResults: 3000,
        };
      }
      const res: any = await taskApi.getTaskByUser(param, user.accessToken!);
      if (res && res.status === 200) {
        cleanAllTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };

  //***************** filter **************
  //pTask는 data 저장만 해두고 따로 filterTasks안에 담아 그 안에서 필터분류 실행-서버효율증가위해
  const getTasksFilter = async (progress: number) => {
    if (pTasks) {
      if (progress === 0) {
        setFilteredTasks(pTasks);
      } else {
        let filter: ITask[] = [];
        pTasks.forEach((element: any) => {
          if (element.taskStatus === progress) {
            filter.push(element);
          }
        });
        setFilteredTasks(filter);
      }
    }
  };

  const filterByProgress = (progress: string) => {
    switch (progress) {
      case "전체":
        getTasksFilter(0);
        break;
      case "미작업":
        getTasksFilter(1);
        break;
      case "진행중":
        getTasksFilter(2);
        break;
      case "완료":
        getTasksFilter(3);
        break;
      case "반려":
        getTasksFilter(4);
        break;
    }
  };
  //************* 작업/검수 분류 ************
  const handleCategory = (step: any) => {
    setSelectedStep(() => step); //불러온 step의 값은 state에 저장
  };

  useEffect(() => {
    getAllTasks();
  }, [selectedStep]);

  //***************** search ******************
  const handleTaskSearch = async () => {
    if (!myWorkPId) return;
    if (myWorkPId) {
      const res = await taskApi.getTaskByUser(
        {
          project_id: myWorkPId,
          task_worker: user.id!,
          task_name: searchText,
          maxResults: 3000,
        },
        user.accessToken!
      );
      if (res && res.status === 200) {
        cleanAllTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };
  // ! 검색어 입력 시 input된 검색어를 state에 저장
  //타입스크립트에서는 이벤트 인자타입을 먼저지정 후 <>안에 해당이벤트를 발생시키는 요소를 제네릭 인자로 전달
  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  //******************** myWorks Statics ********************
  // ! 서버로부터 작업자의 통계 데이터를 받아 정제 후 state에 저장 (작업상태부분)
  const cleanMyWorks = (statics: any) => {
    const result = statics.statics_status_steps; //result 안에 0과 1로 나뉜 array data 담김
    console.log(result);
    if (result[0].task_status_step === selectedStep) {
      //0과 1안에 task_status_step이 존재
      const progressStatics = result[0].task_status_progress;
      const stepOneCount = result[0].count;

      let myWorkProgress: IWorksProgressStatics = {
        progressOneComplete: 0,
        progressTwoComplete: 0,
        progressThreeComplete: 0,
        progressFourComplete: 0,
        totalCount: stepOneCount + result[0].task_status_complete_count, //총 카운트
      };

      for (let i = 0; i < progressStatics.length; i++) {
        if (progressStatics[i].id === 1) {
          myWorkProgress.progressOneComplete = progressStatics[i].count;
        } else if (progressStatics[i].id === 2) {
          myWorkProgress.progressTwoComplete = progressStatics[i].count;
        } else if (progressStatics[i].id === 3) {
          myWorkProgress.progressThreeComplete =
            result[0].task_status_complete_count;
        } else if (progressStatics[i].id === 4) {
          myWorkProgress.progressFourComplete = progressStatics[i].count;
        }
      }
      setMyWorksWorkerStatics(myWorkProgress);
    } else if (result[1].task_status_step === selectedStep) {
      const progressStatics = result[1].task_status_progress;
      const stepTwoCount = result[1].count;

      let myValidateProgress: IWorksProgressStatics = {
        progressOneComplete: 0,
        progressTwoComplete: 0,
        progressThreeComplete: 0,
        progressFourComplete: 0,
        totalCount: stepTwoCount,
      };
      for (let i = 0; i < progressStatics.length; i++) {
        if (progressStatics[i].id === 1) {
          myValidateProgress.progressOneComplete = progressStatics[i].count;
        } else if (progressStatics[i].id === 2) {
          myValidateProgress.progressTwoComplete = progressStatics[i].count;
        } else if (progressStatics[i].id === 3) {
          myValidateProgress.progressThreeComplete = progressStatics[i].count;
        } else if (progressStatics[i].id === 4) {
          myValidateProgress.progressFourComplete = progressStatics[i].count;
        }
      }
      setMyWorksValidatorStatics(myValidateProgress);
    }
  };

  // ! myWorks static data fetch
  const getMyWorksAllStatics = async () => {
    if (!myWorkPId) return;
    if (myWorkPId) {
      const res = await staticsApi.getMyStatics(
        {
          project_id: myWorkPId,
        },
        user.accessToken!
      );
      if (res && res.status === 200) {
        cleanMyWorks(res.data);
        console.log(res.data);
      }
    }
    return;
  };

  // ! 일별 작업량 data 서버로부터 가져옴
  const getMyWorkByDay = async () => {
    if (!myWorkPId) return;
    const res = await staticsApi.getMyStaticByDay(
      {
        project_id: myWorkPId,
        startBeforeDays: progressDay,
      },
      user.accessToken!
    );
    if (res && res.status === 200) {
      const completeStatics = res.data;
      let stepOneProgressValues: IStaticsTaskByDay[] = [];
      let stepTwoProgressValues: IStaticsTaskByDay[] = [];

      for (let i = 0; i < completeStatics.length; i++) {
        let cleanDay = completeStatics[i].day.split("-");
        let day = `${cleanDay[1]}/${cleanDay[2]}/${cleanDay[0]}`;

        console.log(day);

        const stepOneProgressValue = {
          key: new Date(`${day}`),
          data:
            completeStatics[i].statics_tasks.statics_status_steps[0]
              .task_status_complete_count,
        };

        const stepTwoProgressValue = {
          key: new Date(day),
          data:
            completeStatics[i].statics_tasks.statics_status_steps[1]
              .task_status_complete_count,
        };

        stepOneProgressValues.push(stepOneProgressValue);
        stepTwoProgressValues.push(stepTwoProgressValue);
      }

      setStepOneProgress(stepOneProgressValues);
      setStepTwoProgress(stepTwoProgressValues);
    }
  };
  //******************* useEffects ************************
  // ! 전체 프로젝트 최초화면에 뿌려줌
  useEffect(() => {
    getAllProjects();
  }, []);

  // ! pId값이 바뀔 때마다 새로 리렌더링
  useEffect(() => {
    handleChangeMyWorkProject();
  }, [myWorkPId]);

  useEffect(() => {
    getMyWorksAllStatics();
    getMyWorkByDay();
  }, [myWorkPId, selectedStep, selectedInnerTab, progressDay]);

  return (
    <MyWorksPresenter
      handleGetMyWorkPId={handleGetMyWorkPId}
      inMyWorkCurrentProject={inMyWorkCurrentProject}
      allProjects={allProjects}
      loggedInUser={loggedInUser}
      project={project}
      page={location.search.split("=")[1] || "1"}
      totalTasksCount={totalTasksCount}
      openSidebarUpper={openSidebarUpper}
      selectedInnerTab={selectedInnerTab}
      searchText={searchText}
      handleSelectInnerTab={handleSelectInnerTab}
      getAllTasks={getAllTasks}
      isSelectedAllTasks={isSelectedAllTasks}
      selectAllTask={selectAllTask}
      removeAllTask={removeAllTask}
      pTasks={vTasks}
      removeTask={removeTask}
      isSelectedTask={isSelectedTask}
      selectTask={selectTask}
      filterByProgress={filterByProgress}
      handleTaskSearch={handleTaskSearch}
      handleChangeKeyword={handleChangeKeyword}
      myWorksWorkerStatics={myWorksWorkerStatics}
      myWorksValidatorStatics={myWorksValidatorStatics}
      handleCategory={handleCategory}
      selectedStep={selectedStep}
      handleChangeDay={handleChangeDay}
      progressDay={progressDay}
      stepOneProgress={stepOneProgress}
      stepTwoProgress={stepTwoProgress}
      handleGoStudio={handleGoStudio}
    />
  );
};

export default MyWorksContainer;
