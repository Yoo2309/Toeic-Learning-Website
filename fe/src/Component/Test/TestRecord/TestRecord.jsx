import React, { useContext, useEffect, useState } from "react";
import "./TestRecord.css";
import { UserContext } from "../../../Context/UserContext";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import Heading from "../../Common/Header/Heading";
import { useNavigate } from "react-router-dom";

function TestRecord() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function fetchRecordByUser() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Record/GetRecordByUser/${user.idUser}`,
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
  useEffect(() => {
    if (user.idUser) {
      fetchRecordByUser();
    }
  }, [user.idUser]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="test-record-wrapper">
      <Heading subtitle={"VictoryU"} title={"Lịch sử làm bài"} />
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
        <h2>{user.username}</h2>
      </div>
      <div className="test-record-list">
        <div className="test-record-item">
          <h3>Đề thi thử</h3>
          <h3>Điểm số</h3>
          <h3>Ngày làm bài</h3>
        </div>
        {records &&
          records.map((record, index) => {
            return (
              <div key={index} className="test-record-item">
                <div>{record.testName}</div>
                <div>{record.totalScore}</div>
                <div>{record.createDate}</div>
                <a href={`/test/result/${record.idRecord}`}>Xem chi tiết</a>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TestRecord;
