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
  const [isLoading, setIsLoading] = useState(true);

  const formatter = new Intl.NumberFormat('vi', {
    style: 'currency',
    currency: 'VND',
  });

  async function fetchVipPackage() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        "https://localhost:7112/api/VipPackage/GetAllVipPackages"
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      const data = await response.json();
      setVipPackages(data);
      setIsLoading(false);
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
  async function fetchVipExpireTime() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        
        `https://localhost:7112/api/Payment/GetExpireTimeVipStudent/${user.idUser}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`${errorData.message}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      const data = await response.json();
      setVipExpire(data.vipExpire);
      setIsLoading(false);
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
  useEffect(() => {
    fetchVipPackage();
  }, []);
  useEffect(() => {
    if (user && user.idUser) {
      fetchVipExpireTime();
      console.log(user.idUser);
    }
  }, [user]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="lr-card-wrapper">
      {vipExpire && 
      <div className="info-payment-callback">
        <h1>Vip hết hạn vào ngày {vipExpire}</h1>     
      </div>}
      <section>
        <div className="lr-card">
          <Heading subtitle="Mua gói vip"/>
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
                              src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-online-course-university-flaticons-flat-flat-icons-3.png"
                              alt=""
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
