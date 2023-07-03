import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import InnerSidebar from "../../../components/main/InnerSidebar";
import Header from "../../../components/main/Header";
import { ChakraProvider } from "@chakra-ui/react";
import { IProject, ISimpleProjectInfo } from "../../../api/projectApi";
import Loader from "../../../components/Loader";
import { MyWorksInnerSidebarItem } from "./MyWorksContainer";
import { IUserState } from "../../../redux/user/users";
import { ITask } from "../../../api/taskApi";
import ListHeader from "../../../components/main/ListHeader";
import ListItem from "../../../components/main/ListItem";
import { ChangeEvent } from "react";
import {
  Gridline,
  GridlineSeries,
  Line,
  LineChart,
  LineSeries,
  PieArcSeries,
  PieChart,
  PointSeries,
} from "reaviz";
import {
  IStaticsTaskByDay,
  IWorksProgressStatics,
} from "../../../api/staticsApi";
import Paginator from "../../../components/main/Paginator";
export interface InMyWorksPresenter {
  page: string;
  loggedInUser: IUserState;
  allProjects: ISimpleProjectInfo[] | undefined;
  openSidebarUpper: boolean; // 타입이 boolean인 것
  inMyWorkCurrentProject: ISimpleProjectInfo | undefined;
  selectedInnerTab: MyWorksInnerSidebarItem; //타입이 MyWorksInnerSidebarItem 인 것
  handleSelectInnerTab: (tab: MyWorksInnerSidebarItem) => void;
  handleGetMyWorkPId: (pId: number) => void; //pId라는 변수를 넣어서 void타입으로 리턴하는 함수
  getAllTasks: () => any;
  project: IProject | undefined;
  totalTasksCount: number | undefined;
  searchText: string | undefined;
  isSelectedAllTasks: () => boolean;
  selectAllTask: () => void;
  removeAllTask: () => void;
  selectTask: (taskId: number) => void;
  removeTask: (taskId: number) => void;
  isSelectedTask: (taskId: number) => boolean;
  pTasks: ITask[] | undefined;
  filterByProgress: (progress: string) => void;
  handleTaskSearch: () => Promise<void>;
  handleCategory: (statics: any) => void;
  handleChangeKeyword: (e: ChangeEvent<HTMLInputElement>) => void;
  myWorksWorkerStatics: IWorksProgressStatics | undefined;
  myWorksValidatorStatics: IWorksProgressStatics | undefined;
  selectedStep: number;
  progressDay: number;
  handleChangeDay: (e: ChangeEvent<HTMLSelectElement>) => void;
  stepOneProgress: IStaticsTaskByDay[];
  stepTwoProgress: IStaticsTaskByDay[];
  handleGoStudio: () => void;
}
const Select = styled.select`
  width: 150px;
  padding: 8px 10px;
  background-color: #f7fafe;
  font-size: 13px;
  font-weight: 800;
  border: 1px solid #aeccf4;
  font-weight: 500;
  :focus {
    outline: none;
  }
`;
const StaticsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  margin-top: 15px;
  background-color: #fff;
`;
const MainAllProjectStaticsContainer = styled.div`
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const MainWorkDataContainer = styled(MainAllProjectStaticsContainer)`
  width: 70%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-left: 20px;
`;
const LineIdentifier = styled.div`
  border-top-width: 2px;
  border-bottom-width: 1px;
  width: 20px;
  border-radius: 10px;
  border-style: solid;
`;
const PieChartContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const WorkProgressBox = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;
const MainWorkProgressCard = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 20px 20px;
  flex-direction: column;
  background-color: #f7fafe;
  border: 1px solid #ccdff8;
`;

const MainWorkProgressContainer = styled(MainAllProjectStaticsContainer)`
  width: 30%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: none;
  padding: 15px;
  margin-top: 10px;
  margin-left: 10px;
`;
const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
`;
const ProjectTopLeftLabel = styled(Label)`
  margin-right: 0;
`;
const MainProjectTop = styled.div`
  padding: 20px 40px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Horizontal = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  font-family: NanumSquare;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  width: 100%;
  height: 100%;
`;
const MainCenter = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #ecf3fb;
  width: 100%;
  padding: 30px 60px;
`;

const MainSearchContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const MainDaysWorkProgressContainer = styled(MainSearchContainer)`
  width: 55%;
  box-sizing: border-box;
  margin-left: 10px;
  padding: 20px;
