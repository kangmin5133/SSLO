import React, { ChangeEvent } from "react";
import styled from "styled-components";
import iconDelete from "../../assets/images/project/icon/icon-class-delete.svg";
import iconArrow from "../../assets/images/project/icon/icon-arrow01.svg";
import iconClose from "../../assets/images/project/icon/icon-x.svg";
import iconCircleClose from "../../assets/images/project/icon/icon-circle-close.svg";
import { ChromePicker, ColorResult } from "react-color";

interface IClassGenerator {
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  showAttrDiv: boolean;
  currentSelectedClass: string | undefined;
  currentSelectedAttr: string | undefined;
  selectedAttrType: ClassAttrType;
  attrName: string;
  tempAttrInfo: string[];
  classesValue: IClass[];
  minValue: number;
  maxValue: number;
  getCurrentSelectedClassAttr: () => undefined | IClassAttr[];
  handleSetAttrOfClass: (attr: IClassAttr) => void;
  handleCloseAttrsInputForm: () => void;
  handleChangeAttrName: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  getCurrentSelectedAttrValues: () => null | IClassAttr;
  handleAttrValueEnter: React.KeyboardEventHandler<HTMLInputElement>;
  handleTempAttrDelete: (attrValue: string) => void;
  handleDeleteClass: (className: string) => void;
  handleColorChange: (selectColor: ColorResult) => void;
  handleSetAttr: (className: string) => void;
  handleChangeCustomMinNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMaxNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMinString: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMaxString: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleChangeMinValue: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeMaxValue: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOpen: (className: any) => void;
  state: boolean;
  selectColor: string;
  handleAttrDelete: (attrName: string) => void;
}

export interface IClassAttr {
  attrName: string;
  attrType: ClassAttrType;
  attrValue?: string[];
  attrMin?: number;
  attrMax?: number;
}

export interface IClass {
  classColor: string;
  className?: string;
  classAttr?: IClassAttr[];
}
export enum ClassAttrType {
  mono = "단일 선택형",
  multi = "다중 선택형",
  customNumber = "입력형 숫자",
  customString = "입력형 문자",
}
const ClassContainer = styled.div`
  display: flex;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
`;
const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  max-width: 500px;
  margin-right: 30px;
`;
const ClassWrapperTitleBox = styled.div`
  width: 200px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccdff8;
`;
const ClassWrapperTitle = styled.span`
  color: #243654;
  font-size: 14px;
  font-weight: 800;
`;
const ClassWrapperBody = styled.div`
  box-sizing: border-box;
  width: 200px;
  min-height: 220px;
  max-height: 250px;
  padding: 10px;
  background-color: #f7fafe;
  overflow-y: auto;
`;
const ClassWrapperBodyInput = styled.input`
  border: 1px solid #aeccf4;
  box-sizing: border-box;
  background-color: #f7fafe;
  width: 100%;
  padding: 6px 10px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #707075;
  }
  font-size: 11px;
  font-weight: 700;
