import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Loader from "../../Common/Loader/Loader";
import "../../ProfessorComponent/Common/ProfessorHome.css";
import { toast } from "react-toastify";

function AdminHome() {
  const [isloading, setIsLoading] = useState(false);

  const ExportScript = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL ?? "/api"
        }/SQLScriptGenerator/generate`,
        {
          method: "POST",
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        toast.error("Trích xuất dữ liệu thất bại", {});
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const contentDisposition = response.headers.get("content-disposition");
        let filename = "Export_Data";
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "");
          }
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  if (isloading) {
    <Loader fullLoad={true} />;
  }

  return (
    <main className="main-container">
      <div className="main-title">
        <h2 style={{ textAlign: "center", width: "100%" }}>
          TRANG QUẢN TRỊ VIÊN
        </h2>
        <button
          style={{
            width: 150,
            height: 50,
            border: "none",
            borderRadius: "50px",
            background: "#003150",
            color: "#fff",
            fontWeight: 600,
            margin: "10px 0",
            cursor: "pointer",
          }}
          onClick={() => {
            ExportScript();
          }}
        >
          Export Data
        </button>
      </div>
      <Outlet />
    </main>
  );
}

export default AdminHome;
