import React, { useState } from "react";
import "../../../css/sslo/sslo_main.scoped.css";
import "../../../css/sslo/sslo_common.scoped.css";
import topBtn from "../../../assets/images/sslo/top_btn.png";
import sslologo from "../../../assets/images/sslo/main-sslo-logo.svg";
import sslologok from "../../../assets/images/sslo/sslo-logo(k).svg";
import iconcheck from "../../../assets/images/sslo/icon-check.svg";
import labeling01 from "../../../assets/images/sslo/labeling01.png";
import labeling02 from "../../../assets/images/sslo/labeling02.png";
import labeling03 from "../../../assets/images/sslo/labeling03.png";
import collection01 from "../../../assets/images/sslo/collection01.png";
import collection02 from "../../../assets/images/sslo/collection02.png";
import collection03 from "../../../assets/images/sslo/collection03.png";
import hd from "../../../assets/images/sslo/hd.gif";
import od from "../../../assets/images/sslo/od.gif";
import is from "../../../assets/images/sslo/is.gif";
import ses from "../../../assets/images/sslo/ses.gif";
import mouseover from "../../../assets/images/sslo/mouseover.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styled from "styled-components";

interface SsloMainPresenter {
  tab: number;
  handleTab: (tab: any) => void;
  moveToTop: () => void;
}

export const Styled_Slide = styled(Slider)`
  .slick-list {
    width: 700px;
    height: 400px;
    margin: -20;
    background-color: #f0f9ff;
    border-radius: 10px;
  }
  .slick-prev:before,
  .slick-next:before {
    font-family: "slick";
    font-size: 50px;
    line-height: 1;
    opacity: 0.75;
    color: #24365442;
    -webkit-font-smoothing: antialiased;
  }
  .slick-prev:before {
    margin-left: 0px;
  }
  .slick-next:before {
    margin-left: 30px;
  }
  .slick-prev {
    left: 10px;
    z-index: 10;
  }
  [dir="rtl"] .slick-prev {
    right: -25px;
    left: auto;
  }

  .slick-next {
    right: 70px;
  }
  [dir="rtl"] .slick-next {
    right: auto;
    left: -100px;
  }

  .slick-dots {
    bottom: -50px;
  }

  .slick-dots li {
    margin: -20px 15px;
  }

  .slick-dots li button:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: gray;
    text-align: center;
    content: "";
  }

  .slick-dots li.slick-active button:before {
    opacity: 0.75;
    color: black;
  }
`;

const PositionContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 85%;
  z-index: 1000;
  text-align: right;
  right: 2%;
`;

const ToolTab = styled.li<{ tabColor: boolean }>`
  background: ${(props) =>
    props.tabColor
      ? "linear-gradient(to right bottom, #3580e3, #8579f3)"
      : "none"};
  color: ${(props) => (props.tabColor ? "#fff" : "none")};
