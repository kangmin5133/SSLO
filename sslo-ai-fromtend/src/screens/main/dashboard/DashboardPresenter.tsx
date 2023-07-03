import React, { ChangeEvent } from "react";
import {
  Gridline,
  GridlineSeries,
  Line,
  LinearXAxis,
  LinearXAxisTickLabel,
  LinearXAxisTickSeries,
  LineChart,
  LineSeries,
  PieArcSeries,
  PieChart,
  PointSeries,
} from "reaviz";
import styled from "styled-components";
import Header from "../../../components/main/Header";
import iconSearch from "../../../assets/images/project/icon/icon-search-white.svg";
import ListHeader from "../../../components/main/ListHeader";
import ListItem from "../../../components/main/ListItem";
import Paginator from "../../../components/main/Paginator";
import { IProject } from "../../../api/projectApi";
import Loader from "../../../components/Loader";
import { Helmet } from "react-helmet-async";
import { IStaticsTaskByDay } from "../../../api/staticsApi";
interface IDashboardPresenter {
  page: number;
  projects: IProject[];
  totalPJCount: number;
  searchText: string | undefined;
  loading: boolean;
  progressCount: number;
  completeCount: number;
  oneTotalCnt: number;
  twoTotalCnt: number;
  threeTotalCnt: number;
  oneStatusCnt: IStaticsTaskByDay[];
  twoStatusCnt: IStaticsTaskByDay[];
  threeStatusCnt: IStaticsTaskByDay[];
  progressDay: number;
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  handleChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeMemberPage: (page: number) => Promise<void>;
  handleChangeProgressDay: (e: ChangeEvent<HTMLSelectElement>) => void;
  doSearchByPName: () => Promise<void>;
  resetSearch: () => void;
  onDownload: () => void;
}

const Container = styled.div`
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: NanumSquare;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;
const MainCenter = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #ecf3fb;
  width: 100%;
  height: 100%;
  padding: 30px 60px;
`;
const MainAllProjectStaticsContainer = styled.div`
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
`;
const Text = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #243654;
`;
const CountCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7fafe;
  width: 180px;
  height: 110px;
  margin-right: 15px;
`;
const CountCardTitle = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: #243754;
`;
const HorizontalDivider = styled.div`
  width: 30px;
  border: 2px solid black;
  margin: 15px 0;
  border-radius: 20px;
  border-left-width: 0;
  border-right-width: 0;
`;
const StaticsContainer = styled.div`
  width: 100%;
  display: flex;
  box-sizing: border-box;
  margin-top: 15px;
`;
const MainWorkProgressContainer = styled(MainAllProjectStaticsContainer)`
  width: 25%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
