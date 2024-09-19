import Home from "../Component/Home/Home";
import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithCustom } from "../constant/testConst";
import CourseHome from "../Component/Home/CourseHome/CourseHome";
import fetchMock from "fetch-mock";

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
describe("Home", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("Home Element", () => {
    renderWithCustom(<Home />);

    const about = screen.getByText(/Nền Tảng Luyện Thi TOEIC/i);
    expect(about).toBeInTheDocument();

    const intro = screen.getByText(/Tổng Quan Về Bài Thi TOEIC/i);
    expect(intro).toBeInTheDocument();

    const test = screen.getByText(/Các Đề Thi Thử Bám Sát Thực Tế/i);
    expect(test).toBeInTheDocument();
  });

  test("Intro Navigate", () => {
    renderWithCustom(<Home />);

    const test = screen.getByText(
      /Cung cấp các đề thi thử toàn phần và từng phần/i
    );
    expect(test).toBeInTheDocument();

    const course = screen.getByText(/các lesson ngữ pháp/i);
    expect(course).toBeInTheDocument();

    const vocab = screen.getByText(/từ vựng về các chủ đề/i);
    expect(vocab).toBeInTheDocument();

    fireEvent.click(course);
    expect(window.location.href).toContain("courses");

    fireEvent.click(vocab);
    expect(window.location.href).toContain("practice-vocabulary");

    fireEvent.click(test);
    expect(window.location.href).toContain("test");
  });

  test("Home Course", async () => {
    fetchMock.get(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`,
      {
        status: 200,
        body: mockCourses,
      }
    );
    renderWithCustom(<Home />);

    const test = await screen.findByText(/Các Khóa Học Của VictoryU/i);
    expect(test).toBeInTheDocument();

    const toeiclBasicElement = await screen.findByText("TOEIC BASIC");
    expect(toeiclBasicElement).toBeInTheDocument();

    const advancedGrammarElement = await screen.findByText("ADVANCED GRAMMAR");
    expect(advancedGrammarElement).toBeInTheDocument();

    const basicGrammarElement = await screen.findByText("BASIC GRAMMAR");
    expect(basicGrammarElement).toBeInTheDocument();
  });

  test("Course Navigate", async () => {
    fetchMock.get(
      `${process.env.REACT_APP_API_BASE_URL ?? "/api"}/Course/GetAllCourses`,
      {
        status: 200,
        body: mockCourses,
      }
    );

    renderWithCustom(<CourseHome />);

    const courseItem = await screen.findByText("ADVANCED GRAMMAR");
    fireEvent.click(courseItem);
    expect(window.location.href).toContain(
      "9f6dfe05-743e-4c75-a5e0-517ef47d5e0c"
    );
  });
});
