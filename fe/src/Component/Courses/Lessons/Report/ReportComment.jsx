import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserContext } from "../../../../Context/UserContext";
import Loader from "../../../Common/Loader/Loader";
import { formatDateTime } from "../Comment/Comment";

function ReportComment({ toggleModal, modal_on, comment }) {
  const { user } = useContext(UserContext);
  const [isloading, setIsLoading] = useState(false);
  const {
    register: reportData,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function handleReport(data) {
    const myDate = formatDateTime();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Report/AddReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            idComment: comment.idComment,
            idUser: user.idUser,
            reason: data.reason,
            reportDate: myDate,
            checkNote: "",
            commentDeleted: false,
            isCheck: false,
          }),
        }
      );
      setIsLoading(false);
      toggleModal();
      if (!response.ok) {
        toast.error(`${"Báo cáo bình luật thất bại"}`, {});
      } else {
        toast.info("Đã báo cáo bình luận");
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
    }
  }

  if (isloading) {
    return <Loader />;
  }
  return (
    <div className="">
      {modal_on && (
        <div className="fixed w-screen h-screen top-0 left-0 right-0 bottom-0 z-5 flex justify-center overflow-auto">
          <div onClick={toggleModal} className="overlay"></div>
          <div className=" fixed top-[50vh] left-[50vw] z-5 transform -translate-x-1/2 -translate-y-1/2 h-fit bg-primary-50 p-4 max-w-lg min-w-xs rounded-xl">
            <div onClick={toggleModal} className="flex flex-end">
              <svg
                onClick={toggleModal}
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="34"
                height="34"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#E04F5F"
                  d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"
                ></path>
                <path
                  fill="#FFF"
                  d="M285,256l72.5-84.2c7.9-9.2,6.9-23-2.3-31c-9.2-7.9-23-6.9-30.9,2.3L256,222.4l-68.2-79.2c-7.9-9.2-21.8-10.2-31-2.3c-9.2,7.9-10.2,21.8-2.3,31L227,256l-72.5,84.2c-7.9,9.2-6.9,23,2.3,31c4.1,3.6,9.2,5.3,14.3,5.3c6.2,0,12.3-2.6,16.6-7.6l68.2-79.2l68.2,79.2c4.3,5,10.5,7.6,16.6,7.6c5.1,0,10.2-1.7,14.3-5.3c9.2-7.9,10.2-21.8,2.3-31L285,256z"
                ></path>
              </svg>
            </div>
            <form
              className="px-5 flex flex-col gap-4"
              onSubmit={handleSubmit(handleReport)}
            >
              <h2 className="text-center">Báo cáo bình luận</h2>
              <div className="text-center max-h-48 overflow-y-auto">
                Bạn đang báo cáo bình luận "{comment.content}"
              </div>
              <div className="h-28 w-full bg-white border-[1px] border-primary-900 rounded-xl flex items-center justify-between">
                <textarea
                  className="w-full resize-none p-0 m-5 g-transparent border-none outline-none text-lg font-medium text-black"
                  type="text"
                  placeholder="Lý do..."
                  {...reportData("reason", { required: true })}
                />
              </div>
              <error>
                {errors.reason?.type === "required" &&
                  "Không được để trống lý do"}
              </error>
              <input
                type="submit"
                className="w-full h-12 rounded-full bg-primary-900 text-white font-semibold uppercase cursor-pointer mb-4"
                value="Báo cáo"
              ></input>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportComment;
