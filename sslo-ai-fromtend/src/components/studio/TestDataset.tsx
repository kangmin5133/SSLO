import { IProject } from "../../api/projectApi";
import { ITask } from "../../api/taskApi";
import trialImage01 from "../../assets/images/studio/trial/trial_1.jpg";
import trialImage02 from "../../assets/images/studio/trial/trial_2.jpg";
import trialImage03 from "../../assets/images/studio/trial/trial_3.jpg";
import trialImage04 from "../../assets/images/studio/trial/trial_4.jpg";
import trialImage05 from "../../assets/images/studio/trial/trial_5.jpg";
import trialImage06 from "../../assets/images/studio/trial/trial_6.jpg";
import trialImage07 from "../../assets/images/studio/trial/trial_7.jpg";
import trialImage08 from "../../assets/images/studio/trial/trial_8.jpg";
import trialImage09 from "../../assets/images/studio/trial/trial_9.jpg";

const trialProject: IProject = {
  pNo: -100,
  pName: "체험 프로젝트",
  pType: 
  { project_type_id: 3,
    project_type_name: "가공",
    created: 0,
  },
  pWorkerCount: 0,
  pCreated: 0
}

const trialTasks: ITask[] = [
  {
    taskId: 1,
    taskName: "체험 작업 01",
    imageName: "trial_01",
    image: "",
    imageThumbnail: trialImage01,
    imageSize: 88417,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 786,
    imageHeight: 512,
  },
  {
    taskId: 2,
    taskName: "체험 작업 02",
    imageName: "trial_02",
    image: "",
    imageThumbnail: trialImage02,
    imageSize: 17158,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 480,
    imageHeight: 320,
  },
  {
    taskId: 3,
    taskName: "체험 작업 03",
    imageName: "trial_03",
    image: "",
    imageThumbnail: trialImage03,
    imageSize: 119130,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 1280,
    imageHeight: 853,
  },
  {
    taskId: 4,
    taskName: "체험 작업 04",
    imageName: "trial_04",
    image: "",
    imageThumbnail: trialImage04,
    imageSize: 83444,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 1000,
    imageHeight: 714,
  },
  {
    taskId: 5,
    taskName: "체험 작업 05",
    imageName: "trial_05",
    image: "",
    imageThumbnail: trialImage05,
    imageSize: 148770,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 1280,
    imageHeight: 854,
  },
  {
    taskId: 6,
    taskName: "체험 작업 06",
    imageName: "trial_06",
    image: "",
    imageThumbnail: trialImage06,
    imageSize: 17775,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 425,
    imageHeight: 282,
  },
  {
    taskId: 7,
    taskName: "체험 작업 07",
    imageName: "trial_07",
    image: "",
    imageThumbnail: trialImage07,
    imageSize: 194032,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 1237,
    imageHeight: 848,
  },
  {
    taskId: 8,
    taskName: "체험 작업 08",
    imageName: "trial_08",
    image: "",
    imageThumbnail: trialImage08,
    imageSize: 127170,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 1200,
    imageHeight: 675,
  },
  {
    taskId: 9,
    taskName: "체험 작업 09",
    imageName: "trial_09",
    image: "",
    imageThumbnail: trialImage09,
    imageSize: 51507,
    taskStatus: 1,
    taskStep: 1,
    taskStatusName: "미작업",
    imageFormat: "JPEG",
    imageWidth: 800,
    imageHeight: 533,
  },
];

export {
  trialProject,
  trialTasks,
};