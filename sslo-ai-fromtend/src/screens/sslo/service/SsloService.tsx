import React, { useEffect } from "react";
import "../../../css/sslo/service/service.scoped.css";
import "../../../css/sslo/sslo_common.scoped.css";
import sslologo from "../../../assets/images/sslo/main-sslo-logo.svg";
import topBtn from "../../../assets/images/sslo/top_btn.png";
import ssloArrow from "../../../assets/images/sslo/arrow.png";
import ssloDataSet from "../../../assets/images/sslo/dataset.png";
import ssloDashboard from "../../../assets/images/sslo/dashboard.png";
import { NavigationType } from "react-router-dom";
import styled from "styled-components";

const PositionContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 85%;
  z-index: 1000;
  text-align: right;
  right: 2%;
`;

const Service = () => {
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
    if (currentValue >= 485 && currentValue < 1140) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkService1").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkService1").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkService1").offsetTop +
        document.getElementById("linkService1").offsetHeight +
        "px";
    } else if (currentValue >= 1140 && currentValue < 1765) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkService2").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkService2").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkService2").offsetTop +
        document.getElementById("linkService2").offsetHeight +
        "px";
    } else if (currentValue >= 1765 && currentValue < 2807) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkService3").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkService3").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkService3").offsetTop +
        document.getElementById("linkService3").offsetHeight +
        "px";
    } else if (currentValue >= 2807) {
      (horizontalUnderline.item(0) as HTMLElement).style.left =
        document.getElementById("linkService4").offsetLeft + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.width =
        document.getElementById("linkService4").offsetWidth + "px";
      (horizontalUnderline.item(0) as HTMLElement).style.top =
        document.getElementById("linkService4").offsetTop +
        document.getElementById("linkService4").offsetHeight +
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
      {/* <!-- 인트로 --> */}
      <section className="intro">
        <img src={sslologo} alt="sslo-logo" />
        <h2>서비스 소개</h2>
        <p>다양한 기업들이 통합 플랫폼을 사용하여 성장 중에 있습니다.</p>
      </section>
      {/* <!-- 메뉴바 --> */}
      <div className="lnb">
        <ul id="menu">
          <div className="underline" />
          <li>
            <a id="linkService1" href="#service1">
              데이터 구축 서비스
            </a>
          </li>
          <li>
            <a id="linkService2" href="#service2">
              데이터 구축 프로세스
            </a>
          </li>
          <li>
            <a id="linkService3" href="#service3">
              자동화 서비스
            </a>
          </li>
          <li>
            <a id="linkService4" href="#service4">
              대시보드
            </a>
          </li>
        </ul>
        <div className="container">
          <div className="now">
            <div className="now-bar" />
          </div>
        </div>
      </div>
      {/* <!-- 데이터 구축 서비스 --> */}
      <section className="service1 container" id="service1">
        <ul className="line line1">
          <li>
            <div className="top top1">샘플 서비스</div>
            <div className="bottom">
              자동화 솔루션의 샘플 데이터로 <br />
              필요 데이터 정의
            </div>
          </li>
          <li>
            <div className="top top2">최고 품질</div>
            <div className="bottom">
              교차검수, 이중검수 , 단계별 검수 진행,
              <br />
              모델학습 테스트를 통한 품질 증가
            </div>
          </li>
          <li>
            <div className="top top3">정책 수립</div>
            <div className="bottom">
              데이터 보안, 개인정보, 개인정보 활용 등 관련 정책 수립,
              <br />
              긴급상황 발생 시 대응 체계 수립
            </div>
          </li>
        </ul>
        <ul className="line line2">
          <li>
            <div className="top top4">자동화 솔루션</div>
            <div className="bottom">
              데이터 구축 시간,
              <br />
              인력 리소스 문제 해결
            </div>
          </li>
          <li>
            <div className="top top5">컨설팅</div>
            <div className="bottom">
              데이터 활용 방법,
              <br />
              구축 방식에 대한 컨설팅 지원
            </div>
          </li>
          <li>
            <div className="top top6">전문인력</div>
            <div className="bottom">
              초기 데이터 구축,
              <br />
              판단 데이터 가공
            </div>
          </li>
          <li>
            <div className="top top7">고객 맞춤</div>
            <div className="bottom">
              AI 비즈니스 고객을 위한
              <br />
              맞춤형 데이터 솔루션 제공
            </div>
          </li>
        </ul>
      </section>
      {/* <!-- 데이터 구축 프로세스 --> */}
      <section className="service2 container" id="service2">
        <div className="img-box">
          <div className="bar1" />
        </div>
        <ul className="text-box1">
          <li>
            <h4>프로젝트 협의</h4>
            <p>
              작업기간 협의
              <br />
              산출물 협의
              <br />
              데이터 정의 및 설계
              <br />
              파일 규칙 협의
            </p>
          </li>
          <li>
            <h4>프로젝트 준비</h4>
            <p>
              작업 수행 계획 수립
              <br />
              작업 환경 구축
              <br />
              작업 도구 선정 및 커스텀
              <br />
              작업 지침 및 가이드 작성
              <br />
              작업자 확보 및 선정
            </p>
          </li>
          <li>
            <h4>데이터 수집</h4>
            <p>
              직접 수집
              <br />
              고객사 API 연동
              <br />
              오픈 데이터 활용
              <br />
              웹,SNS 크롤링 및 스크래핑
            </p>
          </li>
        </ul>
        <div className="arrow-box">
          <img src={ssloArrow} alt="" className="arrow" />
        </div>
        <div className="img-box">
          <div className="bar2" />
        </div>
        <ul className="text-box2">
          <li>
            <h4>데이터 전처리</h4>
            <p>
              데이터 분류(카테고리 / 주제 / 형식 등)
              <br />
              데이터 변환(리사이징 / 파일형식 / 백그라운드제거 등)
              <br />
              데이터 축소(인코딩 / 숫자축소 / 주성분 분석 등)
              <br />
              데이터 통합(결합 / 병합)
              <br />
              데이터 정제(무효데이터 제거 / 중복제거 / 개인정보처리 등)
            </p>
          </li>
          <li>
            <h4>데이터 가공</h4>
            <p>
              영상 라벨링 <br />
              이미지 라벨링
              <br />
              텍스트 태깅 / 추출 / OCR 등
            </p>
          </li>
          <li>
            <h4>검수</h4>
            <p>
              전문가를 통한 검수
              <br />
              인력을 통한 교차 검수
              <br />
              도구를 통한 이중 검수
              <br />
              단계별 데이터 검수
              <br />
              부적합 데이터 재가공
            </p>
          </li>
          <li>
            <h4>테스트</h4>
            <p>
              테스트 모델 선정
              <br />
              테스트 모델 검증
              <br />
              모델 학습 테스트
              <br />
              테스트 모델 평가
            </p>
          </li>
          <li>
            <h4>완료</h4>
            <p>
              최종 결과 확인
              <br />
              산출물 납품
            </p>
          </li>
        </ul>
      </section>
      {/* <!-- 자동화 서비스 --> */}
      <section className="service3 container" id="service3">
        <ul style={{ margin: "50px 50px", textAlign: "left" }}>
          <li style={{ width: "100%", fontSize: 15 }}>
            <h4
              style={{
                display: "inline",
                padding: 40,
                color: "#252657",
                marginLeft: 20,
              }}
            >
              Auto Label
            </h4>
            자동화된 데이터 수집, 가공, 검증 프로세스로 빠르고 정확한 고품질의
            데이터셋 제공
          </li>
        </ul>
        <img src={ssloDataSet} alt="" />
        <ul className="text-box">
          <li>
            <h4>
              포털 사이트, SNS,
              <br />
              쇼핑몰, API
            </h4>
            <p>
              다양한 사이트로부터
              <br />
              요구사항에 맞는
              <br />
              실시간 및 누적 데이터 수집
            </p>
          </li>
          <li>
            <h4>
              데이터 모델링,
              <br />
              인터페이스 시각화
            </h4>
            <p>
              유형별 데이터 모델링 <br />
              자동화 및 분산 스토리지를 활용한
              <br />
              효율적인 데이터 관리
            </p>
          </li>
          <li>
            <h4>
              단어 추출, 필터링, 품사 태깅,
              <br />
              리사이징, 단어 원형 복원
            </h4>
            <p>
              분석 및 가공 결과의 <br />
              품질 증가를 위한 데이터 전처리
            </p>
          </li>
          <li>
            <h4>
              영상/이미지/텍스트 <br />
              라벨링
            </h4>
            <p>
              자동화를 통해 <br />
              구축기간 / 투입 인력 절감
            </p>
          </li>
          <li>
            <h4>
              빈도 분석, 토픽 분석,
              <br />
              클러스터링, 워드 임베딩
            </h4>
            <p>
              최신 언어 모델을 활용한
              <br />
              텍스트 분석
            </p>
          </li>
        </ul>
      </section>
      {/* <!-- 대시보드 --> */}
      <section className="service4 container" id="service4">
        <div className="img-box">
          <img style={{ height: 450 }} src={ssloDashboard} alt="" />
        </div>
        <div className="text-box">
          <h4>대시보드를 통한 시각화 서비스</h4>
          <p>
            작업현황 실시간 모니터링, 정확도 분석으로 효율적인 관리가
            가능합니다.
          </p>
          <ul className="info">
            <li>
              <span className="ball1" />
              <p>작업현황 데이터 시각화</p>
            </li>
            <li>
              <span className="ball2" />
              <p>작업현황 실시간 모니터링</p>
            </li>
            <li>
              <span className="ball3" />
              <p>학습 데이터 정확도 분석</p>
            </li>
          </ul>
        </div>
      </section>
      <section className="question">
        <p>궁금하신 사항은 문의하시면 상세히 답변드리겠습니다.</p>
        <a href="help/qna">문의하기</a>
      </section>
    </main>
  );
};

export default Service;
