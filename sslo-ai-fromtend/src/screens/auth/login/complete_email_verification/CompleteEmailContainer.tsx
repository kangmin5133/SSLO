import React, { useEffect, useState } from "react";
import SignupMailPresenter from "./CompleteEmailPresenter";
import { useLocation } from "react-router-dom";
import userApi from "../../../../api/userApi";
import { useAppSelector } from "../../../../hooks";

const CompleteEmailContainer = () => {


  return <SignupMailPresenter/>;
};

export default CompleteEmailContainer;
