import React, { useState, useEffect } from "react";
import "../../../css/sslo/sslo_common.scoped.css";
import "../../../css/sslo/solution/solution.scoped.css";
import topBtn from "../../../assets/images/sslo/top_btn.png";
import ssloLogo from "../../../assets/images/sslo/main-sslo-logo.svg";
import styled from "styled-components";
import { useFocusEffect } from "@chakra-ui/react";

import tabGif01 from "../../../assets/images/sslo/solution/grayscale.gif";
import tabGif02 from "../../../assets/images/sslo/solution/binarization.gif";
import tabGif03 from "../../../assets/images/sslo/solution/zoom.gif";
import tabGif04 from "../../../assets/images/sslo/solution/rotate.gif";
import tabGif05 from "../../../assets/images/sslo/solution/scaling.gif";
import tabGif06 from "../../../assets/images/sslo/solution/translation.gif";
import tabGif07 from "../../../assets/images/sslo/solution/brightness.gif";
import tabGif08 from "../../../assets/images/sslo/solution/crop.gif";
import tabGif09 from "../../../assets/images/sslo/solution/noise.gif";
import tabGif10 from "../../../assets/images/sslo/solution/reject.gif";
import tabGif11 from "../../../assets/images/sslo/solution/mosaic.gif";

const SolutionTab = styled.div<{ tabColor: boolean }>`
  background: ${(props) =>
    props.tabColor
      ? "linear-gradient(to right bottom, #3580e3, #8579f3)"
      : "none"};
  color: ${(props) => (props.tabColor ? "#fff" : "none")};
`;

const PositionContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 85%;
  z-index: 1000;
  text-align: right;
  right: 2%;
