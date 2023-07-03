import React, { useEffect } from "react";
import styled from "styled-components";
import topBtn from "../../../assets/images/sslo/top_btn.png";
import "../../../css/sslo/company/company.scoped.css";
import "../../../css/sslo/sslo_common.scoped.css";

const PositionContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 85%;
  z-index: 1000;
  text-align: right;
  right: 2%;
`;
const Intro = () => {
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
    if (currentValue >= 485 && currentValue < 1066) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkIntro1").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkIntro1").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkIntro1").offsetTop +
        document.getElementById("linkIntro1").offsetHeight +
        "px";
    } else if (currentValue >= 1066 && currentValue < 2134) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkIntro2").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkIntro2").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkIntro2").offsetTop +
        document.getElementById("linkIntro2").offsetHeight +
        "px";
    } else if (currentValue >= 2134 && currentValue < 2933) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkIntro3").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkIntro3").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkIntro3").offsetTop +
        document.getElementById("linkIntro3").offsetHeight +
        "px";
    } else if (currentValue >= 2933) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkIntro4").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkIntro4").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkIntro4").offsetTop +
        document.getElementById("linkIntro4").offsetHeight +
        "px";
    }
  };
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
      <section className="intro-type2">
        <img
          src={require("../../../assets/images/sslo/sslo-logo(k).svg").default}
          alt="sslo-logo"
        />
        <h2>회사 소개</h2>
        <b>Introduce</b>
        <p>
          글로벌 시장을 선도하는 데이터 통합 솔루션 전문기업입니다.
          <br />
          데이터 판매, 데이터 전처리, 데이터 가공, AI 기술 개발 등<br />
          양질의 서비스 제공으로 파트너사와의 협약을 꾸준히 진행하고 있습니다.
        </p>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul id="menu">
          <div className="underline" />
          <li>
            <a id="linkIntro1" href="#info1">
              비전
            </a>
          </li>
          <li>
            <a id="linkIntro2" href="#info2">
              연혁
            </a>
          </li>
          <li>
            <a id="linkIntro3" href="#info3">
              고객사
            </a>
          </li>
          <li>
            <a id="linkIntro4" href="#info4">
              오시는 길
            </a>
          </li>
        </ul>
        <div className="container">
          <div className="now">
            <div className="now-bar" />
          </div>
        </div>
      </div>
      {/* <!-- 비전 --> */}
      <section className="info1 sub-section" id="info1" />
      {/* <!-- 연혁 --> */}
      <section
        className="info2 sub-section"
        id="info2"
        style={{ paddingTop: 80 }}
      >
        <div className="img-box" />
        <div className="text-box">
          <ul className="box-left">
            <li className="line2022">
              <span className="line" />
              <h3 className="year">2022</h3>
            </li>
            <li className="line2021">
              <span className="line" />
              <h3 className="year">2021</h3>
            </li>
            <li className="line2020">
              <span className="line" />
              <h3 className="year">2020</h3>
            </li>
            <li className="line2019">
              <span className="line" />
              <h3 className="year">2019</h3>
            </li>
            <li className="line2018">
              <span className="line" />
              <h3 className="year">2018</h3>
            </li>
          </ul>
          <ul className="box-right">
            <li className="line2022">
              <span className="line" />
              <p className="content">데이터바우처 지원사업 6개사 선정</p>
              <p className="content">
                AI 학습 데이터 구축 - 문장태깅, 얼굴인식, 동물인식을 위한 BBox,
                Keypoint 라벨링
              </p>
            </li>
            <li className="line2021">
              <span className="line" />
              <p className="content">중소기업기술개발혁신사업 수행기업 선정</p>
              <p className="content">
                K-DATA, 데이터바우처 지원사업 공급기업 선정
              </p>
              <p className="content">이투스 플랫폼 고도화 검증</p>
            </li>
            <li className="line2020">
              <span className="line" />
              <p className="content">전력량계 OCR AI Core 및 App 개발</p>
              <p className="content">
                포털사이트와 SNS 크롤러 개발 및 라벨링 플랫폼 구축
              </p>
              <p className="content">데이터바우처 지원사업 7개사 선정</p>
              <p className="content">
                AI 학습 데이터 구축 – 피부인식, 체형인식, 음식인식을 위한 라벨링
              </p>
              <p className="content">
                K-DATA, 데이터바우처 지원사업 공급기업 선정
              </p>
            </li>
            <li className="line2019">
              <span className="line" />
              <p className="content">데이터 라벨링 서비스 도입</p>
              <p className="content">
                K-DATA 데이터바우처 지원사업 공급기업 선정
              </p>
            </li>
            <li className="line2018">
              <span className="line" />
              <p className="content">
                롯데 이커머스 차세대 품질 점검 및 API 테스팅 자동화 구축
              </p>
              <p className="content">현대상선 한진해운 DevOps 구축</p>
            </li>
          </ul>
        </div>
      </section>
      {/* <!-- 고객사 --> */}
      <section
        className="info3 sub-section container"
        id="info3"
        style={{ paddingTop: 80 }}
      >
        <div className="title-box">
          <h3>고객사</h3>
          <p>다양한 기업들과 협력하여 성장하고 있습니다.</p>
        </div>
        <ul className="list">
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem1.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem2.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem3.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem4.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem5.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem6.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem7.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem8.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem9.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem10.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem11.png")}
              alt=""
            />
            <div className="filter" />
          </li>
          <li>
            <img
              src={require("../../../assets/images/sslo/sub4/ltem12.png")}
              alt=""
            />
            <div className="filter" />
          </li>
        </ul>
      </section>
      {/* <!-- 오시는 길 --> */}
      <section
        className="info4 sub-section container"
        id="info4"
        style={{ paddingTop: 100 }}
      >
        <div className="box-left">
          {/* <!-- 지도 --> */}
          <iframe
            className="map map1"
            src="http://google.com/maps/embed/v1/place?key=API_KEY&q=티벨&region=KR&language=ko"
          />
          <h4>본사</h4>
          <p>서울특별시 강남구 강남대로 354, 9층 (역삼동, 혜천빌딩)</p>
        </div>
        <div className="box-right">
          {/* <!-- 지도 --> */}
          <iframe
            className="map map2"
            src="http://google.com/maps/embed/v1/place?key=API_KEY&q=우림라이온스밸리&region=KR&language=ko"
          />
          <h4>가산지사</h4>
          <p>서울특별시 금천구 가산디지털1로 168 우림라이온스밸리 A동 601호</p>
        </div>
      </section>
      <section className="question">
        <p>궁금하신 사항은 문의하시면 상세히 답변드리겠습니다.</p>
        <a href="help/qna">문의하기</a>
      </section>
    </main>
  );
};

export default Intro;
