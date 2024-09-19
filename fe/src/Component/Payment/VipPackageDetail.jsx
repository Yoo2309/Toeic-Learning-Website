import React, { useContext } from "react";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";
import "./VipPackageIndex.css";
import { UserContext } from "../../Context/UserContext";

function VipPackageDetail() {
  const { id } = useParams();
  const [vipPackage, setVipPackage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [payMethod, setPayMethod] = useState("MOMO");
  const [payUrl, setPayUrl] = useState("");
  const { user } = useContext(UserContext);

  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  useEffect(() => {
    async function fetchVipPackage() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL ?? "/api"
          }/VipPackage/GetVipPackageById/${id}`
        );
        setIsLoading(false);
        if (!response.ok) {
          const errorData = await response?.json();
          toast.error(`${errorData.message}`);
        } else {
          const data = await response?.json();
          setVipPackage(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchVipPackage();
  }, [id]);
  if (isLoading) {
    return <Loader />;
  }
  const handlePayMoMo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Payment/CreateMoMoPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.idUser,
            idPackage: id,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response?.json();
      window.location = data.payUrl;
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  const handlePayVnPay = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Payment/CreateVNPayPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.idUser,
            idPackage: id,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      }
      const data = await response?.json();
      window.location = data.payUrl;
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  return (
    <div>
      <div className="vip-package-index">
        <div className="lr-card">
          <Heading subtitle={vipPackage.name} title="Chi tiết gói vip" />
          <div className="card-wrapper-container">
            <div className="card-wrapper">
              <div className="detail">
                <div className="detail-content">
                  <div className="image">
                    <img
                      width="100"
                      height="100"
                      src="https://img.icons8.com/fluency/100/vip.png"
                      alt="vip"
                    />
                  </div>
                  <h2>{vipPackage.name}</h2>
                  <p>Mô tả: {vipPackage.description}</p>
                  <h2>Thời hạn: {vipPackage.duration} tháng</h2>
                  <p>Giá: {formatter.format(vipPackage.price)}</p>
                </div>
              </div>
              <div className="pay">
                <div className="detail-content">
                  <h1>Mua gói</h1>
                  <h2>Phương thức thanh toán</h2>
                  <div className="radio-container">
                    <input
                      type="radio"
                      id="MOMO"
                      name="payMethod"
                      value="MOMO"
                      checked={payMethod === "MOMO"}
                      onChange={() => setPayMethod("MOMO")}
                    />
                    <h2 htmlFor="MOMO">Ví Momo</h2>
                    <input
                      type="radio"
                      id="VNPAY"
                      name="payMethod"
                      value="VNPAY"
                      checked={payMethod === "VNPAY"}
                      onChange={() => setPayMethod("VNPAY")}
                    />

                    <h2 htmlFor="VNPAY">VN Pay</h2>
                  </div>
                  {payMethod === "MOMO" && (
                    <button
                      className="pay-btn"
                      onClick={() => {
                        handlePayMoMo();
                      }}
                    >
                      Thanh Toán MoMo
                    </button>
                  )}
                  {payMethod === "VNPAY" && (
                    <button
                      className="pay-btn"
                      onClick={() => {
                        handlePayVnPay();
                      }}
                    >
                      Thanh Toán VNPay
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VipPackageDetail;
