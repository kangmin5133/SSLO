const imageDownloader = require("node-image-downloader");
const fs = require("fs");

function imageModule(crawlingData, crawling_keywords, potal, length, errData) {
  let imgList = [];
  const date = new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const dateStr = year + "_" + month + "_" + day;

  crawlingData.map((x) => {
    let y = {};
    y["uri"] = x["src"];
    y.filename = crawling_keywords + `_${potal}_FILE_` + x.idx;
    imgList.push(y);
  }); //imageDownloader 양식에 맞춘 객체데이터 가공 {url : val, filename : vlaue}
  //if (
  //  !fs.existsSync(`./imgDirectory/${potal}_${crawling_keywords}_${dateStr}`)
  //) {
  //  fs.mkdirSync(`./imgDirectory/${potal}_${crawling_keywords}_${dateStr}`);
  //}

  //imageDownloader({
  //  imgs: imgList,
  //  dest: `./imgDirectory/${potal}_${crawling_keywords}_${dateStr}`, //destination folder
  //})
  //  .then((info) => {
  //    console.log(
  //      `[${potal}] ` +
  //        `success✅: ${info.length} ` +
  //        `/ failed❌: ${length - info.length}` +
  //        `/ missing-data(Type : gif, base64)🚫 : ${errData.length}`
  //    );
  //    console.log(
  //      "*** failed : potal data not found / missing : type,network Error"
  //    );
  //  })

  // .catch((error, response, body) => {
  //    console.log(
  //      "*** 일부 데이터는 성공하였으나, imageDownloader 에러로 인해 일부 자료 유실/ potal 내 데이터 부족"
  //    );
  //    console.log(`Log : ${error}`);
  //  });
}

module.exports = imageModule;
