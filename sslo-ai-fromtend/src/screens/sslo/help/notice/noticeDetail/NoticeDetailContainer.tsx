import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyPageContactDetailPresenter from "./NoticeDetailPresenter";
import helpApi, { INotice } from "../../../../../api/helpApi";
import { getFormattedDate } from "../../../../../utils";

const NoticeDetailContainer = () => {
  const [notice, setNotice] = useState<INotice>();

  // ! notice ID를 URL로부터 Get
  const { nId } = useParams();
  useEffect(() => {
    console.log(nId);
  }, []);

  const getNotice = async () => {
    const res = await helpApi.getSearchNotice({
      notice_id: parseInt(nId),
    });
    if (res && res.status === 200) {
      console.log(res.data);
      const notice: INotice = {
        notice_id: parseInt(nId),
        notice_type: res.data[0].notice_type,
        notice_title: res.data[0].notice_title,
        notice_contents: res.data[0].notice_contents,
        notice_date: getFormattedDate(res.data[0].created),
      };
      setNotice(notice);
      console.log(notice);
    }
  };

  useEffect(() => {
    if (nId) {
      getNotice();
    }
  }, [nId]);

  return <MyPageContactDetailPresenter notice={notice} />;
};

export default NoticeDetailContainer;
