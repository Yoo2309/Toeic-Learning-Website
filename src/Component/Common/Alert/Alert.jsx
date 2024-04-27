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
export const ChooseTestMode = (testCallback, simulateCallback, testname) => {
  Swal.fire({
    title: `Làm bài thi ${testname}`,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#3085d6",
    cancelButtonText: "Thi thử",
    confirmButtonText: "Thi giả lập",
    showCloseButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      simulateCallback();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      testCallback();
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