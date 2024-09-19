import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import "./TestList.css";
import { toast } from "react-toastify";

function TestList({ testType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tests, setTest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function fetchTests(id) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Test/GetAllTestByType/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setTest(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    if (testType) {
      fetchTests(testType);
    } else {
      fetchTests(id);
    }
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="test-wrapper">
      <div className="container test-list">
        <Heading
          subtitle="VictoryU"
          title={`
            Kiểm tra ${testType || id} TOEIC`}
        />
        {isLoading ? <Loader /> : <></>}
        <div className="test-grid-wrapper">
          <div className="test-grid">
            {tests &&
              tests.map((test, index) => {
                return (
                  <div
                    className="test-item"
                    key={index}
                    onClick={() => navigate(`/test/${test.idTest}`)}
                  >
                    <img
                      src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-online-test-online-education-flaticons-lineal-color-flat-icons-2.png"
                      alt=""
                    />
                    <div className="test-title">{test.name}</div>
                    <div className="test-info">
                      <div>
                        <div className="test-info-title">Thời gian</div>
                        <div className="test-info-item">{`${
                          id === "miniTest" ? "60 phút" : "120 phút"
                        }`}</div>
                      </div>
                      <div>
                        <div className="test-info-title">Số câu hỏi</div>
                        <div className="test-info-item">
                          {id === "miniTest" ? "100 câu" : "200 câu"}
                        </div>
                      </div>
                    </div>
                    {test.isVip ? (
                      <div style={{ position: "absolute", top: 8, right: 8 }}>
                        <img
                          width="54"
                          height="54"
                          src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-vip-music-festival-flaticons-flat-flat-icons.png"
                          alt=""
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestList;
