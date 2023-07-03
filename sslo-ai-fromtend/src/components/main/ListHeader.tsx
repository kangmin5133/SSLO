import React from "react";
import styled from "styled-components";
import { ListType } from "./ListItem";
import iconSelected from "../../assets/images/project/icon/icon-selected.svg";
import iconFilter from "../../assets/images/project/icon/icon-filter.svg";
import {
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  Checkbox as ChakraCheckBox,
} from "@chakra-ui/react";
import { useState } from "react";
export interface IListHeader {
  type: ListType;
  projectType?: number;
  selectAllDataset?: () => void;
  isSelectedAllDatasets?: () => boolean;
  removeAllDataset?: () => void;
  isSelectedAllTasks?: () => boolean;
  selectAllTask?: () => void;
  removeAllTask?: () => void;
  filterTaskByWorkStep?: (step: string) => void;
  filterTaskByWorkProgress?: (progress: string) => void;
  handleFilterProjects?: (checkedTypes: string | string[]) => void;
  filterByProgress?: (progress: string) => void;
  filterModelByWorkStep?: (step: string) => void;
  isSelectedAllProjectMember?: () => boolean;
  setSelectedAllProjectMembers?: () => void;
  selectAllUsers?: () => void;
  removeAllUsers?: () => void;
  isSelectedAllUsers?: () => boolean;
}

const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 120px;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 15px 25px;
  border-top: 1px solid #afccf4;
  border-bottom: 1px solid #afccf4;
`;
const CCheckbox = styled(ChakraCheckBox)`
  border-color: #6b78a1;
  margin-right: 30px;
  width: 15px;
  height: 15px;
`;
const ColName = styled(Label)`
  width: 100%;
  font-size: 15px;
  font-weight: 800;
  margin-right: 0;
  :last-child {
    text-align: center;
  }
  :nth-last-child(2) {
    text-align: center;
  }
`;
const Horizontal = styled.div`
  display: flex;
  align-items: center;
`;
const Text = styled.span`
  font-size: 15px;
  font-weight: 800;
`;
const CheckBox = styled.div`
  width: 80px;
  max-width: 80px;
  height: 13px;
  border: 1px solid #6b78a1;
  margin-right: 100px;
  cursor: pointer;
`;
const Icon = styled.img`
  cursor: pointer;
  max-width: 80px;
  margin-right: 100px;