`;
const MainActionBtnDiv = styled(MainSearchContainer)`
  width: 100%;
  padding: 15px 30px;
  margin-top: 20px;
  flex-direction: row;
  box-sizing: border-box;
`;
const MainProjectsContainer = styled(MainSearchContainer)`
  margin-top: 30px;
  min-height: 400px;
  max-height: 640px;
  display: flex;
  flex-direction: column;
  padding: 0;
`;
const Button = styled.div`
  display: flex;
  min-width: 60px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
`;
const StaticButton = styled(Button)<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? "#3580E3" : "#FFF")};
  border: 1px solid #aeccf4;
  font-size: 12px;
  border-radius: 20px;
  color: ${(props) => (props.isSelected ? "#FFF" : "#243654")};
`;
const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 10px;
  min-width: 720px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 16px;
  font-weight: 700;
  margin-right: 25px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #6b78a1;
  }
`;
const SearchBtn = styled.div<{ isValid: boolean }>`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid ${(props) => (props.isValid ? "#afccf4" : "gray")};
  font-size: 16px;
  font-weight: 700;
  color: #6b78a1;
  margin-right: 20px;
  background-color: ${(props) => (props.isValid ? "#3480E3" : "gray")};
  color: #ffffff;
  cursor: ${(props) => (props.isValid ? "pointer" : "not-allowed")};
`;
const MainListCenter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;
const Text = styled.span`
  color: #243654;
  font-size: 13px;
  font-weight: 700;
