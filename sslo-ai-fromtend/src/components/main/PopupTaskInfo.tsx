import React, { useEffect, useRef, useState } from "react";
import { IProject } from "../../api/projectApi";
import { ITask } from "../../api/taskApi";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFormattedDateTime, getWorkingDateTime, truncate } from "../../utils";
import iconCloseWhite from "../../assets/images/project/icon/icon-close-white.svg";
import iconDefault from "../../assets/images/studio/icon/instanceTools/icon-instance-default.svg";
import iconSmartpen from "../../assets/images/studio/icon/instanceTools/icon-instance-smartpen.svg";
import iconAutopoint from "../../assets/images/studio/icon/instanceTools/icon-instance-autopoint.svg";
import iconBoxing from "../../assets/images/studio/icon/instanceTools/icon-instance-boxing.svg";
import iconPolyline from "../../assets/images/studio/icon/instanceTools/icon-instance-polyline.svg";
import iconPolygon from "../../assets/images/studio/icon/instanceTools/icon-instance-polygon.svg";
import iconPoint from "../../assets/images/studio/icon/instanceTools/icon-instance-point.svg";
import iconBrush from "../../assets/images/studio/icon/instanceTools/icon-instance-brush.svg";
import icon3Dcube from "../../assets/images/studio/icon/instanceTools/icon-instance-3Dcube.svg";
import iconSegment from "../../assets/images/studio/icon/instanceTools/icon-instance-segment.svg";
import iconKeypoint from "../../assets/images/studio/icon/instanceTools/icon-instance-keypoint.svg";
import iconOD from "../../assets/images/studio/icon/instanceTools/icon-instance-OD.svg";
import iconIS from "../../assets/images/studio/icon/instanceTools/icon-instance-IS.svg";
import iconSES from "../../assets/images/studio/icon/instanceTools/icon-instance-SES.svg";
import iconPrev from "../../assets/images/studio/header/icon-prev.svg";
import iconNext from "../../assets/images/studio/header/icon-next.svg";

