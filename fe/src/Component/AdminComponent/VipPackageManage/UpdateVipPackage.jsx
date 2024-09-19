import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./AddUser.css";
import { UserContext } from "../../../Context/UserContext";

function UpdateVipPackage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { idPackage } = useParams();
  const [vipPackage, setVipPackage] = useState({});
  const [data, setData] = useState(() => ({
    name: "",
    description: "",
    price: "",
    duration: "",
  }));
  const [isLoading, setIsLoading] = useState(false);
  async function getVipPackageById() {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/GetVipPackageById/${idPackage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      const dataVipPack = await response;
      setVipPackage(dataVipPack);
      if (!response.ok) {
        toast.error(`Get gói VIP thất bại`);
      } else {
        const data = await response?.json();
        setVipPackage(data);
        setData(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function handleUpdateVipPackage(data) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/UpdateVipPackage/${idPackage}&&${user.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      setIsLoading(false);
      if (response.ok) toast.success("Cập nhất gói VIP thành công");
      else {
        toast.error("Cập nhất gói VIP thất bại", {});
      }
    } catch (error) {
      toast.error(`${error}`);
    }
    navigate(`/admin/vip-package`);
  }

  function changeInput(e) {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  }

  function validateData(data) {
    return true;
  }

  function clickSubmit() {
    // Validate data
    if (validateData(data)) {
      handleUpdateVipPackage(data);
    }
  }
  useEffect(() => {
    if (user) {
      getVipPackageById();
    }
  }, [user]);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="add-lesson-wrapper">
      <div className="professor-board-header">
        <div className="professor-managment-title">
          <h3 style={{ marginLeft: "1rem" }}>CẬP NHẬT GÓI VIP</h3>
        </div>
        <img
          onClick={() => navigate(`/admin/vip-package`)}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
      </div>
      <div className="add-vip-package-form-wrapper">
        <form>
          <div>
            <h3>Tên gói</h3>
            <input
              defaultValue={vipPackage.name}
              placeholder="Nhập tên gói"
              id="name"
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Mô tả</h3>
            <input
              defaultValue={vipPackage.description}
              placeholder="Nhập mô tả"
              id="description"
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Giá</h3>
            <input
              defaultValue={vipPackage.price}
              placeholder="Nhập giá"
              id="price"
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Thời hạn</h3>
            <input
              defaultValue={vipPackage.duration}
              placeholder="Nhập thời hạn (số tháng)"
              id="duration"
              onChange={changeInput}
            />
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button
              onClick={clickSubmit}
              type="submit"
              className="professor-add-lesson-btn"
            >
              Cập nhật gói vip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateVipPackage;
