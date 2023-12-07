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
  const [vipPackage, setVipPackage] = useState({})
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
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://localhost:7112/api/Admin/GetVipPackageById/${idPackage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      setIsLoading(false);
      const dataVipPack = await response;
      console.log(dataVipPack);
      setVipPackage(dataVipPack);
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
      setVipPackage(data);
      setData(data);
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
  async function handleUpdateVipPackage(data) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://localhost:7112/api/Admin/UpdateVipPackage/${idPackage}&&${user.idUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );
      setIsLoading(false);
      if (response.ok)
        toast.success("Update vip package successfully", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      else
        toast.error("Update vip package failded", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    } catch (error) {
      console.log(error);
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
  useEffect(()=>{
    if(user)
    {
      getVipPackageById();
    }
  },[user])
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='add-lesson-wrapper'>
      <div className='professor-board-header'>
        <div className='professor-managment-title'>
          <h3 style={{ marginLeft: "1rem" }}>CẬP NHẬT GÓI VIP</h3>
        </div>
        <img
          onClick={() => navigate(`/admin/vip-package`)}
          width='50'
          height='50'
          src='https://img.icons8.com/ios-filled/50/2d9358/reply-arrow.png'
          alt='reply-arrow'
        />
      </div>
      <div className='add-vip-package-form-wrapper'>
        <form>
          <div>
            <h3>Tên gói</h3>
            <input
              defaultValue={vipPackage.name}
              placeholder='Nhập tên gói'
              id='name'
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Mô tả</h3>
            <input
              defaultValue={vipPackage.description}
              placeholder='Nhập mô tả'
              id='description'
              onChange={changeInput}
            />
          </div>
          <div>
            <h3>Giá</h3>
            <input defaultValue={vipPackage.price} placeholder='Nhập giá' id='price' onChange={changeInput} />
          </div>
          <div>
            <h3>Thời hạn</h3>
            <input
              defaultValue={vipPackage.duration}
              placeholder='Nhập thời hạn (số tháng)'
              id='duration'
              onChange={changeInput}
            />
          </div>
          <input
            type='button'
            value='Cập nhật gói vip'
            className='professor-add-lesson-btn'
            onClick={clickSubmit}
          />
        </form>
      </div>
    </div>
  );
}

export default UpdateVipPackage;
