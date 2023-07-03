import { Buffer } from "buffer";

/** dataURL을 받아서 Blob으로 변환한 파일을 리턴한다. */
const dataUrlToBlob = (dataURL: string, fileName?: string) => {
  const blobBin = Buffer.from(dataURL.split(",")[1], "base64");
  const array = [];
  for (let i = 0; i < blobBin.length; i++) {
    array.push(blobBin[i]);
  }
  const file = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  const fileWithName = new File([file], fileName ? fileName : "Blob", {
    type: "image/jpeg",
  });
  return fileWithName;
};

/** Image와 Canvas를 받아서 Canvas에 해당 이미지를 이미지 크기에 맞춰서 그린 후 data url을 리턴한다. */
const getDataUrlByCanvasWithImg = (
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  const context = canvas.getContext("2d");
  if (img.width !== canvas.width) canvas.width = img.width;
  if (img.height !== canvas.height) canvas.height = img.height;
  if (!context) {
    throw new Error("canvas context invalid, check out please");
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img!, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
};

export interface IParamTransform {
  scaleX: number;
  scaleY: number;
  transX: number;
  transY: number;
}

export interface IParamResizingScale {
  scale: number;
}

/** Image에 filter를 적용한 후 canvas의 data URL을 리턴한다. */
const getDataUrlWithFilter = (
  image: HTMLImageElement,
  width: number,
  height: number,
  filter?: string,
  transform?: IParamTransform,
  resizing?: IParamResizingScale,
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  let dataURL = null;
  if (!context) {
    throw new Error("The context of the canvas is not allowcated");
  }
  if (image.width !== canvas.width) canvas.width = image.width;
  if (image.height !== canvas.height) canvas.height = image.height;

  if (width) { 
    canvas.width = width; 
  }
  if (height) { 
    canvas.height = height; 
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  if (filter) {
    context.filter = filter;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL("image/jpeg", 1.0);
    context.filter = "none";
  }
  if (transform) {
    canvas.width = width * transform.scaleX; 
    canvas.height = height * transform.scaleY; 
    context.transform(
      1,
      0,
      0,
      1,
      transform.transX,
      transform.transY
    );
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL("image/jpeg", 1.0);
  }
  if(resizing) {
    canvas.width = width * resizing.scale; 
    canvas.height = height * resizing.scale; 
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL("image/jpeg", 1.0);
  }
  return dataURL;
};

/** milliseconds -> YYYY.MM.DD 형식의 데이터로 전환 */
// ! toISOString을 사용하면 UTC 기준으로 표시가 되어서 GMT로 변경하기 위한 TimezoneOffset 사용
const getFormattedDate = (milliseconds: number): string => {
  const date = new Date(milliseconds);
  const offset = date.getTimezoneOffset() * 60000;
  const isoString = new Date(milliseconds - offset).toISOString();
  return isoString.split("T")[0].replaceAll("-", ".");
};

const getFormattedDateTime = (milliseconds: number): string => {
  const date = new Date(milliseconds);
  const offset = date.getTimezoneOffset() * 60000;
  const isoString = new Date(milliseconds - offset).toISOString();
  const formattedDate = isoString.split("T")[0].replaceAll("-", ".");
  const formattedTime = isoString.split("T")[1].split(".")[0];
  return formattedDate + " " + formattedTime;
};

const getWorkingDateTime = (milliseconds: number): string => {
  const currSec = 1000;
  const currMin = 60 * 1000;
  const currHour = 60 * 60 * 1000;
  const currDay = 24 * 60 * 60 * 1000;
  let workingDateTime = "0";
  if(milliseconds / currHour >= 24) {
    workingDateTime = Math.round(milliseconds / currDay) + " 일";
  } else if (milliseconds / currMin > 60) {
    workingDateTime = Math.round(milliseconds / currHour) + " 시간";
  } else if (milliseconds / currSec > 60) {
    workingDateTime = Math.round(milliseconds / currMin) + " 분";
  } else {
    workingDateTime = Math.round(milliseconds / currSec) + " 초";
  }
  return workingDateTime;
};

/** 오늘날짜를 milliseconds로 반환 */
const getTodayMillisecondsDate = (): number => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
};

/** 이번달 1일 milliseconds로 반환 */
const getFirstDayOfCurrentMonthMillisecondsDate = (): number => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
};

/** 몇 개월 전 후 오늘을 milliseconds로 반환
 * @param aMonth 전후 개월 수 (한달전이면 -1, 두달후면 2)
 */
const getTodayOfAMonthMillisecondsDate = (aMonth: number) => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + aMonth,
    now.getDate()
  ).getTime();
};

/** 이번달 며칠 전 후 오늘을 milliseconds로 반환
 * @param aDay 전후 일 수 (하루전이면 -1, 일주일전이면 -6, 하루후면 1)
 */
const getADayOfCurrentMonthMillisecondsDate = (aDay: number) => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + aDay
  ).getTime();
};

/** startAt, maxResults 값을 받은 page를 기반으로 리턴한다.
 * @param page 현재 페이지
 */
const setOffset = (
  page: number,
  count: number = 10
): { startAt: number; maxResults: number } => {
  const startAt = (page - 1) * count;
  const maxResults = count;
  return { startAt, maxResults };
};

/** 글자 수 20자 넘어가면 ... 으로 표현하기
 * @param str 줄일 string
 * @limit 제한 글자 수 (기본 20)
 */
const truncate = (str: string, limit = 20) => {
  return str.length > limit ? str.substring(0, limit - 3) + "..." : str;
};

export {
  dataUrlToBlob,
  getDataUrlByCanvasWithImg,
  getDataUrlWithFilter,
  getFormattedDate,
  getFormattedDateTime,
  getWorkingDateTime,
  getTodayMillisecondsDate,
  getFirstDayOfCurrentMonthMillisecondsDate,
  getTodayOfAMonthMillisecondsDate,
  getADayOfCurrentMonthMillisecondsDate,
  setOffset,
  truncate,
};
