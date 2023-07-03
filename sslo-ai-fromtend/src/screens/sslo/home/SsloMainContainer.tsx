import React, { useState } from "react";
import SsloMainPresenter from "./SsloMainPresenter";

const SsloMainContainer = () => {
  const [tab, setTab] = useState<number>(1);
  const handleTab = (tab: any) => {
    setTab(tab);
    console.log(tab);
  };

  // ! 맨위로 화면 이동
  const moveToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <SsloMainPresenter tab={tab} handleTab={handleTab} moveToTop={moveToTop} />
  );
};

export default SsloMainContainer;