`;
const MyWorksPresenter: React.FC<InMyWorksPresenter> = ({
  page,
  loggedInUser,
  allProjects,
  pTasks,
  openSidebarUpper,
  inMyWorkCurrentProject,
  selectedInnerTab,
  handleSelectInnerTab,
  handleGetMyWorkPId,
  project,
  totalTasksCount,
  isSelectedAllTasks,
  removeAllTask,
  selectAllTask,
  selectTask,
  removeTask,
  isSelectedTask,
  filterByProgress,
  handleTaskSearch,
  handleChangeKeyword,
  handleCategory,
  selectedStep,
  myWorksWorkerStatics,
  myWorksValidatorStatics,
  handleChangeDay,
  progressDay,
  stepOneProgress,
  stepTwoProgress,
  handleGoStudio,
}) => {
  if (allProjects && inMyWorkCurrentProject) {
    return (
      <ChakraProvider>
        <Container>
          <Helmet>
            <title>SSLO | My Works</title>
          </Helmet>
          <InnerSidebar
            openSidebarUpper={openSidebarUpper}
            selectedInnerTab={selectedInnerTab}
            classification={"myworks"}
            handleSelectInnerTabMyWorks={handleSelectInnerTab}
            handleGetMyWorkPId={handleGetMyWorkPId}
            inMyWorkCurrentProject={inMyWorkCurrentProject}
            inMyWorkAllProjects={allProjects}
          />
          <MainWrapper>
            <Header title={inMyWorkCurrentProject.projectName} />
            <MainCenter>
              {selectedInnerTab === MyWorksInnerSidebarItem.myWorks && (
                <>
                  <MainActionBtnDiv
                    style={{ marginBottom: 20, marginTop: -15 }}
                  >
                    <StaticButton
                      onClick={() => handleCategory(1)}
                      isSelected={selectedStep === 1}
                    >
                      {inMyWorkCurrentProject.projectType === 1
                        ? "수집/정제"
                        : inMyWorkCurrentProject.projectType === 2
                        ? "전처리"
                        : "가공"}
                    </StaticButton>
                    <StaticButton
                      onClick={() => handleCategory(2)}
                      isSelected={selectedStep === 2}
                    >
                      검수
                    </StaticButton>
                  </MainActionBtnDiv>
                  <MainSearchContainer>
                    <Section style={{ padding: "15px 30px" }}>
                      <Label style={{ marginRight: 50 }}>검색어</Label>
                      <SearchInput
                        onKeyDown={(e) => {
                          e.key === "Enter" ? handleTaskSearch() : "";
                        }}
                        placeholder={"파일명을 입력해주세요."}
                        onChange={handleChangeKeyword}
                      />
                      <SearchBtn isValid={true} onClick={handleTaskSearch}>
                        검색
                      </SearchBtn>
                    </Section>
                  </MainSearchContainer>
                  <MainActionBtnDiv>
                    <Horizontal
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Section
                        style={{
                          width: "90px",
                          backgroundColor: "#5F6164",
                          color: "#FFF",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "500",
                          paddingLeft: "15px",
                        }}
                      >
                        <Button onClick={handleGoStudio}>STUDIO</Button>
                      </Section>
                    </Horizontal>
                  </MainActionBtnDiv>
                  <MainProjectsContainer>
                    <MainProjectTop>
                      <ProjectTopLeftLabel>{`데이터 (${totalTasksCount})`}</ProjectTopLeftLabel>
                    </MainProjectTop>
                    <ListHeader
                      type={"MY_WORK_LIST"}
                      projectType={project?.pType.project_type_id}
                      isSelectedAllTasks={isSelectedAllTasks}
                      removeAllTask={removeAllTask}
                      selectAllTask={selectAllTask}
                      filterByProgress={filterByProgress}
                    />
                    <MainListCenter>
                      {pTasks && pTasks.map((t, index) => {
                          return (
                            <ListItem
                              key={index}
                              task={t}
                              type={"MY_WORK_LIST"}
                              project={project}
                              currentUser={loggedInUser}
                              selectTask={selectTask}
                              removeTask={removeTask}
                              isSelectedTask={isSelectedTask}
                            />
                          );
                        })}
                    </MainListCenter>
                    <Paginator
                      itemCount={10}
                      page={page}
                      totalCount={totalTasksCount}
                    />
                  </MainProjectsContainer>
                </>
              )}
              {selectedInnerTab === MyWorksInnerSidebarItem.myWorksStatics && (
                <>
                  <MainActionBtnDiv
                    style={{ marginBottom: 20, marginTop: -15 }}
                  >
                    <StaticButton
                      onClick={() => handleCategory(1)}
                      isSelected={selectedStep === 1}
                    >
                      {inMyWorkCurrentProject.projectType === 1
                        ? "수집/정제"
                        : inMyWorkCurrentProject.projectType === 2
                        ? "전처리"
                        : "가공"}
                    </StaticButton>
                    <StaticButton
                      onClick={() => handleCategory(2)}
                      isSelected={selectedStep === 2}
                    >
                      검수
                    </StaticButton>
                  </MainActionBtnDiv>
                  {selectedStep === 1 && myWorksWorkerStatics && (
                    <StaticsContainer>
                      <MainWorkProgressContainer>
                        <Section style={{ marginBottom: 20 }}>
                          <Label style={{ marginRight: 10, fontSize: 15 }}>
                            작업상태
                          </Label>
                        </Section>
                        <MainWorkProgressCard>
                          <Label style={{ width: 120, fontSize: 15 }}>
                            프로젝트 진행현황
                          </Label>
                          <WorkProgressBox>
                            <PieChartContainer>
                              <PieChart
                                width={500}
                                height={300}
                                data={
                                  myWorksWorkerStatics.progressOneComplete ===
                                    0 &&
                                  myWorksWorkerStatics.progressTwoComplete ===
                                    0 &&
                                  myWorksWorkerStatics.progressThreeComplete ===
                                    0 &&
                                  myWorksWorkerStatics.progressFourComplete ===
                                    0
                                    ? [{ key: "데이터 없음", data: 1 }]
                                    : [
                                        {
                                          key: "미작업",
                                          data:
                                            myWorksWorkerStatics.progressOneComplete,
                                        },
                                        {
                                          key: "진행중",
                                          data:
                                            myWorksWorkerStatics.progressTwoComplete,
                                        },
                                        {
                                          key: "작업완료",
                                          data:
                                            myWorksWorkerStatics.progressThreeComplete,
                                        },
                                        {
                                          key: "반려",
                                          data:
                                            myWorksWorkerStatics.progressFourComplete,
                                        },
                                      ]
                                }
                                series={
                                  <PieArcSeries
                                    colorScheme={"set2"}
                                    doughnut={true}
                                    cornerRadius={4}
                                    padAngle={0.02}
                                    padRadius={200}
                                  />
                                }
                              />
                            </PieChartContainer>
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              {myWorksWorkerStatics.progressThreeComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksWorkerStatics.progressThreeComplete /
                                      myWorksWorkerStatics.totalCount) *
                                      100
                                  )}
                              % 완료
                            </Label>
                          </WorkProgressBox>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Label style={{ marginLeft: 10, fontSize: 15 }}>
                              작업상태
                            </Label>
                            <Label style={{ marginRight: 10, fontSize: 15 }}>
                              파일개수
                            </Label>
                            <Label style={{ marginRight: 30, fontSize: 15 }}>
                              비율
                            </Label>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              미작업
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksWorkerStatics.progressOneComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksWorkerStatics.progressOneComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksWorkerStatics.progressOneComplete /
                                      myWorksWorkerStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              진행중
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksWorkerStatics.progressTwoComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksWorkerStatics.progressTwoComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksWorkerStatics.progressTwoComplete /
                                      myWorksWorkerStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              작업완료
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksWorkerStatics.progressThreeComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksWorkerStatics.progressThreeComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksWorkerStatics.progressThreeComplete /
                                      myWorksWorkerStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              반려
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksWorkerStatics.progressFourComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksWorkerStatics.progressFourComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksWorkerStatics.progressFourComplete /
                                      myWorksWorkerStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                        </MainWorkProgressCard>
                        <MainListCenter />
                      </MainWorkProgressContainer>
                      <MainDaysWorkProgressContainer>
                        <Section
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Label style={{ marginRight: 10, fontSize: 15 }}>
                            일별 작업량
                          </Label>
                          <Select
                            onChange={handleChangeDay}
                            value={progressDay}
                          >
                            <option value={1}>1일</option>
                            <option value={3}>3일</option>
                            <option value={7}>7일</option>
                            <option value={14}>14일</option>
                            <option value={30}>30일</option>
                          </Select>
                        </Section>
                        <MainWorkProgressCard>
                          <Section
                            style={{
                              marginBottom: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              작업량
                            </Label>
                          </Section>
                          <LineChart
                            height={300}
                            data={
                              stepOneProgress.length !== 0
                                ? stepOneProgress
                                : [{ key: new Date("01/01/1111"), data: 0 }]
                            }
                            series={
                              <LineSeries
                                symbols={
                                  <PointSeries
                                    show={
                                      stepOneProgress.length === 0
                                        ? false
                                        : true
                                    }
                                  />
                                }
                                line={<Line strokeWidth={1} />}
                                colorScheme={["#1C63CF"]}
                              />
                            }
                            gridlines={
                              <GridlineSeries
                                line={<Gridline direction={"y"} />}
                              />
                            }
                          />
                          <Section
                            style={{
                              marginTop: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <>
                              <LineIdentifier
                                style={{
                                  borderColor: "#1C63CF",
                                  marginRight: 5,
                                }}
                              />
                              <Label style={{ fontSize: 12 }}>
                                완료한 파일 수
                              </Label>
                            </>
                          </Section>
                        </MainWorkProgressCard>
                      </MainDaysWorkProgressContainer>
                    </StaticsContainer>
                  )}
                  {selectedStep === 2 && myWorksValidatorStatics && (
                    <StaticsContainer>
                      <MainWorkProgressContainer>
                        <Section style={{ marginBottom: 20 }}>
                          <Label style={{ marginRight: 10, fontSize: 15 }}>
                            작업상태
                          </Label>
                        </Section>
                        <MainWorkProgressCard>
                          <Label style={{ width: 120, fontSize: 15 }}>
                            프로젝트 진행현황
                          </Label>
                          <WorkProgressBox>
                            <PieChartContainer>
                              <PieChart
                                width={500}
                                height={300}
                                data={
                                  myWorksValidatorStatics.progressOneComplete ===
                                    0 &&
                                  myWorksValidatorStatics.progressTwoComplete ===
                                    0 &&
                                  myWorksValidatorStatics.progressThreeComplete ===
                                    0 &&
                                  myWorksValidatorStatics.progressFourComplete ===
                                    0
                                    ? [{ key: "데이터 없음", data: 1 }]
                                    : [
                                        {
                                          key: "미작업",
                                          data:
                                            myWorksValidatorStatics.progressOneComplete,
                                        },
                                        {
                                          key: "진행중",
                                          data:
                                            myWorksValidatorStatics.progressTwoComplete,
                                        },
                                        {
                                          key: "작업완료",
                                          data:
                                            myWorksValidatorStatics.progressThreeComplete,
                                        },
                                        {
                                          key: "반려",
                                          data:
                                            myWorksValidatorStatics.progressFourComplete,
                                        },
                                      ]
                                }
                                series={
                                  <PieArcSeries
                                    colorScheme={"set2"}
                                    doughnut={true}
                                    cornerRadius={4}
                                    padAngle={0.02}
                                    padRadius={200}
                                  />
                                }
                              />
                            </PieChartContainer>
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              {myWorksValidatorStatics.progressThreeComplete ===
                              0
                                ? "0"
                                : Math.round(
                                    (myWorksValidatorStatics.progressThreeComplete /
                                      myWorksValidatorStatics.totalCount) *
                                      100
                                  )}
                              % 완료
                            </Label>
                          </WorkProgressBox>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Label style={{ marginLeft: 10, fontSize: 15 }}>
                              작업상태
                            </Label>
                            <Label style={{ marginRight: 10, fontSize: 15 }}>
                              파일개수
                            </Label>
                            <Label style={{ marginRight: 30, fontSize: 15 }}>
                              비율
                            </Label>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              미작업
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksValidatorStatics.progressOneComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksValidatorStatics.progressOneComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksValidatorStatics.progressOneComplete /
                                      myWorksValidatorStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              진행중
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksValidatorStatics.progressTwoComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksValidatorStatics.progressTwoComplete === 0
                                ? "0"
                                : Math.round(
                                    (myWorksValidatorStatics.progressTwoComplete /
                                      myWorksValidatorStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              작업완료
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksValidatorStatics.progressThreeComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksValidatorStatics.progressThreeComplete ===
                              0
                                ? "0"
                                : Math.round(
                                    (myWorksValidatorStatics.progressThreeComplete /
                                      myWorksValidatorStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ width: 150, marginLeft: 20 }}>
                              반려
                            </Text>
                            <Text style={{ width: 70, marginLeft: 60 }}>
                              {myWorksValidatorStatics.progressFourComplete}
                            </Text>
                            <Text style={{ width: 70, marginLeft: 80 }}>
                              {myWorksValidatorStatics.progressFourComplete ===
                              0
                                ? "0"
                                : Math.round(
                                    (myWorksValidatorStatics.progressFourComplete /
                                      myWorksValidatorStatics.totalCount) *
                                      100
                                  )}
                              %
                            </Text>
                          </Section>
                        </MainWorkProgressCard>
                        <MainListCenter />
                      </MainWorkProgressContainer>
                      <MainDaysWorkProgressContainer>
                        <Section
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Label style={{ marginRight: 0, fontSize: 15 }}>
                            일별 작업량
                          </Label>
                          <Select
                            onChange={handleChangeDay}
                            value={progressDay}
                          >
                            <option value={1}>1일</option>
                            <option value={3}>3일</option>
                            <option value={7}>7일</option>
                            <option value={14}>14일</option>
                            <option value={30}>30일</option>
                          </Select>
                        </Section>
                        <MainWorkProgressCard>
                          <Section
                            style={{
                              marginBottom: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              작업량
                            </Label>
                          </Section>
                          <LineChart
                            height={300}
                            data={
                              stepTwoProgress.length !== 0
                                ? stepTwoProgress
                                : [{ key: new Date("01/01/1111"), data: 0 }]
                            }
                            series={
                              <LineSeries
                                symbols={
                                  <PointSeries
                                    show={
                                      stepTwoProgress.length !== 0
                                        ? true
                                        : false
                                    }
                                  />
                                }
                                line={<Line strokeWidth={1} />}
                                colorScheme={["#1C63CF"]}
                              />
                            }
                            gridlines={
                              <GridlineSeries
                                line={<Gridline direction={"y"} />}
                              />
                            }
                          />
                          <Section
                            style={{
                              marginTop: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <>
                              <LineIdentifier
                                style={{
                                  borderColor: "#1C63CF",
                                  marginRight: 5,
                                }}
                              />
                              <Label style={{ fontSize: 12 }}>
                                완료한 파일 수
                              </Label>
                            </>
                          </Section>
                        </MainWorkProgressCard>
                      </MainDaysWorkProgressContainer>
                    </StaticsContainer>
                  )}
                </>
              )}
            </MainCenter>
          </MainWrapper>
        </Container>
      </ChakraProvider>
    );
  } else {
    return <Loader />;
  }
};

export default MyWorksPresenter;
