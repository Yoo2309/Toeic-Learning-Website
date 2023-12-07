import React from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import "./TestList.css";
import { toast } from "react-toastify";

function TestList({ testType }) {
  const { id } = useParams();
  const [tests, setTest] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  async function fetchTests(id) {
    try {
      const response = await fetch(
        `https://localhost:7112/api/Test/GetAllTestByType/${id}`
      );
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT, // Vị trí hiển thị
          autoClose: 5000, // Tự động đóng sau 3 giây
          closeOnClick: true, // Đóng khi click
          pauseOnHover: true, // Tạm dừng khi di chuột qua
          draggable: true, // Có thể kéo thông báo
        });
      }
      const data = await response.json();
      setTest(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="test-wrapper">
      <div className="container test-list">
        <Heading
          subtitle="VictoryU"
          title={`
            Kiểm tra ${testType || id} TOEIC`}
        />
        <div className="test-grid-wrapper">
          <div className="test-grid">
            {tests &&
              tests.map((test, index) => {
                return (
                  <Link to={`/test/${test.idTest}`}>
                    <div key={index} className="test-item">
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
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestList;
