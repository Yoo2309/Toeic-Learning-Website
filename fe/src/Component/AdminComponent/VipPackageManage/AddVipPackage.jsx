import _ from "lodash";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import "./AddUser.css";
import { UserContext } from "../../../Context/UserContext";
import { useForm } from "react-hook-form";

function AddVipPackage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    register: new_package,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddVipPackage(data) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Admin/AddVipPackage?userId=${user.idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      setIsLoading(false);
      if (response.ok) toast.success("Thêm gói VIP thành công");
      else toast.error("Thêm gói VIP thất bại", {});
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
    navigate(`/admin/vip-package`);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="add-lesson-wrapper">
      <div className="professor-board-header">
        <div className="professor-managment-title">
          <h3 style={{ marginLeft: "1rem" }}>THÊM GÓI VIP MỚI</h3>
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
        <form onSubmit={handleSubmit(handleAddVipPackage)}>
          <div>
            <h3>Tên gói</h3>
            <input
              placeholder="Nhập tên gói"
              {...new_package("name", { required: true })}
            />
            <error>
              {errors.name?.type === "required" &&
                "Không được để trống tên gói"}
            </error>
          </div>
          <div>
            <h3>Mô tả</h3>
            <input
              placeholder="Nhập mô tả"
              {...new_package("description", { required: true })}
            />
            <error>
              {errors.description?.type === "required" &&
                "Không được để trống mô tả"}
            </error>
          </div>
          <div>
            <h3>Giá</h3>
            <input
              placeholder="Nhập giá"
              {...new_package("price", { required: true })}
            />
            <error>
              {errors.price?.type === "required" && "Không được để trống giá"}
            </error>
          </div>
          <div>
            <h3>Thời hạn</h3>
            <input
              placeholder="Nhập thời hạn (tháng)"
              {...new_package("duration", { required: true })}
            />
            <error>
              {errors.duration?.type === "required" &&
                "Không được để trống thời hạn"}
            </error>
          </div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <button type="submit" className="professor-add-lesson-btn">
              Thêm gói VIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVipPackage;
