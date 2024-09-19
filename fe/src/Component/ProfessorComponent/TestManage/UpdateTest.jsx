import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./UpdateTest.css";
import { UserContext } from "../../../Context/UserContext";
import AddUnit from "./AddUnit";
import { showDeleteWarning } from "../../Common/Alert/Alert";
import HTMLReactParser from "html-react-parser";

function UpdateTest() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [test, setTest] = useState({
    name: "",
    idType: "",
    isVip: false,
  });
  const [testType, setTestType] = useState([]);
  const [testUnits, setTestUnits] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [current_part, setCurrentPart] = useState("");

  const [parts, setParts] = useState([]);

  async function fetchTestType() {
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestType/GetAllTestTypes`
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response?.json();
      setTestType(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function fetchTest() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Test/GetTestById/${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setTest({
        name: data.name,
        idType: data.idType,
        isVip: data.isVip,
      });
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchParts() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestPart/GetAllTestParts`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setParts(data);
      setCurrentPart(data[0].partId);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchTestUnitByPartTest() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestQuestionUnit/GetAllTestQuestionUnitByPart/${current_part}&&${id}`
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      }
      const data = await response?.json();
      setTestUnits(data);
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Test/UpdateTest/${id}&&${user.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idType: test.idType,
            name: test.name,
            isVip: test.isVip,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Chỉnh sửa đề thi thất bại", {});
      } else {
        toast.success("Chỉnh sửa đề thi thành công");
        fetchTest();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const handleDeleteUnit = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/TestQuestionUnit/DeleteTestQuestionUnit/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Xóa unit của đề thi thất bại", {});
      } else {
        toast.success("Xóa unit của đề thi thành công");
        fetchTestUnitByPartTest();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    fetchTest();
    fetchTestType();
    fetchParts();
  }, []);
  useEffect(() => {
    if (current_part !== "") {
      fetchTestUnitByPartTest();
    }
  }, [current_part]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="professor-update-test">
      <div className="professor-board-header">
        <div className="professor-managment-sub-title">
          <h3 style={{ marginLeft: "1rem", paddingRight: "1rem" }}>
            QUẢN LÝ ĐỀ THI THỬ
          </h3>
        </div>
        <img
          onClick={() => navigate("/professor/test")}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
      </div>
      <form className="update-test" onSubmit={handleUpdate}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <div className="input-field">
            <input
              type="text"
              value={test.name}
              onFocus={() => setShowButton(true)}
              onChange={(e) =>
                setTest({
                  ...test,
                  name: e.target.value,
                })
              }
            />
          </div>
          {test.name === "" ? <error>Không được để trống tên</error> : <></>}
        </div>
        {showButton && (
          <select
            className="test-type"
            value={test.idType}
            onChange={(e) =>
              setTest({
                ...test,
                idType: e.target.value,
              })
            }
          >
            {testType &&
              testType.map((type) => {
                return <option value={type.idTestType}>{type.typeName}</option>;
              })}
          </select>
        )}
        {showButton && (
          <div style={{ display: "flex", width: "fit-content", gap: 4 }}>
            <input
              style={{ height: 36, width: 26 }}
              type="checkbox"
              checked={test.isVip}
              onChange={(e) =>
                setTest({
                  ...test,
                  isVip: e.target.checked,
                })
              }
            />
            <div style={{ padding: 4 }}>VIP?</div>
          </div>
        )}
        {showButton && (
          <input type="submit" className="test-submit" value="Cập nhật"></input>
        )}
      </form>
      <div className="test-add-unit-wrapper">
        <div className="tab-header">
          {parts &&
            parts.map((part) => {
              return (
                <div
                  key={part.id}
                  className={`tab-item ${
                    current_part === part.partId ? "tab-index-active" : null
                  }`}
                  onClick={() => setCurrentPart(part.partId)}
                >
                  {part.partName}
                </div>
              );
            })}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {!showForm ? (
            <div
              className="professor-add-button"
              onClick={() => {
                setShowForm(true);
              }}
            >
              <img
                width="34"
                height="34"
                src="https://img.icons8.com/doodle/48/add.png"
                alt="add"
              />
              <h3>THÊM UNIT MỚI</h3>
            </div>
          ) : (
            <img
              onClick={() => setShowForm(false)}
              width="40"
              height="40"
              src="https://img.icons8.com/windows/32/circled-chevron-down.png"
              alt="circled-chevron-down"
            />
          )}
        </div>
        {showForm && (
          <AddUnit
            idTestPart={current_part}
            toggle_modal={setShowForm}
            fetchUnit={fetchTestUnitByPartTest}
          />
        )}
      </div>
      <div className="professor-test-unit-wrapper">
        {testUnits &&
          testUnits.map((testUnit, index) => {
            return (
              <div key={index} className="test-unit-item-wrapper">
                <div className="test-unit-item">
                  <div className="btn-wrapper">
                    <button
                      className="delete-btn"
                      onClick={() =>
                        showDeleteWarning(() =>
                          handleDeleteUnit(testUnit.idQuestionUnit)
                        )
                      }
                    >
                      Xóa
                    </button>
                    <button
                      className="update-btn"
                      onClick={() =>
                        navigate(
                          `/professor/test/unit/${testUnit.idQuestionUnit}`
                        )
                      }
                    >
                      Sửa
                    </button>
                  </div>
                  {testUnit.image && <img src={testUnit.image} alt="" />}
                  {testUnit.audio && (
                    <audio src={testUnit.audio} controls></audio>
                  )}
                  {testUnit.paragraph &&
                    HTMLReactParser(String(testUnit.paragraph))}

                  {testUnit.script && (
                    <>
                      <h4>Transcript</h4>
                      <div>{testUnit.script}</div>
                    </>
                  )}
                  {testUnit.translation && (
                    <>
                      <h4>Bản dịch</h4>
                      <div>{testUnit.translation}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UpdateTest;
