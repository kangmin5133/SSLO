import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import ProjectCreatePresenter from "./ProjectCreatePresenter";
import { SubmitHandler, useForm } from "react-hook-form";
import projectApi, {
  IAnnotationAttribute,
  ICreatePcrawlPayload,
  IProjectAnnotation,
} from "../../../../api/projectApi";
import datasetApi, { IDataset } from "../../../../api/datasetApi";
import { toast } from "react-toastify";
import {
  ClassAttrType,
  IClass,
  IClassAttr,
} from "../../../../components/main/ClassGenerator";
import randomColor from "randomcolor";
import { dataUrlToBlob, setOffset } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../hooks";
import { ColorResult } from "react-color";
//let cv = require("opencv.js");
import cv from "@techstark/opencv-js"
import taskApi from "../../../../api/taskApi";

export enum FormPType {
  collect = "데이터 수집/정제",
  preprocessing = "데이터 전처리",
  manufacturing = "데이터 가공",
}

export enum FormPCrawlChannelType {
  naver = "naver",
  daum = "daum",
  google = "google",
  instagram = "instagram",
}

export enum FormPCollectDurationType {
  week = "1주일",
  month3 = "3개월",
  year = "1년",
  custom = "직접설정",
}

export enum FormPCollectAmountType {
  h1 = "100",
  h5 = "500",
  th1 = "1000",
  th2 = "2000",
  th3 = "3000",
  custom = "직접입력",
}

export enum CollectDataType {
  dataset = "인간 데이터셋 제공",
  crawling = "웹 크롤링 데이터",
  upload = "데이터 업로드",
}

export interface IFormInput {
  pName: string;
  pDescription: string;
  pType: FormPType;
  pCrawlChannel?: FormPCrawlChannelType;
  pCrawlKeyword?: string;
  pCrawlCustomAmount?: FormPCollectAmountType;
}