`;
const ClassWrapperLists = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
`;
const ClassLayout = styled.div<{ classBg: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  background-color: ${(props) => (props.classBg ? "#ECF3FB" : "none")};
`;
const AttrLayout = styled.div<{ attrBg: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  background-color: ${(props) => (props.attrBg ? "#ECF3FB" : "none")};
`;
const ClassDeleteBtn = styled.img`
  margin-right: 10px;
  cursor: pointer;
`;
const ClassAttrDeleteBtn = styled.img`
  cursor: pointer;
`;
const Icon = styled.img`
  cursor: pointer;
`;
const ClassDiv = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
`;
const ClassColor = styled.div<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  border: 1px solid ${(props) => props.bgColor};
  width: 12px;
  height: 12px;
  border-radius: 20px;
  margin-right: 7px;
`;
const ClassLabel = styled.span`
  color: #212122;
  font-size: 12px;
  font-weight: 700;
`;
const ClassAttrForm = styled.div<{ attrType: ClassAttrType }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: ${(props) =>
    props.attrType === ClassAttrType.multi ? "230px" : "200px"};
  background-color: #ffffff;
  border: 1px solid #aeccf4;
  padding: 10px 10px;
`;
const FormSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
const FormUpper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  :first-child {
    margin-right: 10px;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 6px 10px;
  background-color: #f7fafe;
  font-size: 11px;
  font-weight: 500;
  border: none;
  :focus {
    outline: none;
  }
`;
const SelectedContainer = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  padding: 0 5px;
  background-color: #f7fafe;
  flex-flow: row wrap;
  overflow-y: auto;
`;
const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid #aeccf4;
  background-color: #ffffff;
  border-radius: 20px;
  min-width: 45px;
  max-width: 70px;
  padding: 2px 3px;
  height: 28px;
  margin-right: 3px;
`;
const ItemLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  margin-right: 5px;
  color: #243654;
  width: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const SaveContainer = styled.div`
  width: 430px;
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;
const SaveBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3580e3;
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  width: 100px;
  height: 36px;
`;
const PickerWrapper = styled.div`
  position: relative;
`;
const ColorWrapper = styled.div`
  position: absolute;
  top: 40px;
  left: -130px;
`;
const ColorBtn = styled.button`
  cursor: pointer;
`;
const ClassColorBtn = styled.div`
  margin-top: 10px;
  margin-left: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3580e3;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  width: 70px;
  height: 36px;
`;
const ClassGenerator: React.FC<IClassGenerator> = ({
  showAttrDiv,
  currentSelectedClass,
  currentSelectedAttr,
  selectedAttrType,
  attrName,
  tempAttrInfo,
  classesValue,
  minValue,
  maxValue,
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
  handleColorChange,
  selectColor,
  handleSetAttr,
  handleChangeCustomMinNumber,
  handleChangeCustomMaxNumber,
  handleChangeCustomMinString,
  handleChangeCustomMaxString,
  handleSave,
  handleChangeMinValue,
  handleChangeMaxValue,
  handleOpen,
  state,
  handleAttrDelete,
}) => {
  return (
    <ClassContainer>
      <ClassWrapper>
        <ClassWrapperTitleBox>
          <ClassWrapperTitle>클래스</ClassWrapperTitle>
        </ClassWrapperTitleBox>
        <ClassWrapperBody>
          <ClassWrapperBodyInput
            onKeyDown={handleEnter}
            type={"text"}
            placeholder={"클래스 입력 후 Enter"}
          />
          <ClassWrapperLists>
            {classesValue &&
              classesValue.map((c, index) => (
                <ClassLayout
                  key={index}
                  classBg={currentSelectedClass === c.className}
                >
                  {c.className.length > 0 && c.className !== "인간" ? (
                    <ClassDeleteBtn
                      src={iconDelete}
                      onClick={() => handleDeleteClass(c.className)}
                    />
                  ) : (
                    <ClassDeleteBtn style={{ marginLeft: "15px" }} />
                  )}
                  <ClassDiv style={{ cursor: "pointer" }}>
                    <ColorBtn
                      type={"button"}
                      onClick={() => handleOpen(c.className)}
                    >
                      <ClassColor bgColor={c.classColor} />
                    </ColorBtn>
                    <ClassLabel onClick={() => handleSetAttr(c.className)}>
                      {c.className}
                    </ClassLabel>
                  </ClassDiv>
                  <Icon
                    src={iconArrow}
                    onClick={() => handleSetAttr(c.className)}
                  />
                </ClassLayout>
              ))}
          </ClassWrapperLists>
        </ClassWrapperBody>
      </ClassWrapper>
      {state && (
        <PickerWrapper>
          <ColorWrapper>
            <ChromePicker color={selectColor} onChange={handleColorChange} />
            <ClassColorBtn onClick={() => handleOpen(null)}>저장</ClassColorBtn>
          </ColorWrapper>
        </PickerWrapper>
      )}
      {showAttrDiv && (
        <>
          <ClassWrapper>
            <ClassWrapperTitleBox>
              <ClassWrapperTitle>클래스 별 속성</ClassWrapperTitle>
            </ClassWrapperTitleBox>
            <ClassWrapperBody>
              <ClassWrapperLists style={{ padding: 0 }}>
                {currentSelectedClass &&
                  getCurrentSelectedClassAttr() &&
                  getCurrentSelectedClassAttr() !== undefined &&
                  getCurrentSelectedClassAttr()!.map((attr, index) => (
                    <AttrLayout
                      attrBg={currentSelectedAttr === attr.attrName}
                      onClick={() => handleSetAttrOfClass(attr)}
                      key={index}
                      style={{
                        width: "100%",
                        color: "#6B78A1",
                        cursor: "pointer",
                      }}
                    >
                      {attr.attrName}

                      <ClassAttrDeleteBtn
                        src={iconDelete}
                        onClick={() => handleAttrDelete(attr.attrName)}
                      />
                    </AttrLayout>
                  ))}
              </ClassWrapperLists>
            </ClassWrapperBody>
          </ClassWrapper>
          {currentSelectedClass && (
            <ClassWrapper>
              <ClassWrapperTitleBox>
                <ClassWrapperTitle>클래스 별 속성 값</ClassWrapperTitle>
              </ClassWrapperTitleBox>
              <ClassWrapperBody style={{ width: 430 }}>
                <ClassAttrForm attrType={selectedAttrType}>
                  <FormUpper>
                    <Icon src={iconClose} onClick={handleCloseAttrsInputForm} />
                  </FormUpper>
                  <FormSection>
                    <FormColumn>
                      <ClassLabel style={{ fontWeight: 800, marginBottom: 5 }}>
                        속성명
                      </ClassLabel>
                      <ClassWrapperBodyInput
                        type={"text"}
                        onChange={handleChangeAttrName}
                        placeholder={"속성명"}
                        value={attrName}
                        style={{ width: "100%", border: 0 }}
                      />
                    </FormColumn>
                    <FormColumn>
                      <ClassLabel style={{ fontWeight: 800, marginBottom: 5 }}>
                        속성유형
                      </ClassLabel>
                      <Select
                        onChange={handleChangeSelect}
                        value={selectedAttrType}
                      >
                        <option value={"단일 선택형"}>단일 선택형</option>
                        <option value={"다중 선택형"}>다중 선택형</option>
                        <option value={"입력형 숫자"}>입력형 숫자</option>
                        <option value={"입력형 문자"}>입력형 문자</option>
                      </Select>
                    </FormColumn>
                  </FormSection>
                  {/* 속성값은 단일과 다중선택에서만 나오도록 */}
                  {selectedAttrType !== ClassAttrType.customNumber &&
                    selectedAttrType !== ClassAttrType.customString && (
                      <FormSection>
                        <FormColumn style={{ width: "100%", marginRight: 0 }}>
                          <ClassLabel
                            style={{ fontWeight: 800, marginBottom: 5 }}
                          >
                            속성값
                          </ClassLabel>
                          <ClassWrapperBodyInput
                            type={"text"}
                            onKeyDown={handleAttrValueEnter}
                            style={{ width: "100%", border: 0 }}
                            placeholder={"속성 값 입력 후 Enter"}
                          />
                          <SelectedContainer>
                            {tempAttrInfo &&
                              tempAttrInfo.map((av, index) => (
                                <SelectedItem key={index}>
                                  <ItemLabel>{av}</ItemLabel>
                                  <Icon
                                    src={iconCircleClose}
                                    onClick={() => handleTempAttrDelete(av)}
                                  />
                                </SelectedItem>
                              ))}
                            {currentSelectedAttr &&
                              getCurrentSelectedAttrValues() !== null &&
                              getCurrentSelectedAttrValues()!.attrValue &&
                              getCurrentSelectedAttrValues()!.attrValue!
                                .length > 0 &&
                              getCurrentSelectedAttrValues()!.attrValue!.map(
                                (av, index) => (
                                  <SelectedItem key={index}>
                                    <ItemLabel>{av}</ItemLabel>
                                    <Icon
                                      src={iconCircleClose}
                                      onClick={() => handleTempAttrDelete(av)}
                                    />
                                  </SelectedItem>
                                )
                              )}
                          </SelectedContainer>
                        </FormColumn>
                      </FormSection>
                    )}

                  {/* 다중선택은 선택 가능 수량도 나오도록 */}
                  {selectedAttrType === ClassAttrType.multi && (
                    <FormSection>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>최소 선택 수</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"min"}
                          type={"number"}
                          onChange={handleChangeMinValue}
                          value={minValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"최소 선택 수"}
                        />
                      </FormColumn>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>최대 선택 수</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"max"}
                          type={"number"}
                          onChange={handleChangeMaxValue}
                          value={maxValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"최대 선택 수"}
                        />
                      </FormColumn>
                    </FormSection>
                  )}

                  {/* 입력형 숫자에서는 숫자의 최소최대범위 나오도록 */}
                  {selectedAttrType === ClassAttrType.customNumber && (
                    <FormSection>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>최소 숫자입력 값</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"min"}
                          type={"number"}
                          onChange={handleChangeCustomMinNumber}
                          value={minValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"최소 입력"}
                        />
                      </FormColumn>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>최대 숫자입력 값</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"max"}
                          type={"number"}
                          onChange={handleChangeCustomMaxNumber}
                          value={maxValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"최대 입력"}
                        />
                      </FormColumn>
                    </FormSection>
                  )}
                  {/* 입력형 문자에서는 글자의 최소최대범위 나오도록 */}
                  {selectedAttrType === ClassAttrType.customString && (
                    <FormSection>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>최소 문자입력 값</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"min"}
                          type={"number"}
                          onChange={handleChangeCustomMinString}
                          value={minValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"최소 입력"}
                        />
                      </FormColumn>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>최대 문자입력 값</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"max"}
                          type={"number"}
                          onChange={handleChangeCustomMaxString}
                          value={maxValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"최대 입력"}
                        />
                      </FormColumn>
                    </FormSection>
                  )}
                </ClassAttrForm>
              </ClassWrapperBody>
              <SaveContainer>
                <SaveBtn onClick={handleSave}>저장</SaveBtn>
              </SaveContainer>
            </ClassWrapper>
          )}
        </>
      )}
    </ClassContainer>
  );
};

export default ClassGenerator;
