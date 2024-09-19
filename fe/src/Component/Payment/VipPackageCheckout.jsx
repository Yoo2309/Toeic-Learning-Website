import React, { useContext } from "react";
import Heading from "../Common/Header/Heading";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Common/Loader/Loader";
import { toast } from "react-toastify";
import "./VipPackageCheckout.css";
import { UserContext } from "../../Context/UserContext";

export default function VipPackageCheckout() {
  const { state } = useParams();
  const { user, loginContext } = useContext(UserContext);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  async function fetchPayment() {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Payment/GetAllPaymentsByUserIdOrderByDate/${user.idUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`, {});
      } else {
        const data = await response?.json();
        setPayments(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }

  useEffect(() => {
    if (user && user.idUser) {
      fetchPayment();
    }
  }, [user]);

  async function RenewVIPToken() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Authen/RenewToken`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData}`, {});
      } else {
        const data = await response?.json();
        loginContext(data.token);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error}`);
    }
  }

  useEffect(() => {
    if (state === "success") {
      RenewVIPToken();
    }
  }, [state]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="payment-card-wrapper">
      {state === "fail" && payments[0] && (
        <div className="info-payment-callback">
          <h1>Thanh toán gói vip thất bại</h1>
          <p>Id gói: {payments[0].idPackage}</p>
          <h2>Gói {payments[0].package}</h2>
          <p>Số tiền: {formatter.format(payments[0].paymentAmount)}</p>
          <p>Phương thức thanh toán: {payments[0].method}</p>
        </div>
      )}
      {state === "success" && payments[0] && (
        <div className="info-payment-callback">
          <h1>Thanh toán gói vip thành công</h1>
          <p>Id gói: {payments[0].idPackage}</p>
          <h2>Gói {payments[0].package}</h2>
          <p>Số tiền: {formatter.format(payments[0].paymentAmount)}</p>
          <p>Phương thức thanh toán: {payments[0].method}</p>
          <p>Thời gian: {payments[0].paymentDate}</p>
        </div>
      )}
      <section>
        <div className="payment-card">
          <Heading subtitle="Lịch sử thanh toán" />
          <div className="payment-wrapper-container">
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => {
                return (
                  <div key={index} className="card">
                    <div className="card-content">
                      <div className="image">
                        <img
                          src="https://as1.ftcdn.net/v2/jpg/06/22/00/06/1000_F_622000668_5w6IBcBLiXklwFi7ClnhBJJjnWb1LJu8.jpg"
                          alt=""
                        />
                      </div>
                      <div className="detail-payment">
                        <h2>Gói {payment.package}</h2>
                        <p>
                          Số tiền: {formatter.format(payment.paymentAmount)}
                        </p>
                        <p>Phương thức thanh toán: {payment.method}</p>
                        <p>Thời gian mua: {payment.paymentDate}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>Không có lịch sử thanh toán</h1>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
