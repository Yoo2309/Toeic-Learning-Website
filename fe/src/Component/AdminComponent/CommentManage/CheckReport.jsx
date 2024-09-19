import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import { formatDateTime } from "../../Courses/Lessons/Comment/Comment";

function CheckReport({ toggleModal, modal_on, report, fetchReport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [checkReport, setCheckReport] = useState({
    isChecked: false,
    checkNote: "",
  });

  const handleEditNode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Report/UpdateReport?idReport=${report.idReport}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idComment: report.idComment,
            idUser: report.idUser,
            reason: report.reason,
            reportDate: formatDateTime(),
            checkNote: checkReport.checkNote,
            isCheck: checkReport.isChecked,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData.message}`);
      } else {
        toast.success("Đã xác nhận");
        toggleModal();
        fetchReport();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {modal_on && (
        <div className="w-screen h-screen top-0 left-0 right-0 bottom-0 fixed z-20">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="w-full h-full flex justify-center items-center">
            <div className=" absolute h-auto bg-slate-100 py-6 px-4 rounded-lg w-[40vw]">
              <div
                onClick={toggleModal}
                className="absolute top-4 right-4 flex justify-end"
              >
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
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditNode();
                }}
              >
                <h2 className="text-center">Xác nhận báo cáo</h2>
                <p>{report.content}</p>
                <div className="h-20 w-full bg-white flex items-center justify-evenly p-2 border-2 rounded-3xl ">
                  <textarea
                    className="w-full h-full text-lg font-semibold text-black pl-2 border-none outline-none"
                    type="text"
                    placeholder="Ghi chú"
                    onChange={(e) => {
                      setCheckReport({
                        ...checkReport,
                        checkNote: e.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "fit-full",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      className="h-5 w-5"
                      type="checkbox"
                      onChange={(e) => {
                        setCheckReport({
                          ...checkReport,
                          isChecked: e.currentTarget.checked,
                        });
                      }}
                    />
                    <div className="font-semibold text-lg ">Có vi phạm</div>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <input
                    type="submit"
                    className="w-60 h-12 bg-primary-900 text-white font-semibold uppercase cursor-pointer mb-2.5 rounded-[50px] border-none"
                    value="Thêm"
                  ></input>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckReport;
