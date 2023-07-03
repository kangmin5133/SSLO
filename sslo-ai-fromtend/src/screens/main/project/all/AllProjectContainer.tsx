import React, { useEffect, useState, ChangeEvent } from "react";
import AllProjectPresenter from "./AllProjectPresenter";
import projectApi, {
  IGetAllProjectsParams,
  IProject,
} from "../../../../api/projectApi";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getFirstDayOfCurrentMonthMillisecondsDate,
  getTodayMillisecondsDate,
  getTodayOfAMonthMillisecondsDate,
  setOffset,
} from "../../../../utils";
import Loader from "../../../../components/Loader";
import { useAppSelector } from "../../../../hooks";

export const CURRENT_MONTH = "당월";
export const MONTH_1 = "1개월";
export const MONTH_3 = "3개월";
export const MONTH_6 = "6개월";
export const MONTH_12 = "12개월";
export type MonthType = "당월" | "1개월" | "3개월" | "6개월" | "12개월";

const AllProjectContainer = () => {
  const user = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();
  // ! navigation
  const location = useLocation();
  // ! 날짜 선택 시 시작날짜 - 종료날짜
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  // ! is calendar open ?
  const [calendar, setCalendar] = useState<boolean>(false);
  // ! all projects array
  const [projects, setProjects] = useState<IProject[]>();
  // ! projects total count
  const [totalPJCount, setTotalPJCount] = useState<number>(0);
  // ! filter project name
  const [inputPName, setInputPName] = useState<string>("");
  // ! selected month button
  const [selectedMonth, setSelectedMonth] = useState<MonthType>();
  // ! 현재 프로젝트 리스트의 페이지 넘버
  const [page, setPage] = useState<number>(1);
  // ! 필터링 조건을 state로 저장
  const [filterParams, setFilterParams] = useState<any>();

  const [viewProject, setViewProject] = useState<IProject[]>();

  //********************** calendar functions ***********************/
  // ! show calendar
  const showCalendar = () => {
    setCalendar(true);
    setSelectedMonth(undefined);
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
      searchProjects({
        //...setOffset(1, 10),
        maxResults: 1000,
        created_start: startDate.getTime(),
        created_end: endDate.getTime(),
      });
      setPage(1);
      setFilterParams({
        created_start: startDate.getTime(),
        created_end: endDate.getTime(),
      });
    }
    // eslint-disable-next-line
  }, [dateRange]);

  //******************** Fetch project data ***********************/
  // ! 서버로부터 프로젝트 정보를 가져온 후 해당 프로젝트를 정제하여 state에 저장한다.
  const cleanProjects = (data: any) => {
    let cleanedProjects: IProject[] = [];
    data.datas.forEach(
      (p: {
        project_id: any;
        project_name: any;
        project_type: any;
        project_manager: any;
        project_member_statics: any;
        created: any;
      }) => {
        if(p.project_manager.organization_id === user.organizationId) {
          const pNo = p.project_id;
          const pName = p.project_name;
          const pType = p.project_type;
          const pWorkerCount = p.project_member_statics;
          const pCreated = p.created;

          const pForm = {
            pNo,
            pName,
            pType,
            pWorkerCount,
            pCreated,
          };
          cleanedProjects.push(pForm);
        }
      }
    );
    setProjects(cleanedProjects);
    setViewProject(cleanedProjects.filter((p, id) => { return id >= ((page - 1) * 10) && id < (page * 10) }));
    setTotalPJCount(cleanedProjects.length);
  };

  const handleChangeProjectsPage = async (paramPage: number) => {
    const res = await projectApi.getAllProjects(
      { /* ...setOffset(paramPage, 10), */ ...filterParams, maxResults: 1000, },
      user.accessToken!
    );
    if (res && res.status === 200) {
      cleanProjects(res.data);
    }
    setPage(paramPage);
  };

  // ! 서버로부터 프로젝트 정보를 fetch (filter를 받든 안받든)
  const searchProjects = async (params: IGetAllProjectsParams) => {
    const res = await projectApi.getAllProjects(params, user.accessToken!);
    if (res && res.status === 200 && res.data) {
      cleanProjects(res.data);
    }
  };

  // ! 프로젝트 리스트에서 프로젝트 유형별 필터
  const handleFilterProjects = (checkedTypes: string | string[]) => {
    // 0: 전체, 1: 수집/정제, 2: 전처리, 3: 가공
    switch (checkedTypes) {
      case "0":
        resetSearch();
        break;
      case "1":
        searchProjects({
          project_type_id: 1,
          //...setOffset(1, 10),
          maxResults: 1000,
        });
        setPage(1);
        setFilterParams({ project_type_id: 1 });
        setDateRange(null);
        setSelectedMonth(undefined);
        break;
      case "2":
        searchProjects({
          project_type_id: 2,
          //...setOffset(1, 10),
          maxResults: 1000,
        });
        setPage(1);
        setFilterParams({ project_type_id: 2 });
        setDateRange(null);
        setSelectedMonth(undefined);
        break;
      case "3":
        searchProjects({
          project_type_id: 3,
          //...setOffset(1, 10),
          maxResults: 1000,
        });
        setPage(1);
        setFilterParams({ project_type_id: 3 });
        setDateRange(null);
        setSelectedMonth(undefined);
        break;
    }
  };

  //******************** Search section ***************************/
  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    searchProjectsByName();
  };
  // ! 프로젝트 명으로 서치
  const searchProjectsByName = async () => {
    searchProjects({
      project_name: inputPName,
      //...setOffset(1, 10),
      maxResults: 1000,
    });
    setPage(1);
    setFilterParams({ project_name: inputPName });
    setDateRange(null);
    setSelectedMonth(undefined);
  };
  // ! 프로젝트 명 입력 시 해당 값 onChange
  const setFilterProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPName(event.target.value);
  };
  // ! 당월, 1개월, 3개월, 6개월, 12개월 버튼 클릭 시 호출되는 function -> data를 서버로부터 fetch하고 다시 뿌려줌
  const searchProjectsByMonthBtn = async (month: MonthType) => {
    let start;
    let end;

    switch (month) {
      case CURRENT_MONTH:
        start = getFirstDayOfCurrentMonthMillisecondsDate();
        end = getTodayMillisecondsDate();
        break;
      case MONTH_1:
        start = getTodayOfAMonthMillisecondsDate(-1);
        end = getTodayMillisecondsDate();
        break;
      case MONTH_3:
        start = getTodayOfAMonthMillisecondsDate(-3);
        end = getTodayMillisecondsDate();
        break;
      case MONTH_6:
        start = getTodayOfAMonthMillisecondsDate(-6);
        end = getTodayMillisecondsDate();
        break;
      case MONTH_12:
        start = getTodayOfAMonthMillisecondsDate(-12);
        end = getTodayMillisecondsDate();
        break;
    }

    searchProjects({
      //...setOffset(1, 10),
      maxResults: 1000,
      created_start: start,
      created_end: end,
    });
    setPage(1);
    setSelectedMonth(month);
    setFilterParams({ created_start: start, created_end: end });
    setDateRange(null);
  };

  const resetSearch = () => {
    setDateRange(null);
    setSelectedMonth(undefined);
    setInputPName("");
    setFilterParams(undefined);
    setPage(1);
    // searchProjects(setOffset(1, 10));
    searchProjects({ maxResults: 1000 });
  };

  useEffect(() => {
    if(projects)
      setViewProject(projects.filter((p, id) => { return id >= ((page - 1) * 10) && id < (page * 10) }));
  }, [page]);

  //******************* useEffects ************************/
  // ! 최초 렌더링 시 searchProjects() call
  useEffect(() => {
    if(!user.isAdmin) {
      navigate("/main/myworks");
    }
    searchProjects({maxResults: 1000});
    // eslint-disable-next-line
  }, []);
  if (projects) {
    return (
      <AllProjectPresenter
        dateRange={dateRange}
        calendar={calendar}
        selectedMonth={selectedMonth}
        projects={viewProject}
        totalPJCount={totalPJCount}
        page={page}
        inputPName={inputPName}
        handlePopupDown={handlePopupDown}
        handleEnter={handleEnter}
        resetSearch={resetSearch}
        showCalendar={showCalendar}
        handleChangeCalendar={handleChangeCalendar}
        dateToString={dateToString}
        searchProjectsByName={searchProjectsByName}
        setFilterProjectName={setFilterProjectName}
        searchProjectsByMonthBtn={searchProjectsByMonthBtn}
        handleChangeProjectsPage={handleChangeProjectsPage}
        handleFilterProjects={handleFilterProjects}
      />
    );
  }
  return <Loader />;
};

export default AllProjectContainer;
