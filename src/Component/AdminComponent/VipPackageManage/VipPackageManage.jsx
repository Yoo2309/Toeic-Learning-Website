import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../Context/UserContext";
import Loader from "../../Common/Loader/Loader";
import "./VipPackageManage.css";

function VipPackageManage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [vipPackages, setVipPackages] = useState([]);
  async function fetchVipPackages() {
    const token = localStorage.getItem("token")
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://localhost:7112/api/Admin/GetAllVipPackages`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      setIsLoading(false);
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
      setVipPackages(data);
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

  async function deleteVipPackageById(id) {
    const token = localStorage.getItem("token")
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7112/api/Admin/DeleteVipPackage/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({}),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(response);
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.success("Delete Vip Package Successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchVipPackages();
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  useEffect(() => {
    fetchVipPackages();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='professor-lesson-list'>
      <div className='professor-managment-sub-title'>
        <h3 style={{ paddingLeft: "10px" }}>QUẢN LÝ GÓI VIP</h3>
      </div>

      <div className='professor-add-button-wrapper'>
        <img
          onClick={() => navigate("/admin")}
          width='50'
          height='50'
          src='https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png'
          alt='reply-arrow'
        />
        <div
          className='professor-add-button'
          onClick={() => navigate(`/admin/vip-package/add`)}
        >
          <img
            width='34'
            height='34'
            src='https://img.icons8.com/doodle/48/add.png'
            alt='add'
          />
          <h3>THÊM GÓI VIP MỚI</h3>
        </div>
      </div>
      <div className='vipPackageList-wrapper'>
            <div className='vipPackageList-item'>
                      <div><h2>TÊN GÓI</h2></div>
                      <div><h2>MÔ TẢ</h2></div>
                      <div><h2>GIÁ</h2></div>
                      <div><h2>THỜI HẠN</h2></div>
              </div>
        {vipPackages &&
          vipPackages.map((item, index) => {
            return (
              <div key={index} className='vipPackageList-item'>
                <div><h2>{item?.name}</h2></div>
                <div><h2>{item?.description}</h2></div>
                <div><h2>{item?.price}</h2></div>
                <div><h2>{item?.duration}</h2></div>
                <div className='btn-wrapper'>
                  <button
                    className='delete-btn'
                    onClick={() => deleteVipPackageById(item.idPackage)}
                  >
                    Xóa
                  </button>
                  <button
                    className='update-btn'
                    onClick={() => navigate(`/admin/vip-package/update/${item.idPackage}`)}
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
