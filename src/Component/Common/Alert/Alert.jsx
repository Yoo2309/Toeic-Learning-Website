import Swal from "sweetalert2";

export const showDeleteWarning = (onDeleteCallback) => {
  Swal.fire({
    title: "Bạn chắc chắn xóa bản ghi này?",
    text: "Bạn sẽ không thể phục hồi dữ liệu nếu xóa!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "Đóng",
    confirmButtonText: "Xóa",
  }).then((result) => {
    if (result.isConfirmed) {
      onDeleteCallback();
    }
  });
};
export const showSubmitWarning = (onSubmitCallback) => {
  Swal.fire({
    title: "Bạn chắc chắn muốn nộp bài?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "Làm tiếp",
    confirmButtonText: "Nộp bài",
  }).then((result) => {
    if (result.isConfirmed) {
      onSubmitCallback();
    }
  });
};  
export const TestCancel = (onDeleteCallback) => {
  Swal.fire({
    title: "Bạn chắc chắn rời khỏi bài thi?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "Quay lại",
    confirmButtonText: "Rời khởi",
  }).then((result) => {
    if (result.isConfirmed) {
      onDeleteCallback();
    }
  });
};