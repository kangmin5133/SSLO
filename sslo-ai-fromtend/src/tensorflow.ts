// eslint-disable-next-line
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

const removeBg = async (
  imgSrc: string,
  callback: (image: HTMLImageElement) => void
) => {
  const img = new Image();
  img.src = imgSrc;
  img.onload = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (img.width !== canvas.width) canvas.width = img.width;
    if (img.height !== canvas.height) canvas.height = img.height;

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      throw new Error("canvas context invalid, check please");
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const net = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 4,
    });
    const { data: map } = await net.segmentPerson(canvas, {
      segmentationThreshold: 0.7,
      internalResolution: "medium",
    });
    for (let i = 0; i < map.length; i++) {
      //   const [r, g, b, a] = [
      //     data[i * 4],
      //     data[i * 4 + 1],
      //     data[i * 4 + 2],
      //     data[i * 4 + 3],
      //   ];
      if (map[i] === 0) {
        data[i * 4] = 255;
        data[i * 4 + 1] = 255;
        data[i * 4 + 2] = 255;
        data[i * 4 + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    const newImage = new Image();
    newImage.src = canvas.toDataURL("image/jpeg");
    callback(newImage);
  };
};

export default removeBg;
