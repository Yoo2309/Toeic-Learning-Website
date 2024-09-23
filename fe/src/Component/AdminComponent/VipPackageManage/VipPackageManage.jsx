import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./VipPackageManage.css";
import { showDeleteWarning } from "../../Common/Alert/Alert";

function VipPackageManage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [vipPackages, setVipPackages] = useState([]);
  async function fetchVipPackages() {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/GetAllVipPackages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Lấy thông tin gói VIP thất bại`);
      } else {
        const data = await response?.json();
        setVipPackages(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  async function deleteVipPackageById(id) {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/DeleteVipPackage/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Xóa gói VIP thất bại", {});
      } else {
        toast.success("Xóa gói VIP thành công");
        fetchVipPackages();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    fetchVipPackages();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="professor-lesson-list">
      <div className="professor-managment-sub-title">
        <h3 style={{ paddingLeft: "10px" }}>QUẢN LÝ GÓI VIP</h3>
      </div>

      <div className="professor-add-button-wrapper">
        <img
          onClick={() => navigate("/admin")}
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png"
          alt="reply-arrow"
        />
        <div
          className="professor-add-button"
          onClick={() => navigate(`/admin/vip-package/add`)}
        >
          <img
            width="34"
            height="34"
            src="https://img.icons8.com/doodle/48/add.png"
            alt="add"
          />
          <h3>THÊM GÓI VIP MỚI</h3>
        </div>
      </div>
      <div className="vipPackageList-wrapper">
        <div className="vipPackageList-item">
          <div>
            <h2>TÊN GÓI</h2>
          </div>
          <div>
            <h2>MÔ TẢ</h2>
          </div>
          <div>
            <h2>GIÁ</h2>
          </div>
          <div>
            <h2>THỜI HẠN</h2>
          </div>
        </div>
        {vipPackages &&
          vipPackages.map((item, index) => {
            return (
              <div key={index} className="vipPackageList-item">
                <div>
                  <h2>{item?.name}</h2>
                </div>
                <div>
                  <h2>{item?.description}</h2>
                </div>
                <div>
                  <h2>{item?.price}</h2>
                </div>
                <div>
                  <h2>{item?.duration}</h2>
                </div>
                <div className="btn-wrapper">
                  <button
                    className="delete-btn"
                    onClick={() =>
                      showDeleteWarning(() =>
                        deleteVipPackageById(item.idPackage)
                      )
                    }
                  >
                    Xóa
                  </button>
                  <button
                    className="update-btn"
                    onClick={() =>
                      navigate(`/admin/vip-package/update/${item.idPackage}`)
                    }
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default VipPackageManage;
