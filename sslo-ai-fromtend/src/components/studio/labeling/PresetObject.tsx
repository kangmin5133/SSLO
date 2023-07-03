import { fabric } from 'fabric';

export interface IPreset {
  tag: string;
  item: IPresetItem;
}

export interface IPresetItem {
  points: fabric.Object[];
  lines: fabric.Object[];
}

const getKeyPoint = (tag: string, data: any[], index: number, ratio: number, color: string) => {
  let keyPoint: IPresetItem;
  switch(tag) {
    case "animal":
      keyPoint = drawAnimal(data, index, ratio, color);
      break;
    case "hand":
      keyPoint = drawHands(data, index, ratio, color);
      break;
    default:
      keyPoint = drawPerson(data, index, ratio, color);
      break;
  }
  return keyPoint;
};

const drawPerson = (data: any[], itemId: number, imgRatio: number, clr: string) => {
  let item: IPresetItem;

  const nosePoint = makeCircle("KeyPoint", itemId + "_nose", imgRatio, data[0], data[1]),
    leyePoint = makeCircle("KeyPoint", itemId + "_leye", imgRatio, data[3], data[4]),
    reyePoint = makeCircle("KeyPoint", itemId + "_reye", imgRatio, data[6], data[7]),
    learPoint = makeCircle("KeyPoint", itemId + "_lear", imgRatio, data[9], data[10]),
    rearPoint = makeCircle("KeyPoint", itemId + "_rear", imgRatio, data[12], data[13]),
    lshoulderPoint = makeCircle("KeyPoint", itemId + "_lshoulder", imgRatio, data[15], data[16]),
    rshoulderPoint = makeCircle("KeyPoint", itemId + "_rshoulder", imgRatio, data[18], data[19]),
    lelbowPoint = makeCircle("KeyPoint", itemId + "_lelbow", imgRatio, data[21], data[22]),
    relbowPoint = makeCircle("KeyPoint", itemId + "_relbow", imgRatio, data[24], data[25]),
    lwristPoint = makeCircle("KeyPoint", itemId + "_lwrist", imgRatio, data[27], data[28]),
    rwristPoint = makeCircle("KeyPoint", itemId + "_rwrist", imgRatio, data[30], data[31]),
    lhipPoint = makeCircle("KeyPoint", itemId + "_lhip", imgRatio, data[33], data[34]),
    rhipPoint = makeCircle("KeyPoint", itemId + "_rhip", imgRatio, data[36], data[37]),
    lkneePoint = makeCircle("KeyPoint", itemId + "_lknee", imgRatio, data[39], data[40]),
    rkneePoint = makeCircle("KeyPoint", itemId + "_rknee", imgRatio, data[42], data[43]),
    lanklePoint = makeCircle("KeyPoint", itemId + "_lankle", imgRatio, data[45], data[46]),
    ranklePoint = makeCircle("KeyPoint", itemId + "_rankle", imgRatio, data[48], data[49]);

  const nlyLine = makeLine("KeyPoint", [data[0], data[1], data[3], data[4]], clr),
    nryLine = makeLine("KeyPoint", [data[0], data[1], data[6], data[7]], clr),
    lyryLine = makeLine("KeyPoint", [data[3], data[4], data[6], data[7]], clr),
    lylrLine = makeLine("KeyPoint", [data[3], data[4], data[9], data[10]], clr),
    ryrrLine = makeLine("KeyPoint", [data[6], data[7], data[12], data[13]], clr),
    lrlsLine = makeLine("KeyPoint", [data[9], data[10], data[15], data[16]], clr),
    rrrsLine = makeLine("KeyPoint", [data[12], data[13], data[18], data[19]], clr),
    lsrsLine = makeLine("KeyPoint", [data[15], data[16], data[18], data[19]], clr),
    lsleLine = makeLine("KeyPoint", [data[15], data[16], data[21], data[22]], clr),
    rsreLine = makeLine("KeyPoint", [data[18], data[19], data[24], data[25]], clr),
    lelwLine = makeLine("KeyPoint", [data[21], data[22], data[27], data[28]], clr),
    rerwLine = makeLine("KeyPoint", [data[24], data[25], data[30], data[31]], clr),
    lslhLine = makeLine("KeyPoint", [data[15], data[16], data[33], data[34]], clr),
    rsrhLine = makeLine("KeyPoint", [data[18], data[19], data[36], data[37]], clr),
    lhrhLine = makeLine("KeyPoint", [data[33], data[34], data[36], data[37]], clr),
    lhlkLine = makeLine("KeyPoint", [data[33], data[34], data[39], data[40]], clr),
    rhrkLine = makeLine("KeyPoint", [data[36], data[37], data[42], data[43]], clr),
    lklaLine = makeLine("KeyPoint", [data[39], data[40], data[45], data[46]], clr),
    rkraLine = makeLine("KeyPoint", [data[42], data[43], data[48], data[49]], clr);

    nosePoint ? setLine(nosePoint, null, null, nlyLine, nryLine) : null;
    leyePoint ? setLine(leyePoint, nlyLine, null, lyryLine, lylrLine) : null;
    reyePoint ? setLine(reyePoint, nryLine, lyryLine, ryrrLine) : null;
    learPoint ? setLine(learPoint, lylrLine, null, lrlsLine) : null;
    rearPoint ? setLine(rearPoint, ryrrLine, null, rrrsLine) : null;
    lshoulderPoint ? setLine(lshoulderPoint, lrlsLine, null, lsrsLine, lsleLine, lslhLine) : null;
    rshoulderPoint ? setLine(rshoulderPoint, rrrsLine, lsrsLine, rsreLine, rsrhLine) : null;
    lelbowPoint ? setLine(lelbowPoint, lsleLine, null, lelwLine) : null;
    relbowPoint ? setLine(relbowPoint, rsreLine, null, rerwLine) : null;
    lwristPoint ? setLine(lwristPoint, lelwLine, null) : null;
    rwristPoint ? setLine(rwristPoint, rerwLine, null) : null;
    lhipPoint ? setLine(lhipPoint, lslhLine, null, lhrhLine, lhlkLine) : null;
    rhipPoint ? setLine(rhipPoint, rsrhLine, lhrhLine, rhrkLine) : null;
    lkneePoint ? setLine(lkneePoint, lhlkLine, null, lklaLine) : null;
    rkneePoint ? setLine(rkneePoint, rhrkLine, null, rkraLine) : null;
    lanklePoint ? setLine(lanklePoint, lklaLine, null) : null;
    ranklePoint ? setLine(ranklePoint, rkraLine, null) : null;

    let points = [];
    nosePoint ? points.push(nosePoint) : null;
    leyePoint ? points.push(leyePoint) : null;
    reyePoint ? points.push(reyePoint) : null;
    learPoint ? points.push(learPoint) : null;
    rearPoint ? points.push(rearPoint) : null;
    lshoulderPoint ? points.push(lshoulderPoint) : null;
    rshoulderPoint ? points.push(rshoulderPoint) : null;
    lelbowPoint ? points.push(lelbowPoint) : null;
    relbowPoint ? points.push(relbowPoint) : null;
    lwristPoint ? points.push(lwristPoint) : null;
    rwristPoint ? points.push(rwristPoint) : null;
    lhipPoint ? points.push(lhipPoint) : null;
    rhipPoint ? points.push(rhipPoint) : null;
    lkneePoint ? points.push(lkneePoint) : null;
    rkneePoint ? points.push(rkneePoint) : null;
    lanklePoint ? points.push(lanklePoint) : null;
    ranklePoint ? points.push(ranklePoint) : null;

    let lines = [];
    nlyLine ? lines.push(nlyLine) : null;
    nryLine ? lines.push(nryLine) : null;
    lyryLine ? lines.push(lyryLine) : null;
    lylrLine ? lines.push(lylrLine) : null;
    ryrrLine ? lines.push(ryrrLine) : null;
    lrlsLine ? lines.push(lrlsLine) : null;
    rrrsLine ? lines.push(rrrsLine) : null;
    lsrsLine ? lines.push(lsrsLine) : null;
    lsleLine ? lines.push(lsleLine) : null;
    rsreLine ? lines.push(rsreLine) : null;
    lelwLine ? lines.push(lelwLine) : null;
    rerwLine ? lines.push(rerwLine) : null;
    lslhLine ? lines.push(lslhLine) : null;
    rsrhLine ? lines.push(rsrhLine) : null;
    lhrhLine ? lines.push(lhrhLine) : null;
    lhlkLine ? lines.push(lhlkLine) : null;
    rhrkLine ? lines.push(rhrkLine) : null;
    lklaLine ? lines.push(lklaLine) : null;
    rkraLine ? lines.push(rkraLine) : null;

    item = {
      points: points,
      lines: lines,
    }
  return item;
}

