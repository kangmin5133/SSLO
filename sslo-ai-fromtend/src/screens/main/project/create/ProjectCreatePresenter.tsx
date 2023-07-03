import React, { ChangeEvent } from "react";
import styled from "styled-components";
import Header from "../../../../components/main/Header";
import ListHeader from "../../../../components/main/ListHeader";
import ListItem from "../../../../components/main/ListItem";
import Paginator from "../../../../components/main/Paginator";
import iconWarning from "../../../../assets/images/project/icon/icon-warning-purple.svg";
import iconNaver from "../../../../assets/images/project/img/naver.svg";
import iconDaum from "../../../../assets/images/project/img/daum.svg";
import iconGoogle from "../../../../assets/images/project/img/google.svg";
import iconInstagram from "../../../../assets/images/project/img/instagram.svg";
import iconCalendar from "../../../../assets/images/project/icon/icon-calendar.svg";
import iconData from "../../../../assets/images/project/icon/icon-data.svg";
import iconUploadFile from "../../../../assets/images/project/icon/icon-upload-file.svg";
import iconDeleteFile from "../../../../assets/images/studio/icon/instanceTools/icon-delete-dark.svg";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../all/calendar.css";
import {
  CollectDataType,
  FormPCollectAmountType,
  FormPCollectDurationType,
  FormPCrawlChannelType,
  FormPType,
  IFormInput,
} from "./ProjectCreateContainer";
import {
  FieldErrorsImpl,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { IDataset } from "../../../../api/datasetApi";
import ClassGenerator, {
  ClassAttrType,
  IClass,
  IClassAttr,
} from "../../../../components/main/ClassGenerator";
import { Helmet } from "react-helmet-async";
import LoaderText from "../../../../components/LoaderText";
import { ColorResult } from "react-color";
import { truncate } from "../../../../utils";
interface IProjectCreatePresenter {
  formErrors: Partial<
    FieldErrorsImpl<{
      pName: string;
      pDescription: string;
      pType: FormPType;
      pCrawlChannel: NonNullable<FormPCrawlChannelType | undefined>;
      pCrawlKeyword: string;
      pCrawlCustomAmount: NonNullable<FormPCollectAmountType | undefined>;
    }>
  >;
  datasets: IDataset[];
  totalDatasets: number;
  calendar: boolean;
  dateRange: Date[] | null;
  selectedPType: FormPType;
  currentPage: number;
  collectDataType: CollectDataType;
  currentCollectChannel: FormPCrawlChannelType;
  currentCollectDuration: FormPCollectDurationType;
  currentCollectAmount: FormPCollectAmountType;
  showAttrDiv: boolean;
  currentSelectedClass: string | undefined;
  currentSelectedAttr: string | undefined;
  selectedAttrType: ClassAttrType;
  attrName: string;
  tempAttrInfo: string[];
  classesValue: IClass[];
  minValue: number;
  maxValue: number;
  createLoading: boolean;
  handleSetChannel: (channel: FormPCrawlChannelType) => void;
  handleSetDuration: (duration: FormPCollectDurationType) => void;
  handleSetAmount: (amount: FormPCollectAmountType) => void;
  showCalendar: () => void;
  handleChangeCalendar: (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handlePopupDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  dateToString: () => string;
  onChangePage: (page: number) => void;
  register: UseFormRegister<IFormInput>;
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  onSubmit: SubmitHandler<IFormInput>;
  handleChangePType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCollectDataSet: () => void;
  handleCollectCrawling: () => void;
  handleCollectMedia: () => void;
  selectDataset: (datasetId: number) => void;
  removeDataset: (datasetId: number) => void;
  isSelectedDataset: (datasetId: number) => boolean;
  selectAllDataset: () => void;
  isSelectedAllDatasets: () => boolean;
  removeAllDataset: () => void;
  preventEnter: React.KeyboardEventHandler<HTMLFormElement>;
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  getCurrentSelectedClassAttr: () => undefined | IClassAttr[];
  handleSetAttrOfClass: (attr: IClassAttr) => void;
  handleCloseAttrsInputForm: () => void;
  handleChangeAttrName: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  getCurrentSelectedAttrValues: () => null | IClassAttr;
  handleAttrValueEnter: React.KeyboardEventHandler<HTMLInputElement>;
  handleTempAttrDelete: (attrValue: string) => void;
  handleDeleteClass: (className: string) => void;
  handleSetAttr: (className: string) => void;
  handleChangeCustomMinNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMaxNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMinString: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMaxString: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleChangeMinValue: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeMaxValue: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCancelCreate: () => void;
  handleColorChange: (selectColor: ColorResult) => void;
  selectColor: string;
  handleOpen: (className: any) => void;
  state: boolean;
  handleAttrDelete: (attrName: string) => void;
  fileInput: React.MutableRefObject<HTMLInputElement | null>;
  selectFile: () => void;
  handleChangeFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  framedImageDatas: File[];
  handleSelectData: (e: any, data: File, index: number) => void;
  handleRemoveData: (e: any, data: File) => void;
  uploadSrc: any;
  fUploadLoading: boolean;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void; 
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  fileDrag: React.MutableRefObject<HTMLInputElement | null>;
}

const Container = styled.div`
  display: flex;
  font-family: NanumSquare;
  overflow-x: hidden;
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
const MainCenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #ecf3fb;
  box-sizing: border-box;
`;
const MainCenterForm = styled.form`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #ecf3fb;
  width: 100%;
  height: 100%;
  padding: 30px 30px;
`;
const MainProjectInfoContainer = styled.div`
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
  margin-bottom: 15px;
  :last-child {
    margin-bottom: 0;
  }
`;
const UploadListSection = styled.div`
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
  :last-child {
    border-bottom: 0px;
  }
  display: flex;
  align-items: center;
  overflow-y: auto;
  width: calc(100% - 60px);
  height: 100%;
  max-height: calc(100% - 60px);
  flex-direction: column;
  overflow-x: hidden;
  padding: 0 30px;
`;
const VerticalWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const LabelWrapper = styled.div`
  display: flex;
  width: 150px;
`;
const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 20px;
`;
const LabelDiv = styled.div`
  width: 100px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d2e2f8;
  font-size: 14px;
  font-weight: 800;
  color: #243654;
`;
const LabelValueDiv = styled.div`
  width: 400px;
  height: 32px;
  background-color: #f4f4f4;
  color: #707075;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 0 15px;
`;
const PNameInput = styled.input`
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
const PTypeSelect = styled.select`
  padding: 8px 10px;
  width: 205px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 16px;
  font-weight: 700;
  margin-right: 25px;
  :focus {
    outline: none;
  }
`;
const Icon = styled.img``;
const MainBottomDiv = styled(MainProjectInfoContainer)`
  background-color: inherit;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CreateButton = styled.button`
  display: flex;
  width: 100px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #3480e3;
  color: #fff;
  margin-right: 10px;
`;
const CancelButton = styled.div`
  display: flex;
  width: 100px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #fff;
  color: #243754;
`;
const PConfigureContainer = styled.div`
  margin-top: 30px;
  min-height: 550px;
  max-height: 630px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px 0;
  box-sizing: content-box;
  background-color: #fff;
`;
const SmallSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const SmallLabel = styled(Label)`
  font-size: 15px;
`;
const PTypeBtn = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 36px;
  border-radius: 20px;
  border: 1px solid #afccf4;
  background-color: ${(props) => (props.isSelected ? "#3580E3" : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#ffffff" : "#243654")};
  transition: background-color 0.5s linear;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  margin-right: 20px;
`;
const PConfigureUpper = styled.div`
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
const Warning = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #a248e9;
  margin-left: 10px;
`;
const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
  cursor: pointer;
`;
const RadioLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const RadioLabelContainer = styled.div`
  display: flex;
  align-items: center;
`;
const RadioBtnWrapper = styled.div<{ isSelected: boolean }>`
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  border: 1px solid ${(props) => (props.isSelected ? "#2ea090" : "#243654")};
  margin-right: 7px;
`;
const RadioBtn = styled.div<{ isSelected: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 20px;
  background-color: ${(props) => (props.isSelected ? "#2ea090" : "")};
  border: ${(props) => (props.isSelected ? "1px solid #2ea090" : "")};
`;
const RadioLabel = styled.span<{ isSelected: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => (props.isSelected ? "#2ea090" : "#243654")};
`;
const RadioWebLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 60px;
  border: 1px solid #aeccf4;
  margin-top: 10px;
`;
const DateDivContainer = styled.div`
  min-width: 300px;
  display: flex;
  position: relative;
`;
const DateDiv = styled.div<{ isEnabled: boolean }>`
  position: relative;
  min-width: 200px;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background-color: ${(props) => (props.isEnabled ? "#f7fafe" : "#f4f4f4")};
  border: 1px solid #afccf4;
  cursor: ${(props) => (props.isEnabled ? "pointer" : "not-allowed")};
`;
const DateString = styled.span<{ dates: number | null }>`
  font-size: 14px;
  font-weight: 700;
  color: #243754;
  margin-right: ${(props) =>
    props.dates !== null && props.dates === 2 && "30px"};
`;
const ErrorMessage = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #ff4343;
`;
const UploadButton = styled.div`
  display: flex;
  min-width: 80px;
  width: calc(100% - 20px);
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #3580E3;
  color: #fff;
`;

const ProjectCreatePresenter: React.FC<IProjectCreatePresenter> = ({
  formErrors,
  datasets,
  totalDatasets,
  calendar,
  dateRange,
  selectedPType,
  currentPage,
  collectDataType,
  currentCollectChannel,
  currentCollectDuration,
  currentCollectAmount,
  showAttrDiv,
  currentSelectedClass,
  currentSelectedAttr,
  selectedAttrType,
  attrName,
  tempAttrInfo,
  classesValue,
  minValue,
  maxValue,
  createLoading,
  handleSetChannel,
  handleSetDuration,
  handleSetAmount,
  showCalendar,
  handleChangeCalendar,
  handlePopupDown,
  dateToString,
  onChangePage,
  register,
  handleSubmit,
  onSubmit,
  handleChangePType,
  handleCollectDataSet,
  handleCollectCrawling,
  handleCollectMedia,
  selectDataset,
  removeDataset,
  isSelectedDataset,
  selectAllDataset,
  isSelectedAllDatasets,
  removeAllDataset,
  preventEnter,
  handleEnter,
  getCurrentSelectedClassAttr,
  handleSetAttrOfClass,
  handleCloseAttrsInputForm,
  handleChangeAttrName,
  handleChangeSelect,
  getCurrentSelectedAttrValues,
  handleAttrValueEnter,
  handleTempAttrDelete,
  handleDeleteClass,
  handleSetAttr,
  handleChangeCustomMinNumber,
  handleChangeCustomMaxNumber,
  handleChangeCustomMinString,
  handleChangeCustomMaxString,
  handleSave,
  handleChangeMinValue,
  handleChangeMaxValue,
  handleCancelCreate,
  handleColorChange,
  selectColor,
  handleOpen,
  state,
  handleAttrDelete,
  fileInput,
  selectFile,
  handleChangeFileUpload,
  framedImageDatas,
  handleSelectData,
  handleRemoveData,
  uploadSrc,
  fUploadLoading,
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  fileDrag,

}) => {
  return (
    <Container onClick={handlePopupDown}>
      <Helmet>
        <title>SSLO | CREATE PROJECT</title>
      </Helmet>
      <MainWrapper>
        <Header title="프로젝트 생성" />
        <MainCenterWrapper>
          <MainCenterForm
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => preventEnter(e)}
          >
            <MainProjectInfoContainer>
              <Section>
                <LabelWrapper>
                  <Label>프로젝트 이름*</Label>
                </LabelWrapper>
                <PNameInput
                  {...register("pName", {
                    required: "프로젝트 이름은 필수 필드입니다.",
                  })}
                  
                  placeholder={"프로젝트 이름을 입력해주세요."}
                />
                {formErrors.pName && (
                  <ErrorMessage>{formErrors.pName.message}</ErrorMessage>
                )}
              </Section>
              <Section>
                <LabelWrapper>
                  <Label>프로젝트 설명</Label>
                </LabelWrapper>
                <PNameInput
                  {...register("pDescription")}
                  placeholder={"프로젝트 설명을 입력해주세요."}
                />
              </Section>
              <Section>
                <LabelWrapper>
                  <Label>프로젝트 유형*</Label>
                </LabelWrapper>
                <PTypeSelect
                  {...register("pType", {
                    required: "프로젝트 유형은 필수 필드입니다.",
                  })}
                  value={selectedPType}
                  onChange={handleChangePType}
                >
                  <option value={"데이터 수집/정제"}>데이터 수집/정제</option>
                  <option value={"데이터 전처리"}>데이터 전처리</option>
                  <option value={"데이터 가공"}>데이터 가공</option>
                </PTypeSelect>
                {formErrors.pType && (
                  <ErrorMessage>{formErrors.pType.message}</ErrorMessage>
                )}
              </Section>
            </MainProjectInfoContainer>
            {selectedPType === FormPType.collect && (
              <PConfigureContainer>
                <PConfigureUpper>
                  <Section style={{ marginBottom: 30 }}>
                    <Label>프로젝트 설정*</Label>
                  </Section>
                  <SmallSection>
                    <SmallLabel>데이터 유형*</SmallLabel>
                  </SmallSection>
                  <SmallSection style={{ marginTop: 10 }}>
                    <PTypeBtn
                      isSelected={collectDataType === CollectDataType.dataset}
                      onClick={handleCollectDataSet}
                    >
                      인간 데이터셋 제공
                    </PTypeBtn>
                    <PTypeBtn
                      isSelected={collectDataType === CollectDataType.crawling}
                      onClick={handleCollectCrawling}
                    >
                      웹 크롤링 데이터
                    </PTypeBtn>
                    <PTypeBtn
                      isSelected={collectDataType === CollectDataType.upload}
                      onClick={handleCollectMedia}
                    >
                      데이터 업로드
                    </PTypeBtn>
                  </SmallSection>
                </PConfigureUpper>
                {collectDataType === CollectDataType.dataset && (
                  <>
                    <ListHeader
                      type="DATASET TYPE"
                      selectAllDataset={selectAllDataset}
                      isSelectedAllDatasets={isSelectedAllDatasets}
                      removeAllDataset={removeAllDataset}
                    />
                    {datasets.map((data, index) => (
                      <ListItem
                        key={index}
                        type={"DATASET TYPE"}
                        dataset={data}
                        selectDataset={selectDataset}
                        removeDataset={removeDataset}
                        isSelectedDataset={isSelectedDataset}
                      />
                    ))}
                    <Paginator
                      itemCount={10}
                      page={currentPage}
                      totalCount={totalDatasets}
                      stateChangeFn={onChangePage}
                    />
                  </>
                )}
                {collectDataType === CollectDataType.crawling && (
                  <PConfigureUpper>
                    <Section>
                      <Icon src={iconWarning} />
                      <Warning>
                        크롤링한 데이터는 상업적 용도로 사용 불가능합니다. 법적
                        문제 발생 시 책임지지 않습니다.
                      </Warning>
                    </Section>
                    <Section style={{ marginTop: 15 }}>
                      <SmallLabel>수집채널</SmallLabel>
                    </Section>
                    <Section>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.naver)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.naver
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.naver
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.naver
                            }
                          >
                            네이버(Naver)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconNaver} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.daum)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.daum
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.daum
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.daum
                            }
                          >
                            다음(Daum)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconDaum} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.google)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.google
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.google
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.google
                            }
                          >
                            구글(Google)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconGoogle} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.instagram)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.instagram
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.instagram
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.instagram
                            }
                          >
                            인스타그램(Instagram)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconInstagram} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                    </Section>
                    <Section>
                      <SmallLabel>키워드</SmallLabel>
                    </Section>
                    <Section>
                      <PNameInput
                        {...register("pCrawlKeyword")}
                        placeholder={"키워드를 입력하세요."}
                      />
                    </Section>
                    <Section>
                      <SmallLabel>수집기간</SmallLabel>
                    </Section>
                    <Section>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.week)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.week
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.week
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.week
                            }
                          >
                            1주일
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.month3)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.month3
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.month3
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.month3
                            }
                          >
                            3개월
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.year)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.year
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.year
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.year
                            }
                          >
                            1년
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.custom)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.custom
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                            }
                          >
                            직접설정
                          </RadioLabel>
                        </RadioLabelWrapper>
                        <DateDivContainer style={{ marginLeft: 20 }}>
                          <DateDiv
                            isEnabled={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                            }
                            onClick={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                                ? showCalendar
                                : undefined
                            }
                          >
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
                                new Date(
                                  Date.now() - 60 * 60 * 24 * 7 * 4 * 6 * 10000
                                )
                              }
                              maxDate={
                                new Date(
                                  Date.now() + 60 * 60 * 24 * 7 * 4 * 6 * 1000
                                )
                              }
                            />
                          )}
                        </DateDivContainer>
                      </RadioLabelContainer>
                    </Section>
                    <Section>
                      <SmallLabel>수집건수</SmallLabel>
                    </Section>
                    <Section>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.h1)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h1
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.h1
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h1
                            }
                          >
                            100
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.h5)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h5
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.h5
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h5
                            }
                          >
                            500
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.th1)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th1
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.th1
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th1
                            }
                          >
                            1000
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.th2)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th2
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.th2
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th2
                            }
                          >
                            2000
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.th3)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th3
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.th3
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th3
                            }
                          >
                            3000
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() => handleSetAmount(FormPCollectAmountType.custom)}
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.custom
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.custom
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.custom
                            }
                          >
                            직접입력
                          </RadioLabel>
                        </RadioLabelWrapper>
                        <PNameInput
                          {...register("pCrawlCustomAmount")}
                          type={"text"}
                          disabled={
                            currentCollectAmount !==
                            FormPCollectAmountType.custom
                          }
                          style={{
                            minWidth: 80,
                            maxWidth: 80,
                            marginLeft: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                            backgroundColor:
                              currentCollectAmount !==
                              FormPCollectAmountType.custom
                                ? "#F4F4F4"
                                : "#F7FAFE",
                          }}
                        />
                      </RadioLabelContainer>
                    </Section>
                  </PConfigureUpper>
                )}
                {collectDataType === CollectDataType.upload && (
                  <Section 
                    style={{ 
                      width: "50%", 
                      height: "400px", 
                      minHeight: "400px",
                      maxHeight: "400px", 
                      marginLeft: "30px",
                      border: "1px solid #AECCF4" 
                    }}
                  >
                    <VerticalWrapper 
                      style={{ 
                        width: "300px",
                        maxWidth: "300px", 
                        height: "calc(100% - 60px)", 
                        padding: "30px", 
                        flexGrow: 1 
                      }}
                    >
                      <Section 
                        id={"uploadSection"}
                        ref={fileDrag} 
                        onDragEnter={handleDragEnter} 
                        onDragOver={handleDragOver} 
                        onDragLeave={handleDragLeave} 
                        onDrop={handleDrop}
                        style={{ 
                          width: "100%",
                          height: "60%",
                          minHeight: "50%",
                          maxHeight: "60%",
                          background: "#F7FAFE",
                          border: "1px dotted #AECCF4", 
                        }}
                      >
                        <img 
                          id={"upCapture"} 
                          src={uploadSrc ? uploadSrc : iconUploadFile} 
                          style={{ 
                            width: "auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            marginLeft: "auto", 
                            marginRight: "auto",
                          }} 
                        />
                      </Section>
                      <VerticalWrapper style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Label style={{ marginBottom: 10, marginRight: 0 }}>
                          파일을 드래그해주세요.
                        </Label>
                        <span style={{ fontSize: "15px", color: "#737680", marginBottom: 10 }}>
                          동영상, JPEG 형식 이미지만 업로드 가능
                        </span>
                        <span style={{ fontSize: "15px", color: "#737680", marginBottom: 10 }}>
                          또는
                        </span>
                        <input
                          type={"file"}
                          style={{ display: "none" }}
                          ref={fileInput}
                          accept={"video/*, image/jpeg"}
                          onChange={handleChangeFileUpload}
                        />
                        <UploadButton
                          onClick={!fUploadLoading ? selectFile : null}
                          style={{
                            cursor: fUploadLoading ? "not-allowed" : "pointer"
                          }}
                        >
                          {fUploadLoading ? <LoaderText /> : "파일 업로드"}
                        </UploadButton>
                      </VerticalWrapper>
                    </VerticalWrapper>
                    <VerticalWrapper 
                      style={{ 
                        width: "calc(100% - 360px)",
                        height: "calc(100% - 15px)",
                        justifyContent: "flex-start", 
                        border: "1px solid #CFD1D4",
                        flexGrow: 1,
                        background: "#F9FAFB",
                        paddingBottom: "15px",
                      }}
                    >
                      <Section 
                        style={{ 
                          width: "calc(100% - 60px)",
                          height: "30px",
                          justifyContent: "space-between",
                          marginTop: "15px",
                          padding: "0 30px"
                        }}
                      >
                        <SmallLabel>
                          {`파일 목록 (${framedImageDatas.length})`}
                        </SmallLabel>
                      </Section>
                      <UploadListSection>
                        {framedImageDatas.length > 0 && 
                          framedImageDatas.map((data, index) => {
                            return (
                              <Section 
                                key={index} 
                                id={"data_" + index}
                                style={{ 
                                  width: "100%",
                                  justifyContent: "space-between",
                                  padding: "10px 0", 
                                  marginBottom: "0"
                                }}
                              >
                                <div style={{ display: "flex", width: "15%", justifyContent: "center" }}>
                                  <Icon src={iconData} style={{ width: "50px" }} />
                                </div>
                                <div onClick={(e) => handleSelectData(e, data, index)} style={{ width: "80%", padding: "0 10px", cursor: "pointer" }}>
                                  <SmallLabel style={{ width: "100%", textAlign: "center", margin: 0 }}>
                                    {truncate(data.name, 35)}
                                  </SmallLabel>
                                </div>
                                <div style={{ display: "flex", width: "5%", justifyContent: "center", cursor: "pointer" }}>
                                  <Icon src={iconDeleteFile} onClick={(e) => handleRemoveData(e, data)} />
                                </div>
                              </Section>
                            )
                          })
                        }
                      </UploadListSection>
                    </VerticalWrapper>
                  </Section>
                  
                )}
              </PConfigureContainer>
            )}
            {selectedPType === FormPType.manufacturing && (
              <PConfigureContainer>
                <PConfigureUpper>
                  <Section style={{ marginBottom: 30 }}>
                    <Label>프로젝트 설정*</Label>
                  </Section>
                  <SmallSection>
                    <SmallLabel>클래스 설정*</SmallLabel>
                  </SmallSection>
                </PConfigureUpper>
                <ClassGenerator
                  showAttrDiv={showAttrDiv}
                  currentSelectedClass={currentSelectedClass}
                  currentSelectedAttr={currentSelectedAttr}
                  selectedAttrType={selectedAttrType}
                  attrName={attrName}
                  tempAttrInfo={tempAttrInfo}
                  classesValue={classesValue}
                  minValue={minValue}
                  maxValue={maxValue}
                  handleEnter={handleEnter}
                  getCurrentSelectedClassAttr={getCurrentSelectedClassAttr}
                  handleSetAttrOfClass={handleSetAttrOfClass}
                  handleCloseAttrsInputForm={handleCloseAttrsInputForm}
                  handleChangeAttrName={handleChangeAttrName}
                  handleChangeSelect={handleChangeSelect}
                  getCurrentSelectedAttrValues={getCurrentSelectedAttrValues}
                  handleAttrValueEnter={handleAttrValueEnter}
                  handleTempAttrDelete={handleTempAttrDelete}
                  handleDeleteClass={handleDeleteClass}
                  handleSetAttr={handleSetAttr}
                  handleChangeCustomMinNumber={handleChangeCustomMinNumber}
                  handleChangeCustomMaxNumber={handleChangeCustomMaxNumber}
                  handleChangeCustomMinString={handleChangeCustomMinString}
                  handleChangeCustomMaxString={handleChangeCustomMaxString}
                  handleSave={handleSave}
                  handleChangeMinValue={handleChangeMinValue}
                  handleChangeMaxValue={handleChangeMaxValue}
                  handleColorChange={handleColorChange}
                  selectColor={selectColor}
                  handleOpen={handleOpen}
                  state={state}
                  handleAttrDelete={handleAttrDelete}
                />
              </PConfigureContainer>
            )}
            <MainProjectInfoContainer style={{ marginTop: 30 }}>
              <Section>
                <LabelWrapper>
                  <Label>작업단계</Label>
                </LabelWrapper>
              </Section>
              <Section style={{ marginBottom: 10 }}>
                <LabelWrapper style={{ marginRight: 10, width: 100 }}>
                  <LabelDiv>1단계</LabelDiv>
                </LabelWrapper>
                <LabelValueDiv>
                  {selectedPType === FormPType.collect
                    ? "수집/정제"
                    : selectedPType === FormPType.preprocessing
                    ? "전처리"
                    : "가공"}
                </LabelValueDiv>
              </Section>
              <Section>
                <LabelWrapper style={{ marginRight: 10, width: 100 }}>
                  <LabelDiv>2단계</LabelDiv>
                </LabelWrapper>
                <LabelValueDiv>검수</LabelValueDiv>
              </Section>
            </MainProjectInfoContainer>
            <MainBottomDiv>
              <CreateButton
                disabled={createLoading || fUploadLoading}
                style={{ cursor: createLoading || fUploadLoading ? "not-allowed" : "pointer" }}
              >
                {createLoading ? (
                  <LoaderText text={"Creating..."} />
                ) : (
                  "생성하기"
                )}
              </CreateButton>
              {!createLoading && (
                <CancelButton onClick={handleCancelCreate}>취소</CancelButton>
              )}
            </MainBottomDiv>
          </MainCenterForm>
        </MainCenterWrapper>
      </MainWrapper>
    </Container>
  );
};

export default ProjectCreatePresenter;
