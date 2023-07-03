export const guideURL = "https://flaxen-bench-6a7.notion.site/24efa21f48ea4c5698aa09df5f45b962";
export const tosURL = "https://flaxen-bench-6a7.notion.site/ea5ac1f396f54f80bd649090bff76c2f";
export const privacyPolicyURL = "https://flaxen-bench-6a7.notion.site/3673920b6ab54b67bc983bd64fdf9c67";
export const footerInfo = `
(주)티벨  |  서울특별시 강남구 강남대로 354, 9층 (역삼동, 혜천빌딩) 
대표이사 : 김종균   |   사업자등록번호 : 376-81-00089   |   Tel : 070.7777.9113 / 070.7777.6368   |    Fax : 070.7610.7540   |   E-mail : staff@tbell.co.kr(미정)
Copyright ⓒ (주)티벨. All rights reserved.
`;
export const constOptionsExportTask = ["projectName", "fileName", "imageSize"];
export const constConfigModelNameList = [
  "R_50_C4_1x",
  "R_50_C4_3x",
  "R_50_DC5_1x",
  "R_50_DC5_3x",
  "R_50_FPN_1x",
  "R_50_FPN_3x",
  "R_101_C4_3x",
  "R_101_DC5_3x",
  "R_101_FPN_3x",
  "X_101_32x8d_FPN_3x"
];
export const constInfoExportModelType = [
  {
    type: "pytorch",
    info: [
      {
        key: `# version info`,
        value: 
          `Pytorch model inference guideline
          torch==1.13.1+cu117
          opencv-python==4.6.0.66`,
      },
      {
        key: `# import libraries`,
        value: 
          `import cv2
          import torch`,
      },
      {
        key: `# model load`,
        value: 
          `model_test = torch.load(' 모델 파일 경로 ')`,
      },
      {
        key: `# image load`,
        value: 
          `image = cv2.imread(" 이미지 파일 경로 " )# opencv => BGR`,
      },
      {
        key: `# image preprocess`,
        value: 
          `image = torch.as_tensor(image.astype("float32").transpose(2, 0, 1)) # tranpose => H,W,C -> C,H,W
          inputs = {"image": image}`,
      },
      {
        key: `# model inference`,
        value: 
          `model_test.eval()
          with torch.no_grad():
          predictions = model_test([inputs])[0]
          predictions`,
      },
    ],
  },
  {
    type: "onnx",
    info: [
      {
        key: `# version info`,
        value: 
          `ONNX model inference guideline
          onnxruntime==1.13.1
          torch==1.13.1+cu117
          opencv-python==4.6.0.66`,
      },
      {
        key: `# import libraries`,
        value: `import onnxruntime
        import cv2
        import torch`,
      },
      {
        key: `# onnx model load`,
        value: `ort_session = onnxruntime.InferenceSession(" 모델 파일 경로 ")`,
      },
      {
        key: `# image load`,
        value: `image = cv2.imread(" 이미지 파일 경로 " )# opencv => BGR
        image = cv2.resize(image,dsize = (1067,800))
        image = torch.as_tensor(image.astype("float32").transpose(2, 0, 1)) # tranpose => H,W,C -> C,H,W`,
      },
      {
        key: `# image preprocess func`,
        value: `def to_numpy(tensor):
        return tensor.detach().cpu().numpy() if tensor.requires_grad else tensor.cpu().numpy()`,
      },
      {
        key: `# onnx runtime inference`,
        value: `ort_inputs = {ort_session.get_inputs()[0].name: to_numpy(image)}
        ort_outs = ort_session.run(None, ort_inputs),`,
      },
    ],
  },
  {
    type: "tensorflow",
    info: [
      {
        key: "",
        value: "Tensorflow : 준비중입니다."
      }
    ],
  },
  {
    type: "keras",
    info: [
      {
        key: "",
        value: "Keras: 준비중입니다."
      }
    ],
  }
];