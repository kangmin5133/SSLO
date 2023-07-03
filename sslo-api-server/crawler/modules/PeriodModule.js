function PeriodModule(crawling_keywords, potal, date) {
  const naverBaseUrl = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${crawling_keywords}`;
  const daumBaseUrl = `https://search.daum.net/search?w=img&nil_search=btn&DA=NTB&enc=utf8&q=${crawling_keywords}`;
  const googleBaseUrl = `https://www.google.com/search?q=${crawling_keywords}&source=lnms&tbm=isch`;
  
  //case 1 - 1일, case 2 - 1주일, case 3 - 1개월, case 4- 1년 
  if (potal == "naver") {
    switch (Number(date)) {
      case 1:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A1d`;
      case 2:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A1w`;
      case 3:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A1m`;
      case 4:
        return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3A1y`;
      // case 5:
      //   return `${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3Afrom20230101to20230104`;
      // 직접입력 ${naverBaseUrl}&res_fr=0&res_to=0&sm=tab_opt&color=&ccl=0&nso=so%3Ar%2Cp%3Afrom시작년원일to종료년월일
    }
  } else if (potal == "daum") {
    switch (Number(date)) {
      case 1:
        return `${daumBaseUrl}&period=d`;
      case 2:
        return `${daumBaseUrl}&period=w`;
      case 3:
        return `${daumBaseUrl}&period=m`;
      case 4:
        return `${daumBaseUrl}&period=y`;
      // case 5:
      //   return `${daumBaseUrl}&period=u&sd=20230101000000&ed=20230104235959&p=1`
      // 직접입력 ${daumBaseUrl}&period=u&sd=시작 년,월,일,시,분,초&ed=종료 년,월,일,시,분,초&p=1
    }
  } else if (potal == "google") {
    switch (Number(date)) {
      case 1:
        return `${googleBaseUrl}&tbs=qdr:d`;
      case 2:
        return `${googleBaseUrl}&tbs=qdr:w`;
      case 3:
        return `${googleBaseUrl}&tbs=qdr:m`;
      case 4:
        return `${googleBaseUrl}&tbs=qdr:y`;
    }
  }
}

module.exports = PeriodModule;