`;
/** 전체 프로젝트 화면 등 화면에서 리스트로 사용되는 리스트 헤더 */
const ListHeader: React.FC<IListHeader> = ({
  type,
  projectType,
  selectAllDataset,
  isSelectedAllDatasets,
  removeAllDataset,
  isSelectedAllTasks,
  selectAllTask,
  removeAllTask,
  filterTaskByWorkStep,
  filterTaskByWorkProgress,
  handleFilterProjects,
  filterByProgress,
  isSelectedAllProjectMember,
  setSelectedAllProjectMembers,
  filterModelByWorkStep,
  isSelectedAllUsers,
  removeAllUsers,
  selectAllUsers,
}) => {
  const [selectedType, setSelectedType] = useState("0");
  const handleSelectedTypeChange = (e: string | string[]) => {
    if (typeof e === "string") {
      setSelectedType(e);
    }
  };

  const [selectedStep, setSelectedStep] = useState("0");
  const handleSelectedStepChange = (e: string | string[]) => {
    if (typeof e === "string") {
      setSelectedStep(e);
    }
  };

  const [selectedProgress, setSelectedProgress] = useState("0");
  const handleSelectedProgressChange = (e: string | string[]) => {
    if (typeof e === "string") {
      setSelectedProgress(e);
    }
  };

  const [selectedModelStep, setSelectedModelStep] = useState("0");
  const handleSelectedModelStepChange = (e: string | string[]) => {
    if (typeof e === "string") {
      setSelectedModelStep(e);
    }
  };
  return (
    <>
      {type === "ALL_PRJECT" && handleFilterProjects && (
        <Row style={{ padding: "15px 35px 15px 25px" }}>
          <ColName style={{ width: "5%", textAlign: "center" }}>No</ColName>
          <Horizontal style={{ width: "20%", justifyContent: "center" }}>
            <Text>프로젝트 유형</Text>
            <Menu closeOnSelect={false}>
              <MenuButton>
                <Icon
                  src={iconFilter}
                  style={{ marginRight: 0, marginLeft: 5 }}
                />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuOptionGroup
                    type="radio"
                    value={selectedType}
                    onChange={(e) => {
                      handleSelectedTypeChange(e);
                      handleFilterProjects(e);
                    }}
                  >
                    <MenuItemOption value={"0"}>전체</MenuItemOption>
                    <MenuItemOption value={"1"}>수집/정제</MenuItemOption>
                    <MenuItemOption value={"2"}>전처리</MenuItemOption>
                    <MenuItemOption value={"3"}>가공</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Portal>
            </Menu>
          </Horizontal>
          <ColName style={{ width: "20%", textAlign: "center" }}>프로젝트 명</ColName>
          <ColName style={{ width: "20%", textAlign: "center" }}>
            전체진행률{" "}
            <Label style={{ fontSize: 12, textAlign: "end", marginRight: 0 }}>
              (검수완료 / 전체)
            </Label>
          </ColName>
          <ColName style={{ width: "15%", textAlign: "center" }}>작업자 수</ColName>
          <ColName style={{ width: "20%", textAlign: "center" }}>프로젝트 생성일</ColName>
        </Row>
      )}
      {type === "DASHBOARD_PROJECT_STATUS" && (
        <Row>
          <ColName>No</ColName>
          <ColName>프로젝트 유형</ColName>
          <ColName>프로젝트 명</ColName>
          <ColName>작업진행률</ColName>
          <ColName>등록일</ColName>
          <ColName>마지막 작업일</ColName>
        </Row>
      )}
      {type === "USER_WORK_STATICS" && (
        <Row>
          <ColName>번호</ColName>
          <ColName>작업자명</ColName>
          <ColName>작업자 메일</ColName>
          <ColName style={{ textAlign: "center" }}>
            {projectType === 1 ? "수집" : projectType === 2 ? "전처리" : "가공"}
          </ColName>
          <ColName>검수</ColName>
          <ColName>마지막 업데이트</ColName>
        </Row>
      )}
      {type === "USER_WORK_AMOUNT" && (
        <Row>
          <ColName>멤버명</ColName>
          <ColName>이메일</ColName>
          <ColName>작업 파일 수</ColName>
          <ColName>반려 파일 수</ColName>
        </Row>
      )}
      {type === "DATASET TYPE" &&
        selectAllDataset &&
        isSelectedAllDatasets &&
        removeAllDataset && (
          <Row>
            {isSelectedAllDatasets() ? (
              <Icon src={iconSelected} onClick={removeAllDataset} />
            ) : (
              <CheckBox onClick={selectAllDataset} />
            )}
            <ColName>데이터셋 번호</ColName>
            <ColName>데이터셋 명</ColName>
            <ColName>데이터셋 건수</ColName>
            <ColName>데이터셋 대분류</ColName>
            <ColName>데이터셋 세부분류</ColName>
            <ColName>데이터셋 총 용량</ColName>
          </Row>
        )}
      {type === "SETTING DATASET TYPE" && (
        <Row>
          <ColName>데이터셋 번호</ColName>
          <ColName>데이터셋 명</ColName>
          <ColName>데이터셋 건수</ColName>
          <ColName>데이터셋 대분류</ColName>
          <ColName>데이터셋 세부분류</ColName>
          <ColName>데이터셋 총 용량</ColName>
        </Row>
      )}
      {type === "DATALIST" &&
        projectType &&
        filterTaskByWorkStep &&
        filterTaskByWorkProgress &&
        isSelectedAllTasks &&
        selectAllTask &&
        removeAllTask && (
          <Row style={{ justifyContent: "none", padding: "15px 35px 15px 25px" }}>
            <CCheckbox 
              colorScheme={"ssloGreen"}
              onChange={isSelectedAllTasks() ? removeAllTask : selectAllTask}
              isChecked={isSelectedAllTasks()}
            />
            <ColName style={{ width: "30%", textAlign: "center" }}>파일명</ColName>
            <ColName style={{ width: "10%" }}>
              <Horizontal style={{ width: "100%", justifyContent: "center" }}>
                <Text>작업단계</Text>
                <Menu>
                  <MenuButton>
                    <Icon
                      src={iconFilter}
                      style={{ marginRight: 0, marginLeft: 5 }}
                    />
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      <MenuOptionGroup
                        type="radio"
                        value={selectedStep}
                        onChange={(e) => {
                          handleSelectedStepChange(e);
                          filterTaskByWorkStep(e as string);
                        }}
                      >
                        <MenuItemOption value={"0"}>전체</MenuItemOption>
                        <MenuItemOption value={"1"}>
                          {projectType === 1
                            ? "수집/정제"
                            : projectType === 2
                            ? "전처리"
                            : "가공"}
                        </MenuItemOption>
                        <MenuItemOption value={"2"}>검수</MenuItemOption>
                      </MenuOptionGroup>
                    </MenuList>
                  </Portal>
                </Menu>
              </Horizontal>
            </ColName>
            <ColName style={{ width: "10%" }}>
              <Horizontal style={{ width: "100%", justifyContent: "center" }}>
                <Text>작업상태</Text>
                <Menu>
                  <MenuButton>
                    <Icon
                      src={iconFilter}
                      style={{ marginRight: 0, marginLeft: 5 }}
                    />
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      <MenuOptionGroup
                        type="radio"
                        value={selectedProgress}
                        onChange={(e) => {
                          handleSelectedProgressChange(e);
                          filterTaskByWorkProgress(e as string);
                        }}
                      >
                        <MenuItemOption value={"0"}>전체</MenuItemOption>
                        <MenuItemOption value={"1"}>미작업</MenuItemOption>
                        <MenuItemOption value={"2"}>진행중</MenuItemOption>
                        <MenuItemOption value={"3"}>완료</MenuItemOption>
                        <MenuItemOption value={"4"}>반려</MenuItemOption>
                      </MenuOptionGroup>
                    </MenuList>
                  </Portal>
                </Menu>
              </Horizontal>
            </ColName>
            <ColName style={{ width: "10%", textAlign: "center" }}>마지막 업데이트</ColName>
            <ColName style={{ width: "15%" }}>
              {projectType === 1
                ? "수집담당자"
                : projectType === 2
                ? "전처리 담당자"
                : "가공담당자"}
            </ColName>
            <ColName style={{ width: "15%" }}>검수담당자</ColName>
          </Row>
        )}
      {type === "SETTING_MEMBERS" &&
        isSelectedAllProjectMember &&
        setSelectedAllProjectMembers && (
          <Row style={{ justifyContent: "none", padding: "15px 35px 15px 25px" }}>
            <CCheckbox
              colorScheme={"ssloGreen"}
              onChange={setSelectedAllProjectMembers}
              isChecked={isSelectedAllProjectMember()}
            />
            <ColName style={{ width: "33%", textAlign: "center" }}>
              이메일
            </ColName>
            <ColName style={{ width: "33%" }}>이름</ColName>
            <ColName style={{ width: "33%" }}>작업단계</ColName>
          </Row>
        )}
      {type === "EXPORT_MODEL" &&
        filterModelByWorkStep && (
          <Row style={{ justifyContent: "none", padding: "15px 35px 15px 25px" }}>
            <ColName style={{ width: "15px", marginRight: "30px", textAlign: "center" }}></ColName>
            <ColName style={{ width: "30%", textAlign: "center" }}>모델명</ColName>
            <ColName style={{ width: "15%", textAlign: "center" }}>
              <Horizontal style={{ width: "100%", justifyContent: "center" }}>
                <Text>상태</Text>
                <Menu>
                  <MenuButton>
                    <Icon
                      src={iconFilter}
                      style={{ marginRight: 0, marginLeft: 5 }}
                    />
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      <MenuOptionGroup
                        type="radio"
                        value={selectedModelStep}
                        onChange={(e) => {
                          handleSelectedModelStepChange(e);
                          filterModelByWorkStep(e as string);
                        }}
                      >
                        <MenuItemOption value={""}>전체</MenuItemOption>
                        <MenuItemOption value={"done"}>완료</MenuItemOption>
                        <MenuItemOption value={"inprogress"}>진행중</MenuItemOption>
                        <MenuItemOption value={"fail"}>실패</MenuItemOption>
                      </MenuOptionGroup>
                    </MenuList>
                  </Portal>
                </Menu>
              </Horizontal>
            </ColName>
            <ColName style={{ width: "15%", textAlign: "center" }}>진행률</ColName>
            <ColName style={{ width: "20%", textAlign: "center" }}>생성시간</ColName>
            <ColName style={{ width: "19%", textAlign: "center" }}>적용 모델</ColName>
          </Row>
        )}
      {type === "MY_WORK_LIST" && projectType && filterByProgress && isSelectedAllTasks && (
        <Row style={{ justifyContent: "none" }}>
          {isSelectedAllTasks() ? (
            <Icon
              src={iconSelected}
              onClick={removeAllTask}
              style={{
                marginRight: 30,
                marginLeft: 8,
                cursor: "pointer",
                width: "15px",
                height: "15px",
              }}
            />
          ) : (
            <CheckBox
              onClick={selectAllTask}
              style={{
                marginRight: 30,
                marginLeft: 8,
                cursor: "pointer",
                width: "15px",
                height: "15px",
              }}
            />
          )}
          <ColName style={{ width: "35%" }}>파일명</ColName>
          <ColName style={{ width: "10%" }}>
            <Horizontal style={{ width: "100%" }}>
              <Text>작업상태</Text>
              <Menu>
                <MenuButton>
                  <Icon
                    src={iconFilter}
                    style={{ marginRight: 0, marginLeft: 5 }}
                  />
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        filterByProgress("전체");
                      }}
                    >
                      전체
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        filterByProgress("미작업");
                      }}
                    >
                      미작업
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        filterByProgress("진행중");
                      }}
                    >
                      진행중
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        filterByProgress("완료");
                      }}
                    >
                      완료
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        filterByProgress("반려");
                      }}
                    >
                      반려
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Horizontal>
          </ColName>
          {projectType === 3 &&
            <ColName style={{ width: "10%" }}>Object 개수</ColName>
          }
          <ColName style={{ width: "10%" }}>최종수정시간</ColName>
          <ColName style={{ width: "15%" }}>현재작업단계</ColName>
        </Row>
      )}
      {type === "MY_PAGE_MEMBERS" &&
        isSelectedAllUsers &&
        removeAllUsers &&
        selectAllUsers && (
          <Row style={{ justifyContent: "none" }}>
            {isSelectedAllUsers() ? (
              <Icon
                src={iconSelected}
                onClick={removeAllUsers}
                style={{
                  marginLeft: 8,
                  marginRight:0,
                  width: "15px",
                  height: "15px",
                }}
              />
            ) : (
              <CheckBox
                onClick={selectAllUsers}
                style={{
                  marginLeft: 8,
                  marginRight:0,
                  width: "15px",
                  height: "15px",
                }}
              />
            )}
            <ColName style={{ width: "25%", textAlign: "center" }}>이메일</ColName>
            <ColName style={{ width: "25%", textAlign: "center" }}>이름</ColName>
            <ColName style={{ width: "25%", textAlign: "center" }}>권한</ColName>
            <ColName style={{ width: "25%", textAlign: "center" }}>조직 가입일</ColName>
          </Row>
        )}
      {type === "MY_PAGE_WAIT_MEMBERS" && (
        <Row style={{ justifyContent: "none" }}>
          <ColName style={{ width: "35%" }}>이메일</ColName>
          <ColName style={{ width: "35%" }}>조직가입일</ColName>
        </Row>
      )}
    </>
  );
};

export default ListHeader;
