import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../Common/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { get } from "lodash";

function UserProfile() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isloading, setIsLoading] = useState(false);
  const [userResponse, setUserResponse] = useState({
    username: "john_doe",
    email: "john@example.com",
    fullname: "John Doe",
    gender: false,
    phone: "",
    dateOfBirth: "1990-01-01",
    imageURL: "",
  });
  const [avaPreview, setAvaPreview] = useState("");
  const {
    register: userData,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Authen/GetProfile?id=${id}`,
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
        const errorData = await response.json();
        toast.error(`${errorData}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const data = await response.json();
        setUserResponse(data);
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  async function handleUpdateUser(data) {
    try {
      const formData = new FormData();
      formData.append("FullName", data.fullname);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("Gender", Boolean(data.gender));
      console.log(Boolean(data.gender))
      formData.append("PhoneNumber", data.phonenumber);
      if (!data.imageURL) {
      } else {
        if (
          data.imageURL[0] instanceof File ||
          data.imageURL[0] instanceof Blob
        ) {
          formData.append("NewImage", data.imageURL[0]);
        } else {
          formData.append("OldImage", data.imageURL);
        }
      }
      formData.append("Enable2FA", false);
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Authen/Update-Profile`,
        {
          method: "PUT",    
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error(`Cập nhật thông tin thất bại`, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      toast.success("Cập nhật thông tin thành công", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 10000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getUser();
      // window.location.reload();
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
    if (token) {
      getUser();
    }
  }, []);
  const OnchangeAva = (e) => {
    let objectURL;
    if (
      e.target.files[0] instanceof File ||
      e.target.files[0] instanceof Blob
    ) {
      objectURL = URL.createObjectURL(e.target.files[0]);
      setAvaPreview(objectURL);
      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  };
  useEffect(() => {
    if (Object.keys(userResponse).length) {
      Object.keys(userResponse).forEach((fieldName) => {
        setValue(fieldName, userResponse[fieldName]);
      });
    }
  }, [userResponse]);
  useEffect(() => {
    setAvaPreview(userResponse.imageURL);
  }, [userResponse]);
  if (!user.auth) {
    navigate("/login");
  }
  if (isloading) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-between flex-col my-5 ">
      <form
        onSubmit={handleSubmit(handleUpdateUser)}
        className="bg-white px-10 pb-10 pt-2 rounded-md w-[500px] flex flex-col"
      >
        <div className="text-2xl flex justify-center m-4">
          <h2>Thông tin User</h2>
        </div>
        <div className="mb-2">
          {/* <error>
              {errors.imageURL?.type === "required" && (
                <span className="text-red-600">
                  Không được để trống ảnh đại diện
                </span>
              )}
            </error> */}
          {avaPreview && avaPreview!=="null"&& (
            <div className="flex flex-col items-center">
              <img src={avaPreview} alt="" className="w-64 h-64" />
            </div>
          )}
          <input
            type="file"
            accept=".jpg, .png"
            className="p-1 border rounded-md w-full"
            {...userData("imageURL")}
            onChange={(e) => OnchangeAva(e)}
          />
        </div>
        <div className="mb-2">
          <div className="italic">Username</div>
          <input
            type="text"
            className="p-1 disabled:bg-white border rounded-md w-full"
            disabled={true}
            {...userData("username", { required: true })}
          />
        </div>
        <div className="mb-2">
          <div className="italic">Email</div>
          <input
            type="text"
            className={" disabled:bg-white p-1 border rounded-md w-full"}
            disabled={true}
            {...userData("email", { required: true })}
          />
        </div>
        <div className="mb-2">
          <div className="italic">Họ và tên</div>
          <input
            type="text"
            className="p-1 border rounded-md w-full"
            {...userData("fullname", { required: true })}
          />
          <error>
            {errors.fullname?.type === "required" && (
              <span className="text-red-600">
                Không được để trống họ và tên
              </span>
            )}
          </error>
        </div>
        <div className="mb-2">
          <div className="italic">Giới tính</div>
          <select
            className="p-1 border rounded-md w-full"
            onChange={()=>console.log(getValues("gender"))}
            {...userData("gender", { required: true })}
          >
            <option value={false}>Nam</option>
            <option value={true}>Nữ</option>
          </select>
        </div>

        <div className="mb-2">
          <div className="italic">Số điện thoại</div>
          <input
            type="text"
            className="p-1 border rounded-md w-full"
            {...userData("phonenumber", { required: true })}
          />
          <error>
            {errors.phonenumber?.type === "required" && (
              <span className="text-red-600">
                Không được để trống số điện thoại
              </span>
            )}
          </error>
        </div>
        <div className="mb-2">
          <div className="italic">Ngày tháng năm sinh</div>
          <input
            type="date"
            className="p-1 border rounded-md w-full"
            {...userData("dateOfBirth", { required: true })}
          />
          <error>
            {errors.dateOfBirth?.type === "required" && (
              <span className="text-red-600">
                Không được để trống ngày sinh
              </span>
            )}
          </error>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="send-otp-submit">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;
