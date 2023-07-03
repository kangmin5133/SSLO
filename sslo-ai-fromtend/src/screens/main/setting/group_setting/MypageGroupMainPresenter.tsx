import {
  ChakraProvider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { ISignUpPayload } from "../../../../api/userApi";
import Loader from "../../../../components/Loader";
import Header from "../../../../components/main/Header";
import { useAppSelector } from "../../../../hooks";
import { MyPageTopTab } from "./MypageGroupMainContainer";

export interface MypageGroupMainPresenter {
  userInfo: ISignUpPayload | undefined;
  openRemove: boolean;
  selectTab: MyPageTopTab;
  handleTab: (tab: MyPageTopTab) => void;
  handleDelete: (data: any) => Promise<void>;
  onOpenRemove: () => void;
  onCancelRemove: () => void;
  onChangeName: (e: any) => void;
  handleSave: () => void;
}

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
  background-color: #ecf3fb;
  padding: 30px 60px;
`;

const MainSearchContainer = styled.div`
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const MainContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
`;

const MainActionBtnDiv = styled(MainSearchContainer)`
  width: 100%;
  padding: 15px 30px;
  margin-top: 20px;
  flex-direction: row;
  box-sizing: border-box;
`;
const MainGroupContainer = styled(MainSearchContainer)`
  font-size: 20px;
  font-weight: 800;
  margin-top: 30px;
  flex-direction: column;
  padding: 50px;
`;
const MainPageContainer = styled(MainContainer)`
  min-height: 300px;
  max-height: 640px;
  padding: 200px 0px 0px 0px;
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
  font-size: 14px;
  border-radius: 20px;
  color: ${(props) => (props.isSelected ? "#FFF" : "#243654")};
`;
const Label = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 120px;
  flex-direction: row;
  display: inline;
`;
const ColName = styled.div`
  width: calc(100% -210px);
  font-size: 17px;
  font-weight: 500;
  color: #243754;
  padding: 10px 0px 13px 20px;
  float: left;
`;
const ColModify = styled.input`
  width: calc(100% -210px);
  font-size: 17px;
  font-weight: 500;
  color: #243754;
  margin: 10px 0px 13px 10px;
  padding-left: 10px;
  float: left;
  border: 2px solid #929394;
`;
const ColHeader = styled.div`
  width: 210px;
  height: 50px;
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  padding: 10px 0px 10px 0px;
  float: left;
  background-color: #f7fafe;
  flex-direction: column;
  box-sizing: border-box;
  text-align: center;
`;
const DeleteButton = styled(Label)`
  font-size: 15px;
  font-weight: 800;
`;
const Row = styled.div`
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid #aeccf4;
`;
const MypageGroupMainPresenter: React.FC<MypageGroupMainPresenter> = ({
  userInfo,
  openRemove,
  selectTab,
  handleDelete,
  onOpenRemove,
  onCancelRemove,
  handleTab,
  onChangeName,
  handleSave,
}) => {
  const user = useAppSelector((state) => state.userReducer);
  if (userInfo) {
    return (
      <ChakraProvider>
        <Container>
          <Helmet>
            <title>SSLO | Group</title>
          </Helmet>
          <MainWrapper>
            <Header title={"조직 설정"} />

            {selectTab === MyPageTopTab.oneTab && (
              <>
                <MainCenter>
                  <MainActionBtnDiv style={{ marginTop: -15 }}>
                    <StaticButton
                      style={{ width: 100 }}
                      isSelected={true}
                      onClick={() => handleTab(MyPageTopTab.oneTab)}
                    >
                      조직설정
                    </StaticButton>
                    <StaticButton
                      style={{ width: 100, display: "none" }}
                      isSelected={false}
                      onClick={() => handleTab(MyPageTopTab.twoTab)}
                    >
                      사용현황
                    </StaticButton>
                  </MainActionBtnDiv>
                  <MainGroupContainer>
                    <Row>
                      <ColHeader>조직ID</ColHeader>
                      <ColName>
                        {userInfo && userInfo.organization_id
                          ? userInfo.organization_id
                          : ""}
                      </ColName>
                    </Row>
                    {user.isAdmin ? (
                      <Row style={{ borderBottom: "1px solid #aeccf4" }}>
                        <ColHeader>조직명</ColHeader>
                        <ColModify
                          id={"name"}
                          placeholder={
                            userInfo && userInfo.organization_name
                              ? userInfo.organization_name
                              : "없음"
                          }
                          name={"organization_name"}
                          onChange={onChangeName}
                        />
                      </Row>
                    ) : (
                      <Row style={{ borderBottom: "1px solid #aeccf4" }}>
                        <ColHeader>조직명</ColHeader>
                        <ColName>
                          {userInfo && userInfo.organization_name
                            ? userInfo.organization_name
                            : ""}
                        </ColName>
                      </Row>
                    )}
                    {/* <Row style={{ borderBottom: "1px solid #aeccf4" }}>
                      <ColHeader>이름</ColHeader>
                      <ColName>
                        {userInfo && userInfo.user_display_name
                          ? userInfo.user_display_name
                          : "없음"}
                      </ColName>
                    </Row> */}
                  </MainGroupContainer>
                  <Button
                    style={{
                      width: "80px",
                      backgroundColor: "#3580E3",
                      color: "#FFF",
                      minWidth: "80px",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginRight: "20px",
                      marginTop: "20px",
                      textAlign: "center",
                    }}
                    onClick={handleSave}
                  >
                    저장
                  </Button>

                  <MainPageContainer
                    style={{
                      fontSize: "14px",
                      fontWeight: "800",
                      color: "#e2772a",
                      marginTop: 180,
                    }}
                  >
                    현재 소속된 조직에서 나가시겠습니까?
                    <DeleteButton
                      onClick={onOpenRemove}
                      style={{
                        backgroundColor: "#e2772a",
                        color: "#FFF",
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginLeft: "20px",
                      }}
                    >
                      조직 나가기
                      <Modal
                        isOpen={openRemove}
                        onClose={onCancelRemove}
                        size={"2xl"}
                        isCentered
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader
                            style={{
                              display: "flex",
                              alignItems: "center",
                              height: 50,
                              paddingTop: 10,
                              paddingBottom: 10,
                              backgroundColor: "#D2E2F8",
                              justifyContent: "center",
                              color: "#243654",
                              fontSize: "14px",
                              fontWeight: 800,
                            }}
                          >
                            조직 나가기
                          </ModalHeader>
                          <ModalCloseButton style={{ marginTop: -3 }} />
                          <ModalBody
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              textAlign: "center",
                              color: "#e2772a",
                            }}
                          >
                            <br />
                            회원 탈퇴 시 모든 데이터가 삭제되며, <br />
                            서비스 이용이 불가능합니다.
                            <br />
                            <br />
                            현재 소속된 조직에서 나가시겠습니까?
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              style={{
                                width: "10%",
                                backgroundColor: "#3580E3",
                                fontSize: 12,
                                color: "#FFF",
                                marginRight: 0,
                              }}
                              onClick={handleDelete}
                            >
                              확인
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </DeleteButton>
                  </MainPageContainer>
                </MainCenter>
              </>
            )}

            {selectTab === MyPageTopTab.twoTab && (
              <>
                <MainCenter>
                  <MainActionBtnDiv style={{ marginTop: -15 }}>
                    <StaticButton
                      style={{ width: 100 }}
                      isSelected={false}
                      onClick={() => handleTab(MyPageTopTab.oneTab)}
                    >
                      조직설정
                    </StaticButton>
                    <StaticButton
                      style={{ width: 100, display: "none" }}
                      isSelected={true}
                      onClick={() => handleTab(MyPageTopTab.twoTab)}
                    >
                      사용현황
                    </StaticButton>
                  </MainActionBtnDiv>
                  <MainGroupContainer>
                    조직 사용 현황
                    <Row>
                      <ColHeader>전체 멤버 수</ColHeader>
                      <ColName>1 / 무제한</ColName>
                    </Row>
                    <Row>
                      <ColHeader>전체 프로젝트 수</ColHeader>
                      <ColName>50 / 무제한</ColName>
                    </Row>
                    <Row>
                      <ColHeader>사용용량</ColHeader>
                      <ColName>1000MB / 무제한</ColName>
                    </Row>
                    <Row style={{ borderBottom: "1px solid #aeccf4" }}>
                      <ColHeader>사용 파일 수</ColHeader>
                      <ColName>10,000개 / 무제한</ColName>
                    </Row>
                    <br />
                    <br />
                    조직 사용 현황
                    <Row>
                      <ColHeader>제공하는 기능</ColHeader>
                      <ColName>수집 정제 전처리 가공</ColName>
                    </Row>
                    <Row style={{ borderBottom: "1px solid #aeccf4" }}>
                      <ColHeader>제한된 기능</ColHeader>
                      <ColName>가공</ColName>
                    </Row>
                    {/* <Button
                      style={{
                        width: "200px",
                        backgroundColor: "#3580E3",
                        color: "#FFF",
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginRight: "20px",
                        marginTop: "20px",
                      }}
                      onClick={undefined}
                    >
                      서비스 업그레이드
                    </Button> */}
                  </MainGroupContainer>

                  <MainPageContainer />
                </MainCenter>
              </>
            )}
          </MainWrapper>
        </Container>
      </ChakraProvider>
    );
  } else {
    return <Loader />;
  }
};

export default MypageGroupMainPresenter;
