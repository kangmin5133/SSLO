import React from 'react';
import styled from 'styled-components';
import { ITask } from '../../api/taskApi';
export interface ISmallTaskProps {
  task: ITask;
  isSelected: boolean;
  isTrial?: boolean;
}

const ImageWrapper = styled.div<{ isSelected: boolean }>`
  height: 100%;
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 15px;
  padding-left: 25px;
  padding-bottom: 10px;
  margin-right: 7px;
  background: ${(props) => (props.isSelected ? '#c0c3c7' : null)};
`;

const Image = styled.img<{ isSelected: boolean; taskStatus: number }>`
  width: 130px;
  height: 80px;
  background-repeat: no-repeat;
  border-width: ${(props) => (props.isSelected ? '2px' : null)};
  border-style: ${(props) => (props.isSelected ? 'solid' : null)};
  border-color: ${(props) =>
    props.isSelected
      ? props.taskStatus === 1
        ? '#E2772A'
        : props.taskStatus === 2
        ? '#3580E3'
        : props.taskStatus === 3
        ? '#2EA090'
        : '#FF4343'
      : null};
`;
const ImageDescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;
const ImageName = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  margin-bottom: 4px;
`;
const ImageStatus = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #3580e3;
`;

/**
 * 스튜디오 화면의 아래 File List 오픈 시, 보여지는 타스크 컴포넌트
 * @params task -> task
 * @params isSelected -> 선택된 이미지인지 아닌지 여부
 */
const SmallTask: React.FC<ISmallTaskProps> = ({ task, isSelected, isTrial }) => {
  const truncate = (str: string) => {
    return str.length > 20 ? str.substring(0, 17) + '...' : str;
  };

  return (
    <>
      <ImageWrapper isSelected={isSelected}>
      {isTrial? 
      (
        <>
          <Image
            src={task.imageThumbnail}
            isSelected={isSelected}
            taskStatus={task.taskStatus}
          />
          <ImageDescWrapper>
            <ImageName>{truncate(task.imageName)}</ImageName>
          </ImageDescWrapper>
        </>
      ):(
        <>
          <Image
            src={`data:image/jpeg;base64,${task.imageThumbnail}`}
            isSelected={isSelected}
            taskStatus={task.taskStatus}
          />

          <ImageDescWrapper>
            <ImageName>{truncate(task.imageName)}</ImageName>
            {task.taskStatus === 1 && (
              <ImageStatus style={{ color: '#E2772A' }}>미작업</ImageStatus>
            )}
            {task.taskStatus === 2 && (
              <ImageStatus style={{ color: '#3580E3' }}>진행중</ImageStatus>
            )}
            {task.taskStatus === 3 && (
              <ImageStatus style={{ color: '#2EA090' }}>작업완료</ImageStatus>
            )}
            {task.taskStatus === 4 && (
              <ImageStatus style={{ color: '#FF4343' }}>반려</ImageStatus>
            )}
          </ImageDescWrapper>
        </>
      )}
      </ImageWrapper>
    </>
  );
};

export default SmallTask;
