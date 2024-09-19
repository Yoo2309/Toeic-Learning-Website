import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Common/Loader/Loader";
import "./VipPackageIndex.css";
import { Link } from "react-router-dom";
import Heading from "../Common/Header/Heading";
import { UserContext } from "../../Context/UserContext";

function VipPackage() {
  const [vipPackages, setVipPackages] = useState([]);
  const [vipExpire, setVipExpire] = useState();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });

  async function fetchVipPackage() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/VipPackage/GetAllVipPackages`
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Fetch API Failed`, {});
      } else {
        const data = await response?.json();
        setVipPackages(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }
  async function fetchVipExpireTime() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Payment/GetExpireTimeVipStudent/${user.idUser}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Fetch Failed`, {});
      } else {
        const data = await response?.json();
        setVipExpire(data.vipExpire);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchVipPackage();
  }, []);
  useEffect(() => {
    if (user && user.idUser) {
      fetchVipExpireTime();
    }
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="vip-package-index">
      <section>
        <div className="lr-card">
          <Heading title="NÂNG CẤP TÀI KHOẢN VIP" />
          {vipExpire && (
            <div className="info-payment-callback">
              <h1>Vip hết hạn vào ngày {vipExpire}</h1>
            </div>
          )}
          <div className="card-wrapper-container">
            <div className="card-wrapper">
              {vipPackages && vipPackages.length > 0 ? (
                vipPackages.map((vipPackage, index) => {
                  return (
                    <div key={index} className="card">
                      <Link to={`/vippackage-detail/${vipPackage.idPackage}`}>
                        <div className="card-content">
                          <div className="image">
                            <img
                              width="100"
                              height="100"
                              src="https://img.icons8.com/fluency/100/vip.png"
                              alt="vip"
                            />
                          </div>
                          <h2>{vipPackage.name}</h2>
                          <p>Giá: {formatter.format(vipPackage.price)}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VipPackage;