`;

export interface solution {
  desc: string;
  src: string;
}

const Solution = () => {
  let horizontalUnderline = document.getElementsByClassName("underline");

  useEffect(() => {
    const horizontalMenus = document.querySelectorAll(
      ".lnb #menu:first-child a"
    );
    horizontalUnderline = document.getElementsByClassName("underline");
    console.log(horizontalMenus);
    horizontalMenus.forEach((menu) => {
      menu.addEventListener("click", (e) => horizontalIndicator(e));
    });
    document.addEventListener("scroll", (e) => onScroll(e));
  }, []);

  const horizontalIndicator = (e) => {
    for (let i = 0; i < horizontalUnderline.length; i++) {
      (horizontalUnderline.item(i) as HTMLElement).style.left =
        e.currentTarget.offsetLeft + "px";
      (horizontalUnderline.item(i) as HTMLElement).style.width =
        e.currentTarget.offsetWidth + "px";
      (horizontalUnderline.item(i) as HTMLElement).style.top =
        e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
    }
  };

  const onScroll = (e: any) => {
    console.log(e);
    const currentValue = document.documentElement.scrollTop;
    horizontalUnderline = document.getElementsByClassName("underline");
    console.log(currentValue);
    if (currentValue >= 485 && currentValue < 2000) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkSolution1").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkSolution1").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkSolution1").offsetTop +
        document.getElementById("linkSolution1").offsetHeight +
        "px";
    } else if (currentValue >= 2000 && currentValue < 3600) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkSolution2").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkSolution2").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkSolution2").offsetTop +
        document.getElementById("linkSolution2").offsetHeight +
        "px";
    } else if (currentValue >= 3600 && currentValue < 5066) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkSolution3").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkSolution3").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkSolution3").offsetTop +
        document.getElementById("linkSolution3").offsetHeight +
        "px";
    } else if (currentValue >= 5066) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkSolution4").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkSolution4").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkSolution4").offsetTop +
        document.getElementById("linkSolution4").offsetHeight +
        "px";
    }
  };

  const tabText01 =
    "그레이스케일은 256*256의 3채널로 구성되는 일반적인 이미지를 256의 1채널 이미지로 변환합니다.";
  const tabText02 =
    "이진화는 256*256*256의 3채널로 구성되는 일반적인 이미지를 0(흰색)과 255(검은색)으로만 변환합니다.";
  const tabText03 =
    "확대/축소는 원본 이미지 비율에 맞춰 크기를 늘리거나 줄이는 작업입니다.";
  const tabText04 =
    "회전은 이미지를 시계방향으로 회전하고, 대칭은 이미지를 좌우/상하 방향으로 대칭하는 작업입니다.";
  const tabText05 =
    "스케일링은 이미지 사이즈를 변환하는 것으로 원본 이미지 비율과 상관없이 사이즈를 변환합니다.";
  const tabText06 =
    "트랜스레이션은 이미지 위치를 변경하여 변환하는 것으로 이미지 평행이동이 가능합니다.";
  const tabText07 =
    "밝기/대비는 이미지의 명도 값, 대비 값을 조절하여 색상을 변경하는 작업입니다.";
  const tabText08 =
    "자르기는 이미지의 일부분을 제거하여 크기를 변경하는 작업입니다.";
  const tabText09 =
    "노이즈 제거는 이미지 픽셀을 부드럽게 하고 미세한 디테일을 손상시키는 작업입니다.";
  const tabText10 =
    "배경 제거는 객체를 박싱하고 해당 객체 외에는 배경으로 간주하여 제거하는 작업입니다.";
  const tabText11 =
    "비식별화는 박싱을 통해 객체를 검출하여 해당 객체를 블러처리하는 작업입니다.";
  const [solutionTab, setSolutionTab] = useState<number>(1);
  const [solutionItem, setSolutionItem] = useState<solution>({
    desc: tabText01,
    src: tabGif01,
  });
  const handleTab = (tab: any) => {
    setSolutionTab(tab);
    console.log(tab);
  };
  useEffect(() => {
    let desc = "",
      src = "";
    switch (solutionTab) {
      case 1:
        desc = tabText01;
        src = tabGif01;
        break;
      case 2:
        desc = tabText02;
        src = tabGif02;
        break;
      case 3:
        desc = tabText03;
        src = tabGif03;
        break;
      case 4:
        desc = tabText04;
        src = tabGif04;
        break;
      case 5:
        desc = tabText05;
        src = tabGif05;
        break;
      case 6:
        desc = tabText06;
        src = tabGif06;
        break;
      case 7:
        desc = tabText07;
        src = tabGif07;
        break;
      case 8:
        desc = tabText08;
        src = tabGif08;
        break;
      case 9:
        desc = tabText09;
        src = tabGif09;
        break;
      case 10:
        desc = tabText10;
        src = tabGif10;
        break;
      case 11:
        desc = tabText11;
        src = tabGif11;
        break;
      default:
        desc = tabText01;
        src = tabGif01;
        break;
    }
    const item: solution = {
      desc: desc,
      src: src,
    };
    setSolutionItem(item);
  }, [solutionTab]);

  // ! 맨위로 화면 이동
  const moveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <main id="main">
      <PositionContainer>
        <button onClick={moveToTop}>
          <img src={topBtn} alt="" style={{ width: 80, height: 80, cursor:"pointer" }} />
        </button>
      </PositionContainer>
      {/* <!-- 인트로--> */}
      <section className="intro">
        <img src={ssloLogo} alt="sslo-logo" />
        <h2>솔루션 소개</h2>
        <p>다양한 기업들이 통합 플랫폼을 사용하여 성장 중에 있습니다.</p>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul id="menu">
          <div className="underline" />
          <li>
            <a id="linkSolution1" href="#solution1">
              Labeling Studio
            </a>
          </li>
          <li>
            <a id="linkSolution2" href="#solution2">
              수집정제 Studio
            </a>
          </li>
          <li>
            <a id="linkSolution3" href="#solution3">
              {" "}
              자동화 기능
            </a>
          </li>
          <li>
            <a id="linkSolution4" href="#solution4">
              산업 활용분야
            </a>
          </li>
        </ul>
        <div className="container">
          <div className="now">
            <div className="now-bar" />
          </div>
        </div>
      </div>
      {/* <!-- AI assistant Tools --> */}
      <section
        className="solution1 sub-section container"
        style={{ padding: "100px 0px 0px 0px" }}
        id="solution1"
      >
        <h3 className="title">AI assistant Tools</h3>
        <ul className="tool">
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/hd.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>HD</h4>
              <p>
                특정 이미지에서 인간 객체를 찾고
                <br />
                해당 경계 상자와 모양을 예측
                <br />
                (Boxing, Segmentation)
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/od.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>OD</h4>
              <p>
                특정 이미지에서 객체를 찾고 <br />
                해당 경계상자를 예측
                <br />
                (Boxing)
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/is.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>IS</h4>
              <p>
                특정 이미지에서 인스턴스를 찾고
                <br />
                해당모양을 예측
                <br />
                (Segmentation)
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/ses.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>SES</h4>
              <p>
                이미지의 각 픽셀이 어떤 클레스에 <br />
                속하는지 분류하고 해당 모양을
                <br />
                예측 (Segmentation)
              </p>
            </div>
          </li>
        </ul>
      </section>
      {/* <!-- semi auto Tools --> */}
      <section
        className="solution1 sub-section container"
        style={{ padding: "40px 0px 0px 0px" }}
      >
        <h3 className="title">Semi-Auto Tools</h3>
        <ul className="tool" style={{ justifyContent: "left" }}>
          <li style={{ marginRight: 20 }}>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/smartpen.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>스마트펜</h4>
              <p>
                객체 픽셀 상에 point 도구로 클릭 시
                <br />
                유사 픽셀 간 polygon을 생성
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/autopoint.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>오토포인트</h4>
              <p>
                이미지 상에 two-point 클릭으로 <br />
                객체 맞춤형 자동 박싱 생성
                <br />
                (Boxing)
              </p>
            </div>
          </li>
        </ul>
      </section>
      {/* <!-- Manual Tools --> */}
      <section
        className="solution1 sub-section container"
        style={{ padding: "40px 0px 30px 0px" }}
      >
        <h3 className="title">Manual Tools</h3>
        <ul className="tool">
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/boxing.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>박싱</h4>
              <p>
                객체탐지, 객체인식을 위해
                <br />
                상자의 두 모서리를 표시하여
                <br />
                이미지에 배치 할 수 있는
                <br />
                가장 간단한 주석 형식
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/polyline.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>폴리라인</h4>
              <p>
                여러 개의 점을 가진 선을 활용하여 <br />
                특정 영역을 라벨링 함으로써
                <br />
                인도, 차선 등을 구분하기 위해 사용
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/polygon.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>폴리곤</h4>
              <p>
                다각형 모양으로 객체의
                <br />
                가시 영역 외곽선을 따라
                <br />
                점을 찍어 그리는 라벨링 방법
              </p>
            </div>
          </li>

          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/point.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>포인트</h4>
              <p>
                클래스에 해당되는 지점을 <br />
                마우스로 클릭하여 점 형태로 지정
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/brush.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>브러쉬</h4>
              <p>
                segmentation 영역을 지정하기 위한
                <br />
                도구 선택 시 마우스 커서가 <br />원 형태로 전환되며 객체상에
                드래그하여
                <br />
                segmentation을 수행
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/3dcube.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>3D 큐브</h4>
              <p>
                2D로 작업할 수 없는 3D 객체들을
                <br />
                정육면체로 생성하는 라벨링 방식으로
                <br />
                자동차, 건물 등 입체적인 객체들을
                <br />
                2D 형식으로 라벨링 작업하는 것에
                <br />
                한계가 있는 부분을 해결하기 위한 기술
              </p>
            </div>
          </li>

          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/segment.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>세그먼트</h4>
              <p>
                이미지에서 객체들을 의미있는 <br />
                단위로 영역 분할하는 방법으로
                <br />
                객체를 개별적으로 구분가능
              </p>
            </div>
          </li>
          <li>
            <div className="img-box">
              <img
                src={require("../../../assets/images/sslo/solution/keypoint.png")}
                alt=""
              />
            </div>
            <div className="text-box">
              <h4>키포인트</h4>
              <p>
                사람뼈대,동물뼈대,손뼈대를
                <br />
                생성하여 객체에 맞춰
                <br />
                라벨링하기 위해 사용
              </p>
            </div>
          </li>
        </ul>
        <a href="/studio/trial" className="experience">
          <img
            src={require("../../../assets/images/sslo/sslo-logo.svg").default}
            alt="sslo-logo"
          />
          <p>도구 체험하러 가기</p>
        </a>
      </section>
      {/* <!-- 수집정제 studio --> */}
      <section
        className="solution2 sub-section container"
        id="solution2"
        style={{ paddingTop: 100 }}
      >
        <h2>
          데이터 수집/정제 솔루션은 인간 데이터셋과 웹 크롤러
          <br />
          수집 기능을 제공하고, 중복 데이터 선별 작업 수행이 가능합니다.
        </h2>
        <ul className="collect-studio">
          <li>
            <div className="img-wrap ">
              <img
                src={require("../../../assets/images/sslo/solution/collect01.png")}
                alt=""
              />
            </div>
            <div className="text-wrap">
              <h4>인간 데이터 셋</h4>
              <span className="bar1" />
              <p>자체 제공 데이터</p>
            </div>
          </li>
          <li>
            <div className="img-wrap ">
              <img
                src={require("../../../assets/images/sslo/solution/collect02.png")}
                alt=""
              />
            </div>
            <div className="text-wrap">
              <h4>웹 크롤러</h4>
              <span className="bar2" />
              <p>네이버, 다음, 구글</p>
            </div>
          </li>
          <li>
            <div className="img-wrap ">
              <img
                src={require("../../../assets/images/sslo/solution/collect03.png")}
                alt=""
              />
            </div>
            <div className="text-wrap">
              <h4>중복 데이터 선별</h4>
              <span className="bar3" />
              <p>불필요한 데이터 반려</p>
            </div>
          </li>
        </ul>
        <h2>
          데이터 전처리 솔루션은 11가지 이미지 관련 <br />
          전처리 기술을 제공합니다.
        </h2>
        <div style={{ display: "flex" }}>
          <div className="title">
            <SolutionTab
              tabColor={solutionTab === 1}
              onClick={() => {
                handleTab(1);
              }}
            >
              {solutionTab === 1 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/grayscale-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/grayscale-icon.png")}
                  alt=""
                />
              )}
              그레이스케일
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 2}
              onClick={() => {
                handleTab(2);
              }}
            >
              {solutionTab === 2 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/binarization-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/binarization-icon.png")}
                  alt=""
                />
              )}
              이진화
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 3}
              onClick={() => {
                handleTab(3);
              }}
            >
              {solutionTab === 3 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/zoom-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/zoom-icon.png")}
                  alt=""
                />
              )}
              확대/축소
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 4}
              onClick={() => {
                handleTab(4);
              }}
            >
              {solutionTab === 4 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/rotate-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/rotate-icon.png")}
                  alt=""
                />
              )}
              회전/대칭
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 5}
              onClick={() => {
                handleTab(5);
              }}
            >
              {solutionTab === 5 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/scaling-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/scaling-icon.png")}
                  alt=""
                />
              )}
              스케일링
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 6}
              onClick={() => {
                handleTab(6);
              }}
            >
              {solutionTab === 6 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/scaling-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/scaling-icon.png")}
                  alt=""
                />
              )}
              트랜슬레이션
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 7}
              onClick={() => {
                handleTab(7);
              }}
            >
              {solutionTab === 7 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/brightness-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/brightness-icon.png")}
                  alt=""
                />
              )}
              밝기/대비
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 8}
              onClick={() => {
                handleTab(8);
              }}
            >
              {solutionTab === 8 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/crop-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/crop-icon.png")}
                  alt=""
                />
              )}
              자르기
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 9}
              onClick={() => {
                handleTab(9);
              }}
            >
              {solutionTab === 9 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/noise-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/noise-icon.png")}
                  alt=""
                />
              )}
              노이즈제거
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 10}
              onClick={() => {
                handleTab(10);
              }}
            >
              {solutionTab === 10 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/reject-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/reject-icon.png")}
                  alt=""
                />
              )}
              배경제거
            </SolutionTab>
            <SolutionTab
              tabColor={solutionTab === 11}
              onClick={() => {
                handleTab(11);
              }}
            >
              {solutionTab === 11 ? (
                <img
                  src={require("../../../assets/images/sslo/solution/mosaic-i.png")}
                  alt=""
                />
              ) : (
                <img
                  src={require("../../../assets/images/sslo/solution/mosaic-icon.png")}
                  alt=""
                />
              )}
              비식별화
            </SolutionTab>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="desc">{solutionItem.desc}</div>
            <div className="img-wrap1">
              <img src={solutionItem.src} alt="" />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- 자동화 기능 --> */}
      <span />
      <section className="solution3 sub-section container" id="solution3">
        <div className="auto1">
          <div className="img-wrap">
            <img
              src={require("../../../assets/images/sslo/solution/auto01.png")}
              alt=""
            />
          </div>
          <ul className="text-wrap">
            <li>
              <h4>데이터 수집 자동화</h4>
              <span className="bar1" />
              <p>
                데이터 수집은 티벨이 보유한 '인간 데이터 셋'과 대용량 '웹
                크롤링'을 사용하는 작업으로 구성합니다.
                <br />
                수집 커스텀이 필요한 경우 문의를 통해 요구조건에 따른 이미지
                데이터를 얻을 수 있습니다.
                <br />
                사용자는 수집한 결과를 확인하고 검수 완료한 최종 산출물을
                다운로드 할 수 있습니다.
              </p>
            </li>
            <li>
              <h4>데이터 정제 자동화</h4>
              <span className="bar2" />
              <p>
                대용량 이미지 데이터에 대한 정제를 수행하기 위하여 '중복제거
                STUDIO'에서 재생버튼 클릭만으로 <br />
                유사한 이미지를 추출합니다. 사용자는 정제 결과를 확인하고 반려를
                제외한 최종 산출물을 다운로드 할 수 있습니다.
              </p>
            </li>
          </ul>
        </div>
        <div className="auto2">
          <div className="img-wrap">
            <img
              src={require("../../../assets/images/sslo/solution/auto02.png")}
              alt=""
            />
          </div>
          <div className="text-wrap">
            <div className="top">
              <h4>데이터 전처리 자동화</h4>
              <span className="bar3" />
            </div>
            <p>
              이미지 데이터 전처리를 수행하기 위하여 '전처리 STUDIO'에서 <br />
              11가지 도구를 사용합니다. '전처리 일괄처리' 를 통해 4가지 기능을
              적용하여 선택한 데이터를 일괄적으로 처리할 수 있습니다. 사용자는
              전처리 결과를 확인하고 최종 산출물을 다운로드 할 수 있습니다.
              <br />
              <br />
              <br />
            </p>
            <div className="top">
              <h4>데이터 가공 자동화</h4>
              <span className="bar3" />
            </div>
            <p>
              능동학습 (Active Learning) 기법을 활용하여 사용자가 클래스 별로
              20개 레이블링을 수행하면 자동으로 훈련이 실행됩니다. <br />
              훈련을 완료하면 도구가 활성화되고, OD, IS, SES 도구 특성에 맞게
              이미지에서 클래스로 지정한 객체를 자동으로 라벨링합니다.
            </p>
          </div>
        </div>
      </section>
      {/* <!-- 산업 활용분야 --> */}
      <section
        className="solution4 sub-section container"
        id="solution4"
        style={{ paddingTop: 100, marginTop: 70 }}
      >
        {/* <ul className="industry1"> */}
        <div className="slideshow">
          <div className="images">
            <img
              src={require("../../../assets/images/sslo/solution/section401.png")}
              alt=""
            />
            <h4>AI</h4>
          </div>
          <div className="images">
            <img
              src={require("../../../assets/images/sslo/solution/section402.png")}
              alt=""
            />
            <h4>Healthcare</h4>
          </div>
          <div className="images">
            <img
              src={require("../../../assets/images/sslo/solution/section403.png")}
              alt=""
            />
            <h4>E-Commerce</h4>
          </div>
          <div className="images">
            <img
              src={require("../../../assets/images/sslo/solution/section404.png")}
              alt=""
            />
            <h4>BigData</h4>
          </div>
          <div className="images">
            <img
              src={require("../../../assets/images/sslo/solution/section405.png")}
              alt=""
            />
            <h4>Medical</h4>
          </div>
          <div className="images">
            <img
              src={require("../../../assets/images/sslo/solution/section406.png")}
              alt=""
            />
            <h4>Media</h4>
          </div>
        </div>
        {/* </ul> */}
      </section>
      <section
        className="solution4 sub-section container"
        id="solution4"
        style={{ marginBottom: 70 }}
      >
        {/* <ul className="industry2"> */}
        <div className="slideshow2">
          <div className="images2">
            <img
              src={require("../../../assets/images/sslo/solution/section407.png")}
              alt=""
            />
            <h4>Finance</h4>
          </div>
          <div className="images2">
            <img
              src={require("../../../assets/images/sslo/solution/section408.png")}
              alt=""
            />
            <h4>Game</h4>
          </div>
          <div className="images2">
            <img
              src={require("../../../assets/images/sslo/solution/section409.png")}
              alt=""
            />
            <h4>Traffic</h4>
          </div>
          <div className="images2">
            <img
              src={require("../../../assets/images/sslo/solution/section410.png")}
              alt=""
            />
            <h4>Education</h4>
          </div>
          <div className="images2">
            <img
              src={require("../../../assets/images/sslo/solution/section411.png")}
              alt=""
            />
            <h4>Farm</h4>
          </div>
          <div className="images2">
            <img
              src={require("../../../assets/images/sslo/solution/section412.png")}
              alt=""
            />
            <h4>Work</h4>
          </div>
        </div>
        {/* </ul> */}
      </section>
      <section className="question">
        <p>궁금하신 사항은 문의하시면 상세히 답변드리겠습니다.</p>
        <a href="help/qna">문의하기</a>
      </section>
    </main>
  );
};

export default Solution;
