import { useNavigate } from "react-router-dom";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fetchMock from "fetch-mock";
import { UserProviderTest } from "../constant/testConst";
import CourseLessons from "../Component/Courses/CourseLessons";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mockLesson = [
  {
    idLesson: "fbb34767-d4d2-48ec-887a-1c0ccf8e5b98",
    idCourse: "6e778ced-ec5c-48ef-bfac-56b6cd72175f",
    title: "Part 2: Hỏi-đáp",
    isVip: false,
  },
  {
    idLesson: "64d4c3a5-52d7-4120-81b7-14d2d02e3f7f",
    idCourse: "6e778ced-ec5c-48ef-bfac-56b6cd72175f",
    title: "Part 4: Bài nói ngắn",
    isVip: false,
  },
  {
    idLesson: "a53b51e8-f4d8-4964-9f75-6849a03a9c19",
    idCourse: "6e778ced-ec5c-48ef-bfac-56b6cd72175f",
    title: "Part 6: Hoàn thành đoạn văn",
    isVip: false,
  },
];

const mockCourses = [
  {
    idCourse: "9f6dfe05-743e-4c75-a5e0-517ef47d5e0c",
    idRoadMap: null,
    name: "ADVANCED GRAMMAR",
    description: "Khóa học ngữ pháp nâng cao",
    isVip: true,
  },
  {
    idCourse: "6e778ced-ec5c-48ef-bfac-56b6cd72175f",
    idRoadMap: null,
    name: "TOEIC BASIC",
    description:
      "Khóa học căn bản giúp học viên hiểu về cấu trúc đề thi cũng như cách làm của từng part cập nhật",
    isVip: false,
  },
  {
    idCourse: "1aeb7d2d-b809-45ae-bff2-83f1c143a2f5",
    idRoadMap: null,
    name: "BASIC GRAMMAR",
    description: "Khóa học ngữ pháp căn bản cho người mất gốc.",
    isVip: false,
  },
];

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("CourseLessons component", () => {
  beforeEach(() => {
    fetchMock.reset();
    fetchMock.get(
      `${
        process.env.REACT_APP_API_BASE_URL ?? "/api"
      }/Lesson/GetAllLessonByCourse/${mockCourses[1].idCourse}`,
      {
        status: 200,
        body: mockLesson,
      }
    );

    fetchMock.get(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`,
      {
        status: 200,
        body: mockCourses,
      }
    );
  });

  test("Render lessons", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter
          initialEntries={[`/course-lessons/${mockCourses[1].idCourse}`]}
        >
          <Routes>
            <Route path="/course-lessons/:id" element={<CourseLessons />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    await waitFor(() => {
      const title = screen.getByText(mockCourses[1].name);
      expect(title).toBeInTheDocument();
    });
  });

  test("Render other course", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter
          initialEntries={[`/course-lessons/${mockCourses[0].idCourse}`]}
        >
          <Routes>
            <Route path="/course-lessons/:id" element={<CourseLessons />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    await waitFor(() => {
      const title = screen.getByText(/Các khóa học khác/i);
      expect(title).toBeInTheDocument();
    });
    await waitFor(() => {
      const otherCourse = screen.getByText(mockCourses[2].name);
      expect(otherCourse).toBeInTheDocument();
    });
  });

  test("Navigate Lesson", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter
          initialEntries={[`/course-lessons/${mockCourses[1].idCourse}`]}
        >
          <Routes>
            <Route path="/course-lessons/:id" element={<CourseLessons />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    const otherCourse = await screen.findByText(mockLesson[0].title);
    fireEvent.click(otherCourse);
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `/lesson/${mockLesson[0].idLesson}`
    );
  });

  test("Navigate Course", async () => {
    render(
      <UserProviderTest>
        <MemoryRouter
          initialEntries={[`/course-lessons/${mockCourses[0].idCourse}`]}
        >
          <Routes>
            <Route path="/course-lessons/:id" element={<CourseLessons />} />
          </Routes>
        </MemoryRouter>
      </UserProviderTest>
    );

    const otherCourse = await screen.findByText(mockCourses[1].name);
    fireEvent.click(otherCourse);

    const course = screen.getByTestId("course-title");
    expect(course).toHaveTextContent(mockCourses[1].name);
  });
});