const makeCircle = (tool: string, oId: any, ratio: number, left: number, top: number) => {
  if(!left || !top) return null;
  const isBorder = tool === "Cube" ? false : true;
  let optionCircle = {
    id: oId,
    tool: tool,
    left: left,
    top: top,
    strokeWidth: 2 / ratio,
    radius: 4 / ratio,
    fill: 'red',
    stroke: '#666',
    originX: 'center',
    originY: 'center',
    hoverCursor: 'pointer',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    line5: '',
    line6: '',
    hasControls: false,
    hasBorders: isBorder,
  };
  let c = new fabric.Circle(optionCircle);
  c.setControlsVisibility({
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
  return c;
};
const setLine = (c: any, line1: any, line2: any, line3?: any, line4?: any, line5?: any, line6?: any) => {
  if(!c) return;
  let optionCircle = {
    line1: line1,
    line2: line2,
    line3: line3,
    line4: line4,
    line5: line5,
    line6: line6,
  };
  c.set(optionCircle);
};
const makeLine = (tool: string, coords: Array<number>, color: string) => {
  if(!coords || !coords[0] || !coords[1] || !coords[2] || !coords[3]) return null;
  let optionLine = {
    tool: tool,
    fill: color,
    stroke: color,
    strokeWidth: 2,
    selectable: false,
    evented: false,
  };
  return new fabric.Line(coords, optionLine);
};

const drawAnimal = (data: any[], index: number, ratio: number, color: string) => {
  let item: IPresetItem;
  return item;
}

const drawHands = (data: any[], index: number, ratio: number, color: string) => {
  let item: IPresetItem;
  return item;
}

const getCube = (data: any[], itemId: number, imgRatio: number, clr: string) => {
  let x1: fabric.Circle, x2: fabric.Circle, y1: fabric.Circle, y2: fabric.Circle, zx1: fabric.Circle, zx2: fabric.Circle, zy1: fabric.Circle, zy2: fabric.Circle;
  const points = [];
  points.push(x1 = makeCircle("Cube", itemId + "_0", imgRatio, data[0], data[1]));
  points.push(x2 = makeCircle("Cube", itemId + "_1", imgRatio, data[2], data[3]));
  points.push(y1 = makeCircle("Cube", itemId + "_2", imgRatio, data[4], data[5]));
  points.push(y2 = makeCircle("Cube", itemId + "_3", imgRatio, data[6], data[7]));

  points.push(zx1 = makeCircle("Cube", itemId + "_4", imgRatio, data[8], data[9]));
  points.push(zx2 = makeCircle("Cube", itemId + "_5", imgRatio, data[10], data[11]));
  points.push(zy1 = makeCircle("Cube", itemId + "_6", imgRatio, data[12], data[13]));
  points.push(zy2 = makeCircle("Cube", itemId + "_7", imgRatio, data[14], data[15]));

  const x1x2 = makeLine("Cube", [x1.left, x1.top, x2.left, x2.top], clr);
  const x1y1 = makeLine("Cube", [x1.left, x1.top, y1.left, y1.top], clr);
  const x2y2 = makeLine("Cube", [x2.left, x2.top, y2.left, y2.top], clr);
  const y1y2 = makeLine("Cube", [y1.left, y1.top, y2.left, y2.top], clr);

  const zx1zx2 = makeLine("Cube", [zx1.left, zx1.top, zx2.left, zx2.top], clr);
  const zx1zy1 = makeLine("Cube", [zx1.left, zx1.top, zy1.left, zy1.top], clr);
  const zx2zy2 = makeLine("Cube", [zx2.left, zx2.top, zy2.left, zy2.top], clr);
  const zy1zy2 = makeLine("Cube", [zy1.left, zy1.top, zy2.left, zy2.top], clr);

  const x1zx1 = makeLine("Cube", [x1.left, x1.top, zx1.left, zx1.top], clr);
  const x2zx2 = makeLine("Cube", [x2.left, x2.top, zx2.left, zx2.top], clr);
  const y1zy1 = makeLine("Cube", [y1.left, y1.top, zy1.left, zy1.top], clr);
  const y2zy2 = makeLine("Cube", [y2.left, y2.top, zy2.left, zy2.top], clr);

  const lines = [x1x2, x1y1, x2y2, y1y2, zx1zx2, zx1zy1, zx2zy2, zy1zy2, x1zx1, x2zx2, y1zy1, y2zy2];

  setLine(x1, null, null, null, x1x2, x1y1, x1zx1);
  setLine(x2, x1x2, null, null, x2y2, x2zx2);
  setLine(y1, x1y1, null, null, y1y2, y1zy1);
  setLine(y2, x2y2, y1y2, null, y2zy2);
  setLine(zx1, x1zx1, null, null, zx1zx2, zx1zy1);
  setLine(zx2, x2zx2, zx1zx2, null, zx2zy2);
  setLine(zy1, y1zy1, zx1zy1, null, zy1zy2);
  setLine(zy2, y2zy2, zx2zy2, zy1zy2);

  const cube: IPresetItem = {
    points: points,
    lines: lines,
  }
  return cube;
};

export {
  getKeyPoint,
  getCube,
};