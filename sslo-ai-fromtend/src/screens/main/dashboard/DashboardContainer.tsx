import React, { ChangeEvent, useEffect, useState } from "react";
import projectApi, {
  IProject,
} from "../../../api/projectApi";
import staticsApi, { IStaticsTaskByDay } from "../../../api/staticsApi";
import Loader from "../../../components/Loader";
import { useAppSelector } from "../../../hooks";
import { getFormattedDate, setOffset } from "../../../utils";
import DashboardPresenter from "./DashboardPresenter";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const DashboardContainer = () => {
  const user = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();
  // ! project list current page state
  const [page, setPage] = useState<number>(1);
  // ! 프로젝트 현황의 검색어 state
  const [searchText, setSearchText] = useState<string>("");
  // ! 검색 실행 시 서버로부터 데이터를 받아오기까지 loading state
  const [loading, setLoading] = useState<boolean>(false);
  // ! project list state
  const [projects, setProjects] = useState<IProject[]>([]);
  const [listProjects, setListProjects] = useState<IProject[]>([]);

  const [dataProjects, setDataProjects] = useState([]);
  // ! project list total count state
  const [totalPJCount, setTotalPJCount] = useState<number>(0);
  // ! project status=2 state
  const [progressCount, setProgressCount] = useState<number>(0);
  // ! project status=3 state
  const [completeCount, setCompleteCount] = useState<number>(0);
  // ! task 미작업 수량 state -total
  const [oneTotalCnt, setOneTotalCnt] = useState<number>(0);
  // ! task 진행중 수량 state -total
  const [twoTotalCnt, setTwoTotalCnt] = useState<number>(0);
  // ! task 완료 수량 state -total
  const [threeTotalCnt, setThreeTotalCnt] = useState<number>(0);
  // ! 작업데이터 수량 우측 날짜 값 state
  const [progressDay, setProgressDay] = useState<number>(7);
  const handleChangeProgressDay = (e: ChangeEvent<HTMLSelectElement>) => {
    setProgressDay(parseInt(e.target.value));
  };
  // ! task 미작업 수량 state -work
  const [oneStatusCnt, setOneStatusCnt] = useState<IStaticsTaskByDay[]>(null);
  // ! task 진행중 수량 state -work
  const [twoStatusCnt, setTwoStatusCnt] = useState<IStaticsTaskByDay[]>([]);
  // ! task 완료 수량 state -work
  const [threeStatusCnt, setThreeStatusCnt] = useState<IStaticsTaskByDay[]>([]);

  // ! clean projects data from server
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
        updated: any;
      }) => {
        if(p.project_manager.organization_id === user.organizationId) {
          const pNo = p.project_id;
          const pName = p.project_name;
          const pType = p.project_type;
          const pWorkerCount = p.project_member_statics;
          const pCreated = p.created;
          const pUpdated = p.updated || null;

          const pForm = {
            pNo,
            pName,
            pType,
            pWorkerCount,
            pCreated,
            pUpdated,
          };
          cleanedProjects.push(pForm);
        }
      }
    );
    setLoading(false);
    setProjects(cleanedProjects);
    setListProjects(cleanedProjects.filter((p, id) => { return id >= ((page - 1) * 5) && id < (page * 5) }));
    setTotalPJCount(cleanedProjects.length);
  };
  // ! get projects data from server
  const searchAllProjects = async () => {
    setLoading(true);
    const res = await projectApi.getAllProjects(
      { maxResults: 3000 },
      user.accessToken!
    );
    if (res && res.status === 200) {
      cleanProjects(res.data);
      console.log(res.data.datas);
    }
  };
  // ! total project count
  const getProjectsCount = async () => {
    const res = await projectApi.getAllProjects({ maxResults: 3000 });
    if (res && res.status === 200) {
      let progressCnt = 0;
      let completeCnt = 0;
      let pArr = [];
      const prjs = res.data.datas;
      for (let i = 0; i < prjs.length; i++) {
        if(prjs[i].project_manager.organization_id === user.organizationId) {
          if (prjs[i].project_status === 2) {
            progressCnt++;
          }
          if (prjs[i].project_status === 3) {
            completeCnt++;
            console.log(completeCount);
          }
          pArr.push(prjs[i].project_id);
        }
      }
      setProgressCount(progressCnt);
      setCompleteCount(completeCnt);
      setDataProjects(pArr);
    }
  };
  // ! data count
  const getTasksCount = async () => {
    if (!dataProjects || dataProjects.length < 0) return;

    //****전체데이터 수량 */
    let tempTotalOne = 0;
    let tempTotalTwo = 0;
    let tempTotalThree = 0;

    //****작업데이터 수량 */
    let dayStaticsOneProgressResult: IStaticsTaskByDay[] = [];
    let dayStaticsTwoProgressResult: IStaticsTaskByDay[] = [];
    let dayStaticsThreeProgressResult: IStaticsTaskByDay[] = [];
    let orderedArrOne: IStaticsTaskByDay[];
    let orderedArrTwo: IStaticsTaskByDay[];
    let orderedArrThree: IStaticsTaskByDay[];

    for (let i = 0; i < dataProjects.length; i++) {
      // ! 전체 데이터 수량
      const res = await staticsApi.getStaticsTaskByProject({
        project_id: dataProjects[i],
      });
      if (res && res.status === 200) {
        let oneCnt =
          res.data.statics_status_steps[0].task_status_progress[0].count +
          res.data.statics_status_steps[1].task_status_progress[0].count;
        let twoCnt =
          res.data.statics_status_steps[0].task_status_progress[1].count +
          res.data.statics_status_steps[1].task_status_progress[1].count;
        let threeCnt =
          res.data.statics_status_steps[0].task_status_progress[2].count +
          res.data.statics_status_steps[1].task_status_progress[2].count;

        //****전체데이터수량 count */
        if (oneCnt) {
          tempTotalOne += oneCnt;
        }
        if (twoCnt) {
          tempTotalTwo += twoCnt;
        }
        if (threeCnt) {
          tempTotalThree += threeCnt;
        }
      }

      // ! 작업 데이터 수량
      const response = await staticsApi.getStaticsTaskByDay({
        project_id: dataProjects[i],
        startBeforeDays: progressDay,
      });

      if (response && response.status === 200) {
        console.log(response.data);
        const dayStatics = response.data;

        for (let i = 0; i < dayStatics.length; i++) {
          let isPush = true;
          let dayStaticsOneProgress;
          let dayStaticsTwoProgress;
          let dayStaticsThreeProgress;
          // ! 미작업 수량
          for (let j = 0; j < dayStaticsOneProgressResult.length; j++) {
            //날짜 비교하여 동일하면 data값 누적시키고, false return
            if (
              dayStaticsOneProgressResult[j].key.getDate() ===
              new Date(dayStatics[i].day).getDate()
            ) {
              dayStaticsOneProgressResult[j].data +=
                dayStatics[
                  i
                ].statics_tasks.statics_status_steps[0].task_status_progress[0].count;
              isPush = false;
              break;
            }
          }
          // true일 땐 그대로 출력
          if (isPush) {
            dayStaticsOneProgress = {
              key: new Date(dayStatics[i].day),
              data:
                dayStatics[i].statics_tasks.statics_status_steps[0]
                  .task_status_progress[0].count,
            };
            dayStaticsOneProgressResult.push(dayStaticsOneProgress);
          }

          // ! 진행중 수량
          for (let j = 0; j < dayStaticsTwoProgressResult.length; j++) {
            if (
              dayStaticsTwoProgressResult[j].key.getDate() ===
              new Date(dayStatics[i].day).getDate()
            ) {
              dayStaticsTwoProgressResult[j].data +=
                dayStatics[
                  i
                ].statics_tasks.statics_status_steps[0].task_status_progress[1].count;
              isPush = false;
              break;
            }
          }
          if (isPush) {
            dayStaticsTwoProgress = {
              key: new Date(dayStatics[i].day),
              data:
                dayStatics[i].statics_tasks.statics_status_steps[0]
                  .task_status_progress[1].count,
            };
            dayStaticsTwoProgressResult.push(dayStaticsTwoProgress);
          }

          // ! 완료 수량
          for (let j = 0; j < dayStaticsThreeProgressResult.length; j++) {
            if (
              dayStaticsThreeProgressResult[j].key.getDate() ===
              new Date(dayStatics[i].day).getDate()
            ) {
              dayStaticsThreeProgressResult[j].data +=
                dayStatics[
                  i
                ].statics_tasks.statics_status_steps[0].task_status_progress[2].count;
              isPush = false;
              break;
            }
          }
          if (isPush) {
            dayStaticsThreeProgress = {
              key: new Date(dayStatics[i].day),
              data:
                dayStatics[i].statics_tasks.statics_status_steps[0]
                  .task_status_progress[2].count,
            };
            dayStaticsThreeProgressResult.push(dayStaticsThreeProgress);
          }
        }

        //****작업데이터수량 날짜순 정렬 */
        orderedArrOne = dayStaticsOneProgressResult.sort((a, b) => {
          if (a.key > b.key) return 1; //true 반환
          if (a.key < b.key) return -1; //false 반환
          return 0;
        });
        orderedArrTwo = dayStaticsTwoProgressResult.sort((a, b) => {
          if (a.key > b.key) return 1;
          if (a.key < b.key) return -1;
          return 0;
        });
        orderedArrThree = dayStaticsThreeProgressResult.sort((a, b) => {
          if (a.key > b.key) return 1;
          if (a.key < b.key) return -1;
          return 0;
        });
      }
    }

    //****작업데이터수량 state 저장 */
    setOneStatusCnt(() => orderedArrOne);
    setTwoStatusCnt(() => orderedArrTwo);
    setThreeStatusCnt(() => orderedArrThree);

    //****전체데이터수량 state 저장 */
    setOneTotalCnt(tempTotalOne);
    setTwoTotalCnt(tempTotalTwo);
    setThreeTotalCnt(tempTotalThree);
  };

  // ! 보고서 다운로드
  const onDownload = () => {
    const main = document.getElementById("mainCenter");
    html2canvas(main).then((canvas) => {
      // 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // 가로(mm) (A4)
      const pageHeight = imgWidth * 1.414; // 세로 길이 (A4)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const mainHeight = main.clientHeight * (210 / main.clientWidth)

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지 출력
      doc.addImage(imgData, "PNG", 0, position, imgWidth, mainHeight);
      heightLeft -= pageHeight;
      doc.save("dashboard"+"_"+getFormattedDate(Date.now())+".pdf");
    });
  };

  // ! called when page button clicked
  const handleChangeMemberPage = async (page: number) => {
    setLoading(true);
    const res = await projectApi.getAllProjects(
      //setOffset(page, 5),
      { maxResults: 3000 },
      user.accessToken!
    );
    if (res && res.status === 200) {
      cleanProjects(res.data);
    }
    setPage(page);
  };

  useEffect(() => {
    if(projects)
      setListProjects(projects.filter((p, id) => { return id >= ((page - 1) * 5) && id < (page * 5) }));
  }, [page]);

  // ! search text
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    doSearchByPName();
  };
  // ! search by given project name
  const doSearchByPName = async () => {
    setLoading(true);
    const res = await projectApi.getAllProjects(
      {
        ...setOffset(page, 5),
        project_name: searchText,
      },
      user.accessToken!
    );
    if (res && res.status === 200) {
      cleanProjects(res.data);
    }
  };

  // ! 프로젝트 현황 리스트에서 검색 조건 초기화
  const resetSearch = () => {
    setSearchText("");
    searchAllProjects();
  };
  // ! fetch projects data when rendering this page
  useEffect(() => {
    if(!user.isAdmin) {
      navigate("/main/myworks");
    }
    searchAllProjects();
    getProjectsCount();
  }, []);
  useEffect(() => {
    getTasksCount();
  }, [dataProjects, progressDay]);
  if (projects && totalPJCount >= 0) {
    return (
      <DashboardPresenter
        page={page}
        projects={listProjects}
        totalPJCount={totalPJCount}
        searchText={searchText}
        loading={loading}
        progressCount={progressCount}
        completeCount={completeCount}
        oneTotalCnt={oneTotalCnt}
        twoTotalCnt={twoTotalCnt}
        threeTotalCnt={threeTotalCnt}
        oneStatusCnt={oneStatusCnt}
        twoStatusCnt={twoStatusCnt}
        threeStatusCnt={threeStatusCnt}
        progressDay={progressDay}
        handleEnter={handleEnter}
        handleChangeSearch={handleChangeSearch}
        handleChangeMemberPage={handleChangeMemberPage}
        doSearchByPName={doSearchByPName}
        resetSearch={resetSearch}
        handleChangeProgressDay={handleChangeProgressDay}
        onDownload={onDownload}
      />
    );
  } else {
    return <Loader />;
  }
};

export default DashboardContainer;