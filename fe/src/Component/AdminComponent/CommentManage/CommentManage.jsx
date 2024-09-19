import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../Common/Loader/Loader";
import CheckReport from "./CheckReport";

function CommentManage() {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState([]);
  const [displayReports, setDisplayReports] = useState([]);

  const [selectedCheckbox, setSelectedCheckbox] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  async function fetchReports() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Report/GetAllReports`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData}`);
      } else {
        const data = await response?.json();
        setReports(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchFaliedReports() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Report/GetAllFalseReports/false`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData}`);
      } else {
        const data = await response?.json();
        setReports(data);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  async function fetchDeleteReports(id) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/Report/DeleteReport?idReport=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const errorData = await response?.json();
        toast.error(`${errorData}`);
      } else {
        toast.success("Xóa báo cáo thành công");
        fetchReports();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  }
  useEffect(() => {
    fetchReports();
    const uncheckFilerInputs = (e) => {
      if (!(e.target instanceof HTMLInputElement)) {
        const filerInputs = document.querySelectorAll("input.filter-btn");
        filerInputs.forEach((input) => {
          input.checked = false;
        });
      }
    };
    document.body.addEventListener("click", uncheckFilerInputs);
    return () => {
      document.body.removeEventListener("click", uncheckFilerInputs);
    };
  }, []);
  useEffect(() => {
    switch (selectedCheckbox) {
      case "All":
        setDisplayReports(reports);
        break;
      case "InCompleted":
        // fetchFaliedReports();
        setDisplayReports(reports.filter((report) => !report.isCheck));
        break;
      case "Done":
        setDisplayReports(reports.filter((report) => report.isCheck));
        break;
      default:
        break;
    }
  }, [selectedCheckbox, reports]);
  if (isLoading) return <Loader />;
  return (
    <Fragment>
      <CheckReport
        modal_on={modal}
        toggleModal={toggleModal}
        report={currentReport}
        fetchReport={fetchReports}
      />
      <div className="mt-5 flex justify-between">
        <h2 className="text-2xl font-semibold leading-tight">
          Danh sách báo cáo bình luận
        </h2>
        <div className="relative">
          <input
            className="filter-btn h-12 w-[168px] absolute top-0 opacity-0 peer z-10"
            type="checkbox"
          />
          <div className="w-[168px] h-12 flex justify-between px-4 py-3 bg-white rounded-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.12)]">
            <div className="text-sm font-HelveticaNeue font-normal text-light_finance-textsub leading-5">
              {selectedCheckbox === "All"
                ? "Tất cả"
                : selectedCheckbox === "Done"
                ? "Đã kiểm tra"
                : "Chưa kiểm tra"}
            </div>
          </div>
          <i className="fa-solid fa-chevron-down fa-xl peer-checked:rotate-180 absolute top-6 right-4"></i>
          <div className="absolute peer-checked:flex hidden top-14 w-[168px] bg-white rounded-lg drop-shadow-[0_4px_4px_rgba(0,0,0,0.12)] flex-col ">
            <div className="self-stretch px-3 py-2 justify-start items-start gap-2 inline-flex">
              <input
                className="w-4 h-4 rounded-sm border border-light_finance-textsub checked:!bg-light_finance-primary"
                type="checkbox"
                value={"All"}
                checked={selectedCheckbox === "All"}
                onChange={(e) => setSelectedCheckbox("All")}
              />
              <div className="text-light_finance-textsub text-sm font-normal font-['Helvetica Neue'] leading-5">
                Tất cả
              </div>
            </div>
            <div className="self-stretch px-3 py-2 justify-start items-start gap-2 inline-flex">
              <input
                className="w-4 h-4 rounded-sm border border-light_finance-textsub checked:!bg-light_finance-primary"
                type="checkbox"
                value={"InCompleted"}
                checked={selectedCheckbox === "InCompleted"}
                onChange={(e) => setSelectedCheckbox("InCompleted")}
              />
              <div className="text-light_finance-textsub text-sm font-normal font-['Helvetica Neue'] leading-5">
                Chưa kiểm tra
              </div>
            </div>
            <div className="self-stretch px-3 py-2 justify-start items-start gap-2 inline-flex">
              <input
                className="w-4 h-4 rounded-sm border border-light_finance-textsub checked:!bg-light_finance-primary"
                type="checkbox"
                value={"Done"}
                checked={selectedCheckbox === "Done"}
                onChange={(e) => setSelectedCheckbox("Done")}
              />
              <div className="text-light_finance-textsub text-sm font-normal font-['Helvetica Neue'] leading-5">
                Đã kiểm tra
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="-mx-4 px-4 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead className="min-w-full">
              <tr className="w-full grid grid-cols-12">
                <th className="col-span-2 p-4 border-b-2 border-gray-200 bg-gray-100 inline-flex items-center text-lg font-semibold text-gray-800 tracking-tight">
                  Người bị báo cáo
                </th>
                <th className="col-span-3 p-4 border-b-2 border-gray-200 bg-gray-100 inline-flex items-center text-lg font-semibold text-gray-800 tracking-tight">
                  Nội dung bình luận
                </th>
                <th className="col-span-3 p-4 border-b-2 border-gray-200 bg-gray-100 inline-flex items-center text-lg font-semibold text-gray-800 tracking-tight">
                  Lý do báo cáo
                </th>
                <th className="col-span-2 p-4 border-b-2 border-gray-200 bg-gray-100 inline-flex items-center text-lg font-semibold text-gray-800 tracking-tight">
                  Ngày báo cáo
                </th>
                <th className="col-span-2 p-4 border-b-2 border-gray-200 bg-gray-100 inline-flex items-center text-lg font-semibold text-gray-800 tracking-tight">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {displayReports?.map((report, index) => (
                <Fragment key={index}>
                  <tr className="w-full grid grid-cols-12">
                    <td className="flex items-center justify-center col-span-2 p-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {report.accusedUsername}
                      </p>
                    </td>
                    <td className="flex items-center col-span-3 p-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {report.content}
                      </p>
                    </td>
                    <td className="flex items-center col-span-3 p-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {report.reason}
                      </p>
                    </td>
                    <td className="flex items-center col-span-2 p-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {report.reportDate}
                      </p>
                    </td>
                    <td className="flex items-center col-span-2 p-3 border-b border-gray-200 bg-white text-sm gap-1">
                      <p
                        className={`w-32 p-2 font-semibold text-center whitespace-no-wrap text-sm rounded-lg ${
                          report.isCheck
                            ? "text-green bg-green bg-opacity-30"
                            : "text-orange-600 bg-orange-600 bg-opacity-10"
                        }`}
                      >
                        {!report.isCheck ? "Chưa kiểm tra" : "Đã kiểm tra"}
                      </p>
                      <div className="relative">
                        <button
                          type="button"
                          className="inline-block text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            className="inline-block h-6 w-6 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" />
                          </svg>
                        </button>
                        <input
                          type="checkbox"
                          className="filter-btn w-full h-full absolute top-0 right-0 z-1 opacity-0 peer cursor-pointer"
                        />
                        {!report.isCheck ? (
                          <div
                            className="hidden peer-checked:block absolute top-3 right-5 w-28 px-4 py-3 bg-rose-800 rounded-xl text-center text-base text-white font-semibold hover:shadow-lg border-[1px] cursor-pointer"
                            onClick={() => {
                              fetchDeleteReports(report.idReport);
                            }}
                          >
                            Xóa
                          </div>
                        ) : (
                          <div
                            className="hidden peer-checked:block absolute top-3 right-5 w-28 px-4 py-3 bg-primary-900 rounded-xl text-white text-center text-base font-semibold hover:shadow-lg border-[1px] cursor-pointer"
                            onClick={() => {
                              toggleModal();
                              setCurrentReport(report);
                            }}
                          >
                            Xác nhận
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}

export default CommentManage;
