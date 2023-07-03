import React from "react";
import "../../css/sslo/sslo_common.scoped.css";
import "../../css/sslo/sslo_main.scoped.css";
import sslologo from "../../assets/images/sslo/main-sslo-logo.svg";
import { Link } from "react-router-dom";
import { tosURL, privacyPolicyURL, footerInfo } from '../ConstantData';

const SsloFooter = () => {
  return (
    <footer id="footer">
      <div className="footer-text" id="container">
        <div className="footer-left">
          <img src={sslologo} alt="" />
        </div>
        <div className="footer-right">
          <ul className="personal">
            <li>
              <a href={tosURL} target="_blank">
                서비스이용약관
              </a>
            </li>
            <li className="bar">|</li>
            <li>
              <a href={privacyPolicyURL} target="_blank">
                개인정보처리방침
              </a>
            </li>
            <li className="bar">|</li>
            <li>
              <Link to="sslo/help/inquiry">제휴문의</Link>
            </li>
          </ul>
          <div className="info">
            <pre>{footerInfo}</pre>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SsloFooter;