`;
const MainWorkDataContainer = styled(MainAllProjectStaticsContainer)`
  width: 74.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-left: 10px;
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
const WorkProgressBox = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;
const PieChartContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const LineIdentifier = styled.div`
  border-top-width: 2px;
  border-bottom-width: 1px;
  width: 20px;
  border-radius: 10px;
  border-style: solid;
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
const Icon = styled.img``;
const MainListCenter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
`;
const Button = styled.div`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
`;
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
const DashboardPresenter: React.FC<IDashboardPresenter> = ({
  page,
  projects,
  totalPJCount,
  searchText,
  loading,
  progressCount,
  completeCount,
  oneTotalCnt,
  twoTotalCnt,
  threeTotalCnt,
  oneStatusCnt,
  twoStatusCnt,
  threeStatusCnt,
  progressDay,
  handleEnter,
  handleChangeSearch,
  handleChangeMemberPage,
  handleChangeProgressDay,
  doSearchByPName,
  resetSearch,
  onDownload,
}) => {
  return (
    <Container>
      <Helmet>
        <title>SSLO | DASHBOARD</title>
      </Helmet>
      <MainWrapper>
        <Header title={"대시보드"} />
        <MainCenter id={"mainCenter"}>
          <MainAllProjectStaticsContainer>
            <Section>
              <Label style={{ marginRight: 10 }}>전체 프로젝트</Label>
              <Text>{new Date().toISOString().split("T")[0]}기준</Text>
              <Button
                style={{
                  width: "100px",
                  backgroundColor: "#3580E3",
                  color: "#FFF",
                  textAlign: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginLeft: "20px",
                  display: "inline",
                }}
                onClick={onDownload}
              >
                보고서다운로드
              </Button>
            </Section>
            <Section style={{ marginTop: 15 }}>
              <CountCard>
                <CountCardTitle>총 프로젝트 수</CountCardTitle>
                <HorizontalDivider />
                <Label>{progressCount + completeCount}</Label>
              </CountCard>
              <CountCard>
                <CountCardTitle>진행중인 프로젝트 수</CountCardTitle>
                <HorizontalDivider />
                <Label>{progressCount}</Label>
              </CountCard>
              <CountCard>
                <CountCardTitle>완료 프로젝트 수</CountCardTitle>
                <HorizontalDivider />
                <Label>{completeCount}</Label>
              </CountCard>
            </Section>
          </MainAllProjectStaticsContainer>
          <StaticsContainer>
            <MainWorkProgressContainer>
              <Section style={{ marginBottom: 20 }}>
                <Label style={{ marginRight: 10, fontSize: 15 }}>
                  전체 데이터 수량
                </Label>
                <Text>{new Date().toISOString().split("T")[0]}기준</Text>
              </Section>
              <MainWorkProgressCard>
                <WorkProgressBox>
                  <PieChartContainer>
                    <PieChart
                      width={500}
                      height={300}
                      data={[
                        { key: "완료 데이터", data: threeTotalCnt },
                        { key: "진행중 데이터", data: twoTotalCnt },
                        { key: "미작업 데이터", data: oneTotalCnt },
                      ]}
                      series={
                        <PieArcSeries
                          colorScheme={"Set1"}
                          doughnut={true}
                          cornerRadius={4}
                          padAngle={0.02}
                          padRadius={200}
                        />
                      }
                    />
                  </PieChartContainer>
                  <Label
                    style={{
                      marginRight: 0,
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    {oneTotalCnt + twoTotalCnt + threeTotalCnt} <br /> 전체
                  </Label>
                </WorkProgressBox>
                <Section
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <LineIdentifier
                    style={{
                      borderColor: "#f10c08",
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 35 }}>완료</Text>
                  <LineIdentifier
                    style={{
                      borderColor: "#5495D1",
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 30 }}>진행중</Text>
                  <LineIdentifier
                    style={{
                      borderColor: "#59b959",
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 0 }}>미작업</Text>
                </Section>
              </MainWorkProgressCard>
            </MainWorkProgressContainer>
            <MainWorkDataContainer>
              <Section
                style={{ marginBottom: 20, justifyContent: "space-between" }}
              >
                <Label style={{ marginRight: 10, fontSize: 15 }}>
                  작업 데이터 수량
                </Label>
                <Select onChange={handleChangeProgressDay} value={progressDay}>
                  <option value={7}>최근 7일</option>
                  <option value={14}>최근 14일</option>
                  <option value={30}>최근 30일</option>
                </Select>
              </Section>
              <MainWorkProgressCard>
                
                <LineChart
                  height={300}
                  data={[
                    {
                      key: "미작업",
                      data:
                        oneStatusCnt && oneStatusCnt.length > 0
                          ? oneStatusCnt
                          : [],
                    },
                    {
                      key: "진행중",
                      data:
                        twoStatusCnt && twoStatusCnt.length > 0
                          ? twoStatusCnt
                          : [],
                    },
                    {
                      key: "완료",
                      data:
                        threeStatusCnt && threeStatusCnt.length > 0
                          ? threeStatusCnt
                          : [],
                    },
                  ]}
                  xAxis={
                    <LinearXAxis
                      type={"time"}
                      tickSeries={
                        <LinearXAxisTickSeries
                          label={
                            <LinearXAxisTickLabel align="center" padding={20} />
                          }
                        />
                      }
                    />
                  }
                  series={
                    <LineSeries
                      type={"grouped"}
                      symbols={<PointSeries show={true} />}
                      line={<Line strokeWidth={1} />}
                      colorScheme={["#59b959", "#f10c08", "#5495D1"]}
                    />
                  }
                  gridlines={
                    <GridlineSeries line={<Gridline direction={"y"} />} />
                  }
                />
                <Section
                  style={{
                    marginTop: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LineIdentifier
                    style={{
                      borderColor: "#f10c08",
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 35 }}>완료</Text>
                  <LineIdentifier
                    style={{
                      borderColor: "#5495D1",
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 30 }}>진행중</Text>
                  <LineIdentifier
                    style={{
                      borderColor: "#59b959",
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ marginRight: 0 }}>미작업</Text>
                </Section>
              </MainWorkProgressCard>
            </MainWorkDataContainer>
          </StaticsContainer>
          <MainAllProjectStaticsContainer style={{ marginTop: 10, padding: 0 }}>
            <Section style={{ padding: 10 }}>
              <Label style={{ marginRight: 10, fontSize: 15 }}>
                프로젝트 현황
              </Label>
              <SearchInput
                placeholder={"프로젝트명으로 검색해주세요."}
                value={searchText}
                onChange={handleChangeSearch}
                onKeyDown={handleEnter}
                style={{
                  padding: 7,
                  width: "350px",
                  minWidth: "150px",
                  fontSize: 15,
                  marginRight: 0,
                }}
              />
              <Icon
                src={iconSearch}
                onClick={doSearchByPName}
                style={{
                  padding: 8,
                  cursor:
                    searchText && searchText !== "" ? "pointer" : "not-allowed",
                  backgroundColor: "#3580E3",
                  fill: "white",
                }}
              />
              <Button
                style={{
                  marginLeft: 15,
                  width: "3%",
                  backgroundColor: "#3580E3",
                  fontSize: 12,
                  color: "#FFF",
                  padding: 9,
                }}
                onClick={resetSearch}
              >
                검색 초기화
              </Button>
            </Section>
            <Section style={{ marginTop: 10 }}>
              <ListHeader type={"DASHBOARD_PROJECT_STATUS"} />
            </Section>
            <MainListCenter>
              {loading && <Loader />}
              {!loading &&
                projects.map((p, index) => (
                  <ListItem
                    key={index}
                    type={"DASHBOARD_PROJECT_STATUS"}
                    project={p}
                  />
                ))}
            </MainListCenter>
            <Paginator
              itemCount={5}
              page={page}
              totalCount={totalPJCount}
              stateChangeFn={handleChangeMemberPage}
            />
          </MainAllProjectStaticsContainer>
        </MainCenter>
      </MainWrapper>
    </Container>
  );
};

export default DashboardPresenter;