import { fabric } from "fabric";
import {
  Tooltip,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { getCube, getKeyPoint, IPresetItem } from "../studio/labeling/PresetObject";
import { toast } from 'react-toastify';

export interface ITaskPopup {
  project: IProject;
  t: ITask;
  tasks: ITask[];
  closeTaskPopup: () => void;
}

const Icon = styled.img`
  cursor: pointer;
  max-width: 80px;
  margin-right: 100px;
`;
const Button = styled.div`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
  background-color: #5f6164;
  color: #fff;
`;
const Canvas = styled.canvas``;
const Ball = styled.span`
  display: inline-block;
  height: 14px;
  width: 14px;
  border-radius: 7px;
  margin-left: 10px;
  margin-right: 10px;
`;
const ScrolledBox = styled(Box)`
&::-webkit-scrollbar {
  width: 10px;
}
&::-webkit-scrollbar-thumb {
  background: #A4A8AD;
  border-radius: 2px;
}
&::-webkit-scrollbar-track {
  background: #737680;
  width: 10px;
}
max-height: 120px;
overflow-y: auto;
`;

const PopupTaskInfo: React.FC<ITaskPopup> = ({
  project,
  t,
  tasks,
  closeTaskPopup,
}) => {
  const [task, setTask] = useState<ITask>();
  const [tId, setTId] = useState<number>(0);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [ctx, setContext] = useState<CanvasRenderingContext2D>();
  const [objectList, setObjectList] = useState<any[]>([]);
  const [annoInfo, setAnnoInfo] = useState<any>();
  const [imgInfo, setImgInfo] = useState<any>({
    width: 0,
    height: 0,
    ratio: 1,
  });
  const iInfo = useRef(imgInfo);
  // ! type이 DATALIST일 때만 유효한 function
  const initCanvas = () => new fabric.Canvas("popupCanvas", { selection: false });
  useEffect(() => {
    if(!task) return;
    tasks.forEach((t, id) => {
      if (t.taskId === task.taskId) {
        setTId(id);
      }
    });
    if (project.pType.project_type_id === 3) {
      if(canvas) {
        canvas.clear();
        setCanvasImage();
      }
      else setCanvas(initCanvas());
    }
    else
      setImage();
  }, [task]);

  useEffect(() => {
    if (t) setTask(t);
  }, [t]);

  const handlePrevTask = (idx: number) => {
    if (idx <= 0) {
      toast.error("첫번째 작업입니다.");
      return;
    }
    tasks.forEach((t, id) => {
      if (id === idx - 1) {
        setTask(t);
      }
    });
  };

  const handleNextTask = (idx: number) => {
    if (idx >= tasks.length - 1) {
      toast.error("마지막 작업입니다.");
      return;
    }
    tasks.forEach((t, id) => {
      if (id === idx + 1) {
        setTask(t);
      }
    });
  };

  useEffect(() => {
    if(canvas) {
      setContext(() => canvas.getContext());
      fabric.Object.prototype.setControlsVisibility({
        bl: false,
        br: false,
        tl: false,
        tr: false,
        mb: false,
        ml: false,
        mr: false,
        mt: false,
        mtr: false,
      });
      setObjectList([]);
      setCanvasImage();
    }
  }, [canvas]);

  const setCanvasImage = () => {
    const wrapper = document.getElementById("imgWrapper");
    fabric.Image.fromURL(task.image, (image) => {
      let width = image.width, height = image.height, ratio = 0;
      if(width && height) {
        if (width > height) {
          ratio = wrapper.clientWidth / width;
          if (height * ratio > wrapper.clientHeight) {
            ratio = wrapper.clientHeight / height;
          }
        } else {
          ratio = wrapper.clientHeight / height;
          if (width * ratio > wrapper.clientWidth) {
            ratio = wrapper.clientWidth / width;
          }
        }
        image.selectable = false;
        image.hasBorder = false;
        image.hasControls = false;
        image.set("type", "image");
        canvas.setBackgroundImage(image, () => {});
        setImgInfo({
          width: width,
          height: height,
          ratio: ratio,
        });
        canvas.setWidth(width * ratio);
        canvas.setHeight(height * ratio);
        canvas.setZoom(ratio);
        console.log(canvas);
      }
    }, { crossOrigin: 'anonymous' });
    setAnnotation();
  };

  useEffect(() => {
    let width = iInfo.current.width, height = iInfo.current.height, ratio = 0;
    const wrapper = document.getElementById("imgWrapper");
    if(width && height) {
      if (width > height) {
        ratio = wrapper.clientWidth / width;
        if (height * ratio > wrapper.clientHeight) {
          ratio = wrapper.clientHeight / height;
        }
      } else {
        ratio = wrapper.clientHeight / height;
        if (width * ratio > wrapper.clientWidth) {
          ratio = wrapper.clientWidth / width;
        }
      }
      canvas.setWidth(width * ratio);
      canvas.setHeight(height * ratio);
      canvas.setZoom(ratio);
    }
  }, [annoInfo]);

  useEffect(() => {
    iInfo.current = imgInfo;
  }, [imgInfo]);

  const setAnnotation = () => {
    if(!task.annotation) return;
    for (let j = 0; j < task.annotation.length; j++) {
      let item = task.annotation[j];
      const color = item.annotation_category.annotation_category_color;
      const type = item.annotation_type.annotation_type_name;
      if (item.annotation_id) {
        if (
          item.annotation_type.annotation_type_id === 1 ||
          item.annotation_type.annotation_type_id === 9
        ) {
          let coord = {
            left: item.annotation_data[0],
            top: item.annotation_data[1],
            width: item.annotation_data[2],
            height: item.annotation_data[3],
          };
          let optionRect = {
            type: type,
            color: color,
            left: coord.left,
            top: coord.top,
            width: coord.width,
            height: coord.height,
            strokeWidth: 2,
            stroke: color,
            strokeOpacity: '.5',
            fill: 'transparent',
            strokeDashArray: [5, 5],
            hasBorders: false,
            hasControls: false,
            hoverCursor: 'pointer',
            objectCaching: false,
            annotation: item,
          };
          const rect = new fabric.Rect(optionRect);
          drawItem(rect);
        } else if (
          item.annotation_type.annotation_type_id === 2 ||
          item.annotation_type.annotation_type_id === 3 ||
          item.annotation_type.annotation_type_id === 4 ||
          item.annotation_type.annotation_type_id === 6 ||
          item.annotation_type.annotation_type_id === 8
        ) {
          let items = item.annotation_data;
          let coordinates = [];
          for (let l = 0; l < items.length; l++) {
            coordinates.push(new fabric.Point(items[l++], items[l]));
          }
          let fill = 'transparent';
          if(type === "Segmentation") {
            fill = color + "4D";
          }
          if(type === "Polygon") {
            fill = color + "01";
          }
          let option = {
            type: type,
            color: color,
            fill: fill,
            selectable: true,
            strokeWidth: 2,
            stroke: color,
            strokeDashArray: [5, 5],
            objectCaching: false,
            edit: false,
            hoverCursor: 'pointer',
            hasBorders: false,
            hasControls: false,
            perPixelTargetFind: true,
            annotation: item,
          };
          let polyItem = new fabric.Polygon(coordinates, option);
          if (type === "Polyline") {
            polyItem = new fabric.Polyline(coordinates, option);
          }
          drawItem(polyItem);
        } else if (item.annotation_type.annotation_type_id === 5) {
          let coord = {
            x: item.annotation_data[0],
            y: item.annotation_data[1],
          };
          let optionPoint = {
            type: type,
            radius: 4,
            stroke: 'black',
            strokeWidth: 1,
            color: color,
            fill: color,
            left: coord.x,
            top: coord.y,
            hasBorders: true,
            borderColor: color,
            hasControls: false,
            cornerSize: 5,
            originX: 'center',
            originY: 'center',
            hoverCursor: 'pointer',
            selectable: true,
            annotation: item,
          };
          const point = new fabric.Circle(optionPoint);
          drawItem(point);          
        } else if (item.annotation_type.annotation_type_id === 7) {
          drawCube(item.annotation_data, item, color);
        } else if (item.annotation_type.annotation_type_id === 10) {
          drawKeypoint(item, item.annotation_data, color);
        }
      }
    }
  };

  const drawItem = (object: fabric.Object) => {
    object.set("lockMovementX", true);
    object.set("lockMovementY", true);
    object.set("lockRotation", true);
    object.set("lockScalingFlip", true);
    object.set("lockScalingX", true);
    object.set("lockScalingY", true);
    object.set("lockSkewingX", true);
    object.set("lockSkewingY", true);
    object.on('selected', handleSelectObject);
    object.on('deselected', handleDeSelectObject);
    setObjectList(objectList => [...objectList, object]);
    canvas.add(object);
    canvas.renderAll();
  };

  const drawCube = (coords: any, annotation: any, color: string) => {
    let optionGroup = {
      type: "Cube",
      color: color,
      hasBorders: true,
      borderColor: color,
      hasControls: false,
      hoverCursor: 'pointer',
      annotation: annotation,
    };

    const cubeItem: IPresetItem = getCube(coords, annotation.annotation_id, 1, color);
    const group = new fabric.Group([...cubeItem.points, ...cubeItem.lines], optionGroup);
    drawItem(group);
  };

  const drawKeypoint = (annotation: any, data: any, color: string) => {
    let tag = "person";

    let optionPoint = {
      type: "KeyPoint",
      color: color,
      hasBorders: true,
      borderColor: color,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      hoverCursor: 'pointer',
      annotation: annotation,
    };

    const keypointItem: IPresetItem = getKeyPoint(tag, data, annotation.annotation_id, 1, color);
    const keyPoint = new fabric.Group([...keypointItem.points, ...keypointItem.lines], optionPoint);
    drawItem(keyPoint);
  };

  const handleSelectObject = (options) => {
    if(!options.target) return;
    options.target.strokeDashArray = [0, 0];
    if (options.target.type && (options.target.type !== "Cube" || options.target.type !== "KeyPoint"))
      options.target.fill = options.target.color + "4d";
    setAnnoInfo({
      type: options.target.annotation.annotation_type.annotation_type_name,
      className: options.target.annotation.annotation_category.annotation_category_name,
      classColor: options.target.annotation.annotation_category.annotation_category_color,
      attrs: options.target.annotation.annotation_category.annotation_category_attributes,
    });
  };

  const handleDeSelectObject = (options) => {
    if(!options.target) return;
    options.target.strokeDashArray = [5, 5];
    if (!options.target.type || options.target.type !== "Segment") {
      options.target.fill = "transparent";
      if (options.target.type === "Polygon")
        options.target.fill = options.target.color + "01";
    }
    setAnnoInfo(null);
  };

  const setIcon = (tool: string) => {
    let icon = iconDefault;
    switch(tool) {
      case "HOD":
        icon = iconOD;
        break;
      case "OD":
        icon = iconOD;
        break;
      case "IS":
        icon = iconIS;
        break;
      case "HIS":
        icon = iconIS;
        break;
      case "SES":
        icon = iconSES;
        break;
      case "HSES":
        icon = iconSES;
        break;
      case "AutoPoint":
        icon = iconAutopoint;
        break;
      case "MagicWand":
        icon = iconSmartpen;
        break;
      case "BBox":
        icon = iconBoxing;
        break;
      case "Polyline":
        icon = iconPolyline;
        break;
      case "Polygon":
        icon = iconPolygon;
        break;
      case "Point":
        icon = iconPoint;
        break;
      case "BrushPen":
        icon = iconBrush;
        break;
      case "Cube":
        icon = icon3Dcube;
        break;
      case "Segmentation":
        icon = iconSegment;
        break;
      case "KeyPoint":
        icon = iconKeypoint;
        break;
    }
    return icon;
  };

  const handleClosePopup = () => {
    setObjectList([]);
    closeTaskPopup();
  };

  const setImage = () => {
    const wrapper = document.getElementById("imgWrapper");
    const image = document.getElementById("popupImg") as HTMLImageElement;
    image.onload = function() {
      let width = image.naturalWidth, height = image.naturalHeight, ratio = 0;
  
      if(width && height) {
        if (width > height) {
          ratio = wrapper.clientWidth / width;
          if (height * ratio > 500) {
            ratio = 500 / height;
          }
        } else {
          ratio = 500 / height;
          if (width * ratio > wrapper.clientWidth) {
            ratio = wrapper.clientWidth / width;
          }
        }
      }
      image.style.width = width * ratio + "px";
      image.style.height = height * ratio + "px";
      wrapper.style.width = width * ratio + "px";
      //wrapper.style.height = height * ratio + "px";
    };
    image.src = task.image;
   
  };

  return ( 
    !task ? null
    :<ModalContent maxWidth={"60%"} height={"650px"} backgroundColor={"#737680"} color={"#fff"}>
      <ModalHeader display={"flex"} justifyContent={"space-between"}>
        <Link
          to={`/studio/${
            project.pType.project_type_id === 1
              ? "collect"
              : project.pType.project_type_id === 2
              ? "preprocessing"
              : "labeling"
          }/${project.pNo}?selectedTask=${task.taskId}`}
        >
          <Button style={{ width: "150px", height: "30px", marginRight: 0 }}>STUDIO</Button>
        </Link>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Icon
            src={iconPrev}
            style={{ width: 23.33, height: 23.33, cursor: "pointer", margin: "0 15px" }}
            onClick={() => handlePrevTask(tId)}
          />
          <Text fontSize={"16px"}>{task.imageName + "." + task.imageFormat.toLowerCase()}</Text>
          <Icon
            src={iconNext}
            style={{ width: 23.33, height: 23.33, cursor: "pointer", margin: "0 15px" }}
            onClick={() => handleNextTask(tId)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "150px" }}>
          <Icon src={iconCloseWhite} style={{ width: "20px", marginRight: 0 }} onClick={handleClosePopup}/>
        </div>
      </ModalHeader>
        {/* <ModalCloseButton/> */}
      <ModalBody display={"flex"} justifyContent={"space-evenly"} padding={"15px 30px 30px 30px"}>
        {project.pType.project_type_id === 3 && annoInfo && (
          <Box 
            style={{ 
              display: "flex", 
              minWidth: "27%",
              width: "27%", 
              height: "100%",
              flexDirection: "column", 
              marginRight: "20px",
            }}
          >
            <TableContainer marginBottom={"10px"} overflowX={"hidden"}>
              <Table size="sm" marginBottom={"10px"}>
                <TableCaption 
                  placement="top" 
                  width={"100%"} 
                  background={"#5F6164"} 
                  color={"#fff"} 
                  fontSize={"14px"}
                  marginTop={0}
                  marginBottom={"10px"}
                >
                  작업 객체 정보
                </TableCaption>
                <Thead borderTop={"1px double #5F6164"}>
                  <Tr></Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td borderBottom={"none"} >
                      <ChakraImage src={task.image} width={"100%"} borderRadius={"10px"}/>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
              <ScrolledBox marginBottom={"20px"} borderTop={"1px solid #5F6164"} borderBottom={"1px solid #5F6164"}>
                <Table size="sm">
                  <Thead 
                    /* position={"sticky"} 
                    top={0}  */
                    bgColor={"#737680"}
                  >
                    <Tr><Th borderRight={"1px solid #5F6164"} borderBottom={"none"}></Th><Th borderBottom={"none"}></Th></Tr>
                    <Tr>
                      <Td 
                        width={"65px"} 
                        textAlign={"center"} 
                        bgColor={"#737680"}
                        borderRight={"1px solid #5F6164"} 
                        borderBottom={"none"}>
                        클래스
                      </Td>
                      <Td borderBottom={"none"}>
                        <Box bgColor={"#737680"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                          <Ball 
                            style={{ 
                              display: annoInfo ? "block" : "none",
                              backgroundColor: annoInfo ? annoInfo.classColor : "transparent"
                            }} 
                          />
                          {annoInfo ? annoInfo.className : "없음"}
                        </Box>
                      </Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {annoInfo && annoInfo.attrs && annoInfo.attrs.map((attr, index) => {
                      return (
                        attr.annotation_category_attr_val && 
                        attr.annotation_category_attr_val.length > 0 && (
                          <Tr key={index}>
                            <Td textAlign={"center"} borderRight={"1px solid #5F6164"} borderBottom={"none"}>
                              <Tooltip hasArrow label={attr.annotation_category_attr_name} placement="top">
                                <Text textAlign={"center"}>
                                  {truncate(attr.annotation_category_attr_name, 5)}
                                </Text>
                              </Tooltip>
                            </Td>
                            <Td borderBottom={"none"}>
                              {/* {attr.annotation_category_attr_val} */} {/* //! 배열 처리 필요 */}
                              
                                <Tooltip hasArrow label={attr.annotation_category_attr_val.map((val, vId) => {return (vId > 0 ? ", " + val : val);})} placement="top">
                                  <Text textAlign={"center"}>
                                  {attr.annotation_category_attr_val.map((val, vId) => {
                                    return (
                                      vId > 3 ? "" : vId === 3 ? "..." : vId > 0 ? ", " + val : val
                                    );
                                  })}
                                  </Text>
                                </Tooltip>
                            </Td>
                          </Tr>
                        )
                      );
                    })}
                    <Tr><Th borderRight={"1px solid #5F6164"} borderBottom={"none"}></Th><Th borderBottom={"none"}></Th></Tr>
                  </Tbody>
                </Table>
              </ScrolledBox>
              {objectList && objectList.length > 0 && (
                <>
                  <Box 
                    display={"flex"}
                    alignItems={"center"}
                    padding={"5px 10px 5px 0"}
                    backgroundColor={"#737680"} 
                    borderTop={"1px solid #5F6164"} 
                  >
                    <Text fontSize={"14px"} color={"#fff"} width={"50%"} textAlign={"center"}>작업도구</Text>
                    <Text fontSize={"14px"} color={"#fff"} width={"50%"} textAlign={"center"}>클래스</Text>
                  </Box>
                  <ScrolledBox borderTop={"1px solid #5F6164"} borderBottom={"1px solid #5F6164"} maxHeight={"120px"} >
                    <Table size="sm">
                      <Tbody>
                        <Tr><Th borderBottom={"none"}></Th><Th borderBottom={"none"}></Th></Tr>
                        {objectList.map((obj, index) => {
                          return (
                            <Tr key={index}>
                              <Td width={"50%"} borderBottom={"none"}>
                                <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                  <Icon src={setIcon(obj.type)} style={{ marginRight: 0, cursor: "default" }} />
                                </Box>
                              </Td>
                              <Td width={"50%"} textAlign={"center"} borderBottom={"none"}>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"}>
                                  <Ball 
                                    style={{
                                      backgroundColor: obj.color
                                    }} 
                                  />
                                  <Tooltip hasArrow label={obj.annotation.annotation_category.annotation_category_name} placement="top">
                                    <Text
                                      color={"#fff"}
                                      fontSize={"14px"}
                                      fontWeight={"600"}
                                    >
                                      {truncate(obj.annotation.annotation_category.annotation_category_name, 5)}
                                    </Text>
                                  </Tooltip>
                                </Box>
                              </Td>
                            </Tr>
                          );
                        })}
                        <Tr><Th borderBottom={"none"}></Th><Th borderBottom={"none"}></Th></Tr>
                      </Tbody>
                    </Table>
                  </ScrolledBox>
                </>
              )}
            </TableContainer>
          </Box>
        )}
        <Box 
          id={"imgWrapper"} 
          style={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "30%", 
            width: "70%", 
            maxWidth: "70%", 
            height: "100%", 
            maxHeight: "100%" 
          }}
        >
          {project.pType.project_type_id === 3
            ? <Canvas id={"popupCanvas"} style={{ borderRadius: "13px" }}/>
            : <img 
                id={"popupImg"} 
                src={task.image} 
                width={"100%"} 
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "100%", 
                  borderRadius: "13px" 
                }} 
              />}
        </Box>
        <Box 
          style={{ 
            display: "flex", 
            minWidth: "27%",
            width: "27%", 
            height: "100%",
            flexDirection: "column", 
            marginLeft: "20px",
          }}
        >
          <Box width={"100%"} height={"50%"}>
            <TableContainer>
              <Table size="sm">
                <TableCaption 
                  placement="top" 
                  width={"100%"} 
                  background={"#5F6164"} 
                  color={"#fff"} 
                  fontSize={"14px"}
                  marginTop={0}
                  marginBottom={"15px"}
                >
                  데이터 정보
                </TableCaption>
                <Thead>
                  <Tr></Tr>
                </Thead>
                <Tbody borderTop={"1px solid #5F6164"} borderBottom={"1px solid #5F6164"}>
                  <Tr>
                    <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>파일명</Td>
                    <Td borderBottom={"0"}>
                      <Tooltip hasArrow label={task.imageName} placement="top">
                        <Text width={"100%"}>
                          {truncate(task.imageName, 25)}
                        </Text>
                      </Tooltip>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>파일형식</Td>
                    <Td borderBottom={"0"}>{task.imageFormat}</Td>
                  </Tr>
                  <Tr>
                    <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>파일용량</Td>
                    <Td borderBottom={"0"}>
                      {task.imageSize > (1024 * 1024) ? 
                      Math.round(task.imageSize / (1024 * 1024) * 100) / 100 + " MB" 
                      : task.imageSize > 1024 ? 
                      Math.round(task.imageSize / 1024 * 100) / 100 + " KB" 
                      : task.imageSize + " B"}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>파일크기</Td>
                    <Td borderBottom={"0"}>{task.imageWidth + " x " + task.imageHeight}</Td>
                  </Tr>
                  <Tr>
                    <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>제공일시</Td>
                    <Td borderBottom={"0"}>{getFormattedDateTime(task.created)}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          {project.pType.project_type_id !== 1 && (
            <Box width={"100%"} height={"50%"} display={"flex"} alignItems={"end"}>
              <TableContainer>
                <Table size="sm">
                  <TableCaption 
                    placement="top" 
                    width={"100%"} 
                    background={"#5F6164"} 
                    color={"#fff"} 
                    fontSize={"14px"}
                    marginTop={0}
                    marginBottom={"15px"}
                  >
                    작업 정보
                  </TableCaption>
                  <Thead borderTop={"1px solid #5F6164"} borderBottom={"1px solid #5F6164"} marginBottom={"15px"}>
                    <Tr>
                      <Td borderBottom={"0"}>
                        <Text 
                          background={"#A5EBD8"} 
                          borderRadius={"13px"} 
                          textAlign={"center"} 
                          padding={"5px"}
                          color={"#5F6164"}
                          fontSize={"12px"}
                          fontWeight={"800"}
                        >
                          {task.taskStep === 1 ? 
                          project.pType.project_type_id === 1
                          ? "수집"
                          : project.pType.project_type_id === 2
                          ? "전처리"
                          : "가공" 
                          : "검수"}
                        </Text>
                      </Td>
                      <Td borderBottom={"0"}>
                        <Box display={"flex"} alignItems={"center"}>
                          <Ball 
                            style={{ 
                              backgroundColor: task.taskStatus === 3 ? "#2EA090" 
                                : task.taskStatus === 2 ? "#3580E3"
                                : task.taskStatus === 1 ? "#E2772A"
                                : "#FF4343"
                            }} 
                          />
                          <Text
                            color={"#fff"}
                            fontSize={"12px"}
                            fontWeight={"600"}
                          >
                            {task.taskStatusName}
                          </Text>
                        </Box>
                      </Td>
                    </Tr>
                  </Thead>
                  <Tbody borderTop={"1px solid #5F6164"} borderBottom={"1px solid #5F6164"}>
                    <Tr>
                      <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>담당자</Td>
                      <Td borderBottom={"0"}>
                        {task.taskStep === 1 ? 
                          task.taskWorker ? task.taskWorker.displayName : "없음" 
                          : task.taskValidator ? task.taskValidator.displayName : "없음"}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>최종 저장시간</Td>
                      <Td borderBottom={"0"}>{getFormattedDateTime(task.updated)}</Td>
                    </Tr>
                    <Tr>
                      <Td borderRight={"1px solid #5F6164"} borderBottom={"0"}>총 작업시간</Td>
                      <Td borderBottom={"0"}>{getWorkingDateTime(task.updated - task.created)}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </ModalBody>
    </ModalContent>
  );
};

export default PopupTaskInfo;