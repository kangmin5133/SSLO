const cheerio = require("cheerio");

function cheerioModule(content, potal, crawlingData, errData, length) {
  const $ = cheerio.load(content); // 크롤링 진행을 위해 컨텐츠를 cheerio 인자로 넣어준다.

  switch (potal) {
    // 수집채널1-Naver 크롤링 css 선택자 지정
    case "naver":
      const naverLists = $(
        "._contentRoot > .photo_group._listGrid > .photo_tile._grid > div > div > .thumb > a "
      );
      naverLists.each((idx, list) => {
        const linkfilter =
          $(list).find("img").attr("data-lazy-src") === undefined
            ? $(list).find("img").attr("src")
            : $(list).find("img").attr("data-lazy-src");

        // 네이버 이미지의 src 가 data-lazy-src 를 참조하는 내용도 있어서 삼항연산자로 통일
        const src = linkfilter;
        crawlingData.push({ idx, src });
      });

      break;

    case "daum":
      // 수집채널2-Daum 크롤링 css 선택자 지정
      const daumLists = $(
        ".g_comp > #imgColl > .coll_cont > #imgList > .wrap_thumb > a"
      );

      daumLists.each((idx, list) => {
        const src = $(list).find("img").attr("src");
        crawlingData.push({ idx, src });
      });
      break;

    case "google":
      //수집채널3-Google 크롤링 css 선택자 지정
      const googleLists = $(
        "#islrg > .islrc > div > .wXeWr.islib.nfEiy > .bRMDJf.islir"
      );

      googleLists.each((idx, list) => {
        const src = $(list).find("img").attr("src");
        if (src&&src.includes("data:image/jpeg;base64") || src == undefined) {
          errData.push(idx);
        } else {
          crawlingData.push({ idx, src });
        }
      });
      break;
  }

  if (crawlingData.length >= length) {
    crawlingData.length = length;
  }
  //크롤링 데이터 length 조절
}

module.exports = cheerioModule;
