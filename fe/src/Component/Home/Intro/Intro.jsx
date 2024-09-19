import React from "react";
import "./Intro.css";
import Heading from "../../Common/Header/Heading";

function Intro() {
  return (
    <div className="intro-home">
      <div className="intro-card">
          <Heading subtitle="" title="Tổng quan về bài thi TOEIC®" />
        <div className=" cutoff-text">
          <div className="toiec-defination">
            <h2>1. TOEIC® là gì?</h2>
            <p>
              TOEIC® (the Test of English for International Communication) là
              bài kiểm tra đánh giá khả năng sử dụng tiếng Anh trong môi trường
              giao tiếp quốc tế. Kỳ thi thuộc bản quyền của Viện Khảo thí giáo
              dục Hoa Kỳ.{" "}
            </p>
            <p>
              Các câu hỏi trong đề thi TOEIC® liên quan đến các chủ đề như hội
              họp, du lịch, thông báo, email.{" "}
            </p>
          </div>
          <div className="toeic-structure">
            <h2>1. Cấu trúc bài thi TOEIC®</h2>
            <p>
              Bài thi TOEIC® bao gồm hai phần: Đọc và Nghe. Các thí sinh sẽ thi
              phần Đọc hiểu trong thời gian 75 phút và phần nghe trong thời gian
              45 phút. Tổng thời gian cho một bài thi TOEIC® là 120 phút.{" "}
            </p>
            <p>Mỗi phần gồm 100 câu hỏi trắc nghiệm.</p>
            <p>
              Bài thi TOEIC® bao gồm hai phần: Đọc và Nghe. Các thí sinh sẽ thi
              phần Đọc hiểu trong thời gian 75 phút và phần nghe trong thời gian
              45 phút. Tổng thời gian cho một bài thi TOEIC® là 120 phút.{" "}
            </p>
            <table>
              <thead>
                <tr>
                  <td className="col1">Kỹ năng</td>
                  <td className="col2">Phần</td>
                  <td className="col3">Số lượng câu hỏi</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col1" rowSpan={4}>
                    Nghe
                  </td>
                  <td className="col2">Phần 1: Mô tả tranh</td>
                  <td className="col3">6</td>
                </tr>
                <tr>
                  <td className="col2">Phần 2: Hỏi – Đáp</td>
                  <td className="col3">25</td>
                </tr>
                <tr>
                  <td className="col2">Phần 3: Đoạn hội thoại</td>
                  <td className="col3">
                    39 (13 đoạn hội thoại, 3 câu hỏi mỗi đoạn)
                  </td>
                </tr>
                <tr>
                  <td className="col2">Phần 4: Bài nói ngắn</td>
                  <td className="col3">
                    30 (10 bài nói, 3 câu hỏi mỗi bài nói)
                  </td>
                </tr>
                <tr>
                  <td className="col1" rowSpan={4}>
                    Đọc
                  </td>
                  <td className="col2">Phần 5: Hoàn thành câu</td>
                  <td className="col3">30</td>
                </tr>
                <tr>
                  <td className="col2">Phần 6: Hoàn thành đoạn văn</td>
                  <td className="col3">16</td>
                </tr>
                <tr>
                  <td className="col2" rowSpan={2}>
                    Phần 7: Đọc hiểu
                  </td>
                  <td className="col3">
                    Đoạn đơn : 29 ( 10 đoạn đơn, 2-4 câu hỏi mỗi đoạn đơn)
                  </td>
                </tr>
                <tr>
                  <td className="col3">
                    Đoạn đa: 25 (2 đoạn kép + 3 đoạn ba , 5 câu hỏi mỗi đoạn kép
                    và mỗi đoạn ba)
                  </td>
                </tr>
                <tr></tr>
                <tr></tr>
              </tbody>
            </table>
          </div>
          <div className="toiec-benefit">
            <h2>2. Lợi ích của chứng chỉ TOEIC® </h2>
            <p>
              Vậy chứng chỉ TOEIC® mang lại những lợi ích gì cho người học, dưới
              đây là những lợi ích hàng đầu của chứng chỉ TOEIC®.
            </p>
            <h3>2.1. Sở hữu chứng chỉ được công nhận rộng rãi </h3>
            <p>
              Đúng như tên gọi “Bài kiểm tra tiếng Anh giao tiếp quốc tế”, chứng
              chỉ TOEIC® là minh chứng rõ ràng về khả năng giao tiếp tiếng Anh
              của bạn trong môi trường quốc tế. TOEIC® đã được hơn 14000 tổ chức
              tại 160 quốc gia trên thế giới công nhận.{" "}
            </p>
            <h3>2.2. Mở ra nhiều cơ hội việc làm hơn </h3>
            <p>
              Khi thị trường việc làm ngày càng trở nên cạnh tranh, bạn cần phải
              biết cách làm cho mình nổi bật giữa đám đông. Một CV ấn tượng với
              chứng chỉ tiếng Anh quốc tế như TOEIC® sẽ mang lại cho bạn nhiều
              cơ hội việc làm hơn cũng như cho thấy kỹ năng giao tiếp tại nơi
              làm việc của bạn bất kể tuổi tác, giới tính, quốc tịch và xuất
              thân. Bên cạnh đó, việc sở hữu chứng chỉ tiếng Anh còn cho nhà
              tuyển dụng thấy rằng bạn sẵn sàng dành thời gian để nâng cao trình
              độ tiếng Anh cũng như kỹ năng chuyên môn của mình.
            </p>
            <h3>2.3. Tạo cho bạn động lực </h3>
            <p>
              Động lực đóng một vai trò quan trọng trong việc học một ngôn ngữ
              mới. Học ngôn ngữ có thể thúc đẩy động lực và hiệu quả học tập.
              Bằng cách tham gia kỳ thi TOEIC® và cải thiện trình độ tiếng Anh
              của mình, bạn sẽ có thêm động lực để học tập tốt hơn và tiếp tục
              học và sử dụng ngôn ngữ.
            </p>
          </div>
          <div className="popular-question">
            <h2>3. Các câu hỏi thường gặp về bài thi TOEIC® </h2>
            <h3>3.1. Bài kiểm tra TOEIC® đánh giá gì? </h3>
            <p>
              Bài thi TOEIC® Nghe and Đọc đánh giá khả năng nghe và đọc tiếng
              Anh.
            </p>
            <p>
              Làm bài thi TOEIC® trực tuyến để làm quen với cấu trúc của bài thi
              thật.
            </p>
            <h3>3.2. Đối tượng tham gia kỳ thi TOEIC® là ai?</h3>
            <p>
              Nhiều công ty, tập đoàn và tổ chức giáo dục trên thế giới sử dụng
              bài thi TOEIC® Nghe và Đọc để đánh giá trình độ sử dụng tiếng Anh
              của sinh viên và các chuyên gia kinh doanh.
            </p>
            <p>
              Trên website TOEIC® Test Pro, chúng tôi đưa ra nhiều bài thi thử
              TOEIC® trực tuyến phù hợp với trình độ của bạn. Sau mỗi bài kiểm
              tra đều có đáp án và giải thích rõ ràng.{" "}
            </p>
            <p>Đối tượng tham gia kỳ thi TOEIC® bao gồm:</p>
            <p>
              - Nhân viên làm việc tại khách sạn, bệnh viện, nhà hàng hoặc tham
              gia hội họp, hội nghị quốc tế và có nhu cầu sử dụng tiếng Anh
              thường xuyên.
            </p>
            <p>
              - Cá nhân làm việc ở các vị trí quản lý, kinh doanh và kỹ thuật
              trong lĩnh vực kinh doanh quốc tế, thương mại và công nghiệp cần
              sử dụng tiếng Anh để giao tiếp với đồng nghiệp.
            </p>
            <p>- Nhân viên tham gia vào thị trường việc làm nước ngoài.</p>
            <p>
              Cách tốt nhất để đạt chứng chỉ TOEIC® là luyện thi thử TOEIC®
              online.
            </p>
            <h3>
              3.3. Tại sao trong kỳ thi TOEIC® thí sinh chỉ được dùng bút chì?
            </h3>
            <p>
              Đây là tiêu chuẩn của kỳ thi TOEIC®. Thí sinh chỉ được phép sử
              dụng bút chì để điền đáp án vào phiếu trả lời. Điều này đảm bảo
              tính chính xác trong quá trình chấm điểm.
            </p>
            <p>
              Không được phép sử dụng các loại bút khác như bút bi vì chúng có
              thể khiến cho câu trả lời bị nhòe và gây ra lỗi khi quét. Bên cạnh
              đó, việc sử dụng bút chì sẽ giúp bạn dễ dàng thay đổi đáp án.{" "}
            </p>
            <p>
              Hơn nữa, tính bảo mật cũng là một lý do tại sao thí sinh tham dự
              kỳ thi TOEIC® được yêu cầu chỉ sử dụng bút chì. Các sự cố an ninh
              trong quá khứ đã chứng minh rằng tài liệu có thể mang được vào
              phòng thi cũng như đềthi có thể mang được ra khỏi phòng thi.
            </p>
            <p>
              Trước khi bắt đầu làm bài kiểm tra, bạn sẽ được phát một cây bút
              chì và một cục tẩy.
            </p>
            <h3>3.4. Tại sao đề thi TOEIC® và đáp án không được công bố?</h3>
            <p>
              Một số bài thi TOEIC® được sử dụng lại nhiều lần và do đó phải
              luôn được bảo mật một cách cẩn thận. Nếu đề thi và đáp án bị tiết
              lộ, kỳ thi sẽ mất đi tính bảo mật.
            </p>
            <p>
              Hơn nữa, các đề thi TOEIC® và đáp án thuộc bản quyền của Viện Khảo
              thí giáo dục Hoa Kỳ, do đó chúng không được tiết lộ hoặc sử dụng
              cho bất kỳ mục đích nào mà không có sự cho phép của Viện Khảo thí
              giáo dục Hoa Kỳ.
            </p>
            <h3>3.5. Chứng chỉ TOEIC® có hiệu lực trong bao lâu?</h3>
            <p>
              Chứng chỉ TOEIC® có giá trị trong hai năm. Điểm thi TOEIC® đánh
              giá khả năng tiếng Anh của bạn tại thời điểm bạn tham gia kỳ thi.
              Vì trình độ tiếng Anh của bạn có thể được cải thiện hoặc kém đi
              theo thời gian nên chứng chỉ TOEIC® sẽ không được cấp lại sau 2
              năm kể từ ngày thi.{" "}
            </p>
          </div>
          <div className="cre">Nguồn tham khảo từ EStudy Toeic-Test Pro</div>
        </div>
        <input className="expand-btn" type="checkbox" />
      </div>
    </div>
  );
}

export default Intro;
