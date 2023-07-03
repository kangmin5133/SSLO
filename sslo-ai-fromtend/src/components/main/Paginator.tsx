import React, { useState } from "react";
import styled from "styled-components";
import iconPrev from "../../assets/images/project/icon/icon-prev.svg";
import iconNext from "../../assets/images/project/icon/icon-next.svg";
import { Link } from "react-router-dom";

export interface IIndexBtn {
  isSelected: boolean;
  number: number;
  stateChangeFn?: (page: number) => void;
}

export interface IPaginator {
  itemCount: number;
  page: string | number;
  totalCount: number;
  stateChangeFn?: (page: number) => void;
}

const PaginatorContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 0 40px;
  margin-bottom: 20px;
`;
const Icon = styled.img``;
const PaginateDiv = styled.div`
  display: flex;
  align-items: center;
`;
const IndexButton = styled.div<{ isSelected: boolean }>`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  color: ${(props) => (props.isSelected ? "#FFFFFF" : "#243654")};
  display: flex;
  font-size: 13px;
  font-weight: 800;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? "#6B78A1" : undefined)};
`;

const IndexBtn: React.FC<IIndexBtn> = ({
  isSelected,
  number,
  stateChangeFn,
}) => {
  if (stateChangeFn) {
    return (
      <IndexButton
        isSelected={isSelected}
        onClick={() => stateChangeFn(number)}
      >
        {number}
      </IndexButton>
    );
  }
  return (
    <Link to={`?page=${number}`}>
      <IndexButton isSelected={isSelected}>{number}</IndexButton>
    </Link>
  );
};

/** 특정 리스트의 Paginator
 * @param itemCount 화면에 몇 개씩 뿌려주는지를 의미 기본은 10
 * @param totalCount 리스트 데이터의 총 개수
 * @param page 현재 페이지 정보
 * @param stateChangeFn <, >, 번호 버튼 클릭 시 function 값을 주는 경우 해당 function
 */
const Paginator: React.FC<IPaginator> = ({
  itemCount = 10,
  totalCount,
  page,
  stateChangeFn,
}) => {
  const [paging, setPaging] = useState<number>(1);

  const getIndexBtn = (): any[] => {
    const cntArray = [];
    // const length = Math.ceil(itemCount / 10);
    const length = Math.ceil(totalCount / itemCount);
    for (let i = 1 + (paging - 1) * 10; i <= length; i++) {
      cntArray.push(i);
      if (i === paging * 10) break;
    }
    return cntArray;
  };

  const cleanPage = typeof page === "string" ? parseInt(page) : page;
  const isNextPage = (): boolean => {
    return cleanPage * itemCount < totalCount;
  };
  return (
    <PaginatorContainer>
      <PaginateDiv>
        {/* //! 현재 page가 1이 아닌 경우 왼쪽 화살표 버튼을 노출 */}
        {stateChangeFn && cleanPage !== 1 && (
          <Icon
            src={iconPrev}
            style={{ marginRight: 15, cursor: "pointer" }}
            onClick={() => {
              stateChangeFn(cleanPage - 1);
              if (cleanPage % 10 === 1) setPaging((prev) => prev - 1);
            }}
          />
        )}
        {!stateChangeFn && cleanPage !== 1 && (
          <Link
            to={`?page=${cleanPage - 1}`}
            onClick={() => {
              if (cleanPage % 10 === 1) setPaging((prev) => prev - 1);
            }}
          >
            <Icon
              src={iconPrev}
              style={{ marginRight: 15, cursor: "pointer" }}
            />
          </Link>
        )}
        {/* //! page 버튼 노출 */}
        {getIndexBtn().map((i, index) => {
          if (stateChangeFn) {
            return (
              <IndexBtn
                key={index}
                number={i}
                stateChangeFn={stateChangeFn}
                isSelected={cleanPage === i}
              />
            );
          }
          return (
            <IndexBtn key={index} number={i} isSelected={cleanPage === i} />
          );
        })}
        {stateChangeFn && isNextPage() && (
          <Icon
            src={iconNext}
            style={{ marginLeft: 15, cursor: "pointer" }}
            onClick={() => {
              stateChangeFn(cleanPage + 1);
              if (cleanPage % 10 === 0) setPaging((prev) => prev + 1);
            }}
          />
        )}
        {!stateChangeFn && isNextPage() && (
          <Link
            to={`?page=${cleanPage + 1}`}
            onClick={() => {
              if (cleanPage % 10 === 0) setPaging((prev) => prev + 1);
            }}
          >
            <Icon
              src={iconNext}
              style={{ marginLeft: 15, cursor: "pointer" }}
            />
          </Link>
        )}
      </PaginateDiv>
    </PaginatorContainer>
  );
};

export default Paginator;
