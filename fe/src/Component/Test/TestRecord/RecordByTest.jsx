import React, { useContext, useEffect, useState } from "react";
import "./RecordByTest.css";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import Heading from "../../Common/Header/Heading";

function RecordByTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  const [test, setTest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchRecordByUserTest() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Record/GetRecordByUserTest/${user.idUser}&&${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setRecords(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchTest() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Test/GetTestById/${id}`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        const data = await response?.json();
        setTest(data);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchRecordByUserTest(), fetchTest()]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user.idUser) {
      fetchData();
    }
  }, [user.idUser]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="record-by-test-wrapper">
      <Heading title={test.name}></Heading>
      <div className="test-result-wrapper">
        <div className="test-record-list">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: "1rem 0" }}>Lịch sử làm bài</h2>
            <button
              className="do-test"
              onClick={() => {
                navigate(`/do-test/${id}`);
              }}
            >
              Làm bài thi ngay
            </button>
          </div>
          <div className="test-record-item">
            <h3>Ngày làm bài</h3>
            <h3>Điểm số</h3>
          </div>
          {records &&
            records.map((record, index) => {
              return (
                <div key={index} className="test-record-item">
                  <div>{record.createDate}</div>
                  <div>{record.totalScore}</div>
                  <a href={`/test/result/${record.idRecord}`}>Xem chi tiết</a>
                </div>
              );
            })}
        </div>
        <div style={{ width: "30%" }} className="test-result">
          <div className="test-result-ava">
            <img
              style={{ width: "90%" }}
              src={
                user.ava ||
                "https://img.icons8.com/papercut/100/user-female-circle.png"
              }
              alt=""
            ></img>
          </div>
          <div style={{ fontSize: "18px" }}>{user.username}</div>
          <button
            className="test-history"
            data-testid="test-history"
            onClick={() => {
              navigate("/test/record");
            }}
          >
            Lịch sử làm bài <i className="fa-solid fa-clock-rotate-left"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecordByTest;
