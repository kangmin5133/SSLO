const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");

const PeriodModule = require("./modules/PeriodModule");
const imageModule = require("./modules/imageModule");
const cheerioModule = require("./modules/cheerioModule");

const app = express();
const port = 8821;

app.use(cors());

app.listen(port,'0.0.0.0', () => {
  console.log(`서버가 ${port}로 실행중입니다.`);
});

/* [api] */
app.get("/crawling", async (req, res) => {
  let reqList = req.query;

  try {
    if (req.query.crawling_keywords === "") {
      throw new Error("키워드 미입력❌");
    } else {
      await crawling(
        reqList.crawling_channel_type,
        reqList.crawling_keywords,
        reqList.crawling_period_type,
        reqList.crawling_limit
      );
      res.send(crawlingData);
    }
  } catch (err) {
    console.log("crawling_error❌", err);
    res.send("crawling_error");
  }

  crawlingData = [];
  errData = [];
  //api call 응답 이후 배열 초기화
});

let crawlingData = []; // 크롤링 데이터를 받은 Array
let errData = []; // 크롤링 실패 데이터를 받은 Array

/* [crawling() / puppeteer] */
const crawling = async (potal, crawling_keywords, date, length) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  // {puppeteer.launch} - puppeteer 실행
  // {headless: false} - 크롤링 과정을 GUI로 확인용 옵션(true로 변경하면 GUI off)

  const page = await browser.newPage(); // 신규 page 생성

  await page.setViewport({
    width: 1980,
    height: 720,
  }); // {page.setViewport} - GUI View 해상도 지정

  /* [Period() - 사이트별/기간별/키워드 filter Module] */
  await page.goto(PeriodModule(crawling_keywords, potal, date));

  switch (potal) {
    case "naver":
      await page.waitForSelector("._listImage");
      break;

    case "daum":
      await page.waitForSelector(".thumb_img");
      break;

    case "google":
      await page.waitForSelector(".rg_i.Q4LuWd");
      break;
  }
  // {page.waitForSelector} - 브라우저 img 태그 생성 대기

  async function autoScroll(page) {
    await page.evaluate(
      async (length, potal) => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(async () => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            switch (potal) {
              case "naver":
                // 1.naver는 더보기 버튼이 따로 존재하지 않음. 데이터 갯수가 다른 potal에 비해 적음
                const naverTag = document.querySelectorAll(
                  "#main_pack > section.sc_new.sp_nimage._prs_img._imageSearchPC > div > div.photo_group._listGrid > div.photo_tile._grid > div > div > div.thumb > a > img"
                );
                if (totalHeight >= scrollHeight || naverTag.length >= length) {
                  clearInterval(timer);
                  resolve();
                }
                break;

              case "daum":
                // 2.daum의 더보기 버튼(daumViewMore) 클릭 후 추가적인 scroll 진행.
                const daumTag = document.querySelectorAll(
                  "#imgList > div> a > img"
                );
                if (totalHeight >= scrollHeight || daumTag.length >= length) {
                  clearInterval(timer);
                  resolve();
                } else if (totalHeight >= scrollHeight - 500) {
                  const daumViewMore = document.querySelector(
                    "#imgColl > div.extend_comp.extend_imgtab > a.expender.open > span"
                  );
                  daumViewMore.click();
                  await page.waitFor(1000);
                }
                break;

              case "google":
                // 3. google의 더보기 버튼(googleViewMore) 클릭 후 추가적인 scroll 진행.
                const googleTag = document.querySelectorAll(
                  "#islrg > div.islrc > div > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img"
                );
                if (totalHeight >= scrollHeight || googleTag.length >= length) {
                  clearInterval(timer);
                  resolve();
                } else if (totalHeight >= scrollHeight - 500) {
                  const googleViewMore = document.querySelector(
                    "#islmp > div > div > div > div > div.gBPM8 > div.qvfT1 > div.YstHxe > input"
                  );
                  googleViewMore.click();
                  await page.waitFor(1000);
                }
                break;
            }
          }, 250); // 인수부분에 스크롤 내리는 속도를 조절함(100 빠르지만 데이터를 전부 수집 못하는 에러로 length 100정도까지만/ 200~250 권장 / 300 느림)
        });
      },
      length,
      potal
    );
  }

  await autoScroll(page); // autoScroll start(포털 사이트들이 SPA 환경으로 구성되어 스크롤이 진행이 없으면 img 태그가 생성 X)

  const content = await page.content(); // 스크롤 진행한 페이지를 컨텐츠로 생성한다.

  /* [cheerioModule] */
  cheerioModule(content, potal, crawlingData, errData, length);

  /* [imgDownload] */
  imageModule(crawlingData, crawling_keywords, potal, length, errData);

  await browser.close(); // 브라우저 종료
};