const ProjectCreateContainer = () => {
  const user = useAppSelector((state) => state.userReducer);
  // ! datasets state
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  // ! selected datasets state
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [totalDatasets, setTotalDatasets] = useState<number>(0);
  // ! 프로젝트 유형 select tag의 selected value state
  const [selectedPType, setSelectedPType] = useState<FormPType>(
    FormPType.collect
  );
  // ! 데이터 수집 > 데이터 유형 state
  const [collectDataType, setCollectDataType] = useState<CollectDataType>(
    CollectDataType.dataset
  );
  // ! 데이터 수집 > 인간 데이터셋 제공 > pagination의 현재 page state
  const [currentPage, setCurrentPage] = useState<number>(1);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집채널 state
  const [currentCollectChannel, setCurrentCollectChannel] = useState<
    FormPCrawlChannelType
  >(FormPCrawlChannelType.naver);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집채널 state change
  const handleSetChannel = (channel: FormPCrawlChannelType) => {
    setCurrentCollectChannel(channel);
  };
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집기간 state
  const [currentCollectDuration, setCurrentCollectDuration] = useState<
    FormPCollectDurationType
  >(FormPCollectDurationType.week);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집기간 state change
  const handleSetDuration = (duration: FormPCollectDurationType) => {
    setCurrentCollectDuration(duration);
  };
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집건수 state
  const [currentCollectAmount, setCurrentCollectAmount] = useState<
    FormPCollectAmountType
  >(FormPCollectAmountType.h1);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집건수 state change
  const handleSetAmount = (amount: FormPCollectAmountType) => {
    setCurrentCollectAmount(amount);
  };

  useEffect(() => {
    if(collectDataType === CollectDataType.upload) {
    }
  }, [collectDataType]);

  const fileDrag = useRef<HTMLInputElement | null>(null);
  /* 박스 안으로 Drag가 들어올 때 */
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('dragenter');
  };

  /* 박스 안에 Drag를 하고 있을 때 */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('dragover');
    if (fileDrag && fileDrag.current) {
      fileDrag.current.style.backgroundColor = '#AECCF4';
      fileDrag.current.style.border = "3px solid #3580E3";
    }
  };

  /* 박스 밖으로 Drag가 나갈 때 */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (fileDrag && fileDrag.current) {
      fileDrag.current.style.backgroundColor = 'transparent';
      fileDrag.current.style.border = "1px dotted #AECCF4";
    }
    console.log('dragleave');
  };

  /* 박스 안에서 Drag를 Drop했을 때 */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileDrag && fileDrag.current) {
      if(isUploading.current) {
        toast.error("업로드 중입니다. 완료 후 다시 시도해주세요.");
      } else {
        if(!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
          toast.error("파일이 존재하지 않습니다. 확인 후 다시 시도해주세요.");
        } else {
          checkFileUpload(e.dataTransfer.files);
        }
      }
      console.log('drop');
      fileDrag.current.style.backgroundColor = 'transparent';
      fileDrag.current.style.border = "1px dotted #AECCF4";
    }
  };

  const [framedImageDatas, setFramedImageDatas] = useState<File[]>([]);
  const [fUploadLoading, setFUploadLoading] = useState<boolean>(false);
  const isUploading = useRef(fUploadLoading);
  useEffect(() => {
    isUploading.current = fUploadLoading;
    console.log(fUploadLoading);
  }, [fUploadLoading]);
  // ! 데이터 업로드 버튼 클릭 시 input ref
  const fileInput = useRef<HTMLInputElement | null>(null);
  // ! input ref가 호출될 때 실행하는 메소드
  const selectFile = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };
  const videoType = ["ogm", "wmv", "mpg", "webm", "ogv", "mov", "asx", "mpeg", "mp4", "m4v", "avi"];
  const imgFileType = ["jpg", "jpe", "jpeg", "jfif", "JPG", "JPE", "JPEG", "JFIF"];
  // ! 데이터 업로드 버튼 클릭 후 파일 선택 시 호출되는 메소드
  const handleChangeFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if(!e.target.files || e.target.files.length === 0) {
      toast.error("파일이 존재하지 않습니다. 확인 후 다시 시도해주세요.");
      return;
    }
    checkFileUpload(e.target.files);
  };

  const checkFileUpload = (files: FileList) => {
    if (files && files.length > 0) {
      const maxSize = 100 * 1024 * 1024;
      setFUploadLoading(true);
      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        const fileType = videoType.includes(files[i].name.split(".")[1].toLowerCase()) ? "video"
          : imgFileType.includes(files[i].name.split(".")[1].toLowerCase()) ? "image" : "";
        if (fileType === ""){
          toast.error("지원하지 않는 파일입니다. 동영상 파일 또는 jpeg 형식의 이미지 파일만 업로드 가능합니다.");
          fileInput.current.value = "";
          setFUploadLoading(false);
          return;
        }
        // 1080 * 1080 , 100 * 1024 * 1024
        if (files[i].size > maxSize) {
          toast.error("100MB 이하의 파일만 업로드 가능합니다.");
          setFUploadLoading(false);
          return;
        }
        if (fileType === "video"){
          onReady(files[i]);
        } else {
          const imgEl = document.createElement("img");
          imgEl.src = window.URL.createObjectURL(files[i]);
          imgEl.onload = function() {
            if(imgEl.naturalWidth > 1080 || imgEl.naturalHeight > 1080) {
              toast.error("가로 1080 세로 1080 이하의 파일만 업로드 가능합니다.");
            } else {
              setFramedImageDatas(framedImageDatas => [...framedImageDatas, files[i]]);
              toast.success("업로드가 완료되었습니다.");
            }
          };
          setFUploadLoading(false);
        }
      }
    }
  };

  let streaming = false;
  let rate = 10;

  const onReady = (file: any) => {
      console.log('ready');
      const name = file.name.split(".")[0];
      const url = window.URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.src = url;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      let frame;
      let cap;
      const datas: File[] = [];
      let count = 0;

      const loaded = () => {
        let vW = videoEl.videoWidth, vH = videoEl.videoHeight, vR = 1;
        if (vW > vH && vW > 1080) {
          vR = 1080 / vW;
          vW = 1080;
          vH = vH * vR;
        } else if (vH > vW && vH > 1080) {
          vR = 1080 / vH;
          vW = vW * vR;
          vH = 1080;
        }
        videoEl.height = vH;    //videoEl.videoHeight;
        videoEl.width = vW;     //videoEl.videoWidth;
        cap = new cv.VideoCapture(videoEl);
        if(videoEl.duration <= 5) {
          rate = 1;
        } else {
          rate = videoEl.duration / 5;
        }
        videoEl.playbackRate = rate;
        frame = new cv.Mat(videoEl.height, videoEl.width, cv.CV_8UC4);
        setTimeout(processVideo, 100);
      }

      const start = () => {
        streaming = true;
      }

      const stop = () => {
        streaming = false;
        setFramedImageDatas(framedImageDatas => [...framedImageDatas, ...datas]);
        setFUploadLoading(false);
        toast.success("업로드가 완료되었습니다.");
      }

      const processVideo = () => {
        if (!streaming) {
          frame.delete();
          return;
        }
        if (count > 0) {
          cap.read(frame)
          cv.imshow(canvas, frame);
          datas.push(
            dataUrlToBlob(canvas.toDataURL('image/jpeg'), name + "_" + count + ".jpeg")
          );
        }
        count++;
        const delay = 1000 / rate;
        setTimeout(processVideo, delay);
      }

      videoEl.addEventListener('loadedmetadata', loaded);
      videoEl.addEventListener('play', start);
      videoEl.addEventListener('ended', stop);

      videoEl.defaultMuted = true;
      videoEl.muted = true;
      videoEl.play();

      document.onkeydown = function(e) {
        if(e.key === "Escape") {
          videoEl.pause();
        }
      };
  };

  useEffect(() => {
    console.log(framedImageDatas);
  }, [framedImageDatas]);

  const [uploadSrc, setUploadSrc] = useState<any>();

  const handleSelectData = (e: any, data: File, index: number) => {
    setUploadSrc(window.URL.createObjectURL(data));
    framedImageDatas.map((el, id) => {
      if(id === index) {
        document.getElementById("data_"+id).style.background = "#AECCF4";
      } else {
        document.getElementById("data_"+id).style.background = "transparent";
      }
    });
  };

  const handleRemoveData = (e: any, data: File) => {
    if(framedImageDatas.length > 0) {
      setFramedImageDatas(framedImageDatas.filter(element => element !== data));
      setUploadSrc(null);
      framedImageDatas.map((el, id) => {
        document.getElementById("data_"+id).style.background = "transparent";
      });
    }
  };

  //*********** collect duration custom date *************/
  // ! 날짜 선택 시 시작날짜 - 종료날짜
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  // ! is calendar open ?
  const [calendar, setCalendar] = useState<boolean>(false);
  // ! show calendar
  const showCalendar = () => {
    setCalendar(true);
  };
  // ! calendar에서 날짜 선택을 다 하고 나면 해당 값을 state에 저장후 calendar를 닫는다.
  const handleChangeCalendar = (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDateRange(value);
    setCalendar(false);
  };
  // ! calendar component 외 부분을 클릭 시 calendar를 닫는다.
  const handlePopupDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target as HTMLElement;
    if (
      element.hasAttribute("aria-label") ||
      element.classList.contains("react-calendar__tile")
    ) {
      return;
    }
    if (calendar) {
      setCalendar(false);
    }
  };
  // ! 날짜 인풋 값에 인풋값을 cleaned하여 입력시킨다.
  const dateToString = (): string => {
    if (!dateRange) return "날짜 선택";
    let startDate;
    let endDate;
    for (let i = 0; i < dateRange.length; i++) {
      if (i === 0) startDate = dateRange[i].toLocaleDateString("en-US");
      if (i === 1) endDate = dateRange[i].toLocaleDateString("en-US");
    }
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    return "날짜 선택";
  };

  // ! 인간 데이터셋 제공 유형에서 특정 페이지넘버 클릭 시 호출되는 메소드
  const onChangePage = async (page: number) => {
    const res = await datasetApi.getDatasets(
      {
        ...setOffset(page),
      },
      user.accessToken!
    );
    if (res && res.status === 200 && res.data) {
      console.log(res.data);
      cleanDatasets(res.data);
    }
    setCurrentPage(page);
  };
  // ! useForm
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>();

  // ! 데이터 가공 유형에서 클래스 입력할 때 Enter를 사용하는데, Enter 클릭 시 form의 기본 특성상 submit이 일어나기 때문에 프로젝트 생성에 대한 submit을 prevent
  const preventEnter: React.KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };
  // ! useForm onSubmit
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    let createPcrawlPayload: ICreatePcrawlPayload;
    const userId = user.id!;
    const selectedPName = data.pName;
    if (selectedPName.length > 50) {
      toast.error("프로젝트명은 50자리 이하입니다.");
      return;
    }
    const selectedPDescription = data.pDescription;
    if (selectedPName.length > 100) {
      toast.error("프로젝트 설명은 100자리 이하입니다.");
      return;
    }
    let selectedCurrentPType: number;
    if (data.pType === FormPType.collect) selectedCurrentPType = 1;
    if (data.pType === FormPType.preprocessing) selectedCurrentPType = 2;
    if (data.pType === FormPType.manufacturing) selectedCurrentPType = 3;
    let selectedDataType;
    console.log(selectedCurrentPType);
    if (!selectedCurrentPType) return;

    if (selectedCurrentPType === 1 && collectDataType === CollectDataType.dataset && selectedDatasets.length === 0) {
      toast.error("데이터셋을 1개 이상 선택해주세요.");
      return;
    }

    switch (selectedCurrentPType) {
      case 1:
        // ! 데이터 유형이 인간 데이터셋 제공 / 웹 크롤링 데이터 두 가지로 분류되는데 각 타입별 받아야하는 데이터가 다르므로 구분
        switch (collectDataType) {
          case CollectDataType.dataset:
            selectedDataType = 1;
            createPcrawlPayload = {
              project_name: selectedPName,
              project_desc: selectedPDescription,
              project_manager: {
                user_id: userId,
              },
              project_type: {
                project_type_id: selectedCurrentPType,
              },
              project_detail: {
                data_type: selectedDataType,
                ...(selectedDataType === 1 && {
                  dataset_ids: selectedDatasets,
                }),
              },
            };
            console.log(createPcrawlPayload);
            doCreateProject(createPcrawlPayload);
            break;
          case CollectDataType.crawling:
            selectedDataType = 2;
            const selectedChannel = currentCollectChannel;
            if (data.pCrawlKeyword === undefined) {
              // TODO: error handling
              toast.error("키워드를 입력해주세요.");
              return;
            }
            const selectedKeyword = [data.pCrawlKeyword];
            let selectedAmount;
            let crawlPeriod;
            let crawlStartDate;
            let crawlEndDate;
            // ! 직접설정인 경우 날짜 데이터 받기 / 아닌 경우 선택된 라디오 버튼에서 range
            switch (currentCollectDuration) {
              case FormPCollectDurationType.week:
                crawlPeriod = 2;
                break;
              case FormPCollectDurationType.month3:
                crawlPeriod = 3;
                break;
              case FormPCollectDurationType.year:
                crawlPeriod = 4;
                break;
              case FormPCollectDurationType.custom:
                if (!dateRange) {
                  // TODO: error handling
                  return;
                }
                crawlPeriod = 1;
                for (let i = 0; i < dateRange.length; i++) {
                  if (i === 0) crawlStartDate = dateRange[i].getTime();
                  if (i === 1) crawlEndDate = dateRange[i].getTime();
                }
                break;
            }

            switch (currentCollectAmount) {
              case FormPCollectAmountType.custom:
                if (data.pCrawlCustomAmount === undefined) {
                  // TODO: error handling
                  return;
                }
                selectedAmount = parseInt(data.pCrawlCustomAmount);
                break;
              default:
                selectedAmount = parseInt(currentCollectAmount);
                break;
            }
            createPcrawlPayload = {
              project_name: selectedPName,
              project_desc: selectedPDescription,
              project_manager: {
                user_id: userId,
              },
              project_type: {
                project_type_id: selectedCurrentPType,
              },
              project_detail: {
                data_type: selectedDataType,
                ...(selectedDataType === 2 && {
                  crawling_channel_type: selectedChannel,
                }),
                ...(selectedDataType === 2 && {
                  crawling_keywords: selectedKeyword,
                }),
                crawling_period_type: crawlPeriod,
                crawling_limit: selectedAmount,
                ...(crawlPeriod === 1 && {
                  crawling_period_start: crawlStartDate,
                  crawling_period_end: crawlEndDate,
                }),
              },
            };
            doCreateProject(createPcrawlPayload);
            break;
          case CollectDataType.upload:
            if(framedImageDatas.length === 0) {
              toast.info("업로드된 데이터가 존재하지 않아 데이터 없이 프로젝트가 생성됩니다.");
            }
            selectedDataType = 3;
            createPcrawlPayload = {
              project_name: selectedPName,
              project_desc: selectedPDescription,
              project_manager: {
                user_id: userId,
              },
              project_type: {
                project_type_id: selectedCurrentPType,
              },
              project_detail: {
                data_type: selectedDataType,
              },
            };
            console.log(createPcrawlPayload);
            doCreateProject(createPcrawlPayload);
            
            break;
        }
        break;
      case 2:
        createPcrawlPayload = {
          project_name: selectedPName,
          project_desc: selectedPDescription,
          project_manager: {
            user_id: userId,
          },
          project_type: {
            project_type_id: selectedCurrentPType,
          },
        };
        doCreateProject(createPcrawlPayload);
        break;
      case 3:
        let pc: IProjectAnnotation[] = [];
        console.log(classesValue);
        for (let i = 0; i < classesValue.length; i++) {
          let pa: IProjectAnnotation;
          pa = {
            annotation_category_name: classesValue[i].className,
            annotation_category_color: classesValue[i].classColor,
          };
          let aca: IAnnotationAttribute[] = [];
          if (
            classesValue[i].classAttr &&
            classesValue[i].classAttr!.length > 0
          ) {
            let attrs = classesValue[i].classAttr!;
            console.log(attrs);
            for (let k = 0; k < attrs.length; k++) {
              const annotation_category_attr_name = attrs[k].attrName;
              const annotation_category_attr_type =
                attrs[k].attrType === ClassAttrType.mono
                  ? 1
                  : attrs[k].attrType === ClassAttrType.multi
                  ? 2
                  : attrs[k].attrType === ClassAttrType.customNumber
                  ? 3
                  : 4;
              let attrVals;
              let attrLimitMin;
              let attrLimitMax;
              if (attrs[k].attrValue) {
                attrVals = attrs[k].attrValue;
              }
              if (attrs[k].attrMin) {
                attrLimitMin = attrs[k].attrMin;
              }
              if (attrs[k].attrMax) {
                attrLimitMax = attrs[k].attrMax;
              }
              console.log(attrLimitMin + ", " + attrLimitMax);
              let ab = {
                annotation_category_attr_name,
                annotation_category_attr_type,
                annotation_category_attr_val: attrVals ? attrVals : undefined,
                annotation_category_attr_limit_min: attrLimitMin
                  ? attrLimitMin
                  : undefined,
                annotation_category_attr_limit_max: attrLimitMax
                  ? attrLimitMax
                  : undefined,
              };
              aca.push(ab);
            }
            pa.annotation_category_attributes = aca;
          }
          pc.push(pa);
        }
        createPcrawlPayload = {
          project_name: selectedPName,
          project_desc: selectedPDescription,
          project_manager: {
            user_id: userId,
          },
          project_type: {
            project_type_id: selectedCurrentPType,
          },
          project_detail: {
            project_categories: pc,
          },
        };
        doCreateProject(createPcrawlPayload);
        break;
    }
  };
  // ! handle select value changed
  const handleChangePType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "데이터 수집/정제") {
      setValue("pType", FormPType.collect);
    }
    if (value === "데이터 가공") {
      setValue("pType", FormPType.manufacturing);
    }
    if (value === "데이터 전처리") {
      setValue("pType", FormPType.preprocessing);
    }
    setSelectedPType(getValues("pType"));
  };
  // ! 프로젝트 유형의 데이터 수집 > 데이터 유형의 인간 데이터셋 제공으로 state change
  const handleCollectDataSet = () => {
    setCollectDataType(CollectDataType.dataset);
  };
  // ! 프로젝트 유형의 데이터 수집 > 데이터 유형의 웹 크롤링 데이터로 state change
  const handleCollectCrawling = () => {
    setCollectDataType(CollectDataType.crawling);
  };
  const handleCollectMedia = () => {
    setCollectDataType(CollectDataType.upload);
  };
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  // ! request api (create project)
  const doCreateProject = async (payload: ICreatePcrawlPayload) => {
    setCreateLoading(true);
    console.log(payload);
    const res = await projectApi.createProject(payload, user.accessToken!);
    if (res && res.status === 200 && res.data) {
      console.log(res.data);
      if(res.data.project_type.project_type_id === 1 && res.data.project_detail.data_type === 3 && framedImageDatas.length > 0) {
        await doCreateTasks(res.data.project_id);
      } else {
        setCreateLoading(false);
        navigate("/main/projects");
        toast.success("프로젝트 생성 완료");
      }
    } else {
      console.log("error");
      setCreateLoading(false);
    }
  };

  const isKorean = (text: string) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };

  const generateRandomString = (num: number) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };

  const doCreateTasks = async (pId: number) => {
    let formdata = new FormData();
    framedImageDatas.forEach((data) => {
      const blobFile = data.slice(0, data.size, 'image/jpeg');
      const pName = "collect";
      let fileName = data.name;
      if(isKorean(fileName)){
        fileName = generateRandomString(fileName.length);
      }
      const file = new File([blobFile], pName + "-" + pId + "-" + fileName, {type: 'image/jpeg'});
      formdata.append("image", file);
    });
    const res = await taskApi.createTask( 
      {
        project_id: pId,
      }, formdata, 
      user.accessToken!
    );
    if (res && res.status === 200 && res.data) {
      setCreateLoading(false);
      navigate("/main/projects");
      toast.success("프로젝트 생성 완료");
    } else {
      console.log("error");
      setCreateLoading(false);
    }
  };


  // ! 받은 dataset을 정제 후 state에 저장
  const cleanDatasets = (data: any) => {
    let cleanedDatasets: IDataset[] = [];
    data.datas.forEach((s: any) => {
      const datasetId = s.dataset_id;
      const datasetName = s.dataset_name;
      const datasetItemsCount = s.dataset_items_count;
      const datasetItemsSize = s.dataset_items_size;
      const datasetCategory = s.dataset_category;
      const datasetSubCategory = s.dataset_sub_category;

      const sForm = {
        datasetId,
        datasetName,
        datasetItemsCount,
        datasetItemsSize,
        datasetCategory,
        datasetSubCategory,
      };
      cleanedDatasets.push(sForm);
    });
    setDatasets(cleanedDatasets);
    setTotalDatasets(data.pageinfo.totalResults);
  };
  // ! request search dataset api
  const searchDatasets = async () => {
    const res = await datasetApi.getDatasets(
      {
        ...setOffset(currentPage),
      },
      user.accessToken!
    );
    if (res && res.status === 200 && res.data) {
      cleanDatasets(res.data);
    }
  };
  // ! add datasets to selected datasets
  const selectDataset = (datasetId: number) => {
    setSelectedDatasets((prev) => [...prev, datasetId]);
  };
  // ! remove datasets on selected datasets
  const removeDataset = (datasetId: number) => {
    const removedDatasets = selectedDatasets.filter((s) => s !== datasetId);
    setSelectedDatasets(removedDatasets);
  };
  // ! remove all dataset state
  const removeAllDataset = () => {
    setSelectedDatasets([]);
  };
  // ! select all dataset state
  const selectAllDataset = () => {
    let all: number[] = [];
    datasets.forEach((d) => {
      all.push(d.datasetId);
    });
    setSelectedDatasets(all);
  };
  // ! check dataset is all selected
  const isSelectedAllDatasets = (): boolean => {
    return datasets.length === selectedDatasets.length;
  };
  // ! check dataset is selected
  const isSelectedDataset = (datasetId: number): boolean => {
    let isSelected = false;
    for (let i = 0; i < selectedDatasets.length; i++) {
      if (selectedDatasets[i] === datasetId) {
        isSelected = true;
        break;
      }
    }
    return isSelected;
  };
  // ! 화면 rendering 시, 데이터셋 search api request
  useEffect(() => {
    searchDatasets();
    // eslint-disable-next-line
  }, []);
  //**************** ClassGenerator part ****************/
  // ! 컬러피커 팝업창
  const [state, setState] = useState<boolean>(false);
  // ! 색상 hex 값 state
  const [selectColor, setSelectColor] = useState<string>("#F379B4");
  // ! 저장된 클래스 state
  const [classesValue, setClassesValue] = useState<IClass[]>([
    { classColor: "#F379B4", className: "인간" },
  ]);
  // ! 클래스의 우측 ">" 버튼 클릭할 때 선택되는 클래스 state
  const [currentSelectedClass, setCurrentSelectedClass] = useState<string>();
  // ! 클래스의 속성을 클릭할 때 해당 속성 state
  const [currentSelectedAttr, setCurrentSelectedAttr] = useState<string>();
  // ! class attr, class attr value 창 노출 여부
  const [showAttrDiv, setShowAttrDiv] = useState<boolean>(false);
  // ! 클래스 별 속성 값 작성 시 속성명에 대한 state
  const [attrName, setAttrName] = useState<string>("");
  // ! 클래스 별 속성 값 작성 시 속성값에 대한 array state
  const [tempAttrInfo, setTempAttrInfo] = useState<string[]>([]);
  // ! 최소 선택 수 (다중 선택형,입력형)
  const [minValue, setMinValue] = useState<number>(0);
  // ! 최대 선택 수 (다중 선택형,입력형)
  const [maxValue, setMaxValue] = useState<number>(0);
  // ! 속성유형 선택 select box의 선택된 값 state
  const [selectedAttrType, setSelectedAttrType] = useState<ClassAttrType>(
    ClassAttrType.mono
  );

  // ! 컬러피커 팝업창 open
  const handleOpen = (className: any) => {
    //컬러피커창이 open될 때 네임정보도 같이 들어가도록!
    setState((prev) => !prev); //default값인 false가 true로 되는것
    setCurrentSelectedClass(className);
  };

  // ! 색상 hexa state에 저장
  const handleColorChange = (selectColor: ColorResult) => {
    setSelectColor(selectColor.hex); // 색상 변경 값의 hex 적용
    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === currentSelectedClass) {
        classesValue[i].classColor = selectColor.hex;
      }
    }
  };

  // ! 클래스의 우측 ">" 버튼 클릭할 때 해당 클래스를 state에 저장하고, attr창 노출
  const handleSetAttr = (className: string) => {
    setCurrentSelectedClass(className);
    setCurrentSelectedAttr(undefined);
    setAttrName("");
    setShowAttrDiv(true);
  };
  // ! 클래스의 속성을 선택할 때 해당 속성을 state에 저장
  const handleSetAttrOfClass = (attr: IClassAttr) => {
    setCurrentSelectedAttr(attr.attrName);
    setAttrName(attr.attrName);
    setSelectedAttrType(attr.attrType);
    setMinValue(attr.attrMin ? attr.attrMin : 0);
    setMaxValue(attr.attrMax ? attr.attrMax : 0);
  };

  // ! 클래스 별 속성 삭제버튼 호출
  const handleAttrDelete = (attrName: string) => {
    const attrs = getCurrentSelectedClassAttr();
    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].attrName === attrName) {
        attrs.splice(i, 1);
        //splice():배열로부터 특정범위를 삭제하거나 새로운 값을 추가 또는 기존값을 대체함, 두번째 인자는 몇개의 값을 삭제할것인지
        break;
      }
    }
  };

  // ! 클래스의 속성과 클래스가 선택됐을 때 해당 속성의 values를 반환
  const getCurrentSelectedAttrValues = (): null | IClassAttr => {
    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === currentSelectedClass) {
        const attrs = classesValue[i].classAttr!;
        if (!attrs) return null;
        for (let k = 0; k < attrs.length; k++) {
          if (attrs[k].attrName === currentSelectedAttr) {
            let classAttrs: IClassAttr = {
              attrName: attrs[k].attrName,
              attrType: attrs[k].attrType,
              attrValue: attrs[k].attrValue,
              attrMin: attrs[k].attrMin,
              attrMax: attrs[k].attrMax,
            };
            return classAttrs;
          }
        }
      }
      //return null;
    }
    return null;
  };
  // ! 클래스를 선택했을경우, 해당 클래스의 속성이 있으면 그 리스트를 반환
  const getCurrentSelectedClassAttr = (): undefined | IClassAttr[] => {
    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === currentSelectedClass) {
        if (
          !classesValue[i].classAttr ||
          classesValue[i].classAttr === undefined
        ) {
          console.log(classesValue[i].classAttr);
          return undefined;
        }
        console.log(classesValue[i].classAttr);
        return classesValue[i].classAttr;
      }
    }
    return undefined;
  };

  // ! 클래스 좌측 X 버튼 클릭 시 호출
  const handleDeleteClass = (className: string) => {
    const deletedClasses = classesValue.filter(
      //filter():뒤 조건의 true인 결과들 출력
      (c) => c.className !== className //내가 선택한 className과 같지않으면 true
    );
    setClassesValue(deletedClasses); //내가 선택한 className만 빼고 출력(삭제처럼 되는것)
  };
  // ! 속성유형 선택 select box의 값 change
  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log(value);
    if (value === ClassAttrType.mono) {
      setSelectedAttrType(ClassAttrType.mono);
    }
    if (value === ClassAttrType.multi) {
      setSelectedAttrType(ClassAttrType.multi);
    }
    if (value === ClassAttrType.customNumber) {
      setSelectedAttrType(ClassAttrType.customNumber);
    }
    if (value === ClassAttrType.customString) {
      setSelectedAttrType(ClassAttrType.customString);
    }
  };
  // ! 클래스명 입력 후 Enter키 입력 시 해당 클래스명으로 클래스 저장
  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    if (
      event.currentTarget.value === "" ||
      event.currentTarget.value === undefined
    ) {
      toast.error("클래스명은 필수 입력값입니다.");
      return;
    }
    if (event.currentTarget.value.length > 10) {
      toast.error("클래스명은 10자리 이하입니다.");
      return;
    }
    if (classesValue.length > 100) {
      {
        toast.error("클래스는 최대 100개까지 생성가능합니다.");
        return;
      }
    }
    let color = randomColor();
    const className = event.currentTarget.value;
    const classColor = color;
    const newClass = {
      className,
      classColor,
    };

    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === className) {
        event.currentTarget.value = "";
        toast.error("클래스명이 중복되었습니다.");
        return;
      }
    }
    setClassesValue((prev) => [...prev, newClass]);
    event.currentTarget.value = "";
  };
  // ! 클래스 별 속성 값 작성 시 속성명을 입력할 때 onChange event
  const handleChangeAttrName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!getCurrentSelectedClassAttr()) {
      console.log(e.target.value);
      setAttrName(e.target.value);
    } else if (
      getCurrentSelectedClassAttr() &&
      getCurrentSelectedClassAttr().length < 100
    ) {
      setAttrName(e.target.value);
    } else {
      toast.error("속성은 100개까지만 가능합니다.");
      return;
    }
  };
  // ! 다중선택형에서 최소 선택 수 state change
  const handleChangeMinValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 1) return;
    setMinValue(parseInt(e.target.value));
  };
  // ! 다중선택형에서 최대 선택 수 state change
  const handleChangeMaxValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 1) return;
    if (tempAttrInfo.length < parseInt(e.target.value)) {
      toast.error("최대선택은 속성값 개수만큼 가능합니다.");
      return;
    }
    setMaxValue(parseInt(e.target.value));
  };
  // ! 입력형숫자에서 최소 숫자입력 값 state change
  const handleChangeCustomMinNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) return;
    setMinValue(parseInt(e.target.value));
  };
  // ! 입력형숫자에서 최대 숫자입력 값 state change
  const handleChangeCustomMaxNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 1) return;
    setMaxValue(parseInt(e.target.value));
  };
  // ! 입력형문자에서 최소 숫자입력 값 state change
  const handleChangeCustomMinString = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 0) return;
    setMinValue(parseInt(e.target.value));
  };
  // ! 입력형문자에서 최대 숫자입력 값 state change
  const handleChangeCustomMaxString = (e: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) < 1) return;
    setMaxValue(parseInt(e.target.value));
  };
  // ! 클래스 별 속성 값 작성 시 속성값 입력 후 Enter key 입력 시 해당 속성값 저장
  const handleAttrValueEnter: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key !== "Enter") {
      return;
    }
    if (attrName === "" || !attrName) {
      toast.error("클래스의 속성명은 필수값입니다.");
      return;
    }
    if (
      event.currentTarget.value === "" ||
      event.currentTarget.value === undefined
    ) {
      toast.error("해당 속성값이 비었습니다.");
      return;
    }
    for (let i = 0; i < tempAttrInfo.length; i++) {
      if (tempAttrInfo[i] === event.currentTarget.value) {
        event.currentTarget.value = "";
        return;
      }
    }
    const currentAttrInfo = getCurrentSelectedAttrValues();
    let cnt = tempAttrInfo.length;
    if (currentAttrInfo && currentAttrInfo.attrValue)
      cnt += currentAttrInfo.attrValue.length;
    if (cnt > 100) {
      event.currentTarget.value = "";
      toast.error("속성값은 100개까지만 가능합니다.");
      return;
    }
    const attrVal = event.currentTarget.value;
    setTempAttrInfo((prev) => [...prev, attrVal]);
    event.currentTarget.value = "";
  };
  // ! 클래스 별 속성 값 작성 시 속성값 우측 X 버튼 클릭 시 해당 속성 삭제
  const handleTempAttrDelete = (attrValue: string) => {
    const newTempAttr = tempAttrInfo.filter((tav) => tav !== attrValue);
    setTempAttrInfo(newTempAttr);
  };
  // ! 클래스 별 속성 값 작성 시 우측 하단 저장 버튼
  const handleSave = () => {
    if (!currentSelectedClass || currentSelectedClass === "") {
      toast.error("클래스가 선택되지 않았습니다.");
      return;
    }
    if (!attrName || attrName === "") {
      toast.error("클래스의 속성명은 필수값입니다.");
      return;
    }
    let updated: IClassAttr;
    let updatedClass: IClass = {
      className: "",
      classColor: "",
    };
    console.log(selectedAttrType);
    switch (selectedAttrType) {
      // ! 입력형 숫자
      case ClassAttrType.customNumber:
        if (!minValue && !maxValue) {
          toast.error("범위를 설정하여야 합니다.");
          return;
        }
        if (minValue > 10) {
          toast.error("숫자 최소 입력 수 범위는 0~10 입니다.");
          return;
        }
        if (maxValue > 10) {
          toast.error("숫자 최대 입력 수 범위는 1~10 입니다.");
          return;
        }
        if (minValue > maxValue || minValue < 0 || maxValue < 1) {
          toast.error("최소/최대 범위를 다시 확인해주세요.");
          return;
        }
        console.log(minValue + ", " + maxValue);
        if (minValue >= 0 && maxValue) {
          // 0 : false, 1: true
          updated = {
            attrName,
            attrType: selectedAttrType,
            attrMin: minValue,
            attrMax: maxValue,
          };
          console.log("updated");
        }
        console.log(updated);
        break;
      // ! 입력형 문자
      case ClassAttrType.customString:
        if (!minValue && !maxValue) {
          toast.error("범위를 설정하여야 합니다.");
          return;
        }
        if (minValue > 50) {
          toast.error("글자 최소 입력 수 범위는 0~50 입니다.");
          return;
        }
        if (maxValue > 50) {
          toast.error("글자 최대 입력 수 범위는 1~50 입니다.");
          return;
        }
        if (minValue > maxValue || minValue < 0 || maxValue < 1) {
          toast.error("최소/최대 범위를 다시 확인해주세요.");
          return;
        }
        if (minValue >= 0 && maxValue) {
          updated = {
            attrName,
            attrType: selectedAttrType,
            attrMin: minValue,
            attrMax: maxValue,
          };
        }
        break;
      // ! 단일 선택형 또는 다중 선택형
      default:
        if (tempAttrInfo.length === 0 || !tempAttrInfo) {
          if (getCurrentSelectedAttrValues() === null) {
            toast.error("해당 속성값이 비었습니다.");
            return;
          }
        }
        if (selectedAttrType === ClassAttrType.multi) {
          if (!minValue && !maxValue) {
            toast.error("최소/최대 선택수를 입력해야 합니다.");
            return;
          }
          if (minValue > 100) {
            toast.error("최소 선택 수 범위는 1~100 입니다.");
            return;
          }
          if (maxValue < 2) {
            toast.error("최대 선택 수 범위는 2~100 입니다.");
            return;
          }
          if (maxValue > 100) {
            toast.error("최대 선택 수 범위는 2~100 입니다.");
            return;
          }
          if (minValue > maxValue || minValue < 1) {
            toast.error("최소/최대 범위를 다시 확인해주세요.");
            return;
          }
        }
        // ! 현재 선택된 클래스의 선택된 속성이 있다면 그 속성의 values return 없다면 null
        const existAttr = getCurrentSelectedAttrValues();
        let mergedAttrs: string[] = [];
        // ! 위에서 선택된 클래스의 선택된 속성이 있어서 그 값들을 가져왔다면 그 값과 현재 추가한 값을 merge
        if (
          existAttr &&
          existAttr.attrValue &&
          existAttr.attrValue.length > 0
        ) {
          mergedAttrs = existAttr.attrValue;
          mergedAttrs = [...mergedAttrs, ...tempAttrInfo];
        } else {
          mergedAttrs = tempAttrInfo;
        }

        if (selectedAttrType === ClassAttrType.mono) {
          updated = {
            attrName,
            attrType: selectedAttrType,
            attrValue: mergedAttrs,
          };
        }
        if (selectedAttrType === ClassAttrType.multi) {
          let min = existAttr && existAttr.attrMin ? existAttr.attrMin : 0;
          let max = existAttr && existAttr.attrMax ? existAttr.attrMax : 0;
          if (minValue && minValue !== 0) {
            min = minValue;
          }
          if (maxValue && maxValue !== 0) {
            max = maxValue;
          }
          updated = {
            attrName,
            attrType: selectedAttrType,
            attrValue: mergedAttrs,
            attrMin: min,
            attrMax: max,
          };
        }
        break;
    }
    console.log(classesValue);
    classesValue.forEach((c) => {
      if (c.className === currentSelectedClass) {
        updatedClass.className = c.className;
        updatedClass.classColor = c.classColor;
        let attrs: IClassAttr[] = [];
        let isExistAttr = false;
        // ! 기존 클래스의 속성이 하나라도 있다면 아래 if문 실행
        if (c.classAttr) {
          for (let i = 0; i < c.classAttr.length; i++) {
            if (c.classAttr[i].attrName === attrName) {
              isExistAttr = true;
              break;
            }
          }
          // ! 기존 속성이 있고 그걸 업데이트 하려고 한다면 if문 실행 / 새로 추가하는 속성이면 else문 실행
          if (isExistAttr) {
            attrs = c.classAttr.map((ca) => {
              if (ca.attrName === attrName) {
                return updated;
              }
              return ca;
            });
          } else {
            attrs = c.classAttr;
            attrs.push(updated);
          }
        } else {
          attrs.push(updated);
        }
        updatedClass.classAttr = attrs;
        console.log(updatedClass);
      }
    });

    const newClasses = classesValue.map((c) => {
      if (c.className === updatedClass.className) {
        return (c = updatedClass);
      }
      return c;
    });

    setClassesValue(newClasses);
    setCurrentSelectedAttr(undefined);
    setTempAttrInfo([]);
    setAttrName("");
    setMinValue(0);
    setMaxValue(0);
  };
  // ! 클래스 별 속성 값의 우측 상단 X 버튼 클릭
  const handleCloseAttrsInputForm = () => {
    setAttrName("");
    setCurrentSelectedAttr(undefined);
    setMinValue(0);
    setMaxValue(0);
    setTempAttrInfo([]);
  };
  const navigate = useNavigate();
  const handleCancelCreate = () => {
    navigate("/main/projects");
  };
  return (
    <ProjectCreatePresenter
      formErrors={errors}
      datasets={datasets}
      totalDatasets={totalDatasets}
      calendar={calendar}
      dateRange={dateRange}
      selectedPType={selectedPType}
      currentPage={currentPage}
      collectDataType={collectDataType}
      currentCollectChannel={currentCollectChannel}
      currentCollectDuration={currentCollectDuration}
      currentCollectAmount={currentCollectAmount}
      showAttrDiv={showAttrDiv}
      currentSelectedClass={currentSelectedClass}
      currentSelectedAttr={currentSelectedAttr}
      selectedAttrType={selectedAttrType}
      attrName={attrName}
      tempAttrInfo={tempAttrInfo}
      classesValue={classesValue}
      minValue={minValue}
      maxValue={maxValue}
      createLoading={createLoading}
      handleSetChannel={handleSetChannel}
      handleSetDuration={handleSetDuration}
      handleSetAmount={handleSetAmount}
      showCalendar={showCalendar}
      handleChangeCalendar={handleChangeCalendar}
      handlePopupDown={handlePopupDown}
      dateToString={dateToString}
      onChangePage={onChangePage}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      handleChangePType={handleChangePType}
      handleCollectDataSet={handleCollectDataSet}
      handleCollectCrawling={handleCollectCrawling}
      handleCollectMedia={handleCollectMedia}
      selectDataset={selectDataset}
      removeDataset={removeDataset}
      isSelectedDataset={isSelectedDataset}
      selectAllDataset={selectAllDataset}
      isSelectedAllDatasets={isSelectedAllDatasets}
      removeAllDataset={removeAllDataset}
      preventEnter={preventEnter}
      handleEnter={handleEnter}
      getCurrentSelectedClassAttr={getCurrentSelectedClassAttr}
      handleSetAttrOfClass={handleSetAttrOfClass}
      handleCloseAttrsInputForm={handleCloseAttrsInputForm}
      handleChangeAttrName={handleChangeAttrName}
      handleChangeSelect={handleChangeSelect}
      getCurrentSelectedAttrValues={getCurrentSelectedAttrValues}
      handleAttrValueEnter={handleAttrValueEnter}
      handleTempAttrDelete={handleTempAttrDelete}
      handleDeleteClass={handleDeleteClass}
      handleSetAttr={handleSetAttr}
      handleChangeCustomMinNumber={handleChangeCustomMinNumber}
      handleChangeCustomMaxNumber={handleChangeCustomMaxNumber}
      handleChangeCustomMinString={handleChangeCustomMinString}
      handleChangeCustomMaxString={handleChangeCustomMaxString}
      handleSave={handleSave}
      handleChangeMinValue={handleChangeMinValue}
      handleChangeMaxValue={handleChangeMaxValue}
      handleCancelCreate={handleCancelCreate}
      handleColorChange={handleColorChange}
      selectColor={selectColor}
      handleOpen={handleOpen}
      state={state}
      handleAttrDelete={handleAttrDelete}
      fileInput={fileInput}
      selectFile={selectFile}
      handleChangeFileUpload={handleChangeFileUpload}
      framedImageDatas={framedImageDatas}
      handleSelectData={handleSelectData}
      handleRemoveData={handleRemoveData}
      uploadSrc={uploadSrc}
      fUploadLoading={fUploadLoading}
      handleDragEnter={handleDragEnter}
      handleDragOver={handleDragOver}
      handleDragLeave={handleDragLeave}
      handleDrop={handleDrop}
      fileDrag={fileDrag}
    
    />
  );
};

export default ProjectCreateContainer;
