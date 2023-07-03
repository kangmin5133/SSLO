import React from "react";
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
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import Header from "../../../../components/main/Header";
import ListHeader from "../../../../components/main/ListHeader";
import ListItem from "../../../../components/main/ListItem";
import { IUser } from "../../../../api/userApi";

export interface MyPageMambersPresenter {
  page: string;
  openDelete: boolean;
  openInvite: boolean;
  memberList: IUser[];
  memberCnt: number;
  onOpenDelete: () => void;
  onCancelDelete: () => void;
  onOpenInvite: () => void;
  onCancelInvite: () => void;
  selectedUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  isSelectedUser: (userId: string) => boolean;
  isSelectedAllUsers: () => boolean;
  selectAllUsers: () => void;
  removeAllUsers: () => void;
  setInvitationEmail: (e: any) => void;
  inviteMember: () => void;
  deleteUser: () => void;
  setSearchText: (e: any) => void;
  handleSearch: () => void;
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
  margin-top: 30px;
`;
const MainActionBtnDiv = styled(MainSearchContainer)`
  width: 100%;
  padding: 15px 30px;
  margin-top: 20px;
  flex-direction: row;
  box-sizing: border-box;
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
const InviteInput = styled.input`
  padding: 8px 10px;
  min-width: 600px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 12px;
  font-weight: 700;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #6b78a1;
  }
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
const ModalContainer = styled.div`
  padding: 30px;
  font-size: 12px;
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
const MainMembersContainer = styled(MainSearchContainer)`
  margin-top: 30px;
  min-height: 400px;
  max-height: 640px;
  display: flex;
  flex-direction: column;
  padding: 0;
`;
const MainMembersTop = styled.div`
  padding: 20px 40px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const MembersTopLeftLabel = styled(Label)`
  margin-right: 0;
`;
const MainListCenter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;
const MypageMemberMainPresenter = ({
  page,
  onCancelInvite,
  onOpenInvite,
  openInvite,
  onCancelDelete,
  onOpenDelete,
  openDelete,
  selectedUser,
  removeUser,
  isSelectedUser,
  isSelectedAllUsers,
  selectAllUsers,
  removeAllUsers,
  memberList,
  memberCnt,
  setInvitationEmail,
  inviteMember,
  deleteUser,
  setSearchText,
  handleSearch,
}) => {
  return (
    <ChakraProvider>
      <Container>
        <Helmet>
          <title>SSLO | Member</title>
        </Helmet>
        <MainWrapper>
          <Header title={"멤버 설정"} />
          <MainCenter>
            <MainActionBtnDiv style={{ marginTop: -15 }}>
              <StaticButton style={{ width: 100 }} isSelected={true}>
                멤버설정
              </StaticButton>
            </MainActionBtnDiv>
            <MainSearchContainer>
              <Section>
                <Label style={{ marginRight: 50 }}>검색어</Label>
                <SearchInput
                  placeholder={"이름, 이메일로 검색해주세요."}
                  onChange={setSearchText}
                  onKeyDown={(e) => {
                    e.key === "Enter" ? handleSearch() : "";
                  }}
                />
                <SearchBtn isValid={true} onClick={handleSearch}>
                  검색
                </SearchBtn>
              </Section>
            </MainSearchContainer>
            <MainMembersContainer>
              <MainMembersTop>
                <MembersTopLeftLabel>
                  전체 멤버 {memberCnt}명
                </MembersTopLeftLabel>
                <Section style={{ width: "auto" }}>
                  <Button
                    onClick={onOpenDelete}
                    style={{
                      width: "100px",
                      backgroundColor: "#FF9F46",
                      color: "#444444",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "800",
                      textAlign: "center",
                    }}
                  >
                    삭제
                    <Modal
                      isOpen={openDelete}
                      onClose={onCancelDelete}
                      size={"md"}
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
                          멤버 삭제
                        </ModalHeader>
                        <ModalCloseButton style={{ marginTop: -3 }} />
                        <ModalBody
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: "#2A3548",
                          }}
                        >
                          <ModalContainer>선택한 멤버를 삭제하시겠습니까?</ModalContainer>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            style={{
                              width: "100px",
                              backgroundColor: "#3580E3",
                              fontSize: 12,
                              color: "#FFF",
                              marginRight: 10,
                            }}
                            onClick={deleteUser}
                          >
                            확인
                          </Button>
                          <Button
                            style={{
                              width: "100px",
                              backgroundColor: "#FF9F46",
                              fontSize: 12,
                              color: "#444444",
                              marginRight: 10,
                            }}
                            onClick={onCancelDelete}
                          >
                            취소
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Button>
                  <Button
                    onClick={onOpenInvite}
                    style={{
                      width: "100px",
                      backgroundColor: "#3580E3",
                      color: "#FFF",
                      alignItems: "center",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    멤버 초대
                    <Modal
                      isOpen={openInvite}
                      onClose={onCancelInvite}
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
                          멤버 초대
                        </ModalHeader>
                        <ModalCloseButton style={{ marginTop: -3 }} />
                        <ModalBody
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            color: "#2A3548",
                          }}
                        >
                          <ModalContainer>
                            초대할 멤버 이메일을 입력하세요.
                          </ModalContainer>
                          <InviteInput
                            placeholder={"이메일은 입력하세요."}
                            onChange={setInvitationEmail}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            style={{
                              width: "100px",
                              backgroundColor: "#3580E3",
                              fontSize: 12,
                              color: "#FFF",
                              marginRight: 10,
                            }}
                            onClick={inviteMember}
                          >
                            전송
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Button>
                </Section>
              </MainMembersTop>
              <ListHeader
                type={"MY_PAGE_MEMBERS"}
                isSelectedAllUsers={isSelectedAllUsers}
                removeAllUsers={removeAllUsers}
                selectAllUsers={selectAllUsers}
              />
              <MainListCenter>
                {memberList.map((m, index) => {
                  return (
                    <ListItem
                      key={index}
                      type={"MY_PAGE_MEMBERS"}
                      member={m}
                      //memberList={memberList}
                      selectedUser={selectedUser}
                      removeUser={removeUser}
                      isSelectedUser={isSelectedUser}
                    />
                  );
                })}
              </MainListCenter>
              {/* <MainMembersTop>
                <MembersTopLeftLabel>{`가입대기 2명`}</MembersTopLeftLabel>
              </MainMembersTop>
              <ListHeader
                type={"MY_PAGE_WAIT_MEMBERS"}
                isSelectedAllProjectMember={undefined}
                removeAllMember={undefined}
                setSelectedAllProjectMembers={undefined}
              />

              <MainListCenter>
                return (
                <ListItem
                  key={undefined}
                  task={t}
                  type={"MY_PAGE_MEMBERS"}
                  project={undefined}
                  currentUser={undefined}
                  selectTask={undefined}
                  removeTask={undefined}
                  isSelectedTask={undefined}
                />
                );
              </MainListCenter>

              <Paginator itemCount={10} page={page} totalCount={undefined} /> */}
            </MainMembersContainer>
          </MainCenter>
        </MainWrapper>
      </Container>
    </ChakraProvider>
  );
};

export default MypageMemberMainPresenter;
