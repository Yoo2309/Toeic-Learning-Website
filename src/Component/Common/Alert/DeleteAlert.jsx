
import Swal from 'sweetalert2';

export const showDeleteWarning = (onDeleteCallback) => {
  Swal.fire({
    title: 'Bạn chắc chắn xóa bản ghi này?',
    text: 'Bạn sẽ không thể phục hồi dữ liệu nếu xóa!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Đóng',
    confirmButtonText: 'Xóa',
  }).then((result) => {
    if (result.isConfirmed) {
      onDeleteCallback(); 
    }
  });
};
