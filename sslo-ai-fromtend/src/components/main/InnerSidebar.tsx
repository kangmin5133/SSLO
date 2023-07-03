import React, { useEffect, useState } from "react";
import styled from "styled-components";
import arrowDown from "../../assets/images/studio/icon/icon-arrow_down.svg";
import arrowUp from "../../assets/images/studio/icon/icon-arrow_up.svg";
import pManage from "../../assets/images/project/icon/icon-project-manage.svg";
import { InnerSidebarItem } from "../../screens/main/project/detail/ProjectDetailContainer";
import { useNavigate, useParams } from "react-router-dom";
import projectApi, { ISimpleProjectInfo } from "../../api/projectApi";
import { Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks";
import { MyWorksInnerSidebarItem } from "../../screens/main/myworks/MyWorksContainer";

export interface IInnerSidebar {
  openSidebarUpper: boolean;
  selectedInnerTab: InnerSidebarItem | MyWorksInnerSidebarItem;
  classification: "allProjects" | "myworks";
  inMyWorkAllProjects?: ISimpleProjectInfo[];
  inMyWorkCurrentProject?: ISimpleProjectInfo;
  handleSelectInnerTab?: (tab: InnerSidebarItem) => void;
  handleGetMyWorkPId?: (pId: number) => void;
  handleSelectInnerTabMyWorks?: (tab: MyWorksInnerSidebarItem) => void;
}
const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 170px; */
  min-width: 170px;
  max-width: 170px;
  height: 100%;
  box-sizing: border-box;
  border-right: 1px;
  border-right-color: #cddff8;
  border-right-style: solid;
  background-color: #ffffff;
`;
const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
`;
const SidebarUpper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  cursor: pointer;
`;
const UpperLabel = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: #243654;
`;
const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
`;
const BottomInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-left: 5px solid #eaf2fc;
  width: 100%;
  div {
    margin-left: 15px;
  }
`;

const SidebarItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  :hover {
    background-color: #ecf3fb;
  }
  background-color: ${(props) => (props.isSelected ? "#ecf3fb" : "")};
`;
const Icon = styled.img`
  margin-right: 10px;
`;
const Label = styled.span<{ isSelected: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => (props.isSelected ? "#3580E3" : "#243754")};
`;

const InnerSidebar: React.FC<IInnerSidebar> = ({
  openSidebarUpper,
  selectedInnerTab,
  classification,
  inMyWorkAllProjects,
  inMyWorkCurrentProject,
  handleSelectInnerTab,
  handleSelectInnerTabMyWorks,
  handleGetMyWorkPId,
}) => {
  const user = useAppSelector((state) => state.userReducer);
  const { pId } = useParams();
  const navigate = useNavigate();
  const [currentPName, setCurrentPName] = useState<string>();
  const [currentPType, setCurrentPType] = useState<number>();
  const [allProjects, setAllProjects] = useState<ISimpleProjectInfo[]>([]);
  const getProject = async () => {
    if (!pId) return;
    const res = await projectApi.getProject(
      { project_id: parseInt(pId) },
      user.accessToken!
    );
    if (res && res.status === 200) {
      setCurrentPName(res.data.project_name);
      setCurrentPType(res.data.project_type.project_type_id);
    }
  };
  const cleanAllProjects = (data: any) => {
    const cleanedProjects: ISimpleProjectInfo[] = [];
    data.forEach((p: any) => {
      const project = {
        projectId: p.project_id,
        projectName: p.project_name,
        projectType: p.project_type.project_type_id,
      };
      cleanedProjects.push(project);
    });
    setAllProjects(cleanedProjects);
  };
  const getAllProjects = async () => {
    const res = await projectApi.getAllProjects(
      { startAt: 0, maxResults: 100000 },
      user.accessToken!
    );
    if (res && res.status === 200) {
      cleanAllProjects(res.data.datas);
    }
  };
  useEffect(() => {
    if (classification === "allProjects") {
      getAllProjects();
    }
  }, [classification]);
  useEffect(() => {
    getProject();
  }, [pId]);
  const navigateOnAllProjectsScreen = (pId: number) => {
    window.location.href = `/main/projects/${pId}`;
    // navigate(`/main/projects/${pId}`);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
  };
  if (classification === "allProjects" && allProjects) {
    return (
      <SidebarContainer>
        <SidebarWrapper>
          <Menu>
            <MenuButton>
              <SidebarUpper>
                {classification === "allProjects" && (
                  <UpperLabel>
                    {currentPName ? currentPName : "프로젝트 이름"}
                  </UpperLabel>
                )}
                <Icon src={openSidebarUpper ? arrowDown : arrowUp} />
              </SidebarUpper>
            </MenuButton>
            <Portal>
              <MenuList maxH={"300px"} overflowY={"auto"}>
                {classification === "allProjects" &&
                  allProjects &&
                  allProjects.map((p, index) => {
                    if (p.projectName !== currentPName) {
                      return (
                        <MenuItem
                          key={index}
                          onClick={() =>
                            navigateOnAllProjectsScreen(p.projectId)
                          }
                        >
                          {p.projectName}
                        </MenuItem>
                      );
                    } else {
                      return null;
                    }
                  })}
              </MenuList>
            </Portal>
          </Menu>
          <SidebarBottom>
            <SidebarItem isSelected={true}>
              <Icon src={pManage} />
              <Label isSelected={true}>프로젝트 관리</Label>
            </SidebarItem>
            {classification === "allProjects" && handleSelectInnerTab && (
              <BottomInnerWrapper>
                <SidebarItem
                  onClick={() =>
                    handleSelectInnerTab(InnerSidebarItem.dataList)
                  }
                  isSelected={selectedInnerTab === InnerSidebarItem.dataList}
                >
                  <Label
                    isSelected={selectedInnerTab === InnerSidebarItem.dataList}
                  >
                    데이터 목록
                  </Label>
                </SidebarItem>
                <SidebarItem
                  onClick={() => handleSelectInnerTab(InnerSidebarItem.member)}
                  isSelected={selectedInnerTab === InnerSidebarItem.member}
                >
                  <Label
                    isSelected={selectedInnerTab === InnerSidebarItem.member}
                  >
                    멤버작업현황
                  </Label>
                </SidebarItem>
                <SidebarItem
                  onClick={() => handleSelectInnerTab(InnerSidebarItem.statics)}
                  isSelected={selectedInnerTab === InnerSidebarItem.statics}
                >
                  <Label
                    isSelected={selectedInnerTab === InnerSidebarItem.statics}
                  >
                    프로젝트 통계
                  </Label>
                </SidebarItem>
                <SidebarItem
                  onClick={() =>
                    handleSelectInnerTab(InnerSidebarItem.settings)
                  }
                  isSelected={selectedInnerTab === InnerSidebarItem.settings}
                >
                  <Label
                    isSelected={selectedInnerTab === InnerSidebarItem.settings}
                  >
                    설정
                  </Label>
                </SidebarItem>
                {currentPType && currentPType === 3 && (
                  <>
                    <SidebarItem
                      onClick={() =>
                        handleSelectInnerTab(InnerSidebarItem.modelSettings)
                      }
                      isSelected={selectedInnerTab === InnerSidebarItem.modelSettings}
                    >
                      <Label
                        isSelected={selectedInnerTab === InnerSidebarItem.modelSettings}
                      >
                        모델 설정
                      </Label>
                    </SidebarItem>
                    <SidebarItem
                      onClick={() =>
                        handleSelectInnerTab(InnerSidebarItem.modelRelease)
                      }
                      isSelected={selectedInnerTab === InnerSidebarItem.modelRelease}
                    >
                      <Label
                        isSelected={selectedInnerTab === InnerSidebarItem.modelRelease}
                      >
                        모델 배포
                      </Label>
                    </SidebarItem>
                  </>
                )}
              </BottomInnerWrapper>
            )}
          </SidebarBottom>
        </SidebarWrapper>
      </SidebarContainer>
    );
  } else if (
    classification === "myworks" &&
    inMyWorkAllProjects &&
    inMyWorkCurrentProject
  ) {
    return (
      <SidebarContainer>
        <SidebarWrapper>
          <Menu>
            <MenuButton>
              <SidebarUpper>
                {classification === "myworks" && (
                  <UpperLabel>{inMyWorkCurrentProject.projectName}</UpperLabel>
                )}
                <Icon src={openSidebarUpper ? arrowDown : arrowUp} />
              </SidebarUpper>
            </MenuButton>
            <Portal>
              <MenuList maxH={"300px"} overflowY={"auto"}>
                {classification === "myworks" &&
                  inMyWorkAllProjects &&
                  handleGetMyWorkPId &&
                  inMyWorkAllProjects.map((p, index) => {
                    if (p.projectName !== inMyWorkCurrentProject.projectName) {
                      return (
                        <MenuItem
                          key={index}
                          onClick={() => handleGetMyWorkPId(p.projectId)}
                        >
                          {p.projectName}
                        </MenuItem>
                      );
                    } else {
                      return null;
                    }
                  })}
              </MenuList>
            </Portal>
          </Menu>
          <SidebarBottom>
            <SidebarItem isSelected={true}>
              <Icon src={pManage} />
              <Label isSelected={true}>프로젝트 관리</Label>
            </SidebarItem>
            {classification === "myworks" && handleSelectInnerTabMyWorks && (
              <BottomInnerWrapper>
                <SidebarItem
                  onClick={() =>
                    handleSelectInnerTabMyWorks(MyWorksInnerSidebarItem.myWorks)
                  }
                  isSelected={
                    selectedInnerTab === MyWorksInnerSidebarItem.myWorks
                  }
                >
                  <Label
                    isSelected={
                      selectedInnerTab === MyWorksInnerSidebarItem.myWorks
                    }
                  >
                    내 작업
                  </Label>
                </SidebarItem>
                <SidebarItem
                  onClick={() =>
                    handleSelectInnerTabMyWorks(
                      MyWorksInnerSidebarItem.myWorksStatics
                    )
                  }
                  isSelected={
                    selectedInnerTab === MyWorksInnerSidebarItem.myWorksStatics
                  }
                >
                  <Label
                    isSelected={
                      selectedInnerTab ===
                      MyWorksInnerSidebarItem.myWorksStatics
                    }
                  >
                    내 작업 통계
                  </Label>
                </SidebarItem>
              </BottomInnerWrapper>
            )}
          </SidebarBottom>
        </SidebarWrapper>
      </SidebarContainer>
    );
  } else {
    return null;
  }
};

export default InnerSidebar;
