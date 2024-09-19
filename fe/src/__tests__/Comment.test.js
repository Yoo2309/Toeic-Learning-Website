import React from "react";
import { screen } from "@testing-library/react";
import fetchMock from "fetch-mock";
import Comment from "../Component/Courses/Lessons/Comment/Comment";
import { renderWithUserRole } from "../constant/testConst";

const mockComments = [
  {
    firstComment: {
      idComment: "08defb84-fc1f-4a8e-e3a4-08dc7c66a346",
      idLesson: "13439918-544b-4a3e-a803-2b7184d564a4",
      idUser: "d8e8141d-844e-4000-ba4a-b94caeae66ee",
      username: "dutran",
      imageURL:
        "https://res.cloudinary.com/dru8wcmtb/image/upload/v1703600100/jxk8iycdyag5jrmygacq.jpg",
      idCommentReply: null,
      content: "bài học hữu ích, cảm ơn",
      createdDate: "5/25/2024 2:58:49 AM",
      isDeleted: false,
    },
    secondComments: [],
  },
];
describe("Comment component", () => {
  beforeEach(() => {
    fetchMock.reset();
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Comment/GetComment?idLesson=${mockComments[0].firstComment.idLesson}`,
      {
        status: 200,
        body: mockComments,
      }
    );
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Authen/GetProfile?id=12345`,
      {
        status: 200,
        body: {
          username: "testUser",
          idUser: "12345",
          auth: true,
          role: "Student",
          token: "mockToken",
          ava: "https://img.icons8.com/ios/100/user-male-circle--v1.png",
        },
      }
    );
  });

  it("Comment element", async () => {
    renderWithUserRole(<Comment id={mockComments[0].firstComment.idLesson} />);
    const cmt = await screen.findByText(mockComments[0].firstComment.content);
    expect(cmt).toBeInTheDocument();
  });

  it("renders comments", async () => {
    renderWithUserRole(<Comment id={mockComments[0].firstComment.idLesson} />);
    const cmt = await screen.findAllByTestId("comment-item");
    expect(cmt.length).toBe(1);
  });
});