`;
export interface slide {
  activeSlide?: number;
  activeSlide2?: number;
}

const SsloMainPresenter: React.FC<SsloMainPresenter> = ({
  handleTab,
  tab,
  moveToTop,
}) => {
  const [imgStatus, setImgStatus] = useState<slide>({
    activeSlide: 0,
    activeSlide2: 0,
  });
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "0px",
    outsideChevron: true,
    afterChange: (current: any) =>
      setImgStatus({
        activeSlide: current,
        activeSlide2: imgStatus.activeSlide2,
      }),
  };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: "0px",
    outsideChevron: true,
    afterChange: (current: any) =>
      setImgStatus({
        activeSlide: imgStatus.activeSlide,
        activeSlide2: current,
      }),
  };

  return (
    <>
      <main id="main">
        <PositionContainer>
          <button onClick={moveToTop}>
            <img src={topBtn} alt="" style={{ width: 80, height: 80, cursor:"pointer" }} />
          </button>
        </PositionContainer>
        {/* 메인 */}
        <div className="main-wrap">
          <div className="inner-text container">
            <h3>
              데이터로 새로운
              <br />
              미래를 펼치는
            </h3>
            <img src={sslologo} alt="" className="sslo-logo" />
          </div>
        </div>
        {/*  섹션1  */}
        <section className="section1 container">
          <h3>
            <img src={sslologok} alt="sslo-logo" />는
          </h3>
          <p>
            글로벌 시장을 선도하는 데이터 통합 플랫폼입니다.
            <br />
            전문 인력이 개발한 뛰어난 AI 기술력으로
            <br />
            데이터 가공 및 분석에 있어 획기적인 아이템을 제공합니다.
          </p>
          <button className="intro-btn">
            <a href="/sslo/intro">소개 바로가기</a>
          </button>
        </section>
        {/*  섹션2  */}

        <section className="section2">
          <h2>
            <b>데이터 수집</b>에서 <b>정제, 전처리, 분석, 가공, 배포, 관리</b>
            까지! <br />
            원하는 기능을 <b>선택하여 활용 가능</b>합니다.
          </h2>
          {/*  슬라이드1  */}
          <div className="slide-wrap slide-wrap1 container">
            <h3>
              Data <br />
              Labeling
            </h3>
            <div className="content-box">
              <ul className="slide-text">
                {imgStatus.activeSlide === 0 && (
                  <li className="text">
                    <div className="text-top">
                      <h4>데이터 분석/가공</h4>
                      <b>
                        수동 · 반자동 라벨링을 통해 여러 분야의 정형 · 비정형
                        데이터를 편리한 작업 환경에서 체계적인 프로세스로 가공할
                        수 있어 효과적인 산출물을 제공합니다.
                      </b>
                    </div>
                    <ul className="check-list">
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>8가지 수동 주석도구 제공</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>2가지 반자동 주석도구 제공</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>4가지 자동 주석도구 제공</p>
                      </li>
                    </ul>
                  </li>
                )}
                {imgStatus.activeSlide === 1 && (
                  <li className="text">
                    <div className="text-top">
                      <h4>학습 데이터 셋 커스터마이징</h4>
                      <b>
                        모델 개발에 필요한 다양한 학습 데이터셋 제공을 위해 파일
                        내의 클래스 값, 속성 값, 파일 형식, 파일정보 등 고객이
                        원하는 데이터 셋으로 산출 가능합니다.
                      </b>
                    </div>
                    <ul className="check-list">
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>클래스 및 속성 선택 추출</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>다양한 파일 형식 다운로드</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>파일 정보 선택 추출</p>
                      </li>
                    </ul>
                  </li>
                )}
                {imgStatus.activeSlide === 2 && (
                  <li className="text">
                    <div className="text-top">
                      <h4>인공지능 모델 배포</h4>
                      <b>
                        인공지능 개발에 따른 Auto-Labeling을 수행하며 개발된
                        인공지능 모델을 물체인식 인공지능 서비스로 배포하고
                        활용할 수 있도록 다운로드 형식으로 제공합니다.
                      </b>
                    </div>
                    <ul className="check-list">
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>텐서플로(TensorFlow)</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>파이토치(PyTorch)</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>오픈 뉴럴 네트워크 익스체인지(ONNX)</p>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
              <section className="section2">
                <Styled_Slide {...settings}>
                  <li>
                    <img
                      style={{ width: 700, height: 400 }}
                      src={labeling01}
                      alt=""
                    />
                  </li>
                  <li>
                    <img
                      style={{ width: 700, height: 400 }}
                      src={labeling02}
                      alt=""
                    />
                  </li>
                  <li>
                    <img
                      style={{ width: 700, height: 400 }}
                      src={labeling03}
                      alt=""
                    />
                  </li>
                </Styled_Slide>
              </section>
            </div>
          </div>
          {/*  슬라이드2  */}
          <div className="slide-wrap slide-wrap2 container">
            <h3 style={{ left: "790px" }}>
              Data collection <br />& purification
            </h3>
            <div className="content-box">
              <section className="section2">
                <Styled_Slide {...settings2}>
                  <li>
                    <img
                      style={{ width: 700, height: 400 }}
                      src={collection01}
                      alt=""
                    />
                  </li>
                  <li>
                    <img
                      style={{ width: 700, height: 400 }}
                      src={collection02}
                      alt=""
                    />
                  </li>
                  <li>
                    <img
                      style={{ width: 700, height: 400 }}
                      src={collection03}
                      alt=""
                    />
                  </li>
                </Styled_Slide>
              </section>
              <ul className="slide-text">
                {imgStatus.activeSlide2 === 0 && (
                  <li className="text">
                    <div className="text-top" style={{ height: 210 }}>
                      <h4>데이터 수집</h4>
                      <b>
                        수집 솔루션을 통해 자체 제공하는 인간 데이터 셋과 다양한
                        사이트의 데이터를 수집 가능하며, 필요한 데이터는
                        문의하기를 이용하여 저렴한 비용으로 빠른 시간 내에
                        수집할 수 있습니다.
                      </b>
                    </div>
                    <ul className="check-list">
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>자사가 보유한 인간 데이터 셋 제공</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>고객맞춤형 데이터 수집 (네이버, 구글, 다음)</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>특성에 맞는 세분화된 분야 의뢰</p>
                      </li>
                    </ul>
                  </li>
                )}
                {imgStatus.activeSlide2 === 1 && (
                  <li className="text">
                    <div className="text-top">
                      <h4>데이터 정제</h4>
                      <b>
                        수집 완료 리스트에서 정제할 데이터를 선택하여 자동 중복
                        데이터 검출 기능을 통해 동일한 데이터나 무효한 데이터를
                        반려처리하여 핵심 데이터를 선정합니다.
                      </b>
                    </div>
                    <ul className="check-list">
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>무효데이터 제거 (반려)</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>중복 데이터 제거 (반려)</p>
                      </li>
                    </ul>
                  </li>
                )}
                {imgStatus.activeSlide2 === 2 && (
                  <li className="text">
                    <div className="text-top">
                      <h4>데이터 전처리</h4>
                      <b>
                        10가지 전처리 도구에서 요구조건에 맞게 필요한 데이터를
                        변환하는 작업을 거쳐 모델 학습에 활용 가능한 고품질의
                        데이터를 제공합니다.
                      </b>
                    </div>
                    <ul className="check-list">
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>전처리 일괄처리 (그레이스케일, 노이즈제거 등)</p>
                      </li>
                      <li>
                        <img src={iconcheck} alt="" />
                        <p>10가지 전처리 도구 제공</p>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
        {/* 섹션3 */}
        <section className="section3 container">
          <div className="title-box">
            <h3>SSLO Tools</h3>
            <p>더 효율적이고 편리해진 주석도구를 제공합니다.</p>
            <div className="under-bar" />
          </div>
          <ul className="tool-bar">
            <ToolTab
              tabColor={tab === 1}
              className="toolbar1"
              onClick={() => {
                handleTab(1);
              }}
            >
              Human Detection
            </ToolTab>
            <ToolTab
              tabColor={tab === 2}
              className="toolbar2"
              onClick={() => {
                handleTab(2);
              }}
            >
              Object Detection
            </ToolTab>
            <ToolTab
              tabColor={tab === 3}
              className="toolbar3"
              onClick={() => {
                handleTab(3);
              }}
            >
              Instance Segment
            </ToolTab>
            <ToolTab
              tabColor={tab === 4}
              className="toolbar4"
              onClick={() => {
                handleTab(4);
              }}
            >
              Semantic Segment
            </ToolTab>
          </ul>
          <div className="tool-slide" style={{ marginLeft: 150 }}>
            {tab === 1 && (
              <div className="toolslide1">
                <img style={{ width: 1000, height: 500 }} src={hd} alt="" />
              </div>
            )}
            {tab === 2 && (
              <div className="toolslide2">
                <img style={{ width: 1000, height: 500 }} src={od} alt="" />
              </div>
            )}
            {tab === 3 && (
              <div className="toolslide3">
                <img style={{ width: 1000, height: 500 }} src={is} alt="" />
              </div>
            )}
            {tab === 4 && (
              <div className="toolslide4">
                <img style={{ width: 1000, height: 500 }} src={ses} alt="" />
              </div>
            )}
          </div>
          <button className="tool-btn">
            <a href="/sslo/solution">도구 더보기</a>
          </button>
        </section>
        {/* 섹션4 */}
        <section className="section4">
          <div className="title-box">
            <h3>구축 사례</h3>
            <p>
              다양한 기업들이 통합 플랫폼을 이용하여 데이터 셋을 구축하였습니다.
            </p>
            <div className="under-bar" />
          </div>
          <ul className="img-box container">
            <li className="case1">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 팜</h4>
                <p>곰팡이균 분석 시스템</p>
                <b>Polygon</b>
              </div>
            </li>
            <li className="case2">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>맞춤형 헬스케어</h4>
                <p>자세인식 운동자세 교정 솔루션</p>
                <b>Boxing, Keypoint</b>
              </div>
            </li>
            <li className="case3">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>생활-패션</h4>
                <p>발사이즈 분석 수제화 플랫폼</p>
                <b>Point</b>
              </div>
            </li>
            <li className="case4">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 시티</h4>
                <p>교통약자 인식 시스템</p>
                <b>keypoint, Boxing</b>
              </div>
            </li>
            <li className="case5">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>생활-코스메틱</h4>
                <p>피부상태인식 초개인화 화장품 솔루션</p>
                <b>Polygon</b>
              </div>
            </li>
            <li className="case6">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 팜</h4>
                <p>가축 행동 및 상태 인식 시스템</p>
                <b>Keypoint, Boxing</b>
              </div>
            </li>
            <li className="case7">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 공장</h4>
                <p>공정과정에서의 검수 자동화</p>
                <b>Line, Boxing, Polygon</b>
              </div>
            </li>
          </ul>
        </section>
        <section className="question">
          <p>궁금하신 사항은 문의하시면 상세히 답변드리겠습니다.</p>
          <a href="sslo/help/qna">문의하기</a>
        </section>
      </main>
    </>
  );
};

export default SsloMainPresenter;
