import React, { ChangeEvent } from "react";
import styled from "styled-components";
import Header from "../../../../components/main/Header";
import Calendar from "react-calendar";
import iconCalendar from "../../../../assets/images/project/icon/icon-calendar.svg";
import iconPlus from "../../../../assets/images/project/icon/icon-plus.svg";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import ListItem from "../../../../components/main/ListItem";
import ListHeader from "../../../../components/main/ListHeader";
import { MonthType } from "./AllProjectContainer";
import Paginator from "../../../../components/main/Paginator";
import { Link } from "react-router-dom";
import { IProject } from "../../../../api/projectApi";
import { Helmet } from "react-helmet-async";
import { ChakraProvider } from "@chakra-ui/react";
interface IAllProjectPresenter {
  dateRange: Date[] | null;
  calendar: boolean;
  totalPJCount: number;
  projects: IProject[];
  page: number;
  inputPName: string | undefined;
  selectedMonth: MonthType | undefined;
  handleChangeCalendar: (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  resetSearch: () => void;
  handlePopupDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  showCalendar: () => void;
  dateToString: () => string;
  searchProjectsByName: () => void;
  setFilterProjectName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchProjectsByMonthBtn: (month: MonthType) => void;
  handleChangeProjectsPage: (page: number) => Promise<void>;
  handleFilterProjects: (checkedTypes: string | string[]) => void;
}

const Container = styled.div`
  display: flex;
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
  background-color: #ecf3fb;
  width: 100%;
  height: 100%;
  padding: 30px 60px;
`;
const MainSearchContainer = styled.div`
  width: 100%;
  padding: 30px 30px;
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
  margin-right: 120px;
`;
const DateDivContainer = styled.div`
  min-width: 300px;
  display: flex;
  position: relative;
`;
const DateDiv = styled.div`
  position: relative;
  min-width: 200px;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background-color: #f7fafe;
  border: 1px solid #afccf4;
  cursor: pointer;
`;
const DateString = styled.span<{ dates: number | null }>`
  font-size: 16px;
  font-weight: 700;
  color: #243754;
  margin-right: ${(props) =>
    props.dates !== null && props.dates === 2 && "30px"};
`;
const Icon = styled.img``;
const DatePickButton = styled.div<{ isSelected: boolean }>`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  background-color: ${(props) => (props.isSelected ? "#3480e3" : "")};
  font-size: 16px;
  font-weight: 700;
  transition: background-color 0.5s linear;
  color: ${(props) => (props.isSelected ? "#ffffff" : "#6b78a1")};
  margin-right: 20px;
  cursor: pointer;
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
const MainProjectsContainer = styled(MainSearchContainer)`
  margin-top: 30px;
  min-height: 400px;
  max-height: 640px;
  display: flex;
  flex-direction: column;
  padding: 0;
`;
const MainProjectTop = styled.div`
  padding: 20px 40px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProjectTopLeftLabel = styled(Label)`
  margin-right: 0;
`;
const CreatePButton = styled.div`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #3480e3;
  color: #fff;
  margin-right: 0;
`;
const MainProjectCenter = styled.div`
&::-webkit-scrollbar {
  width: 10px;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #e2e4e7;
  width: 10px;
}
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
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
const AllProjectPresenter: React.FC<IAllProjectPresenter> = ({
  calendar,
  dateRange,
  projects,
  totalPJCount,
  page,
  inputPName,
  selectedMonth,
  resetSearch,
  handleChangeCalendar,
  handleEnter,
  handlePopupDown,
  showCalendar,
  dateToString,
  searchProjectsByName,
  setFilterProjectName,
  searchProjectsByMonthBtn,
  handleChangeProjectsPage,
  handleFilterProjects,
}) => {
  return (
    <ChakraProvider>
      <Container onClick={handlePopupDown}>
        <Helmet>
          <title>SSLO | PROJECTS</title>
        </Helmet>
        <MainWrapper>
          <Header title={"전체 프로젝트"} />
          <MainCenter>
            <MainSearchContainer>
              <Section style={{ marginBottom: 30 }}>
                <Label>등록일</Label>
                <DateDivContainer>
                  <DateDiv onClick={showCalendar}>
                    <DateString dates={dateRange && dateRange.length}>
                      {dateRange ? dateToString() : "날짜 선택"}
                    </DateString>
                    <Icon src={iconCalendar} />
                  </DateDiv>
                  {calendar && (
                    <Calendar
                      formatDay={(locale, date) =>
                        date.toLocaleString("en", { day: "numeric" })}
                      value={dateRange as any}
                      onChange={(
                        value: Date[],
                        event: ChangeEvent<HTMLInputElement>
                      ) => handleChangeCalendar(value, event)}
                      prev2Label={null}
                      next2Label={null}
                      minDetail="month"
                      selectRange
                      minDate={
                        new Date(Date.now() - 60 * 60 * 24 * 7 * 4 * 6 * 10000)
                      }
                      maxDate={
                        new Date(Date.now() + 60 * 60 * 24 * 7 * 4 * 6 * 1000)
                      }
                    />
                  )}
                </DateDivContainer>
                <DatePickButton
                  isSelected={selectedMonth === "당월"}
                  style={{ marginLeft: -25 }}
                  onClick={() => searchProjectsByMonthBtn("당월")}
                >
                  당월
                </DatePickButton>
                <DatePickButton
                  isSelected={selectedMonth === "1개월"}
                  onClick={() => searchProjectsByMonthBtn("1개월")}
                >
                  1개월
                </DatePickButton>
                <DatePickButton
                  isSelected={selectedMonth === "3개월"}
                  onClick={() => searchProjectsByMonthBtn("3개월")}
                >
                  3개월
                </DatePickButton>
                <DatePickButton
                  isSelected={selectedMonth === "6개월"}
                  onClick={() => searchProjectsByMonthBtn("6개월")}
                >
                  6개월
                </DatePickButton>
                <DatePickButton
                  isSelected={selectedMonth === "12개월"}
                  onClick={() => searchProjectsByMonthBtn("12개월")}
                >
                  12개월
                </DatePickButton>
              </Section>
              <Section>
                <Label>검색어</Label>
                <SearchInput
                  value={inputPName}
                  placeholder={"프로젝트명을 입력해주세요."}
                  onChange={setFilterProjectName}
                  onKeyDown={
                    inputPName || inputPName === "" ? handleEnter : undefined
                  }
                />
                <SearchBtn
                  isValid={inputPName !== undefined && inputPName !== null}
                  onClick={
                    inputPName || inputPName === ""
                      ? searchProjectsByName
                      : undefined
                  }
                >
                  검색
                </SearchBtn>
                <Button
                  style={{
                    marginLeft: 15,
                    width: "8%",
                    backgroundColor: "#3580E3",
                    fontSize: 14,
                    color: "#FFF",
                    padding: 10,
                  }}
                  onClick={resetSearch}
                >
                  검색 초기화
                </Button>
              </Section>
            </MainSearchContainer>
            <MainProjectsContainer>
              <MainProjectTop>
                <ProjectTopLeftLabel>{`전체 프로젝트 ${totalPJCount} 건`}</ProjectTopLeftLabel>
                <Link to={"create"}>
                  <CreatePButton>
                    프로젝트 추가{" "}
                    <Icon src={iconPlus} style={{ marginLeft: 20 }} />
                  </CreatePButton>
                </Link>
              </MainProjectTop>
              <ListHeader
                type={"ALL_PRJECT"}
                handleFilterProjects={handleFilterProjects}
              />
              <MainProjectCenter>
                {projects && projects.map((p, index) => {
                  return (
                    <ListItem key={index} project={p} type={"ALL_PRJECT"} />
                  );
                })}
              </MainProjectCenter>
              <Paginator
                itemCount={10}
                page={page}
                totalCount={totalPJCount}
                stateChangeFn={handleChangeProjectsPage}
              />
            </MainProjectsContainer>
          </MainCenter>
        </MainWrapper>
      </Container>
    </ChakraProvider>
  );
};

export default AllProjectPresenter;
