import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../Context/UserContext";
import { toast } from "react-toastify";

function UserProfile() {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [userResponse, setUserResponse] = useState({
    username: "john_doe",
    email: "john@example.com",
    fullname: "John Doe",
    gender: false,
    phone: "123456789",
    dateOfBirth: "1990-01-01",
    imageURL: "https://example.com/avatar.jpg",
  });

  const {
    register: userData,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const getUser = async () => {
    try {
      const response = await fetch(
        `https://localhost:7112/api/Authen/GetProfile/${user.idUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      setUserResponse(data);
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
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("FullName", data.fullname);
      formData.append("DateOfBirth", data.dateOfBirth);
      formData.append("Gender", Boolean(data.gender));
      formData.append("PhoneNumber", data.phone);
      formData.append("ImageURL", data.imageURL[0]);
      formData.append("Enable2FA", false);
      const response = await fetch(
        `https://localhost:7112/api/Authen/Update-Profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
      toast.success("Cập nhật thông tin thành công", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 10000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getUser();
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
    getUser();
  }, []);

  useEffect(() => {
    if (Object.keys(userResponse).length) {
      Object.keys(userResponse).forEach((fieldName) => {
        setValue(fieldName, userResponse[fieldName]);
      });
    }
  }, [userResponse]);

  return (
    <div className="flex items-center justify-between flex-col my-5 ">
      <form
        onSubmit={handleSubmit(handleUpdateUser)}
        className="bg-slate-300 px-10 pb-10 pt-2 rounded-md w-[400px]"
      >
        <div className="text-2xl flex justify-center ">
          <h2>Thông tin User</h2>
        </div>
        <div className="mb-2">
          <div className="italic">Username</div>
          <input
            type="text"
            className="p-1 disabled:bg-white border rounded-md w-full"
            // disabled={true}
            {...userData("username", { required: true })}
          />
        </div>
        <div className="mb-2">
          <div className="italic">Email</div>
          <input
            type="text"
            className={" disabled:bg-white p-1 border rounded-md w-full"}
            // disabled={true}
            {...userData("email", { required: true })}
          />
        </div>
        <div className="mb-2">
          <div className="italic">Fullname</div>
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
          <div className="italic">Gender</div>
          <select
            className="p-1 border rounded-md w-full"
            {...userData("gender", { required: true })}
          >
            <option value={false}>Nam</option>
            <option value={true}>Nữ</option>
          </select>
        </div>

        <div className="mb-2">
          <div className="italic">Phone</div>
          <input
            type="text"
            className="p-1 border rounded-md w-full"
            {...userData("phone", { required: true })}
          />
          <error>
            {errors.phone?.type === "required" && (
              <span className="text-red-600">
                Không được để trống số điện thoại
              </span>
            )}
          </error>
        </div>
        <div className="mb-2">
          <div className="italic">DayOfBirth</div>
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
        <div className="mb-2">
          <div className="italic">AvatarUrl</div>
          <input
            type="file"
            accept=".jpg, .png"
            className="p-1 border rounded-md w-full"
            {...userData("imageURL", { required: true })}
          />
          <error>
            {errors.imageURL?.type === "required" && (
              <span className="text-red-600">
                Không được để trống ảnh đại diện
              </span>
            )}
          </error>
        </div>
        <button
          type="submit"
          className="border bg-black text-white rounded-lg px-2 py-2"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
